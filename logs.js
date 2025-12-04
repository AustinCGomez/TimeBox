let tasks = [];

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