"use server";

import { db } from "@/db";
import { users } from "@/db/schema";

export const getData = async () => {
  const data = await db.select().from(users);

  return data;
};

interface CreateUserDTO {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export const createUser = async (payload: CreateUserDTO) => {
  const data = await db.insert(users).values(payload);

  return data;
}