// // import type { OrderStats, EventSummary } from '../types/analytics';
// // import { calculateOrderEventSummary, mergeEventSummaries } from './eventDetection.server';

// // export function processSimpleOrder(order: any): OrderStats {
// //   const grossSales = parseFloat(order.total_line_items_price) || 0;
// //   const totalDiscounts = Math.abs(parseFloat(order.total_discounts) || 0);
// //   const shipping = parseFloat(order.total_shipping_price_set?.shop_money?.amount || "0") || 0;
// //   const taxes = parseFloat(order.current_total_tax) || 0;
// //   const totalSales = parseFloat(order.current_total_price) || 0;
  
// //   const itemsCount = order.line_items?.reduce((sum: number, li: any) => sum + li.quantity, 0) || 0;
// //   const fulfilledCount = order.fulfillment_status === "fulfilled" ? 1 : 0;
// //   const unfulfilledCount = order.fulfillment_status !== "fulfilled" ? 1 : 0;

// //   return {
// //     total: parseFloat(grossSales.toFixed(2)),
// //     discounts: parseFloat(totalDiscounts.toFixed(2)),
// //     returns: 0,
// //     netSales: parseFloat((grossSales - totalDiscounts).toFixed(2)),
// //     shipping: parseFloat(shipping.toFixed(2)),
// //     taxes: parseFloat(taxes.toFixed(2)),
// //     extraFees: 0,
// //     totalSales: parseFloat(totalSales.toFixed(2)),
// //     shippingRefunds: 0,
// //     netReturns: 0,
// //     totalRefund: 0,
    
// //     items: itemsCount,
// //     fulfilled: fulfilledCount,
// //     unfulfilled: unfulfilledCount,
// //     orderCount: 1,
    
// //     discountsReturned: 0,
// //     netDiscounts: parseFloat(totalDiscounts.toFixed(2)),
// //     returnShippingCharges: 0,
// //     restockingFees: 0,
// //     returnFees: 0,
// //     refundDiscrepancy: 0,
    
// //     hasSubsequentEvents: false,
// //     eventSummary: null,
// //     refundsCount: 0,
// //     financialStatus: order.financial_status || 'pending'
// //   };
// // }

// // export function processOrderToStats(order: any): OrderStats {
// //   const hasRefunds = order.refunds && order.refunds.length > 0;
// //   const hasComplexFulfillment = order.fulfillments && order.fulfillments.length > 1;
// //   const hasExchangeTags = order.tags?.includes('exchange') || order.note?.includes('exchange');
  
// //   if (!hasRefunds && !hasComplexFulfillment && !hasExchangeTags) {
// //     return processSimpleOrder(order);
// //   }

// //   const grossSales = parseFloat(order.total_line_items_price) || 0;
// //   const totalDiscounts = Math.abs(parseFloat(order.total_discounts) || 0);
// //   const originalShipping = parseFloat(order.total_shipping_price_set?.shop_money?.amount || "0") || 0;
// //   const taxes = parseFloat(order.current_total_tax) || 0;
// //   const totalSales = parseFloat(order.current_total_price) || 0;

// //   let grossReturns = 0;
// //   let discountsReturned = 0;
// //   let shippingRefunds = 0;
// //   let returnShippingCharges = 0;
// //   let restockingFees = 0;
// //   let returnFees = 0;
// //   let positiveAdjustments = 0;
// //   let totalItemRefunds = 0;
// //   let totalActualRefund = 0;
// //   let extraFees = 0;
// //   let refundDiscrepancy = 0;
// //   let netReturns = 0;

// //   let isExchangeOrder = false;
// //   let exchangeItemValue = 0;

// //   const orderRefunds = order.refunds || [];

// //   if (orderRefunds.length > 0) {
// //     for (let i = 0; i < orderRefunds.length; i++) {
// //       const refund = orderRefunds[i];
      
// //       if (refund.transactions && refund.transactions.length > 0) {
// //         for (let j = 0; j < refund.transactions.length; j++) {
// //           const transaction = refund.transactions[j];
// //           if (transaction.kind === 'refund' && transaction.status === 'success') {
// //             const refundAmount = Math.abs(parseFloat(transaction.amount) || 0);
// //             totalActualRefund += refundAmount;
// //             netReturns += refundAmount;
// //           }
// //         }
// //       }

// //       if (refund.refund_line_items) {
// //         for (let j = 0; j < refund.refund_line_items.length; j++) {
// //           const item = refund.refund_line_items[j];
// //           const itemValue = Math.abs(parseFloat(item.subtotal) || 0);
// //           grossReturns -= itemValue;
// //           totalItemRefunds += itemValue;
          
// //           const lineItemDiscount = parseFloat(item.total_discount) || 0;
// //           discountsReturned += Math.abs(lineItemDiscount);
// //         }
// //       }
      
// //       if (refund.order_adjustments && refund.order_adjustments.length > 0) {
// //         for (let j = 0; j < refund.order_adjustments.length; j++) {
// //           const adjustment = refund.order_adjustments[j];
// //           const amount = parseFloat(adjustment.amount) || 0;
// //           const absAmount = Math.abs(amount);
          
// //           if (adjustment.kind === 'shipping_refund') {
// //             shippingRefunds += amount;
// //           }
// //           else if (adjustment.kind === 'return_shipping' || adjustment.reason?.includes('shipping')) {
// //             returnShippingCharges += absAmount;
// //           }
// //           else if (adjustment.kind === 'restocking_fee' || adjustment.reason?.includes('restock')) {
// //             restockingFees += absAmount;
// //           }
// //           else if (adjustment.kind === 'return_fee' || adjustment.reason?.includes('fee')) {
// //             returnFees += absAmount;
// //           }
// //           else if (adjustment.kind === 'refund_discrepancy') {
// //             refundDiscrepancy += amount;
// //             if (amount > 0) {
// //               positiveAdjustments += absAmount;
// //             } else if (amount < 0) {
// //               grossReturns += amount;
// //             }
// //           }
// //         }
// //       }
      
// //       if (refund.total_additional_fees_set) {
// //         const additionalFees = parseFloat(refund.total_additional_fees_set?.shop_money?.amount || "0") || 0;
// //         returnFees += additionalFees;
// //       }
// //     }
// //   }

// //   const shopifyReturns = grossReturns + positiveAdjustments - discountsReturned;
// //   const totalRefund = shopifyReturns + refundDiscrepancy;
// //   const isFullRefund = Math.abs(grossSales + shopifyReturns) < 0.01;

// //   const netDiscounts = totalDiscounts - discountsReturned;
// //   const shippingCharges = Math.max(0, originalShipping - Math.abs(shippingRefunds));

