import { Schema, model } from "mongoose";

const UserSchema = new Schema({
    name: { type: String }
}, {
    timestamps: true,
    versionKey: false
});

const User = model('User', UserSchema);
export default User;