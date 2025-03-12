const request = require("supertest");
const { app, server, interval } = require("../src/server.js"); // Ensure this points to
require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("../src/models/User.js"); // Mocked model
const Trade = require("../src/models/Trade.js"); // Mocked model
const { protect, admin } = require("../src/middlewares/authMiddleware.js");

// Mock Mongoose Model Methods
jest.mock("../src/models/Trade.js");
jest.mock("../src/models/User.js");
jest.mock("../src/models/Event.js");
jest.mock("../src/middlewares/authMiddleware.js", () => ({
  protect: jest.fn((req, res, next) => {
    req.user = { id: "user123" };
    next();
  }),
  admin: jest.fn((req, res, next) => {
    req.user = { id: "user123", isAdmin: true };
    next();
  }),
}));

let token = process.env.JWT_SECRET; // Simulated token

beforeAll(async () => {
  await mongoose.connect(process.env.MONGO_URI);
});

afterAll(async () => {
  clearInterval(interval);
  await mongoose.connection.close();
  server.close();
});

describe("Auth API (Unit Tests)", () => {
  it("should signup a user", async () => {
    User.create.mockResolvedValue({
      _id: "123",
      email: "test@example.com",
      token,
    });

    const res = await request(app).post("/api/auth/register").send({
      username: "testuser",
      email: "test@example.com",
      password: "Test@123",
    });

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty("token");
  });

  it("should login a user", async () => {
    const hashedPassword = await bcrypt.hash("Test@123", 10); // Generate a real bcrypt hash

    User.findOne.mockResolvedValue({
      email: "test@example.com",
      password: hashedPassword,
    });

    const res = await request(app)
      .post("/api/auth/login")
      .send({ email: "test@example.com", password: "Test@123" });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("token");

    global.authToken = res.body.token; // Store token for other tests
  });

  it("should not login with wrong credentials", async () => {
    User.findOne.mockResolvedValue(null);

    const res = await request(app)
      .post("/api/auth/login")
      .send({ email: "test@example.com", password: "WrongPass" });

    expect(res.statusCode).toBe(401);
  });
});
