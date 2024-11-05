"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import NextImage from "next/image";
import { Button } from "@/components/ui/button";
import { ButtonSpinner } from "@/components/ui/custom/button-spinner";
import { useState, useRef, ChangeEvent } from "react";
import { useUserSettings } from "@/lib/hooks/swr/use-user-settings";

export const UserAvatar = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const { data: user } = useUserSettings();

  const onFileChange = async (e: ChangeEvent<HTMLInputElement>) => {};

  const onSubmit = async () => {};

  return (
    <>
      <input
        type="file"
        accept="image/*"
        className="hidden"
        ref={fileInputRef}
        onChange={(e) => onFileChange(e)}
      />
      <Card>
        <CardHeader>
          <CardTitle>Team avatar</CardTitle>
          <CardDescription className="text-[13px]">
            Click on your avatar to upload a new one
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div
            role="button"
            className="w-fit rounded-full border transition-all hover:opacity-90"
            onClick={() => fileInputRef.current?.click()}
          >
            <NextImage
              src={preview ? preview : (user?.image as string)}
              alt={user?.name || (user?.email as string)}
              height={256}
              width={256}
              quality={100}
              className="aspect-square h-16 w-16 rounded-full object-cover"
            />
          </div>
        </CardContent>
        <CardFooter className="flex justify-between rounded-b-lg border-t bg-zinc-50 px-6 py-3 dark:bg-zinc-950">
          <p className="text-[13px] text-muted-foreground">1:1 aspect ratio recommended</p>
          <Button size="sm" disabled={isLoading} className="w-[55px]" onClick={onSubmit}>
            {isLoading ? <ButtonSpinner /> : "Save"}
          </Button>
        </CardFooter>
      </Card>
    </>
  );
};