// //   let netSales;
// //   let adjustedTotalSales = totalSales;

// //   if (orderRefunds.length > 0) {
// //     const hasMultipleFulfillments = order.fulfillments && order.fulfillments.length > 1;
    
// //     if (hasMultipleFulfillments) {
// //       isExchangeOrder = true;
      
// //       if (order.line_items) {
// //         for (let i = 0; i < order.line_items.length; i++) {
// //           const item = order.line_items[i];
// //           let isRefunded = false;
          
// //           if (orderRefunds[0]?.refund_line_items) {
// //             for (let j = 0; j < orderRefunds[0].refund_line_items.length; j++) {
// //               const refundItem = orderRefunds[0].refund_line_items[j];
// //               if (refundItem.line_item_id === item.id) {
// //                 isRefunded = true;
// //                 break;
// //               }
// //             }
// //           }
          
// //           if (!isRefunded && item.fulfillment_status === 'fulfilled') {
// //             const itemPrice = parseFloat(item.price) || 0;
// //             const itemQuantity = item.current_quantity || item.quantity || 0;
// //             exchangeItemValue += itemPrice * itemQuantity;
// //           }
// //         }
// //       }
// //     }
    
// //     if (!isExchangeOrder) {
// //       const hasExchangeTags = order.tags?.includes('exchange') || 
// //                              order.note?.includes('exchange') ||
// //                              order.note?.includes('exchanged');
// //       const hasComplexRefundHistory = orderRefunds.length > 1;
      
// //       if (hasExchangeTags || hasComplexRefundHistory) {
// //         isExchangeOrder = true;
        
// //         if (order.line_items) {
// //           for (let i = 0; i < order.line_items.length; i++) {
// //             const item = order.line_items[i];
// //             if (item.fulfillment_status === 'fulfilled') {
// //               const itemPrice = parseFloat(item.price) || 0;
// //               const itemQuantity = item.current_quantity || item.quantity || 0;
// //               exchangeItemValue += itemPrice * itemQuantity;
// //             }
// //           }
// //         }
// //       }
// //     }
// //   }

// //   if (isFullRefund && orderRefunds.length > 0) {
// //     netSales = 0;
// //   } else {
// //     netSales = grossSales - netDiscounts + shopifyReturns + returnShippingCharges + restockingFees - refundDiscrepancy;
// //   }

// //   let appliedFunction = 'none';

// //   if (isFullRefund && isExchangeOrder && orderRefunds.length > 0) {
// //     extraFees = Math.max(0, Math.abs(totalSales) - exchangeItemValue);
// //     appliedFunction = 'full_refund_with_exchange';
// //   }
// //   else if (isFullRefund && orderRefunds.length > 0) {
// //     extraFees = Math.abs(totalSales);
// //     appliedFunction = 'full_refund_no_exchange';
// //   } 
// //   else if (isExchangeOrder && !isFullRefund) {
// //     extraFees = Math.max(0, totalSales - shippingCharges - netSales);
// //     appliedFunction = 'exchange_partial';
// //   }
// //   else if (isExchangeOrder && !isFullRefund && totalItemRefunds > 0 && totalActualRefund > 0) {
// //     const refundDifference = totalItemRefunds - totalActualRefund;
// //     if (refundDifference > 0.01) {
// //       extraFees = Math.max(0, refundDifference - exchangeItemValue);
// //       appliedFunction = 'partial_refund_with_exchange';
// //     }
// //   }
// //   else if (!isFullRefund && totalItemRefunds > 0 && totalActualRefund > 0) {
// //     const refundDifference = totalItemRefunds - totalActualRefund;
// //     if (refundDifference > 0.01) {
// //       extraFees = refundDifference;
// //       appliedFunction = 'regular_partial_refund';
// //     }
// //   }

// //   if (isFullRefund && orderRefunds.length > 0) {
// //     adjustedTotalSales = extraFees;
// //   }

// //   const shouldApplyCatchAll = 
// //     Math.abs(netSales) < 0.01 &&
// //     totalSales > 0.01 &&
// //     Math.abs(extraFees - (totalSales - shippingCharges)) > 0.01;

// //   if (shouldApplyCatchAll) {
// //     extraFees = Math.max(0, totalSales - shippingCharges);
// //     appliedFunction = 'final_catch_all_override';
// //   }

// //   if (refundDiscrepancy < -0.01) {
// //     adjustedTotalSales = Math.max(0, adjustedTotalSales + refundDiscrepancy);
// //   }

// //   const orderDate = new Date(order.created_at);
// //   const periodStart = new Date(orderDate.getFullYear(), orderDate.getMonth(), orderDate.getDate());
// //   const periodEnd = new Date(periodStart);
// //   periodEnd.setDate(periodStart.getDate() + 1);
  
// //   const eventSummary = calculateOrderEventSummary(order, periodStart, periodEnd);

// //   const itemsCount = order.line_items?.reduce((sum: number, li: any) => sum + li.quantity, 0) || 0;
// //   const fulfilledCount = order.fulfillment_status === "fulfilled" ? 1 : 0;
// //   const unfulfilledCount = order.fulfillment_status !== "fulfilled" ? 1 : 0;

// //   return {
// //     total: parseFloat(grossSales.toFixed(2)),
// //     discounts: parseFloat(totalDiscounts.toFixed(2)),
// //     returns: parseFloat(shopifyReturns.toFixed(2)),
// //     netSales: parseFloat(netSales.toFixed(2)),
// //     shipping: parseFloat(shippingCharges.toFixed(2)),
// //     taxes: parseFloat(taxes.toFixed(2)),
// //     extraFees: parseFloat(extraFees.toFixed(2)),
// //     totalSales: parseFloat(adjustedTotalSales.toFixed(2)),
// //     shippingRefunds: parseFloat(Math.abs(shippingRefunds).toFixed(2)),
// //     netReturns: parseFloat(netReturns.toFixed(2)),
// //     totalRefund: parseFloat(totalRefund.toFixed(2)),
    
// //     items: itemsCount,
// //     fulfilled: fulfilledCount,
// //     unfulfilled: unfulfilledCount,
// //     orderCount: 1,
    
// //     discountsReturned: parseFloat(discountsReturned.toFixed(2)),
// //     netDiscounts: parseFloat(netDiscounts.toFixed(2)),
// //     returnShippingCharges: parseFloat(returnShippingCharges.toFixed(2)),
// //     restockingFees: parseFloat(restockingFees.toFixed(2)),
// //     returnFees: parseFloat(returnFees.toFixed(2)),
// //     refundDiscrepancy: parseFloat(refundDiscrepancy.toFixed(2)),
    
