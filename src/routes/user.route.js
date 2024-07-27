import { Router } from "express";
import verifyJWT from "../middlewares/auth.middleware.js";
import {
    registerUser,
    loginUser,
    logoutUser,
    updateProfile,
    deleteUser,
    currentUser,
    regenerateTokens
} from "../controllers/user.controller.js"

const router = Router()

router.route("/register").post(registerUser)
router.route("/login").post(loginUser)
router.route("/logout").post(verifyJWT, logoutUser)
router.route("/update").patch(verifyJWT, updateProfile)
router.route("/delete_profile").delete(verifyJWT, deleteUser)
router.route("/current_user").get(verifyJWT, currentUser)

router.route("/regenerate_tokens").patch(regenerateTokens)

export default router