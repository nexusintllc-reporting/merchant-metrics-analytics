// // // ==================== 1.0 IMPORTS & SETUP ====================

// // import { json, type LoaderFunctionArgs } from "@remix-run/node";
// // import { useLoaderData } from "@remix-run/react";
// // import { authenticate } from "../shopify.server";
// // import { useState, useEffect, useMemo } from "react";
// // import "../styles/orders.css";

// // // Chart.js imports
// // import {
// //   Chart as ChartJS,
// //   CategoryScale,
// //   LinearScale,
// //   BarElement,
// //   LineElement,
// //   PointElement,
// //   ArcElement,
// //   Title,
// //   Tooltip,
// //   Legend,
// //   Filler,
// // } from 'chart.js';
// // import { Bar, Line, Pie, Doughnut } from 'react-chartjs-2';

// // // Register Chart.js components
// // ChartJS.register(
// //   CategoryScale,
// //   LinearScale,
// //   BarElement,
// //   LineElement,
// //   PointElement,
// //   ArcElement,
// //   Title,
// //   Tooltip,
// //   Legend,
// //   Filler
// // );

// // // ==================== 2.0 TYPE DEFINITIONS ====================

// // interface Order {
// //   id: number;
// //   created_at: string;
// //   total_price: string;
// //   total_discounts?: string;
// //   total_shipping_price_set?: {
// //     shop_money: { amount: string };
// //   };
// //   total_tax?: string;
// //   total_refunds?: string;
// //   fulfillment_status?: string;
// //   line_items?: Array<{
// //     quantity: number;
// //   }>;
// //   customer?: {
// //     id?: string | number;
// //   };
// // }

// // type EventSummary = {
// //   refunds: {
// //     count: number;
// //     value: number;
// //   };
// //   exchanges: {
// //     count: number;
// //     value: number;
// //   };
// //   partialRefunds: {
// //     count: number;
// //     value: number;
// //   };
// //   totalEvents: number;
// //   netValue: number;
// // };

// // interface OrderStats {
// //   total: number;
// //   items: number;
// //   fulfilled: number;
// //   unfulfilled: number;
// //   discounts: number;
// //   shipping: number;
// //   taxes: number;
// //   returns: number;
// //   orderCount: number;
// //   netSales: number;
// //   extraFees: number;
// //   totalSales: number;
// //   shippingRefunds: number;
// //   netReturns: number;
// //   totalRefund: number;
// //   discountsReturned?: number;
// //   netDiscounts?: number;
// //   returnShippingCharges?: number;
// //   restockingFees?: number;
// //   returnFees?: number;
// //   refundDiscrepancy?: number;
// //   hasSubsequentEvents: boolean;
// //   eventSummary: EventSummary | null;
// //   refundsCount: number;
// //   financialStatus: string;
// // }

// // interface CustomerData {
// //   newCustomers: number;
// //   repeatedCustomers: number;
// //   totalCustomers: number;
// // }

// // interface AnalyticsData {
// //   shop: string;
// //   totals: Record<string, OrderStats>;
// //   dailyTotals: Record<string, OrderStats & CustomerData>;
// //   weeklyTotals: Record<string, OrderStats & CustomerData>;
// //   monthlyTotals: Record<string, OrderStats & CustomerData>;
// //   totalOrders: number;
// //   totalCustomerData: CustomerData;
// //   monthRanges: string[];
// //   dailyKeys: string[];
// //   weeklyKeys: string[];
// //   lastUpdated: string;
// //   shopTimeZone: string;
// //   shopCurrency: string;
// // }

// // interface CachedAnalyticsData extends AnalyticsData {
// //   _cacheInfo?: {
// //     fetchMode: "incremental" | "full";
// //     apiSuccess: boolean;
// //     cacheHealth: {
// //       total: number;
// //       valid: number;
// //       expired: number;
// //       health: number;
// //     };
// //     cacheStats: {
// //       size: number;
// //       version: number;
// //     };
// //   };
// // }

// // interface OrderData {
// //   totalOrders: number;
// //   totalCustomers: number;
// //   fulfillmentRate: number;
// //   totalRevenue: number;
// //   netRevenue: number;
// //   averageOrderValue: number;
// //   totalItems: number;
// //   todayOrders: number;
// //   todayRevenue: number;
// //   todayItems: number;
// //   ordersChangeVsYesterday: number;
// //   revenueChangeVsYesterday: number;
// //   itemsChangeVsYesterday: number;
// //   newCustomers: number;
// //   repeatCustomers: number;
// //   customerRetentionRate: number;
// //   averageOrderFrequency: number;
// //   shopTimezone: string;
// //   shopCurrency: string;
// //   totalRefunds?: number;
// //   totalExchanges?: number;
// //   totalPartialRefunds?: number;
// //   totalEvents?: number;
// //   ordersWithEvents?: number;
// //   netEventValue?: number;
// // }

// // // ==================== 3.0 CACHE MANAGER ====================

// // class PersistentCacheManager {
// //   private memoryStorage: Map<string, any> = new Map();
// //   public version = 1;

// //   private validateCacheData(data: any): boolean {
// //     if (!data) return false;
// //     if (data.orders && !Array.isArray(data.orders)) return false;
// //     if (data.lastUpdatedAt && isNaN(Date.parse(data.lastUpdatedAt))) return false;
// //     return true;
// //   }

// //   private async getPersistentStorage(): Promise<Map<string, any>> {
// //     return this.memoryStorage;
// //   }

// //   async set<T>(key: string, value: T, ttl: number = 30 * 60 * 1000): Promise<void> {
// //     try {
// //       const storage = await this.getPersistentStorage();
// //       const entry = {
// //         value,
// //         timestamp: Date.now(),
// //         ttl,
// //         key
// //       };
      
// //       storage.set(key, entry);
      
// //       if (typeof window !== 'undefined' && window.localStorage) {
// //         try {
// //           localStorage.setItem(key, JSON.stringify(entry));
// //         } catch (e) {
// //           // Handle localStorage error
// //         }
// //       }
// //     } catch (error) {
// //       // Handle cache set error
// //     }
// //   }

// //   async get<T>(key: string): Promise<{ value: T; timestamp: number } | null> {
// //     try {
// //       const storage = await this.getPersistentStorage();
// //       let entry = storage.get(key);
      
// //       if (!entry && typeof window !== 'undefined' && window.localStorage) {
// //         try {
// //           const stored = localStorage.getItem(key);
// //           if (stored) {
// //             entry = JSON.parse(stored);
// //             storage.set(key, entry);
// //           }
// //         } catch (e) {
// //           // Handle localStorage error
// //         }
// //       }

// //       if (!entry) {
// //         return null;
// //       }

// //       const isExpired = Date.now() - entry.timestamp > entry.ttl;
// //       if (isExpired) {
// //         await this.remove(key);
// //         return null;
// //       }

// //       if (!this.validateCacheData(entry.value)) {
// //         console.warn('Removing corrupted cache:', key);
// //         await this.remove(key);
// //         return null;
// //       }

// //       return { value: entry.value, timestamp: entry.timestamp };
// //     } catch (error) {
// //       await this.remove(key);
// //       return null;
// //     }
// //   }

// //   async remove(key: string): Promise<void> {
// //     try {
// //       const storage = await this.getPersistentStorage();
// //       storage.delete(key);
      
// //       if (typeof window !== 'undefined' && window.localStorage) {
// //         try {
// //           localStorage.removeItem(key);
// //         } catch (e) {
// //           // Handle localStorage error
// //         }
// //       }
// //     } catch (error) {
// //       // Handle cache remove error
// //     }
// //   }

// //   async emergencyReset(shop: string): Promise<void> {
// //     const keys = [
// //       makeCacheKey(shop, "orders"),
// //       // Add other cache keys if you have them
// //     ];
    
// //     for (const key of keys) {
// //       await this.remove(key);
// //     }
// //     console.log('Emergency cache reset completed for:', shop);
// //   }

// //   getStats() {
// //     return {
// //       size: this.memoryStorage.size,
// //       version: this.version
// //     };
// //   }

// //   healthReport() {
// //     const now = Date.now();
// //     let expiredCount = 0;
// //     let validCount = 0;

// //     for (const entry of this.memoryStorage.values()) {
// //       if (now - entry.timestamp > entry.ttl) {
// //         expiredCount++;
// //       } else {
// //         validCount++;
// //       }
// //     }

// //     return {
// //       total: this.memoryStorage.size,
// //       valid: validCount,
// //       expired: expiredCount,
// //       health: validCount / Math.max(this.memoryStorage.size, 1)
// //     };
// //   }
// // }

// // // Global cache instance
// // const cacheManager = new PersistentCacheManager();

// // // ==================== 4.0 HELPER FUNCTIONS ====================

// // function makeCacheKey(shop: string, segment: string): string {
// //   return `${shop}::analytics::${segment}::v${cacheManager.version}`;
// // }

// // function nowISO(): string {
// //   return new Date().toISOString();
// // }

// // function getMonthRanges(shopTimeZone: string = "UTC") {
// //   const ranges: { start: string; end: string; key: string }[] = [];
// //   const now = new Date();

// //   for (let i = 6; i >= 0; i--) {
// //     const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
// //     const start = new Date(date.getFullYear(), date.getMonth(), 1);
// //     const end = new Date(date.getFullYear(), date.getMonth() + 1, 0, 23, 59, 59);
// //     ranges.push({
// //       start: start.toISOString(),
// //       end: end.toISOString(),
// //       key: date.toLocaleString("default", { month: "short", year: "numeric" }),
// //     });
// //   }

// //   return ranges;
// // }

// // function getLastNDays(n: number, shopTimeZone: string = "UTC") {
// //   const days: string[] = [];
// //   const now = new Date();
  
// //   for (let i = n - 1; i >= 0; i--) {
// //     const d = new Date(now);
// //     d.setDate(now.getDate() - i);
// //     const dayKey = d.toLocaleDateString("en-CA", { timeZone: shopTimeZone });
// //     days.push(dayKey);
// //   }
  
// //   return days;
// // }

// // function getLast8Weeks(shopTimeZone: string = "UTC") {
// //   const weeks: string[] = [];
// //   const now = new Date();
// //   const monday = new Date(now);
// //   monday.setDate(now.getDate() - ((now.getDay() + 6) % 7));
// //   for (let i = 7; i >= 0; i--) {
// //     const startOfWeek = new Date(monday);
// //     startOfWeek.setDate(monday.getDate() - i * 7);
// //     const key = `Week of ${startOfWeek.toLocaleDateString("en-CA", { timeZone: shopTimeZone })}`;
// //     weeks.push(key);
// //   }
// //   return weeks;
// // }

// // // ==================== 5.0 API FETCHING FUNCTIONS ====================

// // async function fetchOrdersSince(
// //   shop: string, 
// //   accessToken: string, 
// //   sinceDate: string, 
// //   cachedOrders: any[] = []
// // ): Promise<{ orders: any[]; hasMore: boolean }> {
  
// //   let allOrders: any[] = [...cachedOrders];
// //   let url = `https://${shop}/admin/api/2024-01/orders.json?status=any&limit=250&updated_at_min=${sinceDate}`;
// //   let pageCount = 0;
// //   let hasMore = true;

// //   while (url && hasMore) {
// //     pageCount++;

// //     const response = await fetch(url, { 
// //       headers: { "X-Shopify-Access-Token": accessToken } 
// //     });

// //     if (!response.ok) {
// //       if (response.status === 429) {
// //         const retryAfter = response.headers.get('Retry-After') || '10';
// //         const waitTime = parseInt(retryAfter) * 1000;
// //         await new Promise(resolve => setTimeout(resolve, waitTime));
// //         continue;
// //       }
// //       throw new Error(`HTTP error! status: ${response.status}`);
// //     }

// //     const data = await response.json();
// //     const newOrders: any[] = data.orders || [];
    
// //     const orderMap = new Map();
// //     allOrders.forEach((order: any) => orderMap.set(order.id, order));
// //     newOrders.forEach((order: any) => orderMap.set(order.id, order));
    
// //     allOrders = Array.from(orderMap.values());

// //     const linkHeader = response.headers.get("Link");
// //     const nextMatch = linkHeader?.match(/<([^>]+)>; rel="next"/);
// //     url = nextMatch ? nextMatch[1] : "";
// //     hasMore = !!url;

// //     if (url) {
// //       await new Promise(resolve => setTimeout(resolve, 200));
// //     }
// //   }

// //   return { orders: allOrders, hasMore: false };
// // }

// // async function fetchOrdersForPeriod(shop: string, accessToken: string, startDate: string, endDate: string) {
// //   let allOrders: any[] = [];
// //   let url = `https://${shop}/admin/api/2024-01/orders.json?status=any&limit=250&created_at_min=${startDate}&created_at_max=${endDate}`;
// //   let pageCount = 0;

// //   while (url) {
// //     pageCount++;

// //     const response = await fetch(url, { 
// //       headers: { "X-Shopify-Access-Token": accessToken } 
// //     });

// //     if (!response.ok) {
// //       if (response.status === 429) {
// //         const retryAfter = response.headers.get('Retry-After') || '10';
// //         const waitTime = parseInt(retryAfter) * 1000;
// //         await new Promise(resolve => setTimeout(resolve, waitTime));
// //         continue;
// //       } else {
// //         throw new Error(`HTTP error! status: ${response.status}`);
// //       }
// //     }

// //     const data = await response.json();
// //     const ordersCount = data.orders?.length || 0;
    
// //     allOrders = allOrders.concat(data.orders || []);

// //     const linkHeader = response.headers.get("Link");
// //     const nextMatch = linkHeader?.match(/<([^>]+)>; rel="next"/);
// //     url = nextMatch ? nextMatch[1] : "";
// //   }

// //   return allOrders;
// // }

// // // ==================== 6.0 EVENT DETECTION LOGIC ====================

// // function calculateOrderEventSummary(order: any, periodStart: Date, periodEnd: Date): EventSummary | null {
// //   const eventSummary: EventSummary = {
// //     refunds: { count: 0, value: 0 },
// //     exchanges: { count: 0, value: 0 },
// //     partialRefunds: { count: 0, value: 0 },
// //     totalEvents: 0,
// //     netValue: 0
// //   };

// //   const orderRefunds = order.refunds || [];
// //   let hasEvents = false;

// //   orderRefunds.forEach((refund: any) => {
// //     const refundDate = new Date(refund.created_at);
    
// //     if (refundDate >= periodStart && refundDate <= periodEnd) {
// //       let refundAmount = 0;
      
// //       if (refund.transactions && refund.transactions.length > 0) {
// //         refund.transactions.forEach((transaction: any) => {
// //           if (transaction.kind === 'refund' && transaction.status === 'success') {
// //             refundAmount += Math.abs(parseFloat(transaction.amount) || 0);
// //           }
// //         });
// //       }

// //       const isFullRefund = refundAmount === parseFloat(order.total_price);
// //       const hasExchangeTags = order.tags?.includes('exchange') || order.note?.includes('exchange');
// //       const hasMultipleFulfillments = order.fulfillments && order.fulfillments.length > 1;
// //       const isExchange = hasExchangeTags || hasMultipleFulfillments;

// //       if (isFullRefund && !isExchange) {
// //         eventSummary.refunds.count++;
// //         eventSummary.refunds.value -= refundAmount;
// //       } else if (isExchange) {
// //         eventSummary.exchanges.count++;
// //         const exchangeValue = -refundAmount;
// //         eventSummary.exchanges.value += exchangeValue;
// //       } else {
// //         eventSummary.partialRefunds.count++;
// //         eventSummary.partialRefunds.value -= refundAmount;
// //       }

// //       eventSummary.totalEvents++;
// //       eventSummary.netValue -= refundAmount;
// //       hasEvents = true;
// //     }
// //   });

// //   return hasEvents ? eventSummary : null;
// // }

// // // ==================== 7.0 FINANCIAL CALCULATION ENGINE ====================

// // function processOrderToStats(order: any): OrderStats {
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
// //     orderRefunds.forEach((refund: any) => {
// //       if (refund.transactions && refund.transactions.length > 0) {
// //         refund.transactions.forEach((transaction: any) => {
// //           if (transaction.kind === 'refund' && transaction.status === 'success') {
// //             const refundAmount = Math.abs(parseFloat(transaction.amount) || 0);
// //             totalActualRefund += refundAmount;
// //             netReturns += refundAmount;
// //           }
// //         });
// //       }

// //       if (refund.refund_line_items) {
// //         refund.refund_line_items.forEach((item: any) => {
// //           const itemValue = Math.abs(parseFloat(item.subtotal) || 0);
// //           grossReturns -= itemValue;
// //           totalItemRefunds += itemValue;
          
// //           const lineItemDiscount = parseFloat(item.total_discount) || 0;
// //           discountsReturned += Math.abs(lineItemDiscount);
// //         });
// //       }
      
// //       if (refund.order_adjustments && refund.order_adjustments.length > 0) {
// //         refund.order_adjustments.forEach((adjustment: any) => {
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
// //         });
// //       }
      
// //       if (refund.total_additional_fees_set) {
// //         const additionalFees = parseFloat(refund.total_additional_fees_set?.shop_money?.amount || "0") || 0;
// //         returnFees += additionalFees;
// //       }
// //     });
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
// //         order.line_items.forEach((item: any) => {
// //           const refundedItem = orderRefunds[0]?.refund_line_items?.find((refundItem: any) => 
// //             refundItem.line_item_id === item.id
// //           );
          
// //           if (!refundedItem && item.fulfillment_status === 'fulfilled') {
// //             const itemPrice = parseFloat(item.price) || 0;
// //             const itemQuantity = item.current_quantity || item.quantity || 0;
// //             exchangeItemValue += itemPrice * itemQuantity;
// //           }
// //         });
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
// //           order.line_items.forEach((item: any) => {
// //             if (item.fulfillment_status === 'fulfilled') {
// //               const itemPrice = parseFloat(item.price) || 0;
// //               const itemQuantity = item.current_quantity || item.quantity || 0;
// //               exchangeItemValue += itemPrice * itemQuantity;
// //             }
// //           });
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

// // function mergeStats(existing: OrderStats, newStats: OrderStats): OrderStats {
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

// // function mergeEventSummaries(a: EventSummary | null, b: EventSummary | null): EventSummary | null {
// //   if (!a && !b) return null;
// //   if (!a) return b;
// //   if (!b) return a;
  
// //   return {
// //     refunds: {
// //       count: a.refunds.count + b.refunds.count,
// //       value: a.refunds.value + b.refunds.value
// //     },
// //     exchanges: {
// //       count: a.exchanges.count + b.exchanges.count,
// //       value: a.exchanges.value + b.exchanges.value
// //     },
// //     partialRefunds: {
// //       count: a.partialRefunds.count + b.partialRefunds.count,
// //       value: a.partialRefunds.value + b.partialRefunds.value
// //     },
// //     totalEvents: a.totalEvents + b.totalEvents,
// //     netValue: a.netValue + b.netValue
// //   };
// // }

// // // ==================== 8.0 CUSTOMER TRACKING LOGIC ====================

// // function buildCustomerOrderMap(allOrders: any[], shopTimeZone: string) {
// //   const customerOrderMap: Record<string, Date[]> = {};
  
// //   for (const order of allOrders) {
// //     const custId = order?.customer?.id;
// //     if (custId === undefined || custId === null) continue;
    
// //     const customerId = custId.toString();
// //     if (!customerOrderMap[customerId]) {
// //       customerOrderMap[customerId] = [];
// //     }
// //     customerOrderMap[customerId].push(new Date(order.created_at));
// //   }
  
// //   return customerOrderMap;
// // }

// // function analyzeCustomerBehavior(
// //   customerOrderMap: Record<string, Date[]>, 
// //   shopTimeZone: string,
// //   periodKeys: string[],
// //   periodType: 'daily' | 'weekly' | 'monthly'
// // ): Record<string, CustomerData> {
// //   const periodAnalytics: Record<string, CustomerData> = {};
  
// //   for (const key of periodKeys) {
// //     periodAnalytics[key] = { newCustomers: 0, repeatedCustomers: 0, totalCustomers: 0 };
// //   }

// //   for (const [customerId, orderDates] of Object.entries(customerOrderMap)) {
// //     if (orderDates.length === 0) continue;
    
// //     const firstOrderDate = new Date(Math.min(...orderDates.map(d => d.getTime())));
    
// //     let firstOrderKey: string;
// //     if (periodType === 'daily') {
// //       firstOrderKey = firstOrderDate.toLocaleDateString("en-CA", { timeZone: shopTimeZone });
// //     } else if (periodType === 'monthly') {
// //       firstOrderKey = firstOrderDate.toLocaleString("default", { month: "short", year: "numeric", timeZone: shopTimeZone });
// //     } else {
// //       const firstOrderMonday = new Date(firstOrderDate);
// //       firstOrderMonday.setDate(firstOrderDate.getDate() - ((firstOrderDate.getDay() + 6) % 7));
// //       firstOrderKey = `Week of ${firstOrderMonday.toLocaleDateString("en-CA", { timeZone: shopTimeZone })}`;
// //     }
    
// //     for (const orderDate of orderDates) {
// //       let orderKey: string;
      
// //       if (periodType === 'daily') {
// //         orderKey = orderDate.toLocaleDateString("en-CA", { timeZone: shopTimeZone });
// //       } else if (periodType === 'monthly') {
// //         orderKey = orderDate.toLocaleString("default", { month: "short", year: "numeric", timeZone: shopTimeZone });
// //       } else {
// //         const orderMonday = new Date(orderDate);
// //         orderMonday.setDate(orderDate.getDate() - ((orderDate.getDay() + 6) % 7));
// //         orderKey = `Week of ${orderMonday.toLocaleDateString("en-CA", { timeZone: shopTimeZone })}`;
// //       }
      
// //       if (!periodAnalytics[orderKey]) continue;
      
// //       if (firstOrderKey === orderKey) {
// //         periodAnalytics[orderKey].newCustomers++;
// //       } else {
// //         periodAnalytics[orderKey].repeatedCustomers++;
// //       }
      
// //       periodAnalytics[orderKey].totalCustomers++;
// //     }
// //   }
  
// //   return periodAnalytics;
// // }

// // function calculateOverallCustomerData(customerOrderMap: Record<string, Date[]>): CustomerData {
// //   const customers = Object.values(customerOrderMap);
// //   const totalCustomers = customers.length;
  
// //   let newCustomers = 0;
// //   let repeatedCustomers = 0;

// //   customers.forEach(orderDates => {
// //     if (orderDates.length === 1) {
// //       newCustomers++;
// //     } else {
// //       repeatedCustomers++;
// //     }
// //   });

// //   return {
// //     newCustomers,
// //     repeatedCustomers,
// //     totalCustomers,
// //   };
// // }

// // // ==================== 9.0 LOADER FUNCTION ====================

// // export const loader = async ({ request }: LoaderFunctionArgs) => {
// //   try {
// //     const { session } = await authenticate.admin(request);
// //     const shop = session.shop;
// //     const accessToken = session.accessToken!;

// //     const shopRes = await fetch(`https://${shop}/admin/api/2024-01/shop.json`, {     
    
// //       headers: { "X-Shopify-Access-Token": accessToken },
// //     });
// //     if (!shopRes.ok) throw new Error(`Failed to fetch shop info: ${shopRes.status}`);
// //     const shopData = await shopRes.json();
// //     const shopTimeZone = shopData.shop.iana_timezone || "UTC";
// //     const shopCurrency = shopData.shop.currency || "USD";

// //     const monthRanges = getMonthRanges(shopTimeZone);
// //     const dailyKeys = getLastNDays(7, shopTimeZone);
// //     const weeklyKeys = getLast8Weeks(shopTimeZone);

// //   const initStats = (): OrderStats => ({
// //     total: 0,
// //     discounts: 0,
// //     returns: 0,
// //     netSales: 0,
// //     shipping: 0,
// //     taxes: 0,
// //     extraFees: 0,
// //     totalSales: 0,
// //     shippingRefunds: 0,
// //     netReturns: 0,
// //     totalRefund: 0,
// //     items: 0,
// //     fulfilled: 0,
// //     unfulfilled: 0,
// //     orderCount: 0,
// //     discountsReturned: 0,
// //     netDiscounts: 0,
// //     returnShippingCharges: 0,
// //     restockingFees: 0,
// //     returnFees: 0,
// //     refundDiscrepancy: 0,
// //     hasSubsequentEvents: false,
// //     eventSummary: null,
// //     refundsCount: 0,
// //     financialStatus: 'pending'
// //   });

// //     const totals: Record<string, OrderStats> = {};
// //     const dailyTotals: Record<string, OrderStats & CustomerData> = {};
// //     const weeklyTotals: Record<string, OrderStats & CustomerData> = {};
// //     const monthlyTotals: Record<string, OrderStats & CustomerData> = {};

// //     monthRanges.forEach((r) => {
// //       totals[r.key] = initStats();
// //       monthlyTotals[r.key] = { ...initStats(), newCustomers: 0, repeatedCustomers: 0, totalCustomers: 0 };
// //     });
// //     dailyKeys.forEach((d) => (dailyTotals[d] = { ...initStats(), newCustomers: 0, repeatedCustomers: 0, totalCustomers: 0 }));
// //     weeklyKeys.forEach((w) => (weeklyTotals[w] = { ...initStats(), newCustomers: 0, repeatedCustomers: 0, totalCustomers: 0 }));

// //     const ordersKey = makeCacheKey(shop, "orders");
// //     const cacheEntry = await cacheManager.get<{ orders: any[]; lastUpdatedAt?: string }>(ordersKey);

// //     let fetchMode: "incremental" | "full" = cacheEntry ? "incremental" : "full";
// //     let allOrders: any[] = [];
// //     let apiSuccess = false;

// //     try {
// //       if (fetchMode === "incremental" && cacheEntry) {
// //         const lastUpdatedAt = cacheEntry.value.lastUpdatedAt;
        
// //         if (lastUpdatedAt) {
// //           const result = await fetchOrdersSince(shop, accessToken, lastUpdatedAt, cacheEntry.value.orders);
          
// //           if (result.orders.length > 0) {
// //             apiSuccess = true;
// //             allOrders = result.orders;
// //             await cacheManager.set(ordersKey, { 
// //               orders: allOrders, 
// //               lastUpdatedAt: nowISO() 
// //             }, 30 * 60 * 1000);
// //           } else {
// //             allOrders = cacheEntry.value.orders;
// //             apiSuccess = true;
// //           }
// //         } else {
// //           fetchMode = "full";
// //         }
// //       }

// //       if (fetchMode === "full") {
// //         allOrders = await fetchOrdersForPeriod(
// //           shop,
// //           accessToken,
// //           monthRanges[0].start,
// //           monthRanges[monthRanges.length - 1].end
// //         );
// //         apiSuccess = true;
        
// //         await cacheManager.set(ordersKey, { 
// //           orders: allOrders, 
// //           lastUpdatedAt: nowISO() 
// //         }, 30 * 60 * 1000);
// //       }

// //     } catch (error) {
// //       if (cacheEntry && cacheEntry.value.orders) {
// //         allOrders = cacheEntry.value.orders;
// //         apiSuccess = true;
// //       } else {
// //         await cacheManager.remove(ordersKey);
// //         throw error;
// //       }
// //     }

// //     const customerOrderMap = buildCustomerOrderMap(allOrders, shopTimeZone);
// //     const dailyCustomerAnalytics = analyzeCustomerBehavior(customerOrderMap, shopTimeZone, dailyKeys, 'daily');
// //     const weeklyCustomerAnalytics = analyzeCustomerBehavior(customerOrderMap, shopTimeZone, weeklyKeys, 'weekly');
// //     const monthlyCustomerAnalytics = analyzeCustomerBehavior(customerOrderMap, shopTimeZone, monthRanges.map(r => r.key), 'monthly');

// //     allOrders.forEach((order: any) => {
// //       const date = new Date(order.created_at);
      
// //       const monthKey = date.toLocaleString("default", { month: "short", year: "numeric", timeZone: shopTimeZone });
// //       const dayKey = date.toLocaleDateString("en-CA", { timeZone: shopTimeZone });
      
// //       const monday = new Date(date);
// //       monday.setDate(date.getDate() - ((date.getDay() + 6) % 7));
// //       const weekKey = `Week of ${monday.toLocaleDateString("en-CA", { timeZone: shopTimeZone })}`;

// //       const orderStats = processOrderToStats(order);

// //       if (totals[monthKey]) {
// //         totals[monthKey] = mergeStats(totals[monthKey], orderStats);
// //       }

// //       if (dailyTotals[dayKey]) {
// //         dailyTotals[dayKey] = {
// //           ...mergeStats(dailyTotals[dayKey], orderStats),
// //           newCustomers: dailyCustomerAnalytics[dayKey]?.newCustomers || 0,
// //           repeatedCustomers: dailyCustomerAnalytics[dayKey]?.repeatedCustomers || 0,
// //           totalCustomers: dailyCustomerAnalytics[dayKey]?.totalCustomers || 0
// //         };
// //       }

// //       if (weeklyTotals[weekKey]) {
// //         weeklyTotals[weekKey] = {
// //           ...mergeStats(weeklyTotals[weekKey], orderStats),
// //           newCustomers: weeklyCustomerAnalytics[weekKey]?.newCustomers || 0,
// //           repeatedCustomers: weeklyCustomerAnalytics[weekKey]?.repeatedCustomers || 0,
// //           totalCustomers: weeklyCustomerAnalytics[weekKey]?.totalCustomers || 0
// //         };
// //       }

// //       if (monthlyTotals[monthKey]) {
// //         monthlyTotals[monthKey] = {
// //           ...mergeStats(monthlyTotals[monthKey], orderStats),
// //           newCustomers: monthlyCustomerAnalytics[monthKey]?.newCustomers || 0,
// //           repeatedCustomers: monthlyCustomerAnalytics[monthKey]?.repeatedCustomers || 0,
// //           totalCustomers: monthlyCustomerAnalytics[monthKey]?.totalCustomers || 0
// //         };
// //       }
// //     });

// //     const totalCustomerData = calculateOverallCustomerData(customerOrderMap);

// //     const result: CachedAnalyticsData = {
// //       shop,
// //       totals,
// //       dailyTotals,
// //       weeklyTotals,
// //       monthlyTotals,
// //       totalOrders: allOrders.length,
// //       totalCustomerData,
// //       monthRanges: monthRanges.map((r) => r.key),
// //       dailyKeys,
// //       weeklyKeys,
// //       lastUpdated: new Date().toISOString(),
// //       shopTimeZone,
// //       shopCurrency,
// //       _cacheInfo: {
// //         fetchMode,
// //         apiSuccess,
// //         cacheHealth: cacheManager.healthReport(),
// //         cacheStats: cacheManager.getStats()
// //       }
// //     };

// //     return json(result);
    
// //   } catch (error: unknown) {
// //     const errorMsg = `Loader error: ${error instanceof Error ? error.message : 'Unknown error'}`;
    
// //     return json({ 
// //       shop: "unknown", 
// //       error: errorMsg,
// //       userMessage: "Sorry for the inconvenience! Please try refreshing the page.",
// //       timestamp: new Date().toISOString()
// //     });
// //   }
// // };

// // // ==================== 10.0 PDF EXPORT FUNCTIONALITY ====================

// // const generatePDFReport = (data: OrderData) => {
// //   const printWindow = window.open('', '_blank');
// //   if (!printWindow) return;

// //   const timestamp = new Date().toLocaleDateString();
// //   const time = new Date().toLocaleTimeString();
  
// //   // Safely get the event data with fallbacks
// //   const totalRefunds = data.totalRefunds || 0;
// //   const totalExchanges = data.totalExchanges || 0;
// //   const netEventValue = data.netEventValue || 0;
  
// //   const pdfContent = `
// //     <!DOCTYPE html>
// //     <html>
// //     <head>
// //       <title>Orders Dashboard Report</title>
// //       <style>
// //         .currency-value::before {
// //           content: '${data.shopCurrency === 'EUR' ? '€' : data.shopCurrency === 'GBP' ? '£' : data.shopCurrency === 'CAD' ? 'C$' : data.shopCurrency === 'AUD' ? 'A$' : data.shopCurrency === 'JPY' ? '¥' : '$'}';
// //         }
// //         body { 
// //           font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; 
// //           margin: 40px; 
// //           color: #333;
// //           line-height: 1.4;
// //         }
// //         .header { 
// //           text-align: center; 
// //           border-bottom: 3px solid #2c3e50; 
// //           padding-bottom: 25px; 
// //           margin-bottom: 35px; 
// //           background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
// //           color: white;
// //           padding: 30px;
// //           margin: -40px -40px 35px -40px;
// //           border-radius: 0 0 20px 20px;
// //         }
// //         .header h1 { 
// //           margin: 0; 
// //           color: white;
// //           font-size: 2.2em;
// //           font-weight: 700;
// //         }
// //         .header .date { 
// //           color: rgba(255,255,255,0.9); 
// //           margin-top: 8px;
// //           font-size: 1.1em;
// //         }
// //         .section { 
// //           margin-bottom: 40px; 
// //           break-inside: avoid;
// //           background: white;
// //           padding: 25px;
// //           border-radius: 12px;
// //           box-shadow: 0 2px 10px rgba(0,0,0,0.08);
// //           border-left: 4px solid #3498db;
// //         }
// //         .section h2 { 
// //           color: #2c3e50; 
// //           border-bottom: 2px solid #ecf0f1; 
// //           padding-bottom: 12px; 
// //           margin-bottom: 20px;
// //           font-size: 1.4em;
// //         }
// //         .metrics-grid { 
// //           display: grid; 
// //           grid-template-columns: repeat(3, 1fr); 
// //           gap: 25px; 
// //           margin: 25px 0; 
// //         }
// //         .metric-card { 
// //           background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
// //           padding: 25px; 
// //           border-radius: 10px; 
// //           text-align: center; 
// //           border-left: 4px solid #3498db;
// //           transition: all 0.3s ease;
// //         }
// //         .metric-card:hover {
// //           transform: translateY(-2px);
// //           box-shadow: 0 5px 15px rgba(0,0,0,0.1);
// //         }
// //         .metric-value { 
// //           font-size: 2em; 
// //           font-weight: bold; 
// //           color: #2c3e50; 
// //           margin-bottom: 8px;
// //         }
// //         .metric-label { 
// //           color: #666; 
// //           margin-top: 8px;
// //           font-weight: 600;
// //         }
// //         .growth-indicator {
// //           display: flex;
// //           align-items: center;
// //           justify-content: center;
// //           gap: 5px;
// //           font-size: 0.9em;
// //           font-weight: 600;
// //           margin-top: 10px;
// //           padding: 4px 12px;
// //           border-radius: 20px;
// //           width: fit-content;
// //           margin: 10px auto 0;
// //         }
// //         .growth-positive {
// //           background: #d4edda;
// //           color: #155724;
// //           border: 1px solid #c3e6cb;
// //         }
// //         .growth-negative {
// //           background: #f8d7da;
// //           color: #721c24;
// //           border: 1px solid #f5c6cb;
// //         }
// //         .growth-arrow {
// //           font-weight: bold;
// //         }
// //         .financial-grid { 
// //           display: grid; 
// //           grid-template-columns: repeat(2, 1fr); 
// //           gap: 20px; 
// //         }
// //         .financial-card { 
// //           background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
// //           padding: 20px; 
// //           border-radius: 8px; 
// //           border-left: 4px solid #27ae60;
// //           transition: all 0.3s ease;
// //         }
// //         .financial-card:hover {
// //           transform: translateY(-2px);
// //           box-shadow: 0 5px 15px rgba(0,0,0,0.1);
// //         }
// //         .financial-value { 
// //           font-size: 1.5em; 
// //           font-weight: bold; 
// //           color: #2c3e50; 
// //         }
// //         .financial-label { 
// //           color: #666; 
// //           font-size: 0.9em;
// //           font-weight: 600;
// //         }
// //         .summary-table { 
// //           width: 100%; 
// //           border-collapse: collapse; 
// //           margin: 20px 0; 
// //           box-shadow: 0 1px 3px rgba(0,0,0,0.1);
// //         }
// //         .summary-table th, .summary-table td { 
// //           padding: 15px; 
// //           text-align: left; 
// //           border-bottom: 1px solid #ddd; 
// //         }
// //         .summary-table th { 
// //           background: #f8f9fa; 
// //           font-weight: bold;
// //           color: #2c3e50;
// //         }
// //         .positive { color: #27ae60; }
// //         .negative { color: #e74c3c; }
// //         .footer { 
// //           margin-top: 50px; 
// //           padding-top: 25px; 
// //           border-top: 2px solid #ddd; 
// //           text-align: center; 
// //           color: #666;
// //           font-size: 0.9em;
// //         }
// //         @media print { 
// //           body { margin: 20px; } 
// //           .metric-card, .financial-card { break-inside: avoid; }
// //           .section { break-inside: avoid; page-break-inside: avoid; }
// //           .header { margin: -20px -20px 25px -20px; }
// //         }
// //         @page {
// //           margin: 1cm;
// //           size: A4;
// //         }
// //       </style>
// //     </head>
// //     <body>
// //       <div class="header">
// //         <h1>📊 Orders Dashboard Report</h1>
// //         <div class="date">Generated: ${timestamp} at ${time}</div>
// //         <div class="date">Store Timezone: ${data.shopTimezone}</div>
// //       </div>

// //       <div class="section">
// //         <h2>📈 Executive Summary</h2>
// //         <div class="metrics-grid">
// //           <div class="metric-card">
// //             <div class="metric-value">${data.totalOrders}</div>
// //             <div class="metric-label">Total Orders</div>
// //           </div>
// //           <div class="metric-card">
// //             <div class="metric-value">${data.totalCustomers}</div>
// //             <div class="metric-label">Total Customers</div>
// //           </div>
// //           <div class="metric-card">
// //             <div class="metric-value">${data.fulfillmentRate.toFixed(1)}%</div>
// //             <div class="metric-label">Fulfillment Rate</div>
// //           </div>
// //         </div>
// //       </div>

// //       <div class="section">
// //         <h2>💰 Financial Overview</h2>
// //         <div class="financial-grid">
// //           <div class="financial-card">
// //             <div class="financial-value">${data.totalRevenue.toLocaleString('en-US', { style: 'currency', currency: data.shopCurrency || 'USD' })}</div>
// //             <div class="financial-label">Total Revenue</div>
// //           </div>
// //           <div class="financial-card">
// //             <div class="financial-value">${data.netRevenue.toLocaleString('en-US', { style: 'currency', currency: data.shopCurrency || 'USD' })}</div>
// //             <div class="financial-label">Net Revenue</div>
// //           </div>
// //           <div class="financial-card">
// //             <div class="financial-value">${data.averageOrderValue.toLocaleString('en-US', { style: 'currency', currency: data.shopCurrency || 'USD' })}</div>
// //             <div class="financial-label">Average Order Value</div>
// //           </div>
// //           <div class="financial-card">
// //             <div class="financial-value">${data.totalItems}</div>
// //             <div class="financial-label">Total Items Sold</div>
// //           </div>
// //         </div>
// //       </div>

// //       <div class="section">
// //         <h2>🚀 Today's Performance</h2>
// //         <div class="metrics-grid">
// //           <div class="metric-card">
// //             <div class="metric-value">${data.todayOrders}</div>
// //             <div class="metric-label">Today's Orders</div>
// //             ${data.ordersChangeVsYesterday !== 0 ? `
// //               <div class="growth-indicator ${data.ordersChangeVsYesterday >= 0 ? 'growth-positive' : 'growth-negative'}">
// //                 <span class="growth-arrow">${data.ordersChangeVsYesterday >= 0 ? '↗' : '↘'}</span>
// //                 ${Math.abs(data.ordersChangeVsYesterday).toFixed(1)}% vs yesterday
// //               </div>
// //             ` : '<div class="growth-indicator" style="visibility: hidden;">-</div>'}
// //           </div>
// //           <div class="metric-card">
// //             <div class="metric-value">${data.todayRevenue.toLocaleString('en-US', { style: 'currency', currency: data.shopCurrency || 'USD' })}</div>
// //             <div class="metric-label">Today's Revenue</div>
// //             ${data.revenueChangeVsYesterday !== 0 ? `
// //               <div class="growth-indicator ${data.revenueChangeVsYesterday >= 0 ? 'growth-positive' : 'growth-negative'}">
// //                 <span class="growth-arrow">${data.revenueChangeVsYesterday >= 0 ? '↗' : '↘'}</span>
// //                 ${Math.abs(data.revenueChangeVsYesterday).toFixed(1)}% vs yesterday
// //               </div>
// //             ` : '<div class="growth-indicator" style="visibility: hidden;">-</div>'}
// //           </div>
// //           <div class="metric-card">
// //             <div class="metric-value">${data.todayItems}</div>
// //             <div class="metric-label">Items Ordered Today</div>
// //             ${data.itemsChangeVsYesterday !== 0 ? `
// //               <div class="growth-indicator ${data.itemsChangeVsYesterday >= 0 ? 'growth-positive' : 'growth-negative'}">
// //                 <span class="growth-arrow">${data.itemsChangeVsYesterday >= 0 ? '↗' : '↘'}</span>
// //                 ${Math.abs(data.itemsChangeVsYesterday).toFixed(1)}% vs yesterday
// //               </div>
// //             ` : '<div class="growth-indicator" style="visibility: hidden;">-</div>'}
// //           </div>
// //         </div>
// //       </div>

// //       <div class="section">
// //         <h2>📊 Customer Insights</h2>
// //         <div class="financial-grid">
// //           <div class="financial-card">
// //             <div class="financial-value">${data.newCustomers}</div>
// //             <div class="financial-label">New Customers</div>
// //           </div>
// //           <div class="financial-card">
// //             <div class="financial-value">${data.repeatCustomers}</div>
// //             <div class="financial-label">Repeat Customers</div>
// //           </div>
// //           <div class="financial-card">
// //             <div class="financial-value">${data.customerRetentionRate.toFixed(1)}%</div>
// //             <div class="financial-label">Retention Rate</div>
// //           </div>
// //           <div class="financial-card">
// //             <div class="financial-value">${data.averageOrderFrequency.toFixed(1)}</div>
// //             <div class="financial-label">Avg Order Frequency</div>
// //           </div>
// //         </div>
// //       </div>

// //     <div class="section">
// //   <h2>📈 Event Summary</h2>
// //   <div class="financial-grid">
// //     <div class="financial-card">
// //       <div class="financial-value">${data.totalRefunds || 0}</div>
// //       <div class="financial-label">Full Refunds</div>
// //     </div>
// //     <div class="financial-card">
// //       <div class="financial-value">${data.totalPartialRefunds || 0}</div>
// //       <div class="financial-label">Partial Refunds</div>
// //     </div>
// //     <div class="financial-card">
// //       <div class="financial-value">${data.totalExchanges || 0}</div>
// //       <div class="financial-label">Exchanges</div>
// //     </div>
// //     <div class="financial-card">
// //       <div class="financial-value">${(data.netEventValue || 0).toLocaleString('en-US', { style: 'currency', currency: data.shopCurrency || 'USD' })}</div>
// //       <div class="financial-label">Net Event Impact</div>
// //     </div>
// //   </div>
// //   <div style="text-align: center; margin-top: 16px; color: #666; font-size: 0.9em;">
// //     Across ${data.totalEvents || 0} total events in ${data.ordersWithEvents || 0} orders
// //   </div>
// // </div>

// //       <div class="footer">
// //         <p><strong>Orders Dashboard Summary Report</strong> - Key Business Metrics</p>
// //         <p>Generated by Nexus | ${timestamp}</p>
// //       </div>
// //     </body>
// //     </html>
// //   `;

// //   printWindow.document.write(pdfContent);
// //   printWindow.document.close();
  
// //   setTimeout(() => {
// //     printWindow.print();
// //     printWindow.onafterprint = () => {
// //       setTimeout(() => {
// //         printWindow.close();
// //       }, 100);
// //     };
// //   }, 1000);
// // };

// // // ==================== 11.0 ICON COMPONENTS ====================

// // const Icon = {
// //   Print: () => (
// //     <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
// //       <path d="M19 8H5c-1.66 0-3 1.34-3 3v6h4v4h12v-4h4v-6c0-1.66-1.34-3-3-3zm-3 11H8v-5h8v5zm3-7c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1zm-1-9H6v4h12V3z"/>
// //     </svg>
// //   ),
// //   TrendUp: () => (
// //     <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
// //       <path d="M16 6l2.29 2.29-4.88 4.88-4-4L2 16.59 3.41 18l6-6 4 4 6.3-6.29L22 12V6z"/>
// //     </svg>
// //   ),
// //   TrendDown: () => (
// //     <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
// //       <path d="M16 18l2.29-2.29-4.88-4.88-4 4L2 7.41 3.41 6l6 6 4-4 6.3 6.29L22 12v6z"/>
// //     </svg>
// //   ),
// //   Export: () => (
// //     <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
// //       <path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z"/>
// //     </svg>
// //   )
// // };

// // // ==================== 12.0 LOADING COMPONENT ====================

// // function LoadingProgress() {
// //   const loadingSteps = [
// //     "Fetching recent orders...",
// //     "Analyzing revenue data...", 
// //     "Processing customer insights...",
// //     "Calculating fulfillment rates...",
// //     "Generating sales analytics..."
// //   ];

// //   return (
// //     <div className="loading-progress-container">
// //       <div className="loading-header">
// //         <h2>Loading Analytics Dashboard</h2>
// //         <p>Analyzing your order data and generating insights...</p>
// //       </div>
      
// //       <div className="progress-bar-container">
// //         <div className="progress-bar">
// //           <div className="progress-fill"></div>
// //         </div>
// //       </div>

// //       <div className="loading-steps">
// //         {loadingSteps.map((step, index) => (
// //           <div key={index} className="loading-step">
// //             <div className="step-indicator"></div>
// //             <div className="step-text">{step}</div>
// //           </div>
// //         ))}
// //       </div>
// //     </div>
// //   );
// // }

// // // ==================== 13.0 CHART COMPONENTS ====================

// // const ChartComponents = {
// //   formatCurrency: (amount: number, currency: string = 'USD') => {
// //     return amount.toLocaleString('en-US', { 
// //       style: 'currency', 
// //       currency: currency,
// //       minimumFractionDigits: 2 
// //     });
// //   },

// //   CustomerDistribution: ({ data }: { data: AnalyticsData }) => {
// //     const chartData = {
// //       labels: ['New Customers', 'Repeat Customers'],
// //       datasets: [
// //         {
// //           data: [data.totalCustomerData.newCustomers, data.totalCustomerData.repeatedCustomers],
// //           backgroundColor: ['#f59e0b', '#10b981'],
// //           borderWidth: 2,
// //           borderColor: '#fff'
// //         }
// //       ]
// //     };

// //     const options = {
// //       responsive: true,
// //       maintainAspectRatio: false,
// //       plugins: { legend: { display: false } },
// //       animation: { duration: 500 }
// //     };

// //     return (
// //       <div className="chart-container">
// //         <div className="chart-header">
// //           <div className="chart-title">Customer Distribution</div>
// //           <div className="chart-legend">
// //             <div className="legend-item">
// //               <div className="legend-color new"></div>
// //               <span>New</span>
// //             </div>
// //             <div className="legend-item">
// //               <div className="legend-color repeat"></div>
// //               <span>Repeat</span>
// //             </div>
// //           </div>
// //         </div>
// //         <Pie data={chartData} options={options} height={120} />
// //         <div className="mini-stats">
// //           <div className="mini-stat-card">
// //             <div className="mini-stat-value">
// //               {data.totalCustomerData.totalCustomers > 0 
// //                 ? `${((data.totalCustomerData.repeatedCustomers / data.totalCustomerData.totalCustomers) * 100).toFixed(1)}%`
// //                 : '0.0%'
// //               }
// //             </div>
// //             <div className="mini-stat-label">Repeat Rate</div>
// //           </div>
// //           <div className="mini-stat-card">
// //             <div className="mini-stat-value">{data.totalCustomerData.totalCustomers}</div>
// //             <div className="mini-stat-label">Total Customers</div>
// //           </div>
// //         </div>
// //       </div>
// //     );
// //   },

// //   RevenueTrend: ({ data }: { data: AnalyticsData }) => {
// //     const weeklyData = data.weeklyKeys.map(week => {
// //       const weekData = data.weeklyTotals[week];
// //       return {
// //         week: week.replace('Week of ', ''),
// //         revenue: weekData?.total || 0,
// //         totalSales: weekData?.totalSales || 0
// //       };
// //     });

// //     const totalRevenue = weeklyData.reduce((sum, w) => sum + w.revenue, 0);
// //     const totalSales = weeklyData.reduce((sum, w) => sum + w.totalSales, 0);
// //     const avgWeeklyRevenue = totalRevenue / weeklyData.length;

// //     const chartData = {
// //       labels: weeklyData.map(w => w.week),
// //       datasets: [
// //         {
// //           label: 'Revenue',
// //           data: weeklyData.map(w => w.revenue),
// //           borderColor: '#3b82f6',
// //           backgroundColor: 'rgba(59, 130, 246, 0.1)',
// //           tension: 0.4,
// //           fill: true,
// //           borderWidth: 2
// //         }
// //       ]
// //     };

// //     const options = {
// //       responsive: true,
// //       maintainAspectRatio: false,
// //       plugins: { legend: { display: false } },
// //       scales: {
// //         x: { grid: { display: false } },
// //         y: { 
// //           beginAtZero: true,
// //           ticks: {
// //             callback: function(this: any, value: any) {
// //               return '$' + value;
// //             }
// //           }
// //         }
// //       }
// //     };

// //     return (
// //       <div className="chart-container">
// //         <div className="chart-header">
// //           <div className="chart-title">Weekly Revenue Trend</div>
// //           <div className="chart-legend">
// //             <div className="legend-item">
// //               <div className="legend-color revenue"></div>
// //               <span>Revenue</span>
// //             </div>
// //           </div>
// //         </div>
// //         <Line data={chartData} options={options} height={120} />
// //         <div className="mini-stats">
// //           <div className="mini-stat-card">
// //             <div className="mini-stat-value">
// //               {ChartComponents.formatCurrency(totalRevenue, data.shopCurrency)}
// //             </div>
// //             <div className="mini-stat-label">Total Revenue</div>
// //           </div>
// //           <div className="mini-stat-card">
// //             <div className="mini-stat-value">
// //               {ChartComponents.formatCurrency(avgWeeklyRevenue, data.shopCurrency)}
// //             </div>
// //             <div className="mini-stat-label">Avg Weekly</div>
// //           </div>
// //           <div className="mini-stat-card">
// //             <div className="mini-stat-value">
// //               {ChartComponents.formatCurrency(totalSales, data.shopCurrency)}
// //             </div>
// //             <div className="mini-stat-label">Total Sales</div>
// //           </div>
// //         </div>
// //       </div>
// //     );
// //   },

// //   MonthlyPerformance: ({ data }: { data: AnalyticsData }) => {
// //     const monthlyData = data.monthRanges.map(month => {
// //       const monthData = data.monthlyTotals[month];
// //       return {
// //         month: month,
// //         revenue: monthData?.total || 0,
// //         orders: monthData?.orderCount || 0,
// //         totalSales: monthData?.totalSales || 0
// //       };
// //     });

// //     const totalRevenue = monthlyData.reduce((sum, m) => sum + m.revenue, 0);
// //     const totalOrders = monthlyData.reduce((sum, m) => sum + m.orders, 0);
// //     const totalSales = monthlyData.reduce((sum, m) => sum + m.totalSales, 0);
// //     const avgMonthlyRevenue = totalRevenue / monthlyData.length;

// //     const chartData = {
// //       labels: monthlyData.map(m => m.month),
// //       datasets: [
// //         {
// //           label: 'Revenue',
// //           data: monthlyData.map(m => m.revenue),
// //           backgroundColor: 'rgba(59, 130, 246, 0.8)',
// //           borderRadius: 4
// //         },
// //         {
// //           label: 'Orders',
// //           data: monthlyData.map(m => m.orders),
// //           backgroundColor: 'rgba(139, 92, 246, 0.8)',
// //           borderRadius: 4
// //         }
// //       ]
// //     };

// //     const options = {
// //       responsive: true,
// //       maintainAspectRatio: false,
// //       plugins: { legend: { display: false } },
// //       scales: {
// //         x: { grid: { display: false } },
// //         y: { beginAtZero: true }
// //       }
// //     };

// //     return (
// //       <div className="chart-container">
// //         <div className="chart-header">
// //           <div className="chart-title">Monthly Performance</div>
// //           <div className="chart-legend">
// //             <div className="legend-item">
// //               <div className="legend-color revenue"></div>
// //               <span>Revenue</span>
// //             </div>
// //             <div className="legend-item">
// //               <div className="legend-color orders"></div>
// //               <span>Orders</span>
// //             </div>
// //           </div>
// //         </div>
// //         <Bar data={chartData} options={options} height={120} />
// //         <div className="mini-stats">
// //           <div className="mini-stat-card">
// //             <div className="mini-stat-value">
// //               {ChartComponents.formatCurrency(totalRevenue, data.shopCurrency)}
// //             </div>
// //             <div className="mini-stat-label">Total Revenue</div>
// //           </div>
// //           <div className="mini-stat-card">
// //             <div className="mini-stat-value">
// //               {totalOrders}
// //             </div>
// //             <div className="mini-stat-label">Total Orders</div>
// //           </div>
// //           <div className="mini-stat-card">
// //             <div className="mini-stat-value">
// //               {ChartComponents.formatCurrency(totalSales, data.shopCurrency)}
// //             </div>
// //             <div className="mini-stat-label">Total Sales</div>
// //           </div>
// //         </div>
// //       </div>
// //     );
// //   },

// //   FinancialBreakdown: ({ data }: { data: AnalyticsData }) => {
// //     const financialData = {
// //       grossRevenue: Object.values(data.totals).reduce((sum: number, month: OrderStats) => sum + month.total, 0),
// //       netRevenue: Object.values(data.totals).reduce((sum: number, month: OrderStats) => sum + month.totalSales, 0),
// //       discounts: Object.values(data.totals).reduce((sum: number, month: OrderStats) => sum + month.discounts, 0),
// //       shipping: Object.values(data.totals).reduce((sum: number, month: OrderStats) => sum + month.shipping, 0),
// //       taxes: Object.values(data.totals).reduce((sum: number, month: OrderStats) => sum + month.taxes, 0),
// //       returns: Object.values(data.totals).reduce((sum: number, month: OrderStats) => sum + month.returns, 0)
// //     };

// //     const chartData = {
// //       labels: ['Gross Revenue', 'Discounts', 'Shipping', 'Taxes', 'Returns'],
// //       datasets: [
// //         {
// //           data: [
// //             financialData.grossRevenue,
// //             financialData.discounts,
// //             financialData.shipping,
// //             financialData.taxes,
// //             financialData.returns
// //           ],
// //           backgroundColor: ['#3b82f6', '#f59e0b', '#10b981', '#8b5cf6', '#ef4444'],
// //           borderWidth: 2,
// //           borderColor: '#fff'
// //         }
// //       ]
// //     };

// //     const options = {
// //       responsive: true,
// //       maintainAspectRatio: false,
// //       plugins: { legend: { display: false } }
// //     };

// //     return (
// //       <div className="chart-container">
// //         <div className="chart-header">
// //           <div className="chart-title">Financial Breakdown</div>
// //           <div className="chart-legend">
// //             <div className="legend-item">
// //               <div className="legend-color revenue"></div>
// //               <span>Revenue</span>
// //             </div>
// //             <div className="legend-item">
// //               <div className="legend-color discounts"></div>
// //               <span>Discounts</span>
// //             </div>
// //             <div className="legend-item">
// //               <div className="legend-color shipping"></div>
// //               <span>Shipping</span>
// //             </div>
// //             <div className="legend-item">
// //               <div className="legend-color taxes"></div>
// //               <span>Taxes</span>
// //             </div>
// //             <div className="legend-item">
// //               <div className="legend-color returns"></div>
// //               <span>Returns</span>
// //             </div>
// //           </div>
// //         </div>
// //         <Pie data={chartData} options={options} height={120} />
// //         <div className="mini-stats">
// //           <div className="mini-stat-card">
// //             <div className="mini-stat-value">
// //               {ChartComponents.formatCurrency(financialData.netRevenue, data.shopCurrency)}
// //             </div>
// //             <div className="mini-stat-label">Net Revenue</div>
// //           </div>
// //           <div className="mini-stat-card">
// //             <div className="mini-stat-value">
// //               {financialData.grossRevenue > 0 
// //                 ? `${((Math.abs(financialData.returns) / financialData.grossRevenue) * 100).toFixed(1)}%`
// //                 : '0.0%'
// //               }
// //             </div>
// //             <div className="mini-stat-label">Return Rate</div>
// //           </div>
// //         </div>
// //       </div>
// //     );
// //   }
// // };

// // // ==================== 14.0 EVENT SUMMARY COMPONENT ====================

// // function EventSummaryDisplay({ eventSummary, title }: { eventSummary: EventSummary, title: string }) {
// //   if (!eventSummary || eventSummary.totalEvents === 0) {
// //     return null;
// //   }

// //   const formatValue = (value: number) => {
// //     const absValue = Math.abs(value);
// //     const sign = value < 0 ? '-' : value > 0 ? '+' : '';
// //     return `${sign}$${absValue.toFixed(2)}`;
// //   };

// //   return (
// //     <section className="event-summary-display">
// //       <h3>📊 {title} ({eventSummary.totalEvents} event{eventSummary.totalEvents !== 1 ? 's' : ''})</h3>
      
// //       <div className="event-summary-grid">
// //         {/* Full Refunds */}
// //         {eventSummary.refunds.count > 0 && (
// //           <div className="event-card refunds">
// //             <div className="event-label">Full Refunds</div>
// //             <div className="event-value">{formatValue(eventSummary.refunds.value)}</div>
// //             <div className="event-count">
// //               {eventSummary.refunds.count} refund{eventSummary.refunds.count !== 1 ? 's' : ''}
// //             </div>
// //           </div>
// //         )}

// //         {/* Partial Refunds */}
// //         {eventSummary.partialRefunds.count > 0 && (
// //           <div className="event-card partial-refunds">
// //             <div className="event-label">Partial Refunds</div>
// //             <div className="event-value">{formatValue(eventSummary.partialRefunds.value)}</div>
// //             <div className="event-count">
// //               {eventSummary.partialRefunds.count} refund{eventSummary.partialRefunds.count !== 1 ? 's' : ''}
// //             </div>
// //           </div>
// //         )}

// //         {/* Exchanges */}
// //         {eventSummary.exchanges.count > 0 && (
// //           <div className="event-card exchanges">
// //             <div className="event-label">Exchanges</div>
// //             <div className="event-value">{formatValue(eventSummary.exchanges.value)}</div>
// //             <div className="event-count">
// //               {eventSummary.exchanges.count} exchange{eventSummary.exchanges.count !== 1 ? 's' : ''}
// //             </div>
// //           </div>
// //         )}

// //         {/* Net Summary */}
// //         <div className="event-card net-summary">
// //           <div className="event-label">Net Impact</div>
// //           <div className="event-value">{formatValue(eventSummary.netValue)}</div>
// //           <div className="event-count">
// //             across {eventSummary.totalEvents} event{eventSummary.totalEvents !== 1 ? 's' : ''}
// //           </div>
// //         </div>
// //       </div>
// //     </section>
// //   );
// // }

// // // ==================== 15.0 MISMATCH SUMMARY COMPONENT ====================

// // function MismatchSummaryCard({ mismatchSummary, periodType }: { 
// //   mismatchSummary: { 
// //     totalMismatches: number; 
// //     totalDifference: number; 
// //     hasMismatches: boolean; 
// //   };
// //   periodType: 'day' | 'week' | 'month';
// // }) {
// //   if (!mismatchSummary.hasMismatches) {
// //     return null;
// //   }

// //   const getPeriodLabel = () => {
// //     switch (periodType) {
// //       case 'day': return 'Days';
// //       case 'week': return 'Weeks'; 
// //       case 'month': return 'Months';
// //       default: return 'Periods';
// //     }
// //   };

// //   const getDifferenceColor = (difference: number) => {
// //     return Math.abs(difference) > 0.01 ? '#dc2626' : '#059669';
// //   };

// //   const getDifferenceText = (difference: number) => {
// //     const absDiff = Math.abs(difference);
// //     if (absDiff <= 0.01) return 'Perfect Match';
// //     return `$${absDiff.toFixed(2)}`;
// //   };

// //   return (
// //     <section className="mismatch-summary-card">
// //       <h3>⚠ Calculation Verification</h3>
      
// //       <div className="mismatch-summary-content">
// //         <div className="mismatch-metric">
// //           <div className="mismatch-value">{mismatchSummary.totalMismatches}</div>
// //           <div className="mismatch-label">{getPeriodLabel()} with Mismatches</div>
// //         </div>
        
// //         <div className="mismatch-metric">
// //           <div 
// //             className="mismatch-value" 
// //             style={{ color: getDifferenceColor(mismatchSummary.totalDifference) }}
// //           >
// //             {getDifferenceText(mismatchSummary.totalDifference)}
// //           </div>
// //           <div className="mismatch-label">Total Difference</div>
// //         </div>
// //       </div>
      
// //       <div className="mismatch-note">
// //         {mismatchSummary.totalMismatches > 0 ? (
// //           <span style={{ color: '#dc2626' }}>
// //             Found {mismatchSummary.totalMismatches} {getPeriodLabel().toLowerCase()} with calculation discrepancies
// //           </span>
// //         ) : (
// //           <span style={{ color: '#059669' }}>
// //             All calculations match perfectly!
// //           </span>
// //         )}
// //       </div>
// //     </section>
// //   );
// // }

// // // ==================== 16.0 MAIN REACT COMPONENT ====================

// // function ShopifyAnalyticsPage() {
// //   const data = useLoaderData<typeof loader>();
// //   const [isLoading, setIsLoading] = useState(true);
// //   const [isExporting, setIsExporting] = useState(false);
// //   const [isManualRefresh, setIsManualRefresh] = useState(false);

// //   const handleManualRefresh = () => {
// //     setIsManualRefresh(true);
// //     setIsLoading(true);
// //     window.location.reload();
// //   }

// //   useEffect(() => {
// //     if (data && !("error" in data)) {
// //       setIsLoading(false);
// //     }
// //   }, [data]);

// //   if (isLoading && isManualRefresh) {
// //     return (
// //       <div className="orders-dashboard">
// //         <div className="dashboard-header">
// //           <h1>Analytics Dashboard</h1>
// //         </div>
// //         <div className="loading-progress-container">
// //           <div className="loading-header">
// //             <h2>Refreshing Your Data</h2>
// //             <p>Please wait while we update your analytics...</p>
// //           </div>
          
// //           <div className="progress-bar-container">
// //             <div className="progress-bar">
// //               <div className="progress-fill"></div>
// //             </div>
// //           </div>

// //           <div className="loading-steps">
// //             {[
// //               "Refreshing order data...",
// //               "Updating revenue calculations...", 
// //               "Processing customer insights...",
// //               "Recalculating metrics...",
// //               "Finalizing your dashboard..."
// //             ].map((step, index) => (
// //               <div key={index} className="loading-step">
// //                 <div className="step-indicator"></div>
// //                 <div className="step-text">{step}</div>
// //               </div>
// //             ))}
// //           </div>
// //         </div>
// //       </div>
// //     );
// //   }

// //    if (isLoading) {
// //     return (
// //       <div className="orders-dashboard">
// //         <div className="dashboard-header">
// //           <h1>Analytics Dashboard</h1>
// //         </div>
// //         <LoadingProgress />
// //       </div>
// //     );
// //   }

// //   const getSafeData = (data: any): CachedAnalyticsData | null => {
// //     if (!data || typeof data !== 'object') return null;
    
// //     const safeData: CachedAnalyticsData = {
// //       shop: data.shop || 'unknown',
// //       totals: data.totals || {},
// //       dailyTotals: data.dailyTotals || {},
// //       weeklyTotals: data.weeklyTotals || {},
// //       monthlyTotals: data.monthlyTotals || {},
// //       totalOrders: typeof data.totalOrders === 'number' ? data.totalOrders : 0,
// //       totalCustomerData: data.totalCustomerData || { newCustomers: 0, repeatedCustomers: 0, totalCustomers: 0 },
// //       monthRanges: Array.isArray(data.monthRanges) ? data.monthRanges : [],
// //       dailyKeys: Array.isArray(data.dailyKeys) ? data.dailyKeys : [],
// //       weeklyKeys: Array.isArray(data.weeklyKeys) ? data.weeklyKeys : [],
// //       lastUpdated: data.lastUpdated || new Date().toISOString(),
// //       shopTimeZone: data.shopTimeZone || 'UTC',
// //       shopCurrency: data.shopCurrency || 'USD',
// //       _cacheInfo: data._cacheInfo || undefined
// //     };

// //     return safeData;
// //   };

// //   const safeNumber = (value: unknown) => (typeof value === "number" ? value : 0);
  
// //   const getSafeCustomerStats = (stats: Record<string, OrderStats & CustomerData>, key: string): OrderStats & CustomerData => {
// //     const stat = stats[key];
// //     if (!stat) {
// //       return {
// //         total: 0,
// //         discounts: 0,
// //         returns: 0,
// //         netSales: 0,
// //         shipping: 0,
// //         taxes: 0,
// //         extraFees: 0,
// //         totalSales: 0,
// //         shippingRefunds: 0,
// //         netReturns: 0,
// //         totalRefund: 0,
// //         items: 0,
// //         fulfilled: 0,
// //         unfulfilled: 0,
// //         orderCount: 0,
// //         hasSubsequentEvents: false,
// //         eventSummary: null,
// //         refundsCount: 0,
// //         financialStatus: 'pending',
// //         newCustomers: 0,
// //         repeatedCustomers: 0,
// //         totalCustomers: 0,
// //         discountsReturned: 0,
// //         netDiscounts: 0,
// //         returnShippingCharges: 0,
// //         restockingFees: 0,
// //         returnFees: 0,
// //         refundDiscrepancy: 0
// //       };
// //     }
// //     return stat;
// //   };

// //   const getCalculationMismatchSummary = (data: AnalyticsData) => {
// //     let totalMismatches = 0;
// //     let totalDifference = 0;

// //     Object.values(data.dailyTotals).forEach(dayData => {
// //       const calculatedTotal = dayData.netSales + dayData.shipping + dayData.taxes + dayData.extraFees;
// //       const mismatch = Math.abs(dayData.totalSales - calculatedTotal) > 0.01;
      
// //       if (mismatch) {
// //         totalMismatches++;
// //         const difference = calculatedTotal - dayData.totalSales;
// //         totalDifference += difference;
// //       }
// //     });

// //     return {
// //       totalMismatches,
// //       totalDifference: parseFloat(totalDifference.toFixed(2)),
// //       hasMismatches: totalMismatches > 0
// //     };
// //   };

// //   const getTodayMismatchSummary = (data: AnalyticsData) => {
// //     const todayKey = new Date().toLocaleDateString("en-CA", { timeZone: data.shopTimeZone });
// //     const todayData = getSafeCustomerStats(data.dailyTotals, todayKey);
    
// //     const calculatedTotal = todayData.netSales + todayData.shipping + todayData.taxes + todayData.extraFees;
// //     const mismatch = Math.abs(todayData.totalSales - calculatedTotal) > 0.01;
    
// //     return {
// //       totalMismatches: mismatch ? 1 : 0,
// //       totalDifference: mismatch ? (calculatedTotal - todayData.totalSales) : 0,
// //       hasMismatches: mismatch
// //     };
// //   };

// //   const getWeeklyMismatchSummary = (data: AnalyticsData) => {
// //     let totalMismatches = 0;
// //     let totalDifference = 0;

// //     Object.values(data.weeklyTotals).forEach(weekData => {
// //       const calculatedTotal = weekData.netSales + weekData.shipping + weekData.taxes + weekData.extraFees;
// //       const mismatch = Math.abs(weekData.totalSales - calculatedTotal) > 0.01;
      
// //       if (mismatch) {
// //         totalMismatches++;
// //         totalDifference += (calculatedTotal - weekData.totalSales);
// //       }
// //     });

// //     return {
// //       totalMismatches,
// //       totalDifference: parseFloat(totalDifference.toFixed(2)),
// //       hasMismatches: totalMismatches > 0
// //     };
// //   };

// //   const getMonthlyMismatchSummary = (data: AnalyticsData) => {
// //     let totalMismatches = 0;
// //     let totalDifference = 0;

// //     Object.values(data.monthlyTotals).forEach(monthData => {
// //       const calculatedTotal = monthData.netSales + monthData.shipping + monthData.taxes + monthData.extraFees;
// //       const mismatch = Math.abs(monthData.totalSales - calculatedTotal) > 0.01;
      
// //       if (mismatch) {
// //         totalMismatches++;
// //         totalDifference += (calculatedTotal - monthData.totalSales);
// //       }
// //     });

// //     return {
// //       totalMismatches,
// //       totalDifference: parseFloat(totalDifference.toFixed(2)),
// //       hasMismatches: totalMismatches > 0
// //     };
// //   };

// //   const getTodayData = () => {
// //     const safeData = getSafeData(data);
// //     if (!safeData) return null;
    
// //     const todayKey = new Date().toLocaleDateString("en-CA", { timeZone: safeData.shopTimeZone });
// //     const todayData = getSafeCustomerStats(safeData.dailyTotals, todayKey);
    
// //     return {
// //       ...todayData,
// //       ordersWithSubsequentEvents: todayData.hasSubsequentEvents ? 1 : 0,
// //       subsequentEventsCount: todayData.eventSummary?.totalEvents || 0,
// //       subsequentEventsValue: todayData.eventSummary ? Math.abs(todayData.eventSummary.netValue) : 0
// //     };
// //   };

// //   const getLast7DaysData = () => {
// //     const safeData = getSafeData(data);
// //     if (!safeData) return null;

// //     let totalRevenue = 0;
// //     let totalOrders = 0;
// //     let totalItems = 0;
// //     let totalNewCustomers = 0;
// //     let totalRepeatCustomers = 0;
// //     let totalFulfilled = 0;
// //     let totalUnfulfilled = 0;
// //     let totalDiscounts = 0;
// //     let totalReturns = 0;
// //     let totalNetSales = 0;
// //     let totalShipping = 0;
// //     let totalTaxes = 0;
// //     let totalExtraFees = 0;
// //     let totalTotalSales = 0;
// //     let totalShippingRefunds = 0;
// //     let totalNetReturns = 0;
// //     let totalTotalRefund = 0;

// //     const periodEventSummary: EventSummary = {
// //       refunds: { count: 0, value: 0 },
// //       exchanges: { count: 0, value: 0 },
// //       partialRefunds: { count: 0, value: 0 },
// //       totalEvents: 0,
// //       netValue: 0
// //     };

// //     let ordersWithEventsCount = 0;
// //     let totalEventsValue = 0;

// //     safeData.dailyKeys.forEach(day => {
// //       const dayData = getSafeCustomerStats(safeData.dailyTotals, day);
// //       totalRevenue += dayData.total;
// //       totalOrders += dayData.orderCount;
// //       totalItems += dayData.items;
// //       totalNewCustomers += dayData.newCustomers;
// //       totalRepeatCustomers += dayData.repeatedCustomers;
// //       totalFulfilled += dayData.fulfilled;
// //       totalUnfulfilled += dayData.unfulfilled;
// //       totalDiscounts += dayData.discounts;
// //       totalReturns += dayData.returns;
// //       totalNetSales += dayData.netSales;
// //       totalShipping += dayData.shipping;
// //       totalTaxes += dayData.taxes;
// //       totalExtraFees += dayData.extraFees;
// //       totalTotalSales += dayData.totalSales;
// //       totalShippingRefunds += dayData.shippingRefunds;
// //       totalNetReturns += dayData.netReturns;
// //       totalTotalRefund += dayData.totalRefund;
      
// //       if (dayData.eventSummary) {
// //         ordersWithEventsCount += dayData.hasSubsequentEvents ? 1 : 0;
        
// //         periodEventSummary.refunds.count += dayData.eventSummary.refunds.count;
// //         periodEventSummary.refunds.value += dayData.eventSummary.refunds.value;
// //         periodEventSummary.exchanges.count += dayData.eventSummary.exchanges.count;
// //         periodEventSummary.exchanges.value += dayData.eventSummary.exchanges.value;
// //         periodEventSummary.partialRefunds.count += dayData.eventSummary.partialRefunds.count;
// //         periodEventSummary.partialRefunds.value += dayData.eventSummary.partialRefunds.value;
// //         periodEventSummary.totalEvents += dayData.eventSummary.totalEvents;
// //         periodEventSummary.netValue += dayData.eventSummary.netValue;

// //         totalEventsValue += Math.abs(dayData.eventSummary.netValue);
// //       }
// //     });

// //     return {
// //       totalRevenue,
// //       totalOrders,
// //       totalItems,
// //       totalNewCustomers,
// //       totalRepeatCustomers,
// //       totalFulfilled,
// //       totalUnfulfilled,
// //       totalDiscounts,
// //       totalReturns,
// //       totalNetSales,
// //       totalShipping,
// //       totalTaxes,
// //       totalExtraFees,
// //       totalTotalSales,
// //       totalShippingRefunds,
// //       totalNetReturns,
// //       totalTotalRefund,
// //       eventSummary: periodEventSummary,
// //       ordersWithSubsequentEvents: ordersWithEventsCount,
// //       subsequentEventsCount: periodEventSummary.totalEvents,
// //       subsequentEventsValue: parseFloat(totalEventsValue.toFixed(2)),
// //       avgDailyRevenue: totalRevenue / 7,
// //       discountRate: totalRevenue > 0 ? (totalDiscounts / totalRevenue) * 100 : 0,
// //       shippingRate: totalRevenue > 0 ? (totalShipping / totalRevenue) * 100 : 0,
// //       taxRate: totalRevenue > 0 ? (totalTaxes / totalRevenue) * 100 : 0,
// //       returnRate: totalRevenue > 0 ? (totalReturns / totalRevenue) * 100 : 0
// //     };
// //   };

// //   const getWeeklyFinancials = () => {
// //     const safeData = getSafeData(data);
// //     if (!safeData) return null;

// //     let totalRevenue = 0;
// //     let totalOrders = 0;
// //     let totalItems = 0;
// //     let totalDiscounts = 0;
// //     let totalReturns = 0;
// //     let totalNetSales = 0;
// //     let totalShipping = 0;
// //     let totalTaxes = 0;
// //     let totalExtraFees = 0;
// //     let totalTotalSales = 0;
// //     let totalShippingRefunds = 0;
// //     let totalNetReturns = 0;
// //     let totalTotalRefund = 0;

// //     const periodEventSummary: EventSummary = {
// //       refunds: { count: 0, value: 0 },
// //       exchanges: { count: 0, value: 0 },
// //       partialRefunds: { count: 0, value: 0 },
// //       totalEvents: 0,
// //       netValue: 0
// //     };

// //     let ordersWithEventsCount = 0;
// //     let totalEventsValue = 0;

// //     safeData.weeklyKeys.forEach(week => {
// //       const weekData = getSafeCustomerStats(safeData.weeklyTotals, week);
// //       totalRevenue += weekData.total;
// //       totalOrders += weekData.orderCount;
// //       totalItems += weekData.items;
// //       totalDiscounts += weekData.discounts;
// //       totalReturns += weekData.returns;
// //       totalNetSales += weekData.netSales;
// //       totalShipping += weekData.shipping;
// //       totalTaxes += weekData.taxes;
// //       totalExtraFees += weekData.extraFees;
// //       totalTotalSales += weekData.totalSales;
// //       totalShippingRefunds += weekData.shippingRefunds;
// //       totalNetReturns += weekData.netReturns;
// //       totalTotalRefund += weekData.totalRefund;
      
// //       if (weekData.eventSummary) {
// //         ordersWithEventsCount += weekData.hasSubsequentEvents ? 1 : 0;
        
// //         periodEventSummary.refunds.count += weekData.eventSummary.refunds.count;
// //         periodEventSummary.refunds.value += weekData.eventSummary.refunds.value;
// //         periodEventSummary.exchanges.count += weekData.eventSummary.exchanges.count;
// //         periodEventSummary.exchanges.value += weekData.eventSummary.exchanges.value;
// //         periodEventSummary.partialRefunds.count += weekData.eventSummary.partialRefunds.count;
// //         periodEventSummary.partialRefunds.value += weekData.eventSummary.partialRefunds.value;
// //         periodEventSummary.totalEvents += weekData.eventSummary.totalEvents;
// //         periodEventSummary.netValue += weekData.eventSummary.netValue;

// //         totalEventsValue += Math.abs(weekData.eventSummary.netValue);
// //       }
// //     });

// //     return {
// //       totalRevenue,
// //       totalOrders,
// //       totalItems,
// //       totalDiscounts,
// //       totalReturns,
// //       totalNetSales,
// //       totalShipping,
// //       totalTaxes,
// //       totalExtraFees,
// //       totalTotalSales,
// //       totalShippingRefunds,
// //       totalNetReturns,
// //       totalTotalRefund,
// //       eventSummary: periodEventSummary,
// //       ordersWithSubsequentEvents: ordersWithEventsCount,
// //       subsequentEventsCount: periodEventSummary.totalEvents,
// //       subsequentEventsValue: parseFloat(totalEventsValue.toFixed(2)),
// //       netRevenue: totalTotalSales,
// //       discountRate: totalRevenue > 0 ? (totalDiscounts / totalRevenue) * 100 : 0,
// //       shippingRate: totalRevenue > 0 ? (totalShipping / totalRevenue) * 100 : 0,
// //       taxRate: totalRevenue > 0 ? (totalTaxes / totalRevenue) * 100 : 0,
// //       returnRate: totalRevenue > 0 ? (totalReturns / totalRevenue) * 100 : 0
// //     };
// //   };

// //   const getMonthlyFinancials = () => {
// //     const safeData = getSafeData(data);
// //     if (!safeData) return null;

// //     let totalRevenue = 0;
// //     let totalOrders = 0;
// //     let totalItems = 0;
// //     let totalDiscounts = 0;
// //     let totalReturns = 0;
// //     let totalNetSales = 0;
// //     let totalShipping = 0;
// //     let totalTaxes = 0;
// //     let totalExtraFees = 0;
// //     let totalTotalSales = 0;
// //     let totalShippingRefunds = 0;
// //     let totalNetReturns = 0;
// //     let totalTotalRefund = 0;

// //     const periodEventSummary: EventSummary = {
// //       refunds: { count: 0, value: 0 },
// //       exchanges: { count: 0, value: 0 },
// //       partialRefunds: { count: 0, value: 0 },
// //       totalEvents: 0,
// //       netValue: 0
// //     };

// //     let ordersWithEventsCount = 0;
// //     let totalEventsValue = 0;

// //     safeData.monthRanges.forEach(month => {
// //       const monthData = getSafeCustomerStats(safeData.monthlyTotals, month);
// //       totalRevenue += monthData.total;
// //       totalOrders += monthData.orderCount;
// //       totalItems += monthData.items;
// //       totalDiscounts += monthData.discounts;
// //       totalReturns += monthData.returns;
// //       totalNetSales += monthData.netSales;
// //       totalShipping += monthData.shipping;
// //       totalTaxes += monthData.taxes;
// //       totalExtraFees += monthData.extraFees;
// //       totalTotalSales += monthData.totalSales;
// //       totalShippingRefunds += monthData.shippingRefunds;
// //       totalNetReturns += monthData.netReturns;
// //       totalTotalRefund += monthData.totalRefund;
      
// //       if (monthData.eventSummary) {
// //         ordersWithEventsCount += monthData.hasSubsequentEvents ? 1 : 0;
        
// //         periodEventSummary.refunds.count += monthData.eventSummary.refunds.count;
// //         periodEventSummary.refunds.value += monthData.eventSummary.refunds.value;
// //         periodEventSummary.exchanges.count += monthData.eventSummary.exchanges.count;
// //         periodEventSummary.exchanges.value += monthData.eventSummary.exchanges.value;
// //         periodEventSummary.partialRefunds.count += monthData.eventSummary.partialRefunds.count;
// //         periodEventSummary.partialRefunds.value += monthData.eventSummary.partialRefunds.value;
// //         periodEventSummary.totalEvents += monthData.eventSummary.totalEvents;
// //         periodEventSummary.netValue += monthData.eventSummary.netValue;

// //         totalEventsValue += Math.abs(monthData.eventSummary.netValue);
// //       }
// //     });

// //     return {
// //       totalRevenue,
// //       totalOrders,
// //       totalItems,
// //       totalDiscounts,
// //       totalReturns,
// //       totalNetSales,
// //       totalShipping,
// //       totalTaxes,
// //       totalExtraFees,
// //       totalTotalSales,
// //       totalShippingRefunds,
// //       totalNetReturns,
// //       totalTotalRefund,
// //       eventSummary: periodEventSummary,
// //       ordersWithSubsequentEvents: ordersWithEventsCount,
// //       subsequentEventsCount: periodEventSummary.totalEvents,
// //       subsequentEventsValue: parseFloat(totalEventsValue.toFixed(2)),
// //       netRevenue: totalTotalSales,
// //       discountRate: totalRevenue > 0 ? (totalDiscounts / totalRevenue) * 100 : 0,
// //       shippingRate: totalRevenue > 0 ? (totalShipping / totalRevenue) * 100 : 0,
// //       taxRate: totalRevenue > 0 ? (totalTaxes / totalRevenue) * 100 : 0,
// //       returnRate: totalRevenue > 0 ? (totalReturns / totalRevenue) * 100 : 0
// //     };
// //   };

// //   const formatNumber = (num: number) => num.toLocaleString('en-US');
// //   const formatPercent = (num: number) => `${num.toFixed(1)}%`;
// //   const formatCurrency = (amount: number) => {
// //     const currency = safeData?.shopCurrency || 'USD';
// //     return amount.toLocaleString('en-US', { 
// //       style: 'currency', 
// //       currency: currency,
// //       minimumFractionDigits: 2 
// //     });
// //   };

// //   // In the exportToPDF function within the main component:

// // const exportToPDF = () => {
// //   setIsExporting(true);
  
// //   const safeData = getSafeData(data);
// //   const todayData = getTodayData();
// //   const last7DaysData = getLast7DaysData();
// //   const weeklyFinancials = getWeeklyFinancials();
// //   const monthlyFinancials = getMonthlyFinancials();
  
// //   if (!safeData || !todayData || !last7DaysData || !weeklyFinancials || !monthlyFinancials) {
// //     setIsExporting(false);
// //     return;
// //   }

// //   // Use the most comprehensive event data available
// //   const eventData = monthlyFinancials.eventSummary || weeklyFinancials.eventSummary || last7DaysData.eventSummary;
  
// //   // Calculate total events count
// //   const totalEvents = eventData ? 
// //     (eventData.refunds.count + eventData.exchanges.count + eventData.partialRefunds.count) : 0;
  
// //   // Calculate orders with events (from the data we already have)
// //   const ordersWithEvents = monthlyFinancials.ordersWithSubsequentEvents || 
// //                           weeklyFinancials.ordersWithSubsequentEvents || 
// //                           last7DaysData.ordersWithSubsequentEvents || 0;

// //   const pdfData: OrderData = {
// //     totalOrders: safeData.totalOrders,
// //     totalCustomers: safeData.totalCustomerData.totalCustomers,
// //     fulfillmentRate: safeData.totalOrders > 0 ? 
// //       ((last7DaysData.totalFulfilled / last7DaysData.totalOrders) * 100) : 0,
// //     totalRevenue: monthlyFinancials.totalRevenue,
// //     netRevenue: monthlyFinancials.netRevenue,
// //     averageOrderValue: safeData.totalOrders > 0 ? 
// //       (monthlyFinancials.totalRevenue / safeData.totalOrders) : 0,
// //     totalItems: monthlyFinancials.totalItems,
// //     todayOrders: todayData.orderCount,
// //     todayRevenue: todayData.total,
// //     todayItems: todayData.items,
// //     ordersChangeVsYesterday: 100.0,
// //     revenueChangeVsYesterday: 100.0,
// //     itemsChangeVsYesterday: 100.0,
// //     newCustomers: safeData.totalCustomerData.newCustomers,
// //     repeatCustomers: safeData.totalCustomerData.repeatedCustomers,
// //     customerRetentionRate: safeData.totalCustomerData.totalCustomers > 0 ? 
// //       ((safeData.totalCustomerData.repeatedCustomers / safeData.totalCustomerData.totalCustomers) * 100) : 0,
// //     averageOrderFrequency: 1.0,
// //     shopTimezone: safeData.shopTimeZone,
// //     shopCurrency: safeData.shopCurrency,
// //     // ACCURATE EVENT DATA
// //     totalRefunds: eventData?.refunds.count || 0,
// //     totalExchanges: eventData?.exchanges.count || 0,
// //     totalPartialRefunds: eventData?.partialRefunds.count || 0,
// //     totalEvents: totalEvents,
// //     ordersWithEvents: ordersWithEvents,
// //     netEventValue: eventData?.netValue || 0
// //   };

// //   console.log('🔍 PDF Export Event Data:', pdfData);

// //   generatePDFReport(pdfData);
// //   setIsExporting(false);
// // };
// //   if (isLoading) {
// //     return (
// //       <div className="orders-dashboard">
// //         <div className="dashboard-header">
// //           <h1>Analytics Dashboard</h1>
// //         </div>
// //         <LoadingProgress />
// //       </div>
// //     );
// //   }

// //   if ("error" in data) {
// //   return (
// //     <div className="orders-dashboard">
// //       <div style={{ padding: "40px", textAlign: "center", background: "#fff5f5", borderRadius: "8px" }}>
// //         <h1>We're Sorry</h1>
// //         <p>{data.userMessage}</p>
// //         <button className="print-button" onClick={handleManualRefresh}>
// //           Refresh Page
// //         </button>
// //       </div>
// //     </div>
// //   );
// // }

// //   const safeData = getSafeData(data);
// //   const todayData = getTodayData();
// //   const last7DaysData = getLast7DaysData();
// //   const weeklyFinancials = getWeeklyFinancials();
// //   const monthlyFinancials = getMonthlyFinancials();

// //   if (!safeData || !todayData || !last7DaysData || !weeklyFinancials || !monthlyFinancials) {
// //     return (
// //       <div className="orders-dashboard">
// //         <div style={{ padding: "20px", color: "red", textAlign: "center" }}>
// //           <h1>Data Validation Failed</h1>
// //           <p>Please refresh the page.</p>
// //         </div>
// //       </div>
// //     );
// //   }

// //   const formatDateDisplay = (dateStr: string) => {
// //     const date = new Date(dateStr + 'T00:00:00');
// //     return date.toLocaleDateString('en-US', { 
// //       month: 'short', 
// //       day: 'numeric',
// //       timeZone: safeData.shopTimeZone 
// //     });
// //   };

// //   const getDayName = (dateStr: string) => {
// //     const date = new Date(dateStr + 'T00:00:00');
// //     return date.toLocaleDateString('en-US', { 
// //       weekday: 'short',
// //       timeZone: safeData.shopTimeZone 
// //     });
// //   };

// //   return (
// //     <div className="orders-dashboard">
// //       <div className="dashboard-header">
// //         <h1>Orders Dashboard</h1>
// //         <div className="header-controls">
// //           <button 
// //             className="export-button"
// //             onClick={exportToPDF}
// //             disabled={isExporting}
// //             title="Export summary PDF report with key metrics"
// //           >
// //             <Icon.Export />
// //             {isExporting ? 'Generating PDF...' : 'Export Summary'}
// //           </button>
// //         </div>
// //       </div>

// //       <div id="dashboard-content">
// //         {/* Today's Performance Section */}
// //         <section className="today-performance">
// //           <h2>Today's Performance</h2>
// //           <MismatchSummaryCard 
// //             mismatchSummary={getTodayMismatchSummary(safeData)} 
// //             periodType="day" 
// //           />
          
// //           <div className="primary-metrics-grid">
// //             <div className="metric-card orders">
// //               <div className="metric-value">{safeNumber(todayData.orderCount)}</div>
// //               <div className="metric-label">Today's Orders</div>
// //               <div className="metric-change positive">
// //                 <Icon.TrendUp />
// //                 100.0% vs yesterday
// //               </div>
// //             </div>
            
// //             <div className="metric-card revenue">
// //               <div className="metric-value">{formatCurrency(safeNumber(todayData.totalSales))}</div>
// //               <div className="metric-label">Today's Total Sales</div>
// //               <div className="metric-change positive">
// //                 <Icon.TrendUp />
// //                 100.0% vs yesterday
// //               </div>
// //             </div>
            
// //             <div className="metric-card items">
// //               <div className="metric-value">{safeNumber(todayData.items)}</div>
// //               <div className="metric-label">Items Ordered</div>
// //               <div className="metric-change positive">
// //                 <Icon.TrendUp />
// //                 100.0% vs yesterday
// //               </div>
// //             </div>
// //           </div>

// //           <div className="fulfillment-metrics-grid">
// //             <div className="fulfillment-metric-card today-fulfilled">
// //               <div className="fulfillment-metric-value">{safeNumber(todayData.fulfilled)}</div>
// //               <div className="fulfillment-metric-label">FULFILLED TODAY</div>
// //               <div className="fulfillment-metric-period">Today</div>
// //             </div>
            
// //             <div className="fulfillment-metric-card today-unfulfilled">
// //               <div className="fulfillment-metric-value">{safeNumber(todayData.unfulfilled)}</div>
// //               <div className="fulfillment-metric-label">UNFULFILLED TODAY</div>
// //               <div className="fulfillment-metric-period">Today</div>
// //             </div>
            
// //             <div className="fulfillment-metric-card week-fulfilled">
// //               <div className="fulfillment-metric-value">{safeNumber(last7DaysData.totalFulfilled)}</div>
// //               <div className="fulfillment-metric-label">FULFILLED</div>
// //               <div className="fulfillment-metric-period">Last 7 Days</div>
// //             </div>
            
// //             <div className="fulfillment-metric-card week-unfulfilled">
// //               <div className="fulfillment-metric-value">{safeNumber(last7DaysData.totalUnfulfilled)}</div>
// //               <div className="fulfillment-metric-label">UNFULFILLED</div>
// //               <div className="fulfillment-metric-period">Last 7 Days</div>
// //             </div>
// //           </div>

// //           {todayData?.eventSummary && todayData.eventSummary.totalEvents > 0 && (
// //             <EventSummaryDisplay 
// //               eventSummary={todayData.eventSummary} 
// //               title="Today's Order Activity & Adjustments"
// //             />
// //           )}
// //         </section>

// //         {/* Last 7 Days Performance Section */}
// //         <section className="last7days-section">
// //           <h3>Last 7 Days Performance</h3>
          
// //           <div className="last7days-grid">
// //             <div className="last7days-total-card">
// //               <div className="last7days-total-value">{safeNumber(last7DaysData.totalOrders)}</div>
// //               <div className="last7days-total-label">TOTAL ORDERS</div>
// //             </div>
            
// //             <div className="last7days-total-card">
// //               <div className="last7days-total-value">{formatCurrency(safeNumber(last7DaysData.totalTotalSales))}</div>
// //               <div className="last7days-total-label">TOTAL SALES</div>
// //             </div>
            
// //             <div className="last7days-total-card">
// //               <div className="last7days-total-value">{safeNumber(last7DaysData.totalItems)}</div>
// //               <div className="last7days-total-label">TOTAL ITEMS</div>
// //             </div>
            
// //             <div className="last7days-total-card">
// //               <div className="last7days-total-value">{formatCurrency(safeNumber(last7DaysData.totalTotalSales / 7))}</div>
// //               <div className="last7days-total-label">AVG DAILY SALES</div>
// //             </div>
// //           </div>

// //           {/* Daily Breakdown Table */}
// //           <div className="daily-breakdown">
// //             <h4>Daily Breakdown</h4>
// //             <div className="daily-cards-container">
// //               {safeData.dailyKeys.map((day, index) => {
// //                 const dayData = getSafeCustomerStats(safeData.dailyTotals, day);
// //                 const isToday = index === safeData.dailyKeys.length - 1;
                
// //                 return (
// //                   <div key={day} className={`daily-card ${isToday ? 'current-day' : ''}`}>
// //                     <div className="daily-card-header">
// //                       <div className="daily-date">{formatDateDisplay(day)}</div>
// //                       <div className="daily-day">{getDayName(day)}</div>
// //                     </div>
                    
// //                     <div className="daily-metrics">
// //                       <div className="daily-metric">
// //                         <span className="daily-metric-label">ORDERS</span>
// //                         <span className="daily-metric-value">{safeNumber(dayData.orderCount)}</span>
// //                       </div>
                      
// //                       <div className="daily-metric">
// //                         <span className="daily-metric-label">TOTAL SALES</span>
// //                         <span className="daily-metric-value">{formatCurrency(safeNumber(dayData.totalSales))}</span>
// //                       </div>
                      
// //                       <div className="daily-metric">
// //                         <span className="daily-metric-label">ITEMS</span>
// //                         <span className="daily-metric-value">{safeNumber(dayData.items)}</span>
// //                       </div>
// //                     </div>
// //                   </div>
// //                 );
// //               })}
// //             </div>
// //           </div>

// //           {last7DaysData?.eventSummary && last7DaysData.eventSummary.totalEvents > 0 && (
// //             <EventSummaryDisplay 
// //               eventSummary={last7DaysData.eventSummary} 
// //               title="Last 7 Days: Refunds, Exchanges & Adjustments"
// //             />
// //           )}
// //         </section>

// //         {/* Week-over-Week Insight */}
// //         <div className="secondary-metrics">
// //           <div className="insight-card">
// //             <h4>Week-over-Week Revenue Change</h4>
// //             <p className="insight-value text-positive">
// //               <Icon.TrendUp /> 
// //               100.0%
// //             </p>
// //           </div>
// //         </div>

// //         {/* Customer Insights Section */}
// //         <section className="customer-metrics">
// //           <h3>Customer Insights</h3>
          
// //           <div className="customer-metrics-grid">
// //             <div className="customer-metric-card total-customers">
// //               <div className="customer-metric-value">{safeNumber(safeData.totalCustomerData.totalCustomers)}</div>
// //               <div className="customer-metric-label">TOTAL CUSTOMERS</div>
// //             </div>
            
// //             <div className="customer-metric-card new-customers">
// //               <div className="customer-metric-value">{safeNumber(safeData.totalCustomerData.newCustomers)}</div>
// //               <div className="customer-metric-label">NEW CUSTOMERS</div>
// //             </div>
            
// //             <div className="customer-metric-card repeat-customers">
// //               <div className="customer-metric-value">{safeNumber(safeData.totalCustomerData.repeatedCustomers)}</div>
// //               <div className="customer-metric-label">REPEAT CUSTOMERS</div>
// //             </div>
            
// //             <div className="customer-metric-card loyalty-rate">
// //               <div className="customer-metric-value">
// //                 {safeData.totalCustomerData.totalCustomers > 0 
// //                   ? formatPercent((safeData.totalCustomerData.repeatedCustomers / safeData.totalCustomerData.totalCustomers) * 100)
// //                   : '0.0%'
// //                 }
// //               </div>
// //               <div className="customer-metric-label">REPEAT CUSTOMER RATE</div>
// //             </div>
// //           </div>
// //         </section>

// //         {/* Last 7 Days Customer Insights */}
// //         <section className="customer-metrics">
// //           <h3>Last 7 Days Customer Insights</h3>
          
// //           <div className="customer-metrics-grid">
// //             <div className="customer-metric-card total-customers">
// //               <div className="customer-metric-value">{safeNumber(last7DaysData.totalNewCustomers + last7DaysData.totalRepeatCustomers)}</div>
// //               <div className="customer-metric-label">7-DAY TOTAL CUSTOMERS</div>
// //             </div>
            
// //             <div className="customer-metric-card new-customers">
// //               <div className="customer-metric-value">{safeNumber(last7DaysData.totalNewCustomers)}</div>
// //               <div className="customer-metric-label">7-DAY NEW CUSTOMERS</div>
// //             </div>
            
// //             <div className="customer-metric-card repeat-customers">
// //               <div className="customer-metric-value">{safeNumber(last7DaysData.totalRepeatCustomers)}</div>
// //               <div className="customer-metric-label">7-DAY REPEAT CUSTOMERS</div>
// //             </div>
            
// //             <div className="customer-metric-card loyalty-rate">
// //               <div className="customer-metric-value">
// //                 {(last7DaysData.totalNewCustomers + last7DaysData.totalRepeatCustomers) > 0
// //                   ? formatPercent((last7DaysData.totalRepeatCustomers / (last7DaysData.totalNewCustomers + last7DaysData.totalRepeatCustomers)) * 100)
// //                   : '0.0%'
// //                 }
// //               </div>
// //               <div className="customer-metric-label">7-DAY REPEAT RATE</div>
// //             </div>
// //           </div>
// //         </section>

// //         {/* Last 7 Days Financial Breakdown */}
// //         <section className="financial-metrics">
// //           <h3>Last 7 Days Financial Breakdown</h3>

// //           <MismatchSummaryCard 
// //             mismatchSummary={getCalculationMismatchSummary(safeData)} 
// //             periodType="day"
// //           />

// //           <div className="financial-metrics-grid">
// //             <div className="financial-metric-card revenue">
// //               <div className="financial-metric-value">{formatCurrency(last7DaysData.totalRevenue)}</div>
// //               <div className="financial-metric-label">Gross Sales</div>
// //               <div className="financial-metric-period">7 Days</div>
// //             </div>
            
// //             <div className="financial-metric-card discounts">
// //               <div className="financial-metric-value">{formatCurrency(last7DaysData.totalDiscounts)}</div>
// //               <div className="financial-metric-label">Total Discounts</div>
// //               <div className="financial-metric-rate">{formatPercent(last7DaysData.totalDiscounts / last7DaysData.totalRevenue * 100)} of gross</div>
// //             </div>
            
// //             <div className="financial-metric-card returns">
// //               <div className="financial-metric-value">{formatCurrency(last7DaysData.totalReturns)}</div>
// //               <div className="financial-metric-label">Returns & Refunds</div>
// //               <div className="financial-metric-rate">{formatPercent(last7DaysData.totalReturns / last7DaysData.totalRevenue * 100)} of gross</div>
// //             </div>
            
// //             <div className="financial-metric-card return-fees">
// //               <div className="financial-metric-value">{formatCurrency(last7DaysData.totalExtraFees)}</div>
// //               <div className="financial-metric-label">Return Fees</div>
// //               <div className="financial-metric-rate">{formatPercent(last7DaysData.totalExtraFees / last7DaysData.totalRevenue * 100)} of gross</div>
// //             </div>
            
// //             <div className="financial-metric-card net-sales">
// //               <div className="financial-metric-value">{formatCurrency(last7DaysData.totalNetSales)}</div>
// //               <div className="financial-metric-label">Net Sales</div>
// //               <div className="financial-metric-period">After ALL deductions</div>
// //             </div>
            
// //             <div className="financial-metric-card shipping">
// //               <div className="financial-metric-value">{formatCurrency(last7DaysData.totalShipping)}</div>
// //               <div className="financial-metric-label">Shipping Charges</div>
// //               <div className="financial-metric-rate">{formatPercent(last7DaysData.totalShipping / last7DaysData.totalNetSales * 100)} of net sales</div>
// //             </div>
            
// //             <div className="financial-metric-card taxes">
// //               <div className="financial-metric-value">{formatCurrency(last7DaysData.totalTaxes)}</div>
// //               <div className="financial-metric-label">Taxes Collected</div>
// //               <div className="financial-metric-rate">{formatPercent(last7DaysData.totalTaxes / last7DaysData.totalNetSales * 100)} of net sales</div>
// //             </div>
            
// //             <div className="financial-metric-card total-sales">
// //               <div className="financial-metric-value">{formatCurrency(last7DaysData.totalTotalSales)}</div>
// //               <div className="financial-metric-label">Total Sales</div>
// //               <div className="financial-metric-period">Final amount</div>
// //             </div>
// //           </div>

// //           {/* Daily Financial Details */}
// //           <div className="daily-financial-breakdown">
// //             <h4>Daily Financial Details</h4>
// //             <div className="daily-financial-cards">
// //               {safeData.dailyKeys.map((day, index) => {
// //                 const dayData = getSafeCustomerStats(safeData.dailyTotals, day);
// //                 const isToday = index === safeData.dailyKeys.length - 1;
                
// //                 return (
// //                   <div key={day} className={`daily-financial-card ${isToday ? 'current-day' : ''}`}>
// //                     <div className="daily-financial-header">
// //                       <div className="daily-financial-date">{formatDateDisplay(day)}</div>
// //                       <div className="daily-financial-day">{getDayName(day)}</div>
// //                     </div>
                    
// //                     <div className="daily-financial-metrics">
// //                       <div className="daily-financial-metric gross-revenue">
// //                         <span className="daily-financial-label">Gross Sales</span>
// //                         <span className="daily-financial-value">{formatCurrency(dayData.total)}</span>
// //                       </div>
                      
// //                       <div className="daily-financial-metric discounts">
// //                         <span className="daily-financial-label">Discounts</span>
// //                         <span className="daily-financial-value">{formatCurrency(dayData.discounts)}</span>
// //                       </div>
                      
// //                       <div className="daily-financial-metric returns">
// //                         <span className="daily-financial-label">Returns</span>
// //                         <span className="daily-financial-value">{formatCurrency(dayData.returns)}</span>
// //                       </div>
                      
// //                       <div className="daily-financial-metric net-sales">
// //                         <span className="daily-financial-label">Net Sales</span>
// //                         <span className="daily-financial-value">{formatCurrency(dayData.netSales)}</span>
// //                       </div>
                      
// //                       <div className="daily-financial-metric shipping">
// //                         <span className="daily-financial-label">Shipping Charges</span>
// //                         <span className="daily-financial-value">{formatCurrency(dayData.shipping)}</span>
// //                       </div>
                      
// //                       <div className="daily-financial-metric return-fees">
// //                         <span className="daily-financial-label">Return Fees</span>
// //                         <span className="daily-financial-value">{formatCurrency(dayData.extraFees)}</span>
// //                       </div>
                      
// //                       <div className="daily-financial-metric taxes">
// //                         <span className="daily-financial-label">Taxes</span>
// //                         <span className="daily-financial-value">{formatCurrency(dayData.taxes)}</span>
// //                       </div>
                      
// //                       <div className="daily-financial-metric total-sales">
// //                         <span className="daily-financial-label">Total Sales</span>
// //                         <span className="daily-financial-value">{formatCurrency(dayData.totalSales)}</span>
// //                       </div>
// //                     </div>
// //                   </div>
// //                 );
// //               })}
// //             </div>
// //           </div>
// //         </section>

// //         {/* Weekly Performance */}
// //         <section className="weekly-performance">
// //           <h3>Weekly Performance (Last 8 Weeks)</h3>
// //           <MismatchSummaryCard 
// //             mismatchSummary={getWeeklyMismatchSummary(safeData)} 
// //             periodType="week"
// //           />
// //           <div className="weekly-grid">
// //             <div className="weekly-card">
// //               <div className="weekly-value">{safeNumber(weeklyFinancials.totalOrders)}</div>
// //               <div className="weekly-label">Total Orders</div>
// //             </div>
            
// //             <div className="weekly-card">
// //               <div className="weekly-value">{formatCurrency(weeklyFinancials.totalRevenue)}</div>
// //               <div className="weekly-label">Total Revenue</div>
// //             </div>
            
// //             <div className="weekly-card">
// //               <div className="weekly-value">{safeNumber(weeklyFinancials.totalItems)}</div>
// //               <div className="weekly-label">Total Items</div>
// //             </div>
            
// //             <div className="weekly-card">
// //               <div className="weekly-value">{formatCurrency(weeklyFinancials.totalRevenue / safeData.weeklyKeys.length)}</div>
// //               <div className="weekly-label">Avg Weekly Revenue</div>
// //             </div>
// //           </div>

// //           {/* Weekly Breakdown */}
// //           <div className="weekly-breakdown">
// //             <h4>Weekly Breakdown</h4>
// //             <div className="weekly-cards-container">
// //               {safeData.weeklyKeys.map((week, index) => {
// //                 const weekData = getSafeCustomerStats(safeData.weeklyTotals, week);
// //                 const isCurrentWeek = index === safeData.weeklyKeys.length - 1;
                
// //                 return (
// //                   <div key={week} className={`week-card ${isCurrentWeek ? 'current-week' : ''}`}>
// //                     <div className="week-header">
// //                       <div className="week-label">Week {week.replace('Week of ', '').split('-')[2]}</div>
// //                       <div className="week-period">{week.replace('Week of ', '').split('-')[0]}</div>
// //                     </div>
                    
// //                     <div className="week-metrics">
// //                       <div className="week-metric orders">
// //                         <span className="week-metric-label">Orders</span>
// //                         <span className="week-metric-value">{safeNumber(weekData.orderCount)}</span>
// //                       </div>
                      
// //                       <div className="week-metric revenue">
// //                         <span className="week-metric-label">Total Sales</span>
// //                         <span className="week-metric-value">{formatCurrency(weekData.totalSales)}</span>
// //                       </div>
                      
// //                       <div className="week-metric items">
// //                         <span className="week-metric-label">Items</span>
// //                         <span className="week-metric-value">{safeNumber(weekData.items)}</span>
// //                       </div>
// //                     </div>
// //                   </div>
// //                 );
// //               })}
// //             </div>
// //           </div>

// //           {weeklyFinancials?.eventSummary && weeklyFinancials.eventSummary.totalEvents > 0 && (
// //             <EventSummaryDisplay 
// //               eventSummary={weeklyFinancials.eventSummary} 
// //               title="8-Week Period: Order Events & Financial Adjustments"
// //             />
// //           )}
// //         </section>

// //         {/* Weekly Financial Breakdown */}
// //         <section className="financial-metrics">
// //           <h3>Weekly Financial Breakdown (Last 8 Weeks)</h3>
// //           <div className="financial-metrics-grid">
// //             <div className="financial-metric-card revenue">
// //               <div className="financial-metric-value">{formatCurrency(weeklyFinancials.totalRevenue)}</div>
// //               <div className="financial-metric-label">Gross Sales</div>
// //               <div className="financial-metric-period">8 Weeks</div>
// //             </div>
            
// //             <div className="financial-metric-card discounts">
// //               <div className="financial-metric-value">{formatCurrency(weeklyFinancials.totalDiscounts)}</div>
// //               <div className="financial-metric-label">Total Discounts</div>
// //               <div className="financial-metric-rate">{formatPercent(weeklyFinancials.totalDiscounts / weeklyFinancials.totalRevenue * 100)} of gross</div>
// //             </div>
            
// //             <div className="financial-metric-card returns">
// //               <div className="financial-metric-value">{formatCurrency(weeklyFinancials.totalReturns)}</div>
// //               <div className="financial-metric-label">Returns & Refunds</div>
// //               <div className="financial-metric-rate">{formatPercent(weeklyFinancials.totalReturns / weeklyFinancials.totalRevenue * 100)} of gross</div>
// //             </div>
            
// //             <div className="financial-metric-card return-fees">
// //               <div className="financial-metric-value">{formatCurrency(weeklyFinancials.totalExtraFees)}</div>
// //               <div className="financial-metric-label">Return Fees</div>
// //               <div className="financial-metric-rate">{formatPercent(weeklyFinancials.totalExtraFees / weeklyFinancials.totalRevenue * 100)} of gross</div>
// //             </div>
            
// //             <div className="financial-metric-card net-sales">
// //               <div className="financial-metric-value">{formatCurrency(weeklyFinancials.totalNetSales)}</div>
// //               <div className="financial-metric-label">Net Sales</div>
// //               <div className="financial-metric-period">After ALL deductions</div>
// //             </div>
            
// //             <div className="financial-metric-card shipping">
// //               <div className="financial-metric-value">{formatCurrency(weeklyFinancials.totalShipping)}</div>
// //               <div className="financial-metric-label">Shipping Charges</div>
// //               <div className="financial-metric-rate">{formatPercent(weeklyFinancials.totalShipping / weeklyFinancials.totalNetSales * 100)} of net sales</div>
// //             </div>
            
// //             <div className="financial-metric-card taxes">
// //               <div className="financial-metric-value">{formatCurrency(weeklyFinancials.totalTaxes)}</div>
// //               <div className="financial-metric-label">Taxes Collected</div>
// //               <div className="financial-metric-rate">{formatPercent(weeklyFinancials.totalTaxes / weeklyFinancials.totalNetSales * 100)} of net sales</div>
// //             </div>
            
// //             <div className="financial-metric-card total-sales">
// //               <div className="financial-metric-value">{formatCurrency(weeklyFinancials.totalTotalSales)}</div>
// //               <div className="financial-metric-label">Total Sales</div>
// //               <div className="financial-metric-period">Final amount</div>
// //             </div>
// //           </div>

// //           {/* Weekly Financial Details */}
// //           <div className="weekly-financial-breakdown">
// //             <h4>Weekly Financial Details</h4>
// //             <div className="weekly-financial-cards">
// //               {safeData.weeklyKeys.map((week, index) => {
// //                 const weekData = getSafeCustomerStats(safeData.weeklyTotals, week);
// //                 const isCurrentWeek = index === safeData.weeklyKeys.length - 1;
                
// //                 return (
// //                   <div key={week} className={`weekly-financial-card ${isCurrentWeek ? 'current-week' : ''}`}>
// //                     <div className="weekly-financial-header">
// //                       <div className="weekly-financial-label">Week {week.replace('Week of ', '').split('-')[2]}</div>
// //                       <div className="weekly-financial-period">{week.replace('Week of ', '').split('-')[0]}</div>
// //                     </div>
                    
// //                     <div className="weekly-financial-metrics">
// //                       <div className="weekly-financial-metric gross-revenue">
// //                         <span className="weekly-financial-label">Gross Sales</span>
// //                         <span className="weekly-financial-value">{formatCurrency(weekData.total)}</span>
// //                       </div>
                      
// //                       <div className="weekly-financial-metric discounts">
// //                         <span className="weekly-financial-label">Discounts</span>
// //                         <span className="weekly-financial-value">{formatCurrency(weekData.discounts)}</span>
// //                       </div>
                      
// //                       <div className="weekly-financial-metric returns">
// //                         <span className="weekly-financial-label">Returns</span>
// //                         <span className="weekly-financial-value">{formatCurrency(weekData.returns)}</span>
// //                       </div>
                      
// //                       <div className="weekly-financial-metric net-sales">
// //                         <span className="weekly-financial-label">Net Sales</span>
// //                         <span className="weekly-financial-value">{formatCurrency(weekData.netSales)}</span>
// //                       </div>
                      
// //                       <div className="weekly-financial-metric shipping">
// //                         <span className="weekly-financial-label">Shipping Charges</span>
// //                         <span className="weekly-financial-value">{formatCurrency(weekData.shipping)}</span>
// //                       </div>
                      
// //                       <div className="weekly-financial-metric return-fees">
// //                         <span className="weekly-financial-label">Return Fees</span>
// //                         <span className="weekly-financial-value">{formatCurrency(weekData.extraFees)}</span>
// //                       </div>
                      
// //                       <div className="weekly-financial-metric taxes">
// //                         <span className="weekly-financial-label">Taxes</span>
// //                         <span className="weekly-financial-value">{formatCurrency(weekData.taxes)}</span>
// //                       </div>
                      
// //                       <div className="weekly-financial-metric total-sales">
// //                         <span className="weekly-financial-label">Total Sales</span>
// //                         <span className="weekly-financial-value">{formatCurrency(weekData.totalSales)}</span>
// //                       </div>
// //                     </div>
// //                   </div>
// //                 );
// //               })}
// //             </div>
// //           </div>
// //         </section>

// //         {/* Monthly Performance */}
// //         <section className="monthly-performance">
// //           <h3>Monthly Performance (Last 6 Months)</h3>
// //           <MismatchSummaryCard 
// //             mismatchSummary={getMonthlyMismatchSummary(safeData)} 
// //             periodType="month"
// //           />
// //           <div className="monthly-grid">
// //             <div className="monthly-card">
// //               <div className="monthly-value">{safeNumber(monthlyFinancials.totalOrders)}</div>
// //               <div className="monthly-label">Total Orders</div>
// //             </div>
            
// //             <div className="monthly-card">
// //               <div className="monthly-value">{formatCurrency(monthlyFinancials.totalRevenue)}</div>
// //               <div className="monthly-label">Total Revenue</div>
// //             </div>
            
// //             <div className="monthly-card">
// //               <div className="monthly-value">{safeNumber(monthlyFinancials.totalItems)}</div>
// //               <div className="monthly-label">Total Items</div>
// //             </div>
            
// //             <div className="monthly-card">
// //               <div className="monthly-value">{formatCurrency(monthlyFinancials.totalRevenue / safeData.monthRanges.length)}</div>
// //               <div className="monthly-label">Avg Monthly Revenue</div>
// //             </div>
// //           </div>

// //           {/* Monthly Breakdown */}
// //           <div className="monthly-breakdown">
// //             <h4>Monthly Breakdown</h4>
// //             <div className="monthly-cards-container">
// //               {safeData.monthRanges.map((month, index) => {
// //                 const monthData = getSafeCustomerStats(safeData.monthlyTotals, month);
// //                 const currentMonth = new Date().toLocaleString("default", { month: "short", year: "numeric", timeZone: safeData.shopTimeZone });
// //                 const isCurrentMonth = month === currentMonth;
                
// //                 const avgRevenue = safeData.monthRanges.reduce((sum, m) => {
// //                   const mData = getSafeCustomerStats(safeData.monthlyTotals, m);
// //                   return sum + mData.total;
// //                 }, 0) / safeData.monthRanges.length;
// //                 const performanceLevel = monthData.total > avgRevenue * 1.2 ? 'high' : 
// //                                        monthData.total > avgRevenue * 0.8 ? 'medium' : 'low';
                
// //                 return (
// //                   <div key={month} className={`month-card ${isCurrentMonth ? 'current-month' : ''}`}>
// //                     {isCurrentMonth && <div className="current-badge">Current</div>}
// //                     <div className="month-header">
// //                       <div className="month-label">{month.split(' ')[0]}</div>
// //                       <div className="month-period">{month.split(' ')[1]}</div>
// //                     </div>
                    
// //                     <div className="month-metrics">
// //                       <div className="month-metric orders">
// //                         <span className="month-metric-label">Orders</span>
// //                         <span className="month-metric-value">{safeNumber(monthData.orderCount)}</span>
// //                       </div>
                      
// //                       <div className="month-metric revenue">
// //                         <span className="month-metric-label">Total Sales</span>
// //                         <span className="month-metric-value">{formatCurrency(monthData.totalSales)}</span>
// //                       </div>
                      
// //                       <div className="month-metric items">
// //                         <span className="month-metric-label">Items</span>
// //                         <span className="month-metric-value">{safeNumber(monthData.items)}</span>
// //                       </div>
// //                     </div>
// //                   </div>
// //                 );
// //               })}
// //             </div>
// //           </div>

// //           {monthlyFinancials?.eventSummary && monthlyFinancials.eventSummary.totalEvents > 0 && (
// //             <EventSummaryDisplay 
// //               eventSummary={monthlyFinancials.eventSummary} 
// //               title="6-Month Overview: All Order Events & Adjustments"
// //             />
// //           )}
// //         </section>

// //         {/* Monthly Financial Breakdown */}
// //         <section className="financial-metrics">
// //           <h3>Monthly Financial Breakdown (Last 6 Months)</h3>
// //           <div className="financial-metrics-grid">
// //             <div className="financial-metric-card revenue">
// //               <div className="financial-metric-value">{formatCurrency(monthlyFinancials.totalRevenue)}</div>
// //               <div className="financial-metric-label">Gross Sales</div>
// //               <div className="financial-metric-period">6 Months</div>
// //             </div>
            
// //             <div className="financial-metric-card discounts">
// //               <div className="financial-metric-value">{formatCurrency(monthlyFinancials.totalDiscounts)}</div>
// //               <div className="financial-metric-label">Total Discounts</div>
// //               <div className="financial-metric-rate">{formatPercent(monthlyFinancials.totalDiscounts / monthlyFinancials.totalRevenue * 100)} of gross</div>
// //             </div>
            
// //             <div className="financial-metric-card returns">
// //               <div className="financial-metric-value">{formatCurrency(monthlyFinancials.totalReturns)}</div>
// //               <div className="financial-metric-label">Returns & Refunds</div>
// //               <div className="financial-metric-rate">{formatPercent(monthlyFinancials.totalReturns / monthlyFinancials.totalRevenue * 100)} of gross</div>
// //             </div>
            
// //             <div className="financial-metric-card return-fees">
// //               <div className="financial-metric-value">{formatCurrency(monthlyFinancials.totalExtraFees)}</div>
// //               <div className="financial-metric-label">Return Fees</div>
// //               <div className="financial-metric-rate">{formatPercent(monthlyFinancials.totalExtraFees / monthlyFinancials.totalRevenue * 100)} of gross</div>
// //             </div>
            
// //             <div className="financial-metric-card net-sales">
// //               <div className="financial-metric-value">{formatCurrency(monthlyFinancials.totalNetSales)}</div>
// //               <div className="financial-metric-label">Net Sales</div>
// //               <div className="financial-metric-period">After ALL deductions</div>
// //             </div>
            
// //             <div className="financial-metric-card shipping">
// //               <div className="financial-metric-value">{formatCurrency(monthlyFinancials.totalShipping)}</div>
// //               <div className="financial-metric-label">Shipping Charges</div>
// //               <div className="financial-metric-rate">{formatPercent(monthlyFinancials.totalShipping / monthlyFinancials.totalNetSales * 100)} of net sales</div>
// //             </div>
            
// //             <div className="financial-metric-card taxes">
// //               <div className="financial-metric-value">{formatCurrency(monthlyFinancials.totalTaxes)}</div>
// //               <div className="financial-metric-label">Taxes Collected</div>
// //               <div className="financial-metric-rate">{formatPercent(monthlyFinancials.totalTaxes / monthlyFinancials.totalNetSales * 100)} of net sales</div>
// //             </div>
            
// //             <div className="financial-metric-card total-sales">
// //               <div className="financial-metric-value">{formatCurrency(monthlyFinancials.totalTotalSales)}</div>
// //               <div className="financial-metric-label">Total Sales</div>
// //               <div className="financial-metric-period">Final amount</div>
// //             </div>
// //           </div>

// //           {/* Monthly Financial Details */}
// //           <div className="monthly-financial-breakdown">
// //             <h4>Monthly Financial Details</h4>
// //             <div className="monthly-financial-cards">
// //               {safeData.monthRanges.map((month, index) => {
// //                 const monthData = getSafeCustomerStats(safeData.monthlyTotals, month);
// //                 const currentMonth = new Date().toLocaleString("default", { month: "short", year: "numeric", timeZone: safeData.shopTimeZone });
// //                 const isCurrentMonth = month === currentMonth;
                
// //                 return (
// //                   <div key={month} className={`monthly-financial-card ${isCurrentMonth ? 'current-month' : ''}`}>
// //                     {isCurrentMonth && <div className="current-badge">Current</div>}
// //                     <div className="monthly-financial-header">
// //                       <div className="monthly-financial-label">{month.split(' ')[0]}</div>
// //                       <div className="monthly-financial-period">{month.split(' ')[1]}</div>
// //                     </div>
                    
// //                     <div className="monthly-financial-metrics">
// //                       <div className="monthly-financial-metric gross-revenue">
// //                         <span className="monthly-financial-label">Gross Sales</span>
// //                         <span className="monthly-financial-value">{formatCurrency(monthData.total)}</span>
// //                       </div>
                      
// //                       <div className="monthly-financial-metric discounts">
// //                         <span className="monthly-financial-label">Discounts</span>
// //                         <span className="monthly-financial-value">{formatCurrency(monthData.discounts)}</span>
// //                       </div>
                      
// //                       <div className="monthly-financial-metric returns">
// //                         <span className="monthly-financial-label">Returns</span>
// //                         <span className="monthly-financial-value">{formatCurrency(monthData.returns)}</span>
// //                       </div>
                      
// //                       <div className="monthly-financial-metric net-sales">
// //                         <span className="monthly-financial-label">Net Sales</span>
// //                         <span className="monthly-financial-value">{formatCurrency(monthData.netSales)}</span>
// //                       </div>
                      
// //                       <div className="monthly-financial-metric shipping">
// //                         <span className="monthly-financial-label">Shipping Charges</span>
// //                         <span className="monthly-financial-value">{formatCurrency(monthData.shipping)}</span>
// //                       </div>
                      
// //                       <div className="monthly-financial-metric return-fees">
// //                         <span className="monthly-financial-label">Return Fees</span>
// //                         <span className="monthly-financial-value">{formatCurrency(monthData.extraFees)}</span>
// //                       </div>
                      
// //                       <div className="monthly-financial-metric taxes">
// //                         <span className="monthly-financial-label">Taxes</span>
// //                         <span className="monthly-financial-value">{formatCurrency(monthData.taxes)}</span>
// //                       </div>
                      
// //                       <div className="monthly-financial-metric total-sales">
// //                         <span className="monthly-financial-label">Total Sales</span>
// //                         <span className="monthly-financial-value">{formatCurrency(monthData.totalSales)}</span>
// //                       </div>
// //                     </div>
// //                   </div>
// //                 );
// //               })}
// //             </div>
// //           </div>
// //         </section>

// //         {/* Charts & Analytics Section */}
// //         <section className="charts-section">
// //           <h2>Analytics & Insights Visualization</h2>
          
// //           <div className="charts-grid">
// //             <ChartComponents.CustomerDistribution data={safeData} />
// //             <ChartComponents.RevenueTrend data={safeData} />
// //             <ChartComponents.MonthlyPerformance data={safeData} />
// //             <ChartComponents.FinancialBreakdown data={safeData} />
// //           </div>
// //         </section>

// //         {/* Footer */}
// //         <footer className="app-footer">
// //           <div className="footer-content">
// //             <p>
// //               <strong>Orders Analyzed:</strong> {safeData.totalOrders} orders • 
// //               <strong> Net Revenue:</strong> {formatCurrency(monthlyFinancials.netRevenue)} • 
// //               <strong> Data Updated:</strong> {new Date(safeData.lastUpdated).toLocaleDateString()}
// //             </p>
// //             <p className="footer-brand">Analytics Dashboard - Nexus Powering Your Business Insights</p>
// //           </div>
// //         </footer>
// //       </div>
// //     </div>
// //   );
// // }

// // // ==================== 17.0 EXPORT COMPONENT ====================

// // export default function AnalyticsApp() {
// //   return <ShopifyAnalyticsPage />;
// // }










































































































































// // // ==================== 1.0 IMPORTS & SETUP ====================

// // import { json, type LoaderFunctionArgs } from "@remix-run/node";
// // import { useLoaderData } from "@remix-run/react";
// // import { authenticate } from "../shopify.server";
// // import { useState, useEffect, useMemo } from "react";
// // import "../styles/orders.css";

// // // Chart.js imports
// // import {
// //   Chart as ChartJS,
// //   CategoryScale,
// //   LinearScale,
// //   BarElement,
// //   LineElement,
// //   PointElement,
// //   ArcElement,
// //   Title,
// //   Tooltip,
// //   Legend,
// //   Filler,
// // } from 'chart.js';
// // import { Bar, Line, Pie, Doughnut } from 'react-chartjs-2';

// // // Register Chart.js components
// // ChartJS.register(
// //   CategoryScale,
// //   LinearScale,
// //   BarElement,
// //   LineElement,
// //   PointElement,
// //   ArcElement,
// //   Title,
// //   Tooltip,
// //   Legend,
// //   Filler
// // );

// // // ==================== 1.1 API CONFIGURATION ====================
// // const SHOPIFY_API_VERSION = process.env.SHOPIFY_API_VERSION || '2024-04';

// // // ==================== 2.0 TYPE DEFINITIONS ====================

// // interface Order {
// //   id: number;
// //   created_at: string;
// //   total_price: string;
// //   total_discounts?: string;
// //   total_shipping_price_set?: {
// //     shop_money: { amount: string };
// //   };
// //   total_tax?: string;
// //   total_refunds?: string;
// //   fulfillment_status?: string;
// //   line_items?: Array<{
// //     quantity: number;
// //   }>;
// //   customer?: {
// //     id?: string | number;
// //   };
// // }

// // type EventSummary = {
// //   refunds: {
// //     count: number;
// //     value: number;
// //   };
// //   exchanges: {
// //     count: number;
// //     value: number;
// //   };
// //   partialRefunds: {
// //     count: number;
// //     value: number;
// //   };
// //   totalEvents: number;
// //   netValue: number;
// // };

// // interface OrderStats {
// //   total: number;
// //   items: number;
// //   fulfilled: number;
// //   unfulfilled: number;
// //   discounts: number;
// //   shipping: number;
// //   taxes: number;
// //   returns: number;
// //   orderCount: number;
// //   netSales: number;
// //   extraFees: number;
// //   totalSales: number;
// //   shippingRefunds: number;
// //   netReturns: number;
// //   totalRefund: number;
// //   discountsReturned?: number;
// //   netDiscounts?: number;
// //   returnShippingCharges?: number;
// //   restockingFees?: number;
// //   returnFees?: number;
// //   refundDiscrepancy?: number;
// //   hasSubsequentEvents: boolean;
// //   eventSummary: EventSummary | null;
// //   refundsCount: number;
// //   financialStatus: string;
// // }

// // interface CustomerData {
// //   newCustomers: number;
// //   repeatedCustomers: number;
// //   totalCustomers: number;
// // }

// // interface AnalyticsData {
// //   shop: string;
// //   totals: Record<string, OrderStats>;
// //   dailyTotals: Record<string, OrderStats & CustomerData>;
// //   weeklyTotals: Record<string, OrderStats & CustomerData>;
// //   monthlyTotals: Record<string, OrderStats & CustomerData>;
// //   totalOrders: number;
// //   totalCustomerData: CustomerData;
// //   monthRanges: string[];
// //   dailyKeys: string[];
// //   weeklyKeys: string[];
// //   lastUpdated: string;
// //   shopTimeZone: string;
// //   shopCurrency: string;
// // }

// // interface CachedAnalyticsData extends AnalyticsData {
// //   _cacheInfo?: {
// //     fetchMode: "incremental" | "full";
// //     apiSuccess: boolean;
// //     cacheHealth: {
// //       total: number;
// //       valid: number;
// //       expired: number;
// //       health: number;
// //     };
// //     cacheStats: {
// //       size: number;
// //       version: number;
// //     };
// //   };
// // }

// // interface OrderData {
// //   totalOrders: number;
// //   totalCustomers: number;
// //   fulfillmentRate: number;
// //   totalRevenue: number;
// //   netRevenue: number;
// //   averageOrderValue: number;
// //   totalItems: number;
// //   todayOrders: number;
// //   todayRevenue: number;
// //   todayItems: number;
// //   ordersChangeVsYesterday: number;
// //   revenueChangeVsYesterday: number;
// //   itemsChangeVsYesterday: number;
// //   newCustomers: number;
// //   repeatCustomers: number;
// //   customerRetentionRate: number;
// //   averageOrderFrequency: number;
// //   shopTimezone: string;
// //   shopCurrency: string;
// //   totalRefunds?: number;
// //   totalExchanges?: number;
// //   totalPartialRefunds?: number;
// //   totalEvents?: number;
// //   ordersWithEvents?: number;
// //   netEventValue?: number;
// // }

// // // ==================== 3.0 CACHE MANAGER ====================

// // class PersistentCacheManager {
// //   private memoryStorage: Map<string, any> = new Map();
// //   public version = 1;

// //   private validateCacheData(data: any): boolean {
// //     if (!data) return false;
// //     if (data.orders && !Array.isArray(data.orders)) return false;
// //     if (data.lastUpdatedAt && isNaN(Date.parse(data.lastUpdatedAt))) return false;
// //     return true;
// //   }

// //   private async getPersistentStorage(): Promise<Map<string, any>> {
// //     return this.memoryStorage;
// //   }

// //   async set<T>(key: string, value: T, ttl: number = 30 * 60 * 1000): Promise<void> {
// //     try {
// //       const storage = await this.getPersistentStorage();
// //       const entry = {
// //         value,
// //         timestamp: Date.now(),
// //         ttl,
// //         key
// //       };
      
// //       storage.set(key, entry);
      
// //       if (typeof window !== 'undefined' && window.localStorage) {
// //         try {
// //           localStorage.setItem(key, JSON.stringify(entry));
// //         } catch (e) {
// //           // Handle localStorage error
// //         }
// //       }
// //     } catch (error) {
// //       // Handle cache set error
// //     }
// //   }

// //   async get<T>(key: string): Promise<{ value: T; timestamp: number } | null> {
// //     try {
// //       const storage = await this.getPersistentStorage();
// //       let entry = storage.get(key);
      
// //       if (!entry && typeof window !== 'undefined' && window.localStorage) {
// //         try {
// //           const stored = localStorage.getItem(key);
// //           if (stored) {
// //             entry = JSON.parse(stored);
// //             storage.set(key, entry);
// //           }
// //         } catch (e) {
// //           // Handle localStorage error
// //         }
// //       }

// //       if (!entry) {
// //         return null;
// //       }

// //       const isExpired = Date.now() - entry.timestamp > entry.ttl;
// //       if (isExpired) {
// //         await this.remove(key);
// //         return null;
// //       }

// //       if (!this.validateCacheData(entry.value)) {
// //         console.warn('Removing corrupted cache:', key);
// //         await this.remove(key);
// //         return null;
// //       }

// //       return { value: entry.value, timestamp: entry.timestamp };
// //     } catch (error) {
// //       await this.remove(key);
// //       return null;
// //     }
// //   }

// //   async remove(key: string): Promise<void> {
// //     try {
// //       const storage = await this.getPersistentStorage();
// //       storage.delete(key);
      
// //       if (typeof window !== 'undefined' && window.localStorage) {
// //         try {
// //           localStorage.removeItem(key);
// //         } catch (e) {
// //           // Handle localStorage error
// //         }
// //       }
// //     } catch (error) {
// //       // Handle cache remove error
// //     }
// //   }

// //   async emergencyReset(shop: string): Promise<void> {
// //     const keys = [
// //       makeCacheKey(shop, "orders"),
// //       // Add other cache keys if you have them
// //     ];
    
// //     for (const key of keys) {
// //       await this.remove(key);
// //     }
// //     console.log('Emergency cache reset completed for:', shop);
// //   }

// //   getStats() {
// //     return {
// //       size: this.memoryStorage.size,
// //       version: this.version
// //     };
// //   }

// //   healthReport() {
// //     const now = Date.now();
// //     let expiredCount = 0;
// //     let validCount = 0;

// //     for (const entry of this.memoryStorage.values()) {
// //       if (now - entry.timestamp > entry.ttl) {
// //         expiredCount++;
// //       } else {
// //         validCount++;
// //       }
// //     }

// //     return {
// //       total: this.memoryStorage.size,
// //       valid: validCount,
// //       expired: expiredCount,
// //       health: validCount / Math.max(this.memoryStorage.size, 1)
// //     };
// //   }
// // }

// // // Global cache instance
// // const cacheManager = new PersistentCacheManager();

// // // ==================== 4.0 HELPER FUNCTIONS ====================

// // function makeCacheKey(shop: string, segment: string): string {
// //   return `${shop}::analytics::${segment}::v${cacheManager.version}`;
// // }

// // function nowISO(): string {
// //   return new Date().toISOString();
// // }

// // function getMonthRanges(shopTimeZone: string = "UTC") {
// //   const ranges: { start: string; end: string; key: string }[] = [];
// //   const now = new Date();

// //   for (let i = 6; i >= 0; i--) {
// //     const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
// //     const start = new Date(date.getFullYear(), date.getMonth(), 1);
// //     const end = new Date(date.getFullYear(), date.getMonth() + 1, 0, 23, 59, 59);
// //     ranges.push({
// //       start: start.toISOString(),
// //       end: end.toISOString(),
// //       key: date.toLocaleString("default", { month: "short", year: "numeric" }),
// //     });
// //   }

// //   return ranges;
// // }

// // function getLastNDays(n: number, shopTimeZone: string = "UTC") {
// //   const days: string[] = [];
// //   const now = new Date();
  
// //   for (let i = n - 1; i >= 0; i--) {
// //     const d = new Date(now);
// //     d.setDate(now.getDate() - i);
// //     const dayKey = d.toLocaleDateString("en-CA", { timeZone: shopTimeZone });
// //     days.push(dayKey);
// //   }
  
// //   return days;
// // }

// // function getLast8Weeks(shopTimeZone: string = "UTC") {
// //   const weeks: string[] = [];
// //   const now = new Date();
// //   const monday = new Date(now);
// //   monday.setDate(now.getDate() - ((now.getDay() + 6) % 7));
// //   for (let i = 7; i >= 0; i--) {
// //     const startOfWeek = new Date(monday);
// //     startOfWeek.setDate(monday.getDate() - i * 7);
// //     const key = `Week of ${startOfWeek.toLocaleDateString("en-CA", { timeZone: shopTimeZone })}`;
// //     weeks.push(key);
// //   }
// //   return weeks;
// // }

// // // ==================== 5.0 API FETCHING FUNCTIONS ====================

// // async function fetchOrdersSince(
// //   shop: string, 
// //   accessToken: string, 
// //   sinceDate: string, 
// //   cachedOrders: any[] = []
// // ): Promise<{ orders: any[]; hasMore: boolean }> {
  
// //   let allOrders: any[] = [...cachedOrders];
// //   let url = `https://${shop}/admin/api/${SHOPIFY_API_VERSION}/orders.json?status=any&limit=250&updated_at_min=${sinceDate}`;
// //   let pageCount = 0;
// //   let hasMore = true;

// //   while (url && hasMore) {
// //     pageCount++;

// //     const response = await fetch(url, { 
// //       headers: { "X-Shopify-Access-Token": accessToken } 
// //     });

// //     if (!response.ok) {
// //       if (response.status === 429) {
// //         const retryAfter = response.headers.get('Retry-After') || '10';
// //         const waitTime = parseInt(retryAfter) * 1000;
// //         await new Promise(resolve => setTimeout(resolve, waitTime));
// //         continue;
// //       }
// //       throw new Error(`HTTP error! status: ${response.status}`);
// //     }

// //     const data = await response.json();
// //     const newOrders: any[] = data.orders || [];
    
// //     const orderMap = new Map();
// //     allOrders.forEach((order: any) => orderMap.set(order.id, order));
// //     newOrders.forEach((order: any) => orderMap.set(order.id, order));
    
// //     allOrders = Array.from(orderMap.values());

// //     const linkHeader = response.headers.get("Link");
// //     const nextMatch = linkHeader?.match(/<([^>]+)>; rel="next"/);
// //     url = nextMatch ? nextMatch[1] : "";
// //     hasMore = !!url;

// //     if (url) {
// //       await new Promise(resolve => setTimeout(resolve, 200));
// //     }
// //   }

// //   return { orders: allOrders, hasMore: false };
// // }

// // async function fetchOrdersForPeriod(shop: string, accessToken: string, startDate: string, endDate: string) {
// //   let allOrders: any[] = [];
// //   let url = `https://${shop}/admin/api/${SHOPIFY_API_VERSION}/orders.json?status=any&limit=250&created_at_min=${startDate}&created_at_max=${endDate}`;
// //   let pageCount = 0;

// //   while (url) {
// //     pageCount++;

// //     const response = await fetch(url, { 
// //       headers: { "X-Shopify-Access-Token": accessToken } 
// //     });

// //     if (!response.ok) {
// //       if (response.status === 429) {
// //         const retryAfter = response.headers.get('Retry-After') || '10';
// //         const waitTime = parseInt(retryAfter) * 1000;
// //         await new Promise(resolve => setTimeout(resolve, waitTime));
// //         continue;
// //       } else {
// //         throw new Error(`HTTP error! status: ${response.status}`);
// //       }
// //     }

// //     const data = await response.json();
// //     const ordersCount = data.orders?.length || 0;
    
// //     allOrders = allOrders.concat(data.orders || []);

// //     const linkHeader = response.headers.get("Link");
// //     const nextMatch = linkHeader?.match(/<([^>]+)>; rel="next"/);
// //     url = nextMatch ? nextMatch[1] : "";
// //   }

// //   return allOrders;
// // }

// // // ==================== 6.0 EVENT DETECTION LOGIC ====================

// // function calculateOrderEventSummary(order: any, periodStart: Date, periodEnd: Date): EventSummary | null {
// //   const eventSummary: EventSummary = {
// //     refunds: { count: 0, value: 0 },
// //     exchanges: { count: 0, value: 0 },
// //     partialRefunds: { count: 0, value: 0 },
// //     totalEvents: 0,
// //     netValue: 0
// //   };

// //   const orderRefunds = order.refunds || [];
// //   let hasEvents = false;

// //   orderRefunds.forEach((refund: any) => {
// //     const refundDate = new Date(refund.created_at);
    
// //     if (refundDate >= periodStart && refundDate <= periodEnd) {
// //       let refundAmount = 0;
      
// //       if (refund.transactions && refund.transactions.length > 0) {
// //         refund.transactions.forEach((transaction: any) => {
// //           if (transaction.kind === 'refund' && transaction.status === 'success') {
// //             refundAmount += Math.abs(parseFloat(transaction.amount) || 0);
// //           }
// //         });
// //       }

// //       const isFullRefund = refundAmount === parseFloat(order.total_price);
// //       const hasExchangeTags = order.tags?.includes('exchange') || order.note?.includes('exchange');
// //       const hasMultipleFulfillments = order.fulfillments && order.fulfillments.length > 1;
// //       const isExchange = hasExchangeTags || hasMultipleFulfillments;

// //       if (isFullRefund && !isExchange) {
// //         eventSummary.refunds.count++;
// //         eventSummary.refunds.value -= refundAmount;
// //       } else if (isExchange) {
// //         eventSummary.exchanges.count++;
// //         const exchangeValue = -refundAmount;
// //         eventSummary.exchanges.value += exchangeValue;
// //       } else {
// //         eventSummary.partialRefunds.count++;
// //         eventSummary.partialRefunds.value -= refundAmount;
// //       }

// //       eventSummary.totalEvents++;
// //       eventSummary.netValue -= refundAmount;
// //       hasEvents = true;
// //     }
// //   });

// //   return hasEvents ? eventSummary : null;
// // }

// // // ==================== 7.0 FINANCIAL CALCULATION ENGINE ====================

// // function processOrderToStats(order: any): OrderStats {
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
// //     orderRefunds.forEach((refund: any) => {
// //       if (refund.transactions && refund.transactions.length > 0) {
// //         refund.transactions.forEach((transaction: any) => {
// //           if (transaction.kind === 'refund' && transaction.status === 'success') {
// //             const refundAmount = Math.abs(parseFloat(transaction.amount) || 0);
// //             totalActualRefund += refundAmount;
// //             netReturns += refundAmount;
// //           }
// //         });
// //       }

// //       if (refund.refund_line_items) {
// //         refund.refund_line_items.forEach((item: any) => {
// //           const itemValue = Math.abs(parseFloat(item.subtotal) || 0);
// //           grossReturns -= itemValue;
// //           totalItemRefunds += itemValue;
          
// //           const lineItemDiscount = parseFloat(item.total_discount) || 0;
// //           discountsReturned += Math.abs(lineItemDiscount);
// //         });
// //       }
      
// //       if (refund.order_adjustments && refund.order_adjustments.length > 0) {
// //         refund.order_adjustments.forEach((adjustment: any) => {
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
// //         });
// //       }
      
// //       if (refund.total_additional_fees_set) {
// //         const additionalFees = parseFloat(refund.total_additional_fees_set?.shop_money?.amount || "0") || 0;
// //         returnFees += additionalFees;
// //       }
// //     });
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
// //         order.line_items.forEach((item: any) => {
// //           const refundedItem = orderRefunds[0]?.refund_line_items?.find((refundItem: any) => 
// //             refundItem.line_item_id === item.id
// //           );
          
// //           if (!refundedItem && item.fulfillment_status === 'fulfilled') {
// //             const itemPrice = parseFloat(item.price) || 0;
// //             const itemQuantity = item.current_quantity || item.quantity || 0;
// //             exchangeItemValue += itemPrice * itemQuantity;
// //           }
// //         });
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
// //           order.line_items.forEach((item: any) => {
// //             if (item.fulfillment_status === 'fulfilled') {
// //               const itemPrice = parseFloat(item.price) || 0;
// //               const itemQuantity = item.current_quantity || item.quantity || 0;
// //               exchangeItemValue += itemPrice * itemQuantity;
// //             }
// //           });
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

// // function mergeStats(existing: OrderStats, newStats: OrderStats): OrderStats {
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

// // function mergeEventSummaries(a: EventSummary | null, b: EventSummary | null): EventSummary | null {
// //   if (!a && !b) return null;
// //   if (!a) return b;
// //   if (!b) return a;
  
// //   return {
// //     refunds: {
// //       count: a.refunds.count + b.refunds.count,
// //       value: a.refunds.value + b.refunds.value
// //     },
// //     exchanges: {
// //       count: a.exchanges.count + b.exchanges.count,
// //       value: a.exchanges.value + b.exchanges.value
// //     },
// //     partialRefunds: {
// //       count: a.partialRefunds.count + b.partialRefunds.count,
// //       value: a.partialRefunds.value + b.partialRefunds.value
// //     },
// //     totalEvents: a.totalEvents + b.totalEvents,
// //     netValue: a.netValue + b.netValue
// //   };
// // }

// // // ==================== 8.0 CUSTOMER TRACKING LOGIC ====================

// // function buildCustomerOrderMap(allOrders: any[], shopTimeZone: string) {
// //   const customerOrderMap: Record<string, Date[]> = {};
  
// //   for (const order of allOrders) {
// //     const custId = order?.customer?.id;
// //     if (custId === undefined || custId === null) continue;
    
// //     const customerId = custId.toString();
// //     if (!customerOrderMap[customerId]) {
// //       customerOrderMap[customerId] = [];
// //     }
// //     customerOrderMap[customerId].push(new Date(order.created_at));
// //   }
  
// //   return customerOrderMap;
// // }

// // function analyzeCustomerBehavior(
// //   customerOrderMap: Record<string, Date[]>, 
// //   shopTimeZone: string,
// //   periodKeys: string[],
// //   periodType: 'daily' | 'weekly' | 'monthly'
// // ): Record<string, CustomerData> {
// //   const periodAnalytics: Record<string, CustomerData> = {};
  
// //   for (const key of periodKeys) {
// //     periodAnalytics[key] = { newCustomers: 0, repeatedCustomers: 0, totalCustomers: 0 };
// //   }

// //   for (const [customerId, orderDates] of Object.entries(customerOrderMap)) {
// //     if (orderDates.length === 0) continue;
    
// //     const firstOrderDate = new Date(Math.min(...orderDates.map(d => d.getTime())));
    
// //     let firstOrderKey: string;
// //     if (periodType === 'daily') {
// //       firstOrderKey = firstOrderDate.toLocaleDateString("en-CA", { timeZone: shopTimeZone });
// //     } else if (periodType === 'monthly') {
// //       firstOrderKey = firstOrderDate.toLocaleString("default", { month: "short", year: "numeric", timeZone: shopTimeZone });
// //     } else {
// //       const firstOrderMonday = new Date(firstOrderDate);
// //       firstOrderMonday.setDate(firstOrderDate.getDate() - ((firstOrderDate.getDay() + 6) % 7));
// //       firstOrderKey = `Week of ${firstOrderMonday.toLocaleDateString("en-CA", { timeZone: shopTimeZone })}`;
// //     }
    
// //     for (const orderDate of orderDates) {
// //       let orderKey: string;
      
// //       if (periodType === 'daily') {
// //         orderKey = orderDate.toLocaleDateString("en-CA", { timeZone: shopTimeZone });
// //       } else if (periodType === 'monthly') {
// //         orderKey = orderDate.toLocaleString("default", { month: "short", year: "numeric", timeZone: shopTimeZone });
// //       } else {
// //         const orderMonday = new Date(orderDate);
// //         orderMonday.setDate(orderDate.getDate() - ((orderDate.getDay() + 6) % 7));
// //         orderKey = `Week of ${orderMonday.toLocaleDateString("en-CA", { timeZone: shopTimeZone })}`;
// //       }
      
// //       if (!periodAnalytics[orderKey]) continue;
      
// //       if (firstOrderKey === orderKey) {
// //         periodAnalytics[orderKey].newCustomers++;
// //       } else {
// //         periodAnalytics[orderKey].repeatedCustomers++;
// //       }
      
// //       periodAnalytics[orderKey].totalCustomers++;
// //     }
// //   }
  
// //   return periodAnalytics;
// // }

// // function calculateOverallCustomerData(customerOrderMap: Record<string, Date[]>): CustomerData {
// //   const customers = Object.values(customerOrderMap);
// //   const totalCustomers = customers.length;
  
// //   let newCustomers = 0;
// //   let repeatedCustomers = 0;

// //   customers.forEach(orderDates => {
// //     if (orderDates.length === 1) {
// //       newCustomers++;
// //     } else {
// //       repeatedCustomers++;
// //     }
// //   });

// //   return {
// //     newCustomers,
// //     repeatedCustomers,
// //     totalCustomers,
// //   };
// // }

// // // ==================== 9.0 LOADER FUNCTION ====================

// // export const loader = async ({ request }: LoaderFunctionArgs) => {
// //   try {
// //     const { session } = await authenticate.admin(request);
// //     const shop = session.shop;
// //     const accessToken = session.accessToken!;

// //     const shopRes = await fetch(`https://${shop}/admin/api/${SHOPIFY_API_VERSION}/shop.json`, {     
// //   headers: { "X-Shopify-Access-Token": accessToken },
// // });
// //     if (!shopRes.ok) throw new Error(`Failed to fetch shop info: ${shopRes.status}`);
// //     const shopData = await shopRes.json();
// //     const shopTimeZone = shopData.shop.iana_timezone || "UTC";
// //     const shopCurrency = shopData.shop.currency || "USD";

// //     const monthRanges = getMonthRanges(shopTimeZone);
// //     const dailyKeys = getLastNDays(7, shopTimeZone);
// //     const weeklyKeys = getLast8Weeks(shopTimeZone);

// //   const initStats = (): OrderStats => ({
// //     total: 0,
// //     discounts: 0,
// //     returns: 0,
// //     netSales: 0,
// //     shipping: 0,
// //     taxes: 0,
// //     extraFees: 0,
// //     totalSales: 0,
// //     shippingRefunds: 0,
// //     netReturns: 0,
// //     totalRefund: 0,
// //     items: 0,
// //     fulfilled: 0,
// //     unfulfilled: 0,
// //     orderCount: 0,
// //     discountsReturned: 0,
// //     netDiscounts: 0,
// //     returnShippingCharges: 0,
// //     restockingFees: 0,
// //     returnFees: 0,
// //     refundDiscrepancy: 0,
// //     hasSubsequentEvents: false,
// //     eventSummary: null,
// //     refundsCount: 0,
// //     financialStatus: 'pending'
// //   });

// //     const totals: Record<string, OrderStats> = {};
// //     const dailyTotals: Record<string, OrderStats & CustomerData> = {};
// //     const weeklyTotals: Record<string, OrderStats & CustomerData> = {};
// //     const monthlyTotals: Record<string, OrderStats & CustomerData> = {};

// //     monthRanges.forEach((r) => {
// //       totals[r.key] = initStats();
// //       monthlyTotals[r.key] = { ...initStats(), newCustomers: 0, repeatedCustomers: 0, totalCustomers: 0 };
// //     });
// //     dailyKeys.forEach((d) => (dailyTotals[d] = { ...initStats(), newCustomers: 0, repeatedCustomers: 0, totalCustomers: 0 }));
// //     weeklyKeys.forEach((w) => (weeklyTotals[w] = { ...initStats(), newCustomers: 0, repeatedCustomers: 0, totalCustomers: 0 }));

// //     const ordersKey = makeCacheKey(shop, "orders");
// //     const cacheEntry = await cacheManager.get<{ orders: any[]; lastUpdatedAt?: string }>(ordersKey);

// //     let fetchMode: "incremental" | "full" = cacheEntry ? "incremental" : "full";
// //     let allOrders: any[] = [];
// //     let apiSuccess = false;

// //     try {
// //       if (fetchMode === "incremental" && cacheEntry) {
// //         const lastUpdatedAt = cacheEntry.value.lastUpdatedAt;
        
// //         if (lastUpdatedAt) {
// //           const result = await fetchOrdersSince(shop, accessToken, lastUpdatedAt, cacheEntry.value.orders);
          
// //           if (result.orders.length > 0) {
// //             apiSuccess = true;
// //             allOrders = result.orders;
// //             await cacheManager.set(ordersKey, { 
// //               orders: allOrders, 
// //               lastUpdatedAt: nowISO() 
// //             }, 30 * 60 * 1000);
// //           } else {
// //             allOrders = cacheEntry.value.orders;
// //             apiSuccess = true;
// //           }
// //         } else {
// //           fetchMode = "full";
// //         }
// //       }

// //       if (fetchMode === "full") {
// //         allOrders = await fetchOrdersForPeriod(
// //           shop,
// //           accessToken,
// //           monthRanges[0].start,
// //           monthRanges[monthRanges.length - 1].end
// //         );
// //         apiSuccess = true;
        
// //         await cacheManager.set(ordersKey, { 
// //           orders: allOrders, 
// //           lastUpdatedAt: nowISO() 
// //         }, 30 * 60 * 1000);
// //       }

// //     } catch (error) {
// //       if (cacheEntry && cacheEntry.value.orders) {
// //         allOrders = cacheEntry.value.orders;
// //         apiSuccess = true;
// //       } else {
// //         await cacheManager.remove(ordersKey);
// //         throw error;
// //       }
// //     }

// //     const customerOrderMap = buildCustomerOrderMap(allOrders, shopTimeZone);
// //     const dailyCustomerAnalytics = analyzeCustomerBehavior(customerOrderMap, shopTimeZone, dailyKeys, 'daily');
// //     const weeklyCustomerAnalytics = analyzeCustomerBehavior(customerOrderMap, shopTimeZone, weeklyKeys, 'weekly');
// //     const monthlyCustomerAnalytics = analyzeCustomerBehavior(customerOrderMap, shopTimeZone, monthRanges.map(r => r.key), 'monthly');

// //     allOrders.forEach((order: any) => {
// //       const date = new Date(order.created_at);
      
// //       const monthKey = date.toLocaleString("default", { month: "short", year: "numeric", timeZone: shopTimeZone });
// //       const dayKey = date.toLocaleDateString("en-CA", { timeZone: shopTimeZone });
      
// //       const monday = new Date(date);
// //       monday.setDate(date.getDate() - ((date.getDay() + 6) % 7));
// //       const weekKey = `Week of ${monday.toLocaleDateString("en-CA", { timeZone: shopTimeZone })}`;

// //       const orderStats = processOrderToStats(order);

// //       if (totals[monthKey]) {
// //         totals[monthKey] = mergeStats(totals[monthKey], orderStats);
// //       }

// //       if (dailyTotals[dayKey]) {
// //         dailyTotals[dayKey] = {
// //           ...mergeStats(dailyTotals[dayKey], orderStats),
// //           newCustomers: dailyCustomerAnalytics[dayKey]?.newCustomers || 0,
// //           repeatedCustomers: dailyCustomerAnalytics[dayKey]?.repeatedCustomers || 0,
// //           totalCustomers: dailyCustomerAnalytics[dayKey]?.totalCustomers || 0
// //         };
// //       }

// //       if (weeklyTotals[weekKey]) {
// //         weeklyTotals[weekKey] = {
// //           ...mergeStats(weeklyTotals[weekKey], orderStats),
// //           newCustomers: weeklyCustomerAnalytics[weekKey]?.newCustomers || 0,
// //           repeatedCustomers: weeklyCustomerAnalytics[weekKey]?.repeatedCustomers || 0,
// //           totalCustomers: weeklyCustomerAnalytics[weekKey]?.totalCustomers || 0
// //         };
// //       }

// //       if (monthlyTotals[monthKey]) {
// //         monthlyTotals[monthKey] = {
// //           ...mergeStats(monthlyTotals[monthKey], orderStats),
// //           newCustomers: monthlyCustomerAnalytics[monthKey]?.newCustomers || 0,
// //           repeatedCustomers: monthlyCustomerAnalytics[monthKey]?.repeatedCustomers || 0,
// //           totalCustomers: monthlyCustomerAnalytics[monthKey]?.totalCustomers || 0
// //         };
// //       }
// //     });

// //     const totalCustomerData = calculateOverallCustomerData(customerOrderMap);

// //     const result: CachedAnalyticsData = {
// //       shop,
// //       totals,
// //       dailyTotals,
// //       weeklyTotals,
// //       monthlyTotals,
// //       totalOrders: allOrders.length,
// //       totalCustomerData,
// //       monthRanges: monthRanges.map((r) => r.key),
// //       dailyKeys,
// //       weeklyKeys,
// //       lastUpdated: new Date().toISOString(),
// //       shopTimeZone,
// //       shopCurrency,
// //       _cacheInfo: {
// //         fetchMode,
// //         apiSuccess,
// //         cacheHealth: cacheManager.healthReport(),
// //         cacheStats: cacheManager.getStats()
// //       }
// //     };

// //     return json(result);
    
// //   } catch (error: unknown) {
// //     const errorMsg = `Loader error: ${error instanceof Error ? error.message : 'Unknown error'}`;
    
// //     return json({ 
// //       shop: "unknown", 
// //       error: errorMsg,
// //       userMessage: "Sorry for the inconvenience! Please try refreshing the page.",
// //       timestamp: new Date().toISOString()
// //     });
// //   }
// // };

// // // ==================== 10.0 PDF EXPORT FUNCTIONALITY ====================

// // const generatePDFReport = (data: OrderData) => {
// //   const printWindow = window.open('', '_blank');
// //   if (!printWindow) return;

// //   const timestamp = new Date().toLocaleDateString();
// //   const time = new Date().toLocaleTimeString();
  
// //   // Safely get the event data with fallbacks
// //   const totalRefunds = data.totalRefunds || 0;
// //   const totalExchanges = data.totalExchanges || 0;
// //   const netEventValue = data.netEventValue || 0;
  
// //   const pdfContent = `
// //     <!DOCTYPE html>
// //     <html>
// //     <head>
// //       <title>Orders Dashboard Report</title>
// //       <style>
// //         .currency-value::before {
// //           content: '${data.shopCurrency === 'EUR' ? '€' : data.shopCurrency === 'GBP' ? '£' : data.shopCurrency === 'CAD' ? 'C$' : data.shopCurrency === 'AUD' ? 'A$' : data.shopCurrency === 'JPY' ? '¥' : '$'}';
// //         }
// //         body { 
// //           font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; 
// //           margin: 40px; 
// //           color: #333;
// //           line-height: 1.4;
// //         }
// //         .header { 
// //           text-align: center; 
// //           border-bottom: 3px solid #2c3e50; 
// //           padding-bottom: 25px; 
// //           margin-bottom: 35px; 
// //           background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
// //           color: white;
// //           padding: 30px;
// //           margin: -40px -40px 35px -40px;
// //           border-radius: 0 0 20px 20px;
// //         }
// //         .header h1 { 
// //           margin: 0; 
// //           color: white;
// //           font-size: 2.2em;
// //           font-weight: 700;
// //         }
// //         .header .date { 
// //           color: rgba(255,255,255,0.9); 
// //           margin-top: 8px;
// //           font-size: 1.1em;
// //         }
// //         .section { 
// //           margin-bottom: 40px; 
// //           break-inside: avoid;
// //           background: white;
// //           padding: 25px;
// //           border-radius: 12px;
// //           box-shadow: 0 2px 10px rgba(0,0,0,0.08);
// //           border-left: 4px solid #3498db;
// //         }
// //         .section h2 { 
// //           color: #2c3e50; 
// //           border-bottom: 2px solid #ecf0f1; 
// //           padding-bottom: 12px; 
// //           margin-bottom: 20px;
// //           font-size: 1.4em;
// //         }
// //         .metrics-grid { 
// //           display: grid; 
// //           grid-template-columns: repeat(3, 1fr); 
// //           gap: 25px; 
// //           margin: 25px 0; 
// //         }
// //         .metric-card { 
// //           background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
// //           padding: 25px; 
// //           border-radius: 10px; 
// //           text-align: center; 
// //           border-left: 4px solid #3498db;
// //           transition: all 0.3s ease;
// //         }
// //         .metric-card:hover {
// //           transform: translateY(-2px);
// //           box-shadow: 0 5px 15px rgba(0,0,0,0.1);
// //         }
// //         .metric-value { 
// //           font-size: 2em; 
// //           font-weight: bold; 
// //           color: #2c3e50; 
// //           margin-bottom: 8px;
// //         }
// //         .metric-label { 
// //           color: #666; 
// //           margin-top: 8px;
// //           font-weight: 600;
// //         }
// //         .growth-indicator {
// //           display: flex;
// //           align-items: center;
// //           justify-content: center;
// //           gap: 5px;
// //           font-size: 0.9em;
// //           font-weight: 600;
// //           margin-top: 10px;
// //           padding: 4px 12px;
// //           border-radius: 20px;
// //           width: fit-content;
// //           margin: 10px auto 0;
// //         }
// //         .growth-positive {
// //           background: #d4edda;
// //           color: #155724;
// //           border: 1px solid #c3e6cb;
// //         }
// //         .growth-negative {
// //           background: #f8d7da;
// //           color: #721c24;
// //           border: 1px solid #f5c6cb;
// //         }
// //         .growth-arrow {
// //           font-weight: bold;
// //         }
// //         .financial-grid { 
// //           display: grid; 
// //           grid-template-columns: repeat(2, 1fr); 
// //           gap: 20px; 
// //         }
// //         .financial-card { 
// //           background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
// //           padding: 20px; 
// //           border-radius: 8px; 
// //           border-left: 4px solid #27ae60;
// //           transition: all 0.3s ease;
// //         }
// //         .financial-card:hover {
// //           transform: translateY(-2px);
// //           box-shadow: 0 5px 15px rgba(0,0,0,0.1);
// //         }
// //         .financial-value { 
// //           font-size: 1.5em; 
// //           font-weight: bold; 
// //           color: #2c3e50; 
// //         }
// //         .financial-label { 
// //           color: #666; 
// //           font-size: 0.9em;
// //           font-weight: 600;
// //         }
// //         .summary-table { 
// //           width: 100%; 
// //           border-collapse: collapse; 
// //           margin: 20px 0; 
// //           box-shadow: 0 1px 3px rgba(0,0,0,0.1);
// //         }
// //         .summary-table th, .summary-table td { 
// //           padding: 15px; 
// //           text-align: left; 
// //           border-bottom: 1px solid #ddd; 
// //         }
// //         .summary-table th { 
// //           background: #f8f9fa; 
// //           font-weight: bold;
// //           color: #2c3e50;
// //         }
// //         .positive { color: #27ae60; }
// //         .negative { color: #e74c3c; }
// //         .footer { 
// //           margin-top: 50px; 
// //           padding-top: 25px; 
// //           border-top: 2px solid #ddd; 
// //           text-align: center; 
// //           color: #666;
// //           font-size: 0.9em;
// //         }
// //         @media print { 
// //           body { margin: 20px; } 
// //           .metric-card, .financial-card { break-inside: avoid; }
// //           .section { break-inside: avoid; page-break-inside: avoid; }
// //           .header { margin: -20px -20px 25px -20px; }
// //         }
// //         @page {
// //           margin: 1cm;
// //           size: A4;
// //         }
// //       </style>
// //     </head>
// //     <body>
// //       <div class="header">
// //       <h1><SvgIcons.Chart /> Orders Dashboard Report</h1>
// //         <div class="date">Generated: ${timestamp} at ${time}</div>
// //         <div class="date">Store Timezone: ${data.shopTimezone}</div>
// //       </div>

// //       <div class="section">
// //       <h2><SvgIcons.TrendingUp /> Executive Summary</h2>
// //         <div class="metrics-grid">
// //           <div class="metric-card">
// //             <div class="metric-value">${data.totalOrders}</div>
// //             <div class="metric-label">Total Orders</div>
// //           </div>
// //           <div class="metric-card">
// //             <div class="metric-value">${data.totalCustomers}</div>
// //             <div class="metric-label">Total Customers</div>
// //           </div>
// //           <div class="metric-card">
// //             <div class="metric-value">${data.fulfillmentRate.toFixed(1)}%</div>
// //             <div class="metric-label">Fulfillment Rate</div>
// //           </div>
// //         </div>
// //       </div>

// //       <div class="section">
// //       <h2><SvgIcons.Dollar /> Financial Overview</h2>
// //         <div class="financial-grid">
// //           <div class="financial-card">
// //             <div class="financial-value">${data.totalRevenue.toLocaleString('en-US', { style: 'currency', currency: data.shopCurrency || 'USD' })}</div>
// //             <div class="financial-label">Total Revenue</div>
// //           </div>
// //           <div class="financial-card">
// //             <div class="financial-value">${data.netRevenue.toLocaleString('en-US', { style: 'currency', currency: data.shopCurrency || 'USD' })}</div>
// //             <div class="financial-label">Net Revenue</div>
// //           </div>
// //           <div class="financial-card">
// //             <div class="financial-value">${data.averageOrderValue.toLocaleString('en-US', { style: 'currency', currency: data.shopCurrency || 'USD' })}</div>
// //             <div class="financial-label">Average Order Value</div>
// //           </div>
// //           <div class="financial-card">
// //             <div class="financial-value">${data.totalItems}</div>
// //             <div class="financial-label">Total Items Sold</div>
// //           </div>
// //         </div>
// //       </div>

// //       <div class="section">
// //         <h2><SvgIcons.Rocket /> Today's Performance</h2>
// //         <div class="metrics-grid">
// //           <div class="metric-card">
// //             <div class="metric-value">${data.todayOrders}</div>
// //             <div class="metric-label">Today's Orders</div>
// //             ${data.ordersChangeVsYesterday !== 0 ? `
// //               <div class="growth-indicator ${data.ordersChangeVsYesterday >= 0 ? 'growth-positive' : 'growth-negative'}">
// //                 <span class="growth-arrow">${data.ordersChangeVsYesterday >= 0 ? '↗' : '↘'}</span>
// //                 ${Math.abs(data.ordersChangeVsYesterday).toFixed(1)}% vs yesterday
// //               </div>
// //             ` : '<div class="growth-indicator" style="visibility: hidden;">-</div>'}
// //           </div>
// //           <div class="metric-card">
// //             <div class="metric-value">${data.todayRevenue.toLocaleString('en-US', { style: 'currency', currency: data.shopCurrency || 'USD' })}</div>
// //             <div class="metric-label">Today's Revenue</div>
// //             ${data.revenueChangeVsYesterday !== 0 ? `
// //               <div class="growth-indicator ${data.revenueChangeVsYesterday >= 0 ? 'growth-positive' : 'growth-negative'}">
// //                 <span class="growth-arrow">${data.revenueChangeVsYesterday >= 0 ? '↗' : '↘'}</span>
// //                 ${Math.abs(data.revenueChangeVsYesterday).toFixed(1)}% vs yesterday
// //               </div>
// //             ` : '<div class="growth-indicator" style="visibility: hidden;">-</div>'}
// //           </div>
// //           <div class="metric-card">
// //             <div class="metric-value">${data.todayItems}</div>
// //             <div class="metric-label">Items Ordered Today</div>
// //             ${data.itemsChangeVsYesterday !== 0 ? `
// //               <div class="growth-indicator ${data.itemsChangeVsYesterday >= 0 ? 'growth-positive' : 'growth-negative'}">
// //                 <span class="growth-arrow">${data.itemsChangeVsYesterday >= 0 ? '↗' : '↘'}</span>
// //                 ${Math.abs(data.itemsChangeVsYesterday).toFixed(1)}% vs yesterday
// //               </div>
// //             ` : '<div class="growth-indicator" style="visibility: hidden;">-</div>'}
// //           </div>
// //         </div>
// //       </div>

// //       <div class="section">
// //       <h2><SvgIcons.Users /> Customer Insights</h2>
// //         <div class="financial-grid">
// //           <div class="financial-card">
// //             <div class="financial-value">${data.newCustomers}</div>
// //             <div class="financial-label">New Customers</div>
// //           </div>
// //           <div class="financial-card">
// //             <div class="financial-value">${data.repeatCustomers}</div>
// //             <div class="financial-label">Repeat Customers</div>
// //           </div>
// //           <div class="financial-card">
// //             <div class="financial-value">${data.customerRetentionRate.toFixed(1)}%</div>
// //             <div class="financial-label">Retention Rate</div>
// //           </div>
// //           <div class="financial-card">
// //             <div class="financial-value">${data.averageOrderFrequency.toFixed(1)}</div>
// //             <div class="financial-label">Avg Order Frequency</div>
// //           </div>
// //         </div>
// //       </div>

// //     <div class="section">
// //     <h2><SvgIcons.Analytics /> Event Summary</h2>
// //   <div class="financial-grid">
// //     <div class="financial-card">
// //       <div class="financial-value">${data.totalRefunds || 0}</div>
// //       <div class="financial-label">Full Refunds</div>
// //     </div>
// //     <div class="financial-card">
// //       <div class="financial-value">${data.totalPartialRefunds || 0}</div>
// //       <div class="financial-label">Partial Refunds</div>
// //     </div>
// //     <div class="financial-card">
// //       <div class="financial-value">${data.totalExchanges || 0}</div>
// //       <div class="financial-label">Exchanges</div>
// //     </div>
// //     <div class="financial-card">
// //       <div class="financial-value">${(data.netEventValue || 0).toLocaleString('en-US', { style: 'currency', currency: data.shopCurrency || 'USD' })}</div>
// //       <div class="financial-label">Net Event Impact</div>
// //     </div>
// //   </div>
// //   <div style="text-align: center; margin-top: 16px; color: #666; font-size: 0.9em;">
// //     Across ${data.totalEvents || 0} total events in ${data.ordersWithEvents || 0} orders
// //   </div>
// // </div>

// //       <div class="footer">
// //         <p><strong>Orders Dashboard Summary Report</strong> - Key Business Metrics</p>
// //         <p>Generated by Nexus | ${timestamp}</p>
// //       </div>
// //     </body>
// //     </html>
// //   `;

// //   printWindow.document.write(pdfContent);
// //   printWindow.document.close();
  
// //   setTimeout(() => {
// //     printWindow.print();
// //     printWindow.onafterprint = () => {
// //       setTimeout(() => {
// //         printWindow.close();
// //       }, 100);
// //     };
// //   }, 1000);
// // };

// // // ==================== 11.0 ICON COMPONENTS ====================

// // const Icon = {
// //   Print: () => (
// //     <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
// //       <path d="M19 8H5c-1.66 0-3 1.34-3 3v6h4v4h12v-4h4v-6c0-1.66-1.34-3-3-3zm-3 11H8v-5h8v5zm3-7c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1zm-1-9H6v4h12V3z"/>
// //     </svg>
// //   ),
// //   TrendUp: () => (
// //     <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
// //       <path d="M16 6l2.29 2.29-4.88 4.88-4-4L2 16.59 3.41 18l6-6 4 4 6.3-6.29L22 12V6z"/>
// //     </svg>
// //   ),
// //   TrendDown: () => (
// //     <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
// //       <path d="M16 18l2.29-2.29-4.88-4.88-4 4L2 7.41 3.41 6l6 6 4-4 6.3 6.29L22 12v6z"/>
// //     </svg>
// //   ),
// //   Export: () => (
// //     <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
// //       <path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z"/>
// //     </svg>
// //   )
// // };

// // // ==================== 11.1 SVG ICONS COMPONENT ====================

// // const SvgIcons = {
// //   Chart: () => (
// //     <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
// //       <path d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z"/>
// //     </svg>
// //   ),
// //   TrendingUp: () => (
// //     <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
// //       <path d="M16 6l2.29 2.29-4.88 4.88-4-4L2 16.59 3.41 18l6-6 4 4 6.3-6.29L22 12V6z"/>
// //     </svg>
// //   ),
// //   Dollar: () => (
// //     <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
// //       <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1.41 16.09V20h-2.67v-1.93c-1.71-.36-3.16-1.46-3.27-3.4h1.96c.1 1.05.82 1.87 2.65 1.87 1.96 0 2.4-.98 2.4-1.59 0-.83-.44-1.61-2.67-2.14-2.48-.6-4.18-1.62-4.18-3.67 0-1.72 1.39-2.84 3.11-3.21V4h2.67v1.95c1.86.45 2.79 1.86 2.85 3.39H14.3c-.05-1.11-.64-1.87-2.22-1.87-1.5 0-2.4.68-2.4 1.64 0 .84.65 1.39 2.67 1.91s4.18 1.39 4.18 3.91c-.01 1.78-1.18 2.73-3.12 3.16z"/>
// //     </svg>
// //   ),
// //   Rocket: () => (
// //     <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
// //       <path d="M2.81 14.12L5.64 11.29l-1.41-1.42L1.42 12.7l1.39 1.42zM14.12 2.81L11.29 5.64l1.42 1.41 1.41-1.41-1.41-1.42zm8.03 9.91l-1.39-1.42-2.81 2.81 1.41 1.42 2.79-2.81zM7.34 12.5l4.16-4.16L12.5 7.34 8.34 11.5 7.34 12.5zM19.67 7.34l1.39-1.39c.38-.38.38-1.02 0-1.41l-1.39-1.39c-.38-.38-1.02-.38-1.41 0l-1.39 1.39 1.41 1.41 1.39-1.39zM5.63 19.67l1.39 1.39c.38.38 1.02.38 1.41 0l1.39-1.39-1.41-1.41-1.39 1.39zM3.52 15.62c-.39-.39-.39-1.02 0-1.41l1.39-1.39 1.41 1.41-1.39 1.39c-.38.38-1.02.38-1.41 0z"/>
// //     </svg>
// //   ),
// //   Users: () => (
// //     <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
// //       <path d="M16 4c0-1.11.89-2 2-2s2 .89 2 2-.89 2-2 2-2-.89-2-2zm4 18v-6h2.5l-2.54-7.63A2.01 2.01 0 0018.06 7h-.12a2 2 0 00-1.9 1.37l-.86 2.58c1.08.6 1.82 1.73 1.82 3.05v8h3zm-7.5-10.5c.83 0 1.5-.67 1.5-1.5s-.67-1.5-1.5-1.5S11 9.17 11 10s.67 1.5 1.5 1.5zM5.5 6c1.11 0 2-.89 2-2s-.89-2-2-2-2 .89-2 2 .89 2 2 2zm2 16v-7H9V9c0-1.1-.9-2-2-2H4c-1.1 0-2 .9-2 2v6h1.5v7h4zm6.5 0v-4h1v-4c0-.82-.68-1.5-1.5-1.5h-2c-.82 0-1.5.68-1.5 1.5v4h1v4h3z"/>
// //     </svg>
// //   ),
// //   Activity: () => (
// //     <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
// //       <path d="M13 7h-2v6h6v-2h-4V7zM3 3v18h18V3H3zm16 16H5V5h14v14z"/>
// //     </svg>
// //   ),
// //   Warning: () => (
// //     <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
// //       <path d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z"/>
// //     </svg>
// //   ),
// //   Analytics: () => (
// //     <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
// //       <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4z"/>
// //     </svg>
// //   )
// // };

// // // ==================== 12.0 LOADING COMPONENT ====================

// // function LoadingProgress() {
// //   const loadingSteps = [
// //     "Fetching recent orders...",
// //     "Analyzing revenue data...", 
// //     "Processing customer insights...",
// //     "Calculating fulfillment rates...",
// //     "Generating sales analytics..."
// //   ];

// //   return (
// //     <div className="loading-progress-container">
// //       <div className="loading-header">
// //         <h2>Loading Analytics Dashboard</h2>
// //         <p>Analyzing your order data and generating insights...</p>
// //       </div>
      
// //       <div className="progress-bar-container">
// //         <div className="progress-bar">
// //           <div className="progress-fill"></div>
// //         </div>
// //       </div>

// //       <div className="loading-steps">
// //         {loadingSteps.map((step, index) => (
// //           <div key={index} className="loading-step">
// //             <div className="step-indicator"></div>
// //             <div className="step-text">{step}</div>
// //           </div>
// //         ))}
// //       </div>
// //     </div>
// //   );
// // }

// // // ==================== 13.0 CHART COMPONENTS ====================

// // const ChartComponents = {
// //   formatCurrency: (amount: number, currency: string = 'USD') => {
// //     return amount.toLocaleString('en-US', { 
// //       style: 'currency', 
// //       currency: currency,
// //       minimumFractionDigits: 2 
// //     });
// //   },

// //   CustomerDistribution: ({ data }: { data: AnalyticsData }) => {
// //     const chartData = {
// //       labels: ['New Customers', 'Repeat Customers'],
// //       datasets: [
// //         {
// //           data: [data.totalCustomerData.newCustomers, data.totalCustomerData.repeatedCustomers],
// //           backgroundColor: ['#f59e0b', '#10b981'],
// //           borderWidth: 2,
// //           borderColor: '#fff'
// //         }
// //       ]
// //     };

// //     const options = {
// //       responsive: true,
// //       maintainAspectRatio: false,
// //       plugins: { legend: { display: false } },
// //       animation: { duration: 500 }
// //     };

// //     return (
// //       <div className="chart-container">
// //         <div className="chart-header">
// //           <div className="chart-title">Customer Distribution</div>
// //           <div className="chart-legend">
// //             <div className="legend-item">
// //               <div className="legend-color new"></div>
// //               <span>New</span>
// //             </div>
// //             <div className="legend-item">
// //               <div className="legend-color repeat"></div>
// //               <span>Repeat</span>
// //             </div>
// //           </div>
// //         </div>
// //         <Pie data={chartData} options={options} height={120} />
// //         <div className="mini-stats">
// //           <div className="mini-stat-card">
// //             <div className="mini-stat-value">
// //               {data.totalCustomerData.totalCustomers > 0 
// //                 ? `${((data.totalCustomerData.repeatedCustomers / data.totalCustomerData.totalCustomers) * 100).toFixed(1)}%`
// //                 : '0.0%'
// //               }
// //             </div>
// //             <div className="mini-stat-label">Repeat Rate</div>
// //           </div>
// //           <div className="mini-stat-card">
// //             <div className="mini-stat-value">{data.totalCustomerData.totalCustomers}</div>
// //             <div className="mini-stat-label">Total Customers</div>
// //           </div>
// //         </div>
// //       </div>
// //     );
// //   },

// //   RevenueTrend: ({ data }: { data: AnalyticsData }) => {
// //     const weeklyData = data.weeklyKeys.map(week => {
// //       const weekData = data.weeklyTotals[week];
// //       return {
// //         week: week.replace('Week of ', ''),
// //         revenue: weekData?.total || 0,
// //         totalSales: weekData?.totalSales || 0
// //       };
// //     });

// //     const totalRevenue = weeklyData.reduce((sum, w) => sum + w.revenue, 0);
// //     const totalSales = weeklyData.reduce((sum, w) => sum + w.totalSales, 0);
// //     const avgWeeklyRevenue = totalRevenue / weeklyData.length;

// //     const chartData = {
// //       labels: weeklyData.map(w => w.week),
// //       datasets: [
// //         {
// //           label: 'Revenue',
// //           data: weeklyData.map(w => w.revenue),
// //           borderColor: '#3b82f6',
// //           backgroundColor: 'rgba(59, 130, 246, 0.1)',
// //           tension: 0.4,
// //           fill: true,
// //           borderWidth: 2
// //         }
// //       ]
// //     };

// //     const options = {
// //       responsive: true,
// //       maintainAspectRatio: false,
// //       plugins: { legend: { display: false } },
// //       scales: {
// //         x: { grid: { display: false } },
// //         y: { 
// //           beginAtZero: true,
// //           ticks: {
// //             callback: function(this: any, value: any) {
// //               return '$' + value;
// //             }
// //           }
// //         }
// //       }
// //     };

// //     return (
// //       <div className="chart-container">
// //         <div className="chart-header">
// //           <div className="chart-title">Weekly Revenue Trend</div>
// //           <div className="chart-legend">
// //             <div className="legend-item">
// //               <div className="legend-color revenue"></div>
// //               <span>Revenue</span>
// //             </div>
// //           </div>
// //         </div>
// //         <Line data={chartData} options={options} height={120} />
// //         <div className="mini-stats">
// //           <div className="mini-stat-card">
// //             <div className="mini-stat-value">
// //               {ChartComponents.formatCurrency(totalRevenue, data.shopCurrency)}
// //             </div>
// //             <div className="mini-stat-label">Total Revenue</div>
// //           </div>
// //           <div className="mini-stat-card">
// //             <div className="mini-stat-value">
// //               {ChartComponents.formatCurrency(avgWeeklyRevenue, data.shopCurrency)}
// //             </div>
// //             <div className="mini-stat-label">Avg Weekly</div>
// //           </div>
// //           <div className="mini-stat-card">
// //             <div className="mini-stat-value">
// //               {ChartComponents.formatCurrency(totalSales, data.shopCurrency)}
// //             </div>
// //             <div className="mini-stat-label">Total Sales</div>
// //           </div>
// //         </div>
// //       </div>
// //     );
// //   },

// //   MonthlyPerformance: ({ data }: { data: AnalyticsData }) => {
// //     const monthlyData = data.monthRanges.map(month => {
// //       const monthData = data.monthlyTotals[month];
// //       return {
// //         month: month,
// //         revenue: monthData?.total || 0,
// //         orders: monthData?.orderCount || 0,
// //         totalSales: monthData?.totalSales || 0
// //       };
// //     });

// //     const totalRevenue = monthlyData.reduce((sum, m) => sum + m.revenue, 0);
// //     const totalOrders = monthlyData.reduce((sum, m) => sum + m.orders, 0);
// //     const totalSales = monthlyData.reduce((sum, m) => sum + m.totalSales, 0);
// //     const avgMonthlyRevenue = totalRevenue / monthlyData.length;

// //     const chartData = {
// //       labels: monthlyData.map(m => m.month),
// //       datasets: [
// //         {
// //           label: 'Revenue',
// //           data: monthlyData.map(m => m.revenue),
// //           backgroundColor: 'rgba(59, 130, 246, 0.8)',
// //           borderRadius: 4
// //         },
// //         {
// //           label: 'Orders',
// //           data: monthlyData.map(m => m.orders),
// //           backgroundColor: 'rgba(139, 92, 246, 0.8)',
// //           borderRadius: 4
// //         }
// //       ]
// //     };

// //     const options = {
// //       responsive: true,
// //       maintainAspectRatio: false,
// //       plugins: { legend: { display: false } },
// //       scales: {
// //         x: { grid: { display: false } },
// //         y: { beginAtZero: true }
// //       }
// //     };

// //     return (
// //       <div className="chart-container">
// //         <div className="chart-header">
// //           <div className="chart-title">Monthly Performance</div>
// //           <div className="chart-legend">
// //             <div className="legend-item">
// //               <div className="legend-color revenue"></div>
// //               <span>Revenue</span>
// //             </div>
// //             <div className="legend-item">
// //               <div className="legend-color orders"></div>
// //               <span>Orders</span>
// //             </div>
// //           </div>
// //         </div>
// //         <Bar data={chartData} options={options} height={120} />
// //         <div className="mini-stats">
// //           <div className="mini-stat-card">
// //             <div className="mini-stat-value">
// //               {ChartComponents.formatCurrency(totalRevenue, data.shopCurrency)}
// //             </div>
// //             <div className="mini-stat-label">Total Revenue</div>
// //           </div>
// //           <div className="mini-stat-card">
// //             <div className="mini-stat-value">
// //               {totalOrders}
// //             </div>
// //             <div className="mini-stat-label">Total Orders</div>
// //           </div>
// //           <div className="mini-stat-card">
// //             <div className="mini-stat-value">
// //               {ChartComponents.formatCurrency(totalSales, data.shopCurrency)}
// //             </div>
// //             <div className="mini-stat-label">Total Sales</div>
// //           </div>
// //         </div>
// //       </div>
// //     );
// //   },

// //   FinancialBreakdown: ({ data }: { data: AnalyticsData }) => {
// //     const financialData = {
// //       grossRevenue: Object.values(data.totals).reduce((sum: number, month: OrderStats) => sum + month.total, 0),
// //       netRevenue: Object.values(data.totals).reduce((sum: number, month: OrderStats) => sum + month.totalSales, 0),
// //       discounts: Object.values(data.totals).reduce((sum: number, month: OrderStats) => sum + month.discounts, 0),
// //       shipping: Object.values(data.totals).reduce((sum: number, month: OrderStats) => sum + month.shipping, 0),
// //       taxes: Object.values(data.totals).reduce((sum: number, month: OrderStats) => sum + month.taxes, 0),
// //       returns: Object.values(data.totals).reduce((sum: number, month: OrderStats) => sum + month.returns, 0)
// //     };

// //     const chartData = {
// //       labels: ['Gross Revenue', 'Discounts', 'Shipping', 'Taxes', 'Returns'],
// //       datasets: [
// //         {
// //           data: [
// //             financialData.grossRevenue,
// //             financialData.discounts,
// //             financialData.shipping,
// //             financialData.taxes,
// //             financialData.returns
// //           ],
// //           backgroundColor: ['#3b82f6', '#f59e0b', '#10b981', '#8b5cf6', '#ef4444'],
// //           borderWidth: 2,
// //           borderColor: '#fff'
// //         }
// //       ]
// //     };

// //     const options = {
// //       responsive: true,
// //       maintainAspectRatio: false,
// //       plugins: { legend: { display: false } }
// //     };

// //     return (
// //       <div className="chart-container">
// //         <div className="chart-header">
// //           <div className="chart-title">Financial Breakdown</div>
// //           <div className="chart-legend">
// //             <div className="legend-item">
// //               <div className="legend-color revenue"></div>
// //               <span>Revenue</span>
// //             </div>
// //             <div className="legend-item">
// //               <div className="legend-color discounts"></div>
// //               <span>Discounts</span>
// //             </div>
// //             <div className="legend-item">
// //               <div className="legend-color shipping"></div>
// //               <span>Shipping</span>
// //             </div>
// //             <div className="legend-item">
// //               <div className="legend-color taxes"></div>
// //               <span>Taxes</span>
// //             </div>
// //             <div className="legend-item">
// //               <div className="legend-color returns"></div>
// //               <span>Returns</span>
// //             </div>
// //           </div>
// //         </div>
// //         <Pie data={chartData} options={options} height={120} />
// //         <div className="mini-stats">
// //           <div className="mini-stat-card">
// //             <div className="mini-stat-value">
// //               {ChartComponents.formatCurrency(financialData.netRevenue, data.shopCurrency)}
// //             </div>
// //             <div className="mini-stat-label">Net Revenue</div>
// //           </div>
// //           <div className="mini-stat-card">
// //             <div className="mini-stat-value">
// //               {financialData.grossRevenue > 0 
// //                 ? `${((Math.abs(financialData.returns) / financialData.grossRevenue) * 100).toFixed(1)}%`
// //                 : '0.0%'
// //               }
// //             </div>
// //             <div className="mini-stat-label">Return Rate</div>
// //           </div>
// //         </div>
// //       </div>
// //     );
// //   }
// // };

// // // ==================== 14.0 EVENT SUMMARY COMPONENT ====================

// // function EventSummaryDisplay({ eventSummary, title }: { eventSummary: EventSummary, title: string }) {
// //   if (!eventSummary || eventSummary.totalEvents === 0) {
// //     return null;
// //   }

// //   const formatValue = (value: number) => {
// //     const absValue = Math.abs(value);
// //     const sign = value < 0 ? '-' : value > 0 ? '+' : '';
// //     return `${sign}$${absValue.toFixed(2)}`;
// //   };

// //   return (
// //     <section className="event-summary-display">
// //       <h3><SvgIcons.Analytics /> {title} ({eventSummary.totalEvents} event{eventSummary.totalEvents !== 1 ? 's' : ''})</h3>
      
// //       <div className="event-summary-grid">
// //         {/* Full Refunds */}
// //         {eventSummary.refunds.count > 0 && (
// //           <div className="event-card refunds">
// //             <div className="event-label">Full Refunds</div>
// //             <div className="event-value">{formatValue(eventSummary.refunds.value)}</div>
// //             <div className="event-count">
// //               {eventSummary.refunds.count} refund{eventSummary.refunds.count !== 1 ? 's' : ''}
// //             </div>
// //           </div>
// //         )}

// //         {/* Partial Refunds */}
// //         {eventSummary.partialRefunds.count > 0 && (
// //           <div className="event-card partial-refunds">
// //             <div className="event-label">Partial Refunds</div>
// //             <div className="event-value">{formatValue(eventSummary.partialRefunds.value)}</div>
// //             <div className="event-count">
// //               {eventSummary.partialRefunds.count} refund{eventSummary.partialRefunds.count !== 1 ? 's' : ''}
// //             </div>
// //           </div>
// //         )}

// //         {/* Exchanges */}
// //         {eventSummary.exchanges.count > 0 && (
// //           <div className="event-card exchanges">
// //             <div className="event-label">Exchanges</div>
// //             <div className="event-value">{formatValue(eventSummary.exchanges.value)}</div>
// //             <div className="event-count">
// //               {eventSummary.exchanges.count} exchange{eventSummary.exchanges.count !== 1 ? 's' : ''}
// //             </div>
// //           </div>
// //         )}

// //         {/* Net Summary */}
// //         <div className="event-card net-summary">
// //           <div className="event-label">Net Impact</div>
// //           <div className="event-value">{formatValue(eventSummary.netValue)}</div>
// //           <div className="event-count">
// //             across {eventSummary.totalEvents} event{eventSummary.totalEvents !== 1 ? 's' : ''}
// //           </div>
// //         </div>
// //       </div>
// //     </section>
// //   );
// // }

// // // ==================== 15.0 MISMATCH SUMMARY COMPONENT ====================

// // function MismatchSummaryCard({ mismatchSummary, periodType }: { 
// //   mismatchSummary: { 
// //     totalMismatches: number; 
// //     totalDifference: number; 
// //     hasMismatches: boolean; 
// //   };
// //   periodType: 'day' | 'week' | 'month';
// // }) {
// //   if (!mismatchSummary.hasMismatches) {
// //     return null;
// //   }

// //   const getPeriodLabel = () => {
// //     switch (periodType) {
// //       case 'day': return 'Days';
// //       case 'week': return 'Weeks'; 
// //       case 'month': return 'Months';
// //       default: return 'Periods';
// //     }
// //   };

// //   const getDifferenceColor = (difference: number) => {
// //     return Math.abs(difference) > 0.01 ? '#dc2626' : '#059669';
// //   };

// //   const getDifferenceText = (difference: number) => {
// //     const absDiff = Math.abs(difference);
// //     if (absDiff <= 0.01) return 'Perfect Match';
// //     return `$${absDiff.toFixed(2)}`;
// //   };

// //   return (
// //     <section className="mismatch-summary-card">
// //       <h3><SvgIcons.Warning /> Calculation Verification</h3>
      
// //       <div className="mismatch-summary-content">
// //         <div className="mismatch-metric">
// //           <div className="mismatch-value">{mismatchSummary.totalMismatches}</div>
// //           <div className="mismatch-label">{getPeriodLabel()} with Mismatches</div>
// //         </div>
        
// //         <div className="mismatch-metric">
// //           <div 
// //             className="mismatch-value" 
// //             style={{ color: getDifferenceColor(mismatchSummary.totalDifference) }}
// //           >
// //             {getDifferenceText(mismatchSummary.totalDifference)}
// //           </div>
// //           <div className="mismatch-label">Total Difference</div>
// //         </div>
// //       </div>
      
// //       <div className="mismatch-note">
// //         {mismatchSummary.totalMismatches > 0 ? (
// //           <span style={{ color: '#dc2626' }}>
// //             Found {mismatchSummary.totalMismatches} {getPeriodLabel().toLowerCase()} with calculation discrepancies
// //           </span>
// //         ) : (
// //           <span style={{ color: '#059669' }}>
// //             All calculations match perfectly!
// //           </span>
// //         )}
// //       </div>
// //     </section>
// //   );
// // }

// // // ==================== 16.0 MAIN REACT COMPONENT ====================

// // function ShopifyAnalyticsPage() {
// //   const data = useLoaderData<typeof loader>();
// //   const [isLoading, setIsLoading] = useState(true);
// //   const [isExporting, setIsExporting] = useState(false);
// //   const [isManualRefresh, setIsManualRefresh] = useState(false);

// //   const handleManualRefresh = () => {
// //     setIsManualRefresh(true);
// //     setIsLoading(true);
// //     window.location.reload();
// //   }

// //   useEffect(() => {
// //     if (data && !("error" in data)) {
// //       setIsLoading(false);
// //     }
// //   }, [data]);

// //   if (isLoading && isManualRefresh) {
// //     return (
// //       <div className="orders-dashboard">
// //         <div className="dashboard-header">
// //           <h1>Analytics Dashboard</h1>
// //         </div>
// //         <div className="loading-progress-container">
// //           <div className="loading-header">
// //             <h2>Refreshing Your Data</h2>
// //             <p>Please wait while we update your analytics...</p>
// //           </div>
          
// //           <div className="progress-bar-container">
// //             <div className="progress-bar">
// //               <div className="progress-fill"></div>
// //             </div>
// //           </div>

// //           <div className="loading-steps">
// //             {[
// //               "Refreshing order data...",
// //               "Updating revenue calculations...", 
// //               "Processing customer insights...",
// //               "Recalculating metrics...",
// //               "Finalizing your dashboard..."
// //             ].map((step, index) => (
// //               <div key={index} className="loading-step">
// //                 <div className="step-indicator"></div>
// //                 <div className="step-text">{step}</div>
// //               </div>
// //             ))}
// //           </div>
// //         </div>
// //       </div>
// //     );
// //   }

// //    if (isLoading) {
// //     return (
// //       <div className="orders-dashboard">
// //         <div className="dashboard-header">
// //           <h1>Analytics Dashboard</h1>
// //         </div>
// //         <LoadingProgress />
// //       </div>
// //     );
// //   }

// //   const getSafeData = (data: any): CachedAnalyticsData | null => {
// //     if (!data || typeof data !== 'object') return null;
    
// //     const safeData: CachedAnalyticsData = {
// //       shop: data.shop || 'unknown',
// //       totals: data.totals || {},
// //       dailyTotals: data.dailyTotals || {},
// //       weeklyTotals: data.weeklyTotals || {},
// //       monthlyTotals: data.monthlyTotals || {},
// //       totalOrders: typeof data.totalOrders === 'number' ? data.totalOrders : 0,
// //       totalCustomerData: data.totalCustomerData || { newCustomers: 0, repeatedCustomers: 0, totalCustomers: 0 },
// //       monthRanges: Array.isArray(data.monthRanges) ? data.monthRanges : [],
// //       dailyKeys: Array.isArray(data.dailyKeys) ? data.dailyKeys : [],
// //       weeklyKeys: Array.isArray(data.weeklyKeys) ? data.weeklyKeys : [],
// //       lastUpdated: data.lastUpdated || new Date().toISOString(),
// //       shopTimeZone: data.shopTimeZone || 'UTC',
// //       shopCurrency: data.shopCurrency || 'USD',
// //       _cacheInfo: data._cacheInfo || undefined
// //     };

// //     return safeData;
// //   };

// //   const safeNumber = (value: unknown) => (typeof value === "number" ? value : 0);
  
// //   const getSafeCustomerStats = (stats: Record<string, OrderStats & CustomerData>, key: string): OrderStats & CustomerData => {
// //     const stat = stats[key];
// //     if (!stat) {
// //       return {
// //         total: 0,
// //         discounts: 0,
// //         returns: 0,
// //         netSales: 0,
// //         shipping: 0,
// //         taxes: 0,
// //         extraFees: 0,
// //         totalSales: 0,
// //         shippingRefunds: 0,
// //         netReturns: 0,
// //         totalRefund: 0,
// //         items: 0,
// //         fulfilled: 0,
// //         unfulfilled: 0,
// //         orderCount: 0,
// //         hasSubsequentEvents: false,
// //         eventSummary: null,
// //         refundsCount: 0,
// //         financialStatus: 'pending',
// //         newCustomers: 0,
// //         repeatedCustomers: 0,
// //         totalCustomers: 0,
// //         discountsReturned: 0,
// //         netDiscounts: 0,
// //         returnShippingCharges: 0,
// //         restockingFees: 0,
// //         returnFees: 0,
// //         refundDiscrepancy: 0
// //       };
// //     }
// //     return stat;
// //   };

// //   const getCalculationMismatchSummary = (data: AnalyticsData) => {
// //     let totalMismatches = 0;
// //     let totalDifference = 0;

// //     Object.values(data.dailyTotals).forEach(dayData => {
// //       const calculatedTotal = dayData.netSales + dayData.shipping + dayData.taxes + dayData.extraFees;
// //       const mismatch = Math.abs(dayData.totalSales - calculatedTotal) > 0.01;
      
// //       if (mismatch) {
// //         totalMismatches++;
// //         const difference = calculatedTotal - dayData.totalSales;
// //         totalDifference += difference;
// //       }
// //     });

// //     return {
// //       totalMismatches,
// //       totalDifference: parseFloat(totalDifference.toFixed(2)),
// //       hasMismatches: totalMismatches > 0
// //     };
// //   };

// //   const getTodayMismatchSummary = (data: AnalyticsData) => {
// //     const todayKey = new Date().toLocaleDateString("en-CA", { timeZone: data.shopTimeZone });
// //     const todayData = getSafeCustomerStats(data.dailyTotals, todayKey);
    
// //     const calculatedTotal = todayData.netSales + todayData.shipping + todayData.taxes + todayData.extraFees;
// //     const mismatch = Math.abs(todayData.totalSales - calculatedTotal) > 0.01;
    
// //     return {
// //       totalMismatches: mismatch ? 1 : 0,
// //       totalDifference: mismatch ? (calculatedTotal - todayData.totalSales) : 0,
// //       hasMismatches: mismatch
// //     };
// //   };

// //   const getWeeklyMismatchSummary = (data: AnalyticsData) => {
// //     let totalMismatches = 0;
// //     let totalDifference = 0;

// //     Object.values(data.weeklyTotals).forEach(weekData => {
// //       const calculatedTotal = weekData.netSales + weekData.shipping + weekData.taxes + weekData.extraFees;
// //       const mismatch = Math.abs(weekData.totalSales - calculatedTotal) > 0.01;
      
// //       if (mismatch) {
// //         totalMismatches++;
// //         totalDifference += (calculatedTotal - weekData.totalSales);
// //       }
// //     });

// //     return {
// //       totalMismatches,
// //       totalDifference: parseFloat(totalDifference.toFixed(2)),
// //       hasMismatches: totalMismatches > 0
// //     };
// //   };

// //   const getMonthlyMismatchSummary = (data: AnalyticsData) => {
// //     let totalMismatches = 0;
// //     let totalDifference = 0;

// //     Object.values(data.monthlyTotals).forEach(monthData => {
// //       const calculatedTotal = monthData.netSales + monthData.shipping + monthData.taxes + monthData.extraFees;
// //       const mismatch = Math.abs(monthData.totalSales - calculatedTotal) > 0.01;
      
// //       if (mismatch) {
// //         totalMismatches++;
// //         totalDifference += (calculatedTotal - monthData.totalSales);
// //       }
// //     });

// //     return {
// //       totalMismatches,
// //       totalDifference: parseFloat(totalDifference.toFixed(2)),
// //       hasMismatches: totalMismatches > 0
// //     };
// //   };

// //   const getTodayData = () => {
// //     const safeData = getSafeData(data);
// //     if (!safeData) return null;
    
// //     const todayKey = new Date().toLocaleDateString("en-CA", { timeZone: safeData.shopTimeZone });
// //     const todayData = getSafeCustomerStats(safeData.dailyTotals, todayKey);
    
// //     return {
// //       ...todayData,
// //       ordersWithSubsequentEvents: todayData.hasSubsequentEvents ? 1 : 0,
// //       subsequentEventsCount: todayData.eventSummary?.totalEvents || 0,
// //       subsequentEventsValue: todayData.eventSummary ? Math.abs(todayData.eventSummary.netValue) : 0
// //     };
// //   };

// //   const getLast7DaysData = () => {
// //     const safeData = getSafeData(data);
// //     if (!safeData) return null;

// //     let totalRevenue = 0;
// //     let totalOrders = 0;
// //     let totalItems = 0;
// //     let totalNewCustomers = 0;
// //     let totalRepeatCustomers = 0;
// //     let totalFulfilled = 0;
// //     let totalUnfulfilled = 0;
// //     let totalDiscounts = 0;
// //     let totalReturns = 0;
// //     let totalNetSales = 0;
// //     let totalShipping = 0;
// //     let totalTaxes = 0;
// //     let totalExtraFees = 0;
// //     let totalTotalSales = 0;
// //     let totalShippingRefunds = 0;
// //     let totalNetReturns = 0;
// //     let totalTotalRefund = 0;

// //     const periodEventSummary: EventSummary = {
// //       refunds: { count: 0, value: 0 },
// //       exchanges: { count: 0, value: 0 },
// //       partialRefunds: { count: 0, value: 0 },
// //       totalEvents: 0,
// //       netValue: 0
// //     };

// //     let ordersWithEventsCount = 0;
// //     let totalEventsValue = 0;

// //     safeData.dailyKeys.forEach(day => {
// //       const dayData = getSafeCustomerStats(safeData.dailyTotals, day);
// //       totalRevenue += dayData.total;
// //       totalOrders += dayData.orderCount;
// //       totalItems += dayData.items;
// //       totalNewCustomers += dayData.newCustomers;
// //       totalRepeatCustomers += dayData.repeatedCustomers;
// //       totalFulfilled += dayData.fulfilled;
// //       totalUnfulfilled += dayData.unfulfilled;
// //       totalDiscounts += dayData.discounts;
// //       totalReturns += dayData.returns;
// //       totalNetSales += dayData.netSales;
// //       totalShipping += dayData.shipping;
// //       totalTaxes += dayData.taxes;
// //       totalExtraFees += dayData.extraFees;
// //       totalTotalSales += dayData.totalSales;
// //       totalShippingRefunds += dayData.shippingRefunds;
// //       totalNetReturns += dayData.netReturns;
// //       totalTotalRefund += dayData.totalRefund;
      
// //       if (dayData.eventSummary) {
// //         ordersWithEventsCount += dayData.hasSubsequentEvents ? 1 : 0;
        
// //         periodEventSummary.refunds.count += dayData.eventSummary.refunds.count;
// //         periodEventSummary.refunds.value += dayData.eventSummary.refunds.value;
// //         periodEventSummary.exchanges.count += dayData.eventSummary.exchanges.count;
// //         periodEventSummary.exchanges.value += dayData.eventSummary.exchanges.value;
// //         periodEventSummary.partialRefunds.count += dayData.eventSummary.partialRefunds.count;
// //         periodEventSummary.partialRefunds.value += dayData.eventSummary.partialRefunds.value;
// //         periodEventSummary.totalEvents += dayData.eventSummary.totalEvents;
// //         periodEventSummary.netValue += dayData.eventSummary.netValue;

// //         totalEventsValue += Math.abs(dayData.eventSummary.netValue);
// //       }
// //     });

// //     return {
// //       totalRevenue,
// //       totalOrders,
// //       totalItems,
// //       totalNewCustomers,
// //       totalRepeatCustomers,
// //       totalFulfilled,
// //       totalUnfulfilled,
// //       totalDiscounts,
// //       totalReturns,
// //       totalNetSales,
// //       totalShipping,
// //       totalTaxes,
// //       totalExtraFees,
// //       totalTotalSales,
// //       totalShippingRefunds,
// //       totalNetReturns,
// //       totalTotalRefund,
// //       eventSummary: periodEventSummary,
// //       ordersWithSubsequentEvents: ordersWithEventsCount,
// //       subsequentEventsCount: periodEventSummary.totalEvents,
// //       subsequentEventsValue: parseFloat(totalEventsValue.toFixed(2)),
// //       avgDailyRevenue: totalRevenue / 7,
// //       discountRate: totalRevenue > 0 ? (totalDiscounts / totalRevenue) * 100 : 0,
// //       shippingRate: totalRevenue > 0 ? (totalShipping / totalRevenue) * 100 : 0,
// //       taxRate: totalRevenue > 0 ? (totalTaxes / totalRevenue) * 100 : 0,
// //       returnRate: totalRevenue > 0 ? (totalReturns / totalRevenue) * 100 : 0
// //     };
// //   };

// //   const getWeeklyFinancials = () => {
// //     const safeData = getSafeData(data);
// //     if (!safeData) return null;

// //     let totalRevenue = 0;
// //     let totalOrders = 0;
// //     let totalItems = 0;
// //     let totalDiscounts = 0;
// //     let totalReturns = 0;
// //     let totalNetSales = 0;
// //     let totalShipping = 0;
// //     let totalTaxes = 0;
// //     let totalExtraFees = 0;
// //     let totalTotalSales = 0;
// //     let totalShippingRefunds = 0;
// //     let totalNetReturns = 0;
// //     let totalTotalRefund = 0;

// //     const periodEventSummary: EventSummary = {
// //       refunds: { count: 0, value: 0 },
// //       exchanges: { count: 0, value: 0 },
// //       partialRefunds: { count: 0, value: 0 },
// //       totalEvents: 0,
// //       netValue: 0
// //     };

// //     let ordersWithEventsCount = 0;
// //     let totalEventsValue = 0;

// //     safeData.weeklyKeys.forEach(week => {
// //       const weekData = getSafeCustomerStats(safeData.weeklyTotals, week);
// //       totalRevenue += weekData.total;
// //       totalOrders += weekData.orderCount;
// //       totalItems += weekData.items;
// //       totalDiscounts += weekData.discounts;
// //       totalReturns += weekData.returns;
// //       totalNetSales += weekData.netSales;
// //       totalShipping += weekData.shipping;
// //       totalTaxes += weekData.taxes;
// //       totalExtraFees += weekData.extraFees;
// //       totalTotalSales += weekData.totalSales;
// //       totalShippingRefunds += weekData.shippingRefunds;
// //       totalNetReturns += weekData.netReturns;
// //       totalTotalRefund += weekData.totalRefund;
      
// //       if (weekData.eventSummary) {
// //         ordersWithEventsCount += weekData.hasSubsequentEvents ? 1 : 0;
        
// //         periodEventSummary.refunds.count += weekData.eventSummary.refunds.count;
// //         periodEventSummary.refunds.value += weekData.eventSummary.refunds.value;
// //         periodEventSummary.exchanges.count += weekData.eventSummary.exchanges.count;
// //         periodEventSummary.exchanges.value += weekData.eventSummary.exchanges.value;
// //         periodEventSummary.partialRefunds.count += weekData.eventSummary.partialRefunds.count;
// //         periodEventSummary.partialRefunds.value += weekData.eventSummary.partialRefunds.value;
// //         periodEventSummary.totalEvents += weekData.eventSummary.totalEvents;
// //         periodEventSummary.netValue += weekData.eventSummary.netValue;

// //         totalEventsValue += Math.abs(weekData.eventSummary.netValue);
// //       }
// //     });

// //     return {
// //       totalRevenue,
// //       totalOrders,
// //       totalItems,
// //       totalDiscounts,
// //       totalReturns,
// //       totalNetSales,
// //       totalShipping,
// //       totalTaxes,
// //       totalExtraFees,
// //       totalTotalSales,
// //       totalShippingRefunds,
// //       totalNetReturns,
// //       totalTotalRefund,
// //       eventSummary: periodEventSummary,
// //       ordersWithSubsequentEvents: ordersWithEventsCount,
// //       subsequentEventsCount: periodEventSummary.totalEvents,
// //       subsequentEventsValue: parseFloat(totalEventsValue.toFixed(2)),
// //       netRevenue: totalTotalSales,
// //       discountRate: totalRevenue > 0 ? (totalDiscounts / totalRevenue) * 100 : 0,
// //       shippingRate: totalRevenue > 0 ? (totalShipping / totalRevenue) * 100 : 0,
// //       taxRate: totalRevenue > 0 ? (totalTaxes / totalRevenue) * 100 : 0,
// //       returnRate: totalRevenue > 0 ? (totalReturns / totalRevenue) * 100 : 0
// //     };
// //   };

// //   const getMonthlyFinancials = () => {
// //     const safeData = getSafeData(data);
// //     if (!safeData) return null;

// //     let totalRevenue = 0;
// //     let totalOrders = 0;
// //     let totalItems = 0;
// //     let totalDiscounts = 0;
// //     let totalReturns = 0;
// //     let totalNetSales = 0;
// //     let totalShipping = 0;
// //     let totalTaxes = 0;
// //     let totalExtraFees = 0;
// //     let totalTotalSales = 0;
// //     let totalShippingRefunds = 0;
// //     let totalNetReturns = 0;
// //     let totalTotalRefund = 0;

// //     const periodEventSummary: EventSummary = {
// //       refunds: { count: 0, value: 0 },
// //       exchanges: { count: 0, value: 0 },
// //       partialRefunds: { count: 0, value: 0 },
// //       totalEvents: 0,
// //       netValue: 0
// //     };

// //     let ordersWithEventsCount = 0;
// //     let totalEventsValue = 0;

// //     safeData.monthRanges.forEach(month => {
// //       const monthData = getSafeCustomerStats(safeData.monthlyTotals, month);
// //       totalRevenue += monthData.total;
// //       totalOrders += monthData.orderCount;
// //       totalItems += monthData.items;
// //       totalDiscounts += monthData.discounts;
// //       totalReturns += monthData.returns;
// //       totalNetSales += monthData.netSales;
// //       totalShipping += monthData.shipping;
// //       totalTaxes += monthData.taxes;
// //       totalExtraFees += monthData.extraFees;
// //       totalTotalSales += monthData.totalSales;
// //       totalShippingRefunds += monthData.shippingRefunds;
// //       totalNetReturns += monthData.netReturns;
// //       totalTotalRefund += monthData.totalRefund;
      
// //       if (monthData.eventSummary) {
// //         ordersWithEventsCount += monthData.hasSubsequentEvents ? 1 : 0;
        
// //         periodEventSummary.refunds.count += monthData.eventSummary.refunds.count;
// //         periodEventSummary.refunds.value += monthData.eventSummary.refunds.value;
// //         periodEventSummary.exchanges.count += monthData.eventSummary.exchanges.count;
// //         periodEventSummary.exchanges.value += monthData.eventSummary.exchanges.value;
// //         periodEventSummary.partialRefunds.count += monthData.eventSummary.partialRefunds.count;
// //         periodEventSummary.partialRefunds.value += monthData.eventSummary.partialRefunds.value;
// //         periodEventSummary.totalEvents += monthData.eventSummary.totalEvents;
// //         periodEventSummary.netValue += monthData.eventSummary.netValue;

// //         totalEventsValue += Math.abs(monthData.eventSummary.netValue);
// //       }
// //     });

// //     return {
// //       totalRevenue,
// //       totalOrders,
// //       totalItems,
// //       totalDiscounts,
// //       totalReturns,
// //       totalNetSales,
// //       totalShipping,
// //       totalTaxes,
// //       totalExtraFees,
// //       totalTotalSales,
// //       totalShippingRefunds,
// //       totalNetReturns,
// //       totalTotalRefund,
// //       eventSummary: periodEventSummary,
// //       ordersWithSubsequentEvents: ordersWithEventsCount,
// //       subsequentEventsCount: periodEventSummary.totalEvents,
// //       subsequentEventsValue: parseFloat(totalEventsValue.toFixed(2)),
// //       netRevenue: totalTotalSales,
// //       discountRate: totalRevenue > 0 ? (totalDiscounts / totalRevenue) * 100 : 0,
// //       shippingRate: totalRevenue > 0 ? (totalShipping / totalRevenue) * 100 : 0,
// //       taxRate: totalRevenue > 0 ? (totalTaxes / totalRevenue) * 100 : 0,
// //       returnRate: totalRevenue > 0 ? (totalReturns / totalRevenue) * 100 : 0
// //     };
// //   };

// //   const formatNumber = (num: number) => num.toLocaleString('en-US');
// //   const formatPercent = (num: number) => `${num.toFixed(1)}%`;
// //   const formatCurrency = (amount: number) => {
// //     const currency = safeData?.shopCurrency || 'USD';
// //     return amount.toLocaleString('en-US', { 
// //       style: 'currency', 
// //       currency: currency,
// //       minimumFractionDigits: 2 
// //     });
// //   };

// //   // In the exportToPDF function within the main component:

// // const exportToPDF = () => {
// //   setIsExporting(true);
  
// //   const safeData = getSafeData(data);
// //   const todayData = getTodayData();
// //   const last7DaysData = getLast7DaysData();
// //   const weeklyFinancials = getWeeklyFinancials();
// //   const monthlyFinancials = getMonthlyFinancials();
  
// //   if (!safeData || !todayData || !last7DaysData || !weeklyFinancials || !monthlyFinancials) {
// //     setIsExporting(false);
// //     return;
// //   }

// //   // Use the most comprehensive event data available
// //   const eventData = monthlyFinancials.eventSummary || weeklyFinancials.eventSummary || last7DaysData.eventSummary;
  
// //   // Calculate total events count
// //   const totalEvents = eventData ? 
// //     (eventData.refunds.count + eventData.exchanges.count + eventData.partialRefunds.count) : 0;
  
// //   // Calculate orders with events (from the data we already have)
// //   const ordersWithEvents = monthlyFinancials.ordersWithSubsequentEvents || 
// //                           weeklyFinancials.ordersWithSubsequentEvents || 
// //                           last7DaysData.ordersWithSubsequentEvents || 0;

// //   const pdfData: OrderData = {
// //     totalOrders: safeData.totalOrders,
// //     totalCustomers: safeData.totalCustomerData.totalCustomers,
// //     fulfillmentRate: safeData.totalOrders > 0 ? 
// //       ((last7DaysData.totalFulfilled / last7DaysData.totalOrders) * 100) : 0,
// //     totalRevenue: monthlyFinancials.totalRevenue,
// //     netRevenue: monthlyFinancials.netRevenue,
// //     averageOrderValue: safeData.totalOrders > 0 ? 
// //       (monthlyFinancials.totalRevenue / safeData.totalOrders) : 0,
// //     totalItems: monthlyFinancials.totalItems,
// //     todayOrders: todayData.orderCount,
// //     todayRevenue: todayData.total,
// //     todayItems: todayData.items,
// //     ordersChangeVsYesterday: 100.0,
// //     revenueChangeVsYesterday: 100.0,
// //     itemsChangeVsYesterday: 100.0,
// //     newCustomers: safeData.totalCustomerData.newCustomers,
// //     repeatCustomers: safeData.totalCustomerData.repeatedCustomers,
// //     customerRetentionRate: safeData.totalCustomerData.totalCustomers > 0 ? 
// //       ((safeData.totalCustomerData.repeatedCustomers / safeData.totalCustomerData.totalCustomers) * 100) : 0,
// //     averageOrderFrequency: 1.0,
// //     shopTimezone: safeData.shopTimeZone,
// //     shopCurrency: safeData.shopCurrency,
// //     // ACCURATE EVENT DATA
// //     totalRefunds: eventData?.refunds.count || 0,
// //     totalExchanges: eventData?.exchanges.count || 0,
// //     totalPartialRefunds: eventData?.partialRefunds.count || 0,
// //     totalEvents: totalEvents,
// //     ordersWithEvents: ordersWithEvents,
// //     netEventValue: eventData?.netValue || 0
// //   };

// //   console.log('🔍 PDF Export Event Data:', pdfData);

// //   generatePDFReport(pdfData);
// //   setIsExporting(false);
// // };
// //   if (isLoading) {
// //     return (
// //       <div className="orders-dashboard">
// //         <div className="dashboard-header">
// //           <h1>Analytics Dashboard</h1>
// //         </div>
// //         <LoadingProgress />
// //       </div>
// //     );
// //   }

// //   if ("error" in data) {
// //   return (
// //     <div className="orders-dashboard">
// //       <div style={{ padding: "40px", textAlign: "center", background: "#fff5f5", borderRadius: "8px" }}>
// //         <h1>We're Sorry</h1>
// //         <p>{data.userMessage}</p>
// //         <button className="print-button" onClick={handleManualRefresh}>
// //           Refresh Page
// //         </button>
// //       </div>
// //     </div>
// //   );
// // }

// //   const safeData = getSafeData(data);
// //   const todayData = getTodayData();
// //   const last7DaysData = getLast7DaysData();
// //   const weeklyFinancials = getWeeklyFinancials();
// //   const monthlyFinancials = getMonthlyFinancials();

// //   if (!safeData || !todayData || !last7DaysData || !weeklyFinancials || !monthlyFinancials) {
// //     return (
// //       <div className="orders-dashboard">
// //         <div style={{ padding: "20px", color: "red", textAlign: "center" }}>
// //           <h1>Data Validation Failed</h1>
// //           <p>Please refresh the page.</p>
// //         </div>
// //       </div>
// //     );
// //   }

// //   const formatDateDisplay = (dateStr: string) => {
// //     const date = new Date(dateStr + 'T00:00:00');
// //     return date.toLocaleDateString('en-US', { 
// //       month: 'short', 
// //       day: 'numeric',
// //       timeZone: safeData.shopTimeZone 
// //     });
// //   };

// //   const getDayName = (dateStr: string) => {
// //     const date = new Date(dateStr + 'T00:00:00');
// //     return date.toLocaleDateString('en-US', { 
// //       weekday: 'short',
// //       timeZone: safeData.shopTimeZone 
// //     });
// //   };

// //   return (
// //     <div className="orders-dashboard">
// //       <div className="dashboard-header">
// //         <h1><SvgIcons.Chart /> Orders Dashboard</h1>
// //         <div className="header-controls">
// //           <button 
// //             className="export-button"
// //             onClick={exportToPDF}
// //             disabled={isExporting}
// //             title="Export summary PDF report with key metrics"
// //           >
// //             <Icon.Export />
// //             {isExporting ? 'Generating PDF...' : 'Export Summary'}
// //           </button>
// //         </div>
// //       </div>

// //       <div id="dashboard-content">
// //         {/* Today's Performance Section */}
// //         <section className="today-performance">
// //           <h2>Today's Performance</h2>
// //           <MismatchSummaryCard 
// //             mismatchSummary={getTodayMismatchSummary(safeData)} 
// //             periodType="day" 
// //           />
          
// //           <div className="primary-metrics-grid">
// //             <div className="metric-card orders">
// //               <div className="metric-value">{safeNumber(todayData.orderCount)}</div>
// //               <div className="metric-label">Today's Orders</div>
// //               <div className="metric-change positive">
// //                 <Icon.TrendUp />
// //                 100.0% vs yesterday
// //               </div>
// //             </div>
            
// //             <div className="metric-card revenue">
// //               <div className="metric-value">{formatCurrency(safeNumber(todayData.totalSales))}</div>
// //               <div className="metric-label">Today's Total Sales</div>
// //               <div className="metric-change positive">
// //                 <Icon.TrendUp />
// //                 100.0% vs yesterday
// //               </div>
// //             </div>
            
// //             <div className="metric-card items">
// //               <div className="metric-value">{safeNumber(todayData.items)}</div>
// //               <div className="metric-label">Items Ordered</div>
// //               <div className="metric-change positive">
// //                 <Icon.TrendUp />
// //                 100.0% vs yesterday
// //               </div>
// //             </div>
// //           </div>

// //           <div className="fulfillment-metrics-grid">
// //             <div className="fulfillment-metric-card today-fulfilled">
// //               <div className="fulfillment-metric-value">{safeNumber(todayData.fulfilled)}</div>
// //               <div className="fulfillment-metric-label">FULFILLED TODAY</div>
// //               <div className="fulfillment-metric-period">Today</div>
// //             </div>
            
// //             <div className="fulfillment-metric-card today-unfulfilled">
// //               <div className="fulfillment-metric-value">{safeNumber(todayData.unfulfilled)}</div>
// //               <div className="fulfillment-metric-label">UNFULFILLED TODAY</div>
// //               <div className="fulfillment-metric-period">Today</div>
// //             </div>
            
// //             <div className="fulfillment-metric-card week-fulfilled">
// //               <div className="fulfillment-metric-value">{safeNumber(last7DaysData.totalFulfilled)}</div>
// //               <div className="fulfillment-metric-label">FULFILLED</div>
// //               <div className="fulfillment-metric-period">Last 7 Days</div>
// //             </div>
            
// //             <div className="fulfillment-metric-card week-unfulfilled">
// //               <div className="fulfillment-metric-value">{safeNumber(last7DaysData.totalUnfulfilled)}</div>
// //               <div className="fulfillment-metric-label">UNFULFILLED</div>
// //               <div className="fulfillment-metric-period">Last 7 Days</div>
// //             </div>
// //           </div>

// //           {todayData?.eventSummary && todayData.eventSummary.totalEvents > 0 && (
// //             <EventSummaryDisplay 
// //               eventSummary={todayData.eventSummary} 
// //               title="Today's Order Activity & Adjustments"
// //             />
// //           )}
// //         </section>

// //         {/* Last 7 Days Performance Section */}
// //         <section className="last7days-section">
// //           <h3>Last 7 Days Performance</h3>
          
// //           <div className="last7days-grid">
// //             <div className="last7days-total-card">
// //               <div className="last7days-total-value">{safeNumber(last7DaysData.totalOrders)}</div>
// //               <div className="last7days-total-label">TOTAL ORDERS</div>
// //             </div>
            
// //             <div className="last7days-total-card">
// //               <div className="last7days-total-value">{formatCurrency(safeNumber(last7DaysData.totalTotalSales))}</div>
// //               <div className="last7days-total-label">TOTAL SALES</div>
// //             </div>
            
// //             <div className="last7days-total-card">
// //               <div className="last7days-total-value">{safeNumber(last7DaysData.totalItems)}</div>
// //               <div className="last7days-total-label">TOTAL ITEMS</div>
// //             </div>
            
// //             <div className="last7days-total-card">
// //               <div className="last7days-total-value">{formatCurrency(safeNumber(last7DaysData.totalTotalSales / 7))}</div>
// //               <div className="last7days-total-label">AVG DAILY SALES</div>
// //             </div>
// //           </div>

// //           {/* Daily Breakdown Table */}
// //           <div className="daily-breakdown">
// //             <h4>Daily Breakdown</h4>
// //             <div className="daily-cards-container">
// //               {safeData.dailyKeys.map((day, index) => {
// //                 const dayData = getSafeCustomerStats(safeData.dailyTotals, day);
// //                 const isToday = index === safeData.dailyKeys.length - 1;
                
// //                 return (
// //                   <div key={day} className={`daily-card ${isToday ? 'current-day' : ''}`}>
// //                     <div className="daily-card-header">
// //                       <div className="daily-date">{formatDateDisplay(day)}</div>
// //                       <div className="daily-day">{getDayName(day)}</div>
// //                     </div>
                    
// //                     <div className="daily-metrics">
// //                       <div className="daily-metric">
// //                         <span className="daily-metric-label">ORDERS</span>
// //                         <span className="daily-metric-value">{safeNumber(dayData.orderCount)}</span>
// //                       </div>
                      
// //                       <div className="daily-metric">
// //                         <span className="daily-metric-label">TOTAL SALES</span>
// //                         <span className="daily-metric-value">{formatCurrency(safeNumber(dayData.totalSales))}</span>
// //                       </div>
                      
// //                       <div className="daily-metric">
// //                         <span className="daily-metric-label">ITEMS</span>
// //                         <span className="daily-metric-value">{safeNumber(dayData.items)}</span>
// //                       </div>
// //                     </div>
// //                   </div>
// //                 );
// //               })}
// //             </div>
// //           </div>

// //           {last7DaysData?.eventSummary && last7DaysData.eventSummary.totalEvents > 0 && (
// //             <EventSummaryDisplay 
// //               eventSummary={last7DaysData.eventSummary} 
// //               title="Last 7 Days: Refunds, Exchanges & Adjustments"
// //             />
// //           )}
// //         </section>

// //         {/* Week-over-Week Insight */}
// //         <div className="secondary-metrics">
// //           <div className="insight-card">
// //             <h4>Week-over-Week Revenue Change</h4>
// //             <p className="insight-value text-positive">
// //               <Icon.TrendUp /> 
// //               100.0%
// //             </p>
// //           </div>
// //         </div>

// //         {/* Customer Insights Section */}
// //         <section className="customer-metrics">
// //           <h3>Customer Insights</h3>
          
// //           <div className="customer-metrics-grid">
// //             <div className="customer-metric-card total-customers">
// //               <div className="customer-metric-value">{safeNumber(safeData.totalCustomerData.totalCustomers)}</div>
// //               <div className="customer-metric-label">TOTAL CUSTOMERS</div>
// //             </div>
            
// //             <div className="customer-metric-card new-customers">
// //               <div className="customer-metric-value">{safeNumber(safeData.totalCustomerData.newCustomers)}</div>
// //               <div className="customer-metric-label">NEW CUSTOMERS</div>
// //             </div>
            
// //             <div className="customer-metric-card repeat-customers">
// //               <div className="customer-metric-value">{safeNumber(safeData.totalCustomerData.repeatedCustomers)}</div>
// //               <div className="customer-metric-label">REPEAT CUSTOMERS</div>
// //             </div>
            
// //             <div className="customer-metric-card loyalty-rate">
// //               <div className="customer-metric-value">
// //                 {safeData.totalCustomerData.totalCustomers > 0 
// //                   ? formatPercent((safeData.totalCustomerData.repeatedCustomers / safeData.totalCustomerData.totalCustomers) * 100)
// //                   : '0.0%'
// //                 }
// //               </div>
// //               <div className="customer-metric-label">REPEAT CUSTOMER RATE</div>
// //             </div>
// //           </div>
// //         </section>

// //         {/* Last 7 Days Customer Insights */}
// //         <section className="customer-metrics">
// //           <h3>Last 7 Days Customer Insights</h3>
          
// //           <div className="customer-metrics-grid">
// //             <div className="customer-metric-card total-customers">
// //               <div className="customer-metric-value">{safeNumber(last7DaysData.totalNewCustomers + last7DaysData.totalRepeatCustomers)}</div>
// //               <div className="customer-metric-label">7-DAY TOTAL CUSTOMERS</div>
// //             </div>
            
// //             <div className="customer-metric-card new-customers">
// //               <div className="customer-metric-value">{safeNumber(last7DaysData.totalNewCustomers)}</div>
// //               <div className="customer-metric-label">7-DAY NEW CUSTOMERS</div>
// //             </div>
            
// //             <div className="customer-metric-card repeat-customers">
// //               <div className="customer-metric-value">{safeNumber(last7DaysData.totalRepeatCustomers)}</div>
// //               <div className="customer-metric-label">7-DAY REPEAT CUSTOMERS</div>
// //             </div>
            
// //             <div className="customer-metric-card loyalty-rate">
// //               <div className="customer-metric-value">
// //                 {(last7DaysData.totalNewCustomers + last7DaysData.totalRepeatCustomers) > 0
// //                   ? formatPercent((last7DaysData.totalRepeatCustomers / (last7DaysData.totalNewCustomers + last7DaysData.totalRepeatCustomers)) * 100)
// //                   : '0.0%'
// //                 }
// //               </div>
// //               <div className="customer-metric-label">7-DAY REPEAT RATE</div>
// //             </div>
// //           </div>
// //         </section>

// //         {/* Last 7 Days Financial Breakdown */}
// //         <section className="financial-metrics">
// //           <h3>Last 7 Days Financial Breakdown</h3>

// //           <MismatchSummaryCard 
// //             mismatchSummary={getCalculationMismatchSummary(safeData)} 
// //             periodType="day"
// //           />

// //           <div className="financial-metrics-grid">
// //             <div className="financial-metric-card revenue">
// //               <div className="financial-metric-value">{formatCurrency(last7DaysData.totalRevenue)}</div>
// //               <div className="financial-metric-label">Gross Sales</div>
// //               <div className="financial-metric-period">7 Days</div>
// //             </div>
            
// //             <div className="financial-metric-card discounts">
// //               <div className="financial-metric-value">{formatCurrency(last7DaysData.totalDiscounts)}</div>
// //               <div className="financial-metric-label">Total Discounts</div>
// //               <div className="financial-metric-rate">{formatPercent(last7DaysData.totalDiscounts / last7DaysData.totalRevenue * 100)} of gross</div>
// //             </div>
            
// //             <div className="financial-metric-card returns">
// //               <div className="financial-metric-value">{formatCurrency(last7DaysData.totalReturns)}</div>
// //               <div className="financial-metric-label">Returns & Refunds</div>
// //               <div className="financial-metric-rate">{formatPercent(last7DaysData.totalReturns / last7DaysData.totalRevenue * 100)} of gross</div>
// //             </div>
            
// //             <div className="financial-metric-card return-fees">
// //               <div className="financial-metric-value">{formatCurrency(last7DaysData.totalExtraFees)}</div>
// //               <div className="financial-metric-label">Return Fees</div>
// //               <div className="financial-metric-rate">{formatPercent(last7DaysData.totalExtraFees / last7DaysData.totalRevenue * 100)} of gross</div>
// //             </div>
            
// //             <div className="financial-metric-card net-sales">
// //               <div className="financial-metric-value">{formatCurrency(last7DaysData.totalNetSales)}</div>
// //               <div className="financial-metric-label">Net Sales</div>
// //               <div className="financial-metric-period">After ALL deductions</div>
// //             </div>
            
// //             <div className="financial-metric-card shipping">
// //               <div className="financial-metric-value">{formatCurrency(last7DaysData.totalShipping)}</div>
// //               <div className="financial-metric-label">Shipping Charges</div>
// //               <div className="financial-metric-rate">{formatPercent(last7DaysData.totalShipping / last7DaysData.totalNetSales * 100)} of net sales</div>
// //             </div>
            
// //             <div className="financial-metric-card taxes">
// //               <div className="financial-metric-value">{formatCurrency(last7DaysData.totalTaxes)}</div>
// //               <div className="financial-metric-label">Taxes Collected</div>
// //               <div className="financial-metric-rate">{formatPercent(last7DaysData.totalTaxes / last7DaysData.totalNetSales * 100)} of net sales</div>
// //             </div>
            
// //             <div className="financial-metric-card total-sales">
// //               <div className="financial-metric-value">{formatCurrency(last7DaysData.totalTotalSales)}</div>
// //               <div className="financial-metric-label">Total Sales</div>
// //               <div className="financial-metric-period">Final amount</div>
// //             </div>
// //           </div>

// //           {/* Daily Financial Details */}
// //           <div className="daily-financial-breakdown">
// //             <h4>Daily Financial Details</h4>
// //             <div className="daily-financial-cards">
// //               {safeData.dailyKeys.map((day, index) => {
// //                 const dayData = getSafeCustomerStats(safeData.dailyTotals, day);
// //                 const isToday = index === safeData.dailyKeys.length - 1;
                
// //                 return (
// //                   <div key={day} className={`daily-financial-card ${isToday ? 'current-day' : ''}`}>
// //                     <div className="daily-financial-header">
// //                       <div className="daily-financial-date">{formatDateDisplay(day)}</div>
// //                       <div className="daily-financial-day">{getDayName(day)}</div>
// //                     </div>
                    
// //                     <div className="daily-financial-metrics">
// //                       <div className="daily-financial-metric gross-revenue">
// //                         <span className="daily-financial-label">Gross Sales</span>
// //                         <span className="daily-financial-value">{formatCurrency(dayData.total)}</span>
// //                       </div>
                      
// //                       <div className="daily-financial-metric discounts">
// //                         <span className="daily-financial-label">Discounts</span>
// //                         <span className="daily-financial-value">{formatCurrency(dayData.discounts)}</span>
// //                       </div>
                      
// //                       <div className="daily-financial-metric returns">
// //                         <span className="daily-financial-label">Returns</span>
// //                         <span className="daily-financial-value">{formatCurrency(dayData.returns)}</span>
// //                       </div>
                      
// //                       <div className="daily-financial-metric net-sales">
// //                         <span className="daily-financial-label">Net Sales</span>
// //                         <span className="daily-financial-value">{formatCurrency(dayData.netSales)}</span>
// //                       </div>
                      
// //                       <div className="daily-financial-metric shipping">
// //                         <span className="daily-financial-label">Shipping Charges</span>
// //                         <span className="daily-financial-value">{formatCurrency(dayData.shipping)}</span>
// //                       </div>
                      
// //                       <div className="daily-financial-metric return-fees">
// //                         <span className="daily-financial-label">Return Fees</span>
// //                         <span className="daily-financial-value">{formatCurrency(dayData.extraFees)}</span>
// //                       </div>
                      
// //                       <div className="daily-financial-metric taxes">
// //                         <span className="daily-financial-label">Taxes</span>
// //                         <span className="daily-financial-value">{formatCurrency(dayData.taxes)}</span>
// //                       </div>
                      
// //                       <div className="daily-financial-metric total-sales">
// //                         <span className="daily-financial-label">Total Sales</span>
// //                         <span className="daily-financial-value">{formatCurrency(dayData.totalSales)}</span>
// //                       </div>
// //                     </div>
// //                   </div>
// //                 );
// //               })}
// //             </div>
// //           </div>
// //         </section>

// //         {/* Weekly Performance */}
// //         <section className="weekly-performance">
// //           <h3>Weekly Performance (Last 8 Weeks)</h3>
// //           <MismatchSummaryCard 
// //             mismatchSummary={getWeeklyMismatchSummary(safeData)} 
// //             periodType="week"
// //           />
// //           <div className="weekly-grid">
// //             <div className="weekly-card">
// //               <div className="weekly-value">{safeNumber(weeklyFinancials.totalOrders)}</div>
// //               <div className="weekly-label">Total Orders</div>
// //             </div>
            
// //             <div className="weekly-card">
// //               <div className="weekly-value">{formatCurrency(weeklyFinancials.totalRevenue)}</div>
// //               <div className="weekly-label">Total Revenue</div>
// //             </div>
            
// //             <div className="weekly-card">
// //               <div className="weekly-value">{safeNumber(weeklyFinancials.totalItems)}</div>
// //               <div className="weekly-label">Total Items</div>
// //             </div>
            
// //             <div className="weekly-card">
// //               <div className="weekly-value">{formatCurrency(weeklyFinancials.totalRevenue / safeData.weeklyKeys.length)}</div>
// //               <div className="weekly-label">Avg Weekly Revenue</div>
// //             </div>
// //           </div>

// //           {/* Weekly Breakdown */}
// //           <div className="weekly-breakdown">
// //             <h4>Weekly Breakdown</h4>
// //             <div className="weekly-cards-container">
// //               {safeData.weeklyKeys.map((week, index) => {
// //                 const weekData = getSafeCustomerStats(safeData.weeklyTotals, week);
// //                 const isCurrentWeek = index === safeData.weeklyKeys.length - 1;
                
// //                 return (
// //                   <div key={week} className={`week-card ${isCurrentWeek ? 'current-week' : ''}`}>
// //                     <div className="week-header">
// //                       <div className="week-label">Week {week.replace('Week of ', '').split('-')[2]}</div>
// //                       <div className="week-period">{week.replace('Week of ', '').split('-')[0]}</div>
// //                     </div>
                    
// //                     <div className="week-metrics">
// //                       <div className="week-metric orders">
// //                         <span className="week-metric-label">Orders</span>
// //                         <span className="week-metric-value">{safeNumber(weekData.orderCount)}</span>
// //                       </div>
                      
// //                       <div className="week-metric revenue">
// //                         <span className="week-metric-label">Total Sales</span>
// //                         <span className="week-metric-value">{formatCurrency(weekData.totalSales)}</span>
// //                       </div>
                      
// //                       <div className="week-metric items">
// //                         <span className="week-metric-label">Items</span>
// //                         <span className="week-metric-value">{safeNumber(weekData.items)}</span>
// //                       </div>
// //                     </div>
// //                   </div>
// //                 );
// //               })}
// //             </div>
// //           </div>

// //           {weeklyFinancials?.eventSummary && weeklyFinancials.eventSummary.totalEvents > 0 && (
// //             <EventSummaryDisplay 
// //               eventSummary={weeklyFinancials.eventSummary} 
// //               title="8-Week Period: Order Events & Financial Adjustments"
// //             />
// //           )}
// //         </section>

// //         {/* Weekly Financial Breakdown */}
// //         <section className="financial-metrics">
// //           <h3>Weekly Financial Breakdown (Last 8 Weeks)</h3>
// //           <div className="financial-metrics-grid">
// //             <div className="financial-metric-card revenue">
// //               <div className="financial-metric-value">{formatCurrency(weeklyFinancials.totalRevenue)}</div>
// //               <div className="financial-metric-label">Gross Sales</div>
// //               <div className="financial-metric-period">8 Weeks</div>
// //             </div>
            
// //             <div className="financial-metric-card discounts">
// //               <div className="financial-metric-value">{formatCurrency(weeklyFinancials.totalDiscounts)}</div>
// //               <div className="financial-metric-label">Total Discounts</div>
// //               <div className="financial-metric-rate">{formatPercent(weeklyFinancials.totalDiscounts / weeklyFinancials.totalRevenue * 100)} of gross</div>
// //             </div>
            
// //             <div className="financial-metric-card returns">
// //               <div className="financial-metric-value">{formatCurrency(weeklyFinancials.totalReturns)}</div>
// //               <div className="financial-metric-label">Returns & Refunds</div>
// //               <div className="financial-metric-rate">{formatPercent(weeklyFinancials.totalReturns / weeklyFinancials.totalRevenue * 100)} of gross</div>
// //             </div>
            
// //             <div className="financial-metric-card return-fees">
// //               <div className="financial-metric-value">{formatCurrency(weeklyFinancials.totalExtraFees)}</div>
// //               <div className="financial-metric-label">Return Fees</div>
// //               <div className="financial-metric-rate">{formatPercent(weeklyFinancials.totalExtraFees / weeklyFinancials.totalRevenue * 100)} of gross</div>
// //             </div>
            
// //             <div className="financial-metric-card net-sales">
// //               <div className="financial-metric-value">{formatCurrency(weeklyFinancials.totalNetSales)}</div>
// //               <div className="financial-metric-label">Net Sales</div>
// //               <div className="financial-metric-period">After ALL deductions</div>
// //             </div>
            
// //             <div className="financial-metric-card shipping">
// //               <div className="financial-metric-value">{formatCurrency(weeklyFinancials.totalShipping)}</div>
// //               <div className="financial-metric-label">Shipping Charges</div>
// //               <div className="financial-metric-rate">{formatPercent(weeklyFinancials.totalShipping / weeklyFinancials.totalNetSales * 100)} of net sales</div>
// //             </div>
            
// //             <div className="financial-metric-card taxes">
// //               <div className="financial-metric-value">{formatCurrency(weeklyFinancials.totalTaxes)}</div>
// //               <div className="financial-metric-label">Taxes Collected</div>
// //               <div className="financial-metric-rate">{formatPercent(weeklyFinancials.totalTaxes / weeklyFinancials.totalNetSales * 100)} of net sales</div>
// //             </div>
            
// //             <div className="financial-metric-card total-sales">
// //               <div className="financial-metric-value">{formatCurrency(weeklyFinancials.totalTotalSales)}</div>
// //               <div className="financial-metric-label">Total Sales</div>
// //               <div className="financial-metric-period">Final amount</div>
// //             </div>
// //           </div>

// //           {/* Weekly Financial Details */}
// //           <div className="weekly-financial-breakdown">
// //             <h4>Weekly Financial Details</h4>
// //             <div className="weekly-financial-cards">
// //               {safeData.weeklyKeys.map((week, index) => {
// //                 const weekData = getSafeCustomerStats(safeData.weeklyTotals, week);
// //                 const isCurrentWeek = index === safeData.weeklyKeys.length - 1;
                
// //                 return (
// //                   <div key={week} className={`weekly-financial-card ${isCurrentWeek ? 'current-week' : ''}`}>
// //                     <div className="weekly-financial-header">
// //                       <div className="weekly-financial-label">Week {week.replace('Week of ', '').split('-')[2]}</div>
// //                       <div className="weekly-financial-period">{week.replace('Week of ', '').split('-')[0]}</div>
// //                     </div>
                    
// //                     <div className="weekly-financial-metrics">
// //                       <div className="weekly-financial-metric gross-revenue">
// //                         <span className="weekly-financial-label">Gross Sales</span>
// //                         <span className="weekly-financial-value">{formatCurrency(weekData.total)}</span>
// //                       </div>
                      
// //                       <div className="weekly-financial-metric discounts">
// //                         <span className="weekly-financial-label">Discounts</span>
// //                         <span className="weekly-financial-value">{formatCurrency(weekData.discounts)}</span>
// //                       </div>
                      
// //                       <div className="weekly-financial-metric returns">
// //                         <span className="weekly-financial-label">Returns</span>
// //                         <span className="weekly-financial-value">{formatCurrency(weekData.returns)}</span>
// //                       </div>
                      
// //                       <div className="weekly-financial-metric net-sales">
// //                         <span className="weekly-financial-label">Net Sales</span>
// //                         <span className="weekly-financial-value">{formatCurrency(weekData.netSales)}</span>
// //                       </div>
                      
// //                       <div className="weekly-financial-metric shipping">
// //                         <span className="weekly-financial-label">Shipping Charges</span>
// //                         <span className="weekly-financial-value">{formatCurrency(weekData.shipping)}</span>
// //                       </div>
                      
// //                       <div className="weekly-financial-metric return-fees">
// //                         <span className="weekly-financial-label">Return Fees</span>
// //                         <span className="weekly-financial-value">{formatCurrency(weekData.extraFees)}</span>
// //                       </div>
                      
// //                       <div className="weekly-financial-metric taxes">
// //                         <span className="weekly-financial-label">Taxes</span>
// //                         <span className="weekly-financial-value">{formatCurrency(weekData.taxes)}</span>
// //                       </div>
                      
// //                       <div className="weekly-financial-metric total-sales">
// //                         <span className="weekly-financial-label">Total Sales</span>
// //                         <span className="weekly-financial-value">{formatCurrency(weekData.totalSales)}</span>
// //                       </div>
// //                     </div>
// //                   </div>
// //                 );
// //               })}
// //             </div>
// //           </div>
// //         </section>

// //         {/* Monthly Performance */}
// //         <section className="monthly-performance">
// //           <h3>Monthly Performance (Last 6 Months)</h3>
// //           <MismatchSummaryCard 
// //             mismatchSummary={getMonthlyMismatchSummary(safeData)} 
// //             periodType="month"
// //           />
// //           <div className="monthly-grid">
// //             <div className="monthly-card">
// //               <div className="monthly-value">{safeNumber(monthlyFinancials.totalOrders)}</div>
// //               <div className="monthly-label">Total Orders</div>
// //             </div>
            
// //             <div className="monthly-card">
// //               <div className="monthly-value">{formatCurrency(monthlyFinancials.totalRevenue)}</div>
// //               <div className="monthly-label">Total Revenue</div>
// //             </div>
            
// //             <div className="monthly-card">
// //               <div className="monthly-value">{safeNumber(monthlyFinancials.totalItems)}</div>
// //               <div className="monthly-label">Total Items</div>
// //             </div>
            
// //             <div className="monthly-card">
// //               <div className="monthly-value">{formatCurrency(monthlyFinancials.totalRevenue / safeData.monthRanges.length)}</div>
// //               <div className="monthly-label">Avg Monthly Revenue</div>
// //             </div>
// //           </div>

// //           {/* Monthly Breakdown */}
// //           <div className="monthly-breakdown">
// //             <h4>Monthly Breakdown</h4>
// //             <div className="monthly-cards-container">
// //               {safeData.monthRanges.map((month, index) => {
// //                 const monthData = getSafeCustomerStats(safeData.monthlyTotals, month);
// //                 const currentMonth = new Date().toLocaleString("default", { month: "short", year: "numeric", timeZone: safeData.shopTimeZone });
// //                 const isCurrentMonth = month === currentMonth;
                
// //                 const avgRevenue = safeData.monthRanges.reduce((sum, m) => {
// //                   const mData = getSafeCustomerStats(safeData.monthlyTotals, m);
// //                   return sum + mData.total;
// //                 }, 0) / safeData.monthRanges.length;
// //                 const performanceLevel = monthData.total > avgRevenue * 1.2 ? 'high' : 
// //                                        monthData.total > avgRevenue * 0.8 ? 'medium' : 'low';
                
// //                 return (
// //                   <div key={month} className={`month-card ${isCurrentMonth ? 'current-month' : ''}`}>
// //                     {isCurrentMonth && <div className="current-badge">Current</div>}
// //                     <div className="month-header">
// //                       <div className="month-label">{month.split(' ')[0]}</div>
// //                       <div className="month-period">{month.split(' ')[1]}</div>
// //                     </div>
                    
// //                     <div className="month-metrics">
// //                       <div className="month-metric orders">
// //                         <span className="month-metric-label">Orders</span>
// //                         <span className="month-metric-value">{safeNumber(monthData.orderCount)}</span>
// //                       </div>
                      
// //                       <div className="month-metric revenue">
// //                         <span className="month-metric-label">Total Sales</span>
// //                         <span className="month-metric-value">{formatCurrency(monthData.totalSales)}</span>
// //                       </div>
                      
// //                       <div className="month-metric items">
// //                         <span className="month-metric-label">Items</span>
// //                         <span className="month-metric-value">{safeNumber(monthData.items)}</span>
// //                       </div>
// //                     </div>
// //                   </div>
// //                 );
// //               })}
// //             </div>
// //           </div>

// //           {monthlyFinancials?.eventSummary && monthlyFinancials.eventSummary.totalEvents > 0 && (
// //             <EventSummaryDisplay 
// //               eventSummary={monthlyFinancials.eventSummary} 
// //               title="6-Month Overview: All Order Events & Adjustments"
// //             />
// //           )}
// //         </section>

// //         {/* Monthly Financial Breakdown */}
// //         <section className="financial-metrics">
// //           <h3>Monthly Financial Breakdown (Last 6 Months)</h3>
// //           <div className="financial-metrics-grid">
// //             <div className="financial-metric-card revenue">
// //               <div className="financial-metric-value">{formatCurrency(monthlyFinancials.totalRevenue)}</div>
// //               <div className="financial-metric-label">Gross Sales</div>
// //               <div className="financial-metric-period">6 Months</div>
// //             </div>
            
// //             <div className="financial-metric-card discounts">
// //               <div className="financial-metric-value">{formatCurrency(monthlyFinancials.totalDiscounts)}</div>
// //               <div className="financial-metric-label">Total Discounts</div>
// //               <div className="financial-metric-rate">{formatPercent(monthlyFinancials.totalDiscounts / monthlyFinancials.totalRevenue * 100)} of gross</div>
// //             </div>
            
// //             <div className="financial-metric-card returns">
// //               <div className="financial-metric-value">{formatCurrency(monthlyFinancials.totalReturns)}</div>
// //               <div className="financial-metric-label">Returns & Refunds</div>
// //               <div className="financial-metric-rate">{formatPercent(monthlyFinancials.totalReturns / monthlyFinancials.totalRevenue * 100)} of gross</div>
// //             </div>
            
// //             <div className="financial-metric-card return-fees">
// //               <div className="financial-metric-value">{formatCurrency(monthlyFinancials.totalExtraFees)}</div>
// //               <div className="financial-metric-label">Return Fees</div>
// //               <div className="financial-metric-rate">{formatPercent(monthlyFinancials.totalExtraFees / monthlyFinancials.totalRevenue * 100)} of gross</div>
// //             </div>
            
// //             <div className="financial-metric-card net-sales">
// //               <div className="financial-metric-value">{formatCurrency(monthlyFinancials.totalNetSales)}</div>
// //               <div className="financial-metric-label">Net Sales</div>
// //               <div className="financial-metric-period">After ALL deductions</div>
// //             </div>
            
// //             <div className="financial-metric-card shipping">
// //               <div className="financial-metric-value">{formatCurrency(monthlyFinancials.totalShipping)}</div>
// //               <div className="financial-metric-label">Shipping Charges</div>
// //               <div className="financial-metric-rate">{formatPercent(monthlyFinancials.totalShipping / monthlyFinancials.totalNetSales * 100)} of net sales</div>
// //             </div>
            
// //             <div className="financial-metric-card taxes">
// //               <div className="financial-metric-value">{formatCurrency(monthlyFinancials.totalTaxes)}</div>
// //               <div className="financial-metric-label">Taxes Collected</div>
// //               <div className="financial-metric-rate">{formatPercent(monthlyFinancials.totalTaxes / monthlyFinancials.totalNetSales * 100)} of net sales</div>
// //             </div>
            
// //             <div className="financial-metric-card total-sales">
// //               <div className="financial-metric-value">{formatCurrency(monthlyFinancials.totalTotalSales)}</div>
// //               <div className="financial-metric-label">Total Sales</div>
// //               <div className="financial-metric-period">Final amount</div>
// //             </div>
// //           </div>

// //           {/* Monthly Financial Details */}
// //           <div className="monthly-financial-breakdown">
// //             <h4>Monthly Financial Details</h4>
// //             <div className="monthly-financial-cards">
// //               {safeData.monthRanges.map((month, index) => {
// //                 const monthData = getSafeCustomerStats(safeData.monthlyTotals, month);
// //                 const currentMonth = new Date().toLocaleString("default", { month: "short", year: "numeric", timeZone: safeData.shopTimeZone });
// //                 const isCurrentMonth = month === currentMonth;
                
// //                 return (
// //                   <div key={month} className={`monthly-financial-card ${isCurrentMonth ? 'current-month' : ''}`}>
// //                     {isCurrentMonth && <div className="current-badge">Current</div>}
// //                     <div className="monthly-financial-header">
// //                       <div className="monthly-financial-label">{month.split(' ')[0]}</div>
// //                       <div className="monthly-financial-period">{month.split(' ')[1]}</div>
// //                     </div>
                    
// //                     <div className="monthly-financial-metrics">
// //                       <div className="monthly-financial-metric gross-revenue">
// //                         <span className="monthly-financial-label">Gross Sales</span>
// //                         <span className="monthly-financial-value">{formatCurrency(monthData.total)}</span>
// //                       </div>
                      
// //                       <div className="monthly-financial-metric discounts">
// //                         <span className="monthly-financial-label">Discounts</span>
// //                         <span className="monthly-financial-value">{formatCurrency(monthData.discounts)}</span>
// //                       </div>
                      
// //                       <div className="monthly-financial-metric returns">
// //                         <span className="monthly-financial-label">Returns</span>
// //                         <span className="monthly-financial-value">{formatCurrency(monthData.returns)}</span>
// //                       </div>
                      
// //                       <div className="monthly-financial-metric net-sales">
// //                         <span className="monthly-financial-label">Net Sales</span>
// //                         <span className="monthly-financial-value">{formatCurrency(monthData.netSales)}</span>
// //                       </div>
                      
// //                       <div className="monthly-financial-metric shipping">
// //                         <span className="monthly-financial-label">Shipping Charges</span>
// //                         <span className="monthly-financial-value">{formatCurrency(monthData.shipping)}</span>
// //                       </div>
                      
// //                       <div className="monthly-financial-metric return-fees">
// //                         <span className="monthly-financial-label">Return Fees</span>
// //                         <span className="monthly-financial-value">{formatCurrency(monthData.extraFees)}</span>
// //                       </div>
                      
// //                       <div className="monthly-financial-metric taxes">
// //                         <span className="monthly-financial-label">Taxes</span>
// //                         <span className="monthly-financial-value">{formatCurrency(monthData.taxes)}</span>
// //                       </div>
                      
// //                       <div className="monthly-financial-metric total-sales">
// //                         <span className="monthly-financial-label">Total Sales</span>
// //                         <span className="monthly-financial-value">{formatCurrency(monthData.totalSales)}</span>
// //                       </div>
// //                     </div>
// //                   </div>
// //                 );
// //               })}
// //             </div>
// //           </div>
// //         </section>

// //         {/* Charts & Analytics Section */}
// //         <section className="charts-section">
// //           <h2>Analytics & Insights Visualization</h2>
          
// //           <div className="charts-grid">
// //             <ChartComponents.CustomerDistribution data={safeData} />
// //             <ChartComponents.RevenueTrend data={safeData} />
// //             <ChartComponents.MonthlyPerformance data={safeData} />
// //             <ChartComponents.FinancialBreakdown data={safeData} />
// //           </div>
// //         </section>

// //         {/* Footer */}
// //         <footer className="app-footer">
// //           <div className="footer-content">
// //             <p>
// //               <strong>Orders Analyzed:</strong> {safeData.totalOrders} orders • 
// //               <strong> Net Revenue:</strong> {formatCurrency(monthlyFinancials.netRevenue)} • 
// //               <strong> Data Updated:</strong> {new Date(safeData.lastUpdated).toLocaleDateString()}
// //             </p>
// //             <p className="footer-brand">Analytics Dashboard - Nexus Powering Your Business Insights</p>
// //           </div>
// //         </footer>
// //       </div>
// //     </div>
// //   );
// // }

// // // ==================== 17.0 EXPORT COMPONENT ====================

// // export default function AnalyticsApp() {
// //   return <ShopifyAnalyticsPage />;
// // }




























































































// // // ==================== 1.0 IMPORTS & SETUP ====================

// // import { json, type LoaderFunctionArgs } from "@remix-run/node";
// // import { useLoaderData } from "@remix-run/react";
// // import { authenticate } from "../shopify.server";
// // import { useState, useEffect, useMemo } from "react";
// // import "../styles/orders.css";

// // // Chart.js imports
// // import {
// //   Chart as ChartJS,
// //   CategoryScale,
// //   LinearScale,
// //   BarElement,
// //   LineElement,
// //   PointElement,
// //   ArcElement,
// //   Title,
// //   Tooltip,
// //   Legend,
// //   Filler,
// // } from 'chart.js';
// // import { Bar, Line, Pie, Doughnut } from 'react-chartjs-2';

// // // Register Chart.js components
// // ChartJS.register(
// //   CategoryScale,
// //   LinearScale,
// //   BarElement,
// //   LineElement,
// //   PointElement,
// //   ArcElement,
// //   Title,
// //   Tooltip,
// //   Legend,
// //   Filler
// // );

// // // ==================== 1.1 API CONFIGURATION ====================
// // const SHOPIFY_API_VERSION = process.env.SHOPIFY_API_VERSION || '2024-04';

// // // ==================== 2.0 TYPE DEFINITIONS ====================

// // interface Order {
// //   id: number;
// //   created_at: string;
// //   total_price: string;
// //   total_discounts?: string;
// //   total_shipping_price_set?: {
// //     shop_money: { amount: string };
// //   };
// //   total_tax?: string;
// //   total_refunds?: string;
// //   fulfillment_status?: string;
// //   line_items?: Array<{
// //     quantity: number;
// //   }>;
// //   customer?: {
// //     id?: string | number;
// //   };
// // }

// // type EventSummary = {
// //   refunds: {
// //     count: number;
// //     value: number;
// //   };
// //   exchanges: {
// //     count: number;
// //     value: number;
// //   };
// //   partialRefunds: {
// //     count: number;
// //     value: number;
// //   };
// //   totalEvents: number;
// //   netValue: number;
// // };

// // interface OrderStats {
// //   total: number;
// //   items: number;
// //   fulfilled: number;
// //   unfulfilled: number;
// //   discounts: number;
// //   shipping: number;
// //   taxes: number;
// //   returns: number;
// //   orderCount: number;
// //   netSales: number;
// //   extraFees: number;
// //   totalSales: number;
// //   shippingRefunds: number;
// //   netReturns: number;
// //   totalRefund: number;
// //   discountsReturned?: number;
// //   netDiscounts?: number;
// //   returnShippingCharges?: number;
// //   restockingFees?: number;
// //   returnFees?: number;
// //   refundDiscrepancy?: number;
// //   hasSubsequentEvents: boolean;
// //   eventSummary: EventSummary | null;
// //   refundsCount: number;
// //   financialStatus: string;
// // }

// // interface CustomerData {
// //   newCustomers: number;
// //   repeatedCustomers: number;
// //   totalCustomers: number;
// // }

// // interface AnalyticsData {
// //   shop: string;
// //   totals: Record<string, OrderStats>;
// //   dailyTotals: Record<string, OrderStats & CustomerData>;
// //   weeklyTotals: Record<string, OrderStats & CustomerData>;
// //   monthlyTotals: Record<string, OrderStats & CustomerData>;
// //   totalOrders: number;
// //   totalCustomerData: CustomerData;
// //   monthRanges: string[];
// //   dailyKeys: string[];
// //   weeklyKeys: string[];
// //   lastUpdated: string;
// //   shopTimeZone: string;
// //   shopCurrency: string;
// // }

// // interface CachedAnalyticsData extends AnalyticsData {
// //   _cacheInfo?: {
// //     fetchMode: "incremental" | "full";
// //     apiSuccess: boolean;
// //     cacheHealth: {
// //       total: number;
// //       valid: number;
// //       expired: number;
// //       health: number;
// //     };
// //     cacheStats: {
// //       size: number;
// //       version: number;
// //     };
// //     cacheUsed: boolean;
// //     cacheHit: boolean;
// //     fallbackUsed: boolean;
// //     cacheTimestamp?: number;
// //     performance?: {
// //       cacheOperationTime: number;
// //       totalLoaderTime: number;
// //     };
// //   };
// // }

// // interface OrderData {
// //   totalOrders: number;
// //   totalCustomers: number;
// //   fulfillmentRate: number;
// //   totalRevenue: number;
// //   netRevenue: number;
// //   averageOrderValue: number;
// //   totalItems: number;
// //   todayOrders: number;
// //   todayRevenue: number;
// //   todayItems: number;
// //   ordersChangeVsYesterday: number;
// //   revenueChangeVsYesterday: number;
// //   itemsChangeVsYesterday: number;
// //   newCustomers: number;
// //   repeatCustomers: number;
// //   customerRetentionRate: number;
// //   averageOrderFrequency: number;
// //   shopTimezone: string;
// //   shopCurrency: string;
// //   totalRefunds?: number;
// //   totalExchanges?: number;
// //   totalPartialRefunds?: number;
// //   totalEvents?: number;
// //   ordersWithEvents?: number;
// //   netEventValue?: number;
// // }

// // // ==================== 3.0 CACHE MANAGER ====================

// // class PersistentCacheManager {
// //   private memoryStorage: Map<string, any> = new Map();
// //   public version = 1;

// //   private performanceMetrics = {
// //     setOperations: 0,
// //     getOperations: 0,
// //     removeOperations: 0,
// //     totalSetTime: 0,
// //     totalGetTime: 0,
// //     totalRemoveTime: 0
// //   };

// //   private validateCacheData(data: any): boolean {
// //     try {
// //       if (!data) return false;
// //       if (data.orders && !Array.isArray(data.orders)) return false;
// //       if (data.lastUpdatedAt && isNaN(Date.parse(data.lastUpdatedAt))) return false;
// //       return true;
// //     } catch (error) {
// //       console.warn('Cache validation error:', error);
// //       return false;
// //     }
// //   }

// //   private async getPersistentStorage(): Promise<Map<string, any>> {
// //     return this.memoryStorage;
// //   }

// //   async set<T>(key: string, value: T, ttl: number = 30 * 60 * 1000): Promise<void> {
// //     const startTime = performance.now(); 
    
// //     try {
// //       if (!key || typeof key !== 'string') {
// //         throw new Error('Invalid cache key');
// //       }

// //       if (!this.validateCacheData(value)) {
// //         throw new Error('Invalid cache data structure');
// //       }

// //       const storage = await this.getPersistentStorage();
// //       const entry = {
// //         value,
// //         timestamp: Date.now(),
// //         ttl,
// //         key,
// //         version: this.version
// //       };
      
// //       // Store in memory
// //       storage.set(key, entry);
      
// //       // Persist to localStorage
// //       if (typeof window !== 'undefined' && window.localStorage) {
// //         try {
// //           localStorage.setItem(key, JSON.stringify(entry));
// //         } catch (e) {
// //           console.warn('LocalStorage save error:', e);
// //         }
// //       }
// //       await this.enforceSizeLimit(50);
      
// //     } catch (error) {
// //       console.error('Cache set operation failed:', error);
// //       throw error;
// //     } finally {
// //       // ADDED: Performance tracking for set operations
// //       const duration = performance.now() - startTime;
// //       this.performanceMetrics.setOperations++;
// //       this.performanceMetrics.totalSetTime += duration;
      
// //       if (duration > 100) {
// //         console.warn(`🐌 Slow cache SET: ${duration.toFixed(2)}ms for key: ${key}`);
// //       }
// //     }
// //   }

// //   async get<T>(key: string): Promise<{ value: T; timestamp: number } | null> {
// //     const startTime = performance.now(); // ADDED: Start timing
    
// //     try {
// //       const storage = await this.getPersistentStorage();
// //       let entry = storage.get(key);
      
// //       // Try localStorage if not in memory
// //       if (!entry && typeof window !== 'undefined' && window.localStorage) {
// //         try {
// //           const stored = localStorage.getItem(key);
// //           if (stored) {
// //             entry = JSON.parse(stored);
// //             storage.set(key, entry);
// //           }
// //         } catch (e) {
// //           console.warn('LocalStorage retrieval error:', e);
// //           await this.remove(key);
// //           return null;
// //         }
// //       }

// //       if (!entry) {
// //         return null;
// //       }

// //       // Check expiration
// //       const isExpired = Date.now() - entry.timestamp > entry.ttl;
// //       if (isExpired) {
// //         await this.remove(key);
// //         return null;
// //       }

// //       // Validate data
// //       if (!this.validateCacheData(entry.value)) {
// //         await this.remove(key);
// //         return null;
// //       }

// //       return { value: entry.value, timestamp: entry.timestamp };
// //     } catch (error) {
// //       console.error('Cache get operation failed:', error);
// //       await this.remove(key);
// //       return null;
// //     } finally {
// //       // ADDED: Performance tracking for get operations
// //       const duration = performance.now() - startTime;
// //       this.performanceMetrics.getOperations++;
// //       this.performanceMetrics.totalGetTime += duration;
      
// //       if (duration > 50) {
// //         console.warn(`🐌 Slow cache GET: ${duration.toFixed(2)}ms for key: ${key}`);
// //       }
// //     }
// //   }

// //   async remove(key: string): Promise<void> {
// //     const startTime = performance.now(); // ADDED: Start timing
    
// //     try {
// //       const storage = await this.getPersistentStorage();
// //       storage.delete(key);
      
// //       if (typeof window !== 'undefined' && window.localStorage) {
// //         try {
// //           localStorage.removeItem(key);
// //         } catch (e) {
// //           console.warn('LocalStorage removal error:', e);
// //         }
// //       }
// //     } catch (error) {
// //       console.error('Cache remove operation failed:', error);
// //     } finally {
// //       // ADDED: Performance tracking for remove operations
// //       const duration = performance.now() - startTime;
// //       this.performanceMetrics.removeOperations++;
// //       this.performanceMetrics.totalRemoveTime += duration;
      
// //       if (duration > 50) {
// //         console.warn(`🐌 Slow cache REMOVE: ${duration.toFixed(2)}ms for key: ${key}`);
// //       }
// //     }
// //   }

// //   async emergencyReset(shop: string): Promise<void> {
// //     const keys = [
// //       makeCacheKey(shop, "orders"),
// //     ];
    
// //     for (const key of keys) {
// //       await this.remove(key);
// //     }
// //     console.log('Emergency cache reset completed for:', shop);
// //   }

// //   // === ADD BULK EXPIRED CLEANER - START ===
// // async cleanAllExpired(): Promise<number> {
// //   let cleanedCount = 0;
// //   const storage = await this.getPersistentStorage();
// //   const now = Date.now();
  
// //   // Clean memory storage
// //   for (const [key, entry] of storage.entries()) {
// //     if (now - entry.timestamp > entry.ttl) {
// //       await this.remove(key);
// //       cleanedCount++;
// //     }
// //   }
  
// //   // Clean localStorage expired entries
// //   if (typeof window !== 'undefined' && window.localStorage) {
// //     for (let i = 0; i < localStorage.length; i++) {
// //       const key = localStorage.key(i);
// //       if (key && key.includes('::analytics::')) {
// //         try {
// //           const stored = localStorage.getItem(key);
// //           if (stored) {
// //             const entry = JSON.parse(stored);
// //             if (now - entry.timestamp > entry.ttl) {
// //               localStorage.removeItem(key);
// //               cleanedCount++;
// //             }
// //           }
// //         } catch (e) {
// //           // Remove corrupted entries
// //           localStorage.removeItem(key);
// //           cleanedCount++;
// //         }
// //       }
// //     }
// //   }
  
// //   console.log(`🧹 Cleaned ${cleanedCount} expired cache entries`);
// //   return cleanedCount;
// // }

// // // === ADD SIZE LIMIT ENFORCEMENT - START ===
// // async enforceSizeLimit(maxSize: number = 100): Promise<void> {
// //   const storage = await this.getPersistentStorage();
// //   if (storage.size <= maxSize) return;
  
// //   // Remove oldest entries
// //   const entries = Array.from(storage.entries())
// //     .sort((a, b) => a[1].timestamp - b[1].timestamp);
    
// //   const toRemove = storage.size - maxSize;
// //   for (let i = 0; i < toRemove; i++) {
// //     await this.remove(entries[i][0]);
// //   }
  
// //   console.log(`📦 Removed ${toRemove} old entries to enforce size limit (max: ${maxSize})`);
// // }
// // // === ADD SIZE LIMIT ENFORCEMENT - END ===

// //   getStats() {
// //     return {
// //       size: this.memoryStorage.size,
// //       version: this.version
// //     };
// //   }

// //   // ADDED: Performance reporting method
// //   getPerformanceReport() {
// //     const avgSetTime = this.performanceMetrics.setOperations > 0 
// //       ? this.performanceMetrics.totalSetTime / this.performanceMetrics.setOperations 
// //       : 0;
    
// //     const avgGetTime = this.performanceMetrics.getOperations > 0 
// //       ? this.performanceMetrics.totalGetTime / this.performanceMetrics.getOperations 
// //       : 0;
    
// //     const avgRemoveTime = this.performanceMetrics.removeOperations > 0 
// //       ? this.performanceMetrics.totalRemoveTime / this.performanceMetrics.removeOperations 
// //       : 0;

// //     return {
// //       operations: {
// //         set: this.performanceMetrics.setOperations,
// //         get: this.performanceMetrics.getOperations,
// //         remove: this.performanceMetrics.removeOperations
// //       },
// //       averageTimes: {
// //         set: parseFloat(avgSetTime.toFixed(2)),
// //         get: parseFloat(avgGetTime.toFixed(2)),
// //         remove: parseFloat(avgRemoveTime.toFixed(2))
// //       },
// //       totalTimes: {
// //         set: parseFloat(this.performanceMetrics.totalSetTime.toFixed(2)),
// //         get: parseFloat(this.performanceMetrics.totalGetTime.toFixed(2)),
// //         remove: parseFloat(this.performanceMetrics.totalRemoveTime.toFixed(2))
// //       }
// //     };
// //   }

// //   healthReport() {
// //     const now = Date.now();
// //     let expiredCount = 0;
// //     let validCount = 0;

// //     for (const entry of this.memoryStorage.values()) {
// //       if (now - entry.timestamp > entry.ttl) {
// //         expiredCount++;
// //       } else {
// //         validCount++;
// //       }
// //     }

// //     const total = this.memoryStorage.size;
// //     const health = total > 0 ? validCount / total : 1;

// //     return {
// //       total: total,
// //       valid: validCount,
// //       expired: expiredCount,
// //       health: health,
// //       sizeInfo: {
// //       memorySize: total,
// //       recommendedMax: 50,
// //       needsCleaning: total > 50
// //     }
// //     };
// //   }
// // }

// // // Global cache instance
// // const cacheManager = new PersistentCacheManager();

// // // ==================== 4.0 HELPER FUNCTIONS ====================

// // function makeCacheKey(shop: string, segment: string): string {
// //   return `${shop}::analytics::${segment}::v${cacheManager.version}`;
// // }

// // function nowISO(): string {
// //   return new Date().toISOString();
// // }

// // function getMonthRanges(shopTimeZone: string = "UTC") {
// //   const ranges: { start: string; end: string; key: string }[] = [];
// //   const now = new Date();

// //   for (let i = 6; i >= 0; i--) {
// //     const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
// //     const start = new Date(date.getFullYear(), date.getMonth(), 1);
// //     const end = new Date(date.getFullYear(), date.getMonth() + 1, 0, 23, 59, 59);
// //     ranges.push({
// //       start: start.toISOString(),
// //       end: end.toISOString(),
// //       key: date.toLocaleString("default", { month: "short", year: "numeric" }),
// //     });
// //   }

// //   return ranges;
// // }

// // function getLastNDays(n: number, shopTimeZone: string = "UTC") {
// //   const days: string[] = [];
// //   const now = new Date();
  
// //   for (let i = n - 1; i >= 0; i--) {
// //     const d = new Date(now);
// //     d.setDate(now.getDate() - i);
// //     const dayKey = d.toLocaleDateString("en-CA", { timeZone: shopTimeZone });
// //     days.push(dayKey);
// //   }
  
// //   return days;
// // }

// // function getLast8Weeks(shopTimeZone: string = "UTC") {
// //   const weeks: string[] = [];
// //   const now = new Date();
// //   const monday = new Date(now);
// //   monday.setDate(now.getDate() - ((now.getDay() + 6) % 7));
// //   for (let i = 7; i >= 0; i--) {
// //     const startOfWeek = new Date(monday);
// //     startOfWeek.setDate(monday.getDate() - i * 7);
// //     const key = `Week of ${startOfWeek.toLocaleDateString("en-CA", { timeZone: shopTimeZone })}`;
// //     weeks.push(key);
// //   }
// //   return weeks;
// // }

// // // ==================== 5.0 API FETCHING FUNCTIONS ====================

// // async function fetchOrdersSince(
// //   shop: string, 
// //   accessToken: string, 
// //   sinceDate: string, 
// //   cachedOrders: any[] = []
// // ): Promise<{ orders: any[]; hasMore: boolean }> {
  
// //   console.log('🔍 INCREMENTAL FETCH DEBUG:', {
// //     sinceDate,
// //     cachedOrdersCount: cachedOrders.length,
// //     url: `https://${shop}/admin/api/${SHOPIFY_API_VERSION}/orders.json?status=any&limit=250&updated_at_min=${sinceDate}`
// //   });

// //   let newOrders: any[] = []; // ONLY new orders from API
// //   let url = `https://${shop}/admin/api/${SHOPIFY_API_VERSION}/orders.json?status=any&limit=250&updated_at_min=${sinceDate}`;
// //   let pageCount = 0;
// //   let hasMore = true;

// //   while (url && hasMore) {
// //     pageCount++;

// //     const response = await fetch(url, { 
// //       headers: { "X-Shopify-Access-Token": accessToken } 
// //     });

// //     if (!response.ok) {
// //       if (response.status === 429) {
// //         const retryAfter = response.headers.get('Retry-After') || '10';
// //         const waitTime = parseInt(retryAfter) * 1000;
// //         await new Promise(resolve => setTimeout(resolve, waitTime));
// //         continue;
// //       }
// //       throw new Error(`HTTP error! status: ${response.status}`);
// //     }

// //     const data = await response.json();
// //     const apiOrders: any[] = data.orders || [];
    
// //     // === FIX: Only add NEW orders from API, don't merge with cached ones here ===
// //     newOrders = newOrders.concat(apiOrders);

// //     // === ADD ORDER UPDATE ANALYSIS - START ===
// //     console.log('🔍 ORDER UPDATE ANALYSIS:', {
// //       newOrdersCount: newOrders.length,
// //       sampleUpdatedOrders: newOrders.slice(0, 3).map(order => ({
// //         id: order.id,
// //         created_at: order.created_at,
// //         updated_at: order.updated_at,
// //         financial_status: order.financial_status
// //       }))
// //     });
// //     // === ADD ORDER UPDATE ANALYSIS - END ===

// //     const linkHeader = response.headers.get("Link");
// //     const nextMatch = linkHeader?.match(/<([^>]+)>; rel="next"/);
// //     url = nextMatch ? nextMatch[1] : "";
// //     hasMore = !!url;

// //     if (url) {
// //       await new Promise(resolve => setTimeout(resolve, 200));
// //     }
// //   }

// //   // === FIX: Return ONLY the new orders, not the merged list ===
// //   console.log(`✅ Incremental fetch complete: ${newOrders.length} new orders found`);
// //   return { orders: newOrders, hasMore: false };
// // }

// // async function fetchOrdersForPeriod(shop: string, accessToken: string, startDate: string, endDate: string) {
// //   let allOrders: any[] = [];
// //   let url = `https://${shop}/admin/api/${SHOPIFY_API_VERSION}/orders.json?status=any&limit=250&created_at_min=${startDate}&created_at_max=${endDate}`;
// //   let pageCount = 0;

// //   while (url) {
// //     pageCount++;

// //     const response = await fetch(url, { 
// //       headers: { "X-Shopify-Access-Token": accessToken } 
// //     });

// //     if (!response.ok) {
// //       if (response.status === 429) {
// //         const retryAfter = response.headers.get('Retry-After') || '10';
// //         const waitTime = parseInt(retryAfter) * 1000;
// //         await new Promise(resolve => setTimeout(resolve, waitTime));
// //         continue;
// //       } else {
// //         throw new Error(`HTTP error! status: ${response.status}`);
// //       }
// //     }

// //     const data = await response.json();
// //     const ordersCount = data.orders?.length || 0;
    
// //     allOrders = allOrders.concat(data.orders || []);

// //     const linkHeader = response.headers.get("Link");
// //     const nextMatch = linkHeader?.match(/<([^>]+)>; rel="next"/);
// //     url = nextMatch ? nextMatch[1] : "";
// //   }

// //   return allOrders;
// // }

// // // ==================== 6.0 EVENT DETECTION LOGIC ====================

// // function calculateOrderEventSummary(order: any, periodStart: Date, periodEnd: Date): EventSummary | null {
// //   const eventSummary: EventSummary = {
// //     refunds: { count: 0, value: 0 },
// //     exchanges: { count: 0, value: 0 },
// //     partialRefunds: { count: 0, value: 0 },
// //     totalEvents: 0,
// //     netValue: 0
// //   };

// //   const orderRefunds = order.refunds || [];
// //   let hasEvents = false;

// //   orderRefunds.forEach((refund: any) => {
// //     const refundDate = new Date(refund.created_at);
    
// //     if (refundDate >= periodStart && refundDate <= periodEnd) {
// //       let refundAmount = 0;
      
// //       if (refund.transactions && refund.transactions.length > 0) {
// //         refund.transactions.forEach((transaction: any) => {
// //           if (transaction.kind === 'refund' && transaction.status === 'success') {
// //             refundAmount += Math.abs(parseFloat(transaction.amount) || 0);
// //           }
// //         });
// //       }

// //       const isFullRefund = refundAmount === parseFloat(order.total_price);
// //       const hasExchangeTags = order.tags?.includes('exchange') || order.note?.includes('exchange');
// //       const hasMultipleFulfillments = order.fulfillments && order.fulfillments.length > 1;
// //       const isExchange = hasExchangeTags || hasMultipleFulfillments;

// //       if (isFullRefund && !isExchange) {
// //         eventSummary.refunds.count++;
// //         eventSummary.refunds.value -= refundAmount;
// //       } else if (isExchange) {
// //         eventSummary.exchanges.count++;
// //         const exchangeValue = -refundAmount;
// //         eventSummary.exchanges.value += exchangeValue;
// //       } else {
// //         eventSummary.partialRefunds.count++;
// //         eventSummary.partialRefunds.value -= refundAmount;
// //       }

// //       eventSummary.totalEvents++;
// //       eventSummary.netValue -= refundAmount;
// //       hasEvents = true;
// //     }
// //   });

// //   return hasEvents ? eventSummary : null;
// // }

// // // ==================== 7.0 FINANCIAL CALCULATION ENGINE ====================

// // // === ADD SIMPLE ORDER PROCESSOR - START ===
// // function processSimpleOrder(order: any): OrderStats {
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
// // // === ADD SIMPLE ORDER PROCESSOR - END ===

// // function processOrderToStats(order: any): OrderStats {
// //   // === ADD EARLY EXIT FOR SIMPLE ORDERS - START ===
// //   // If order has no refunds and is simple, use fast path
// //   const hasRefunds = order.refunds && order.refunds.length > 0;
// //   const hasComplexFulfillment = order.fulfillments && order.fulfillments.length > 1;
// //   const hasExchangeTags = order.tags?.includes('exchange') || order.note?.includes('exchange');
  
// //   if (!hasRefunds && !hasComplexFulfillment && !hasExchangeTags) {
// //     return processSimpleOrder(order);
// //   }
// //   // === ADD EARLY EXIT FOR SIMPLE ORDERS - END ===

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
// //     // === OPTIMIZE REFUND PROCESSING - START ===
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
// //     // === OPTIMIZE REFUND PROCESSING - END ===
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
// //         // === OPTIMIZE LINE ITEM PROCESSING - START ===
// //         for (let i = 0; i < order.line_items.length; i++) {
// //           const item = order.line_items[i];
// //           let isRefunded = false;
          
// //           // Check if item was refunded
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
// //         // === OPTIMIZE LINE ITEM PROCESSING - END ===
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
// //           // === OPTIMIZE LINE ITEM PROCESSING - START ===
// //           for (let i = 0; i < order.line_items.length; i++) {
// //             const item = order.line_items[i];
// //             if (item.fulfillment_status === 'fulfilled') {
// //               const itemPrice = parseFloat(item.price) || 0;
// //               const itemQuantity = item.current_quantity || item.quantity || 0;
// //               exchangeItemValue += itemPrice * itemQuantity;
// //             }
// //           }
// //           // === OPTIMIZE LINE ITEM PROCESSING - END ===
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

// // function mergeStats(existing: OrderStats, newStats: OrderStats): OrderStats {
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

// // function mergeEventSummaries(a: EventSummary | null, b: EventSummary | null): EventSummary | null {
// //   if (!a && !b) return null;
// //   if (!a) return b;
// //   if (!b) return a;
  
// //   return {
// //     refunds: {
// //       count: a.refunds.count + b.refunds.count,
// //       value: a.refunds.value + b.refunds.value
// //     },
// //     exchanges: {
// //       count: a.exchanges.count + b.exchanges.count,
// //       value: a.exchanges.value + b.exchanges.value
// //     },
// //     partialRefunds: {
// //       count: a.partialRefunds.count + b.partialRefunds.count,
// //       value: a.partialRefunds.value + b.partialRefunds.value
// //     },
// //     totalEvents: a.totalEvents + b.totalEvents,
// //     netValue: a.netValue + b.netValue
// //   };
// // }

// // // ==================== 8.0 CUSTOMER TRACKING LOGIC ====================

// // function buildCustomerOrderMap(allOrders: any[], shopTimeZone: string) {
// //   const customerOrderMap: Record<string, Date[]> = {};
  
// //   // Use for loop instead of forEach for better performance
// //   for (let i = 0; i < allOrders.length; i++) {
// //     const order = allOrders[i];
// //     const custId = order?.customer?.id;
    
// //     // Skip orders without customer IDs faster
// //     if (custId === undefined || custId === null) continue;
    
// //     const customerId = custId.toString();
    
// //     // Initialize array only when needed
// //     if (!customerOrderMap[customerId]) {
// //       customerOrderMap[customerId] = [];
// //     }
    
// //     // Push date directly without creating new Date object unless needed elsewhere
// //     customerOrderMap[customerId].push(new Date(order.created_at));
// //   }
  
// //   return customerOrderMap;
// // }

// // function analyzeCustomerBehavior(
// //   customerOrderMap: Record<string, Date[]>, 
// //   shopTimeZone: string,
// //   periodKeys: string[],
// //   periodType: 'daily' | 'weekly' | 'monthly'
// // ): Record<string, CustomerData> {
// //   const periodAnalytics: Record<string, CustomerData> = {};
  
// //   // Pre-initialize all period keys
// //   for (const key of periodKeys) {
// //     periodAnalytics[key] = { newCustomers: 0, repeatedCustomers: 0, totalCustomers: 0 };
// //   }

// //   const customerIds = Object.keys(customerOrderMap);
  
// //   // Process customers in batches
// //   for (let i = 0; i < customerIds.length; i++) {
// //     const customerId = customerIds[i];
// //     const orderDates = customerOrderMap[customerId];
// //     if (orderDates.length === 0) continue;
    
// //     // Find first order date efficiently
// //     let firstOrderDate = orderDates[0];
// //     for (let j = 1; j < orderDates.length; j++) {
// //       if (orderDates[j] < firstOrderDate) {
// //         firstOrderDate = orderDates[j];
// //       }
// //     }
    
// //     let firstOrderKey: string;
// //     if (periodType === 'daily') {
// //       firstOrderKey = firstOrderDate.toLocaleDateString("en-CA", { timeZone: shopTimeZone });
// //     } else if (periodType === 'monthly') {
// //       firstOrderKey = firstOrderDate.toLocaleString("default", { month: "short", year: "numeric", timeZone: shopTimeZone });
// //     } else {
// //       const firstOrderMonday = new Date(firstOrderDate);
// //       firstOrderMonday.setDate(firstOrderDate.getDate() - ((firstOrderDate.getDay() + 6) % 7));
// //       firstOrderKey = `Week of ${firstOrderMonday.toLocaleDateString("en-CA", { timeZone: shopTimeZone })}`;
// //     }
    
// //     // Process each order date
// //     for (let j = 0; j < orderDates.length; j++) {
// //       const orderDate = orderDates[j];
// //       let orderKey: string;
      
// //       if (periodType === 'daily') {
// //         orderKey = orderDate.toLocaleDateString("en-CA", { timeZone: shopTimeZone });
// //       } else if (periodType === 'monthly') {
// //         orderKey = orderDate.toLocaleString("default", { month: "short", year: "numeric", timeZone: shopTimeZone });
// //       } else {
// //         const orderMonday = new Date(orderDate);
// //         orderMonday.setDate(orderDate.getDate() - ((orderDate.getDay() + 6) % 7));
// //         orderKey = `Week of ${orderMonday.toLocaleDateString("en-CA", { timeZone: shopTimeZone })}`;
// //       }
      
// //       if (periodAnalytics[orderKey]) {
// //         if (firstOrderKey === orderKey) {
// //           periodAnalytics[orderKey].newCustomers++;
// //         } else {
// //           periodAnalytics[orderKey].repeatedCustomers++;
// //         }
        
// //         periodAnalytics[orderKey].totalCustomers++;
// //       }
// //     }
// //   }
  
// //   return periodAnalytics;
// // }

// // function calculateOverallCustomerData(customerOrderMap: Record<string, Date[]>): CustomerData {
// //   const customers = Object.values(customerOrderMap);
// //   const totalCustomers = customers.length;
  
// //   let newCustomers = 0;
// //   let repeatedCustomers = 0;

// //   customers.forEach(orderDates => {
// //     if (orderDates.length === 1) {
// //       newCustomers++;
// //     } else {
// //       repeatedCustomers++;
// //     }
// //   });

// //   return {
// //     newCustomers,
// //     repeatedCustomers,
// //     totalCustomers,
// //   };
// // }

// // // ==================== 9.0 LOADER FUNCTION ====================
// // export const loader = async ({ request }: LoaderFunctionArgs) => {
// //   let cacheUsed = false;
// //   let apiSuccess = false;
// //   let fetchMode: "incremental" | "full" = "full";
// //   let cacheHit = false;
// //   let fallbackUsed = false;

// //   const loaderStartTime = performance.now();
// //   let cacheOperationTime = 0;

// //   try {
// //     const { session } = await authenticate.admin(request);
// //     const shop = session.shop;
// //     const accessToken = session.accessToken!;

// //     // Get shop info
// //     const shopRes = await fetch(`https://${shop}/admin/api/${SHOPIFY_API_VERSION}/shop.json`, {     
// //       headers: { "X-Shopify-Access-Token": accessToken },
// //     });
    
// //     if (!shopRes.ok) throw new Error(`Failed to fetch shop info: ${shopRes.status}`);
    
// //     const shopData = await shopRes.json();
// //     const shopTimeZone = shopData.shop.iana_timezone || "UTC";
// //     const shopCurrency = shopData.shop.currency || "USD";

// //     // Initialize time ranges
// //     const monthRanges = getMonthRanges(shopTimeZone);
// //     const dailyKeys = getLastNDays(7, shopTimeZone);
// //     const weeklyKeys = getLast8Weeks(shopTimeZone);

// //     // Initialize stats
// //     const initStats = (): OrderStats => ({
// //       total: 0,
// //       discounts: 0,
// //       returns: 0,
// //       netSales: 0,
// //       shipping: 0,
// //       taxes: 0,
// //       extraFees: 0,
// //       totalSales: 0,
// //       shippingRefunds: 0,
// //       netReturns: 0,
// //       totalRefund: 0,
// //       items: 0,
// //       fulfilled: 0,
// //       unfulfilled: 0,
// //       orderCount: 0,
// //       discountsReturned: 0,
// //       netDiscounts: 0,
// //       returnShippingCharges: 0,
// //       restockingFees: 0,
// //       returnFees: 0,
// //       refundDiscrepancy: 0,
// //       hasSubsequentEvents: false,
// //       eventSummary: null,
// //       refundsCount: 0,
// //       financialStatus: 'pending'
// //     });

// //     // Initialize data structures
// //     const totals: Record<string, OrderStats> = {};
// //     const dailyTotals: Record<string, OrderStats & CustomerData> = {};
// //     const weeklyTotals: Record<string, OrderStats & CustomerData> = {};
// //     const monthlyTotals: Record<string, OrderStats & CustomerData> = {};

// //     monthRanges.forEach((r) => {
// //       totals[r.key] = initStats();
// //       monthlyTotals[r.key] = { ...initStats(), newCustomers: 0, repeatedCustomers: 0, totalCustomers: 0 };
// //     });
// //     dailyKeys.forEach((d) => (dailyTotals[d] = { ...initStats(), newCustomers: 0, repeatedCustomers: 0, totalCustomers: 0 }));
// //     weeklyKeys.forEach((w) => (weeklyTotals[w] = { ...initStats(), newCustomers: 0, repeatedCustomers: 0, totalCustomers: 0 }));

// //     const ordersKey = makeCacheKey(shop, "orders");
// //     const cacheStartTime = performance.now();
// //     const cacheEntry = await cacheManager.get<{ orders: any[]; lastUpdatedAt?: string }>(ordersKey);
    
// //     console.log('🔍 CACHE DEBUG:', {
// //       hasCache: !!cacheEntry,
// //       cacheTimestamp: cacheEntry?.value.lastUpdatedAt,
// //       cachedOrdersCount: cacheEntry?.value.orders?.length,
// //       currentTime: new Date().toISOString()
// //     });
    
// //     cacheOperationTime = performance.now() - cacheStartTime;

// //     // === ADD PERIODIC CACHE CLEANING - START ===
// //     // Clean expired cache entries every 10th request or if cache health is poor
// //     const cacheHealth = cacheManager.healthReport();
// //     const shouldClean = cacheHealth.health < 0.7 || Math.random() < 0.1; // 10% chance
    
// //     if (shouldClean) {
// //       console.log('🔄 Running periodic cache cleaning...');
// //       const cleanedCount = await cacheManager.cleanAllExpired();
// //       if (cleanedCount > 0) {
// //         console.log(`✅ Periodic cleaning completed: ${cleanedCount} entries removed`);
// //       }
      
// //       // Also enforce size limits
// //       await cacheManager.enforceSizeLimit(50);
// //       console.log('📦 Cache size limits enforced');
// //     }
// //     // === ADD PERIODIC CACHE CLEANING - END ===

// //     let allOrders: any[] = [];

// //     try {
// //       if (cacheEntry && cacheEntry.value.lastUpdatedAt) {
// //         cacheUsed = true;
// //         cacheHit = true;
// //         fetchMode = "incremental";

// //         const apiStart = performance.now();
// //         const result = await fetchOrdersSince(shop, accessToken, cacheEntry.value.lastUpdatedAt, cacheEntry.value.orders);
// //         const apiTime = performance.now() - apiStart;
        
// //         console.log(`📡 INCREMENTAL API TIME: ${apiTime.toFixed(2)}ms - Found ${result.orders.length} new/updated orders`);
        
// //         if (result.orders.length > 0) {
// //           apiSuccess = true;
// //           // Merge new orders with cached orders
// //           const orderMap = new Map();
// //           cacheEntry.value.orders.forEach((order: any) => orderMap.set(order.id, order));
// //           result.orders.forEach((order: any) => orderMap.set(order.id, order));
          
// //           allOrders = Array.from(orderMap.values());
// //           await cacheManager.set(ordersKey, { 
// //             orders: allOrders, 
// //             lastUpdatedAt: nowISO() 
// //           }, 30 * 60 * 1000);
// //         } else {
// //           // No new orders, use cached data
// //           allOrders = cacheEntry.value.orders;
// //           apiSuccess = true;
// //         }
// //       } else {
// //         fetchMode = "full";
// //       }

// //       if (fetchMode === "full") {
// //         allOrders = await fetchOrdersForPeriod(
// //           shop,
// //           accessToken,
// //           monthRanges[0].start,
// //           monthRanges[monthRanges.length - 1].end
// //         );
// //         apiSuccess = true;
// //         await cacheManager.set(ordersKey, { 
// //           orders: allOrders, 
// //           lastUpdatedAt: nowISO() 
// //         }, 30 * 60 * 1000);
// //       }

// //     } catch (error) {
// //       if (cacheEntry && cacheEntry.value.orders) {
// //         allOrders = cacheEntry.value.orders;
// //         apiSuccess = true;
// //         fallbackUsed = true;
// //       } else {
// //         await cacheManager.remove(ordersKey);
// //         throw error;
// //       }
// //     }

// //     // === ADD DETAILED TIMING - START ===
// //     const timing = {
// //       customerAnalysis: 0,
// //       orderProcessing: 0,
// //       calculations: 0
// //     };

// //     // Process orders - with timing
// //     const customerStart = performance.now();
// //     const customerOrderMap = buildCustomerOrderMap(allOrders, shopTimeZone);
// //     const dailyCustomerAnalytics = analyzeCustomerBehavior(customerOrderMap, shopTimeZone, dailyKeys, 'daily');
// //     const weeklyCustomerAnalytics = analyzeCustomerBehavior(customerOrderMap, shopTimeZone, weeklyKeys, 'weekly');
// //     const monthlyCustomerAnalytics = analyzeCustomerBehavior(customerOrderMap, shopTimeZone, monthRanges.map(r => r.key), 'monthly');
// //     timing.customerAnalysis = performance.now() - customerStart;

// //     const orderProcessStart = performance.now();
    
// //     // Process orders in smaller batches for better performance
// //     const BATCH_SIZE = 500;
// //     let processedCount = 0;
    
// //     for (let i = 0; i < allOrders.length; i += BATCH_SIZE) {
// //       const batch = allOrders.slice(i, i + BATCH_SIZE);
      
// //       batch.forEach((order: any) => {
// //         const date = new Date(order.created_at);
// //         const monthKey = date.toLocaleString("default", { month: "short", year: "numeric", timeZone: shopTimeZone });
// //         const dayKey = date.toLocaleDateString("en-CA", { timeZone: shopTimeZone });
        
// //         const monday = new Date(date);
// //         monday.setDate(date.getDate() - ((date.getDay() + 6) % 7));
// //         const weekKey = `Week of ${monday.toLocaleDateString("en-CA", { timeZone: shopTimeZone })}`;

// //         const orderStats = processOrderToStats(order);

// //         if (totals[monthKey]) {
// //           totals[monthKey] = mergeStats(totals[monthKey], orderStats);
// //         }

// //         if (dailyTotals[dayKey]) {
// //           dailyTotals[dayKey] = {
// //             ...mergeStats(dailyTotals[dayKey], orderStats),
// //             newCustomers: dailyCustomerAnalytics[dayKey]?.newCustomers || 0,
// //             repeatedCustomers: dailyCustomerAnalytics[dayKey]?.repeatedCustomers || 0,
// //             totalCustomers: dailyCustomerAnalytics[dayKey]?.totalCustomers || 0
// //           };
// //         }

// //         if (weeklyTotals[weekKey]) {
// //           weeklyTotals[weekKey] = {
// //             ...mergeStats(weeklyTotals[weekKey], orderStats),
// //             newCustomers: weeklyCustomerAnalytics[weekKey]?.newCustomers || 0,
// //             repeatedCustomers: weeklyCustomerAnalytics[weekKey]?.repeatedCustomers || 0,
// //             totalCustomers: weeklyCustomerAnalytics[weekKey]?.totalCustomers || 0
// //           };
// //         }

// //         if (monthlyTotals[monthKey]) {
// //           monthlyTotals[monthKey] = {
// //             ...mergeStats(monthlyTotals[monthKey], orderStats),
// //             newCustomers: monthlyCustomerAnalytics[monthKey]?.newCustomers || 0,
// //             repeatedCustomers: monthlyCustomerAnalytics[monthKey]?.repeatedCustomers || 0,
// //             totalCustomers: monthlyCustomerAnalytics[monthKey]?.totalCustomers || 0
// //           };
// //         }
        
// //         processedCount++;
// //       });
      
// //       // Log progress for large datasets
// //       if (allOrders.length > 1000 && processedCount % 1000 === 0) {
// //         console.log(`🔄 Processed ${processedCount}/${allOrders.length} orders (${Math.round((processedCount / allOrders.length) * 100)}%)`);
// //       }
// //     }
    
// //     timing.orderProcessing = performance.now() - orderProcessStart;

// //     const calculationsStart = performance.now();
// //     const totalCustomerData = calculateOverallCustomerData(customerOrderMap);
// //     timing.calculations = performance.now() - calculationsStart;

// //     // Log detailed timing
// //     console.log('⏱️ DETAILED PROCESSING TIMING:');
// //     console.log(`   👥 Customer Analysis: ${timing.customerAnalysis.toFixed(2)}ms`);
// //     console.log(`   📊 Order Processing: ${timing.orderProcessing.toFixed(2)}ms`);
// //     console.log(`   🧮 Final Calculations: ${timing.calculations.toFixed(2)}ms`);
// //     console.log(`   📦 Total Orders Processed: ${allOrders.length}`);
// //     // === ADD DETAILED TIMING - END ===

// //     const totalLoaderTime = performance.now() - loaderStartTime;
// //     const cachePerformance = cacheManager.getPerformanceReport();
    
// //     console.log('🚀 CACHE PERFORMANCE REPORT:', {
// //       totalLoaderTime: parseFloat(totalLoaderTime.toFixed(2)),
// //       cacheOperationTime: parseFloat(cacheOperationTime.toFixed(2)),
// //       cacheUsed,
// //       cacheHit,
// //       fetchMode,
// //       cachePerformance,
// //       cacheHealth: cacheManager.healthReport(),
// //       ordersCount: allOrders.length
// //     });
// //     // === ADD PERFORMANCE LOGGING - END ===

// //     const result: CachedAnalyticsData = {
// //       shop,
// //       totals,
// //       dailyTotals,
// //       weeklyTotals,
// //       monthlyTotals,
// //       totalOrders: allOrders.length,
// //       totalCustomerData,
// //       monthRanges: monthRanges.map((r) => r.key),
// //       dailyKeys,
// //       weeklyKeys,
// //       lastUpdated: new Date().toISOString(),
// //       shopTimeZone,
// //       shopCurrency,
// //       _cacheInfo: {
// //         fetchMode,
// //         apiSuccess,
// //         cacheHealth: cacheManager.healthReport(),
// //         cacheStats: cacheManager.getStats(),
// //         cacheUsed,
// //         cacheHit,
// //         fallbackUsed,
// //         cacheTimestamp: cacheEntry?.timestamp,
// //         // === ADD PERFORMANCE INFO - START ===
// //         performance: {
// //           cacheOperationTime: parseFloat(cacheOperationTime.toFixed(2)),
// //           totalLoaderTime: parseFloat(totalLoaderTime.toFixed(2))
// //         }
// //         // === ADD PERFORMANCE INFO - END ===
// //       }
// //     };

// //     return json(result);
    
// //   } catch (error: unknown) {
// //     const errorMsg = `Loader error: ${error instanceof Error ? error.message : 'Unknown error'}`;
    
// //     return json({ 
// //       shop: "unknown", 
// //       error: errorMsg,
// //       userMessage: "Sorry for the inconvenience! Please try refreshing the page.",
// //       timestamp: new Date().toISOString()
// //     });
// //   }
// // };

// // // ==================== 10.0 PDF EXPORT FUNCTIONALITY ====================

// // const generatePDFReport = (data: OrderData) => {
// //   const printWindow = window.open('', '_blank');
// //   if (!printWindow) return;

// //   const timestamp = new Date().toLocaleDateString();
// //   const time = new Date().toLocaleTimeString();
  
// //   // Safely get the event data with fallbacks
// //   const totalRefunds = data.totalRefunds || 0;
// //   const totalExchanges = data.totalExchanges || 0;
// //   const netEventValue = data.netEventValue || 0;
  
// //   const pdfContent = `
// //     <!DOCTYPE html>
// //     <html>
// //     <head>
// //       <title>Orders Dashboard Report</title>
// //       <style>
// //         .currency-value::before {
// //           content: '${data.shopCurrency === 'EUR' ? '€' : data.shopCurrency === 'GBP' ? '£' : data.shopCurrency === 'CAD' ? 'C$' : data.shopCurrency === 'AUD' ? 'A$' : data.shopCurrency === 'JPY' ? '¥' : '$'}';
// //         }
// //         body { 
// //           font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; 
// //           margin: 40px; 
// //           color: #333;
// //           line-height: 1.4;
// //         }
// //         .header { 
// //           text-align: center; 
// //           border-bottom: 3px solid #2c3e50; 
// //           padding-bottom: 25px; 
// //           margin-bottom: 35px; 
// //           background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
// //           color: white;
// //           padding: 30px;
// //           margin: -40px -40px 35px -40px;
// //           border-radius: 0 0 20px 20px;
// //         }
// //         .header h1 { 
// //           margin: 0; 
// //           color: white;
// //           font-size: 2.2em;
// //           font-weight: 700;
// //         }
// //         .header .date { 
// //           color: rgba(255,255,255,0.9); 
// //           margin-top: 8px;
// //           font-size: 1.1em;
// //         }
// //         .section { 
// //           margin-bottom: 40px; 
// //           break-inside: avoid;
// //           background: white;
// //           padding: 25px;
// //           border-radius: 12px;
// //           box-shadow: 0 2px 10px rgba(0,0,0,0.08);
// //           border-left: 4px solid #3498db;
// //         }
// //         .section h2 { 
// //           color: #2c3e50; 
// //           border-bottom: 2px solid #ecf0f1; 
// //           padding-bottom: 12px; 
// //           margin-bottom: 20px;
// //           font-size: 1.4em;
// //         }
// //         .metrics-grid { 
// //           display: grid; 
// //           grid-template-columns: repeat(3, 1fr); 
// //           gap: 25px; 
// //           margin: 25px 0; 
// //         }
// //         .metric-card { 
// //           background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
// //           padding: 25px; 
// //           border-radius: 10px; 
// //           text-align: center; 
// //           border-left: 4px solid #3498db;
// //           transition: all 0.3s ease;
// //         }
// //         .metric-card:hover {
// //           transform: translateY(-2px);
// //           box-shadow: 0 5px 15px rgba(0,0,0,0.1);
// //         }
// //         .metric-value { 
// //           font-size: 2em; 
// //           font-weight: bold; 
// //           color: #2c3e50; 
// //           margin-bottom: 8px;
// //         }
// //         .metric-label { 
// //           color: #666; 
// //           margin-top: 8px;
// //           font-weight: 600;
// //         }
// //         .growth-indicator {
// //           display: flex;
// //           align-items: center;
// //           justify-content: center;
// //           gap: 5px;
// //           font-size: 0.9em;
// //           font-weight: 600;
// //           margin-top: 10px;
// //           padding: 4px 12px;
// //           border-radius: 20px;
// //           width: fit-content;
// //           margin: 10px auto 0;
// //         }
// //         .growth-positive {
// //           background: #d4edda;
// //           color: #155724;
// //           border: 1px solid #c3e6cb;
// //         }
// //         .growth-negative {
// //           background: #f8d7da;
// //           color: #721c24;
// //           border: 1px solid #f5c6cb;
// //         }
// //         .growth-arrow {
// //           font-weight: bold;
// //         }
// //         .financial-grid { 
// //           display: grid; 
// //           grid-template-columns: repeat(2, 1fr); 
// //           gap: 20px; 
// //         }
// //         .financial-card { 
// //           background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
// //           padding: 20px; 
// //           border-radius: 8px; 
// //           border-left: 4px solid #27ae60;
// //           transition: all 0.3s ease;
// //         }
// //         .financial-card:hover {
// //           transform: translateY(-2px);
// //           box-shadow: 0 5px 15px rgba(0,0,0,0.1);
// //         }
// //         .financial-value { 
// //           font-size: 1.5em; 
// //           font-weight: bold; 
// //           color: #2c3e50; 
// //         }
// //         .financial-label { 
// //           color: #666; 
// //           font-size: 0.9em;
// //           font-weight: 600;
// //         }
// //         .summary-table { 
// //           width: 100%; 
// //           border-collapse: collapse; 
// //           margin: 20px 0; 
// //           box-shadow: 0 1px 3px rgba(0,0,0,0.1);
// //         }
// //         .summary-table th, .summary-table td { 
// //           padding: 15px; 
// //           text-align: left; 
// //           border-bottom: 1px solid #ddd; 
// //         }
// //         .summary-table th { 
// //           background: #f8f9fa; 
// //           font-weight: bold;
// //           color: #2c3e50;
// //         }
// //         .positive { color: #27ae60; }
// //         .negative { color: #e74c3c; }
// //         .footer { 
// //           margin-top: 50px; 
// //           padding-top: 25px; 
// //           border-top: 2px solid #ddd; 
// //           text-align: center; 
// //           color: #666;
// //           font-size: 0.9em;
// //         }
// //         @media print { 
// //           body { margin: 20px; } 
// //           .metric-card, .financial-card { break-inside: avoid; }
// //           .section { break-inside: avoid; page-break-inside: avoid; }
// //           .header { margin: -20px -20px 25px -20px; }
// //         }
// //         @page {
// //           margin: 1cm;
// //           size: A4;
// //         }
// //       </style>
// //     </head>
// //     <body>
// //       <div class="header">
// //       <h1><SvgIcons.Chart /> Orders Dashboard Report</h1>
// //         <div class="date">Generated: ${timestamp} at ${time}</div>
// //         <div class="date">Store Timezone: ${data.shopTimezone}</div>
// //       </div>

// //       <div class="section">
// //       <h2><SvgIcons.TrendingUp /> Executive Summary</h2>
// //         <div class="metrics-grid">
// //           <div class="metric-card">
// //             <div class="metric-value">${data.totalOrders}</div>
// //             <div class="metric-label">Total Orders</div>
// //           </div>
// //           <div class="metric-card">
// //             <div class="metric-value">${data.totalCustomers}</div>
// //             <div class="metric-label">Total Customers</div>
// //           </div>
// //           <div class="metric-card">
// //             <div class="metric-value">${data.fulfillmentRate.toFixed(1)}%</div>
// //             <div class="metric-label">Fulfillment Rate</div>
// //           </div>
// //         </div>
// //       </div>

// //       <div class="section">
// //       <h2><SvgIcons.Dollar /> Financial Overview</h2>
// //         <div class="financial-grid">
// //           <div class="financial-card">
// //             <div class="financial-value">${data.totalRevenue.toLocaleString('en-US', { style: 'currency', currency: data.shopCurrency || 'USD' })}</div>
// //             <div class="financial-label">Total Revenue</div>
// //           </div>
// //           <div class="financial-card">
// //             <div class="financial-value">${data.netRevenue.toLocaleString('en-US', { style: 'currency', currency: data.shopCurrency || 'USD' })}</div>
// //             <div class="financial-label">Net Revenue</div>
// //           </div>
// //           <div class="financial-card">
// //             <div class="financial-value">${data.averageOrderValue.toLocaleString('en-US', { style: 'currency', currency: data.shopCurrency || 'USD' })}</div>
// //             <div class="financial-label">Average Order Value</div>
// //           </div>
// //           <div class="financial-card">
// //             <div class="financial-value">${data.totalItems}</div>
// //             <div class="financial-label">Total Items Sold</div>
// //           </div>
// //         </div>
// //       </div>

// //       <div class="section">
// //         <h2><SvgIcons.Rocket /> Today's Performance</h2>
// //         <div class="metrics-grid">
// //           <div class="metric-card">
// //             <div class="metric-value">${data.todayOrders}</div>
// //             <div class="metric-label">Today's Orders</div>
// //             ${data.ordersChangeVsYesterday !== 0 ? `
// //               <div class="growth-indicator ${data.ordersChangeVsYesterday >= 0 ? 'growth-positive' : 'growth-negative'}">
// //                 <span class="growth-arrow">${data.ordersChangeVsYesterday >= 0 ? '↗' : '↘'}</span>
// //                 ${Math.abs(data.ordersChangeVsYesterday).toFixed(1)}% vs yesterday
// //               </div>
// //             ` : '<div class="growth-indicator" style="visibility: hidden;">-</div>'}
// //           </div>
// //           <div class="metric-card">
// //             <div class="metric-value">${data.todayRevenue.toLocaleString('en-US', { style: 'currency', currency: data.shopCurrency || 'USD' })}</div>
// //             <div class="metric-label">Today's Revenue</div>
// //             ${data.revenueChangeVsYesterday !== 0 ? `
// //               <div class="growth-indicator ${data.revenueChangeVsYesterday >= 0 ? 'growth-positive' : 'growth-negative'}">
// //                 <span class="growth-arrow">${data.revenueChangeVsYesterday >= 0 ? '↗' : '↘'}</span>
// //                 ${Math.abs(data.revenueChangeVsYesterday).toFixed(1)}% vs yesterday
// //               </div>
// //             ` : '<div class="growth-indicator" style="visibility: hidden;">-</div>'}
// //           </div>
// //           <div class="metric-card">
// //             <div class="metric-value">${data.todayItems}</div>
// //             <div class="metric-label">Items Ordered Today</div>
// //             ${data.itemsChangeVsYesterday !== 0 ? `
// //               <div class="growth-indicator ${data.itemsChangeVsYesterday >= 0 ? 'growth-positive' : 'growth-negative'}">
// //                 <span class="growth-arrow">${data.itemsChangeVsYesterday >= 0 ? '↗' : '↘'}</span>
// //                 ${Math.abs(data.itemsChangeVsYesterday).toFixed(1)}% vs yesterday
// //               </div>
// //             ` : '<div class="growth-indicator" style="visibility: hidden;">-</div>'}
// //           </div>
// //         </div>
// //       </div>

// //       <div class="section">
// //       <h2><SvgIcons.Users /> Customer Insights</h2>
// //         <div class="financial-grid">
// //           <div class="financial-card">
// //             <div class="financial-value">${data.newCustomers}</div>
// //             <div class="financial-label">New Customers</div>
// //           </div>
// //           <div class="financial-card">
// //             <div class="financial-value">${data.repeatCustomers}</div>
// //             <div class="financial-label">Repeat Customers</div>
// //           </div>
// //           <div class="financial-card">
// //             <div class="financial-value">${data.customerRetentionRate.toFixed(1)}%</div>
// //             <div class="financial-label">Retention Rate</div>
// //           </div>
// //           <div class="financial-card">
// //             <div class="financial-value">${data.averageOrderFrequency.toFixed(1)}</div>
// //             <div class="financial-label">Avg Order Frequency</div>
// //           </div>
// //         </div>
// //       </div>

// //     <div class="section">
// //     <h2><SvgIcons.Analytics /> Event Summary</h2>
// //   <div class="financial-grid">
// //     <div class="financial-card">
// //       <div class="financial-value">${data.totalRefunds || 0}</div>
// //       <div class="financial-label">Full Refunds</div>
// //     </div>
// //     <div class="financial-card">
// //       <div class="financial-value">${data.totalPartialRefunds || 0}</div>
// //       <div class="financial-label">Partial Refunds</div>
// //     </div>
// //     <div class="financial-card">
// //       <div class="financial-value">${data.totalExchanges || 0}</div>
// //       <div class="financial-label">Exchanges</div>
// //     </div>
// //     <div class="financial-card">
// //       <div class="financial-value">${(data.netEventValue || 0).toLocaleString('en-US', { style: 'currency', currency: data.shopCurrency || 'USD' })}</div>
// //       <div class="financial-label">Net Event Impact</div>
// //     </div>
// //   </div>
// //   <div style="text-align: center; margin-top: 16px; color: #666; font-size: 0.9em;">
// //     Across ${data.totalEvents || 0} total events in ${data.ordersWithEvents || 0} orders
// //   </div>
// // </div>

// //       <div class="footer">
// //         <p><strong>Orders Dashboard Summary Report</strong> - Key Business Metrics</p>
// //         <p>Generated by Nexus | ${timestamp}</p>
// //       </div>
// //     </body>
// //     </html>
// //   `;

// //   printWindow.document.write(pdfContent);
// //   printWindow.document.close();
  
// //   setTimeout(() => {
// //     printWindow.print();
// //     printWindow.onafterprint = () => {
// //       setTimeout(() => {
// //         printWindow.close();
// //       }, 100);
// //     };
// //   }, 1000);
// // };

// // // ==================== 11.0 ICON COMPONENTS ====================

// // const Icon = {
// //   Print: () => (
// //     <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
// //       <path d="M19 8H5c-1.66 0-3 1.34-3 3v6h4v4h12v-4h4v-6c0-1.66-1.34-3-3-3zm-3 11H8v-5h8v5zm3-7c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1zm-1-9H6v4h12V3z"/>
// //     </svg>
// //   ),
// //   TrendUp: () => (
// //     <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
// //       <path d="M16 6l2.29 2.29-4.88 4.88-4-4L2 16.59 3.41 18l6-6 4 4 6.3-6.29L22 12V6z"/>
// //     </svg>
// //   ),
// //   TrendDown: () => (
// //     <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
// //       <path d="M16 18l2.29-2.29-4.88-4.88-4 4L2 7.41 3.41 6l6 6 4-4 6.3 6.29L22 12v6z"/>
// //     </svg>
// //   ),
// //   Export: () => (
// //     <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
// //       <path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z"/>
// //     </svg>
// //   )
// // };

// // // ==================== 11.1 SVG ICONS COMPONENT ====================

// // const SvgIcons = {
// //   Chart: () => (
// //     <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
// //       <path d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z"/>
// //     </svg>
// //   ),
// //   TrendingUp: () => (
// //     <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
// //       <path d="M16 6l2.29 2.29-4.88 4.88-4-4L2 16.59 3.41 18l6-6 4 4 6.3-6.29L22 12V6z"/>
// //     </svg>
// //   ),
// //   Dollar: () => (
// //     <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
// //       <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1.41 16.09V20h-2.67v-1.93c-1.71-.36-3.16-1.46-3.27-3.4h1.96c.1 1.05.82 1.87 2.65 1.87 1.96 0 2.4-.98 2.4-1.59 0-.83-.44-1.61-2.67-2.14-2.48-.6-4.18-1.62-4.18-3.67 0-1.72 1.39-2.84 3.11-3.21V4h2.67v1.95c1.86.45 2.79 1.86 2.85 3.39H14.3c-.05-1.11-.64-1.87-2.22-1.87-1.5 0-2.4.68-2.4 1.64 0 .84.65 1.39 2.67 1.91s4.18 1.39 4.18 3.91c-.01 1.78-1.18 2.73-3.12 3.16z"/>
// //     </svg>
// //   ),
// //   Rocket: () => (
// //     <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
// //       <path d="M2.81 14.12L5.64 11.29l-1.41-1.42L1.42 12.7l1.39 1.42zM14.12 2.81L11.29 5.64l1.42 1.41 1.41-1.41-1.41-1.42zm8.03 9.91l-1.39-1.42-2.81 2.81 1.41 1.42 2.79-2.81zM7.34 12.5l4.16-4.16L12.5 7.34 8.34 11.5 7.34 12.5zM19.67 7.34l1.39-1.39c.38-.38.38-1.02 0-1.41l-1.39-1.39c-.38-.38-1.02-.38-1.41 0l-1.39 1.39 1.41 1.41 1.39-1.39zM5.63 19.67l1.39 1.39c.38.38 1.02.38 1.41 0l1.39-1.39-1.41-1.41-1.39 1.39zM3.52 15.62c-.39-.39-.39-1.02 0-1.41l1.39-1.39 1.41 1.41-1.39 1.39c-.38.38-1.02.38-1.41 0z"/>
// //     </svg>
// //   ),
// //   Users: () => (
// //     <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
// //       <path d="M16 4c0-1.11.89-2 2-2s2 .89 2 2-.89 2-2 2-2-.89-2-2zm4 18v-6h2.5l-2.54-7.63A2.01 2.01 0 0018.06 7h-.12a2 2 0 00-1.9 1.37l-.86 2.58c1.08.6 1.82 1.73 1.82 3.05v8h3zm-7.5-10.5c.83 0 1.5-.67 1.5-1.5s-.67-1.5-1.5-1.5S11 9.17 11 10s.67 1.5 1.5 1.5zM5.5 6c1.11 0 2-.89 2-2s-.89-2-2-2-2 .89-2 2 .89 2 2 2zm2 16v-7H9V9c0-1.1-.9-2-2-2H4c-1.1 0-2 .9-2 2v6h1.5v7h4zm6.5 0v-4h1v-4c0-.82-.68-1.5-1.5-1.5h-2c-.82 0-1.5.68-1.5 1.5v4h1v4h3z"/>
// //     </svg>
// //   ),
// //   Activity: () => (
// //     <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
// //       <path d="M13 7h-2v6h6v-2h-4V7zM3 3v18h18V3H3zm16 16H5V5h14v14z"/>
// //     </svg>
// //   ),
// //   Warning: () => (
// //     <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
// //       <path d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z"/>
// //     </svg>
// //   ),
// //   Analytics: () => (
// //     <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
// //       <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4z"/>
// //     </svg>
// //   )
// // };

// // // ==================== 12.0 LOADING COMPONENT ====================

// // function LoadingProgress() {
// //   const loadingSteps = [
// //     "Fetching recent orders...",
// //     "Analyzing revenue data...", 
// //     "Processing customer insights...",
// //     "Calculating fulfillment rates...",
// //     "Generating sales analytics..."
// //   ];

// //   return (
// //     <div className="loading-progress-container">
// //       <div className="loading-header">
// //         <h2>Loading Analytics Dashboard</h2>
// //         <p>Analyzing your order data and generating insights...</p>
// //       </div>
      
// //       <div className="progress-bar-container">
// //         <div className="progress-bar">
// //           <div className="progress-fill"></div>
// //         </div>
// //       </div>

// //       <div className="loading-steps">
// //         {loadingSteps.map((step, index) => (
// //           <div key={index} className="loading-step">
// //             <div className="step-indicator"></div>
// //             <div className="step-text">{step}</div>
// //           </div>
// //         ))}
// //       </div>
// //     </div>
// //   );
// // }

// // // ==================== 13.0 CHART COMPONENTS ====================

// // const ChartComponents = {
// //   formatCurrency: (amount: number, currency: string = 'USD') => {
// //     return amount.toLocaleString('en-US', { 
// //       style: 'currency', 
// //       currency: currency,
// //       minimumFractionDigits: 2 
// //     });
// //   },

// //   CustomerDistribution: ({ data }: { data: AnalyticsData }) => {
// //     const chartData = {
// //       labels: ['New Customers', 'Repeat Customers'],
// //       datasets: [
// //         {
// //           data: [data.totalCustomerData.newCustomers, data.totalCustomerData.repeatedCustomers],
// //           backgroundColor: ['#f59e0b', '#10b981'],
// //           borderWidth: 2,
// //           borderColor: '#fff'
// //         }
// //       ]
// //     };

// //     const options = {
// //       responsive: true,
// //       maintainAspectRatio: false,
// //       plugins: { legend: { display: false } },
// //       animation: { duration: 500 }
// //     };

// //     return (
// //       <div className="chart-container">
// //         <div className="chart-header">
// //           <div className="chart-title">Customer Distribution</div>
// //           <div className="chart-legend">
// //             <div className="legend-item">
// //               <div className="legend-color new"></div>
// //               <span>New</span>
// //             </div>
// //             <div className="legend-item">
// //               <div className="legend-color repeat"></div>
// //               <span>Repeat</span>
// //             </div>
// //           </div>
// //         </div>
// //         <Pie data={chartData} options={options} height={120} />
// //         <div className="mini-stats">
// //           <div className="mini-stat-card">
// //             <div className="mini-stat-value">
// //               {data.totalCustomerData.totalCustomers > 0 
// //                 ? `${((data.totalCustomerData.repeatedCustomers / data.totalCustomerData.totalCustomers) * 100).toFixed(1)}%`
// //                 : '0.0%'
// //               }
// //             </div>
// //             <div className="mini-stat-label">Repeat Rate</div>
// //           </div>
// //           <div className="mini-stat-card">
// //             <div className="mini-stat-value">{data.totalCustomerData.totalCustomers}</div>
// //             <div className="mini-stat-label">Total Customers</div>
// //           </div>
// //         </div>
// //       </div>
// //     );
// //   },

// //   RevenueTrend: ({ data }: { data: AnalyticsData }) => {
// //     const weeklyData = data.weeklyKeys.map(week => {
// //       const weekData = data.weeklyTotals[week];
// //       return {
// //         week: week.replace('Week of ', ''),
// //         revenue: weekData?.total || 0,
// //         totalSales: weekData?.totalSales || 0
// //       };
// //     });

// //     const totalRevenue = weeklyData.reduce((sum, w) => sum + w.revenue, 0);
// //     const totalSales = weeklyData.reduce((sum, w) => sum + w.totalSales, 0);
// //     const avgWeeklyRevenue = totalRevenue / weeklyData.length;

// //     const chartData = {
// //       labels: weeklyData.map(w => w.week),
// //       datasets: [
// //         {
// //           label: 'Revenue',
// //           data: weeklyData.map(w => w.revenue),
// //           borderColor: '#3b82f6',
// //           backgroundColor: 'rgba(59, 130, 246, 0.1)',
// //           tension: 0.4,
// //           fill: true,
// //           borderWidth: 2
// //         }
// //       ]
// //     };

// //     const options = {
// //       responsive: true,
// //       maintainAspectRatio: false,
// //       plugins: { legend: { display: false } },
// //       scales: {
// //         x: { grid: { display: false } },
// //         y: { 
// //           beginAtZero: true,
// //           ticks: {
// //             callback: function(this: any, value: any) {
// //               return '$' + value;
// //             }
// //           }
// //         }
// //       }
// //     };

// //     return (
// //       <div className="chart-container">
// //         <div className="chart-header">
// //           <div className="chart-title">Weekly Revenue Trend</div>
// //           <div className="chart-legend">
// //             <div className="legend-item">
// //               <div className="legend-color revenue"></div>
// //               <span>Revenue</span>
// //             </div>
// //           </div>
// //         </div>
// //         <Line data={chartData} options={options} height={120} />
// //         <div className="mini-stats">
// //           <div className="mini-stat-card">
// //             <div className="mini-stat-value">
// //               {ChartComponents.formatCurrency(totalRevenue, data.shopCurrency)}
// //             </div>
// //             <div className="mini-stat-label">Total Revenue</div>
// //           </div>
// //           <div className="mini-stat-card">
// //             <div className="mini-stat-value">
// //               {ChartComponents.formatCurrency(avgWeeklyRevenue, data.shopCurrency)}
// //             </div>
// //             <div className="mini-stat-label">Avg Weekly</div>
// //           </div>
// //           <div className="mini-stat-card">
// //             <div className="mini-stat-value">
// //               {ChartComponents.formatCurrency(totalSales, data.shopCurrency)}
// //             </div>
// //             <div className="mini-stat-label">Total Sales</div>
// //           </div>
// //         </div>
// //       </div>
// //     );
// //   },

// //   MonthlyPerformance: ({ data }: { data: AnalyticsData }) => {
// //     const monthlyData = data.monthRanges.map(month => {
// //       const monthData = data.monthlyTotals[month];
// //       return {
// //         month: month,
// //         revenue: monthData?.total || 0,
// //         orders: monthData?.orderCount || 0,
// //         totalSales: monthData?.totalSales || 0
// //       };
// //     });

// //     const totalRevenue = monthlyData.reduce((sum, m) => sum + m.revenue, 0);
// //     const totalOrders = monthlyData.reduce((sum, m) => sum + m.orders, 0);
// //     const totalSales = monthlyData.reduce((sum, m) => sum + m.totalSales, 0);
// //     const avgMonthlyRevenue = totalRevenue / monthlyData.length;

// //     const chartData = {
// //       labels: monthlyData.map(m => m.month),
// //       datasets: [
// //         {
// //           label: 'Revenue',
// //           data: monthlyData.map(m => m.revenue),
// //           backgroundColor: 'rgba(59, 130, 246, 0.8)',
// //           borderRadius: 4
// //         },
// //         {
// //           label: 'Orders',
// //           data: monthlyData.map(m => m.orders),
// //           backgroundColor: 'rgba(139, 92, 246, 0.8)',
// //           borderRadius: 4
// //         }
// //       ]
// //     };

// //     const options = {
// //       responsive: true,
// //       maintainAspectRatio: false,
// //       plugins: { legend: { display: false } },
// //       scales: {
// //         x: { grid: { display: false } },
// //         y: { beginAtZero: true }
// //       }
// //     };

// //     return (
// //       <div className="chart-container">
// //         <div className="chart-header">
// //           <div className="chart-title">Monthly Performance</div>
// //           <div className="chart-legend">
// //             <div className="legend-item">
// //               <div className="legend-color revenue"></div>
// //               <span>Revenue</span>
// //             </div>
// //             <div className="legend-item">
// //               <div className="legend-color orders"></div>
// //               <span>Orders</span>
// //             </div>
// //           </div>
// //         </div>
// //         <Bar data={chartData} options={options} height={120} />
// //         <div className="mini-stats">
// //           <div className="mini-stat-card">
// //             <div className="mini-stat-value">
// //               {ChartComponents.formatCurrency(totalRevenue, data.shopCurrency)}
// //             </div>
// //             <div className="mini-stat-label">Total Revenue</div>
// //           </div>
// //           <div className="mini-stat-card">
// //             <div className="mini-stat-value">
// //               {totalOrders}
// //             </div>
// //             <div className="mini-stat-label">Total Orders</div>
// //           </div>
// //           <div className="mini-stat-card">
// //             <div className="mini-stat-value">
// //               {ChartComponents.formatCurrency(totalSales, data.shopCurrency)}
// //             </div>
// //             <div className="mini-stat-label">Total Sales</div>
// //           </div>
// //         </div>
// //       </div>
// //     );
// //   },

// //   FinancialBreakdown: ({ data }: { data: AnalyticsData }) => {
// //     const financialData = {
// //       grossRevenue: Object.values(data.totals).reduce((sum: number, month: OrderStats) => sum + month.total, 0),
// //       netRevenue: Object.values(data.totals).reduce((sum: number, month: OrderStats) => sum + month.totalSales, 0),
// //       discounts: Object.values(data.totals).reduce((sum: number, month: OrderStats) => sum + month.discounts, 0),
// //       shipping: Object.values(data.totals).reduce((sum: number, month: OrderStats) => sum + month.shipping, 0),
// //       taxes: Object.values(data.totals).reduce((sum: number, month: OrderStats) => sum + month.taxes, 0),
// //       returns: Object.values(data.totals).reduce((sum: number, month: OrderStats) => sum + month.returns, 0)
// //     };

// //     const chartData = {
// //       labels: ['Gross Revenue', 'Discounts', 'Shipping', 'Taxes', 'Returns'],
// //       datasets: [
// //         {
// //           data: [
// //             financialData.grossRevenue,
// //             financialData.discounts,
// //             financialData.shipping,
// //             financialData.taxes,
// //             financialData.returns
// //           ],
// //           backgroundColor: ['#3b82f6', '#f59e0b', '#10b981', '#8b5cf6', '#ef4444'],
// //           borderWidth: 2,
// //           borderColor: '#fff'
// //         }
// //       ]
// //     };

// //     const options = {
// //       responsive: true,
// //       maintainAspectRatio: false,
// //       plugins: { legend: { display: false } }
// //     };

// //     return (
// //       <div className="chart-container">
// //         <div className="chart-header">
// //           <div className="chart-title">Financial Breakdown</div>
// //           <div className="chart-legend">
// //             <div className="legend-item">
// //               <div className="legend-color revenue"></div>
// //               <span>Revenue</span>
// //             </div>
// //             <div className="legend-item">
// //               <div className="legend-color discounts"></div>
// //               <span>Discounts</span>
// //             </div>
// //             <div className="legend-item">
// //               <div className="legend-color shipping"></div>
// //               <span>Shipping</span>
// //             </div>
// //             <div className="legend-item">
// //               <div className="legend-color taxes"></div>
// //               <span>Taxes</span>
// //             </div>
// //             <div className="legend-item">
// //               <div className="legend-color returns"></div>
// //               <span>Returns</span>
// //             </div>
// //           </div>
// //         </div>
// //         <Pie data={chartData} options={options} height={120} />
// //         <div className="mini-stats">
// //           <div className="mini-stat-card">
// //             <div className="mini-stat-value">
// //               {ChartComponents.formatCurrency(financialData.netRevenue, data.shopCurrency)}
// //             </div>
// //             <div className="mini-stat-label">Net Revenue</div>
// //           </div>
// //           <div className="mini-stat-card">
// //             <div className="mini-stat-value">
// //               {financialData.grossRevenue > 0 
// //                 ? `${((Math.abs(financialData.returns) / financialData.grossRevenue) * 100).toFixed(1)}%`
// //                 : '0.0%'
// //               }
// //             </div>
// //             <div className="mini-stat-label">Return Rate</div>
// //           </div>
// //         </div>
// //       </div>
// //     );
// //   }
// // };

// // // ==================== 14.0 EVENT SUMMARY COMPONENT ====================

// // function EventSummaryDisplay({ eventSummary, title }: { eventSummary: EventSummary, title: string }) {
// //   if (!eventSummary || eventSummary.totalEvents === 0) {
// //     return null;
// //   }

// //   const formatValue = (value: number) => {
// //     const absValue = Math.abs(value);
// //     const sign = value < 0 ? '-' : value > 0 ? '+' : '';
// //     return `${sign}$${absValue.toFixed(2)}`;
// //   };

// //   return (
// //     <section className="event-summary-display">
// //       <h3><SvgIcons.Analytics /> {title} ({eventSummary.totalEvents} event{eventSummary.totalEvents !== 1 ? 's' : ''})</h3>
      
// //       <div className="event-summary-grid">
// //         {/* Full Refunds */}
// //         {eventSummary.refunds.count > 0 && (
// //           <div className="event-card refunds">
// //             <div className="event-label">Full Refunds</div>
// //             <div className="event-value">{formatValue(eventSummary.refunds.value)}</div>
// //             <div className="event-count">
// //               {eventSummary.refunds.count} refund{eventSummary.refunds.count !== 1 ? 's' : ''}
// //             </div>
// //           </div>
// //         )}

// //         {/* Partial Refunds */}
// //         {eventSummary.partialRefunds.count > 0 && (
// //           <div className="event-card partial-refunds">
// //             <div className="event-label">Partial Refunds</div>
// //             <div className="event-value">{formatValue(eventSummary.partialRefunds.value)}</div>
// //             <div className="event-count">
// //               {eventSummary.partialRefunds.count} refund{eventSummary.partialRefunds.count !== 1 ? 's' : ''}
// //             </div>
// //           </div>
// //         )}

// //         {/* Exchanges */}
// //         {eventSummary.exchanges.count > 0 && (
// //           <div className="event-card exchanges">
// //             <div className="event-label">Exchanges</div>
// //             <div className="event-value">{formatValue(eventSummary.exchanges.value)}</div>
// //             <div className="event-count">
// //               {eventSummary.exchanges.count} exchange{eventSummary.exchanges.count !== 1 ? 's' : ''}
// //             </div>
// //           </div>
// //         )}

// //         {/* Net Summary */}
// //         <div className="event-card net-summary">
// //           <div className="event-label">Net Impact</div>
// //           <div className="event-value">{formatValue(eventSummary.netValue)}</div>
// //           <div className="event-count">
// //             across {eventSummary.totalEvents} event{eventSummary.totalEvents !== 1 ? 's' : ''}
// //           </div>
// //         </div>
// //       </div>
// //     </section>
// //   );
// // }

// // // ==================== 15.0 MISMATCH SUMMARY COMPONENT ====================

// // function MismatchSummaryCard({ mismatchSummary, periodType }: { 
// //   mismatchSummary: { 
// //     totalMismatches: number; 
// //     totalDifference: number; 
// //     hasMismatches: boolean; 
// //   };
// //   periodType: 'day' | 'week' | 'month';
// // }) {
// //   if (!mismatchSummary.hasMismatches) {
// //     return null;
// //   }

// //   const getPeriodLabel = () => {
// //     switch (periodType) {
// //       case 'day': return 'Days';
// //       case 'week': return 'Weeks'; 
// //       case 'month': return 'Months';
// //       default: return 'Periods';
// //     }
// //   };

// //   const getDifferenceColor = (difference: number) => {
// //     return Math.abs(difference) > 0.01 ? '#dc2626' : '#059669';
// //   };

// //   const getDifferenceText = (difference: number) => {
// //     const absDiff = Math.abs(difference);
// //     if (absDiff <= 0.01) return 'Perfect Match';
// //     return `$${absDiff.toFixed(2)}`;
// //   };

// //   return (
// //     <section className="mismatch-summary-card">
// //       <h3><SvgIcons.Warning /> Calculation Verification</h3>
      
// //       <div className="mismatch-summary-content">
// //         <div className="mismatch-metric">
// //           <div className="mismatch-value">{mismatchSummary.totalMismatches}</div>
// //           <div className="mismatch-label">{getPeriodLabel()} with Mismatches</div>
// //         </div>
        
// //         <div className="mismatch-metric">
// //           <div 
// //             className="mismatch-value" 
// //             style={{ color: getDifferenceColor(mismatchSummary.totalDifference) }}
// //           >
// //             {getDifferenceText(mismatchSummary.totalDifference)}
// //           </div>
// //           <div className="mismatch-label">Total Difference</div>
// //         </div>
// //       </div>
      
// //       <div className="mismatch-note">
// //         {mismatchSummary.totalMismatches > 0 ? (
// //           <span style={{ color: '#dc2626' }}>
// //             Found {mismatchSummary.totalMismatches} {getPeriodLabel().toLowerCase()} with calculation discrepancies
// //           </span>
// //         ) : (
// //           <span style={{ color: '#059669' }}>
// //             All calculations match perfectly!
// //           </span>
// //         )}
// //       </div>
// //     </section>
// //   );
// // }

// // // ==================== 16.0 MAIN REACT COMPONENT ====================

// // function ShopifyAnalyticsPage() {
// //   const data = useLoaderData<typeof loader>();
// //   const [isLoading, setIsLoading] = useState(true);
// //   const [isExporting, setIsExporting] = useState(false);
// //   const [isManualRefresh, setIsManualRefresh] = useState(false);

// //   const handleManualRefresh = () => {
// //     setIsManualRefresh(true);
// //     setIsLoading(true);
// //     window.location.reload();
// //   }

// //   useEffect(() => {
// //     if (data && !("error" in data)) {
// //       setIsLoading(false);
// //     }
// //   }, [data]);

// //   if (isLoading && isManualRefresh) {
// //     return (
// //       <div className="orders-dashboard">
// //         <div className="dashboard-header">
// //           <h1>Analytics Dashboard</h1>
// //         </div>
// //         <div className="loading-progress-container">
// //           <div className="loading-header">
// //             <h2>Refreshing Your Data</h2>
// //             <p>Please wait while we update your analytics...</p>
// //           </div>
          
// //           <div className="progress-bar-container">
// //             <div className="progress-bar">
// //               <div className="progress-fill"></div>
// //             </div>
// //           </div>

// //           <div className="loading-steps">
// //             {[
// //               "Refreshing order data...",
// //               "Updating revenue calculations...", 
// //               "Processing customer insights...",
// //               "Recalculating metrics...",
// //               "Finalizing your dashboard..."
// //             ].map((step, index) => (
// //               <div key={index} className="loading-step">
// //                 <div className="step-indicator"></div>
// //                 <div className="step-text">{step}</div>
// //               </div>
// //             ))}
// //           </div>
// //         </div>
// //       </div>
// //     );
// //   }

// //    if (isLoading) {
// //     return (
// //       <div className="orders-dashboard">
// //         <div className="dashboard-header">
// //           <h1>Analytics Dashboard</h1>
// //         </div>
// //         <LoadingProgress />
// //       </div>
// //     );
// //   }

// //   const getSafeData = (data: any): CachedAnalyticsData | null => {
// //     if (!data || typeof data !== 'object') return null;
    
// //     const safeData: CachedAnalyticsData = {
// //       shop: data.shop || 'unknown',
// //       totals: data.totals || {},
// //       dailyTotals: data.dailyTotals || {},
// //       weeklyTotals: data.weeklyTotals || {},
// //       monthlyTotals: data.monthlyTotals || {},
// //       totalOrders: typeof data.totalOrders === 'number' ? data.totalOrders : 0,
// //       totalCustomerData: data.totalCustomerData || { newCustomers: 0, repeatedCustomers: 0, totalCustomers: 0 },
// //       monthRanges: Array.isArray(data.monthRanges) ? data.monthRanges : [],
// //       dailyKeys: Array.isArray(data.dailyKeys) ? data.dailyKeys : [],
// //       weeklyKeys: Array.isArray(data.weeklyKeys) ? data.weeklyKeys : [],
// //       lastUpdated: data.lastUpdated || new Date().toISOString(),
// //       shopTimeZone: data.shopTimeZone || 'UTC',
// //       shopCurrency: data.shopCurrency || 'USD',
// //       _cacheInfo: data._cacheInfo || undefined
// //     };

// //     return safeData;
// //   };

// //   const safeNumber = (value: unknown) => (typeof value === "number" ? value : 0);
  
// //   const getSafeCustomerStats = (stats: Record<string, OrderStats & CustomerData>, key: string): OrderStats & CustomerData => {
// //     const stat = stats[key];
// //     if (!stat) {
// //       return {
// //         total: 0,
// //         discounts: 0,
// //         returns: 0,
// //         netSales: 0,
// //         shipping: 0,
// //         taxes: 0,
// //         extraFees: 0,
// //         totalSales: 0,
// //         shippingRefunds: 0,
// //         netReturns: 0,
// //         totalRefund: 0,
// //         items: 0,
// //         fulfilled: 0,
// //         unfulfilled: 0,
// //         orderCount: 0,
// //         hasSubsequentEvents: false,
// //         eventSummary: null,
// //         refundsCount: 0,
// //         financialStatus: 'pending',
// //         newCustomers: 0,
// //         repeatedCustomers: 0,
// //         totalCustomers: 0,
// //         discountsReturned: 0,
// //         netDiscounts: 0,
// //         returnShippingCharges: 0,
// //         restockingFees: 0,
// //         returnFees: 0,
// //         refundDiscrepancy: 0
// //       };
// //     }
// //     return stat;
// //   };

// //   const getCalculationMismatchSummary = (data: AnalyticsData) => {
// //     let totalMismatches = 0;
// //     let totalDifference = 0;

// //     Object.values(data.dailyTotals).forEach(dayData => {
// //       const calculatedTotal = dayData.netSales + dayData.shipping + dayData.taxes + dayData.extraFees;
// //       const mismatch = Math.abs(dayData.totalSales - calculatedTotal) > 0.01;
      
// //       if (mismatch) {
// //         totalMismatches++;
// //         const difference = calculatedTotal - dayData.totalSales;
// //         totalDifference += difference;
// //       }
// //     });

// //     return {
// //       totalMismatches,
// //       totalDifference: parseFloat(totalDifference.toFixed(2)),
// //       hasMismatches: totalMismatches > 0
// //     };
// //   };

// //   const getTodayMismatchSummary = (data: AnalyticsData) => {
// //     const todayKey = new Date().toLocaleDateString("en-CA", { timeZone: data.shopTimeZone });
// //     const todayData = getSafeCustomerStats(data.dailyTotals, todayKey);
    
// //     const calculatedTotal = todayData.netSales + todayData.shipping + todayData.taxes + todayData.extraFees;
// //     const mismatch = Math.abs(todayData.totalSales - calculatedTotal) > 0.01;
    
// //     return {
// //       totalMismatches: mismatch ? 1 : 0,
// //       totalDifference: mismatch ? (calculatedTotal - todayData.totalSales) : 0,
// //       hasMismatches: mismatch
// //     };
// //   };

// //   const getWeeklyMismatchSummary = (data: AnalyticsData) => {
// //     let totalMismatches = 0;
// //     let totalDifference = 0;

// //     Object.values(data.weeklyTotals).forEach(weekData => {
// //       const calculatedTotal = weekData.netSales + weekData.shipping + weekData.taxes + weekData.extraFees;
// //       const mismatch = Math.abs(weekData.totalSales - calculatedTotal) > 0.01;
      
// //       if (mismatch) {
// //         totalMismatches++;
// //         totalDifference += (calculatedTotal - weekData.totalSales);
// //       }
// //     });

// //     return {
// //       totalMismatches,
// //       totalDifference: parseFloat(totalDifference.toFixed(2)),
// //       hasMismatches: totalMismatches > 0
// //     };
// //   };

// //   const getMonthlyMismatchSummary = (data: AnalyticsData) => {
// //     let totalMismatches = 0;
// //     let totalDifference = 0;

// //     Object.values(data.monthlyTotals).forEach(monthData => {
// //       const calculatedTotal = monthData.netSales + monthData.shipping + monthData.taxes + monthData.extraFees;
// //       const mismatch = Math.abs(monthData.totalSales - calculatedTotal) > 0.01;
      
// //       if (mismatch) {
// //         totalMismatches++;
// //         totalDifference += (calculatedTotal - monthData.totalSales);
// //       }
// //     });

// //     return {
// //       totalMismatches,
// //       totalDifference: parseFloat(totalDifference.toFixed(2)),
// //       hasMismatches: totalMismatches > 0
// //     };
// //   };

// //   const getTodayData = () => {
// //     const safeData = getSafeData(data);
// //     if (!safeData) return null;
    
// //     const todayKey = new Date().toLocaleDateString("en-CA", { timeZone: safeData.shopTimeZone });
// //     const todayData = getSafeCustomerStats(safeData.dailyTotals, todayKey);
    
// //     return {
// //       ...todayData,
// //       ordersWithSubsequentEvents: todayData.hasSubsequentEvents ? 1 : 0,
// //       subsequentEventsCount: todayData.eventSummary?.totalEvents || 0,
// //       subsequentEventsValue: todayData.eventSummary ? Math.abs(todayData.eventSummary.netValue) : 0
// //     };
// //   };

// //   const getLast7DaysData = () => {
// //     const safeData = getSafeData(data);
// //     if (!safeData) return null;

// //     let totalRevenue = 0;
// //     let totalOrders = 0;
// //     let totalItems = 0;
// //     let totalNewCustomers = 0;
// //     let totalRepeatCustomers = 0;
// //     let totalFulfilled = 0;
// //     let totalUnfulfilled = 0;
// //     let totalDiscounts = 0;
// //     let totalReturns = 0;
// //     let totalNetSales = 0;
// //     let totalShipping = 0;
// //     let totalTaxes = 0;
// //     let totalExtraFees = 0;
// //     let totalTotalSales = 0;
// //     let totalShippingRefunds = 0;
// //     let totalNetReturns = 0;
// //     let totalTotalRefund = 0;

// //     const periodEventSummary: EventSummary = {
// //       refunds: { count: 0, value: 0 },
// //       exchanges: { count: 0, value: 0 },
// //       partialRefunds: { count: 0, value: 0 },
// //       totalEvents: 0,
// //       netValue: 0
// //     };

// //     let ordersWithEventsCount = 0;
// //     let totalEventsValue = 0;

// //     safeData.dailyKeys.forEach(day => {
// //       const dayData = getSafeCustomerStats(safeData.dailyTotals, day);
// //       totalRevenue += dayData.total;
// //       totalOrders += dayData.orderCount;
// //       totalItems += dayData.items;
// //       totalNewCustomers += dayData.newCustomers;
// //       totalRepeatCustomers += dayData.repeatedCustomers;
// //       totalFulfilled += dayData.fulfilled;
// //       totalUnfulfilled += dayData.unfulfilled;
// //       totalDiscounts += dayData.discounts;
// //       totalReturns += dayData.returns;
// //       totalNetSales += dayData.netSales;
// //       totalShipping += dayData.shipping;
// //       totalTaxes += dayData.taxes;
// //       totalExtraFees += dayData.extraFees;
// //       totalTotalSales += dayData.totalSales;
// //       totalShippingRefunds += dayData.shippingRefunds;
// //       totalNetReturns += dayData.netReturns;
// //       totalTotalRefund += dayData.totalRefund;
      
// //       if (dayData.eventSummary) {
// //         ordersWithEventsCount += dayData.hasSubsequentEvents ? 1 : 0;
        
// //         periodEventSummary.refunds.count += dayData.eventSummary.refunds.count;
// //         periodEventSummary.refunds.value += dayData.eventSummary.refunds.value;
// //         periodEventSummary.exchanges.count += dayData.eventSummary.exchanges.count;
// //         periodEventSummary.exchanges.value += dayData.eventSummary.exchanges.value;
// //         periodEventSummary.partialRefunds.count += dayData.eventSummary.partialRefunds.count;
// //         periodEventSummary.partialRefunds.value += dayData.eventSummary.partialRefunds.value;
// //         periodEventSummary.totalEvents += dayData.eventSummary.totalEvents;
// //         periodEventSummary.netValue += dayData.eventSummary.netValue;

// //         totalEventsValue += Math.abs(dayData.eventSummary.netValue);
// //       }
// //     });

// //     return {
// //       totalRevenue,
// //       totalOrders,
// //       totalItems,
// //       totalNewCustomers,
// //       totalRepeatCustomers,
// //       totalFulfilled,
// //       totalUnfulfilled,
// //       totalDiscounts,
// //       totalReturns,
// //       totalNetSales,
// //       totalShipping,
// //       totalTaxes,
// //       totalExtraFees,
// //       totalTotalSales,
// //       totalShippingRefunds,
// //       totalNetReturns,
// //       totalTotalRefund,
// //       eventSummary: periodEventSummary,
// //       ordersWithSubsequentEvents: ordersWithEventsCount,
// //       subsequentEventsCount: periodEventSummary.totalEvents,
// //       subsequentEventsValue: parseFloat(totalEventsValue.toFixed(2)),
// //       avgDailyRevenue: totalRevenue / 7,
// //       discountRate: totalRevenue > 0 ? (totalDiscounts / totalRevenue) * 100 : 0,
// //       shippingRate: totalRevenue > 0 ? (totalShipping / totalRevenue) * 100 : 0,
// //       taxRate: totalRevenue > 0 ? (totalTaxes / totalRevenue) * 100 : 0,
// //       returnRate: totalRevenue > 0 ? (totalReturns / totalRevenue) * 100 : 0
// //     };
// //   };

// //   const getWeeklyFinancials = () => {
// //     const safeData = getSafeData(data);
// //     if (!safeData) return null;

// //     let totalRevenue = 0;
// //     let totalOrders = 0;
// //     let totalItems = 0;
// //     let totalDiscounts = 0;
// //     let totalReturns = 0;
// //     let totalNetSales = 0;
// //     let totalShipping = 0;
// //     let totalTaxes = 0;
// //     let totalExtraFees = 0;
// //     let totalTotalSales = 0;
// //     let totalShippingRefunds = 0;
// //     let totalNetReturns = 0;
// //     let totalTotalRefund = 0;

// //     const periodEventSummary: EventSummary = {
// //       refunds: { count: 0, value: 0 },
// //       exchanges: { count: 0, value: 0 },
// //       partialRefunds: { count: 0, value: 0 },
// //       totalEvents: 0,
// //       netValue: 0
// //     };

// //     let ordersWithEventsCount = 0;
// //     let totalEventsValue = 0;

// //     safeData.weeklyKeys.forEach(week => {
// //       const weekData = getSafeCustomerStats(safeData.weeklyTotals, week);
// //       totalRevenue += weekData.total;
// //       totalOrders += weekData.orderCount;
// //       totalItems += weekData.items;
// //       totalDiscounts += weekData.discounts;
// //       totalReturns += weekData.returns;
// //       totalNetSales += weekData.netSales;
// //       totalShipping += weekData.shipping;
// //       totalTaxes += weekData.taxes;
// //       totalExtraFees += weekData.extraFees;
// //       totalTotalSales += weekData.totalSales;
// //       totalShippingRefunds += weekData.shippingRefunds;
// //       totalNetReturns += weekData.netReturns;
// //       totalTotalRefund += weekData.totalRefund;
      
// //       if (weekData.eventSummary) {
// //         ordersWithEventsCount += weekData.hasSubsequentEvents ? 1 : 0;
        
// //         periodEventSummary.refunds.count += weekData.eventSummary.refunds.count;
// //         periodEventSummary.refunds.value += weekData.eventSummary.refunds.value;
// //         periodEventSummary.exchanges.count += weekData.eventSummary.exchanges.count;
// //         periodEventSummary.exchanges.value += weekData.eventSummary.exchanges.value;
// //         periodEventSummary.partialRefunds.count += weekData.eventSummary.partialRefunds.count;
// //         periodEventSummary.partialRefunds.value += weekData.eventSummary.partialRefunds.value;
// //         periodEventSummary.totalEvents += weekData.eventSummary.totalEvents;
// //         periodEventSummary.netValue += weekData.eventSummary.netValue;

// //         totalEventsValue += Math.abs(weekData.eventSummary.netValue);
// //       }
// //     });

// //     return {
// //       totalRevenue,
// //       totalOrders,
// //       totalItems,
// //       totalDiscounts,
// //       totalReturns,
// //       totalNetSales,
// //       totalShipping,
// //       totalTaxes,
// //       totalExtraFees,
// //       totalTotalSales,
// //       totalShippingRefunds,
// //       totalNetReturns,
// //       totalTotalRefund,
// //       eventSummary: periodEventSummary,
// //       ordersWithSubsequentEvents: ordersWithEventsCount,
// //       subsequentEventsCount: periodEventSummary.totalEvents,
// //       subsequentEventsValue: parseFloat(totalEventsValue.toFixed(2)),
// //       netRevenue: totalTotalSales,
// //       discountRate: totalRevenue > 0 ? (totalDiscounts / totalRevenue) * 100 : 0,
// //       shippingRate: totalRevenue > 0 ? (totalShipping / totalRevenue) * 100 : 0,
// //       taxRate: totalRevenue > 0 ? (totalTaxes / totalRevenue) * 100 : 0,
// //       returnRate: totalRevenue > 0 ? (totalReturns / totalRevenue) * 100 : 0
// //     };
// //   };

// //   const getMonthlyFinancials = () => {
// //     const safeData = getSafeData(data);
// //     if (!safeData) return null;

// //     let totalRevenue = 0;
// //     let totalOrders = 0;
// //     let totalItems = 0;
// //     let totalDiscounts = 0;
// //     let totalReturns = 0;
// //     let totalNetSales = 0;
// //     let totalShipping = 0;
// //     let totalTaxes = 0;
// //     let totalExtraFees = 0;
// //     let totalTotalSales = 0;
// //     let totalShippingRefunds = 0;
// //     let totalNetReturns = 0;
// //     let totalTotalRefund = 0;

// //     const periodEventSummary: EventSummary = {
// //       refunds: { count: 0, value: 0 },
// //       exchanges: { count: 0, value: 0 },
// //       partialRefunds: { count: 0, value: 0 },
// //       totalEvents: 0,
// //       netValue: 0
// //     };

// //     let ordersWithEventsCount = 0;
// //     let totalEventsValue = 0;

// //     safeData.monthRanges.forEach(month => {
// //       const monthData = getSafeCustomerStats(safeData.monthlyTotals, month);
// //       totalRevenue += monthData.total;
// //       totalOrders += monthData.orderCount;
// //       totalItems += monthData.items;
// //       totalDiscounts += monthData.discounts;
// //       totalReturns += monthData.returns;
// //       totalNetSales += monthData.netSales;
// //       totalShipping += monthData.shipping;
// //       totalTaxes += monthData.taxes;
// //       totalExtraFees += monthData.extraFees;
// //       totalTotalSales += monthData.totalSales;
// //       totalShippingRefunds += monthData.shippingRefunds;
// //       totalNetReturns += monthData.netReturns;
// //       totalTotalRefund += monthData.totalRefund;
      
// //       if (monthData.eventSummary) {
// //         ordersWithEventsCount += monthData.hasSubsequentEvents ? 1 : 0;
        
// //         periodEventSummary.refunds.count += monthData.eventSummary.refunds.count;
// //         periodEventSummary.refunds.value += monthData.eventSummary.refunds.value;
// //         periodEventSummary.exchanges.count += monthData.eventSummary.exchanges.count;
// //         periodEventSummary.exchanges.value += monthData.eventSummary.exchanges.value;
// //         periodEventSummary.partialRefunds.count += monthData.eventSummary.partialRefunds.count;
// //         periodEventSummary.partialRefunds.value += monthData.eventSummary.partialRefunds.value;
// //         periodEventSummary.totalEvents += monthData.eventSummary.totalEvents;
// //         periodEventSummary.netValue += monthData.eventSummary.netValue;

// //         totalEventsValue += Math.abs(monthData.eventSummary.netValue);
// //       }
// //     });

// //     return {
// //       totalRevenue,
// //       totalOrders,
// //       totalItems,
// //       totalDiscounts,
// //       totalReturns,
// //       totalNetSales,
// //       totalShipping,
// //       totalTaxes,
// //       totalExtraFees,
// //       totalTotalSales,
// //       totalShippingRefunds,
// //       totalNetReturns,
// //       totalTotalRefund,
// //       eventSummary: periodEventSummary,
// //       ordersWithSubsequentEvents: ordersWithEventsCount,
// //       subsequentEventsCount: periodEventSummary.totalEvents,
// //       subsequentEventsValue: parseFloat(totalEventsValue.toFixed(2)),
// //       netRevenue: totalTotalSales,
// //       discountRate: totalRevenue > 0 ? (totalDiscounts / totalRevenue) * 100 : 0,
// //       shippingRate: totalRevenue > 0 ? (totalShipping / totalRevenue) * 100 : 0,
// //       taxRate: totalRevenue > 0 ? (totalTaxes / totalRevenue) * 100 : 0,
// //       returnRate: totalRevenue > 0 ? (totalReturns / totalRevenue) * 100 : 0
// //     };
// //   };

// //   const formatNumber = (num: number) => num.toLocaleString('en-US');
// //   const formatPercent = (num: number) => `${num.toFixed(1)}%`;
// //   const formatCurrency = (amount: number) => {
// //     const currency = safeData?.shopCurrency || 'USD';
// //     return amount.toLocaleString('en-US', { 
// //       style: 'currency', 
// //       currency: currency,
// //       minimumFractionDigits: 2 
// //     });
// //   };

// //   // In the exportToPDF function within the main component:

// // const exportToPDF = () => {
// //   setIsExporting(true);
  
// //   const safeData = getSafeData(data);
// //   const todayData = getTodayData();
// //   const last7DaysData = getLast7DaysData();
// //   const weeklyFinancials = getWeeklyFinancials();
// //   const monthlyFinancials = getMonthlyFinancials();
  
// //   if (!safeData || !todayData || !last7DaysData || !weeklyFinancials || !monthlyFinancials) {
// //     setIsExporting(false);
// //     return;
// //   }

// //   // Use the most comprehensive event data available
// //   const eventData = monthlyFinancials.eventSummary || weeklyFinancials.eventSummary || last7DaysData.eventSummary;
  
// //   // Calculate total events count
// //   const totalEvents = eventData ? 
// //     (eventData.refunds.count + eventData.exchanges.count + eventData.partialRefunds.count) : 0;
  
// //   // Calculate orders with events (from the data we already have)
// //   const ordersWithEvents = monthlyFinancials.ordersWithSubsequentEvents || 
// //                           weeklyFinancials.ordersWithSubsequentEvents || 
// //                           last7DaysData.ordersWithSubsequentEvents || 0;

// //   const pdfData: OrderData = {
// //     totalOrders: safeData.totalOrders,
// //     totalCustomers: safeData.totalCustomerData.totalCustomers,
// //     fulfillmentRate: safeData.totalOrders > 0 ? 
// //       ((last7DaysData.totalFulfilled / last7DaysData.totalOrders) * 100) : 0,
// //     totalRevenue: monthlyFinancials.totalRevenue,
// //     netRevenue: monthlyFinancials.netRevenue,
// //     averageOrderValue: safeData.totalOrders > 0 ? 
// //       (monthlyFinancials.totalRevenue / safeData.totalOrders) : 0,
// //     totalItems: monthlyFinancials.totalItems,
// //     todayOrders: todayData.orderCount,
// //     todayRevenue: todayData.total,
// //     todayItems: todayData.items,
// //     ordersChangeVsYesterday: 100.0,
// //     revenueChangeVsYesterday: 100.0,
// //     itemsChangeVsYesterday: 100.0,
// //     newCustomers: safeData.totalCustomerData.newCustomers,
// //     repeatCustomers: safeData.totalCustomerData.repeatedCustomers,
// //     customerRetentionRate: safeData.totalCustomerData.totalCustomers > 0 ? 
// //       ((safeData.totalCustomerData.repeatedCustomers / safeData.totalCustomerData.totalCustomers) * 100) : 0,
// //     averageOrderFrequency: 1.0,
// //     shopTimezone: safeData.shopTimeZone,
// //     shopCurrency: safeData.shopCurrency,
// //     // ACCURATE EVENT DATA
// //     totalRefunds: eventData?.refunds.count || 0,
// //     totalExchanges: eventData?.exchanges.count || 0,
// //     totalPartialRefunds: eventData?.partialRefunds.count || 0,
// //     totalEvents: totalEvents,
// //     ordersWithEvents: ordersWithEvents,
// //     netEventValue: eventData?.netValue || 0
// //   };

// //   console.log('🔍 PDF Export Event Data:', pdfData);

// //   generatePDFReport(pdfData);
// //   setIsExporting(false);
// // };
// //   if (isLoading) {
// //     return (
// //       <div className="orders-dashboard">
// //         <div className="dashboard-header">
// //           <h1>Analytics Dashboard</h1>
// //         </div>
// //         <LoadingProgress />
// //       </div>
// //     );
// //   }

// //   if ("error" in data) {
// //   return (
// //     <div className="orders-dashboard">
// //       <div style={{ padding: "40px", textAlign: "center", background: "#fff5f5", borderRadius: "8px" }}>
// //         <h1>We're Sorry</h1>
// //         <p>{data.userMessage}</p>
// //         <button className="print-button" onClick={handleManualRefresh}>
// //           Refresh Page
// //         </button>
// //       </div>
// //     </div>
// //   );
// // }

// //   const safeData = getSafeData(data);
// //   const todayData = getTodayData();
// //   const last7DaysData = getLast7DaysData();
// //   const weeklyFinancials = getWeeklyFinancials();
// //   const monthlyFinancials = getMonthlyFinancials();

// //   if (!safeData || !todayData || !last7DaysData || !weeklyFinancials || !monthlyFinancials) {
// //     return (
// //       <div className="orders-dashboard">
// //         <div style={{ padding: "20px", color: "red", textAlign: "center" }}>
// //           <h1>Data Validation Failed</h1>
// //           <p>Please refresh the page.</p>
// //         </div>
// //       </div>
// //     );
// //   }

// //   const formatDateDisplay = (dateStr: string) => {
// //     const date = new Date(dateStr + 'T00:00:00');
// //     return date.toLocaleDateString('en-US', { 
// //       month: 'short', 
// //       day: 'numeric',
// //       timeZone: safeData.shopTimeZone 
// //     });
// //   };

// //   const getDayName = (dateStr: string) => {
// //     const date = new Date(dateStr + 'T00:00:00');
// //     return date.toLocaleDateString('en-US', { 
// //       weekday: 'short',
// //       timeZone: safeData.shopTimeZone 
// //     });
// //   };

// //   return (
// //     <div className="orders-dashboard">
// //       <div className="dashboard-header">
// //         <h1><SvgIcons.Chart /> Orders Dashboard</h1>
// //         <div className="header-controls">
// //           <button 
// //             className="export-button"
// //             onClick={exportToPDF}
// //             disabled={isExporting}
// //             title="Export summary PDF report with key metrics"
// //           >
// //             <Icon.Export />
// //             {isExporting ? 'Generating PDF...' : 'Export Summary'}
// //           </button>
// //         </div>
// //       </div>

// //       <div id="dashboard-content">
// //         {/* Today's Performance Section */}
// //         <section className="today-performance">
// //           <h2>Today's Performance</h2>
// //           <MismatchSummaryCard 
// //             mismatchSummary={getTodayMismatchSummary(safeData)} 
// //             periodType="day" 
// //           />
          
// //           <div className="primary-metrics-grid">
// //             <div className="metric-card orders">
// //               <div className="metric-value">{safeNumber(todayData.orderCount)}</div>
// //               <div className="metric-label">Today's Orders</div>
// //               <div className="metric-change positive">
// //                 <Icon.TrendUp />
// //                 100.0% vs yesterday
// //               </div>
// //             </div>
            
// //             <div className="metric-card revenue">
// //               <div className="metric-value">{formatCurrency(safeNumber(todayData.totalSales))}</div>
// //               <div className="metric-label">Today's Total Sales</div>
// //               <div className="metric-change positive">
// //                 <Icon.TrendUp />
// //                 100.0% vs yesterday
// //               </div>
// //             </div>
            
// //             <div className="metric-card items">
// //               <div className="metric-value">{safeNumber(todayData.items)}</div>
// //               <div className="metric-label">Items Ordered</div>
// //               <div className="metric-change positive">
// //                 <Icon.TrendUp />
// //                 100.0% vs yesterday
// //               </div>
// //             </div>
// //           </div>

// //           <div className="fulfillment-metrics-grid">
// //             <div className="fulfillment-metric-card today-fulfilled">
// //               <div className="fulfillment-metric-value">{safeNumber(todayData.fulfilled)}</div>
// //               <div className="fulfillment-metric-label">FULFILLED TODAY</div>
// //               <div className="fulfillment-metric-period">Today</div>
// //             </div>
            
// //             <div className="fulfillment-metric-card today-unfulfilled">
// //               <div className="fulfillment-metric-value">{safeNumber(todayData.unfulfilled)}</div>
// //               <div className="fulfillment-metric-label">UNFULFILLED TODAY</div>
// //               <div className="fulfillment-metric-period">Today</div>
// //             </div>
            
// //             <div className="fulfillment-metric-card week-fulfilled">
// //               <div className="fulfillment-metric-value">{safeNumber(last7DaysData.totalFulfilled)}</div>
// //               <div className="fulfillment-metric-label">FULFILLED</div>
// //               <div className="fulfillment-metric-period">Last 7 Days</div>
// //             </div>
            
// //             <div className="fulfillment-metric-card week-unfulfilled">
// //               <div className="fulfillment-metric-value">{safeNumber(last7DaysData.totalUnfulfilled)}</div>
// //               <div className="fulfillment-metric-label">UNFULFILLED</div>
// //               <div className="fulfillment-metric-period">Last 7 Days</div>
// //             </div>
// //           </div>

// //           {todayData?.eventSummary && todayData.eventSummary.totalEvents > 0 && (
// //             <EventSummaryDisplay 
// //               eventSummary={todayData.eventSummary} 
// //               title="Today's Order Activity & Adjustments"
// //             />
// //           )}
// //         </section>

// //         {/* Last 7 Days Performance Section */}
// //         <section className="last7days-section">
// //           <h3>Last 7 Days Performance</h3>
          
// //           <div className="last7days-grid">
// //             <div className="last7days-total-card">
// //               <div className="last7days-total-value">{safeNumber(last7DaysData.totalOrders)}</div>
// //               <div className="last7days-total-label">TOTAL ORDERS</div>
// //             </div>
            
// //             <div className="last7days-total-card">
// //               <div className="last7days-total-value">{formatCurrency(safeNumber(last7DaysData.totalTotalSales))}</div>
// //               <div className="last7days-total-label">TOTAL SALES</div>
// //             </div>
            
// //             <div className="last7days-total-card">
// //               <div className="last7days-total-value">{safeNumber(last7DaysData.totalItems)}</div>
// //               <div className="last7days-total-label">TOTAL ITEMS</div>
// //             </div>
            
// //             <div className="last7days-total-card">
// //               <div className="last7days-total-value">{formatCurrency(safeNumber(last7DaysData.totalTotalSales / 7))}</div>
// //               <div className="last7days-total-label">AVG DAILY SALES</div>
// //             </div>
// //           </div>

// //           {/* Daily Breakdown Table */}
// //           <div className="daily-breakdown">
// //             <h4>Daily Breakdown</h4>
// //             <div className="daily-cards-container">
// //               {safeData.dailyKeys.map((day, index) => {
// //                 const dayData = getSafeCustomerStats(safeData.dailyTotals, day);
// //                 const isToday = index === safeData.dailyKeys.length - 1;
                
// //                 return (
// //                   <div key={day} className={`daily-card ${isToday ? 'current-day' : ''}`}>
// //                     <div className="daily-card-header">
// //                       <div className="daily-date">{formatDateDisplay(day)}</div>
// //                       <div className="daily-day">{getDayName(day)}</div>
// //                     </div>
                    
// //                     <div className="daily-metrics">
// //                       <div className="daily-metric">
// //                         <span className="daily-metric-label">ORDERS</span>
// //                         <span className="daily-metric-value">{safeNumber(dayData.orderCount)}</span>
// //                       </div>
                      
// //                       <div className="daily-metric">
// //                         <span className="daily-metric-label">TOTAL SALES</span>
// //                         <span className="daily-metric-value">{formatCurrency(safeNumber(dayData.totalSales))}</span>
// //                       </div>
                      
// //                       <div className="daily-metric">
// //                         <span className="daily-metric-label">ITEMS</span>
// //                         <span className="daily-metric-value">{safeNumber(dayData.items)}</span>
// //                       </div>
// //                     </div>
// //                   </div>
// //                 );
// //               })}
// //             </div>
// //           </div>

// //           {last7DaysData?.eventSummary && last7DaysData.eventSummary.totalEvents > 0 && (
// //             <EventSummaryDisplay 
// //               eventSummary={last7DaysData.eventSummary} 
// //               title="Last 7 Days: Refunds, Exchanges & Adjustments"
// //             />
// //           )}
// //         </section>

// //         {/* Week-over-Week Insight */}
// //         <div className="secondary-metrics">
// //           <div className="insight-card">
// //             <h4>Week-over-Week Revenue Change</h4>
// //             <p className="insight-value text-positive">
// //               <Icon.TrendUp /> 
// //               100.0%
// //             </p>
// //           </div>
// //         </div>

// //         {/* Customer Insights Section */}
// //         <section className="customer-metrics">
// //           <h3>Customer Insights</h3>
          
// //           <div className="customer-metrics-grid">
// //             <div className="customer-metric-card total-customers">
// //               <div className="customer-metric-value">{safeNumber(safeData.totalCustomerData.totalCustomers)}</div>
// //               <div className="customer-metric-label">TOTAL CUSTOMERS</div>
// //             </div>
            
// //             <div className="customer-metric-card new-customers">
// //               <div className="customer-metric-value">{safeNumber(safeData.totalCustomerData.newCustomers)}</div>
// //               <div className="customer-metric-label">NEW CUSTOMERS</div>
// //             </div>
            
// //             <div className="customer-metric-card repeat-customers">
// //               <div className="customer-metric-value">{safeNumber(safeData.totalCustomerData.repeatedCustomers)}</div>
// //               <div className="customer-metric-label">REPEAT CUSTOMERS</div>
// //             </div>
            
// //             <div className="customer-metric-card loyalty-rate">
// //               <div className="customer-metric-value">
// //                 {safeData.totalCustomerData.totalCustomers > 0 
// //                   ? formatPercent((safeData.totalCustomerData.repeatedCustomers / safeData.totalCustomerData.totalCustomers) * 100)
// //                   : '0.0%'
// //                 }
// //               </div>
// //               <div className="customer-metric-label">REPEAT CUSTOMER RATE</div>
// //             </div>
// //           </div>
// //         </section>

// //         {/* Last 7 Days Customer Insights */}
// //         <section className="customer-metrics">
// //           <h3>Last 7 Days Customer Insights</h3>
          
// //           <div className="customer-metrics-grid">
// //             <div className="customer-metric-card total-customers">
// //               <div className="customer-metric-value">{safeNumber(last7DaysData.totalNewCustomers + last7DaysData.totalRepeatCustomers)}</div>
// //               <div className="customer-metric-label">7-DAY TOTAL CUSTOMERS</div>
// //             </div>
            
// //             <div className="customer-metric-card new-customers">
// //               <div className="customer-metric-value">{safeNumber(last7DaysData.totalNewCustomers)}</div>
// //               <div className="customer-metric-label">7-DAY NEW CUSTOMERS</div>
// //             </div>
            
// //             <div className="customer-metric-card repeat-customers">
// //               <div className="customer-metric-value">{safeNumber(last7DaysData.totalRepeatCustomers)}</div>
// //               <div className="customer-metric-label">7-DAY REPEAT CUSTOMERS</div>
// //             </div>
            
// //             <div className="customer-metric-card loyalty-rate">
// //               <div className="customer-metric-value">
// //                 {(last7DaysData.totalNewCustomers + last7DaysData.totalRepeatCustomers) > 0
// //                   ? formatPercent((last7DaysData.totalRepeatCustomers / (last7DaysData.totalNewCustomers + last7DaysData.totalRepeatCustomers)) * 100)
// //                   : '0.0%'
// //                 }
// //               </div>
// //               <div className="customer-metric-label">7-DAY REPEAT RATE</div>
// //             </div>
// //           </div>
// //         </section>

// //         {/* Last 7 Days Financial Breakdown */}
// //         <section className="financial-metrics">
// //           <h3>Last 7 Days Financial Breakdown</h3>

// //           <MismatchSummaryCard 
// //             mismatchSummary={getCalculationMismatchSummary(safeData)} 
// //             periodType="day"
// //           />

// //           <div className="financial-metrics-grid">
// //             <div className="financial-metric-card revenue">
// //               <div className="financial-metric-value">{formatCurrency(last7DaysData.totalRevenue)}</div>
// //               <div className="financial-metric-label">Gross Sales</div>
// //               <div className="financial-metric-period">7 Days</div>
// //             </div>
            
// //             <div className="financial-metric-card discounts">
// //               <div className="financial-metric-value">{formatCurrency(last7DaysData.totalDiscounts)}</div>
// //               <div className="financial-metric-label">Total Discounts</div>
// //               <div className="financial-metric-rate">{formatPercent(last7DaysData.totalDiscounts / last7DaysData.totalRevenue * 100)} of gross</div>
// //             </div>
            
// //             <div className="financial-metric-card returns">
// //               <div className="financial-metric-value">{formatCurrency(last7DaysData.totalReturns)}</div>
// //               <div className="financial-metric-label">Returns & Refunds</div>
// //               <div className="financial-metric-rate">{formatPercent(last7DaysData.totalReturns / last7DaysData.totalRevenue * 100)} of gross</div>
// //             </div>
            
// //             <div className="financial-metric-card return-fees">
// //               <div className="financial-metric-value">{formatCurrency(last7DaysData.totalExtraFees)}</div>
// //               <div className="financial-metric-label">Return Fees</div>
// //               <div className="financial-metric-rate">{formatPercent(last7DaysData.totalExtraFees / last7DaysData.totalRevenue * 100)} of gross</div>
// //             </div>
            
// //             <div className="financial-metric-card net-sales">
// //               <div className="financial-metric-value">{formatCurrency(last7DaysData.totalNetSales)}</div>
// //               <div className="financial-metric-label">Net Sales</div>
// //               <div className="financial-metric-period">After ALL deductions</div>
// //             </div>
            
// //             <div className="financial-metric-card shipping">
// //               <div className="financial-metric-value">{formatCurrency(last7DaysData.totalShipping)}</div>
// //               <div className="financial-metric-label">Shipping Charges</div>
// //               <div className="financial-metric-rate">{formatPercent(last7DaysData.totalShipping / last7DaysData.totalNetSales * 100)} of net sales</div>
// //             </div>
            
// //             <div className="financial-metric-card taxes">
// //               <div className="financial-metric-value">{formatCurrency(last7DaysData.totalTaxes)}</div>
// //               <div className="financial-metric-label">Taxes Collected</div>
// //               <div className="financial-metric-rate">{formatPercent(last7DaysData.totalTaxes / last7DaysData.totalNetSales * 100)} of net sales</div>
// //             </div>
            
// //             <div className="financial-metric-card total-sales">
// //               <div className="financial-metric-value">{formatCurrency(last7DaysData.totalTotalSales)}</div>
// //               <div className="financial-metric-label">Total Sales</div>
// //               <div className="financial-metric-period">Final amount</div>
// //             </div>
// //           </div>

// //           {/* Daily Financial Details */}
// //           <div className="daily-financial-breakdown">
// //             <h4>Daily Financial Details</h4>
// //             <div className="daily-financial-cards">
// //               {safeData.dailyKeys.map((day, index) => {
// //                 const dayData = getSafeCustomerStats(safeData.dailyTotals, day);
// //                 const isToday = index === safeData.dailyKeys.length - 1;
                
// //                 return (
// //                   <div key={day} className={`daily-financial-card ${isToday ? 'current-day' : ''}`}>
// //                     <div className="daily-financial-header">
// //                       <div className="daily-financial-date">{formatDateDisplay(day)}</div>
// //                       <div className="daily-financial-day">{getDayName(day)}</div>
// //                     </div>
                    
// //                     <div className="daily-financial-metrics">
// //                       <div className="daily-financial-metric gross-revenue">
// //                         <span className="daily-financial-label">Gross Sales</span>
// //                         <span className="daily-financial-value">{formatCurrency(dayData.total)}</span>
// //                       </div>
                      
// //                       <div className="daily-financial-metric discounts">
// //                         <span className="daily-financial-label">Discounts</span>
// //                         <span className="daily-financial-value">{formatCurrency(dayData.discounts)}</span>
// //                       </div>
                      
// //                       <div className="daily-financial-metric returns">
// //                         <span className="daily-financial-label">Returns</span>
// //                         <span className="daily-financial-value">{formatCurrency(dayData.returns)}</span>
// //                       </div>
                      
// //                       <div className="daily-financial-metric net-sales">
// //                         <span className="daily-financial-label">Net Sales</span>
// //                         <span className="daily-financial-value">{formatCurrency(dayData.netSales)}</span>
// //                       </div>
                      
// //                       <div className="daily-financial-metric shipping">
// //                         <span className="daily-financial-label">Shipping Charges</span>
// //                         <span className="daily-financial-value">{formatCurrency(dayData.shipping)}</span>
// //                       </div>
                      
// //                       <div className="daily-financial-metric return-fees">
// //                         <span className="daily-financial-label">Return Fees</span>
// //                         <span className="daily-financial-value">{formatCurrency(dayData.extraFees)}</span>
// //                       </div>
                      
// //                       <div className="daily-financial-metric taxes">
// //                         <span className="daily-financial-label">Taxes</span>
// //                         <span className="daily-financial-value">{formatCurrency(dayData.taxes)}</span>
// //                       </div>
                      
// //                       <div className="daily-financial-metric total-sales">
// //                         <span className="daily-financial-label">Total Sales</span>
// //                         <span className="daily-financial-value">{formatCurrency(dayData.totalSales)}</span>
// //                       </div>
// //                     </div>
// //                   </div>
// //                 );
// //               })}
// //             </div>
// //           </div>
// //         </section>

// //         {/* Weekly Performance */}
// //         <section className="weekly-performance">
// //           <h3>Weekly Performance (Last 8 Weeks)</h3>
// //           <MismatchSummaryCard 
// //             mismatchSummary={getWeeklyMismatchSummary(safeData)} 
// //             periodType="week"
// //           />
// //           <div className="weekly-grid">
// //             <div className="weekly-card">
// //               <div className="weekly-value">{safeNumber(weeklyFinancials.totalOrders)}</div>
// //               <div className="weekly-label">Total Orders</div>
// //             </div>
            
// //             <div className="weekly-card">
// //               <div className="weekly-value">{formatCurrency(weeklyFinancials.totalRevenue)}</div>
// //               <div className="weekly-label">Total Revenue</div>
// //             </div>
            
// //             <div className="weekly-card">
// //               <div className="weekly-value">{safeNumber(weeklyFinancials.totalItems)}</div>
// //               <div className="weekly-label">Total Items</div>
// //             </div>
            
// //             <div className="weekly-card">
// //               <div className="weekly-value">{formatCurrency(weeklyFinancials.totalRevenue / safeData.weeklyKeys.length)}</div>
// //               <div className="weekly-label">Avg Weekly Revenue</div>
// //             </div>
// //           </div>

// //           {/* Weekly Breakdown */}
// //           <div className="weekly-breakdown">
// //             <h4>Weekly Breakdown</h4>
// //             <div className="weekly-cards-container">
// //               {safeData.weeklyKeys.map((week, index) => {
// //                 const weekData = getSafeCustomerStats(safeData.weeklyTotals, week);
// //                 const isCurrentWeek = index === safeData.weeklyKeys.length - 1;
                
// //                 return (
// //                   <div key={week} className={`week-card ${isCurrentWeek ? 'current-week' : ''}`}>
// //                     <div className="week-header">
// //                       <div className="week-label">Week {week.replace('Week of ', '').split('-')[2]}</div>
// //                       <div className="week-period">{week.replace('Week of ', '').split('-')[0]}</div>
// //                     </div>
                    
// //                     <div className="week-metrics">
// //                       <div className="week-metric orders">
// //                         <span className="week-metric-label">Orders</span>
// //                         <span className="week-metric-value">{safeNumber(weekData.orderCount)}</span>
// //                       </div>
                      
// //                       <div className="week-metric revenue">
// //                         <span className="week-metric-label">Total Sales</span>
// //                         <span className="week-metric-value">{formatCurrency(weekData.totalSales)}</span>
// //                       </div>
                      
// //                       <div className="week-metric items">
// //                         <span className="week-metric-label">Items</span>
// //                         <span className="week-metric-value">{safeNumber(weekData.items)}</span>
// //                       </div>
// //                     </div>
// //                   </div>
// //                 );
// //               })}
// //             </div>
// //           </div>

// //           {weeklyFinancials?.eventSummary && weeklyFinancials.eventSummary.totalEvents > 0 && (
// //             <EventSummaryDisplay 
// //               eventSummary={weeklyFinancials.eventSummary} 
// //               title="8-Week Period: Order Events & Financial Adjustments"
// //             />
// //           )}
// //         </section>

// //         {/* Weekly Financial Breakdown */}
// //         <section className="financial-metrics">
// //           <h3>Weekly Financial Breakdown (Last 8 Weeks)</h3>
// //           <div className="financial-metrics-grid">
// //             <div className="financial-metric-card revenue">
// //               <div className="financial-metric-value">{formatCurrency(weeklyFinancials.totalRevenue)}</div>
// //               <div className="financial-metric-label">Gross Sales</div>
// //               <div className="financial-metric-period">8 Weeks</div>
// //             </div>
            
// //             <div className="financial-metric-card discounts">
// //               <div className="financial-metric-value">{formatCurrency(weeklyFinancials.totalDiscounts)}</div>
// //               <div className="financial-metric-label">Total Discounts</div>
// //               <div className="financial-metric-rate">{formatPercent(weeklyFinancials.totalDiscounts / weeklyFinancials.totalRevenue * 100)} of gross</div>
// //             </div>
            
// //             <div className="financial-metric-card returns">
// //               <div className="financial-metric-value">{formatCurrency(weeklyFinancials.totalReturns)}</div>
// //               <div className="financial-metric-label">Returns & Refunds</div>
// //               <div className="financial-metric-rate">{formatPercent(weeklyFinancials.totalReturns / weeklyFinancials.totalRevenue * 100)} of gross</div>
// //             </div>
            
// //             <div className="financial-metric-card return-fees">
// //               <div className="financial-metric-value">{formatCurrency(weeklyFinancials.totalExtraFees)}</div>
// //               <div className="financial-metric-label">Return Fees</div>
// //               <div className="financial-metric-rate">{formatPercent(weeklyFinancials.totalExtraFees / weeklyFinancials.totalRevenue * 100)} of gross</div>
// //             </div>
            
// //             <div className="financial-metric-card net-sales">
// //               <div className="financial-metric-value">{formatCurrency(weeklyFinancials.totalNetSales)}</div>
// //               <div className="financial-metric-label">Net Sales</div>
// //               <div className="financial-metric-period">After ALL deductions</div>
// //             </div>
            
// //             <div className="financial-metric-card shipping">
// //               <div className="financial-metric-value">{formatCurrency(weeklyFinancials.totalShipping)}</div>
// //               <div className="financial-metric-label">Shipping Charges</div>
// //               <div className="financial-metric-rate">{formatPercent(weeklyFinancials.totalShipping / weeklyFinancials.totalNetSales * 100)} of net sales</div>
// //             </div>
            
// //             <div className="financial-metric-card taxes">
// //               <div className="financial-metric-value">{formatCurrency(weeklyFinancials.totalTaxes)}</div>
// //               <div className="financial-metric-label">Taxes Collected</div>
// //               <div className="financial-metric-rate">{formatPercent(weeklyFinancials.totalTaxes / weeklyFinancials.totalNetSales * 100)} of net sales</div>
// //             </div>
            
// //             <div className="financial-metric-card total-sales">
// //               <div className="financial-metric-value">{formatCurrency(weeklyFinancials.totalTotalSales)}</div>
// //               <div className="financial-metric-label">Total Sales</div>
// //               <div className="financial-metric-period">Final amount</div>
// //             </div>
// //           </div>

// //           {/* Weekly Financial Details */}
// //           <div className="weekly-financial-breakdown">
// //             <h4>Weekly Financial Details</h4>
// //             <div className="weekly-financial-cards">
// //               {safeData.weeklyKeys.map((week, index) => {
// //                 const weekData = getSafeCustomerStats(safeData.weeklyTotals, week);
// //                 const isCurrentWeek = index === safeData.weeklyKeys.length - 1;
                
// //                 return (
// //                   <div key={week} className={`weekly-financial-card ${isCurrentWeek ? 'current-week' : ''}`}>
// //                     <div className="weekly-financial-header">
// //                       <div className="weekly-financial-label">Week {week.replace('Week of ', '').split('-')[2]}</div>
// //                       <div className="weekly-financial-period">{week.replace('Week of ', '').split('-')[0]}</div>
// //                     </div>
                    
// //                     <div className="weekly-financial-metrics">
// //                       <div className="weekly-financial-metric gross-revenue">
// //                         <span className="weekly-financial-label">Gross Sales</span>
// //                         <span className="weekly-financial-value">{formatCurrency(weekData.total)}</span>
// //                       </div>
                      
// //                       <div className="weekly-financial-metric discounts">
// //                         <span className="weekly-financial-label">Discounts</span>
// //                         <span className="weekly-financial-value">{formatCurrency(weekData.discounts)}</span>
// //                       </div>
                      
// //                       <div className="weekly-financial-metric returns">
// //                         <span className="weekly-financial-label">Returns</span>
// //                         <span className="weekly-financial-value">{formatCurrency(weekData.returns)}</span>
// //                       </div>
                      
// //                       <div className="weekly-financial-metric net-sales">
// //                         <span className="weekly-financial-label">Net Sales</span>
// //                         <span className="weekly-financial-value">{formatCurrency(weekData.netSales)}</span>
// //                       </div>
                      
// //                       <div className="weekly-financial-metric shipping">
// //                         <span className="weekly-financial-label">Shipping Charges</span>
// //                         <span className="weekly-financial-value">{formatCurrency(weekData.shipping)}</span>
// //                       </div>
                      
// //                       <div className="weekly-financial-metric return-fees">
// //                         <span className="weekly-financial-label">Return Fees</span>
// //                         <span className="weekly-financial-value">{formatCurrency(weekData.extraFees)}</span>
// //                       </div>
                      
// //                       <div className="weekly-financial-metric taxes">
// //                         <span className="weekly-financial-label">Taxes</span>
// //                         <span className="weekly-financial-value">{formatCurrency(weekData.taxes)}</span>
// //                       </div>
                      
// //                       <div className="weekly-financial-metric total-sales">
// //                         <span className="weekly-financial-label">Total Sales</span>
// //                         <span className="weekly-financial-value">{formatCurrency(weekData.totalSales)}</span>
// //                       </div>
// //                     </div>
// //                   </div>
// //                 );
// //               })}
// //             </div>
// //           </div>
// //         </section>

// //         {/* Monthly Performance */}
// //         <section className="monthly-performance">
// //           <h3>Monthly Performance (Last 6 Months)</h3>
// //           <MismatchSummaryCard 
// //             mismatchSummary={getMonthlyMismatchSummary(safeData)} 
// //             periodType="month"
// //           />
// //           <div className="monthly-grid">
// //             <div className="monthly-card">
// //               <div className="monthly-value">{safeNumber(monthlyFinancials.totalOrders)}</div>
// //               <div className="monthly-label">Total Orders</div>
// //             </div>
            
// //             <div className="monthly-card">
// //               <div className="monthly-value">{formatCurrency(monthlyFinancials.totalRevenue)}</div>
// //               <div className="monthly-label">Total Revenue</div>
// //             </div>
            
// //             <div className="monthly-card">
// //               <div className="monthly-value">{safeNumber(monthlyFinancials.totalItems)}</div>
// //               <div className="monthly-label">Total Items</div>
// //             </div>
            
// //             <div className="monthly-card">
// //               <div className="monthly-value">{formatCurrency(monthlyFinancials.totalRevenue / safeData.monthRanges.length)}</div>
// //               <div className="monthly-label">Avg Monthly Revenue</div>
// //             </div>
// //           </div>

// //           {/* Monthly Breakdown */}
// //           <div className="monthly-breakdown">
// //             <h4>Monthly Breakdown</h4>
// //             <div className="monthly-cards-container">
// //               {safeData.monthRanges.map((month, index) => {
// //                 const monthData = getSafeCustomerStats(safeData.monthlyTotals, month);
// //                 const currentMonth = new Date().toLocaleString("default", { month: "short", year: "numeric", timeZone: safeData.shopTimeZone });
// //                 const isCurrentMonth = month === currentMonth;
                
// //                 const avgRevenue = safeData.monthRanges.reduce((sum, m) => {
// //                   const mData = getSafeCustomerStats(safeData.monthlyTotals, m);
// //                   return sum + mData.total;
// //                 }, 0) / safeData.monthRanges.length;
// //                 const performanceLevel = monthData.total > avgRevenue * 1.2 ? 'high' : 
// //                                        monthData.total > avgRevenue * 0.8 ? 'medium' : 'low';
                
// //                 return (
// //                   <div key={month} className={`month-card ${isCurrentMonth ? 'current-month' : ''}`}>
// //                     {isCurrentMonth && <div className="current-badge">Current</div>}
// //                     <div className="month-header">
// //                       <div className="month-label">{month.split(' ')[0]}</div>
// //                       <div className="month-period">{month.split(' ')[1]}</div>
// //                     </div>
                    
// //                     <div className="month-metrics">
// //                       <div className="month-metric orders">
// //                         <span className="month-metric-label">Orders</span>
// //                         <span className="month-metric-value">{safeNumber(monthData.orderCount)}</span>
// //                       </div>
                      
// //                       <div className="month-metric revenue">
// //                         <span className="month-metric-label">Total Sales</span>
// //                         <span className="month-metric-value">{formatCurrency(monthData.totalSales)}</span>
// //                       </div>
                      
// //                       <div className="month-metric items">
// //                         <span className="month-metric-label">Items</span>
// //                         <span className="month-metric-value">{safeNumber(monthData.items)}</span>
// //                       </div>
// //                     </div>
// //                   </div>
// //                 );
// //               })}
// //             </div>
// //           </div>

// //           {monthlyFinancials?.eventSummary && monthlyFinancials.eventSummary.totalEvents > 0 && (
// //             <EventSummaryDisplay 
// //               eventSummary={monthlyFinancials.eventSummary} 
// //               title="6-Month Overview: All Order Events & Adjustments"
// //             />
// //           )}
// //         </section>

// //         {/* Monthly Financial Breakdown */}
// //         <section className="financial-metrics">
// //           <h3>Monthly Financial Breakdown (Last 6 Months)</h3>
// //           <div className="financial-metrics-grid">
// //             <div className="financial-metric-card revenue">
// //               <div className="financial-metric-value">{formatCurrency(monthlyFinancials.totalRevenue)}</div>
// //               <div className="financial-metric-label">Gross Sales</div>
// //               <div className="financial-metric-period">6 Months</div>
// //             </div>
            
// //             <div className="financial-metric-card discounts">
// //               <div className="financial-metric-value">{formatCurrency(monthlyFinancials.totalDiscounts)}</div>
// //               <div className="financial-metric-label">Total Discounts</div>
// //               <div className="financial-metric-rate">{formatPercent(monthlyFinancials.totalDiscounts / monthlyFinancials.totalRevenue * 100)} of gross</div>
// //             </div>
            
// //             <div className="financial-metric-card returns">
// //               <div className="financial-metric-value">{formatCurrency(monthlyFinancials.totalReturns)}</div>
// //               <div className="financial-metric-label">Returns & Refunds</div>
// //               <div className="financial-metric-rate">{formatPercent(monthlyFinancials.totalReturns / monthlyFinancials.totalRevenue * 100)} of gross</div>
// //             </div>
            
// //             <div className="financial-metric-card return-fees">
// //               <div className="financial-metric-value">{formatCurrency(monthlyFinancials.totalExtraFees)}</div>
// //               <div className="financial-metric-label">Return Fees</div>
// //               <div className="financial-metric-rate">{formatPercent(monthlyFinancials.totalExtraFees / monthlyFinancials.totalRevenue * 100)} of gross</div>
// //             </div>
            
// //             <div className="financial-metric-card net-sales">
// //               <div className="financial-metric-value">{formatCurrency(monthlyFinancials.totalNetSales)}</div>
// //               <div className="financial-metric-label">Net Sales</div>
// //               <div className="financial-metric-period">After ALL deductions</div>
// //             </div>
            
// //             <div className="financial-metric-card shipping">
// //               <div className="financial-metric-value">{formatCurrency(monthlyFinancials.totalShipping)}</div>
// //               <div className="financial-metric-label">Shipping Charges</div>
// //               <div className="financial-metric-rate">{formatPercent(monthlyFinancials.totalShipping / monthlyFinancials.totalNetSales * 100)} of net sales</div>
// //             </div>
            
// //             <div className="financial-metric-card taxes">
// //               <div className="financial-metric-value">{formatCurrency(monthlyFinancials.totalTaxes)}</div>
// //               <div className="financial-metric-label">Taxes Collected</div>
// //               <div className="financial-metric-rate">{formatPercent(monthlyFinancials.totalTaxes / monthlyFinancials.totalNetSales * 100)} of net sales</div>
// //             </div>
            
// //             <div className="financial-metric-card total-sales">
// //               <div className="financial-metric-value">{formatCurrency(monthlyFinancials.totalTotalSales)}</div>
// //               <div className="financial-metric-label">Total Sales</div>
// //               <div className="financial-metric-period">Final amount</div>
// //             </div>
// //           </div>

// //           {/* Monthly Financial Details */}
// //           <div className="monthly-financial-breakdown">
// //             <h4>Monthly Financial Details</h4>
// //             <div className="monthly-financial-cards">
// //               {safeData.monthRanges.map((month, index) => {
// //                 const monthData = getSafeCustomerStats(safeData.monthlyTotals, month);
// //                 const currentMonth = new Date().toLocaleString("default", { month: "short", year: "numeric", timeZone: safeData.shopTimeZone });
// //                 const isCurrentMonth = month === currentMonth;
                
// //                 return (
// //                   <div key={month} className={`monthly-financial-card ${isCurrentMonth ? 'current-month' : ''}`}>
// //                     {isCurrentMonth && <div className="current-badge">Current</div>}
// //                     <div className="monthly-financial-header">
// //                       <div className="monthly-financial-label">{month.split(' ')[0]}</div>
// //                       <div className="monthly-financial-period">{month.split(' ')[1]}</div>
// //                     </div>
                    
// //                     <div className="monthly-financial-metrics">
// //                       <div className="monthly-financial-metric gross-revenue">
// //                         <span className="monthly-financial-label">Gross Sales</span>
// //                         <span className="monthly-financial-value">{formatCurrency(monthData.total)}</span>
// //                       </div>
                      
// //                       <div className="monthly-financial-metric discounts">
// //                         <span className="monthly-financial-label">Discounts</span>
// //                         <span className="monthly-financial-value">{formatCurrency(monthData.discounts)}</span>
// //                       </div>
                      
// //                       <div className="monthly-financial-metric returns">
// //                         <span className="monthly-financial-label">Returns</span>
// //                         <span className="monthly-financial-value">{formatCurrency(monthData.returns)}</span>
// //                       </div>
                      
// //                       <div className="monthly-financial-metric net-sales">
// //                         <span className="monthly-financial-label">Net Sales</span>
// //                         <span className="monthly-financial-value">{formatCurrency(monthData.netSales)}</span>
// //                       </div>
                      
// //                       <div className="monthly-financial-metric shipping">
// //                         <span className="monthly-financial-label">Shipping Charges</span>
// //                         <span className="monthly-financial-value">{formatCurrency(monthData.shipping)}</span>
// //                       </div>
                      
// //                       <div className="monthly-financial-metric return-fees">
// //                         <span className="monthly-financial-label">Return Fees</span>
// //                         <span className="monthly-financial-value">{formatCurrency(monthData.extraFees)}</span>
// //                       </div>
                      
// //                       <div className="monthly-financial-metric taxes">
// //                         <span className="monthly-financial-label">Taxes</span>
// //                         <span className="monthly-financial-value">{formatCurrency(monthData.taxes)}</span>
// //                       </div>
                      
// //                       <div className="monthly-financial-metric total-sales">
// //                         <span className="monthly-financial-label">Total Sales</span>
// //                         <span className="monthly-financial-value">{formatCurrency(monthData.totalSales)}</span>
// //                       </div>
// //                     </div>
// //                   </div>
// //                 );
// //               })}
// //             </div>
// //           </div>
// //         </section>

// //         {/* Charts & Analytics Section */}
// //         <section className="charts-section">
// //           <h2>Analytics & Insights Visualization</h2>
          
// //           <div className="charts-grid">
// //             <ChartComponents.CustomerDistribution data={safeData} />
// //             <ChartComponents.RevenueTrend data={safeData} />
// //             <ChartComponents.MonthlyPerformance data={safeData} />
// //             <ChartComponents.FinancialBreakdown data={safeData} />
// //           </div>
// //         </section>

// //         {/* Footer */}
// //         <footer className="app-footer">
// //           <div className="footer-content">
// //             <p>
// //               <strong>Orders Analyzed:</strong> {safeData.totalOrders} orders • 
// //               <strong> Net Revenue:</strong> {formatCurrency(monthlyFinancials.netRevenue)} • 
// //               <strong> Data Updated:</strong> {new Date(safeData.lastUpdated).toLocaleDateString()}
// //             </p>
// //             <p className="footer-brand">Analytics Dashboard - Nexus Powering Your Business Insights</p>
// //           </div>
// //         </footer>
// //       </div>
// //     </div>
// //   );
// // }

// // // ==================== 17.0 EXPORT COMPONENT ====================

// // export default function AnalyticsApp() {
// //   return <ShopifyAnalyticsPage />;
// // }





























































































































































































// // ==================== 1.0 IMPORTS & SETUP ====================

// import { json, type LoaderFunctionArgs } from "@remix-run/node";
// import { useLoaderData } from "@remix-run/react";
// import { authenticate } from "../shopify.server";
// import { useState, useEffect, useMemo } from "react";
// import "../styles/orders.css";

// import {
//   Chart as ChartJS,
//   CategoryScale,
//   LinearScale,
//   BarElement,
//   LineElement,
//   PointElement,
//   ArcElement,
//   Title,
//   Tooltip,
//   Legend,
//   Filler,
// } from 'chart.js';
// import { Bar, Line, Pie, Doughnut } from 'react-chartjs-2';

// ChartJS.register(
//   CategoryScale,
//   LinearScale,
//   BarElement,
//   LineElement,
//   PointElement,
//   ArcElement,
//   Title,
//   Tooltip,
//   Legend,
//   Filler
// );

// // ==================== 1.1 API CONFIGURATION ====================

// const SHOPIFY_API_VERSION = process.env.SHOPIFY_API_VERSION || '2024-04';

// // ==================== 2.0 TYPE DEFINITIONS ====================

// interface Order {
//   id: number;
//   created_at: string;
//   total_price: string;
//   total_discounts?: string;
//   total_shipping_price_set?: {
//     shop_money: { amount: string };
//   };
//   total_tax?: string;
//   total_refunds?: string;
//   fulfillment_status?: string;
//   line_items?: Array<{
//     quantity: number;
//   }>;
//   customer?: {
//     id?: string | number;
//   };
// }

// type EventSummary = {
//   refunds: {
//     count: number;
//     value: number;
//   };
//   exchanges: {
//     count: number;
//     value: number;
//   };
//   partialRefunds: {
//     count: number;
//     value: number;
//   };
//   totalEvents: number;
//   netValue: number;
// };

// interface OrderStats {
//   total: number;
//   items: number;
//   fulfilled: number;
//   unfulfilled: number;
//   discounts: number;
//   shipping: number;
//   taxes: number;
//   returns: number;
//   orderCount: number;
//   netSales: number;
//   extraFees: number;
//   totalSales: number;
//   shippingRefunds: number;
//   netReturns: number;
//   totalRefund: number;
//   discountsReturned?: number;
//   netDiscounts?: number;
//   returnShippingCharges?: number;
//   restockingFees?: number;
//   returnFees?: number;
//   refundDiscrepancy?: number;
//   hasSubsequentEvents: boolean;
//   eventSummary: EventSummary | null;
//   refundsCount: number;
//   financialStatus: string;
// }

// interface CustomerData {
//   newCustomers: number;
//   repeatedCustomers: number;
//   totalCustomers: number;
// }

// interface AnalyticsData {
//   shop: string;
//   totals: Record<string, OrderStats>;
//   dailyTotals: Record<string, OrderStats & CustomerData>;
//   weeklyTotals: Record<string, OrderStats & CustomerData>;
//   monthlyTotals: Record<string, OrderStats & CustomerData>;
//   totalOrders: number;
//   totalCustomerData: CustomerData;
//   monthRanges: string[];
//   dailyKeys: string[];
//   weeklyKeys: string[];
//   lastUpdated: string;
//   shopTimeZone: string;
//   shopCurrency: string;
// }

// interface CachedAnalyticsData extends AnalyticsData {
//   _cacheInfo?: {
//     fetchMode: "incremental" | "full";
//     apiSuccess: boolean;
//     cacheHealth: {
//       total: number;
//       valid: number;
//       expired: number;
//       health: number;
//     };
//     cacheStats: {
//       size: number;
//       version: number;
//     };
//     cacheUsed: boolean;
//     cacheHit: boolean;
//     fallbackUsed: boolean;
//     cacheTimestamp?: number;
//     performance?: {
//       cacheOperationTime: number;
//       totalLoaderTime: number;
//     };
//   };
// }

// interface OrderData {
//   totalOrders: number;
//   totalCustomers: number;
//   fulfillmentRate: number;
//   totalRevenue: number;
//   netRevenue: number;
//   averageOrderValue: number;
//   totalItems: number;
//   todayOrders: number;
//   todayRevenue: number;
//   todayItems: number;
//   ordersChangeVsYesterday: number;
//   revenueChangeVsYesterday: number;
//   itemsChangeVsYesterday: number;
//   newCustomers: number;
//   repeatCustomers: number;
//   customerRetentionRate: number;
//   averageOrderFrequency: number;
//   shopTimezone: string;
//   shopCurrency: string;
//   totalRefunds?: number;
//   totalExchanges?: number;
//   totalPartialRefunds?: number;
//   totalEvents?: number;
//   ordersWithEvents?: number;
//   netEventValue?: number;
// }

// // ==================== 3.0 CACHE MANAGER ====================

// class PersistentCacheManager {
//   private memoryStorage: Map<string, any> = new Map();
//   public version = 1;

//   private performanceMetrics = {
//     setOperations: 0,
//     getOperations: 0,
//     removeOperations: 0,
//     totalSetTime: 0,
//     totalGetTime: 0,
//     totalRemoveTime: 0
//   };

//   private validateCacheData(data: any): boolean {
//     try {
//       if (!data) return false;
//       if (data.orders && !Array.isArray(data.orders)) return false;
//       if (data.lastUpdatedAt && isNaN(Date.parse(data.lastUpdatedAt))) return false;
//       return true;
//     } catch (error) {
//       return false;
//     }
//   }

//   private async getPersistentStorage(): Promise<Map<string, any>> {
//     return this.memoryStorage;
//   }

//   async set<T>(key: string, value: T, ttl: number = 30 * 60 * 1000): Promise<void> {
//     const startTime = performance.now();
    
//     try {
//       if (!key || typeof key !== 'string') {
//         throw new Error('Invalid cache key');
//       }

//       if (!this.validateCacheData(value)) {
//         throw new Error('Invalid cache data structure');
//       }

//       const storage = await this.getPersistentStorage();
//       const entry = {
//         value,
//         timestamp: Date.now(),
//         ttl,
//         key,
//         version: this.version
//       };
      
//       storage.set(key, entry);
      
//       if (typeof window !== 'undefined' && window.localStorage) {
//         try {
//           localStorage.setItem(key, JSON.stringify(entry));
//         } catch (e) {
//         }
//       }
//       await this.enforceSizeLimit(50);
      
//     } catch (error) {
//       throw error;
//     } finally {
//       const duration = performance.now() - startTime;
//       this.performanceMetrics.setOperations++;
//       this.performanceMetrics.totalSetTime += duration;
//     }
//   }

//   async get<T>(key: string): Promise<{ value: T; timestamp: number } | null> {
//     const startTime = performance.now();
    
//     try {
//       const storage = await this.getPersistentStorage();
//       let entry = storage.get(key);
      
//       if (!entry && typeof window !== 'undefined' && window.localStorage) {
//         try {
//           const stored = localStorage.getItem(key);
//           if (stored) {
//             entry = JSON.parse(stored);
//             storage.set(key, entry);
//           }
//         } catch (e) {
//           await this.remove(key);
//           return null;
//         }
//       }

//       if (!entry) {
//         return null;
//       }

//       const isExpired = Date.now() - entry.timestamp > entry.ttl;
//       if (isExpired) {
//         await this.remove(key);
//         return null;
//       }

//       if (!this.validateCacheData(entry.value)) {
//         await this.remove(key);
//         return null;
//       }

//       return { value: entry.value, timestamp: entry.timestamp };
//     } catch (error) {
//       await this.remove(key);
//       return null;
//     } finally {
//       const duration = performance.now() - startTime;
//       this.performanceMetrics.getOperations++;
//       this.performanceMetrics.totalGetTime += duration;
//     }
//   }

//   async remove(key: string): Promise<void> {
//     const startTime = performance.now();
    
//     try {
//       const storage = await this.getPersistentStorage();
//       storage.delete(key);
      
//       if (typeof window !== 'undefined' && window.localStorage) {
//         try {
//           localStorage.removeItem(key);
//         } catch (e) {
//         }
//       }
//     } catch (error) {
//     } finally {
//       const duration = performance.now() - startTime;
//       this.performanceMetrics.removeOperations++;
//       this.performanceMetrics.totalRemoveTime += duration;
//     }
//   }

//   async emergencyReset(shop: string): Promise<void> {
//     const keys = [
//       makeCacheKey(shop, "orders"),
//     ];
    
//     for (const key of keys) {
//       await this.remove(key);
//     }
//   }

//   async cleanAllExpired(): Promise<number> {
//     let cleanedCount = 0;
//     const storage = await this.getPersistentStorage();
//     const now = Date.now();
    
//     for (const [key, entry] of storage.entries()) {
//       if (now - entry.timestamp > entry.ttl) {
//         await this.remove(key);
//         cleanedCount++;
//       }
//     }
    
//     if (typeof window !== 'undefined' && window.localStorage) {
//       for (let i = 0; i < localStorage.length; i++) {
//         const key = localStorage.key(i);
//         if (key && key.includes('::analytics::')) {
//           try {
//             const stored = localStorage.getItem(key);
//             if (stored) {
//               const entry = JSON.parse(stored);
//               if (now - entry.timestamp > entry.ttl) {
//                 localStorage.removeItem(key);
//                 cleanedCount++;
//               }
//             }
//           } catch (e) {
//             localStorage.removeItem(key);
//             cleanedCount++;
//           }
//         }
//       }
//     }
    
//     return cleanedCount;
//   }

//   async enforceSizeLimit(maxSize: number = 100): Promise<void> {
//     const storage = await this.getPersistentStorage();
//     if (storage.size <= maxSize) return;
    
//     const entries = Array.from(storage.entries())
//       .sort((a, b) => a[1].timestamp - b[1].timestamp);
      
//     const toRemove = storage.size - maxSize;
//     for (let i = 0; i < toRemove; i++) {
//       await this.remove(entries[i][0]);
//     }
//   }

//   getStats() {
//     return {
//       size: this.memoryStorage.size,
//       version: this.version
//     };
//   }

//   getPerformanceReport() {
//     const avgSetTime = this.performanceMetrics.setOperations > 0 
//       ? this.performanceMetrics.totalSetTime / this.performanceMetrics.setOperations 
//       : 0;
    
//     const avgGetTime = this.performanceMetrics.getOperations > 0 
//       ? this.performanceMetrics.totalGetTime / this.performanceMetrics.getOperations 
//       : 0;
    
//     const avgRemoveTime = this.performanceMetrics.removeOperations > 0 
//       ? this.performanceMetrics.totalRemoveTime / this.performanceMetrics.removeOperations 
//       : 0;

//     return {
//       operations: {
//         set: this.performanceMetrics.setOperations,
//         get: this.performanceMetrics.getOperations,
//         remove: this.performanceMetrics.removeOperations
//       },
//       averageTimes: {
//         set: parseFloat(avgSetTime.toFixed(2)),
//         get: parseFloat(avgGetTime.toFixed(2)),
//         remove: parseFloat(avgRemoveTime.toFixed(2))
//       },
//       totalTimes: {
//         set: parseFloat(this.performanceMetrics.totalSetTime.toFixed(2)),
//         get: parseFloat(this.performanceMetrics.totalGetTime.toFixed(2)),
//         remove: parseFloat(this.performanceMetrics.totalRemoveTime.toFixed(2))
//       }
//     };
//   }

//   healthReport() {
//     const now = Date.now();
//     let expiredCount = 0;
//     let validCount = 0;

//     for (const entry of this.memoryStorage.values()) {
//       if (now - entry.timestamp > entry.ttl) {
//         expiredCount++;
//       } else {
//         validCount++;
//       }
//     }

//     const total = this.memoryStorage.size;
//     const health = total > 0 ? validCount / total : 1;

//     return {
//       total: total,
//       valid: validCount,
//       expired: expiredCount,
//       health: health,
//       sizeInfo: {
//         memorySize: total,
//         recommendedMax: 50,
//         needsCleaning: total > 50
//       }
//     };
//   }
// }

// const cacheManager = new PersistentCacheManager();

// // ==================== 4.0 HELPER FUNCTIONS ====================

// function makeCacheKey(shop: string, segment: string): string {
//   return `${shop}::analytics::${segment}::v${cacheManager.version}`;
// }

// function nowISO(): string {
//   return new Date().toISOString();
// }

// function getMonthRanges(shopTimeZone: string = "UTC") {
//   const ranges: { start: string; end: string; key: string }[] = [];
//   const now = new Date();

//   for (let i = 6; i >= 0; i--) {
//     const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
//     const start = new Date(date.getFullYear(), date.getMonth(), 1);
//     const end = new Date(date.getFullYear(), date.getMonth() + 1, 0, 23, 59, 59);
//     ranges.push({
//       start: start.toISOString(),
//       end: end.toISOString(),
//       key: date.toLocaleString("default", { month: "short", year: "numeric" }),
//     });
//   }

//   return ranges;
// }

// function getLastNDays(n: number, shopTimeZone: string = "UTC") {
//   const days: string[] = [];
//   const now = new Date();
  
//   for (let i = n - 1; i >= 0; i--) {
//     const d = new Date(now);
//     d.setDate(now.getDate() - i);
//     const dayKey = d.toLocaleDateString("en-CA", { timeZone: shopTimeZone });
//     days.push(dayKey);
//   }
  
//   return days;
// }

// function getLast8Weeks(shopTimeZone: string = "UTC") {
//   const weeks: string[] = [];
//   const now = new Date();
//   const monday = new Date(now);
//   monday.setDate(now.getDate() - ((now.getDay() + 6) % 7));
//   for (let i = 7; i >= 0; i--) {
//     const startOfWeek = new Date(monday);
//     startOfWeek.setDate(monday.getDate() - i * 7);
//     const key = `Week of ${startOfWeek.toLocaleDateString("en-CA", { timeZone: shopTimeZone })}`;
//     weeks.push(key);
//   }
//   return weeks;
// }

// // ==================== 5.0 API FETCHING FUNCTIONS ====================

// async function fetchOrdersSince(
//   shop: string, 
//   accessToken: string, 
//   sinceDate: string, 
//   cachedOrders: any[] = []
// ): Promise<{ orders: any[]; hasMore: boolean }> {

//   let newOrders: any[] = [];
//   let url = `https://${shop}/admin/api/${SHOPIFY_API_VERSION}/orders.json?status=any&limit=250&updated_at_min=${sinceDate}`;
//   let pageCount = 0;
//   let hasMore = true;

//   while (url && hasMore) {
//     pageCount++;

//     const response = await fetch(url, { 
//       headers: { "X-Shopify-Access-Token": accessToken } 
//     });

//     if (!response.ok) {
//       if (response.status === 429) {
//         const retryAfter = response.headers.get('Retry-After') || '10';
//         const waitTime = parseInt(retryAfter) * 1000;
//         await new Promise(resolve => setTimeout(resolve, waitTime));
//         continue;
//       }
//       throw new Error(`HTTP error! status: ${response.status}`);
//     }

//     const data = await response.json();
//     const apiOrders: any[] = data.orders || [];
    
//     newOrders = newOrders.concat(apiOrders);

//     const linkHeader = response.headers.get("Link");
//     const nextMatch = linkHeader?.match(/<([^>]+)>; rel="next"/);
//     url = nextMatch ? nextMatch[1] : "";
//     hasMore = !!url;

//     if (url) {
//       await new Promise(resolve => setTimeout(resolve, 200));
//     }
//   }

//   return { orders: newOrders, hasMore: false };
// }

// async function fetchOrdersForPeriod(shop: string, accessToken: string, startDate: string, endDate: string) {
//   let allOrders: any[] = [];
//   let url = `https://${shop}/admin/api/${SHOPIFY_API_VERSION}/orders.json?status=any&limit=250&created_at_min=${startDate}&created_at_max=${endDate}`;
//   let pageCount = 0;

//   while (url) {
//     pageCount++;

//     const response = await fetch(url, { 
//       headers: { "X-Shopify-Access-Token": accessToken } 
//     });

//     if (!response.ok) {
//       if (response.status === 429) {
//         const retryAfter = response.headers.get('Retry-After') || '10';
//         const waitTime = parseInt(retryAfter) * 1000;
//         await new Promise(resolve => setTimeout(resolve, waitTime));
//         continue;
//       } else {
//         throw new Error(`HTTP error! status: ${response.status}`);
//       }
//     }

//     const data = await response.json();
//     const ordersCount = data.orders?.length || 0;
    
//     allOrders = allOrders.concat(data.orders || []);

//     const linkHeader = response.headers.get("Link");
//     const nextMatch = linkHeader?.match(/<([^>]+)>; rel="next"/);
//     url = nextMatch ? nextMatch[1] : "";
//   }

//   return allOrders;
// }

// // ==================== 6.0 EVENT DETECTION LOGIC ====================

// function calculateOrderEventSummary(order: any, periodStart: Date, periodEnd: Date): EventSummary | null {
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

// // ==================== 7.0 FINANCIAL CALCULATION ENGINE ====================

// function processSimpleOrder(order: any): OrderStats {
//   const grossSales = parseFloat(order.total_line_items_price) || 0;
//   const totalDiscounts = Math.abs(parseFloat(order.total_discounts) || 0);
//   const shipping = parseFloat(order.total_shipping_price_set?.shop_money?.amount || "0") || 0;
//   const taxes = parseFloat(order.current_total_tax) || 0;
//   const totalSales = parseFloat(order.current_total_price) || 0;
  
//   const itemsCount = order.line_items?.reduce((sum: number, li: any) => sum + li.quantity, 0) || 0;
//   const fulfilledCount = order.fulfillment_status === "fulfilled" ? 1 : 0;
//   const unfulfilledCount = order.fulfillment_status !== "fulfilled" ? 1 : 0;

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
//     financialStatus: order.financial_status || 'pending'
//   };
// }

// function processOrderToStats(order: any): OrderStats {
//   const hasRefunds = order.refunds && order.refunds.length > 0;
//   const hasComplexFulfillment = order.fulfillments && order.fulfillments.length > 1;
//   const hasExchangeTags = order.tags?.includes('exchange') || order.note?.includes('exchange');
  
//   if (!hasRefunds && !hasComplexFulfillment && !hasExchangeTags) {
//     return processSimpleOrder(order);
//   }

//   const grossSales = parseFloat(order.total_line_items_price) || 0;
//   const totalDiscounts = Math.abs(parseFloat(order.total_discounts) || 0);
//   const originalShipping = parseFloat(order.total_shipping_price_set?.shop_money?.amount || "0") || 0;
//   const taxes = parseFloat(order.current_total_tax) || 0;
//   const totalSales = parseFloat(order.current_total_price) || 0;

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

//   const orderRefunds = order.refunds || [];

//   if (orderRefunds.length > 0) {
//     for (let i = 0; i < orderRefunds.length; i++) {
//       const refund = orderRefunds[i];
      
//       if (refund.transactions && refund.transactions.length > 0) {
//         for (let j = 0; j < refund.transactions.length; j++) {
//           const transaction = refund.transactions[j];
//           if (transaction.kind === 'refund' && transaction.status === 'success') {
//             const refundAmount = Math.abs(parseFloat(transaction.amount) || 0);
//             totalActualRefund += refundAmount;
//             netReturns += refundAmount;
//           }
//         }
//       }

//       if (refund.refund_line_items) {
//         for (let j = 0; j < refund.refund_line_items.length; j++) {
//           const item = refund.refund_line_items[j];
//           const itemValue = Math.abs(parseFloat(item.subtotal) || 0);
//           grossReturns -= itemValue;
//           totalItemRefunds += itemValue;
          
//           const lineItemDiscount = parseFloat(item.total_discount) || 0;
//           discountsReturned += Math.abs(lineItemDiscount);
//         }
//       }
      
//       if (refund.order_adjustments && refund.order_adjustments.length > 0) {
//         for (let j = 0; j < refund.order_adjustments.length; j++) {
//           const adjustment = refund.order_adjustments[j];
//           const amount = parseFloat(adjustment.amount) || 0;
//           const absAmount = Math.abs(amount);
          
//           if (adjustment.kind === 'shipping_refund') {
//             shippingRefunds += amount;
//           }
//           else if (adjustment.kind === 'return_shipping' || adjustment.reason?.includes('shipping')) {
//             returnShippingCharges += absAmount;
//           }
//           else if (adjustment.kind === 'restocking_fee' || adjustment.reason?.includes('restock')) {
//             restockingFees += absAmount;
//           }
//           else if (adjustment.kind === 'return_fee' || adjustment.reason?.includes('fee')) {
//             returnFees += absAmount;
//           }
//           else if (adjustment.kind === 'refund_discrepancy') {
//             refundDiscrepancy += amount;
//             if (amount > 0) {
//               positiveAdjustments += absAmount;
//             } else if (amount < 0) {
//               grossReturns += amount;
//             }
//           }
//         }
//       }
      
//       if (refund.total_additional_fees_set) {
//         const additionalFees = parseFloat(refund.total_additional_fees_set?.shop_money?.amount || "0") || 0;
//         returnFees += additionalFees;
//       }
//     }
//   }

//   const shopifyReturns = grossReturns + positiveAdjustments - discountsReturned;
//   const totalRefund = shopifyReturns + refundDiscrepancy;
//   const isFullRefund = Math.abs(grossSales + shopifyReturns) < 0.01;

//   const netDiscounts = totalDiscounts - discountsReturned;
//   const shippingCharges = Math.max(0, originalShipping - Math.abs(shippingRefunds));

//   let netSales;
//   let adjustedTotalSales = totalSales;

//   if (orderRefunds.length > 0) {
//     const hasMultipleFulfillments = order.fulfillments && order.fulfillments.length > 1;
    
//     if (hasMultipleFulfillments) {
//       isExchangeOrder = true;
      
//       if (order.line_items) {
//         for (let i = 0; i < order.line_items.length; i++) {
//           const item = order.line_items[i];
//           let isRefunded = false;
          
//           if (orderRefunds[0]?.refund_line_items) {
//             for (let j = 0; j < orderRefunds[0].refund_line_items.length; j++) {
//               const refundItem = orderRefunds[0].refund_line_items[j];
//               if (refundItem.line_item_id === item.id) {
//                 isRefunded = true;
//                 break;
//               }
//             }
//           }
          
//           if (!isRefunded && item.fulfillment_status === 'fulfilled') {
//             const itemPrice = parseFloat(item.price) || 0;
//             const itemQuantity = item.current_quantity || item.quantity || 0;
//             exchangeItemValue += itemPrice * itemQuantity;
//           }
//         }
//       }
//     }
    
//     if (!isExchangeOrder) {
//       const hasExchangeTags = order.tags?.includes('exchange') || 
//                              order.note?.includes('exchange') ||
//                              order.note?.includes('exchanged');
//       const hasComplexRefundHistory = orderRefunds.length > 1;
      
//       if (hasExchangeTags || hasComplexRefundHistory) {
//         isExchangeOrder = true;
        
//         if (order.line_items) {
//           for (let i = 0; i < order.line_items.length; i++) {
//             const item = order.line_items[i];
//             if (item.fulfillment_status === 'fulfilled') {
//               const itemPrice = parseFloat(item.price) || 0;
//               const itemQuantity = item.current_quantity || item.quantity || 0;
//               exchangeItemValue += itemPrice * itemQuantity;
//             }
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
//   }
//   else if (isFullRefund && orderRefunds.length > 0) {
//     extraFees = Math.abs(totalSales);
//     appliedFunction = 'full_refund_no_exchange';
//   } 
//   else if (isExchangeOrder && !isFullRefund) {
//     extraFees = Math.max(0, totalSales - shippingCharges - netSales);
//     appliedFunction = 'exchange_partial';
//   }
//   else if (isExchangeOrder && !isFullRefund && totalItemRefunds > 0 && totalActualRefund > 0) {
//     const refundDifference = totalItemRefunds - totalActualRefund;
//     if (refundDifference > 0.01) {
//       extraFees = Math.max(0, refundDifference - exchangeItemValue);
//       appliedFunction = 'partial_refund_with_exchange';
//     }
//   }
//   else if (!isFullRefund && totalItemRefunds > 0 && totalActualRefund > 0) {
//     const refundDifference = totalItemRefunds - totalActualRefund;
//     if (refundDifference > 0.01) {
//       extraFees = refundDifference;
//       appliedFunction = 'regular_partial_refund';
//     }
//   }

//   if (isFullRefund && orderRefunds.length > 0) {
//     adjustedTotalSales = extraFees;
//   }

//   const shouldApplyCatchAll = 
//     Math.abs(netSales) < 0.01 &&
//     totalSales > 0.01 &&
//     Math.abs(extraFees - (totalSales - shippingCharges)) > 0.01;

//   if (shouldApplyCatchAll) {
//     extraFees = Math.max(0, totalSales - shippingCharges);
//     appliedFunction = 'final_catch_all_override';
//   }

//   if (refundDiscrepancy < -0.01) {
//     adjustedTotalSales = Math.max(0, adjustedTotalSales + refundDiscrepancy);
//   }

//   const orderDate = new Date(order.created_at);
//   const periodStart = new Date(orderDate.getFullYear(), orderDate.getMonth(), orderDate.getDate());
//   const periodEnd = new Date(periodStart);
//   periodEnd.setDate(periodStart.getDate() + 1);
  
//   const eventSummary = calculateOrderEventSummary(order, periodStart, periodEnd);

//   const itemsCount = order.line_items?.reduce((sum: number, li: any) => sum + li.quantity, 0) || 0;
//   const fulfilledCount = order.fulfillment_status === "fulfilled" ? 1 : 0;
//   const unfulfilledCount = order.fulfillment_status !== "fulfilled" ? 1 : 0;

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
//     financialStatus: order.financial_status || 'pending'
//   };
// }

// function mergeStats(existing: OrderStats, newStats: OrderStats): OrderStats {
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

// function mergeEventSummaries(a: EventSummary | null, b: EventSummary | null): EventSummary | null {
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



// // ==================== 8.0 CUSTOMER TRACKING LOGIC ====================

// function buildCustomerOrderMap(allOrders: any[], shopTimeZone: string) {
//   const customerOrderMap: Record<string, Date[]> = {};
  
//   for (let i = 0; i < allOrders.length; i++) {
//     const order = allOrders[i];
//     const custId = order?.customer?.id;
    
//     if (custId === undefined || custId === null) continue;
    
//     const customerId = custId.toString();
    
//     if (!customerOrderMap[customerId]) {
//       customerOrderMap[customerId] = [];
//     }
    
//     customerOrderMap[customerId].push(new Date(order.created_at));
//   }
  
//   return customerOrderMap;
// }

// function analyzeCustomerBehavior(
//   customerOrderMap: Record<string, Date[]>, 
//   shopTimeZone: string,
//   periodKeys: string[],
//   periodType: 'daily' | 'weekly' | 'monthly'
// ): Record<string, CustomerData> {
//   const periodAnalytics: Record<string, CustomerData> = {};
  
//   for (const key of periodKeys) {
//     periodAnalytics[key] = { newCustomers: 0, repeatedCustomers: 0, totalCustomers: 0 };
//   }

//   const customerIds = Object.keys(customerOrderMap);
  
//   for (let i = 0; i < customerIds.length; i++) {
//     const customerId = customerIds[i];
//     const orderDates = customerOrderMap[customerId];
//     if (orderDates.length === 0) continue;
    
//     let firstOrderDate = orderDates[0];
//     for (let j = 1; j < orderDates.length; j++) {
//       if (orderDates[j] < firstOrderDate) {
//         firstOrderDate = orderDates[j];
//       }
//     }
    
//     let firstOrderKey: string;
//     if (periodType === 'daily') {
//       firstOrderKey = firstOrderDate.toLocaleDateString("en-CA", { timeZone: shopTimeZone });
//     } else if (periodType === 'monthly') {
//       firstOrderKey = firstOrderDate.toLocaleString("default", { month: "short", year: "numeric", timeZone: shopTimeZone });
//     } else {
//       const firstOrderMonday = new Date(firstOrderDate);
//       firstOrderMonday.setDate(firstOrderDate.getDate() - ((firstOrderDate.getDay() + 6) % 7));
//       firstOrderKey = `Week of ${firstOrderMonday.toLocaleDateString("en-CA", { timeZone: shopTimeZone })}`;
//     }
    
//     for (let j = 0; j < orderDates.length; j++) {
//       const orderDate = orderDates[j];
//       let orderKey: string;
      
//       if (periodType === 'daily') {
//         orderKey = orderDate.toLocaleDateString("en-CA", { timeZone: shopTimeZone });
//       } else if (periodType === 'monthly') {
//         orderKey = orderDate.toLocaleString("default", { month: "short", year: "numeric", timeZone: shopTimeZone });
//       } else {
//         const orderMonday = new Date(orderDate);
//         orderMonday.setDate(orderDate.getDate() - ((orderDate.getDay() + 6) % 7));
//         orderKey = `Week of ${orderMonday.toLocaleDateString("en-CA", { timeZone: shopTimeZone })}`;
//       }
      
//       if (periodAnalytics[orderKey]) {
//         if (firstOrderKey === orderKey) {
//           periodAnalytics[orderKey].newCustomers++;
//         } else {
//           periodAnalytics[orderKey].repeatedCustomers++;
//         }
        
//         periodAnalytics[orderKey].totalCustomers++;
//       }
//     }
//   }
  
//   return periodAnalytics;
// }

// function calculateOverallCustomerData(customerOrderMap: Record<string, Date[]>): CustomerData {
//   const customers = Object.values(customerOrderMap);
//   const totalCustomers = customers.length;
  
//   let newCustomers = 0;
//   let repeatedCustomers = 0;

//   customers.forEach(orderDates => {
//     if (orderDates.length === 1) {
//       newCustomers++;
//     } else {
//       repeatedCustomers++;
//     }
//   });

//   return {
//     newCustomers,
//     repeatedCustomers,
//     totalCustomers,
//   };
// }

// // ==================== 9.0 LOADER FUNCTION ====================

// export const loader = async ({ request }: LoaderFunctionArgs) => {
//   let cacheUsed = false;
//   let apiSuccess = false;
//   let fetchMode: "incremental" | "full" = "full";
//   let cacheHit = false;
//   let fallbackUsed = false;

//   const loaderStartTime = performance.now();
//   let cacheOperationTime = 0;

//   try {
//     const { session } = await authenticate.admin(request);
//     const shop = session.shop;
//     const accessToken = session.accessToken!;

//     const shopRes = await fetch(`https://${shop}/admin/api/${SHOPIFY_API_VERSION}/shop.json`, {     
//       headers: { "X-Shopify-Access-Token": accessToken },
//     });
    
//     if (!shopRes.ok) throw new Error(`Failed to fetch shop info: ${shopRes.status}`);
    
//     const shopData = await shopRes.json();
//     const shopTimeZone = shopData.shop.iana_timezone || "UTC";
//     const shopCurrency = shopData.shop.currency || "USD";

//     const monthRanges = getMonthRanges(shopTimeZone);
//     const dailyKeys = getLastNDays(7, shopTimeZone);
//     const weeklyKeys = getLast8Weeks(shopTimeZone);

//     const initStats = (): OrderStats => ({
//       total: 0,
//       discounts: 0,
//       returns: 0,
//       netSales: 0,
//       shipping: 0,
//       taxes: 0,
//       extraFees: 0,
//       totalSales: 0,
//       shippingRefunds: 0,
//       netReturns: 0,
//       totalRefund: 0,
//       items: 0,
//       fulfilled: 0,
//       unfulfilled: 0,
//       orderCount: 0,
//       discountsReturned: 0,
//       netDiscounts: 0,
//       returnShippingCharges: 0,
//       restockingFees: 0,
//       returnFees: 0,
//       refundDiscrepancy: 0,
//       hasSubsequentEvents: false,
//       eventSummary: null,
//       refundsCount: 0,
//       financialStatus: 'pending'
//     });

//     const totals: Record<string, OrderStats> = {};
//     const dailyTotals: Record<string, OrderStats & CustomerData> = {};
//     const weeklyTotals: Record<string, OrderStats & CustomerData> = {};
//     const monthlyTotals: Record<string, OrderStats & CustomerData> = {};

//     monthRanges.forEach((r) => {
//       totals[r.key] = initStats();
//       monthlyTotals[r.key] = { ...initStats(), newCustomers: 0, repeatedCustomers: 0, totalCustomers: 0 };
//     });
//     dailyKeys.forEach((d) => (dailyTotals[d] = { ...initStats(), newCustomers: 0, repeatedCustomers: 0, totalCustomers: 0 }));
//     weeklyKeys.forEach((w) => (weeklyTotals[w] = { ...initStats(), newCustomers: 0, repeatedCustomers: 0, totalCustomers: 0 }));

//     const ordersKey = makeCacheKey(shop, "orders");
//     const cacheStartTime = performance.now();
//     const cacheEntry = await cacheManager.get<{ orders: any[]; lastUpdatedAt?: string }>(ordersKey);
    
//     cacheOperationTime = performance.now() - cacheStartTime;

//     const cacheHealth = cacheManager.healthReport();
//     const shouldClean = cacheHealth.health < 0.7 || Math.random() < 0.1;
    
//     if (shouldClean) {
//       await cacheManager.cleanAllExpired();
//       await cacheManager.enforceSizeLimit(50);
//     }

//     let allOrders: any[] = [];

//     try {
//       if (cacheEntry && cacheEntry.value.lastUpdatedAt) {
//         cacheUsed = true;
//         cacheHit = true;
//         fetchMode = "incremental";

//         const apiStart = performance.now();
//         const result = await fetchOrdersSince(shop, accessToken, cacheEntry.value.lastUpdatedAt, cacheEntry.value.orders);
//         const apiTime = performance.now() - apiStart;
        
//         if (result.orders.length > 0) {
//           apiSuccess = true;
//           const orderMap = new Map();
//           cacheEntry.value.orders.forEach((order: any) => orderMap.set(order.id, order));
//           result.orders.forEach((order: any) => orderMap.set(order.id, order));
          
//           allOrders = Array.from(orderMap.values());
//           await cacheManager.set(ordersKey, { 
//             orders: allOrders, 
//             lastUpdatedAt: nowISO() 
//           }, 30 * 60 * 1000);
//         } else {
//           allOrders = cacheEntry.value.orders;
//           apiSuccess = true;
//         }
//       } else {
//         fetchMode = "full";
//       }

//       if (fetchMode === "full") {
//         allOrders = await fetchOrdersForPeriod(
//           shop,
//           accessToken,
//           monthRanges[0].start,
//           monthRanges[monthRanges.length - 1].end
//         );
//         apiSuccess = true;
//         await cacheManager.set(ordersKey, { 
//           orders: allOrders, 
//           lastUpdatedAt: nowISO() 
//         }, 30 * 60 * 1000);
//       }

//     } catch (error) {
//       if (cacheEntry && cacheEntry.value.orders) {
//         allOrders = cacheEntry.value.orders;
//         apiSuccess = true;
//         fallbackUsed = true;
//       } else {
//         await cacheManager.remove(ordersKey);
//         throw error;
//       }
//     }

//     const timing = {
//       customerAnalysis: 0,
//       orderProcessing: 0,
//       calculations: 0
//     };

//     const customerStart = performance.now();
//     const customerOrderMap = buildCustomerOrderMap(allOrders, shopTimeZone);
//     const dailyCustomerAnalytics = analyzeCustomerBehavior(customerOrderMap, shopTimeZone, dailyKeys, 'daily');
//     const weeklyCustomerAnalytics = analyzeCustomerBehavior(customerOrderMap, shopTimeZone, weeklyKeys, 'weekly');
//     const monthlyCustomerAnalytics = analyzeCustomerBehavior(customerOrderMap, shopTimeZone, monthRanges.map(r => r.key), 'monthly');
//     timing.customerAnalysis = performance.now() - customerStart;

//     const orderProcessStart = performance.now();
    
//     const BATCH_SIZE = 500;
//     let processedCount = 0;
    
//     for (let i = 0; i < allOrders.length; i += BATCH_SIZE) {
//       const batch = allOrders.slice(i, i + BATCH_SIZE);
      
//       batch.forEach((order: any) => {
//         const date = new Date(order.created_at);
//         const monthKey = date.toLocaleString("default", { month: "short", year: "numeric", timeZone: shopTimeZone });
//         const dayKey = date.toLocaleDateString("en-CA", { timeZone: shopTimeZone });
        
//         const monday = new Date(date);
//         monday.setDate(date.getDate() - ((date.getDay() + 6) % 7));
//         const weekKey = `Week of ${monday.toLocaleDateString("en-CA", { timeZone: shopTimeZone })}`;

//         const orderStats = processOrderToStats(order);

//         if (totals[monthKey]) {
//           totals[monthKey] = mergeStats(totals[monthKey], orderStats);
//         }

//         if (dailyTotals[dayKey]) {
//           dailyTotals[dayKey] = {
//             ...mergeStats(dailyTotals[dayKey], orderStats),
//             newCustomers: dailyCustomerAnalytics[dayKey]?.newCustomers || 0,
//             repeatedCustomers: dailyCustomerAnalytics[dayKey]?.repeatedCustomers || 0,
//             totalCustomers: dailyCustomerAnalytics[dayKey]?.totalCustomers || 0
//           };
//         }

//         if (weeklyTotals[weekKey]) {
//           weeklyTotals[weekKey] = {
//             ...mergeStats(weeklyTotals[weekKey], orderStats),
//             newCustomers: weeklyCustomerAnalytics[weekKey]?.newCustomers || 0,
//             repeatedCustomers: weeklyCustomerAnalytics[weekKey]?.repeatedCustomers || 0,
//             totalCustomers: weeklyCustomerAnalytics[weekKey]?.totalCustomers || 0
//           };
//         }

//         if (monthlyTotals[monthKey]) {
//           monthlyTotals[monthKey] = {
//             ...mergeStats(monthlyTotals[monthKey], orderStats),
//             newCustomers: monthlyCustomerAnalytics[monthKey]?.newCustomers || 0,
//             repeatedCustomers: monthlyCustomerAnalytics[monthKey]?.repeatedCustomers || 0,
//             totalCustomers: monthlyCustomerAnalytics[monthKey]?.totalCustomers || 0
//           };
//         }
        
//         processedCount++;
//       });
//     }
    
//     timing.orderProcessing = performance.now() - orderProcessStart;

//     const calculationsStart = performance.now();
//     const totalCustomerData = calculateOverallCustomerData(customerOrderMap);
//     timing.calculations = performance.now() - calculationsStart;

//     const totalLoaderTime = performance.now() - loaderStartTime;
//     const cachePerformance = cacheManager.getPerformanceReport();

//     const result: CachedAnalyticsData = {
//       shop,
//       totals,
//       dailyTotals,
//       weeklyTotals,
//       monthlyTotals,
//       totalOrders: allOrders.length,
//       totalCustomerData,
//       monthRanges: monthRanges.map((r) => r.key),
//       dailyKeys,
//       weeklyKeys,
//       lastUpdated: new Date().toISOString(),
//       shopTimeZone,
//       shopCurrency,
//       _cacheInfo: {
//         fetchMode,
//         apiSuccess,
//         cacheHealth: cacheManager.healthReport(),
//         cacheStats: cacheManager.getStats(),
//         cacheUsed,
//         cacheHit,
//         fallbackUsed,
//         cacheTimestamp: cacheEntry?.timestamp,
//         performance: {
//           cacheOperationTime: parseFloat(cacheOperationTime.toFixed(2)),
//           totalLoaderTime: parseFloat(totalLoaderTime.toFixed(2))
//         }
//       }
//     };

//     return json(result);
    
//   } catch (error: unknown) {
//     const errorMsg = `Loader error: ${error instanceof Error ? error.message : 'Unknown error'}`;
    
//     return json({ 
//       shop: "unknown", 
//       error: errorMsg,
//       userMessage: "Sorry for the inconvenience! Please try refreshing the page.",
//       timestamp: new Date().toISOString()
//     });
//   }
// };

// // ==================== 10.0 PDF EXPORT FUNCTIONALITY ====================

// const generatePDFReport = (data: OrderData) => {
//   const printWindow = window.open('', '_blank');
//   if (!printWindow) return;

//   const timestamp = new Date().toLocaleDateString();
//   const time = new Date().toLocaleTimeString();
  
//   const totalRefunds = data.totalRefunds || 0;
//   const totalExchanges = data.totalExchanges || 0;
//   const netEventValue = data.netEventValue || 0;
  
//   const pdfContent = `
//     <!DOCTYPE html>
//     <html>
//     <head>
//       <title>Orders Dashboard Report</title>
//       <style>
//         .currency-value::before {
//           content: '${data.shopCurrency === 'EUR' ? '€' : data.shopCurrency === 'GBP' ? '£' : data.shopCurrency === 'CAD' ? 'C$' : data.shopCurrency === 'AUD' ? 'A$' : data.shopCurrency === 'JPY' ? '¥' : '$'}';
//         }
//         body { 
//           font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; 
//           margin: 40px; 
//           color: #333;
//           line-height: 1.4;
//         }
//         .header { 
//           text-align: center; 
//           border-bottom: 3px solid #2c3e50; 
//           padding-bottom: 25px; 
//           margin-bottom: 35px; 
//           background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
//           color: white;
//           padding: 30px;
//           margin: -40px -40px 35px -40px;
//           border-radius: 0 0 20px 20px;
//         }
//         .header h1 { 
//           margin: 0; 
//           color: white;
//           font-size: 2.2em;
//           font-weight: 700;
//         }
//         .header .date { 
//           color: rgba(255,255,255,0.9); 
//           margin-top: 8px;
//           font-size: 1.1em;
//         }
//         .section { 
//           margin-bottom: 40px; 
//           break-inside: avoid;
//           background: white;
//           padding: 25px;
//           border-radius: 12px;
//           box-shadow: 0 2px 10px rgba(0,0,0,0.08);
//           border-left: 4px solid #3498db;
//         }
//         .section h2 { 
//           color: #2c3e50; 
//           border-bottom: 2px solid #ecf0f1; 
//           padding-bottom: 12px; 
//           margin-bottom: 20px;
//           font-size: 1.4em;
//         }
//         .metrics-grid { 
//           display: grid; 
//           grid-template-columns: repeat(3, 1fr); 
//           gap: 25px; 
//           margin: 25px 0; 
//         }
//         .metric-card { 
//           background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
//           padding: 25px; 
//           border-radius: 10px; 
//           text-align: center; 
//           border-left: 4px solid #3498db;
//           transition: all 0.3s ease;
//         }
//         .metric-card:hover {
//           transform: translateY(-2px);
//           box-shadow: 0 5px 15px rgba(0,0,0,0.1);
//         }
//         .metric-value { 
//           font-size: 2em; 
//           font-weight: bold; 
//           color: #2c3e50; 
//           margin-bottom: 8px;
//         }
//         .metric-label { 
//           color: #666; 
//           margin-top: 8px;
//           font-weight: 600;
//         }
//         .growth-indicator {
//           display: flex;
//           align-items: center;
//           justify-content: center;
//           gap: 5px;
//           font-size: 0.9em;
//           font-weight: 600;
//           margin-top: 10px;
//           padding: 4px 12px;
//           border-radius: 20px;
//           width: fit-content;
//           margin: 10px auto 0;
//         }
//         .growth-positive {
//           background: #d4edda;
//           color: #155724;
//           border: 1px solid #c3e6cb;
//         }
//         .growth-negative {
//           background: #f8d7da;
//           color: #721c24;
//           border: 1px solid #f5c6cb;
//         }
//         .growth-arrow {
//           font-weight: bold;
//         }
//         .financial-grid { 
//           display: grid; 
//           grid-template-columns: repeat(2, 1fr); 
//           gap: 20px; 
//         }
//         .financial-card { 
//           background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
//           padding: 20px; 
//           border-radius: 8px; 
//           border-left: 4px solid #27ae60;
//           transition: all 0.3s ease;
//         }
//         .financial-card:hover {
//           transform: translateY(-2px);
//           box-shadow: 0 5px 15px rgba(0,0,0,0.1);
//         }
//         .financial-value { 
//           font-size: 1.5em; 
//           font-weight: bold; 
//           color: #2c3e50; 
//         }
//         .financial-label { 
//           color: #666; 
//           font-size: 0.9em;
//           font-weight: 600;
//         }
//         .summary-table { 
//           width: 100%; 
//           border-collapse: collapse; 
//           margin: 20px 0; 
//           box-shadow: 0 1px 3px rgba(0,0,0,0.1);
//         }
//         .summary-table th, .summary-table td { 
//           padding: 15px; 
//           text-align: left; 
//           border-bottom: 1px solid #ddd; 
//         }
//         .summary-table th { 
//           background: #f8f9fa; 
//           font-weight: bold;
//           color: #2c3e50;
//         }
//         .positive { color: #27ae60; }
//         .negative { color: #e74c3c; }
//         .footer { 
//           margin-top: 50px; 
//           padding-top: 25px; 
//           border-top: 2px solid #ddd; 
//           text-align: center; 
//           color: #666;
//           font-size: 0.9em;
//         }
//         @media print { 
//           body { margin: 20px; } 
//           .metric-card, .financial-card { break-inside: avoid; }
//           .section { break-inside: avoid; page-break-inside: avoid; }
//           .header { margin: -20px -20px 25px -20px; }
//         }
//         @page {
//           margin: 1cm;
//           size: A4;
//         }
//       </style>
//     </head>
//     <body>
//       <div class="header">
//         <h1>Orders Dashboard Report</h1>
//         <div class="date">Generated: ${timestamp} at ${time}</div>
//         <div class="date">Store Timezone: ${data.shopTimezone}</div>
//       </div>

//       <div class="section">
//         <h2>Executive Summary</h2>
//         <div class="metrics-grid">
//           <div class="metric-card">
//             <div class="metric-value">${data.totalOrders}</div>
//             <div class="metric-label">Total Orders</div>
//           </div>
//           <div class="metric-card">
//             <div class="metric-value">${data.totalCustomers}</div>
//             <div class="metric-label">Total Customers</div>
//           </div>
//           <div class="metric-card">
//             <div class="metric-value">${data.fulfillmentRate.toFixed(1)}%</div>
//             <div class="metric-label">Fulfillment Rate</div>
//           </div>
//         </div>
//       </div>

//       <div class="section">
//         <h2>Financial Overview</h2>
//         <div class="financial-grid">
//           <div class="financial-card">
//             <div class="financial-value">${data.totalRevenue.toLocaleString('en-US', { style: 'currency', currency: data.shopCurrency || 'USD' })}</div>
//             <div class="financial-label">Total Revenue</div>
//           </div>
//           <div class="financial-card">
//             <div class="financial-value">${data.netRevenue.toLocaleString('en-US', { style: 'currency', currency: data.shopCurrency || 'USD' })}</div>
//             <div class="financial-label">Net Revenue</div>
//           </div>
//           <div class="financial-card">
//             <div class="financial-value">${data.averageOrderValue.toLocaleString('en-US', { style: 'currency', currency: data.shopCurrency || 'USD' })}</div>
//             <div class="financial-label">Average Order Value</div>
//           </div>
//           <div class="financial-card">
//             <div class="financial-value">${data.totalItems}</div>
//             <div class="financial-label">Total Items Sold</div>
//           </div>
//         </div>
//       </div>

//       <div class="section">
//         <h2>Today's Performance</h2>
//         <div class="metrics-grid">
//           <div class="metric-card">
//             <div class="metric-value">${data.todayOrders}</div>
//             <div class="metric-label">Today's Orders</div>
//             ${data.ordersChangeVsYesterday !== 0 ? `
//               <div class="growth-indicator ${data.ordersChangeVsYesterday >= 0 ? 'growth-positive' : 'growth-negative'}">
//                 <span class="growth-arrow">${data.ordersChangeVsYesterday >= 0 ? '↗' : '↘'}</span>
//                 ${Math.abs(data.ordersChangeVsYesterday).toFixed(1)}% vs yesterday
//               </div>
//             ` : '<div class="growth-indicator" style="visibility: hidden;">-</div>'}
//           </div>
//           <div class="metric-card">
//             <div class="metric-value">${data.todayRevenue.toLocaleString('en-US', { style: 'currency', currency: data.shopCurrency || 'USD' })}</div>
//             <div class="metric-label">Today's Revenue</div>
//             ${data.revenueChangeVsYesterday !== 0 ? `
//               <div class="growth-indicator ${data.revenueChangeVsYesterday >= 0 ? 'growth-positive' : 'growth-negative'}">
//                 <span class="growth-arrow">${data.revenueChangeVsYesterday >= 0 ? '↗' : '↘'}</span>
//                 ${Math.abs(data.revenueChangeVsYesterday).toFixed(1)}% vs yesterday
//               </div>
//             ` : '<div class="growth-indicator" style="visibility: hidden;">-</div>'}
//           </div>
//           <div class="metric-card">
//             <div class="metric-value">${data.todayItems}</div>
//             <div class="metric-label">Items Ordered Today</div>
//             ${data.itemsChangeVsYesterday !== 0 ? `
//               <div class="growth-indicator ${data.itemsChangeVsYesterday >= 0 ? 'growth-positive' : 'growth-negative'}">
//                 <span class="growth-arrow">${data.itemsChangeVsYesterday >= 0 ? '↗' : '↘'}</span>
//                 ${Math.abs(data.itemsChangeVsYesterday).toFixed(1)}% vs yesterday
//               </div>
//             ` : '<div class="growth-indicator" style="visibility: hidden;">-</div>'}
//           </div>
//         </div>
//       </div>

//       <div class="section">
//         <h2>Customer Insights</h2>
//         <div class="financial-grid">
//           <div class="financial-card">
//             <div class="financial-value">${data.newCustomers}</div>
//             <div class="financial-label">New Customers</div>
//           </div>
//           <div class="financial-card">
//             <div class="financial-value">${data.repeatCustomers}</div>
//             <div class="financial-label">Repeat Customers</div>
//           </div>
//           <div class="financial-card">
//             <div class="financial-value">${data.customerRetentionRate.toFixed(1)}%</div>
//             <div class="financial-label">Retention Rate</div>
//           </div>
//           <div class="financial-card">
//             <div class="financial-value">${data.averageOrderFrequency.toFixed(1)}</div>
//             <div class="financial-label">Avg Order Frequency</div>
//           </div>
//         </div>
//       </div>

//       <div class="section">
//         <h2>Event Summary</h2>
//         <div class="financial-grid">
//           <div class="financial-card">
//             <div class="financial-value">${data.totalRefunds || 0}</div>
//             <div class="financial-label">Full Refunds</div>
//           </div>
//           <div class="financial-card">
//             <div class="financial-value">${data.totalPartialRefunds || 0}</div>
//             <div class="financial-label">Partial Refunds</div>
//           </div>
//           <div class="financial-card">
//             <div class="financial-value">${data.totalExchanges || 0}</div>
//             <div class="financial-label">Exchanges</div>
//           </div>
//           <div class="financial-card">
//             <div class="financial-value">${(data.netEventValue || 0).toLocaleString('en-US', { style: 'currency', currency: data.shopCurrency || 'USD' })}</div>
//             <div class="financial-label">Net Event Impact</div>
//           </div>
//         </div>
//         <div style="text-align: center; margin-top: 16px; color: #666; font-size: 0.9em;">
//           Across ${data.totalEvents || 0} total events in ${data.ordersWithEvents || 0} orders
//         </div>
//       </div>

//       <div class="footer">
//         <p><strong>Orders Dashboard Summary Report</strong> - Key Business Metrics</p>
//         <p>Generated by Nexus | ${timestamp}</p>
//       </div>
//     </body>
//     </html>
//   `;

//   printWindow.document.write(pdfContent);
//   printWindow.document.close();
  
//   setTimeout(() => {
//     printWindow.print();
//     printWindow.onafterprint = () => {
//       setTimeout(() => {
//         printWindow.close();
//       }, 100);
//     };
//   }, 1000);
// };

// // ==================== 11.0 ICON COMPONENTS ====================

// const Icon = {
//   Print: () => (
//     <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
//       <path d="M19 8H5c-1.66 0-3 1.34-3 3v6h4v4h12v-4h4v-6c0-1.66-1.34-3-3-3zm-3 11H8v-5h8v5zm3-7c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1zm-1-9H6v4h12V3z"/>
//     </svg>
//   ),
//   TrendUp: () => (
//     <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
//       <path d="M16 6l2.29 2.29-4.88 4.88-4-4L2 16.59 3.41 18l6-6 4 4 6.3-6.29L22 12V6z"/>
//     </svg>
//   ),
//   TrendDown: () => (
//     <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
//       <path d="M16 18l2.29-2.29-4.88-4.88-4 4L2 7.41 3.41 6l6 6 4-4 6.3 6.29L22 12v6z"/>
//     </svg>
//   ),
//   Export: () => (
//     <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
//       <path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z"/>
//     </svg>
//   )
// };

// const SvgIcons = {
//   Chart: () => (
//     <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
//       <path d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z"/>
//     </svg>
//   ),
//   TrendingUp: () => (
//     <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
//       <path d="M16 6l2.29 2.29-4.88 4.88-4-4L2 16.59 3.41 18l6-6 4 4 6.3-6.29L22 12V6z"/>
//     </svg>
//   ),
//   Dollar: () => (
//     <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
//       <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1.41 16.09V20h-2.67v-1.93c-1.71-.36-3.16-1.46-3.27-3.4h1.96c.1 1.05.82 1.87 2.65 1.87 1.96 0 2.4-.98 2.4-1.59 0-.83-.44-1.61-2.67-2.14-2.48-.6-4.18-1.62-4.18-3.67 0-1.72 1.39-2.84 3.11-3.21V4h2.67v1.95c1.86.45 2.79 1.86 2.85 3.39H14.3c-.05-1.11-.64-1.87-2.22-1.87-1.5 0-2.4.68-2.4 1.64 0 .84.65 1.39 2.67 1.91s4.18 1.39 4.18 3.91c-.01 1.78-1.18 2.73-3.12 3.16z"/>
//     </svg>
//   ),
//   Rocket: () => (
//     <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
//       <path d="M2.81 14.12L5.64 11.29l-1.41-1.42L1.42 12.7l1.39 1.42zM14.12 2.81L11.29 5.64l1.42 1.41 1.41-1.41-1.41-1.42zm8.03 9.91l-1.39-1.42-2.81 2.81 1.41 1.42 2.79-2.81zM7.34 12.5l4.16-4.16L12.5 7.34 8.34 11.5 7.34 12.5zM19.67 7.34l1.39-1.39c.38-.38.38-1.02 0-1.41l-1.39-1.39c-.38-.38-1.02-.38-1.41 0l-1.39 1.39 1.41 1.41 1.39-1.39zM5.63 19.67l1.39 1.39c.38.38 1.02.38 1.41 0l1.39-1.39-1.41-1.41-1.39 1.39zM3.52 15.62c-.39-.39-.39-1.02 0-1.41l1.39-1.39 1.41 1.41-1.39 1.39c-.38.38-1.02.38-1.41 0z"/>
//     </svg>
//   ),
//   Users: () => (
//     <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
//       <path d="M16 4c0-1.11.89-2 2-2s2 .89 2 2-.89 2-2 2-2-.89-2-2zm4 18v-6h2.5l-2.54-7.63A2.01 2.01 0 0018.06 7h-.12a2 2 0 00-1.9 1.37l-.86 2.58c1.08.6 1.82 1.73 1.82 3.05v8h3zm-7.5-10.5c.83 0 1.5-.67 1.5-1.5s-.67-1.5-1.5-1.5S11 9.17 11 10s.67 1.5 1.5 1.5zM5.5 6c1.11 0 2-.89 2-2s-.89-2-2-2-2 .89-2 2 .89 2 2 2zm2 16v-7H9V9c0-1.1-.9-2-2-2H4c-1.1 0-2 .9-2 2v6h1.5v7h4zm6.5 0v-4h1v-4c0-.82-.68-1.5-1.5-1.5h-2c-.82 0-1.5.68-1.5 1.5v4h1v4h3z"/>
//     </svg>
//   ),
//   Activity: () => (
//     <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
//       <path d="M13 7h-2v6h6v-2h-4V7zM3 3v18h18V3H3zm16 16H5V5h14v14z"/>
//     </svg>
//   ),
//   Warning: () => (
//     <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
//       <path d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z"/>
//     </svg>
//   ),
//   Analytics: () => (
//     <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
//       <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4z"/>
//     </svg>
//   )
// };

// // ==================== 12.0 LOADING COMPONENT ====================

// function LoadingProgress() {
//   const loadingSteps = [
//     "Fetching recent orders...",
//     "Analyzing revenue data...", 
//     "Processing customer insights...",
//     "Calculating fulfillment rates...",
//     "Generating sales analytics..."
//   ];

//   return (
//     <div className="loading-progress-container">
//       <div className="loading-header">
//         <h2>Loading Analytics Dashboard</h2>
//         <p>Analyzing your order data and generating insights...</p>
//       </div>
      
//       <div className="progress-bar-container">
//         <div className="progress-bar">
//           <div className="progress-fill"></div>
//         </div>
//       </div>

//       <div className="loading-steps">
//         {loadingSteps.map((step, index) => (
//           <div key={index} className="loading-step">
//             <div className="step-indicator"></div>
//             <div className="step-text">{step}</div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }

// // ==================== 13.0 CHART COMPONENTS ====================

// const ChartComponents = {
//   formatCurrency: (amount: number, currency: string = 'USD') => {
//     return amount.toLocaleString('en-US', { 
//       style: 'currency', 
//       currency: currency,
//       minimumFractionDigits: 2 
//     });
//   },

//   CustomerDistribution: ({ data }: { data: AnalyticsData }) => {
//     const chartData = {
//       labels: ['New Customers', 'Repeat Customers'],
//       datasets: [
//         {
//           data: [data.totalCustomerData.newCustomers, data.totalCustomerData.repeatedCustomers],
//           backgroundColor: ['#f59e0b', '#10b981'],
//           borderWidth: 2,
//           borderColor: '#fff'
//         }
//       ]
//     };

//     const options = {
//       responsive: true,
//       maintainAspectRatio: false,
//       plugins: { legend: { display: false } },
//       animation: { duration: 500 }
//     };

//     return (
//       <div className="chart-container">
//         <div className="chart-header">
//           <div className="chart-title">Customer Distribution</div>
//           <div className="chart-legend">
//             <div className="legend-item">
//               <div className="legend-color new"></div>
//               <span>New</span>
//             </div>
//             <div className="legend-item">
//               <div className="legend-color repeat"></div>
//               <span>Repeat</span>
//             </div>
//           </div>
//         </div>
//         <Pie data={chartData} options={options} height={120} />
//         <div className="mini-stats">
//           <div className="mini-stat-card">
//             <div className="mini-stat-value">
//               {data.totalCustomerData.totalCustomers > 0 
//                 ? `${((data.totalCustomerData.repeatedCustomers / data.totalCustomerData.totalCustomers) * 100).toFixed(1)}%`
//                 : '0.0%'
//               }
//             </div>
//             <div className="mini-stat-label">Repeat Rate</div>
//           </div>
//           <div className="mini-stat-card">
//             <div className="mini-stat-value">{data.totalCustomerData.totalCustomers}</div>
//             <div className="mini-stat-label">Total Customers</div>
//           </div>
//         </div>
//       </div>
//     );
//   },

//   RevenueTrend: ({ data }: { data: AnalyticsData }) => {
//     const weeklyData = data.weeklyKeys.map(week => {
//       const weekData = data.weeklyTotals[week];
//       return {
//         week: week.replace('Week of ', ''),
//         revenue: weekData?.total || 0,
//         totalSales: weekData?.totalSales || 0
//       };
//     });

//     const totalRevenue = weeklyData.reduce((sum, w) => sum + w.revenue, 0);
//     const totalSales = weeklyData.reduce((sum, w) => sum + w.totalSales, 0);
//     const avgWeeklyRevenue = totalRevenue / weeklyData.length;

//     const chartData = {
//       labels: weeklyData.map(w => w.week),
//       datasets: [
//         {
//           label: 'Revenue',
//           data: weeklyData.map(w => w.revenue),
//           borderColor: '#3b82f6',
//           backgroundColor: 'rgba(59, 130, 246, 0.1)',
//           tension: 0.4,
//           fill: true,
//           borderWidth: 2
//         }
//       ]
//     };

//     const options = {
//       responsive: true,
//       maintainAspectRatio: false,
//       plugins: { legend: { display: false } },
//       scales: {
//         x: { grid: { display: false } },
//         y: { 
//           beginAtZero: true,
//           ticks: {
//             callback: function(this: any, value: any) {
//               return '$' + value;
//             }
//           }
//         }
//       }
//     };

//     return (
//       <div className="chart-container">
//         <div className="chart-header">
//           <div className="chart-title">Weekly Revenue Trend</div>
//           <div className="chart-legend">
//             <div className="legend-item">
//               <div className="legend-color revenue"></div>
//               <span>Revenue</span>
//             </div>
//           </div>
//         </div>
//         <Line data={chartData} options={options} height={120} />
//         <div className="mini-stats">
//           <div className="mini-stat-card">
//             <div className="mini-stat-value">
//               {ChartComponents.formatCurrency(totalRevenue, data.shopCurrency)}
//             </div>
//             <div className="mini-stat-label">Total Revenue</div>
//           </div>
//           <div className="mini-stat-card">
//             <div className="mini-stat-value">
//               {ChartComponents.formatCurrency(avgWeeklyRevenue, data.shopCurrency)}
//             </div>
//             <div className="mini-stat-label">Avg Weekly</div>
//           </div>
//           <div className="mini-stat-card">
//             <div className="mini-stat-value">
//               {ChartComponents.formatCurrency(totalSales, data.shopCurrency)}
//             </div>
//             <div className="mini-stat-label">Total Sales</div>
//           </div>
//         </div>
//       </div>
//     );
//   },

//   MonthlyPerformance: ({ data }: { data: AnalyticsData }) => {
//     const monthlyData = data.monthRanges.map(month => {
//       const monthData = data.monthlyTotals[month];
//       return {
//         month: month,
//         revenue: monthData?.total || 0,
//         orders: monthData?.orderCount || 0,
//         totalSales: monthData?.totalSales || 0
//       };
//     });

//     const totalRevenue = monthlyData.reduce((sum, m) => sum + m.revenue, 0);
//     const totalOrders = monthlyData.reduce((sum, m) => sum + m.orders, 0);
//     const totalSales = monthlyData.reduce((sum, m) => sum + m.totalSales, 0);
//     const avgMonthlyRevenue = totalRevenue / monthlyData.length;

//     const chartData = {
//       labels: monthlyData.map(m => m.month),
//       datasets: [
//         {
//           label: 'Revenue',
//           data: monthlyData.map(m => m.revenue),
//           backgroundColor: 'rgba(59, 130, 246, 0.8)',
//           borderRadius: 4
//         },
//         {
//           label: 'Orders',
//           data: monthlyData.map(m => m.orders),
//           backgroundColor: 'rgba(139, 92, 246, 0.8)',
//           borderRadius: 4
//         }
//       ]
//     };

//     const options = {
//       responsive: true,
//       maintainAspectRatio: false,
//       plugins: { legend: { display: false } },
//       scales: {
//         x: { grid: { display: false } },
//         y: { beginAtZero: true }
//       }
//     };

//     return (
//       <div className="chart-container">
//         <div className="chart-header">
//           <div className="chart-title">Monthly Performance</div>
//           <div className="chart-legend">
//             <div className="legend-item">
//               <div className="legend-color revenue"></div>
//               <span>Revenue</span>
//             </div>
//             <div className="legend-item">
//               <div className="legend-color orders"></div>
//               <span>Orders</span>
//             </div>
//           </div>
//         </div>
//         <Bar data={chartData} options={options} height={120} />
//         <div className="mini-stats">
//           <div className="mini-stat-card">
//             <div className="mini-stat-value">
//               {ChartComponents.formatCurrency(totalRevenue, data.shopCurrency)}
//             </div>
//             <div className="mini-stat-label">Total Revenue</div>
//           </div>
//           <div className="mini-stat-card">
//             <div className="mini-stat-value">
//               {totalOrders}
//             </div>
//             <div className="mini-stat-label">Total Orders</div>
//           </div>
//           <div className="mini-stat-card">
//             <div className="mini-stat-value">
//               {ChartComponents.formatCurrency(totalSales, data.shopCurrency)}
//             </div>
//             <div className="mini-stat-label">Total Sales</div>
//           </div>
//         </div>
//       </div>
//     );
//   },

//   FinancialBreakdown: ({ data }: { data: AnalyticsData }) => {
//     const financialData = {
//       grossRevenue: Object.values(data.totals).reduce((sum: number, month: OrderStats) => sum + month.total, 0),
//       netRevenue: Object.values(data.totals).reduce((sum: number, month: OrderStats) => sum + month.totalSales, 0),
//       discounts: Object.values(data.totals).reduce((sum: number, month: OrderStats) => sum + month.discounts, 0),
//       shipping: Object.values(data.totals).reduce((sum: number, month: OrderStats) => sum + month.shipping, 0),
//       taxes: Object.values(data.totals).reduce((sum: number, month: OrderStats) => sum + month.taxes, 0),
//       returns: Object.values(data.totals).reduce((sum: number, month: OrderStats) => sum + month.returns, 0)
//     };

//     const chartData = {
//       labels: ['Gross Revenue', 'Discounts', 'Shipping', 'Taxes', 'Returns'],
//       datasets: [
//         {
//           data: [
//             financialData.grossRevenue,
//             financialData.discounts,
//             financialData.shipping,
//             financialData.taxes,
//             financialData.returns
//           ],
//           backgroundColor: ['#3b82f6', '#f59e0b', '#10b981', '#8b5cf6', '#ef4444'],
//           borderWidth: 2,
//           borderColor: '#fff'
//         }
//       ]
//     };

//     const options = {
//       responsive: true,
//       maintainAspectRatio: false,
//       plugins: { legend: { display: false } }
//     };

//     return (
//       <div className="chart-container">
//         <div className="chart-header">
//           <div className="chart-title">Financial Breakdown</div>
//           <div className="chart-legend">
//             <div className="legend-item">
//               <div className="legend-color revenue"></div>
//               <span>Revenue</span>
//             </div>
//             <div className="legend-item">
//               <div className="legend-color discounts"></div>
//               <span>Discounts</span>
//             </div>
//             <div className="legend-item">
//               <div className="legend-color shipping"></div>
//               <span>Shipping</span>
//             </div>
//             <div className="legend-item">
//               <div className="legend-color taxes"></div>
//               <span>Taxes</span>
//             </div>
//             <div className="legend-item">
//               <div className="legend-color returns"></div>
//               <span>Returns</span>
//             </div>
//           </div>
//         </div>
//         <Pie data={chartData} options={options} height={120} />
//         <div className="mini-stats">
//           <div className="mini-stat-card">
//             <div className="mini-stat-value">
//               {ChartComponents.formatCurrency(financialData.netRevenue, data.shopCurrency)}
//             </div>
//             <div className="mini-stat-label">Net Revenue</div>
//           </div>
//           <div className="mini-stat-card">
//             <div className="mini-stat-value">
//               {financialData.grossRevenue > 0 
//                 ? `${((Math.abs(financialData.returns) / financialData.grossRevenue) * 100).toFixed(1)}%`
//                 : '0.0%'
//               }
//             </div>
//             <div className="mini-stat-label">Return Rate</div>
//           </div>
//         </div>
//       </div>
//     );
//   }
// };

// // ==================== 14.0 EVENT SUMMARY COMPONENT ====================

// function EventSummaryDisplay({ eventSummary, title }: { eventSummary: EventSummary, title: string }) {
//   if (!eventSummary || eventSummary.totalEvents === 0) {
//     return null;
//   }

//   const formatValue = (value: number) => {
//     const absValue = Math.abs(value);
//     const sign = value < 0 ? '-' : value > 0 ? '+' : '';
//     return `${sign}$${absValue.toFixed(2)}`;
//   };

//   return (
//     <section className="event-summary-display">
//       <h3>{title} ({eventSummary.totalEvents} event{eventSummary.totalEvents !== 1 ? 's' : ''})</h3>
      
//       <div className="event-summary-grid">
//         {eventSummary.refunds.count > 0 && (
//           <div className="event-card refunds">
//             <div className="event-label">Full Refunds</div>
//             <div className="event-value">{formatValue(eventSummary.refunds.value)}</div>
//             <div className="event-count">
//               {eventSummary.refunds.count} refund{eventSummary.refunds.count !== 1 ? 's' : ''}
//             </div>
//           </div>
//         )}

//         {eventSummary.partialRefunds.count > 0 && (
//           <div className="event-card partial-refunds">
//             <div className="event-label">Partial Refunds</div>
//             <div className="event-value">{formatValue(eventSummary.partialRefunds.value)}</div>
//             <div className="event-count">
//               {eventSummary.partialRefunds.count} refund{eventSummary.partialRefunds.count !== 1 ? 's' : ''}
//             </div>
//           </div>
//         )}

//         {eventSummary.exchanges.count > 0 && (
//           <div className="event-card exchanges">
//             <div className="event-label">Exchanges</div>
//             <div className="event-value">{formatValue(eventSummary.exchanges.value)}</div>
//             <div className="event-count">
//               {eventSummary.exchanges.count} exchange{eventSummary.exchanges.count !== 1 ? 's' : ''}
//             </div>
//           </div>
//         )}

//         <div className="event-card net-summary">
//           <div className="event-label">Net Impact</div>
//           <div className="event-value">{formatValue(eventSummary.netValue)}</div>
//           <div className="event-count">
//             across {eventSummary.totalEvents} event{eventSummary.totalEvents !== 1 ? 's' : ''}
//           </div>
//         </div>
//       </div>
//     </section>
//   );
// }

// // ==================== 15.0 MISMATCH SUMMARY COMPONENT ====================

// function MismatchSummaryCard({ mismatchSummary, periodType }: { 
//   mismatchSummary: { 
//     totalMismatches: number; 
//     totalDifference: number; 
//     hasMismatches: boolean; 
//   };
//   periodType: 'day' | 'week' | 'month';
// }) {
//   if (!mismatchSummary.hasMismatches) {
//     return null;
//   }

//   const getPeriodLabel = () => {
//     switch (periodType) {
//       case 'day': return 'Days';
//       case 'week': return 'Weeks'; 
//       case 'month': return 'Months';
//       default: return 'Periods';
//     }
//   };

//   const getDifferenceColor = (difference: number) => {
//     return Math.abs(difference) > 0.01 ? '#dc2626' : '#059669';
//   };

//   const getDifferenceText = (difference: number) => {
//     const absDiff = Math.abs(difference);
//     if (absDiff <= 0.01) return 'Perfect Match';
//     return `$${absDiff.toFixed(2)}`;
//   };

//   return (
//     <section className="mismatch-summary-card">
//       <h3>Calculation Verification</h3>
      
//       <div className="mismatch-summary-content">
//         <div className="mismatch-metric">
//           <div className="mismatch-value">{mismatchSummary.totalMismatches}</div>
//           <div className="mismatch-label">{getPeriodLabel()} with Mismatches</div>
//         </div>
        
//         <div className="mismatch-metric">
//           <div 
//             className="mismatch-value" 
//             style={{ color: getDifferenceColor(mismatchSummary.totalDifference) }}
//           >
//             {getDifferenceText(mismatchSummary.totalDifference)}
//           </div>
//           <div className="mismatch-label">Total Difference</div>
//         </div>
//       </div>
      
//       <div className="mismatch-note">
//         {mismatchSummary.totalMismatches > 0 ? (
//           <span style={{ color: '#dc2626' }}>
//             Found {mismatchSummary.totalMismatches} {getPeriodLabel().toLowerCase()} with calculation discrepancies
//           </span>
//         ) : (
//           <span style={{ color: '#059669' }}>
//             All calculations match perfectly!
//           </span>
//         )}
//       </div>
//     </section>
//   );
// }

// // ==================== 16.0 MAIN REACT COMPONENT ====================

// function ShopifyAnalyticsPage() {
//   const data = useLoaderData<typeof loader>();
//   const [isLoading, setIsLoading] = useState(true);
//   const [isExporting, setIsExporting] = useState(false);
//   const [isManualRefresh, setIsManualRefresh] = useState(false);

//   const handleManualRefresh = () => {
//     setIsManualRefresh(true);
//     setIsLoading(true);
//     window.location.reload();
//   }

//   useEffect(() => {
//     if (data && !("error" in data)) {
//       setIsLoading(false);
//     }
//   }, [data]);

//   if (isLoading && isManualRefresh) {
//     return (
//       <div className="orders-dashboard">
//         <div className="dashboard-header">
//           <h1>Analytics Dashboard</h1>
//         </div>
//         <div className="loading-progress-container">
//           <div className="loading-header">
//             <h2>Refreshing Your Data</h2>
//             <p>Please wait while we update your analytics...</p>
//           </div>
          
//           <div className="progress-bar-container">
//             <div className="progress-bar">
//               <div className="progress-fill"></div>
//             </div>
//           </div>

//           <div className="loading-steps">
//             {[
//               "Refreshing order data...",
//               "Updating revenue calculations...", 
//               "Processing customer insights...",
//               "Recalculating metrics...",
//               "Finalizing your dashboard..."
//             ].map((step, index) => (
//               <div key={index} className="loading-step">
//                 <div className="step-indicator"></div>
//                 <div className="step-text">{step}</div>
//               </div>
//             ))}
//           </div>
//         </div>
//       </div>
//     );
//   }

//   if (isLoading) {
//     return (
//       <div className="orders-dashboard">
//         <div className="dashboard-header">
//           <h1>Analytics Dashboard</h1>
//         </div>
//         <LoadingProgress />
//       </div>
//     );
//   }

//   const getSafeData = (data: any): CachedAnalyticsData | null => {
//     if (!data || typeof data !== 'object') return null;
    
//     const safeData: CachedAnalyticsData = {
//       shop: data.shop || 'unknown',
//       totals: data.totals || {},
//       dailyTotals: data.dailyTotals || {},
//       weeklyTotals: data.weeklyTotals || {},
//       monthlyTotals: data.monthlyTotals || {},
//       totalOrders: typeof data.totalOrders === 'number' ? data.totalOrders : 0,
//       totalCustomerData: data.totalCustomerData || { newCustomers: 0, repeatedCustomers: 0, totalCustomers: 0 },
//       monthRanges: Array.isArray(data.monthRanges) ? data.monthRanges : [],
//       dailyKeys: Array.isArray(data.dailyKeys) ? data.dailyKeys : [],
//       weeklyKeys: Array.isArray(data.weeklyKeys) ? data.weeklyKeys : [],
//       lastUpdated: data.lastUpdated || new Date().toISOString(),
//       shopTimeZone: data.shopTimeZone || 'UTC',
//       shopCurrency: data.shopCurrency || 'USD',
//       _cacheInfo: data._cacheInfo || undefined
//     };

//     return safeData;
//   };

//   const safeNumber = (value: unknown) => (typeof value === "number" ? value : 0);
  
//   const getSafeCustomerStats = (stats: Record<string, OrderStats & CustomerData>, key: string): OrderStats & CustomerData => {
//     const stat = stats[key];
//     if (!stat) {
//       return {
//         total: 0,
//         discounts: 0,
//         returns: 0,
//         netSales: 0,
//         shipping: 0,
//         taxes: 0,
//         extraFees: 0,
//         totalSales: 0,
//         shippingRefunds: 0,
//         netReturns: 0,
//         totalRefund: 0,
//         items: 0,
//         fulfilled: 0,
//         unfulfilled: 0,
//         orderCount: 0,
//         hasSubsequentEvents: false,
//         eventSummary: null,
//         refundsCount: 0,
//         financialStatus: 'pending',
//         newCustomers: 0,
//         repeatedCustomers: 0,
//         totalCustomers: 0,
//         discountsReturned: 0,
//         netDiscounts: 0,
//         returnShippingCharges: 0,
//         restockingFees: 0,
//         returnFees: 0,
//         refundDiscrepancy: 0
//       };
//     }
//     return stat;
//   };

//   const getCalculationMismatchSummary = (data: AnalyticsData) => {
//     let totalMismatches = 0;
//     let totalDifference = 0;

//     Object.values(data.dailyTotals).forEach(dayData => {
//       const calculatedTotal = dayData.netSales + dayData.shipping + dayData.taxes + dayData.extraFees;
//       const mismatch = Math.abs(dayData.totalSales - calculatedTotal) > 0.01;
      
//       if (mismatch) {
//         totalMismatches++;
//         const difference = calculatedTotal - dayData.totalSales;
//         totalDifference += difference;
//       }
//     });

//     return {
//       totalMismatches,
//       totalDifference: parseFloat(totalDifference.toFixed(2)),
//       hasMismatches: totalMismatches > 0
//     };
//   };

//   const getTodayMismatchSummary = (data: AnalyticsData) => {
//     const todayKey = new Date().toLocaleDateString("en-CA", { timeZone: data.shopTimeZone });
//     const todayData = getSafeCustomerStats(data.dailyTotals, todayKey);
    
//     const calculatedTotal = todayData.netSales + todayData.shipping + todayData.taxes + todayData.extraFees;
//     const mismatch = Math.abs(todayData.totalSales - calculatedTotal) > 0.01;
    
//     return {
//       totalMismatches: mismatch ? 1 : 0,
//       totalDifference: mismatch ? (calculatedTotal - todayData.totalSales) : 0,
//       hasMismatches: mismatch
//     };
//   };

//   const getWeeklyMismatchSummary = (data: AnalyticsData) => {
//     let totalMismatches = 0;
//     let totalDifference = 0;

//     Object.values(data.weeklyTotals).forEach(weekData => {
//       const calculatedTotal = weekData.netSales + weekData.shipping + weekData.taxes + weekData.extraFees;
//       const mismatch = Math.abs(weekData.totalSales - calculatedTotal) > 0.01;
      
//       if (mismatch) {
//         totalMismatches++;
//         totalDifference += (calculatedTotal - weekData.totalSales);
//       }
//     });

//     return {
//       totalMismatches,
//       totalDifference: parseFloat(totalDifference.toFixed(2)),
//       hasMismatches: totalMismatches > 0
//     };
//   };

//   const getMonthlyMismatchSummary = (data: AnalyticsData) => {
//     let totalMismatches = 0;
//     let totalDifference = 0;

//     Object.values(data.monthlyTotals).forEach(monthData => {
//       const calculatedTotal = monthData.netSales + monthData.shipping + monthData.taxes + monthData.extraFees;
//       const mismatch = Math.abs(monthData.totalSales - calculatedTotal) > 0.01;
      
//       if (mismatch) {
//         totalMismatches++;
//         totalDifference += (calculatedTotal - monthData.totalSales);
//       }
//     });

//     return {
//       totalMismatches,
//       totalDifference: parseFloat(totalDifference.toFixed(2)),
//       hasMismatches: totalMismatches > 0
//     };
//   };

//   const getTodayData = () => {
//     const safeData = getSafeData(data);
//     if (!safeData) return null;
    
//     const todayKey = new Date().toLocaleDateString("en-CA", { timeZone: safeData.shopTimeZone });
//     const todayData = getSafeCustomerStats(safeData.dailyTotals, todayKey);
    
//     return {
//       ...todayData,
//       ordersWithSubsequentEvents: todayData.hasSubsequentEvents ? 1 : 0,
//       subsequentEventsCount: todayData.eventSummary?.totalEvents || 0,
//       subsequentEventsValue: todayData.eventSummary ? Math.abs(todayData.eventSummary.netValue) : 0
//     };
//   };

//   const getLast7DaysData = () => {
//     const safeData = getSafeData(data);
//     if (!safeData) return null;

//     let totalRevenue = 0;
//     let totalOrders = 0;
//     let totalItems = 0;
//     let totalNewCustomers = 0;
//     let totalRepeatCustomers = 0;
//     let totalFulfilled = 0;
//     let totalUnfulfilled = 0;
//     let totalDiscounts = 0;
//     let totalReturns = 0;
//     let totalNetSales = 0;
//     let totalShipping = 0;
//     let totalTaxes = 0;
//     let totalExtraFees = 0;
//     let totalTotalSales = 0;
//     let totalShippingRefunds = 0;
//     let totalNetReturns = 0;
//     let totalTotalRefund = 0;

//     const periodEventSummary: EventSummary = {
//       refunds: { count: 0, value: 0 },
//       exchanges: { count: 0, value: 0 },
//       partialRefunds: { count: 0, value: 0 },
//       totalEvents: 0,
//       netValue: 0
//     };

//     let ordersWithEventsCount = 0;
//     let totalEventsValue = 0;

//     safeData.dailyKeys.forEach(day => {
//       const dayData = getSafeCustomerStats(safeData.dailyTotals, day);
//       totalRevenue += dayData.total;
//       totalOrders += dayData.orderCount;
//       totalItems += dayData.items;
//       totalNewCustomers += dayData.newCustomers;
//       totalRepeatCustomers += dayData.repeatedCustomers;
//       totalFulfilled += dayData.fulfilled;
//       totalUnfulfilled += dayData.unfulfilled;
//       totalDiscounts += dayData.discounts;
//       totalReturns += dayData.returns;
//       totalNetSales += dayData.netSales;
//       totalShipping += dayData.shipping;
//       totalTaxes += dayData.taxes;
//       totalExtraFees += dayData.extraFees;
//       totalTotalSales += dayData.totalSales;
//       totalShippingRefunds += dayData.shippingRefunds;
//       totalNetReturns += dayData.netReturns;
//       totalTotalRefund += dayData.totalRefund;
      
//       if (dayData.eventSummary) {
//         ordersWithEventsCount += dayData.hasSubsequentEvents ? 1 : 0;
        
//         periodEventSummary.refunds.count += dayData.eventSummary.refunds.count;
//         periodEventSummary.refunds.value += dayData.eventSummary.refunds.value;
//         periodEventSummary.exchanges.count += dayData.eventSummary.exchanges.count;
//         periodEventSummary.exchanges.value += dayData.eventSummary.exchanges.value;
//         periodEventSummary.partialRefunds.count += dayData.eventSummary.partialRefunds.count;
//         periodEventSummary.partialRefunds.value += dayData.eventSummary.partialRefunds.value;
//         periodEventSummary.totalEvents += dayData.eventSummary.totalEvents;
//         periodEventSummary.netValue += dayData.eventSummary.netValue;

//         totalEventsValue += Math.abs(dayData.eventSummary.netValue);
//       }
//     });

//     return {
//       totalRevenue,
//       totalOrders,
//       totalItems,
//       totalNewCustomers,
//       totalRepeatCustomers,
//       totalFulfilled,
//       totalUnfulfilled,
//       totalDiscounts,
//       totalReturns,
//       totalNetSales,
//       totalShipping,
//       totalTaxes,
//       totalExtraFees,
//       totalTotalSales,
//       totalShippingRefunds,
//       totalNetReturns,
//       totalTotalRefund,
//       eventSummary: periodEventSummary,
//       ordersWithSubsequentEvents: ordersWithEventsCount,
//       subsequentEventsCount: periodEventSummary.totalEvents,
//       subsequentEventsValue: parseFloat(totalEventsValue.toFixed(2)),
//       avgDailyRevenue: totalRevenue / 7,
//       discountRate: totalRevenue > 0 ? (totalDiscounts / totalRevenue) * 100 : 0,
//       shippingRate: totalRevenue > 0 ? (totalShipping / totalRevenue) * 100 : 0,
//       taxRate: totalRevenue > 0 ? (totalTaxes / totalRevenue) * 100 : 0,
//       returnRate: totalRevenue > 0 ? (totalReturns / totalRevenue) * 100 : 0
//     };
//   };

//   const getWeeklyFinancials = () => {
//     const safeData = getSafeData(data);
//     if (!safeData) return null;

//     let totalRevenue = 0;
//     let totalOrders = 0;
//     let totalItems = 0;
//     let totalDiscounts = 0;
//     let totalReturns = 0;
//     let totalNetSales = 0;
//     let totalShipping = 0;
//     let totalTaxes = 0;
//     let totalExtraFees = 0;
//     let totalTotalSales = 0;
//     let totalShippingRefunds = 0;
//     let totalNetReturns = 0;
//     let totalTotalRefund = 0;

//     const periodEventSummary: EventSummary = {
//       refunds: { count: 0, value: 0 },
//       exchanges: { count: 0, value: 0 },
//       partialRefunds: { count: 0, value: 0 },
//       totalEvents: 0,
//       netValue: 0
//     };

//     let ordersWithEventsCount = 0;
//     let totalEventsValue = 0;

//     safeData.weeklyKeys.forEach(week => {
//       const weekData = getSafeCustomerStats(safeData.weeklyTotals, week);
//       totalRevenue += weekData.total;
//       totalOrders += weekData.orderCount;
//       totalItems += weekData.items;
//       totalDiscounts += weekData.discounts;
//       totalReturns += weekData.returns;
//       totalNetSales += weekData.netSales;
//       totalShipping += weekData.shipping;
//       totalTaxes += weekData.taxes;
//       totalExtraFees += weekData.extraFees;
//       totalTotalSales += weekData.totalSales;
//       totalShippingRefunds += weekData.shippingRefunds;
//       totalNetReturns += weekData.netReturns;
//       totalTotalRefund += weekData.totalRefund;
      
//       if (weekData.eventSummary) {
//         ordersWithEventsCount += weekData.hasSubsequentEvents ? 1 : 0;
        
//         periodEventSummary.refunds.count += weekData.eventSummary.refunds.count;
//         periodEventSummary.refunds.value += weekData.eventSummary.refunds.value;
//         periodEventSummary.exchanges.count += weekData.eventSummary.exchanges.count;
//         periodEventSummary.exchanges.value += weekData.eventSummary.exchanges.value;
//         periodEventSummary.partialRefunds.count += weekData.eventSummary.partialRefunds.count;
//         periodEventSummary.partialRefunds.value += weekData.eventSummary.partialRefunds.value;
//         periodEventSummary.totalEvents += weekData.eventSummary.totalEvents;
//         periodEventSummary.netValue += weekData.eventSummary.netValue;

//         totalEventsValue += Math.abs(weekData.eventSummary.netValue);
//       }
//     });

//     return {
//       totalRevenue,
//       totalOrders,
//       totalItems,
//       totalDiscounts,
//       totalReturns,
//       totalNetSales,
//       totalShipping,
//       totalTaxes,
//       totalExtraFees,
//       totalTotalSales,
//       totalShippingRefunds,
//       totalNetReturns,
//       totalTotalRefund,
//       eventSummary: periodEventSummary,
//       ordersWithSubsequentEvents: ordersWithEventsCount,
//       subsequentEventsCount: periodEventSummary.totalEvents,
//       subsequentEventsValue: parseFloat(totalEventsValue.toFixed(2)),
//       netRevenue: totalTotalSales,
//       discountRate: totalRevenue > 0 ? (totalDiscounts / totalRevenue) * 100 : 0,
//       shippingRate: totalRevenue > 0 ? (totalShipping / totalRevenue) * 100 : 0,
//       taxRate: totalRevenue > 0 ? (totalTaxes / totalRevenue) * 100 : 0,
//       returnRate: totalRevenue > 0 ? (totalReturns / totalRevenue) * 100 : 0
//     };
//   };

//   const getMonthlyFinancials = () => {
//     const safeData = getSafeData(data);
//     if (!safeData) return null;

//     let totalRevenue = 0;
//     let totalOrders = 0;
//     let totalItems = 0;
//     let totalDiscounts = 0;
//     let totalReturns = 0;
//     let totalNetSales = 0;
//     let totalShipping = 0;
//     let totalTaxes = 0;
//     let totalExtraFees = 0;
//     let totalTotalSales = 0;
//     let totalShippingRefunds = 0;
//     let totalNetReturns = 0;
//     let totalTotalRefund = 0;

//     const periodEventSummary: EventSummary = {
//       refunds: { count: 0, value: 0 },
//       exchanges: { count: 0, value: 0 },
//       partialRefunds: { count: 0, value: 0 },
//       totalEvents: 0,
//       netValue: 0
//     };

//     let ordersWithEventsCount = 0;
//     let totalEventsValue = 0;

//     safeData.monthRanges.forEach(month => {
//       const monthData = getSafeCustomerStats(safeData.monthlyTotals, month);
//       totalRevenue += monthData.total;
//       totalOrders += monthData.orderCount;
//       totalItems += monthData.items;
//       totalDiscounts += monthData.discounts;
//       totalReturns += monthData.returns;
//       totalNetSales += monthData.netSales;
//       totalShipping += monthData.shipping;
//       totalTaxes += monthData.taxes;
//       totalExtraFees += monthData.extraFees;
//       totalTotalSales += monthData.totalSales;
//       totalShippingRefunds += monthData.shippingRefunds;
//       totalNetReturns += monthData.netReturns;
//       totalTotalRefund += monthData.totalRefund;
      
//       if (monthData.eventSummary) {
//         ordersWithEventsCount += monthData.hasSubsequentEvents ? 1 : 0;
        
//         periodEventSummary.refunds.count += monthData.eventSummary.refunds.count;
//         periodEventSummary.refunds.value += monthData.eventSummary.refunds.value;
//         periodEventSummary.exchanges.count += monthData.eventSummary.exchanges.count;
//         periodEventSummary.exchanges.value += monthData.eventSummary.exchanges.value;
//         periodEventSummary.partialRefunds.count += monthData.eventSummary.partialRefunds.count;
//         periodEventSummary.partialRefunds.value += monthData.eventSummary.partialRefunds.value;
//         periodEventSummary.totalEvents += monthData.eventSummary.totalEvents;
//         periodEventSummary.netValue += monthData.eventSummary.netValue;

//         totalEventsValue += Math.abs(monthData.eventSummary.netValue);
//       }
//     });

//     return {
//       totalRevenue,
//       totalOrders,
//       totalItems,
//       totalDiscounts,
//       totalReturns,
//       totalNetSales,
//       totalShipping,
//       totalTaxes,
//       totalExtraFees,
//       totalTotalSales,
//       totalShippingRefunds,
//       totalNetReturns,
//       totalTotalRefund,
//       eventSummary: periodEventSummary,
//       ordersWithSubsequentEvents: ordersWithEventsCount,
//       subsequentEventsCount: periodEventSummary.totalEvents,
//       subsequentEventsValue: parseFloat(totalEventsValue.toFixed(2)),
//       netRevenue: totalTotalSales,
//       discountRate: totalRevenue > 0 ? (totalDiscounts / totalRevenue) * 100 : 0,
//       shippingRate: totalRevenue > 0 ? (totalShipping / totalRevenue) * 100 : 0,
//       taxRate: totalRevenue > 0 ? (totalTaxes / totalRevenue) * 100 : 0,
//       returnRate: totalRevenue > 0 ? (totalReturns / totalRevenue) * 100 : 0
//     };
//   };

//   const formatNumber = (num: number) => num.toLocaleString('en-US');
//   const formatPercent = (num: number) => `${num.toFixed(1)}%`;
//   const formatCurrency = (amount: number) => {
//     const currency = safeData?.shopCurrency || 'USD';
//     return amount.toLocaleString('en-US', { 
//       style: 'currency', 
//       currency: currency,
//       minimumFractionDigits: 2 
//     });
//   };

//   const exportToPDF = () => {
//     setIsExporting(true);
    
//     const safeData = getSafeData(data);
//     const todayData = getTodayData();
//     const last7DaysData = getLast7DaysData();
//     const weeklyFinancials = getWeeklyFinancials();
//     const monthlyFinancials = getMonthlyFinancials();
    
//     if (!safeData || !todayData || !last7DaysData || !weeklyFinancials || !monthlyFinancials) {
//       setIsExporting(false);
//       return;
//     }

//     const eventData = monthlyFinancials.eventSummary || weeklyFinancials.eventSummary || last7DaysData.eventSummary;
    
//     const totalEvents = eventData ? 
//       (eventData.refunds.count + eventData.exchanges.count + eventData.partialRefunds.count) : 0;
    
//     const ordersWithEvents = monthlyFinancials.ordersWithSubsequentEvents || 
//                             weeklyFinancials.ordersWithSubsequentEvents || 
//                             last7DaysData.ordersWithSubsequentEvents || 0;

//     const pdfData: OrderData = {
//       totalOrders: safeData.totalOrders,
//       totalCustomers: safeData.totalCustomerData.totalCustomers,
//       fulfillmentRate: safeData.totalOrders > 0 ? 
//         ((last7DaysData.totalFulfilled / last7DaysData.totalOrders) * 100) : 0,
//       totalRevenue: monthlyFinancials.totalRevenue,
//       netRevenue: monthlyFinancials.netRevenue,
//       averageOrderValue: safeData.totalOrders > 0 ? 
//         (monthlyFinancials.totalRevenue / safeData.totalOrders) : 0,
//       totalItems: monthlyFinancials.totalItems,
//       todayOrders: todayData.orderCount,
//       todayRevenue: todayData.total,
//       todayItems: todayData.items,
//       ordersChangeVsYesterday: 100.0,
//       revenueChangeVsYesterday: 100.0,
//       itemsChangeVsYesterday: 100.0,
//       newCustomers: safeData.totalCustomerData.newCustomers,
//       repeatCustomers: safeData.totalCustomerData.repeatedCustomers,
//       customerRetentionRate: safeData.totalCustomerData.totalCustomers > 0 ? 
//         ((safeData.totalCustomerData.repeatedCustomers / safeData.totalCustomerData.totalCustomers) * 100) : 0,
//       averageOrderFrequency: 1.0,
//       shopTimezone: safeData.shopTimeZone,
//       shopCurrency: safeData.shopCurrency,
//       totalRefunds: eventData?.refunds.count || 0,
//       totalExchanges: eventData?.exchanges.count || 0,
//       totalPartialRefunds: eventData?.partialRefunds.count || 0,
//       totalEvents: totalEvents,
//       ordersWithEvents: ordersWithEvents,
//       netEventValue: eventData?.netValue || 0
//     };

//     generatePDFReport(pdfData);
//     setIsExporting(false);
//   };

//   if ("error" in data) {
//     return (
//       <div className="orders-dashboard">
//         <div style={{ padding: "40px", textAlign: "center", background: "#fff5f5", borderRadius: "8px" }}>
//           <h1>We're Sorry</h1>
//           <p>{data.userMessage}</p>
//           <button className="print-button" onClick={handleManualRefresh}>
//             Refresh Page
//           </button>
//         </div>
//       </div>
//     );
//   }

//   const safeData = getSafeData(data);
//   const todayData = getTodayData();
//   const last7DaysData = getLast7DaysData();
//   const weeklyFinancials = getWeeklyFinancials();
//   const monthlyFinancials = getMonthlyFinancials();

//   if (!safeData || !todayData || !last7DaysData || !weeklyFinancials || !monthlyFinancials) {
//     return (
//       <div className="orders-dashboard">
//         <div style={{ padding: "20px", color: "red", textAlign: "center" }}>
//           <h1>Data Validation Failed</h1>
//           <p>Please refresh the page.</p>
//         </div>
//       </div>
//     );
//   }

//   const formatDateDisplay = (dateStr: string) => {
//     const date = new Date(dateStr + 'T00:00:00');
//     return date.toLocaleDateString('en-US', { 
//       month: 'short', 
//       day: 'numeric',
//       timeZone: safeData.shopTimeZone 
//     });
//   };

//   const getDayName = (dateStr: string) => {
//     const date = new Date(dateStr + 'T00:00:00');
//     return date.toLocaleDateString('en-US', { 
//       weekday: 'short',
//       timeZone: safeData.shopTimeZone 
//     });
//   };

//   return (
//     <div className="orders-dashboard">
//       <div className="dashboard-header">
//         <h1>Orders Dashboard</h1>
//         <div className="header-controls">
//           <button 
//             className="export-button"
//             onClick={exportToPDF}
//             disabled={isExporting}
//             title="Export summary PDF report with key metrics"
//           >
//             <Icon.Export />
//             {isExporting ? 'Generating PDF...' : 'Export Summary'}
//           </button>
//         </div>
//       </div>

//       <div id="dashboard-content">
//         {/* Today's Performance Section */}
//         <section className="today-performance">
//           <h2>Today's Performance</h2>
//           <MismatchSummaryCard 
//             mismatchSummary={getTodayMismatchSummary(safeData)} 
//             periodType="day" 
//           />
          
//           <div className="primary-metrics-grid">
//             <div className="metric-card orders">
//               <div className="metric-value">{safeNumber(todayData.orderCount)}</div>
//               <div className="metric-label">Today's Orders</div>
//               <div className="metric-change positive">
//                 <Icon.TrendUp />
//                 100.0% vs yesterday
//               </div>
//             </div>
            
//             <div className="metric-card revenue">
//               <div className="metric-value">{formatCurrency(safeNumber(todayData.totalSales))}</div>
//               <div className="metric-label">Today's Total Sales</div>
//               <div className="metric-change positive">
//                 <Icon.TrendUp />
//                 100.0% vs yesterday
//               </div>
//             </div>
            
//             <div className="metric-card items">
//               <div className="metric-value">{safeNumber(todayData.items)}</div>
//               <div className="metric-label">Items Ordered</div>
//               <div className="metric-change positive">
//                 <Icon.TrendUp />
//                 100.0% vs yesterday
//               </div>
//             </div>
//           </div>

//           <div className="fulfillment-metrics-grid">
//             <div className="fulfillment-metric-card today-fulfilled">
//               <div className="fulfillment-metric-value">{safeNumber(todayData.fulfilled)}</div>
//               <div className="fulfillment-metric-label">FULFILLED TODAY</div>
//               <div className="fulfillment-metric-period">Today</div>
//             </div>
            
//             <div className="fulfillment-metric-card today-unfulfilled">
//               <div className="fulfillment-metric-value">{safeNumber(todayData.unfulfilled)}</div>
//               <div className="fulfillment-metric-label">UNFULFILLED TODAY</div>
//               <div className="fulfillment-metric-period">Today</div>
//             </div>
            
//             <div className="fulfillment-metric-card week-fulfilled">
//               <div className="fulfillment-metric-value">{safeNumber(last7DaysData.totalFulfilled)}</div>
//               <div className="fulfillment-metric-label">FULFILLED</div>
//               <div className="fulfillment-metric-period">Last 7 Days</div>
//             </div>
            
//             <div className="fulfillment-metric-card week-unfulfilled">
//               <div className="fulfillment-metric-value">{safeNumber(last7DaysData.totalUnfulfilled)}</div>
//               <div className="fulfillment-metric-label">UNFULFILLED</div>
//               <div className="fulfillment-metric-period">Last 7 Days</div>
//             </div>
//           </div>

//           {todayData?.eventSummary && todayData.eventSummary.totalEvents > 0 && (
//             <EventSummaryDisplay 
//               eventSummary={todayData.eventSummary} 
//               title="Today's Order Activity & Adjustments"
//             />
//           )}
//         </section>

//         {/* Last 7 Days Performance Section */}
//         <section className="last7days-section">
//           <h3>Last 7 Days Performance</h3>
          
//           <div className="last7days-grid">
//             <div className="last7days-total-card">
//               <div className="last7days-total-value">{safeNumber(last7DaysData.totalOrders)}</div>
//               <div className="last7days-total-label">TOTAL ORDERS</div>
//             </div>
            
//             <div className="last7days-total-card">
//               <div className="last7days-total-value">{formatCurrency(safeNumber(last7DaysData.totalTotalSales))}</div>
//               <div className="last7days-total-label">TOTAL SALES</div>
//             </div>
            
//             <div className="last7days-total-card">
//               <div className="last7days-total-value">{safeNumber(last7DaysData.totalItems)}</div>
//               <div className="last7days-total-label">TOTAL ITEMS</div>
//             </div>
            
//             <div className="last7days-total-card">
//               <div className="last7days-total-value">{formatCurrency(safeNumber(last7DaysData.totalTotalSales / 7))}</div>
//               <div className="last7days-total-label">AVG DAILY SALES</div>
//             </div>
//           </div>

//           {/* Daily Breakdown Table */}
//           <div className="daily-breakdown">
//             <h4>Daily Breakdown</h4>
//             <div className="daily-cards-container">
//               {safeData.dailyKeys.map((day, index) => {
//                 const dayData = getSafeCustomerStats(safeData.dailyTotals, day);
//                 const isToday = index === safeData.dailyKeys.length - 1;
                
//                 return (
//                   <div key={day} className={`daily-card ${isToday ? 'current-day' : ''}`}>
//                     <div className="daily-card-header">
//                       <div className="daily-date">{formatDateDisplay(day)}</div>
//                       <div className="daily-day">{getDayName(day)}</div>
//                     </div>
                    
//                     <div className="daily-metrics">
//                       <div className="daily-metric">
//                         <span className="daily-metric-label">ORDERS</span>
//                         <span className="daily-metric-value">{safeNumber(dayData.orderCount)}</span>
//                       </div>
                      
//                       <div className="daily-metric">
//                         <span className="daily-metric-label">TOTAL SALES</span>
//                         <span className="daily-metric-value">{formatCurrency(safeNumber(dayData.totalSales))}</span>
//                       </div>
                      
//                       <div className="daily-metric">
//                         <span className="daily-metric-label">ITEMS</span>
//                         <span className="daily-metric-value">{safeNumber(dayData.items)}</span>
//                       </div>
//                     </div>
//                   </div>
//                 );
//               })}
//             </div>
//           </div>

//           {last7DaysData?.eventSummary && last7DaysData.eventSummary.totalEvents > 0 && (
//             <EventSummaryDisplay 
//               eventSummary={last7DaysData.eventSummary} 
//               title="Last 7 Days: Refunds, Exchanges & Adjustments"
//             />
//           )}
//         </section>

//         {/* Week-over-Week Insight */}
//         <div className="secondary-metrics">
//           <div className="insight-card">
//             <h4>Week-over-Week Revenue Change</h4>
//             <p className="insight-value text-positive">
//               <Icon.TrendUp /> 
//               100.0%
//             </p>
//           </div>
//         </div>

//         {/* Customer Insights Section */}
//         <section className="customer-metrics">
//           <h3>Customer Insights</h3>
          
//           <div className="customer-metrics-grid">
//             <div className="customer-metric-card total-customers">
//               <div className="customer-metric-value">{safeNumber(safeData.totalCustomerData.totalCustomers)}</div>
//               <div className="customer-metric-label">TOTAL CUSTOMERS</div>
//             </div>
            
//             <div className="customer-metric-card new-customers">
//               <div className="customer-metric-value">{safeNumber(safeData.totalCustomerData.newCustomers)}</div>
//               <div className="customer-metric-label">NEW CUSTOMERS</div>
//             </div>
            
//             <div className="customer-metric-card repeat-customers">
//               <div className="customer-metric-value">{safeNumber(safeData.totalCustomerData.repeatedCustomers)}</div>
//               <div className="customer-metric-label">REPEAT CUSTOMERS</div>
//             </div>
            
//             <div className="customer-metric-card loyalty-rate">
//               <div className="customer-metric-value">
//                 {safeData.totalCustomerData.totalCustomers > 0 
//                   ? formatPercent((safeData.totalCustomerData.repeatedCustomers / safeData.totalCustomerData.totalCustomers) * 100)
//                   : '0.0%'
//                 }
//               </div>
//               <div className="customer-metric-label">REPEAT CUSTOMER RATE</div>
//             </div>
//           </div>
//         </section>

//         {/* Last 7 Days Customer Insights */}
//         <section className="customer-metrics">
//           <h3>Last 7 Days Customer Insights</h3>
          
//           <div className="customer-metrics-grid">
//             <div className="customer-metric-card total-customers">
//               <div className="customer-metric-value">{safeNumber(last7DaysData.totalNewCustomers + last7DaysData.totalRepeatCustomers)}</div>
//               <div className="customer-metric-label">7-DAY TOTAL CUSTOMERS</div>
//             </div>
            
//             <div className="customer-metric-card new-customers">
//               <div className="customer-metric-value">{safeNumber(last7DaysData.totalNewCustomers)}</div>
//               <div className="customer-metric-label">7-DAY NEW CUSTOMERS</div>
//             </div>
            
//             <div className="customer-metric-card repeat-customers">
//               <div className="customer-metric-value">{safeNumber(last7DaysData.totalRepeatCustomers)}</div>
//               <div className="customer-metric-label">7-DAY REPEAT CUSTOMERS</div>
//             </div>
            
//             <div className="customer-metric-card loyalty-rate">
//               <div className="customer-metric-value">
//                 {(last7DaysData.totalNewCustomers + last7DaysData.totalRepeatCustomers) > 0
//                   ? formatPercent((last7DaysData.totalRepeatCustomers / (last7DaysData.totalNewCustomers + last7DaysData.totalRepeatCustomers)) * 100)
//                   : '0.0%'
//                 }
//               </div>
//               <div className="customer-metric-label">7-DAY REPEAT RATE</div>
//             </div>
//           </div>
//         </section>

//         {/* Last 7 Days Financial Breakdown */}
//         <section className="financial-metrics">
//           <h3>Last 7 Days Financial Breakdown</h3>

//           <MismatchSummaryCard 
//             mismatchSummary={getCalculationMismatchSummary(safeData)} 
//             periodType="day"
//           />

//           <div className="financial-metrics-grid">
//             <div className="financial-metric-card revenue">
//               <div className="financial-metric-value">{formatCurrency(last7DaysData.totalRevenue)}</div>
//               <div className="financial-metric-label">Gross Sales</div>
//               <div className="financial-metric-period">7 Days</div>
//             </div>
            
//             <div className="financial-metric-card discounts">
//               <div className="financial-metric-value">{formatCurrency(last7DaysData.totalDiscounts)}</div>
//               <div className="financial-metric-label">Total Discounts</div>
//               <div className="financial-metric-rate">{formatPercent(last7DaysData.totalDiscounts / last7DaysData.totalRevenue * 100)} of gross</div>
//             </div>
            
//             <div className="financial-metric-card returns">
//               <div className="financial-metric-value">{formatCurrency(last7DaysData.totalReturns)}</div>
//               <div className="financial-metric-label">Returns & Refunds</div>
//               <div className="financial-metric-rate">{formatPercent(last7DaysData.totalReturns / last7DaysData.totalRevenue * 100)} of gross</div>
//             </div>
            
//             <div className="financial-metric-card return-fees">
//               <div className="financial-metric-value">{formatCurrency(last7DaysData.totalExtraFees)}</div>
//               <div className="financial-metric-label">Return Fees</div>
//               <div className="financial-metric-rate">{formatPercent(last7DaysData.totalExtraFees / last7DaysData.totalRevenue * 100)} of gross</div>
//             </div>
            
//             <div className="financial-metric-card net-sales">
//               <div className="financial-metric-value">{formatCurrency(last7DaysData.totalNetSales)}</div>
//               <div className="financial-metric-label">Net Sales</div>
//               <div className="financial-metric-period">After ALL deductions</div>
//             </div>
            
//             <div className="financial-metric-card shipping">
//               <div className="financial-metric-value">{formatCurrency(last7DaysData.totalShipping)}</div>
//               <div className="financial-metric-label">Shipping Charges</div>
//               <div className="financial-metric-rate">{formatPercent(last7DaysData.totalShipping / last7DaysData.totalNetSales * 100)} of net sales</div>
//             </div>
            
//             <div className="financial-metric-card taxes">
//               <div className="financial-metric-value">{formatCurrency(last7DaysData.totalTaxes)}</div>
//               <div className="financial-metric-label">Taxes Collected</div>
//               <div className="financial-metric-rate">{formatPercent(last7DaysData.totalTaxes / last7DaysData.totalNetSales * 100)} of net sales</div>
//             </div>
            
//             <div className="financial-metric-card total-sales">
//               <div className="financial-metric-value">{formatCurrency(last7DaysData.totalTotalSales)}</div>
//               <div className="financial-metric-label">Total Sales</div>
//               <div className="financial-metric-period">Final amount</div>
//             </div>
//           </div>

//           {/* Daily Financial Details */}
//           <div className="daily-financial-breakdown">
//             <h4>Daily Financial Details</h4>
//             <div className="daily-financial-cards">
//               {safeData.dailyKeys.map((day, index) => {
//                 const dayData = getSafeCustomerStats(safeData.dailyTotals, day);
//                 const isToday = index === safeData.dailyKeys.length - 1;
                
//                 return (
//                   <div key={day} className={`daily-financial-card ${isToday ? 'current-day' : ''}`}>
//                     <div className="daily-financial-header">
//                       <div className="daily-financial-date">{formatDateDisplay(day)}</div>
//                       <div className="daily-financial-day">{getDayName(day)}</div>
//                     </div>
                    
//                     <div className="daily-financial-metrics">
//                       <div className="daily-financial-metric gross-revenue">
//                         <span className="daily-financial-label">Gross Sales</span>
//                         <span className="daily-financial-value">{formatCurrency(dayData.total)}</span>
//                       </div>
                      
//                       <div className="daily-financial-metric discounts">
//                         <span className="daily-financial-label">Discounts</span>
//                         <span className="daily-financial-value">{formatCurrency(dayData.discounts)}</span>
//                       </div>
                      
//                       <div className="daily-financial-metric returns">
//                         <span className="daily-financial-label">Returns</span>
//                         <span className="daily-financial-value">{formatCurrency(dayData.returns)}</span>
//                       </div>
                      
//                       <div className="daily-financial-metric net-sales">
//                         <span className="daily-financial-label">Net Sales</span>
//                         <span className="daily-financial-value">{formatCurrency(dayData.netSales)}</span>
//                       </div>
                      
//                       <div className="daily-financial-metric shipping">
//                         <span className="daily-financial-label">Shipping Charges</span>
//                         <span className="daily-financial-value">{formatCurrency(dayData.shipping)}</span>
//                       </div>
                      
//                       <div className="daily-financial-metric return-fees">
//                         <span className="daily-financial-label">Return Fees</span>
//                         <span className="daily-financial-value">{formatCurrency(dayData.extraFees)}</span>
//                       </div>
                      
//                       <div className="daily-financial-metric taxes">
//                         <span className="daily-financial-label">Taxes</span>
//                         <span className="daily-financial-value">{formatCurrency(dayData.taxes)}</span>
//                       </div>
                      
//                       <div className="daily-financial-metric total-sales">
//                         <span className="daily-financial-label">Total Sales</span>
//                         <span className="daily-financial-value">{formatCurrency(dayData.totalSales)}</span>
//                       </div>
//                     </div>
//                   </div>
//                 );
//               })}
//             </div>
//           </div>
//         </section>

//         {/* Weekly Performance */}
//         <section className="weekly-performance">
//           <h3>Weekly Performance (Last 8 Weeks)</h3>
//           <MismatchSummaryCard 
//             mismatchSummary={getWeeklyMismatchSummary(safeData)} 
//             periodType="week"
//           />
//           <div className="weekly-grid">
//             <div className="weekly-card">
//               <div className="weekly-value">{safeNumber(weeklyFinancials.totalOrders)}</div>
//               <div className="weekly-label">Total Orders</div>
//             </div>
            
//             <div className="weekly-card">
//               <div className="weekly-value">{formatCurrency(weeklyFinancials.totalRevenue)}</div>
//               <div className="weekly-label">Total Revenue</div>
//             </div>
            
//             <div className="weekly-card">
//               <div className="weekly-value">{safeNumber(weeklyFinancials.totalItems)}</div>
//               <div className="weekly-label">Total Items</div>
//             </div>
            
//             <div className="weekly-card">
//               <div className="weekly-value">{formatCurrency(weeklyFinancials.totalRevenue / safeData.weeklyKeys.length)}</div>
//               <div className="weekly-label">Avg Weekly Revenue</div>
//             </div>
//           </div>

//           {/* Weekly Breakdown */}
//           <div className="weekly-breakdown">
//             <h4>Weekly Breakdown</h4>
//             <div className="weekly-cards-container">
//               {safeData.weeklyKeys.map((week, index) => {
//                 const weekData = getSafeCustomerStats(safeData.weeklyTotals, week);
//                 const isCurrentWeek = index === safeData.weeklyKeys.length - 1;
                
//                 return (
//                   <div key={week} className={`week-card ${isCurrentWeek ? 'current-week' : ''}`}>
//                     <div className="week-header">
//                       <div className="week-label">Week {week.replace('Week of ', '').split('-')[2]}</div>
//                       <div className="week-period">{week.replace('Week of ', '').split('-')[0]}</div>
//                     </div>
                    
//                     <div className="week-metrics">
//                       <div className="week-metric orders">
//                         <span className="week-metric-label">Orders</span>
//                         <span className="week-metric-value">{safeNumber(weekData.orderCount)}</span>
//                       </div>
                      
//                       <div className="week-metric revenue">
//                         <span className="week-metric-label">Total Sales</span>
//                         <span className="week-metric-value">{formatCurrency(weekData.totalSales)}</span>
//                       </div>
                      
//                       <div className="week-metric items">
//                         <span className="week-metric-label">Items</span>
//                         <span className="week-metric-value">{safeNumber(weekData.items)}</span>
//                       </div>
//                     </div>
//                   </div>
//                 );
//               })}
//             </div>
//           </div>

//           {weeklyFinancials?.eventSummary && weeklyFinancials.eventSummary.totalEvents > 0 && (
//             <EventSummaryDisplay 
//               eventSummary={weeklyFinancials.eventSummary} 
//               title="8-Week Period: Order Events & Financial Adjustments"
//             />
//           )}
//         </section>

//         {/* Weekly Financial Breakdown */}
//         <section className="financial-metrics">
//           <h3>Weekly Financial Breakdown (Last 8 Weeks)</h3>
//           <div className="financial-metrics-grid">
//             <div className="financial-metric-card revenue">
//               <div className="financial-metric-value">{formatCurrency(weeklyFinancials.totalRevenue)}</div>
//               <div className="financial-metric-label">Gross Sales</div>
//               <div className="financial-metric-period">8 Weeks</div>
//             </div>
            
//             <div className="financial-metric-card discounts">
//               <div className="financial-metric-value">{formatCurrency(weeklyFinancials.totalDiscounts)}</div>
//               <div className="financial-metric-label">Total Discounts</div>
//               <div className="financial-metric-rate">{formatPercent(weeklyFinancials.totalDiscounts / weeklyFinancials.totalRevenue * 100)} of gross</div>
//             </div>
            
//             <div className="financial-metric-card returns">
//               <div className="financial-metric-value">{formatCurrency(weeklyFinancials.totalReturns)}</div>
//               <div className="financial-metric-label">Returns & Refunds</div>
//               <div className="financial-metric-rate">{formatPercent(weeklyFinancials.totalReturns / weeklyFinancials.totalRevenue * 100)} of gross</div>
//             </div>
            
//             <div className="financial-metric-card return-fees">
//               <div className="financial-metric-value">{formatCurrency(weeklyFinancials.totalExtraFees)}</div>
//               <div className="financial-metric-label">Return Fees</div>
//               <div className="financial-metric-rate">{formatPercent(weeklyFinancials.totalExtraFees / weeklyFinancials.totalRevenue * 100)} of gross</div>
//             </div>
            
//             <div className="financial-metric-card net-sales">
//               <div className="financial-metric-value">{formatCurrency(weeklyFinancials.totalNetSales)}</div>
//               <div className="financial-metric-label">Net Sales</div>
//               <div className="financial-metric-period">After ALL deductions</div>
//             </div>
            
//             <div className="financial-metric-card shipping">
//               <div className="financial-metric-value">{formatCurrency(weeklyFinancials.totalShipping)}</div>
//               <div className="financial-metric-label">Shipping Charges</div>
//               <div className="financial-metric-rate">{formatPercent(weeklyFinancials.totalShipping / weeklyFinancials.totalNetSales * 100)} of net sales</div>
//             </div>
            
//             <div className="financial-metric-card taxes">
//               <div className="financial-metric-value">{formatCurrency(weeklyFinancials.totalTaxes)}</div>
//               <div className="financial-metric-label">Taxes Collected</div>
//               <div className="financial-metric-rate">{formatPercent(weeklyFinancials.totalTaxes / weeklyFinancials.totalNetSales * 100)} of net sales</div>
//             </div>
            
//             <div className="financial-metric-card total-sales">
//               <div className="financial-metric-value">{formatCurrency(weeklyFinancials.totalTotalSales)}</div>
//               <div className="financial-metric-label">Total Sales</div>
//               <div className="financial-metric-period">Final amount</div>
//             </div>
//           </div>

//           {/* Weekly Financial Details */}
//           <div className="weekly-financial-breakdown">
//             <h4>Weekly Financial Details</h4>
//             <div className="weekly-financial-cards">
//               {safeData.weeklyKeys.map((week, index) => {
//                 const weekData = getSafeCustomerStats(safeData.weeklyTotals, week);
//                 const isCurrentWeek = index === safeData.weeklyKeys.length - 1;
                
//                 return (
//                   <div key={week} className={`weekly-financial-card ${isCurrentWeek ? 'current-week' : ''}`}>
//                     <div className="weekly-financial-header">
//                       <div className="weekly-financial-label">Week {week.replace('Week of ', '').split('-')[2]}</div>
//                       <div className="weekly-financial-period">{week.replace('Week of ', '').split('-')[0]}</div>
//                     </div>
                    
//                     <div className="weekly-financial-metrics">
//                       <div className="weekly-financial-metric gross-revenue">
//                         <span className="weekly-financial-label">Gross Sales</span>
//                         <span className="weekly-financial-value">{formatCurrency(weekData.total)}</span>
//                       </div>
                      
//                       <div className="weekly-financial-metric discounts">
//                         <span className="weekly-financial-label">Discounts</span>
//                         <span className="weekly-financial-value">{formatCurrency(weekData.discounts)}</span>
//                       </div>
                      
//                       <div className="weekly-financial-metric returns">
//                         <span className="weekly-financial-label">Returns</span>
//                         <span className="weekly-financial-value">{formatCurrency(weekData.returns)}</span>
//                       </div>
                      
//                       <div className="weekly-financial-metric net-sales">
//                         <span className="weekly-financial-label">Net Sales</span>
//                         <span className="weekly-financial-value">{formatCurrency(weekData.netSales)}</span>
//                       </div>
                      
//                       <div className="weekly-financial-metric shipping">
//                         <span className="weekly-financial-label">Shipping Charges</span>
//                         <span className="weekly-financial-value">{formatCurrency(weekData.shipping)}</span>
//                       </div>
                      
//                       <div className="weekly-financial-metric return-fees">
//                         <span className="weekly-financial-label">Return Fees</span>
//                         <span className="weekly-financial-value">{formatCurrency(weekData.extraFees)}</span>
//                       </div>
                      
//                       <div className="weekly-financial-metric taxes">
//                         <span className="weekly-financial-label">Taxes</span>
//                         <span className="weekly-financial-value">{formatCurrency(weekData.taxes)}</span>
//                       </div>
                      
//                       <div className="weekly-financial-metric total-sales">
//                         <span className="weekly-financial-label">Total Sales</span>
//                         <span className="weekly-financial-value">{formatCurrency(weekData.totalSales)}</span>
//                       </div>
//                     </div>
//                   </div>
//                 );
//               })}
//             </div>
//           </div>
//         </section>

//         {/* Monthly Performance */}
//         <section className="monthly-performance">
//           <h3>Monthly Performance (Last 6 Months)</h3>
//           <MismatchSummaryCard 
//             mismatchSummary={getMonthlyMismatchSummary(safeData)} 
//             periodType="month"
//           />
//           <div className="monthly-grid">
//             <div className="monthly-card">
//               <div className="monthly-value">{safeNumber(monthlyFinancials.totalOrders)}</div>
//               <div className="monthly-label">Total Orders</div>
//             </div>
            
//             <div className="monthly-card">
//               <div className="monthly-value">{formatCurrency(monthlyFinancials.totalRevenue)}</div>
//               <div className="monthly-label">Total Revenue</div>
//             </div>
            
//             <div className="monthly-card">
//               <div className="monthly-value">{safeNumber(monthlyFinancials.totalItems)}</div>
//               <div className="monthly-label">Total Items</div>
//             </div>
            
//             <div className="monthly-card">
//               <div className="monthly-value">{formatCurrency(monthlyFinancials.totalRevenue / safeData.monthRanges.length)}</div>
//               <div className="monthly-label">Avg Monthly Revenue</div>
//             </div>
//           </div>

//           {/* Monthly Breakdown */}
//           <div className="monthly-breakdown">
//             <h4>Monthly Breakdown</h4>
//             <div className="monthly-cards-container">
//               {safeData.monthRanges.map((month, index) => {
//                 const monthData = getSafeCustomerStats(safeData.monthlyTotals, month);
//                 const currentMonth = new Date().toLocaleString("default", { month: "short", year: "numeric", timeZone: safeData.shopTimeZone });
//                 const isCurrentMonth = month === currentMonth;
                
//                 const avgRevenue = safeData.monthRanges.reduce((sum, m) => {
//                   const mData = getSafeCustomerStats(safeData.monthlyTotals, m);
//                   return sum + mData.total;
//                 }, 0) / safeData.monthRanges.length;
//                 const performanceLevel = monthData.total > avgRevenue * 1.2 ? 'high' : 
//                                        monthData.total > avgRevenue * 0.8 ? 'medium' : 'low';
                
//                 return (
//                   <div key={month} className={`month-card ${isCurrentMonth ? 'current-month' : ''}`}>
//                     {isCurrentMonth && <div className="current-badge">Current</div>}
//                     <div className="month-header">
//                       <div className="month-label">{month.split(' ')[0]}</div>
//                       <div className="month-period">{month.split(' ')[1]}</div>
//                     </div>
                    
//                     <div className="month-metrics">
//                       <div className="month-metric orders">
//                         <span className="month-metric-label">Orders</span>
//                         <span className="month-metric-value">{safeNumber(monthData.orderCount)}</span>
//                       </div>
                      
//                       <div className="month-metric revenue">
//                         <span className="month-metric-label">Total Sales</span>
//                         <span className="month-metric-value">{formatCurrency(monthData.totalSales)}</span>
//                       </div>
                      
//                       <div className="month-metric items">
//                         <span className="month-metric-label">Items</span>
//                         <span className="month-metric-value">{safeNumber(monthData.items)}</span>
//                       </div>
//                     </div>
//                   </div>
//                 );
//               })}
//             </div>
//           </div>

//           {monthlyFinancials?.eventSummary && monthlyFinancials.eventSummary.totalEvents > 0 && (
//             <EventSummaryDisplay 
//               eventSummary={monthlyFinancials.eventSummary} 
//               title="6-Month Overview: All Order Events & Adjustments"
//             />
//           )}
//         </section>

//         {/* Monthly Financial Breakdown */}
//         <section className="financial-metrics">
//           <h3>Monthly Financial Breakdown (Last 6 Months)</h3>
//           <div className="financial-metrics-grid">
//             <div className="financial-metric-card revenue">
//               <div className="financial-metric-value">{formatCurrency(monthlyFinancials.totalRevenue)}</div>
//               <div className="financial-metric-label">Gross Sales</div>
//               <div className="financial-metric-period">6 Months</div>
//             </div>
            
//             <div className="financial-metric-card discounts">
//               <div className="financial-metric-value">{formatCurrency(monthlyFinancials.totalDiscounts)}</div>
//               <div className="financial-metric-label">Total Discounts</div>
//               <div className="financial-metric-rate">{formatPercent(monthlyFinancials.totalDiscounts / monthlyFinancials.totalRevenue * 100)} of gross</div>
//             </div>
            
//             <div className="financial-metric-card returns">
//               <div className="financial-metric-value">{formatCurrency(monthlyFinancials.totalReturns)}</div>
//               <div className="financial-metric-label">Returns & Refunds</div>
//               <div className="financial-metric-rate">{formatPercent(monthlyFinancials.totalReturns / monthlyFinancials.totalRevenue * 100)} of gross</div>
//             </div>
            
//             <div className="financial-metric-card return-fees">
//               <div className="financial-metric-value">{formatCurrency(monthlyFinancials.totalExtraFees)}</div>
//               <div className="financial-metric-label">Return Fees</div>
//               <div className="financial-metric-rate">{formatPercent(monthlyFinancials.totalExtraFees / monthlyFinancials.totalRevenue * 100)} of gross</div>
//             </div>
            
//             <div className="financial-metric-card net-sales">
//               <div className="financial-metric-value">{formatCurrency(monthlyFinancials.totalNetSales)}</div>
//               <div className="financial-metric-label">Net Sales</div>
//               <div className="financial-metric-period">After ALL deductions</div>
//             </div>
            
//             <div className="financial-metric-card shipping">
//               <div className="financial-metric-value">{formatCurrency(monthlyFinancials.totalShipping)}</div>
//               <div className="financial-metric-label">Shipping Charges</div>
//               <div className="financial-metric-rate">{formatPercent(monthlyFinancials.totalShipping / monthlyFinancials.totalNetSales * 100)} of net sales</div>
//             </div>
            
//             <div className="financial-metric-card taxes">
//               <div className="financial-metric-value">{formatCurrency(monthlyFinancials.totalTaxes)}</div>
//               <div className="financial-metric-label">Taxes Collected</div>
//               <div className="financial-metric-rate">{formatPercent(monthlyFinancials.totalTaxes / monthlyFinancials.totalNetSales * 100)} of net sales</div>
//             </div>
            
//             <div className="financial-metric-card total-sales">
//               <div className="financial-metric-value">{formatCurrency(monthlyFinancials.totalTotalSales)}</div>
//               <div className="financial-metric-label">Total Sales</div>
//               <div className="financial-metric-period">Final amount</div>
//             </div>
//           </div>

//           {/* Monthly Financial Details */}
//           <div className="monthly-financial-breakdown">
//             <h4>Monthly Financial Details</h4>
//             <div className="monthly-financial-cards">
//               {safeData.monthRanges.map((month, index) => {
//                 const monthData = getSafeCustomerStats(safeData.monthlyTotals, month);
//                 const currentMonth = new Date().toLocaleString("default", { month: "short", year: "numeric", timeZone: safeData.shopTimeZone });
//                 const isCurrentMonth = month === currentMonth;
                
//                 return (
//                   <div key={month} className={`monthly-financial-card ${isCurrentMonth ? 'current-month' : ''}`}>
//                     {isCurrentMonth && <div className="current-badge">Current</div>}
//                     <div className="monthly-financial-header">
//                       <div className="monthly-financial-label">{month.split(' ')[0]}</div>
//                       <div className="monthly-financial-period">{month.split(' ')[1]}</div>
//                     </div>
                    
//                     <div className="monthly-financial-metrics">
//                       <div className="monthly-financial-metric gross-revenue">
//                         <span className="monthly-financial-label">Gross Sales</span>
//                         <span className="monthly-financial-value">{formatCurrency(monthData.total)}</span>
//                       </div>
                      
//                       <div className="monthly-financial-metric discounts">
//                         <span className="monthly-financial-label">Discounts</span>
//                         <span className="monthly-financial-value">{formatCurrency(monthData.discounts)}</span>
//                       </div>
                      
//                       <div className="monthly-financial-metric returns">
//                         <span className="monthly-financial-label">Returns</span>
//                         <span className="monthly-financial-value">{formatCurrency(monthData.returns)}</span>
//                       </div>
                      
//                       <div className="monthly-financial-metric net-sales">
//                         <span className="monthly-financial-label">Net Sales</span>
//                         <span className="monthly-financial-value">{formatCurrency(monthData.netSales)}</span>
//                       </div>
                      
//                       <div className="monthly-financial-metric shipping">
//                         <span className="monthly-financial-label">Shipping Charges</span>
//                         <span className="monthly-financial-value">{formatCurrency(monthData.shipping)}</span>
//                       </div>
                      
//                       <div className="monthly-financial-metric return-fees">
//                         <span className="monthly-financial-label">Return Fees</span>
//                         <span className="monthly-financial-value">{formatCurrency(monthData.extraFees)}</span>
//                       </div>
                      
//                       <div className="monthly-financial-metric taxes">
//                         <span className="monthly-financial-label">Taxes</span>
//                         <span className="monthly-financial-value">{formatCurrency(monthData.taxes)}</span>
//                       </div>
                      
//                       <div className="monthly-financial-metric total-sales">
//                         <span className="monthly-financial-label">Total Sales</span>
//                         <span className="monthly-financial-value">{formatCurrency(monthData.totalSales)}</span>
//                       </div>
//                     </div>
//                   </div>
//                 );
//               })}
//             </div>
//           </div>
//         </section>

//         {/* Charts & Analytics Section */}
//         <section className="charts-section">
//           <h2>Analytics & Insights Visualization</h2>
          
//           <div className="charts-grid">
//             <ChartComponents.CustomerDistribution data={safeData} />
//             <ChartComponents.RevenueTrend data={safeData} />
//             <ChartComponents.MonthlyPerformance data={safeData} />
//             <ChartComponents.FinancialBreakdown data={safeData} />
//           </div>
//         </section>

//         {/* Footer */}
//         <footer className="app-footer">
//           <div className="footer-content">
//             <p>
//               <strong>Orders Analyzed:</strong> {safeData.totalOrders} orders • 
//               <strong> Net Revenue:</strong> {formatCurrency(monthlyFinancials.netRevenue)} • 
//               <strong> Data Updated:</strong> {new Date(safeData.lastUpdated).toLocaleDateString()}
//             </p>
//             <p className="footer-brand">Analytics Dashboard - Nexus Powering Your Business Insights</p>
//           </div>
//         </footer>
//       </div>
//     </div>
//   );
// }

// // ====================  17.0 EXPORT COMPONENT ====================

// export default function AnalyticsApp() {
//   return <ShopifyAnalyticsPage />;
// }

