import { NextResponse } from "next/server";
import { withTeam } from "@/lib/auth/with-team";
import prisma from "@/db/prisma";
import Replicate from "replicate";
import { uploadImage } from "@/utils/upload-image";
import { nanoid } from "@/utils/nanoid";

export const POST = withTeam(async ({ req, team }) => {
  try {
    const replicate = new Replicate();
    const body = await req.json();
    const { prompt, url } = body;
    const teamWithPlan = await prisma.team.findUnique({
      where: { id: team.id },
      select: { plan: true },
    });

    if (teamWithPlan?.plan.isFree) {
      return NextResponse.json(
        { error: "You need to upgrade to a paid plan to use this feature" },
        { status: 403 },
      );
    }

    const input = {
      url,
      prompt,
      qr_conditioning_scale: 1.5,
      num_inference_steps: 20,
      guidance_scale: 9,
      negative_prompt:
        "Longbody, lowres, bad anatomy, bad hands, missing fingers, extra digit, fewer digits, cropped, worst quality, low quality",
    };

    const output = (await replicate.run(
      "zylim0702/qr_code_controlnet:628e604e13cf63d8ec58bd4d238474e8986b054bc5e1326e50995fdbc851c557",
      { input },
    )) as string[];

    let imgLocation = null;
    if (output) {
      const id = nanoid(16);
      const file = await fetch(output[0]);
      const buffer = Buffer.from(await file.arrayBuffer());
      const key = `qr-codes/${id}.png`;
      imgLocation = await uploadImage(buffer, key, file.type);
    }

    return NextResponse.json({ img: imgLocation });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "An error occurred" }, { status: 500 });
  }
});
