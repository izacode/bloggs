import { emailManager } from "../managers/email-manager"
import { UserAccountDBType } from "../types/types";



export const emailService = {
  async recoverPassword(email: string) {
    const result = await emailManager.sendPasswordRecoveryMessage(email);
    return result;
  },
  async sendEmailConfirmationMassage(user: UserAccountDBType) {
    const result = await emailManager.sendEmailConfirmationMassage(user);
    return result;
  },
  async resendEmailConfirmationMassage(user: UserAccountDBType) {
    const result = await emailManager.sendEmailConfirmationMassage(user);
    return result;
  },
};