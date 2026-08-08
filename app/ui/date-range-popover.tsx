"use client";
import { useState } from "react";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CalendarIcon, XIcon } from "lucide-react";

interface DateRangePopoverProps {
  onSelect: (from: Date, to: Date) => void;
  initialFrom?: Date;
  initialTo?: Date;
}

export default function DateRangePopover({ onSelect, initialFrom, initialTo }: DateRangePopoverProps) {
  const [from, setFrom] = useState<Date | undefined>(initialFrom);
  const [to, setTo] = useState<Date | undefined>(initialTo);
  const [open, setOpen] = useState(false);

  const handleApply = () => {
    if (from && to) {
      onSelect(from, to);
    }
    setOpen(false);
  };

  const handleClear = () => {
    setFrom(undefined);
    setTo(undefined);
  };

  const formatDate = (date: Date | undefined) => {
    if (!date) return "";
    return date.toISOString().split("T")[0];
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className="w-full justify-start gap-2"
          aria-label="Custom date range"
        >
          <CalendarIcon className="h-4 w-4" />
          <span>Custom range…</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-4" sideOffset={5}>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">From</label>
            <Input
              type="date"
              value={formatDate(from)}
              onChange={(e) => setFrom(e.target.value ? new Date(e.target.value) : undefined)}
              max={formatDate(new Date())}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">To</label>
            <Input
              type="date"
              value={formatDate(to)}
              onChange={(e) => setTo(e.target.value ? new Date(e.target.value) : undefined)}
              max={formatDate(new Date())}
              min={from ? formatDate(from) : undefined}
            />
          </div>
          <div className="flex items-center justify-end gap-2 pt-2">
            {(from || to) && (
              <Button variant="ghost" size="sm" onClick={handleClear}>
                <XIcon className="h-3 w-3 mr-1" />
                Clear
              </Button>
            )}
            <Button size="sm" onClick={handleApply} disabled={!from || !to}>
              Apply
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}