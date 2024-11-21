import { detectThreat } from "@/lib/links/detect-threat";
import { blacklist } from "@/utils/blacklist";

type Link = {
  destination: string;
  geo: Record<string, { destination: string }>;
  android: string | undefined;
  ios: string | undefined;
  expired: string | undefined;
};

export const processLink = async ({ destination, geo, android, ios, expired }: Link) => {
  if (
    Object.values(geo).some((value) =>
      blacklist.some((item) => value.destination.toLowerCase().trim().includes(item)),
    )
  ) {
    return false;
  }

  // Check if android or ios destination is blacklisted
  if (android && blacklist.some((item) => android.toLowerCase().trim().includes(item))) {
    return false;
  }

  if (ios && blacklist.some((item) => ios.toLowerCase().trim().includes(item))) {
    return false;
  }

  if (expired && blacklist.some((item) => expired.toLowerCase().trim().includes(item))) {
    return false;
  }

  // check if destination is a threat for default destination, geo, and android/ios destinations
  const geoDestinations = Object.values(geo).map((item) => item.destination);
  const destinationsToCheck = [
    destination,
    ...(geoDestinations.length > 0 ? geoDestinations : []),
    ...(android ? [android] : []),
    ...(ios ? [ios] : []),
    ...(expired ? [expired] : []),
  ];
  const isThreat = await Promise.any(destinationsToCheck.map(detectThreat));
  if (isThreat) return false;
  return true;
};
