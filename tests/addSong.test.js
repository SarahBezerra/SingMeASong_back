import { prisma } from "../src/database.js";
import { faker } from "@faker-js/faker";
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
    expect(res.status).toEqual(201);
  });

  it("should return 422 given an invalid url", async () => {
    const song2 = {
      name: faker.random.words(4),
      youtubeLink: "https://www.google.com",
    };

    const res = await supertest(app).post("/recommendations").send(song2);
    expect(res.status).toEqual(422);
  });

  it("should return 409 given a repeated name", async () => {
    const res = await supertest(app).post("/recommendations").send(song);
    expect(res.status).toEqual(409);
  });
});
