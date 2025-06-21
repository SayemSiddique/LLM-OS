// Real LLM Integration Service
export class LLMService {
  private model: string = 'gpt-4';

  async sendMessage(
    message: string, 
    context: string[] = [],
    systemPrompt?: string
  ): Promise<{
    content: string;
    tokens: number;
    model: string;
  }> {
    try {
      const response = await fetch('/api/llm/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message,
          context,
          systemPrompt,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `HTTP ${response.status}`);
      }

      const data = await response.json();
      return {
        content: data.content,
        tokens: data.tokens,
        model: data.model,
      };
    } catch (error) {
      console.error('LLM API Error:', error);
      throw new Error(`LLM service failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
  async streamMessage(
    message: string,
    onChunk: (chunk: string) => void,
    context: string[] = [],
    systemPrompt?: string
  ): Promise<void> {
    // For now, use regular message and simulate streaming
    try {
      const result = await this.sendMessage(message, context, systemPrompt);
      
      // Simulate streaming by sending chunks
      const words = result.content.split(' ');
      for (let i = 0; i < words.length; i++) {
        const chunk = words[i] + (i < words.length - 1 ? ' ' : '');
        onChunk(chunk);
        await new Promise(resolve => setTimeout(resolve, 50));
      }
    } catch (error) {
      console.error('LLM Streaming Error:', error);
      throw error;
    }
  }

  setModel(model: string) {
    this.model = model;
  }

  getAvailableModels(): string[] {
    return ['gpt-4', 'gpt-4-turbo', 'gpt-3.5-turbo'];
  }
}