// //     hasSubsequentEvents: !!eventSummary,
// //     eventSummary: eventSummary,
// //     refundsCount: orderRefunds.length,
// //     financialStatus: order.financial_status || 'pending'
// //   };
// // }

// // export function mergeStats(existing: OrderStats, newStats: OrderStats): OrderStats {
// //   return {
// //     total: existing.total + newStats.total,
// //     discounts: existing.discounts + newStats.discounts,
// //     returns: existing.returns + newStats.returns,
// //     netSales: existing.netSales + newStats.netSales,
// //     shipping: existing.shipping + newStats.shipping,
// //     taxes: existing.taxes + newStats.taxes,
// //     extraFees: existing.extraFees + newStats.extraFees,
// //     totalSales: existing.totalSales + newStats.totalSales,
// //     shippingRefunds: existing.shippingRefunds + newStats.shippingRefunds,
// //     netReturns: existing.netReturns + newStats.netReturns,
// //     totalRefund: existing.totalRefund + newStats.totalRefund,
    
// //     items: existing.items + newStats.items,
// //     fulfilled: existing.fulfilled + newStats.fulfilled,
// //     unfulfilled: existing.unfulfilled + newStats.unfulfilled,
// //     orderCount: existing.orderCount + newStats.orderCount,
    
// //     discountsReturned: (existing.discountsReturned || 0) + (newStats.discountsReturned || 0),
// //     netDiscounts: (existing.netDiscounts || 0) + (newStats.netDiscounts || 0),
// //     returnShippingCharges: (existing.returnShippingCharges || 0) + (newStats.returnShippingCharges || 0),
// //     restockingFees: (existing.restockingFees || 0) + (newStats.restockingFees || 0),
// //     returnFees: (existing.returnFees || 0) + (newStats.returnFees || 0),
// //     refundDiscrepancy: (existing.refundDiscrepancy || 0) + (newStats.refundDiscrepancy || 0),
    
// //     hasSubsequentEvents: existing.hasSubsequentEvents || newStats.hasSubsequentEvents,
// //     eventSummary: mergeEventSummaries(existing.eventSummary, newStats.eventSummary),
// //     refundsCount: existing.refundsCount + newStats.refundsCount,
// //     financialStatus: newStats.financialStatus
// //   };
// // }

































// // financialCalculator.server.ts
// import type { OrderStats, EventSummary } from '../types/analytics';
// import { calculateOrderEventSummary, mergeEventSummaries } from './eventDetection.server';

// // Helper function to parse GraphQL money objects
// function parseMoneyAmount(moneySet: any): number {
//   if (!moneySet || !moneySet.shopMoney || !moneySet.shopMoney.amount) {
//     return 0;
//   }
//   return parseFloat(moneySet.shopMoney.amount) || 0;
// }

// // Helper function to calculate total from line items (handles both GraphQL and REST structures)
// function calculateLineItemsTotal(lineItems: any): number {
//   if (!lineItems) return 0;
  
//   // Handle GraphQL structure (edges array)
//   if (lineItems.edges && Array.isArray(lineItems.edges)) {
//     return lineItems.edges.reduce((total: number, edge: any) => {
//       const node = edge.node;
//       const quantity = node.quantity || 0;
//       const unitPrice = parseMoneyAmount(node.originalUnitPriceSet) || parseMoneyAmount(node.discountedUnitPriceSet) || 0;
//       return total + (quantity * unitPrice);
//     }, 0);
//   }
  
//   // Handle REST structure (direct array)
//   if (Array.isArray(lineItems)) {
//     return lineItems.reduce((total: number, item: any) => {
//       const quantity = item.quantity || 0;
//       const unitPrice = parseFloat(item.price) || 0;
//       return total + (quantity * unitPrice);
//     }, 0);
//   }
  
//   return 0;
// }

// // Helper to get line items array (handles both structures)
// function getLineItemsArray(lineItems: any): any[] {
//   if (!lineItems) return [];
  
//   // GraphQL structure
//   if (lineItems.edges && Array.isArray(lineItems.edges)) {
//     return lineItems.edges.map((edge: any) => edge.node);
//   }
  
//   // REST structure
//   if (Array.isArray(lineItems)) {
//     return lineItems;
//   }
  
//   return [];
// }

// // Helper to get refund line items array (handles both structures)
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

// export function processSimpleOrder(order: any): OrderStats {
//   // Use GraphQL field names with fallback to REST
//   const grossSales = calculateLineItemsTotal(order.lineItems) || parseMoneyAmount(order.subtotalPriceSet) || parseFloat(order.total_line_items_price) || 0;
//   const totalDiscounts = Math.abs(parseMoneyAmount(order.totalDiscountsSet) || parseFloat(order.total_discounts) || 0);
//   const shipping = parseMoneyAmount(order.totalShippingPriceSet) || parseFloat(order.total_shipping_price_set?.shop_money?.amount || "0") || 0;
//   const taxes = parseMoneyAmount(order.currentTotalTaxSet) || parseFloat(order.current_total_tax) || 0;
//   const totalSales = parseMoneyAmount(order.currentTotalPriceSet) || parseFloat(order.current_total_price) || 0;

//   // Calculate items count from line items
//   const lineItemsArray = getLineItemsArray(order.lineItems);
//   const itemsCount = lineItemsArray.reduce((sum: number, item: any) => {
//     return sum + (item.quantity || 0);
//   }, 0);

//   // Handle both GraphQL and REST fulfillment status
//   const fulfillmentStatus = order.displayFulfillmentStatus || order.fulfillment_status;
//   const fulfilledCount = fulfillmentStatus === "FULFILLED" || fulfillmentStatus === "fulfilled" ? 1 : 0;
//   const unfulfilledCount = !fulfilledCount ? 1 : 0;

//   return {
//     total: parseFloat(grossSales.toFixed(2)),
//     discounts: parseFloat(totalDiscounts.toFixed(2)),
//     returns: 0,
//     netSales: parseFloat((grossSales - totalDiscounts).toFixed(2)),
//     shipping: parseFloat(shipping.toFixed(2)),
//     taxes: parseFloat(taxes.toFixed(2)),
//     extraFees: 0,
//     totalSales: parseFloat(totalSales.toFixed(2)),
//     shippingRefunds: 0,
//     netReturns: 0,
//     totalRefund: 0,
//     items: itemsCount,
//     fulfilled: fulfilledCount,
//     unfulfilled: unfulfilledCount,
//     orderCount: 1,
//     discountsReturned: 0,
//     netDiscounts: parseFloat(totalDiscounts.toFixed(2)),
//     returnShippingCharges: 0,
//     restockingFees: 0,
//     returnFees: 0,
//     refundDiscrepancy: 0,
//     hasSubsequentEvents: false,
//     eventSummary: null,
//     refundsCount: 0,
//     financialStatus: order.displayFinancialStatus || order.financial_status || 'pending'
//   };
// }

