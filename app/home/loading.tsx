import { SkeletonImage } from "../ui/skeletons";

export default function Loading() {
  const totalTimes = 12;
  return (
    <div className="grid grid-cols-3 gap-6">
      {Array.from({ length: totalTimes }).map((_, index) => (
        <SkeletonImage key={index} />
      ))}
    </div>
  );
}
