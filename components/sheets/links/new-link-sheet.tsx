import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";

type NewLinkSheetProps = {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
};

export const NewLinkSheet = ({ isOpen, setIsOpen }: NewLinkSheetProps) => {
  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetContent className="w-full max-w-[1000px]">
        <SheetHeader>
          <SheetTitle>New Link</SheetTitle>
        </SheetHeader>
        <div></div>
      </SheetContent>
    </Sheet>
  );
};
