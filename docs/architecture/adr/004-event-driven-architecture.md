# ADR-004: Event-driven Architecture

## Status

Accepted

## Context

Nexora has multiple modules that need to communicate with each other:
- CRM creates a customer → Inventory needs to know
- Sales creates an invoice → Finance needs to update accounts
- HR creates an employee → Notifications need to be sent
- Any module creates data → Analytics needs to update

Direct method calls create tight coupling between modules.

## Decision

We will use an **event-driven architecture** with in-process event bus:

### Event Types

```typescript
// Domain Events
const DOMAIN_EVENTS = {
  // Auth events
  USER_CREATED: 'user.created',
  USER_UPDATED: 'user.updated',
  USER_DELETED: 'user.deleted',
  USER_LOGGED_IN: 'user.logged_in',

  // Workspace events
  WORKSPACE_CREATED: 'workspace.created',
  WORKSPACE_MEMBER_ADDED: 'workspace.member_added',

  // CRM events
  CUSTOMER_CREATED: 'customer.created',
  CUSTOMER_UPDATED: 'customer.updated',
  DEAL_STAGE_CHANGED: 'deal.stage_changed',

  // Sales events
  INVOICE_CREATED: 'invoice.created',
  INVOICE_PAID: 'invoice.paid',
  PAYMENT_RECEIVED: 'payment.received',

  // Inventory events
  STOCK_UPDATED: 'stock.updated',
  STOCK_LOW: 'stock.low',

  // AI events
  AGENT_TOOL_CALLED: 'agent.tool_called',
  AGENT_COMPLETED: 'agent.completed',

  // Automation events
  FLOW_EXECUTED: 'flow.executed',
  FLOW_COMPLETED: 'flow.completed',
};
```

### Event Bus Implementation

```typescript
// packages/shared/src/lib/events.ts
class EventBus {
  private emitter: EventEmitter;
  private subscriptions: Map<string, EventSubscription[]>;

  async publish(event: DomainEvent): Promise<void> {
    const subscriptions = this.subscriptions.get(event.type) || [];

    for (const subscription of subscriptions) {
      try {
        await subscription.handler(event);
      } catch (error) {
        console.error(`Error in event handler for ${event.type}:`, error);
        // Retry logic here
      }
    }

    this.emitter.emit(event.type, event);
  }

  subscribe(
    eventType: string,
    handler: (event: DomainEvent) => Promise<void>,
    options?: { priority?: number; retryCount?: number }
  ): () => void {
    // Subscribe and return unsubscribe function
  }
}

export const eventBus = new EventBus();
```

### Event Usage Example

```typescript
// In CRM module - publishing event
@EventPublisher('customer.created')
async createCustomer(data: CreateCustomerInput) {
  const customer = await this.prisma.customer.create({ data });

  await eventBus.publish(
    EventFactory.createCustomerCreated(customer.id, customer)
  );

  return customer;
}

// In Analytics module - subscribing to event
@EventHandler('customer.created')
async onCustomerCreated(event: DomainEvent) {
  await this.analyticsService.trackEvent('customer_created', event.payload);
  await this.dashboardService.refreshMetrics(event.payload.workspaceId);
}
```

### Event Schema

```typescript
interface DomainEvent {
  id: string;
  type: string;
  aggregateId: string;
  aggregateType: string;
  payload: Record<string, any>;
  metadata?: {
    userId?: string;
    workspaceId?: string;
    correlationId?: string;
    causationId?: string;
  };
  timestamp: Date;
  version: number;
}
```

## Consequences

### Positive
- **Loose Coupling**: Modules don't know about each other
- **Scalability**: Easy to add new consumers
- **Auditability**: Complete event log
- **Replayability**: Can replay events for debugging
- **Async Processing**: Non-blocking operations

### Negative
- **Eventual Consistency**: Data may be temporarily inconsistent
- **Debugging Complexity**: Hard to trace event flows
- **Event Ordering**: Events may arrive out of order
- **Error Handling**: Failed events need retry/DLQ logic

### Mitigations
- **Correlation IDs**: Track event flows across modules
- **Idempotent Handlers**: Handle duplicate events gracefully
- **Event Sourcing**: Store events for replay capability
- **Monitoring**: Track event processing metrics

## Migration Path

When Nexora needs to scale beyond a single process:

1. **Phase 1**: Keep in-process EventEmitter
2. **Phase 2**: Add Redis Pub/Sub for cross-process communication
3. **Phase 3**: Migrate to Kafka for high-throughput event streaming
4. **Phase 4**: Consider Event Sourcing for critical domains

## References

- [Event-Driven Architecture](https://martinfowler.com/articles/201701-event-driven.html)
- [Event Sourcing](https://martinfowler.com/eaaDev/EventSourcing.html)
- [Kafka vs RabbitMQ](https://www.confluent.io/kafka-vs-rabbitmq/)