// popup.js – CLEAN VERSION (preview completely disabled, everything else works)

let tasks = [];

// Super important: wait for DOM
document.addEventListener("DOMContentLoaded", () => {
    const saveBtn = document.getElementById("save-btn");
    const viewBtn = document.getElementById("view-logs");
    const backBtn = document.getElementById("back-button");
    const output = document.getElementById("output");


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
            alert("All fields must be entered prior to submission");
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

    // ==== Retrieve data function 
    chrome.storage.local.get("tasks", (result) => {
          tasks = result.tasks || [];

        if (tasks.length === 0) {
            output.textContent = "No tasks saved yet.";
            return;
        }

        // EXACT SAME DISPLAY CODE you already love
        output.textContent = tasks
            .map(t => `${t.date} | ${t.start}–${t.end}\n${t.description}\n`)
            .join("\n" + "—".repeat(40) + "\n");
    });
    });

    // === Move between views logic ===

    viewBtn.addEventListener("click", ()=> {

        document.getElementById("mainView").classList.add("hidden");
        document.getElementById("logs-dashboard").classList.remove("hidden");
    
    
        displayLogs();
    });

    backBtn.addEventListener("click", ()=> {
        document.getElementById("mainView").classList.remove("hidden");
        document.getElementById("logs-dashboard").classList.add("hidden");
    });

 


// Wait for the page to load
document.addEventListener("DOMContentLoaded", () => {
    const output = document.getElementById("output");

    // Load tasks from storage
    chrome.storage.local.get("tasks", (result) => {
        tasks = result.tasks || [];

        if (tasks.length === 0) {
            output.textContent = "No tasks saved yet.";
            return;
        }

        // EXACT SAME DISPLAY CODE you already love
        output.textContent = tasks
            .map(t => `${t.date} | ${t.start}–${t.end}\n${t.description}\n`)
            .join("\n" + "—".repeat(40) + "\n");
    });
});

});

