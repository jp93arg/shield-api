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
  await request(app).post("/api/auth/signup").send(user);
  const res = await request(app).post("/api/auth/signin").send(user);
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

  it("should return 400 bad request if trying to list all the wallets without pagination", async () => {
    const res = await request(app)
      .get("/api/wallets")
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(400);
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

  it("GET /wallets with pagination - returns first 5 wallets with correct metadata", async () => {
    // Create 10 wallets
    for (let i = 0; i < 10; i++) {
      await request(app)
        .post("/api/wallets")
        .set("Authorization", `Bearer ${token}`)
        .send({
          tag: `Wallet ${i + 1}`,
          chain: "Ethereum",
          address: `0x${i}abc123`,
        });
    }

    const res = await request(app)
      .get("/api/wallets?page=1&limit=5")
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.data.length).toBe(5);

    expect(res.body.meta).toMatchObject({
      page: 1,
      limit: 5,
      totalPages: 2,
      totalItems: 10,
    });

    expect(res.body.data[0]).toHaveProperty("tag");
    expect(res.body.data[0]).toHaveProperty("address");
  });
});
