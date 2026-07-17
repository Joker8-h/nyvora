// ============================================
// NYVORA EVENT SYSTEM
// ============================================

import { EventEmitter } from 'events';

// ============================================
// EVENT TYPES
// ============================================

export interface DomainEvent {
  id: string;
  type: string;
  aggregateId: string;
  aggregateType: string;
  payload: Record<string, any>;
  metadata?: EventMetadata;
  timestamp: Date;
  version: number;
}

export interface EventMetadata {
  userId?: string;
  workspaceId?: string;
  correlationId?: string;
  causationId?: string;
}

export interface EventSubscription {
  eventType: string;
  handler: (event: DomainEvent) => Promise<void>;
  options?: EventSubscriptionOptions;
}

export interface EventSubscriptionOptions {
  priority?: number;
  retryCount?: number;
  retryDelay?: number;
}

// ============================================
// EVENT BUS
// ============================================

class EventBus {
  private emitter: EventEmitter;
  private subscriptions: Map<string, EventSubscription[]>;
  private eventHistory: DomainEvent[];

  constructor() {
    this.emitter = new EventEmitter();
    this.subscriptions = new Map();
    this.eventHistory = [];
    this.emitter.setMaxListeners(100);
  }

  /**
   * Publish a domain event
   */
  async publish(event: DomainEvent): Promise<void> {
    this.eventHistory.push(event);

    // Keep only last 1000 events in memory
    if (this.eventHistory.length > 1000) {
      this.eventHistory = this.eventHistory.slice(-1000);
    }

    const subscriptions = this.subscriptions.get(event.type) || [];
    const sortedSubscriptions = subscriptions.sort(
      (a, b) => (a.options?.priority || 0) - (b.options?.priority || 0)
    );

    for (const subscription of sortedSubscriptions) {
      try {
        await subscription.handler(event);
      } catch (error) {
        console.error(`Error in event handler for ${event.type}:`, error);

        // Retry logic
        if (subscription.options?.retryCount && subscription.options.retryCount > 0) {
          await this.retrySubscription(subscription, event, subscription.options.retryCount);
        }
      }
    }

    this.emitter.emit(event.type, event);
  }

  /**
   * Subscribe to an event type
   */
  subscribe(
    eventType: string,
    handler: (event: DomainEvent) => Promise<void>,
    options?: EventSubscriptionOptions
  ): () => void {
    const subscription: EventSubscription = {
      eventType,
      handler,
      options,
    };

    const subscriptions = this.subscriptions.get(eventType) || [];
    subscriptions.push(subscription);
    this.subscriptions.set(eventType, subscriptions);

    // Return unsubscribe function
    return () => {
      const subs = this.subscriptions.get(eventType) || [];
      const index = subs.indexOf(subscription);
      if (index > -1) {
        subs.splice(index, 1);
      }
    };
  }

  /**
   * Subscribe to multiple event types
   */
  subscribeToMany(
    eventTypes: string[],
    handler: (event: DomainEvent) => Promise<void>,
    options?: EventSubscriptionOptions
  ): () => void {
    const unsubscribers = eventTypes.map((type) =>
      this.subscribe(type, handler, options)
    );

    return () => {
      unsubscribers.forEach((unsub) => unsub());
    };
  }

  /**
   * Get event history
   */
  getHistory(limit?: number): DomainEvent[] {
    return limit ? this.eventHistory.slice(-limit) : [...this.eventHistory];
  }

  /**
   * Clear event history
   */
  clearHistory(): void {
    this.eventHistory = [];
  }

  /**
   * Get subscription count for an event type
   */
  getSubscriptionCount(eventType: string): number {
    return (this.subscriptions.get(eventType) || []).length;
  }

  /**
   * Retry a subscription handler
   */
  private async retrySubscription(
    subscription: EventSubscription,
    event: DomainEvent,
    retriesLeft: number
  ): Promise<void> {
    const delay = subscription.options?.retryDelay || 1000;

    await new Promise((resolve) => setTimeout(resolve, delay));

    try {
      await subscription.handler(event);
    } catch (error) {
      if (retriesLeft > 1) {
        await this.retrySubscription(subscription, event, retriesLeft - 1);
      }
    }
  }
}

// Singleton instance
export const eventBus = new EventBus();

// ============================================
// EVENT FACTORY
// ============================================

export class EventFactory {
  private static idCounter = 0;

  static create<T extends Record<string, any>>(
    type: string,
    aggregateId: string,
    aggregateType: string,
    payload: T,
    metadata?: EventMetadata
  ): DomainEvent {
    return {
      id: `evt_${Date.now()}_${++EventFactory.idCounter}`,
      type,
      aggregateId,
      aggregateType,
      payload,
      metadata,
      timestamp: new Date(),
      version: 1,
    };
  }

  static createUserCreated(
    userId: string,
    userData: Record<string, any>,
    metadata?: EventMetadata
  ): DomainEvent {
    return this.create('user.created', userId, 'User', userData, metadata);
  }

  static createWorkspaceCreated(
    workspaceId: string,
    workspaceData: Record<string, any>,
    metadata?: EventMetadata
  ): DomainEvent {
    return this.create('workspace.created', workspaceId, 'Workspace', workspaceData, metadata);
  }

  static createOrganizationCreated(
    organizationId: string,
    organizationData: Record<string, any>,
    metadata?: EventMetadata
  ): DomainEvent {
    return this.create('organization.created', organizationId, 'Organization', organizationData, metadata);
  }

  static createCustomerCreated(
    customerId: string,
    customerData: Record<string, any>,
    metadata?: EventMetadata
  ): DomainEvent {
    return this.create('customer.created', customerId, 'Customer', customerData, metadata);
  }

  static createInvoiceCreated(
    invoiceId: string,
    invoiceData: Record<string, any>,
    metadata?: EventMetadata
  ): DomainEvent {
    return this.create('invoice.created', invoiceId, 'Invoice', invoiceData, metadata);
  }

  static createInvoicePaid(
    invoiceId: string,
    paymentData: Record<string, any>,
    metadata?: EventMetadata
  ): DomainEvent {
    return this.create('invoice.paid', invoiceId, 'Invoice', paymentData, metadata);
  }

  static createStockUpdated(
    productId: string,
    stockData: Record<string, any>,
    metadata?: EventMetadata
  ): DomainEvent {
    return this.create('stock.updated', productId, 'Product', stockData, metadata);
  }

  static createAgentToolCalled(
    toolCallId: string,
    toolCallData: Record<string, any>,
    metadata?: EventMetadata
  ): DomainEvent {
    return this.create('agent.tool_called', toolCallId, 'Agent', toolCallData, metadata);
  }
}

// ============================================
// EVENT HANDLERS (Example usage)
// ============================================

// Example: Listen for customer created events
eventBus.subscribe('customer.created', async (event) => {
  console.log('Customer created:', event.payload);
  // Send welcome email, update analytics, etc.
});

// Example: Listen for invoice paid events
eventBus.subscribe('invoice.paid', async (event) => {
  console.log('Invoice paid:', event.payload);
  // Update inventory, send receipt, update accounting
});

// Example: Listen for stock low events
eventBus.subscribe('stock.low', async (event) => {
  console.log('Stock low:', event.payload);
  // Send notification to manager, create purchase order
});