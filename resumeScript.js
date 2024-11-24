// Retrieve resume data from localStorage and parse it to an object
var resumeData = JSON.parse(localStorage.getItem("resumeData") || "{}");
// Utility function to get an HTML element by ID with specific type
function getElementById(id) {
    var element = document.getElementById(id);
    if (!element)
        throw new Error("Element with ID '".concat(id, "' not found."));
    return element;
}
// Retrieve the image data URL from localStorage
var imageDataURL = localStorage.getItem("selectedImage");
var displayImage = document.getElementById("displayImage");
if (imageDataURL) {
    displayImage.src = imageDataURL;
    displayImage.style.display = "block"; // Make image visible
}
// Display data in respective HTML elements
getElementById("displayName").textContent = resumeData.name;
getElementById("displayContact").textContent =
    "Contact: " + resumeData.contact;
getElementById("displayEmail").textContent =
    "Email: " + resumeData.email;
getElementById("displayAbout").textContent =
    resumeData.about;
// Education section: show each entry in a styled format
var educationContainer = getElementById("displayEducation");
resumeData.education.split("\n").forEach(function (edu) {
    var eduElement = document.createElement("p");
    eduElement.style.textAlign = "left";
    eduElement.innerHTML = edu + "<hr>";
    educationContainer.appendChild(eduElement);
});
// Skills section: show each entry in a styled format if present
var skillContainer = getElementById("displaySkillsContainer");
// Get non-empty skills, then add them with <hr> only between entries
var skills = resumeData.skills.split("\n").forEach(function (skl) {
    var skillElement = document.createElement("li");
    skillElement.innerHTML = skl.trim();
    skillElement.style.marginLeft = "10px";
    // skillElement.outerText = skl.trim();
    skillContainer.appendChild(skillElement);
});
// Language section: show each entry in a styled format if present
var languageContainer = getElementById("displayLanguageContainer");
// Get non-empty skills, then add them with <hr> only between entries
var language = resumeData.language.split("\n").forEach(function (lan) {
    var languageElement = document.createElement("li");
    languageElement.style.marginLeft = "10px";
    languageElement.innerHTML = lan.trim();
    languageContainer.appendChild(languageElement);
});
// Experience section: show each entry in a styled format
var expContainer = getElementById("displayExperience");
resumeData.experience.split("\n").forEach(function (exp) {
    var expElement = document.createElement("p");
    expElement.style.textAlign = "left";
    expElement.innerHTML = exp + "<hr>";
    expContainer.appendChild(expElement);
});
// Add event listener for the Edit button
document.addEventListener("DOMContentLoaded", function () {
    var editButton = document.getElementById("editButton");
    var clearButton = document.getElementById("clearButton");
    if (!editButton || !clearButton || !downloadButton) {
        console.warn("Edit button not found in the DOM");
        return; // Stop execution if the edit button is not found
    }
    // Hide both buttons before printing
    window.addEventListener("beforeprint", function () {
        editButton.style.display = "none";
        clearButton.style.display = "none";
        downloadButton.style.display = "none";
    });
    // Show both buttons again after printing
    window.addEventListener("afterprint", function () {
        editButton.style.display = "inline-block";
        clearButton.style.display = "inline-block";
    });
    var editableElements = [
        "displayImage",
        "displayName",
        "displayAbout",
        "displayContact",
        "displayEmail",
        "displaySkillsContainer",
        "displayLanguageContainer",
        "displayEducation",
        "displayExperience",
    ];
    editButton.addEventListener("click", function () {
        editableElements.forEach(function (elementId) {
            var element = document.getElementById(elementId);
            if (!element) {
                console.warn("Element with ID '".concat(elementId, "' not found."));
                return; // Skip this iteration if element not found
            }
            // Special handling for the image element
            if (elementId === "displayImage") {
                var fileInput = document.createElement("input");
                fileInput.type = "file";
                fileInput.accept = "image/*";
                fileInput.addEventListener("change", function (event) {
                    var _a;
                    var file = (_a = event.target.files) === null || _a === void 0 ? void 0 : _a[0];
                    if (file) {
                        var reader_1 = new FileReader();
                        reader_1.onload = function () {
                            element.src = reader_1.result;
                            saveEditedContent(elementId, reader_1.result);
                        };
                        reader_1.readAsDataURL(file);
                    }
                });
                fileInput.click(); // Trigger file selection dialog
            }
            else {
                if (element.getAttribute("contenteditable") !== "true") {
                    element.setAttribute("contenteditable", "true");
                    element.style.border = "2px dashed blue";
                    element.style.padding = "5px";
                    editButton.textContent = "Save Changes";
                }
                else {
                    element.setAttribute("contenteditable", "false");
                    element.style.border = "none";
                    element.style.padding = "0";
                    editButton.textContent = "Edit";
                    saveEditedContent(elementId, element.textContent || "");
                }
            }
        });
    });
    function saveEditedContent(elementId, newContent) {
        localStorage.setItem(elementId, newContent);
        console.log("".concat(elementId, " content updated"));
    }
    editableElements.forEach(function (elementId) {
        var savedContent = localStorage.getItem(elementId);
        var element = document.getElementById(elementId);
        if (element && savedContent) {
            element.textContent = savedContent;
        }
    });
});
//html download 
var downloadButton = document.getElementById("downloadButton");
if (downloadButton) {
    downloadButton.addEventListener("click", function () {
        var resumeContainer = document.querySelector(".resume-container");
        // Casting to HTMLElement
        var cssContent = "";
        if (!resumeContainer) {
            console.error("Resume container not found.");
            return;
        }
        // Loop through document.styleSheets to gather CSS rules
        for (var i = 0; i < document.styleSheets.length; i++) {
            var styleSheet = document.styleSheets[i];
            try {
                var rules = styleSheet.cssRules || styleSheet.rules;
                if (rules) {
                    for (var j = 0; j < rules.length; j++) {
                        cssContent += rules[j].cssText;
                    }
                }
            }
            catch (e) {
                console.warn("Could not access stylesheet:", e);
            }
        }
        // Hide unnecessary buttons during download
        var buttons = document.querySelectorAll("#downloadButton, #editButton, #clearButton");
        buttons.forEach(function (button) { return (button.style.display = "none"); });
        // Center the resume content
        resumeContainer.style.margin = "0 auto";
        resumeContainer.style.width = "100%";
        resumeContainer.style.fontSize = "14px";
        // Generate a complete HTML document with the resume content and embedded CSS
        var completeHtml = "\n      <!DOCTYPE html>\n      <html lang=\"en\">\n      <head>\n        <meta charset=\"UTF-8\">\n        <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">\n        <title>Downloaded Resume</title>\n        <style>".concat(cssContent, "</style>\n      </head>\n      <body>\n        ").concat(resumeContainer.outerHTML, "\n      </body>\n      </html>\n    ");
        // Create a blob and download the resume
        var blob = new Blob([completeHtml], { type: "text/pdf" });
        var link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = "Resume.html";
        link.click();
        // Restore buttons visibility after download
        buttons.forEach(function (button) { return (button.style.display = "block"); });
    });
}
// pdf download code 
// Add event listener for the back button
var clearButton = document.getElementById("clearButton");
clearButton.addEventListener("click", function () {
    localStorage.clear(); // LocalStorage clear karna
    window.location.href = "index.html"; // Page ko refresh karna
});
function html2pdf() {
    throw new Error("Function not implemented.");
}
