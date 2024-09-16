import {
  Dialog,
  DialogBody,
  DialogContent,
  DialogFooter,
  CompactDialogHeader,
  CompactDialogTitle,
  CompactDialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { useEffect, useRef, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { tagSchema, TagFormValues } from "@/lib/validation/tags";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { colors, borderColorClasses } from "@/utils/colors";
import { Tag } from "@/components/ui/custom/tag";
import { TagColor } from "@/types/colors";
import { useParams } from "next/navigation";
import { toast } from "sonner";
import { LoaderCircle } from "lucide-react";
import { TagWithCounts } from "@/types/tags";
import { editTag } from "@/actions/tags/edit-tag";

type EditTagProps = {
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
  tag?: TagWithCounts;
  mutateTags: () => Promise<void>;
};

export const EditTag = ({ isOpen, setIsOpen, mutateTags, tag }: EditTagProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [selectedColor, setSelectedColor] = useState<TagColor | null>(null);
  const { slug } = useParams();
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<TagFormValues>({ resolver: zodResolver(tagSchema) });

  const onSubmit = async (values: TagFormValues) => {
    setIsLoading(true);
    const { error, message } = await editTag({
      tag: tag as TagWithCounts,
      name: values.name,
      color: selectedColor as TagColor,
      slug: slug as string,
    });
    if (error) {
      setIsLoading(false);
      return toast.error(message);
    }

    await mutateTags();
    toast.success(message);
    setIsOpen(false);
    setIsLoading(false);
  };

  useEffect(() => {
    setSelectedColor(tag?.color as TagColor);
    reset({ name: tag?.name });
  }, [tag]);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="max-w-[440px]">
        <CompactDialogHeader>
          <CompactDialogTitle>Edit tag</CompactDialogTitle>
          <CompactDialogDescription>Group your links together with tags.</CompactDialogDescription>
        </CompactDialogHeader>
        <DialogBody className="max-w-[440px]">
          <div className="space-y-1.5">
            <Label htmlFor="name">Tag name</Label>
            <Input id="name" placeholder="Enter a tag name" {...register("name")} />
            {errors.name && <p className="text-xs text-red-600">{errors.name.message}</p>}
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="color">Tag color</Label>
            <div className="flex flex-wrap gap-1">
              {colors.map((color) => (
                <Tag
                  variant={color as TagColor}
                  key={color}
                  onClick={() => setSelectedColor(color as TagColor)}
                  className={`w-fit cursor-pointer capitalize transition-all active:scale-[97%] ${selectedColor === color ? `${borderColorClasses[color as TagColor]} ` : "border-transparent hover:opacity-85"}`}
                >
                  {color}
                </Tag>
              ))}
            </div>
          </div>
        </DialogBody>
        <DialogFooter>
          <Button size="sm" variant="outline" disabled={isLoading} onClick={() => setIsOpen(false)}>
            Cancel
          </Button>
          <Button
            size="sm"
            disabled={isLoading}
            className="w-[72px]"
            onClick={handleSubmit(onSubmit)}
          >
            {isLoading ? <LoaderCircle size={14} className="animate-spin" /> : "Edit tag"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
