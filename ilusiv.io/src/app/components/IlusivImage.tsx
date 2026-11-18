import Image from "next/image";

// Hosts whose images the site is set up to resize; see next.config.mjs.
const RESIZABLE = ["images.ctfassets.net", "substackcdn.com"];

export const isResizable = (src: string) => {
  try {
    return RESIZABLE.includes(new URL(src, "https://ilusiv.io").hostname);
  } catch {
    return false;
  }
};

const IlusivImage = ({ src, alt }: { src: string; alt: string }) => {
  return (
    <span className="flex justify-items-center justify-center py-2">
      {isResizable(src) ? (
        <Image
          className="rounded-lg w-full max-w-[960px]"
          src={src.startsWith("//") ? `https:${src}` : src}
          alt={alt}
          width={1920}
          height={1080}
          sizes="(min-width: 1024px) 960px, 100vw"
        />
      ) : (
        // An image from anywhere else is shown as it comes.
        // eslint-disable-next-line @next/next/no-img-element
        <img
          className="rounded-lg w-full max-w-[960px]"
          src={src}
          alt={alt}
          loading="lazy"
        />
      )}
    </span>
  );
};

export default IlusivImage;
