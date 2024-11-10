"use client";

import { useLinkForm } from "@/app/app.qryptic.io/(dashboard)/[slug]/links/(builder)/(form)/context";
import { cn } from "@/lib/utils";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { CaretSortIcon, CheckIcon } from "@radix-ui/react-icons";
import { CornerDownRight, Pencil, Search, Signpost, Trash } from "lucide-react";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useRef, useState } from "react";
import { countries } from "@/utils/countries/countries";
import { Country } from "@/types/links";
import { Label } from "@/components/ui/label";
import Image from "next/image";

const deepLinks = ["mailto:", "sms:", "tel:"];

const constructURL = (destination: string) => {
  if (deepLinks.some((link) => destination.startsWith(link))) {
    return destination;
  }

  if (destination.startsWith("http")) return destination;
  return `https://${destination}`;
};

export const GeoTargeting = () => {
  const { tab, geo, setGeo } = useLinkForm();
  const [isCountriesOpen, setIsCountriesOpen] = useState(false);
  const [countrySearch, setCountrySearch] = useState("");
  const [selectedCountry, setSelectedCountry] = useState<Country | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const filterCountries = () => {
    return countries.filter((c) =>
      c.country.toLowerCase().includes(countrySearch.toLowerCase().trim()),
    );
  };

  return (
    <div className={cn("space-y-4", tab !== "geo" && "hidden")}>
      <div className="space-y-1.5">
        <Label htmlFor="geo-destination">Country and destination</Label>
        <div className="flex">
          <Popover open={isCountriesOpen} onOpenChange={setIsCountriesOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="h-9 w-full max-w-[150px] items-center justify-between space-x-2 rounded-r-none border-r-0 active:!scale-100 max-sm:max-w-[120px]"
                size="sm"
                title={selectedCountry?.country}
              >
                {selectedCountry?.code && selectedCountry?.country ? (
                  <div className="flex min-w-0 items-center space-x-2">
                    <Image
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
                      <Image
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
                        selectedCountry?.code === country.code ? "opacity-100" : "opacity-0",
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
          <Input
            id="geo-destination"
            placeholder="Destination URL"
            className={cn("rounded-l-none")}
            value={selectedCountry?.destination || ""}
            ref={inputRef}
            onChange={(e) => {
              if (selectedCountry) {
                setSelectedCountry({ ...selectedCountry, destination: e.target.value });
              } else {
                setSelectedCountry({ code: "", country: "", destination: e.target.value });
              }
            }}
          />
        </div>
      </div>
      <Button
        size="sm"
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
        Add redirect
      </Button>
      <div className="space-y-1.5">
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
            <p className="text-[13px] font-medium">Redirects</p>
            <div className="rounded-lg border shadow-sm">
              {Object.values(geo)
                .sort((a, b) => a.country.localeCompare(b.country))
                .map((country, i) => (
                  <div
                    key={country.code}
                    className={cn(
                      "flex shrink items-center justify-between space-x-4 px-3 py-2",
                      i !== 0 && "border-t",
                    )}
                  >
                    <div className="flex min-w-0 items-center space-x-2.5">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border bg-gradient-to-tr from-accent/10 to-accent">
                        <Image
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
                          <CornerDownRight size={12} className="shrink-0 text-muted-foreground" />
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
                        className="h-7 rounded-r-none border-r-0 text-muted-foreground active:!scale-100"
                        onClick={() => {
                          setSelectedCountry(country);
                          // inputRef.current?.focus();
                          window?.scrollTo({ top: 0, behavior: "smooth" });
                        }}
                      >
                        <Pencil size={13} />
                      </Button>
                      <Button
                        size="icon"
                        variant="outline"
                        className="h-7 rounded-l-none text-muted-foreground hover:text-red-600"
                        onClick={() => {
                          const { [country.code]: _, ...rest } = geo;
                          setGeo(rest);
                        }}
                      >
                        <Trash size={13} />
                      </Button>
                    </div>
                  </div>
                ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};
