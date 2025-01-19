# CryptoMetrics Application

This is a crypto dashboard application that displays market data for various cryptocurrencies, with features such as global search, column filtering, sorting, currency toggling, and interactive charts.

## Installation and Running Instructions
### 1. Installation
Ensure you have latest Node.js and npm installed on your system (Project is in Angular 19). 

After that follow these steps:

a. Clone the repository: *git clone https://github.com/tkintis/CryptoDashboard*

b. Navigate into the project directory: *cd CryptoDashboard*

c. Install dependencies: *npm install*

### 2. Running the Application
To start the app locally, run: *npm start*

### 3. Running Cypress Tests
a. *npm run cy:open* To open Cypress in Interactive Mode

b. *npm run cy:run* To run Cypress Tests in Headless Mode

## Folder Structure
**CORE:** Contains functionality central to the application, such as interceptors and global error handling.

**SHARED:** Houses reusable utilities, services, enums, and helpers that are shared across the application.

**FEATURES:** Contains feature-specific components, services, models, and routing.

## Folder and File Descriptions

### 1. Core
**Interceptors:**

*global-error-handler.interceptor.ts:* Centralizes error handling for API calls.

### 2. Shared

**Config:**

*currency.config.ts:* Defines configuration for currency symbols and locales.

**Enums:**

*currency.enum.ts:* Enumerates supported currencies like USD and EUR.

**Helpers:**

*filter-predicate.helper.ts:* Provides reusable filtering logic for Angular Material tables.

*format-large-number.helper.ts:* Formats large numbers for display, e.g., market caps and prices.

**Services:**

*logging.service.ts:* Centralized logging for debugging and error reporting.

*navigation.service.ts:* Simplifies navigation across routes and is a common place for common functionality concerning navigation.

*toast.service.ts:* Provides toast notifications for user feedback.

### 3. Features

**Components:**

*dashboard.component.ts:* Displays cryptocurrency market data in a table with features like search, sorting, filtering, and currency toggle. Includes a market capitalization chart for the top 10 cryptocurrencies.

*header.component.ts:* Contains the app's header with a currency toggle dropdown and branding.

**Models:**

*coins.model.ts:* Defines data structures for cryptocurrency information.

**Services:**

*coins.service.ts:* Manages API calls to fetch cryptocurrency data and metadata.

**Routes:**

*coins.routes.ts:* Configures lazy-loaded routing for the coins dashboard.

## Key Features and Decisions

### Framework: 

The application is implemented using Angular 19 to leverage its robust framework and high-performance capabilities.

### UI Library: 

Material Design components are used for the table, paginator, menus, and buttons, ensuring a clean and accessible UI.

### Styling: 

TailwindCSS is integrated for utility-first styling, allowing for rapid and responsive UI development.

### State Management: 

NgRx is used for managing application state, including currency selection and cryptocurrency data.

### Lazy Loading:

Used lazy loading for components, to make sure lazy-loaded files are not included in the initial files, to enhance performance.

### Optimized Images:

Leveraged ngSrc with NgOptimizedImage to ensure efficient image handling and performance.

### Sorting and Filtering:

Implemented column-based filtering and sorting using Angular Material, which interact with the backend for real-time data updates.

### Charting:

ECharts is used for rendering the market capitalization chart, providing rich interactivity and customization.

### Change Detection:

Utilizes ChangeDetectionStrategy.OnPush to improve performance by minimizing unnecessary re-renders.

### Signals:

Used Angular Signals where appropriate, because are fast for best of performance in the DOM.