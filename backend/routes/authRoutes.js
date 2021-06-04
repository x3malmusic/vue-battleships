import { Router } from "express";
import { check } from 'express-validator'
import { login, register } from "../controllers/auth";

import {
  NAME_PASSWORD_EMPTY,
  PASSWORD_SHORT
} from "../helpers/errorTypes";

const router = Router();

router.post('/login', login)

router.post('/register',
  [check('name', NAME_PASSWORD_EMPTY).exists(),
    check('password', NAME_PASSWORD_EMPTY).exists(),
    check('password', PASSWORD_SHORT).isLength({min: 6})
  ],
  register)

export default router