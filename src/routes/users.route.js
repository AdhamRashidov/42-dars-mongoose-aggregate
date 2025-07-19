import { Router } from "express";
import { UserController } from "../controllers/users.controller.js";

const router = Router();
const controller = new UserController();

router
    .post('/', controller.createUser)
    .get('/', controller.getAllUsers)
    .get('/top', controller.topBloggersFollowers)
    .get('/:id', controller.getUserById)
    .patch('/:id', controller.updateUser)
    .delete('/:id', controller.deleteUser)

export default router;