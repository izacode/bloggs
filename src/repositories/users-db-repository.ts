import { ObjectId } from "mongodb";
import { AttemptModel, UserAccountDBModel } from "../models/models";
import { CustomResponseType, UserAccountDBType } from "../types/types";

// import { registrationIpCollection, requestsCollection, usersAccountCollection, usersCollection } from "./dbmongo";

export class UsersRepository {
  async checkTokenList(refreshToken: string, _id: string): Promise<Boolean> {
    const doc = await UserAccountDBModel.findById({ _id: new ObjectId(_id) });

    if (!doc) return false;

    return doc.accountData.revokedRefreshTokens.includes(refreshToken);
  }
  async updateTokenList(refreshToken: string, _id: string): Promise<Boolean> {
    const doc = await UserAccountDBModel.findById({ _id: new ObjectId(_id) });
    if (!doc) return false;
    doc.accountData.revokedRefreshTokens.push(refreshToken);
    await doc.save();
  
    return true;
  }
  async getAllUsers(pageNumber: number, pageSize: number): Promise<CustomResponseType> {
    const users = await UserAccountDBModel.find({}, { projection: { _id: 0, passwordHash: 0, passwordSalt: 0 } })
      .skip((pageNumber - 1) * pageSize)
      .limit(pageSize)
      .sort({ id: 1 })
      .lean();

    const totalCount: number = await UserAccountDBModel.countDocuments();

    const customResponse = {
      pagesCount: Math.ceil(totalCount / pageSize),
      page: pageNumber,
      pageSize: pageSize,
      totalCount,
      items: users,
    };
    return customResponse;
  }
  async createUser(user: UserAccountDBType): Promise<UserAccountDBType | null> {
    await UserAccountDBModel.create(user);
    const createdUser = await UserAccountDBModel.findOne({ _id: user._id });
    return createdUser;
  }
  async findUserByLoginOrEmail(loginOrEmail: string): Promise<UserAccountDBType | null> {
    const user = await UserAccountDBModel.findOne({
      $or: [{ "accountData.userName": loginOrEmail }, { "accountData.email": loginOrEmail }],
    }).lean();
    return user;
  }
  async findUserByLogin(login: string): Promise<UserAccountDBType | null> {
    const user = await UserAccountDBModel.findOne({ login });
    return user;
  }
  async findUserById(_id: ObjectId): Promise<UserAccountDBType | null> {
    const user = await UserAccountDBModel.findOne({ _id: new ObjectId(_id) });
    return user;
  }
  async findUserByConfirmationCode(code: string): Promise<UserAccountDBType | null> {
    const user = await UserAccountDBModel.findOne({ "emailConfirmation.confirmationCode": code });
    return user;
  }
  async updateConfirmation(_id: ObjectId): Promise<boolean> {
    const result = await UserAccountDBModel.updateOne({ _id }, { $set: { "emailConfirmation.isConfirmed": true } });
    return result.matchedCount === 1;
  }
  async updateConfirmationCode(_id: ObjectId, newCode: string): Promise<boolean> {
    const result = await UserAccountDBModel.updateOne({ _id }, { $set: { "emailConfirmation.confirmationCode": newCode } });
    return result.matchedCount === 1;
  }
  async updateSentEmails(_id: ObjectId): Promise<boolean> {
    const doc = await UserAccountDBModel.findById({ _id });
    if (!doc) return false;
    doc.emailConfirmation.sentEmails.push({ sentDate: new Date() });
    await doc.save();
    return true;
  }
  async deleteUser(_id: ObjectId): Promise<boolean> {
    const isDeleted = await UserAccountDBModel.deleteOne({ _id });
    return isDeleted.deletedCount === 1;
  }

