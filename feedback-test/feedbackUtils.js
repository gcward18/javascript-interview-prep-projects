// feedbackUtils.js

function addFeedback(list, item) {
    if (!item || typeof item.title !== "string" || item.title.trim() === "") {
        throw new Error("Invalid feedback item");
    }
    return [...list, { ...item, id: Date.now().toString() + Math.random().toString().slice(2), upvotes: 0 }];
}

function upvoteFeedback(list, id) {
    return list.map(f => f.id === id ? { ...f, upvotes: f.upvotes + 1 } : f);
}

function deleteFeedback(list, id) {
    return list.filter(f => f.id !== id);
}

function getTopFeedback(list, count = 1) {
    return [...list].sort((a, b) => b.upvotes - a.upvotes).slice(0, count);
}

module.exports = {
    addFeedback,
    upvoteFeedback,
    deleteFeedback,
    getTopFeedback,
};