// export function processOrderToStats(order: any): OrderStats {
//   const hasRefunds = order.refunds && order.refunds.length > 0;
//   const hasComplexFulfillment = (order.fulfillments && order.fulfillments.nodes && order.fulfillments.nodes.length > 1) || 
//                                 (order.fulfillments && order.fulfillments.length > 1);
//   const hasExchangeTags = order.tags?.includes('exchange') || order.note?.includes('exchange');

//   if (!hasRefunds && !hasComplexFulfillment && !hasExchangeTags) {
//     return processSimpleOrder(order);
//   }

//   // Use GraphQL field names with REST fallbacks
//   const grossSales = calculateLineItemsTotal(order.lineItems) || parseMoneyAmount(order.subtotalPriceSet) || parseFloat(order.total_line_items_price) || 0;
//   const totalDiscounts = Math.abs(parseMoneyAmount(order.totalDiscountsSet) || parseFloat(order.total_discounts) || 0);
//   const originalShipping = parseMoneyAmount(order.totalShippingPriceSet) || parseFloat(order.total_shipping_price_set?.shop_money?.amount || "0") || 0;
//   const taxes = parseMoneyAmount(order.currentTotalTaxSet) || parseFloat(order.current_total_tax) || 0;
//   const totalSales = parseMoneyAmount(order.currentTotalPriceSet) || parseFloat(order.current_total_price) || 0;

//   let grossReturns = 0;
//   let discountsReturned = 0;
//   let shippingRefunds = 0;
//   let returnShippingCharges = 0;
//   let restockingFees = 0;
//   let returnFees = 0;
//   let positiveAdjustments = 0;
//   let totalItemRefunds = 0;
//   let totalActualRefund = 0;
//   let extraFees = 0;
//   let refundDiscrepancy = 0;
//   let netReturns = 0;
//   let isExchangeOrder = false;
//   let exchangeItemValue = 0;

//   // Process refunds (handle both GraphQL and REST)
//   const orderRefunds = order.refunds || [];
//   if (orderRefunds.length > 0) {
//     for (let i = 0; i < orderRefunds.length; i++) {
//       const refund = orderRefunds[i];
      
//       // Total refunded amount (GraphQL vs REST)
//       const refundAmount = parseMoneyAmount(refund.totalRefundedSet) || parseFloat(refund.total_refunded_set?.shop_money?.amount) || 0;
//       totalActualRefund += refundAmount;
//       netReturns += refundAmount;

//       // Process refund line items
//       const refundLineItems = getRefundLineItemsArray(refund);
//       for (let j = 0; j < refundLineItems.length; j++) {
//         const item = refundLineItems[j];
//         const itemValue = Math.abs(parseMoneyAmount(item.subtotalSet) || parseFloat(item.subtotal) || 0);
//         grossReturns -= itemValue;
//         totalItemRefunds += itemValue;
//       }

//       // Process returns data (GraphQL specific)
//       if (order.returns && order.returns.nodes) {
//         for (let j = 0; j < order.returns.nodes.length; j++) {
//           const returnNode = order.returns.nodes[j];
          
//           // Restocking fees
//           if (returnNode.returnLineItems && returnNode.returnLineItems.nodes) {
//             for (let k = 0; k < returnNode.returnLineItems.nodes.length; k++) {
//               const returnLineItem = returnNode.returnLineItems.nodes[k];
//               if (returnLineItem.restockingFee) {
//                 restockingFees += parseMoneyAmount(returnLineItem.restockingFee.amountSet);
//               }
//             }
//           }
          
//           // Return shipping fees
//           if (returnNode.returnShippingFees) {
//             returnShippingCharges += parseMoneyAmount(returnNode.returnShippingFees.amountSet);
//           }
//         }
//       }
//     }
//   }

//   // Shipping refunds (GraphQL vs REST)
//   shippingRefunds = parseMoneyAmount(order.totalRefundedShippingSet) || 0;

//   // Refund discrepancy (GraphQL vs REST)
//   refundDiscrepancy = parseMoneyAmount(order.refundDiscrepancySet) || 0;

//   const shopifyReturns = grossReturns + positiveAdjustments - discountsReturned;
//   const totalRefund = shopifyReturns + refundDiscrepancy;
//   const isFullRefund = Math.abs(grossSales + shopifyReturns) < 0.01;
//   const netDiscounts = totalDiscounts - discountsReturned;
//   const shippingCharges = Math.max(0, originalShipping - Math.abs(shippingRefunds));

//   let netSales;
//   let adjustedTotalSales = totalSales;

//   if (orderRefunds.length > 0) {
//     const hasMultipleFulfillments = (order.fulfillments && order.fulfillments.nodes && order.fulfillments.nodes.length > 1) || 
//                                    (order.fulfillments && order.fulfillments.length > 1);
    
//     if (hasMultipleFulfillments) {
//       isExchangeOrder = true;
//       // Calculate exchange value from fulfilled line items
//       const lineItemsArray = getLineItemsArray(order.lineItems);
//       for (let i = 0; i < lineItemsArray.length; i++) {
//         const item = lineItemsArray[i];
//         let isRefunded = false;
        
//         // Check if item was refunded
//         for (let j = 0; j < orderRefunds.length; j++) {
//           const refundLineItems = getRefundLineItemsArray(orderRefunds[j]);
//           for (let k = 0; k < refundLineItems.length; k++) {
//             const refundItem = refundLineItems[k];
//             const refundItemId = refundItem.lineItem?.id || refundItem.line_item_id;
//             if (refundItemId === item.id) {
//               isRefunded = true;
//               break;
//             }
//           }
//           if (isRefunded) break;
//         }
        
//         if (!isRefunded) {
//           const itemPrice = parseMoneyAmount(item.originalUnitPriceSet) || parseFloat(item.price) || 0;
//           const itemQuantity = item.quantity || 0;
//           exchangeItemValue += itemPrice * itemQuantity;
//         }
//       }
//     }

//     if (!isExchangeOrder) {
//       const hasExchangeTags = order.tags?.includes('exchange') || order.note?.includes('exchange') || order.note?.includes('exchanged');
//       const hasComplexRefundHistory = orderRefunds.length > 1;
      
