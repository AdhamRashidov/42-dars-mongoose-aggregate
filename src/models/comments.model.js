import { Schema, model } from 'mongoose';

const CommentSchema = new Schema(
    {
        video_id: { type: Schema.Types.ObjectId, ref: 'Video' },
        user_id: { type: Schema.Types.ObjectId, ref: 'User' },
        text: { type: String },
        likes: { type: String }
    },
    {
        timestamps: true,
        versionKey: false
    }
);

const Comment = model('Comment', CommentSchema);
export default Comment;