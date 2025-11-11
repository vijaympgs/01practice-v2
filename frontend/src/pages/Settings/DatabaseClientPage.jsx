import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  Box,
  Typography,
  Paper,
  Card,
  CardContent,
  Grid,
  CircularProgress,
  TextField,
  InputAdornment,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  ListItemIcon,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tabs,
  Tab,
  IconButton,
  Tooltip,
  Alert,
  Divider,
  alpha,
  useTheme,
  Button,
  TablePagination,
  TableSortLabel,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Badge,
  Stack,
  Toolbar,
  Menu,
  MenuItem,
  Snackbar,
  Dialog,
  DialogTitle,
  DialogContent,
  Checkbox,
  FormControlLabel,
  DialogActions,
  Select,
  InputLabel,
  FormControl,
} from '@mui/material';
import {
  Search as SearchIcon,
  TableChart as TableIcon,
  Refresh as RefreshIcon,
  Visibility as ViewIcon,
  Info as InfoIcon,
  Storage as StorageIcon,
  ViewColumn as ColumnIcon,
  Key as KeyIcon,
  Link as LinkIcon,
  Code as CodeIcon,
  AccountTree as RelationshipIcon,
  ExpandMore as ExpandMoreIcon,
  Schema as SchemaIcon,
  EditNote as QueryIcon,
  ArrowUpward,
  ArrowDownward,
  UnfoldMore as SortIcon,
  FileDownload as DownloadIcon,
  ContentCopy as CopyIcon,
  PlayArrow as ExecuteIcon,
  Clear as ClearIcon,
  FormatAlignLeft as FormatIcon,
  Save as SaveIcon,
  FolderOpen as OpenIcon,
  GetApp as ExportIcon,
  MoreVert as MoreIcon,
  Settings as SettingsIcon,
  ContentPaste as PasteIcon,
  VisibilityOff as VisibilityOffIcon,
  CheckCircle as CheckCircleIcon,
  Error as ErrorIcon,
  Close as CloseIcon,
  Bookmark as BookmarkIcon,
  BookmarkBorder as BookmarkBorderIcon,
  Description as TemplateIcon,
  Insights as ExplainIcon,
  Delete as DeleteIcon,
  Star as StarIcon,
  FilterList as FilterIcon,
  Dashboard as DashboardIcon,
  Timeline as TimelineIcon,
} from '@mui/icons-material';
import dbClientService from '../../services/dbClientService';
import { formatNumber } from '../../utils/formatters';
import { organizeTablesByMenu, getMenuCategoriesOrdered } from '../../utils/tableMenuMapping';
import ERDiagramVisualization from './components/ERDiagramVisualization';

