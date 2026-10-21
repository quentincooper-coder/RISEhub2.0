"use client";

import { useMemo, useState } from "react";
import { addMonths, eachDayOfInterval, endOfMonth, endOfWeek, format, isSameDay, isSameMonth, startOfMonth, startOfWeek } from "date-fns";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { MeetingRow } from "@/components/meetings/meetings-client";

const WEEKDAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export function MeetingsCalendar({ meetings, onMeetingClick }: { meetings: MeetingRow[]; onMeetingClick: (meeting: MeetingRow) => void }) {
  const [month, setMonth] = useState(() => startOfMonth(new Date()));
  const today = new Date();
  const days = useMemo(() => eachDayOfInterval({
    start: startOfWeek(startOfMonth(month), { weekStartsOn: 1 }),
    end: endOfWeek(endOfMonth(month), { weekStartsOn: 1 }),
  }), [month]);
  const meetingsByDay = useMemo(() => {
    const map = new Map<string, MeetingRow[]>();
    for (const meeting of meetings) {
      const date = new Date(meeting.date);
      if (Number.isNaN(date.getTime())) continue;
      const key = format(date, "yyyy-MM-dd");
      const existing = map.get(key) ?? [];
      existing.push(meeting);
      map.set(key, existing);
    }
    for (const entries of map.values()) entries.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    return map;
  }, [meetings]);

  return (
    <section aria-label="Meetings Calendar" className="mb-6 overflow-hidden rounded-xl border-2 border-[#00875A] bg-background shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-3 bg-[#123D32]/10 px-4 py-4 sm:px-5">
        <div>
          <h2 className="text-base font-bold text-foreground">Meetings Calendar</h2>
          <p className="text-xs text-muted-foreground">{format(month, "MMMM yyyy")} · Past and upcoming meetings</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => setMonth(startOfMonth(new Date()))}>Today</Button>
          <Button variant="outline" size="icon" aria-label="Previous month" onClick={() => setMonth(m => addMonths(m, -1))}><ChevronLeft className="h-4 w-4" /></Button>
          <Button variant="outline" size="icon" aria-label="Next month" onClick={() => setMonth(m => addMonths(m, 1))}><ChevronRight className="h-4 w-4" /></Button>
        </div>
      </div>
      <div className="overflow-x-auto">
        <div className="min-w-[700px]">
          <div className="grid grid-cols-7 border-b border-[#00875A] bg-[#538C7B] text-white">
            {WEEKDAYS.map(day => <div key={day} className="py-2.5 text-center text-xs font-bold uppercase tracking-wide">{day}</div>)}
          </div>
          <div className="grid grid-cols-7">
            {days.map(day => {
              const key = format(day, "yyyy-MM-dd");
              const entries = meetingsByDay.get(key) ?? [];
              const inMonth = isSameMonth(day, month);
              const isToday = isSameDay(day, today);
              return (
                <div key={key} className={`group min-h-28 border-b border-r border-[#00875A]/60 p-2 transition-colors duration-150 hover:bg-[#78FAAE]/15 sm:min-h-32 ${inMonth ? "bg-background" : "bg-muted/40"}`}>
                  <div className="mb-2 flex justify-end">
                    <span aria-label={isToday ? "Today" : undefined} className={`flex h-6 min-w-6 items-center justify-center rounded-full px-1 text-xs font-bold ${isToday ? "bg-[#123D32] text-[#78FAAE]" : inMonth ? "text-foreground" : "text-muted-foreground"}`}>{format(day, "d")}</span>
                  </div>
                  <div className="space-y-1">
                    {entries.map(meeting => (
                      <button key={meeting.id} type="button" onClick={() => onMeetingClick(meeting)}
                        title={`${format(new Date(meeting.date), "HH:mm")} · ${meeting.title}`}
                        className="block w-full rounded-md border border-[#00875A] bg-[#428C78] px-2 py-1.5 text-left text-[11px] font-semibold leading-tight text-white shadow-sm transition-all duration-150 hover:-translate-y-0.5 hover:border-[#123D32] hover:bg-[#175D49] hover:shadow-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#00875A]">
                        <span className="break-words">{format(new Date(meeting.date), "HH:mm")} {meeting.market?.code ? `${meeting.market.code} · ` : ""}{meeting.title}</span>
                      </button>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
