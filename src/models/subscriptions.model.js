import { Schema, model } from "mongoose";

const SubscriptionSchema = new Schema(
    {
        follower_id: { type: Schema.Types.ObjectId, ref: 'User' },
        followee_id: { type: Schema.Types.ObjectId, ref: 'User' }
    },
    {
        timestamps: true,
        versionKey: false
    }
);

const Subscription = model('Subscription', SubscriptionSchema);
export default Subscription;