import React, { useState } from "react";
import { Task, CalendarEvent, Time } from "../types";
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
  const combineDateAndTime = (date: Date, time: Time): Date => {
    let hour = time.hour % 12;
    if (time.ampm === "PM") hour += 12;

    const result = new Date(date);
    result.setHours(hour);
    result.setMinutes(time.minute);
    result.setSeconds(0);
    result.setMilliseconds(0);
    return result;
  };

  const [view, setView] = useState<View>("month");
  const [date, setDate] = useState(new Date());

  const events = tasks
    .filter((task) => task.dueDate !== null)
    .map((task) => ({
      id: task.id,
      title: task.title,
      start: task.startTime
        ? combineDateAndTime(task.dueDate!, task.startTime)
        : new Date(task.dueDate!),
      end: task.endTime
        ? combineDateAndTime(task.dueDate!, task.endTime)
        : new Date(task.dueDate!),
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
