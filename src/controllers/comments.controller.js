import { isValidObjectId } from "mongoose"
import Comment from "../models/comments.model.js"


export class CommentController {
    async createComment(req, res) {
        try {
            const newComment = await Comment.create(req.body)
            return res.status(201).json({
                statusCode: 201,
                message: "success",
                data: newComment
            })
        } catch (error) {
            return res.status(500).json({
                statusCode: 500,
                message: "Success"
            });
        }
    }

    async getAllComments(_, res) {
        try {
            const comments = await Comment.aggregate([
                {
                    $lookup: {
                        from: "users",
                        localField: "user_id",
                        foreignField: "_id",
                        as: "userInfo",
                    },
                },
                {
                    $lookup: {
                        from: "videos",
                        localField: "video_id",
                        foreignField: "_id",
                        as: "videoInfo",
                    },
                },

                {
                    $project: {
                        _id: 1,
                        text: 1,
                        likes: 1,
                        video: "$videoInfo",
                        user: "$userInfo"
                    },
                },
            ]);
            return res.status(200).json({
                statusCode: 200,
                message: "Success",
                data: comments,
            });
        } catch (error) {
            return res.status(500).json({
                statusCode: 500,
                message: "interval server error",
            });
        }
    }

    async getCommentById(req, res) {
        try {
            const id = req.params?.id;
            if (!isValidObjectId(id)) {
                return res.status(400).json({
                    statusCode: 400,
                    message: "invalid object id",
                });
            }

            const comment = await Comment.aggregate([
                {
                    $lookup: {
                        from: "users",
                        localField: "user_id",
                        foreignField: "_id",
                        as: "userInfo",
                    },
                },
                {
                    $lookup: {
                        from: "videos",
                        localField: "vide_id",
                        foreignField: "_id",
                        as: "videoInfo",
                    },
                },

                {
                    $match: { _id: id }
                },

                {
                    $project: {
                        _id: 1,
                        text: 1,
                        likes: 1,
                        vide: "$videoInfo",
                        user: "$userInfo"
                    },
                },
            ]);
            if (comment.length === 0) {
                return res.status(404).json({
                    statusCode: 404,
                    message: "Comment not found",
                });
            }
            return res.status(200).json({
                statusCode: 200,
                message: "Success",
                data: comment[0],
            });
        } catch (error) {
            return res.status(500).json({
                statusCode: 500,
                message: "interval server error",
            });
        }
    }
    async updateComment(req, res) {
        try {
            const id = req.params.id;
            if (!isValidObjectId(id)) {
                return res.status(400).json({
                    statusCode: 400,
                    message: "invalid object id",
                });
            }

            const updatedComment = await Comment.findByIdAndUpdate(id, req.body, { new: true });
            if (!updatedComment) {
                return res.status(404).json({
                    statusCode: 404,
                    message: "Comment not found",
                });
            }

            return res.status(200).json({
                statusCode: 200,
                message: "Success",
                data: updatedComment,
            });
        } catch (error) {
            return res.status(500).json({
                statusCode: 500,
                message: error.message || "interval server error",
            });
        }
    }

    async deleteComment(req, res) {
        try {
            const id = req.params.id;
            if (!isValidObjectId(id)) {
                return res.status(400).json({
                    statusCode: 400,
                    message: "invalid object id",
                });
            }

            const deletedComment = await Comment.findByIdAndDelete(id);
            if (!deletedComment) {
                return res.status(404).json({
                    statusCode: 404,
                    message: "Comment not found",
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