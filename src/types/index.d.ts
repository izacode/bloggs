import { UserType } from "../repositories/types";

declare global {
  declare namespace Express {
    export interface Request {
      context: {
        user: UserType | null;
      }
    }
  }
}
