import * as React from "react";
import { Label } from "./label";
import { Input } from "./input";
import { FormControl, FormField, FormItem, FormLabel } from "./form";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";
import { Checkbox } from "./checkbox";

export function SelectWithSearch({
  items = [],
  value,
  onChange,
  onItemSelect,
  onSearchChange,
  displayValue,
  displayField,
  idField,
  label,
  placeholder = "Select an item",
  searchPlaceholder = "Search...",
  isLoading = false,
  disabled = false,
  formControl,
  name,
}) {
  const [search, setSearch] = React.useState("");
  const [selectedItem, setSelectedItem] = React.useState(null);

  // Filter items based on search
  const filteredItems = React.useMemo(() => {
    if (!items || !Array.isArray(items)) return [];

    return items.filter((item) =>
      item[displayField]?.toLowerCase().includes(search.toLowerCase())
    );
  }, [items, search, displayField]);

  // Find selected item when value changes
  React.useEffect(() => {
    if (value && items && Array.isArray(items)) {
      const found = items.find((item) => item[idField] === value);
      if (found) {
        setSelectedItem(found);
      }
    } else {
      setSelectedItem(null);
    }
  }, [idField, items, value]);

  // Handle item selection
  const handleItemSelect = (item) => {
    const newValue = value === item[idField] ? "" : item[idField];
    onChange(newValue);

    if (newValue && onItemSelect) {
      onItemSelect(item);
    } else {
      setSelectedItem(null);
    }
  };

  const renderContent = () => (
    <>
      <div className="flex flex-col gap-2">
        <Label htmlFor={name || "select-search"}>{label}</Label>
        <Input
          value={selectedItem ? displayValue(selectedItem) : value}
          placeholder={placeholder}
          readOnly
          disabled={disabled}
        />
      </div>
    </>
  );

  if (formControl && name) {
    return (
      <FormField
        control={formControl}
        name={name}
        render={({ field }) => (
          <FormItem>
            <Popover>
              <PopoverTrigger asChild className="w-full">
                <div className="flex flex-col gap-2">
                  <FormLabel>{label}</FormLabel>
                  <FormControl>
                    <Input
                      value={selectedItem ? displayValue(selectedItem) : value}
                      placeholder={placeholder}
                      readOnly
                      disabled={disabled}
                    />
                  </FormControl>
                </div>
              </PopoverTrigger>
              <PopoverContent className="w-[360px] sm:w-[420px] p-2">
                <Input
                  type="text"
                  placeholder={searchPlaceholder}
                  value={search}
                  onChange={(e) => {
                    const newSearchTerm = e.target.value;
                    setSearch(newSearchTerm);
                    if (onSearchChange) {
                      onSearchChange(newSearchTerm);
                    }
                  }}
                  className="w-full mb-2"
                  autoFocus
                />
                <div className="flex space-x-5 font-semibold text-sm">
                  <span>#</span>
                  <span>{label}</span>
                </div>

                <div className="max-h-[200px] overflow-y-auto mt-1">
                  {isLoading ? (
                    <div className="h-[150px] w-full flex items-center justify-center">
                      Loading...
                    </div>
                  ) : filteredItems.length > 0 ? (
                    filteredItems.map((item) => (
                      <div
                        key={item[idField]}
                        className="w-full flex space-x-3 space-y-0 mb-2 items-center"
                      >
                        <Checkbox
                          checked={field.value === item[idField]}
                          onCheckedChange={() => {
                            const newValue =
                              field.value === item[idField]
                                ? ""
                                : item[idField];
                            field.onChange(newValue);
                            if (newValue) {
                              setSelectedItem(item);
                              if (onItemSelect) onItemSelect(item);
                            } else {
                              setSelectedItem(null);
                            }
                          }}
                        />
                        <Label
                          className="font-normal w-full cursor-pointer"
                          onClick={() => {
                            const newValue =
                              field.value === item[idField]
                                ? ""
                                : item[idField];
                            field.onChange(newValue);
                            if (newValue) {
                              setSelectedItem(item);
                              if (onItemSelect) onItemSelect(item);
                            } else {
                              setSelectedItem(null);
                            }
                          }}
                        >
                          {item[displayField]}
                        </Label>
                      </div>
                    ))
                  ) : (
                    <div className="h-[150px] w-full flex justify-center items-center">
                      <p className="text-sm font-semibold text-red-500">
                        No items found
                      </p>
                    </div>
                  )}
                </div>
              </PopoverContent>
            </Popover>
          </FormItem>
        )}
      />
    );
  }

  return (
    <Popover>
      <PopoverTrigger asChild className="w-full">
        {renderContent()}
      </PopoverTrigger>
      <PopoverContent className="w-[360px] sm:w-[420px] p-2">
        <Input
          type="text"
          placeholder={searchPlaceholder}
          value={search}
          onChange={(e) => {
            const newSearchTerm = e.target.value;
            setSearch(newSearchTerm);
            if (onSearchChange) {
              onSearchChange(newSearchTerm);
            }
          }}
          className="w-full mb-2"
          autoFocus
        />
        <div className="flex space-x-5 font-semibold text-sm">
          <span>#</span>
          <span>{label}</span>
        </div>

        <div className="max-h-[200px] overflow-y-auto mt-1">
          {isLoading ? (
            <div className="h-[150px] w-full flex items-center justify-center">
              Loading...
            </div>
          ) : filteredItems.length > 0 ? (
            filteredItems.map((item) => (
              <div
                key={item[idField]}
                className="w-full flex space-x-3 space-y-0 mb-2 items-center"
              >
                <Checkbox
                  checked={value === item[idField]}
                  onCheckedChange={() => handleItemSelect(item)}
                />
                <Label
                  className="font-normal w-full cursor-pointer"
                  onClick={() => handleItemSelect(item)}
                >
                  {item[displayField]}
                </Label>
              </div>
            ))
          ) : (
            <div className="h-[150px] w-full flex justify-center items-center">
              <p className="text-sm font-semibold text-red-500">
                No items found
              </p>
            </div>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}
