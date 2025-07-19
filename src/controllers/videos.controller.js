import Video from '../models/videos.model.js';
import { isValidObjectId } from 'mongoose';

export class VideoController {
    // post 
    async createVideo(req, res) {
        try {
            const newVideo = await Video.create(req.body);
            return res.status(201).json({
                statusCode: 201,
                message: 'New video added',
                data: newVideo
            });
        } catch (err) {
            return res.status(500).json({
                statusCode: 500,
                message: err.message || 'Internal Server Error'
            });
        }
    }
    // get 
    async getAllVideos(_, res) {
        try {
            const videos = await Video.aggregate([
                {
                    $lookup: {
                        from: 'users',
                        localField: 'uploader_id',
                        foreignField: '_id',
                        as: 'userInfo'
                    },
                },
                {
                    $lookup: {
                        from: "comments",
                        localField: '_id',
                        foreignField: 'video_id',
                        as: 'commentInfo',
                    },
                },
                {
                    $project: {
                        _id: 1,
                        title: 1,
                        category: 1,
                        views: 1,
                        likes: 1,
                        comment: '$commentInfo',
                    },
                },
            ]);
            return res.status(200).json({
                statusCode: 200,
                message: "Success",
                data: videos,
            });
        } catch (err) {
            return res.status(500).json({
                statusCode: 500,
                message: err.message || 'Internal Server Error'
            });
        }
    }

    // get by id
    async getVideoById(req, res) {
        try {
            const id = req.params?.id;
            if (!isValidObjectId(id)) {
                return req.status(400).json({
                    statusCode: 400,
                    message: 'Invalid ObjectId'
                });
            }

            const video = await Video.aggregate([
                {
                    $lookup: {
                        from: "users",
                        localField: "uploader_id",
                        foreignField: "_id",
                        as: "userInfo",
                    },
                },
                {
                    $lookup: {
                        from: "comments",
                        localField: "_id",
                        foreignField: "video_id",
                        as: "commentInfo",
                    },
                },
                {
                    $match: { _id: id }
                },
                {
                    $project: {
                        _id: 1,
                        title: 1,
                        category: 1,
                        views: 1,
                        likes: 1,
                        comment: "$commentInfo",
                    },
                },
            ]);
            if (video.length === 0) {
                return res.status(404).json({
                    statusCode: 404,
                    message: "Video not found",
                });
            }
            return res.status(200).json({
                statusCode: 200,
                message: "Success",
                data: video[0],
            });
        } catch (err) {
            return res.status(500).json({
                statusCode: 500,
                message: err.message || 'Internal Server Error'
            });
        }
    }

    // update
    async updateVideo(req, res) {
        try {
            const id = req.params?.id;
            if (!isValidObjectId(id)) {
                return res.status(400).json({
                    statusCode: 400,
                    message: 'Invalid ObjectId'
                });
            }
            const updatedVideo = await Video.findByIdAndDelete(id, req.body, { new: true });
            if (!updatedVideo) {
                return res.status(404).json({
                    statusCode: 404,
                    message: 'Video not found',
                    data: updatedVideo
                });
            }
            return res.status(200).json({
                statusCode: 200,
                message: 'Video Updated',
                data: updatedVideo
            });
        } catch (err) {
            return res.status(500).json({
                statusCode: 500,
                message: err.message || 'Internal Server Error'
            });
        }
    }

    // delete
    async deleteVideo(req, res) {
        try {
            const id = req.params.id;
            if (!isValidObjectId(id)) {
                return res.status(400).json({
                    statusCode: 400,
                    message: "Invalid ObjectId",
                });
            }

            const deletedVideo = await Video.findByIdAndDelete(id);
            if (!deletedVideo) {
                return res.status(404).json({
                    statusCode: 404,
                    message: "Video not found",
                });
            }

            return res.status(200).json({
                statusCode: 200,
                message: "Success",
                data: {},
            });
        } catch (err) {
            return res.status(500).json({
                statusCode: 500,
                message: err.message || 'Internal Server Error'
            });
        }
    }

    // Comment
    async avgComment(_, res) {
        try {
            const result = await Video.aggregate([
                {
                    $lookup: {
                        from: "comments",
                        localField: "_id",
                        foreignField: "video_id",
                        as: "commentInfo"
                    }
                },
                {
                    $project: {
                        commentCount: { $size: "$commentInfo" },
                        likes: { $ifNull: ["$likes", 0] }
                    }
                },

                {
                    $group: {
                        _id: "$_id",
                        avgCommentCount: { $avg: "$commentCount" },
                        avgLikes: { $avg: "$likes" }
                    }
                }
            ]);
            return res.status(200).json({
                statusCode: 200,
                message: "success",
                data: result
            })

        } catch (error) {
            return res.status(500).json({
                statusCode: 500,
                message: "interval serever error",
            });
        }
    }

    async popularCategory(req, res) {
        try {
            const category = await Video.aggregate([
                {
                    $group: {
                        _id: "$category",
                        videoCount: { $sum: 1 },
                        totalViews: { $sum: "$views" },
                    },
                },

                {
                    $project: {
                        _id: 0,
                        category: "$_id",
                        videoCount: 1,
                        totalViews: 1,
                    },
                },

                { $sort: { totalViews: -1 } },
                { $limit: 5 },
            ]);
            return res.status(200).json({
                statusCode: 200,
                message: "success",
                data: category
            })
        } catch (error) {
            return res.status(500).json({
                statusCode: 500,
                message: error.message || "Internal server error",
            });
        }
    }

}
