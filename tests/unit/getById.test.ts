import { jest } from '@jest/globals';
import { recommendationRepository } from '../../src/repositories/recommendationRepository';
import { recommendationService } from '../../src/services/recommendationsService';
import { notFoundError } from '../../src/utils/errorUtils';
import createSongFactory from '../factories/createSongFactory';

describe("Get Recommendation by Id", () => {
    it("should return a recommendation given a valid id", async () => {
        const song = createSongFactory();
        
        jest
            .spyOn(recommendationRepository, "find")
            .mockResolvedValue({id: 1, score: 0, ...song});
            
        const resolve = await recommendationService.getById(1);

        expect(resolve).toEqual({id: 1, score: 0, ...song})
    });

    it("should throw notFoundError given a valid id", async () => {
        const song = createSongFactory();
        
        jest
            .spyOn(recommendationRepository, "find")
            .mockResolvedValue(null);
        
        expect(async ()=> { 
            await recommendationService.getById(1)
        }).rejects.toEqual(notFoundError());
    });
})