const {
    addFeedback,
    upvoteFeedback,
    deleteFeedback,
    getTopFeedback
} = require('./feedbackUtils');

let feedback = [];

beforeEach(() => {
    feedback = [];
    feedback = addFeedback(feedback, {title: "Awesome!"});
    feedback = addFeedback(feedback, {title: "Good job!"});
    feedback = addFeedback(feedback, {title: "Not great."});
    feedback = addFeedback(feedback, {title: "Terrible."});
});

describe('addFeedback', () => {
    it("adds valid item", () => {
        const result = addFeedback([], {title: "Great Feature!"});
        expect(result).toHaveLength(1);
        expect(result[0].upvotes).toBe(0);
        expect(result[0]).toHaveProperty("id");
    });

    it("adds item with empty title", () => {
        expect(() => addFeedback([], {title: ""})).toThrow();
    });
});

describe('upvoteFeedback', () => {
    it("should increment feedback", () => {
        feedback = upvoteFeedback(feedback, feedback[0].id);
        expect(feedback[0].upvotes).toBe(1);
    });

    it("should not increment feedback with invalid id", () => {
        const originalUpvotes = feedback[0].upvotes;
        feedback = upvoteFeedback(feedback, ""); // Invalid ID
        expect(feedback[0].upvotes).toBe(originalUpvotes); // No change
    });
});

describe('deleteFeedback', () => {
    it("should remove item from feedback", () => {
        const originalFeedback = feedback[0];
        const originalFeedbackLength = feedback.length;
        feedback = deleteFeedback(feedback, originalFeedback.id);
        console.log(feedback, originalFeedbackLength)
        expect(feedback.length).toBe(originalFeedbackLength - 1);
        expect(feedback.find(x => x.id == originalFeedback.id)).toBe(undefined);
    });
});


describe('getTopFeedback', () => {
    it("should get top 1 item", () => {
        const originalFeedback = feedback[1];
        feedback = upvoteFeedback(feedback, originalFeedback.id);
        const topFeedback = getTopFeedback(feedback, 1);
        expect(topFeedback[0].id).toBe(originalFeedback.id);
    });
});
