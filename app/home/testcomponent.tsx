import { getImagesPerUser, getTestItems } from "../lib/data";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default async function TestCard() {
  const images = await getImagesPerUser({
    id: "test",
    name: "test",
    email: "test@mail.com",
    password_hash: "23",
    emailVerified: null,
    image: null,
  });
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
              return <div key={image.id}>{image.s3_url}</div>;
            })}
          </div>
          <div>
            <p>Test items:</p>
            <div className="flex flex-row px-2 py-2 justify-center items-center">
              {testItems.map((test) => {
                return (
                  <div className="px-2" key={test.id}>
                    {test.name}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter></CardFooter>
    </Card>
  );
}
