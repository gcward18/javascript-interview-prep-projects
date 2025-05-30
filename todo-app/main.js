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

    const render = () => {
        todoListArea.innerHTML = '';
        
        filteredToDoList.forEach(todo => {
            row = document.createElement("div");
            row.className = `todo-list-item ${todo.complete ? 'complete' : 'incomplete'}`;
            row.id = todo.id;

            // create text
            text = document.createElement("div");
            text.className = "todo-text-area";
            text.innerHTML = todo.value;
            let preventDblClick = false;
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
                    saveToLocalStorage();
                    filter();
                    render();
                }
            })

            // create checkbox
            checkbox = document.createElement("input");
            checkbox.className = "todo-toggle";
            checkbox.type = "checkbox";
            checkbox.checked = todo.complete;

            checkbox.addEventListener("change", (event) => {
               todo.complete = event.target.checked;
               todoList = todoList.map(td => td.id == todo.id ? todo : td);
               saveToLocalStorage();
               filter();
               render(); 
            });

            // create remove button
            button = document.createElement("button");
            button.className = 'todo-remove-button';
            button.innerHTML = 'Remove'
            button.addEventListener("click", (event) => {
                todoList = todoList.filter(item => item.id != todo.id);
                filter();
                saveToLocalStorage();
                render(); 
            });
            
            // build row
            row.appendChild(text);
            row.appendChild(checkbox);
            row.appendChild(button);

            // add row to list area
            todoListArea.appendChild(row);
        })
        
    
        remainingCount = document.getElementById("todo-remaining-count");
        remainingCount.innerHTML = `${todoList.length - todoList.filter(x => !x.complete).length}`;
        totalCount = document.getElementById("todo-total-count");
        totalCount.innerHTML = `${todoList.length}`;
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
        if (type == "all") {
            if (currentFilter == "all") {
                currentFilter = null;
                todoFilterAll.className = "todo-filter-button inactive"            
            } else {
                currentFilter = "all";
                todoFilterAll.className = "todo-filter-button active"
            }
            todoFilterComplete.className = "todo-filter-button inactive"
            todoFilterIncomplete.className = "todo-filter-button inactive"
        }
        if (type == "complete") {
            if (currentFilter == "complete") {
                currentFilter = null;
                todoFilterComplete.className = "todo-filter-button inactive"            
            }else {
                currentFilter = "complete";
                todoFilterComplete.className = "todo-filter-button active"
            }
            todoFilterComplete.className = "todo-filter-button active"
            todoFilterIncomplete.className = "todo-filter-button inactive"
        }
        else if (type == "incomplete") {
            if (currentFilter == "incomplete") {
                currentFilter = null;
                todoFilterComplete.className = "todo-filter-button inactive"            
            }else {
                currentFilter = "incomplete";
                todoFilterComplete.className = "todo-filter-button active"
            }
            todoFilterAll.className = "todo-filter-button inactive"
            todoFilterComplete.className = "todo-filter-button inactive"
        }
        filter();
        render();
    };

    todoButton.addEventListener("click", (event) => {
        const todo = {
            id: generateID(),
            value: todoTextBox.value,
            complete: false
        };
        todoTextBox.value = "";
        todoList.push(todo);
        filter();
        saveToLocalStorage();
        render();
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

    todoList = getFromLocalStorage();
    filter();
    render();
};