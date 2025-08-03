"use client";

import { ColumnDef } from "@tanstack/react-table";

import { CellAction } from "./cell-action";

export type CategoryColumn = {
  id: string;
  name: string;
  billboardLabel: string;
  billboardId: string;
  isActive: boolean;
  createdAt: string;
};

export const columns: ColumnDef<CategoryColumn>[] = [
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "billboardLabel",
    header: "Billboard Label",
    cell: ({ row }) => row.original.billboardLabel,
  },
  {
    accessorKey: "isActive",
    header: "Status",
    cell: ({ row }) => (
      <div className="flex items-center">
        <div className={`w-2 h-2 rounded-full mr-2 ${
          row.original.isActive ? "bg-green-500" : "bg-red-500"
        }`} />
        <span className={row.original.isActive ? "text-green-600" : "text-red-600"}>
          {row.original.isActive ? "Active" : "Inactive"}
        </span>
      </div>
    ),
  },
  {
    accessorKey: "createdAt",
    header: "Date",
  },
  {
    id: "actions",
    cell: ({ row }) => <CellAction data={row.original} />,
  },
];
