import express from 'express'
import { CommentController } from '../../controllers/comment.controller'
import { HistoryController } from '../../controllers/history.controller'
import { UserController } from '../../controllers/user.controller'
import { AuthMiddleware } from '../../middlewares/auth.middleware'
import { RoleMiddleware } from '../../middlewares/role.middleware'
import { CommentValidation } from '../../validations/comment.validation'
import { UserValidation } from '../../validations/user.validation'

const router = express.Router()

router.route('/login').post(UserValidation.login, UserController.login)
router.route('/google-login').post(UserController.googleLogin)
router.route('/refresh-token').get(UserController.refreshToken)
router.route('/register').post(UserValidation.register, UserController.register)
router.route('/forgot-password').post(UserController.forgotPassword)
router.route('/reset-password').put(AuthMiddleware.isAuth, UserController.resetPassword)
router.route('/verify-email').post(UserController.verifyEmail)
router.route('/logout').get(UserController.logout)

router.route('/follow')
    .put(AuthMiddleware.isAuth, UserController.updateFollowComic)
    .get(AuthMiddleware.isAuth, UserController.followStatus)

router.route('/comics/quantity-page-followed')
    .get(AuthMiddleware.isAuth, UserController.getQuantityPageFollowedComics)

router.route('/remove-user')
    .put(AuthMiddleware.isAuth, RoleMiddleware.isAdmin, UserController.removeUser)

router.route('/get-all-users')
    .get(AuthMiddleware.isAuth, RoleMiddleware.isAdmin, UserController.getAllUsers)

router.route('/comics/quantity-page-liked')
    .get(AuthMiddleware.isAuth, UserController.getQuantityPageLikedComics)

router.route('/comics/followed')
    .get(AuthMiddleware.isAuth, UserController.getFollowedComics)

router.route('/comics/liked')
    .get(AuthMiddleware.isAuth, UserController.getLikedComics)

router.route('/like')
    .put(AuthMiddleware.isAuth, UserController.updateLikeComic)
    .get(AuthMiddleware.isAuth, UserController.likeStatus)

router.route('/remove-all-history')
    .delete(AuthMiddleware.isAuth, HistoryController.removeAllHistory)

router.route('/comment/:id')
    .put(AuthMiddleware.isAuth, CommentValidation.updateComment, CommentController.updateComment)

router.route('/comment')
    .delete(AuthMiddleware.isAuth, CommentController.removeComment)
    .post(AuthMiddleware.isAuth, CommentValidation.postComment, CommentController.postComment)

router.route('/remove-history')
    .delete(AuthMiddleware.isAuth, HistoryController.removeHistory)

router.route('/history')
    .post(AuthMiddleware.isAuth, HistoryController.addHistory)
    .get(AuthMiddleware.isAuth, HistoryController.getHistory)

router.route('/')
    .get(AuthMiddleware.isAuth, UserController.getFullUser)
    .put(AuthMiddleware.isAuth, UserController.update)

export const userRoutes = router