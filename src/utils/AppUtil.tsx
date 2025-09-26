import CryptoJs from "./CryptoJs";

export class AppUtil {
  /**
   * Format number into money string
   *
   * @param amount - The number value to format
   * @param currency - Currency code (default: USD)
   * @param locale - Locale (default: en-US)
   * @returns formatted money string
   */
  static formatMoney(
    amount: number,
    currency: string = "INR",
    locale: string = "en-US"
  ): string {
    return new Intl.NumberFormat(locale, {
      style: "currency",
      currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(amount);
  }

  static generateKey(...args): string {
    const key = JSON.stringify(args);
    return CryptoJs.hashSHA256(key);
  }
}
