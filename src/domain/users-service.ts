import { usersRepository } from "../repositories/users-db-repository";
import bcrypt from "bcrypt";
import { CustomResponseType, UserType } from "../types/types";

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
  async deleteUser(id: any): Promise<boolean> {
    return usersRepository.deleteUser(id);
  },
  async _generateHash(password: string, salt: string) {
    return await bcrypt.hash(password, salt);
  },
};
