import Subscription from "../models/subscriptions.model.js";
import { isValidObjectId } from "mongoose";

export class SubscriptionController {
    async createSubscription(req, res) {
        try {
            const newSubscription = await Subscription.create(req.body);
            return res.status(201).json({
                statusCode: 201,
                message: "success",
                data: newSubscription,
            });
        } catch (error) {
            return res.status(500).json({
                statusCode: 500,
                message: "Success",
            });
        }
    }

    async updateSubscription(req, res) {
        try {
            const id = req.params.id;
            if (!isValidObjectId(id)) {
                return res.status(400).json({
                    statusCode: 400,
                    message: "invalid object id",
                });
            }

            const updatedSubscription = await Subscription.findByIdAndUpdate(id, req.body,
                { new: true }
            );
            if (!updatedSubscription) {
                return res.status(404).json({
                    statusCode: 404,
                    message: "Subscription not found",
                });
            }

            return res.status(200).json({
                statusCode: 200,
                message: "Success",
                data: updatedSubscription
            });
        } catch (error) {
            return res.status(500).json({
                statusCode: 500,
                message: error.message || "interval server error",
            });
        }
    }

    async deleteSubscription(req, res) {
        try {
            const id = req.params.id;
            if (!isValidObjectId(id)) {
                return res.status(400).json({
                    statusCode: 400,
                    message: "invalid object id",
                });
            }

            const deletedSubscription = await Subscription.findByIdAndDelete(id);
            if (!deletedSubscription) {
                return res.status(404).json({
                    statusCode: 404,
                    message: "Subscription not found",
                });
            }

            return res.status(200).json({
                statusCode: 200,
                message: "Success",
                data: {},
            });
        } catch (error) {
            return res.status(500).json({
                statusCode: 500,
                message: "interval serever error",
            });
        }
    }
}