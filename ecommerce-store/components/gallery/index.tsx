"use client";

import React, { useState } from "react";
import NextImage from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { Image } from "@/types";
import { cn } from "@/lib/utils";

import Button from "@/components/ui/button";

interface GalleryProps {
  images: Image[];
  additionalClass?: string;
}

const Gallery: React.FC<GalleryProps> = ({ images = [], additionalClass }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  const nextImage = () => {
    setCurrentIndex((currentIndex + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentIndex((currentIndex - 1 + images.length) % images.length);
  };

  return (
    <div className="flex gap-x-4">
      <div className="flex-col items-center justify-between hidden w-1/6 h-full sm:flex">
        {images.map((image, index) => (
          <div
            key={image.id}
            className={cn(
              `relative w-full h-24 mb-2 overflow-hidden cursor-pointer ${
                index === currentIndex ? "ring-2 ring-slate-500" : ""
              }`,
              additionalClass
            )}
            onClick={() => setCurrentIndex(index)}
          >
            <NextImage
              src={image.url}
              alt="Thumbnail"
              layout="fill"
              objectFit="cover"
            />
          </div>
        ))}
      </div>

      <div
        className="relative w-full aspect-square max-w-2xl mx-auto bg-transparent overflow-hidden"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="absolute inset-0 flex items-center justify-center">
          {images.map((image, index) => (
            <div
              key={image.id}
              className="absolute inset-0 flex items-center justify-center"
              style={{ display: index === currentIndex ? "flex" : "none" }}
            >
              <div className="relative w-full h-full">
                <NextImage
                  src={image.url}
                  alt="Image"
                  layout="fill"
                  objectFit="contain"
                />
              </div>
            </div>
          ))}
        </div>
        
        {/* Navigation arrows */}
        <div
          onClick={prevImage}
          className={cn(
            "absolute z-10 inset-y-0 left-0 w-1/6 cursor-pointer flex items-center justify-center",
            isHovered
              ? "bg-gradient-to-r from-black/10 to-transparent"
              : "bg-transparent"
          )}
        >
          <ChevronLeft className="w-6 h-6 text-white drop-shadow-lg" />
        </div>
        
        <div
          onClick={nextImage}
          className={cn(
            "absolute z-10 inset-y-0 right-0 w-1/6 cursor-pointer flex items-center justify-center",
            isHovered
              ? "bg-gradient-to-l from-black/10 to-transparent"
              : "bg-transparent"
          )}
        >
          <ChevronRight className="w-6 h-6 text-white drop-shadow-lg" />
        </div>
        
        {/* Dots indicator */}
        <div className="absolute inset-x-0 z-10 flex items-center justify-center space-x-2 bottom-4">
          {images.map((_, index) => (
            <div
              key={index}
              className={cn(
                "w-2 h-2 rounded-full transition-all border border-white/50",
                index === currentIndex
                  ? "bg-white w-3 h-3 shadow-lg"
                  : "bg-gray-400/70"
              )}
            />
          ))}
        </div>
      </div>
      <div className="hidden w-1/6 md:flex"></div>
    </div>
  );
};

export default Gallery;
