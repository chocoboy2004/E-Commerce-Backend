import { Router } from "express";
import {
    register,
    login,
    logout
} from "../controllers/seller.controller.js"
import verifySeller from "../middlewares/seller.auth.js";

const router = Router()

router.route("/register").post(register)
router.route("/login").post(login)
router.route("/logout").post(verifySeller, logout)

export default router