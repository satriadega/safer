const request = require("supertest");
const app = require("../app");
const { signToken } = require("../helpers/jwt");

let validToken;

const dummyVotes = require("../__tests__/database/votes.json");

dummyVotes.forEach((el) => {
  el.createdAt = new Date();
  el.updatedAt = new Date();
});

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

const userTest2 = {
  name: "tester2",
  email: "tester2@mail.com",
  password: "admin",
  gender: "male",
  phoneNumber: "0813",
  address: "address",
};

const { Report, User, Type, Vote } = require("../models");

beforeAll(async () => {
  let result = await User.create(userTest);
  let result2 = await User.create(userTest2);
  validToken = signToken({ id: result.id, email: result.email }, "XdfggtFhgfs");

  await Report.bulkCreate(dummyReport);
  await Type.create({ name: "dummy" });
  await Vote.bulkCreate(dummyVotes);
});

afterAll(async () => {
  await Report.destroy({
    truncate: true,
    cascade: true,
    restartIdentity: true,
  });
  await User.destroy({ truncate: true, cascade: true, restartIdentity: true });
  await Type.destroy({ truncate: true, cascade: true, restartIdentity: true });
  await Vote.destroy({ truncate: true, cascade: true, restartIdentity: true });
});

describe("GET /votes", function () {
  it("get data reports and return status 200", async () => {
    const response = await request(app).get("/votes");

    expect(response.status).toBe(200);
    expect(response.body).toBeInstanceOf(Object);
  });
});

describe("GET /votes/:id", function () {
  it("get data votes with id as request params and return status 200", async () => {
    const response = await request(app)
      .get("/votes/1")
      .set("access_token", validToken);

    expect(response.status).toBe(200);
    expect(response.body).toBeInstanceOf(Object);
    expect(response.body).toHaveProperty("vote");
  });

  it("failed get vote with invalid id as request params and return status 404", async () => {
    const response = await request(app)
      .get("/votes/420")
      .set("access_token", validToken);
    expect(response.status).toBe(404);
    expect(response.body).toBeInstanceOf(Object);
    expect(response.body).toHaveProperty("message", "Error Not Found");
  });

  it("failed get vote with id as request params if vote userId is not same and return status 400", async () => {
    const response = await request(app)
      .get("/votes/2")
      .set("access_token", validToken);
    expect(response.status).toBe(403);
    expect(response.body).toBeInstanceOf(Object);
    expect(response.body).toHaveProperty("message", "You are not authorized");
  });

  it("failed get vote without token return status 401", async () => {
    const response = await request(app).get("/votes/1");

    expect(response.status).toBe(401);
    expect(response.body).toBeInstanceOf(Object);
    expect(response.body).toHaveProperty("message", "Invalid token");
  });

  it("failed get vote with invalid token return status 401", async () => {
    const response = await await request(app)
      .get("/votes/1")
      .set("access_token", "invalid");

    expect(response.status).toBe(401);
    expect(response.body).toBeInstanceOf(Object);
    expect(response.body).toHaveProperty("message", "Invalid token");
  });
});

describe("POST /votes", function () {
  it("create new vote and return status 201", async () => {
    const response = await request(app)
      .post("/votes")
      .set("access_token", validToken)
      .send({
        image:
          "https://as2.ftcdn.net/v2/jpg/01/43/42/83/1000_F_143428338_gcxw3Jcd0tJpkvvb53pfEztwtU9sxsgT.jpg",
        status: "like",
        UserId: 1,
        comment: "asd",
        ReportId: 3,
      });

    expect(response.status).toBe(201);
    expect(response.body).toBeInstanceOf(Object);
    expect(response.body).toHaveProperty("newVote");
  });

  it("should return error if create new vote without token and return status 401", async () => {
    const response = await request(app).post("/votes").send({
      image:
        "https://as2.ftcdn.net/v2/jpg/01/43/42/83/1000_F_143428338_gcxw3Jcd0tJpkvvb53pfEztwtU9sxsgT.jpg",
      status: "like",
      UserId: 1,
      comment: "asd",
      ReportId: 1,
    });

    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty("message", "Invalid token");
  });

  it("should return error if create new vote with invalid token and return status 401", async () => {
    const response = await request(app)
      .post("/votes")
      .set("access_token", "invalid")
      .send({
        image:
          "https://as2.ftcdn.net/v2/jpg/01/43/42/83/1000_F_143428338_gcxw3Jcd0tJpkvvb53pfEztwtU9sxsgT.jpg",
        status: "like",
        UserId: 1,
        comment: "asd",
        ReportId: 1,
      });

    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty("message", "Invalid token");
  });

  it("should return error if ReportId is empty string and return status 400", async () => {
    const response = await request(app)
      .post("/votes")
      .set("access_token", validToken)
      .send({
        image:
          "https://as2.ftcdn.net/v2/jpg/01/43/42/83/1000_F_143428338_gcxw3Jcd0tJpkvvb53pfEztwtU9sxsgT.jpg",
        status: "like",
        UserId: 1,
        comment: "asd",
        ReportId: "",
      });
    expect(response.status).toBe(400);
    expect(response.body).toEqual(expect.any(Object));
    expect(response.body).toHaveProperty("message", "Data Not Valid");
  });

  it("should return error if status is not like or dislike and return status 400", async () => {
    const response = await request(app)
      .post("/votes")
      .set("access_token", validToken)
      .send({
        image:
          "https://as2.ftcdn.net/v2/jpg/01/43/42/83/1000_F_143428338_gcxw3Jcd0tJpkvvb53pfEztwtU9sxsgT.jpg",
        status: "",
        UserId: 1,
        comment: "asd",
        ReportId: 1,
      });
    expect(response.status).toBe(400);
    expect(response.body).toEqual(expect.any(Object));
    expect(response.body).toHaveProperty("message", "Data Not Valid");
  });

  it("should return error if ReportId is not exist and return status 404", async () => {
    const response = await request(app)
      .post("/votes")
      .set("access_token", validToken)
      .send({
        image:
          "https://as2.ftcdn.net/v2/jpg/01/43/42/83/1000_F_143428338_gcxw3Jcd0tJpkvvb53pfEztwtU9sxsgT.jpg",
        status: "like",
        UserId: 1,
        comment: "asd",
        ReportId: 100,
      });
    expect(response.status).toBe(404);
    expect(response.body).toEqual(expect.any(Object));
    expect(response.body).toHaveProperty("message", "Error Not Found");
  });

  it("should return error if comment is empty string and return status 400", async () => {
    const response = await request(app)
      .post("/votes")
      .set("access_token", validToken)
      .send({
        image:
          "https://as2.ftcdn.net/v2/jpg/01/43/42/83/1000_F_143428338_gcxw3Jcd0tJpkvvb53pfEztwtU9sxsgT.jpg",
        status: "like",
        UserId: 1,
        comment: "",
        ReportId: 2,
      });
    expect(response.status).toBe(400);
    expect(response.body).toEqual(expect.any(Object));
    expect(response.body).toHaveProperty("message", ["Comment is required"]);
  });
});

