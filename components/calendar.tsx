import React, { useState } from "react";

const WEEKDAYS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate();
}

function getCalendarMatrix(year: number, month: number) {
  const daysInMonth = getDaysInMonth(year, month);
  const firstDayOfWeek = new Date(year, month, 1).getDay();
  const prevMonth = month === 0 ? 11 : month - 1;
  const prevMonthYear = month === 0 ? year - 1 : year;
  const daysInPrevMonth = getDaysInMonth(prevMonthYear, prevMonth);

  const matrix: { date: Date; currentMonth: boolean }[][] = [];
  let day = 1;
  let nextMonthDay = 1;

  for (let week = 0; week < 6; week++) {
    const row = [];
    for (let d = 0; d < 7; d++) {
      let cellDate: Date;
      let isCurrentMonth = true;
      if (week === 0 && d < firstDayOfWeek) {
        // Previous month
        cellDate = new Date(prevMonthYear, prevMonth, daysInPrevMonth - firstDayOfWeek + d + 1);
        isCurrentMonth = false;
      } else if (day > daysInMonth) {
        // Next month
        cellDate = new Date(year, month + 1, nextMonthDay++);
        isCurrentMonth = false;
      } else {
        // Current month
        cellDate = new Date(year, month, day++);
      }
      row.push({ date: cellDate, currentMonth: isCurrentMonth });
    }
    matrix.push(row);
    if (day > daysInMonth && nextMonthDay > 7) break;
  }
  return matrix;
}

export default function Calendar({
  value,
  onChange,
}: {
  value?: Date;
  onChange?: (date: Date) => void;
}) {
  const [current, setCurrent] = useState(
    value ? new Date(value) : new Date()
  );
  const year = current.getFullYear();
  const month = current.getMonth();
  const matrix = getCalendarMatrix(year, month);

  const handlePrev = () => setCurrent(new Date(year, month - 1, 1));
  const handleNext = () => setCurrent(new Date(year, month + 1, 1));

  return (
    <div className="w-80 p-4 border rounded bg-white">
      <div className="flex justify-between items-center mb-2">
        <button onClick={handlePrev} type="button" className="px-2 py-1">&lt;</button>
        <span className="font-semibold">
          {current.toLocaleString("default", { month: "long" })} {year}
        </span>
        <button onClick={handleNext} type="button" className="px-2 py-1">&gt;</button>
      </div>
      <div className="grid grid-cols-7 mb-1 text-center text-xs font-medium text-gray-700">
        {WEEKDAYS.map((wd) => (
          <div key={wd} className="py-1 w-full">{wd}</div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-1 text-center">
        {matrix.flat().map(({ date, currentMonth }, idx) => (
          <button
            key={idx}
            className={`py-1 rounded w-full
              ${!currentMonth
                ? "text-gray-400 bg-gray-100 cursor-not-allowed"
                : value && date.toDateString() === value.toDateString()
                ? "bg-blue-500 text-white"
                : "hover:bg-blue-100"
              }`}
            disabled={!currentMonth}
            onClick={() => currentMonth && onChange?.(date)}
            type="button"
          >
            {date.getDate()}
          </button>
        ))}
      </div>
    </div>
  );
}