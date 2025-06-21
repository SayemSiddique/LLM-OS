# LLM Operating System

An experimental LLM Operating System prototype that provides a GUI shell for natural-language-powered "prompt apps" and AI agent orchestration.

## 🌟 Vision

This project implements Andrej Karpathy's vision of LLMs as new operating systems, where natural language becomes the programming interface and AI agents operate with varying levels of autonomy under human supervision.

## 🏗️ Architecture

```
┌─ User Interface Layer ─────────────────┐
│  • Chat Terminal (LLM Shell)           │
│  • App Launcher (Prompt Apps)          │
│  • Autonomy Slider (Agent Control)     │
│  • Visual Verifier (Diff Viewer)       │
└─────────────────────────────────────────┘
┌─ Application Layer ────────────────────┐
│  • Prompt App Engine                   │
│  • Agent Orchestrator                  │
│  • User Settings & Profiles            │
└─────────────────────────────────────────┘
┌─ Middleware & Runtime Layer ───────────┐
│  • LLM API Interface                   │
│  • Tool Interface                      │
│  • Memory Manager                      │
│  • Prompt Compiler                     │
└─────────────────────────────────────────┘
┌─ LLM Kernel Layer ─────────────────────┐
│  • LLM Runtime Core                    │
│  • Context Window Manager              │
│  • Tool Invocation Engine              │
│  • Security & Sandboxing               │
└─────────────────────────────────────────┘
```

## 🚀 Features

- **LLM Shell**: Terminal-like interface for direct AI interaction
- **Prompt Apps**: Executable prompt templates with metadata and tools
- **Autonomy Slider**: 4-level agent independence control (Suggest → Full Auto)
- **Visual Verifier**: GUI for auditing AI-generated changes
- **Agent Memory**: Persistent context and vector-based memory
- **Real-time Sync**: Firebase-powered real-time updates

## 🛠️ Tech Stack

- **Frontend**: Next.js 14, React 18, TypeScript
- **Styling**: Tailwind CSS with custom LLM-OS theme
- **Backend**: Firebase (Firestore, Auth, Functions)
- **State**: Zustand for complex agent state management
- **LLM APIs**: OpenAI, OpenRouter integration
- **Memory**: Vector database integration ready

## 📁 Project Structure

```
/llm-os
├── src/
│   ├── app/                    # Next.js app router
│   │   ├── page.tsx           # Main OS interface
│   │   ├── apps/              # Dynamic prompt app views
│   │   └── layout.tsx         # Root layout
│   ├── components/            # React components
│   │   ├── shell/             # Terminal/Shell components
│   │   ├── launcher/          # App launcher components
│   │   ├── autonomy/          # Autonomy slider components
│   │   ├── verifier/          # Visual diff components
│   │   └── common/            # Shared components
│   ├── lib/                   # Core libraries
│   │   ├── firebase.ts        # Firebase configuration
│   │   ├── llm/               # LLM integration
│   │   ├── agents/            # Agent orchestration
│   │   └── store/             # State management
│   ├── types/                 # TypeScript type definitions
│   └── styles/                # Global styles
├── apps/                      # Prompt app definitions
├── functions/                 # Firebase cloud functions
└── public/                    # Static assets
```

## 🎯 Autonomy Levels

| Level | Name | Behavior | Use Case |
|-------|------|----------|----------|
| 1 | Suggest Only | AI provides suggestions, human executes | Learning, high-stakes tasks |
| 2 | Execute with Approval | AI executes after human confirmation | Standard workflows |
| 3 | Autonomous with Oversight | AI executes, human monitors | Trusted automation |
| 4 | Full Autonomous | AI operates independently | Background tasks |

## 🚦 Getting Started

1. **Clone and Install**
   ```bash
   git clone <repo-url>
   cd llm-os
   npm install
   ```

2. **Environment Setup**
   ```bash
   cp .env.example .env.local
   # Edit .env.local with your API keys
   ```

3. **Firebase Setup**
   ```bash
   npm run firebase:init
   # Follow Firebase CLI setup
   ```

4. **Development**
   ```bash
   npm run dev
   # Open http://localhost:3000
   ```

## 🔧 Configuration

### Firebase Setup
1. Create a Firebase project
2. Enable Firestore, Authentication, and Functions
3. Copy configuration to `.env.local`

### LLM API Setup
1. Get OpenAI API key from https://platform.openai.com
2. Optional: Get OpenRouter key for multiple LLM access
3. Add keys to `.env.local`

## 📱 Prompt Apps

Prompt apps are defined as JSON/YAML files with:

```typescript
interface LLMApp {
  id: string;
  name: string;
  description: string;
  promptTemplate: string;
  tools: string[];
  autonomyLevels: Record<string, AutonomyConfig>;
  ui_components: string[];
}
```

Example apps:
- **Writer AI**: Content creation and editing
- **Code Assistant**: Programming help with diff viewer
- **Research Agent**: Web search and synthesis
- **Task Planner**: Project planning and management

## 🎨 Design System

Custom Tailwind theme with:
- Dark-first LLM-OS aesthetic
- Terminal-inspired typography
- Autonomy level color coding
- Smooth animations and transitions
- Glass-morphism effects

## 🔒 Security

- Firebase Authentication integration
- Prompt injection protection
- Sandboxed agent execution
- Audit logging for all agent actions
- User permission management

## 🚧 Roadmap

- [ ] **Phase 1**: Core UI and Firebase integration
- [ ] **Phase 2**: LLM API integration and prompt apps
- [ ] **Phase 3**: Agent orchestration and autonomy
- [ ] **Phase 4**: Visual verification and memory
- [ ] **Phase 5**: Advanced features and deployment

## 🤝 Contributing

This is an experimental project exploring the future of human-AI interaction. Contributions welcome!

## 📄 License

MIT License - see LICENSE file for details.

---

> "We're programming computers in English now. This is remarkable." - Andrej Karpathy

Built with ❤️ for the future of AI-human collaboration.
