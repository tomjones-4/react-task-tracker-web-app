import React, { useState } from "react";
import { Task, CalendarEvent } from "../types";
import {
  Calendar,
  dateFnsLocalizer,
  SlotInfo,
  View,
  NavigateAction,
  ToolbarProps,
} from "react-big-calendar";
import { format, parse, startOfWeek, getDay } from "date-fns";
import { enUS } from "date-fns/locale/en-US";
import "react-big-calendar/lib/css/react-big-calendar.css";
import CalendarToolbar from "./CalendarToolbar";

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

const CalendarView: React.FC<CalendarViewProps> = ({
  tasks,
  onCalendarTaskClick,
  onCalendarCreateTask,
}) => {
  //const [date, setDate] = useState<Date | null>(new Date(2025, 5, 20));

  const [view, setView] = useState<View>("month");
  const [date, setDate] = useState(new Date());

  const events = tasks
    .filter((task) => task.dueDate !== null)
    .map((task) => ({
      id: task.id,
      title: task.title,
      start: new Date(task.dueDate!), // ISO string or Date
      end: new Date(task.dueDate!), // or task.dueDateEnd if available
      allDay: false,
    }));

  const handleSelectEvent = (e: CalendarEvent) => {
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

  const handleViewChange = (newView: View) => {
    setView(newView);
  };

  const handleNavigate = (
    newDate: Date,
    view: View,
    action: NavigateAction
  ) => {
    setDate(newDate);
  };

  return (
    <div className="calendar-view">
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        selectable
        view={view}
        date={date}
        onView={handleViewChange}
        onNavigate={handleNavigate}
        onSelectEvent={handleSelectEvent}
        onSelectSlot={handleSelectSlot}
        components={{
          toolbar: CalendarToolbar as React.ComponentType<
            ToolbarProps<CalendarEvent>
          >,
        }}
      />
    </div>
  );
};

export default CalendarView;
