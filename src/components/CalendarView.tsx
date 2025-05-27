import React, { useState } from "react";
import { Task } from "../types";
import { Calendar, dateFnsLocalizer, SlotInfo } from "react-big-calendar";
import { format, parse, startOfWeek, getDay } from "date-fns";
import { enUS } from "date-fns/locale/en-US";
import "react-big-calendar/lib/css/react-big-calendar.css";

const locales = { "en-US": enUS };
const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

interface CalendarViewProps {
  tasks: Task[];
  onCalendarTaskClick: (task: Task) => void;
  onCalendarCreateTask: (startDate: Date) => void;
}

type event = {
  id: number;
  title: string;
  start: Date; // ISO string or Date
  end: Date; // or task.dueDateEnd if available
  allDay: boolean;
};

const CalendarView: React.FC<CalendarViewProps> = ({
  tasks,
  onCalendarTaskClick,
  onCalendarCreateTask,
}) => {
  //const [date, setDate] = useState<Date | null>(new Date(2025, 5, 20));

  const events = tasks
    .filter((task) => task.dueDate !== null)
    .map((task) => ({
      id: task.id,
      title: task.title,
      start: new Date(task.dueDate!), // ISO string or Date
      end: new Date(task.dueDate!), // or task.dueDateEnd if available
      allDay: false,
    }));

  const handleSelectEvent = (e: event) => {
    const task = tasks.find((t) => t.id === e.id);
    if (!task) {
      console.warn("No task found on calendar select");
      return;
    }
    onCalendarTaskClick(task);
  };

  const handleSelectSlot = (slotInfo: SlotInfo) => {
    // You get slotInfo.start and slotInfo.end (JS Date objects)
    onCalendarCreateTask(slotInfo.start); // pass to form/modal
  };

  return (
    <div className="calendar-view">
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        selectable
        onSelectEvent={handleSelectEvent}
        onSelectSlot={handleSelectSlot}
      />
    </div>
  );
};

export default CalendarView;
