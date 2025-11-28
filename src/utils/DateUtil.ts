import moment from "moment-timezone";

class DateUtil {
  static currentDate() {
    const now = new Date();
    return `${now.getFullYear()}-${(now.getMonth() + 1)
      .toString()
      .padStart(2, "0")}`;
  }

  static getISTDate(): string {
    // Get current IST time
    const istTime = moment().tz("Asia/Kolkata");

    return istTime.format(); // Default ISO format
  }

  // utc to ist date in AM/PM format
  static convertUTCToISTDate(utcDate: Date): string {
    const istDate = moment(utcDate).tz("Asia/Kolkata");
    return istDate.format("DD-MM-YYYY hh:mm A");
  }

  static getCurrentMonthStartEndDate() {
    // Get current month start & end in IST
    const startOfMonthIST = moment.tz("Asia/Kolkata").startOf("month");
    const endOfMonthIST = moment.tz("Asia/Kolkata").endOf("month");

    // Convert them to UTC for DB queries
    const startDate = startOfMonthIST.clone().utc().toDate();
    const endDate = endOfMonthIST.clone().utc().toDate();

    return { startDate, endDate };
  }

  // Get start and end date based on argument month and year number
  static getMonthStartEndDate(month: number, year: number) {
    // month is 1–12; moment expects 0–11
    const m = month - 1;

    // Start of month in IST
    const startIST = moment.tz(
      { year: year, month: m, day: 1, hour: 0, minute: 0, second: 0 },
      "Asia/Kolkata"
    );

    // End of month in IST (23:59:59.999)
    const endIST = startIST.clone().endOf("month");

    // Convert both to UTC
    const startDate = startIST.clone().utc().toDate();
    const endDate = endIST.clone().utc().toDate();

    return {
      startDate,
      endDate,
    };
  }

  static getCurrentDayStartEndDate() {
    // Get current month start & end in IST
    const startOfMonthIST = moment.tz("Asia/Kolkata").startOf("day");
    const endOfMonthIST = moment.tz("Asia/Kolkata").endOf("day");

    // Convert them to UTC for DB queries
    const startDate = startOfMonthIST.clone().utc().toDate();
    const endDate = endOfMonthIST.clone().utc().toDate();
    return { startDate, endDate };
  }
}
export default DateUtil;
