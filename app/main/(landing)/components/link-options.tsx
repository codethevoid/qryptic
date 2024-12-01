"use client";

import {
  ArrowRight,
  Link2,
  Tag,
  ArrowLeft,
  Clock,
  Earth,
  TabletSmartphone,
  Shield,
  Ghost,
  SearchCheck,
  Image as ImageIcon,
  AppleIcon,
  Bot,
  Lock,
} from "lucide-react";
import { ChevronArrow } from "@/components/ui/chevron-arrow";
import { cn } from "@/lib/utils";
import { RefObject, useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { type Tab } from "@/types/links";
import { SmallSwitch } from "@/components/ui/custom/small-switch";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { countries } from "@/utils/countries/countries";
import type { Country } from "@/types/links";
import NextImage from "next/image";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  CheckIcon,
  Search,
  CornerDownLeft,
  Pencil,
  Trash,
  CornerDownRight,
  Info,
} from "lucide-react";
import { CaretSortIcon } from "@radix-ui/react-icons";
import { constructURL } from "@/utils/construct-url";
import { format, startOfToday } from "date-fns";
import { CalendarDays, ChevronDown } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { Textarea } from "@/components/ui/textarea";
import { ChangeEvent } from "react";
type CustomTab = Omit<Tab, "qr" | "general">;

type LinkItem = {
  name: string;
  value: CustomTab;
  icon: JSX.Element;
  isPro: boolean;
};

export const linkItems: LinkItem[] = [
  {
    name: "UTM params",
    value: "utm",
    icon: <Tag size={13} />,
    isPro: false,
  },
  {
    name: "Device targeting",
    value: "device",
    icon: <TabletSmartphone size={13} />,
    isPro: true,
  },
  {
    name: "Geo targeting",
    value: "geo",
    icon: <Earth size={13} />,
    isPro: true,
  },
  {
    name: "Expiration",
    value: "expiration",
    icon: <Clock size={13} />,
    isPro: true,
  },
  {
    name: "Open Graph",
    value: "preview",
    icon: <ImageIcon size={13} />,
    isPro: true,
  },
  {
    name: "Protection",
    value: "protection",
    icon: <Shield size={13} />,
    isPro: true,
  },
];

const toggles = [
  {
    name: "Cloaking",
    value: "cloaking",
    icon: <Ghost size={13} />,
    isPro: true,
  },
  {
    name: "Indexing",
    value: "indexing",
    icon: <SearchCheck size={15} />,
    isPro: true,
  },
];

type Link = {
  ogImage: string;
  ogTitle: string;
  ogDescription: string;
  _count: { events: number };
};

type Props = {
  activeTab: CustomTab | null;
  setActiveTab: (tab: CustomTab | null) => void;
  link: Link | null;
};

