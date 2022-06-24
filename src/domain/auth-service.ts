import bcrypt from "bcrypt";
import { UsersRepository } from "../repositories/users-db-repository";
import { UserAccountDBType } from "../types/types";
import { ObjectId } from "mongodb";
import { v4 as uuidv4 } from "uuid";
import add from "date-fns/add";
import { emailManager } from "../managers/email-manager";
import { emailService } from "./email-service";

class AuthService {
  constructor(private usersRepository: UsersRepository) {}
  async createUser(login: string, email: string, password: string, ip: string): Promise<UserAccountDBType | null> {
    const passwordHash = await this._generateHash(password);
    const user: UserAccountDBType = {
      _id: new ObjectId(),
      accountData: {
        userName: login,
        email,
        passwordHash,
        createdAt: new Date(),
        ip,
      },
      loginAttempts: [],
      emailConfirmation: {
        sentEmails: [], //Add to send emails, create counter or smth
        confirmationCode: uuidv4(),
        expirationDate: add(new Date(), {
          days: 1,
          hours: 0,
        }),
        isConfirmed: false,
      },
    };

    const createResult = await this.usersRepository.createUser(user);

    try {
      const result = await emailService.sendEmailConfirmationMassage(user);
      // const result = await emailManager.sendEmailConfirmationMassage(user);
      if (result) {
        await this.usersRepository.updateSentEmails(user._id);
      }
    } catch (error) {
      console.log(error);
      await this.usersRepository.deleteUser(user._id);
      console.log("registration failed , pls try once again");
    }

    return createResult;
  }
  async checkCredentials(login: string, password: string) {
    debugger
    const user: UserAccountDBType | null = await this.usersRepository.findUserByLoginOrEmail(login);
    if (!user) return null;
    // ??? Which one should go first isConfirmed or password check
    // if (!user.emailConfirmation.isConfirmed) return null;
    const areHashesEqual = await this._isPasswordCorrect(password, user.accountData.passwordHash);
    if (!areHashesEqual) return null;
    return user;
  }
  async confirmEmail(code: string): Promise<boolean> {
    const user: UserAccountDBType | null = await this.usersRepository.findUserByConfirmationCode(code);
    if (!user) return false;
    // if (user.emailConfirmation.isConfirmed) return false;
    if (user.emailConfirmation.expirationDate < new Date()) return false;
    let result: boolean = await this.usersRepository.updateConfirmation(user._id);
    return result;
  }
  async reConfirmEmail(email: string): Promise<boolean> {
    const user: UserAccountDBType | null = await this.usersRepository.findUserByLoginOrEmail(email);
    if (!user) return false;
    // if (user.emailConfirmation.expirationDate < new Date()) return false;
    // let result = await this.usersRepository.updateConfirmation(user._id);
    const newConfirmationCode = uuidv4();
    let updatedCode = await this.usersRepository.updateConfirmationCode(user._id, newConfirmationCode);
    if(!updatedCode) return false
    const updatedUser = await this.usersRepository.findUserByLoginOrEmail(email);
    if (!updatedUser) return false;

    try {
      const result = await emailService.sendEmailConfirmationMassage(updatedUser);
      // const result = await emailManager.sendEmailConfirmationMassage(user);
      if (result) {
        await this.usersRepository.updateSentEmails(user._id);


      }
      return result
    } catch (error) {
      console.log(error);
      await this.usersRepository.deleteUser(user._id);
      console.log("registration failed , pls try once again");
    }
    return false;
  }
  async _generateHash(password: string) {
    const hash = await bcrypt.hash(password, 10);
    return hash;
  }
  async _isPasswordCorrect(password: string, hash: string) {
    const isCorrect = await bcrypt.compare(password, hash);
    return isCorrect;
  }
}

const usersRepository = new UsersRepository();
export const authService = new AuthService(usersRepository);

// export const authService = {
//   async createUser(login: string, email: string, password: string): Promise<UserAccountDBType | null> {
//     const userExists = await usersRepository.findUserByLoginOrEmail(login);
//     if (userExists) return null;
//     const passwordHash = await this._generateHash(password);
//     const user: UserAccountDBType = {
//       _id: new ObjectId(),
//       accountData: {
//         userName: login,
//         email,
//         passwordHash,
//         createdAt: new Date(),
//       },
//       loginAttempts: [],
//       emailConfirmation: {
//         sentEmails: [], //Add to send emails, create counter or smth
//         confirmationCode: uuidv4(),
//         expirationDate: add(new Date(), {
//           days: 1,
//           hours: 0,
//         }),
//         isConfirmed: false,
//       },
//     };

//     const createResult = await usersRepository.createUser(user);
//     try {
//       const result = await emailManager.sendEmailConfirmationMassage(user);
//       if(result) {
//         await usersRepository.updateSentEmails(user._id);
//       }
//     } catch (error) {
//       console.log(error);
//       await usersRepository.deleteUser(user._id);
//       console.log("registration failed , pls try once again");
//     }

//     return createResult;
//   },
//   async checkCredentials(loginOrEmail: string, password: string) {
//     const user: UserAccountDBType | null = await usersRepository.findUserByLoginOrEmail(loginOrEmail);
//     if (!user) return null;
//     // ??? Which one should go first isConfirmed or password check
//     if (!user.emailConfirmation.isConfirmed) return null;
//     const areHashesEqual = await this._isPasswordCorrect(password, user.accountData.passwordHash);
//     if (!areHashesEqual) return null;
//     return user;
//   },
//   async confirmEmail(code: string): Promise<boolean> {
//     const user = await usersRepository.findUserByConfirmationCode(code);
//     if (!user) return false;
//     if (user.emailConfirmation.isConfirmed) return false;
//     if (user.emailConfirmation.expirationDate < new Date()) return false;
//     let result = await usersRepository.updateConfirmation(user._id);
//     return result;
//   },
//   async _generateHash(password: string) {
//     const hash = await bcrypt.hash(password, 10);
//     return hash;
//   },
//   async _isPasswordCorrect(password: string, hash: string) {
//     const isCorrect = await bcrypt.compare(password, hash);
//     return isCorrect;
//   },
// };
