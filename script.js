async function searchResources() {
  const zip = document.getElementById("zipInput").value.trim();
  if (!zip) return alert("Please enter a ZIP code.");

  const pantryList = document.getElementById("pantryResults");
  const shelterList = document.getElementById("shelterResults");
  pantryList.innerHTML = '';
  shelterList.innerHTML = '';

  const [pantries, shelters] = await Promise.all([
    fetch("data/pantries.json").then(res => res.json()),
    fetch("data/shelters.json").then(res => res.json())
  ]);

  const nearbyPantries = pantries.filter(p => p.zip === zip);
  const nearbyShelters = shelters.filter(s => s.zip === zip);

  if (nearbyPantries.length === 0) pantryList.innerHTML = "<li>No pantries found.</li>";
  else nearbyPantries.forEach(p => {
    const li = document.createElement("li");
    li.textContent = `${p.name} - ${p.address}`;
    pantryList.appendChild(li);
  });

  if (nearbyShelters.length === 0) shelterList.innerHTML = "<li>No shelters found.</li>";
  else nearbyShelters.forEach(s => {
    const li = document.createElement("li");
    li.textContent = `${s.name} - ${s.address}`;
    shelterList.appendChild(li);
  });
}

// 🍲 Show a random recipe (basic)
async function showRecipe() {
  try {
    const res = await fetch("recipes.json");
    if (!res.ok) throw new Error("File not found");
    const recipes = await res.json();
    const random = recipes[Math.floor(Math.random() * recipes.length)];
    document.getElementById("recipeBox").textContent = `🍲 ${random.name || random}`;
  } catch (error) {
    document.getElementById("recipeBox").textContent = "Sorry, recipe list could not be loaded.";
    console.error("Error fetching recipes:", error);
  }
}

// ✅ Ingredient checkbox-based recipe matcher
let allRecipes = [];
let allIngredients = new Set();

async function loadRecipes() {
  try {
    const res = await fetch("recipes.json");
    const data = await res.json();
    allRecipes = data;

    // Extract all unique ingredients
    data.forEach(recipe => {
      recipe.ingredients.forEach(ing => allIngredients.add(ing));
    });

    // Populate ingredient checkboxes
    const ingredientList = document.getElementById("ingredientList");
    ingredientList.innerHTML = '';
    allIngredients.forEach(ingredient => {
      const label = document.createElement("label");
      label.className = "recipe-item";

      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.value = ingredient;

      const span = document.createElement("span");
      span.textContent = ingredient;

      label.appendChild(checkbox);
      label.appendChild(span);
      ingredientList.appendChild(label);
    });
  } catch (err) {
    console.error("Failed to load recipes or ingredients:", err);
  }
}

function findMatchingRecipes() {
  const checked = Array.from(document.querySelectorAll("#ingredientList input:checked"))
    .map(cb => cb.value);

  const matches = allRecipes.filter(recipe =>
    recipe.ingredients.every(ing => checked.includes(ing))
  );

  const resultList = document.getElementById("matchingRecipes");
  resultList.innerHTML = "";

  if (matches.length === 0) {
    resultList.innerHTML = "<li>No recipes match your ingredients.</li>";
    return;
  }

  matches.forEach(recipe => {
    const li = document.createElement("li");
    li.textContent = recipe.name;
    resultList.appendChild(li);
  });
}

// 📦 Load everything on page ready
window.addEventListener("DOMContentLoaded", loadRecipes);
