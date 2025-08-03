"use client";

import Image from "next/image";
import { useState, useRef, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ImagePlus, Trash, Check, X, UploadCloud, Move, ZoomIn } from "lucide-react";
import { toast } from "react-hot-toast";

import { Button } from "@/components/ui/button";
import { MountedCheck } from "@/lib/mounted-check";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";

// Sharpening filter function
function applySharpeningFilter(imageData: ImageData): ImageData {
  const data = imageData.data;
  const width = imageData.width;
  const height = imageData.height;
  const output = new ImageData(width, height);
  
  // Sharpening kernel (unsharp mask)
  const kernel = [
    [0, -1, 0],
    [-1, 5, -1],
    [0, -1, 0]
  ];
  
  for (let y = 1; y < height - 1; y++) {
    for (let x = 1; x < width - 1; x++) {
      let r = 0, g = 0, b = 0;
      
      for (let ky = -1; ky <= 1; ky++) {
        for (let kx = -1; kx <= 1; kx++) {
          const pixelIndex = ((y + ky) * width + (x + kx)) * 4;
          const weight = kernel[ky + 1][kx + 1];
          
          r += data[pixelIndex] * weight;
          g += data[pixelIndex + 1] * weight;
          b += data[pixelIndex + 2] * weight;
        }
      }
      
      const outputIndex = (y * width + x) * 4;
      output.data[outputIndex] = Math.max(0, Math.min(255, r));
      output.data[outputIndex + 1] = Math.max(0, Math.min(255, g));
      output.data[outputIndex + 2] = Math.max(0, Math.min(255, b));
      output.data[outputIndex + 3] = data[outputIndex + 3]; // Alpha channel
    }
  }
  
  // Copy edge pixels as-is
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      if (y === 0 || y === height - 1 || x === 0 || x === width - 1) {
        const index = (y * width + x) * 4;
        output.data[index] = data[index];
        output.data[index + 1] = data[index + 1];
        output.data[index + 2] = data[index + 2];
        output.data[index + 3] = data[index + 3];
      }
    }
  }
  
  return output;
}

interface SimpleBillboardUploadProps {
  disabled?: boolean;
  onChange: (value: string) => void;
  onRemove: (value: string) => void;
  value: string[];
}

