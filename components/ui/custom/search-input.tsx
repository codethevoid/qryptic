import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { InputHTMLAttributes } from "react";
import { Search, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

type SearchInputProps = InputHTMLAttributes<HTMLInputElement> & {
  placeholder: string;
  wrapperClassName?: string;
  inputClassName?: string;
  search: string;
  setSearch: (value: string) => void;
};

export const SearchInput = ({
  wrapperClassName,
  inputClassName,
  placeholder,
  search,
  setSearch,
  ...props
}: SearchInputProps) => {
  return (
    <div className={cn(`relative flex w-full max-w-[260px] items-center`, wrapperClassName)}>
      <Search size={14} className="absolute left-2.5 text-muted-foreground" />
      <Input
        className={cn("h-8 w-full pl-8", inputClassName)}
        placeholder={placeholder}
        value={search}
        {...props}
      />
      <Button
        size="icon"
        variant="link"
        onClick={() => setSearch("")}
        className={`absolute right-[1px] top-[1px] h-[30px] w-[30px] text-muted-foreground hover:text-foreground ${search ? "scale-100 opacity-100" : "scale-0 opacity-0"} bg-background transition-all`}
      >
        <XCircle size={14} />
      </Button>
    </div>
  );
};
