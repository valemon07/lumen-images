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

export default async function TestCard(
  session: {
    // Maybe make this nicer?
    session: {
      id: string;
      createdAt: Date;
      updatedAt: Date;
      userId: string;
      expiresAt: Date;
      token: string;
      ipAddress?: string | null | undefined | undefined;
      userAgent?: string | null | undefined | undefined;
    };
    user: {
      id: string;
      createdAt: Date;
      updatedAt: Date;
      email: string;
      emailVerified: boolean;
      name: string;
      image?: string | null | undefined | undefined;
    };
  } | null,
) {
  if (session) {
    const userId = session.session.user.id;
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
