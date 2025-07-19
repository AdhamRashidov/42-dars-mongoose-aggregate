import { Router } from "express";
import { SubscriptionController } from "../controllers/subscriptions.controller.js";

const router = Router();
const controller = new SubscriptionController();

router
    .post('/', controller.createSubscription)
    .patch('/:id', controller.updateSubscription)
    .delete('/:id', controller.deleteSubscription)

export default router;