describe("PUT /votes/:id", function () {
  it("update vote and return status 200", async () => {
    const response = await request(app)
      .put("/votes/1")
      .set("access_token", validToken)
      .send({
        status: "like",
        comment: "asd",
        image:
          "https://as2.ftcdn.net/v2/jpg/01/43/42/83/1000_F_143428338_gcxw3Jcd0tJpkvvb53pfEztwtU9sxsgT.jpg",
      });

    expect(response.status).toBe(200);
    expect(response.body).toBeInstanceOf(Object);
    expect(response.body).toHaveProperty(
      "message",
      "Vote successfully updated"
    );
  });

  it("failed update vote with invalid id as request params and return status 404", async () => {
    const response = await request(app)
      .put("/votes/420")
      .set("access_token", validToken)
      .send({
        status: "like",
        comment: "asd",
        image:
          "https://as2.ftcdn.net/v2/jpg/01/43/42/83/1000_F_143428338_gcxw3Jcd0tJpkvvb53pfEztwtU9sxsgT.jpg",
      });
    expect(response.status).toBe(404);
    expect(response.body).toBeInstanceOf(Object);
    expect(response.body).toHaveProperty("message", "Error Not Found");
  });

  it("failed update vote with id as request params if vote userId is not same and return status 400", async () => {
    const response = await request(app)
      .put("/votes/2")
      .set("access_token", validToken)
      .send({
        status: "like",
        comment: "asd",
        image:
          "https://as2.ftcdn.net/v2/jpg/01/43/42/83/1000_F_143428338_gcxw3Jcd0tJpkvvb53pfEztwtU9sxsgT.jpg",
      });
    expect(response.status).toBe(403);
    expect(response.body).toBeInstanceOf(Object);
    expect(response.body).toHaveProperty("message", "You are not authorized");
  });

  it("failed update vote without token return status 401", async () => {
    const response = await request(app).put("/votes/1").send({
      status: "like",
      comment: "asd",
      image:
        "https://as2.ftcdn.net/v2/jpg/01/43/42/83/1000_F_143428338_gcxw3Jcd0tJpkvvb53pfEztwtU9sxsgT.jpg",
    });

    expect(response.status).toBe(401);
    expect(response.body).toBeInstanceOf(Object);
    expect(response.body).toHaveProperty("message", "Invalid token");
  });

  it("failed update vote with invalid token return status 401", async () => {
    const response = await await request(app)
      .put("/votes/1")
      .set("access_token", "invalid")
      .send({
        status: "like",
        comment: "asd",
        image:
          "https://as2.ftcdn.net/v2/jpg/01/43/42/83/1000_F_143428338_gcxw3Jcd0tJpkvvb53pfEztwtU9sxsgT.jpg",
      });

    expect(response.status).toBe(401);
    expect(response.body).toBeInstanceOf(Object);
    expect(response.body).toHaveProperty("message", "Invalid token");
  });

  it("should return error if status is not like or dislike and return status 400", async () => {
    const response = await request(app)
      .put("/votes/1")
      .set("access_token", validToken)
      .send({
        status: "unknown",
        comment: "asd",
        image:
          "https://as2.ftcdn.net/v2/jpg/01/43/42/83/1000_F_143428338_gcxw3Jcd0tJpkvvb53pfEztwtU9sxsgT.jpg",
      });
    expect(response.status).toBe(400);
    expect(response.body).toEqual(expect.any(Object));
    expect(response.body).toHaveProperty("message", "Data Not Valid");
  });

  it("should return error if comment is empty string and return status 400", async () => {
    const response = await request(app)
      .put("/votes/1")
      .set("access_token", validToken)
      .send({
        status: "like",
        comment: "",
        image:
          "https://as2.ftcdn.net/v2/jpg/01/43/42/83/1000_F_143428338_gcxw3Jcd0tJpkvvb53pfEztwtU9sxsgT.jpg",
      });
    expect(response.status).toBe(400);
    expect(response.body).toEqual(expect.any(Object));
    expect(response.body).toHaveProperty("message", ["Comment is required"]);
  });
});
