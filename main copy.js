
let tasks = [];

// Super important: wait for DOM
document.addEventListener("DOMContentLoaded", () => {
    const SAVE_BUTTON = document.getElementById("save-btn");
    const VIEW_LOGS_BUTTON = document.getElementById("view-logs");
    const VIEW_HOURS_BUTTON = document.getElementById("view-hours");
    const DELETE_BUTTON = document.getElementById("delete-logs");
    const DISPLAY_OUTPUT = document.getElementById("output");
    const NO_INPUT_BUTTON = document.getElementById("no");
    const YES_INPUT_BUTTON = document.getElementById("yes");
    const BACK_BUTTON = document.getElementById("back");
    const SETTINGS_BUTTON = document.getElementById("settings-btn");
   

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