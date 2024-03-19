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
    let runningTasks: Promise<number>[] = [];

    const executeNextTask = async () => {
        if (queue.length > 0 && runningTasks.length < workers) {
            const nextTask = queue.shift();
            if (nextTask) {
                const taskPromise = nextTask();
                runningTasks.push(taskPromise);
                taskPromise.finally(() => {
                    runningTasks = runningTasks.filter((task) => task !== taskPromise);
                    executeNextTask();
                });
                Promise.resolve();
            }
        }
    };

    for (let i = 0; i < workers; i += 1) {
        executeNextTask();
    }
    await Promise.all(runningTasks);
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
