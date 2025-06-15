const request = require('supertest');
const jwt = require('jsonwebtoken');
const app = require('../app');
const { SECRET_KEY } = require('../config');

// Generate tokens for tests
const userToken = jwt.sign({ username: 'testuser', admin: false }, SECRET_KEY);
const adminToken = jwt.sign({ username: 'adminuser', admin: true }, SECRET_KEY);

describe("Bug Fix Tests", function () {

  it("should 404 if user not found", async function () {
    const resp = await request(app)
      .get('/users/nonexistentuser')
      .set("authorization", `Bearer ${userToken}`);
    expect(resp.statusCode).toBe(404);
  });

  it("should not return email/phone in user list", async function () {
    const resp = await request(app)
      .get('/users')
      .set("authorization", `Bearer ${userToken}`);
    for (let user of resp.body.users) {
      expect(user).not.toHaveProperty("email");
      expect(user).not.toHaveProperty("phone");
    }
  });

  it("should delete user and return deleted message", async function () {
    const resp = await request(app)
      .delete('/users/testuser')
      .set("authorization", `Bearer ${adminToken}`);
    expect(resp.body).toEqual({ message: 'deleted' });

    // Confirm user is gone
    const getResp = await request(app)
      .get('/users/testuser')
      .set("authorization", `Bearer ${adminToken}`);
    expect(getResp.statusCode).toBe(404);
  });

  it("should 404 on deleting non-existent user", async function () {
    const response = await request(app)
      .delete("/users/no_user")
      .send({ _token: tokens.u3 });
    expect(response.statusCode).toBe(404);
  });


  it("should return token when correct login given", async function () {
    const resp = await request(app)
      .post('/auth/login')
      .send({ username: 'testuser', password: 'password' });
    expect(resp.body).toHaveProperty("token");
  });

  it("should allow user to edit their own profile", async function () {
    const resp = await request(app)
      .patch('/users/testuser')
      .send({ first_name: "NewName" })
      .set("authorization", `Bearer ${userToken}`);
    expect(resp.body.user.first_name).toBe("NewName");
  });

  it("should reject a forged token", async function () {
    const fakeToken = jwt.sign(
      { username: "testuser", admin: false },
      "wrongsecret"
    );
    const resp = await request(app)
      .get('/users')
      .set("authorization", `Bearer ${fakeToken}`);
    expect(resp.statusCode).toBe(401);
  });

  it("should reject bad password", async function () {
    const response = await request(app)
      .post("/auth/login")
      .send({
        username: "u1",
        password: "wrongpassword"
      });
    expect(response.statusCode).toBe(400);
  });

  it("should reject invalid username", async function () {
    const response = await request(app)
      .post("/auth/login")
      .send({
        username: "no_user",
        password: "pwd1"
      });
    expect(response.statusCode).toBe(400);
  });

  test("should reject malformed token", async function () {
    const response = await request(app)
      .get("/users")
      .send({ _token: "thisisnotavalidtoken" });
    expect(response.statusCode).toBe(401);
  });


});
