let nihilismResources = {};
let currentSection = null;

document.getElementById("resource-content").innerHTML = "<p>Loading Resources....</p>";
fetch("nihilism.json")
    .then(response => response.json())
    .then(data => {
        nihilismResources = data;
        initEventListeners();
    })
    .catch(error => {
        console.error("Failed to load resources:", error);
        document.getElementById("resource-content").innerHTML = "<p>Failed to load resources.</p>";
    });

function initEventListeners() {
    const sectionButtons = document.querySelectorAll(".section-button");
    const levelButtons = document.querySelectorAll(".level-button");
    const resourceContainer = document.getElementById("resource-content");

    sectionButtons.forEach(btn => {
        btn.addEventListener("click", () => {
            currentSection = btn.dataset.section;
            highlightSelected(btn, sectionButtons);
            resourceContainer.innerHTML = `<p>Select a level to view resources for <strong>${currentSection}</strong>.</p>`;
        });
    });

    levelButtons.forEach(btn => {
        btn.addEventListener("click", () => {
            const level = btn.dataset.level;
            if (!currentSection) {
                resourceContainer.innerHTML = "<p>Please select a section first.</p>";
                return;
            }
            const resources = nihilismResources[currentSection]?.[level];
            displayResources(resources, level);
            highlightSelected(btn, levelButtons);
        });
    });
}

function displayResources(resources, level) {
    const resourceContainer = document.getElementById("resource-content");
    if (!resources || resources.length === 0) {
        resourceContainer.innerHTML = "<p>No resources available for this level yet.</p>";
        return;
    }

    let html = `<h2>${capitalize(level)} Level Resources</h2>`;
    resources.forEach((item, i) => {
        html += `
        <div class="resource-item">
            <h3>Module ${i + 1}</h3>
            <p><strong>🎥 Video:</strong> <a href="${item.video.url}" target="_blank">${item.video.title}</a></p>
            <p>${item.video.description}</p>
            <p><strong>📖 Reading:</strong> <a href="${item.reading.url}" target="_blank">${item.reading.title}</a></p>
            <p>${item.reading.description}</p>
            <hr/>
        </div>
        `;
    });

    resourceContainer.innerHTML = html;
}

function capitalize(word) {
    return word.charAt(0).toUpperCase() + word.slice(1);
}

function highlightSelected(selected, group) {
    group.forEach(btn => btn.classList.remove("active"));
    selected.classList.add("active");
}