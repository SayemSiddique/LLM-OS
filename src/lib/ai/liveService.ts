import OpenAI from 'openai';

class LiveAIService {
  private openai: OpenAI | null = null;
  private isInitialized = false;

  constructor() {
    this.initializeAPI();
  }

  private initializeAPI() {
    const apiKey = process.env.OPENAI_API_KEY || process.env.NEXT_PUBLIC_OPENAI_API_KEY;
    
    if (apiKey && apiKey !== 'your_openai_api_key') {
      this.openai = new OpenAI({
        apiKey,
        dangerouslyAllowBrowser: true // For client-side usage
      });
      this.isInitialized = true;
    } else {
      console.warn('OpenAI API key not found. Using demo mode.');
    }
  }

  async chat(message: string, context: string[] = []): Promise<string> {
    if (!this.isInitialized || !this.openai) {
      return this.getDemoResponse(message);
    }

    try {
      const messages = [
        {
          role: 'system' as const,
          content: `You are LLM-OS, an advanced AI operating system assistant. You help users with:
          - System operations and monitoring
          - Code generation and analysis
          - Creative writing and brainstorming
          - Research and information synthesis
          - App management and productivity
          
          Respond in a helpful, technical, and professional manner. Keep responses concise but informative.`
        },
        ...context.map(msg => ({
          role: 'user' as const,
          content: msg
        })),
        {
          role: 'user' as const,
          content: message
        }
      ];

      const completion = await this.openai.chat.completions.create({
        model: 'gpt-4',
        messages: messages,
        max_tokens: 1000,
        temperature: 0.7,
        stream: false
      });

      return completion.choices[0]?.message?.content || 'I apologize, but I couldn\'t generate a response.';
    } catch (error) {
      console.error('OpenAI API error:', error);
      return this.getDemoResponse(message);
    }
  }

  async streamChat(
    message: string, 
    context: string[] = [],
    onChunk: (chunk: string) => void
  ): Promise<void> {
    if (!this.isInitialized || !this.openai) {
      // Simulate streaming for demo
      const demoResponse = this.getDemoResponse(message);
      const words = demoResponse.split(' ');
      
      for (let i = 0; i < words.length; i++) {
        await new Promise(resolve => setTimeout(resolve, 50));
        onChunk(words.slice(0, i + 1).join(' '));
      }
      return;
    }

    try {
      const messages = [
        {
          role: 'system' as const,
          content: `You are LLM-OS, an advanced AI operating system assistant. Provide helpful, technical responses.`
        },
        ...context.map(msg => ({
          role: 'user' as const,
          content: msg
        })),
        {
          role: 'user' as const,
          content: message
        }
      ];

      const stream = await this.openai.chat.completions.create({
        model: 'gpt-4',
        messages: messages,
        max_tokens: 1000,
        temperature: 0.7,
        stream: true
      });

      let fullResponse = '';
      for await (const chunk of stream) {
        const content = chunk.choices[0]?.delta?.content || '';
        fullResponse += content;
        onChunk(fullResponse);
      }
    } catch (error) {
      console.error('OpenAI streaming error:', error);
      const demoResponse = this.getDemoResponse(message);
      onChunk(demoResponse);
    }
  }

