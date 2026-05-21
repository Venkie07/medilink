# MediLink Project Structure & Architecture Breakdown

The MediLink application is a full-stack project divided into two main parts: the **Backend** (Node.js/Express) and the **Frontend** (React.js). Here is a detailed breakdown of what each folder and file is responsible for.

---

## 🏗️ Backend Structure (`/backend`)
The backend is responsible for handling data, authenticating users, and providing an API for the frontend to communicate with.

### Folders
* **`models/`**: This folder contains the database models or schemas. These files define the structure of your data (e.g., what fields a `Patient`, `User`, or `LabTest` has) and how it is stored in the database. When the backend needs to read or write data, it uses these models.
* **`controllers/`**: This folder contains the core business logic. When a request comes in from the frontend (like "get all patients"), the corresponding controller function handles it. **Controllers ask the *Models* for data and then send that data back to the user.**
* **`routes/`**: This folder maps URL endpoints (like `/api/patients`) to specific functions in your **controllers**. It acts like a traffic cop, directing incoming API requests to the right place.
* **`middleware/`**: Contains intermediate functions that run *before* the request reaches the controller. Common middleware includes checking if a user is logged in (Authentication), handling file uploads, or logging requests.
* **`config/`**: Holds configuration files, such as database connection settings or environment variable setups.
* **`utils/`**: Contains utility or helper functions that might be reused across different parts of the backend (e.g., password hashing functions, date formatters).
* **`uploads/`**: A directory used to store physical files uploaded by users, such as PDF lab reports or profile pictures.

### Key Files
* **`server.js`**: The main entry point of the backend. It initializes the Express server, connects to the database, registers the routes, and starts listening for incoming requests.
* **`medilink.sqlite`**: The actual database file where all your live data is stored. SQLite stores the entire database in this single local file.
* **`seed.js`**: A script used to populate the database with initial, default, or fake data so you have something to work with during development.

---

## 🎨 Frontend Structure (`/frontend`)
The frontend is the user interface built with React. It handles what the user sees, how they interact with the app, and communicates with the backend to fetch or save data.

### Folders inside `/src`
* **`components/`** (e.g., `Modal.jsx`, `StatsCard.jsx`): This folder contains highly reusable, self-contained UI building blocks. A component like `Modal.jsx` is just the visual shell of a popup window, designed to be used by any page that needs a popup, rather than duplicating the popup code everywhere.
* **`pages/`**: Contains the main "Screens" or "Views" of your application. Files here usually correspond to specific routes in your app (like `LabDashboard.jsx`, `PatientDashboard.jsx`, or a Login page). Pages often assemble multiple **components** together to build a complete screen.
* **`services/`**: Contains files that handle external communications, specifically calling your Backend API. Instead of writing `fetch` or `axios` calls directly inside your pages, you put them here to keep your code clean and organized.
* **`context/`**: Uses React's Context API to manage "Global State"—data that many different components need access to at the same time, such as the currently logged-in user's information or the UI theme.
* **`layouts/`**: Contains structural wrapper components. For example, a dashboard layout component might include the Sidebar and Navbar, and then "wrap" around whichever specific page is currently being viewed.

### Key Files
* **`main.jsx`**: The main entry point for the React application. It grabs the root HTML element and physically injects the React application into the browser.
* **`App.jsx`**: The root component of your application. This is typically where you define your routing (using react-router), dictating which *Page* component should show up for which URL.
* **`index.css`**: The main global stylesheet, often used to import Tailwind CSS framework directives or define base styles used application-wide.

---

### 💡 Summary Example: `models/LabTest.js` vs `Modal.jsx`
- **Backend `models/`**: Pertains strictly to **Data Structure** and **Database**. A file here dictates exactly how a Lab Test is stored in SQLite (e.g., it must have a `name` (string) and a `patientId` (integer)).
- **Frontend `components/Modal.jsx`**: Pertains strictly to **Visual UI**. It dictates how a popup box looks on the screen (its background color, animations, padding). It has zero knowledge of the database or what data it's displaying; it just blindly shows whatever content a Page tells it to show.
