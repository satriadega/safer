const request = require("supertest");
const app = require("../app");
const { Type } = require("../models");

beforeAll(async () => {
  await Type.create({ name: "dummy" });
});

afterAll(async () => {
  await Type.destroy({ truncate: true, cascade: true, restartIdentity: true });
});

describe("POST /types", function () {
  it("create new type and return status 201", async () => {
    const response = await request(app).post("/types").send({
      name: "typeName",
      adminVerificator: "55555",
    });
    expect(response.status).toBe(201);
    expect(response.body).toEqual(expect.any(Object));
    expect(response.body).toHaveProperty("id", expect.any(Number));
    expect(response.body).toHaveProperty("name", "typeName");
  });
  it("should return error if type name is already registered and return status 400", async () => {
    const response = await request(app).post("/types").send({
      name: "typeName",
      adminVerificator: "55555",
    });
    expect(response.status).toBe(400);
    expect(response.body).toEqual(expect.any(Object));
    expect(response.body).toHaveProperty("message", [
      "Name already registered",
    ]);
  });
  it("should return error if adminVerificator is not true and return status 403", async () => {
    const response = await request(app).post("/types").send({
      name: "typeName",
      adminVerificator: "",
    });
    expect(response.status).toBe(403);
    expect(response.body).toEqual(expect.any(Object));
    expect(response.body).toHaveProperty("message", "You are not authorized");
  });
  it("should return error if adminVerificator is null and return status 403", async () => {
    const response = await request(app).post("/types").send({
      name: "typeName",
    });
    expect(response.status).toBe(403);
    expect(response.body).toEqual(expect.any(Object));
    expect(response.body).toHaveProperty("message", "You are not authorized");
  });
  it("should return error if type is null and return status 400", async () => {
    const response = await request(app)
      .post("/types")
      .send({ adminVerificator: "55555" });
    expect(response.status).toBe(400);
    expect(response.body).toEqual(expect.any(Object));
    expect(response.body).toHaveProperty("message", ["Name is required"]);
  });
  it("should return error if type is empty string and return status 400", async () => {
    const response = await request(app)
      .post("/types")
      .send({ name: "", adminVerificator: "55555" });
    expect(response.status).toBe(400);
    expect(response.body).toEqual(expect.any(Object));
    expect(response.body).toHaveProperty("message", ["Name is required"]);
  });
});

describe("GET /types", function () {
  it("get data types and return status 200", async () => {
    const response = await request(app).get("/types");

    expect(response.status).toBe(200);
    expect(response.body).toBeInstanceOf(Object);
  });
});
