"use client";

import * as z from "zod";
import axios from "axios";
import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { Billboard } from "@prisma/client";
import { Trash, Palette } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import SimpleBillboardUpload from "@/components/ui/simple-billboard-upload";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { AlertModal } from "@/components/modals/alert-modal";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const formSchema = z.object({
  label: z.string().min(1),
  imageUrl: z.string().min(1),
  colorType: z.enum(["solid", "gradient"]).optional(),
  solidColor: z.string().optional(),
  gradientStart: z.string().optional(),
  gradientEnd: z.string().optional(),
  gradientDirection: z.enum(["to-right", "to-left", "to-top", "to-bottom", "to-top-right", "to-top-left", "to-bottom-right", "to-bottom-left"]).optional(),
});

type BillboardFormValues = z.infer<typeof formSchema>;

interface BillboardFormProps {
  initialData: Billboard | null;
}

export const BillboardForm: React.FC<BillboardFormProps> = ({
  initialData,
}) => {
  const params = useParams();
  const router = useRouter();

  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const title = initialData ? "Edit billboard" : "Create billboard";
  const description = initialData ? "Edit a billboard." : "Add a new billboard";
  const toastMessage = initialData ? "Billboard updated." : "Billboard created.";
  const action = initialData ? "Save changes" : "Create";

  const form = useForm<BillboardFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData ? {
      label: initialData.label || "",
      imageUrl: initialData.imageUrl || "",
      colorType: (initialData.labelColorType as "solid" | "gradient") || "solid",
      solidColor: initialData.labelSolidColor || "#000000",
      gradientStart: initialData.labelGradientStart || "#000000",
      gradientEnd: initialData.labelGradientEnd || "#ffffff",
      gradientDirection: (initialData.labelGradientDirection as "to-right" | "to-left" | "to-top" | "to-bottom" | "to-top-right" | "to-top-left" | "to-bottom-right" | "to-bottom-left") || "to-right",
    } : {
      label: "",
      imageUrl: "",
      colorType: "solid",
      solidColor: "#000000",
      gradientStart: "#000000",
      gradientEnd: "#ffffff",
      gradientDirection: "to-right",
    },
  });

  const onSubmit = async (data: BillboardFormValues) => {
    try {
      setLoading(true);
      if (initialData) {
        await axios.patch(
          `/api/${params.storeId}/billboards/${params.billboardId}`,
          data
        );
      } else {
        await axios.post(`/api/${params.storeId}/billboards`, data);
      }
      router.refresh();
      router.push(`/${params.storeId}/billboards`);
      toast.success(toastMessage);
    } catch (error: any) {
      toast.error("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  const onDelete = async () => {
    try {
      setLoading(true);
      await axios.delete(
        `/api/${params.storeId}/billboards/${params.billboardId}`
      );
      router.refresh();
      router.push(`/${params.storeId}/billboards`);
      toast.success("Billboard deleted.");
    } catch (error: any) {
      toast.error(
        "Make sure you removed all categories using this billboard first."
      );
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
        onConfirm={onDelete}
        loading={loading}
      />
      <div className="flex items-center justify-between">
        <Heading title={title} description={description} />
        {initialData && (
          <Button
            disabled={loading}
            variant="destructive"
            size="sm"
            onClick={() => setOpen(true)}
          >
            <Trash className="h-4 w-4" />
          </Button>
        )}
      </div>
      <Separator />
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 w-full">
          <FormField
            control={form.control}
            name="imageUrl"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Background image</FormLabel>
                <FormControl>
                  <SimpleBillboardUpload
                    value={field.value ? [field.value] : []}
                    disabled={loading}
                    onChange={(url) => field.onChange(url)}
                    onRemove={() => field.onChange("")}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="md:grid md:grid-cols-3 gap-8">
            <FormField
              control={form.control}
              name="label"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Label</FormLabel>
                  <FormControl>
                    <Input
                      disabled={loading}
                      placeholder="Billboard label"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="colorType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Label Color Type</FormLabel>
                  <Select
                    disabled={loading}
                    onValueChange={field.onChange}
                    value={field.value}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue defaultValue={field.value} placeholder="Select color type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="solid">Solid Color</SelectItem>
                      <SelectItem value="gradient">Gradient</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          
          {/* Color Controls */}
          <div className="md:grid md:grid-cols-3 gap-8">
            {form.watch("colorType") === "solid" && (
              <FormField
                control={form.control}
                name="solidColor"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Label Color</FormLabel>
                    <FormControl>
                      <div className="flex items-center gap-2">
                        <Input
                          type="color"
                          disabled={loading}
                          {...field}
                          className="w-16 h-10 p-1 border rounded"
                        />
                        <Input
                          disabled={loading}
                          placeholder="#000000"
                          {...field}
                          className="flex-1"
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
            
            {form.watch("colorType") === "gradient" && (
              <>
                <FormField
                  control={form.control}
                  name="gradientStart"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Gradient Start Color</FormLabel>
                      <FormControl>
                        <div className="flex items-center gap-2">
                          <Input
                            type="color"
                            disabled={loading}
                            {...field}
                            className="w-16 h-10 p-1 border rounded"
                          />
                          <Input
                            disabled={loading}
                            placeholder="#000000"
                            {...field}
                            className="flex-1"
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="gradientEnd"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Gradient End Color</FormLabel>
                      <FormControl>
                        <div className="flex items-center gap-2">
                          <Input
                            type="color"
                            disabled={loading}
                            {...field}
                            className="w-16 h-10 p-1 border rounded"
                          />
                          <Input
                            disabled={loading}
                            placeholder="#ffffff"
                            {...field}
                            className="flex-1"
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="gradientDirection"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Gradient Direction</FormLabel>
                      <Select
                        disabled={loading}
                        onValueChange={field.onChange}
                        value={field.value}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue defaultValue={field.value} placeholder="Select direction" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="to-right">Left to Right</SelectItem>
                          <SelectItem value="to-left">Right to Left</SelectItem>
                          <SelectItem value="to-top">Bottom to Top</SelectItem>
                          <SelectItem value="to-bottom">Top to Bottom</SelectItem>
                          <SelectItem value="to-top-right">Bottom-Left to Top-Right</SelectItem>
                          <SelectItem value="to-top-left">Bottom-Right to Top-Left</SelectItem>
                          <SelectItem value="to-bottom-right">Top-Left to Bottom-Right</SelectItem>
                          <SelectItem value="to-bottom-left">Top-Right to Bottom-Left</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </>
            )}
          </div>
          <Button disabled={loading} className="ml-auto" type="submit">
            {action}
          </Button>
        </form>
      </Form>
    </>
  );
};
