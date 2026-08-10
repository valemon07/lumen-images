import { Separator } from "@/components/ui/separator";
import SettingsClient from "./SettingsClient";

export default function Page() {
  return (
    <div className="w-full h-full">
      <div className="flex items-center justify-between my-4 mx-8">
        <div className="text-2xl font-medium">Profile Settings</div>
      </div>
      <Separator />
      <SettingsClient />
    </div>
  );
}
