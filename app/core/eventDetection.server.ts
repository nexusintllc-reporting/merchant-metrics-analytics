// import type { EventSummary } from '../types/analytics';

// export function calculateOrderEventSummary(order: any, periodStart: Date, periodEnd: Date): EventSummary | null {
//   const eventSummary: EventSummary = {
//     refunds: { count: 0, value: 0 },
//     exchanges: { count: 0, value: 0 },
//     partialRefunds: { count: 0, value: 0 },
//     totalEvents: 0,
//     netValue: 0
//   };

//   const orderRefunds = order.refunds || [];
//   let hasEvents = false;

//   orderRefunds.forEach((refund: any) => {
//     const refundDate = new Date(refund.created_at);
    
//     if (refundDate >= periodStart && refundDate <= periodEnd) {
//       let refundAmount = 0;
      
//       if (refund.transactions && refund.transactions.length > 0) {
//         refund.transactions.forEach((transaction: any) => {
//           if (transaction.kind === 'refund' && transaction.status === 'success') {
//             refundAmount += Math.abs(parseFloat(transaction.amount) || 0);
//           }
//         });
//       }

//       const isFullRefund = refundAmount === parseFloat(order.total_price);
//       const hasExchangeTags = order.tags?.includes('exchange') || order.note?.includes('exchange');
//       const hasMultipleFulfillments = order.fulfillments && order.fulfillments.length > 1;
//       const isExchange = hasExchangeTags || hasMultipleFulfillments;

//       if (isFullRefund && !isExchange) {
//         eventSummary.refunds.count++;
//         eventSummary.refunds.value -= refundAmount;
//       } else if (isExchange) {
//         eventSummary.exchanges.count++;
//         const exchangeValue = -refundAmount;
//         eventSummary.exchanges.value += exchangeValue;
//       } else {
//         eventSummary.partialRefunds.count++;
//         eventSummary.partialRefunds.value -= refundAmount;
//       }

//       eventSummary.totalEvents++;
//       eventSummary.netValue -= refundAmount;
//       hasEvents = true;
//     }
//   });

//   return hasEvents ? eventSummary : null;
// }

// export function mergeEventSummaries(a: EventSummary | null, b: EventSummary | null): EventSummary | null {
//   if (!a && !b) return null;
//   if (!a) return b;
//   if (!b) return a;
  
//   return {
//     refunds: {
//       count: a.refunds.count + b.refunds.count,
//       value: a.refunds.value + b.refunds.value
//     },
//     exchanges: {
//       count: a.exchanges.count + b.exchanges.count,
//       value: a.exchanges.value + b.exchanges.value
//     },
//     partialRefunds: {
//       count: a.partialRefunds.count + b.partialRefunds.count,
//       value: a.partialRefunds.value + b.partialRefunds.value
//     },
//     totalEvents: a.totalEvents + b.totalEvents,
//     netValue: a.netValue + b.netValue
//   };
// }




































// // eventDetection.server.ts
// import type { EventSummary } from '../types/analytics';

// // Helper to parse GraphQL money objects
// function parseMoneyAmount(moneySet: any): number {
//   if (!moneySet || !moneySet.shopMoney || !moneySet.shopMoney.amount) {
//     return 0;
//   }
//   return parseFloat(moneySet.shopMoney.amount) || 0;
// }

// // Helper to get refund line items array (handles both GraphQL and REST structures)
// function getRefundLineItemsArray(refund: any): any[] {
//   if (!refund) return [];
  
//   // GraphQL structure
//   if (refund.refundLineItems && refund.refundLineItems.edges && Array.isArray(refund.refundLineItems.edges)) {
//     return refund.refundLineItems.edges.map((edge: any) => edge.node);
//   }
  
//   // REST structure
//   if (Array.isArray(refund.refund_line_items)) {
//     return refund.refund_line_items;
//   }
  
//   return [];
// }

// export function calculateOrderEventSummary(order: any, periodStart: Date, periodEnd: Date): EventSummary | null {
//   const eventSummary: EventSummary = {
//     refunds: { count: 0, value: 0 },
//     exchanges: { count: 0, value: 0 },
//     partialRefunds: { count: 0, value: 0 },
//     totalEvents: 0,
//     netValue: 0
//   };

//   // Handle both GraphQL and REST refunds structure
//   const orderRefunds = order.refunds || [];
//   let hasEvents = false;

//   orderRefunds.forEach((refund: any) => {
//     // Use appropriate date field (GraphQL vs REST)
//     const refundDate = new Date(refund.createdAt || refund.created_at);
    
//     if (refundDate >= periodStart && refundDate <= periodEnd) {
//       let refundAmount = 0;
      