  async deleteAllUsers() {
    await UserAccountDBModel.deleteMany({});
    const totalCount: number = await UserAccountDBModel.countDocuments({});
    if (totalCount !== 0) return false;
    return true;
  }
  async deleteAllUsersAccount() {
    await UserAccountDBModel.deleteMany({});
    const totalCount: number = await UserAccountDBModel.countDocuments({});
    if (totalCount !== 0) return false;
    return true;
  }

  // Ips and requests================================================================
  async deleteAllIps() {
    await AttemptModel.deleteMany({});
    const totalCount: number = await AttemptModel.countDocuments({});
    if (totalCount !== 0) return false;
    return true;
  }
  // async deleteAllRequests() {
  //   await requestsCollection.deleteMany({});
  //   const totalCount: number = await requestsCollection.countDocuments({});
  //   if (totalCount !== 0) return false;
  //   return true;
  // }
  // async saveRequests(income: any): Promise<boolean> {
  //   await requestsCollection.insertOne(income);

  //   const isAdded = await requestsCollection.findOne({ requestIp: income.requestIp });
  //   if (!isAdded) return false;
  //   return true;
  // }
  // async getAllRequests() {
  //   const list = await registrationIpCollection.find().toArray();
  //   return list;
  // }
}
// ==============================================================================================================================
// export const usersRepository = {
//   async getAllUsers(pageNumber: number, pageSize: number): Promise<CustomResponseType> {
//     const users = await usersCollection
//       .find({}, { projection: { _id: 0, passwordHash: 0, passwordSalt: 0 } })
//       .skip((pageNumber - 1) * pageSize)
//       .limit(pageSize)
//       .sort({ id: 1 })
//       .toArray();
//     const totalCount: number = await usersCollection.countDocuments();

//     const customResponse = {
//       pagesCount: Math.ceil(totalCount / pageSize),
//       page: pageNumber,
//       pageSize: pageSize,
//       totalCount,
//       items: users,
//     };
//     return customResponse;
//   },
//   async createUser(user: UserAccountDBType): Promise<UserAccountDBType | null> {
//     await usersAccountCollection.insertOne(user);
//     const createdUser = usersAccountCollection.findOne({ _id: user._id });
//     return createdUser;
//   },
//   async findUserByLoginOrEmail(loginOrEmail: string): Promise<UserAccountDBType | null> {
//     const user = await usersAccountCollection.findOne({$or: [{login: loginOrEmail}, {email: loginOrEmail}] });
//     return user;
//   },
//   async findUserByLogin(login:string):Promise<UserAccountDBType|null>{
//     const user = await usersAccountCollection.findOne({login})
//     return user
//   }
//   ,
//   // async findUserById(userId: string): Promise<UserType | null> {
//   //   const user = await usersCollection.findOne({ id: userId });
//   //   return user;
//   // },
//   async findUserById(_id: ObjectId): Promise<UserAccountDBType | null> {
//     const user = await usersAccountCollection.findOne({ _id });
//     return user;
//   },
//   async findUserByConfirmationCode(code:string):Promise<UserAccountDBType |null>{
//     const user = await usersAccountCollection.findOne({ "emailConfirmaiton.confirmationCode": code });
//     return user
//   },
//   async updateConfirmation(_id: ObjectId):Promise<boolean>{
//     const result = await usersAccountCollection.updateOne({ _id }, { $set: {"emailConfirmation.isConfirmed": true } });
//     return result.matchedCount === 1
//   },
//   async updateSentEmails(_id: ObjectId):Promise<boolean>{
//     const result = await usersAccountCollection.updateOne({ _id }, { $set: { "emailConfirmation.sentEmails": [1] } });
//     return result.matchedCount === 1
//   },
//   async deleteUser(_id: ObjectId): Promise<boolean> {
//     const isDeleted = await usersAccountCollection.deleteOne({ _id });
//     return isDeleted.deletedCount === 1;
//   },
//   // async deleteUser(id: string): Promise<boolean> {
//   //   const isDeleted = await usersCollection.deleteOne({ id });
//   //   return isDeleted.deletedCount === 1;
//   // },
// };
