"use client";

import Image from "next/image";

interface CoverImageProps {
  src: string;
  alt: string;
}

export function CoverImage({ src, alt }: CoverImageProps) {
  return (
    <Image
      src={src}
      alt={alt}
      width={1200}
      height={630}
      style={{ width: "100%", height: "auto" }}
      className="rounded-xl"
      priority
      onError={(e) => {
        e.currentTarget.style.display = "none";
      }}
    />
  );
}
