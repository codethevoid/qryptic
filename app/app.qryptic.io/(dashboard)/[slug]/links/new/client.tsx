"use client";

import { NewLinkNav } from "@/app/app.qryptic.io/(dashboard)/[slug]/links/new/nav";
import { useState } from "react";

type Tab =
  | "general"
  | "device"
  | "utm"
  | "geo"
  | "cloaking"
  | "protection"
  | "qr"
  | "expiration"
  | "cards"
  | "indexing";

export const NewLinkClient = () => {
  const [tab, setTab] = useState<Tab>("general");

  return (
    <div className="flex space-x-10">
      <NewLinkNav tab={tab} setTab={setTab} />
      <div className="w-full">new link client</div>
    </div>
  );
};
