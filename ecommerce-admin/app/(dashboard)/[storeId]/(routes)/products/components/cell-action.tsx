"use client";

import axios from "axios";
import { Copy, Edit, MoreHorizontal, Trash, Archive, ArchiveRestore } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "react-hot-toast";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ProductColumn } from "./columns";
import { AlertModal } from "@/components/modals/alert-modal";
import { Button } from "@/components/ui/button";

interface CellActionProps {
  data: ProductColumn;
}

export const CellAction: React.FC<CellActionProps> = ({ data }) => {
  const router = useRouter();
  const params = useParams();

  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  const onCopy = (id: string) => {
    navigator.clipboard.writeText(id);
    toast.success("Product ID copied to clipboard.");
  };

  const onToggleArchive = async () => {
    try {
      setLoading(true);
      await axios.patch(`/api/${params.storeId}/products/${data.id}`, {
        isArchived: !data.isArchived,
      });
      router.refresh();
      toast.success(data.isArchived ? "Product restored." : "Product archived.");
    } catch (error) {
      toast.error("Something went wrong.");
    } finally {
      setLoading(false);
      setOpen(false);
    }
  };

  return (
    <>
      <AlertModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={onToggleArchive}
        loading={loading}
        title={data.isArchived ? "Restore Product" : "Archive Product"}
        description={data.isArchived 
          ? "Are you sure you want to restore this product? It will be visible to customers again." 
          : "Are you sure you want to archive this product? It will be hidden from customers."}
      />
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="w-8 h-8 p-0">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="w-4 h-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuItem
            onClick={() =>
              router.push(`/${params.storeId}/products/${data.id}`)
            }
          >
            <Edit className="w-4 h-4 mr-2" />
            Update
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onCopy(data.id)}>
            <Copy className="w-4 h-4 mr-2" />
            Copy ID
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setOpen(true)}>
            {data.isArchived ? (
              <>
                <ArchiveRestore className="w-4 h-4 mr-2" />
                Restore
              </>
            ) : (
              <>
                <Archive className="w-4 h-4 mr-2" />
                Archive
              </>
            )}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};
