const request = require("supertest");
const app = require("../app");
const { signToken } = require("../helpers/jwt");

let validToken;

const dummyReport = require("../__tests__/database/reports.json");

dummyReport.forEach((el) => {
  el.createdAt = new Date();
  el.updatedAt = new Date();
});

const userTest = {
  name: "tester1",
  email: "tester@mail.com",
  password: "admin",
  gender: "male",
  phoneNumber: "0813",
  address: "address",
};

const { Report, User, Type } = require("../models");

beforeAll(async () => {
  let result = await User.create(userTest);
  userId = result.id;
  validToken = signToken({ id: result.id, email: result.email }, "XdfggtFhgfs");

  await Report.bulkCreate(dummyReport);
  await Type.create({ name: "dummy" });
});

afterAll(async () => {
  await Report.destroy({
    truncate: true,
    cascade: true,
    restartIdentity: true,
  });
  await User.destroy({ truncate: true, cascade: true, restartIdentity: true });
  await Type.destroy({ truncate: true, cascade: true, restartIdentity: true });
});

describe("GET /reports", function () {
  it("get data reports and return status 200", async () => {
    const response = await request(app).get("/reports");

    expect(response.status).toBe(200);
    expect(response.body).toBeInstanceOf(Object);
  });
});

describe("GET /reports/:id", function () {
  it("get data reports with id as request params and return status 200", async () => {
    const response = await request(app).get("/reports/1");

    expect(response.status).toBe(200);
    expect(response.body).toBeInstanceOf(Object);
    expect(response.body).toHaveProperty("report");
  });

  it("failed get reports with invalid id as request params and return status 404", async () => {
    const response = await request(app).get("/reports/420");
    expect(response.status).toBe(404);
    expect(response.body).toBeInstanceOf(Object);
    expect(response.body).toHaveProperty("message", "Error Not Found");
  });
});

describe("POST /reports", function () {
  it("create new report and return status 201", async () => {
    const response = await request(app)
      .post("/reports")
      .set("access_token", validToken)
      .send({
        UserId: 1,
        title: "title",
        description: "description",
        latitude: 12345,
        TypeId: 1,
        longitude: 12345,
      });

    expect(response.status).toBe(201);
    expect(response.body).toBeInstanceOf(Object);
    expect(response.body).toHaveProperty("newReport");
  });

  it("should return error if create new report without token and return status 401", async () => {
    const response = await request(app).post("/reports").send({
      UserId: 1,
      title: "title",
      description: "description",
      latitude: 12345,
      TypeId: 1,
      longitude: 12345,
    });

    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty("message", "Invalid token");
  });

  it("should return error if create new report invalid token and return status 401", async () => {
    const response = await request(app)
      .post("/reports")
      .set("access_token", "invalid")
      .send({
        UserId: 1,
        title: "title",
        description: "description",
        latitude: 12345,
        TypeId: 1,
        longitude: 12345,
      });

    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty("message", "Invalid token");
  });

  it("should return error if title is empty string and return status 400", async () => {
    const response = await request(app)
      .post("/reports")
      .set("access_token", validToken)
      .send({
        title: "",
        description: "description",
        latitude: 12345,
        TypeId: 1,
        longitude: 12345,
      });
    expect(response.status).toBe(400);
    expect(response.body).toEqual(expect.any(Object));
    expect(response.body).toHaveProperty("message", ["Title is required"]);
  });

  it("should return error if description is empty string and return status 400", async () => {
    const response = await request(app)
      .post("/reports")
      .set("access_token", validToken)
      .send({
        title: "title",
        description: "",
        latitude: 12345,
        TypeId: 1,
        longitude: 12345,
      });
    expect(response.status).toBe(400);
    expect(response.body).toEqual(expect.any(Object));
    expect(response.body).toHaveProperty("message", [
      "Description is required",
    ]);
  });

  it("should return error if latitude is empty string and return status 400", async () => {
    const response = await request(app)
      .post("/reports")
      .set("access_token", validToken)
      .send({
        title: "title",
        description: "description",
        latitude: "",
        TypeId: 1,
        longitude: 12345,
      });
    expect(response.status).toBe(400);
    expect(response.body).toEqual(expect.any(Object));
    expect(response.body).toHaveProperty("message", "Data Not Valid");
  });

  it("should return error if longitude is empty string and return status 400", async () => {
    const response = await request(app)
      .post("/reports")
      .set("access_token", validToken)
      .send({
        title: "title",
        description: "description",
        latitude: 12345,
        TypeId: 1,
        longitude: "",
      });
    expect(response.status).toBe(400);
    expect(response.body).toEqual(expect.any(Object));
    expect(response.body).toHaveProperty("message", "Data Not Valid");
  });

  it("should return error if TypeId is not exist and return status 400", async () => {
    const response = await request(app)
      .post("/reports")
      .set("access_token", validToken)
      .send({
        title: "title",
        description: "description",
        latitude: 12345,
        longitude: 12345,
      });
    expect(response.status).toBe(400);
    expect(response.body).toEqual(expect.any(Object));
    expect(response.body).toHaveProperty("message", "Data Not Valid");
  });

  it("should return error if TypeId is not exists and return status 404", async () => {
    const response = await request(app)
      .post("/reports")
      .set("access_token", validToken)
      .send({
        title: "title",
        description: "description",
        latitude: 12345,
        TypeId: 404,
        longitude: 12345,
      });
    expect(response.status).toBe(404);
    expect(response.body).toEqual(expect.any(Object));
    expect(response.body).toHaveProperty("message", "Error Not Found");
  });
});
