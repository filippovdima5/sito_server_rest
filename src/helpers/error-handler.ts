type Options = {
  message: string
  status?: number
}

export interface ExtendedError extends Error {
  status: number
}

export const errorHandler = ({ message, status }: Options): ExtendedError => {
  const error = new Error(message) as ExtendedError
  error.status = status ? status : 500;
  throw error
}
