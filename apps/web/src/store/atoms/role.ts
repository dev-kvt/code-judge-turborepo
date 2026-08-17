import { atom } from "recoil";

export type Role = "STUDENT" | "TEACHER";

export const roleState = atom<Role>({
  key: "roleState",
  default: "STUDENT",
});
