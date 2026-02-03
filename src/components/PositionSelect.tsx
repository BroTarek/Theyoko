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
    CommandSeparator,
} from "@/components/ui/command";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input";

// Sales-related positions data
const SALES_POSITIONS = [
    "Sales Manager",
    "Account Executive",
    "Business Development Representative",
    "Sales Director",
    "Account Manager",
    "Sales Engineer",
    "Regional Sales Manager",
    "Sales Consultant",
    "Inside Sales Representative",
    "Sales Operations Manager",
    "VP of Sales",
    "Chief Revenue Officer",
    "Sales Development Representative",
    "Enterprise Account Executive",
    "Channel Sales Manager",
    "Sales Trainer",
    "Sales Analyst",
    "Retail Sales Associate",
    "Field Sales Representative",
    "Sales Support Specialist",
];

interface PositionSelectProps {
    value?: string;
    onChange?: (value: string) => void;
    placeholder?: string;
    className?: string;
}

export function PositionSelect({
    value = "",
    onChange,
    placeholder = "Select a position...",
    className,
}: PositionSelectProps) {
    const [open, setOpen] = React.useState(false);
    const [search, setSearch] = React.useState("");
    const [showOtherInput, setShowOtherInput] = React.useState(false);
    const [otherValue, setOtherValue] = React.useState("");

    const handleSelect = (position: string) => {
        onChange?.(position);
        setOpen(false);
        setSearch("");
        setShowOtherInput(false);
        setOtherValue("");
    };

    const handleOtherSelect = () => {
        setShowOtherInput(true);
    };

    const handleOtherSubmit = () => {
        if (otherValue.trim()) {
            onChange?.(otherValue.trim());
            setOpen(false);
            setSearch("");
            setShowOtherInput(false);
            setOtherValue("");
        }
    };

    const handleOtherCancel = () => {
        setShowOtherInput(false);
        setOtherValue("");
    };

    const clearSelection = (e: React.MouseEvent) => {
        e.stopPropagation();
        onChange?.("");
        setSearch("");
        setOtherValue("");
        setShowOtherInput(false);
    };

    const filteredPositions = SALES_POSITIONS.filter((position) =>
        position.toLowerCase().includes(search.toLowerCase())
    );

    const hasExactMatch = SALES_POSITIONS.some(
        (position) => position.toLowerCase() === search.toLowerCase()
    );

    return (
        <Popover open={open} onOpenChange={(open) => {
            setOpen(open);
            if (!open) {
                setSearch("");
                setShowOtherInput(false);
                setOtherValue("");
            }
        }}>
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
                    <div className="flex items-center gap-2 flex-1 overflow-hidden">
                        {value ? (
                            <span className="truncate text-primary-text font-medium">
                                {value}
                            </span>
                        ) : (
                            <span className="text-primary-text/60">{placeholder}</span>
                        )}
                    </div>
                    <div className="flex items-center gap-1 ml-2 shrink-0">
                        {value && (
                            <X
                                className="h-4 w-4 text-gray-400 hover:text-vivid-red cursor-pointer"
                                onClick={clearSelection}
                            />
                        )}
                        <ChevronDown className="h-4 w-4 shrink-0 opacity-50" />
                    </div>
                </Button>
            </PopoverTrigger>
            <PopoverContent
                className="w-full p-0 border-gray-200 bg-white shadow-lg min-w-[300px]"
                align="start"
            >
                <Command className="border-none">
                    <CommandInput
                        placeholder="Search positions..."
                        value={search}
                        onValueChange={setSearch}
                        className="h-11 focus:ring-0"
                    />
                    <CommandList className="max-h-[300px]">
                        {showOtherInput ? (
                            <div className="p-4 border-b border-gray-100">
                                <div className="space-y-3">
                                    <div className="text-sm font-medium text-primary-text">
                                        Enter custom position
                                    </div>
                                    <Input
                                        placeholder="Type position title..."
                                        value={otherValue}
                                        onChange={(e) => setOtherValue(e.target.value)}
                                        autoFocus
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter') {
                                                handleOtherSubmit();
                                            }
                                            if (e.key === 'Escape') {
                                                handleOtherCancel();
                                            }
                                        }}
                                        className="h-9"
                                    />
                                    <div className="flex gap-2">
                                        <Button
                                            size="sm"
                                            onClick={handleOtherSubmit}
                                            disabled={!otherValue.trim()}
                                            className="h-8 px-3 bg-vivid-red hover:bg-vivid-red/90"
                                        >
                                            Add
                                        </Button>
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            onClick={handleOtherCancel}
                                            className="h-8 px-3"
                                        >
                                            Cancel
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <>
                                <CommandEmpty className="py-4 text-center text-sm text-gray-500">
                                    <div className="space-y-3 px-4">
                                        {search.trim() && !hasExactMatch && (
                                            <>
                                                <p>No matching position found.</p>
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={handleOtherSelect}
                                                    className="w-full h-8 text-vivid-red border-vivid-red/20 hover:bg-red-50"
                                                >
                                                    + Add "{search}" as custom position
                                                </Button>
                                            </>
                                        )}
                                    </div>
                                </CommandEmpty>
                                <CommandGroup>
                                    {filteredPositions.map((position) => {
                                        const isSelected = value === position;
                                        return (
                                            <CommandItem
                                                key={position}
                                                value={position}
                                                onSelect={() => handleSelect(position)}
                                                className="cursor-pointer py-2.5 px-3 aria-selected:bg-red-50 aria-selected:text-vivid-red"
                                            >
                                                <div className="flex items-center justify-between w-full">
                                                    <div className="flex items-center gap-3">
                                                        <div
                                                            className={cn(
                                                                "w-5 h-5 rounded-full border flex items-center justify-center",
                                                                isSelected
                                                                    ? "bg-vivid-red border-vivid-red"
                                                                    : "border-gray-300"
                                                            )}
                                                        >
                                                            {isSelected && (
                                                                <Check className="h-3.5 w-3.5 text-white" />
                                                            )}
                                                        </div>
                                                        <span className="text-sm font-medium text-primary-text">
                                                            {position}
                                                        </span>
                                                    </div>
                                                </div>
                                            </CommandItem>
                                        );
                                    })}
                                </CommandGroup>

                                {/* Always show "Other" option */}
                                {search.trim() && (
                                    <>
                                        <CommandSeparator className="bg-gray-100" />
                                        <CommandItem
                                            onSelect={handleOtherSelect}
                                            className="cursor-pointer py-2.5 px-3 text-vivid-red hover:bg-red-50"
                                        >
                                            <div className="flex items-center gap-3">
                                                <div className="w-5 h-5 rounded-full border border-vivid-red flex items-center justify-center">
                                                    <span className="text-xs font-bold">+</span>
                                                </div>
                                                <span className="text-sm font-medium">
                                                    Add "{search}" as custom position
                                                </span>
                                            </div>
                                        </CommandItem>
                                    </>
                                )}

                                {/* Show "Other" button even when there's no search */}
                                {!search.trim() && (
                                    <>
                                        <CommandSeparator className="bg-gray-100" />
                                        <CommandItem
                                            onSelect={handleOtherSelect}
                                            className="cursor-pointer py-2.5 px-3 text-vivid-red hover:bg-red-50"
                                        >
                                            <div className="flex items-center gap-3">
                                                <div className="w-5 h-5 rounded-full border border-vivid-red flex items-center justify-center">
                                                    <span className="text-xs font-bold">+</span>
                                                </div>
                                                <span className="text-sm font-medium">
                                                    Add custom position
                                                </span>
                                            </div>
                                        </CommandItem>
                                    </>
                                )}
                            </>
                        )}
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    );
}