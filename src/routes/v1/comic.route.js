import express from 'express'
import { ComicController } from '../../controllers/comic.controller'
import { CommentController } from '../../controllers/comment.controller'
import { AuthMiddleware } from '../../middlewares/auth.middleware'
import { RoleMiddleware } from '../../middlewares/role.middleware'
import { ComicValidation } from '../../validations/comic.validation'

const router = express.Router()

router.route('/')
    .post(AuthMiddleware.isAuth, RoleMiddleware.isAdmin, ComicValidation.createNew, ComicController.createNew)
router.route('/:id')
    .put(ComicValidation.update, ComicController.update)
router.route('/update/:id')
    .put(AuthMiddleware.isAuth, RoleMiddleware.isAdmin, ComicValidation.update, ComicController.update)
router.route('/soft-remove/:id')
    .put(AuthMiddleware.isAuth, RoleMiddleware.isAdmin, ComicController.softRemove)
router.route('/remove/:id')
    .delete(AuthMiddleware.isAuth, RoleMiddleware.isAdmin, ComicController.remove)
router.route('/remove-all')
    .delete(AuthMiddleware.isAuth, RoleMiddleware.isAdmin, ComicController.removeAll)

router.route('/search')
    .get(ComicController.search)
router.route('/removed-comics/:page')
    .get(AuthMiddleware.isAuth, RoleMiddleware.isAdmin, ComicController.getRemovedComics)
router.route('/tag')
    .get(ComicController.getAllComicOfTag)
router.route('/unfinished-comics')
    .get(ComicController.getUnfinishedComics)
router.route('/number-follow-like/:id')
    .get(ComicController.getFollownLike)
router.route('/detail/:id')
    .get(ComicController.getDetailComic)
router.route('/quantity-page')
    .get(ComicController.getQuantityPage)
router.route('/comments')
    .get(CommentController.getComments)
router.route('/')
    .get(ComicController.getComic)

export const comicRoutes = router