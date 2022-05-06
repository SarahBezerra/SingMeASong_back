import { prisma } from "../src/database.js";
import supertest from "supertest";
import app from "../src/app.js";
import createSongFactory from "./factories/createSongFactory.js";
import { Recommendation } from "@prisma/client";

describe("Top Recommendations", () => {
  beforeAll(async () => {
    await prisma.$executeRaw`TRUNCATE TABLE recommendations;`;
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  
  it("should return the right sequence of songs given the scores", async () => {
    const songId1 = await createSong();
    const songId2 = await createSong();
    const songId3 = await createSong();
    const songId4 = await createSong();
  
    for(let i=0; i<3; i++){
      await supertest(app).post(`/recommendations/${songId2}/upvote`);
    };
    for(let i=0; i<5; i++){
      await supertest(app).post(`/recommendations/${songId1}/upvote`);
    };
    await supertest(app).post(`/recommendations/${songId4}/downvote`);
    await supertest(app).post(`/recommendations/${songId3}/upvote`);

    const songs: Recommendation[] = await prisma.recommendation.findMany({});
    const top3 = await (await supertest(app).get(`/recommendations/top/3`)).body;
    const top6 = await (await supertest(app).get(`/recommendations/top/6`)).body;

    expect(songs.length).toEqual(4);
    expect(top3.length).toEqual(3);
    expect(top3[0].score).toEqual(5);
    expect(top3[1].score).toEqual(3);
    expect(top3[2].score).toEqual(1);
    expect(top6.length).toEqual(4);
    expect(top6[3].score).toEqual(-1);
  });
});

async function createSong(){
  const song = createSongFactory();
  await supertest(app).post("/recommendations").send(song);

  const songData: Recommendation = await prisma.recommendation.findUnique({where: { name: song.name }});

  return songData.id;
}