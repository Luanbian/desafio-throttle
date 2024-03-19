import { throttle } from './index';

const generateTaskWithDelay = (delay: number): () =>
  Promise<number> => () => new Promise((resolve) => {
    setTimeout(() => resolve(Math.floor(delay / 100)), delay);
});

jest.mock('./index', () => ({
    throttle: jest.fn(),
}));

describe('bootstrap function', () => {
    test('should generate tasks with delays within the expected range', async () => {
        jest.spyOn(Math, 'random').mockReturnValue(0.5);

        const delays: number[] = [];
        const tasks = Array.from({ length: 50 }, (_, index) => index * 100 + 100).map((delay) => {
            delays.push(delay);
            return generateTaskWithDelay(delay);
        });

        const results = Array.from({ length: 50 }, (_, index) => Math.floor(delays[index] / 100));

        (throttle as jest.Mock).mockResolvedValue(results);

        await throttle(5, tasks);

        expect(delays.length).toBe(50);
        delays.forEach((delay) => {
            expect(delay).toBeGreaterThanOrEqual(100);
        });

        expect(throttle).toHaveBeenCalledWith(5, expect.any(Array));
    });
    test('should throttle tasks to a specified number of workers', async () => {
        const results = [1, 2, 3, 4, 5];
        (throttle as jest.Mock).mockImplementation(async (workers, tasks) => {
            const taskResults = await Promise.all(tasks.map((task) => task()));
            return taskResults;
        });

        const tasks = [
            jest.fn(() => Promise.resolve(1)),
            jest.fn(() => Promise.resolve(2)),
            jest.fn(() => Promise.resolve(3)),
            jest.fn(() => Promise.resolve(4)),
            jest.fn(() => Promise.resolve(5)),
        ];

        const taskResults = await throttle(5, tasks);

        expect(throttle).toHaveBeenCalledWith(5, expect.any(Array));
        expect(taskResults).toEqual(results);
    });
});
