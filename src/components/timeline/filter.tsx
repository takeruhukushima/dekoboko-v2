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
import { format } from "date-fns";
import { ja } from "date-fns/locale";
import { useState } from "react";
import { PostType } from "@/types/post";

interface FilterProps {
  onFilterChange: (type: PostType | null, date: Date | undefined) => void;
}

export default function TimelineFilter({ onFilterChange }: FilterProps) {
  const [selectedType, setSelectedType] = useState<PostType | null>(null);
  const [date, setDate] = useState<Date | undefined>();

  const handleTypeChange = (type: PostType | null) => {
    setSelectedType(type);
    onFilterChange(type, date);
  };

  const handleDateChange = (newDate: Date | undefined) => {
    setDate(newDate);
    onFilterChange(selectedType, newDate);
  };

  return (
    <div className="flex items-center space-x-4 mb-4">
      <div className="space-x-2">
        <Button
          variant={selectedType === null ? "default" : "outline"}
          onClick={() => handleTypeChange(null)}
        >
          すべて
        </Button>
        <Button
          variant={selectedType === "totu" ? "default" : "outline"}
          onClick={() => handleTypeChange("totu")}
        >
          凸
        </Button>
        <Button
          variant={selectedType === "boko" ? "default" : "outline"}
          onClick={() => handleTypeChange("boko")}
        >
          凹
        </Button>
      </div>

      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant={date ? "default" : "outline"}
            className={cn(
              "justify-start text-left font-normal",
              !date && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date ? format(date, "PPP", { locale: ja }) : "日付で絞り込み"}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={date}
            onSelect={handleDateChange}
            initialFocus
          />
        </PopoverContent>
      </Popover>

      {(selectedType || date) && (
        <Button
          variant="ghost"
          onClick={() => {
            setSelectedType(null);
            setDate(undefined);
            onFilterChange(null, undefined);
          }}
        >
          フィルターをクリア
        </Button>
      )}
    </div>
  );
}
