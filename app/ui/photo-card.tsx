import Image from "next/image";

export default function PhotoCard(props: {
  src: string;
  fileName: string;
  width: number;
  height: number;
}) {
  const { src, fileName, width, height } = props;
  return (
    <div>
      <Image src={src} alt={fileName} width={width} height={height} />
    </div>
  );
}
