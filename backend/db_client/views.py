from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from django.db import connection
from django.conf import settings
from django.core.exceptions import PermissionDenied
import json
import re
import traceback
import logging
from datetime import datetime

logger = logging.getLogger(__name__)


class DatabaseClientViewSet(viewsets.ViewSet):
    """
    Database Client ViewSet for viewing database tables and schema
    Read-only access to database structure
    """
    permission_classes = [IsAuthenticated, IsAdminUser]  # Only admins can access
    
    def list(self, request):
        """
        List all database tables with metadata
        """
        try:
            logger.info(f"Database client list request from user: {request.user}")
            with connection.cursor() as cursor:
                # Get database engine type
                db_engine = settings.DATABASES['default']['ENGINE']
                is_sqlite = 'sqlite3' in db_engine
                is_postgres = 'postgresql' in db_engine
                is_mysql = 'mysql' in db_engine
                
                tables = []
                
                if is_sqlite:
                    # SQLite: Get all tables
                    cursor.execute("""
                        SELECT name 
                        FROM sqlite_master 
                        WHERE type='table' 
                        AND name NOT LIKE 'sqlite_%'
                        ORDER BY name
                    """)
                    table_names = [row[0] for row in cursor.fetchall()]
                    
                    # Get row counts and additional info
                    for table_name in table_names:
                        try:
                            cursor.execute(f"SELECT COUNT(*) FROM {table_name}")
                            row_count = cursor.fetchone()[0]
                            
                            # Get table info
                            cursor.execute(f"PRAGMA table_info({table_name})")
                            columns_info = cursor.fetchall()
                            column_count = len(columns_info)
                            
                            tables.append({
                                'name': table_name,
                                'row_count': row_count,
                                'column_count': column_count,
                                'type': 'table',
                                'database': str(settings.DATABASES['default']['NAME'])
                            })
                        except Exception as e:
                            # Skip tables that can't be accessed
                            continue
                            
                elif is_postgres:
                    # PostgreSQL: Get all tables from information_schema
                    cursor.execute("""
                        SELECT table_name, 
                               (SELECT COUNT(*) FROM information_schema.columns 
                                WHERE table_name = t.table_name 
                                AND table_schema = 'public') as column_count
                        FROM information_schema.tables t
                        WHERE table_schema = 'public' 
                        AND table_type = 'BASE TABLE'
                        ORDER BY table_name
                    """)
                    
                    for row in cursor.fetchall():
                        table_name = row[0]
                        column_count = row[1]
                        
                        # Get row count
                        try:
                            cursor.execute(f'SELECT COUNT(*) FROM "{table_name}"')
                            row_count = cursor.fetchone()[0]
                        except:
                            row_count = 0
                        
                        tables.append({
                            'name': table_name,
                            'row_count': row_count,
                            'column_count': column_count,
                            'type': 'table',
                            'database': str(settings.DATABASES['default']['NAME'])
                        })
                        
                elif is_mysql:
                    # MySQL: Get all tables
                    db_name = settings.DATABASES['default']['NAME']
                    cursor.execute(f"""
                        SELECT TABLE_NAME,
                               (SELECT COUNT(*) FROM information_schema.COLUMNS 
                                WHERE TABLE_SCHEMA = '{db_name}' 
                                AND TABLE_NAME = t.TABLE_NAME) as column_count
                        FROM information_schema.TABLES t
                        WHERE TABLE_SCHEMA = '{db_name}' 
                        AND TABLE_TYPE = 'BASE TABLE'
                        ORDER BY TABLE_NAME
                    """)
                    
                    for row in cursor.fetchall():
                        table_name = row[0]
                        column_count = row[1]
                        
                        # Get row count
                        try:
                            cursor.execute(f'SELECT COUNT(*) FROM `{table_name}`')
                            row_count = cursor.fetchone()[0]
                        except:
                            row_count = 0
                        
                        tables.append({
                            'name': table_name,
                            'row_count': row_count,
                            'column_count': column_count,
                            'type': 'table',
                            'database': db_name
                        })
                
                # Get database stats
                total_tables = len(tables)
                total_rows = sum(t['row_count'] for t in tables)
                total_columns = sum(t['column_count'] for t in tables)
                
                db_name = settings.DATABASES['default']['NAME']
                
                return Response({
                    'tables': tables,
                    'stats': {
                        'total_tables': total_tables,
                        'total_rows': total_rows,
                        'total_columns': total_columns,
                        'database_name': str(db_name),
                        'database_engine': db_engine.split('.')[-1] if '.' in db_engine else db_engine
                    }
                })
                
        except Exception as e:
            error_trace = traceback.format_exc()
            logger.error(f"Error fetching database tables: {str(e)}\n{error_trace}")
            return Response(
                {'error': f'Error fetching database tables: {str(e)}', 'traceback': error_trace if settings.DEBUG else None},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
    
    @action(detail=False, methods=['get'])
    def schema(self, request):
        """
        Get schema information for a specific table
        """
        table_name = request.query_params.get('table')
        if not table_name:
            return Response(
                {'error': 'Table name is required'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        try:
            with connection.cursor() as cursor:
                db_engine = settings.DATABASES['default']['ENGINE']
                is_sqlite = 'sqlite3' in db_engine
                is_postgres = 'postgresql' in db_engine
                is_mysql = 'mysql' in db_engine
                
                columns = []
                indexes = []
                foreign_keys = []
                
                if is_sqlite:
                    # Get column information
                    cursor.execute(f"PRAGMA table_info({table_name})")
                    columns_info = cursor.fetchall()
                    
                    for col in columns_info:
                        col_id, col_name, col_type, not_null, default_val, pk = col
                        columns.append({
                            'name': col_name,
                            'type': col_type,
                            'not_null': bool(not_null),
                            'default': default_val,
                            'primary_key': bool(pk),
                            'position': col_id
                        })
                    
                    # Get indexes
                    cursor.execute(f"PRAGMA index_list({table_name})")
                    indexes_info = cursor.fetchall()
                    
                    for idx in indexes_info:
                        idx_name, unique = idx[1], bool(idx[2])
                        cursor.execute(f"PRAGMA index_info({idx_name})")
                        idx_columns = [row[2] for row in cursor.fetchall()]
                        indexes.append({
                            'name': idx_name,
                            'unique': unique,
                            'columns': idx_columns
                        })
                    
                    # Get foreign keys
                    cursor.execute(f"PRAGMA foreign_key_list({table_name})")
                    fk_info = cursor.fetchall()
                    
                    for fk in fk_info:
                        foreign_keys.append({
                            'from_column': fk[3],
                            'to_table': fk[2],
                            'to_column': fk[4]
                        })
                        
                elif is_postgres:
                    # PostgreSQL: Get column information
                    cursor.execute("""
                        SELECT 
                            column_name,
                            data_type,
                            character_maximum_length,
                            is_nullable,
                            column_default,
                            ordinal_position
                        FROM information_schema.columns
                        WHERE table_name = %s
                        AND table_schema = 'public'
                        ORDER BY ordinal_position
                    """, [table_name])
                    
                    col_positions = {}
                    for idx, col in enumerate(cursor.fetchall()):
                        col_name, data_type, max_length, is_nullable, default_val, pos = col
                        col_positions[col_name] = idx
                        columns.append({
                            'name': col_name,
                            'type': data_type + (f'({max_length})' if max_length else ''),
                            'not_null': is_nullable == 'NO',
                            'default': default_val,
                            'primary_key': False,  # Will be updated below
                            'position': pos
                        })
                    
                    # Get primary keys
                    cursor.execute("""
                        SELECT column_name
                        FROM information_schema.table_constraints tc
                        JOIN information_schema.key_column_usage kcu
                        ON tc.constraint_name = kcu.constraint_name
                        WHERE tc.table_name = %s
                        AND tc.constraint_type = 'PRIMARY KEY'
                        AND tc.table_schema = 'public'
                    """, [table_name])
                    
                    pk_columns = [row[0] for row in cursor.fetchall()]
                    for col in columns:
                        if col['name'] in pk_columns:
                            col['primary_key'] = True
                    
                    # Get indexes
                    cursor.execute("""
                        SELECT 
                            indexname,
                            indexdef
                        FROM pg_indexes
                        WHERE tablename = %s
                        AND schemaname = 'public'
                    """, [table_name])
                    
                    for idx in cursor.fetchall():
                        indexes.append({
                            'name': idx[0],
                            'definition': idx[1],
                            'unique': 'UNIQUE' in idx[1].upper()
                        })
                    
                    # Get foreign keys
                    cursor.execute("""
                        SELECT
                            kcu.column_name,
                            ccu.table_name AS foreign_table_name,
                            ccu.column_name AS foreign_column_name
                        FROM information_schema.table_constraints AS tc
                        JOIN information_schema.key_column_usage AS kcu
                        ON tc.constraint_name = kcu.constraint_name
                        JOIN information_schema.constraint_column_usage AS ccu
                        ON ccu.constraint_name = tc.constraint_name
                        WHERE tc.constraint_type = 'FOREIGN KEY'
                        AND tc.table_name = %s
                        AND tc.table_schema = 'public'
                    """, [table_name])
                    
                    for fk in cursor.fetchall():
                        foreign_keys.append({
                            'from_column': fk[0],
                            'to_table': fk[1],
                            'to_column': fk[2]
                        })
                        
                elif is_mysql:
                    # MySQL: Get column information
                    db_name = settings.DATABASES['default']['NAME']
                    cursor.execute("""
                        SELECT 
                            COLUMN_NAME,
                            DATA_TYPE,
                            CHARACTER_MAXIMUM_LENGTH,
                            IS_NULLABLE,
                            COLUMN_DEFAULT,
                            ORDINAL_POSITION,
                            COLUMN_KEY,
                            EXTRA
                        FROM information_schema.COLUMNS
                        WHERE TABLE_SCHEMA = %s
                        AND TABLE_NAME = %s
                        ORDER BY ORDINAL_POSITION
                    """, [db_name, table_name])
                    
                    for col in cursor.fetchall():
                        col_name, data_type, max_length, is_nullable, default_val, pos, col_key, extra = col
                        columns.append({
                            'name': col_name,
                            'type': data_type + (f'({max_length})' if max_length else ''),
                            'not_null': is_nullable == 'NO',
                            'default': default_val,
                            'primary_key': col_key == 'PRI',
                            'position': pos,
                            'extra': extra
                        })
                    
                    # Get indexes
                    cursor.execute(f"SHOW INDEX FROM `{table_name}`")
                    indexes_dict = {}
                    for idx in cursor.fetchall():
                        idx_name = idx[2]
                        if idx_name not in indexes_dict:
                            indexes_dict[idx_name] = {
                                'name': idx_name,
                                'unique': not bool(idx[1]),
                                'columns': []
                            }
                        indexes_dict[idx_name]['columns'].append(idx[4])
                    
                    indexes = list(indexes_dict.values())
                    
                    # Get foreign keys
                    cursor.execute("""
                        SELECT 
                            COLUMN_NAME,
                            REFERENCED_TABLE_NAME,
                            REFERENCED_COLUMN_NAME
                        FROM information_schema.KEY_COLUMN_USAGE
                        WHERE TABLE_SCHEMA = %s
                        AND TABLE_NAME = %s
                        AND REFERENCED_TABLE_NAME IS NOT NULL
                    """, [db_name, table_name])
                    
                    for fk in cursor.fetchall():
                        foreign_keys.append({
                            'from_column': fk[0],
                            'to_table': fk[1],
                            'to_column': fk[2]
                        })
                
                # Get row count
                try:
                    if is_sqlite:
                        cursor.execute(f"SELECT COUNT(*) FROM {table_name}")
                    elif is_postgres:
                        cursor.execute(f'SELECT COUNT(*) FROM "{table_name}"')
                    elif is_mysql:
                        cursor.execute(f'SELECT COUNT(*) FROM `{table_name}`')
                    row_count = cursor.fetchone()[0]
                except:
                    row_count = 0
                
                return Response({
                    'table_name': table_name,
                    'columns': columns,
                    'indexes': indexes,
                    'foreign_keys': foreign_keys,
                    'row_count': row_count,
                    'column_count': len(columns)
                })
                
        except Exception as e:
            return Response(
                {'error': f'Error fetching table schema: {str(e)}'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
    
    @action(detail=False, methods=['get'])
    def preview(self, request):
        """
        Get preview of table data (first 100 rows, read-only)
        """
        table_name = request.query_params.get('table')
        limit = int(request.query_params.get('limit', 100))
        
        if not table_name:
            return Response(
                {'error': 'Table name is required'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        if limit > 1000:  # Safety limit
            limit = 1000
        
        try:
            with connection.cursor() as cursor:
                db_engine = settings.DATABASES['default']['ENGINE']
                is_sqlite = 'sqlite3' in db_engine
                is_postgres = 'postgresql' in db_engine
                is_mysql = 'mysql' in db_engine
                
                # Get column names first
                if is_sqlite:
                    cursor.execute(f"PRAGMA table_info({table_name})")
                    columns = [row[1] for row in cursor.fetchall()]
                    cursor.execute(f"SELECT * FROM {table_name} LIMIT {limit}")
                elif is_postgres:
                    cursor.execute(f'SELECT * FROM "{table_name}" LIMIT {limit}')
                    columns = [desc[0] for desc in cursor.description]
                elif is_mysql:
                    cursor.execute(f'SELECT * FROM `{table_name}` LIMIT {limit}')
                    columns = [desc[0] for desc in cursor.description]
                
                rows = cursor.fetchall()
                
                # Convert rows to dictionaries
                data = []
                for row in rows:
                    row_dict = {}
                    for idx, col_name in enumerate(columns):
                        value = row[idx]
                        # Handle None, datetime, and other types
                        if value is None:
                            row_dict[col_name] = None
                        elif hasattr(value, 'isoformat'):  # datetime objects
                            row_dict[col_name] = value.isoformat()
                        else:
                            row_dict[col_name] = str(value)
                    data.append(row_dict)
                
                return Response({
                    'table_name': table_name,
                    'columns': columns,
                    'data': data,
                    'count': len(data),
                    'limit': limit
                })
                
        except Exception as e:
            return Response(
                {'error': f'Error fetching table data: {str(e)}'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
    
    @action(detail=False, methods=['post'])
    def execute_query(self, request):
        """
        Execute a SELECT query (read-only for security)
        """
        query = request.data.get('query', '').strip()
        if not query:
            return Response(
                {'error': 'Query is required'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Security: Only allow SELECT queries
        query_upper = query.upper().strip()
        if not query_upper.startswith('SELECT'):
            return Response(
                {'error': 'Only SELECT queries are allowed for security reasons'},
                status=status.HTTP_403_FORBIDDEN
            )
        
        # Additional security: Check for dangerous keywords
        dangerous_keywords = ['DROP', 'DELETE', 'UPDATE', 'INSERT', 'ALTER', 'CREATE', 'TRUNCATE', 'EXEC', 'EXECUTE']
        if any(keyword in query_upper for keyword in dangerous_keywords):
            return Response(
                {'error': 'Query contains prohibited keywords. Only SELECT queries are allowed.'},
                status=status.HTTP_403_FORBIDDEN
            )
        
        try:
            with connection.cursor() as cursor:
                cursor.execute(query)
                
                # Get column names
                columns = [desc[0] for desc in cursor.description] if cursor.description else []
                
                # Fetch results (limit to 1000 rows for performance)
                rows = cursor.fetchmany(1000)
                
                # Convert rows to dictionaries
                data = []
                for row in rows:
                    row_dict = {}
                    for idx, col_name in enumerate(columns):
                        value = row[idx]
                        if value is None:
                            row_dict[col_name] = None
                        elif hasattr(value, 'isoformat'):  # datetime objects
                            row_dict[col_name] = value.isoformat()
                        else:
                            row_dict[col_name] = str(value)
                    data.append(row_dict)
                
                return Response({
                    'columns': columns,
                    'data': data,
                    'row_count': len(data),
                    'query': query,
                    'execution_time': 'N/A',  # Could add timing if needed
                })
                
        except Exception as e:
            return Response(
                {'error': f'Query execution error: {str(e)}'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
    
    @action(detail=False, methods=['post'])
    def explain_query(self, request):
        """
        Execute EXPLAIN query to get query execution plan
        """
        query = request.data.get('query', '').strip()
        if not query:
            return Response(
                {'error': 'Query is required'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Security: Only allow SELECT queries
        query_upper = query.upper().strip()
        if not query_upper.startswith('SELECT'):
            return Response(
                {'error': 'Only SELECT queries can be explained'},
                status=status.HTTP_403_FORBIDDEN
            )
        
        # Additional security: Check for dangerous keywords
        dangerous_keywords = ['DROP', 'DELETE', 'UPDATE', 'INSERT', 'ALTER', 'CREATE', 'TRUNCATE', 'EXEC', 'EXECUTE']
        if any(keyword in query_upper for keyword in dangerous_keywords):
            return Response(
                {'error': 'Query contains prohibited keywords. Only SELECT queries are allowed.'},
                status=status.HTTP_403_FORBIDDEN
            )
        
        try:
            with connection.cursor() as cursor:
                db_engine = settings.DATABASES['default']['ENGINE']
                is_sqlite = 'sqlite3' in db_engine
                is_postgres = 'postgresql' in db_engine
                is_mysql = 'mysql' in db_engine
                
                # Execute EXPLAIN query based on database type
                if is_sqlite:
                    explain_query = f"EXPLAIN QUERY PLAN {query}"
                elif is_postgres:
                    explain_query = f"EXPLAIN ANALYZE {query}"
                elif is_mysql:
                    explain_query = f"EXPLAIN {query}"
                else:
                    return Response(
                        {'error': 'EXPLAIN not supported for this database engine'},
                        status=status.HTTP_400_BAD_REQUEST
                    )
                
                cursor.execute(explain_query)
                
                # Get column names
                columns = [desc[0] for desc in cursor.description] if cursor.description else []
                
                # Fetch all rows
                rows = cursor.fetchall()
                
                # Convert rows to dictionaries
                data = []
                for row in rows:
                    row_dict = {}
                    for idx, col_name in enumerate(columns):
                        value = row[idx]
                        if value is None:
                            row_dict[col_name] = None
                        elif hasattr(value, 'isoformat'):  # datetime objects
                            row_dict[col_name] = value.isoformat()
                        else:
                            row_dict[col_name] = str(value)
                    data.append(row_dict)
                
                return Response({
                    'columns': columns,
                    'data': data,
                    'plan_type': 'sqlite' if is_sqlite else 'postgres' if is_postgres else 'mysql',
                    'query': query,
                })
                
        except Exception as e:
            return Response(
                {'error': f'EXPLAIN query execution error: {str(e)}'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
    
    @action(detail=False, methods=['get'])
    def views(self, request):
        """
        Get all database views
        """
        try:
            with connection.cursor() as cursor:
                db_engine = settings.DATABASES['default']['ENGINE']
                is_sqlite = 'sqlite3' in db_engine
                is_postgres = 'postgresql' in db_engine
                is_mysql = 'mysql' in db_engine
                
                views = []
                
                if is_sqlite:
                    cursor.execute("""
                        SELECT name 
                        FROM sqlite_master 
                        WHERE type='view'
                        ORDER BY name
                    """)
                    view_names = [row[0] for row in cursor.fetchall()]
                    for view_name in view_names:
                        views.append({'name': view_name, 'type': 'view'})
                        
                elif is_postgres:
                    cursor.execute("""
                        SELECT table_name
                        FROM information_schema.views
                        WHERE table_schema = 'public'
                        ORDER BY table_name
                    """)
                    for row in cursor.fetchall():
                        views.append({'name': row[0], 'type': 'view'})
                        
                elif is_mysql:
                    db_name = settings.DATABASES['default']['NAME']
                    cursor.execute(f"""
                        SELECT TABLE_NAME
                        FROM information_schema.VIEWS
                        WHERE TABLE_SCHEMA = '{db_name}'
                        ORDER BY TABLE_NAME
                    """)
                    for row in cursor.fetchall():
                        views.append({'name': row[0], 'type': 'view'})
                
                return Response({'views': views})
                
        except Exception as e:
            return Response(
                {'error': f'Error fetching views: {str(e)}'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
    
    @action(detail=False, methods=['get'])
    def database_info(self, request):
        """
        Get comprehensive database information and statistics
        """
        try:
            logger.info(f"Database info request from user: {request.user}")
            with connection.cursor() as cursor:
                db_engine = settings.DATABASES['default']['ENGINE']
                db_name = settings.DATABASES['default']['NAME']
                is_sqlite = 'sqlite3' in db_engine
                is_postgres = 'postgresql' in db_engine
                is_mysql = 'mysql' in db_engine
                
                logger.info(f"Database engine: {db_engine}, Name: {db_name}, is_sqlite: {is_sqlite}")
                
                info = {
                    'database_name': str(db_name),
                    'engine': db_engine.split('.')[-1] if '.' in db_engine else db_engine,
                    'version': 'Unknown',
                    'server_info': {},
                    'performance': {},
                }
                
                if is_sqlite:
                    try:
                        cursor.execute("SELECT sqlite_version()")
                        result = cursor.fetchone()
                        info['version'] = result[0] if result else 'Unknown'
                        info['engine'] = 'SQLite'
                    except Exception as e:
                        logger.error(f"Error getting SQLite version: {str(e)}")
                        info['version'] = 'Unknown'
                        info['engine'] = 'SQLite'
                    
                elif is_postgres:
                    try:
                        cursor.execute("SELECT version()")
                        version = cursor.fetchone()[0]
                        info['version'] = version.split(',')[0] if version else 'Unknown'
                        info['engine'] = 'PostgreSQL'
                        
                        # Get connection info
                        cursor.execute("SELECT count(*) FROM pg_stat_activity WHERE state = 'active'")
                        info['performance']['active_connections'] = cursor.fetchone()[0]
                    except Exception as e:
                        logger.error(f"Error getting PostgreSQL info: {str(e)}")
                        
                elif is_mysql:
                    try:
                        cursor.execute("SELECT VERSION()")
                        info['version'] = cursor.fetchone()[0]
                        info['engine'] = 'MySQL'
                        
                        # Get connection info
                        cursor.execute("SHOW STATUS LIKE 'Threads_connected'")
                        result = cursor.fetchone()
                        if result:
                            info['performance']['active_connections'] = result[1]
                    except Exception as e:
                        logger.error(f"Error getting MySQL info: {str(e)}")
                
                return Response(info)
                
        except Exception as e:
            error_trace = traceback.format_exc()
            logger.error(f"Error fetching database info: {str(e)}\n{error_trace}")
            return Response(
                {'error': f'Error fetching database info: {str(e)}', 'traceback': error_trace if settings.DEBUG else None},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
    
    @action(detail=False, methods=['get'])
    def relationships(self, request):
        """
        Get all table relationships for ER diagram
        """
        try:
            with connection.cursor() as cursor:
                db_engine = settings.DATABASES['default']['ENGINE']
                is_sqlite = 'sqlite3' in db_engine
                is_postgres = 'postgresql' in db_engine
                is_mysql = 'mysql' in db_engine
                
                relationships = []
                
                if is_sqlite:
                    # Get all tables
                    cursor.execute("""
                        SELECT name 
                        FROM sqlite_master 
                        WHERE type='table' 
                        AND name NOT LIKE 'sqlite_%'
                    """)
                    tables = [row[0] for row in cursor.fetchall()]
                    
                    for table in tables:
                        cursor.execute(f"PRAGMA foreign_key_list({table})")
                        fks = cursor.fetchall()
                        for fk in fks:
                            relationships.append({
                                'from_table': table,
                                'from_column': fk[3],
                                'to_table': fk[2],
                                'to_column': fk[4],
                                'on_update': fk[5],
                                'on_delete': fk[6],
                            })
                            
                elif is_postgres:
                    cursor.execute("""
                        SELECT
                            tc.table_name AS from_table,
                            kcu.column_name AS from_column,
                            ccu.table_name AS to_table,
                            ccu.column_name AS to_column,
                            rc.update_rule AS on_update,
                            rc.delete_rule AS on_delete
                        FROM information_schema.table_constraints AS tc
                        JOIN information_schema.key_column_usage AS kcu
                        ON tc.constraint_name = kcu.constraint_name
                        JOIN information_schema.constraint_column_usage AS ccu
                        ON ccu.constraint_name = tc.constraint_name
                        JOIN information_schema.referential_constraints AS rc
                        ON rc.constraint_name = tc.constraint_name
                        WHERE tc.constraint_type = 'FOREIGN KEY'
                        AND tc.table_schema = 'public'
                    """)
                    for row in cursor.fetchall():
                        relationships.append({
                            'from_table': row[0],
                            'from_column': row[1],
                            'to_table': row[2],
                            'to_column': row[3],
                            'on_update': row[4],
                            'on_delete': row[5],
                        })
                        
                elif is_mysql:
                    db_name = settings.DATABASES['default']['NAME']
                    cursor.execute(f"""
                        SELECT
                            TABLE_NAME,
                            COLUMN_NAME,
                            REFERENCED_TABLE_NAME,
                            REFERENCED_COLUMN_NAME,
                            UPDATE_RULE,
                            DELETE_RULE
                        FROM information_schema.KEY_COLUMN_USAGE kcu
                        JOIN information_schema.REFERENTIAL_CONSTRAINTS rc
                        ON kcu.CONSTRAINT_NAME = rc.CONSTRAINT_NAME
                        WHERE kcu.TABLE_SCHEMA = '{db_name}'
                        AND kcu.REFERENCED_TABLE_NAME IS NOT NULL
                    """)
                    for row in cursor.fetchall():
                        relationships.append({
                            'from_table': row[0],
                            'from_column': row[1],
                            'to_table': row[2],
                            'to_column': row[3],
                            'on_update': row[4],
                            'on_delete': row[5],
                        })
                
                return Response({'relationships': relationships})
                
        except Exception as e:
            return Response(
                {'error': f'Error fetching relationships: {str(e)}'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
