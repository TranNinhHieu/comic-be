import express from 'express'
import { TagController } from '../../controllers/tag.controller'
import { AuthMiddleware } from '../../middlewares/auth.middleware'
import { RoleMiddleware } from '../../middlewares/role.middleware'
import { TagValidation } from '../../validations/tag.validation'

const router = express.Router()

router.route('/')
    .post(AuthMiddleware.isAuth, RoleMiddleware.isAdmin, TagValidation.createNew, TagController.createNew)

router.route('/:id')
    .put(AuthMiddleware.isAuth, RoleMiddleware.isAdmin, TagValidation.update, TagController.update)
router.route('/:id')
    .get(TagController.getDetailTag)
router.route('/')
    .get(TagController.getAllTag)
export const tagRoutes = router