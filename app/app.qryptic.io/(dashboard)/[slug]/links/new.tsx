import { NewLinkSheet } from "@/components/sheets/links/new-link-sheet";
import { NewLinkDrawer } from "@/components/drawers/links/new-link-drawer";
import { useMediaQuery } from "react-responsive";

type NewLinkProps = {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
};

export const NewLink = ({ isOpen, setIsOpen }: NewLinkProps) => {
  const isDesktop = useMediaQuery({ minWidth: 768 });

  if (isDesktop) return <NewLinkSheet isOpen={isOpen} setIsOpen={setIsOpen} />;
  return <NewLinkDrawer isOpen={isOpen} setIsOpen={setIsOpen} />;
};
