'use client';

import * as React from "react";
import { Check, ChevronDown, Search, X } from "lucide-react";
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
import { Badge } from "@/components/ui/badge";

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

interface CountrySelectProps {
  value?: string[];
  onChange?: (value: string[]) => void;
  placeholder?: string;
  className?: string;
}

export function CountrySelect({
  value = [],
  onChange,
  placeholder = "Select countries...",
  className,
}: CountrySelectProps) {
  const [open, setOpen] = React.useState(false);
  const [search, setSearch] = React.useState("");

  const handleSelect = (countryCode: string) => {
    const newValue = value.includes(countryCode)
      ? value.filter((item) => item !== countryCode)
      : [...value, countryCode];
    onChange?.(newValue);
  };

  const removeCountry = (countryCode: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const newValue = value.filter((item) => item !== countryCode);
    onChange?.(newValue);
  };

  const clearAll = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange?.([]);
  };

  const filteredCountries = ARAB_COUNTRIES.filter(
    (country) =>
      country.name.toLowerCase().includes(search.toLowerCase()) ||
      country.code.toLowerCase().includes(search.toLowerCase()) ||
      country.dial_code.includes(search)
  );

  const selectedCountries = ARAB_COUNTRIES.filter((country) =>
    value.includes(country.code)
  );

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn(
            "w-full justify-between h-auto min-h-[44px] px-3 py-2",
            "border-gray-300 bg-white hover:bg-white hover:border-vivid-red/60",
            "focus:border-vivid-red focus:ring-2 focus:ring-vivid-red/20",
            className
          )}
        >
          <div className="flex flex-wrap items-center gap-2 flex-1">
            {selectedCountries.length > 0 ? (
              <>
                {selectedCountries.slice(0, 3).map((country) => (
                  <Badge
                    key={country.code}
                    variant="secondary"
                    className="flex items-center gap-1.5 bg-red-50 text-vivid-red hover:bg-red-100 border-vivid-red/20"
                  >
                    <img
                      src={`https://raw.githubusercontent.com/hampusborgos/country-flags/main/svg/${country.code.toLowerCase()}.svg`}
                      alt={`${country.code} flag`}
                      className="w-4 h-3 object-contain rounded-[1px]"
                    />
                    <span className="text-xs font-medium">{country.name}</span>
                    <X
                      className="w-3 h-3 ml-1 cursor-pointer hover:text-red-700"
                      onClick={(e) => removeCountry(country.code, e)}
                    />
                  </Badge>
                ))}
                {selectedCountries.length > 3 && (
                  <Badge variant="outline" className="bg-gray-100">
                    +{selectedCountries.length - 3} more
                  </Badge>
                )}
              </>
            ) : (
              <span className="text-primary-text/60">{placeholder}</span>
            )}
          </div>
          <div className="flex items-center gap-1 ml-2">
            {selectedCountries.length > 0 && (
              <X
                className="h-4 w-4 text-gray-400 hover:text-vivid-red cursor-pointer"
                onClick={clearAll}
              />
            )}
            <ChevronDown className="h-4 w-4 shrink-0 opacity-50" />
          </div>
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="w-full p-0 border-gray-200 bg-white shadow-lg"
        align="start"
      >
        <Command className="border-none">
          <CommandInput
            placeholder="Search countries..."
            value={search}
            onValueChange={setSearch}
            className="h-11 focus:ring-0"
          />
          <CommandList className="max-h-[300px]">
            <CommandEmpty className="py-6 text-center text-sm text-gray-500">
              No country found.
            </CommandEmpty>
            <CommandGroup>
              {filteredCountries.map((country) => {
                const isSelected = value.includes(country.code);
                return (
                  <CommandItem
                    key={country.code}
                    value={country.code}
                    onSelect={() => handleSelect(country.code)}
                    className="cursor-pointer py-2.5 px-3 aria-selected:bg-red-50 aria-selected:text-vivid-red"
                  >
                    <div className="flex items-center justify-between w-full">
                      <div className="flex items-center gap-3">
                        <div
                          className={cn(
                            "w-5 h-5 rounded border flex items-center justify-center",
                            isSelected
                              ? "bg-vivid-red border-vivid-red"
                              : "border-gray-300"
                          )}
                        >
                          {isSelected && (
                            <Check className="h-3.5 w-3.5 text-white" />
                          )}
                        </div>
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
                    </div>
                  </CommandItem>
                );
              })}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

// Example usage component
export function CountrySelectExample() {
  const [selectedCountries, setSelectedCountries] = React.useState<string[]>([]);

  return (
    <div className="space-y-4">
      <div>
        <label className="block font-medium text-sm text-primary-text mb-2">
          Select Arab Countries
        </label>
        <CountrySelect
          value={selectedCountries}
          onChange={setSelectedCountries}
          placeholder="Choose countries..."
        />
      </div>
      {selectedCountries.length > 0 && (
        <div className="text-sm text-gray-600">
          Selected: {selectedCountries.length} country(ies)
        </div>
      )}
    </div>
  );
}