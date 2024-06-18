"use client";

import Image from "next/image";

const IlusivImage = ({ src, alt }: { src: string; alt: string }) => {
  return (
    <span className="flex justify-items-center justify-center py-2">
      <Image
        className="rounded-lg w-full max-w-[960px]"
        src={src}
        alt={alt}
        width={1920}
        height={1080}
        sizes="100vw"
      />
    </span>
  );
};

export default IlusivImage;
