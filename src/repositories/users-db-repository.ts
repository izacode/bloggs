import { ObjectId } from "mongodb";
import { CustomResponseType, UserType } from "../types/types";
import { usersCollection } from "./dbmongo";

export const usersRepository = {
  async getAllUsers(pageNumber: number, pageSize: number): Promise<CustomResponseType> {
    const users = await usersCollection
      .find({}, { projection: { _id: 0, passwordHash: 0, passwordSalt: 0 } })
      .skip((pageNumber - 1) * pageSize)
      .limit(pageSize)
      .sort({ id: 1 })
      .toArray();
    const totalCount: number = await usersCollection.countDocuments();

    const customResponse = {
      pagesCount: Math.ceil(totalCount / pageSize),
      page: pageNumber,
      pageSize: pageSize,
      totalCount,
      items: users,
    };
    return customResponse;
  },
  async createUser(newUser: UserType): Promise<UserType | null> {
    await usersCollection.insertOne(newUser);
    const createdUser = usersCollection.findOne(
      { login:newUser.login },
      { projection: {password: 0, passwordHash: 0, passwordSalt: 0 } }
    );
    return createdUser;
  },
  async findUserByLogin(login: string): Promise<UserType | null> {
    debugger;
    const user = await usersCollection.findOne({ login });
    return user;
  },
  async findUserById(userId: ObjectId) {
    const user = await usersCollection.findOne({ _id: userId });
    return user;
  },
  async deleteUser(id: any): Promise<boolean> {
    const isDeleted = await usersCollection.deleteOne({ id });
    debugger;
    return isDeleted.deletedCount === 1;
  },
};
