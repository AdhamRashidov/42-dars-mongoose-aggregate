import { Router } from "express";
import { VideoController } from "../controllers/videos.controller.js";

const router = Router();
const controller = new VideoController();

router
    .post('/', controller.createVideo)
    .get('/', controller.getAllVideos)
    .get('/avg', controller.avgComment)
    .get('/category', controller.popularCategory)
    .get('/:id', controller.getVideoById)
    .patch('/:id', controller.updateVideo)
    .delete('/:id', controller.deleteVideo)

export default router;