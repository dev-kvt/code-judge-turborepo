import { User } from "@kpmg/database";
import { atom } from "recoil";

export const userDetails = atom<User | undefined>({
  key: "user",
  default: undefined,
});
