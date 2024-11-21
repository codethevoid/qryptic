export const detectThreat = async (url: string) => {
  try {
    const searchParams = new URLSearchParams();
    searchParams.append("uri", url.toLowerCase().trim());
    searchParams.append("threatTypes", "MALWARE");
    searchParams.append("threatTypes", "SOCIAL_ENGINEERING");
    searchParams.append("threatTypes", "UNWANTED_SOFTWARE");
    searchParams.append("key", process.env.WEBRISK_API_KEY!);
    const res = await fetch(
      `https://webrisk.googleapis.com/v1beta1/uris:search?${searchParams.toString()}`,
    );

    if (!res.ok) {
      console.error("Error detecting threat: ", res);
      return true; // assume threat
    }

    const data = await res.json();
    return data.threat?.threatTypes?.length > 0;
  } catch (e) {
    console.error("Error detecting threat: ", e);
    return true; // assume threat
  }
};
