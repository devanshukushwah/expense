import crypto from "crypto";

export default class CryptoJs {
  static hashSHA256(text) {
    return crypto.createHash("sha256").update(text).digest("hex");
  }
}
