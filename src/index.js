import _, { add, get } from 'lodash';
import { format, addDays, lastDayOfMonth } from "date-fns";
import './style.css';

// DOM elements
let dialog = document.getElementById("myDialog");

let addTaskBtn = document.getElementById("addTask");
let taskList = document.querySelector(".taskList");
let closeDialog = document.getElementById("closeDialog");
let optionWhen = document.querySelector(".selectWhen");
let centralTaskSide = document.querySelector(".centralTaskSide");
let priority = document.getElementById("priority");
let inputDescription = document.getElementById("description");
let upcomingBtn = document.getElementById("upcomingBtn");
let taskLi = {};

const taskName = document.getElementById("taskName");
let saveContent = " ";

const taskState = []; // to store the task for eventual use in the future

class ListTask {
    constructor(id, nameTask, taskWhen, priorityTask, taskNote) {
        this.id = id;
        this.nameTask = nameTask;
        this.taskWhen = taskWhen;
        this.priorityTask = priorityTask;
        this.taskNote = taskNote;
    }
}

// function to generate unique ID for tasks
function generateId() {
    return '_' + Math.random().toString(36).substr(2, 9);
}

// function for addTask Button
function addTask(nameTask, taskWhen, priorityTask, taskNote, id = generateId()) {
    const taskShow = document.createElement("div");
    taskShow.classList.add("taskShow");
    taskShow.textContent = `Task: ${nameTask}`;
    taskShow.style.border = "1px solid black";
    taskShow.setAttribute("data-id", id); // Set the task id as a data attribute

    const deleteButton = document.createElement("button");
    deleteButton.textContent = "Remove";
    deleteButton.classList.add("deleteButton");
    deleteButton.addEventListener("click", () => {
        const taskId = taskShow.getAttribute("data-id");
        taskShow.remove();
        removeTask(taskId); // Remove the task from the state and localStorage
    });

    const date = new Date();
    const tomorrow = addDays(date, 1);
    const thisWeekend = addDays(date, 7);
    const thisMonth = lastDayOfMonth(date);

    const timeDate = document.createElement("div");
    if (taskWhen === "Tomorrow") {
        timeDate.textContent = "Until " + format(tomorrow, "LLL dd");
    } else if (taskWhen === "thisWeekend") {
        timeDate.textContent = "Until " + format(thisWeekend, "LLL dd");
    } else if (taskWhen === "thisMonth") {
        timeDate.textContent = "Until " + format(thisMonth, "LLL dd");
    } else if (taskWhen === "today") {
        timeDate.textContent = "Today";
        timeDate.style.color = "green";
    }

    const priorityDiv = document.createElement("div");
    priorityDiv.textContent = "Priority: " + priorityTask;

    const taskDescription = document.createElement("div");
    taskDescription.textContent = "Notes: " + taskNote;

    const checkBox = document.createElement("input");
    checkBox.setAttribute("type", "checkbox");

    taskShow.style.display = "flex";
    taskShow.style.gap = "1rem";
    taskShow.style.overflow = "hidden";
    taskShow.style.margin = "2rem";
    taskList.style.overflow = "scroll";

    taskShow.appendChild(taskDescription);
    taskShow.appendChild(timeDate);
    taskShow.appendChild(priorityDiv);
    taskShow.appendChild(checkBox);
    taskShow.appendChild(deleteButton);
    taskList.appendChild(taskShow);
    centralTaskSide.appendChild(taskList);
    dialog.close();

    const newTask = new ListTask(id, nameTask, taskWhen, priorityTask, taskNote); // Pass id to ListTask
    taskState.push(newTask);
    saveTasks();
    saveContent = centralTaskSide.innerHTML;
}

// Save tasks to localStorage
function saveTasks() {
    localStorage.setItem("tasks", JSON.stringify(taskState));
}

// Load tasks from localStorage
function loadTasks() {
    const tasks = JSON.parse(localStorage.getItem("tasks"));
    if (tasks) {
        tasks.forEach(task => {
            addTask(task.nameTask, task.taskWhen, task.priorityTask, task.taskNote, task.id);
        });
    }
}

// Remove task from taskState and update localStorage
function removeTask(taskId) {
    const taskIndex = taskState.findIndex(task => task.id === taskId);
    if (taskIndex !== -1) {
        taskState.splice(taskIndex, 1);
        saveTasks();
    }
}

// Event Listeners
addTaskBtn.addEventListener("click", () => {
    dialog.showModal();
});

closeDialog.addEventListener("click", () => {
    addTask(taskName.value, optionWhen.value, priority.value, inputDescription.value);
    inputDescription.value = "";
    taskName.value = "";
});

// Load tasks when the page loads
document.addEventListener("DOMContentLoaded", loadTasks);

export { inputDescription, priority, dialog, addTaskBtn, taskList, closeDialog, optionWhen, centralTaskSide, taskLi };
