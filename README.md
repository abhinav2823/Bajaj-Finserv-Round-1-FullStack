
# BFHL API (Node + Express)

A ready-to-deploy implementation of the `/bfhl` POST API that classifies input items and returns the response required by the VIT Full Stack question.

## How to run locally

```bash
# 1) Install dependencies
npm install

# 2) (Optional) Set your info (otherwise example defaults are used)
export FULL_NAME="john doe"
export DOB_DDMMYYYY="17091999"
export EMAIL="john@xyz.com"
export ROLL_NUMBER="ABCD123"

# 3) Start the server
npm start
# Server runs at http://localhost:3000
```

## Endpoint

- **Method**: POST
- **Path**: `/bfhl`
- **Body**:
```json
{ "data": ["a","1","334","4","R","$"] }
```
- **Success status**: `200`
- **Response** (example):
```json
{
  "is_success": true,
  "user_id": "john_doe_17091999",
  "email": "john@xyz.com",
  "roll_number": "ABCD123",
  "odd_numbers": ["1"],
  "even_numbers": ["334","4"],
  "alphabets": ["A","R"],
  "special_characters": ["$"],
  "sum": "339",
  "concat_string": "Ra"
}
```

## Rules implemented

- `user_id` is always `full_name_ddmmyyyy` with the full name lowercased and spaces -> underscores. Defaults can be changed via env vars.
- `is_success` marks operation status.
- Numbers in output arrays are **strings** (as required).
- `alphabets` only includes tokens that are *entirely alphabetic*, converted to UPPERCASE.
- `special_characters` includes tokens that are neither pure numbers nor pure alphabets.
- `sum` is the sum of all integer tokens, returned as a **string**.
- `concat_string` is built by:
  1. Taking **all alphabetical characters found anywhere in the input tokens**,
  2. Reversing their order,
  3. Applying alternating caps starting with Uppercase (Upper, lower, Upper, ...).

## Tests

Run the test suite (which includes the three sample test cases from the prompt):

```bash
npm test
```

## Deploy (Render or Railway)

1. Push this folder to a **public GitHub repo**.
2. Create a new **Web Service** in Render.com or Railway.app and connect your repo.
3. Set environment variables: `FULL_NAME`, `DOB_DDMMYYYY`, `EMAIL`, `ROLL_NUMBER`.
4. Build command: `npm install`
5. Start command: `node src/index.js`
6. Once deployed, your API will be available at something like `https://<your-app>.onrender.com/bfhl`.
