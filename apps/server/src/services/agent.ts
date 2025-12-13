export class AgentService {
    async planTask(prompt: string) {
        return {
            steps: [
                { id: 1, description: 'Analyze request' },
                { id: 2, description: 'Generate code' },
                { id: 3, description: 'Verify changes' }
            ],
            summary: `Planned task for: ${prompt}`
        };
    }
}
