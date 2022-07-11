import jwt from "jsonwebtoken";
import { UserAccountDBType, UserType } from "../types/types";
// import { settings } from "../settings/settings";
import { settings } from "../settings/new-settings";

// import { cookie } from "express-validator";
import { UsersRepository } from "../repositories/users-db-repository";

class JwtService {
  constructor(private usersRepository: UsersRepository) {}
  async createJWT(user: UserAccountDBType) {
    const token = jwt.sign({ userId: user._id }, settings.JWT_SECRET, { expiresIn: settings.JWT_EXPIRATION });
    return token;
  }
  async createRefreshJWT(user: UserAccountDBType) {
    const token = jwt.sign({ userId: user._id }, settings.REFRESH_JWT_SECRET, { expiresIn: settings.JWT_REFRESH_EXPIRATION });
    return token;
  }
  async veriFyRefreshToken(token: string) {
    try {
      const result: any = jwt.verify(token, settings.REFRESH_JWT_SECRET);

      return result.userId;
    } catch (error) {
      return null;
    }
  }
  async getUserIdByToken(token: string) {
    try {
     
      const result: any = jwt.verify(token, settings.JWT_SECRET);
      return result.userId;
    } catch (error) {
      return null;
    }
  }
  async checkRefreshToken(refreshToken: string) {
    const decoded: any = jwt.verify(refreshToken, settings.REFRESH_JWT_SECRET, (err, decoded) => {
      if (err) return false;
      return decoded;
    });
    return decoded
  }
}
const usersRepository = new UsersRepository();
export const jwtService = new JwtService(usersRepository);


