import { jest } from '@jest/globals';
import { recommendationRepository } from '../../src/repositories/recommendationRepository';
import { recommendationService } from '../../src/services/recommendationsService';
import createSongFactory from '../factories/createSongFactory';

describe("Get Recommendations", () => {
    it("should return all recommendations", async () => {
        const song = createSongFactory();
        
        jest
            .spyOn(recommendationRepository, "findAll")
            .mockResolvedValue([{id: 1, score: 0, ...song}]);
            
        const resolve = await recommendationService.get();

        expect(resolve).toEqual([{id: 1, score: 0, ...song}]);
    });
});

describe("Get Top Recommendations", () => {
    it("should return top recommendations", async () => {
        const song = createSongFactory();
        
        jest
            .spyOn(recommendationRepository, "getAmountByScore")
            .mockResolvedValue([{id: 1, score: 0, ...song}]);
            
        const resolve = await recommendationService.getTop(1);

        expect(resolve).toEqual([{id: 1, score: 0, ...song}]);
    });
});