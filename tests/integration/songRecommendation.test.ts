import { prisma } from "../../src/database.js";
import supertest from "supertest";
import app from "../../src/app.js";
import createSongFactory from "../factories/createSongFactory.js";

describe("Song Recommendation", () => {
  beforeAll(async () => {
    await prisma.$executeRaw`TRUNCATE TABLE recommendations;`;
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  
  it("should return 404 if there are no songs registered", async () => {
    const res = await supertest(app).get("/recommendations/random");
    
    expect(res.status).toEqual(404);
  });

  it("should return the only registered song", async () => {
    const song = createSongFactory();
    const res = await supertest(app).post("/recommendations").send(song);

    const recommendations = await supertest(app).get("/recommendations/random");

    expect(res.status).toEqual(201);
    expect(recommendations.body.name).toEqual(song.name);
  });
});