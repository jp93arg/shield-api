import request from "supertest";
import app from "../../src/app";

const validUser = {
  email: "authtestsuser@example.com",
  password: "securePass123"
};

describe("Auth - Signup", () => {
  it("should return 400 if email is missing", async () => {
    const res = await request(app).post("/api/auth/signup").send({ password: "test123" });
    expect(res.status).toBe(400);
  });

  it("should return 400 if password is missing", async () => {
    const res = await request(app).post("/api/auth/signup").send({ email: "test@example.com" });
    expect(res.status).toBe(400);
  });

  it("should return 400 if email is invalid", async () => {
    const res = await request(app).post("/api/auth/signup").send({ email: "bad-email", password: "test123" });
    expect(res.status).toBe(400);
  });

  it("should return 201 if user is valid", async () => {
    const res = await request(app).post("/api/auth/signup").send(validUser);
    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty("id");
    expect(res.body).toHaveProperty("email", validUser.email);
  });

  it("should return 409 if email is already registered", async () => {
    const res = await request(app).post("/api/auth/signup").send(validUser);
    expect(res.status).toBe(409);
  });
});

describe("Auth - Signin", () => {
  it("should return 400 if email is missing", async () => {
    const res = await request(app).post("/api/auth/signin").send({ password: validUser.password });
    expect(res.status).toBe(400);
  });

  it("should return 400 if password is missing", async () => {
    const res = await request(app).post("/api/auth/signin").send({ email: validUser.email });
    expect(res.status).toBe(400);
  });

  it("should return 401 if email does not exist", async () => {
    const res = await request(app).post("/api/auth/signin").send({ email: "notfound@example.com", password: "pass123" });
    expect(res.status).toBe(401);
  });

  it("should return 401 if password is incorrect", async () => {
    const res = await request(app).post("/api/auth/signin").send({ email: validUser.email, password: "wrongpass" });
    expect(res.status).toBe(401);
  });

  it("should return 200 and a token if credentials are correct", async () => {
    const res = await request(app).post("/api/auth/signin").send(validUser);
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("token");
  });
});

describe("Auth - Signout", () => {
  let token: string;

  beforeAll(async () => {
    const res = await request(app).post("/signin").send(validUser);
    token = res.body.token;
  });

  it("should return 200 when signed out with valid token", async () => {
    const res = await request(app).post("/api/auth/signout").set("Authorization", `Bearer ${token}`);
    expect(res.status).toBe(200);
  });
});