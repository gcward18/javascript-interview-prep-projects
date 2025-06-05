const addFeatureButton = document.getElementById("add-feature-button");
const addFeatureInput = document.getElementById("add-feature-input");
const featureListArea = document.getElementById("feature-list");


const load = (key) => {
    return JSON.parse(localStorage.getItem(key));
};

const save = (key, value) => {
    localStorage.setItem(key, JSON.stringify(value))
};

let featureList = load('feature-list');

if (!featureList) {
    featureList = [];
}

const defaultFeature = (txt) => {
    return {
        "id": Date.now() + Math.random().toString().slice(2),
        "text": txt,
        "author": "",
        "status": "open",
        "upvoteCnt": 0,
        "created": Date.now()
    };
};

const parseTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDay() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${month}/${day}/${year}`;
};

const addEventInput = (event) => {
    if (event.key == "Enter") {
        addFeatureButton.click();        
    }
};

const saveEdit = () => {
    save('feature-list', featureList);
    render();
}
const addEvent = (event) => {
    const inputText = addFeatureInput.value.trim();
    if (inputText == "") return;
     addFeatureInput.value = "";
     addFeatureInput.focus();
    const feature = defaultFeature(inputText);
    featureList.push(feature);
    saveEdit();
}

addFeatureInput.addEventListener("change", event => {
    if (event.key == "Enter") {
        addEventInput(event);
    }
});
addFeatureButton.addEventListener("click", event => {
    addEvent(event);
});
const createRow = (feature) => {
    const row = document.createElement("div");
    const text = document.createElement("p");
    const statusSelect = document.createElement("select");
    const removeBtn = document.createElement("button");
    const upvoteBtn = document.createElement("button");
    const upvoteCnt = document.createElement("p");
    row.id = feature.id
    row.className = `row ${feature.status}`
    
    text.textContent = feature.text;
    text.className = 'primary-text';
    const changeStatus = (event) => {
        feature.status = event.target.value;
        saveEdit();
    };
    statusSelect.addEventListener("change", event => {
        if (event.target.value != feature.status) {
            changeStatus(event);
        }
    });

    ["open", "planned", "complete"].forEach(status => {
        const option = document.createElement("option");
        option.value = status;
        option.textContent = status[0].toUpperCase() + status.slice(1, status.length);
        statusSelect.appendChild(option);
    })
    statusSelect.value = feature.status;
    statusSelect.selected = feature.status;

    upvoteBtn.className = "status-select";
    const upvoteEvent = (event) => {
        feature.upvoteCnt += 1;
        saveEdit();
    };
    upvoteBtn.addEventListener("click", event => {
        upvoteEvent(event);
    });    
    upvoteBtn.className = "upvote-btn";
    upvoteBtn.className = "remove-btn";
    upvoteBtn.textContent = "↑";

    upvoteCnt.className = "upvote-cnt";
    upvoteCnt.textContent = feature.upvoteCnt;

    const removeFeature = (event) => {
        featureList = featureList.filter(x => x.id != feature.id);
        row.remove();
        saveEdit();
    };
    removeBtn.addEventListener("click", event => {
        removeFeature(event);
    });
    removeBtn.textContent = "Remove";

    row.appendChild(text);
    row.appendChild(statusSelect);
    row.appendChild(upvoteBtn);
    row.appendChild(upvoteCnt);
    row.appendChild(removeBtn);

    return row;
};

const render = () => {
    featureListArea.innerHTML = "";
    const fragment = document.createDocumentFragment();
    featureList.forEach(feature => {
        fragment.appendChild(createRow(feature));
    });

    featureListArea.appendChild(fragment);
};

render();