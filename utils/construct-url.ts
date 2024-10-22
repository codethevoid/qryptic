const deepLinks = ["mailto:", "sms:", "tel:"];
export const constructURL = (destination: string) => {
  if (deepLinks.some((link) => destination.startsWith(link))) {
    return destination;
  }

  if (destination.startsWith("http")) return destination;
  return `https://${destination}`;
};