//       if (hasExchangeTags || hasComplexRefundHistory) {
//         isExchangeOrder = true;
//         const lineItemsArray = getLineItemsArray(order.lineItems);
//         for (let i = 0; i < lineItemsArray.length; i++) {
//           const item = lineItemsArray[i];
//           const fulfillmentStatus = item.fulfillment_status || 'unfulfilled';
//           if (fulfillmentStatus === 'fulfilled') {
//             const itemPrice = parseMoneyAmount(item.originalUnitPriceSet) || parseFloat(item.price) || 0;
//             const itemQuantity = item.quantity || 0;
//             exchangeItemValue += itemPrice * itemQuantity;
//           }
//         }
//       }
//     }
//   }

//   if (isFullRefund && orderRefunds.length > 0) {
//     netSales = 0;
//   } else {
//     netSales = grossSales - netDiscounts + shopifyReturns + returnShippingCharges + restockingFees - refundDiscrepancy;
//   }

//   let appliedFunction = 'none';

//   if (isFullRefund && isExchangeOrder && orderRefunds.length > 0) {
//     extraFees = Math.max(0, Math.abs(totalSales) - exchangeItemValue);
//     appliedFunction = 'full_refund_with_exchange';
//   } else if (isFullRefund && orderRefunds.length > 0) {
//     extraFees = Math.abs(totalSales);
//     appliedFunction = 'full_refund_no_exchange';
//   } else if (isExchangeOrder && !isFullRefund) {
//     extraFees = Math.max(0, totalSales - shippingCharges - netSales);
//     appliedFunction = 'exchange_partial';
//   } else if (isExchangeOrder && !isFullRefund && totalItemRefunds > 0 && totalActualRefund > 0) {
//     const refundDifference = totalItemRefunds - totalActualRefund;
//     if (refundDifference > 0.01) {
//       extraFees = Math.max(0, refundDifference - exchangeItemValue);
//       appliedFunction = 'partial_refund_with_exchange';
//     }
//   } else if (!isFullRefund && totalItemRefunds > 0 && totalActualRefund > 0) {
//     const refundDifference = totalItemRefunds - totalActualRefund;
//     if (refundDifference > 0.01) {
//       extraFees = refundDifference;
//       appliedFunction = 'regular_partial_refund';
//     }
//   }

//   if (isFullRefund && orderRefunds.length > 0) {
//     adjustedTotalSales = extraFees;
//   }

//   const shouldApplyCatchAll = Math.abs(netSales) < 0.01 && totalSales > 0.01 && Math.abs(extraFees - (totalSales - shippingCharges)) > 0.01;
//   if (shouldApplyCatchAll) {
//     extraFees = Math.max(0, totalSales - shippingCharges);
//     appliedFunction = 'final_catch_all_override';
//   }

//   if (refundDiscrepancy < -0.01) {
//     adjustedTotalSales = Math.max(0, adjustedTotalSales + refundDiscrepancy);
//   }

//   // Use appropriate date field (GraphQL vs REST)
//   const orderDate = new Date(order.createdAt || order.created_at);
//   const periodStart = new Date(orderDate.getFullYear(), orderDate.getMonth(), orderDate.getDate());
//   const periodEnd = new Date(periodStart);
//   periodEnd.setDate(periodStart.getDate() + 1);

//   const eventSummary = calculateOrderEventSummary(order, periodStart, periodEnd);

//   // Calculate items count
//   const lineItemsArray = getLineItemsArray(order.lineItems);
//   const itemsCount = lineItemsArray.reduce((sum: number, item: any) => {
//     return sum + (item.quantity || 0);
//   }, 0);

//   // Handle both GraphQL and REST fulfillment status
//   const fulfillmentStatus = order.displayFulfillmentStatus || order.fulfillment_status;
//   const fulfilledCount = fulfillmentStatus === "FULFILLED" || fulfillmentStatus === "fulfilled" ? 1 : 0;
//   const unfulfilledCount = !fulfilledCount ? 1 : 0;

//   return {
//     total: parseFloat(grossSales.toFixed(2)),
//     discounts: parseFloat(totalDiscounts.toFixed(2)),
//     returns: parseFloat(shopifyReturns.toFixed(2)),
//     netSales: parseFloat(netSales.toFixed(2)),
//     shipping: parseFloat(shippingCharges.toFixed(2)),
//     taxes: parseFloat(taxes.toFixed(2)),
//     extraFees: parseFloat(extraFees.toFixed(2)),
//     totalSales: parseFloat(adjustedTotalSales.toFixed(2)),
//     shippingRefunds: parseFloat(Math.abs(shippingRefunds).toFixed(2)),
//     netReturns: parseFloat(netReturns.toFixed(2)),
//     totalRefund: parseFloat(totalRefund.toFixed(2)),
//     items: itemsCount,
//     fulfilled: fulfilledCount,
//     unfulfilled: unfulfilledCount,
//     orderCount: 1,
//     discountsReturned: parseFloat(discountsReturned.toFixed(2)),
//     netDiscounts: parseFloat(netDiscounts.toFixed(2)),
//     returnShippingCharges: parseFloat(returnShippingCharges.toFixed(2)),
//     restockingFees: parseFloat(restockingFees.toFixed(2)),
//     returnFees: parseFloat(returnFees.toFixed(2)),
//     refundDiscrepancy: parseFloat(refundDiscrepancy.toFixed(2)),
//     hasSubsequentEvents: !!eventSummary,
//     eventSummary: eventSummary,
//     refundsCount: orderRefunds.length,
//     financialStatus: order.displayFinancialStatus || order.financial_status || 'pending'
//   };
// }

// // The mergeStats function remains the same
// export function mergeStats(existing: OrderStats, newStats: OrderStats): OrderStats {
//   return {
//     total: existing.total + newStats.total,
//     discounts: existing.discounts + newStats.discounts,
//     returns: existing.returns + newStats.returns,
//     netSales: existing.netSales + newStats.netSales,
//     shipping: existing.shipping + newStats.shipping,
//     taxes: existing.taxes + newStats.taxes,
//     extraFees: existing.extraFees + newStats.extraFees,
//     totalSales: existing.totalSales + newStats.totalSales,
//     shippingRefunds: existing.shippingRefunds + newStats.shippingRefunds,
//     netReturns: existing.netReturns + newStats.netReturns,
//     totalRefund: existing.totalRefund + newStats.totalRefund,
//     items: existing.items + newStats.items,
//     fulfilled: existing.fulfilled + newStats.fulfilled,
//     unfulfilled: existing.unfulfilled + newStats.unfulfilled,
//     orderCount: existing.orderCount + newStats.orderCount,
//     discountsReturned: (existing.discountsReturned || 0) + (newStats.discountsReturned || 0),
//     netDiscounts: (existing.netDiscounts || 0) + (newStats.netDiscounts || 0),
//     returnShippingCharges: (existing.returnShippingCharges || 0) + (newStats.returnShippingCharges || 0),
//     restockingFees: (existing.restockingFees || 0) + (newStats.restockingFees || 0),
//     returnFees: (existing.returnFees || 0) + (newStats.returnFees || 0),
//     refundDiscrepancy: (existing.refundDiscrepancy || 0) + (newStats.refundDiscrepancy || 0),
//     hasSubsequentEvents: existing.hasSubsequentEvents || newStats.hasSubsequentEvents,
//     eventSummary: mergeEventSummaries(existing.eventSummary, newStats.eventSummary),
//     refundsCount: existing.refundsCount + newStats.refundsCount,
//     financialStatus: newStats.financialStatus
//   };
// }
















































