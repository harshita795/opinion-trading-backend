# Trade Management System

## Introduction
The **Trade Management System** is a backend service built with **Node.js, Express.js, and MongoDB**, designed to facilitate event-based trading. Users can place trades on specific events, update or cancel trades, and receive real-time updates via WebSocket. Admins can settle trades based on event outcomes, affecting users' balances accordingly.

## Features
- **User Authentication:** Secure login and user verification.
- **Trade Placement:** Users can place trades on events.
- **Trade Management:** Users can view, update, or cancel their trades.
- **Event Handling:** Admins can create and update events.
- **Real-time Updates:** WebSocket support for trade updates.
- **Admin Privileges:** Settle trades based on outcomes.

## Application Flow
1. **User Registration & Authentication:** Users sign up and log in to the system.
2. **Event Management:** Admins create events for trading.
3. **Placing Trades:** Users place trades on an event.
4. **Managing Trades:** Users can update or cancel their trades.
5. **Event Outcome & Settlement:** Admins declare event outcomes, and the system settles trades based on predictions.
6. **Real-time Updates:** Users get WebSocket notifications for trade updates.

## System Design & Architecture
![image](https://github.com/user-attachments/assets/f96e164c-ca57-4c69-87a7-77b6c608c2ac)

## Installation & Setup
1. Clone the repository:
   ```sh
   git clone https://github.com/yourusername/trade-management-system.git
   cd trade-management-system
   ```
2. Install dependencies:
   ```sh
   npm install
   ```
3. Set up environment variables in `.env`:
   ```
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_secret_key
   ```
4. Start the server:
   ```sh
   npm start
   ```

## API Endpoints

### User Routes
#### Register User
```
POST /api/users/register
```
**Request:**
```json
{
  "username": "JohnDoe",
  "email": "johndoe@example.com",
  "password": "securepassword"
}
```
**Response:**
```json
{
  "message": "User registered successfully",
  "user": { "id": "user_id", "username": "JohnDoe", "email": "johndoe@example.com" }
}
```

#### Login User
```
POST /api/users/login
```
**Request:**
```json
{
  "email": "johndoe@example.com",
  "password": "securepassword"
}
```
**Response:**
```json
{
  "token": "jwt_token",
  "user": { "id": "user_id", "username": "JohnDoe" }
}
```

### Event Routes
#### Create Event (Admin Only)
```
POST /api/events
```
**Request:**
```json
{
  "name": "Stock Market Prediction",
  "description": "Predict the stock market closing price",
  "status": "open"
}
```
**Response:**
```json
{
  "message": "Event created successfully",
  "event": { "id": "event_id", "name": "Stock Market Prediction" }
}
```

#### Fetch All Events
```
GET /api/events
```
**Response:**
```json
[
  { "id": "event_id", "name": "Stock Market Prediction", "status": "open" }
]
```

### Trade Routes
#### Place Trade
```
POST /api/trades
```
**Request:**
```json
{
  "eventId": "event_id",
  "amount": 100,
  "prediction": "bullish"
}
```
**Response:**
```json
{
  "message": "Trade placed successfully",
  "trade": { "id": "trade_id", "amount": 100, "choice": "bullish" }
}
```

#### Get All Trades
```
GET /api/trades
```
**Response:**
```json
[
  { "id": "trade_id", "eventId": "event_id", "amount": 100, "prediction": "bullish", "status": "pending" }
]
```

#### Update Trade
```
PUT /api/trades/:id
```
**Request:**
```json
{
  "amount": 200,
  "prediction": "bearish"
}
```
**Response:**
```json
{
  "message": "Trade updated",
  "trade": { "id": "trade_id", "amount": 200, "choice": "bearish" }
}
```

#### Cancel Trade
```
DELETE /api/trades/:id
```
**Response:**
```json
{
  "message": "Trade canceled"
}
```

### Admin Routes
#### Settle Trades
```
POST /api/trades/settle
```
**Request:**
```json
{
  "eventId": "event_id",
  "outcome": "bullish"
}
```
**Response:**
```json
{
  "message": "Trades settled successfully",
  "settledTrades": [ { "tradeId": "trade_id", "status": "won", "payout": 200 } ]
}
```

## Technologies Used
- **Node.js & Express.js** - Backend framework
- **MongoDB & Mongoose** - Database and ORM
- **JWT Authentication** - Secure authentication
- **WebSockets (Socket.io)** - Real-time updates
- **Dotenv** - Environment variables management

## WebSocket Events
| Event | Description |
|------|-------------|
| `tradeUpdate` | Broadcasts trade updates |
| `tradeResult` | Notifies users of trade settlements |

## License
This project is licensed under the MIT License.

