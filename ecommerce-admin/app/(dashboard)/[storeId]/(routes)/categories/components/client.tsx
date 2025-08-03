"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { useParams, useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { DataTable } from "@/components/ui/data-table";
import { ApiList } from "@/components/ui/api-list";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { CategoryColumn, columns } from "./columns";
interface CategoryClientProps {
  data: CategoryColumn[];
}

export const CategoriesClient: React.FC<CategoryClientProps> = ({ data }) => {
  const router = useRouter();
  const params = useParams();
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const filteredData = data.filter((category) => {
    if (statusFilter === "all") return true;
    if (statusFilter === "active") return category.isActive;
    if (statusFilter === "inactive") return !category.isActive;
    return true;
  });

  return (
    <>
      <nav className="flex items-center justify-between">
        <Heading
          title={`Categories (${filteredData.length})`}
          description="Manage categories for your store"
        />
        <Button
          onClick={() => router.push(`/${params.storeId}/categories/new`)}
        >
          <Plus className="w-4 h-4 mr-2" />
          Add new
        </Button>
      </nav>
      <Separator />
      <div className="flex items-center py-4">
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            <SelectItem value="active">Active Only</SelectItem>
            <SelectItem value="inactive">Inactive Only</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <DataTable columns={columns} data={filteredData} searchKey="name" />
      <Heading title="API" description="API calls for categories"></Heading>
      <Separator />
      <ApiList entityName="categories" entityIdName="categoryId" />
    </>
  );
};
