// "use client";
//
// import { useEffect, useState } from "react";
// import { useLinkForm } from "@/app/app.qryptic.io/(dashboard)/[slug]/links/new/context";
// import { Info, QrCode, Stars } from "lucide-react";
// import { Label } from "@/components/ui/label";
// import { Textarea } from "@/components/ui/textarea";
// import { Button } from "@/components/ui/button";
// import { ButtonSpinner } from "@/components/ui/custom/button-spinner";
// import { toast } from "sonner";
// import { useParams } from "next/navigation";
// import NextImage from "next/image";
// import { Skeleton } from "@/components/ui/skeleton";
// import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
// import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
// import { qrTemplates } from "@/lib/qr/templates";
// import { useTeam } from "@/lib/hooks/swr/use-team";
// import { cn } from "@/lib/utils";
//
// const constructUrl = (domain: string, slug: string) => {
//   return `https://${domain}/${slug}?qr=1`;
// };
//
// const generateQrCode = async (url: string, prompt: string, teamSlug: string) => {
//   try {
//     const res = await fetch(`/api/links/${teamSlug}/qr/generate`, {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({ url, prompt }),
//     });
//
//     return await res.json();
//   } catch {
//     return null;
//   }
// };
//
// export const AiQr = () => {
//   const {
//     slug,
//     domain,
//     prompt,
//     setPrompt,
//     qrImageURL,
//     setQrImageURL,
//     generations,
//     setGenerations,
//   } = useLinkForm();
//   const { slug: teamSlug } = useParams();
//   const { team } = useTeam();
//   const [isLoading, setIsLoading] = useState<boolean>(false);
//   const [isPreviewOpen, setIsPreviewOpen] = useState<boolean>(false);
//
//   const handleGenerate = async () => {
//     if (team?.plan.isFree) return toast.error("Upgrade to Pro to use AI");
//     if (!prompt) return toast.error("Please enter a prompt");
//     setIsLoading(true);
//     const promptUsed = prompt;
//     const url = constructUrl(domain?.name as string, slug);
//     const data = await generateQrCode(url, prompt, teamSlug as string);
//     setQrImageURL(data?.img);
//     if (data?.img) {
//       setGenerations([{ img: data.img, prompt: promptUsed }, ...generations]);
//     }
//     setIsLoading(false);
//   };
//
//   return (
//     <div className="space-y-4">
//       <div>
//         <div className="flex w-full items-center justify-center rounded-lg border bg-zinc-50 p-4 shadow-sm dark:bg-zinc-950">
//           {qrImageURL && !isLoading ? (
//             <div
//               className="h-[176px] w-[176px] rounded-md border"
//               role="button"
//               onClick={() => setIsPreviewOpen(true)}
//             >
//               <NextImage
//                 src={qrImageURL}
//                 width={768}
//                 height={768}
//                 alt={"qr code preview"}
//                 quality={100}
//                 className="h-full w-full rounded-md"
//               />
//             </div>
//           ) : isLoading ? (
//             <Skeleton className="h-[176px] w-[176px] border" />
//           ) : (
//             <div className="flex h-[176px] w-[176px] items-center justify-center rounded-md border bg-background p-3">
//               <div className="flex flex-col items-center space-y-2">
//                 <QrCode size={18} className="text-muted-foreground" />
//                 <p className="text-center text-xs text-muted-foreground">Enter a prompt</p>
//               </div>
//             </div>
//           )}
//         </div>
//         <div className="mt-2 flex items-center space-x-1.5">
//           <Info size={13} className="text-muted-foreground" />
//           <p className="text-xs text-muted-foreground">
//             Ensure the generated QR code is scannable.
//           </p>
//         </div>
//       </div>
//       <div className="space-y-4">
//         <div className="space-y-1.5">
//           <Label htmlFor="prompt">Prompt</Label>
//           <Textarea
//             id="prompt"
//             placeholder="A kitten playing with a ball of yarn"
//             value={prompt}
//             onChange={(e) => setPrompt(e.target.value)}
//           />
//         </div>
//         <Button size="sm" onClick={handleGenerate} className="w-[136px]" disabled={isLoading}>
//           {isLoading ? <ButtonSpinner /> : "Generate QR code"}
//         </Button>
//       </div>
//       {generations.length > 0 && (
//         <div className="space-y-3 rounded-lg border bg-zinc-50 p-4 shadow-sm dark:bg-zinc-950">
//           <p className="text-[13px] font-medium">Generations</p>
//           <div className="grid grid-cols-5 gap-2">
//             {generations.map((generation) => (
//               <div
//                 key={generation.img}
//                 onClick={() => {
//                   if (!isLoading) {
//                     setQrImageURL(generation.img);
//                     setPrompt(generation.prompt);
//                   }
//                 }}
//               >
//                 <NextImage
//                   src={generation.img}
//                   height={768}
//                   width={768}
//                   quality={100}
//                   alt={"qr code generation"}
//                   className={cn(
//                     "cursor-pointer rounded-md ring-0 transition-all",
//                     generation.img === qrImageURL && "ring-2 ring-primary",
//                   )}
//                 />
//               </div>
//             ))}
//           </div>
//         </div>
//       )}
//       <div className="space-y-3 rounded-lg border bg-zinc-50 p-4 shadow-sm dark:bg-zinc-950">
//         <div>
//           <p className="text-[13px] font-medium">AI templates</p>
//           <p className="text-xs text-muted-foreground">
//             Need inspiration? Choose from a variety of templates.
//           </p>
//         </div>
//         <div className="grid grid-cols-4 gap-2">
//           {qrTemplates.map((template) => (
//             <div key={template.id}>
//               <NextImage
//                 src={template.img}
//                 height={768}
//                 width={768}
//                 quality={100}
//                 alt={template.name}
//                 className="rounded-md shadow-sm"
//               />
//             </div>
//           ))}
//         </div>
//       </div>
//       <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
//         <DialogContent className="w-auto border-none" aria-describedby={undefined}>
//           <VisuallyHidden>
//             <DialogTitle>QR code preview</DialogTitle>
//           </VisuallyHidden>
//           {qrImageURL && (
//             <NextImage
//               src={qrImageURL as string}
//               width={768}
//               height={768}
//               quality={100}
//               alt={"qr code preview"}
//               className="h-80 w-80 rounded-md"
//             />
//           )}
//         </DialogContent>
//       </Dialog>
//     </div>
//   );
// };
