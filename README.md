<p align="center">
  <img src="./logo.png" alt="Journally Logo" width="160px" style="border-radius: 24px; box-shadow: 0 8px 16px rgba(0,0,0,0.3);" />
</p>

# <p align="center">Journally</p>

<p align="center">
  <img src="./banner.png" alt="Journally Banner" width="100%" style="border-radius: 12px; box-shadow: 0 10px 30px rgba(0,0,0,0.5);" />
</p>

<p align="center">
  <a href="#tech-stack">
    <img src="https://img.shields.io/badge/React-19.0.0-61DAFB?style=for-the-badge&logo=react&logoColor=black" alt="React 19" />
  </a>
  <a href="#tech-stack">
    <img src="https://img.shields.io/badge/Node.js-v20-339933?style=for-the-badge&logo=nodedotjs&logoColor=white" alt="Node.js" />
  </a>
  <a href="#tech-stack">
    <img src="https://img.shields.io/badge/PostgreSQL-v15-4169E1?style=for-the-badge&logo=postgresql&logoColor=white" alt="PostgreSQL" />
  </a>
  <a href="#usage">
    <img src="https://img.shields.io/badge/SonarQube-Quality_Gate-4E9BCD?style=for-the-badge&logo=sonarqube&logoColor=white" alt="SonarQube" />
  </a>
  <a href="#license">
    <img src="https://img.shields.io/badge/License-ISC-8A2BE2?style=for-the-badge" alt="ISC License" />
  </a>
</p>

<p align="center">
  <strong>🚀 A modern, secure, and feature-rich note-taking web application designed to help users capture, organize, and manage their thoughts seamlessly with rich-text formatting, voice dictation, and robust categorization.</strong>
</p>

---

## Features
- **Interactive Rich-Text Editor**: Draft beautifully styled notes with images, headings, lists, and formatted code snippets using an advanced editor.
- **Voice Dictation (Speech-to-Text)**: Go hands-free! Dictate notes instantly using integrated browser-native speech recognition.
- **Dynamic Organization**: Group notes into custom **Notebooks** and categorize them with searchable **Tags**.
- **Smart Note States**: Keep vital information pinned to the top of your dashboard, and clean up your workspace by archiving notes instead of deleting them.
- **Premium User Personalization**: Fully customizable user profiles supporting custom fields (Name, Gender, Age, and Occupation) and smooth dark/light theme switching.
-  **Note Export & Download**: Easily download notes for offline access, personal backups, or external sharing.
- **Dual Authentication Methods**: Register and login securely using custom Email-Password credentials (secured via bcrypt password hashing & JWT tokens) or authenticate seamlessly using Google OAuth 2.0 Single Sign-On (SSO).
- **SonarQube Quality Assurance**: Complete development setup integrated with automated coverage reporting and SonarQube static code analysis to maintain flawless quality gates.

## Tech Stack
- **Frontend**: React 19, React Router (v7), Framer Motion (for fluid micro-animations), Lucide React (for premium icons), Axios, React Quill (react-quill-new).
- **Backend**: Node.js, Express.js (v5), PostgreSQL (`pg` pool) for relational database storage, Joi (for API validation), Pino & Pino HTTP (for structured, high-speed logging).
- **Testing**: Jest, React Testing Library, Supertest.
- **Environment & Dev-ops**: Docker, Docker Compose (for running PostgreSQL and SonarQube locally), SonarQube Scanner.

## Installation

### Prerequisites
- **Node.js** (v18 or higher recommended)
- **npm** (v9 or higher)
- **PostgreSQL** database server (running locally or via Docker)

### Step-by-Step Setup

1. **Clone the repository:**
   ```bash
   git clone <your-repo-url>
   cd sara-mern-10pshine
   ```

