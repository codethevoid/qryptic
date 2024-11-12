import "../styles/globals.css";
import { ReactNode } from "react";
import { Providers } from "@/app/providers";
import { Toaster } from "@/components/ui/sonner";

type RootLayoutProps = {
  children: ReactNode;
};

export default function RootLayout({ children }: Readonly<RootLayoutProps>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <Providers>
          {children}
          <Toaster closeButton richColors />
        </Providers>
      </body>
    </html>
  );
}
