export const USER_NOT_FOUND = 'USER_NOT_FOUND'
export const USER_EXIST = 'USER_EXIST'
export const NAME_PASSWORD_WRONG = 'NAME_PASSWORD_WRONG'
export const NAME_PASSWORD_EMPTY = 'NAME_PASSWORD_EMPTY'
export const UNKNOWN_ERROR = 'UNKNOWN_ERROR'
export const EMAIL_NOT_VALID = 'EMAIL_NOT_VALID'
export const PASSWORD_SHORT = 'PASSWORD_SHORT'
export const NOT_AUTHORIZED = 'NOT_AUTHORIZED'
export const AUTHORIZATION_DENIED = 'AUTHORIZATION_DENIED'
export const NO_FILE_TO_UPLOAD = 'NO_FILE_TO_UPLOAD'
export const UPLOAD_FAILED = 'UPLOAD_FAILED'
export const FILE_NOT_FOUND = 'FILE_NOT_FOUND'
export const DATABASE_ERROR = 'DATABASE_ERROR'

export default {
  [USER_NOT_FOUND]: { message: 'User is not found', status: 404 },
  [USER_EXIST]: { message: 'User already exist', status: 400 },
  [EMAIL_NOT_VALID]: { message: 'Email is not valid', status: 400},
  [NAME_PASSWORD_WRONG]: { message: 'Name or password is wrong', status: 400 },
  [NAME_PASSWORD_EMPTY]: { message: 'Name and password are required', status: 400 },
  [PASSWORD_SHORT]:  { message: 'Password is too short', status: 400 },
  [NOT_AUTHORIZED]:  { message: 'Not authorized', status: 403 },
  [AUTHORIZATION_DENIED]:  { message: 'Authorization denied', status: 403 },
  [NO_FILE_TO_UPLOAD]:  { message: 'No file to upload', status: 400 },
  [UPLOAD_FAILED]:  { message: 'Something went wrong while uploading image', status: 400 },
  [FILE_NOT_FOUND]:  { message: 'File not found', status: 404 },
  [DATABASE_ERROR]:  { message: 'Database error', status: 400 },
  [UNKNOWN_ERROR]:  { message: 'Something went wrong', status: 500 },
}

