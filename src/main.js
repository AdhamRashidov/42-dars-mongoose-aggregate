import { config } from "dotenv";
import express from 'express';
import { connectDB } from "./db/index.js";
import UserRouter from './routes/users.route.js';
import VideoRouter from './routes/videos.route.js';
import CommentRouter from "./routes/comments.route.js";
import SubscriptionRouter from "./routes/subscriptions.route.js";
config();

await connectDB();
const PORT = Number(process.env.PORT) || 3000;
const app = express();

app.use(express.json());

app.use('/user', UserRouter);
app.use('/video', VideoRouter);
app.use('/comment', CommentRouter);
app.use('/subscription', SubscriptionRouter);

app.listen(PORT, () => {
    console.log('Server', PORT, '- portda ishladi 🤝');
});