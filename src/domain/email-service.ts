import { EmailManager } from "../managers/email-manager"
import { UserAccountDBType } from "../types/types";

export class EmailService {
  constructor(protected emailManager: EmailManager){}
  async recoverPassword(email: string) {
    const result = await this.emailManager.sendPasswordRecoveryMessage(email);
    return result;
  }
  async sendEmailConfirmationMassage(user: UserAccountDBType) {
    const result = await this.emailManager.sendEmailConfirmationMassage(user);
    return result;
  }
  async resendEmailConfirmationMassage(user: UserAccountDBType) {
    const result = await this.emailManager.sendEmailConfirmationMassage(user);
    return result;
  }
}

// export const emailService = {
//   async recoverPassword(email: string) {
//     const result = await emailManager.sendPasswordRecoveryMessage(email);
//     return result;
//   },
//   async sendEmailConfirmationMassage(user: UserAccountDBType) {
//     const result = await emailManager.sendEmailConfirmationMassage(user);
//     return result;
//   },
//   async resendEmailConfirmationMassage(user: UserAccountDBType) {
//     const result = await emailManager.sendEmailConfirmationMassage(user);
//     return result;
//   },
// };