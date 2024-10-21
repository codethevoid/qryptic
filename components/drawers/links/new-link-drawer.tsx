import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";

type NewLinkDrawerProps = {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
};

export const NewLinkDrawer = ({ isOpen, setIsOpen }: NewLinkDrawerProps) => {
  return (
    <Drawer open={isOpen} onOpenChange={setIsOpen}>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>New Link</DrawerTitle>
        </DrawerHeader>
      </DrawerContent>
    </Drawer>
  );
};