  private getDemoResponse(message: string): string {
    const lowerMessage = message.toLowerCase();
    
    if (lowerMessage.includes('react') || lowerMessage.includes('component')) {
      return `🚀 **React Component Generated**

\`\`\`tsx
import React, { useState } from 'react';
import { BarChart3, TrendingUp } from 'lucide-react';

interface DashboardCardProps {
  title: string;
  value: number;
  trend: number;
}

export function DashboardCard({ title, value, trend }: DashboardCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  
  return (
    <div 
      className="bg-background-card border border-background-border rounded-xl p-6 hover:border-primary/50 transition-all"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-foreground">{title}</h3>
        <BarChart3 className="w-5 h-5 text-primary" />
      </div>
      
      <div className="flex items-center space-x-2">
        <span className="text-2xl font-bold text-foreground">{value.toLocaleString()}</span>
        <div className="flex items-center text-green-500">
          <TrendingUp className="w-4 h-4 mr-1" />
          <span className="text-sm">+{trend}%</span>
        </div>
      </div>
    </div>
  );
}
\`\`\`

This modern dashboard card includes hover effects, proper TypeScript types, and responsive design. Ready to use in your LLM-OS interface! ✨`;
    }
    
    if (lowerMessage.includes('system') || lowerMessage.includes('performance')) {
      return `📊 **System Analysis Complete**

**Current System Status:**
- CPU Usage: 23% (Optimal)
- Memory: 8.2GB / 16GB (51%)
- Disk I/O: 145 MB/s (Normal)
- Network: 45ms latency (Good)

**Performance Insights:**
✅ System running efficiently
✅ No memory leaks detected
✅ Background processes optimized
⚠️ Consider clearing browser cache (2.3GB)

**Recommendations:**
1. Enable hardware acceleration for better graphics performance
2. Close unused tabs to free up memory
3. Update to latest LLM-OS version for 15% performance boost

**Predicted Performance:** 📈 95% efficiency maintained for next 4 hours`;
    }
    
    if (lowerMessage.includes('ai') || lowerMessage.includes('breakthrough')) {
      return `🧠 **Latest AI Breakthroughs Analysis**

**Revolutionary Developments in 2025:**

1. **Multimodal Integration**: AI systems now seamlessly process text, images, audio, and video simultaneously, enabling more natural human-computer interaction.

2. **Autonomous Agent Networks**: Self-coordinating AI agents can now collaborate on complex tasks without human intervention, as demonstrated in LLM-OS's multi-agent architecture.

3. **Real-time Learning**: Advanced memory systems allow AI to learn and adapt during conversations, providing increasingly personalized experiences.

4. **Quantum-Classical Hybrid Computing**: Integration of quantum processors with classical systems enables breakthrough performance in optimization and cryptography.

**Impact on Computing:**
- Natural language becomes the primary interface
- AI-first operating systems like LLM-OS lead the transformation
- Human-AI collaboration reaches new levels of sophistication

The future is happening now! 🚀`;
    }
    
    if (lowerMessage.includes('product') || lowerMessage.includes('description')) {
      return `✨ **LLM-OS: Redefining the Future of Computing**

*The World's First AI-Native Operating System*

**Transform your organization with LLM-OS** - the revolutionary platform that makes artificial intelligence as intuitive as breathing. Built for visionary leaders who demand cutting-edge technology, LLM-OS delivers:

🧠 **Intelligent by Design**: Natural language commands replace complex interfaces
🛡️ **Enterprise-Grade Security**: Quantum encryption and bio-authentication 
⚡ **Lightning Performance**: Multi-agent orchestration handles complex workflows
🎨 **Stunning Experience**: Holographic interfaces and neural visualizations
🔗 **Seamless Integration**: Works with your existing tools and processes

**"LLM-OS doesn't just run applications - it thinks with you."**

Perfect for tech leaders, innovative teams, and organizations ready to embrace the AI revolution. Experience computing reimagined.

*Ready to lead the future? LLM-OS is ready for you.*`;
    }
    
    if (lowerMessage.includes('collaboration') || lowerMessage.includes('future')) {
      return `🤝 **The Future of Human-AI Collaboration**

**Key Trends Reshaping Work:**

1. **Augmented Intelligence**: AI amplifies human capabilities rather than replacing them
2. **Contextual AI Partners**: Systems that understand project context and team dynamics
3. **Adaptive Learning**: AI that evolves with your workflow and preferences
4. **Seamless Integration**: Natural conversation replaces traditional interfaces

**Research Insights:**
- 85% productivity increase when humans and AI collaborate effectively
- Decision-making accuracy improves by 40% with AI augmentation
- Creative output triples with AI-assisted brainstorming

**LLM-OS Implementation:**
✅ Multi-agent orchestration mirrors team collaboration
✅ Natural language interface eliminates friction
✅ Contextual memory maintains project continuity
✅ Adaptive learning personalizes the experience

The future belongs to organizations that master human-AI partnerships. LLM-OS is your gateway to this transformation. 🚀`;
    }
    
    if (lowerMessage.includes('launch') || lowerMessage.includes('dashboard')) {
      return `🚀 **Dashboard Launched Successfully!**

**System Metrics Overview:**
- Applications: 12 running, 3 background
- Performance: 94% optimal
- Memory: 7.2GB available
- Network: Connected, 45ms latency

**Quick Actions Available:**
✅ View detailed analytics
✅ Manage running processes  
✅ Configure system settings
✅ Access AI assistant

Navigate to the Dashboard view to see real-time visualizations and metrics. Your LLM-OS experience is fully optimized! 📊`;
    }
    
    // Default response
    return `🤖 **LLM-OS Assistant Ready**

I understand you're asking about "${message}". Here's what I can help you with:

**Core Capabilities:**
- 💻 Code generation and analysis
- 📊 System monitoring and optimization  
- ✨ Creative writing and brainstorming
- 🔍 Research and information synthesis
- 🚀 App management and workflows

**Try asking me to:**
- "Create a React component"
- "Analyze system performance" 
- "Research AI trends"
- "Generate a product description"
- "Launch an application"

How can I assist you further? I'm designed to make your computing experience more intelligent and intuitive! 🌟`;
  }

  isApiConnected(): boolean {
    return this.isInitialized;
  }

  getDemoModeStatus(): string {
    return this.isInitialized 
      ? "🟢 Live AI Connected" 
      : "🟡 Demo Mode (Add OpenAI API key for live AI)";
  }
}

export const liveAIService = new LiveAIService();