2. **Backend Setup:**
   - Navigate to the `backend` directory:
     ```bash
     cd backend
     ```
   - Install dependencies:
     ```bash
     npm install
     ```
   - Configure your environment variables by creating a `.env` file (see the [Environment Variables](#environment-variables) section below).
   - Initialize the database using the schema file `src/config/db.sql`:
     ```bash
     psql -U your_user -d your_database -f src/config/db.sql
     ```

3. **Frontend Setup:**
   - Navigate to the `frontend` directory:
     ```bash
     cd ../frontend
     ```
   - Install dependencies:
     ```bash
     npm install
     ```
   - Configure your frontend environment variables by creating a `.env` file (see the [Environment Variables](#environment-variables) section below).

---

## Usage

### Running Locally

1. **Start the Backend server:**
   Navigate to the `backend` directory and run:
   ```bash
   npm run dev
   ```
   The backend server runs on `http://localhost:3001` (by default).

2. **Start the Frontend development server:**
   Navigate to the `frontend` directory and run:
   ```bash
   npm start
   ```
   The frontend application will boot and open automatically on `http://localhost:3000`.

### Running Tests
To run unit and integration tests with coverage:

- **Backend:**
  ```bash
  cd backend
  npm test
  ```
- **Frontend:**
  ```bash
  cd frontend
  npm test
  ```

### Static Analysis (SonarQube)
To launch SonarQube analysis:
1. Start the SonarQube and database containers via Docker:
   ```bash
   cd sonarqube
   docker-compose up -d
   ```
2. Once the SonarQube portal is active on `http://localhost:9000`, run the scan from the backend or root:
   ```bash
   cd backend
   npm run sonar
   ```

---

## API Reference 

### Authentication Endpoint (`/api/auth`)
| Method | Endpoint | Description | Auth Required |
| --- | --- | --- | --- |
| `POST` | `/api/auth/register` | Register a new user | No |
| `POST` | `/api/auth/login` | Login user & return JWT token | No |
| `POST` | `/api/auth/google` | Authenticate / register via Google OAuth | No |
| `GET` | `/api/auth/me` | Retrieve currently authenticated user profile | Yes |
| `PUT` | `/api/auth/me` | Update authenticated user profile | Yes |
| `DELETE` | `/api/auth/me` | Delete authenticated user account | Yes |

### Notes Endpoint (`/api/notes`)
| Method | Endpoint | Description | Auth Required |
| --- | --- | --- | --- |
| `GET` | `/api/notes` | Get all notes for the authenticated user | Yes |
| `GET` | `/api/notes/:id` | Get details of a specific note | Yes |
| `POST` | `/api/notes` | Create a new note | Yes |
| `PUT` | `/api/notes/:id` | Update an existing note | Yes |
| `DELETE` | `/api/notes/:id` | Delete a specific note | Yes |
| `PATCH` | `/api/notes/:id/favorite` | Toggle favorite/pin state of a note | Yes |
| `PATCH` | `/api/notes/:id/archive` | Toggle archived state of a note | Yes |

### Notebooks Endpoint (`/api/notebooks`)
| Method | Endpoint | Description | Auth Required |
| --- | --- | --- | --- |
| `GET` | `/api/notebooks` | Get all notebooks for the user | Yes |
| `GET` | `/api/notebooks/:id` | Get details of a specific notebook | Yes |
| `POST` | `/api/notebooks` | Create a new notebook | Yes |
| `PUT` | `/api/notebooks/:id` | Update an existing notebook's name | Yes |
| `DELETE` | `/api/notebooks/:id` | Delete a specific notebook | Yes |

---

## Folder Structure 

```text
sara-mern-10pshine/
├── backend/
│   ├── src/
│   │   ├── config/          # Database, Logger configurations & db.sql schema
│   │   ├── controllers/     # Controller implementations
│   │   ├── middleware/      # JWT validation, express logger, error handlers
│   │   ├── models/          # Data schemas
│   │   ├── modules/         # Modular application layers (auth, notes, notebooks)
│   │   ├── routes/          # Unified routing index
│   │   ├── services/        # Business logic services
│   │   └── utils/           # Helper scripts (asyncHandler, etc.)
│   ├── tests/               # Integrated Jest & Supertest suites
│   ├── server.js            # Node/Express server entry point
│   └── package.json
├── frontend/
│   ├── public/              # Index HTML, logos, and manifest
│   ├── src/
│   │   ├── components/      # Shared layout and UI components
│   │   ├── context/         # Auth and Theme context providers
│   │   ├── pages/           # Pages (Dashboard, Editor, Profile, Settings, etc.)
│   │   ├── services/        # Axios API clients
│   │   └── styles/          # Modular global layouts and theme definitions
│   └── package.json
├── sonarqube/
│   └── docker-compose.yml   # Local SonarQube + Postgres container stack
├── sonar-project.properties # Global SonarQube Scanner configs
└── README.md
```

---

## Environment Variables

### Backend Configuration (`backend/.env`)
Create a file named `.env` in the `backend` folder and populate it with the following:
```env
PORT=3001
DB_HOST=localhost
DB_USER=your_postgres_user
DB_PASSWORD=your_postgres_password
DB_NAME=notes_app
JWT_SECRET=your_jwt_signing_secret
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
```

### Frontend Configuration (`frontend/.env`)
Create a file named `.env` in the `frontend` folder and populate it with the following:
```env
REACT_APP_API_URL=http://localhost:3001/api
REACT_APP_GOOGLE_CLIENT_ID=your_google_client_id
```

---

## Contributing
Contributions are always welcome! Please follow these simple guidelines:
1. **Fork** the repository.
2. Create a new branch: `git checkout -b feature/your-awesome-feature`.
3. Commit your changes: `git commit -m 'Add some feature'`.
4. Push to the branch: `git push origin feature/your-awesome-feature`.
5. Open a **Pull Request** explaining your changes.

---

## License
Distributed under the **ISC License**. See the `backend/package.json` for details.

---

## Author
**Sara**
- GitHub: [@SaraCh28](https://github.com/SaraCh28)
- Internship: **10P Shine**
