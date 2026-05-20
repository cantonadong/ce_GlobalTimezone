let currentIanaTimezone = null;

function updateBadge() {
  try {
    const now = new Date();
    let timeStr;
    if (currentIanaTimezone) {
      try {
        const formatter = new Intl.DateTimeFormat('en-US', {
          hour: '2-digit', minute: '2-digit', hour12: false, timeZone: currentIanaTimezone
        });
        const [hours, minutes] = formatter.format(now).split(':');
        timeStr = `${hours.padStart(2, '0')}:${minutes.padStart(2, '0')}`;
        chrome.action.setBadgeBackgroundColor({ color: '#02A7F0' });
        if (chrome.action.setBadgeTextColor) {
          chrome.action.setBadgeTextColor({ color: '#ffffff' });
        }
      } catch (e) {
        timeStr = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
      }
    } else {
      timeStr = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
    }
    chrome.action.setBadgeText({ text: timeStr });
  } catch (error) {
    console.error('Badge update error:', error);
  }
}

function createAlarm() {
  const now = new Date();
  const nextMinute = new Date(now);
  nextMinute.setMinutes(now.getMinutes() + 1);
  nextMinute.setSeconds(0);
  nextMinute.setMilliseconds(0);
  chrome.alarms.create('updateTime', { when: nextMinute.getTime(), periodInMinutes: 1 });
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  try {
    if (message.type === 'updateBadgeByIANA') {
      currentIanaTimezone = message.timezone;
      updateBadge();
      sendResponse({ success: true, timezone: message.timezone });
    }
  } catch (error) {
    sendResponse({ success: false, error: error.message });
  }
  return true;
});

chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === 'updateTime') updateBadge();
});

chrome.storage.sync.get(['cities', 'activeTimezone'], (result) => {
  const activeTimezone = result.activeTimezone;
  if (activeTimezone) {
    currentIanaTimezone = activeTimezone;
  } else {
    const activeCity = (result.cities || []).find(city => city.active);
    if (activeCity) currentIanaTimezone = activeCity.timezone || null;
  }
  updateBadge();
  createAlarm();
});

chrome.storage.onChanged.addListener((changes, area) => {
  if (area === 'sync' && changes.activeTimezone?.newValue) {
    currentIanaTimezone = changes.activeTimezone.newValue;
    updateBadge();
  }
});
