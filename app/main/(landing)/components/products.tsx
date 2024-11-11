import { MaxWidthWrapper } from "@/components/layout/max-width-wrapper";
import { Link2, Link, CircleCheck, QrCode, ChartArea } from "lucide-react";
import { ReactNode } from "react";
import { CircleCheckFill } from "@/components/ui/icons/circle-check-fill";

type Product = {
  icon: ReactNode;
  title: string;
  features: string[];
};

const products: Product[] = [
  {
    icon: <Link size={15} className="shrink-0" />,
    title: "Custom Link Builder",
    features: ["Custom domains", "Adaptive routing", "Password protection", "Link cloaking"],
  },
  {
    icon: <QrCode size={15} className="shrink-0" />,
    title: "QR Code Generator",
    features: [
      "QR code for every link",
      "Customize QR colors",
      "Add logo to match your brand",
      "Downloadable as PNG/SVG",
    ],
  },
  {
    icon: <ChartArea size={15} className="shrink-0" />,
    title: "Analytics suite",
    features: ["Link clicks", "QR scans", "Geolocation", "Device information"],
  },
];

export const Products = () => {
  return (
    <div className="px-4">
      <MaxWidthWrapper>
        <div className="space-y-8">
          <div className="space-y-2">
            <h2 className="text-center text-3xl font-bold tracking-tight max-md:text-2xl">
              Products built for{" "}
              <span className="bg-gradient-to-r from-sky-500 to-teal-500 bg-clip-text text-transparent">
                growth
              </span>
            </h2>
            <p className="mx-auto max-w-lg text-center text-muted-foreground max-md:text-sm max-sm:max-w-[340px] max-sm:text-[13px]">
              Whether you&apos;re a startup or an established business, our products are designed to
              help you grow your business and reach your goals.
            </p>
          </div>
          <div className="grid grid-cols-3 gap-4 max-md:grid-cols-1 max-md:gap-6">
            {products.map((product: Product) => (
              <ProductCard key={product.title} {...product} />
            ))}
          </div>
        </div>
      </MaxWidthWrapper>
    </div>
  );
};

const ProductCard = ({
  icon,
  title,
  features,
}: {
  icon: ReactNode;
  title: string;
  features: string[];
}) => {
  return (
    <div className="space-y-2 rounded-xl border bg-gradient-to-bl from-background to-zinc-900 p-6 shadow-lg">
      <div className="flex h-9 w-9 items-center justify-center rounded-lg border bg-gradient-to-tr from-accent/10 to-accent shadow-sm">
        {icon}
      </div>
      <p className="text-lg font-bold max-sm:text-base">{title}</p>

      <div className="space-y-1">
        {features.map((feature) => (
          <div className="flex items-center gap-2">
            <CircleCheck size={15} />
            <p className="text-sm text-muted-foreground">{feature}</p>
          </div>
        ))}
      </div>
    </div>
  );
};
