export const Grid = () => {
  return (
    <>
      <div className="grid-bg bg-[linear-gradient(90deg,rgba(113,113,122,.06)_1px,transparent_1px),linear-gradient(0deg,rgba(113,113,122,.06)_1px,transparent_1px),linear-gradient(90deg,rgba(113,113,122,.04)_1px,transparent_1px),linear-gradient(0deg,rgba(113,113,122,.04)_1px,transparent_1px)] bg-[length:80px_80px,80px_80px,10px_10px,10px_10px] dark:bg-[linear-gradient(90deg,rgba(113,113,122,.11)_1px,transparent_1px),linear-gradient(0deg,rgba(113,113,122,.11)_1px,transparent_1px),linear-gradient(90deg,rgba(113,113,122,.1)_1px,transparent_1px),linear-gradient(0deg,rgba(113,113,122,.1)_1px,transparent_1px)]"></div>
      <div className="radial-overlay bg-[radial-gradient(circle,transparent,white_90%)] dark:bg-[radial-gradient(circle,transparent,black_90%)]"></div>
      <div className="pointer-events-none fixed inset-0 z-[-1] overflow-hidden">
        <div className="absolute left-1/2 top-1/2 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-30 blur-3xl dark:bg-foreground/20"></div>
      </div>
    </>
  );
};
