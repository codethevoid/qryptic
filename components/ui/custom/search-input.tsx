import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { InputHTMLAttributes } from "react";
import { Search } from "lucide-react";

type SearchInputProps = InputHTMLAttributes<HTMLInputElement> & {
  placeholder: string;
  className?: string;
};

export const SearchInput = ({ className, placeholder, ...props }: SearchInputProps) => {
  return (
    <div className="relative flex w-full max-w-[300px] items-center">
      <Search size={15} className="absolute left-2.5 text-muted-foreground" />
      <Input
        className={cn("h-[32px] w-full pl-8", className)}
        placeholder={placeholder}
        {...props}
      />
    </div>
  );
};
