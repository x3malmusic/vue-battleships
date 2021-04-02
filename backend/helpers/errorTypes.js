export const USER_NOT_FOUND = 'USER_NOT_FOUND'
export const USER_EXIST = 'USER_EXIST'
export const NAME_PASSWORD_WRONG = 'NAME_PASSWORD_WRONG'
export const NAME_PASSWORD_EMPTY = 'NAME_PASSWORD_EMPTY'
export const UNKNOWN_ERROR = 'UNKNOWN_ERROR'
export const EMAIL_NOT_VALID = 'EMAIL_NOT_VALID'
export const PASSWORD_SHORT = 'PASSWORD_SHORT'

export default {
  USER_NOT_FOUND: { message: 'User is not found', status: 404 },
  USER_EXIST: { message: 'User already exist', status: 400 },
  EMAIL_NOT_VALID: {message: 'Email is not valid', status: 400},
  NAME_PASSWORD_WRONG: { message: 'Name or password is wrong', status: 400 },
  NAME_PASSWORD_EMPTY: { message: 'Name and password are required', status: 400 },
  PASSWORD_SHORT:  {message: 'Password is too short', status: 400},
  UNKNOWN_ERROR:  {message: 'Something went wrong', status: 500},
}

