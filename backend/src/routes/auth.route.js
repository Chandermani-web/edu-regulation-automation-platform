import express from 'express';
import { login, logout, getProfile } from '../controllers/auth.controller.js';
import { auth } from '../middlewares/auth.middlware.js';

const router = express.Router();

router.post("/login", login);
router.post("/logout", auth, logout);
router.get("/profile", auth, getProfile);

export default router;