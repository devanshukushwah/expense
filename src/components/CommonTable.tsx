"use client";

import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  TablePagination,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

// Define column type
export interface Column {
  id: string;
  label: string;
  pr?: string; // Optional prefix, e.g., currency symbol
  width?: number | string; // Optional width for the column
}

// Define props type
interface ReusableTableProps<T> {
  columns: Column[];
  data: T[];
  count: number;
  page: number;
  rowsPerPage: number;
  onPageChange: (event: unknown, newPage: number) => void;
  onRowsPerPageChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onEdit?: (row: any) => void;
  onDelete?: (row: any) => void;
}

/**
 * ReusableTable Component
 *
 * @param {Array} columns - Array of column definitions [{ id: "name", label: "Name" }]
 * @param {Array} data - Array of row objects [{ name: "John", age: 25 }]
 */
const CommonTable = <T extends Record<string, any>>({
  columns = [],
  data = [],
  count,
  page,
  rowsPerPage,
  onPageChange,
  onRowsPerPageChange,
  onEdit,
  onDelete,
}: ReusableTableProps<T>) => {
  return (
    <TableContainer component={Paper} sx={{ boxShadow: 3, borderRadius: 2 }}>
      <Table sx={{ minWidth: 650 }}>
        <TableHead>
          <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
            {columns.map((col) => (
              <TableCell
                key={col.id}
                sx={{
                  fontWeight: "bold",
                  color: "#333",
                  fontSize: "1rem",
                  borderBottom: "2px solid #e0e0e0",
                }}
                align="left"
                width={col.width}
              >
                {col.label}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {data.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={columns.length}
                align="center"
                sx={{ color: "#888" }}
              >
                No data available
              </TableCell>
            </TableRow>
          ) : (
            data.map((row, rowIndex) => (
              <TableRow
                key={rowIndex}
                sx={{
                  "&:nth-of-type(odd)": { backgroundColor: "#fafafa" },
                  "&:hover": { backgroundColor: "#f0f7ff" },
                  transition: "background 0.2s",
                }}
              >
                {columns.map((col) =>
                  col.label === "Action" ? (
                    <TableCell key={col.id}>
                      {(onEdit || onDelete) && (
                        <>
                          {onEdit && (
                            <IconButton
                              onClick={() => onEdit(row)}
                              color="primary"
                            >
                              <EditIcon />
                            </IconButton>
                          )}
                          {onDelete && (
                            <IconButton
                              onClick={() => onDelete(row)}
                              color="error"
                            >
                              <DeleteIcon />
                            </IconButton>
                          )}
                        </>
                      )}
                    </TableCell>
                  ) : (
                    <TableCell key={col.id} sx={{ color: "#444" }}>
                      {col.pr} {row[col.id]}
                    </TableCell>
                  )
                )}
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
      <TablePagination
        rowsPerPageOptions={[10, 25, 50, 100]}
        component="div"
        count={count}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={onPageChange}
        onRowsPerPageChange={onRowsPerPageChange}
      />
    </TableContainer>
  );
};

export default CommonTable;

/**
 * Example usage:
 *
 * interface User {
 *   name: string;
 *   age: number;
 *   email: string;
 * }
 *
 * const columns: Column[] = [
 *   { id: "name", label: "Name" },
 *   { id: "age", label: "Age" },
 *   { id: "email", label: "Email" },
 * ];
 *
 * const data: User[] = [
 *   { name: "John Doe", age: 28, email: "john@example.com" },
 *   { name: "Jane Smith", age: 34, email: "jane@example.com" },
 * ];
 *
 * <ReusableTable<User> columns={columns} data={data} />
 */
