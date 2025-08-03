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

async function showRecipe() {
  const res = await fetch("recipes.json");
  const recipes = await res.json();
  const random = recipes[Math.floor(Math.random() * recipes.length)];
  document.getElementById("recipeBox").textContent = `🍲 ${random}`;
}
