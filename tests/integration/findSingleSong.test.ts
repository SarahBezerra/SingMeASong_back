import { prisma } from "../../src/database.js";
import supertest from "supertest";
import app from "../../src/app.js";
import createSongFactory from "../factories/createSongFactory.js";
import faker from "@faker-js/faker";

describe("Single Song", () => {
  beforeAll(async () => {
    await prisma.$executeRaw`TRUNCATE TABLE recommendations;`;
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  
  it("should return single song given a valid id", async () => {
    const song1 = createSongFactory();
    const song2 = createSongFactory();
    await supertest(app).post("/recommendations").send(song1);
    await supertest(app).post("/recommendations").send(song2);

    const song1Data = await prisma.recommendation.findUnique({where: { name: song1.name }});

    const allRecommendations = await supertest(app).get("/recommendations");
    const recommendationById = await supertest(app).get(`/recommendations/${song1Data.id}`);

    expect(allRecommendations.body.length).toEqual(2);
    expect(recommendationById.body.name).toEqual(song1.name);
  });

  it("should return {} given an invalid id", async () => {
    const randomId = faker.random.numeric(5);
    const recommendationById = await supertest(app).get(`/recommendations/${randomId}`);

    expect(recommendationById.body).toEqual({});
  });
});