//       // Calculate refund amount (GraphQL vs REST)
//       if (refund.totalRefundedSet) {
//         // GraphQL structure
//         refundAmount = parseMoneyAmount(refund.totalRefundedSet);
//       } else if (refund.transactions && Array.isArray(refund.transactions)) {
//         // REST structure
//         refund.transactions.forEach((transaction: any) => {
//           if (transaction.kind === 'refund' && transaction.status === 'success') {
//             refundAmount += Math.abs(parseFloat(transaction.amount) || 0);
//           }
//         });
//       }

//       // Calculate total order amount for comparison (GraphQL vs REST)
//       let totalOrderAmount = 0;
//       if (order.currentTotalPriceSet) {
//         // GraphQL
//         totalOrderAmount = parseMoneyAmount(order.currentTotalPriceSet);
//       } else if (order.total_price) {
//         // REST
//         totalOrderAmount = parseFloat(order.total_price) || 0;
//       }

//       const isFullRefund = Math.abs(refundAmount - totalOrderAmount) < 0.01;
      
//       // Check for exchanges (GraphQL vs REST)
//       const hasExchangeTags = order.tags?.includes('exchange') || order.note?.includes('exchange');
//       const hasMultipleFulfillments = (order.fulfillments && order.fulfillments.nodes && order.fulfillments.nodes.length > 1) || 
//                                      (order.fulfillments && order.fulfillments.length > 1);
//       const isExchange = hasExchangeTags || hasMultipleFulfillments;

//       if (isFullRefund && !isExchange) {
//         eventSummary.refunds.count++;
//         eventSummary.refunds.value -= refundAmount;
//       } else if (isExchange) {
//         eventSummary.exchanges.count++;
//         const exchangeValue = -refundAmount;
//         eventSummary.exchanges.value += exchangeValue;
//       } else {
//         eventSummary.partialRefunds.count++;
//         eventSummary.partialRefunds.value -= refundAmount;
//       }

//       eventSummary.totalEvents++;
//       eventSummary.netValue -= refundAmount;
//       hasEvents = true;
//     }
//   });

//   return hasEvents ? eventSummary : null;
// }

// export function mergeEventSummaries(a: EventSummary | null, b: EventSummary | null): EventSummary | null {
//   if (!a && !b) return null;
//   if (!a) return b;
//   if (!b) return a;

//   return {
//     refunds: {
//       count: a.refunds.count + b.refunds.count,
//       value: a.refunds.value + b.refunds.value
//     },
//     exchanges: {
//       count: a.exchanges.count + b.exchanges.count,
//       value: a.exchanges.value + b.exchanges.value
//     },
//     partialRefunds: {
//       count: a.partialRefunds.count + b.partialRefunds.count,
//       value: a.partialRefunds.value + b.partialRefunds.value
//     },
//     totalEvents: a.totalEvents + b.totalEvents,
//     netValue: a.netValue + b.netValue
//   };
// }























// eventDetection.server.ts - FIXED VERSION
import type { EventSummary } from '../types/analytics';

// Helper to parse GraphQL money objects
function parseMoneyAmount(moneySet: any): number {
  if (!moneySet || !moneySet.shopMoney || !moneySet.shopMoney.amount) {
    return 0;
  }
  return parseFloat(moneySet.shopMoney.amount) || 0;
}

// Helper to get refund line items array (handles both GraphQL and REST structures)
function getRefundLineItemsArray(refund: any): any[] {
  if (!refund) return [];
  
  // GraphQL structure
  if (refund.refundLineItems && refund.refundLineItems.edges && Array.isArray(refund.refundLineItems.edges)) {
    return refund.refundLineItems.edges.map((edge: any) => edge.node);
  }
  
  // REST structure
  if (Array.isArray(refund.refund_line_items)) {
    return refund.refund_line_items;
  }
  
  return [];
}

// Helper to detect order modifications (new items added after original order)
function detectOrderModifications(order: any, periodStart: Date, periodEnd: Date): { 
  hasModifications: boolean; 
  modificationValue: number;
  addedItems: any[];
} {
  let hasModifications = false;
  let modificationValue = 0;
  const addedItems: any[] = [];

  // Check if order has multiple fulfillments with different dates (indicates modifications)
  const fulfillments = order.fulfillments?.nodes || order.fulfillments || [];
  
  if (fulfillments.length > 1) {
    const fulfillmentDates = fulfillments.map((f: any) => new Date(f.createdAt || f.created_at));
    const lateFulfillments = fulfillmentDates.filter((date: Date) => date >= periodStart && date <= periodEnd);
    
    if (lateFulfillments.length > 0) {
      hasModifications = true;
      // Estimate modification value based on later fulfillments
      // In a more sophisticated implementation, you'd track actual added line items
      modificationValue = parseMoneyAmount(order.currentTotalPriceSet) - parseMoneyAmount(order.subtotalPriceSet);
    }
  }

  // Check for order edit notes or tags
  const hasModificationNotes = order.note?.includes('added') || 
                              order.note?.includes('additional') || 
                              order.note?.includes('modified') ||
                              order.tags?.includes('modified') ||
                              order.tags?.includes('additional-items');

  if (hasModificationNotes) {
    hasModifications = true;
  }

  return { hasModifications, modificationValue, addedItems };
}

