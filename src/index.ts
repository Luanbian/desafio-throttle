import 'dotenv/config';
import debug from 'debug';

const logger = debug('core');

const delays = [...Array(50)].map(() => Math.floor(Math.random() * 900) + 100);
const load = delays.map(
    (delay) => (): Promise<number> => new Promise((resolve) => {
        setTimeout(() => resolve(Math.floor(delay / 100)), delay);
    }),
);

type Task = () => Promise<number>;

export const throttle = async (workers: number, tasks: Task[]): Promise<number[]> => {
    const results: number[] = [];

    const processBatch = async (batch: Task[]) => {
        const batchResults = await Promise.all(batch.map((task) => task()));
        results.push(...batchResults);
    };

    const batches: Task[][] = [];
    for (let i = 0; i < tasks.length; i += workers) {
        batches.push(tasks.slice(i, i + workers));
    }

    await Promise.all(batches.map((batch) => processBatch(batch)));
    return results;
};

export const bootstrap = async () => {
    logger('Starting...');
    const start = Date.now();
    const answers = await throttle(5, load);
    logger('Done in %dms', Date.now() - start);
    logger('Answers: %O', answers);
};

bootstrap().catch((err) => {
    logger('General fail: %O', err);
});
