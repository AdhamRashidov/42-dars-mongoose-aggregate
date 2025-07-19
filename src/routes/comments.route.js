import { Router } from "express";
import { CommentController } from "../controllers/comments.controller.js";

const router = Router();
const controller = new CommentController();

router
    .post('/', controller.createComment)
    .get('/', controller.getAllComments)
    .get('/:id', controller.getCommentById)
    .patch('/:id', controller.updateComment)
    .delete('/:id', controller.deleteComment)

export default router;