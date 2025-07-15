# Payments API Documentation

## 1. Overview

The Payments API provides a RESTful interface for managing payment records with full CRUD operations, batch processing, and comprehensive validation.

## 2. Base URL
```
http://localhost:3000
```

## 3. Authentication
No authentication is currently required.

## 4. Data Models

### Payment Object
```typescript
{
  id: number;              // Auto-generated unique identifier
  total: number;           // Payment amount (rounded to 2 decimal places)
  record_type: string;     // 'invoice' | 'bill' | 'none'
  status: string;          // 'pending' | 'void' | 'completed'
  modified_date: string;   // ISO timestamp (create_date is hidden from API)
}
```

### Create Payment Request
```typescript
{
  total: number;           // Required, positive number
  record_type: string;     // Required, 'invoice' | 'bill' | 'none'
  status: string;          // Required, 'pending' | 'void' | 'completed'
}
```

### Update Payment Request
```typescript
{
  total?: number;          // Optional, positive number
  record_type?: string;    // Optional, 'invoice' | 'bill' | 'none'
  status?: string;         // Optional, 'pending' | 'void' | 'completed'
}
```

## 5. Endpoints

### 1. Create Single Payment

**POST** `/payments`

Creates a new payment record.

**Request Body:**
```json
{
  "total": 100.50,
  "record_type": "invoice",
  "status": "pending"
}
```

**Response (201 Created):**
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

**Validation Rules:**
- `total`: Must be a positive number, automatically rounded to 2 decimal places
- `record_type`: Must be one of: 'invoice', 'bill', 'none'
- `status`: Must be one of: 'pending', 'void', 'completed'

### 2. Create Multiple Payments (Batch)

**POST** `/payments/batch`

Creates multiple payment records in a single request.

**Request Body:**
```json
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
  },
  {
    "total": 50.25,
    "record_type": "none",
    "status": "void"
  }
]
```

**Response (201 Created):**
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
    },
    {
      "id": 3,
      "total": 50.25,
      "record_type": "none",
      "status": "void",
      "modified_date": "2025-07-15T04:30:00.000Z"
    }
  ]
}
```

### 3. Get All Payments

**GET** `/payments`

Retrieves all payment records, ordered by creation date (newest first).

**Response (200 OK):**
```json
{
  "success": true,
  "data": [
    {
      "id": 2,
      "total": 200.75,
      "record_type": "bill",
      "status": "completed",
      "modified_date": "2025-07-15T04:35:00.000Z"
    },
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

### 4. Get Payment by ID

**GET** `/payments/{id}`

Retrieves a specific payment record by its ID.

**Parameters:**
- `id` (path parameter): Payment ID (integer)

**Response (200 OK):**
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

**Error Response (404 Not Found):**
```json
{
  "success": false,
  "error": "Payment not found"
}
```

### 5. Update Payment

**PUT** `/payments/{id}`

Updates an existing payment record. Only provided fields will be updated.

**Parameters:**
- `id` (path parameter): Payment ID (integer)

**Request Body:**
```json
{
  "total": 150.75,
  "status": "completed"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "total": 150.75,
    "record_type": "invoice",
    "status": "completed",
    "modified_date": "2025-07-15T04:40:00.000Z"
  }
}
```

**Error Response (404 Not Found):**
```json
{
  "success": false,
  "error": "Payment not found"
}
```

### 6. Delete Payment

**DELETE** `/payments/{id}`

Deletes a payment record.

**Parameters:**
- `id` (path parameter): Payment ID (integer)

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Payment deleted successfully"
}
```

**Error Response (404 Not Found):**
```json
{
  "success": false,
  "error": "Payment not found"
}
```

## 6. Error Handling

### Validation Error (400 Bad Request)
```json
{
  "success": false,
  "error": "\"record_type\" is required"
}
```

### Not Found Error (404 Not Found)
```json
{
  "success": false,
  "error": "Payment not found"
}
```

### Invalid ID Format (400 Bad Request)
```json
{
  "success": false,
  "error": "Valid payment ID is required"
}
```

### Server Error (500 Internal Server Error)
```json
{
  "success": false,
  "error": "Internal server error",
  "timestamp": "2025-07-15T04:30:00.000Z"
}
```

### Route Not Found (404 Not Found)
```json
{
  "success": false,
  "error": "Route not found",
  "timestamp": "2025-07-15T04:30:00.000Z"
}
```

## 7. Business Rules

### Decimal Precision
- All `total` values are automatically rounded to 2 decimal places
- Example: 100.567 becomes 100.57

### System Fields
- `create_date`: Automatically set on creation, hidden from API responses
- `modified_date`: Automatically updated on any modification, included in API responses

### Validation Rules
- `total`: Must be positive number (greater than 0)
- `record_type`: Must be one of: 'invoice', 'bill', 'none'
- `status`: Must be one of: 'pending', 'void', 'completed'

### Batch Processing
- Multiple payments can be created in a single request
- If any payment in the batch fails validation, the entire batch fails
- Each payment is processed individually with proper error handling

## 8. Rate Limiting
Currently, no rate limiting is implemented.

## 9. Logging
All API requests are logged with:
- HTTP method and URL
- Response status code
- Request duration
- Client IP address
- User agent

Logs are written to:
- STDOUT (development)
- `logs/debug.log` (all environments)
- `logs/error.log` (error logs only)

## 10. cURL Examples

This section provides cURL commands for all test cases to help you test the API manually.

### CRUD Operations

#### 1. Create Single Payment
```bash
curl -X POST http://localhost:3000/payments \
  -H "Content-Type: application/json" \
  -d '{
    "total": 100.50,
    "record_type": "invoice",
    "status": "pending"
  }'
