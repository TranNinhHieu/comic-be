import express from 'express'
import { ChapterController } from '../../controllers/chapter.controller'
import { AuthMiddleware } from '../../middlewares/auth.middleware'
import { RoleMiddleware } from '../../middlewares/role.middleware'
import { ChapterValidation } from '../../validations/chapter.validation'

const router = express.Router()

router.route('/')
    .post(AuthMiddleware.isAuth, RoleMiddleware.isAdmin, ChapterValidation.createNew, ChapterController.createNew)

router.route('/:id')
    .put(AuthMiddleware.isAuth, RoleMiddleware.isAdmin, ChapterValidation.update, ChapterController.update)

router.route('/comic/')
    .get(ChapterController.getAllChapterOfComic)
router.route('/new-comics')
    .get(ChapterController.getNewComics)
router.route('/quantity/:comicID')
    .get(ChapterController.getQuantityChapter)
router.route('/')
    .get(ChapterController.getFullChapter)
export const chapterRoutes = router