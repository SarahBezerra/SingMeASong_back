import { faker } from "@faker-js/faker";

export default function createSongFactory(){
    const song = {
        name: faker.random.words(4),
        youtubeLink: `https://www.youtube.com/watch?v=Im9FAQxW8Ko`,
    }

    return song;
}