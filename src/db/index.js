import { connect } from "mongoose";
import { config } from "dotenv";
config();

export const connectDB = async () => {
    try {
        await connect(process.env.MONGO_URL);
        console.log('Databasaga ulandi ! 👍');
    } catch (err) {
        console.log('Databasaga ulanishda muammo 🤡', err.message);
    }
}