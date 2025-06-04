const addItemText = document.getElementById('add-item-text');
const addItemButton = document.getElementById('add-item-button');


const getFromLocalStorage = (key) => {
    return JSON.parse(localStorage.getItem(key))
}

const saveToLocalStorage = (key, value) => {
    return localStorage.setItem(key, JSON.stringify(value))
}

const createTask = (value) => {
    return {
        "id": Date.now() + Math.random().toString().slice(2),
        "value": value,
        "state": "to-do",
        "created": Date.now(),
        "completed": null // will be populated with the date completed
    };
};

let taskList = getFromLocalStorage('task-list') || [];

const getTasksByState = state => {
    return taskList.filter(task => task.state == state)
};

addItemText.addEventListener('keydown', (event) => {
    if (event.key == "Enter") {
        addItemButton.click();
    }
});

addItemButton.addEventListener('click', (event) => {
    const inputValue = addItemText.value.trim();
    if (inputValue == "") return;
    
    // clear and refocus on the input text
    addItemText.focus();
    addItemButton.value = "";

    // create new tasks
    taskList.push(createTask(inputValue));
    saveToLocalStorage('task-list', taskList);
    // re render the list areas
    render();
});

const getDate = (timestamp) => {
    const date = new Date(timestamp);
    const month = String(date.getMonth() + 1).padStart(2,'0');
    const day = String(date.getDay() + 1).padStart(2,'0');
    const year = date.getFullYear();
    return `${month}/${day}/${year}`;
};

const createRow = (task) => {
    const row = document.createElement("div");
    row.className = "task-row";
    row.setAttribute("data-id", task.id);
    row.draggable = true;
    row.id = task.id;

    row.addEventListener("dragstart", (event) => {
        event.dataTransfer.setData('text/plain', event.target.id);
    });
    // text for the task
    const textContainer = document.createElement("div");

    // adding text and date of the task
    const dateField = document.createElement("p");
    dateField.className = "small-text";
    dateField.textContent = `Created: ${getDate(task.created)}`;
    const textField = document.createElement("p");
    textField.className = "text";
    textField.textContent = task.value;

    // delete button
    const deleteButton = document.createElement("button");
    deleteButton.className = "delete-btn";
    deleteButton.addEventListener("click", event => {
        // todo: add validation here like a pop-up modal
        taskList = taskList.filter(t => t.id != task.id);
        saveToLocalStorage('task-list', taskList);
        render();
    })

    // appending items to the row
    textContainer.appendChild(dateField);
    textContainer.appendChild(textField);
    row.appendChild(textContainer);
    row.appendChild(deleteButton);

    return row;
}
const render = () => {
    const states = [
        {"state": "to-do", fragment : document.createDocumentFragment()},
        {"state": "in-progress", fragment : document.createDocumentFragment()},
        {"state": "completed", fragment : document.createDocumentFragment()}
    ];

    states.forEach(item => {
        const columnArea = document.getElementById(item.state);

        columnArea.addEventListener('dragover', (event) => {
            event.preventDefault();
        });

        columnArea.addEventListener('drop', (event) => {
            event.preventDefault();
            const draggedId = event.dataTransfer.getData('text/plain');

            const found = taskList.find(task => task.id == draggedId);
            if (found) {
                const draggedElement = document.getElementById(draggedId);
                found.state = item.state;
                taskList = taskList.map(task => task.id == found.id? found: task);
                saveToLocalStorage('task-list', taskList);
                render();
            }
        });

        const listArea = Array.from(columnArea.getElementsByClassName("list"))[0]
        listArea.innerHTML = "";
        const tasks = getTasksByState(item.state);

        // iterate through the tasks and build out the lists
        tasks.forEach(task => {
            const row = createRow(task);
            item.fragment.appendChild(row);
        });
        
        // add items to the list area
        listArea.appendChild(item.fragment);
        
    })
    
}

render();