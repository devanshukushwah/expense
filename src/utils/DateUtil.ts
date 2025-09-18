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

  static getCurrentMonthStartEndDate() {
    // Get current month start & end in IST
    const startOfMonthIST = moment.tz("Asia/Kolkata").startOf("month");
    const endOfMonthIST = moment.tz("Asia/Kolkata").endOf("month");

    // Convert them to UTC for DB queries
    const startDate = startOfMonthIST.clone().utc().toDate();
    const endDate = endOfMonthIST.clone().utc().toDate();
    return { startDate, endDate };
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
