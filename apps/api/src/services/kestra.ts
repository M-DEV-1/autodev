import axios from 'axios';

export class KestraService {
    private baseUrl: string;

    constructor() {
        this.baseUrl = process.env.KESTRA_URL || 'http://localhost:8080';
    }

    async triggerWorkflow(namespace: string, flowId: string, inputs: Record<string, any> = {}) {
        try {
            const webhookUrl = `${this.baseUrl}/api/v1/executions/webhook/${namespace}/${flowId}/${process.env.KESTRA_WEBHOOK_KEY || 'secret'}`;
            const response = await axios.post(webhookUrl, inputs);
            console.log(`[Kestra] Triggered ${namespace}.${flowId}:`, response.data.id);
            return response.data;
        } catch (error: any) {
            console.error('[Kestra] Trigger Failed:', error.message);
            // Don't throw to prevent crashing the agent loop, just return error
            return { error: error.message };
        }
    }
}
