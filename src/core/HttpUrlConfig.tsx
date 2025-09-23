export class HttpUrlConfig {
  static getBaseUrl() {
    return "/api/v1";
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

  static getSpendsUrl() {
    return `${this.getBaseUrl()}/spends`;
  }

  static getSpendUrl(spendId: string) {
    return `${this.getBaseUrl()}/spends/${spendId}`;
  }

  static putSpendUrl(spendId: string) {
    return `${this.getBaseUrl()}/spends/${spendId}`;
  }

  static deleteSpendUrl(spendId: string) {
    return `${this.getBaseUrl()}/spends/${spendId}`;
  }

  static getCategoriesUrl() {
    return `${this.getBaseUrl()}/categories`;
  }

  static getDashboardUrl() {
    return `${this.getBaseUrl()}/dashboard`;
  }
}
