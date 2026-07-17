# Architecture Decision Records (ADRs)

This directory contains the Architecture Decision Records for the Nexora project.

## What is an ADR?

An Architecture Decision Record (ADR) is a document that captures an important architectural decision together with its context and consequences.

## ADR Format

Each ADR follows this format:

```markdown
# ADR-[Number]: [Title]

## Status

[Proposed | Accepted | Deprecated | Superseded]

## Context

[What is the issue that we're seeing that is motivating this decision or change?]

## Decision

[What is the change that we're proposing and/or doing?]

## Consequences

[What becomes easier or more difficult to do because of this change?]

## Alternatives Considered

[What other options were considered?]
```

## List of ADRs

| ADR | Title | Status |
|-----|-------|--------|
| [001](./001-modular-monolith.md) | Modular Monolith Architecture | Accepted |
| [002](./002-multi-tenant-hierarchy.md) | Multi-tenant Hierarchy | Accepted |
| [003](./003-rbac-abac-authorization.md) | RBAC + ABAC Authorization | Accepted |
| [004](./004-event-driven-architecture.md) | Event-driven Architecture | Accepted |
| [005](./005-ai-orchestrator.md) | AI Orchestrator (Nova) | Accepted |
| [006](./006-dark-first-design-system.md) | Dark-first Design System | Accepted |