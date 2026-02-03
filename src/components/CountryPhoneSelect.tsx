'use client';

import * as React from "react";
import { ChevronDown, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

// Arab countries data with names and codes
const ARAB_COUNTRIES = [
  { code: "SA", name: "Saudi Arabia", dial_code: "+966" },
  { code: "AE", name: "United Arab Emirates", dial_code: "+971" },
  { code: "EG", name: "Egypt", dial_code: "+20" },
  { code: "IQ", name: "Iraq", dial_code: "+964" },
  { code: "JO", name: "Jordan", dial_code: "+962" },
  { code: "LB", name: "Lebanon", dial_code: "+961" },
  { code: "KW", name: "Kuwait", dial_code: "+965" },
  { code: "QA", name: "Qatar", dial_code: "+974" },
  { code: "BH", name: "Bahrain", dial_code: "+973" },
  { code: "OM", name: "Oman", dial_code: "+968" },
  { code: "SY", name: "Syria", dial_code: "+963" },
  { code: "YE", name: "Yemen", dial_code: "+967" },
  { code: "PS", name: "Palestine", dial_code: "+970" },
  { code: "MA", name: "Morocco", dial_code: "+212" },
  { code: "DZ", name: "Algeria", dial_code: "+213" },
  { code: "TN", name: "Tunisia", dial_code: "+216" },
  { code: "LY", name: "Libya", dial_code: "+218" },
  { code: "SD", name: "Sudan", dial_code: "+249" },
  { code: "SO", name: "Somalia", dial_code: "+252" },
  { code: "MR", name: "Mauritania", dial_code: "+222" },
  { code: "DJ", name: "Djibouti", dial_code: "+253" },
  { code: "KM", name: "Comoros", dial_code: "+269" },
];

interface CountryPhoneSelectProps {
  value?: string;
  onChange?: (value: string) => void;
  phoneValue?: string;
  onPhoneChange?: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export function CountryPhoneSelect({
  value = "+966",
  onChange,
  phoneValue = "",
  onPhoneChange,
  placeholder = "1551172132",
  className,
}: CountryPhoneSelectProps) {
  const [open, setOpen] = React.useState(false);
  const [search, setSearch] = React.useState("");

  const handleSelect = (dialCode: string) => {
    onChange?.(dialCode);
    setOpen(false);
  };

  const selectedCountry = ARAB_COUNTRIES.find(
    (country) => country.dial_code === value
  ) || ARAB_COUNTRIES[0];

  const filteredCountries = ARAB_COUNTRIES.filter(
    (country) =>
      country.name.toLowerCase().includes(search.toLowerCase()) ||
      country.code.toLowerCase().includes(search.toLowerCase()) ||
      country.dial_code.includes(search)
  );

  return (
    <div className={cn("flex gap-3", className)}>
      {/* Country Code Selector */}
      <div className="relative flex-shrink-0 w-[120px]">
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              aria-expanded={open}
              className={cn(
                "w-full justify-between h-[50px] px-3 py-2 rounded-lg",
                "border border-gray-300 bg-white hover:bg-white hover:border-gray-400",
                "focus:border-gray-500 focus:ring-2 focus:ring-gray-500/20",
                "shadow-sm hover:shadow data-[state=open]:shadow-lg data-[state=open]:border-gray-500"
              )}
            >
              <div className="flex items-center gap-2 overflow-hidden">
                {selectedCountry && (
                  <>
                    <img
                      src={`https://raw.githubusercontent.com/hampusborgos/country-flags/main/svg/${selectedCountry.code.toLowerCase()}.svg`}
                      alt={`${selectedCountry.code} flag`}
                      className="w-6 h-4 object-contain flex-shrink-0"
                    />
                    <span className="truncate text-primary-text">
                      {selectedCountry.dial_code}
                    </span>
                  </>
                )}
              </div>
              <ChevronDown className="h-4 w-4 shrink-0 opacity-50 ml-2" />
            </Button>
          </PopoverTrigger>
          <PopoverContent
            className="w-[280px] p-0 border-gray-200 bg-white shadow-lg rounded-lg"
            align="start"
          >
            <Command className="border-none">
              <div className="flex items-center border-b border-gray-200 px-3">
                <Search className="mr-2 h-4 w-4 shrink-0 text-gray-400" />
                <CommandInput
                  placeholder="Search countries..."
                  value={search}
                  onValueChange={setSearch}
                  className="h-11 border-none focus:ring-0"
                />
              </div>
              <CommandList className="max-h-[300px]">
                <CommandEmpty className="py-6 text-center text-sm text-gray-500">
                  No country found.
                </CommandEmpty>
                <CommandGroup>
                  {filteredCountries.map((country) => {
                    const isSelected = value === country.dial_code;
                    return (
                      <CommandItem
                        key={country.code}
                        value={country.code}
                        onSelect={() => handleSelect(country.dial_code)}
                        className="cursor-pointer py-2.5 px-3 aria-selected:bg-gray-100"
                      >
                        <div className="flex items-center justify-between w-full">
                          <div className="flex items-center gap-3">
                            <img
                              src={`https://raw.githubusercontent.com/hampusborgos/country-flags/main/svg/${country.code.toLowerCase()}.svg`}
                              alt={`${country.code} flag`}
                              className="w-6 h-4 object-contain rounded-[2px]"
                            />
                            <div className="flex flex-col">
                              <span className="text-sm font-medium text-primary-text">
                                {country.name}
                              </span>
                              <span className="text-xs text-gray-500">
                                {country.dial_code}
                              </span>
                            </div>
                          </div>
                          {isSelected && (
                            <ChevronDown className="h-4 w-4 text-gray-500 rotate-180" />
                          )}
                        </div>
                      </CommandItem>
                    );
                  })}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
      </div>

      {/* Phone Number Input */}
      <div className="relative flex-1">
        <input
          type="tel"
          value={phoneValue}
          onChange={(e) => onPhoneChange?.(e.target.value)}
          placeholder={placeholder}
          className="w-full h-[50px] px-4 rounded-lg border border-gray-300 bg-white text-primary-text 
            placeholder:text-gray-400 placeholder:text-sm
            focus:outline-none focus:ring-2 focus:ring-gray-500/20 focus:border-gray-500
            hover:border-gray-400 transition-all duration-200 ease-in-out
            shadow-sm hover:shadow-md focus:shadow-lg"
        />
        <div className="absolute inset-0 rounded-lg ring-0 ring-gray-500/20 pointer-events-none transition-all duration-200" />
      </div>
    </div>
  );
}

// Usage example component
export function PhoneNumberSection() {
  const [countryCode, setCountryCode] = React.useState("+966");
  const [phoneNumber, setPhoneNumber] = React.useState("");

  return (
    <div className="space-y-2">
      <label className="block font-medium text-sm text-primary-text transition-colors duration-200">
        Phone Number
      </label>
      <CountryPhoneSelect
        value={countryCode}
        onChange={setCountryCode}
        phoneValue={phoneNumber}
        onPhoneChange={setPhoneNumber}
        placeholder="1551172132"
      />
      <p className="text-xs text-gray-500 pt-1">
        We'll only contact you about your inquiry
      </p>
    </div>
  );
}