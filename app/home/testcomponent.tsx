import { getImagesPerUserId } from "../lib/data";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { auth } from "../lib/auth";
import { headers } from "next/headers";
import Image from "next/image";
import { getPresignedImage } from "../lib/actions";

export default async function TestCard() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (session) {
    const userId = session?.user.id;
    const images = await getImagesPerUserId(userId);
    const imageUrls = await Promise.all(
      images.map((image) => {
        const key = image.s3_url.substring(image.s3_url.lastIndexOf("/") + 1);
        return getPresignedImage(key);
      }),
    );
    return (
      <Card className="mx-auto w-full max-w-sm">
        <CardHeader>
          <CardTitle>Images</CardTitle>
          <CardDescription>All images</CardDescription>
          <CardAction></CardAction>
        </CardHeader>
        <CardContent>
          <div>
            <p>Images:</p>
            <div className="flex flex-row">
              {images.map((image, i) => {
                return (
                  <div key={image.id}>
                    <Image
                      src={imageUrls[i]}
                      alt="image"
                      width={500}
                      height={500}
                    />
                  </div>
                );
              })}
            </div>
          </div>
        </CardContent>
        <CardFooter></CardFooter>
      </Card>
    );
  }
}
