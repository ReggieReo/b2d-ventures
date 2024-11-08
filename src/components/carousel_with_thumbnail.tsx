"use client";
import React, { useEffect, useState, useMemo } from "react";
import { media } from "~/server/db/schema";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "./ui/carousel";
import Image from "next/image";
import { cn } from "~/lib/utils";
import { ChevronLeft, ChevronRight } from "lucide-react";

type ImageType = typeof media.$inferSelect;
interface GalleryProps {
  images: ImageType[];
  className?: string;
}

const Gallery = ({ images, className }: GalleryProps) => {
  const [mainApi, setMainApi] = useState<CarouselApi>();
  const [thumbnailApi, setThumbnailApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const [isHovering, setIsHovering] = useState(false);

  const handleNext = () => {
    mainApi?.scrollNext();
  };

  const handlePrevious = () => {
    mainApi?.scrollPrev();
  };

  const mainImage = useMemo(
    () =>
      images.map((image, index) => (
        <CarouselItem key={index} className="relative aspect-video">
          <div
            className="group relative h-[400px] w-full overflow-hidden rounded-lg"
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
          >
            <Image
              src={image.url}
              alt={`Gallery Image ${index + 1}`}
              fill
              className="transform object-cover transition-transform duration-300 group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, 50vw"
              style={{ objectFit: "contain" }}
              priority={index === 0}
            />
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/10" />

            {/* Navigation Buttons */}
            <div
              className={cn(
                "absolute inset-0 flex items-center justify-between p-4 transition-opacity duration-200",
                isHovering ? "opacity-100" : "opacity-0",
              )}
            >
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handlePrevious();
                }}
                className="group rounded-full bg-black/50 p-2 backdrop-blur-sm transition-all hover:bg-black/70"
                aria-label="Previous image"
              >
                <ChevronLeft className="h-6 w-6 text-white transition-transform group-hover:scale-110" />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleNext();
                }}
                className="group rounded-full bg-black/50 p-2 backdrop-blur-sm transition-all hover:bg-black/70"
                aria-label="Next image"
              >
                <ChevronRight className="h-6 w-6 text-white transition-transform group-hover:scale-110" />
              </button>
            </div>
          </div>
        </CarouselItem>
      )),
    [handleNext, handlePrevious, images, isHovering],
  );

  const thumbnailImages = useMemo(
    () =>
      images.map((image, index) => (
        <CarouselItem key={index} className="basis-1/4 md:basis-1/5">
          <div
            onClick={() => handleClick(index)}
            className={cn(
              "group relative aspect-square cursor-pointer overflow-hidden rounded-md transition-all duration-200",
              index === current
                ? "ring-2 ring-blue-600 ring-offset-2"
                : "opacity-70 hover:opacity-100",
            )}
          >
            <Image
              src={image.url}
              alt={`Thumbnail ${index + 1}`}
              fill
              className="transform object-cover transition-transform duration-300 group-hover:scale-110"
              sizes="(max-width: 768px) 25vw, 20vw"
            />
          </div>
        </CarouselItem>
      )),
    [images, current],
  );

  useEffect(() => {
    if (!mainApi || !thumbnailApi) return;

    const handleSelect = () => {
      const selected = mainApi.selectedScrollSnap();
      setCurrent(selected);
      thumbnailApi.scrollTo(selected);
    };

    mainApi.on("select", handleSelect);

    return () => {
      mainApi.off("select", handleSelect);
    };
  });

  const handleClick = (index: number) => {
    mainApi?.scrollTo(index);
    thumbnailApi?.scrollTo(index);
    setCurrent(index);
  };

  // Add keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") {
        handlePrevious();
      } else if (e.key === "ArrowRight") {
        handleNext();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  });

  return (
    <div className={cn("w-full space-y-4", className)}>
      <div className="relative overflow-hidden rounded-lg">
        <Carousel
          setApi={setMainApi}
          className="w-full"
          opts={{
            loop: true,
            watchDrag: true,
          }}
        >
          <CarouselContent className="rounded-lg">{mainImage}</CarouselContent>
        </Carousel>
      </div>

      <div className="relative px-4">
        <Carousel
          setApi={setThumbnailApi}
          className="w-full"
          opts={{
            loop: true,
            dragFree: true,
            containScroll: "trimSnaps",
          }}
        >
          <CarouselContent className="-ml-2 md:-ml-3">
            {thumbnailImages}
          </CarouselContent>
        </Carousel>
      </div>

      <div className="text-center text-sm text-gray-500">
        {current + 1} / {images.length}
      </div>
    </div>
  );
};

export default Gallery;
