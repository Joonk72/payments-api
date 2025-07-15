# Payments API

A TypeScript-based RESTful API for payment processing services with full CRUD operations, batch processing, and comprehensive validation.

## 1. Features

- **Full CRUD Operations**: Create, Read, Update, Delete payments
- **Batch Processing**: Create multiple payments in a single request
- **Data Validation**: Comprehensive input validation with business rules
- **Decimal Precision**: Automatic rounding to 2 decimal places
- **System Fields**: Automatic timestamp management (create_date, modified_date)
- **Logging**: Structured logging to STDOUT and debug.log file
- **Error Handling**: Centralized error handling with appropriate HTTP status codes
- **Type Safety**: Full TypeScript support with strict type checking

## 2. Architecture

Built following SOLID principles with a clean layered architecture:

```
src/
├── controllers/     # HTTP request/response handling
├── services/        # Business logic and validation
├── repositories/    # Data access layer
├── models/          # Data models
├── middleware/      # Express middleware (logging, validation, error handling)
├── types/           # TypeScript type definitions
├── utils/           # Utility functions (database, decimal operations)
└── app.ts           # Main application entry point
```

## 3. Technology Stack

- **Runtime**: Node.js
- **Language**: TypeScript
- **Framework**: Express.js
- **Database**: SQLite
- **Validation**: Joi
- **Logging**: Winston
- **Testing**: Jest + Supertest
- **Development**: Nodemon, ts-node

## 4. Prerequisites

- Node.js (v14 or higher)
- npm or yarn

## 5. Quick Start

### > Clone and Install

```bash
git clone <repository-url>
cd payments-api
npm install
```
### > Environment Setup (Optional)

```bash
cp .env.example .env
```

### > Database Setup

```bash
# Run database migration
npx ts-node src/database/migrate.ts
```

### > Start Development Server

```bash
npm run dev
```

The API will be available at `http://localhost:3000`

## 6. API Documentation

### Base URL
```
http://localhost:3000
```

### Authentication
Currently, no authentication is required.

### Data Types

#### Payment Object
```typescript
{
  id: number;              // Auto-generated unique identifier
  total: number;           // Payment amount (rounded to 2 decimal places)
  record_type: string;     // 'invoice' | 'bill' | 'none'
  status: string;          // 'pending' | 'void' | 'completed'
  modified_date: string;   // ISO timestamp (create_date is hidden from API)
}
```

#### Create Payment Request
```typescript
{
  total: number;           // Required, positive number
  record_type: string;     // Required, 'invoice' | 'bill' | 'none'
  status: string;          // Required, 'pending' | 'void' | 'completed'
}
```

#### Update Payment Request
```typescript
{
  total?: number;          // Optional, positive number
  record_type?: string;    // Optional, 'invoice' | 'bill' | 'none'
  status?: string;         // Optional, 'pending' | 'void' | 'completed'
}
```

### Endpoints

#### 1. Create Single Payment
```http
POST /payments
Content-Type: application/json

{
  "total": 100.50,
  "record_type": "invoice",
  "status": "pending"
}
```

**Response (201 Created)**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "total": 100.50,
    "record_type": "invoice",
    "status": "pending",
    "modified_date": "2025-07-15T04:30:00.000Z"
  }
}
```

#### 2. Create Multiple Payments (Batch)
```http
POST /payments/batch
Content-Type: application/json

[
  {
    "total": 100.50,
    "record_type": "invoice",
    "status": "pending"
  },
  {
    "total": 200.75,
    "record_type": "bill",
    "status": "completed"
  }
]
```

**Response (201 Created)**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "total": 100.50,
      "record_type": "invoice",
      "status": "pending",
      "modified_date": "2025-07-15T04:30:00.000Z"
    },
    {
      "id": 2,
      "total": 200.75,
      "record_type": "bill",
      "status": "completed",
      "modified_date": "2025-07-15T04:30:00.000Z"
    }
  ]
}
```

#### 3. Get All Payments
```http
GET /payments
```

**Response (200 OK)**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "total": 100.50,
      "record_type": "invoice",
      "status": "pending",
      "modified_date": "2025-07-15T04:30:00.000Z"
    }
  ]
}
```

#### 4. Get Payment by ID
```http
GET /payments/{id}
```

**Response (200 OK)**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "total": 100.50,
    "record_type": "invoice",
    "status": "pending",
    "modified_date": "2025-07-15T04:30:00.000Z"
  }
}
```

#### 5. Update Payment
```http
PUT /payments/{id}
Content-Type: application/json

{
  "total": 150.75,
  "status": "completed"
}
```

**Response (200 OK)**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "total": 150.75,
    "record_type": "invoice",
    "status": "completed",
    "modified_date": "2025-07-15T04:35:00.000Z"
  }
}
```

#### 6. Delete Payment
```http
DELETE /payments/{id}
```

**Response (200 OK)**
```json
{
  "success": true,
  "message": "Payment deleted successfully"
}
```

### Error Responses

#### Validation Error (400 Bad Request)
```json
{
  "success": false,
  "error": "\"record_type\" is required"
}
```

#### Not Found Error (404 Not Found)
```json
{
  "success": false,
  "error": "Payment not found"
}
```

#### Server Error (500 Internal Server Error)
```json
{
  "success": false,
  "error": "Internal server error",
  "timestamp": "2025-07-15T04:30:00.000Z"
}
```

## 7. Testing

### Run Tests
```bash
npm test
```

### Run Tests in Watch Mode
```bash
npm run test:watch
```

### Test Coverage
The test suite covers:
- ✅ CRUD operations
- ✅ Batch creation
- ✅ Data validation
- ✅ Error handling
- ✅ Decimal rounding
- ✅ System field management

## 8. Development

### Available Scripts

```bash
npm run dev          # Start development server with hot reload
npm run build        # Build for production
npm start            # Start production server
npm test             # Run tests
npm run test:watch   # Run tests in watch mode
```

### Project Structure

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

## 9. Configuration

### Environment Variables

Create a `.env` file in the root directory:

```env
PORT=3000
NODE_ENV=development
```

### Database

The application uses SQLite by default. The database file (`payments.db`) will be created automatically in the root directory.

## 10. Logging

The application logs to:
- **STDOUT**: Console output (development)
- **File**: `logs/debug.log` (all environments)
- **Error File**: `logs/error.log` (error logs only)

Log format: Structured JSON with timestamp, level, and context information.