const SimpleBillboardUpload: React.FC<SimpleBillboardUploadProps> = ({
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
  const [cropX, setCropX] = useState(0);
  const [cropY, setCropY] = useState(0);
  const [cropWidth, setCropWidth] = useState(300);
  const [cropHeight, setCropHeight] = useState(100);
  const [isResizing, setIsResizing] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageDimensions, setImageDimensions] = useState({ width: 0, height: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

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
    setCropX(0);
    setCropY(0);
    setCropWidth(300);
    setCropHeight(100);
    setShowCropModal(true);
  };

  // Initialize when image loads
  const handleImageLoad = useCallback(() => {
    if (imageRef.current) {
      const img = imageRef.current;
      setImageDimensions({ width: img.naturalWidth, height: img.naturalHeight });
      setImageLoaded(true);
      
      // Center the crop area on the image
      const imgDisplayWidth = img.offsetWidth;
      const imgDisplayHeight = img.offsetHeight;
      
      // Calculate initial crop area size (3:1 ratio)
      const initialWidth = Math.min(imgDisplayWidth * 0.6, 300);
      const initialHeight = initialWidth / 3;
      
      setCropWidth(initialWidth);
      setCropHeight(initialHeight);
      
      // Center the crop area
      setCropX(Math.max(0, (imgDisplayWidth - initialWidth) / 2));
      setCropY(Math.max(0, (imgDisplayHeight - initialHeight) / 2));
    }
  }, []);

  // Handle dragging
  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
    setDragStart({ x: e.clientX - cropX, y: e.clientY - cropY });
  };

  // Handle resizing
  const handleResizeStart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsResizing(true);
    setDragStart({ x: e.clientX, y: e.clientY });
  };

  const handleResizeMove = useCallback((e: MouseEvent) => {
    if (!isResizing || !imageRef.current) return;

    const deltaX = e.clientX - dragStart.x;
    const newWidth = Math.max(100, cropWidth + deltaX);
    const newHeight = newWidth / 3; // Maintain 3:1 aspect ratio
    
    // Constrain to image bounds
    const imgWidth = imageRef.current.offsetWidth;
    const imgHeight = imageRef.current.offsetHeight;
    const maxWidth = imgWidth - cropX;
    const maxHeight = imgHeight - cropY;
    
    const finalWidth = Math.min(newWidth, maxWidth);
    const finalHeight = Math.min(newHeight, maxHeight);
    
    // If height constraint is more restrictive, adjust width accordingly
    if (finalHeight < finalWidth / 3) {
      setCropWidth(finalHeight * 3);
      setCropHeight(finalHeight);
    } else {
      setCropWidth(finalWidth);
      setCropHeight(finalWidth / 3);
    }
    
    setDragStart({ x: e.clientX, y: e.clientY });
  }, [isResizing, dragStart, cropWidth, cropHeight, cropX, cropY]);

  const handleResizeEnd = useCallback(() => {
    setIsResizing(false);
  }, []);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isDragging || !imageRef.current) return;

    const newX = e.clientX - dragStart.x;
    const newY = e.clientY - dragStart.y;
    
    // Constrain to image bounds
    const imgWidth = imageRef.current.offsetWidth;
    const imgHeight = imageRef.current.offsetHeight;
    const maxX = imgWidth - cropWidth;
    const maxY = imgHeight - cropHeight;
    
    setCropX(Math.max(0, Math.min(newX, maxX)));
    setCropY(Math.max(0, Math.min(newY, maxY)));
  }, [isDragging, dragStart, cropWidth, cropHeight]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  // Add event listeners for smooth dragging and resizing
  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, handleMouseMove, handleMouseUp]);

  useEffect(() => {
    if (isResizing) {
      document.addEventListener('mousemove', handleResizeMove);
      document.addEventListener('mouseup', handleResizeEnd);
      return () => {
        document.removeEventListener('mousemove', handleResizeMove);
        document.removeEventListener('mouseup', handleResizeEnd);
      };
    }
  }, [isResizing, handleResizeMove, handleResizeEnd]);

  // Process and upload image
  const handleCropAndUpload = async () => {
    if (!selectedFile || !imageRef.current) return;

    setIsUploading(true);
    
    try {
      const canvas = canvasRef.current;
      if (!canvas) return;
      
      const ctx = canvas.getContext('2d');
      const img = document.createElement('img');
      
      img.onload = async () => {
        // Set canvas size for billboard (3:1 aspect ratio) - Higher resolution for better quality
        const billboardWidth = 1800; // Increased from 1200
        const billboardHeight = 600; // Increased from 400
        canvas.width = billboardWidth;
        canvas.height = billboardHeight;
        
        // Enable image smoothing for better quality
        if (ctx) {
          ctx.imageSmoothingEnabled = true;
          ctx.imageSmoothingQuality = 'high';
        }
        
        // Calculate scale factors
        const displayImg = imageRef.current!;
        const scaleX = img.width / displayImg.offsetWidth;
        const scaleY = img.height / displayImg.offsetHeight;
        
        // Use current crop dimensions
        
        // Calculate source rectangle
        const sourceX = cropX * scaleX;
        const sourceY = cropY * scaleY;
        const sourceWidth = cropWidth * scaleX;
        const sourceHeight = cropHeight * scaleY;
        
        // Draw cropped and scaled image
        ctx?.drawImage(
          img,
          sourceX, sourceY, sourceWidth, sourceHeight,
          0, 0, billboardWidth, billboardHeight
        );
        
        // Apply sharpening filter before final output
        if (ctx) {
          const imageData = ctx.getImageData(0, 0, billboardWidth, billboardHeight);
          const sharpened = applySharpeningFilter(imageData);
          ctx.putImageData(sharpened, 0, 0);
        }
        
        // Convert to blob and upload with higher quality
        canvas.toBlob(async (blob) => {
          if (!blob) return;
          
          try {
            // Simple direct upload using the existing endpoint
            const reader = new FileReader();
            reader.onloadend = async () => {
              const base64 = reader.result as string;
              
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
              toast.success("High-quality billboard image uploaded successfully!");
              setShowCropModal(false);
              setSelectedFile(null);
              setImagePreview("");
              router.refresh();
            };
            
            reader.readAsDataURL(blob);
          } catch (error: any) {
            console.error("Upload error:", error);
            toast.error("Failed to upload: " + error.message);
          }
        }, 'image/jpeg', 0.95); // Increased quality from 0.9 to 0.95
      };
      
      img.src = URL.createObjectURL(selectedFile);
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
    if (imagePreview) {
      URL.revokeObjectURL(imagePreview);
    }
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
            onClick={() => document.getElementById('simple-billboard-upload')?.click()}
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
            id="simple-billboard-upload"
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
                Position and resize the crop area to select the part of your image for the billboard. Drag to move, use the corner handle to resize. The 3:1 aspect ratio is maintained automatically.
              </p>
              
              {imagePreview && (
                <div className="space-y-4">
                  {/* Image Preview Container */}
                  <div className="relative bg-gray-100 rounded-lg overflow-hidden">
                    <img
                      ref={imageRef}
                      src={imagePreview}
                      alt="Preview"
                      className="max-w-full max-h-[500px] object-contain"
                      onLoad={handleImageLoad}
                    />
                    
                    {/* Crop Overlay */}
                    {imageLoaded && (
                      <>
                        {/* Crop frame */}
                        <div
                          className="absolute border-4 border-blue-500 bg-blue-500/20 cursor-move"
                          style={{
                            left: `${cropX}px`,
                            top: `${cropY}px`,
                            width: `${cropWidth}px`,
                            height: `${cropHeight}px`,
                          }}
                          onMouseDown={handleMouseDown}
                        >
                          <div className="absolute top-1 left-1 text-xs text-white bg-blue-500 px-2 py-1 rounded">
                            Billboard Area (3:1 ratio)
                          </div>
                          <div className="absolute bottom-1 right-1 text-xs text-white bg-blue-500 px-2 py-1 rounded">
                            <Move className="w-3 h-3 inline mr-1" />
                            Drag to move
                          </div>
                          {/* Resize handle */}
                          <div
                            className="absolute bottom-0 right-0 w-4 h-4 bg-blue-500 cursor-se-resize"
                            onMouseDown={handleResizeStart}
                          >
                            <div className="absolute inset-0 flex items-center justify-center">
                              <div className="w-1 h-1 bg-white rounded-full"></div>
                            </div>
                          </div>
                        </div>
                        
                        {/* Darkened areas outside crop */}
                        <div 
                          className="absolute inset-0 bg-black/50 pointer-events-none"
                          style={{
                            clipPath: `polygon(0 0, 0 100%, ${cropX}px 100%, ${cropX}px ${cropY}px, ${cropX + cropWidth}px ${cropY}px, ${cropX + cropWidth}px ${cropY + cropHeight}px, ${cropX}px ${cropY + cropHeight}px, ${cropX}px 100%, 100% 100%, 100% 0)`
                          }}
                        />
                      </>
                    )}
                  </div>
                </div>
              )}
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
                disabled={isUploading || !imageLoaded}
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

export default SimpleBillboardUpload;
