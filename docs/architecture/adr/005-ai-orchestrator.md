# ADR-005: AI Orchestrator (Nova)

## Status

Accepted

## Context

Nexora's core differentiator is AI-first experience. Nova, the AI assistant, needs to:
- Understand user intent in natural language
- Execute complex multi-step workflows
- Access all business modules
- Learn from interactions
- Provide real-time responses

## Decision

We will implement a **custom AI Orchestrator** called Nova:

### Nova Pipeline

```
User Message
    ↓
1. PLANNER - Break down objective into steps
    ↓
2. CONTEXT BUILDER - Gather relevant context
    ↓
3. REASONER - Evaluate and decide next actions
    ↓
4. TOOL SELECTOR - Match intent to available tools
    ↓
5. EXECUTOR - Execute tools and collect results
    ↓
6. RESPONDER - Generate natural language response
    ↓
7. MEMORY - Store conversation and learn
```

### Tool System

```typescript
interface NovaToolImplementation {
  name: string;
  description: string;
  inputSchema: JSONSchema;
  execute: (input: any, context: NovaToolContext) => Promise<any>;
  requiredPermissions?: string[];
}

// Example tools
const novaTools = [
  // CRM
  createCustomerTool,
  findCustomerTool,
  updateCustomerTool,

  // Sales
  createQuoteTool,
  createInvoiceTool,
  findProductTool,

  // Operations
  scheduleMeetingTool,
  createTaskTool,

  // Analytics
  getSalesReportTool,
  getInventoryReportTool,
];
```

### OpenAI Integration

```typescript
// Use OpenAI Responses API
const response = await openai.chat.completions.create({
  model: 'gpt-4',
  messages: [
    { role: 'system', content: NOVA_SYSTEM_PROMPT },
    { role: 'user', content: userMessage },
  ],
  tools: novaTools.map(tool => ({
    type: 'function',
    function: {
      name: tool.name,
      description: tool.description,
      parameters: tool.inputSchema,
    },
  })),
  tool_choice: 'auto',
});
```

### Memory System

```typescript
interface NovaMemory {
  // Short-term: Current conversation
  conversationHistory: NovaMessage[];

  // Long-term: User preferences and patterns
  userPreferences: Record<string, any>;
  frequentActions: string[];
  recentEntities: string[];
}
```

## Consequences

### Positive
- **Custom Control**: Full control over AI behavior
- **Domain Specific**: Tools tailored for business operations
- **Privacy**: No data sent to third parties (except OpenAI)
- **Extensibility**: Easy to add new tools
- **Cost Control**: Optimize token usage

### Negative
- **Development Effort**: Building custom orchestrator is complex
- **Maintenance**: Need to maintain tool implementations
- **Quality**: AI responses depend on tool implementations
- **Token Costs**: OpenAI API costs scale with usage

### Mitigations
- **Start Simple**: Basic orchestrator, iterate based on usage
- **Tool Validation**: Validate inputs before execution
- **Cost Monitoring**: Track and limit API usage
- **Fallback**: Graceful degradation when AI fails

## Alternatives Considered

### 1. LangChain
- **Pros**: Pre-built components, community
- **Cons**: Abstraction overhead, limited control
- **Verdict**: Too much magic, we need control

### 2. Direct OpenAI API
- **Pros**: Simplest integration
- **Cons**: No orchestration, limited tool support
- **Verdict**: Too basic for complex workflows

### 3. AutoGPT-style Agent
- **Pros**: Autonomous goal achievement
- **Cons**: Unpredictable, expensive, slow
- **Verdict**: Too risky for business operations

## References

- [OpenAI Responses API](https://platform.openai.com/docs/guides/function-calling)
- [Anthropic Tool Use](https://docs.anthropic.com/claude/docs/tool-use)
- [LangGraph](https://langchain-ai.github.io/langgraph/)