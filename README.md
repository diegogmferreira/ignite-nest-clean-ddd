# Ignite Nest Clean DDD

A backend API project built with **NestJS**, following the principles of **Domain-Driven Design (DDD)** and the **Clean Architecture** pattern. This project is part of the Ignite Node.js course by Rocketseat, focusing on creating scalable and maintainable applications.

## 🛠️ Technologies

- **Node.js**
- **NestJS**
- **TypeScript**
- **Prisma ORM**
- **SQLite** (for development/testing)
- **Jest** (unit and integration testing)
- **ESLint & Prettier** (code quality and formatting)

## 🏛️ Architecture

The project is organized using **Clean Architecture** and **Domain-Driven Design (DDD)** principles:

- **Domain**: Entities, Value Objects, Aggregates, and Domain Logic.
- **Application**: Use Cases and business rules.
- **Infrastructure**: Database (Prisma) and external services.
- **Interface/HTTP**: REST API with NestJS Controllers.

## 🚀 Getting Started

### Prerequisites

- Node.js >= 18
- Yarn or npm

### Installation

```bash

# Clone the repository
git clone https://github.com/diegogmferreira/ignite-nest-clean-ddd.git

# Navigate into the project
cd ignite-nest-clean-ddd

# Install dependencies
yarn install
# or
npm install
