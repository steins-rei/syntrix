import z from 'zod';

import { SignupSchema } from "./auth/SignupSchema";
import { LoginSchema } from "./auth/LoginSchema";

export const schemaRegistry: any = {
  SignupSchema,
  LoginSchema,
}

export function getAllSchemaNames() {
  return Object.keys(schemaRegistry);
}