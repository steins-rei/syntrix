type ErrorEntry = {
  error: string,
  message?: string,
  shorthand?: string,
}

export type ErrorGroup = {
  [key: string]: ErrorEntry | ErrorGroup
}

export type FlatFieldError = {
  type: string,
  error: string,
  message?: string,
  shorthand?: string,
}

type TypeTestA = {
  type: string,
  error: string,
  message?: string,
  shorthand?: string,
}

export type TypeTestB = {
  [key: string]: FlatFieldError[]
}