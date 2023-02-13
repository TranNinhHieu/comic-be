import express from 'express'
import { NotificationController } from '../../controllers/notification.controller'
import { AuthMiddleware } from '../../middlewares/auth.middleware'

const router = express.Router()

router.route('/:id')
    .delete(AuthMiddleware.isAuth, NotificationController.remove)
router.route('/')
    .get(AuthMiddleware.isAuth, NotificationController.getNotifications)
    .put(AuthMiddleware.isAuth, NotificationController.updateStatus)

export const notificationRoutes = router