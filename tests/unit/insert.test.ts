import { jest } from '@jest/globals';
import { recommendationRepository } from '../../src/repositories/recommendationRepository';
import { recommendationService } from '../../src/services/recommendationsService';
import { conflictError } from '../../src/utils/errorUtils';
import createSongFactory from '../factories/createSongFactory';

describe("Create Recommendation", () => {
    it("should call the create function given a valid body", async () => {
        const song = createSongFactory();

        jest
            .spyOn(recommendationRepository, "findByName")
            .mockResolvedValue(null);
        
        const repositoryInsert = jest
            .spyOn(recommendationRepository, "create")
            .mockImplementation( async () => {});
            
        await recommendationService.insert(song);

        expect(repositoryInsert).toBeCalledTimes(1);
        expect(repositoryInsert).toBeCalledWith(song);
    });

    it("should throw an 409 error given name is duplicate", async () => {
        const song = createSongFactory();

        jest
            .spyOn(recommendationRepository, "findByName")
            .mockResolvedValue({id: 1, score: 0, ...song});

        const repositoryInsert = jest
            .spyOn(recommendationRepository, "create")
            .mockImplementation( async () => {});

        expect(async ()=> { 
            await recommendationService.insert(song) 
        }).rejects.toEqual(conflictError("Recommendations names must be unique"));
    });
})