import { AUTH_REQUIREMENTS } from "./authRequirements";
import { ErrorGroup, FlatFieldError, TypeTestB } from "@/types/FieldErrors";

export const AUTH_ERROR_MESSAGES = {
  username: {
    improperLength: {
      error: "USERNAME_IMPROPER_LENGTH",
      message: `Contain ${AUTH_REQUIREMENTS.username.minLength}-${AUTH_REQUIREMENTS.username.maxLength} characters`
    },
    invalidChar: {
      error: "USERNAME_INVALID_CHAR",
      message: `Only contain letters (Aa-Zz), numbers (1-9), periods (.), and underscores (_)`
    },
    taken: {
      error: "USERNAME_TAKEN",
      message: `Not already be taken`
    }
  },
  password: {
    improperLength: {
      error: "PASSWORD_IMPROPER_LENGTH",
      message: `Contain atleast ${AUTH_REQUIREMENTS.password.minLength} characters`
    },
    missing: {
      error: "PASSWORD_MISSING_NUMBER",
      message: `Contain atleast 1 number`
    },
  },
  email: {
    invalid: {
      error: "EMAIL_INVALID",
      message: "Invalid email address"
    },
    taken: {
      error: "EMAIL_IN_USE",
      message: "Email already in use"
    },
  }
} as const satisfies ErrorGroup;

export const getFlatErrors = (): TypeTestB => {
  const flatErrors: TypeTestB = {};

  Object.entries(AUTH_ERROR_MESSAGES).forEach(([field, fieldErrors]) => {
    const errors: FlatFieldError[] = [];

    Object.entries(fieldErrors).forEach(([type, error]) => {
      errors.push({
        type,
        error: typeof error === 'string' ? error: error.error || '',
        message: typeof error === 'string' ? error: error.message || '',
        shorthand: typeof error === 'string' ? error: error.shorthand || ''
      })
      flatErrors[field] = errors;
    })
  });

  return flatErrors;
}