"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { toast } from "react-hot-toast";
import { ImagePlus, Trash, UploadCloud } from "lucide-react";

import { Button } from "@/components/ui/button";

interface FallbackImageUploadProps {
  disabled?: boolean;
  onChange: (url: string) => void;
  onRemove: (url: string) => void;
  value: string[];
}

export const FallbackImageUpload = ({
  disabled,
  onChange,
  onRemove,
  value,
}: FallbackImageUploadProps) => {
  const router = useRouter();
  const [isUploading, setIsUploading] = useState(false);
  
  // Function to compress image if it's too large
  const compressImage = (file: File): Promise<File> => {
    return new Promise((resolve) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d')!;
      const img = new window.Image();
      
      img.onload = () => {
        // Calculate new dimensions to maintain aspect ratio
        const MAX_WIDTH = 1920;
        const MAX_HEIGHT = 1080;
        let { width, height } = img;
        
        if (width > height) {
          if (width > MAX_WIDTH) {
            height = (height * MAX_WIDTH) / width;
            width = MAX_WIDTH;
          }
        } else {
          if (height > MAX_HEIGHT) {
            width = (width * MAX_HEIGHT) / height;
            height = MAX_HEIGHT;
          }
        }
        
        canvas.width = width;
        canvas.height = height;
        
        // Draw and compress
        ctx.drawImage(img, 0, 0, width, height);
        
        canvas.toBlob((blob) => {
          if (blob) {
            const compressedFile = new File([blob], file.name, {
              type: 'image/jpeg',
              lastModified: Date.now(),
            });
            resolve(compressedFile);
          } else {
            resolve(file);
          }
        }, 'image/jpeg', 0.8); // 80% quality
      };
      
      img.src = URL.createObjectURL(file);
    });
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      const files = Array.from(e.target.files || []);
      if (!files.length) return;

      setIsUploading(true);
      
      // Process files one by one to avoid overwhelming the server
      for (const file of files) {
        // Compress image if it's large
        const compressedFile = await compressImage(file);
        
        const base64 = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result as string);
          reader.onerror = reject;
          reader.readAsDataURL(compressedFile);
        });

        try {
          const response = await fetch('/api/uploadthing', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ file: base64 }),
          });
          
          const data = await response.json();
          
          if (!response.ok) {
            throw new Error(data.error || 'Failed to upload image');
          }
          
          onChange(data.url);
        } catch (error: any) {
          console.error("Upload error:", error);
          toast.error("Failed to upload " + file.name + ": " + error.message);
        }
      }
      
      toast.success("Images uploaded successfully!");
      router.refresh();
    } catch (error: any) {
      toast.error("Failed to read file: " + error.message);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-4">
        {value.map((url) => (
          <div
            key={url}
            className="relative w-full h-[200px] overflow-hidden rounded-md border border-gray-200 shadow-sm"
          >
            <div className="absolute z-10 top-2 right-2">
              <Button
                type="button"
                onClick={() => onRemove(url)}
                variant="destructive"
                size="icon"
                className="h-6 w-6"
                disabled={disabled}
              >
                <Trash className="w-3 h-3" />
              </Button>
            </div>
            <Image
              fill
              className="object-cover"
              alt="Image"
              src={url}
            />
          </div>
        ))}
      </div>
      <div className="flex items-center gap-4">
        <Button
          type="button"
          disabled={disabled || isUploading}
          variant="secondary"
          onClick={() => document.getElementById('file-upload')?.click()}
        >
          {isUploading ? (
            <>
              <UploadCloud className="w-4 h-4 mr-2 animate-bounce" />
              Uploading...
            </>
          ) : (
            <>
              <ImagePlus className="w-4 h-4 mr-2" />
              Upload Images
            </>
          )}
        </Button>
        <input
          id="file-upload"
          type="file"
          accept="image/*"
onChange={(e) => {
            const files = Array.from(e.target.files || []);
            if (files.length > 0) {
              handleUpload(e);
            }
          }}
          className="hidden"
          disabled={disabled || isUploading}
          multiple
        />
      </div>
    </div>
  );
}; 