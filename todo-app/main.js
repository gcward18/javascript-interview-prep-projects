window.onload = () => {
    const todoButton = document.getElementById("todo-add-button");
    const todoTextBox = document.getElementById("todo-add-input");

    const todoListArea = document.getElementById('todo-list');
    
    const todoFilterAll = document.getElementById("todo-filter-all");
    const todoFilterComplete = document.getElementById("todo-filter-complete");
    const todoFilterIncomplete = document.getElementById("todo-filter-incomplete");

    let todoList = [] 
    let filteredToDoList = [];
    let currentFilter = null;

    const saveToLocalStorage = () => {
        localStorage.setItem('todo-list', JSON.stringify(todoList));
    };

    const getFromLocalStorage = () => {
        return JSON.parse(localStorage.getItem('todo-list'));
    };

    const generateID = () => {
        return Date.now().toString() + Math.random().toString(16).slice(2);
    };

    const buildRow = (todo) =>  {
        let row = document.createElement("div");
        row.className = `todo-list-item ${todo.complete ? 'complete' : 'incomplete'}`;
        row.id = todo.id;
        row.setAttribute("data-id", `todo-${todo.id}`);
        row.setAttribute("role", "listitem");

        // create text
        let text = document.createElement("div");
        text.className = "todo-text-area";
        text.innerHTML = todo.value;
        text.ariaLabel = todo.value;

        text.addEventListener("dblclick", (event) => {
            if (text.querySelector("input")) return;

            const input = document.createElement("input");
            input.type = "text";
            input.value = todo.value
            input.className = "edit-input";

            // clear current text and insert input
            text.innerHTML = '';
            text.appendChild(input);
            input.focus();
            input.setAttribute("aria-label", "Edit Task");

            // save on enter
            input.addEventListener("keydown", (event) => {
                if (event.key == "Enter") {
                    saveEdit();
                }
            });

            // save on focus out
            input.addEventListener("blur", () => {
                saveEdit();
            });

            const saveEdit = () => {
                const newValue = input.value.trim();
                if (newValue !== "") {
                    todo.value = newValue;
                }
                updateSingleRow(todo);
                saveToLocalStorage();
            }
        })

        // create checkbox
        let checkbox = document.createElement("input");
        checkbox.className = "todo-toggle";
        checkbox.type = "checkbox";
        checkbox.setAttribute("aria-label", `Mark Task: ${todo.value} as complete`)
        checkbox.checked = todo.complete;

        checkbox.addEventListener("change", (event) => {
           todo.complete = event.target.checked;
           updateSingleRow(todo);
           saveToLocalStorage();
           updateCounts();
        });

        // create remove button
        let button = document.createElement("button");
        button.className = 'todo-remove-button';
        button.innerHTML = 'Remove';
        button.setAttribute("aria-label", `Remove Task: ${todo.value}`);
        button.addEventListener("click", (event) => {
            todoList = todoList.filter(item => item.id != todo.id);
            removeSingleRow(todo.id);
            saveToLocalStorage();
            updateCounts();
        });
        
        // build row
        row.appendChild(text);
        row.appendChild(checkbox);
        row.appendChild(button);

        // add row to list area
        return row;
    };

    const updateSingleRow = todo => {
        const row = document.querySelector(`[data-id="todo-${todo.id}"]`);
        if (row) {
            row.className = `todo-list-item ${todo.complete ? "complete":"incomplete"}`;
        }
    };

    const removeSingleRow = id => {
        const row = document.querySelector(`[data-id="todo-${id}"]`);
        if (row) {
            row.remove();
        }
    };

    const updateCounts = () => {
        remainingCount = document.getElementById("todo-remaining-count");
        remainingCount.innerHTML = `${todoList.filter(x => x.complete).length}`;
        totalCount = document.getElementById("todo-total-count");        
        totalCount.innerHTML = `${todoList.length}`;
    };

    const render = () => {
        todoListArea.innerHTML = '';
        const fragment = document.createDocumentFragment();
        filteredToDoList.forEach(todo => {
            const row = buildRow(todo);
            fragment.appendChild(row);
        });
        todoListArea.appendChild(fragment);
        
        updateCounts();
    };

    const filter = () => {
        filteredToDoList = todoList.filter(todo => {
            if (currentFilter == "all" || currentFilter == null) {
                return true;
            } else if (currentFilter == "complete") {
                return todo.complete;
            } else if (currentFilter == "incomplete") {
                return !todo.complete;
            }
        });
    }

    const toggleFilter = (type) => {
        const buttons = {
            all: todoFilterAll,
            complete: todoFilterComplete,
            incomplete: todoFilterIncomplete
        };

        Object.keys(buttons).forEach(key => {
            if (key == type) {
                buttons[key].classList.replace('inactive', 'active');
                buttons[key].setAttribute('aria-pressed', 'true');
            }
            else {
                buttons[key].classList.replace('active', 'inactive');
                buttons[key].setAttribute('aria-pressed', 'false');
            }
        });
        currentFilter = type;
       filter();
        render();
    };

    todoTextBox.addEventListener("keydown", (event) => {
        if (event.key == "Enter") {
            todoButton.click();
        }
    });

    todoButton.addEventListener("click", (event) => {
        const inputValue = todoTextBox.value.trim()
        if (inputValue == "") return;
        const todo = {
            id: generateID(),
            value: inputValue,
            complete: false
        };
        todoTextBox.value = "";
        todoList.push(todo);
        filter();
        saveToLocalStorage();
        render();
        todoTextBox.focus();
    });

    todoFilterAll.addEventListener("click", () => {
        toggleFilter("all");
    });

    todoFilterComplete.addEventListener("click", () => {
        toggleFilter("complete");
    });

    todoFilterIncomplete.addEventListener("click", () => {
        toggleFilter("incomplete");
    });

    todoList = getFromLocalStorage() || [];
    filter();
    render();

    
    const themeToggle = document.getElementById("theme-toggle");

    themeToggle.addEventListener("click", () => {
        document.body.classList.toggle("light-mode");
        themeToggle.textContent = document.body.classList.contains("light-mode") ? "🌑 Dark Mode" : "🌙 Light Mode";
    });
};