const DatabaseClientPage = () => {
  const theme = useTheme();
  const [tables, setTables] = useState([]);
  const [stats, setStats] = useState(null);
  const [selectedTable, setSelectedTable] = useState(null);
  const [tableSchema, setTableSchema] = useState(null);
  const [tablePreview, setTablePreview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [schemaLoading, setSchemaLoading] = useState(false);
  const [previewLoading, setPreviewLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState(0);
  const [error, setError] = useState(null);
  const [sortConfig, setSortConfig] = useState({ column: null, direction: 'asc' });
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(25);
  const [sqlQuery, setSqlQuery] = useState('');
  const [queryResults, setQueryResults] = useState(null);
  const [queryLoading, setQueryLoading] = useState(false);
  const [queryHistory, setQueryHistory] = useState([]);
  const [databaseInfo, setDatabaseInfo] = useState(null);
  const [relationships, setRelationships] = useState([]);
  const [views, setViews] = useState([]);
  const [expandedCategories, setExpandedCategories] = useState({});
  const [expandedMenuItems, setExpandedMenuItems] = useState({});
  const [showQueryHistory, setShowQueryHistory] = useState(false);
  const [exportMenuAnchor, setExportMenuAnchor] = useState(null);
  const [queryMenuAnchor, setQueryMenuAnchor] = useState(null);
  
  // Phase 1: Toast Notifications
  const [toast, setToast] = useState({ open: false, message: '', severity: 'success' });
  
  // Phase 1: Column Visibility Toggle
  const [visibleColumns, setVisibleColumns] = useState({});
  const [columnVisibilityDialogOpen, setColumnVisibilityDialogOpen] = useState(false);

  // Phase 2: Query Bookmarks
  const [queryBookmarks, setQueryBookmarks] = useState([]);
  const [bookmarkDialogOpen, setBookmarkDialogOpen] = useState(false);
  const [bookmarkName, setBookmarkName] = useState('');
  const [bookmarkDescription, setBookmarkDescription] = useState('');

  // Phase 2: Query Templates
  const [templateDialogOpen, setTemplateDialogOpen] = useState(false);

  // Phase 2: EXPLAIN Query Plan
  const [explainPlan, setExplainPlan] = useState(null);
  const [explainLoading, setExplainLoading] = useState(false);
  const [showExplainPlan, setShowExplainPlan] = useState(false);

  // Phase 2: SQL Autocomplete
  const [autocompleteSuggestions, setAutocompleteSuggestions] = useState([]);
  const [showAutocomplete, setShowAutocomplete] = useState(false);
  const [autocompletePosition, setAutocompletePosition] = useState({ top: 0, left: 0 });
  const [selectedSuggestionIndex, setSelectedSuggestionIndex] = useState(-1);

  // Phase 3: Advanced Data Filtering
  const [dataFilters, setDataFilters] = useState({});
  const [filterDialogOpen, setFilterDialogOpen] = useState(false);
  const [dataSearchText, setDataSearchText] = useState('');
  const [filterColumn, setFilterColumn] = useState('');
  const [filterType, setFilterType] = useState('contains');
  const [filterValue, setFilterValue] = useState('');

  // Phase 3: Query Performance Dashboard
  const [queryPerformanceLog, setQueryPerformanceLog] = useState([]);
  const [performanceDashboardOpen, setPerformanceDashboardOpen] = useState(false);

  // Phase 3: Visual ER Diagram
  const [erDiagramView, setErDiagramView] = useState('table'); // 'table' or 'graph'
  const [selectedDiagramTable, setSelectedDiagramTable] = useState(null);

  useEffect(() => {
    loadTables();
    loadDatabaseInfo();
    loadRelationships();
    loadViews();
    loadQueryBookmarks(); // Phase 2: Load bookmarks from localStorage
  }, []);

  // Phase 2: Load query bookmarks from localStorage
  const loadQueryBookmarks = useCallback(() => {
    try {
      const saved = localStorage.getItem('dbClient_queryBookmarks');
      if (saved) {
        setQueryBookmarks(JSON.parse(saved));
      }
    } catch (err) {
      console.error('Error loading query bookmarks:', err);
    }
  }, []);

  // Phase 2: Save query bookmarks to localStorage
  const saveQueryBookmarks = useCallback((bookmarks) => {
    try {
      localStorage.setItem('dbClient_queryBookmarks', JSON.stringify(bookmarks));
      setQueryBookmarks(bookmarks);
    } catch (err) {
      console.error('Error saving query bookmarks:', err);
    }
  }, []);

  useEffect(() => {
    if (activeTab === 2) {
      loadRelationships();
    }
  }, [activeTab]);

  useEffect(() => {
    if (selectedTable) {
      loadTableSchema(selectedTable);
      if (activeTab === 1) {
        loadTablePreview(selectedTable);
      }
      // Phase 3: Clear filters when table changes
      setDataFilters({});
      setDataSearchText('');
      setPage(0);
    }
  }, [selectedTable, activeTab]);

  // Phase 1: Initialize visible columns when table preview loads
  useEffect(() => {
    if (tablePreview && tablePreview.columns && selectedTable) {
      const tableKey = selectedTable;
      if (!visibleColumns[tableKey]) {
        const allVisible = {};
        tablePreview.columns.forEach(col => {
          allVisible[col] = true;
        });
        setVisibleColumns(prev => ({ ...prev, [tableKey]: allVisible }));
      }
    }
  }, [tablePreview, selectedTable, visibleColumns]);

  const loadTables = async () => {
    try {
      setLoading(true);
      const response = await dbClientService.getTables();
      setTables(response.tables || []);
      setStats(response.stats || null);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to load tables');
      console.error('Error loading tables:', err);
    } finally {
      setLoading(false);
    }
  };

  const loadTableSchema = async (tableName) => {
    try {
      setSchemaLoading(true);
      const response = await dbClientService.getTableSchema(tableName);
      setTableSchema(response);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to load table schema');
      console.error('Error loading schema:', err);
    } finally {
      setSchemaLoading(false);
    }
  };

  const loadTablePreview = async (tableName) => {
    try {
      setPreviewLoading(true);
      const response = await dbClientService.getTablePreview(tableName, rowsPerPage);
      setTablePreview(response);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to load table preview');
      console.error('Error loading preview:', err);
    } finally {
      setPreviewLoading(false);
    }
  };

  const loadDatabaseInfo = async () => {
    try {
      const response = await dbClientService.getDatabaseInfo();
      setDatabaseInfo(response);
    } catch (err) {
      console.error('Error loading database info:', err);
    }
  };

  const loadRelationships = async () => {
    try {
      const response = await dbClientService.getRelationships();
      setRelationships(response.relationships || []);
    } catch (err) {
      console.error('Error loading relationships:', err);
    }
  };

  const loadViews = async () => {
    try {
      const response = await dbClientService.getViews();
      setViews(response.views || []);
    } catch (err) {
      console.error('Error loading views:', err);
    }
  };

  // Phase 1: Toast notification helper
  const showToast = useCallback((message, severity = 'success') => {
    setToast({ open: true, message, severity });
  }, []);

  const handleCloseToast = useCallback(() => {
    setToast(prev => ({ ...prev, open: false }));
  }, []);

  // Phase 3: Track query performance (moved before handleExecuteQuery to avoid initialization error)
  const trackQueryPerformance = useCallback((query, executionTime, rowCount) => {
    const performanceEntry = {
      id: Date.now().toString(),
      query: query.substring(0, 100) + (query.length > 100 ? '...' : ''),
      fullQuery: query,
      executionTime: parseFloat(executionTime),
      rowCount: rowCount || 0,
      timestamp: new Date().toISOString()
    };
    
    setQueryPerformanceLog(prev => {
      const updated = [performanceEntry, ...prev].slice(0, 50); // Keep last 50 queries
      // Save to localStorage
      try {
        localStorage.setItem('dbClient_queryPerformanceLog', JSON.stringify(updated));
      } catch (err) {
        console.error('Error saving query performance log:', err);
      }
      return updated;
    });
  }, []);

  const handleExecuteQuery = useCallback(async () => {
    if (!sqlQuery.trim()) return;
    
    try {
      setQueryLoading(true);
      setError(null);
      const startTime = Date.now();
      const response = await dbClientService.executeQuery(sqlQuery);
      const executionTime = ((Date.now() - startTime) / 1000).toFixed(3) + 's';
      
      // Add execution time to response
      response.execution_time = executionTime;
      setQueryResults(response);
      
      // Add to history
      if (!queryHistory.includes(sqlQuery)) {
        setQueryHistory(prev => [sqlQuery, ...prev].slice(0, 10));
      }
      
      // Phase 1: Show success toast
      showToast(`Query executed successfully in ${executionTime}`, 'success');
      
      // Phase 3: Track query performance
      const executionTimeMs = ((Date.now() - startTime));
      trackQueryPerformance(sqlQuery, executionTimeMs, response.row_count || 0);
    } catch (err) {
      const errorMsg = err.response?.data?.error || 'Query execution failed';
      setError(errorMsg);
      setQueryResults(null);
      // Phase 1: Show error toast
      showToast(errorMsg, 'error');
    } finally {
      setQueryLoading(false);
    }
  }, [sqlQuery, queryHistory, showToast, trackQueryPerformance]);

  // Export query results to CSV
  const handleExportCSV = () => {
    if (!queryResults || !queryResults.data || queryResults.data.length === 0) {
      showToast('No data to export', 'warning');
      return;
    }
    
    const headers = queryResults.columns.join(',');
    const rows = queryResults.data.map(row => 
      queryResults.columns.map(col => {
        const value = row[col];
        // Handle values with commas, quotes, or newlines
        if (value === null || value === undefined) return '';
        const stringValue = String(value);
        if (stringValue.includes(',') || stringValue.includes('"') || stringValue.includes('\n')) {
          return `"${stringValue.replace(/"/g, '""')}"`;
        }
        return stringValue;
      }).join(',')
    );
    
    const csvContent = [headers, ...rows].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `query_results_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    // Phase 1: Show success toast
    showToast(`Exported ${queryResults.data.length} rows to CSV`, 'success');
  };

  // Export query results to JSON
  const handleExportJSON = () => {
    if (!queryResults || !queryResults.data || queryResults.data.length === 0) {
      showToast('No data to export', 'warning');
      return;
    }
    
    const jsonContent = JSON.stringify(queryResults.data, null, 2);
    const blob = new Blob([jsonContent], { type: 'application/json;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `query_results_${new Date().toISOString().split('T')[0]}.json`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    // Phase 1: Show success toast
    showToast(`Exported ${queryResults.data.length} rows to JSON`, 'success');
  };

  // Phase 3: Export to Excel (CSV format with .xlsx extension suggestion)
  const handleExportExcel = () => {
    if (!queryResults || !queryResults.data || queryResults.data.length === 0) {
      showToast('No data to export', 'warning');
      return;
    }
    
    // For now, export as CSV (Excel-compatible)
    // In a full implementation, you'd use a library like xlsx
    handleExportCSV();
    showToast('Exported to CSV (Excel-compatible). For full Excel format, install xlsx library.', 'info');
  };

  // Phase 3: Export to SQL INSERT statements
  const handleExportSQL = () => {
    if (!queryResults || !queryResults.data || queryResults.data.length === 0) {
      showToast('No data to export', 'warning');
      return;
    }
    
    // Try to extract table name from query if available, otherwise use selected table
    let tableName = selectedTable || 'table_name';
    if (sqlQuery) {
      const fromMatch = sqlQuery.match(/FROM\s+([`"']?)(\w+)\1/i);
      if (fromMatch && fromMatch[2]) {
        tableName = fromMatch[2];
      }
    }
    
    const columns = queryResults.columns;
    
    const insertStatements = queryResults.data.map(row => {
      const values = columns.map(col => {
        const value = row[col];
        if (value === null || value === undefined) return 'NULL';
        if (typeof value === 'string') {
          return `'${value.replace(/'/g, "''")}'`;
        }
        return String(value);
      });
      return `INSERT INTO ${tableName} (${columns.join(', ')}) VALUES (${values.join(', ')});`;
    });
    
    const sqlContent = insertStatements.join('\n');
    const blob = new Blob([sqlContent], { type: 'text/plain;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `query_results_${new Date().toISOString().split('T')[0]}.sql`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    showToast(`Exported ${queryResults.data.length} rows as SQL INSERT statements`, 'success');
  };

  // Phase 3: Export to Markdown table
  const handleExportMarkdown = () => {
    if (!queryResults || !queryResults.data || queryResults.data.length === 0) {
      showToast('No data to export', 'warning');
      return;
    }
    
    const columns = queryResults.columns;
    const rows = queryResults.data;
    
    // Create markdown table
    let markdown = `| ${columns.join(' | ')} |\n`;
    markdown += `| ${columns.map(() => '---').join(' | ')} |\n`;
    
    rows.forEach(row => {
      const values = columns.map(col => {
        const value = row[col];
        if (value === null || value === undefined) return '';
        // Escape pipe characters in markdown
        return String(value).replace(/\|/g, '\\|');
      });
      markdown += `| ${values.join(' | ')} |\n`;
    });
    
    const blob = new Blob([markdown], { type: 'text/markdown;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `query_results_${new Date().toISOString().split('T')[0]}.md`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    showToast(`Exported ${queryResults.data.length} rows as Markdown table`, 'success');
  };


  // Phase 3: Load query performance log from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem('dbClient_queryPerformanceLog');
      if (saved) {
        setQueryPerformanceLog(JSON.parse(saved));
      }
    } catch (err) {
      console.error('Error loading query performance log:', err);
    }
  }, []);

  // Format SQL query (basic formatting)
  const handleFormatSQL = () => {
    if (!sqlQuery.trim()) {
      showToast('No query to format', 'warning');
      return;
    }
    
    // Basic SQL formatting
    let formatted = sqlQuery
      .replace(/\s+/g, ' ') // Replace multiple spaces with single space
      .replace(/\s*,\s*/g, ', ') // Space after commas
      .replace(/\s*\(\s*/g, ' (') // Space before opening parenthesis
      .replace(/\s*\)\s*/g, ') ') // Space after closing parenthesis
      .replace(/\s*=\s*/g, ' = ') // Space around equals
      .replace(/\s*SELECT\s+/gi, '\nSELECT ') // New line before SELECT
      .replace(/\s*FROM\s+/gi, '\nFROM ') // New line before FROM
      .replace(/\s*WHERE\s+/gi, '\nWHERE ') // New line before WHERE
      .replace(/\s*ORDER BY\s+/gi, '\nORDER BY ') // New line before ORDER BY
      .replace(/\s*GROUP BY\s+/gi, '\nGROUP BY ') // New line before GROUP BY
      .replace(/\s*HAVING\s+/gi, '\nHAVING ') // New line before HAVING
      .replace(/\s*LIMIT\s+/gi, '\nLIMIT ') // New line before LIMIT
      .replace(/\s*JOIN\s+/gi, '\nJOIN ') // New line before JOIN
      .replace(/\s*INNER JOIN\s+/gi, '\nINNER JOIN ') // New line before INNER JOIN
      .replace(/\s*LEFT JOIN\s+/gi, '\nLEFT JOIN ') // New line before LEFT JOIN
      .replace(/\s*RIGHT JOIN\s+/gi, '\nRIGHT JOIN ') // New line before RIGHT JOIN
      .trim();
    
    setSqlQuery(formatted);
    showToast('Query formatted', 'success');
  };

  // Keyboard shortcuts handler
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Only handle shortcuts when SQL Query tab is active
      if (activeTab !== 3) return;
      
      // Ctrl+Enter or Cmd+Enter to execute query (works in textarea)
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        // Only prevent default if it's the textarea or we're not in an input
        if (e.target.tagName === 'TEXTAREA' || (e.target.tagName !== 'INPUT' && e.target.tagName !== 'TEXTAREA')) {
          e.preventDefault();
          if (sqlQuery.trim() && !queryLoading) {
            handleExecuteQuery();
          }
        }
      }
      
      // Ctrl+K or Cmd+K to clear query (only when not actively typing in textarea)
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        // Only if not in textarea, or if textarea is focused but no text selected
        if (e.target.tagName !== 'TEXTAREA' && e.target.tagName !== 'INPUT') {
          e.preventDefault();
          setSqlQuery('');
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeTab, sqlQuery, queryLoading, handleExecuteQuery]);

  const handleRefresh = () => {
    loadTables();
    if (selectedTable) {
      loadTableSchema(selectedTable);
      if (activeTab === 1) {
        loadTablePreview(selectedTable);
      }
    }
  };

  const handleSort = (columnName) => {
    setSortConfig(prev => ({
      column: columnName,
      direction: prev.column === columnName && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  // Organize tables by menu structure
  const organizedTables = useMemo(() => {
    return organizeTablesByMenu(tables);
  }, [tables]);

  // Phase 1: Enhanced Search with Fuzzy Matching
  const fuzzyMatch = useCallback((text, query) => {
    const textLower = text.toLowerCase();
    const queryLower = query.toLowerCase();
    
    // Exact match
    if (textLower.includes(queryLower)) return 100;
    
    // Fuzzy match: check if all query characters appear in order
    let queryIndex = 0;
    for (let i = 0; i < textLower.length && queryIndex < queryLower.length; i++) {
      if (textLower[i] === queryLower[queryIndex]) {
        queryIndex++;
      }
    }
    
    // If all characters found in order, return a score based on how close they are
    if (queryIndex === queryLower.length) {
      return 50; // Partial match score
    }
    
    // Character-based similarity (Levenshtein-like but simpler)
    let matches = 0;
    for (const char of queryLower) {
      if (textLower.includes(char)) matches++;
    }
    
    return (matches / queryLower.length) * 30; // Max 30 for character matches
  }, []);

  // Filter tables based on enhanced search
  const filteredOrganizedTables = useMemo(() => {
    if (!searchQuery) return organizedTables;
    
    const filtered = {};
    const searchLower = searchQuery.toLowerCase().trim();
    
    Object.keys(organizedTables).forEach(category => {
      filtered[category] = {};
      Object.keys(organizedTables[category]).forEach(menuItem => {
        const matchingTables = organizedTables[category][menuItem]
          .map(table => ({
            table,
            score: Math.max(
              fuzzyMatch(table.name, searchLower),
              fuzzyMatch(category, searchLower) * 0.3,
              fuzzyMatch(menuItem, searchLower) * 0.5
            )
          }))
          .filter(item => item.score > 20) // Threshold for fuzzy matching
          .sort((a, b) => b.score - a.score)
          .map(item => item.table);
        
        if (matchingTables.length > 0) {
          filtered[category][menuItem] = matchingTables;
        }
      });
    });
    
    return filtered;
  }, [organizedTables, searchQuery, fuzzyMatch]);

  // Get menu categories in order
  const menuCategories = useMemo(() => {
    return getMenuCategoriesOrdered();
  }, []);

  // Phase 3: Apply data filters and search
  const filteredPreviewData = useMemo(() => {
    if (!tablePreview?.data) return [];
    
    let data = [...tablePreview.data];
    
    // Apply column filters
    Object.keys(dataFilters).forEach(column => {
      const filter = dataFilters[column];
      if (filter && filter.value !== undefined && filter.value !== '') {
        const filterValue = String(filter.value).toLowerCase();
        data = data.filter(row => {
          const cellValue = row[column] !== null ? String(row[column]).toLowerCase() : '';
          switch (filter.type) {
            case 'equals':
              return cellValue === filterValue;
            case 'contains':
              return cellValue.includes(filterValue);
            case 'startsWith':
              return cellValue.startsWith(filterValue);
            case 'endsWith':
              return cellValue.endsWith(filterValue);
            case 'greaterThan':
              const numVal1 = parseFloat(cellValue);
              const numFilter1 = parseFloat(filterValue);
              return !isNaN(numVal1) && !isNaN(numFilter1) && numVal1 > numFilter1;
            case 'lessThan':
              const numVal2 = parseFloat(cellValue);
              const numFilter2 = parseFloat(filterValue);
              return !isNaN(numVal2) && !isNaN(numFilter2) && numVal2 < numFilter2;
            default:
              return cellValue.includes(filterValue);
          }
        });
      }
    });
    
    // Apply global search text
    if (dataSearchText.trim()) {
      const searchLower = dataSearchText.toLowerCase();
      data = data.filter(row => {
        return Object.values(row).some(val => 
          val !== null && String(val).toLowerCase().includes(searchLower)
        );
      });
    }
    
    return data;
  }, [tablePreview, dataFilters, dataSearchText]);

  // Phase 3: Reset page when filters change
  useEffect(() => {
    setPage(0);
  }, [dataFilters, dataSearchText]);

  // Sort preview data (after filtering)
  const sortedPreviewData = useMemo(() => {
    if (!filteredPreviewData || filteredPreviewData.length === 0) return [];
    
    const data = [...filteredPreviewData];
    if (sortConfig.column) {
      data.sort((a, b) => {
        const aVal = a[sortConfig.column];
        const bVal = b[sortConfig.column];
        const comparison = aVal > bVal ? 1 : aVal < bVal ? -1 : 0;
        return sortConfig.direction === 'asc' ? comparison : -comparison;
      });
    }
    return data;
  }, [filteredPreviewData, sortConfig]);

  // Phase 1: Get visible columns for current table
  const getVisibleColumns = useCallback(() => {
    if (!selectedTable || !tablePreview) return tablePreview?.columns || [];
    const tableKey = selectedTable;
    const columnVisibility = visibleColumns[tableKey] || {};
    return tablePreview.columns.filter(col => columnVisibility[col] !== false);
  }, [selectedTable, tablePreview, visibleColumns]);

  // Paginated data
  const paginatedData = useMemo(() => {
    const start = page * rowsPerPage;
    return sortedPreviewData.slice(start, start + rowsPerPage);
  }, [sortedPreviewData, page, rowsPerPage]);

  // Phase 1: Handle column visibility toggle
  const handleToggleColumnVisibility = useCallback((columnName) => {
    if (!selectedTable) return;
    const tableKey = selectedTable;
    setVisibleColumns(prev => ({
      ...prev,
      [tableKey]: {
        ...(prev[tableKey] || {}),
        [columnName]: !(prev[tableKey]?.[columnName] !== false)
      }
    }));
  }, [selectedTable]);

  // Phase 1: Handle show all / hide all columns
  const handleShowAllColumns = useCallback(() => {
    if (!selectedTable || !tablePreview) return;
    const tableKey = selectedTable;
    const allVisible = {};
    tablePreview.columns.forEach(col => {
      allVisible[col] = true;
    });
    setVisibleColumns(prev => ({ ...prev, [tableKey]: allVisible }));
    setColumnVisibilityDialogOpen(false);
    showToast('All columns shown', 'success');
  }, [selectedTable, tablePreview, showToast]);

  const handleHideAllColumns = useCallback(() => {
    if (!selectedTable || !tablePreview) return;
    const tableKey = selectedTable;
    const allHidden = {};
    tablePreview.columns.forEach(col => {
      allHidden[col] = false;
    });
    setVisibleColumns(prev => ({ ...prev, [tableKey]: allHidden }));
    setColumnVisibilityDialogOpen(false);
    showToast('All columns hidden', 'info');
  }, [selectedTable, tablePreview, showToast]);

  // Phase 2: Query Templates
  const queryTemplates = [
    {
      name: 'Basic SELECT',
      description: 'Select all rows from a table',
      template: 'SELECT * FROM {table} LIMIT 100;',
      placeholders: ['table']
    },
    {
      name: 'SELECT with WHERE',
      description: 'Select rows with conditions',
      template: 'SELECT * FROM {table} WHERE {column} = \'{value}\' LIMIT 100;',
      placeholders: ['table', 'column', 'value']
    },
    {
      name: 'JOIN Query',
      description: 'Join two tables',
      template: `SELECT t1.*, t2.* 
FROM {table1} t1
JOIN {table2} t2 ON t1.id = t2.id
LIMIT 100;`,
      placeholders: ['table1', 'table2']
    },
    {
      name: 'Aggregate Query',
      description: 'Count and group by',
      template: `SELECT {column}, COUNT(*) as count
FROM {table}
GROUP BY {column}
ORDER BY count DESC
LIMIT 100;`,
      placeholders: ['table', 'column']
    },
    {
      name: 'Date Range Query',
      description: 'Filter by date range',
      template: `SELECT * 
FROM {table}
WHERE {dateColumn} >= '{startDate}' 
  AND {dateColumn} <= '{endDate}'
LIMIT 100;`,
      placeholders: ['table', 'dateColumn', 'startDate', 'endDate']
    }
  ];

  // Phase 2: Apply query template
  const handleApplyTemplate = useCallback((template) => {
    let query = template.template;
    
    // Replace placeholders with selected table/column if available
    if (selectedTable) {
      query = query.replace(/{table}/g, selectedTable);
      query = query.replace(/{table1}/g, selectedTable);
      query = query.replace(/{table2}/g, selectedTable);
    }
    
    if (tablePreview && tablePreview.columns && tablePreview.columns.length > 0) {
      query = query.replace(/{column}/g, tablePreview.columns[0]);
      query = query.replace(/{dateColumn}/g, tablePreview.columns.find(col => 
        col.toLowerCase().includes('date') || col.toLowerCase().includes('time')
      ) || tablePreview.columns[0]);
    }
    
    // Replace other placeholders with example values
    query = query.replace(/{value}/g, 'value');
    query = query.replace(/{startDate}/g, '2024-01-01');
    query = query.replace(/{endDate}/g, '2024-12-31');
    
    setSqlQuery(query);
    setTemplateDialogOpen(false);
    showToast(`Template "${template.name}" applied`, 'success');
  }, [selectedTable, tablePreview, showToast]);

  // Phase 2: Save query as bookmark
  const handleSaveBookmark = useCallback(() => {
    if (!sqlQuery.trim()) {
      showToast('No query to save', 'warning');
      return;
    }
    
    if (!bookmarkName.trim()) {
      showToast('Please enter a bookmark name', 'warning');
      return;
    }

    const newBookmark = {
      id: Date.now().toString(),
      name: bookmarkName.trim(),
      description: bookmarkDescription.trim(),
      query: sqlQuery,
      createdAt: new Date().toISOString()
    };

    const updated = [...queryBookmarks, newBookmark];
    const name = bookmarkName.trim();
    saveQueryBookmarks(updated);
    setBookmarkDialogOpen(false);
    setBookmarkName('');
    setBookmarkDescription('');
    showToast(`Bookmark "${name}" saved`, 'success');
  }, [sqlQuery, bookmarkName, bookmarkDescription, queryBookmarks, saveQueryBookmarks, showToast]);

  // Phase 2: Load query from bookmark
  const handleLoadBookmark = useCallback((bookmark) => {
    setSqlQuery(bookmark.query);
    showToast(`Bookmark "${bookmark.name}" loaded`, 'success');
  }, [showToast]);

  // Phase 2: Delete bookmark
  const handleDeleteBookmark = useCallback((bookmarkId) => {
    const updated = queryBookmarks.filter(b => b.id !== bookmarkId);
    saveQueryBookmarks(updated);
    showToast('Bookmark deleted', 'success');
  }, [queryBookmarks, saveQueryBookmarks, showToast]);

  // Phase 2: Execute EXPLAIN query
  const handleExplainQuery = useCallback(async () => {
    if (!sqlQuery.trim()) {
      showToast('No query to explain', 'warning');
      return;
    }

    try {
      setExplainLoading(true);
      setError(null);
      const response = await dbClientService.explainQuery(sqlQuery);
      setExplainPlan(response);
      setShowExplainPlan(true);
      showToast('Query plan generated', 'success');
    } catch (err) {
      const errorMsg = err.response?.data?.error || 'Failed to generate query plan';
      setError(errorMsg);
      setExplainPlan(null);
      showToast(errorMsg, 'error');
    } finally {
      setExplainLoading(false);
    }
  }, [sqlQuery, showToast]);

  // Phase 2: Generate autocomplete suggestions
  const generateAutocompleteSuggestions = useCallback((query, cursorPosition) => {
    const suggestions = [];
    const textBeforeCursor = query.substring(0, cursorPosition);
    const lastWord = textBeforeCursor.split(/\s+/).pop().toUpperCase();
    
    // SQL Keywords
    const sqlKeywords = [
      'SELECT', 'FROM', 'WHERE', 'JOIN', 'INNER JOIN', 'LEFT JOIN', 'RIGHT JOIN',
      'ON', 'AND', 'OR', 'NOT', 'IN', 'LIKE', 'BETWEEN', 'IS NULL', 'IS NOT NULL',
      'ORDER BY', 'GROUP BY', 'HAVING', 'LIMIT', 'DISTINCT', 'AS', 'COUNT', 'SUM',
      'AVG', 'MAX', 'MIN', 'UNION', 'EXISTS', 'CASE', 'WHEN', 'THEN', 'ELSE', 'END'
    ];
    
    sqlKeywords.forEach(keyword => {
      if (keyword.startsWith(lastWord) && lastWord.length > 0) {
        suggestions.push({ type: 'keyword', value: keyword, label: keyword });
      }
    });

    // Table names
    if (tables.length > 0) {
      tables.forEach(table => {
        if (table.name.toLowerCase().includes(lastWord.toLowerCase()) && lastWord.length > 0) {
          suggestions.push({ type: 'table', value: table.name, label: `${table.name} (table)` });
        }
      });
    }

    // Column names (if table is selected or mentioned in query)
    if (tableSchema && tableSchema.columns) {
      tableSchema.columns.forEach(col => {
        if (col.name.toLowerCase().includes(lastWord.toLowerCase()) && lastWord.length > 0) {
          suggestions.push({ type: 'column', value: col.name, label: `${col.name} (${col.type})` });
        }
      });
    }

    // Also check if we're after FROM - suggest tables
    if (textBeforeCursor.toUpperCase().includes('FROM') && !textBeforeCursor.toUpperCase().includes('JOIN')) {
      const fromIndex = textBeforeCursor.toUpperCase().lastIndexOf('FROM');
      const afterFrom = textBeforeCursor.substring(fromIndex + 4).trim();
      if (afterFrom.length === 0 || afterFrom === lastWord) {
        tables.forEach(table => {
          suggestions.push({ type: 'table', value: table.name, label: `${table.name} (table)` });
        });
      }
    }

    return suggestions.slice(0, 10); // Limit to 10 suggestions
  }, [tables, tableSchema]);

  // Phase 3: Handle data filter operations
  const handleAddFilter = useCallback(() => {
    if (!filterColumn || !filterValue.trim()) {
      showToast('Please select a column and enter a filter value', 'warning');
      return;
    }

    setDataFilters(prev => ({
      ...prev,
      [filterColumn]: {
        type: filterType,
        value: filterValue.trim()
      }
    }));

    setFilterValue('');
    setFilterType('contains');
    showToast(`Filter added for ${filterColumn}`, 'success');
  }, [filterColumn, filterType, filterValue, showToast]);

  const handleRemoveFilter = useCallback((column) => {
    setDataFilters(prev => {
      const updated = { ...prev };
      delete updated[column];
      return updated;
    });
    showToast(`Filter removed for ${column}`, 'info');
  }, [showToast]);

  const handleClearAllFilters = useCallback(() => {
    setDataFilters({});
    setDataSearchText('');
    showToast('All filters cleared', 'info');
  }, [showToast]);

  // Phase 3: Calculate query performance statistics
  const performanceStats = useMemo(() => {
    if (queryPerformanceLog.length === 0) {
      return {
        totalQueries: 0,
        averageTime: 0,
        slowestQuery: null,
        fastestQuery: null
      };
    }

    const times = queryPerformanceLog.map(q => q.executionTime);
    const totalTime = times.reduce((sum, time) => sum + time, 0);
    const averageTime = totalTime / times.length;
    
    const slowestQuery = queryPerformanceLog.reduce((slowest, current) => 
      current.executionTime > slowest.executionTime ? current : slowest
    );
    
    const fastestQuery = queryPerformanceLog.reduce((fastest, current) => 
      current.executionTime < fastest.executionTime ? current : fastest
    );

    return {
      totalQueries: queryPerformanceLog.length,
      averageTime: averageTime.toFixed(3),
      slowestQuery,
      fastestQuery
    };
  }, [queryPerformanceLog]);

  const toggleCategory = (category) => {
    setExpandedCategories(prev => ({
      ...prev,
      [category]: !prev[category]
    }));
  };

  const toggleMenuItem = (category, menuItem) => {
    const key = `${category}-${menuItem}`;
    setExpandedMenuItems(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ 
      width: '100vw', 
      height: '100vh', 
      overflow: 'hidden',
      display: 'flex',
      flexDirection: 'column',
      bgcolor: 'background.default',
    }}>
      {/* Header Bar */}
      <Box 
        sx={{ 
          p: 2, 
          borderBottom: `1px solid ${theme.palette.divider}`,
          bgcolor: 'background.paper',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          boxShadow: theme.shadows[2],
          flexWrap: 'wrap',
          gap: 1.5
        }}
      >
        <Typography variant="h6" sx={{ fontWeight: 600, display: 'flex', alignItems: 'center', gap: 0.5 }}>
          DataOps Studio
          <Typography component="span" variant="body2" color="text.secondary">
            | Browse database tables organized by menu structure
          </Typography>
        </Typography>
        {databaseInfo && (
          <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 600 }}>
            {`${databaseInfo.engine} ${databaseInfo.version?.split(' ')[0] || ''}`}
          </Typography>
        )}
      </Box>

      {/* Main Content Area - Full Screen */}
      <Box sx={{ flex: 1, overflow: 'hidden', p: 2, display: 'flex', flexDirection: 'column', minHeight: 0 }}>
        {error && (
          <Alert severity="error" sx={{ mb: 2, flexShrink: 0 }} onClose={() => setError(null)}>
            {error}
          </Alert>
        )}

        <Grid container spacing={2} sx={{ flex: 1, overflow: 'hidden', minHeight: 0, height: '100%' }}>
          {/* Sidebar - Menu-Organized Table List */}
          <Grid
            item
            xs={12}
            md={3}
            sx={{
              display: 'flex',
              flexDirection: 'column',
              minHeight: 0,
              height: '100%',
              flexBasis: { md: '22%' },
              maxWidth: { md: '22%' }
            }}
          >
            <Paper 
              sx={{ 
                height: '100%',
                borderRadius: 0,
                boxShadow: theme.shadows[2],
                display: 'flex',
                flexDirection: 'column',
                overflow: 'hidden',
                border: `1px solid ${theme.palette.divider}`,
                minHeight: 0,
              }}
            >
              <Box sx={{ p: 2, borderBottom: `1px solid ${theme.palette.divider}`, bgcolor: alpha(theme.palette.primary.main, 0.02), flexShrink: 0 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1.5 }}>
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    DataOps Tables
                  </Typography>
                  <Tooltip title="Refresh">
                    <IconButton size="small" onClick={handleRefresh} color="primary" sx={{ borderRadius: 0 }}>
                      <RefreshIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </Box>
                <TextField
                  size="small"
                  fullWidth
                  placeholder="Search tables..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon fontSize="small" />
                      </InputAdornment>
                    ),
                    endAdornment: searchQuery && (
                      <InputAdornment position="end">
                        <IconButton size="small" onClick={() => setSearchQuery('')}>
                          <ClearIcon fontSize="small" />
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 0,
                      fontSize: '0.85rem'
                    }
                  }}
                />
                <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1 }}>
                  {tables.length} tables • {views.length} views
                </Typography>
              </Box>
              
              <Box sx={{ flex: 1, overflowY: 'auto', overflowX: 'hidden', p: 1, minHeight: 0 }}>
                {/* Menu-Organized Table List */}
                {menuCategories.map((categoryObj) => {
                  const categoryTitle = categoryObj.title;
                  const categoryTables = filteredOrganizedTables[categoryTitle] || {};
                  const hasTables = Object.values(categoryTables).some(items => items.length > 0);
                  
                  if (!hasTables && searchQuery) return null;
                  
                  const isCategoryExpanded = expandedCategories[categoryTitle] !== false;
                  
                  return (
                    <Accordion
                      key={categoryTitle}
                      expanded={isCategoryExpanded}
                      onChange={() => toggleCategory(categoryTitle)}
                      sx={{ 
                        mb: 1, 
                        boxShadow: theme.shadows[1],
                        '&:before': { display: 'none' },
                        border: `1px solid ${alpha(theme.palette.divider, 0.5)}`,
                        borderRadius: 0,
                        '&.Mui-expanded': {
                          margin: '0 0 8px 0'
                        }
                      }}
                    >
                      <AccordionSummary 
                        expandIcon={<ExpandMoreIcon />}
                        sx={{
                          flexDirection: 'row',
                          '& .MuiAccordionSummary-content': {
                            flexDirection: 'row',
                            margin: 0,
                            '&.Mui-expanded': {
                              margin: 0
                            }
                          },
                          '& .MuiAccordionSummary-expandIconWrapper': {
                            order: -1,
                            mr: 1,
                            ml: 0,
                            transform: 'rotate(0deg)',
                            '&.Mui-expanded': {
                              transform: 'rotate(180deg)'
                            }
                          }
                        }}
                      >
                        <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                          {categoryTitle}
                        </Typography>
                        <Chip 
                          label={Object.values(categoryTables).reduce((sum, tables) => sum + (tables?.length || 0), 0)} 
                          size="small" 
                          sx={{ ml: 1, height: 20 }} 
                        />
                      </AccordionSummary>
                      <AccordionDetails sx={{ p: 0, pt: 0.5 }}>
                        {categoryObj.items.map((menuItem) => {
                          const menuItemTables = categoryTables[menuItem] || [];
                          if (menuItemTables.length === 0) return null;
                          
                          const menuItemKey = `${categoryTitle}-${menuItem}`;
                          // Default to expanded (undefined/null means expanded)
                          const isExpanded = expandedMenuItems[menuItemKey] !== false;
                          
                          return (
                            <Accordion
                              key={menuItem}
                              expanded={isExpanded}
                              onChange={() => toggleMenuItem(categoryTitle, menuItem)}
                              sx={{ 
                                mb: 0.5, 
                                boxShadow: 'none',
                                '&:before': { display: 'none' },
                                border: 'none',
                                borderRadius: 0,
                                '&.Mui-expanded': {
                                  margin: '0 0 4px 0'
                                }
                              }}
                            >
                              <AccordionSummary 
                                expandIcon={<ExpandMoreIcon sx={{ fontSize: 18 }} />}
                                sx={{ 
                                  py: 0.5, 
                                  px: 1.5,
                                  minHeight: 36,
                                  flexDirection: 'row',
                                  '&.Mui-expanded': {
                                    minHeight: 36
                                  },
                                  '& .MuiAccordionSummary-content': {
                                    margin: '4px 0',
                                    alignItems: 'center',
                                    flexDirection: 'row',
                                    '&.Mui-expanded': {
                                      margin: '4px 0'
                                    }
                                  },
                                  '& .MuiAccordionSummary-expandIconWrapper': {
                                    order: -1,
                                    mr: 1,
                                    ml: 0,
                                    transform: 'rotate(0deg)',
                                    '&.Mui-expanded': {
                                      transform: 'rotate(180deg)'
                                    }
                                  }
                                }}
                              >
                                <Typography 
                                  variant="body2" 
                                  sx={{ 
                                    fontSize: '0.85rem',
                                    fontWeight: 500,
                                    flex: 1
                                  }}
                                >
                                  {menuItem}
                                </Typography>
                                <Chip 
                                  label={menuItemTables.length} 
                                  size="small" 
                                  sx={{ 
                                    height: 18, 
                                    fontSize: '0.7rem',
                                    ml: 1
                                  }} 
                                />
                              </AccordionSummary>
                              <AccordionDetails sx={{ p: 0, pt: 0.5, pb: 0.5 }}>
                                <List dense sx={{ pl: 1, pt: 0 }}>
                                  {menuItemTables.map((table) => (
                                    <ListItem
                                      key={table.name}
                                      disablePadding
                                      sx={{ mb: 0.25 }}
                                    >
                                      <ListItemButton
                                        selected={selectedTable === table.name}
                                        onClick={() => setSelectedTable(table.name)}
                                        sx={{ 
                                          py: 0.5, 
                                          px: 1.5,
                                          borderRadius: 0,
                                          ml: 1,
                                          mr: 1,
                                          '&.Mui-selected': {
                                            bgcolor: alpha(theme.palette.primary.main, 0.1),
                                            '&:hover': {
                                              bgcolor: alpha(theme.palette.primary.main, 0.15),
                                            }
                                          }
                                        }}
                                      >
                                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', gap: 1 }}>
                                          <Typography variant="body2" sx={{ fontSize: '0.8rem', fontWeight: 500 }}>
                                            {table.name}
                                          </Typography>
                                          <Typography variant="caption" color="text.secondary">
                                            {formatNumber(table.row_count)} rows
                                          </Typography>
                                        </Box>
                                      </ListItemButton>
                                    </ListItem>
                                  ))}
                                </List>
                              </AccordionDetails>
                            </Accordion>
                          );
                        })}
                      </AccordionDetails>
                    </Accordion>
                  );
                })}
              </Box>
            </Paper>
          </Grid>

          {/* Main Content Area */}
          <Grid
            item
            xs={12}
            md={9}
            sx={{
              display: 'flex',
              flexDirection: 'column',
              minHeight: 0,
              flexBasis: { md: '78%' },
              maxWidth: { md: '78%' }
            }}
          >
            {selectedTable ? (
              <Paper 
                sx={{ 
                  borderRadius: 0,
                  boxShadow: theme.shadows[2],
                  overflow: 'hidden',
                  border: `1px solid ${theme.palette.divider}`,
                  display: 'flex',
                  flexDirection: 'column',
                  height: '100%',
                  flex: 1,
                  minHeight: 0,
                }}
              >
                {/* Table Header */}
                <Box 
                  sx={{ 
                    p: 2.5, 
                    background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.1)} 0%, ${alpha(theme.palette.primary.dark, 0.05)} 100%)`,
                    borderBottom: `1px solid ${theme.palette.divider}`,
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 2, flexWrap: 'wrap' }}>
                    <Tabs
                      value={activeTab}
                      onChange={(e, newValue) => setActiveTab(newValue)}
                      variant="scrollable"
                      scrollButtons="auto"
                      sx={{
                        minHeight: 24,
                        '& .MuiTabs-indicator': {
                          height: 2
                        },
                        '& .MuiTab-root': {
                          minHeight: 24,
                          paddingX: 0.75,
                          paddingY: 0,
                          fontSize: '0.72rem',
                          minWidth: 0
                        },
                        '& .MuiTab-iconWrapper': {
                          fontSize: '0.9rem',
                          marginBottom: 0
                        }
                      }}
                    >
                      <Tab icon={<SchemaIcon sx={{ fontSize: '0.95rem' }} />} iconPosition="start" label="Schema" />
                      <Tab icon={<ViewIcon sx={{ fontSize: '0.95rem' }} />} iconPosition="start" label="Data" />
                      <Tab icon={<RelationshipIcon sx={{ fontSize: '0.95rem' }} />} iconPosition="start" label="Relationships" />
                      <Tab icon={<QueryIcon sx={{ fontSize: '0.95rem' }} />} iconPosition="start" label="SQL Query" />
                      <Tab icon={<StorageIcon sx={{ fontSize: '0.95rem' }} />} iconPosition="start" label="Database Info" />
                    </Tabs>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flexWrap: 'wrap', justifyContent: 'flex-end' }}>
                      <Typography variant="h6" sx={{ fontWeight: 600, mr: 1, minWidth: 0 }}>
                        {selectedTable}
                      </Typography>
                      {tableSchema && (
                        <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap', alignItems: 'center' }}>
                          <Chip 
                            label={`${formatNumber(tableSchema.row_count || 0)} rows`} 
                            size="small" 
                            color="primary" 
                            variant="outlined"
                          />
                          <Chip 
                            label={`${tableSchema.column_count || 0} columns`} 
                            size="small" 
                            color="info" 
                            variant="outlined"
                          />
                        </Stack>
                      )}
                      <IconButton onClick={handleRefresh} color="primary" sx={{ flexShrink: 0 }}>
                        <RefreshIcon />
                      </IconButton>
                    </Box>
                  </Box>
                </Box>

                {/* Tab Content - Scrollable */}
                <Box sx={{ flex: 1, overflow: 'auto', p: 3, minHeight: 0 }}>
                  {activeTab === 0 && (
                    <Box>
                      {schemaLoading ? (
                        <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                          <CircularProgress />
                        </Box>
                      ) : tableSchema ? (
                        <Box>
                          <Typography variant="h6" sx={{ mb: 2 }}>Columns</Typography>
                          <TableContainer>
                            <Table size="small">
                              <TableHead>
                                <TableRow>
                                  <TableCell><strong>Column</strong></TableCell>
                                  <TableCell><strong>Type</strong></TableCell>
                                  <TableCell><strong>Nullable</strong></TableCell>
                                  <TableCell><strong>Default</strong></TableCell>
                                  <TableCell><strong>Primary Key</strong></TableCell>
                                </TableRow>
                              </TableHead>
                              <TableBody>
                                {tableSchema.columns.map((col, idx) => (
                                  <TableRow key={idx}>
                                    <TableCell>{col.name}</TableCell>
                                    <TableCell>{col.type}</TableCell>
                                    <TableCell>{col.not_null ? 'No' : 'Yes'}</TableCell>
                                    <TableCell>{col.default || '-'}</TableCell>
                                    <TableCell>{col.primary_key ? 'Yes' : 'No'}</TableCell>
                                  </TableRow>
                                ))}
                              </TableBody>
                            </Table>
                          </TableContainer>
                          
                          {tableSchema.foreign_keys && tableSchema.foreign_keys.length > 0 && (
                            <Box sx={{ mt: 3 }}>
                              <Typography variant="h6" sx={{ mb: 2 }}>Foreign Keys</Typography>
                              <TableContainer>
                                <Table size="small">
                                  <TableHead>
                                    <TableRow>
                                      <TableCell><strong>Column</strong></TableCell>
                                      <TableCell><strong>References Table</strong></TableCell>
                                      <TableCell><strong>References Column</strong></TableCell>
                                    </TableRow>
                                  </TableHead>
                                  <TableBody>
                                    {tableSchema.foreign_keys.map((fk, idx) => (
                                      <TableRow key={idx}>
                                        <TableCell>{fk.from_column}</TableCell>
                                        <TableCell>{fk.to_table}</TableCell>
                                        <TableCell>{fk.to_column}</TableCell>
                                      </TableRow>
                                    ))}
                                  </TableBody>
                                </Table>
                              </TableContainer>
                            </Box>
                          )}
                        </Box>
                      ) : (
                        <Typography>No schema data available</Typography>
                      )}
                    </Box>
                  )}
                  
                  {activeTab === 1 && (
                    <Box>
                      {previewLoading ? (
                        <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                          <CircularProgress />
                        </Box>
                      ) : tablePreview ? (
                        <Box>
                          {/* Phase 1: Column Visibility Toolbar + Phase 3: Advanced Filtering */}
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1, p: 1, bgcolor: alpha(theme.palette.primary.main, 0.05) }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flex: 1 }}>
                              <Typography variant="body2" color="text.secondary">
                                Showing {getVisibleColumns().length} of {tablePreview.columns.length} columns
                              </Typography>
                              {/* Phase 3: Global Search */}
                              <TextField
                                size="small"
                                placeholder="Search in data..."
                                value={dataSearchText}
                                onChange={(e) => setDataSearchText(e.target.value)}
                                InputProps={{
                                  startAdornment: (
                                    <InputAdornment position="start">
                                      <SearchIcon fontSize="small" />
                                    </InputAdornment>
                                  ),
                                  endAdornment: dataSearchText && (
                                    <InputAdornment position="end">
                                      <IconButton
                                        size="small"
                                        onClick={() => setDataSearchText('')}
                                        edge="end"
                                      >
                                        <ClearIcon fontSize="small" />
                                      </IconButton>
                                    </InputAdornment>
                                  ),
                                }}
                                sx={{ 
                                  width: 250,
                                  '& .MuiOutlinedInput-root': { borderRadius: 0, height: 32 }
                                }}
                              />
                              {/* Phase 3: Active Filters Badge */}
                              {Object.keys(dataFilters).filter(col => dataFilters[col]?.value).length > 0 && (
                                <Chip
                                  label={`${Object.keys(dataFilters).filter(col => dataFilters[col]?.value).length} filter(s)`}
                                  size="small"
                                  color="primary"
                                  onDelete={() => setDataFilters({})}
                                  sx={{ borderRadius: 0 }}
                                />
                              )}
                            </Box>
                            <Box sx={{ display: 'flex', gap: 1 }}>
                              {/* Phase 3: Filter Button */}
                              <Tooltip title="Column Filters">
                                <IconButton
                                  size="small"
                                  onClick={() => setFilterDialogOpen(true)}
                                  sx={{ borderRadius: 0 }}
                                  color={Object.keys(dataFilters).filter(col => dataFilters[col]?.value).length > 0 ? 'primary' : 'default'}
                                >
                                  <Badge 
                                    badgeContent={Object.keys(dataFilters).filter(col => dataFilters[col]?.value).length} 
                                    color="primary"
                                    invisible={Object.keys(dataFilters).filter(col => dataFilters[col]?.value).length === 0}
                                  >
                                    <FilterIcon fontSize="small" />
                                  </Badge>
                                </IconButton>
                              </Tooltip>
                              {/* Phase 1: Column Visibility */}
                              <Tooltip title="Column Visibility">
                                <IconButton
                                  size="small"
                                  onClick={() => setColumnVisibilityDialogOpen(true)}
                                  sx={{ borderRadius: 0 }}
                                >
                                  <ColumnIcon fontSize="small" />
                                </IconButton>
                              </Tooltip>
                            </Box>
                          </Box>
                          
                          {/* Phase 3: Filtered Row Count */}
                          {filteredPreviewData.length !== tablePreview.data.length && (
                            <Alert severity="info" sx={{ mb: 1, borderRadius: 0 }}>
                              Showing {filteredPreviewData.length} of {tablePreview.data.length} rows
                            </Alert>
                          )}
                          
                          <TableContainer>
                            <Table size="small">
                              <TableHead>
                                <TableRow>
                                  {getVisibleColumns().map((col) => (
                                    <TableCell key={col}>
                                      <TableSortLabel
                                        active={sortConfig.column === col}
                                        direction={sortConfig.column === col ? sortConfig.direction : 'asc'}
                                        onClick={() => handleSort(col)}
                                      >
                                        {col}
                                      </TableSortLabel>
                                    </TableCell>
                                  ))}
                                </TableRow>
                              </TableHead>
                              <TableBody>
                                {paginatedData.map((row, idx) => (
                                  <TableRow key={idx}>
                                    {getVisibleColumns().map((col) => (
                                      <TableCell key={col}>{row[col] !== null ? String(row[col]) : 'NULL'}</TableCell>
                                    ))}
                                  </TableRow>
                                ))}
                              </TableBody>
                            </Table>
                          </TableContainer>
                          <TablePagination
                            component="div"
                            count={sortedPreviewData.length}
                            page={page}
                            onPageChange={(e, newPage) => setPage(newPage)}
                            rowsPerPage={rowsPerPage}
                            onRowsPerPageChange={(e) => {
                              setRowsPerPage(parseInt(e.target.value, 10));
                              setPage(0);
                            }}
                            labelRowsPerPage="Rows per page:"
                            labelDisplayedRows={({ from, to, count }) => `${from}-${to} of ${count !== -1 ? count : `more than ${to}`}`}
                          />
                        </Box>
                      ) : (
                        <Typography>No data available</Typography>
                      )}
                    </Box>
                  )}
                  
                  {activeTab === 2 && (
                    <Box>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                        <Typography variant="h6">Table Relationships</Typography>
                        <Box sx={{ display: 'flex', gap: 1 }}>
                          {/* Phase 3: Toggle between table and graph view */}
                          <Button
                            variant={erDiagramView === 'table' ? 'contained' : 'outlined'}
                            onClick={() => setErDiagramView('table')}
                            size="small"
                            startIcon={<TableIcon />}
                            sx={{ borderRadius: 0 }}
                          >
                            Table View
                          </Button>
                          <Button
                            variant={erDiagramView === 'graph' ? 'contained' : 'outlined'}
                            onClick={() => setErDiagramView('graph')}
                            size="small"
                            startIcon={<RelationshipIcon />}
                            sx={{ borderRadius: 0 }}
                          >
                            Graph View
                          </Button>
                        </Box>
                      </Box>
                      {relationships.length > 0 ? (
                        erDiagramView === 'table' ? (
                          <TableContainer>
                            <Table size="small">
                              <TableHead>
                                <TableRow>
                                  <TableCell><strong>From Table</strong></TableCell>
                                  <TableCell><strong>From Column</strong></TableCell>
                                  <TableCell><strong>To Table</strong></TableCell>
                                  <TableCell><strong>To Column</strong></TableCell>
                                </TableRow>
                              </TableHead>
                              <TableBody>
                                {relationships
                                  .filter(rel => !selectedDiagramTable || rel.from_table === selectedDiagramTable || rel.to_table === selectedDiagramTable)
                                  .map((rel, idx) => (
                                    <TableRow key={idx}>
                                      <TableCell>
                                        <Button
                                          size="small"
                                          onClick={() => setSelectedTable(rel.from_table)}
                                          sx={{ textTransform: 'none', p: 0, minWidth: 0 }}
                                        >
                                          {rel.from_table}
                                        </Button>
                                      </TableCell>
                                      <TableCell>{rel.from_column}</TableCell>
                                      <TableCell>
                                        <Button
                                          size="small"
                                          onClick={() => setSelectedTable(rel.to_table)}
                                          sx={{ textTransform: 'none', p: 0, minWidth: 0 }}
                                        >
                                          {rel.to_table}
                                        </Button>
                                      </TableCell>
                                      <TableCell>{rel.to_column}</TableCell>
                                    </TableRow>
                                  ))}
                              </TableBody>
                            </Table>
                          </TableContainer>
                        ) : (
                          // Phase 3: Visual ER Diagram (Simple SVG-based)
                          <Box sx={{ border: `1px solid ${theme.palette.divider}`, borderRadius: 0, p: 2, bgcolor: 'background.paper', minHeight: 400 }}>
                            <ERDiagramVisualization
                              relationships={selectedDiagramTable 
                                ? relationships.filter(rel => rel.from_table === selectedDiagramTable || rel.to_table === selectedDiagramTable)
                                : relationships
                              }
                              tables={tables}
                              selectedTable={selectedDiagramTable}
                              onTableClick={(tableName) => {
                                setSelectedTable(tableName);
                                setSelectedDiagramTable(tableName);
                              }}
                              onTableSelect={(tableName) => setSelectedDiagramTable(tableName)}
                            />
                          </Box>
                        )
                      ) : (
                        <Typography>No relationships found</Typography>
                      )}
                    </Box>
                  )}
                  
                  {activeTab === 3 && (
                    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%', gap: 1.5 }}>
                      {/* Query Editor Section */}
                      <Paper 
                        sx={{ 
                          borderRadius: 0,
                          border: `1px solid ${theme.palette.divider}`,
                          bgcolor: 'background.paper',
                          display: 'flex',
                          flexDirection: 'column',
                          overflow: 'hidden',
                          flex: '0 0 auto'
                         }}
                      >
                        {/* Toolbar */}
                        <Toolbar 
                          variant="dense" 
                          sx={{ 
                            minHeight: '42px !important',
                            bgcolor: alpha(theme.palette.primary.main, 0.05),
                            borderBottom: `1px solid ${theme.palette.divider}`,
                            display: 'flex',
                            alignItems: 'center',
                            gap: 1.5,
                            flexWrap: 'wrap'
                          }}
                        >
                          {/* Left Section - Main Actions */}
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, flex: 1 }}>
                            <Tooltip title="Execute Query (Ctrl+Enter)">
                              <span>
                                <IconButton
                                  color="primary"
                                  onClick={handleExecuteQuery}
                                  disabled={queryLoading || !sqlQuery.trim()}
                                  sx={{ borderRadius: 0 }}
                                  size="small"
                                >
                                  {queryLoading ? <CircularProgress size={18} /> : <ExecuteIcon />}
                                </IconButton>
                              </span>
                            </Tooltip>
                            
                            <Divider orientation="vertical" flexItem sx={{ mx: 0.5 }} />
                            
                            <Tooltip title="Clear Query (Ctrl+K)">
                              <span>
                                <IconButton
                                  onClick={() => setSqlQuery('')}
                                  disabled={!sqlQuery.trim()}
                                  sx={{ borderRadius: 0 }}
                                  size="small"
                                >
                                  <ClearIcon />
                                </IconButton>
                              </span>
                            </Tooltip>
                            
                            <Tooltip title="Format SQL">
                              <span>
                                <IconButton
                                  onClick={handleFormatSQL}
                                  disabled={!sqlQuery.trim()}
                                  sx={{ borderRadius: 0 }}
                                  size="small"
                                >
                                  <FormatIcon />
                                </IconButton>
                              </span>
                            </Tooltip>
                            
                            <Divider orientation="vertical" flexItem sx={{ mx: 0.5 }} />
                            
                            {queryHistory.length > 0 && (
                              <>
                                <Tooltip title="Query History">
                                  <IconButton
                                    onClick={() => setShowQueryHistory(!showQueryHistory)}
                                    sx={{ borderRadius: 0 }}
                                    size="small"
                                  >
                                    <Badge badgeContent={queryHistory.length} color="primary">
                                      <OpenIcon />
                                    </Badge>
                                  </IconButton>
                                </Tooltip>
                                <Divider orientation="vertical" flexItem sx={{ mx: 0.5 }} />
                              </>
                            )}
                            
                            {/* Phase 2: Query Templates */}
                            <Tooltip title="Query Templates">
                              <IconButton
                                onClick={() => setTemplateDialogOpen(true)}
                                sx={{ borderRadius: 0 }}
                                size="small"
                              >
                                <TemplateIcon />
                              </IconButton>
                            </Tooltip>
                            
                            {/* Phase 2: Query Bookmarks */}
                            <Tooltip title="Query Bookmarks">
                              <IconButton
                                onClick={() => setBookmarkDialogOpen(true)}
                                sx={{ borderRadius: 0 }}
                                size="small"
                              >
                                <Badge badgeContent={queryBookmarks.length} color="primary" invisible={queryBookmarks.length === 0}>
                                  <BookmarkIcon />
                                </Badge>
                              </IconButton>
                            </Tooltip>
                            
                            {/* Phase 2: Save as Bookmark */}
                            {sqlQuery.trim() && (
                              <Tooltip title="Save Query as Bookmark">
                                <IconButton
                                  onClick={() => {
                                    setBookmarkName('');
                                    setBookmarkDescription('');
                                    setBookmarkDialogOpen(true);
                                  }}
                                  sx={{ borderRadius: 0 }}
                                  size="small"
                                  color="primary"
                                >
                                  <BookmarkBorderIcon />
                                </IconButton>
                              </Tooltip>
                            )}
                            
                            <Divider orientation="vertical" flexItem sx={{ mx: 0.5 }} />
                            
                            {/* Phase 2: EXPLAIN Query Plan */}
                            <Tooltip title="Explain Query Plan">
                              <span>
                                <IconButton
                                  onClick={handleExplainQuery}
                                  disabled={!sqlQuery.trim() || explainLoading}
                                  sx={{ borderRadius: 0 }}
                                  size="small"
                                  color="info"
                                >
                                  {explainLoading ? <CircularProgress size={18} /> : <ExplainIcon />}
                                </IconButton>
                              </span>
                            </Tooltip>
                            
                            <Divider orientation="vertical" flexItem sx={{ mx: 0.5 }} />
                            
                            {/* Phase 3: Query Performance Dashboard */}
                            <Tooltip title="Query Performance Dashboard">
                              <IconButton
                                onClick={() => setPerformanceDashboardOpen(true)}
                                sx={{ borderRadius: 0 }}
                                size="small"
                                color="secondary"
                              >
                                <Badge badgeContent={queryPerformanceLog.length} color="secondary" invisible={queryPerformanceLog.length === 0}>
                                  <DashboardIcon />
                                </Badge>
                              </IconButton>
                            </Tooltip>
                            
                            {/* Query Menu */}
                            <Tooltip title="Query Options">
                              <IconButton
                                onClick={(e) => setQueryMenuAnchor(e.currentTarget)}
                                sx={{ borderRadius: 0 }}
                                size="small"
                              >
                                <MoreIcon />
                              </IconButton>
                            </Tooltip>
                          </Box>

                          <Typography
                            variant="caption"
                            color="text.secondary"
                            sx={{ fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: 1, textWrap: 'nowrap' }}
                          >
                            Shortcuts: Ctrl+Enter (Execute) • Ctrl+K (Clear) • Click cell to copy
                          </Typography>
                        </Toolbar>

                        <Box sx={{ p: 2, display: 'flex', flexDirection: 'column', gap: 1, flex: 1, minHeight: 0 }}>
                          {/* Query History */}
                          {showQueryHistory && (
                            <Box 
                              sx={{ 
                                mb: 2, 
                                p: 2, 
                                bgcolor: 'grey.50', 
                                border: `1px solid ${theme.palette.divider}`,
                                borderRadius: 0
                              }}
                            >
                              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
                                <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>Query History</Typography>
                                <IconButton 
                                  size="small" 
                                  onClick={() => setShowQueryHistory(false)}
                                  sx={{ borderRadius: 0 }}
                                >
                                  <ClearIcon fontSize="small" />
                                </IconButton>
                              </Box>
                              <List dense sx={{ maxHeight: 150, overflow: 'auto' }}>
                                {queryHistory.map((query, idx) => (
                                  <ListItem 
                                    key={idx} 
                                    disablePadding
                                    sx={{ mb: 0.5 }}
                                  >
                                    <ListItemButton 
                                      onClick={() => {
                                        setSqlQuery(query);
                                        setShowQueryHistory(false);
                                      }}
                                      sx={{ 
                                        borderRadius: 0,
                                        border: `1px solid ${theme.palette.divider}`,
                                        bgcolor: 'white',
                                        '&:hover': { bgcolor: 'action.hover' }
                                      }}
                                    >
                                      <ListItemText 
                                        primary={query.length > 80 ? query.substring(0, 80) + '...' : query} 
                                        primaryTypographyProps={{ 
                                          variant: 'caption', 
                                          fontFamily: 'monospace',
                                          sx: { fontSize: '0.75rem' }
                                        }} 
                                      />
                                    </ListItemButton>
                                  </ListItem>
                                ))}
                              </List>
                            </Box>
                          )}

                          {/* Query Input */}
                          <TextField
                            fullWidth
                            multiline
                            rows={4}
                            value={sqlQuery}
                            onChange={(e) => setSqlQuery(e.target.value)}
                            placeholder="SELECT * FROM table_name LIMIT 100; -- Press Ctrl+Enter to execute, Ctrl+K to clear"
                            sx={{ 
                              '& .MuiOutlinedInput-root': { 
                                borderRadius: 0,
                                fontFamily: 'monospace',
                                fontSize: '0.9rem',
                                bgcolor: alpha(theme.palette.common.black, 0.02),
                                '& fieldset': {
                                  borderColor: theme.palette.divider
                                },
                                '&:hover fieldset': {
                                  borderColor: alpha(theme.palette.text.primary, 0.4)
                                },
                                '&.Mui-focused fieldset': {
                                  borderColor: alpha(theme.palette.text.primary, 0.6)
                                }
                              },
                              '& textarea': {
                                fontFamily: 'monospace',
                                fontSize: '0.9rem',
                                lineHeight: 1.6
                              },
                              flex: 1,
                              minHeight: 0
                            }}
                          />
                        </Box>
                      </Paper>

                      {/* Results Section */}
                      {queryResults && (
                        <Paper 
                          sx={{ 
                            flex: 1,
                            display: 'flex',
                            flexDirection: 'column',
                            borderRadius: 0,
                            border: `1px solid ${theme.palette.divider}`,
                            bgcolor: 'background.paper',
                            overflow: 'hidden',
                            minHeight: 0
                          }}
                        >
                          {/* Results Header */}
                          <Box 
                            sx={{ 
                              py: 1.25,
                              px: 1.5,
                              borderBottom: `1px solid ${theme.palette.divider}`,
                              bgcolor: alpha(theme.palette.success.main, 0.05),
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'space-between'
                            }}
                          >
                            <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                              Query Results
                            </Typography>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <Chip 
                                label={`${queryResults.row_count || 0} row(s)`} 
                                size="small" 
                                color="success" 
                                variant="outlined"
                                sx={{ borderRadius: 0 }}
                              />
                              {queryResults.execution_time && (
                                <Chip 
                                  label={`${queryResults.execution_time}`} 
                                  size="small" 
                                  color="info" 
                                  variant="outlined"
                                  sx={{ borderRadius: 0 }}
                                />
                              )}
                              <Chip 
                                label={`${queryResults.columns?.length || 0} column(s)`} 
                                size="small" 
                                color="primary" 
                                variant="outlined"
                                sx={{ borderRadius: 0 }}
                              />
                              <Divider orientation="vertical" flexItem sx={{ mx: 1 }} />
                                <Tooltip title="Export Results">
                                  <IconButton 
                                    size="small" 
                                    onClick={(e) => setExportMenuAnchor(e.currentTarget)}
                                    sx={{ borderRadius: 0 }} 
                                    color="primary"
                                  >
                                    <ExportIcon fontSize="small" />
                                  </IconButton>
                                </Tooltip>
                                <Menu
                                  anchorEl={exportMenuAnchor}
                                  open={Boolean(exportMenuAnchor)}
                                  onClose={() => setExportMenuAnchor(null)}
                                  PaperProps={{ sx: { borderRadius: 0 } }}
                                >
                                  <MenuItem onClick={() => { handleExportCSV(); setExportMenuAnchor(null); }} sx={{ borderRadius: 0 }}>
                                    <ListItemIcon><DownloadIcon fontSize="small" /></ListItemIcon>
                                    <ListItemText>Export to CSV</ListItemText>
                                  </MenuItem>
                                  <MenuItem onClick={() => { handleExportJSON(); setExportMenuAnchor(null); }} sx={{ borderRadius: 0 }}>
                                    <ListItemIcon><CodeIcon fontSize="small" /></ListItemIcon>
                                    <ListItemText>Export to JSON</ListItemText>
                                  </MenuItem>
                                  <Divider />
                                  {/* Phase 3: Additional Export Formats */}
                                  <MenuItem onClick={() => { handleExportExcel(); setExportMenuAnchor(null); }} sx={{ borderRadius: 0 }}>
                                    <ListItemIcon><DownloadIcon fontSize="small" /></ListItemIcon>
                                    <ListItemText>Export to Excel (CSV)</ListItemText>
                                  </MenuItem>
                                  <MenuItem onClick={() => { handleExportSQL(); setExportMenuAnchor(null); }} sx={{ borderRadius: 0 }}>
                                    <ListItemIcon><CodeIcon fontSize="small" /></ListItemIcon>
                                    <ListItemText>Export to SQL INSERT</ListItemText>
                                  </MenuItem>
                                  <MenuItem onClick={() => { handleExportMarkdown(); setExportMenuAnchor(null); }} sx={{ borderRadius: 0 }}>
                                    <ListItemIcon><CodeIcon fontSize="small" /></ListItemIcon>
                                    <ListItemText>Export to Markdown</ListItemText>
                                  </MenuItem>
                                </Menu>
                            </Box>
                          </Box>

                          {/* Results Table */}
                          <Box sx={{ flex: 1, overflow: 'auto', minHeight: 0 }}>
                            <TableContainer>
                              <Table 
                                size="small" 
                                stickyHeader
                                sx={{
                                  '& .MuiTableCell-root': {
                                    borderRight: `1px solid ${theme.palette.divider}`,
                                    '&:last-child': {
                                      borderRight: 'none'
                                    }
                                  }
                                }}
                              >
                                <TableHead>
                                  <TableRow>
                                    <TableCell 
                                      sx={{ 
                                        fontWeight: 600,
                                        bgcolor: alpha(theme.palette.primary.main, 0.1),
                                        position: 'sticky',
                                        top: 0,
                                        zIndex: 1,
                                        width: 60,
                                        minWidth: 60
                                      }}
                                    >
                                      #
                                    </TableCell>
                                    {queryResults.columns.map((col) => (
                                      <TableCell 
                                        key={col}
                                        sx={{ 
                                          fontWeight: 600,
                                          bgcolor: alpha(theme.palette.primary.main, 0.1),
                                          position: 'sticky',
                                          top: 0,
                                          zIndex: 1
                                        }}
                                      >
                                        {col}
                                      </TableCell>
                                    ))}
                                  </TableRow>
                                </TableHead>
                                <TableBody>
                                  {queryResults.data.length > 0 ? (
                                    queryResults.data.map((row, idx) => (
                                      <TableRow 
                                        key={idx}
                                        sx={{
                                          '&:nth-of-type(even)': {
                                            bgcolor: alpha(theme.palette.action.hover, 0.3)
                                          },
                                          '&:hover': {
                                            bgcolor: alpha(theme.palette.action.hover, 0.5)
                                          }
                                        }}
                                      >
                                        <TableCell 
                                          sx={{ 
                                            fontFamily: 'monospace',
                                            fontSize: '0.75rem',
                                            color: 'text.secondary',
                                            bgcolor: alpha(theme.palette.action.hover, 0.2),
                                            fontWeight: 600
                                          }}
                                        >
                                          {idx + 1}
                                        </TableCell>
                                        {queryResults.columns.map((col) => (
                                          <TableCell 
                                            key={col}
                                            sx={{ 
                                              fontFamily: 'monospace',
                                              fontSize: '0.85rem',
                                              maxWidth: 300,
                                              overflow: 'hidden',
                                              textOverflow: 'ellipsis',
                                              whiteSpace: 'nowrap',
                                              cursor: 'pointer',
                                              position: 'relative',
                                              '&:hover': {
                                                '& .copy-icon': {
                                                  display: 'block'
                                                }
                                              }
                                            }}
                                            title={row[col] !== null ? String(row[col]) : 'NULL'}
                                            onClick={() => {
                                              const value = row[col] !== null ? String(row[col]) : 'NULL';
                                              navigator.clipboard.writeText(value).then(() => {
                                                // Phase 1: Show toast notification
                                                showToast('Copied to clipboard', 'success');
                                              });
                                            }}
                                          >
                                            {row[col] !== null ? String(row[col]) : (
                                              <Typography component="span" sx={{ color: 'text.secondary', fontStyle: 'italic' }}>
                                                NULL
                                              </Typography>
                                            )}
                                            <IconButton
                                              size="small"
                                              className="copy-icon"
                                              sx={{
                                                display: 'none',
                                                position: 'absolute',
                                                right: 4,
                                                top: '50%',
                                                transform: 'translateY(-50%)',
                                                p: 0.5,
                                                bgcolor: 'background.paper',
                                                '&:hover': {
                                                  bgcolor: 'action.hover'
                                                }
                                              }}
                                              onClick={(e) => {
                                                e.stopPropagation();
                                                const value = row[col] !== null ? String(row[col]) : 'NULL';
                                                navigator.clipboard.writeText(value).then(() => {
                                                  // Phase 1: Show toast notification
                                                  showToast('Copied to clipboard', 'success');
                                                });
                                              }}
                                            >
                                              <CopyIcon fontSize="small" />
                                            </IconButton>
                                          </TableCell>
                                        ))}
                                      </TableRow>
                                    ))
                                  ) : (
                                    <TableRow>
                                      <TableCell 
                                        colSpan={queryResults.columns.length + 1} 
                                        align="center"
                                        sx={{ py: 4, color: 'text.secondary' }}
                                      >
                                        <Typography variant="body2">No results returned</Typography>
                                      </TableCell>
                                    </TableRow>
                                  )}
                                </TableBody>
                              </Table>
                            </TableContainer>
                          </Box>
                        </Paper>
                      )}

                      {/* Empty State when no results */}
                      {!queryResults && !queryLoading && (
                        <Paper 
                          sx={{ 
                            p: 4, 
                            textAlign: 'center',
                            borderRadius: 0,
                            border: `1px solid ${theme.palette.divider}`,
                            bgcolor: alpha(theme.palette.action.hover, 0.2)
                          }}
                        >
                          <QueryIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 2, opacity: 0.5 }} />
                          <Typography variant="h6" color="text.secondary" sx={{ mb: 1 }}>
                            No query executed yet
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Enter a SELECT query above and click "Execute" to see results
                          </Typography>
                        </Paper>
                      )}
                    </Box>
                  )}
                  
                  {activeTab === 4 && databaseInfo && (
                    <Box>
                      <Typography variant="h6" sx={{ mb: 2 }}>Database Information</Typography>
                      <Grid container spacing={2}>
                        <Grid item xs={12} md={6}>
                          <Card>
                            <CardContent>
                              <Typography variant="subtitle2" color="text.secondary">Database Name</Typography>
                              <Typography variant="h6">{databaseInfo.database_name}</Typography>
                            </CardContent>
                          </Card>
                        </Grid>
                        <Grid item xs={12} md={6}>
                          <Card>
                            <CardContent>
                              <Typography variant="subtitle2" color="text.secondary">Engine</Typography>
                              <Typography variant="h6">{databaseInfo.engine}</Typography>
                            </CardContent>
                          </Card>
                        </Grid>
                        <Grid item xs={12} md={6}>
                          <Card>
                            <CardContent>
                              <Typography variant="subtitle2" color="text.secondary">Version</Typography>
                              <Typography variant="h6">{databaseInfo.version}</Typography>
                            </CardContent>
                          </Card>
                        </Grid>
                        {databaseInfo.performance && (
                          <Grid item xs={12} md={6}>
                            <Card>
                              <CardContent>
                                <Typography variant="subtitle2" color="text.secondary">Active Connections</Typography>
                                <Typography variant="h6">{databaseInfo.performance.active_connections || 'N/A'}</Typography>
                              </CardContent>
                            </Card>
                          </Grid>
                        )}
                      </Grid>
                    </Box>
                  )}
                </Box>
              </Paper>
            ) : (
              <Paper 
                sx={{ 
                  p: 6, 
                  textAlign: 'center', 
                  borderRadius: 0,
                  boxShadow: theme.shadows[2],
                  border: `1px solid ${theme.palette.divider}`,
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  alignItems: 'center',
                  flex: 1,
                }}
              >
                <TableIcon sx={{ fontSize: 80, color: 'text.secondary', mb: 2, opacity: 0.5 }} />
                <Typography variant="h5" color="text.secondary" sx={{ mb: 1 }}>
                  Select a table to view its details
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Browse tables from the sidebar to get started
                </Typography>
              </Paper>
            )}
          </Grid>
        </Grid>
      </Box>

      {/* Phase 1: Toast Notifications (Snackbar) */}
      <Snackbar
        open={toast.open}
        autoHideDuration={toast.severity === 'error' ? 6000 : 4000}
        onClose={handleCloseToast}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        sx={{ borderRadius: 0 }}
      >
        <Alert
          onClose={handleCloseToast}
          severity={toast.severity}
          variant="filled"
          sx={{ 
            width: '100%',
            borderRadius: 0,
            '& .MuiAlert-icon': {
              fontSize: '1.25rem'
            }
          }}
          iconMapping={{
            success: <CheckCircleIcon />,
            error: <ErrorIcon />,
            warning: <ErrorIcon />,
            info: <InfoIcon />
          }}
        >
          {toast.message}
        </Alert>
      </Snackbar>

      {/* Phase 1: Column Visibility Dialog */}
      <Dialog
        open={columnVisibilityDialogOpen}
        onClose={() => setColumnVisibilityDialogOpen(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: { borderRadius: 0 }
        }}
      >
        <DialogTitle sx={{ bgcolor: theme.palette.primary.main, color: 'white' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <ColumnIcon />
              <Typography variant="h6" fontWeight="bold">
                Column Visibility
              </Typography>
            </Box>
            <IconButton
              onClick={() => setColumnVisibilityDialogOpen(false)}
              sx={{ color: 'white' }}
              size="small"
            >
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent sx={{ p: 2, mt: 2 }}>
          {tablePreview && tablePreview.columns ? (
            <>
              <Box sx={{ display: 'flex', gap: 2, mb: 2, pb: 2, borderBottom: `1px solid ${theme.palette.divider}` }}>
                <Button
                  size="small"
                  onClick={handleShowAllColumns}
                  sx={{ borderRadius: 0 }}
                  variant="outlined"
                >
                  Show All
                </Button>
                <Button
                  size="small"
                  onClick={handleHideAllColumns}
                  sx={{ borderRadius: 0 }}
                  variant="outlined"
                >
                  Hide All
                </Button>
              </Box>
              <List dense>
                {tablePreview.columns.map((col) => {
                  const tableKey = selectedTable;
                  const isVisible = visibleColumns[tableKey]?.[col] !== false;
                  return (
                    <ListItem key={col} disablePadding sx={{ mb: 0.5 }}>
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={isVisible}
                            onChange={() => handleToggleColumnVisibility(col)}
                            sx={{ borderRadius: 0 }}
                          />
                        }
                        label={
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            {isVisible ? (
                              <ViewIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                            ) : (
                              <VisibilityOffIcon sx={{ fontSize: 16, color: 'text.disabled' }} />
                            )}
                            <Typography variant="body2">{col}</Typography>
                          </Box>
                        }
                        sx={{ width: '100%', m: 0 }}
                      />
                    </ListItem>
                  );
                })}
              </List>
            </>
          ) : (
            <Typography color="text.secondary">No columns available</Typography>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 2, borderTop: `1px solid ${theme.palette.divider}` }}>
          <Button
            onClick={() => setColumnVisibilityDialogOpen(false)}
            variant="contained"
            sx={{ borderRadius: 0 }}
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>

      {/* Phase 2: Query Templates Dialog */}
      <Dialog
        open={templateDialogOpen}
        onClose={() => setTemplateDialogOpen(false)}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: { borderRadius: 0 }
        }}
      >
        <DialogTitle sx={{ bgcolor: theme.palette.primary.main, color: 'white' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <TemplateIcon />
              <Typography variant="h6" fontWeight="bold">
                Query Templates
              </Typography>
            </Box>
            <IconButton
              onClick={() => setTemplateDialogOpen(false)}
              sx={{ color: 'white' }}
              size="small"
            >
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent sx={{ p: 2, mt: 2 }}>
          <List>
            {queryTemplates.map((template, idx) => (
              <ListItem
                key={idx}
                sx={{
                  border: `1px solid ${theme.palette.divider}`,
                  borderRadius: 0,
                  mb: 1,
                  '&:hover': {
                    bgcolor: alpha(theme.palette.primary.main, 0.05)
                  }
                }}
              >
                <ListItemButton
                  onClick={() => handleApplyTemplate(template)}
                  sx={{ borderRadius: 0 }}
                >
                  <ListItemIcon>
                    <TemplateIcon color="primary" />
                  </ListItemIcon>
                  <ListItemText
                    primary={template.name}
                    secondary={template.description}
                    primaryTypographyProps={{ fontWeight: 600 }}
                  />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </DialogContent>
        <DialogActions sx={{ p: 2, borderTop: `1px solid ${theme.palette.divider}` }}>
          <Button
            onClick={() => setTemplateDialogOpen(false)}
            variant="contained"
            sx={{ borderRadius: 0 }}
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>

      {/* Phase 2: Query Bookmarks Dialog */}
      <Dialog
        open={bookmarkDialogOpen}
        onClose={() => {
          setBookmarkDialogOpen(false);
          setBookmarkName('');
          setBookmarkDescription('');
        }}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: { borderRadius: 0 }
        }}
      >
        <DialogTitle sx={{ bgcolor: theme.palette.primary.main, color: 'white' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <BookmarkIcon />
              <Typography variant="h6" fontWeight="bold">
                Query Bookmarks
              </Typography>
            </Box>
            <IconButton
              onClick={() => {
                setBookmarkDialogOpen(false);
                setBookmarkName('');
                setBookmarkDescription('');
              }}
              sx={{ color: 'white' }}
              size="small"
            >
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent sx={{ p: 2, mt: 2 }}>
          {/* Save Bookmark Form */}
          {sqlQuery.trim() && (
            <Box sx={{ mb: 3, p: 2, bgcolor: alpha(theme.palette.primary.main, 0.05), borderRadius: 0, border: `1px solid ${theme.palette.divider}` }}>
              <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 600 }}>
                Save Current Query
              </Typography>
              <TextField
                fullWidth
                size="small"
                label="Bookmark Name"
                value={bookmarkName}
                onChange={(e) => setBookmarkName(e.target.value)}
                placeholder="Enter bookmark name"
                sx={{ mb: 2, '& .MuiOutlinedInput-root': { borderRadius: 0 } }}
                required
              />
              <TextField
                fullWidth
                size="small"
                label="Description (optional)"
                value={bookmarkDescription}
                onChange={(e) => setBookmarkDescription(e.target.value)}
                placeholder="Enter description"
                multiline
                rows={2}
                sx={{ mb: 2, '& .MuiOutlinedInput-root': { borderRadius: 0 } }}
              />
              <Button
                variant="contained"
                onClick={handleSaveBookmark}
                disabled={!bookmarkName.trim()}
                startIcon={<SaveIcon />}
                sx={{ borderRadius: 0 }}
                fullWidth
              >
                Save Bookmark
              </Button>
            </Box>
          )}

          {/* Bookmarks List */}
          <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 600 }}>
            Saved Bookmarks ({queryBookmarks.length})
          </Typography>
          {queryBookmarks.length === 0 ? (
            <Typography color="text.secondary" sx={{ textAlign: 'center', py: 4 }}>
              No bookmarks saved yet
            </Typography>
          ) : (
            <List>
              {queryBookmarks.map((bookmark) => (
                <ListItem
                  key={bookmark.id}
                  sx={{
                    border: `1px solid ${theme.palette.divider}`,
                    borderRadius: 0,
                    mb: 1,
                    '&:hover': {
                      bgcolor: alpha(theme.palette.primary.main, 0.05)
                    }
                  }}
                >
                  <ListItemButton
                    onClick={() => handleLoadBookmark(bookmark)}
                    sx={{ borderRadius: 0 }}
                  >
                    <ListItemIcon>
                      <StarIcon color="primary" />
                    </ListItemIcon>
                    <ListItemText
                      primary={bookmark.name}
                      secondary={bookmark.description || bookmark.query.substring(0, 50) + '...'}
                      primaryTypographyProps={{ fontWeight: 600 }}
                    />
                  </ListItemButton>
                  <IconButton
                    onClick={() => handleDeleteBookmark(bookmark.id)}
                    size="small"
                    color="error"
                    sx={{ borderRadius: 0 }}
                  >
                    <DeleteIcon />
                  </IconButton>
                </ListItem>
              ))}
            </List>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 2, borderTop: `1px solid ${theme.palette.divider}` }}>
          <Button
            onClick={() => {
              setBookmarkDialogOpen(false);
              setBookmarkName('');
              setBookmarkDescription('');
            }}
            variant="contained"
            sx={{ borderRadius: 0 }}
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>

      {/* Phase 2: EXPLAIN Query Plan Dialog */}
      <Dialog
        open={showExplainPlan && explainPlan}
        onClose={() => setShowExplainPlan(false)}
        maxWidth="lg"
        fullWidth
        PaperProps={{
          sx: { borderRadius: 0 }
        }}
      >
        <DialogTitle sx={{ bgcolor: theme.palette.info.main, color: 'white' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <ExplainIcon />
              <Typography variant="h6" fontWeight="bold">
                Query Execution Plan
              </Typography>
            </Box>
            <IconButton
              onClick={() => setShowExplainPlan(false)}
              sx={{ color: 'white' }}
              size="small"
            >
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent sx={{ p: 2, mt: 2 }}>
          {explainPlan && (
            <Box>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Plan Type: <strong>{explainPlan.plan_type}</strong>
              </Typography>
              <TableContainer>
                <Table size="small" sx={{ '& .MuiTableCell-root': { fontFamily: 'monospace', fontSize: '0.85rem' } }}>
                  <TableHead>
                    <TableRow>
                      {explainPlan.columns.map((col) => (
                        <TableCell key={col} sx={{ fontWeight: 600 }}>
                          {col}
                        </TableCell>
                      ))}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {explainPlan.data.map((row, idx) => (
                      <TableRow key={idx}>
                        {explainPlan.columns.map((col) => (
                          <TableCell key={col}>
                            {row[col] !== null ? String(row[col]) : 'NULL'}
                          </TableCell>
                        ))}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 2, borderTop: `1px solid ${theme.palette.divider}` }}>
          <Button
            onClick={() => setShowExplainPlan(false)}
            variant="contained"
            sx={{ borderRadius: 0 }}
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>

      {/* Phase 3: Advanced Data Filter Dialog */}
      <Dialog
        open={filterDialogOpen}
        onClose={() => setFilterDialogOpen(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: { borderRadius: 0 }
        }}
      >
        <DialogTitle sx={{ bgcolor: theme.palette.primary.main, color: 'white' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <FilterIcon />
              <Typography variant="h6" fontWeight="bold">
                Column Filters
              </Typography>
            </Box>
            <IconButton
              onClick={() => setFilterDialogOpen(false)}
              sx={{ color: 'white' }}
              size="small"
            >
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent sx={{ p: 2, mt: 2 }}>
          {/* Active Filters */}
          {Object.keys(dataFilters).filter(col => dataFilters[col]?.value).length > 0 && (
            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
                Active Filters
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {Object.keys(dataFilters)
                  .filter(col => dataFilters[col]?.value)
                  .map(column => (
                    <Chip
                      key={column}
                      label={`${column}: ${dataFilters[column].type} "${dataFilters[column].value}"`}
                      onDelete={() => handleRemoveFilter(column)}
                      color="primary"
                      variant="outlined"
                      sx={{ borderRadius: 0 }}
                    />
                  ))}
              </Box>
              <Button
                size="small"
                onClick={handleClearAllFilters}
                startIcon={<ClearIcon />}
                sx={{ mt: 1, borderRadius: 0 }}
                color="error"
              >
                Clear All Filters
              </Button>
            </Box>
          )}

          {/* Add New Filter */}
          <Box sx={{ borderTop: `1px solid ${theme.palette.divider}`, pt: 2 }}>
            <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 600 }}>
              Add Filter
            </Typography>
            <FormControl fullWidth size="small" sx={{ mb: 2 }}>
              <InputLabel>Column</InputLabel>
              <Select
                value={filterColumn}
                onChange={(e) => setFilterColumn(e.target.value)}
                label="Column"
                sx={{ borderRadius: 0 }}
              >
                {tablePreview?.columns.map(col => (
                  <MenuItem key={col} value={col}>{col}</MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl fullWidth size="small" sx={{ mb: 2 }}>
              <InputLabel>Filter Type</InputLabel>
              <Select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                label="Filter Type"
                sx={{ borderRadius: 0 }}
              >
                <MenuItem value="contains">Contains</MenuItem>
                <MenuItem value="equals">Equals</MenuItem>
                <MenuItem value="startsWith">Starts With</MenuItem>
                <MenuItem value="endsWith">Ends With</MenuItem>
                <MenuItem value="greaterThan">Greater Than</MenuItem>
                <MenuItem value="lessThan">Less Than</MenuItem>
              </Select>
            </FormControl>
            <TextField
              fullWidth
              size="small"
              label="Filter Value"
              value={filterValue}
              onChange={(e) => setFilterValue(e.target.value)}
              placeholder="Enter filter value"
              sx={{ mb: 2, '& .MuiOutlinedInput-root': { borderRadius: 0 } }}
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  handleAddFilter();
                }
              }}
            />
            <Button
              variant="contained"
              onClick={handleAddFilter}
              disabled={!filterColumn || !filterValue.trim()}
              fullWidth
              sx={{ borderRadius: 0 }}
            >
              Add Filter
            </Button>
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 2, borderTop: `1px solid ${theme.palette.divider}` }}>
          <Button
            onClick={() => setFilterDialogOpen(false)}
            variant="contained"
            sx={{ borderRadius: 0 }}
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>

      {/* Phase 3: Query Performance Dashboard Dialog */}
      <Dialog
        open={performanceDashboardOpen}
        onClose={() => setPerformanceDashboardOpen(false)}
        maxWidth="lg"
        fullWidth
        PaperProps={{
          sx: { borderRadius: 0 }
        }}
      >
        <DialogTitle sx={{ bgcolor: theme.palette.secondary.main, color: 'white' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <DashboardIcon />
              <Typography variant="h6" fontWeight="bold">
                Query Performance Dashboard
              </Typography>
            </Box>
            <IconButton
              onClick={() => setPerformanceDashboardOpen(false)}
              sx={{ color: 'white' }}
              size="small"
            >
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent sx={{ p: 2, mt: 2 }}>
          {queryPerformanceLog.length === 0 ? (
            <Box sx={{ textAlign: 'center', py: 8 }}>
              <TimelineIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2, opacity: 0.5 }} />
              <Typography variant="h6" color="text.secondary" sx={{ mb: 1 }}>
                No query performance data yet
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Execute some queries to see performance metrics
              </Typography>
            </Box>
          ) : (
            <Box>
              {/* Statistics Cards */}
              <Grid container spacing={2} sx={{ mb: 3 }}>
                <Grid item xs={12} sm={6} md={3}>
                  <Card sx={{ borderRadius: 0 }}>
                    <CardContent>
                      <Typography variant="subtitle2" color="text.secondary">Total Queries</Typography>
                      <Typography variant="h4">{performanceStats.totalQueries}</Typography>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Card sx={{ borderRadius: 0 }}>
                    <CardContent>
                      <Typography variant="subtitle2" color="text.secondary">Average Time</Typography>
                      <Typography variant="h4">{performanceStats.averageTime}s</Typography>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Card sx={{ borderRadius: 0 }}>
                    <CardContent>
                      <Typography variant="subtitle2" color="text.secondary">Slowest Query</Typography>
                      <Typography variant="h6">{performanceStats.slowestQuery?.executionTime.toFixed(3)}s</Typography>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Card sx={{ borderRadius: 0 }}>
                    <CardContent>
                      <Typography variant="subtitle2" color="text.secondary">Fastest Query</Typography>
                      <Typography variant="h6">{performanceStats.fastestQuery?.executionTime.toFixed(3)}s</Typography>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>

              {/* Query Performance Table */}
              <Typography variant="h6" sx={{ mb: 2 }}>Query Performance Log</Typography>
              <TableContainer>
                <Table size="small" sx={{ '& .MuiTableCell-root': { fontFamily: 'monospace', fontSize: '0.85rem' } }}>
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ fontWeight: 600 }}>Query</TableCell>
                      <TableCell sx={{ fontWeight: 600 }} align="right">Execution Time</TableCell>
                      <TableCell sx={{ fontWeight: 600 }} align="right">Rows</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>Timestamp</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {queryPerformanceLog.map((entry) => (
                      <TableRow key={entry.id}>
                        <TableCell sx={{ maxWidth: 400, overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {entry.query}
                        </TableCell>
                        <TableCell align="right">
                          <Chip
                            label={`${entry.executionTime.toFixed(3)}s`}
                            size="small"
                            color={entry.executionTime > 1 ? 'error' : entry.executionTime > 0.5 ? 'warning' : 'success'}
                            sx={{ borderRadius: 0 }}
                          />
                        </TableCell>
                        <TableCell align="right">{entry.rowCount}</TableCell>
                        <TableCell>
                          {new Date(entry.timestamp).toLocaleString()}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 2, borderTop: `1px solid ${theme.palette.divider}` }}>
          <Button
            onClick={() => {
              setQueryPerformanceLog([]);
              try {
                localStorage.removeItem('dbClient_queryPerformanceLog');
              } catch (err) {
                console.error('Error clearing performance log:', err);
              }
              showToast('Performance log cleared', 'success');
            }}
            disabled={queryPerformanceLog.length === 0}
            sx={{ borderRadius: 0 }}
            color="error"
          >
            Clear Log
          </Button>
          <Button
            onClick={() => setPerformanceDashboardOpen(false)}
            variant="contained"
            sx={{ borderRadius: 0 }}
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default DatabaseClientPage;

