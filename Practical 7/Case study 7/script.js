// ==========================================
// GET HTML ELEMENTS
// ==========================================

let taskInput = document.getElementById("taskInput");

let taskList = document.getElementById("taskList");

let taskCount = document.getElementById("taskCount");

let emptyMessage = document.getElementById("emptyMessage");


// ==========================================
// ADD TASK
// ==========================================

function addTask() {

    let taskText = taskInput.value.trim();

    // Check if input is empty
    if (taskText === "") {

        alert("Please enter a task.");

        return;
    }


    // Create a new list item
    let li = document.createElement("li");

    li.className = "task";


    // Create checkbox
    let checkbox = document.createElement("input");

    checkbox.type = "checkbox";


    // Create task text
    let span = document.createElement("span");

    span.className = "task-text";

    span.textContent = taskText;


    // Create Edit button
    let editButton = document.createElement("button");

    editButton.textContent = "Edit";

    editButton.className = "edit-btn";


    // Create Delete button
    let deleteButton = document.createElement("button");

    deleteButton.textContent = "Delete";

    deleteButton.className = "delete-btn";


    // ======================================
    // DOM TRAVERSAL
    // ======================================

    // Checkbox changes task status
    checkbox.addEventListener("change", function () {

        // Parent element of checkbox is <li>
        let parentTask = checkbox.parentElement;

        // Find task text inside parent
        let textElement =
            parentTask.querySelector(".task-text");

        // Add/remove completed class
        textElement.classList.toggle("completed");

    });


    // ======================================
    // EDIT TASK
    // ======================================

    editButton.addEventListener("click", function () {

        // Traverse from button to parent <li>
        let parentTask = editButton.parentElement;

        // Find task text
        let textElement =
            parentTask.querySelector(".task-text");

        // Ask user for new task
        let newText =
            prompt("Edit your task:", textElement.textContent);

        if (newText !== null && newText.trim() !== "") {

            textElement.textContent = newText.trim();
        }

    });


    // ======================================
    // DELETE TASK
    // ======================================

    deleteButton.addEventListener("click", function () {

        // Traverse from button to parent <li>
        let parentTask = deleteButton.parentElement;

        // Remove parent task
        parentTask.remove();

        updateTaskCount();

    });


    // ======================================
    // ADD ELEMENTS TO DOM
    // ======================================

    li.appendChild(checkbox);

    li.appendChild(span);

    li.appendChild(editButton);

    li.appendChild(deleteButton);


    // Add li inside ul
    taskList.appendChild(li);


    // Clear input
    taskInput.value = "";


    // Update task count
    updateTaskCount();

}


// ==========================================
// UPDATE TASK COUNT
// ==========================================

function updateTaskCount() {

    // DOM traversal:
    // children gives all child elements of ul

    let totalTasks = taskList.children.length;


    taskCount.textContent =
        totalTasks + (totalTasks === 1 ? " Task" : " Tasks");


    // Show/hide empty message
    if (totalTasks === 0) {

        emptyMessage.style.display = "block";

    } else {

        emptyMessage.style.display = "none";
    }
}