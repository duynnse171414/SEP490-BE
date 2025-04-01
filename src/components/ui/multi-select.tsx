// React and hooks imports
import React, { useState } from "react";

// Third-party component imports
import { Check, ChevronsUpDown, ListFilter, X } from "lucide-react";

// Local UI component imports
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

// Utility imports
import { cn } from "@/lib/utils";

export interface Option {
  label: string;
  value: string;
}

interface MultiSelectProps {
  options: Option[];
  selectedValues: Option[];
  onValueChange: (selected: Option[]) => void;
  placeholder?: string;
  className?: string;
  maxSelectedValues?: number;
}

export const MultiSelect = ({
  options,
  selectedValues,
  onValueChange,
  placeholder = "Select items...",
  className,
  maxSelectedValues,
}: MultiSelectProps) => {
  const [open, setOpen] = useState(false);

  const handleSelect = (option: Option) => {
    // Check if item is already selected
    const isSelected = selectedValues.some(item => item.value === option.value);
    
    if (isSelected) {
      // Remove the item
      onValueChange(selectedValues.filter(item => item.value !== option.value));
    } else {
      // Check if we've reached the max selected values
      if (maxSelectedValues && selectedValues.length >= maxSelectedValues) {
        return;
      }
      // Add the item
      onValueChange([...selectedValues, option]);
    }
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <div
          role="combobox"
          aria-expanded={open}
          className={cn(
            "flex min-h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
            className
          )}
          onClick={() => setOpen(!open)}
        >
          <div className="flex gap-1 flex-wrap">
            {selectedValues.length > 0 ? (
              selectedValues.map(item => (
                <div key={item.value} className="bg-secondary text-secondary-foreground px-2 py-1 rounded-md flex items-center gap-1 text-xs">
                  {item.label}
                  <X 
                    className="h-3 w-3 cursor-pointer" 
                    onClick={(e) => {
                      e.stopPropagation();
                      onValueChange(selectedValues.filter(i => i.value !== item.value));
                    }}
                  />
                </div>
              ))
            ) : (
              <span className="text-muted-foreground">{placeholder}</span>
            )}
          </div>
          <ChevronsUpDown className="h-4 w-4 opacity-50" />
        </div>
      </PopoverTrigger>
      <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
        <Command>
          <CommandInput placeholder={placeholder} />
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>
            <CommandGroup>
              {options.map((option) => {
                const isSelected = selectedValues.some(item => item.value === option.value);
                return (
                  <CommandItem
                    key={option.value}
                    onSelect={() => handleSelect(option)}
                    className="flex items-center gap-2"
                  >
                    <div className={cn(
                      "border rounded-sm h-4 w-4 flex items-center justify-center",
                      isSelected ? "bg-primary border-primary" : "border-input"
                    )}>
                      {isSelected && <Check className="h-3 w-3 text-primary-foreground" />}
                    </div>
                    {option.label}
                  </CommandItem>
                );
              })}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}; 