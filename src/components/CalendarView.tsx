import React, { useState } from "react";
import { Task } from "../types";
import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import { format, parse, startOfWeek, getDay } from "date-fns";
import "react-big-calendar/lib/css/react-big-calendar.css";
// import DatePicker from "react-datepicker";

const locales = { "en-US": require("date-fns/locale/en-US") };
const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

interface CalendarViewProps {
  tasks: Task[];
}

const CalendarView: React.FC<CalendarViewProps> = ({ tasks }) => {
  const [date, setDate] = useState<Date | null>(new Date(2025, 5, 20));

  const events = tasks
    .filter((task) => task.dueDate !== null)
    .map((task) => ({
      title: task.title,
      start: new Date(task.dueDate!), // ISO string or Date
      end: new Date(task.dueDate!), // or task.dueDateEnd if available
      allDay: false,
    }));

  return (
    <div className="calendar-view">
      <p>Calendar view</p>
      <div style={{ height: "80vh" }}>
        <Calendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          style={{ height: "100%" }}
        />
      </div>
      {/* <DatePicker
        className="datepicker-input"
        calendarClassName="datepicker-calendar"
        selected={date}
        onChange={(date) => setDate(date)}
        placeholderText="Select a due date"
        dateFormat="MMMM d, yyyy"
        isClearable
        disabled={false}
      /> */}
    </div>
  );
};

export default CalendarView;
