import { prisma } from "../../src/database.js";
import supertest from "supertest";
import app from "../../src/app.js";
import createSongFactory from "../factories/createSongFactory.js";
import { Recommendation } from "@prisma/client";
import faker from "@faker-js/faker";

describe("Upvote in Song", () => {
  beforeAll(async () => {
    await prisma.$executeRaw`TRUNCATE TABLE recommendations;`;
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  
  it("should return 200 and correct score given a valid id", async () => {
    const song = createSongFactory();
    await supertest(app).post("/recommendations").send(song);

    const songData: Recommendation = await prisma.recommendation.findUnique({
      where: { name: song.name }
    });

    const res1 = await supertest(app).post(`/recommendations/${songData.id}/upvote`);
    const res2 = await supertest(app).post(`/recommendations/${songData.id}/upvote`);

    const recommendation: Recommendation = await prisma.recommendation.findUnique({
      where: { name: song.name }
    });

    expect(res1.status).toEqual(200);
    expect(res2.status).toEqual(200);
    expect(recommendation.score).toEqual(2);
  });

  it("should return 404 given a invalid id", async () => {
    const randomId = faker.random.numeric(5);

    const res = await supertest(app).post(`/recommendations/${randomId}/upvote`);

    expect(res.status).toEqual(404);
  });
});