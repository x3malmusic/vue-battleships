import { Router } from "express";
import { check } from 'express-validator'
import { login, register } from "../controllers/auth";

import {
  NAME_PASSWORD_EMPTY,
  EMAIL_NOT_VALID,
  PASSWORD_SHORT
} from "../helpers/errorTypes";

const router = Router();

router.post('/login', login)

router.post('/register',
  [check('email', NAME_PASSWORD_EMPTY).exists(),
    check('email', EMAIL_NOT_VALID).isEmail(),
    check('password', NAME_PASSWORD_EMPTY).exists(),
    check('password', PASSWORD_SHORT).isLength({min: 6})
  ],
  register)

export default router