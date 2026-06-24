import { getImagesPerUserId, getTestItems } from "../lib/data";
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

export default async function TestCard() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (session) {
    const userId = session?.user.id;
    const images = await getImagesPerUserId(userId);
    const testItems = await getTestItems();
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
              {images.map((image) => {
                return <div key={image.id}>
                  {image.s3_url}
                </div>;
              })}
            </div>
          </div>
        </CardContent>
        <CardFooter></CardFooter>
      </Card>
    );
  }
}
