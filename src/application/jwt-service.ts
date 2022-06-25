import jwt from "jsonwebtoken";
import { UserAccountDBType, UserType } from "../types/types";
import { settings } from "../settings/settings";

class JwtService {
  async createJWT(user: UserAccountDBType) {
    const token = await jwt.sign({ userId: user._id }, settings.JWT_SECRET, { expiresIn: settings.JWT_EXPIRATION });
    return token;
  }
  async createRefreshJWT(user: UserAccountDBType) {
    const token = await jwt.sign({ userId: user._id }, settings.REFRESH_JWT_SECRET, { expiresIn: settings.JWT_REFRESH_EXPIRATION });
    return token;
  }
  async getUserIdByToken(token: string) {
    try {
      const result: any = jwt.verify(token, settings.JWT_SECRET);

      return result.userId;
    } catch (error) {
      return null;
    }
  }
}

export const jwtService = new JwtService();

