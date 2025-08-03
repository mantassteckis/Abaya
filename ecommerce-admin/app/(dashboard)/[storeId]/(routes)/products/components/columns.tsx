"use client";

import { ColumnDef } from "@tanstack/react-table";

import { CellAction } from "./cell-action";
import Link from "next/link";

export type ProductColumn = {
  id: string;
  name: string;
  price: string;
  category: string;
  variants: number;
  inStock: number;
  isFeatured: boolean;
  isArchived: boolean;
  createdAt: string;
};

export const columns: ColumnDef<ProductColumn>[] = [
  {
    accessorKey: "name",
    header: () => <div className="text-center">Name</div>,
  },
  {
    accessorKey: "isArchived",
    header: "Status",
    cell: ({ row }) => {
      const isArchived = row.getValue("isArchived") as boolean;
      return (
        <div className="flex items-center">
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
            isArchived 
              ? "bg-red-100 text-red-800" 
              : "bg-green-100 text-green-800"
          }`}>
            {isArchived ? "Inactive" : "Active"}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: "isFeatured",
    header: "Featured",
  },
  {
    accessorKey: "price",
    header: "Price",
  },
  {
    accessorKey: "category",
    header: "Category",
  },

  {
    accessorKey: "variants",
    header: "Variants",
  },
  {
    accessorKey: "inStock",
    header: "In Stock",
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
