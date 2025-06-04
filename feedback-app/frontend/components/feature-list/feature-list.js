const featureRequestInput = document.getElementById("feature-request-input");
const featureRequestAddBtn = document.getElementById("feature-request-add");
const featureRequestList = document.getElementById("feature-request-list");

const saveToLocalStorage = (key, item) => {
    localStorage.setItem(key, JSON.stringify(item));
};

const getFromLocalStorage = (key) => {
    return JSON.parse(localStorage.getItem(key));
};

let featureList = getFromLocalStorage("feature-list") || [];

const generateUUID = () => {
    return Date.now().toString() + Math.random().toString(16).slice(2);
};

const createOption = (optionType, selectedType) => {
    const option = document.createElement('option');
    option.value = optionType;
    option.textContent = optionType.replace("_", " ").toUpperCase();
    option.selected = optionType === selectedType;
    return option;
};

const createCommentRow = (comment) => {
    const commentRow = document.createElement("div");
    commentRow.className = "comment-row";
    commentRow.setAttribute("data-id", `comment-${comment.id}`);

    const authorText = document.createElement("p");
    authorText.className = "author-text";
    authorText.textContent = comment.author || "Anonymous";

    const commentText = document.createElement("p");
    commentText.className = "comment-text";
    commentText.textContent = comment.text;

    const removeBtn = document.createElement("button");
    removeBtn.innerHTML = "🗑️";
    removeBtn.setAttribute("aria-label", "Remove comment");
    removeBtn.addEventListener("click", () => {
        // Remove from feature's comments array
        const feature = featureList.find(f => f.id === comment.featureId);
        if (feature) {
            feature.comments = feature.comments.filter(c => c.id !== comment.id);
            saveToLocalStorage("feature-list", featureList);
            render();
        }
    });

    commentRow.appendChild(authorText);
    commentRow.appendChild(commentText);
    commentRow.appendChild(removeBtn);

    return commentRow;
};

const createFeatureRow = (feature) => {
    const container = document.createElement("div");
    container.className = "feature-request-container";
    container.setAttribute("data-id", `feature-${feature.id}`);

    const mainRow = document.createElement("div");
    mainRow.className = `feature-request ${feature.status}`;

    const title = document.createElement("p");
    title.className = "feature-request-text large-text";
    title.textContent = feature.title;

    const statusSelect = document.createElement("select");
    statusSelect.className = "status-select";
    ["open", "planned", "in_progress", "completed"].forEach(status => {
        statusSelect.appendChild(createOption(status, feature.status));
    });
    statusSelect.addEventListener("change", () => {
        feature.status = statusSelect.value;
        mainRow.className = `feature-request ${feature.status}`;
        saveToLocalStorage("feature-list", featureList);
    });

    const upvoteBtn = document.createElement("button");
    upvoteBtn.innerHTML = "👍";
    upvoteBtn.addEventListener("click", () => {
        feature.upvotes++;
        upvoteCount.textContent = feature.upvotes;
        saveToLocalStorage("feature-list", featureList);
    });

    const upvoteCount = document.createElement("span");
    upvoteCount.className = "count-text";
    upvoteCount.textContent = feature.upvotes;

    const downvoteBtn = document.createElement("button");
    downvoteBtn.innerHTML = "👎";
    downvoteBtn.addEventListener("click", () => {
        feature.downvotes++;
        downvoteCount.textContent = feature.downvotes;
        saveToLocalStorage("feature-list", featureList);
    });

    const downvoteCount = document.createElement("span");
    downvoteCount.className = "count-text";
    downvoteCount.textContent = feature.downvotes;

    const commentToggleBtn = document.createElement("button");
    commentToggleBtn.innerHTML = feature.showComments ? "Hide Comments" : "Show Comments";
    commentToggleBtn.addEventListener("click", () => {
        feature.showComments = !feature.showComments;
        saveToLocalStorage("feature-list", featureList);
        render();
    });

    const addCommentBtn = document.createElement("button");
    addCommentBtn.innerHTML = "💬 Add Comment";
    addCommentBtn.addEventListener("click", () => {
        const newComment = {
            id: generateUUID(),
            featureId: feature.id,
            author: "Anonymous",
            text: "Please add comment"
        };
        feature.comments.push(newComment);
        saveToLocalStorage("feature-list", featureList);
        render();
    });

    const removeBtn = document.createElement("button");
    removeBtn.innerHTML = "🗑️";
    removeBtn.addEventListener("click", () => {
        featureList = featureList.filter(f => f.id !== feature.id);
        saveToLocalStorage("feature-list", featureList);
        render();
    });

    mainRow.appendChild(title);
    mainRow.appendChild(statusSelect);
    mainRow.appendChild(upvoteBtn);
    mainRow.appendChild(upvoteCount);
    mainRow.appendChild(downvoteBtn);
    mainRow.appendChild(downvoteCount);
    mainRow.appendChild(commentToggleBtn);
    mainRow.appendChild(addCommentBtn);
    mainRow.appendChild(removeBtn);

    container.appendChild(mainRow);

    if (feature.showComments) {
        const commentSection = document.createElement("div");
        commentSection.className = "comment-section";

        feature.comments.forEach(comment => {
            commentSection.appendChild(createCommentRow(comment));
        });

        container.appendChild(commentSection);
    }

    return container;
};

featureRequestAddBtn.addEventListener("click", () => {
    const inputValue = featureRequestInput.value.trim();
    if (!inputValue) return;

    const newFeature = {
        id: generateUUID(),
        title: inputValue,
        status: "open",
        upvotes: 0,
        downvotes: 0,
        comments: [],
        showComments: false
    };

    featureList.push(newFeature);
    featureRequestInput.value = "";
    saveToLocalStorage("feature-list", featureList);
    render();
});

const render = () => {
    featureRequestList.innerHTML = "";
    featureList.forEach(feature => {
        const featureRow = createFeatureRow(feature);
        featureRequestList.appendChild(featureRow);
    });
};

render();