// core/financialCalculator.server.ts
import type { OrderStats, EventSummary } from '../types/analytics';
import { calculateOrderEventSummary, mergeEventSummaries } from './eventDetection.server';

// Helper function to parse GraphQL money objects
function parseMoneyAmount(moneySet: any): number {
  if (!moneySet || !moneySet.shopMoney || !moneySet.shopMoney.amount) {
    return 0;
  }
  return parseFloat(moneySet.shopMoney.amount) || 0;
}

// Helper function to calculate total from line items (handles both GraphQL and REST structures)
function calculateLineItemsTotal(lineItems: any): number {
  if (!lineItems) return 0;
  
  // Handle GraphQL structure (edges array)
  if (lineItems.edges && Array.isArray(lineItems.edges)) {
    return lineItems.edges.reduce((total: number, edge: any) => {
      const node = edge.node;
      const quantity = node.quantity || 0;
      const unitPrice = parseMoneyAmount(node.originalUnitPriceSet) || parseMoneyAmount(node.discountedUnitPriceSet) || 0;
      return total + (quantity * unitPrice);
    }, 0);
  }
  
  // Handle REST structure (direct array)
  if (Array.isArray(lineItems)) {
    return lineItems.reduce((total: number, item: any) => {
      const quantity = item.quantity || 0;
      const unitPrice = parseFloat(item.price) || 0;
      return total + (quantity * unitPrice);
    }, 0);
  }
  
  return 0;
}

// Helper to get line items array (handles both structures)
function getLineItemsArray(lineItems: any): any[] {
  if (!lineItems) return [];
  
  // GraphQL structure
  if (lineItems.edges && Array.isArray(lineItems.edges)) {
    return lineItems.edges.map((edge: any) => edge.node);
  }
  
  // REST structure
  if (Array.isArray(lineItems)) {
    return lineItems;
  }
  
  return [];
}

// Helper to get refund line items array (handles both structures)
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

// Check if line item is a gift card (from original code)
function isGiftCardLineItem(lineItem: any): boolean {
  const name = lineItem.node?.name || lineItem.name || '';
  const title = lineItem.node?.title || lineItem.title || '';
  const productTitle = lineItem.node?.product?.title || lineItem.product?.title || '';
  
  const giftCardIndicators = [
    'gift card', 'gift certificate', 'giftcard', 'e-gift', 'digital gift',
    'gift voucher', 'store credit'
  ];
  
  const searchText = `${name} ${title} ${productTitle}`.toLowerCase();
  return giftCardIndicators.some(indicator => searchText.includes(indicator));
}

// Calculate order metrics (EXACT LOGIC FROM ORIGINAL CODE 1)
function calculateOrderMetrics(order: any) {
  // Calculate line items total (ORIGINAL prices before discounts)
  const lineItemsTotal = order.lineItems?.edges?.reduce((sum: number, li: any) => {
    return sum + parseFloat(li.node.originalTotalSet?.shopMoney?.amount || 0);
  }, 0) || 0;

  // Get discounts from the order data
  const discounts = parseFloat(order.totalDiscountsSet?.shopMoney?.amount || 0);

  // Get refund discrepancy directly from Shopify
  const refundDiscrepancy = parseFloat(order.refundDiscrepancySet?.shopMoney?.amount || 0);

  // Calculate gross returns (sum of refunded line items)
  let grossReturns = 0;
  order.refunds?.forEach((refund: any) => {
    refund.refundLineItems?.edges?.forEach((edge: any) => {
      grossReturns += parseFloat(edge.node.subtotalSet?.shopMoney?.amount || 0);
    });
  });

  // Calculate refunded shipping
  const refundedShipping = parseFloat(order.totalRefundedShippingSet?.shopMoney?.amount || 0);

  // Calculate shipping charges
  const shippingAmount = parseFloat(order.totalShippingPriceSet?.shopMoney?.amount || 0);
  const shippingCharges = shippingAmount - refundedShipping;

  // Calculate restocking fees and return shipping fees (EXACT LOGIC FROM ORIGINAL CODE)
  let totalRestockingFees = 0;
  let totalReturnShippingFees = 0;
  
  order.returns?.nodes?.forEach((returnItem: any) => {
    returnItem.returnLineItems?.nodes?.forEach((lineItem: any) => {
      if (lineItem.restockingFee?.amountSet?.shopMoney?.amount) {
        totalRestockingFees += parseFloat(lineItem.restockingFee.amountSet.shopMoney.amount);
      }
    });
    
    returnItem.returnShippingFees?.forEach((shippingFee: any) => {
      if (shippingFee?.amountSet?.shopMoney?.amount) {
        totalReturnShippingFees += parseFloat(shippingFee.amountSet.shopMoney.amount);
      }
    });
  });

  // Calculate total return fees
  const totalReturnFees = totalRestockingFees + totalReturnShippingFees;

  // CORRECTED: Calculate sales metrics using accurate data
  // Gross Sales = Original line items total (BEFORE any discounts)
  const grossSales = lineItemsTotal;

  // Net Sales = Gross Sales - Returns - Discounts
  let netSales = grossSales - grossReturns - discounts;

  // Handle refund discrepancies - OVER-refunds ADD to net sales, UNDER-refunds DEDUCT from net sales
  if (refundDiscrepancy > 0) {
    // Positive discrepancy = OVER-refund (we refunded more than we should have)
    // This means we lost additional money, so ADD to net sales (increases the loss/reduces revenue)
    netSales += refundDiscrepancy;
  } else if (refundDiscrepancy < 0) {
    // Negative discrepancy = UNDER-refund (we refunded less than we should have)
    // This means we kept additional money, so DEDUCT from net sales (increases revenue)
    netSales -= Math.abs(refundDiscrepancy);
  }

  // Calculate net returns (gross returns adjusted for discrepancies)
  let netReturns = grossReturns;
  if (refundDiscrepancy > 0) {
    // Over-refund means we refunded MORE than we should have
    netReturns = grossReturns - refundDiscrepancy;
  } else if (refundDiscrepancy < 0) {
    // Under-refund means we refunded LESS than we should have
    netReturns = grossReturns + Math.abs(refundDiscrepancy);
  }

  return {
    ...order,
    calculatedGrossSales: grossSales,
    calculatedGrossReturns: grossReturns,
    calculatedNetReturns: netReturns,
    calculatedRefundedShipping: refundedShipping,
    calculatedNetSales: netSales,
    calculatedRefundDiscrepancy: refundDiscrepancy,
    calculatedRestockingFees: totalRestockingFees,
    calculatedReturnShippingFees: totalReturnShippingFees,
    calculatedTotalReturnFees: totalReturnFees,
    calculatedShippingCharges: shippingCharges,
    // Add flags for display purposes
    hasOverRefund: refundDiscrepancy > 0,
    hasUnderRefund: refundDiscrepancy < 0
  };
}

