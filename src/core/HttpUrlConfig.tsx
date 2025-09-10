export class HttpUrlConfig {
  static getBaseUrl() {
    return process.env.NEXT_PUBLIC_API_BASE_URL || "/api/v1";
  }

  static getLoginUrl() {
    return `${this.getBaseUrl()}/login`;
  }

  static getRegisterUrl() {
    return `${this.getBaseUrl()}/register`;
  }

  static postSpendUrl() {
    return `${this.getBaseUrl()}/spends`;
  }

  static getCategoriesUrl() {
    return `${this.getBaseUrl()}/categories`;
  }
}
