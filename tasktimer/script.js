const taskListElement = document.getElementById("task-list");
const taskNameElement = document.getElementById("task-name");
const countDownElement = document.getElementById("count-down");
const startTimerElement = document.getElementById("start-timer");
const createTaskInputElement = document.getElementById("create-task-input");
const createTaskButtonElement = document.getElementById("create-task-button");
/*
    task: 
    {
        "id": string
        "name": string,
        "timeRemaining": int, # seconds
        "status": in-progress | stopped | complete
    }
*/

const getFromLocalStorage = (key) => {
    return JSON.parse(localStorage.getItem(key));
}

const saveToLocalStorage = (key, value) => {
    localStorage.setItem(key, JSON.stringify(value));
}

let taskList = getFromLocalStorage('task-list') || [];
let runningInterval = null;
const statuses = ["stopped", "in-progress", "complete"];

const parseTextValue = (text) => {
    return text.trim();
}

const getTime = (milliseconds) => {
    const minutes = milliseconds / 60000 
    const seconds = (minutes % 1) * 60

    return `${parseInt(minutes)} mins and ${parseInt(seconds)} secs left`
}

createTaskButtonElement.addEventListener("click", (event) => {
    const inputValue = parseTextValue(createTaskInputElement.value);
    if (inputValue == "") return;

    // clear task
    createTaskInputElement.value = "";
    // reset focus if we want to add more tasks
    createTaskInputElement.focus();

    // add new task and save it to local storage to remember the tasks we created
    const newTask = {
        "id": Date.now() + Math.random().toString(16).slice(2),
        "name": inputValue,
        "timeRemaining": 1000 * 5,
        "status": "stopped"
    }
    taskList.push(newTask);
    saveToLocalStorage("task-list", taskList);

    // re render the task list
    render();
});

const createRow = (task) => {
    const row = document.createElement("div");
    row.className = `task ${task.status}`
    
    const textContainer = document.createElement("div");
    textContainer.className = "text-container";

    const text = document.createElement("p");
    text.textContent = task.name;
    const status = document.createElement("p");
    status.textContent = task.status.toUpperCase();
    status.classList = "status"

    textContainer.appendChild(status);
    textContainer.appendChild(text);
    row.appendChild(textContainer);
    
    if (task.status != "complete") {
        const button = document.createElement("button");
        button.classList.add("play-button");
        button.innerHTML = `
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M8 5v14l11-7L8 5z" fill="currentColor"/>
            </svg>`;
        
        const stopButton = document.createElement("button");
        stopButton.innerHTML = `
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="6" y="6" width="12" height="12" fill="currentColor"/>
            </svg>`;
        stopButton.classList.add("stop-button");   

        button.addEventListener("click", event => {
            if (runningInterval) {
                clearInterval(runningInterval);
            }
            taskList = taskList.map(curr => {
                if(curr.id == task.id) {
                    curr.status = 'in-progress';
                } else if (curr.status == 'in-progress'){
                    curr.status = 'stopped';
                }
                return curr
            })
            task.status = "in-progress";
            status.textContent = task.status.toUpperCase();
            row.className = `task ${task.status}`
            taskNameElement.textContent = task.name;

            runningInterval = setInterval(() => {
                task.timeRemaining = task.timeRemaining - 1000; // decrement every second
                countDownElement.textContent = getTime(task.timeRemaining);
                if (task.timeRemaining <= 0) {
                    taskList = taskList.map(curr => {
                        if(curr.id == task.id) {
                            curr.status = 'complete';
                        }
                        return curr;
                    });
                    clearInterval(runningInterval);
                    render();
                }
                saveToLocalStorage('task-list', taskList)
            }, 1000);

        });   

        stopButton.addEventListener("click", event => {
            if (runningInterval) {
                clearInterval(runningInterval);
            }
            taskList = taskList.map(curr => {
                if (curr.status == 'in-progress'){
                    curr.status = 'stopped';
                }
                return curr
            })
            task.status = "stopped";
            row.className = `task ${task.status}`;
            status.textContent = task.status.toUpperCase();
            countDownElement.innerHTML = "NA";
            taskNameElement.innerHTML = "<br/>";
        
            saveToLocalStorage('task-list', taskList);
        });
        
        row.appendChild(button);
        row.appendChild(stopButton);
    }
    return row;
}

const render = () => {
    taskListElement.innerHTML = "";
    const fragment = document.createDocumentFragment();
    taskList.forEach(task => {
        const row = createRow(task);
        fragment.appendChild(row);
    });
    taskListElement.appendChild(fragment);
};

render();
