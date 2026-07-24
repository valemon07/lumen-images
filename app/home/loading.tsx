import { SkeletonImage } from "../ui/skeletons";

export default function Loading() {
  const totalTimes = 12;
  return (
    <div className="w-full columns-2 sm:columns-3 md:columns-4 lg:columns-5 gap-4 [&>*]:break-inside-avoid [&>*]:mb-4">
      {Array.from({ length: totalTimes }).map((_, index) => (
        <SkeletonImage key={index} />
      ))}
    </div>
  );
}
