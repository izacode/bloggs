import { UsersRepository } from "../repositories/users-db-repository";
import bcrypt from "bcrypt";
import { CustomResponseType, UserAccountDBType, UserType } from "../types/types";
import jwt from "jsonwebtoken";
import { settings } from "../settings/settings";
import { ObjectId } from "mongodb";

class UsersService {
  constructor(private usersRepository: UsersRepository) {}
  async getAllUsers(pageNumber: any, pageSize: any): Promise<CustomResponseType> {
    return this.usersRepository.getAllUsers(+pageNumber, +pageSize);
  }

  async checkCredentials(login: string, password: string): Promise<UserAccountDBType | null> {
    const user = await this.usersRepository.findUserByLogin(login);
    if (!user) return null;
    const passwordHash = await this._generateHash(password);
    if (passwordHash !== user.accountData.passwordHash) return null;
    return user;
  }
  async findUserById(_id: ObjectId): Promise<UserAccountDBType | null> {
    const user = await this.usersRepository.findUserById(_id);
    return user;
  }
  async findUserIdByToken(token: string): Promise<UserAccountDBType | null> {
    try {
      debugger
      const result: any = jwt.verify(token, settings.JWT_SECRET);
      const user = await this.findUserById(result._id);
      return user;
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
  async deleteUser(_id: ObjectId): Promise<boolean> {
    return this.usersRepository.deleteUser(_id);
  }
  async _generateHash(password: string) {
    return await bcrypt.hash(password, 10);
  }
}

const usersRepository = new UsersRepository()
export const usersService = new UsersService(usersRepository)



// export const usersService = {
//   async getAllUsers(pageNumber: any, pageSize: any): Promise<CustomResponseType> {
//     return usersRepository.getAllUsers(+pageNumber, +pageSize);
//   },

//   async checkCredentials(login: string, password: string): Promise<UserAccountDBType | null> {
//     const user = await usersRepository.findUserByLogin(login);
//     if (!user) return null;
//     const passwordHash = await this._generateHash(password);
//     if (passwordHash !== user.accountData.passwordHash) return null;
//     return user;
//   },
//   async findUserById(_id: ObjectId): Promise<UserAccountDBType | null> {
//     const user = await usersRepository.findUserById(_id);
//     return user;
//   },
//   async findUserIdByToken(token: string): Promise<UserAccountDBType | null> {
//     try {
//       const result: any = jwt.verify(token, settings.JWT_SECRET);
//       const user = await this.findUserById(result._id);
//       return user;
//     } catch (error) {
//       return null;
//     }
//   },
//   async deleteUser(_id: ObjectId): Promise<boolean> {
//     return usersRepository.deleteUser(_id);
//   },
//   async _generateHash(password: string) {
//     return await bcrypt.hash(password, 10);
//   },
// };