export const LinkOptions = ({ activeTab, setActiveTab, link }: Props) => {
  const [shouldCloak, setShouldCloak] = useState(false);
  const [shouldIndex, setShouldIndex] = useState(true);
  const [utm, setUtm] = useState({
    source: "",
    medium: "",
    campaign: "",
    term: "",
    content: "",
  });
  const [ios, setIos] = useState("");
  const [android, setAndroid] = useState("");

  const [geo, setGeo] = useState<Record<string, Country>>({
    US: {
      code: "US",
      country: "United States",
      destination: "https://app.qryptic.io/register?lang=en",
    },
  });
  const [isCountriesOpen, setIsCountriesOpen] = useState(false);
  const [countrySearch, setCountrySearch] = useState("");
  const [selectedCountry, setSelectedCountry] = useState<Country | null>();

  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [expiresAt, setExpiresAt] = useState<Date | undefined>(undefined);
  const [expiredDestination, setExpiredDestination] = useState("");

  const [image, setImage] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const hiddenFileInput = useRef<HTMLInputElement>(null);

  const filterCountries = () => {
    return countries.filter((c) =>
      c.country.toLowerCase().includes(countrySearch.toLowerCase().trim()),
    );
  };

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // create blob url
    const blob = URL.createObjectURL(file);
    setImage(blob);
    // convert image to base64 so we can create it to the server
  };

  useEffect(() => {
    if (link) {
      setImage(link.ogImage);
      setTitle(link.ogTitle);
      setDescription(link.ogDescription);
    }
  }, [link]);

  return (
    <div className={cn("flex w-[200%] overflow-hidden transition-all")}>
      <div
        className={cn(
          "w-[50%] opacity-100 transition-all",
          activeTab && "-translate-x-full opacity-0",
        )}
      >
        {linkItems.map((item, i) => (
          <div
            key={i}
            role="button"
            className={cn(
              "group flex items-center justify-between p-2 transition-all hover:bg-zinc-50 dark:hover:bg-zinc-950",
              i !== 0 && "border-t border-border",
            )}
            onClick={() => {
              setActiveTab(item.value);
            }}
          >
            <div className="flex items-center space-x-2">
              {item.icon}
              <span className="text-[12px] font-normal">{item.name}</span>
            </div>
            <ChevronArrow className="bg-primary" />
          </div>
        ))}
        {toggles.map((item) => (
          <div
            key={item.value}
            className={cn("flex items-center justify-between border-t border-border p-2")}
            onClick={() => {
              if (item.value === "cloaking") {
                setShouldCloak(!shouldCloak);
              } else {
                setShouldIndex(!shouldIndex);
              }
            }}
          >
            <div className="flex items-center space-x-2">
              {item.icon}
              <span className="text-[12px] font-normal">{item.name}</span>
            </div>
            <SmallSwitch checked={item.value === "cloaking" ? shouldCloak : shouldIndex} />
          </div>
        ))}
      </div>

      <div
        className={cn(
          "w-[50%] pt-2.5 opacity-0 transition-all",
          activeTab && "-translate-x-full opacity-100",
        )}
      >
        <div className="space-y-3 pb-0.5 pl-0.5">
          <div className="flex items-center space-x-2">
            <Button
              size="icon"
              variant="secondary"
              className="h-7 w-7 bg-accent/60"
              onClick={() => setActiveTab(null)}
            >
              <ArrowLeft size={13} />
            </Button>
            <p className="text-[13px]">
              {activeTab && linkItems.find((item) => item.value === activeTab)?.name}
            </p>
          </div>
          {activeTab === "utm" && (
            <div className="space-y-2">
              <div className="space-y-2 rounded-lg border bg-background p-2 shadow-sm">
                <p className="rounded-md border bg-zinc-50 px-3 py-1 text-[13px] dark:bg-zinc-900/60">
                  Destination preview
                </p>
                <div className="flex min-w-0">
                  <p className="break-all px-3 text-xs text-muted-foreground">
                    https://app.qryptic.io/register
                    {Object.values(utm).filter((i) => i.length > 0).length > 0 ? "?" : ""}
                    {Object.entries(utm)
                      .filter(([_, value]) => value)
                      .map(([key, value]) => `${key}=${value}`)
                      .join("&")}
                  </p>
                </div>
              </div>
              <Input
                className="h-8"
                placeholder="Source"
                value={utm.source}
                onChange={(e) => setUtm({ ...utm, source: e.target.value })}
              />
              <Input
                className="h-8"
                placeholder="Medium"
                value={utm.medium}
                onChange={(e) => setUtm({ ...utm, medium: e.target.value })}
              />
              <Input
                className="h-8"
                placeholder="Campaign"
                value={utm.campaign}
                onChange={(e) => setUtm({ ...utm, campaign: e.target.value })}
              />
              <Input
                className="h-8"
                placeholder="Term"
                value={utm.term}
                onChange={(e) => setUtm({ ...utm, term: e.target.value })}
              />
              <Input
                className="h-8"
                placeholder="Content"
                value={utm.content}
                onChange={(e) => setUtm({ ...utm, content: e.target.value })}
              />
            </div>
          )}
          {activeTab === "device" && (
            <div className="space-y-2">
              <div className="relative space-y-1">
                <Label htmlFor="ios" className="text-xs font-normal">
                  iOS destination
                </Label>
                <AppleIcon size={14} className="absolute left-3 top-7 text-muted-foreground" />
                <Input
                  id="ios"
                  className="h-8 w-full pl-[34px]"
                  placeholder="https://apps.apple.com"
                  value={ios}
                  onChange={(e) => setIos(e.target.value)}
                />
              </div>
              <div className="relative space-y-1">
                <Label htmlFor="android" className="text-xs font-normal">
                  Android destination
                </Label>
                <Bot size={14} className="absolute left-3 top-7 text-muted-foreground" />
                <Input
                  id="android"
                  className="h-8 w-full pl-[34px]"
                  placeholder="https://play.google.com"
                  value={android}
                  onChange={(e) => setAndroid(e.target.value)}
                />
              </div>
            </div>
          )}
          {activeTab === "geo" && (
            <div className="space-y-2">
              <div className="space-y-1">
                <Label htmlFor="geo-destination" className="text-xs font-normal">
                  Country and destination
                </Label>
                <div className="flex">
                  <Popover open={isCountriesOpen} onOpenChange={setIsCountriesOpen}>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="h-8 w-full max-w-[120px] items-center justify-between space-x-2 rounded-r-none border-r-0 text-xs active:!scale-100"
                        size="sm"
                        title={selectedCountry?.country}
                      >
                        {selectedCountry?.code && selectedCountry?.country ? (
                          <div className="flex min-w-0 items-center space-x-2">
                            <NextImage
                              src={`https://flagcdn.com/40x30/${selectedCountry.code.toLowerCase()}.png`}
                              alt={selectedCountry.country}
                              height={30}
                              width={40}
                              quality={100}
                              className="h-3 w-4"
                            />
                            <span className="min-w-0 truncate">{selectedCountry?.country}</span>
                          </div>
                        ) : (
                          <span className="font-normal text-muted-foreground">Country</span>
                        )}
                        <CaretSortIcon className="h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent align="start" className="w-[220px] p-0">
                      <div className="relative flex items-center">
                        <Search size={14} className="absolute left-2.5 text-muted-foreground" />
                        <Input
                          placeholder="Search countries"
                          className="rounded-b-none border-0 border-b pl-8 shadow-none focus-visible:!ring-0"
                          onChange={(e) => setCountrySearch(e.target.value)}
                          value={countrySearch}
                        />
                      </div>
                      <ScrollArea
                        className={cn(
                          "p-1 transition-all",
                          filterCountries().length >= 5 ? "h-[197px] hover:pr-3" : "h-auto",
                        )}
                      >
                        {filterCountries().map((country) => (
                          <div
                            role="button"
                            key={country.code}
                            title={country.country}
                            className={cn(
                              "flex cursor-default select-none items-center justify-between space-x-1 rounded-md px-2 py-1.5 transition-colors",
                              selectedCountry?.code === country.code
                                ? "bg-accent dark:bg-accent/90"
                                : "hover:!bg-accent/60 dark:hover:!bg-accent/40",
                            )}
                            onClick={() => {
                              setSelectedCountry({
                                ...country,
                                destination: selectedCountry?.destination || "",
                              });
                              setIsCountriesOpen(false);
                              setCountrySearch("");
                            }}
                          >
                            <div className="flex min-w-0 items-center space-x-2">
                              <NextImage
                                src={`https://flagcdn.com/40x30/${country.code.toLowerCase()}.png`}
                                alt={country.country}
                                height={30}
                                width={40}
                                quality={100}
                                className="h-3 w-4"
                              />
                              <p
                                className={cn(
                                  "min-w-0 truncate text-[13px] transition-all",
                                  selectedCountry?.code === country.code && "font-medium",
                                )}
                              >
                                {country.country}
                              </p>
                            </div>
                            <CheckIcon
                              className={cn(
                                "h-4 w-4 shrink-0 transition-all",
                                selectedCountry?.code === country.code
                                  ? "opacity-100"
                                  : "opacity-0",
                              )}
                            />
                          </div>
                        ))}
                        {filterCountries().length === 0 && (
                          <div className="flex h-[63px] items-center justify-center text-muted-foreground">
                            <p className="text-xs">No countries found</p>
                          </div>
                        )}
                      </ScrollArea>
                    </PopoverContent>
                  </Popover>
                  <div className="relative w-full">
                    <Input
                      id="geo-destination"
                      placeholder="Destination URL"
                      className={cn("h-8 rounded-l-none pr-[30px]")}
                      value={selectedCountry?.destination || ""}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          if (
                            !selectedCountry ||
                            !selectedCountry?.destination ||
                            !selectedCountry?.country ||
                            !selectedCountry?.code ||
                            !selectedCountry?.destination ||
                            selectedCountry?.destination === geo[selectedCountry.code]?.destination
                          )
                            return;
                          setGeo({ ...geo, [selectedCountry.code]: selectedCountry });
                          setSelectedCountry(null);
                        }
                      }}
                      onChange={(e) => {
                        if (selectedCountry) {
                          setSelectedCountry({ ...selectedCountry, destination: e.target.value });
                        } else {
                          setSelectedCountry({
                            code: "",
                            country: "",
                            destination: e.target.value,
                          });
                        }
                      }}
                    />
                    <Button
                      size="icon"
                      className="absolute right-1 top-1/2 h-[24px] w-[24px] -translate-y-1/2 rounded-md"
                      variant="ghost"
                      disabled={
                        !selectedCountry?.country ||
                        !selectedCountry?.code ||
                        !selectedCountry?.destination ||
                        selectedCountry?.destination === geo[selectedCountry.code]?.destination
                      }
                      onClick={() => {
                        if (!selectedCountry || !selectedCountry?.destination) return;
                        setGeo({ ...geo, [selectedCountry.code]: selectedCountry });
                        setSelectedCountry(null);
                      }}
                    >
                      <CornerDownLeft size={14} />
                    </Button>
                  </div>
                </div>
              </div>
              <div className="space-y-1">
                {Object.keys(geo).length === 0 ? (
                  // <div className="flex h-44 items-center justify-center rounded-lg border bg-zinc-50 p-4 shadow-sm dark:bg-zinc-950">
                  //   <div className="space-y-4">
                  //     <div className="mx-auto flex h-9 w-9 items-center justify-center rounded-lg border bg-gradient-to-tr from-white to-white shadow-sm dark:from-accent/10 dark:to-accent">
                  //       <Signpost size={15} />
                  //     </div>
                  //     <div className="space-y-[3px]">
                  //       <p className="text-center text-[13px] font-medium">No redirects configured</p>
                  //       <p className="mx-auto max-w-[260px] text-center text-xs text-muted-foreground">
                  //         Add a location and destination to redirect users based on their location.
                  //       </p>
                  //     </div>
                  //   </div>
                  // </div>
                  ""
                ) : (
                  <>
                    <p className="text-xs">Redirects</p>
                    <div className="rounded-lg border shadow-sm">
                      {Object.values(geo)
                        .sort((a, b) => a.country.localeCompare(b.country))
                        .map((country, i) => (
                          <div
                            key={country.code}
                            className={cn(
                              "flex shrink items-center justify-between space-x-4 px-2.5 py-1.5",
                              i !== 0 && "border-t",
                            )}
                          >
                            <div className="flex min-w-0 items-center space-x-2.5">
                              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border bg-gradient-to-tr from-accent/10 to-accent">
                                <NextImage
                                  src={`https://flagcdn.com/40x30/${country.code.toLowerCase()}.png`}
                                  alt={country.country}
                                  height={30}
                                  width={40}
                                  quality={100}
                                  className="h-[10.8px] w-[14.4px]"
                                />
                              </div>
                              <div className="min-w-0">
                                <p className="truncate text-[13px]">{country.country}</p>
                                <div className="flex shrink items-center space-x-1">
                                  <CornerDownRight
                                    size={12}
                                    className="shrink-0 text-muted-foreground"
                                  />
                                  <a
                                    className="truncate text-xs text-muted-foreground hover:underline"
                                    href={constructURL(country.destination)}
                                    target="_blank"
                                    rel="noreferrer"
                                  >
                                    {country.destination}
                                  </a>
                                </div>
                              </div>
                            </div>
                            <div className="flex shrink-0">
                              <Button
                                size="icon"
                                variant="outline"
                                className="h-6 w-7 rounded-md rounded-r-none border-r-0 text-muted-foreground active:!scale-100"
                                onClick={() => {
                                  setSelectedCountry(country);
                                }}
                              >
                                <Pencil size={12} />
                              </Button>
                              <Button
                                size="icon"
                                variant="outline"
                                className="h-6 w-7 rounded-md rounded-l-none text-muted-foreground hover:text-red-600"
                                onClick={() => {
                                  const { [country.code]: _, ...rest } = geo;
                                  setGeo(rest);
                                }}
                              >
                                <Trash size={12} />
                              </Button>
                            </div>
                          </div>
                        ))}
                    </div>
                  </>
                )}
              </div>
            </div>
          )}
          {activeTab === "expiration" && (
            <div className="space-y-2">
              <div className="space-y-1">
                <p className="text-xs font-normal">Expiration date</p>
                <div>
                  <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        className={cn(
                          "h-8 w-full justify-between space-x-2 font-normal active:!scale-100",
                          !expiresAt && "text-muted-foreground",
                        )}
                      >
                        <div className="flex items-center space-x-2">
                          <CalendarDays size={14} />
                          <span>
                            {expiresAt
                              ? `${format(expiresAt, "MMMM d, yyyy h:mm aa")}`
                              : "No expiration date set"}
                          </span>
                        </div>
                        <ChevronDown size={14} className="opacity-50" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent align="start" className="w-auto p-0">
                      <div className="flex">
                        <Calendar
                          mode="single"
                          onSelect={(date) => {
                            setExpiresAt(date);
                          }}
                          defaultMonth={expiresAt || startOfToday()}
                          selected={expiresAt}
                        />
                      </div>
                    </PopoverContent>
                  </Popover>
                </div>
              </div>

              <div className="space-y-1">
                <Label htmlFor="expired-destination" className="text-xs font-normal">
                  Expiration destination
                </Label>
                <Input
                  className="h-8"
                  id="expired-destination"
                  placeholder="example.com (optional)"
                  value={expiredDestination || ""}
                  onChange={(e) => setExpiredDestination(e.target.value)}
                />
                <div className="flex space-x-1.5">
                  <Info size={13} className="relative top-[1px] shrink-0 text-muted-foreground" />
                  <p className="text-xs text-muted-foreground">
                    The destination to redirect users to when the link expires.
                  </p>
                </div>
              </div>
            </div>
          )}
          {activeTab === "preview" && (
            <div className="space-y-2">
              <NextImage
                src={image}
                alt="qryptic-link-preview"
                width={1200}
                height={630}
                quality={100}
                className="aspect-[1200/630] cursor-pointer rounded-lg border object-cover shadow-sm transition-all hover:opacity-90"
                onClick={() => hiddenFileInput.current?.click()}
              />
              <Input
                id="og-title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Title"
              />
              <Textarea
                id="og-description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Description"
              />
              <input
                ref={hiddenFileInput}
                id="og-image"
                type="file"
                accept="image/png, image/jpeg, image/jpg"
                className="hidden"
                onChange={handleImageChange}
              />
            </div>
          )}
          {activeTab === "protection" && (
            <div className="relative space-y-1">
              <Label htmlFor="password" className="text-xs font-normal">
                Password
              </Label>
              <Lock size={14} className="absolute left-3 top-7 text-muted-foreground" />
              <Input id="password" className="h-8 w-full pl-[34px]" placeholder="Password" />
              <div className="flex space-x-1.5">
                <Info size={13} className="relative top-[1px] shrink-0 text-muted-foreground" />
                <p className="text-xs text-muted-foreground">
                  Protect your link with a password to prevent unauthorized access.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
