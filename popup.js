let cities = [];
let selectedCity = null;

function normalizeUtcString(utcStr) {
  const match = utcStr.match(/^UTC([+-]?)(\d{1,2})(?::?(\d{2}))?$/i);
  if (!match) return utcStr;
  let [, sign, hour, minute] = match;
  hour = hour.padStart(2, '0');
  minute = minute ? minute.padStart(2, '0') : '00';
  return `UTC${sign}${hour}:${minute}`;
}

const utcToIanaMap = {
  'UTC-12:00': 'Etc/GMT+12',
  'UTC-11:00': 'Pacific/Pago_Pago',
  'UTC-10:00': 'Pacific/Honolulu',
  'UTC-09:00': 'America/Anchorage',
  'UTC-08:00': 'America/Los_Angeles',
  'UTC-07:00': 'America/Denver',
  'UTC-06:00': 'America/Chicago',
  'UTC-05:00': 'America/New_York',
  'UTC-04:00': 'America/Halifax',
  'UTC-03:00': 'America/Argentina/Buenos_Aires',
  'UTC-02:00': 'America/Noronha',
  'UTC-01:00': 'Atlantic/Azores',
  'UTC+00:00': 'UTC',
  'UTC+01:00': 'Europe/Paris',
  'UTC+02:00': 'Europe/Athens',
  'UTC+03:00': 'Europe/Moscow',
  'UTC+04:00': 'Asia/Dubai',
  'UTC+05:00': 'Asia/Karachi',
  'UTC+06:00': 'Asia/Dhaka',
  'UTC+07:00': 'Asia/Bangkok',
  'UTC+08:00': 'Asia/Shanghai',
  'UTC+09:00': 'Asia/Tokyo',
  'UTC+10:00': 'Australia/Sydney',
  'UTC+11:00': 'Pacific/Noumea',
  'UTC+12:00': 'Pacific/Auckland',
  'UTC+13:00': 'Pacific/Apia',
  'UTC+14:00': 'Pacific/Kiritimati'
};

function toIanaTimezone(tz) {
  const norm = normalizeUtcString(tz);
  return utcToIanaMap[norm] || norm;
}

let ALL_CITIES = [];

async function loadCityListFromCSV() {
  const response = await fetch('city.csv');
  const text = await response.text();
  const lines = text.split(/\r?\n/).filter(line => line && !line.startsWith('UTC,City'));
  const cityList = [];
  for (const line of lines) {
    const [utc, city, timezone] = line.split(',');
    if (utc && city) {
      cityList.push({ name: city.trim(), utc: utc.trim(), timezone: timezone?.trim() });
    }
  }
  return cityList;
}

