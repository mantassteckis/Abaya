"use client";

import Image from "next/image";
import { useState, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { ImagePlus, Trash, Crop, Check, X, UploadCloud } from "lucide-react";
import { toast } from "react-hot-toast";

import { Button } from "@/components/ui/button";
import { MountedCheck } from "@/lib/mounted-check";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";

interface BillboardImageUploadProps {
  disabled?: boolean;
  onChange: (value: string) => void;
  onRemove: (value: string) => void;
  value: string[];
}

interface CropArea {
  x: number;
  y: number;
  width: number;
  height: number;
}

const BillboardImageUpload: React.FC<BillboardImageUploadProps> = ({
  disabled,
  onChange,
  onRemove,
  value,
}) => {
  const router = useRouter();
  const [isUploading, setIsUploading] = useState(false);
  const [showCropModal, setShowCropModal] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [cropArea, setCropArea] = useState<CropArea>({ x: 0, y: 0, width: 300, height: 100 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const [imageLoaded, setImageLoaded] = useState(false);

  // Compress image function
  const compressImage = (file: File, maxWidth: number = 1200, quality: number = 0.8): Promise<string> => {
    return new Promise((resolve) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = document.createElement('img');
      
      img.onload = () => {
        // Calculate dimensions
        const ratio = Math.min(maxWidth / img.width, maxWidth / img.height);
        const width = img.width * ratio;
        const height = img.height * ratio;
        
        canvas.width = width;
        canvas.height = height;
        
        // Draw and compress
        ctx?.drawImage(img, 0, 0, width, height);
        const compressedDataUrl = canvas.toDataURL('image/jpeg', quality);
        resolve(compressedDataUrl);
      };
      
      img.src = URL.createObjectURL(file);
    });
  };

  // Handle file selection
  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Please select a valid image file');
      return;
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      toast.error('Image size must be less than 10MB');
      return;
    }

    setSelectedFile(file);
    const preview = URL.createObjectURL(file);
    setImagePreview(preview);
    setImageLoaded(false);
    setShowCropModal(true);
  };

  // Initialize crop area when image loads
  const handleImageLoad = useCallback(() => {
    if (imageRef.current) {
      const rect = imageRef.current.getBoundingClientRect();
      // Set initial crop area to center with 3:1 aspect ratio
      const cropWidth = Math.min(rect.width * 0.8, 300);
      const cropHeight = cropWidth / 3; // 3:1 aspect ratio
      setCropArea({
        x: (rect.width - cropWidth) / 2,
        y: (rect.height - cropHeight) / 2,
        width: cropWidth,
        height: cropHeight
      });
      setImageLoaded(true);
    }
  }, []);

  // Handle mouse down for dragging
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX, y: e.clientY });
  };

  // Handle mouse move for dragging
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !imageRef.current) return;

    const rect = imageRef.current.getBoundingClientRect();
    const deltaX = e.clientX - dragStart.x;
    const deltaY = e.clientY - dragStart.y;

    setCropArea(prev => ({
      ...prev,
      x: Math.max(0, Math.min(prev.x + deltaX, rect.width - prev.width)),
      y: Math.max(0, Math.min(prev.y + deltaY, rect.height - prev.height))
    }));

    setDragStart({ x: e.clientX, y: e.clientY });
  };

  // Handle mouse up
  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Crop and upload image
  const handleCropAndUpload = async () => {
    if (!selectedFile || !imageRef.current) return;

    setIsUploading(true);
    
    try {
      // Compress image first
      const compressedImage = await compressImage(selectedFile);
      
      // Create canvas for cropping
      const canvas = canvasRef.current;
      if (!canvas) return;
      
      const ctx = canvas.getContext('2d');
      const img = document.createElement('img');
      
      img.onload = async () => {
        // Set canvas size for billboard (aspect ratio 3:1)
        const billboardWidth = 1200;
        const billboardHeight = 400;
        canvas.width = billboardWidth;
        canvas.height = billboardHeight;
        
        // Calculate crop dimensions relative to original image
        const rect = imageRef.current!.getBoundingClientRect();
        const scaleX = img.width / rect.width;
        const scaleY = img.height / rect.height;
        
        const sourceX = cropArea.x * scaleX;
        const sourceY = cropArea.y * scaleY;
        const sourceWidth = cropArea.width * scaleX;
        const sourceHeight = cropArea.height * scaleY;
        
        // Draw cropped image
        ctx?.drawImage(
          img,
          sourceX, sourceY, sourceWidth, sourceHeight,
          0, 0, billboardWidth, billboardHeight
        );
        
        // Convert to blob
        canvas.toBlob(async (blob) => {
          if (!blob) return;
          
          const formData = new FormData();
          formData.append('file', blob, 'billboard.jpg');
          
          try {
            const response = await fetch('/api/uploadthing', {
              method: 'POST',
              body: formData,
            });
            
            const data = await response.json();
            
            if (!response.ok) {
              throw new Error(data.error || 'Failed to upload image');
            }
            
            onChange(data.url);
            toast.success("Billboard image uploaded successfully!");
            setShowCropModal(false);
            setSelectedFile(null);
            setImagePreview("");
            router.refresh();
          } catch (error: any) {
            console.error("Upload error:", error);
            toast.error("Failed to upload: " + error.message);
          }
        }, 'image/jpeg', 0.9);
      };
      
      img.src = compressedImage;
    } catch (error: any) {
      toast.error("Failed to process image: " + error.message);
    } finally {
      setIsUploading(false);
    }
  };

  // Cancel crop
  const handleCancelCrop = () => {
    setShowCropModal(false);
    setSelectedFile(null);
    setImagePreview("");
    URL.revokeObjectURL(imagePreview);
  };

  return (
    <MountedCheck>
      <div>
        <div className="flex items-center gap-4 mb-4">
          {value.map((url) => (
            <div
              key={url}
              className="relative w-[300px] h-[100px] overflow-hidden rounded-lg border"
            >
              <div className="absolute z-10 top-2 right-2">
                <Button
                  type="button"
                  onClick={() => onRemove(url)}
                  variant="destructive"
                  size="icon"
                >
                  <Trash className="w-4 h-4" />
                </Button>
              </div>
              <Image fill className="object-cover" alt="Billboard" src={url} />
            </div>
          ))}
        </div>

        <div className="flex items-center gap-4">
          <Button
            type="button"
            disabled={disabled || isUploading}
            variant="secondary"
            onClick={() => document.getElementById('billboard-upload')?.click()}
          >
            {isUploading ? (
              <>
                <UploadCloud className="w-4 h-4 mr-2 animate-bounce" />
                Uploading...
              </>
            ) : (
              <>
                <ImagePlus className="w-4 h-4 mr-2" />
                Upload Billboard Image
              </>
            )}
          </Button>
          <input
            id="billboard-upload"
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            className="hidden"
            disabled={disabled || isUploading}
          />
        </div>

        {/* Crop Modal */}
        <Dialog open={showCropModal} onOpenChange={setShowCropModal}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-auto">
            <DialogHeader>
              <DialogTitle>Crop Billboard Image</DialogTitle>
            </DialogHeader>
            
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Select the area you want to use for your billboard. The image will be optimized for billboard display (3:1 aspect ratio).
              </p>
              
              {imagePreview && (
                <div className="relative max-w-full max-h-[400px] overflow-hidden">
                  <img
                    ref={imageRef}
                    src={imagePreview}
                    alt="Preview"
                    className="max-w-full max-h-[400px] object-contain"
                    onLoad={handleImageLoad}
                    onMouseDown={handleMouseDown}
                    onMouseMove={handleMouseMove}
                    onMouseUp={handleMouseUp}
                    onMouseLeave={handleMouseUp}
                  />
                  
                  {/* Crop overlay */}
                  {imageLoaded && (
                    <div
                      className="absolute border-2 border-blue-500 bg-blue-500/20 cursor-move"
                      style={{
                        left: `${cropArea.x}px`,
                        top: `${cropArea.y}px`,
                        width: `${cropArea.width}px`,
                        height: `${cropArea.height}px`,
                      }}
                      onMouseDown={handleMouseDown}
                    >
                      <div className="absolute top-1 left-1 text-xs text-white bg-blue-500 px-1 rounded">
                        Billboard Area (3:1)
                      </div>
                      {/* Resize handles */}
                      <div className="absolute bottom-0 right-0 w-3 h-3 bg-blue-500 cursor-se-resize"></div>
                    </div>
                  )}
                </div>
              )}
              
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Crop className="w-4 h-4" />
                Drag the blue area to select the part of the image you want to use
              </div>
            </div>

            <DialogFooter>
              <Button
                variant="outline"
                onClick={handleCancelCrop}
                disabled={isUploading}
              >
                <X className="w-4 h-4 mr-2" />
                Cancel
              </Button>
              <Button
                onClick={handleCropAndUpload}
                disabled={isUploading}
              >
                {isUploading ? (
                  <>
                    <UploadCloud className="w-4 h-4 mr-2 animate-bounce" />
                    Uploading...
                  </>
                ) : (
                  <>
                    <Check className="w-4 h-4 mr-2" />
                    Crop & Upload
                  </>
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Hidden canvas for cropping */}
        <canvas ref={canvasRef} className="hidden" />
      </div>
    </MountedCheck>
  );
};

export default BillboardImageUpload;
