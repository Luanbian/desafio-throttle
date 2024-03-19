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

describe('bootstrap function', () => {
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
