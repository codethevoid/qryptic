export const GodRays = () => {
  if (process.env.NODE_ENV === "development") {
    return null;
  }

  return (
    <div className="absolute inset-0 z-[-1] overflow-hidden">
      <div className="jumbo absolute -inset-[10px] opacity-50"></div>
    </div>
  );
};
