import React, { useState } from "react";
import DatePicker from "react-datepicker";

const CalendarView = () => {
  const [date, setDate] = useState<Date | null>(new Date(2025, 5, 20));

  return (
    <div className="calendar-view">
      <p>Calendar view</p>
      <DatePicker
        className="datepicker-input"
        calendarClassName="datepicker-calendar"
        selected={date}
        onChange={(date) => setDate(date)}
        placeholderText="Select a due date"
        dateFormat="MMMM d, yyyy"
        isClearable
        disabled={false}
      />
    </div>
  );
};

export default CalendarView;
