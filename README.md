# 🌍 Multi City Timezone Clock - Chrome Extension

Release on the Chrome Extension Store

https://chromewebstore.google.com/detail/multi-city-timezone-clock/gcnacfafikohghakddbifpkkaiooaafh

A powerful Chrome extension that displays multiple city timezones simultaneously, allowing users to track time across different global locations with a clean, intuitive interface.

## 🆕 What's New

### v1.2
- **Expanded City Database**: Added Miami, Islamabad, Kolkata, Chennai, Kuwait City, Sao Paulo, Guam, Chatham Islands, Kiritimati, Baker Island, and Noronha — city database now covers 1648+ cities
- **Code Cleanup**: Removed dead code and duplicate logic across all files for a leaner, more maintainable codebase

### v1.1
- Initial release with multi-city timezone support

## 🎨 Snapshots
<img width="426" height="266" alt="image" src="https://github.com/user-attachments/assets/104c33e3-41fd-41cf-a888-45abda6dc303" />


## 🚀 Features

- **Multi-City Time Display**: Add up to 5 cities and view their current times simultaneously
- **Real-time Updates**: Time updates every minute with accurate timezone calculations
- **Smart City Search**: Intelligent search with autocomplete for 1648+ global cities
- **Active City Highlighting**: One city can be set as active and displayed in the browser badge
- **IANA Timezone Support**: Uses proper IANA timezone identifiers for accurate time calculations
- **Persistent Storage**: Cities and preferences are saved across browser sessions
- **Responsive Design**: Clean, modern UI that adapts to different screen sizes
- **Dark/Light Mode Icons**: Visual indicators for day/night time periods

## 🏗️ Technical Architecture

### Core Components

#### 1. **Manifest V3 Configuration** (`manifest.json`)
- Modern Chrome Extension Manifest V3 specification
- Service worker background script
- Popup interface with custom icons
- Storage and alarms permissions
- Web accessible resources for city data

#### 2. **Background Service Worker** (`background.js`)
- **Badge Management**: Updates extension badge with current time from active city
- **Alarm System**: Creates minute-based alarms for real-time updates
- **Message Handling**: Processes communication between popup and background
- **Storage Synchronization**: Manages city data and active timezone persistence
- **IANA Timezone Conversion**: Handles timezone format conversions for accuracy

#### 3. **Popup Interface** (`popup.html` + `popup.js`)
- **Dynamic City List**: Renders saved cities with real-time time display
- **City Management**: Add, remove, and toggle city activation
- **Search Interface**: Modal-based city search with autocomplete
- **Time Formatting**: Uses `Intl.DateTimeFormat` for locale-aware time display
- **Storage Integration**: Chrome Storage API for data persistence

#### 4. **City Database** (`city.csv`)
- Comprehensive database of 1648+ global cities
- UTC offset mapping for each city
- Structured CSV format for easy parsing
- Covers all major timezones worldwide

### Key Technical Features

#### Timezone Handling
```javascript
// IANA timezone mapping for accurate calculations
const utcToIanaMap = {
  'UTC-08:00': 'America/Los_Angeles',
  'UTC+08:00': 'Asia/Shanghai',
  'UTC+09:00': 'Asia/Tokyo',
  // ... comprehensive mapping
};
```

#### Real-time Updates
```javascript
// Background alarm system for minute-based updates
chrome.alarms.create('updateTime', {
  when: nextMinute.getTime(),
  periodInMinutes: 1
});
```

#### Storage Management
```javascript
// Chrome Storage API for cross-session persistence
await chrome.storage.sync.set({ cities, activeTimezone });
```

## 🛠️ Development Stack

- **Frontend**: HTML5, CSS3, Vanilla JavaScript (ES6+)
- **Chrome APIs**: Manifest V3, Storage API, Alarms API, Runtime API
- **Data Format**: CSV for city database
- **Timezone**: IANA timezone database integration
- **Build Tool**: No build process required (pure web technologies)

## 📁 Project Structure

```
ce_GlobalTimezone/
├── manifest.json          # Extension configuration
├── background.js          # Service worker for background tasks
├── popup.html            # Main extension popup interface
├── popup.js              # Popup logic and city management
├── city.csv              # Database of 1648+ global cities
├── privacy.html          # Privacy policy page
├── icon/                 # Extension icons (16, 32, 48, 128px)
├── button/               # UI button icons
├── donate/               # Donation-related assets
└── submit/               # Chrome Web Store submission assets
```

## 🎯 Key Features Implementation

### 1. **Smart City Search**
- Real-time filtering of 1648+ cities
- Search by city name or UTC offset
- Modal-based interface with keyboard navigation

### 2. **Time Display System**
- Uses `Intl.DateTimeFormat` for accurate timezone calculations
- Fallback mechanisms for unsupported timezones
- Visual day/night indicators

### 3. **Badge Integration**
- Extension badge shows current time from active city
- Updates every minute via background alarms
- Color-coded for visibility

### 4. **Data Persistence**
- Chrome Storage Sync API for cross-device synchronization
- Automatic state restoration on extension load
- Efficient data structure for city management

## 🔧 Installation & Usage

### For Development
1. Clone the repository
2. Open Chrome and navigate to `chrome://extensions/`
3. Enable "Developer mode"
4. Click "Load unpacked" and select the project directory
5. The extension will appear in your browser toolbar

### For Users
1. Install from Chrome Web Store (when published)
2. Click the extension icon to open the popup
3. Click "Add City" to search and add cities
4. Toggle city activation to set the active timezone
5. View real-time updates in the extension badge

## 🎨 UI/UX Design

- **Modern Interface**: Clean, minimalist design with smooth animations
- **Responsive Layout**: Adapts to different popup sizes
- **Visual Feedback**: Hover effects, transitions, and toast notifications
- **Accessibility**: Keyboard navigation and screen reader support
- **Internationalization**: Support for multiple languages and locales

## 🔒 Privacy & Security

- **No Data Collection**: All data stored locally using Chrome Storage
- **No External Requests**: City database included locally
- **Minimal Permissions**: Only requires storage and alarms permissions
- **Privacy Policy**: Included privacy.html for transparency

## 🚀 Performance Optimizations

- **Efficient Updates**: Minute-based alarms instead of continuous polling
- **Lazy Loading**: City database loaded only when needed
- **Memory Management**: Proper cleanup of event listeners
- **Storage Optimization**: Efficient data structures for city storage

## 🤝 Contributing

This project was completed using **Cursor**, the world's best AI-powered IDE. Cursor's advanced code completion, intelligent refactoring, and AI assistance were instrumental in:

- **Rapid Development**: AI-powered code generation and suggestions
- **Bug Detection**: Intelligent error detection and fixing suggestions
- **Code Optimization**: Automated code improvements and best practices
- **Documentation**: AI-assisted README and code documentation
- **Testing**: Automated test case generation and validation

## 📄 License

This project is open source and available under the MIT License.

## 🙏 Acknowledgments

- **Cursor AI**: For providing an exceptional development experience with AI-powered coding assistance
- **Chrome Extensions Team**: For the comprehensive Manifest V3 documentation
- **IANA Timezone Database**: For accurate timezone information
- **Global City Database**: For comprehensive city and timezone mappings

---

**Built with ❤️ using Cursor - The AI-powered IDE that makes coding faster and more efficient.** 
