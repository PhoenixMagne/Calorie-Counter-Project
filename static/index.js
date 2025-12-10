// Daily Goal & Progress
let dailyGoal = 0;
let caloriesConsumed = 0;

const progressCircle = document.getElementById("progressCircle");
const progressText = document.getElementById("progressText");

function updateProgress() {
  if (dailyGoal <= 0) {
    progressText.textContent = "0%";
    progressCircle.classList.remove("filled");
    return;
  }

  const percent = Math.min(Math.round((caloriesConsumed / dailyGoal) * 100), 100);
  progressText.textContent = percent + "%";

  if (percent >= 100) {
    progressCircle.classList.add("filled");
  } else {
    progressCircle.classList.remove("filled");
  }
}

document.getElementById("goalForm").addEventListener("submit", (e) => {
  e.preventDefault();
  dailyGoal = parseInt(document.getElementById("dailyGoal").value);
  updateProgress();
});

//Adding Posts (Client Side Only)
const newPostForm = document.getElementById("newPostForm");
const feed = document.getElementById("feed");

newPostForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const name = document.getElementById("foodName").value;
  const calories = parseInt(document.getElementById("calories").value);
  const description = document.getElementById("description").value;
  const fileInput = document.getElementById("foodImage");

  // Update calorie tracking
  caloriesConsumed += calories;
  updateProgress();

  // Create new feed post visually
  const post = document.createElement("article");
  post.classList.add("post");

  // Convert image file → preview URL
  const file = fileInput.files[0];
  let imgTag = "";
  if (file) {
    const url = URL.createObjectURL(file);
    imgTag = `<img src="${url}" class="post-image">`;
  }

  post.innerHTML = `
    ${imgTag}
    <h3>${name}</h3>
    <p class="calories">Calories: <strong>${calories}</strong></p>
    <p class="description">${description}</p>
  `;

  feed.prepend(post); // Add new post to the top of the feed

  newPostForm.reset();
});

// Add Post Button Scroll
document.getElementById("addPostBtn").addEventListener("click", () => {
  newPostForm.scrollIntoView({ behavior: "smooth" });
});


// Calorie Preset Handling - has multiple preset options,
// If user selects "Custom", show input field for manual entry
const caloriePreset = document.getElementById("caloriePreset");
const calorieInput = document.getElementById("calories");
calorieInput.value = ""
calorieInput.style.display = "none"; // Hide custom input by default

// Update field form on dropdown selection
caloriePreset.addEventListener("change", () => {
  if (caloriePreset.value === "custom") {
    // Show custom input field
    calorieInput.style.display = "inline-block";
    calorieInput.value = ""; // Clear any previous value
    calorieInput.required = true; // Ensure user types something
    calorieInput.focus();
  } else {
    // Hide input and use the preset value
    calorieInput.style.display = "none";
    calorieInput.value = caloriePreset.value;
    calorieInput.required = false; // Preset satisfies the requirement
  }
});