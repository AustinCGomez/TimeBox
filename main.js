// popup.js – FIXED VERSION

let tasks = [];

// Super important: wait for DOM
document.addEventListener("DOMContentLoaded", () => {
    const saveBtn = document.getElementById("save-btn");
    const viewBtn = document.getElementById("view-logs");
    const viewsHrsBtn = document.getElementById("view-hours");
    const delBtn = document.getElementById("delete-logs");
    const output = document.getElementById("output");
    const noBtn = document.getElementById("no");
    const yesBtn = document.getElementById("yes");
    const bckbutton = document.getElementById("back");
    const settingsBtn = document.getElementById("settings-btn");
    //const viewlogsbtn = document.getElementById("view-logs");

    if (!saveBtn || !viewBtn) {
        console.error("One or more elements not found! Check IDs in HTML.");
        return;
    }

    // Load tasks on startup
    chrome.storage.local.get("tasks", (result) => {
        tasks = result.tasks || [];
    });

    // === Save button ===
    saveBtn.addEventListener("click", () => {
        const start = document.getElementById("StartTime").value;
        const end = document.getElementById("EndTime").value;
        const date = document.getElementById("Date").value;
        const description = document.getElementById("TasksCompleted").value;
        const TodayDate = new Date();
        const FormattedDate = formatDate(TodayDate);

        if (!start || !end || !date || !description) {
            alert("All fields must be entered prior to submission");
            return;
        }

        if (date < FormattedDate) {
            //alert("The date cannot be in the past!")
            alert("ERROR: You cannot pick a date that is before today!");
            return;
        }

        const task = { start, end, date, description, timestamp: Date.now() };
        tasks.push(task);

        chrome.storage.local.set({ tasks: tasks }, () => {
            console.log("Task saved!", task);
            // Clear fields
            document.getElementById("StartTime").value = "";
            document.getElementById("EndTime").value = "";
            document.getElementById("Date").value = "";
            document.getElementById("TasksCompleted").value = "";
            
            alert("Task saved successfully!");
        });
    });

    // === View logs button ===
    viewBtn.addEventListener("click", () => {
        document.getElementById("homeView").classList.add("hidden");
        document.getElementById("logs-dashboard").classList.remove("hidden");
        displayLogs();
    });


    // === Back buttons (using class) ===
    document.querySelectorAll('.back-button').forEach(button => {
        button.addEventListener('click', () => {
            document.getElementById("homeView").classList.remove("hidden");
            document.getElementById("mainView").classList.add("hidden");
            document.getElementById("logs-dashboard").classList.add("hidden");
            document.getElementById("warning-dashboard").classList.add("hidden");
            document.getElementById("settings-dashboard").classList.add("hidden");
        });
    });

    // === Delete logs button ===
    delBtn.addEventListener("click", () => {
        document.getElementById("logs-dashboard").classList.add("hidden");
        document.getElementById("warning-dashboard").classList.remove("hidden");
    });

    // === Warning view - No button ===
    noBtn.addEventListener("click", () => {
        document.getElementById("warning-dashboard").classList.add("hidden");
        document.getElementById("logs-dashboard").classList.remove("hidden");
    });

    // === Warning view - Yes button ===
    yesBtn.addEventListener("click", () => {
        chrome.storage.local.set({ tasks: [] }, () => {
            tasks = [];
            console.log("All tasks deleted!");
            document.getElementById("warning-dashboard").classList.add("hidden");
            document.getElementById("mainView").classList.remove("hidden");
            alert("All logs deleted successfully!");
        });
    });

    // === View Hours Worked Button ===
    viewsHrsBtn.addEventListener("click", ()=> {
        document.getElementById("homeView").classList.add("hidden");
        document.getElementById("mainView").classList.remove("hidden");


    });

    settingsBtn.addEventListener("click", ()=> {
        document.getElementById("settings-dashboard").classList.remove("hidden");
        document.getElementById("homeView").classList.add("hidden");
    });

    // === Display logs function ===
    function displayLogs() {
        chrome.storage.local.get("tasks", (result) => {
            tasks = result.tasks || [];

            if (tasks.length === 0) {
                output.textContent = "No tasks saved yet.";
                return;
            }

            output.textContent = tasks
                .map(t => `Date: ${t.date} | Start Time: ${t.start}– End Time ${t.end}\n Task Overview: ${t.description}\n`)
                .join("\n" + "—".repeat(40) + "\n");
        });
    }

  function formatDate(date) {
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const year = date.getFullYear();
  return `${year}-${month}-${day}`;
}


});