// Main order processing function with gift card logic
export function processOrderToStats(order: any): OrderStats {
  const hasRefunds = order.refunds && order.refunds.length > 0;
  const hasComplexFulfillment = (order.fulfillments && order.fulfillments.nodes && order.fulfillments.nodes.length > 1) || 
                                (order.fulfillments && order.fulfillments.length > 1);
  const hasExchangeTags = order.tags?.includes('exchange') || order.note?.includes('exchange');

  if (!hasRefunds && !hasComplexFulfillment && !hasExchangeTags) {
    return processSimpleOrder(order);
  }

  // Apply gift card logic for complex orders
  const processedOrder = processOrderWithGiftCards(order);
  return convertToOrderStats(processedOrder);
}

function processOrderWithGiftCards(order: any): any {
  // Check if order contains gift cards
  const hasGiftCards = order.lineItems?.edges?.some((li: any) => 
    isGiftCardLineItem(li)
  );

  if (!hasGiftCards) {
    // Pure regular order - process normally
    return calculateOrderMetrics(order);
  }

  // Check if mixed or pure gift card
  const giftCardLineItems = order.lineItems?.edges?.filter((li: any) => 
    isGiftCardLineItem(li)
  );
  
  const regularLineItems = order.lineItems?.edges?.filter((li: any) => 
    !isGiftCardLineItem(li)
  );

  if (regularLineItems.length === 0) {
    // Pure gift card order - remove shipping
    const giftCardOrder = {
      ...order,
      totalShippingPriceSet: { shopMoney: { amount: "0.00", currencyCode: "USD" } },
      totalRefundedShippingSet: { shopMoney: { amount: "0.00", currencyCode: "USD" } },
      shippingLine: null
    };
    const processed = calculateOrderMetrics(giftCardOrder);
    processed.isGiftCardOrder = true;
    return processed;
  }

  // Mixed order - process regular portion only (gift cards are excluded from analytics)
  const regularPortion = createRegularPortion(order, regularLineItems);
  const processed = calculateOrderMetrics(regularPortion);
  processed.isMixedOrderRegular = true;
  processed.originalOrderName = order.name;
  return processed;
}

function createRegularPortion(order: any, regularLineItems: any[]): any {
  // Calculate regular portion subtotal
  const regularSubtotal = regularLineItems.reduce((sum: number, li: any) => {
    return sum + parseFloat(li.node.originalTotalSet?.shopMoney?.amount || 0);
  }, 0);

  // Calculate regular portion discounts
  let regularDiscounts = 0;
  regularLineItems.forEach((li: any) => {
    const originalTotal = parseFloat(li.node.originalTotalSet?.shopMoney?.amount || 0);
    const discountedTotal = parseFloat(li.node.discountedTotalSet?.shopMoney?.amount || 0);
    const lineItemDiscount = originalTotal - discountedTotal;
    regularDiscounts += lineItemDiscount;
  });

  // Calculate regular portion taxes
  let regularTaxes = 0;
  regularLineItems.forEach((li: any) => {
    li.node.taxLines?.forEach((tax: any) => {
      regularTaxes += parseFloat(tax.priceSet?.shopMoney?.amount || 0);
    });
  });

  // Regular portion gets ALL shipping
  const regularShipping = parseFloat(order.totalShippingPriceSet?.shopMoney?.amount || 0);
  const regularShippingRefunds = parseFloat(order.totalRefundedShippingSet?.shopMoney?.amount || 0);

  // Helper function to create money set
  const createMoneySet = (amount: number, currencyCode: string = 'USD') => ({
    shopMoney: { amount: amount.toFixed(2), currencyCode }
  });

  return {
    ...order,
    lineItems: { edges: regularLineItems },
    subtotalPriceSet: createMoneySet(regularSubtotal),
    currentSubtotalPriceSet: createMoneySet(regularSubtotal - regularDiscounts),
    totalPriceSet: createMoneySet(regularSubtotal - regularDiscounts + regularShipping + regularTaxes),
    currentTotalPriceSet: createMoneySet(regularSubtotal - regularDiscounts + regularShipping + regularTaxes),
    totalReceivedSet: createMoneySet(regularSubtotal + regularShipping + regularTaxes),
    totalRefundedSet: order.totalRefundedSet, // Keep original for refund calculations
    totalDiscountsSet: createMoneySet(regularDiscounts),
    totalShippingPriceSet: createMoneySet(regularShipping),
    totalRefundedShippingSet: createMoneySet(regularShippingRefunds),
    currentTotalTaxSet: createMoneySet(regularTaxes),
    currentTotalDiscountsSet: createMoneySet(regularDiscounts)
  };
}

