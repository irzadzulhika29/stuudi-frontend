"use client";

import React from "react";

// Interface untuk definisi kolom
export interface TableColumn {
  key: string;
  header: string;
  render?: (row: Record<string, unknown>, index?: number) => React.ReactNode;
}

// Interface untuk props DataTable
export interface DataTableProps {
  columns: TableColumn[];
  data: Record<string, unknown>[];
}

export function DataTable({ columns, data }: DataTableProps) {
  return (
    <div className="overflow-hidden rounded-xl bg-white shadow-lg">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-gradient-to-r from-[#F5A623] to-[#F7B731]">
              {columns.map((column) => (
                <th
                  key={column.key}
                  className="px-6 py-4 text-center text-sm font-semibold text-white"
                >
                  {column.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 bg-white">
            {data.map((row, rowIndex) => (
              <tr key={rowIndex} className="transition-colors duration-200 hover:bg-gray-50">
                {columns.map((column) => (
                  <td key={column.key} className="px-6 py-4 text-center text-sm text-gray-600">
                    {column.render ? column.render(row, rowIndex) : String(row[column.key] ?? "")}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
