# Smart Campus Operations Hub

A comprehensive campus management system designed to streamline facilities, bookings, maintenance, and notifications across a smart campus environment.

**Project**: PAF IT3030 Group Project (Group 62)

---

## 📋 Table of Contents
- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Installation & Setup](#installation--setup)
- [Running the Application](#running-the-application)
- [Environment Variables](#environment-variables)
- [API Documentation](#api-documentation)
- [Team](#team)

---

## 🎯 Overview

Smart Campus Operations Hub is a full-stack web application that provides an integrated platform for managing campus resources, facilities, and operations. The system enables efficient management of assets, facility bookings, maintenance requests, and real-time notifications across campus facilities.

---

## ✨ Features

- **Facilities & Assets Management**: Track and manage campus facilities and equipment
- **Booking System**: Reserve campus facilities with an intuitive booking interface
- **Maintenance & Incident Ticketing**: Report and track maintenance issues and incidents
- **Real-time Notifications**: Get instant updates on bookings, maintenance requests, and system alerts
- **OAuth 2.0 Authentication**: Secure user authentication and authorization
- **Responsive Design**: Full mobile and desktop support with Tailwind CSS

---

## 🛠 Tech Stack

### Frontend
- **Framework**: React 19 with Vite
- **Styling**: Tailwind CSS
- **HTTP Client**: Axios
- **Routing**: React Router DOM
- **UI Components**: React Icons
- **Notifications**: React Hot Toast
- **Build Tool**: Vite
- **Linting**: ESLint

### Backend
- **Framework**: Spring Boot 4.0.5
- **Language**: Java 21
- **Security**: Spring Security with OAuth 2.0
- **Data Access**: Spring Data JPA
- **Database**: PostgreSQL / Neon
- **Migrations**: Flyway
- **Build Tool**: Maven
- **Utilities**: Lombok

### Database
- PostgreSQL
- Neon (Cloud-hosted PostgreSQL option)

---

## 📁 Project Structure

```
.
├── frontend/                  # React + Vite frontend application
│   ├── src/                  # Source code
│   ├── package.json          # Frontend dependencies
│   └── vite.config.js        # Vite configuration
│
├── backend/                  # Spring Boot backend application
│   ├── src/                  # Java source code
│   ├── pom.xml              # Maven dependencies
│   └── application.properties # Backend configuration
│
└── README.md                 # This file
```

---

## 📦 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v16 or higher) - for frontend
- **Java 21** - for backend
- **Maven** (v3.6+) - for building backend
- **PostgreSQL** (v12+) or Neon account
- **Git** - for version control

---

## 🚀 Installation & Setup

### 1. Clone the Repository

```bash
git clone https://github.com/Udeep10-dev/IT3030-paf-2026-smart-campus-group62.git
cd IT3030-paf-2026-smart-campus-group62
```

### 2. Frontend Setup

Navigate to the frontend directory and install dependencies:

```bash
cd frontend
npm install
```

### 3. Backend Setup

Navigate to the backend directory and build:

```bash
cd ../backend
mvn clean install
```

---

## 🏃 Running the Application

### Frontend Development

From the `frontend` directory:

```bash
npm run dev
```

The application will be available at `http://localhost:5173`

### Frontend Production Build

```bash
npm run build
npm run preview
```

### Backend Development

From the `backend` directory:

```bash
mvn spring-boot:run
```

The backend API will be available at `http://localhost:8080`

### Linting

Check code quality in frontend:

```bash
npm run lint
```

---

## 🔧 Environment Variables

### Frontend

Create a `.env` file in the `frontend` directory:

```env
VITE_API_URL=http://localhost:8080
```

### Backend

Create an `application.properties` file in `backend/src/main/resources/`:

```properties
spring.datasource.url=jdbc:postgresql://localhost:5432/smart_campus
spring.datasource.username=postgres
spring.datasource.password=your_password

# OAuth 2.0 Configuration
spring.security.oauth2.client.registration.google.client-id=your_client_id
spring.security.oauth2.client.registration.google.client-secret=your_client_secret

spring.jpa.hibernate.ddl-auto=validate
spring.jpa.database-platform=org.hibernate.dialect.PostgreSQLDialect
```

---

## 📚 API Documentation

The backend provides REST API endpoints for:

- **Facilities Management** - CRUD operations for campus facilities
- **Bookings** - Create, retrieve, update, and cancel bookings
- **Maintenance Tickets** - Report and manage maintenance issues
- **Notifications** - Fetch user notifications

Full API documentation available at `http://localhost:8080/swagger-ui.html` (once Springdoc is configured)

---

## 👥 Team

**Group 62** - PAF IT3030 Project

Members:
https://github.com/vishanisomarathna-sys
https://github.com/Tenu234
https://github.com/Udeep10-dev
https://github.com/rashmigimhani

---

## 📝 License

This project is created for educational purposes as part of PAF IT3030 course at SLIIT.

---

## 🤝 Contributing

1. Create a feature branch (`git checkout -b feature/amazing-feature`)
2. Commit your changes (`git commit -m 'Add amazing feature'`)
3. Push to the branch (`git push origin feature/amazing-feature`)
4. Open a Pull Request

---

## 📞 Support

For issues or questions, please open a GitHub issue in this repository.
