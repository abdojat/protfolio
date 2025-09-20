# Portfolio — React Client

Professional, production-ready frontend for a personal portfolio site built with React, TypeScript and Tailwind CSS. This repository contains the client application that displays hero, about, projects and contact sections and includes a protected Super Admin dashboard for managing portfolio content.

Table of contents

- About
- Features
- Tech stack
- Getting started
	- Prerequisites
	- Install
	- Environment variables
	- Run (development)
	- Build (production)
- Project structure
- API / Backend contract
- Super Admin (admin dashboard)
- Deployment notes
- Contributing
- License

About

This client app is intended to be paired with a backend API (not included here). It loads portfolio content (hero, about, projects, contact, footer) from the API and renders a responsive, accessible single-page portfolio. It also includes an authenticated Super Admin area for managing portfolio data (reads/writes rely on server endpoints).

Features

- Responsive landing page with Hero, About, Projects and Contact sections
- Dynamic content fetched from an API (portfolio JSON)
- Protected Super Admin dashboard (role-based access) for admin management and CRUD of portfolio entities
- Contact form submission via API
- Tailwind CSS design system with reusable UI components

Tech stack

- React 19 + TypeScript
- Create React App (react-scripts)
- Tailwind CSS
- Axios for HTTP requests
- React Router (client-side routing)

Getting started

Prerequisites

- Node.js (LTS recommended)
- npm (comes with Node) or an alternative package manager

Install

1. Clone the repository and change into the client folder
2. Install dependencies:

		npm install

Environment variables

Create a .env file in the project root (client/) to configure runtime values used by the app. The app reads values via process.env, the important variables are:

- REACT_APP_API_URL — base API URL used by the client (e.g. http://localhost:5000/api)
- REACT_APP_TITLE — site title (optional)
- REACT_APP_DESCRIPTION — site description (optional)
- REACT_APP_GA_TRACKING_ID — Google Analytics ID (optional)
- REACT_APP_CONTACT_EMAIL — contact email shown in the footer (optional)

Example .env

		REACT_APP_API_URL=http://localhost:5000/api
		REACT_APP_TITLE=My Portfolio

Run (development)

Start the dev server (hot reloads enabled):

		npm start

Open http://localhost:3000 in your browser.

Build (production)

Create an optimized production build into the build/ folder:

		npm run build

The resulting static assets are ready to be served from any static hosting service (GitHub Pages, Netlify, Vercel, a static file server, etc.).

Project structure (important files)

- src/
	- components/ — UI sections (Hero, About, Projects, Footer, SuperAdmin, etc.)
	- components/ui — small reusable primitives (button, input, card, etc.)
	- contexts/AuthContext.tsx — authentication provider used by protected routes
	- config/index.ts — runtime configuration wrapper (reads process.env)
	- services/api.ts — axios instance + API helper functions and TypeScript interfaces
	- hooks/ — custom hooks (toast, etc.)

Key config files

- package.json — scripts and dependencies
- tailwind.config.js — Tailwind configuration
- tsconfig.json — TypeScript configuration

API / Backend contract

This client expects a JSON API exposing portfolio data and authentication endpoints. Important endpoints used by the client include:

- GET /portfolio — returns site content (hero, about, projects, contact, footer)
- POST /contact — submit contact form
- POST /auth/login — admin login (returns token and admin data)
- GET /auth/me — get current authenticated admin
- GET /auth/admins — list admin users (super-admin only)
- POST /auth/admins — create admin user (super-admin only)

See src/services/api.ts and src/config/index.ts for request baseURL and axios configuration.

Super Admin (admin dashboard)

There is a built-in Super Admin dashboard (protected) implemented under the components directory. Notes:

- The Super Admin UI assumes server-side JWT authentication and role-based authorization. The UI stores a token in localStorage (the key used is `token`).
- To enable the super admin features during development, ensure the backend provides the authentication endpoints listed above and seed a user with the `super-admin` role.
- More implementation and troubleshooting notes are available in SUPERADMIN_README.md (included in this repo).

Deployment notes

- The app compiles into the build/ folder when you run `npm run build`. Deploy the contents of that folder to your chosen static hosting provider.
- If your API is hosted on a different domain, ensure the backend enables CORS for your client origin.

Production checklist before pushing to GitHub

- Add a LICENSE file (recommended: MIT) if you want an open-source license.
- Add a meaningful homepage URL in package.json if you plan to use GitHub Pages.
- Remove any hard-coded secrets — use environment variables for API URLs and keys.

Contributing

Contributions are welcome. A simple recommended workflow:

1. Fork the repository
2. Create a feature branch
3. Make changes and add tests where appropriate
4. Open a pull request describing your changes

For help with backend integration or CI/CD, please open an issue in this repository so the community can assist.

License

This project does not include a LICENSE file by default.