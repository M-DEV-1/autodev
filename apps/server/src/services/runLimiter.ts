let activeRuns = 0;
const MAX_RUNS = 1;

export const RunLimiter = {
    canRun: () => activeRuns < MAX_RUNS,
    startRun: () => { activeRuns++; },
    endRun: () => { activeRuns = Math.max(0, activeRuns - 1); },
    getActiveCount: () => activeRuns
};
