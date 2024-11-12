import { MaxWidthWrapper } from "@/components/layout/max-width-wrapper";
import { Link2, Link, CircleCheck, QrCode, ChartArea, Users } from "lucide-react";
import { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import NextImage from "next/image";

type Product = {
  icon: ReactNode;
  subTitle: string;
  title: string;
  description: string;
  features?: string[];
};

// const products: Product[] = [
//   {
//     icon: <Link size={15} className="shrink-0" />,
//     title: "Custom Link Builder",
//     description:
//       "A complete solution to strengthen every connection between your content and audience.",
//     features: ["Custom domains", "Adaptive routing", "Password protection", "Link cloaking"],
//   },
//   {
//     icon: <QrCode size={15} className="shrink-0" />,
//     title: "QR Code Generator",
//     description: "QR code solutions for every customer, business, and brand experience at scale.",
//     features: [
//       "QR code for every link",
//       "Customize QR colors",
//       "Add logo to match your brand",
//       "Downloadable as PNG/SVG",
//     ],
//   },
//   {
//     icon: <ChartArea size={15} className="shrink-0" />,
//     title: "Analytics suite",
//     description: "analytics suite here borhter",
//     features: ["Link clicks", "QR scans", "Geolocation", "Device information"],
//   },
// ];

const products: Product[] = [
  {
    icon: <Link className="h-[22px] w-[22px] shrink-0 max-sm:h-[18px] max-sm:w-[18px]" />,
    subTitle: "Branded short links",
    title: "Personalized short links",
    description:
      "Create recognizable short links that match your brand. Link to your website, social media, or any other online content.",
  },
  {
    icon: <QrCode className="h-[22px] w-[22px] shrink-0 max-sm:h-[18px] max-sm:w-[18px]" />,
    subTitle: "QR codes for every link",
    title: "Eye catching QR codes",
    description:
      "Create custom QR codes with your brand colors, logo, and more. Great for physical marketing materials.",
  },
  {
    icon: <ChartArea className="h-[22px] w-[22px] shrink-0 max-sm:h-[18px] max-sm:w-[18px]" />,
    subTitle: "Analytics suite",
    title: "Track every click and scan",
    description:
      "Gain insights into your audience, track your link performance, and uncover opportunities to enhance engagement.",
  },
  {
    icon: <Users className="h-[22px] w-[22px] shrink-0 max-sm:h-[18px] max-sm:w-[18px]" />,
    subTitle: "Collaboration",
    title: "Team collaboration",
    description:
      "Invite members to your team to manage your links, QR codes, and analytics. Manage each user's access level.",
  },
];

export const Products = () => {
  return (
    <div className="px-4">
      <MaxWidthWrapper className="space-y-8">
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
        {/* <div className="space-y-4">
          <div className="grid grid-cols-5 gap-x-4 backdrop-blur">
            <div className="col-span-3 rounded-xl border p-6 shadow-lg">
              <p className="font-semibold">Links with a purpose</p>
              <p className="text-sm text-muted-foreground">
                Endless customization options to match your brand and messaging.
              </p>
            </div>
            <div className="col-span-2 rounded-xl border p-6 shadow-lg">
              <p className="font-semibold">QR codes for every link</p>
              <p className="text-sm text-muted-foreground">
                QR code solutions for every customer, business, and brand experience at scale.
              </p>
            </div>
          </div>
          <div className="grid grid-cols-5 gap-x-4 backdrop-blur">
            <div className="col-span-2 rounded-xl border p-6 shadow-lg"></div>
            <div className="col-span-3 rounded-xl border p-6 shadow-lg"></div>
          </div>
        </div> */}
        {/* <div className="space-y-8">
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
        </div> */}
        <div className="grid grid-cols-2 gap-4 max-md:grid-cols-1">
          {products.map((product, i) => (
            <div
              key={product.title}
              className="flex items-center space-x-10 rounded-xl border bg-background p-6 pl-10 shadow-md max-sm:flex-col max-sm:items-start max-sm:space-x-0 max-sm:space-y-6 max-sm:pl-6"
            >
              <div className="relative flex h-[54px] w-[54px] shrink-0 items-center justify-center rounded-xl border ring-[5px] ring-accent/65 max-sm:h-[44px] max-sm:w-[44px]">
                {product.icon}
              </div>
              <div>
                <p className="text-xs text-muted-foreground">{product.subTitle}</p>
                <h3 className="mt-4 font-semibold leading-none tracking-tight max-sm:mt-3">
                  {product.title}
                </h3>
                <p className="mt-1.5 text-[13px] text-muted-foreground">{product.description}</p>
              </div>
            </div>
          ))}
        </div>
      </MaxWidthWrapper>
    </div>
  );
};

// const ProductCard = ({
//   icon,
//   title,
//   description,
//   features,
// }: {
//   icon: ReactNode;
//   title: string;
//   description: string;
//   features: string[];
// }) => {
//   return (
//     <div className="space-y-3 rounded-xl border p-6 shadow-md backdrop-blur">
//       {/* <div className="flex items-center space-x-2"> */}
//       <div className="flex h-9 w-9 items-center justify-center rounded-lg border bg-gradient-to-tr from-accent/10 to-accent shadow-sm">
//         {icon}
//       </div>
//       <div>
//         <p className="text-lg font-bold max-sm:text-base">{title}</p>
//         {/* </div> */}
//         {/* <p className="text-[13px] text-muted-foreground">{description}</p> */}
//       </div>
//       <div className="space-y-6">
//         <div className="space-y-1">
//           {features.map((feature) => (
//             <div className="flex items-center gap-2">
//               <CircleCheck size={15} />
//               <p className="text-sm text-muted-foreground">{feature}</p>
//             </div>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// };
