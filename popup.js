// Save button - this part is correct (just adding a small improvement)
saveBtn.addEventListener('click', () => {
    const start = document.getElementById('StartTime').value;
    const end = document.getElementById('EndTime').value;
    const date = document.getElementById('Date').value;
    const description = document.getElementById('TasksCompleted').value;

    if (!start || !end || !date || !description) {
        alert("Please fill in all fields!");
        return;
    }

    const task = { start, end, date, description };
    tasks.push(task);

    // Save the entire tasks array under the key "tasks"
    chrome.storage.local.set({ tasks: tasks }, () => {
        console.log('Tasks saved:', tasks);
      
    });

    // Clear form
    document.getElementById('StartTime').value = '';
    document.getElementById('EndTime').value = '';
    document.getElementById('Date').value = '';
    document.getElementById('TasksCompleted').value = '';
});

// Load and display tasks when popup opens
document.addEventListener("DOMContentLoaded", () => {
    const output = document.getElementById("output");

    // Correctly retrieve the "tasks" key
    chrome.storage.local.get("tasks", (result) => {
        const savedTasks = result.tasks || [];  // default to empty array

        // Update the global tasks array so new saves append correctly
        tasks = savedTasks;

        if (savedTasks.length > 0) {
            output.textContent = JSON.stringify(savedTasks, null, 2);
        } else {
            output.textContent = "No tasks saved yet.";
        }
    });
});

document.getElementById("view-logs").addEventListener("click", () => {
    chrome.windows.create({
        url: "Logs.html",
        type: "popup",
        width: 500,
        height: 700
    });
});