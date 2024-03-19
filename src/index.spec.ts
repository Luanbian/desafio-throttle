import { throttle } from './index';

const taskMock = [
    jest.fn(() => Promise.resolve(1)),
    jest.fn(() => Promise.resolve(2)),
    jest.fn(() => Promise.resolve(3)),
    jest.fn(() => Promise.resolve(4)),
    jest.fn(() => Promise.resolve(5)),
    jest.fn(() => Promise.resolve(6)),
    jest.fn(() => Promise.resolve(7)),
    jest.fn(() => Promise.resolve(8)),
    jest.fn(() => Promise.resolve(9)),
    jest.fn(() => Promise.resolve(10)),
];

const generateTaskWithDelay = (delay: number): () =>
  Promise<number> => () => new Promise((resolve) => {
    setTimeout(() => resolve(Math.floor(delay / 100)), delay);
});

describe('bootstrap function', () => {
    test('should generate tasks with delays within the expected range', async () => {
        jest.spyOn(Math, 'random').mockReturnValue(0.5);

        const delays: number[] = [];
        const tasks = Array.from({ length: 50 }, (_, index) => index * 100 + 100).map((delay) => {
            delays.push(delay);
            return generateTaskWithDelay(delay);
        });

        const results = await throttle(5, tasks);

        expect(delays.length).toBe(50);
        delays.forEach((delay, index) => {
            expect(delay).toBeGreaterThanOrEqual(100);
            expect(results[index]).toBe(Math.floor(delay / 100));
        });

        jest.restoreAllMocks();
    }, 10000);
    test('should throttle tasks to a specified number of workers', async () => {
        await throttle(1, taskMock);

        expect(taskMock[0]).toHaveBeenCalledTimes(1);
        expect(taskMock[1]).toHaveBeenCalledTimes(1);
        expect(taskMock[2]).toHaveBeenCalledTimes(1);
        expect(taskMock[3]).toHaveBeenCalledTimes(1);
        expect(taskMock[4]).toHaveBeenCalledTimes(1);
        expect(taskMock[5]).toHaveBeenCalledTimes(1);
        expect(taskMock[6]).toHaveBeenCalledTimes(1);
        expect(taskMock[7]).toHaveBeenCalledTimes(1);
        expect(taskMock[8]).toHaveBeenCalledTimes(1);
        expect(taskMock[9]).toHaveBeenCalledTimes(1);
    });
});
