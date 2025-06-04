const createButton = document.getElementById("create-button");
const dropArea = document.getElementById("drop-area");

const parseDateTime = (timestamp) => {
    const date = new Date(timestamp)
    const month = String(date.getMonth() + 1).padStart(2,'0');
    const day = String(date.getDay() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${month}\${day}\${year}`;
};

const defaultNote = () => {
    return {
        "id": Date.now() + Math.random().toString().slice(2),
        "text": "",
        "created": Date.now(),
        "x": 0,
        "y": 0
    };
};

const load = (key) => {
    return JSON.parse(localStorage.getItem(key));
}

const save = (key, value) => {
    localStorage.setItem(key, JSON.stringify(value));
}

let noteList = load('note-list') || [];

createButton.addEventListener('click', (event) => {
    const note = defaultNote();
    noteList.push(note);
    saveEdit();
})

const saveEdit = () => {
    save('note-list', noteList);
    render();
}

const createNote = (note) => {
    const container = document.createElement("div");
    const textArea = document.createElement("p");
    const deleteButton = document.createElement("button");

    container.className = 'sticky-note-container';
    container.id = note.id;
    container.style.left = `${note.x}px`;
    container.style.top = `${note.y}px`;


    textArea.className = 'text';
    textArea.textContent = note.text;
    textArea.style.cursor = 'pointer';

    textArea.addEventListener("focusout", (event) => {
        const input = textArea.querySelector("input");
        if (input) {
            input.remove();
        }
    });

    textArea.addEventListener("dblclick", (event)=> {
        event.preventDefault();
        const text = textArea.textContent.trim();
        if (textArea.querySelector("input")) {return;}

        const editTextInput = document.createElement("input")

        editTextInput.className = 'edit-sticky-note';
        editTextInput.value = text;
        editTextInput.addEventListener("keydown", (event)=> {
            if (event.key == "Enter") {
                editTextSave();
            }
        });
        editTextInput.addEventListener("blur", (event)=> {
            editTextSave();
        });
        
        const editTextSave = () => {
            const newValue = editTextInput.value.trim();
            if (newValue != "") {
                note.text = newValue;
            }
            editTextInput.remove();
            saveEdit();
        }

        textArea.appendChild(editTextInput);
    });

    deleteButton.className = '';
    deleteButton.innerHTML = `<svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M5 5L19 19" stroke="#ffffff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M5 19L19 5" stroke="#ffffff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>`;
    deleteButton.addEventListener("click", (event)=> {
        container.remove();
        noteList = noteList.filter(n => n.id != note.id);
        saveEdit();
    });
    // DRAGGING LOGIC
    let isDragging = false;
    let offsetX = 0;
    let offsetY = 0;

    
    container.addEventListener("mousedown", (e) => {
        isDragging = true;
        offsetX = e.clientX - container.offsetLeft;
        offsetY = e.clientY - container.offsetTop;
        container.style.zIndex = 1000;
    });

    document.addEventListener("mousemove", (e) => {
        if (!isDragging) return;
        container.style.left = `${e.clientX - offsetX}px`;
        container.style.top = `${e.clientY - offsetY}px`;
    });

    document.addEventListener("mouseup", (e) => {
        if (isDragging) {
            isDragging = false;
            note.x = parseInt(container.style.left);
            note.y = parseInt(container.style.top);
            container.style.zIndex = '';
            saveEdit(); // persist updated position
        }
    });

    container.appendChild(textArea);
    container.appendChild(deleteButton);
    return container;
}

const render = () => {
    dropArea.innerHTML = ""
    const fragment = document.createDocumentFragment();

    noteList.forEach(note => {
        fragment.appendChild(createNote(note));
    });

    // appending fragment to the document
    dropArea.appendChild(fragment);
    dropArea.addEventListener("dragover", event => {
        event.preventDefault();
    });

    dropArea.addEventListener("drop", event => {
        event.preventDefault();
        const draggedId = event.dataTransfer.getData("text/plain");
        const draggedElement = document.getElementById(draggedId);
        const note = noteList.find(note => note.id == draggedId);
        const dropX = event.clientX;
        const dropY = event.clientY;

        if (note) {
            note.x = dropX;
            note.y = dropY;
    
            draggedElement.style.position = 'absolute';
            draggedElement.style.left = dropX + 'px';
            draggedElement.style.top = dropY + 'px';

            saveEdit();
        }
    })
}

render();