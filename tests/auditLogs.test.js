const request = require("supertest");
const app = require("../src/app");
require("dotenv").config();

let token;
let userId;
let roleId;
let superadminId;

beforeAll(async () => {
  // Login to get token and superadminId
  const loginRes = await request(app)
    .post("/api/v1/auth/login")
    .send({ email: "superadmin@example.com", password: "Test1234!" });
  token = loginRes.body.token;
  superadminId = loginRes.body.user.id;
  // Create a test user
  const userRes = await request(app)
    .post("/api/v1/superadmin/users")
    .set("Authorization", `Bearer ${token}`)
    .send({
      name: "Test User",
      email: "testuser2@example.com",
      password: "Test1234!",
    });
  if (!userRes.body.data)
    throw new Error("User creation failed: " + JSON.stringify(userRes.body));
  userId = userRes.body.data._id;

  // Check if "admin" role exists, create it if it doesn't
  const roleCheckRes = await request(app)
    .get("/api/v1/superadmin/roles")
    .set("Authorization", `Bearer ${token}`);
  let role = roleCheckRes.body.data.find((r) => r.name === "admin");
  if (!role) {
    const roleRes = await request(app)
      .post("/api/v1/superadmin/roles")
      .set("Authorization", `Bearer ${token}`)
      .send({ name: "admin", permissions: ["read:users"] });
    if (!roleRes.body.data)
      throw new Error("Role creation failed: " + JSON.stringify(roleRes.body));
    roleId = roleRes.body.data._id;
  } else {
    roleId = role._id;
  }
  // Assign role to generate audit log
  await request(app)
    .post("/api/v1/superadmin/assign-role")
    .set("Authorization", `Bearer ${token}`)
    .send({ userId, roleId });
});

afterAll(async () => {
  // Cleanup
  await request(app)
    .delete(`/api/v1/superadmin/users/${userId}`)
    .set("Authorization", `Bearer ${token}`);
  await request(app)
    .delete(`/api/v1/superadmin/roles/${roleId}`)
    .set("Authorization", `Bearer ${token}`);
});

describe("Audit Logs API", () => {
  it("should get audit logs with no filters", async () => {
    const res = await request(app)
      .get("/api/v1/superadmin/audit-logs")
      .set("Authorization", `Bearer ${token}`);
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("success", true);
    expect(res.body).toHaveProperty("data");
    expect(res.body).toHaveProperty("pagination");
  });

  it("should filter audit logs by action", async () => {
    const res = await request(app)
      .get(`/api/v1/superadmin/audit-logs?action=ASSIGN_ROLE`)
      .set("Authorization", `Bearer ${token}`);
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("success", true);
    expect(res.body.data.length).toBeGreaterThan(0);
    res.body.data.forEach((log) => expect(log.action).toBe("ASSIGN_ROLE"));
  });

  it("should filter audit logs by user", async () => {
    const res = await request(app)
      .get(`/api/v1/superadmin/audit-logs?user=${superadminId}`)
      .set("Authorization", `Bearer ${token}`);
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("success", true);
    expect(res.body.data.length).toBeGreaterThan(0);
    res.body.data.forEach((log) =>
      expect(log.actorUserId._id.toString()).toBe(superadminId)
    );
  });
});
