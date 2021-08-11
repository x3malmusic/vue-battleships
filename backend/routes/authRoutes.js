import { Router } from "express";
import { check } from 'express-validator'
import { login, register, silentLogin } from "../controllers/auth";
import { verifyToken } from "../middlewares/verifyTokenMiddleware";

import {
  NAME_PASSWORD_EMPTY,
  PASSWORD_SHORT
} from "../helpers/errorTypes";

const router = Router();

router.post('/login',
  [check('name', NAME_PASSWORD_EMPTY).exists(),
  check('password', NAME_PASSWORD_EMPTY).exists()],
  login)

router.post('/register',
  [check('name', NAME_PASSWORD_EMPTY).exists(),
    check('password', NAME_PASSWORD_EMPTY).exists(),
    check('password', PASSWORD_SHORT).isLength({min: 6})
  ],
  register)

router.post('/silent-login', verifyToken, silentLogin)

export default router