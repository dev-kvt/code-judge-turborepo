import { Submission, User } from "@kpmg/database";

export type UserWithSubmissions = {
  submissions: Submission[];
} & User;