function convertToOrderStats(processedOrder: any): OrderStats {
  // Calculate items count
  const lineItemsArray = getLineItemsArray(processedOrder.lineItems);
  const itemsCount = lineItemsArray.reduce((sum: number, item: any) => {
    return sum + (item.quantity || 0);
  }, 0);

  // Handle both GraphQL and REST fulfillment status
  const fulfillmentStatus = processedOrder.displayFulfillmentStatus || processedOrder.fulfillment_status;
  const fulfilledCount = fulfillmentStatus === "FULFILLED" || fulfillmentStatus === "fulfilled" ? 1 : 0;
  const unfulfilledCount = !fulfilledCount ? 1 : 0;

  // Event summary
  const orderDate = new Date(processedOrder.createdAt || processedOrder.created_at);
  const periodStart = new Date(orderDate.getFullYear(), orderDate.getMonth(), orderDate.getDate());
  const periodEnd = new Date(periodStart);
  periodEnd.setDate(periodStart.getDate() + 1);
  const eventSummary = calculateOrderEventSummary(processedOrder, periodStart, periodEnd);

  return {
    total: parseFloat(processedOrder.calculatedGrossSales.toFixed(2)),
    discounts: parseFloat((processedOrder.calculatedGrossSales - processedOrder.calculatedNetSales - processedOrder.calculatedGrossReturns).toFixed(2)),
    returns: parseFloat(processedOrder.calculatedGrossReturns.toFixed(2)),
    netSales: parseFloat(processedOrder.calculatedNetSales.toFixed(2)),
    shipping: parseFloat(processedOrder.calculatedShippingCharges.toFixed(2)),
    taxes: parseFloat(parseMoneyAmount(processedOrder.currentTotalTaxSet).toFixed(2)),
    extraFees: parseFloat(processedOrder.calculatedTotalReturnFees.toFixed(2)),
    totalSales: parseFloat(parseMoneyAmount(processedOrder.currentTotalPriceSet).toFixed(2)),
    shippingRefunds: parseFloat(processedOrder.calculatedRefundedShipping.toFixed(2)),
    netReturns: parseFloat(processedOrder.calculatedNetReturns.toFixed(2)),
    totalRefund: parseFloat((processedOrder.calculatedGrossReturns + processedOrder.calculatedRefundDiscrepancy).toFixed(2)),
    items: itemsCount,
    fulfilled: fulfilledCount,
    unfulfilled: unfulfilledCount,
    orderCount: 1,
    discountsReturned: 0,
    netDiscounts: parseFloat((processedOrder.calculatedGrossSales - processedOrder.calculatedNetSales - processedOrder.calculatedGrossReturns).toFixed(2)),
    returnShippingCharges: parseFloat(processedOrder.calculatedReturnShippingFees.toFixed(2)),
    restockingFees: parseFloat(processedOrder.calculatedRestockingFees.toFixed(2)),
    returnFees: parseFloat(processedOrder.calculatedTotalReturnFees.toFixed(2)),
    refundDiscrepancy: parseFloat(processedOrder.calculatedRefundDiscrepancy.toFixed(2)),
    hasSubsequentEvents: !!eventSummary,
    eventSummary: eventSummary,
    refundsCount: processedOrder.refunds?.length || 0,
    financialStatus: processedOrder.displayFinancialStatus || processedOrder.financial_status || 'pending'
  };
}

export function processSimpleOrder(order: any): OrderStats {
  // Use GraphQL field names with fallback to REST
  const grossSales = calculateLineItemsTotal(order.lineItems) || parseMoneyAmount(order.subtotalPriceSet) || parseFloat(order.total_line_items_price) || 0;
  const totalDiscounts = Math.abs(parseMoneyAmount(order.totalDiscountsSet) || parseFloat(order.total_discounts) || 0);
  const shipping = parseMoneyAmount(order.totalShippingPriceSet) || parseFloat(order.total_shipping_price_set?.shop_money?.amount || "0") || 0;
  const taxes = parseMoneyAmount(order.currentTotalTaxSet) || parseFloat(order.current_total_tax) || 0;
  const totalSales = parseMoneyAmount(order.currentTotalPriceSet) || parseFloat(order.current_total_price) || 0;

  // Calculate items count from line items
  const lineItemsArray = getLineItemsArray(order.lineItems);
  const itemsCount = lineItemsArray.reduce((sum: number, item: any) => {
    return sum + (item.quantity || 0);
  }, 0);

  // Handle both GraphQL and REST fulfillment status
  const fulfillmentStatus = order.displayFulfillmentStatus || order.fulfillment_status;
  const fulfilledCount = fulfillmentStatus === "FULFILLED" || fulfillmentStatus === "fulfilled" ? 1 : 0;
  const unfulfilledCount = !fulfilledCount ? 1 : 0;

  return {
    total: parseFloat(grossSales.toFixed(2)),
    discounts: parseFloat(totalDiscounts.toFixed(2)),
    returns: 0,
    netSales: parseFloat((grossSales - totalDiscounts).toFixed(2)),
    shipping: parseFloat(shipping.toFixed(2)),
    taxes: parseFloat(taxes.toFixed(2)),
    extraFees: 0,
    totalSales: parseFloat(totalSales.toFixed(2)),
    shippingRefunds: 0,
    netReturns: 0,
    totalRefund: 0,
    items: itemsCount,
    fulfilled: fulfilledCount,
    unfulfilled: unfulfilledCount,
    orderCount: 1,
    discountsReturned: 0,
    netDiscounts: parseFloat(totalDiscounts.toFixed(2)),
    returnShippingCharges: 0,
    restockingFees: 0,
    returnFees: 0,
    refundDiscrepancy: 0,
    hasSubsequentEvents: false,
    eventSummary: null,
    refundsCount: 0,
    financialStatus: order.displayFinancialStatus || order.financial_status || 'pending'
  };
}

export function mergeStats(existing: OrderStats, newStats: OrderStats): OrderStats {
  return {
    total: existing.total + newStats.total,
    discounts: existing.discounts + newStats.discounts,
    returns: existing.returns + newStats.returns,
    netSales: existing.netSales + newStats.netSales,
    shipping: existing.shipping + newStats.shipping,
    taxes: existing.taxes + newStats.taxes,
    extraFees: existing.extraFees + newStats.extraFees,
    totalSales: existing.totalSales + newStats.totalSales,
    shippingRefunds: existing.shippingRefunds + newStats.shippingRefunds,
    netReturns: existing.netReturns + newStats.netReturns,
    totalRefund: existing.totalRefund + newStats.totalRefund,
    items: existing.items + newStats.items,
    fulfilled: existing.fulfilled + newStats.fulfilled,
    unfulfilled: existing.unfulfilled + newStats.unfulfilled,
    orderCount: existing.orderCount + newStats.orderCount,
    discountsReturned: (existing.discountsReturned || 0) + (newStats.discountsReturned || 0),
    netDiscounts: (existing.netDiscounts || 0) + (newStats.netDiscounts || 0),
    returnShippingCharges: (existing.returnShippingCharges || 0) + (newStats.returnShippingCharges || 0),
    restockingFees: (existing.restockingFees || 0) + (newStats.restockingFees || 0),
    returnFees: (existing.returnFees || 0) + (newStats.returnFees || 0),
    refundDiscrepancy: (existing.refundDiscrepancy || 0) + (newStats.refundDiscrepancy || 0),
    hasSubsequentEvents: existing.hasSubsequentEvents || newStats.hasSubsequentEvents,
    eventSummary: mergeEventSummaries(existing.eventSummary, newStats.eventSummary),
    refundsCount: existing.refundsCount + newStats.refundsCount,
    financialStatus: newStats.financialStatus
  };
}