type UnarchiveDomainProps = {
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
  domainName?: string;
  mutateDomains: () => Promise<void>;
};
