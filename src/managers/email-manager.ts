import { emailAdapter } from "../adapters/email-adapter";
import { UserAccountDBType } from "../types/types";

export class EmailManager{
 async sendPasswordRecoveryMessage(email: string) {
    const subject: string = `This is password recovery message`;
    const message: string = "<H1>This is password recovery message , if you didn't ask for it , please ignire<H1/>";
    const info = await emailAdapter.sendEmail(email, subject, message);
    return info;
  }
  async sendEmailConfirmationMassage(user: UserAccountDBType) {
    const subject: string = "This is email confirmation message";
    const message: string =
      `<H1> Please confirm your email <a href='https://somesite.com/confirm-email?code=${user.emailConfirmation.confirmationCode}'>confirm email <a/><H1/>`;

    const result = await emailAdapter.sendEmail(user.accountData.email, subject, message);

    return result;
  }
}


