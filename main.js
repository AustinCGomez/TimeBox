const SAVE_BUTTON = document.getElementById("save-btn");
const LOG_HOURS = document.getElementById("view-hours");
const VIEW_LOGS = document.getElementById("view-logs");
const VIEW_SETTINGS = document.getElementById("settings-btn");
const DELETE_BUTTON = document.getElementById("delete-logs");
const CONFIRM_YES_DELETION = document.getElementById("yes");
const CONFIRM_NO_DELETION = document.getElementById("no");
const GO_BACK_BUTTON = document.querySelectorAll(".back-button");
//const BACK_BUTTON = document.getElementById(".back");
// Not yet refactored


   

    // === Save button ===
SAVE_BUTTON.addEventListener("click", () => {
    const { start, end, date, description } = getFormValues();
    NewEntry(start, end, date, description);
});

LOG_HOURS.addEventListener("click", () => {
    ViewSelector("LOG-HOURS");
    
});

VIEW_LOGS.addEventListener("click", () => {
    ViewSelector("VIEW-LOGS");    
});

VIEW_SETTINGS.addEventListener("click", () =>{ 
    ViewSelector("SETTINGS-BUTTON");
});

DELETE_BUTTON.addEventListener("click", () => {
    ViewSelector("DELETE-BUTTON");
    });

// We need to change yes-input to something else. 
CONFIRM_YES_DELETION.addEventListener("click", () => {
    ViewSelector("YES-INPUT");
    });
// We need to change no-input to something else.
CONFIRM_NO_DELETION.addEventListener("click", () => {
    ViewSelector("NO-INPUT");
    });

GO_BACK_BUTTON.forEach(button => {
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
    // We will do .remove from all pages when the back button is pressed.
        switch(page) {
        case "LOG-HOURS":
        document.getElementById("homeView").classList.add("hidden");
        document.getElementById("mainView").classList.remove("hidden");  
        break;
        case "VIEW-LOGS":
        document.getElementById("homeView").classList.add("hidden");
        document.getElementById("logs-dashboard").classList.remove("hidden");
        displayLogs();
            break;
        case "DELETE-BUTTON":
          document.getElementById("logs-dashboard").classList.add("hidden");
        document.getElementById("warning-dashboard").classList.remove("hidden");
        document.getElementById("settings-dashboard").classList.add("hidden");    
        break;
        case "SHOW-OUTPUT":
            break;
        case "NO-INPUT":
            document.getElementById("warning-dashboard").classList.add("hidden");
        document.getElementById("logs-dashboard").classList.remove("hidden");
        break;
        case "YES-INPUT":
            tasks = [];
            chrome.storage.local.set({ tasks: [] }, () => { });
            console.log("All tasks deleted!");
            document.getElementById("warning-dashboard").classList.add("hidden");
            document.getElementById("mainView").classList.add("hidden");
            alert("All logs deleted successfully!")
            break;
        case "BACK-BUTTON":
            document.getElementById("homeView").classList.remove("hidden");
            document.getElementById("mainView").classList.add("hidden");
            document.getElementById("logs-dashboard").classList.add("hidden");
            document.getElementById("warning-dashboard").classList.add("hidden");
            document.getElementById("settings-dashboard").classList.add("hidden");
            break;
        case "SETTINGS-BUTTON":
        document.getElementById("homeView").classList.add("hidden");
        document.getElementById("settings-dashboard").classList.remove("hidden");
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
            //alert("The date cannot be in the past!")
            alert("ERROR: You cannot pick a date that is before today!");
            return;
        }

        const TASKS = {start, end, date, description,  timestamp: Date.now() };
        tasks.push(TASKS);
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