export function calculateOrderEventSummary(order: any, periodStart: Date, periodEnd: Date): EventSummary | null {
  const eventSummary: EventSummary = {
    refunds: { count: 0, value: 0 },
    exchanges: { count: 0, value: 0 },
    partialRefunds: { count: 0, value: 0 },
    modifications: { count: 0, value: 0 }, // Include modifications with default values
    totalEvents: 0,
    netValue: 0
  };

  // Handle both GraphQL and REST refunds structure
  const orderRefunds = order.refunds || [];
  let hasEvents = false;

  // 1. PROCESS REFUNDS & EXCHANGES (existing logic)
  orderRefunds.forEach((refund: any) => {
    // Use appropriate date field (GraphQL vs REST)
    const refundDate = new Date(refund.createdAt || refund.created_at);
    
    if (refundDate >= periodStart && refundDate <= periodEnd) {
      let refundAmount = 0;
      
      // Calculate refund amount (GraphQL vs REST)
      if (refund.totalRefundedSet) {
        // GraphQL structure
        refundAmount = parseMoneyAmount(refund.totalRefundedSet);
      } else if (refund.transactions && Array.isArray(refund.transactions)) {
        // REST structure
        refund.transactions.forEach((transaction: any) => {
          if (transaction.kind === 'refund' && transaction.status === 'success') {
            refundAmount += Math.abs(parseFloat(transaction.amount) || 0);
          }
        });
      }

      // Calculate total order amount for comparison (GraphQL vs REST)
      let totalOrderAmount = 0;
      if (order.currentTotalPriceSet) {
        // GraphQL
        totalOrderAmount = parseMoneyAmount(order.currentTotalPriceSet);
      } else if (order.total_price) {
        // REST
        totalOrderAmount = parseFloat(order.total_price) || 0;
      }

      const isFullRefund = Math.abs(refundAmount - totalOrderAmount) < 0.01;
      
      // Check for exchanges (GraphQL vs REST)
      const hasExchangeTags = order.tags?.includes('exchange') || order.note?.includes('exchange');
      const hasMultipleFulfillments = (order.fulfillments && order.fulfillments.nodes && order.fulfillments.nodes.length > 1) || 
                                     (order.fulfillments && order.fulfillments.length > 1);
      const isExchange = hasExchangeTags || hasMultipleFulfillments;

      if (isFullRefund && !isExchange) {
        eventSummary.refunds.count++;
        eventSummary.refunds.value -= refundAmount;
      } else if (isExchange) {
        eventSummary.exchanges.count++;
        const exchangeValue = -refundAmount;
        eventSummary.exchanges.value += exchangeValue;
      } else {
        eventSummary.partialRefunds.count++;
        eventSummary.partialRefunds.value -= refundAmount;
      }

      eventSummary.totalEvents++;
      eventSummary.netValue -= refundAmount;
      hasEvents = true;
    }
  });

  // 2. DETECT ORDER MODIFICATIONS (NEW LOGIC)
  const { hasModifications, modificationValue } = detectOrderModifications(order, periodStart, periodEnd);
  
  if (hasModifications && modificationValue > 0) {
    // Make sure modifications exists before accessing it
    if (!eventSummary.modifications) {
      eventSummary.modifications = { count: 0, value: 0 };
    }
    eventSummary.modifications.count++;
    eventSummary.modifications.value += modificationValue;
    eventSummary.totalEvents++;
    eventSummary.netValue += modificationValue; // Positive value for additions
    hasEvents = true;
  }

  return hasEvents ? eventSummary : null;
}

export function mergeEventSummaries(a: EventSummary | null, b: EventSummary | null): EventSummary | null {
  if (!a && !b) return null;
  if (!a) return b;
  if (!b) return a;

  const result: EventSummary = {
    refunds: {
      count: a.refunds.count + b.refunds.count,
      value: a.refunds.value + b.refunds.value
    },
    exchanges: {
      count: a.exchanges.count + b.exchanges.count,
      value: a.exchanges.value + b.exchanges.value
    },
    partialRefunds: {
      count: a.partialRefunds.count + b.partialRefunds.count,
      value: a.partialRefunds.value + b.partialRefunds.value
    },
    totalEvents: a.totalEvents + b.totalEvents,
    netValue: a.netValue + b.netValue
  };

  // Handle modifications if they exist in either summary
  const aModifications = a.modifications || { count: 0, value: 0 };
  const bModifications = b.modifications || { count: 0, value: 0 };
  
  if (aModifications.count > 0 || bModifications.count > 0) {
    result.modifications = {
      count: aModifications.count + bModifications.count,
      value: aModifications.value + bModifications.value
    };
  }

  return result;
}
