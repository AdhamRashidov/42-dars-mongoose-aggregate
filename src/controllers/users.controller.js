import { isValidObjectId } from 'mongoose';
import User from '../models/users.model.js';

export class UserController {
    // post
    async createUser(req, res) {
        try {
            const newUser = await User.create(req.body);
            return res.status(201).json({
                statusCode: 201,
                message: 'new User added',
                data: newUser
            });
        } catch (err) {
            return res.status(500).json({
                statusCode: 500,
                message: err.message || 'Internal Server Error'
            });
        }
    }

    // get
    async getAllUsers(_, res) {
        try {
            const users = await User.aggregate([
                {
                    $lookup: {
                        from: 'videos',
                        localField: '_id',
                        foreignField: 'uploader_id',
                        as: 'videoInfo',
                    },
                },
                {
                    $lookup: {
                        from: 'comments',
                        localField: '_id',
                        foreignField: 'user_id',
                        as: 'commentInfo'
                    },
                },
                {
                    $lookup: {
                        from: 'subscriptions',
                        localField: '_id',
                        foreignField: 'follower_id',
                        as: 'subscriptionInfo'
                    },
                },
                {
                    $project: {
                        _id: 1,
                        name: 1,
                        comment: '$commentInfo',
                        subscription: '$subscriptionInfo'
                    },
                },
            ]);
            return res.status(200).json({
                statusCode: 200,
                message: 'success',
                data: users
            });
        } catch (err) {
            return res.status(500).json({
                statusCode: 500,
                message: err.message || 'Internal Server Error'
            });
        }
    }

    // get by id
    async getUserById(req, res) {
        try {
            const id = req.params?.id;
            if (!isValidObjectId(id)) {
                return res.status(400).json({
                    statusCode: 400,
                    message: 'Invalid Obj Id'
                });
            }
            const user = await User.aggregate([
                {
                    $lookup: {
                        from: 'videos',
                        localField: '_id',
                        foreignField: 'uploader_id',
                        as: 'videoInfo'
                    },
                },
                {
                    $lookup: {
                        from: 'comments',
                        localField: '_id',
                        foreignField: 'user_id',
                        as: 'commentInfo'
                    },
                },
                {
                    $lookup: {
                        from: 'subscriptions',
                        localField: '_id',
                        foreignField: 'follower_id',
                        as: 'subscriptionInfo'
                    },
                },
                { $match: { _id: id } },
                {
                    $project: {
                        _id: 1,
                        name: 1,
                        comment: '$commentInfo',
                        subscription: '$subscriptionInfo'
                    },
                },
            ]);
            if (user.length === 0) {
                return res.status(404).json({
                    statusCode: 404,
                    message: 'User not found'
                });
            }
            return res.status(200).json({
                statusCode: 200,
                message: 'success',
                data: user[0]
            });
        } catch (err) {
            return res.status(500).json({
                statusCode: 500,
                message: err.message || 'Internal Server Error'
            });
        }
    }

    // update 
    async updateUser(req, res) {
        try {
            const id = req.params?.id;
            if (!isValidObjectId(id)) {
                return res.status(400).json({
                    statusCode: 400,
                    message: 'Invalid ObjectID'
                });
            }

            const updatedUser = await User.findByIdAndUpdate(id, req.body, {
                new: true,
            });

            if (!updatedUser) {
                return res.status(404).json({
                    statusCode: 404,
                    message: "User not found"
                });
            }

            return res.status(200).json({
                statusCode: 200,
                message: 'User updated successfully',
                data: updatedUser
            });
        } catch (err) {
            return res.status(500).json({
                statusCode: 500,
                message: err.message || 'Internal Server Error'
            });
        }
    }

    // delete
    async deleteUser(req, res) {
        try {
            const id = req.params?.id;

            if (!isValidObjectId(id)) {
                return res.status(400).json({
                    statusCode: 400,
                    message: 'Invalid ObjectID'
                });
            }

            const deletedUser = await User.findByIdAndDelete(id);

            if (!deletedUser) {
                return res.status(404).json({
                    statusCode: 404,
                    message: "User not found"
                });
            }

            return res.status(200).json({
                statusCode: 200,
                message: 'User deleted successfully',
                data: {}
            });
        } catch (err) {
            return res.status(500).json({
                statusCode: 500,
                message: err.message || 'Internal Server Error'
            });
        }
    }

    async topBloggersFollowers(req, res) {
        try {
            const bloger = await User.aggregate([
                {
                    $lookup: {
                        from: 'subscriptions',
                        localField: '_id',
                        foreignField: 'follower_id',
                        as: 'followers'
                    },
                },
                {
                    $addFields: {
                        followersCount: { $size: '$followers' },
                    },
                },
                { $sort: { followersCount: -1 } },
                { $limit: 5 },
                {
                    $project: {
                        name: 1,
                        followersCount: 1,
                    },
                },
            ]);

            return res.status(200).json({
                statusCode: 200,
                message: "success",
                data: bloger
            });

        } catch (err) {
            return res.status(500).json({
                statusCode: 500,
                message: err.message || 'Internal Server Error'
            });
        }
    }
}