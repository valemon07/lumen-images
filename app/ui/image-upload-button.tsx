import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { PlusIcon } from "lucide-react";
import UploadForm from "./upload-form";

export default function ImageUploadButton() {
  return (
    <Dialog>
      <DialogTrigger className="bg-primary hover:brightness-85 transition-all duration-200 ease-in-out rounded-full mx-auto w-10 h-10 flex items-center justify-center">
        <PlusIcon />
      </DialogTrigger>
      <DialogContent>
        <UploadForm />
      </DialogContent>
    </Dialog>
  );
}
