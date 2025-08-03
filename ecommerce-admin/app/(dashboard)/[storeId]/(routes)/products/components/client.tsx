"use client";

import { Plus } from "lucide-react";
import { useParams, useRouter, useSearchParams } from "next/navigation";

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

import { ProductColumn, columns } from "./columns";
interface ProductClientProps {
  data: ProductColumn[];
}

export const ProductsClient: React.FC<ProductClientProps> = ({ data }) => {
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();
  const currentStatus = searchParams.get('status') || 'active';

  const handleStatusChange = (value: string) => {
    const url = new URL(window.location.href);
    if (value === 'active') {
      url.searchParams.delete('status');
    } else {
      url.searchParams.set('status', value);
    }
    router.push(url.pathname + url.search);
  };

  return (
    <>
      <div className="flex items-center justify-between">
        <Heading
          title={`Products (${data.length})`}
          description="Manage products for your store"
        />
        <div className="flex items-center gap-2">
          <Select value={currentStatus} onValueChange={handleStatusChange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="active">Active Products</SelectItem>
              <SelectItem value="inactive">Inactive Products</SelectItem>
              <SelectItem value="all">All Products</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={() => router.push(`/${params.storeId}/products/new`)}>
            <Plus className="w-4 h-4 mr-2" />
            Add new
          </Button>
        </div>
      </div>
      <Separator />
      <DataTable columns={columns} data={data} searchKey="name" />
      <Heading title="API" description="API calls for Products"></Heading>
      <Separator />
      <ApiList entityName="products" entityIdName="productId" />
    </>
  );
};
