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

// Food item preset searching and handling

const foodSearchInput = document.getElementById("foodSearch");
const resultsList = document.getElementById("searchResults");
let foodData = [];

// on load, fetch the data
fetch('/api/foods')
  .then(res => res.json())
  .then(data => {
    foodData = data;
  })
  .catch(err => console.error("Could not load food data", err));

//search code 
foodSearchInput.addEventListener("input", (e) => {
  const query = e.target.value.toLowerCase();
  resultsList.innerHTML = ""; // clears previous results

  if (query.length < 1) {
    resultsList.classList.add("hidden");
    return;
  }

  //filter foods based on user input
  const matches = foodData.filter(item => 
    item.name.toLowerCase().includes(query)
  );

  // use inner html to create dropdown list
  if (matches.length > 0) {
    matches.forEach(item => {
      const li = document.createElement("li");
      li.innerHTML = `
        <span>${item.name}</span> 
        <span class="meta">${item.calories_per_100g} cal/100g</span>
      `;
      
      // Click Handler for Autofill
      li.addEventListener("click", () => {
        selectFood(item);
      });
      
      resultsList.appendChild(li);
    });
    resultsList.classList.remove("hidden");
  } else {
    resultsList.classList.add("hidden");
  }
});

//when user presses enter, select the first item in the dropdown
foodSearchInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    e.preventDefault(); // prevents unwanted form submission from pressing enter
    //find the first option in the dropdown
    const firstResult = resultsList.querySelector("li");
    
    if (firstResult) {
      firstResult.click();
    }
  }
});

//when user clicks outside, hide the dropdown menu
document.addEventListener("click", (e) => {
  if (!foodSearchInput.contains(e.target) && !resultsList.contains(e.target)) {
    resultsList.classList.add("hidden");
  }
});

function selectFood(item) {
  // fill in the food name input w/ the selected item's name and calories
  document.getElementById("foodName").value = item.name;
  document.getElementById("calories").value = item.calories_per_100g;

  //insert image handling here when sam decides to wake up
  
  //close search results
  foodSearchInput.value = "";
  resultsList.classList.add("hidden");
}