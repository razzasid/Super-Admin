const request = require("supertest");
const app = require("../src/app"); 
require("dotenv").config();

let token;

beforeAll(async () => {
  const res = await request(app).post("/api/v1/auth/login").send({
    email: "superadmin@example.com",
    password: "Test1234!",
  });
  token = res.body.token;
});

describe("Users API", () => {
  it("should get users list with valid token", async () => {
    const res = await request(app)
      .get("/api/v1/superadmin/users?page=1&limit=10")
      .set("Authorization", `Bearer ${token}`);
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("success", true);
    expect(res.body).toHaveProperty("data");
    expect(res.body).toHaveProperty("pagination");
  });

  it("should fail without token", async () => {
    const res = await request(app).get("/api/v1/superadmin/users");
    expect(res.statusCode).toBe(401);
    expect(res.body).toHaveProperty("success", false);
    expect(res.body.error).toHaveProperty("code", "NO_TOKEN");
  });
});
