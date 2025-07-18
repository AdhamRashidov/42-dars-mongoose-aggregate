import { Schema, model } from "mongoose";

const VideoSchema = new Schema(
    {
        title: { type: String, required: true },
        uploader_id: { type: Schema.Types.ObjectId, ref: 'User' },
        category: { type: String, required: true },
        views: { type: Number, min: 0 },
        likes: { type: Number, min: 0 }
    },
    {
        timestamps: true,
        versionKey: false
    }
);

const Video = model('Video', VideoSchema);
export default Video;