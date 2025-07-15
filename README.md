# Payments API

A TypeScript-based REST API for payment processing services.

## Project Structure

```
payments-api/
├── src/
│   ├── controllers/     # Request handlers
│   ├── services/        # Business logic
│   ├── repositories/    # Data access layer
│   ├── models/          # Data models
│   ├── middleware/      # Express middleware
│   ├── types/           # TypeScript type definitions
│   ├── utils/           # Utility functions
│   └── app.ts           # Main application entry point
├── tests/
│   ├── integration/     # Integration tests
│   └── setup.ts         # Test configuration
├── database/
│   └── schema.sql       # Database schema
├── logs/                # Application logs
├── package.json
├── tsconfig.json
└── README.md
```

## Setup Instructions

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Set up environment variables:**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

3. **Build the project:**
   ```bash
   npm run build
   ```

4. **Start development server:**
   ```bash
   npm run dev
   ```

5. **Run tests:**
   ```bash
   npm test
   ```

## API Endpoints

- `GET /` - API status
- `POST /payments` - Create a new payment
- `GET /payments/:id` - Get payment by ID
- `PUT /payments/:id` - Update payment
- `DELETE /payments/:id` - Delete payment

## Technologies Used

- **Runtime:** Node.js
- **Language:** TypeScript
- **Framework:** Express.js
- **Validation:** Joi
- **Logging:** Winston
- **Testing:** Jest + Supertest
- **Database:** SQL (PostgreSQL/MySQL)

## Development

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm test` - Run tests
- `npm run test:watch` - Run tests in watch mode