document.addEventListener('DOMContentLoaded', () => {
  window.addCityBtn = document.getElementById('addCity');
  window.addCityModal = document.getElementById('addCityModal');
  window.citySearch = document.getElementById('citySearch');
  window.citySuggestions = document.getElementById('citySuggestions');
  const closeModal = document.getElementById('closeModal');
  const cancelAdd = document.getElementById('cancelAdd');
  const confirmAdd = document.getElementById('confirmAdd');

  addCityBtn.onclick = async function() {
    if (cities.length >= 5) {
      showToast('Maximum 5 city limited');
      return;
    }
    if (ALL_CITIES.length === 0) {
      ALL_CITIES = await loadCityListFromCSV();
    }
    citySearch.value = '';
    citySuggestions.innerHTML = '';
    addCityModal.style.display = 'block';
  };

  function searchCitiesCSV(query) {
    if (!query) return ALL_CITIES;
    query = query.toLowerCase();
    return ALL_CITIES.filter(city =>
      city.name.toLowerCase().includes(query) ||
      city.utc.toLowerCase().includes(query)
    );
  }

  function showCitySuggestionsCSV(suggestions) {
    citySuggestions.innerHTML = '';
    suggestions.forEach(city => {
      const div = document.createElement('div');
      div.className = 'city-suggestion';
      div.textContent = `${city.name} (${city.utc})`;
      div.addEventListener('click', () => {
        selectedCity = city;
        citySearch.value = city.name;
      });
      citySuggestions.appendChild(div);
    });
  }

  citySearch.oninput = function(e) {
    showCitySuggestionsCSV(searchCitiesCSV(e.target.value));
  };

  closeModal.onclick = function() {
    addCityModal.style.display = 'none';
    citySearch.value = '';
    citySuggestions.innerHTML = '';
    selectedCity = null;
  };

  cancelAdd.onclick = function() {
    addCityModal.style.display = 'none';
    citySearch.value = '';
    citySuggestions.innerHTML = '';
    selectedCity = null;
  };

  confirmAdd.onclick = async function() {
    if (selectedCity) {
      const ianaTimezone = selectedCity.timezone || toIanaTimezone(selectedCity.utc);
      if (!cities.some(c => c.name === selectedCity.name && c.timezone === ianaTimezone)) {
        cities.forEach(c => c.active = false);
        cities.push({ name: selectedCity.name, timezone: ianaTimezone, active: true, utc: selectedCity.utc });
        await chrome.storage.sync.set({ cities, activeTimezone: ianaTimezone });
        chrome.runtime.sendMessage({ type: 'ping' });
        renderCityList();
      } else {
        cities.forEach(c => c.active = (c.name === selectedCity.name && c.timezone === ianaTimezone));
        await chrome.storage.sync.set({ cities, activeTimezone: ianaTimezone });
        chrome.runtime.sendMessage({ type: 'ping' });
        renderCityList();
      }
    }
    addCityModal.style.display = 'none';
    citySearch.value = '';
    selectedCity = null;
  };

  async function loadCities() {
    const result = await chrome.storage.sync.get('cities');
    cities = result.cities || [];
    renderCityList();
  }

  async function saveCities() {
    await chrome.storage.sync.set({ cities });
    renderCityList();
  }

  function renderCityList() {
    const cityListElem = document.getElementById('cityList');
    cityListElem.innerHTML = '';
    cities.forEach((city, index) => {
      const li = document.createElement('li');
      li.className = 'city-item';
      const { timeString, iconSrc: timeIconSrc } = getTimeAndIcon(city.timezone);
      const switchIconSrc = chrome.runtime.getURL(city.active ? 'button/on.png' : 'button/off.png');

      li.innerHTML = `
        <img class="switch-icon" id="switch-icon-${index}" src="${switchIconSrc}" alt="${city.active ? 'On' : 'Off'}" data-index="${index}">
        <div class="city-info">
          <div class="city-name">${city.name}</div>
          <div class="city-timezone">${city.utc || city.timezone}</div>
        </div>
        <div class="city-time-info">
          <img class="time-icon" id="icon-${index}" src="${timeIconSrc}" alt="Time icon">
          <div class="city-current-time" id="time-${index}">${timeString}</div>
        </div>
        <div class="city-actions">
          <img class="btn-delete-icon" data-index="${index}" src="${chrome.runtime.getURL('button/del.png')}" alt="Delete">
        </div>
      `;

      li.querySelector('.switch-icon').addEventListener('click', async (e) => {
        try {
          const clickedIndex = parseInt(e.target.dataset.index, 10);
          cities.forEach((c, i) => { c.active = i === clickedIndex ? !c.active : false; });
          await saveCities();
          const activeCity = cities.find(c => c.active);
          const activeTimezone = activeCity
            ? toIanaTimezone(activeCity.timezone || activeCity.utc)
            : Intl.DateTimeFormat().resolvedOptions().timeZone;
          await chrome.storage.sync.set({ activeTimezone });
          chrome.runtime.sendMessage({ type: 'updateBadgeByIANA', timezone: activeTimezone });
          renderCityList();
        } catch (error) {
          console.error('Error toggling city:', error);
        }
      });

      li.querySelector('.btn-delete-icon').addEventListener('click', (e) => {
        e.stopPropagation();
        const idx = parseInt(e.target.dataset.index, 10);
        const deletedCity = cities[idx];
        cities.splice(idx, 1);
        saveCities();
        if (!cities.some(c => c.active) && deletedCity.active) {
          chrome.runtime.sendMessage({
            type: 'updateBadgeByIANA',
            timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
          });
        }
      });

      cityListElem.appendChild(li);
    });

    if (window.timeUpdateInterval) clearInterval(window.timeUpdateInterval);
    window.timeUpdateInterval = setInterval(updateCityTimes, 1000);
  }

  function getTimeAndIcon(timezone) {
    try {
      const now = new Date();
      const formatter = new Intl.DateTimeFormat('en-US', {
        hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false, timeZone: timezone
      });
      const timeStringWithSeconds = formatter.format(now);
      const parts = timeStringWithSeconds.match(/^(\d{2}):(\d{2}):(\d{2})$/);
      const hour = parts ? parseInt(parts[1], 10) : -1;
      return {
        timeString: timeStringWithSeconds.substring(0, 5),
        iconSrc: chrome.runtime.getURL((hour >= 6 && hour < 19) ? 'button/sun.png' : 'button/moon.png')
      };
    } catch (e) {
      return { timeString: '--:--', iconSrc: '' };
    }
  }

  function updateCityTimes() {
    cities.forEach((city, index) => {
      const timeElement = document.getElementById(`time-${index}`);
      const iconElement = document.getElementById(`icon-${index}`);
      if (timeElement && iconElement) {
        const { timeString, iconSrc } = getTimeAndIcon(city.timezone);
        timeElement.textContent = timeString;
        iconElement.src = iconSrc;
      }
    });
    updateLocalTimeBox();
  }

  function updateLocalTimeBox() {
    const now = new Date();
    const localTime = document.getElementById('localTime');
    const localTz = document.getElementById('localTz');
    if (localTime && localTz) {
      localTime.textContent = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
      localTz.textContent = Intl.DateTimeFormat().resolvedOptions().timeZone;
    }
  }
  setInterval(updateLocalTimeBox, 1000);
  updateLocalTimeBox();

  function showToast(msg) {
    const toast = document.getElementById('toast');
    toast.textContent = msg;
    toast.classList.add('show');
    toast.classList.remove('hide');
    setTimeout(() => {
      toast.classList.remove('show');
      toast.classList.add('hide');
    }, 2000);
  }

  loadCities();

  const qrCodeDisplay = document.getElementById('qr-code-display');
  const qrCodeImg = document.getElementById('qr-code-img');

  ['b', 'w', 'z', 'p'].forEach(id => {
    const icon = document.getElementById(`donate-${id}-icon`);
    if (icon) {
      icon.src = chrome.runtime.getURL(`donate/${id}.png`);
      icon.addEventListener('click', () => {
        qrCodeImg.src = chrome.runtime.getURL(`donate/${id}.png`);
        qrCodeDisplay.style.display = 'flex';
      });
    }
  });

  if (qrCodeDisplay) {
    qrCodeDisplay.addEventListener('click', () => {
      qrCodeDisplay.style.display = 'none';
      qrCodeImg.src = '';
    });
  }
});
