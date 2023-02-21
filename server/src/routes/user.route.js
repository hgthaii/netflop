import express from "express"
import { body } from "express-validator"
import favoriteController from "../controllers/favorite.comtroller.js"
import userController from "../controllers/user.controller.js"
import requestHandler from "../handlers/request.handler.js"
import userModel from "../models/user.model.js"
import tokenMiddleware from "../middlewares/token.middleware.js"

const router = express.Router()

router.post(
    "/signup",
    body("username")
        .exists()
        .withMessage("Trường này là bắt buộc")
        .isLength({ min:8 })
        .withMessage("Tên đăng nhập phải có ít nhất 8 ký tự")
        .custom(async (value) => {
            const user = await userModel.findOne({ username: value });
            if (user) return Promise.reject("Tên đăng nhập đã được sử dụng");
        }),
    body("password")
        .exists()
        .withMessage("Trường này là bắt buộc")
        .isLength({ min:8 })
        .withMessage("Mật khẩu phải có ít nhất 8 ký tự"),
    body("confirmPassword")
        .exists()
        .withMessage("Trường này là bắt buộc")
        .isLength({ min:8 })
        .withMessage("Mật khẩu phải có ít nhất 8 ký tự")
        .custom((value, { req }) => {
            if (value !== req.body.password)
                throw (
                    (new Error("Tên hiển thị phải có ít nhất 8 ký tự"), requestHandler.validate, userController.signup)
                );
        }),
);

router.post(
    "/signin",
    body("username")
        .exists()
        .withMessage("Trường này là bắt buộc")
        .isLength({ min:8 })
        .withMessage("Tên đăng nhập phải có ít nhất 8 ký tự"),
    body("password")
        .exists()
        .withMessage("Trường này là bắt buộc")
        .isLength({ min:8 })
        .withMessage("Mật khẩu phải có ít nhất 8 ký tự"),
    requestHandler.validate,
    userController.signin,
);

router.put(
    "/update-password",
    tokenMiddleware.auth,
    body("username")
        .exists()
        .withMessage("Trường này là bắt buộc")
        .isLength({ min:8 })
        .withMessage("Tên đăng nhập phải có ít nhất 8 ký tự"),
    body("newPassword")
        .exists()
        .withMessage("Trường này là bắt buộc")
        .isLength({ min:8 })
        .withMessage("Mật khẩu mới phải có ít nhất 8 ký tự"),
    body("confirmNewPassword")
        .exists()
        .withMessage("Trường này là bắt buộc")
        .isLength({ min:8 })
        .withMessage("Xác nhận mật khẩu mới phải có ít nhất 8 ký tự").custom((value, { req }) => {
            if (value !== req.body.newPassword)
                throw (
                    (new Error("Xác nhận mật khẩu mới không trùng khớp!"))
                );
                return true
        }),
    requestHandler.validate,
    userController.updatePassword
);

router.get(
    "/info",
    tokenMiddleware.auth,
    userController.getInfo
)

router.get(
    "/favorites",
    tokenMiddleware.auth,
    favoriteController.getFavoriteOfUser
)

router.post(
    "/favorites",
    tokenMiddleware.auth,
    body("mediatype")
        .exists()
        .withMessage("mediatype is require")
        .custom((type) => ["movie", "tv"].includes(type))
        .withMessage("mediaType invalid"),
    body("mediaId")
        .exists()
        .withMessage("mediaId is required")
        .isLength({ min: 1 })
        .withMessage("MediaID can not be empty"),
    body("mediaTitle").exists().withMessage("mediaTitle is required"),
    body("mediaPoster").exists().withMessage("mediaPoster is required"),
    body("mediaRate").exists().withMessage("mediaRate is required"),
    requestHandler.validate,
    favoriteController.addFavorite
);

router.delete(
    "/favorites/:favoriteId",
    tokenMiddleware.auth,
    favoriteController.removeFavorite
)

export default router