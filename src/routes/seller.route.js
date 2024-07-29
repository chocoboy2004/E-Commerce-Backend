import { Router } from "express";
import {
    register,
    login,
    logout,
    updateName,
    updatePhoneEmail,
    updatePassword,
    updateLocationAndPincode,
    deleteProfile,
    regenerateTokens
} from "../controllers/seller.controller.js"
import verifySeller from "../middlewares/seller.auth.js";

const router = Router()

router.route("/register").post(register)
router.route("/login").post(login)
router.route("/logout").post(verifySeller, logout)
router.route("/update-name").patch(verifySeller, updateName)
router.route("/update-phone-email").patch(verifySeller, updatePhoneEmail)
router.route("/update-password").patch(verifySeller, updatePassword)
router.route("/update-location-pincode").patch(verifySeller, updateLocationAndPincode)
router.route("/delete-profile").delete(verifySeller, deleteProfile)
router.route("/regenerate-tokens").put(verifySeller, regenerateTokens)

export default router