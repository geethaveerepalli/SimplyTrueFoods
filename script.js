/* 
  SimplyTrueFoods — Interactive JS
  Features:
  - Sticky navbar with hamburger toggle (mobile)
  - Search + category filter for menu
  - Meal of the Day randomizer
  - Calorie calculator with animated SVG progress ring
  - Order popup (mock)
*/
// Hamburger menu toggle
const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('navMenu');

hamburger.addEventListener('click', () => {
  const expanded = hamburger.getAttribute('aria-expanded') === 'true';
  hamburger.setAttribute('aria-expanded', !expanded);
  navMenu.classList.toggle('active');
});

// Menu items data
const menuData = [
  {
    id: 1,
    name: 'Avocado Toast',
    desc: 'Whole grain bread topped with smashed avocado and seeds',
    kcal: 250,
    category: 'breakfast',
  },
  {
    id: 2,
    name: 'Berry Smoothie',
    desc: 'Mixed berries blended with almond milk and chia seeds',
    kcal: 180,
    category: 'breakfast',
  },
  {
    id: 3,
    name: 'Quinoa Salad',
    desc: 'Quinoa, chickpeas, cucumbers, tomatoes, and lemon dressing',
    kcal: 340,
    category: 'lunch',
  },
  {
    id: 4,
    name: 'Chicken Wrap',
    desc: 'Grilled chicken, lettuce, and yogurt sauce in a whole wheat wrap',
    kcal: 400,
    category: 'lunch',
  },
  {
    id: 5,
    name: 'Energy Balls',
    desc: 'Dates, nuts, cocoa, and coconut rolled into bite-sized balls',
    kcal: 120,
    category: 'snack',
  },
  {
    id: 6,
    name: 'Veggie Sticks & Hummus',
    desc: 'Carrot and celery sticks served with homemade hummus',
    kcal: 150,
    category: 'snack',
  },
];

// Render menu cards based on filters
const menuGrid = document.getElementById('menuGrid');
const chips = document.getElementById('chips');
const searchInput = document.getElementById('searchInput');

function renderMenu(filterCategory = 'all', filterText = '') {
  menuGrid.innerHTML = '';
  const filtered = menuData.filter(item => {
    const matchesCategory = filterCategory === 'all' || item.category === filterCategory;
    const matchesText = item.name.toLowerCase().includes(filterText.toLowerCase());
    return matchesCategory && matchesText;
  });
  if (filtered.length === 0) {
    menuGrid.innerHTML = `<p>No dishes found.</p>`;
    return;
  }
  filtered.forEach(item => {
    const card = document.createElement('div');
    card.className = 'card';
    card.setAttribute('tabindex', '0');
    card.innerHTML = `
      <h3>${item.name}</h3>
      <p>${item.desc}</p>
      <p class="kcal">${item.kcal} kcal</p>
      <div class="actions">
        <button class="btn order-btn" data-id="${item.id}">Order Now</button>
        <button class="btn secondary add-btn" data-id="${item.id}">Add to Plan</button>
      </div>
    `;
    menuGrid.appendChild(card);
  });
}

// Initialize chips events
chips.addEventListener('click', (e) => {
  if (e.target.classList.contains('chip')) {
    document.querySelectorAll('.chip').forEach(c => c.classList.remove('active'));
    e.target.classList.add('active');
    renderMenu(e.target.dataset.cat, searchInput.value);
  }
});

// Search input event
searchInput.addEventListener('input', () => {
  const activeChip = document.querySelector('.chip.active');
  renderMenu(activeChip ? activeChip.dataset.cat : 'all', searchInput.value);
});

// Meal of the day logic
const specialText = document.getElementById('specialText');
const newMealBtn = document.getElementById('newMeal');

function pickRandomMeal() {
  const random = menuData[Math.floor(Math.random() * menuData.length)];
  specialText.textContent = `${random.name} — ${random.desc} (${random.kcal} kcal)`;
}
newMealBtn.addEventListener('click', pickRandomMeal);
pickRandomMeal();

// Calorie tool
const calorieOptions = document.getElementById('calorieOptions');
const kcalTotalElem = document.getElementById('kcalTotal');
const ringFg = document.getElementById('ringFg');
const targetSlider = document.getElementById('targetSlider');
const targetVal = document.getElementById('targetVal');

let selectedCalories = new Set();
let currentTarget = +targetSlider.value;

function updateCalorieMeter() {
  const total = Array.from(selectedCalories).reduce((acc, c) => acc + c, 0);
  kcalTotalElem.textContent = total;
  const circumference = 2 * Math.PI * 90;
  const offset = circumference - Math.min(total, currentTarget) / currentTarget * circumference;
  ringFg.style.strokeDashoffset = offset;
}

function buildCalorieOptions() {
  calorieOptions.innerHTML = '';
  menuData.forEach(item => {
    const div = document.createElement('div');
    div.className = 'opt';
    div.innerHTML = `
      <input type="checkbox" id="chk${item.id}" value="${item.kcal}">
      <label for="chk${item.id}">${item.name} (${item.kcal} kcal)</label>
    `;
    calorieOptions.appendChild(div);
    const checkbox = div.querySelector('input');
    checkbox.addEventListener('change', (e) => {
      const val = +e.target.value;
      if (e.target.checked) {
        selectedCalories.add(val);
      } else {
        selectedCalories.delete(val);
      }
      updateCalorieMeter();
    });
  });
}

targetSlider.addEventListener('input', (e) => {
  currentTarget = +e.target.value;
  targetVal.textContent = currentTarget;
  updateCalorieMeter();
});

// Popup order dialog
const orderPopup = document.getElementById('orderPopup');
const popupMsg = document.getElementById('popupMsg');

function openPopup(msg) {
  popupMsg.textContent = msg;
  orderPopup.style.display = 'block';
}
function closePopup() {
  orderPopup.style.display = 'none';
}
orderPopup.addEventListener('click', (e) => {
  if (e.target === orderPopup) closePopup();
});
document.querySelector('.popup__close').addEventListener('click', closePopup);

// Order & Add buttons event delegation
menuGrid.addEventListener('click', (e) => {
  if (e.target.classList.contains('order-btn')) {
    const id = +e.target.dataset.id;
    const item = menuData.find(x => x.id === id);
    openPopup(`Ordering "${item.name}" is coming soon!`);
  }
  if (e.target.classList.contains('add-btn')) {
    const id = +e.target.dataset.id;
    const item = menuData.find(x => x.id === id);
    openPopup(`"${item.name}" added to your meal plan.`);
  }
});

// Initialize
renderMenu();
buildCalorieOptions();
updateCalorieMeter();

