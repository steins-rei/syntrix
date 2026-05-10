import { z } from 'zod';
import { AUTH_ERROR_MESSAGES } from '../../auth/errorMessages';

const emailErr = AUTH_ERROR_MESSAGES.email;

export const LoginSchema = z.object({
  email: z.email(({
    error: emailErr.invalid.error,
  })).trim(),
  password: z
  .string()
  .trim()
  .refine((val) => {
    return val.length >= 6 && /[0-9]/.test(val);
  }, {
    error: 'PASSWORD_INVALID',
  })
})