```

#### 2. Get Payment by ID
```bash
# First, create a payment and note the ID from the response
curl -X POST http://localhost:3000/payments \
  -H "Content-Type: application/json" \
  -d '{
    "total": 200.00,
    "record_type": "bill",
    "status": "completed"
  }'

# Then get the payment by ID (replace {id} with actual ID)
curl -X GET http://localhost:3000/payments/{id}
```

#### 3. Get All Payments
```bash
curl -X GET http://localhost:3000/payments
```

#### 4. Update Payment
```bash
# Update payment (replace {id} with actual ID)
curl -X PUT http://localhost:3000/payments/{id} \
  -H "Content-Type: application/json" \
  -d '{
    "total": 150.75,
    "status": "completed"
  }'
```

#### 5. Delete Payment
```bash
# Delete payment (replace {id} with actual ID)
curl -X DELETE http://localhost:3000/payments/{id}
```

### Batch Operations

#### 6. Create Multiple Payments (Batch)
```bash
curl -X POST http://localhost:3000/payments/batch \
  -H "Content-Type: application/json" \
  -d '[
    {
      "total": 100.50,
      "record_type": "invoice",
      "status": "pending"
    },
    {
      "total": 200.75,
      "record_type": "bill",
      "status": "completed"
    },
    {
      "total": 50.25,
      "record_type": "none",
      "status": "void"
    }
  ]'
```

#### 7. Handle Invalid Batch Data
```bash
curl -X POST http://localhost:3000/payments/batch \
  -H "Content-Type: application/json" \
  -d '"not an array"'
```

### Validation Tests

#### 8. Validate Required Fields (Missing record_type and status)
```bash
curl -X POST http://localhost:3000/payments \
  -H "Content-Type: application/json" \
  -d '{
    "total": 100.50
  }'
```

#### 9. Validate Total Field Constraints (Negative value)
```bash
curl -X POST http://localhost:3000/payments \
  -H "Content-Type: application/json" \
  -d '{
    "total": -10,
    "record_type": "invoice",
    "status": "pending"
  }'
```

#### 10. Validate Record Type Enum Values
```bash
curl -X POST http://localhost:3000/payments \
  -H "Content-Type: application/json" \
  -d '{
    "total": 100.50,
    "record_type": "invalid_type",
    "status": "pending"
  }'
```

#### 11. Validate Status Enum Values
```bash
curl -X POST http://localhost:3000/payments \
  -H "Content-Type: application/json" \
  -d '{
    "total": 100.50,
    "record_type": "invoice",
    "status": "invalid_status"
  }'
```

### Error Cases

#### 12. Get Non-existent Payment
```bash
curl -X GET http://localhost:3000/payments/999
```

#### 13. Get Payment with Invalid ID Format
```bash
curl -X GET http://localhost:3000/payments/invalid-id
```

#### 14. Test Decimal Rounding
```bash
curl -X POST http://localhost:3000/payments \
  -H "Content-Type: application/json" \
  -d '{
    "total": 100.567,
    "record_type": "invoice",
    "status": "pending"
  }'
```

#### 15. Test Route Not Found
```bash
curl -X GET http://localhost:3000/nonexistent
```

### Complete Test Sequence

Here's a complete sequence to test all functionality:

```bash
# 1. Create a payment
CREATE_RESPONSE=$(curl -s -X POST http://localhost:3000/payments \
  -H "Content-Type: application/json" \
  -d '{
    "total": 100.50,
    "record_type": "invoice",
    "status": "pending"
  }')

echo "Created payment: $CREATE_RESPONSE"

# 2. Extract the ID from the response (you'll need to parse this manually)
# The ID will be in the response JSON

# 3. Get all payments
curl -X GET http://localhost:3000/payments

# 4. Create batch payments
curl -X POST http://localhost:3000/payments/batch \
  -H "Content-Type: application/json" \
  -d '[
    {"total": 200.75, "record_type": "bill", "status": "completed"},
    {"total": 50.25, "record_type": "none", "status": "void"}
  ]'

# 5. Test validation errors
curl -X POST http://localhost:3000/payments \
  -H "Content-Type: application/json" \
  -d '{"total": -10, "record_type": "invoice", "status": "pending"}'

# 6. Test decimal rounding
curl -X POST http://localhost:3000/payments \
  -H "Content-Type: application/json" \
  -d '{
    "total": 100.567,
    "record_type": "invoice",
    "status": "pending"
  }'
```

### Notes for Testing

1. **Replace {id}**: In the examples above, replace `{id}` with actual payment IDs returned from create operations.

2. **Server Status**: Make sure the server is running on `http://localhost:3000` before executing these commands.

3. **Response Format**: All successful responses will have `"success": true` and the data in the `data` field.

4. **Error Responses**: Error responses will have `"success": false` and error details in the `error` field.

5. **Decimal Rounding**: The API automatically rounds `total` values to 2 decimal places (e.g., 100.567 becomes 100.57).

6. **Validation**: All requests are validated according to the business rules defined in the documentation. 