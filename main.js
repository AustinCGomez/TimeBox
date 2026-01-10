const BTN_SAVE_ENTRY = document.getElementById("btn-save-data");
const BTN_NAV_LOGGER = document.getElementById("btn-open-logger");
const BTN_NAV_HISTORY = document.getElementById("btn-open-logs");
const BTN_NAV_SETTINGS = document.getElementById("btn-open-settings");
const BTN_TRIGGER_DELETE = document.getElementById("btn-delete-all");
const BTN_CONFIRM_DELETE = document.getElementById("btn-execute-delete");
const BTN_CANCEL_DELETE = document.getElementById("btn-cancel-delete");
const BTNS_BACK_NAVIGATION = document.querySelectorAll(".back-button");

// === Event Listeners ===

BTN_SAVE_ENTRY.addEventListener("click", () => {
    const { start, end, date, description } = getFormValues();
    NewEntry(start, end, date, description);
});

BTN_NAV_LOGGER.addEventListener("click", () => {
    ViewSelector("LOG-HOURS");
});

BTN_NAV_HISTORY.addEventListener("click", () => {
    ViewSelector("VIEW-LOGS");    
});

BTN_NAV_SETTINGS.addEventListener("click", () =>{ 
    ViewSelector("SETTINGS-BUTTON");
});

BTN_TRIGGER_DELETE.addEventListener("click", () => {
    ViewSelector("DELETE-BUTTON");
});

BTN_CONFIRM_DELETE.addEventListener("click", () => {
    ViewSelector("YES-INPUT");
});

BTN_CANCEL_DELETE.addEventListener("click", () => {
    ViewSelector("NO-INPUT");
});

BTNS_BACK_NAVIGATION.forEach(button => {
    button.addEventListener("click", () => {
        ViewSelector("BACK-BUTTON");
    });
});

function getFormValues() {
    return {
        start: document.getElementById("StartTime").value,
        end: document.getElementById("EndTime").value,
        date: document.getElementById("Date").value,
        description: document.getElementById("TasksCompleted").value
    };
};

 // Load tasks on startup
 chrome.storage.local.get("tasks", (result) => {
    tasks = result.tasks || [];
 });

 function ViewSelector(page) {
    switch(page) {
        case "LOG-HOURS":
            document.getElementById("view-home").classList.add("hidden");
            document.getElementById("view-logger").classList.remove("hidden");  
            break;
        case "VIEW-LOGS":
            document.getElementById("view-home").classList.add("hidden");
            document.getElementById("view-logs-list").classList.remove("hidden");
            displayLogs();
            break;
        case "DELETE-BUTTON":
            document.getElementById("view-logs-list").classList.add("hidden");
            document.getElementById("view-confirm-delete").classList.remove("hidden");
            document.getElementById("view-settings").classList.add("hidden");    
            break;
        case "NO-INPUT":
            document.getElementById("view-confirm-delete").classList.add("hidden");
            document.getElementById("view-logs-list").classList.remove("hidden");
            break;
        case "YES-INPUT":
            tasks = [];
            chrome.storage.local.set({ tasks: [] }, () => { });
            console.log("All tasks deleted!");
            document.getElementById("view-confirm-delete").classList.add("hidden");
            document.getElementById("view-logger").classList.add("hidden");
            alert("All logs deleted successfully!")
            break;
        case "BACK-BUTTON":
            document.getElementById("view-home").classList.remove("hidden");
            document.getElementById("view-logger").classList.add("hidden");
            document.getElementById("view-logs-list").classList.add("hidden");
            document.getElementById("view-confirm-delete").classList.add("hidden");
            document.getElementById("view-settings").classList.add("hidden");
            break;
        case "SETTINGS-BUTTON":
            document.getElementById("view-home").classList.add("hidden");
            document.getElementById("view-settings").classList.remove("hidden");
            break;
    };
};

function ResetField(start, end, date, description, TodayDate, FormattedDate) {
    document.getElementById("StartTime").value = "";
    document.getElementById("EndTime").value = "";
    document.getElementById("Date").value = "";
    document.getElementById("TasksCompleted").value = "";  
};

function NewEntry(start, end, date, description, TodayDate, FormattedDate) {
    if (!start || !end || !date || !description) {
        alert("All fields must be entered prior to submission");
        return;
    }

    if (date < FormattedDate) {
        alert("ERROR: You cannot pick a date that is before today!");
        return;
    }

    const TASKS = {start, end, date, description, timestamp: Date.now() };
    tasks.push(TASKS);
    chrome.storage.local.set({ tasks: tasks }, () => {});
    alert("Hours have been saved.", tasks);
    ResetField(start, end, date, description, TodayDate, FormattedDate);
    ViewSelector();
};

function displayLogs() {
    chrome.storage.local.get("tasks", (result) => {
        tasks = result.tasks || [];

        if (tasks.length === 0) {
            output.textContent = "You have not submitted any hours at this time.";
            return;
        }

        output.textContent = tasks
            .map(t => `Date: ${t.date} | Start Time: ${t.start}– End Time ${t.end}\n Task Overview: ${t.description}\n`)
            .join("\n" + "—".repeat(40) + "\n");
    });
}
