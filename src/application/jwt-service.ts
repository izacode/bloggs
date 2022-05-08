import jwt from "jsonwebtoken";
import { UserType } from "../types/types";
import { settings } from "../settings/settings";

export const jwtService = {
  async createJWT(user: UserType) {
    const token = await jwt.sign({ userId: user.id }, settings.JWT_SECRET, { expiresIn: "90 days" });
    return { token };
  },
  async getUserIdByToken(token: string) {
    try {
      const result: any = jwt.verify(token, settings.JWT_SECRET);
      return result.userId;
    } catch (error) {
      return null;
    }
  },
};
