const request = require("supertest");
const app = require("../src/app");
require("dotenv").config();

describe("Auth API", () => {
  it("should login with valid credentials", async () => {
    const res = await request(app).post("/api/v1/auth/login").send({
      email: "superadmin@example.com",
      password: "Test1234!",
    });
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("success", true);
    expect(res.body).toHaveProperty("token");
    expect(res.body.user.roles).toContainEqual(
      expect.objectContaining({ name: "superadmin" })
    );
  });

  it("should fail login with invalid password", async () => {
    const res = await request(app).post("/api/v1/auth/login").send({
      email: "superadmin@example.com",
      password: "wrongpass",
    });
    expect(res.statusCode).toBe(401);
    expect(res.body).toHaveProperty("success", false);
    expect(res.body).toHaveProperty("message", "invalid credentials");
  });
});
