import { usersRepository } from "../repositories/users-db-repository";
import bcrypt from "bcrypt";
import { CustomResponseType, UserType } from "../types/types";
import jwt from "jsonwebtoken";
import { settings } from "../settings/settings";
import { ObjectId } from "mongodb";

export const usersService = {
  async getAllUsers(pageNumber: any, pageSize: any): Promise<CustomResponseType> {
    return usersRepository.getAllUsers(+pageNumber, +pageSize);
  },
  async createUser(id: string, login: string, password: string): Promise<UserType | null> {
    const passwordSalt = await bcrypt.genSalt(10);
    const passwordHash = await this._generateHash(password, passwordSalt);
    const newUser = {
      id,
      login,
      passwordHash,
      passwordSalt,
    };
    return usersRepository.createUser(newUser);
  },
  async checkCredentials(login: string, password: string): Promise<UserType | null> {
    //   1) FIND USER
    const user = await usersRepository.findUserByLogin(login);
    if (!user) return null;
    //   2) CHECK PASSWORD
    const passwordHash = await this._generateHash(password, user.passwordSalt!);

    if (passwordHash !== user.passwordHash) return null;
    return user;
  },
  async findUserById(id: ObjectId) {
    const user = await usersRepository.findUserById(id);
    return user;
  },
  async findUserIdByToken(token: string) {
    try {
      const result: any = jwt.verify(token, settings.JWT_SECRET);
      const user = await this.findUserById(result._id);
      return user
    } catch (error) {
      return null;
    }
  },
  async deleteUser(id: any): Promise<boolean> {
    return usersRepository.deleteUser(id);
  },
  async _generateHash(password: string, salt: string) {
    return await bcrypt.hash(password, salt);
  },
};
