import request from "supertest";
import app from "../../src/app";

const user = {
  email: "walletuser@example.com",
  password: "validPass123"
};

let token: string;
let walletId: string;

beforeAll(async () => {
  // Create and login user
  await request(app).post("/api/signup").send(user);
  const res = await request(app).post("/api/signin").send(user);
  token = res.body.token;
});

describe("Wallets", () => {
  it("should reject unauthenticated wallet creation", async () => {
    const res = await request(app).post("/api/wallets").send({
      chain: "Ethereum",
      address: "0xabc"
    });

    expect(res.status).toBe(401);
  });

  it("should create wallet for authenticated user", async () => {
    const res = await request(app)
      .post("/api/wallets")
      .set("Authorization", `Bearer ${token}`)
      .send({
        chain: "Ethereum",
        address: "0xabc123",
        tag: "My ETH Wallet"
      });

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty("id");
    walletId = res.body.id;
  });

  it("should return all wallets for authenticated user", async () => {
    const res = await request(app)
      .get("/api/wallets")
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThanOrEqual(1);
  });

  it("should return wallet by ID", async () => {
    const res = await request(app)
      .get(`/api/wallets/${walletId}`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.id).toBe(walletId);
  });

  it("should return 404 for invalid wallet ID", async () => {
    const res = await request(app)
      .get("/wallets/9999")
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(404);
  });

  it("should update wallet", async () => {
    const res = await request(app)
      .put(`/api/wallets/${walletId}`)
      .set("Authorization", `Bearer ${token}`)
      .send({ tag: "Updated Tag", chain: "Ethereum", address: "0xabc123" });

    expect(res.status).toBe(200);
    expect(res.body.tag).toBe("Updated Tag");
  });

  it("should delete wallet", async () => {
    const res = await request(app)
      .delete(`/api/wallets/${walletId}`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(204);
  });

  it("should return 404 for deleted wallet", async () => {
    const res = await request(app)
      .get(`/api/wallets/${walletId}`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(404);
  });
});
