export const detectInvalidPath = (path: string) => {
  return path.includes("/app.qryptic.io") || path.includes("/admin.qryptic.io");
};
