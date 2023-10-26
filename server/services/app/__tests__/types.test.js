const request = require("supertest");
const app = require("../app");
const { Type } = require("../models");

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
  it("should return error if type is null and return status 400", async () => {
    const response = await request(app).post("/register").send({});
    expect(response.status).toBe(400);
    expect(response.body).toEqual(expect.any(Object));
    expect(response.body).toHaveProperty("message", "Data Not Valid");
  });
  it("should return error if type is empty string and return status 400", async () => {
    const response = await request(app).post("/register").send({ name: "" });
    expect(response.status).toBe(400);
    expect(response.body).toEqual(expect.any(Object));
    expect(response.body).toHaveProperty("message", "Data Not Valid");
  });
});

describe("GET /types", function () {
  it("get data types and return status 200", async () => {
    const response = await request(app).get("/types");

    expect(response.status).toBe(200);
    expect(response.body).toBeInstanceOf(Object);
  });
});
