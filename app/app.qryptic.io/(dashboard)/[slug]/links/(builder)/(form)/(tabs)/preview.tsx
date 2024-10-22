"use client";

import { useLinkForm } from "@/app/app.qryptic.io/(dashboard)/[slug]/links/(builder)/(form)/context";
import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/label";
import NextImage from "next/image";
import { ChangeEvent, useRef } from "react";
import { ImageIcon, UploadCloud } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

export const Preview = () => {
  const {
    tab,
    image,
    setImage,
    title,
    setTitle,
    description,
    setDescription,
    destination,
    setImageFile,
    setImageType,
  } = useLinkForm();
  const hiddenFileInput = useRef<HTMLInputElement>(null);

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const maxSize = 2 * 1024 * 1024; // 2MB
    if (file.size > maxSize) {
      return toast.error("Image size cannot exceed 2MB");
    }

    // create blob url
    const blob = URL.createObjectURL(file);
    setImage(blob);
    setImageType(file.type);
    // convert image to base64 so we can send it to the server

    const reader = new FileReader();
    reader.onload = () => {
      setImageFile(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className={cn("space-y-4", tab !== "preview" && "hidden")}>
      <input
        ref={hiddenFileInput}
        id="og-image"
        type="file"
        accept="image/png, image/jpeg, image/jpg"
        className="hidden"
        onChange={handleImageChange}
      />
      <div className="space-y-1.5">
        <p className="text-[13px] font-medium">Image</p>
        {image ? (
          <div
            onClick={() => hiddenFileInput?.current?.click()}
            role="button"
            className="relative aspect-[1200/630] w-full cursor-pointer overflow-hidden rounded-lg border shadow-sm transition-[opacity] hover:opacity-90"
          >
            <NextImage
              src={image}
              alt={title}
              height={630}
              width={1200}
              quality={100}
              className="h-full w-full object-cover"
            />
          </div>
        ) : destination ? (
          <div className="flex aspect-[1200/630] w-full items-center justify-center rounded-lg border bg-zinc-50 p-4 shadow-sm dark:bg-zinc-950">
            <div className="space-y-4">
              <div className="mx-auto flex h-9 w-9 items-center justify-center rounded-lg border bg-gradient-to-tr from-white to-white dark:from-accent/10 dark:to-accent">
                <UploadCloud size={15} />
              </div>
              <div className="space-y-0.5">
                <p className="text-center text-[13px] font-medium">Upload an image</p>
                <p className="text-center text-xs text-muted-foreground">
                  1200 x 630 recommended size
                </p>
              </div>
              <Button
                size="sm"
                className="w-full"
                onClick={() => hiddenFileInput?.current?.click()}
              >
                Upload image
              </Button>
            </div>
          </div>
        ) : (
          <div className="flex aspect-[1200/630] w-full items-center justify-center rounded-lg border bg-zinc-50 p-4 shadow-sm dark:bg-zinc-950">
            <div className="space-y-4">
              <div className="mx-auto flex h-9 w-9 items-center justify-center rounded-lg border bg-gradient-to-tr from-white to-white dark:from-accent/10 dark:to-accent">
                <ImageIcon size={15} />
              </div>
              <div className="space-y-0.5">
                <p className="text-center text-[13px] font-medium">No destination</p>
                <p className="text-center text-xs text-muted-foreground">
                  Enter a destination to customize preview
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="og-title">Title</Label>
        <Input
          id="og-title"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          disabled={!destination}
        />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="og-description">Description</Label>
        <Textarea
          id="og-description"
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          disabled={!destination}
        />
      </div>
    </div>
  );
};
