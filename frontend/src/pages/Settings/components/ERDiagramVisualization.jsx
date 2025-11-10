import React, { useMemo } from 'react';
import { Box, Typography, Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import { alpha, useTheme } from '@mui/material/styles';

/**
 * Simple SVG-based ER Diagram Visualization Component
 * Displays tables as boxes and relationships as lines
 */
const ERDiagramVisualization = ({ 
  relationships, 
  tables, 
  selectedTable, 
  onTableClick,
  onTableSelect 
}) => {
  const theme = useTheme();

  // Get unique tables from relationships
  const diagramTables = useMemo(() => {
    const tableSet = new Set();
    relationships.forEach(rel => {
      tableSet.add(rel.from_table);
      tableSet.add(rel.to_table);
    });
    return Array.from(tableSet);
  }, [relationships]);

  // Simple layout: arrange tables in a grid
  const tablePositions = useMemo(() => {
    const positions = {};
    const cols = Math.ceil(Math.sqrt(diagramTables.length));
    diagramTables.forEach((table, idx) => {
      const row = Math.floor(idx / cols);
      const col = idx % cols;
      positions[table] = {
        x: col * 220 + 50,
        y: row * 150 + 50,
        width: 200,
        height: 120
      };
    });
    return positions;
  }, [diagramTables]);

  // Calculate relationship lines
  const relationshipLines = useMemo(() => {
    return relationships.map((rel, idx) => {
      const fromPos = tablePositions[rel.from_table];
      const toPos = tablePositions[rel.to_table];
      
      if (!fromPos || !toPos) return null;
      
      // Calculate line start and end points (center-right of from table, center-left of to table)
      const fromX = fromPos.x + fromPos.width;
      const fromY = fromPos.y + fromPos.height / 2;
      const toX = toPos.x;
      const toY = toPos.y + toPos.height / 2;
      
      return {
        id: idx,
        fromX,
        fromY,
        toX,
        toY,
        fromTable: rel.from_table,
        toTable: rel.to_table,
        fromColumn: rel.from_column,
        toColumn: rel.to_column
      };
    }).filter(Boolean);
  }, [relationships, tablePositions]);

  // Calculate SVG dimensions
  const svgDimensions = useMemo(() => {
    if (diagramTables.length === 0) return { width: 800, height: 400 };
    
    const maxX = Math.max(...Object.values(tablePositions).map(pos => pos.x + pos.width));
    const maxY = Math.max(...Object.values(tablePositions).map(pos => pos.y + pos.height));
    
    return {
      width: Math.max(800, maxX + 100),
      height: Math.max(400, maxY + 100)
    };
  }, [tablePositions, diagramTables]);

  if (diagramTables.length === 0) {
    return (
      <Box sx={{ textAlign: 'center', py: 8 }}>
        <Typography variant="h6" color="text.secondary">
          No relationships to display
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          Select a table or view all relationships
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ position: 'relative', width: '100%', height: '100%', minHeight: 500 }}>
      {/* Filter Controls */}
      <Box sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 2 }}>
        <FormControl size="small" sx={{ minWidth: 200 }}>
          <InputLabel>Filter by Table</InputLabel>
          <Select
            value={selectedTable || ''}
            onChange={(e) => onTableSelect(e.target.value || null)}
            label="Filter by Table"
            sx={{ borderRadius: 0 }}
          >
            <MenuItem value="">All Tables</MenuItem>
            {diagramTables.map(table => (
              <MenuItem key={table} value={table}>{table}</MenuItem>
            ))}
          </Select>
        </FormControl>
        <Typography variant="body2" color="text.secondary">
          {diagramTables.length} table(s) • {relationships.length} relationship(s)
        </Typography>
      </Box>

      {/* SVG Diagram */}
      <Box sx={{ 
        border: `1px solid ${theme.palette.divider}`, 
        borderRadius: 0,
        bgcolor: alpha(theme.palette.background.paper, 0.5),
        overflow: 'auto',
        width: '100%',
        height: 'calc(100% - 60px)',
        minHeight: 450
      }}>
        <svg
          width={svgDimensions.width}
          height={svgDimensions.height}
          style={{ display: 'block' }}
        >
          {/* Draw relationship lines */}
          {relationshipLines.map(line => (
            <g key={line.id}>
              <line
                x1={line.fromX}
                y1={line.fromY}
                x2={line.toX}
                y2={line.toY}
                stroke={theme.palette.primary.main}
                strokeWidth="2"
                markerEnd="url(#arrowhead)"
              />
              {/* Relationship label */}
              <text
                x={(line.fromX + line.toX) / 2}
                y={(line.fromY + line.toY) / 2 - 5}
                fill={theme.palette.text.secondary}
                fontSize="10"
                textAnchor="middle"
                style={{ pointerEvents: 'none' }}
              >
                {line.fromColumn} → {line.toColumn}
              </text>
            </g>
          ))}
          
          {/* Arrow marker definition */}
          <defs>
            <marker
              id="arrowhead"
              markerWidth="10"
              markerHeight="10"
              refX="9"
              refY="3"
              orient="auto"
            >
              <polygon
                points="0 0, 10 3, 0 6"
                fill={theme.palette.primary.main}
              />
            </marker>
          </defs>

          {/* Draw table boxes */}
          {diagramTables.map(table => {
            const pos = tablePositions[table];
            const tableInfo = tables.find(t => t.name === table);
            const isSelected = selectedTable === table;
            
            return (
              <g key={table}>
                {/* Table box */}
                <rect
                  x={pos.x}
                  y={pos.y}
                  width={pos.width}
                  height={pos.height}
                  fill={isSelected ? alpha(theme.palette.primary.main, 0.1) : theme.palette.background.paper}
                  stroke={isSelected ? theme.palette.primary.main : theme.palette.divider}
                  strokeWidth={isSelected ? 2 : 1}
                  rx="0"
                  style={{ cursor: 'pointer' }}
                  onClick={() => onTableClick(table)}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.fill = alpha(theme.palette.primary.main, 0.15);
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.fill = isSelected 
                      ? alpha(theme.palette.primary.main, 0.1) 
                      : theme.palette.background.paper;
                  }}
                />
                {/* Table name */}
                <text
                  x={pos.x + pos.width / 2}
                  y={pos.y + 25}
                  fill={theme.palette.text.primary}
                  fontSize="14"
                  fontWeight="600"
                  textAnchor="middle"
                  style={{ pointerEvents: 'none', cursor: 'pointer' }}
                  onClick={() => onTableClick(table)}
                >
                  {table}
                </text>
                {/* Table info */}
                {tableInfo && (
                  <text
                    x={pos.x + pos.width / 2}
                    y={pos.y + 45}
                    fill={theme.palette.text.secondary}
                    fontSize="11"
                    textAnchor="middle"
                    style={{ pointerEvents: 'none' }}
                  >
                    {tableInfo.row_count || 0} rows • {tableInfo.column_count || 0} cols
                  </text>
                )}
                {/* Click hint */}
                <text
                  x={pos.x + pos.width / 2}
                  y={pos.y + pos.height - 10}
                  fill={theme.palette.primary.main}
                  fontSize="10"
                  textAnchor="middle"
                  style={{ pointerEvents: 'none', fontStyle: 'italic' }}
                >
                  Click to view
                </text>
              </g>
            );
          })}
        </svg>
      </Box>
    </Box>
  );
};

export default ERDiagramVisualization;

