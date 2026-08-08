"use client";
import { useMemo } from "react";
import { ButtonGroup } from "@/components/ui/button-group";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import {
  FilterState,
  DateFilter,
  TagFilter,
  FILTER_CATEGORIES,
  CATEGORY_LABELS,
  CATEGORY_OPTIONS,
  FilterCategory,
} from "@/app/lib/types";
import DateRangePopover from "./date-range-popover";
import { CalendarIcon, FilterIcon, XIcon, ChevronDownIcon } from "lucide-react";

interface FilterBarProps {
  filters: FilterState;
  onChange: (filters: FilterState) => void;
}

const DATE_PRESETS: { label: string; value: DateFilter }[] = [
  { label: "All Time", value: { type: "all" } },
  { label: "Last 7 days", value: { type: "preset", days: 7 } },
  { label: "Last 30 days", value: { type: "preset", days: 30 } },
  { label: "Last Year", value: { type: "preset", days: 365 } },
];

export default function FilterBar({ filters, onChange }: FilterBarProps) {
  const { date: dateFilter, tags: tagFilters } = filters;

  const activeFilterCount = useMemo(() => {
    let count = dateFilter.type !== "all" ? 1 : 0;
    count += Object.values(tagFilters).reduce(
      (sum, labels) => sum + labels.length,
      0,
    );
    return count;
  }, [dateFilter, tagFilters]);

  const handleDateChange = (newDateFilter: DateFilter) => {
    onChange({ ...filters, date: newDateFilter });
  };

  const handleTagToggle = (
    category: FilterCategory,
    label: string,
    checked: boolean,
  ) => {
    const currentLabels = tagFilters[category] || [];
    let newLabels: string[];
    if (checked) {
      newLabels = [...currentLabels, label];
    } else {
      newLabels = currentLabels.filter((l) => l !== label);
    }
    const newTagFilters = { ...tagFilters, [category]: newLabels };
    onChange({ ...filters, tags: newTagFilters });
  };

  const handleClearAll = () => {
    const clearedFilters: FilterState = {
      date: { type: "all" },
      tags: {},
    };
    onChange(clearedFilters);
  };

  const handleCustomDateSelect = (from: Date, to: Date) => {
    const newDateFilter: DateFilter = { type: "custom", from, to };
    handleDateChange(newDateFilter);
  };

  return (
    <div className="flex flex-wrap items-center gap-3 py-2 px-4">
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <FilterIcon className="h-4 w-4" />
        <span>Filters</span>
      </div>

      <Separator orientation="vertical" className="h-6" />

      <ButtonGroup className="gap-1">
        {DATE_PRESETS.map(({ label, value }) => {
          const isActive =
            dateFilter.type === value.type &&
            (value.type !== "preset" ||
              (dateFilter.type === "preset" && dateFilter.days === value.days));
          return (
            <Button
              key={label}
              variant={isActive ? "default" : "outline"}
              size="sm"
              onClick={() => handleDateChange(value)}
            >
              {label}
            </Button>
          );
        })}
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" size="sm">
              <CalendarIcon className="h-4 w-4 mr-1" />
              Custom…
            </Button>
          </PopoverTrigger>
          <PopoverContent sideOffset={5} align="start">
            <DateRangePopover
              onSelect={handleCustomDateSelect}
              initialFrom={
                dateFilter.type === "custom" ? dateFilter.from : undefined
              }
              initialTo={
                dateFilter.type === "custom" ? dateFilter.to : undefined
              }
            />
          </PopoverContent>
        </Popover>
      </ButtonGroup>

      <Separator orientation="vertical" className="h-6" />

      {FILTER_CATEGORIES.map((category) => (
        <DropdownMenu key={category}>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="gap-1">
              {CATEGORY_LABELS[category]}
              <ChevronDownIcon className="h-3 w-3" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="min-w-[200px]">
            <DropdownMenuLabel className="font-medium">
              {CATEGORY_LABELS[category]}
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            {CATEGORY_OPTIONS[category].map((label) => (
              <DropdownMenuCheckboxItem
                key={label}
                checked={tagFilters[category]?.includes(label) ?? false}
                onCheckedChange={(checked) =>
                  handleTagToggle(category, label, checked)
                }
                className="capitalize"
              >
                {label}
              </DropdownMenuCheckboxItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      ))}

      {activeFilterCount > 0 && (
        <>
          <Separator orientation="vertical" className="h-6" />
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClearAll}
            className="gap-1 text-destructive hover:text-destructive"
          >
            <XIcon className="h-3 w-3" />
            Clear ({activeFilterCount})
          </Button>
        </>
      )}
    </div>
  );
}