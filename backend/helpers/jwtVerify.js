import jwt from 'jsonwebtoken'
import errors, { NOT_AUTHORIZED, AUTHORIZATION_DENIED } from "./errorTypes";

const verifyToken = async (auth) => {
  if(!auth) return errors[NOT_AUTHORIZED].message;

  const token = JSON.parse(auth).token
  if (!token) return errors[NOT_AUTHORIZED].message;

  await jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return errors[AUTHORIZATION_DENIED].message;
  });
}

export default verifyToken