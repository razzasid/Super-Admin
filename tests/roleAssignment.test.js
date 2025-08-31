const request = require("supertest");
const app = require("../src/app"); // Adjust path
require("dotenv").config();

let token;
let userId;
let roleId;

beforeAll(async () => {
  // Login to get token
  const loginRes = await request(app)
    .post("/api/v1/auth/login")
    .send({ email: "superadmin@example.com", password: "Test1234!" });
  token = loginRes.body.token;
  console.log("Login Response:", loginRes.body);

  // Check if test user exists, create it if it doesn't
  const userCheckRes = await request(app)
    .get("/api/v1/superadmin/users")
    .set("Authorization", `Bearer ${token}`);
  console.log("User Check Response:", userCheckRes.body);
  let user = userCheckRes.body.data.find(
    (u) => u.email === "testuser@example.com"
  );
  if (!user) {
    const userRes = await request(app)
      .post("/api/v1/superadmin/users")
      .set("Authorization", `Bearer ${token}`)
      .send({
        name: "Test User",
        email: "testuser@example.com",
        password: "Test1234!",
      });
    console.log("User Creation Response:", userRes.body);
    if (!userRes.body.data)
      throw new Error("User creation failed: " + JSON.stringify(userRes.body));
    userId = userRes.body.data._id;
  } else {
    userId = user._id;
  }
  console.log("User ID set to:", userId);

  // Check if "admin" role exists, create it if it doesn't
  const roleCheckRes = await request(app)
    .get("/api/v1/superadmin/roles")
    .set("Authorization", `Bearer ${token}`);
  console.log("Role Check Response:", roleCheckRes.body);
  let role = roleCheckRes.body.data.find((r) => r.name === "admin");
  if (!role) {
    const roleRes = await request(app)
      .post("/api/v1/superadmin/roles")
      .set("Authorization", `Bearer ${token}`)
      .send({ name: "admin", permissions: ["read:users"] });
    console.log("Role Creation Response:", roleRes.body);
    if (!roleRes.body.data)
      throw new Error("Role creation failed: " + JSON.stringify(roleRes.body));
    roleId = roleRes.body.data._id;
  } else {
    roleId = role._id;
  }
  console.log("Role ID set to:", roleId);

  // Assign role to generate audit log (initial assignment)
  const assignRes = await request(app)
    .post("/api/v1/superadmin/assign-role")
    .set("Authorization", `Bearer ${token}`)
    .send({ userId, roleId });
  console.log("Initial Assignment Response:", assignRes.body);
  console.log("Final userId and roleId:", { userId, roleId }); // Confirm values at the end
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

describe("Role Assignment API", () => {
  it("should fail if role is already assigned", async () => {
    const res = await request(app)
      .post("/api/v1/superadmin/assign-role")
      .set("Authorization", `Bearer ${token}`)
      .send({ userId, roleId });
    console.log("Assign Role Response:", res.body);
    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty("success", false);
    expect(res.body).toHaveProperty("message", "Role already assigned to user");
  });

  it("should fail with invalid userId", async () => {
    const res = await request(app)
      .post("/api/v1/superadmin/assign-role")
      .set("Authorization", `Bearer ${token}`)
      .send({ userId: "invalid_id", roleId });
    console.log("Invalid UserId Response:", res.body);
    expect(res.statusCode).toBe(400); // Matches backend behavior
    expect(res.body).toHaveProperty("success", false);
    expect(res.body).toHaveProperty(
      "message",
      "Invalid userId or roleId format"
    ); 
  });

  it("should fail with invalid roleId", async () => {
    const res = await request(app)
      .post("/api/v1/superadmin/assign-role")
      .set("Authorization", `Bearer ${token}`)
      .send({ userId, roleId: "invalid_id" });
    console.log("Invalid RoleId Response:", res.body);
    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty("success", false);
    expect(res.body).toHaveProperty(
      "message",
      "Invalid userId or roleId format"
    );
  });
});
