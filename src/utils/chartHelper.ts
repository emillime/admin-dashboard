type TimeFrame = "hour" | "day" | "week" | "month";

export function formatChartData(
  bookings: Booking[],
  groupBy: TimeFrame
): { x: Date; y: number }[] {
  const groupedData = {};

  bookings.forEach((booking) => {
    const bookingDate = new Date(booking.startTimeLocal);
    const dateKey = getDateKey(bookingDate, groupBy);
    if (!groupedData[dateKey.toString()]) {
      groupedData[dateKey.toString()] = {
        x: dateKey.getTime(),
        y: 0,
      };
    }
    groupedData[dateKey.toString()].y += booking.bookingId.paidAmount;
  });



  return Object.values(groupedData);
}

function getDateKey(date: Date, timeFrame: TimeFrame): Date {
  var newDate = date;
  switch (timeFrame) {
    case "hour":
      newDate = new Date(
        date.getFullYear(),
        date.getMonth(),
        date.getDate(),
        date.getHours()
      );
      break;
    case "day":
      newDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
      break;
    case "week":
      const year = date.getFullYear();
      const week = getWeekNumber(date);
      newDate = getStartDateOfWeek(year, week);
      break;
    case "month":
      const yearmonth = date.getFullYear();
      const month = date.getMonth();
      newDate = new Date(yearmonth, month);
      break;
  }
  return newDate;
}

function getEveryDateBetween(startDate: Date, endDate: Date): Date[] {
  const dates = [];
  let currentDate = startDate;
  while (currentDate <= endDate) {
    dates.push(new Date(currentDate));
    currentDate.setDate(currentDate.getDate() + 1);
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
