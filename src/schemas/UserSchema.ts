import mongoose from "mongoose";
import { UserAccountDBType } from "../types/types";

const Schema = mongoose.Schema;

const userAccountSchema = new Schema({
  email: {
    type: String,
    required: true,
  },
  userName: {
    type: String,
    required: true,
  },
  passwordHash: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
    // required:true
  },
  ip: {
    type: String,
    required: true,
  },
});

const loginAttemptSchema = new Schema([
  {
    attemptDate: {
      type: Date,
      required: true,
    },
    ip: {
      type: String,
      required: true,
    },
  },
]);

const sentConfirmationEmailsSchema = new Schema({
  sentDate: {
    type: Date,
    required: true,
  },
});

const emailConfirmationSchema = new Schema({
  isConfirmed: {
    type: Boolean,
    required: true,
  },
  confirmationCode: {
    type: String,
    required: true,
  },
  expirationDate: {
    type: Date,
    required: true,
  },
  sentEmails: [sentConfirmationEmailsSchema],
});

export const userAccountDBSchema = new Schema<UserAccountDBType>({
  accountData: userAccountSchema,
  loginAttempts: [loginAttemptSchema],
  emailConfirmation: emailConfirmationSchema,
});
