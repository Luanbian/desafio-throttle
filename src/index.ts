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

const throttle = async (workers: number, tasks: Task[]) => {
    const queue: Task[] = [...tasks];
    let runningCount = 0;

    const executeNextTask = async () => {
        if (queue.length > 0 && runningCount < workers) {
            runningCount += 1;
            const nextTask = queue.shift();
            if (nextTask) {
                await nextTask();
                runningCount -= 1;
                executeNextTask();
            }
        }
    };

    const promises: Promise<void>[] = [];
    for (let i = 0; i < workers; i += 1) {
        promises.push(executeNextTask());
    }

    await Promise.all(promises);
    return Promise.all(tasks.map((task) => task()));
};

const bootstrap = async () => {
    logger('Starting...');
    const start = Date.now();
    const answers = await throttle(5, load);
    logger('Done in %dms', Date.now() - start);
    logger('Answers: %O', answers);
};

bootstrap().catch((err) => {
    logger('General fail: %O', err);
});
