const request = require("supertest");
const app = require("../app");
const { User } = require("../models");

let userId;
const userTest = {
  name: "tester1",
  email: "tester@mail.com",
  password: "admin",
  gender: "male",
  phoneNumber: "0813",
  address: "address",
};

beforeAll(async () => {
  let result = await User.create(userTest);
  userId = result.id;
});

afterAll(async () => {
  await User.destroy({
    truncate: true,
    cascade: true,
    restartIdentity: true,
  });
});

describe("POST /register", function () {
  it("create new user and return status 201", async () => {
    const response = await request(app).post("/register").send({
      name: "tester",
      email: "testerjest@mail.com",
      password: "admin",
      gender: "male",
      phoneNumber: 123,
      address: "address",
    });
    expect(response.status).toBe(201);
    expect(response.body).toEqual(expect.any(Object));
    expect(response.body).toHaveProperty("id", expect.any(Number));
    expect(response.body).toHaveProperty("email", "testerjest@mail.com");
  });
  it("should return error if email is null and return status 400", async () => {
    const response = await request(app).post("/register").send({
      name: "tester",
      password: "admin",
      gender: "male",
      phoneNumber: 123,
      address: "address",
    });
    expect(response.status).toBe(400);
    expect(response.body).toEqual(expect.any(Object));
    expect(response.body).toHaveProperty("message", ["Email is required"]);
  });
  it("should return error if password is null and return status 400", async () => {
    const response = await request(app).post("/register").send({
      name: "tester",
      email: "tester@mail.com",
      gender: "male",
      phoneNumber: 123,
      address: "address",
    });
    expect(response.status).toBe(400);
    expect(response.body).toEqual(expect.any(Object));
    expect(response.body).toHaveProperty("message", ["Password is required"]);
  });
  it("should return error if email is empty string and return status 400", async () => {
    const response = await request(app).post("/register").send({
      name: "tester",
      email: "",
      password: "admin",
      gender: "male",
      phoneNumber: 123,
      address: "address",
    });
    expect(response.status).toBe(400);
    expect(response.body).toEqual(expect.any(Object));
    expect(response.body).toHaveProperty("message", [
      "Email is required",
      "Email must be valid",
    ]);
  });
  it("should return error if password is empty string and return status 400", async () => {
    const response = await request(app).post("/register").send({
      name: "tester",
      email: "tester@mail.com",
      password: "",
      gender: "male",
      phoneNumber: 123,
      address: "address",
    });
    expect(response.status).toBe(400);
    expect(response.body).toEqual(expect.any(Object));
    expect(response.body).toHaveProperty("message", ["Password is required"]);
  });
  it("should return error if email is already registered and return status 400", async () => {
    await User.create({
      name: "tester",
      email: "testernew@mail.com",
      password: "admin",
      gender: "male",
      phoneNumber: 123,
      address: "address",
    });

    const response = await request(app).post("/register").send({
      name: "tester",
      email: "testernew@mail.com",
      password: "admin",
      gender: "male",
      phoneNumber: 123,
      address: "address",
    });
    expect(response.status).toBe(400);
    expect(response.body).toEqual(expect.any(Object));
    expect(response.body).toHaveProperty("message", [
      "Email already registered",
    ]);
  });
  it("should return error if email format is not a valid and return status 400", async () => {
    const response = await request(app).post("/register").send({
      name: "tester",
      email: "testernewmail.com",
      password: "admin",
      gender: "male",
      phoneNumber: 123,
      address: "address",
    });
    expect(response.status).toBe(400);
    expect(response.body).toEqual(expect.any(Object));
    expect(response.body).toHaveProperty("message", ["Email must be valid"]);
  });
  it("should return error if gender is not male or female and return status 400", async () => {
    const response = await request(app).post("/register").send({
      name: "tester",
      email: "anothertester@mail.com",
      password: "admin",
      gender: "binary",
      phoneNumber: 123,
      address: "address",
    });
    expect(response.status).toBe(400);
    expect(response.body).toEqual(expect.any(Object));
    expect(response.body).toHaveProperty("message", "Data Not Valid");
  });
  it("should return error if name is empty string and return status 400", async () => {
    const response = await request(app).post("/register").send({
      name: "",
      email: "tester@mail.com",
      password: "admin",
      gender: "male",
      phoneNumber: 123,
      address: "address",
    });
    expect(response.status).toBe(400);
    expect(response.body).toEqual(expect.any(Object));
    expect(response.body).toHaveProperty("message", ["Name is required"]);
  });
  it("should return error if phoneNumber is empty string and return status 400", async () => {
    const response = await request(app).post("/register").send({
      name: "tester",
      email: "tester@mail.com",
      password: "admin",
      gender: "male",
      phoneNumber: "",
      address: "address",
    });
    expect(response.status).toBe(400);
    expect(response.body).toEqual(expect.any(Object));
    expect(response.body).toHaveProperty("message", [
      "Phone number is required",
    ]);
  });
  it("should return error if address is empty string and return status 400", async () => {
    const response = await request(app).post("/register").send({
      name: "tester",
      email: "tester@mail.com",
      password: "admin",
      gender: "male",
      phoneNumber: 123,
      address: "",
    });
    expect(response.status).toBe(400);
    expect(response.body).toEqual(expect.any(Object));
    expect(response.body).toHaveProperty("message", ["Address is required"]);
  });
});

describe("POST /login", function () {
  it("login successfully and should return access_token, status 200", async () => {
    const response = await request(app).post("/login").send({
      email: "tester@mail.com",
      password: "admin",
    });
    const { status, body } = response;
    expect(status).toBe(200);
    expect(body).toEqual(expect.any(Object));
    expect(body).toHaveProperty("access_token", expect.any(String));
  });
  it("should return error if password is not a correct password and return status 401", async () => {
    const response = await request(app).post("/login").send({
      email: "tester@mail.com",
      password: "admins",
    });
    const { status, body } = response;
    expect(status).toBe(401);
    expect(body).toEqual(expect.any(Object));
    expect(body).toHaveProperty("message", "Invalid Login");
  });
  it("should return error if email is not found and return status 401", async () => {
    const response = await request(app).post("/login").send({
      email: "ziad222y71@mail.com",
      password: "admins",
    });
    const { status, body } = response;
    expect(status).toBe(401);
    expect(body).toEqual(expect.any(Object));
    expect(body).toHaveProperty("message", "Invalid Login");
  });
});

describe("GET /users/:id", function () {
  it("get data user with id as request params and return status 200", async () => {
    const response = await request(app).get("/users/" + userId);

    expect(response.status).toBe(200);
    expect(response.body).toBeInstanceOf(Object);
    expect(response.body).toHaveProperty("user");
  });

  it("failed get user with invalid id as request params and return status 404", async () => {
    const response = await request(app).get("/users/420");
    expect(response.status).toBe(404);
    expect(response.body).toBeInstanceOf(Object);
    expect(response.body).toHaveProperty("message", "Error Not Found");
  });
});
