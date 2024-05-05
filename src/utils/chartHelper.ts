import { DateTime, type DateTimeUnit } from "luxon";

export function formatChartData(
  startDate: Date,
  endDate: Date,
  bookings: Booking[],
  groupBy: DateTimeUnit
): { x: number; y: number }[] {
  const groupedData: {
    [date: string]: { x: number; y: number };
  } = {};

  let dates = getEveryDateBetween(startDate, endDate, groupBy);
  dates.forEach((date) => {
    groupedData[date.toString()] = {
      x: date.getTime(),
      y: 0,
    };
  });

  bookings.forEach((booking) => {
    const startTime = DateTime.fromJSDate(booking.startTime);
    const dateKey = startTime.startOf(groupBy).toJSDate();
    if(groupedData[dateKey.toString()] == null) {
      return;
    }
    groupedData[dateKey.toString()].y += booking.bookingId.paidAmount;
  });

  return Object.values(groupedData);
}

export function getEveryDateBetween(
  startDate: Date,
  endDate: Date,
  unit: DateTimeUnit
): Date[] {
  const dates = [];
  let currentDate = DateTime.fromJSDate(startDate).startOf(unit);
  let endTime = DateTime.fromJSDate(endDate).startOf(unit);
  while (currentDate <= endTime) {
    dates.push(new Date(currentDate.startOf(unit).toJSDate()));
    currentDate = currentDate.plus({ [unit]: 1 });
  }
  return dates;
}

function getWeekNumber(date: Date): number {
  const firstDayOfYear = new Date(date.getFullYear(), 0, 1);
  const pastDaysOfYear = (date.getTime() - firstDayOfYear.getTime()) / 86400000;
  return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
}

function getStartDateOfWeek(year: number, week: number): Date {
  const startDate = new Date(year, 0, 1 + (week - 1) * 7);
  const day = startDate.getDay();
  startDate.setDate(startDate.getDate() - day + (day === 0 ? -6 : 1));
  return startDate;
}
