const mongoose = require("mongoose");

const feedbackPostSchema = new mongoose.Schema({
    id: String,
    title: String,
    description: String,
    status: {
        type: String,
        enum: "open" | "planned" | "in_progress" | "completed",
        default: "open"
    },
    upvotes: Number,
    downvotes: Number,
    createdAt: Date,
    updatedAd: Date
});

const commentSchema = new mongoose.Schema({
    id: String,
    feedbackId: String,
    author: String,
    message: String,
    createdAt: Date
});

const FeedbackPost = mongoose.model("FeedbackPost", feedbackPostSchema);
const Comment = mongoose.model("Comment", commentSchema);

module.exports = {
    FeedbackPost,
    Comment
}