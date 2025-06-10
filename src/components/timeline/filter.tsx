"use client";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { CalendarIcon } from "lucide-react";
import { format, parseISO } from "date-fns";
import { ja } from "date-fns/locale";
import { useState, useEffect } from "react";
import { PostType } from "@/types/post";

// Use a consistent date format for serialization
const DATE_FORMAT = 'yyyy-MM-dd';

// Helper to safely parse dates
const safeParseDate = (date: string | Date | undefined): Date | undefined => {
  if (!date) return undefined;
  return date instanceof Date ? date : parseISO(date);
};

interface FilterProps {
  filterType: PostType | null;
  setFilterType: (type: PostType | null) => void;
  filterDate: Date | undefined;
  setFilterDate: (date: Date | undefined) => void;
}

export default function TimelineFilter({ 
  filterType, 
  setFilterType, 
  filterDate, 
  setFilterDate 
}: FilterProps) {
  const [isMounted, setIsMounted] = useState(false);

  // Only render date-related UI after mounting to avoid hydration mismatches
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Format date consistently
  const formatDate = (date: Date | undefined) => {
    if (!date) return '';
    return format(date, DATE_FORMAT, { locale: ja });
  };

  const handleTypeChange = (type: PostType | null) => {
    setFilterType(type);
  };

  const handleDateChange = (newDate: Date | undefined) => {
    const normalizedDate = newDate ? new Date(newDate.setHours(0, 0, 0, 0)) : undefined;
    setFilterDate(normalizedDate);
  };

  return (
    <div className="flex flex-wrap items-center gap-4 p-2 bg-white rounded-lg shadow">
      <div className="flex items-center space-x-2">
        <Button
          variant={filterType === null ? 'default' : 'outline'}
          size="sm"
          onClick={() => handleTypeChange(null)}
        >
          すべて
        </Button>
        <Button
          variant={filterType === 'totu' ? 'default' : 'outline'}
          size="sm"
          onClick={() => handleTypeChange('totu')}
        >
          凸
        </Button>
        <Button
          variant={filterType === 'boko' ? 'destructive' : 'outline'}
          size="sm"
          onClick={() => handleTypeChange('boko')}
        >
          凹
        </Button>
      </div>

      {isMounted && (
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className={cn(
                "w-[240px] justify-start text-left font-normal",
                !filterDate && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {filterDate ? formatDate(filterDate) : <span>日付でフィルター</span>}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={filterDate}
              onSelect={handleDateChange}
              initialFocus
              locale={ja}
            />
          </PopoverContent>
        </Popover>
      )}

      {(filterType || filterDate) && (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => {
            setFilterType(null);
            setFilterDate(undefined);
          }}
        >
          フィルターをリセット
        </Button>
      )}
    </div>
  );
}
