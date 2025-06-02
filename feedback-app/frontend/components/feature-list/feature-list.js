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

const getInputValue = () => {
    const value = featureRequestInput.value.trim()
    return value;
};

const createOption = (optionType, selectedType) => {
    const option = document.createElement('option');
    option.value = optionType;
    option.textContent = optionType.replace("_", " ").toUpperCase();
    option.selected = optionType == selectedType;
    return option;
}

const updateSingleRow = (id, new_row) => {
    const row = document.querySelector(`[data-id="${id}"`);
    if (row) {
        row = new_row
    }
}
const removeSingleRow = id => {
    const row = document.querySelector(`[data-id="${id}"`);
    if (row) {
        row.remove();
    }
};

const editCurrentText = (element, id) => {
    const input = document.createElement("input");
    input.type = "text";
    input.value = element.value;

    // clear current text and insert input;
    element.innerHTML = ""
    element.appendChild(input);
    input.focus();
    
    const saveItem = () => {
        const inputText = input.value.trim();
        updateSingleRow(id)
        saveToLocalStorage()
    };

    // add event lister for saving 
    input.addEventListener("keydown", (event) => {
        if (event.key == "Enter") {
            saveEdit(element, dataItem)
        }
    });
}
const generateUUID = () => {
    return Date.now().toString() + Math.random().toString().slice(2)
}
const createCommentRow = (commentItem) => {
    const commentRow = document.createElement("div");
    commentRow.className = "comment-row";
    commentRow.setAttribute("data-id", `comment-row-${commentItem.id}`);

    const commentText = document.createElement("p");
    commentText.className = "comment-text plain-text";
    commentText.textContent = commentItem.text;

    const authorText = document.createElement("p");
    authorText.className = "author-text";
    authorText.textContent = commentItem.author;

    // todo: limit who can delete requests
    const removeBtn = document.createElement("button");
    removeBtn.textContent = "Remove";
    removeBtn.className = "remove-btn";
    removeBtn.addEventListener("click", (event) => {
        // todo implement for removeBtn 'click' event
        featureList = featureList.filter(item => item.id != commentItem.id);
        removeSingleRow(commentItem.id);
        saveToLocalStorage('feature-list', featureList);
    })

    // Upvote other people’s requests
    const upvoteBtn = document.createElement("button")
    upvoteBtn.className = "upvote-btn icon-btn";
    upvoteBtn.textContent = `↑`;
    upvoteBtn.addEventListener("click", (event) => {
        // todo implement for upvoteBtn 'click' event
        commentItem.upvotes++;
        upVoteCountText.textContent = commentItem.upvotes;
        saveToLocalStorage('feature-list', featureList);
    })

    // show vote counts
    const upVoteCountText = document.createElement("p");
    upVoteCountText.className = "upvote-count count-text";
    upVoteCountText.textContent = commentItem.upvotes;


    // adding ability to down vote
    const downvoteBtn = document.createElement("button")
    downvoteBtn.className = "downvote-btn icon-btn";
    downvoteBtn.textContent = `↓`;
    downvoteBtn.addEventListener("click", (event) => {
        // todo implement for downvoteBtn 'click' event
        commentItem.downvotes++;
        downVoteCountText.textContent = commentItem.downvotes;
        saveToLocalStorage('feature-list', featureList)
    })

    // show vote counts
    const downVoteCountText = document.createElement("p");
    downVoteCountText.className = "upvote-count count-text";
    downVoteCountText.textContent = commentItem.downvotes;

    // append items to comment row
    commentRow.appendChild(commentText);
    commentRow.appendChild(authorText);
    commentRow.appendChild(upvoteBtn);
    commentRow.appendChild(upVoteCountText);
    commentRow.appendChild(downvoteBtn);
    commentRow.appendChild(downVoteCountText );
    commentRow.appendChild(removeBtn);

    return commentRow;
}
const createRow = (featureItem) => {

    // Submit feature requests or feedback
    const container = document.createElement("feature-item-container");

    const row = document.createElement("div");
    row.className = `feature-request ${featureItem.status.toLowerCase()}`;
    row.setAttribute("data-id", `feature-request-${featureItem.id}`);

    // show feature request
    const textarea = document.createElement("p");
    textarea.textContent = featureItem.title;
    textarea.className = "feature-request-text";

    // See status (e.g., “Planned,” “In Progress,” “Completed”)
    // show status of request
    const statusSelection = document.createElement("select");
    statusSelection.value = featureItem.status;
    statusSelection.selected = featureItem.status;
    statusSelection.className = "feature-request-text";
    const optionList = ["open", "planned", "in_progress", "completed"];
    statusSelection.addEventListener("change", () => {
        featureItem.status = statusSelection.value;
        row.className = `feature-request ${featureItem.status.toLowerCase()}`;
        saveToLocalStorage("feature-list", featureList);
    });

    // creating drop down of options
    for(i = 0; i < optionList.length; i++){
        statusSelection.appendChild(createOption(optionList[i], featureItem.status));
    }

    // todo: limit who can delete requests
    const removeBtn = document.createElement("button");
    removeBtn.textContent = "Remove";
    removeBtn.className = "remove-btn";
    removeBtn.addEventListener("click", (event) => {
        // todo implement for removeBtn 'click' event
        featureList = featureList.filter(item => item.id != featureItem.id);
        removeSingleRow('feature-request-' + featureItem.id);
        saveToLocalStorage('feature-list', featureList);
    })

    // Upvote other people’s requests
    const upvoteBtn = document.createElement("button")
    upvoteBtn.className = "upvote-btn icon-btn";
    upvoteBtn.textContent = `↑`;
    upvoteBtn.addEventListener("click", (event) => {
        // todo implement for upvoteBtn 'click' event
        featureItem.upvotes++;
        upVoteCountText.textContent = featureItem.upvotes;
        saveToLocalStorage('feature-list', featureList);
    })

    // show vote counts
    const upVoteCountText = document.createElement("p");
    upVoteCountText.className = "upvote-count count-text";
    upVoteCountText.textContent = featureItem.upvotes;


    // adding ability to down vote
    const downvoteBtn = document.createElement("button")
    downvoteBtn.className = "downvote-btn icon-btn";
    downvoteBtn.textContent = `↓`;
    downvoteBtn.addEventListener("click", (event) => {
        // todo implement for downvoteBtn 'click' event
        featureItem.downvotes++;
        downVoteCountText.textContent = featureItem.downvotes;
        saveToLocalStorage('feature-list', featureList)
    })

    // show vote counts
    const downVoteCountText = document.createElement("p");
    downVoteCountText.className = "upvote-count count-text";
    downVoteCountText.textContent = featureItem.downvotes;

    
    // add comment
    const commentBtn = document.createElement("button");
    commentBtn.className = "comment-btn icon-btn";
    commentBtn.textContent = "💬";
    commentBtn.addEventListener("click", (event) => {
        // todo implement for commentBtn 'click' event
        const comment = {
            id: generateUUID(),
            author: "NA",
            createdAt: Date(),
            text: "Please add comment",
            upvotes: 0,
            downvotes: 0
        };
        commentRow = createCommentRow(comment);
        featureItem.commentsToggled = !featureItem.commentsToggled;

        // adding comments to the feature
        if (featureItem.comments) {
            featureItem.comments.push(comment);
        } else {
            featureItem.comments = [comment];
        }
        
        saveToLocalStorage('feature-list', featureList);
    });

    const showRows = (comments) => {
        featureItem.comments.forEach(comment => {
            const commentRow = createCommentRow(comment);
            commentFragment.appendChild(commentRow);
        });

        // add area for comments if they appear
        container.appendChild(commentFragment);
    };
    const hideRows = (comments) => {
        children = Array.from(container.children);
        
        for(var i = 0 ;i < children.length; i++){
            if (children[i].className == "comment-row"){
                children[i].remove();
            }
        }        
    }
    const commentsToggleButton = document.createElement("button");
    commentsToggleButton.classList = "comments-toggle";
    commentsToggleButton.innerHTML = `${featureItem.commentsToggled ? '▼' : '▲'}`
    commentsToggleButton.addEventListener("click", e => {
        featureItem.commentsToggled = !featureItem.commentsToggled;
    commentsToggleButton.innerHTML = `${featureItem.commentsToggled ? '▼' : '▲'}`
        if (featureItem.commentsToggled) {
            showRows();
        }else {
            hideRows();
        }
    });

    // todo: logic for allowing only one vote per user needs to be implement
    row.appendChild(textarea);
    row.appendChild(statusSelection);
    row.appendChild(upvoteBtn);
    row.appendChild(upVoteCountText);
    row.appendChild(downvoteBtn);
    row.appendChild(downVoteCountText);
    row.appendChild(commentBtn);
    row.appendChild(removeBtn);
    row.appendChild(commentsToggleButton);

    // appending row to the container
    container.appendChild(row);

    // appending comments to the container
    const commentFragment = document.createDocumentFragment();
    
    if (featureItem.comments && featureItem.commentsToggled == true) {
        showRows();
    } else if (featureItem.comments && featureItem.commentsToggled == false) {
        hideRows();
    }


    // return row to be used for populating on render
    return container;

}

featureRequestAddBtn.addEventListener("click", () => {
    const inputValue = getInputValue();
    if (inputValue == "") return;

    // todo: save this to the backend
    // saving this the feature list set
    let featureListItem = {
        id: Date.now().toString() + Math.random().toString(16).slice(2),
        title: inputValue,
        description: "",
        status: "open",
        upvotes: 0,
        downvotes: 0,
        createdAt: Date(),
        updatedAt: Date(),
        comments: [],
    };

    /*
    comment = {
        author: String,
        createdAt: Date(),
        text: String
        upvotes: number,
        downvotes: number
    }
    */
    featureList.push(featureListItem)

    // reset and focus
    featureRequestInput.value = "";
    featureRequestInput.focus();
    saveToLocalStorage('feature-list', featureList)

    // row for the feature request
    const row = createRow(featureListItem);

    // Comment on feedback posts
    featureRequestList.appendChild(row);
    render();
});

const render = () => {
    featureRequestList.innerHTML = '';
    const fragment = document.createDocumentFragment();

    // create rows for each of the features
    featureList.forEach(featureItem => {
        const row = createRow(featureItem);
        fragment.appendChild(row);
    });

    // append fragment to the feature request list
    featureRequestList.appendChild(fragment);
};

render();
