import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import Image from "next/image";
import { getAllPresignedImages } from "../lib/actions";
import { auth } from "../lib/auth";
import { headers } from "next/headers";

export default async function TestCard() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session) {
    return <div>You must be logged in to access this page.</div>;
  }
  if (session) {
    const userId = session.user.id;
    const images = await getAllPresignedImages(userId);
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
              {images.images.map((image, i) => {
                return (
                  <div key={image.id}>
                    <Image
                      src={images.urls[i]}
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
