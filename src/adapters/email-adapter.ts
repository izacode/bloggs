import nodemailer from "nodemailer";
import { settings } from "../settings/settings";

export const emailAdapter = {
  async sendEmail(email: string, subject: string, message: string) {
    let transport = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: settings.EMAIL_ADAPTER_USER,
        pass: settings.EMAIL_ADAPTER_PASSWORD,
      },
    });

    // send email with defined transport object
    let info = await transport.sendMail({
      from: settings.EMAIL_ADAPTER_TEST_EMAIL_FROM, // sender address
      to: email,
      subject: subject,
      html: message,
    });

   
    return true;
  },
};
