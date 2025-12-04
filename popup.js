// popup.js – CLEAN VERSION (preview completely disabled, everything else works)

let tasks = [];

// Super important: wait for DOM
document.addEventListener("DOMContentLoaded", () => {
    const saveBtn = document.getElementById("save-btn");
    const viewBtn = document.getElementById("view-logs");


    if (!saveBtn || !viewBtn) {
        console.error("One or more elements not found! Check IDs in HTML.");
        return;
    }


    chrome.storage.local.get("tasks", (result) => {
        tasks = result.tasks || [];
  
    });

    // === Save button ===
    saveBtn.addEventListener("click", () => {
        const start = document.getElementById("StartTime").value;
        const end = document.getElementById("EndTime").value;
        const date = document.getElementById("Date").value;
        const description = document.getElementById("TasksCompleted").value;

        if (start == ""){
            alert("Please enter a start time.")
            return;
        }

        if (!start || !end || !date || !description) {
            alert("Please fill in all fields!");
            return;
        }

        const task = { start, end, date, description, timestamp: Date.now() };
        tasks.push(task);

        chrome.storage.local.set({ tasks: tasks }, () => {
            console.log("Task saved!", task);
         
            document.getElementById("StartTime").value = "";
            document.getElementById("EndTime").value = "";
            document.getElementById("Date").value = "";
            document.getElementById("TasksCompleted").value = "";
        });
    });


    viewBtn.addEventListener("click", () => {
        chrome.windows.create({
            url: chrome.runtime.getURL("Logs.html"),
            type: "popup",
            width: 600,
            height: 800
        });
    });


});