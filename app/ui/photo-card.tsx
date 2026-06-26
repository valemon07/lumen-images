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
        className={className}
      />
    </div>
  );
}
