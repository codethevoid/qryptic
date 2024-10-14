"use client";

import { useEffect, useState } from "react";
import { useLinkForm } from "@/app/app.qryptic.io/(dashboard)/[slug]/links/new/context";
import { QrCode } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import qrcode from "qrcode";
import { Button } from "@/components/ui/button";
import { ButtonSpinner } from "@/components/ui/custom/button-spinner";
import { toast } from "sonner";

const constructUrl = (domain: string, slug: string) => {
  return `https://${domain}/${slug}?qr=1`;
};

const generateQrCode = async (url: string) => {
  const qrCode = await qrcode.toDataURL(url, { errorCorrectionLevel: "high", width: 768 });
  // make call to control net to create qr code image
  try {
    const res = await fetch("https://modelslab.com/api/v5/controlnet", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        init_image:
          "https://qryptic.s3.amazonaws.com/main/Screenshot+2024-10-13+at+1.11.05%E2%80%AFPM.png",
        mask_image: null,
        control_image: null,
        width: 512,
        height: 512,
        prompt: "koi fish swimming in a pond",
        guess_mode: "no",
        use_karras_sigmas: "yes",
        algorithm_type: null,
        safety_checker_type: null,
        tomesd: "yes",
        vae: null,
        embeddings: null,
        lora_strength: null,
        upscale: null,
        instant_response: null,
        strength: 1,
        negative_prompt: "",
        guidance: 7.5,
        samples: 1,
        safety_checker: "no",
        auto_hint: "no",
        steps: 20,
        seed: null,
        webhook: null,
        track_id: null,
        scheduler: "DDPMScheduler",
        base64: null,
        clip_skip: "2",
        controlnet_conditioning_scale: null,
        temp: null,
        ip_adapter_id: null,
        ip_adapter_scale: null,
        ip_adapter_image: null,
        controlnet_type: "qrcode",
        controlnet_model: "qrcode",
        model_id: "midjourney",
        key: "DjFSDtzyRJjKo2nLPDXnUTsFxJnOTjqq24FCvw2kmxCzBu9x0SH7HpMgykj3",
      }),
    });

    const data = await res.json();
    console.log(data);
  } catch {
    return null;
  }
};

export const AiQr = () => {
  const { slug, domain, prompt, setPrompt } = useLinkForm();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleGenerate = async () => {
    if (!prompt) return toast.error("Please enter a prompt");
    setIsLoading(true);
    const url = constructUrl(domain?.name as string, slug);
    await generateQrCode(url);
    setIsLoading(false);
  };

  return (
    <div>
      <div className="flex w-full items-center justify-center rounded-lg border bg-zinc-50 p-4 shadow-sm dark:bg-zinc-950">
        <div className="flex h-[154px] w-[154px] items-center justify-center rounded-md border bg-background p-3">
          <div className="flex flex-col items-center space-y-2">
            <QrCode size={18} className="text-muted-foreground" />
            <p className="text-center text-xs text-muted-foreground">Enter a prompt</p>
          </div>
        </div>
      </div>
      <div className="mt-4 space-y-4">
        <div className="space-y-1.5">
          <Label>Prompt</Label>
          <Textarea
            placeholder="A kitten playing with a ball of yarn"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
          />
        </div>
        <Button size="sm" onClick={handleGenerate} className="w-[136px]" disabled={isLoading}>
          {isLoading ? <ButtonSpinner /> : "Generate QR code"}
        </Button>
      </div>
    </div>
  );
};
