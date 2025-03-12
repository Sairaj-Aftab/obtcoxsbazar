import * as React from "react";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";
import { Button } from "./button";
import { cn } from "@/lib/utils";
import { Check, ChevronsUpDown } from "lucide-react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "./command";

export const ComboBox = React.forwardRef(
  ({
    items = [],
    onSearch,
    onSelect,
    displayValue,
    placeholder = "Select...",
    loading = false,
    value,
    className,
  }) => {
    const [open, setOpen] = React.useState(false);
    const [selectedValue, setSelectedValue] = React.useState(value || "");

    React.useEffect(() => {
      setSelectedValue(value || "");
    }, [value]);

    // Ensure items is always an array
    const safeItems = Array.isArray(items) ? items : [];

    return (
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className={cn("w-full justify-between", className)}
          >
            {selectedValue || placeholder}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full p-0">
          <Command>
            <CommandInput
              placeholder={`Search ${placeholder.toLowerCase()}...`}
              onValueChange={onSearch}
            />
            <CommandList>
              <CommandEmpty>
                {loading ? "Loading..." : "No results found."}
              </CommandEmpty>
              <CommandGroup>
                {safeItems.map((item) => {
                  // Skip if item is undefined or displayValue can't be called on it
                  if (!item || typeof displayValue !== "function") return null;

                  try {
                    const displayText = displayValue(item);
                    return (
                      <CommandItem
                        key={displayText || Math.random().toString()}
                        onSelect={() => {
                          setSelectedValue(displayText);
                          setOpen(false);
                          onSelect(item);
                        }}
                      >
                        <Check
                          className={cn(
                            "mr-2 h-4 w-4",
                            selectedValue === displayText
                              ? "opacity-100"
                              : "opacity-0"
                          )}
                        />
                        {displayText}
                      </CommandItem>
                    );
                  } catch (error) {
                    console.error("Error displaying item:", error);
                    return null;
                  }
                })}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    );
  }
);
ComboBox.displayName = "ComboBox";
