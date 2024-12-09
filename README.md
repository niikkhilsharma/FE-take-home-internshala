# Frontend Assignment: Dynamic Table with Dropdown Selection

## Overview

This React application displays data in a table format, allowing users to switch dynamically between different data sources using a dropdown menu. The app is designed to provide a polished and user-friendly experience with clean, reusable components and additional features like a search bar for enhanced usability.

---

## Features

### Core Functionality

1. **Dropdown Selection**
   - A dropdown menu allows users to switch between **Posts** and **Comments** data sources.
   - Fetches data dynamically from the selected API endpoint.
   - Automatically updates the table content without reloading the page.

2. **Reusable Table Component**
   - The `TableComponent` handles rendering of data and column configurations.
   - Dynamically adapts based on the selected data source:
     - **Posts**: Displays `ID` and `Title`.
     - **Comments**: Displays `ID` and `Name`.

3. **Pagination**
   - Displays **10 rows per page** with intuitive navigation controls:
     - **Previous**, **Next**, and clickable **Page Numbers**.

4. **Data Export**
   - Includes a "Download" button to export the currently displayed data in CSV format.

### Additional Features

1. **Search Bar**
   - Users can search the table data for any term.
   - The search functionality is dynamic and works for both Posts and Comments, filtering results in real-time.

2. **Loading Spinner**
   - Displays a loading spinner while fetching data from the API to enhance the user experience.

3. **Error Handling**
   - Added graceful error handling to notify users in case of network issues or failed API calls.

4. **Polished UI**
   - Adheres to the provided Figma design for layout and styling.
   - Added subtle visual improvements for better user experience.

---

## Getting Started

1. **Clone and Fork**
   - Fork this repository: [FE-take-home Repo](https://github.com/sarthakb657/FE-take-home).
   - Clone your forked repository to your local machine.

2. **Install Dependencies**
   ```bash
   npm install

3. **Run the Application**

```bash
npm start
```

## Folder Structure
```
src/
├── components/
│   ├── Dropdown.js         # Dropdown menu for switching data sources
│   ├── TableComponent.js   # Reusable table component with dynamic props
│   └── Pagination.js       # Pagination controls
├── utils/
│   ├── api.js              # API call functions
│   ├── download.js         # Utility to export table data as CSV
├── App.js                  # Main application component
└── index.js       
```
