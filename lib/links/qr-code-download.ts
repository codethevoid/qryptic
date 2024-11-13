const downloadBlob = (blob: Blob, filename: string) => {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

export const downloadSVG = (svg: SVGSVGElement, filename: string) => {
  const svgData = new XMLSerializer().serializeToString(svg);
  const blob = new Blob([svgData], { type: "image/svg+xml;charset=utf-8" });
  downloadBlob(blob, filename);
};

export const downloadPNG = (
  svg: SVGSVGElement,
  logo: string | null,
  logoDimensions: { height: number; width: number },
  filename: string,
  height: number,
  width: number,
) => {
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");

  // Serialize the SVG to string
  const svgData = new XMLSerializer().serializeToString(svg);
  const svgBlob = new Blob([svgData], { type: "image/svg+xml;charset=utf-8" });
  const url = URL.createObjectURL(svgBlob);

  // Create an image from the SVG
  const img = new Image();
  img.crossOrigin = "anonymous"; // Ensure cross-origin images are handled properly
  img.src = url;

  img.onload = () => {
    // Draw the QR code (SVG) on the canvas
    ctx?.drawImage(img, 0, 0, width, height);

    // If there's a logo, draw it in the center of the QR code
    if (logo) {
      // const logoImg = new Image();
      // logoImg.crossOrigin = "anonymous"; // Handle cross-origin for the logo image
      // logoImg.src = logo;

      const proxyUrl = `/api/proxy-image?url=${encodeURIComponent(logo)}`;
      const logoImg = new Image();
      logoImg.crossOrigin = "anonymous";
      logoImg.src = proxyUrl;

      logoImg.onload = () => {
        // Calculate the center position for the logo
        const logoX = (canvas.width - logoDimensions.width) / 2;
        const logoY = (canvas.height - logoDimensions.height) / 2;

        // Draw the logo in the center of the QR code
        ctx?.drawImage(logoImg, logoX, logoY, logoDimensions.width, logoDimensions.height);

        // Convert the canvas to a PNG and trigger download
        canvas.toBlob((blob) => {
          if (blob) {
            downloadBlob(blob, filename);
          }
        });
      };
    } else {
      // If there's no logo, directly download the QR code as PNG
      canvas.toBlob((blob) => {
        if (blob) {
          downloadBlob(blob, filename);
        }
      });
    }

    // Revoke the object URL to free memory
    // URL.revokeObjectURL(url);
  };

  img.onerror = () => {
    console.error("Failed to load QR code as an image.");
  };
};
