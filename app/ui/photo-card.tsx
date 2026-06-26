import Image from "next/image";

export default function PhotoCard(props: {
  src: string;
  alt: string;
  width: number;
  height: number;
  className: string;
}) {
  const { src, alt, width, height, className } = props;
  return (
    <div>
      <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        className={`rounded-lg w-full block h-auto object-contain hover:saturate-75 hover:brightness-125 transition-all duration-300 ease-in-out ${className}`}
      />
    </div>
  );
}
