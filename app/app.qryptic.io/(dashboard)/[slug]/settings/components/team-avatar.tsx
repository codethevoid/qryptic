"use client";

import { useState, useRef, ChangeEvent } from "react";
import { useTeamSettings } from "@/lib/hooks/swr/use-team-settings";
import {
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  Card,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { mutate as mutateGlobal } from "swr";
import { ButtonSpinner } from "@/components/ui/custom/button-spinner";
import NextImage from "next/image";

export const TeamAvatar = () => {
  const { data: team, mutate } = useTeamSettings();
  const [isLoading, setIsLoading] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const onFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // check if file is larger than 2mb
    const maxSize = 2 * 1024 * 1024;
    if (file.size > maxSize) {
      return toast.error("File size must be less than 2mb");
    }

    // create a preview of the image
    const blob = URL.createObjectURL(file);
    setPreview(blob);
    setFile(file);
  };

  const onSubmit = async () => {
    if (!file) {
      return toast.error("Please select an image");
    }
    setIsLoading(true);
    const formData = new FormData();
    formData.append("file", file as File);
    try {
      const res = await fetch(`/api/teams/${team?.slug}/update/avatar`, {
        method: "PATCH",
        body: formData,
      });

      if (!res.ok) {
        const data = await res.json();
        setIsLoading(false);
        toast.error(data.error);
        return;
      }

      await Promise.allSettled([
        mutate(),
        mutateGlobal(`/api/teams/${team?.slug}`),
        mutateGlobal("/api/teams"),
      ]);
      setIsLoading(false);
      setFile(null);
      setPreview(null);
      toast.success("Team avatar has been updated");
    } catch (e) {
      console.error(e);
      toast.error("Error updating team avatar");
      setIsLoading(false);
    }
  };

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
              src={preview ? preview : (team?.image as string)}
              alt={team?.name as string}
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
