import { z } from 'zod';
import { prisma } from '../../prisma';
import { AUTH_REQUIREMENTS } from '../../auth/authRequirements';
import { AUTH_ERROR_MESSAGES } from '../../auth/errorMessages';

const usernameReq = AUTH_REQUIREMENTS.username;
const passwordReq = AUTH_REQUIREMENTS.password;

const usernameErr = AUTH_ERROR_MESSAGES.username;
const passwordErr = AUTH_ERROR_MESSAGES.password;
const emailErr = AUTH_ERROR_MESSAGES.email;

export const SignupSchema = z.object({
  username: z
  .string()
  .trim()
  .min(usernameReq.minLength, {
    error: usernameErr.improperLength.error,
  })
  .max(usernameReq.maxLength, {
    error: usernameErr.improperLength.error,
  })
  .refine(val => !/[^a-zA-Z0-9_.]/.test(val), {
    error: usernameErr.invalidChar.error,
  }),
  email: z.email(({
    error: emailErr.invalid.error,
  })).trim(),
  password: z
  .string()
  .min(passwordReq.minLength, {
    error: passwordErr.improperLength.error
  })
  .max(passwordReq.maxLength, {
    error: passwordErr.improperLength.error
  })
  .regex(/[0-9]/, {
    error: passwordErr.missing.error
  })
  .trim(),
}).superRefine(async (data, ctx) => {
  const existingUser = await prisma.user.findUnique({
    where: {username: data.username}
  })
  const existingEmail = await prisma.user.findUnique({
    where: {email: data.email}
  })

  if (existingUser) {
    ctx.addIssue({
      path: ['username'],
      code: z.ZodIssueCode.custom,
      message: usernameErr.taken.error,
    })
  }
  if(existingEmail) {
    ctx.addIssue({
      path: ['email'],
      code: z.ZodIssueCode.custom,
      error: emailErr.taken,
    })
  }
})