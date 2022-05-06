import { prisma } from "../src/database.js";
import supertest from "supertest";
import app from "../src/app.js";
import createSongFactory from "./factories/createSongFactory.js";

describe("Add Song", () => {
  beforeAll(async () => {
    await prisma.$executeRaw`TRUNCATE TABLE recommendations;`;
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  const song = createSongFactory();

  it("should return 201 given a valid body", async () => {
    const res = await supertest(app).post("/recommendations").send(song);
    const recommendations = await prisma.recommendation.findMany({});

    expect(res.status).toEqual(201);
    expect(recommendations.length).toEqual(1);
  });

  it("should return 422 given an invalid url", async () => {
    const song2 = createSongFactory();

    const res = await supertest(app).post("/recommendations").send({...song2, youtubeLink: "https://www.google.com"});
    const recommendations = await prisma.recommendation.findMany({});

    expect(res.status).toEqual(422);
    expect(recommendations.length).toEqual(1);
  });

  it("should return 409 given a repeated name", async () => {
    const res = await supertest(app).post("/recommendations").send(song);
    const recommendations = await prisma.recommendation.findMany({});

    expect(res.status).toEqual(409);
    expect(recommendations.length).toEqual(1);
  });
});
