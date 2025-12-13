let activeRuns = 0;
const MAX_RUNS = Number(process.env.MAX_RUNS || 1);

interface RunLimiterType {
    canRun: () => boolean;
    startRun: () => void;
    endRun: () => void;
    reset: () => void;
    getActiveCount: () => number;
}

export const RunLimiter: RunLimiterType = {
    canRun: () => activeRuns < MAX_RUNS,
    startRun: () => { activeRuns++; },
    endRun: () => {
        if (activeRuns > 0) {
            activeRuns--;
        }
    },
    reset: () => {
        activeRuns = 0;
    },
    getActiveCount: () => activeRuns
};
