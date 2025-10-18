# 🚀 HNG13 Backend Stage 0 - Task

This is a lightweight Node.js server built using only the native **http** module — no Express required.  
It demonstrates:

-  Basic routing (`/me`)
-  CORS support
-  Rate limiting (per IP)
-  Request logging with status codes and response times
-  Fetching external API data from [catfact.ninja](https://catfact.ninja)

---

## Project Structure

node-http-server/
│
├── server.js # Main server file
├── package.json # Node config & scripts
└── README.md # Project instructions

## ⚙️ Prerequisites

Make sure you have **Node.js v18+** installed.  
> (Node 18 or newer includes native `fetch` support.)

Check your version:
```bash
node -v

# Clone the repository
git clone https://github.com/<your-username>/<repo-name>.git

# Install Dependencies
This project uses only built-in Node modules — so no dependencies required.
Still, run npm init once if you want a package.json (already provided here).

# Enter the folder
cd <repo-name>

## Start the Server
npm start
```