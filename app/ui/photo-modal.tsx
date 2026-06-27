import { Card, CardContent, CardFooter } from "@/components/ui/card";
import PhotoCard from "./photo-card";
import { Button } from "@/components/ui/button";

export default function PhotoModal(props: {
  src: string;
  alt: string;
  width: number;
  height: number;
  className: string;
}) {
  const { src, alt, width, height, className } = props;
  return (
    <div>
      <Card>
        <CardContent>
          <PhotoCard
            src={src}
            alt={alt}
            width={width}
            height={height}
            className={className}
          />
        </CardContent>
        <CardFooter>
          <Button variant={"destructive"}>Evil Delete Button</Button>
        </CardFooter>
      </Card>
    </div>
  );
}
