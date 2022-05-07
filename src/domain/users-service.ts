import { usersRepository } from "../repositories/users-db-repository";
import bcrypt from "bcrypt";
import { CustomResponseType, UserType } from "../types/types";
import jwt from "jsonwebtoken";
import { settings } from "../settings/settings";


export const usersService = {
  async getAllUsers(pageNumber: any, pageSize: any): Promise<CustomResponseType> {
    return usersRepository.getAllUsers(+pageNumber, +pageSize);
  },
  async createUser(login: string, password: string): Promise<UserType | null> {
    const passwordSalt = await bcrypt.genSalt(10);
    const passwordHash = await this._generateHash(password, passwordSalt);
    const newUser = {
      id: (new Date).toString(),
      login,
      passwordHash,
      passwordSalt,
    };
    return usersRepository.createUser(newUser);
  },
  async checkCredentials(login: string, password: string): Promise<UserType | null> {
    const user = await usersRepository.findUserByLogin(login);
    if (!user) return null;
    const passwordHash = await this._generateHash(password, user.passwordSalt!);
    if (passwordHash !== user.passwordHash) return null;
    return user;
  },
  async findUserById(id: string): Promise<UserType | null> {
    const user = await usersRepository.findUserById(id);
    return user;
  },
  async findUserIdByToken(token: string): Promise<UserType | null> {
    try {
      const result: any = jwt.verify(token, settings.JWT_SECRET);
      const user = await this.findUserById(result._id);
      return user;
    } catch (error) {
      return null;
    }
  },
  async deleteUser(id: string): Promise<boolean> {
    return usersRepository.deleteUser(id);
  },
  async _generateHash(password: string, salt: string) {
    return await bcrypt.hash(password, salt);
  },
};
