import axios from 'axios';

export class AgentService {
    private apiKey: string;
    private baseUrl = 'https://api.together.xyz/v1/chat/completions';

    constructor() {
        this.apiKey = process.env.TOGETHER_API_KEY || '';
    }

    async planTask(prompt: string) {
        if (!this.apiKey) {
            console.warn('TOGETHER_API_KEY not set. Returning mock plan.');
            return [
                { id: 1, type: 'shell', command: 'echo "Mock Plan Step 1"' },
                { id: 2, type: 'cline', command: 'Scaffold basic structure' }
            ];
        }

        try {
            const response = await axios.post(
                this.baseUrl,
                {
                    model: 'meta-llama/Llama-3-70b-chat-hf',
                    messages: [
                        {
                            role: 'system',
                            content: 'You are an expert software architect. Return a JSON array of steps.'
                        },
                        {
                            role: 'user',
                            content: prompt
                        }
                    ],
                    response_format: { type: 'json_object' }
                },
                { headers: { Authorization: `Bearer ${this.apiKey}` } }
            );

            return JSON.parse(response.data.choices[0].message.content);
        } catch (error) {
            console.error('TogetherAI Plan Failed:', error);
            throw error;
        }
    }
}
