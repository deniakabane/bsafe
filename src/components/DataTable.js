"use client";

import { useState } from "react";
import { useReactTable, getCoreRowModel, flexRender } from "@tanstack/react-table";

export default function DataTable({ data }) {
  const columns = [
    {
      accessorKey: "id",
      header: "ID",
    },
    {
      accessorKey: "name",
      header: "Nama",
    },
    {
      accessorKey: "email",
      header: "Email",
    },
  ];

  const [rowData] = useState(data);
  const table = useReactTable({
    data: rowData,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <table className="border-collapse border w-full text-left">
      <thead>
        {table.getHeaderGroups().map((headerGroup) => (
          <tr key={headerGroup.id} className="border">
            {headerGroup.headers.map((header) => (
              <th key={header.id} className="border p-2">
                {flexRender(header.column.columnDef.header, header.getContext())}
              </th>
            ))}
          </tr>
        ))}
      </thead>
      <tbody>
        {table.getRowModel().rows.map((row) => (
          <tr key={row.id} className="border">
            {row.getVisibleCells().map((cell) => (
              <td key={cell.id} className="border p-2">
                {flexRender(cell.column.columnDef.cell, cell.getContext())}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
