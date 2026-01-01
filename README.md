# LOKAH Website

A Dark Neo-Noir Minimal Website.

## How to Run

1.  **Open Terminal**: Open a terminal in this directory.
2.  **Install Dependencies**: Run the following command to install the necessary packages:
    ```bash
    npm install
    ```
3.  **Start the Server**: Run the following command to start the application:
    ```bash
    npm start
    ```
4.  **Open in Browser**: Open your web browser and navigate to:
    [http://localhost:3000](http://localhost:3000)

## Database

By default, the application runs in **Mock Mode** if no database configuration is found.
To use a real MySQL database, create a `.env` file with the following variables:
- `DB_HOST`
- `DB_USER`
- `DB_PASSWORD`
- `DB_NAME`
aws-two-tier-architecture/
│
├── lokah/
│   ├── public/
│   ├── .gitignore
│   ├── db.js
│   ├── package.json
│   ├── package-lock.json
│   └── server.js
│
├── README.md
├── REPORT.pdf
└── VIDEO.mov
