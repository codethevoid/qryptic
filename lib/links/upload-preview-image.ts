import { uploadImage } from "@/utils/upload-image";

type UploadPreviewImage = {
  imageFile: string;
  imageType: string;
  team: { slug: string; id: string };
  slug: string;
};

export const uploadPreviewImage = async ({
  imageFile,
  imageType,
  team,
  slug,
}: UploadPreviewImage): Promise<{ error?: string; location?: string }> => {
  const maxSize = 2 * 1024 * 1024; // 2MB
  // imageFile has been sent over in base64 format and get file type
  const base64 = imageFile.replace(/^data:image\/\w+;base64,/, "");
  const buffer = Buffer.from(base64, "base64");
  if (buffer.length > maxSize) return { error: "Image size is too large" };
  // upload image to s3
  const key = `previews/${team.slug}/${slug}.png`;
  const location = await uploadImage(buffer, key, imageType);
  return { location: location || undefined };
};
