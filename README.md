# 💸 ExpenseIQ - Smart Expense Tracker

A full-stack expense management application built with **Spring Boot**, **React**, **PostgreSQL**, and **JWT Authentication**.

---

## 🚀 Features

- 🔐 User Registration & Login with JWT Authentication
- 💰 Add, View, and Delete Expenses
- 📊 Visual Charts for Expense Analysis
- 🏷️ Category-wise Expense Tracking
- 💡 Budget Alerts & Notifications
- 📥 Export Expenses to CSV & PDF
- 🔒 Secure REST APIs with Spring Security

---

## 🛠️ Tech Stack

### Backend
| Technology | Purpose |
|---|---|
| Java 17 | Programming Language |
| Spring Boot 3.2 | Backend Framework |
| Spring Security | Authentication & Authorization |
| JWT | Token-based Auth |
| Spring Data JPA | Database ORM |
| PostgreSQL | Relational Database |
| Maven | Build Tool |

### Frontend
| Technology | Purpose |
|---|---|
| React 18 | UI Framework |
| Vite | Build Tool |
| Axios | HTTP Client |
| Recharts | Data Visualization |

---

## 📁 Project Structure

```
expenseiq/
├── backend/                  # Spring Boot Application
│   ├── src/main/java/com/expenseiq/
│   │   ├── config/           # Security & CORS Config
│   │   ├── controller/       # REST API Controllers
│   │   ├── dto/              # Data Transfer Objects
│   │   ├── entity/           # JPA Entities
│   │   ├── repository/       # Spring Data Repositories
│   │   ├── security/         # JWT Filter & Utility
│   │   └── service/          # Business Logic
│   └── src/main/resources/
│       └── application.properties
├── frontend/                 # React Application
│   ├── src/
│   │   ├── context/          # Auth Context
│   │   ├── hooks/            # Custom React Hooks
│   │   ├── services/         # API Service Layer
│   │   └── App.jsx           # Main App Component
│   ├── package.json
│   └── vite.config.js
└── README.md
```

---

## ⚙️ Getting Started

### Prerequisites

- Java 17
- Node.js & npm
- Docker Desktop (for PostgreSQL)
- IntelliJ IDEA (for backend)
- VS Code (for frontend)

---

### 1️⃣ Start PostgreSQL using Docker

```bash
docker run --name expenseiq-db \
  -e POSTGRES_PASSWORD=password123 \
  -e POSTGRES_DB=expenseiq \
  -p 5432:5432 \
  -d postgres:16
```

> Every time you restart your laptop:
> ```bash
> docker start expenseiq-db
> ```

---

### 2️⃣ Configure Backend

Open `backend/src/main/resources/application.properties`:

```properties
# Server
server.port=8080
spring.jackson.time-zone=UTC

# PostgreSQL Database

spring.datasource.url=jdbc:postgresql://localhost:5432/expenseiq?TimeZone=UTC
spring.datasource.username=postgres
spring.datasource.password=password123
spring.datasource.driver-class-name=org.postgresql.Driver



# JPA / Hibernate
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.PostgreSQLDialect
spring.jpa.properties.hibernate.format_sql=true
spring.jpa.properties.hibernate.jdbc.time_zone=UTC

# JWT
app.jwt.secret=expenseiq_super_secret_key_minimum_256_bits_long_for_hs256_algorithm
app.jwt.expiration=86400000

# CORS
app.cors.allowed-origins=http://localhost:3000
```

---

### 3️⃣ Run Backend (IntelliJ IDEA)

1. Open `expenseiq/backend` in IntelliJ IDEA
2. Set **Project SDK** to Java 17
3. Run `ExpenseIQApplication.java`
4. Backend starts at `http://localhost:8080`

---

### 4️⃣ Run Frontend (VS Code)

```bash
cd expenseiq/frontend
npm install
npm run dev
```

Frontend starts at `http://localhost:3000`

---

## 🔗 API Endpoints

### Auth
| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login & get JWT token |

### Expenses
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/expenses` | Get all expenses |
| POST | `/api/expenses` | Add new expense |
| DELETE | `/api/expenses/{id}` | Delete expense |
| GET | `/api/expenses/charts` | Get chart data |

### Budget
| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/budget` | Set budget |
| GET | `/api/budget/alert` | Get budget alert |

### Export
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/export/csv` | Export to CSV |
| GET | `/api/export/pdf` | Export to PDF |

---

## 🖥️ Screenshots

> Register → Login → Dashboard → Add Expenses → View Charts → Export

---

## 👩‍💻 Author

**Gayathri Vivek**  
GitHub: [@gayathri-vivek](https://github.com/gayathri-vivek)

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).
