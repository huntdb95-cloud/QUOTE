const driverCountEl = document.getElementById("driverCount");
const vehicleCountEl = document.getElementById("vehicleCount");
const driversEl = document.getElementById("drivers");
const vehiclesEl = document.getElementById("vehicles");

/* ---------- Helpers ---------- */
function populateSelect(select, max, defaultVal = 0) {
  for (let i = 0; i <= max; i++) {
    const opt = document.createElement("option");
    opt.value = i;
    opt.textContent = i;
    select.appendChild(opt);
  }
  select.value = defaultVal;
}

function copy(text) {
  if (!text) return;
  navigator.clipboard.writeText(text);
}

/* ---------- VIN Decode ---------- */
async function decodeVIN(vin) {
  if (vin.length !== 17) return "VIN must be 17 characters";

  const url = `https://vpic.nhtsa.dot.gov/api/vehicles/DecodeVinValuesExtended/${vin}?format=json`;
  const res = await fetch(url);
  const data = await res.json();
  const r = data.Results[0];

  return `${r.ModelYear || ""} ${r.Make || ""} ${r.Model || ""}`.trim();
}

/* ---------- Render Drivers ---------- */
function renderDrivers(count) {
  driversEl.innerHTML = "";

  for (let i = 0; i < count; i++) {
    const card = document.createElement("div");
    card.className = "card";

    card.innerHTML = `
      <div class="card-header">
        <strong>Driver ${i + 1}</strong>
        <button>Copy License</button>
      </div>

      <div class="row">
        <div class="field">
          <label>Name</label>
          <input>
        </div>
        <div class="field">
          <label>DOB</label>
          <input type="date">
        </div>
        <div class="field">
          <label>License #</label>
          <input class="license">
        </div>
      </div>
    `;

    card.querySelector("button").onclick = () => {
      copy(card.querySelector(".license").value);
    };

    driversEl.appendChild(card);
  }
}

/* ---------- Render Vehicles ---------- */
function renderVehicles(count) {
  vehiclesEl.innerHTML = "";

  for (let i = 0; i < count; i++) {
    const card = document.createElement("div");
    card.className = "card";

    card.innerHTML = `
      <div class="card-header">
        <strong>Vehicle ${i + 1}</strong>
        <div class="actions">
          <button class="copy">Copy VIN</button>
          <button class="decode">Decode VIN</button>
        </div>
      </div>

      <div class="field">
        <label>VIN</label>
        <input class="vin">
      </div>

      <div class="decoded">—</div>
    `;

    const vinInput = card.querySelector(".vin");
    const decoded = card.querySelector(".decoded");

    card.querySelector(".copy").onclick = () => copy(vinInput.value);

    card.querySelector(".decode").onclick = async () => {
      decoded.textContent = "Decoding...";
      decoded.textContent = await decodeVIN(vinInput.value.trim().toUpperCase());
    };

    vehiclesEl.appendChild(card);
  }
}

/* ---------- Init ---------- */
populateSelect(driverCountEl, 10, 1);
populateSelect(vehicleCountEl, 10, 1);

renderDrivers(1);
renderVehicles(1);

driverCountEl.addEventListener("change", e => {
  renderDrivers(Number(e.target.value));
});

vehicleCountEl.addEventListener("change", e => {
  renderVehicles(Number(e.target.value));
});
