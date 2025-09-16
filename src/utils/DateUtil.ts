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
}
export default DateUtil;
