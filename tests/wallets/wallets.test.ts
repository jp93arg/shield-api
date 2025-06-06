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
      chain: "ethereum",
      address: "0x0000000000000000000000000000000000000000",
    });

    expect(res.status).toBe(401);
  });

  it("should create wallet for authenticated user", async () => {
    const res = await request(app)
      .post("/api/wallets")
      .set("Authorization", `Bearer ${token}`)
      .send({
        chain: "ethereum",
        address: "0x0000000000000000000000000000000000000000",
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
      .send({ tag: "Updated Tag", chain: "ethereum", address: "0x0000000000000000000000000000000000000000" });

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
          chain: "ethereum",
          address: `0x000000000000000000000000000000000000000${i}`,
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

  it("should reject an unsupported chain", async () => {
    const res = await request(app)
      .post("/api/wallets")
      .set("Authorization", `Bearer ${token}`)
      .send({
        chain: "solana",
        address: "some-address"
      });
  
    expect(res.status).toBe(400);
    expect(res.body.errors?.body?.chain?._errors[0]).toMatch(/Chain must be one of/);
  });

  it("should reject wallet creation with invalid Ethereum address", async () => {
    const res = await request(app)
      .post("/api/wallets")
      .set("Authorization", `Bearer ${token}`)
      .send({
        chain: "ethereum",
        address: "not_a_valid_eth_address"
      });
  
    expect(res.status).toBe(400);
    expect(res.body.errors?.body?.address?._errors[0]).toMatch(/invalid/i);
  });

  it("should reject address update if it does not match wallet's existing chain", async () => {
    // Create a valid wallet first
    const createRes = await request(app)
      .post("/api/wallets")
      .set("Authorization", `Bearer ${token}`)
      .send({
        chain: "ethereum",
        address: "0x0000000000000000000000000000000000000000"
      });
  
    const walletId = createRes.body.id;
  
    // Try to update address with an invalid Ethereum format
    const updateRes = await request(app)
      .put(`/api/wallets/${walletId}`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        address: "bad-format-address"
      });
  
    expect(updateRes.status).toBe(400);
    expect(updateRes.body.message).toMatch(/invalid/i);
  });
  
});
