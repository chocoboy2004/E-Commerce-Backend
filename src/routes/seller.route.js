import { Router } from "express";
import {
    register
} from "../controllers/seller.controller.js"

const router = Router()

router.route("/register").get(register)

export default router