# EVKendra

> A full-stack web application for conducting and managing elections.  This application provides a user-friendly interface for voters and administrators to participate in and oversee the election process.

## 📚 Table of Contents

- [Description](#description)
- [Tech Stack](#tech-stack)
- [Architecture Overview](#architecture-overview)
- [File Structure](#file-structure)
- [Features](#features)
- [Installation](#installation)
  - [Prerequisites](#prerequisites)
  - [Setup](#setup)
- [Usage](#usage)
  - [Execution Options](#execution-options)
- [Contributors](#contributors)
- [License](#license)
- [Credits](#credits)


## Description

EVKendra is a full-stack web application designed to streamline the election process.  It provides a secure and user-friendly platform for voters to cast their ballots and for administrators to manage elections, candidates, and voter registration. The application utilizes a client-side React framework for a dynamic user interface and a Node.js backend with Express.js for handling API requests and database interactions.  The primary use case is to provide a secure and transparent online voting system, offering a unique value proposition of ease of use for both voters and administrators.  Key functions include user authentication, election creation and management, vote casting, and result aggregation.


## Tech Stack

[![Node.js](https://img.shields.io/badge/Node.js-Green?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)
[![Express.js](https://img.shields.io/badge/Express.js-Black?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com/)
[![React](https://img.shields.io/badge/React-Blue?style=for-the-badge&logo=react&logoColor=white)](https://reactjs.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-3ca3cf?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Mongoose](https://img.shields.io/badge/Mongoose-A71D5D?style=for-the-badge&logo=mongoose&logoColor=white)](https://mongoosejs.com/)
[![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)](https://html.spec.whatwg.org/)
[![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)](https://www.w3.org/Style/CSS/)
[![JavaScript](https://img.shields.io/badge/javascript-%23323330.svg?style=for-the-badge&logo=javascript&logoColor=%23F7DF1E)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![✨ Made with ReadME Wiz](https://img.shields.io/badge/✨%20Made%20with-ReadME%20Wiz-blueviolet?style=for-the-badge&logo=markdown&logoColor=white)](https://github.com/PIYUSH1SAINI/ReadMe-wiz.git)


## Architecture Overview

```mermaid
graph TD
    subgraph Frontend
        A[App.jsx] --> B(HomePage.jsx);
        A --> C(AdminDashboardPage.jsx);
        A --> D(VoterDashboardPage.jsx);
    end
    subgraph Backend
        E[server.js] --> F(Routes);
        F --> G(Controllers);
        G --> H(Models);
        H --> I(Database);
    end
    A --> E;
```

## File Structure

```mermaid
graph TD
    A[server.js] --> B(routes);
    A --> C(controllers);
    A --> D(models);
    A --> E(database);
    B --> F["admin.route.js"];
    B --> G["election.route.js"];
    B --> H["voter.route.js"];
    C --> I["admin.controller.js"];
    C --> J["election.controller.js"];
    C --> K["voter.controller.js"];
    C --> L["candidate.controller.js"];
    D --> M["admin.model.js"];
    D --> N["election.model.js"];
    D --> O["voter.model.js"];
    A --> P["client"];
    P --> Q["index.html"];
    P --> R["src"];
    R --> S["App.jsx"];

```

## Features

- Secure user authentication and authorization for voters and administrators.
- Creation and management of elections with customizable parameters.
- User-friendly interface for voters to cast their ballots securely.
- Real-time vote aggregation and result display for administrators.
- Robust backend infrastructure for data management using MongoDB.


## Installation

### Prerequisites

> [!NOTE]
> Node.js >=14 and npm are required for backend and frontend setup.  Ensure you have a MongoDB instance running locally.

### Setup

1. **Clone Repository:** Clone the repository from GitHub and navigate to the project directory.
   ```bash
   git clone https://github.com/raghavG0212/EVKendra.git
   cd EVKendra
   ```

2. **Install Dependencies:** Install the necessary Node.js packages for both the client and server.
   ```bash
   npm install
   npm install --prefix client
   ```


## Usage

### Execution Options

#### Backend Execution

Start the backend server using the following command:

```bash
npm run start
```

> [!IMPORTANT]
> Ensure you have set up the necessary environment variables (database connection string, API keys, etc.) before running the server.


#### Frontend Execution

Start the frontend development server:

```bash
npm run happy_voting
```

This command runs both the frontend and backend concurrently.  Navigate to `http://localhost:5173` in your browser to access the application.



## Contributors

<a href="https://github.com/raghavG0212" target="_blank"><img src="https://avatars.githubusercontent.com/raghavG0212?s=60&v=4" width="60" height="60" alt="@raghavG0212" title="@raghavG0212" style="border-radius: 50%; margin-right: 10px;" onerror="this.src='https://github.com/identicons/raghavG0212.png'" /></a>


## License

ISC License


## Credits

raghav

Node.js, Express.js, React, Mongoose, MongoDB, HTML5, CSS3, JavaScript


<a href="https://github.com/PIYUSH1SAINI/ReadMe-wiz.git" target="_blank">
      <img src="https://res.cloudinary.com/dy1znaiby/image/upload/v1754320207/ReadMe-wiz-logo_k3uq6w.png" alt="ReadMe Wiz Logo" width="300"/>
    </a>
