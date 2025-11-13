// // // ==================== TYPE DEFINITIONS ====================

// // export interface Order {
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

// // // types/analytics.ts - UPDATE EventSummary type
// // export type EventSummary = {
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
// //   modifications?: { // Make it optional for backward compatibility
// //     count: number;
// //     value: number;
// //   };
// //   totalEvents: number;
// //   netValue: number;
// // };

// // export interface OrderStats {
// //   total: number;
// //   items: number;
// //   fulfilled: number;
// //   unfulfilled: number;
// //   discounts: number;
// //   returns: number;
// //   netSales: number;
// //   shipping: number;
// //   taxes: number;
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
// //   orderCount: number;
// // }

// // export interface CustomerData {
// //   newCustomers: number;
// //   repeatedCustomers: number;
// //   totalCustomers: number;
// // }

// // export interface AnalyticsData {
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

// // export interface CachedAnalyticsData extends AnalyticsData {
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

// // // In app/types/analytics.ts

// // // Original interface for dashboard
// // export interface OrderData {
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

// // // Extended interface for email with additional fields
// // export interface EmailOrderData extends OrderData {
// //   fulfilledOrders: number;
// //   unfulfilledOrders: number;
// //   totalDiscounts: number;
// //   totalShipping: number;
// //   totalTaxes: number;
// //   totalReturns: number;
// //   returnFees: number;
// //   discountRate: number;
// //   shippingRate: number;
// //   taxRate: number;
// //   returnRate: number;
// //   averageItemsPerOrder: number;
// //   dailySales: Array<{ date: string; revenue: number; orders: number; items: number; fulfilled?: number }>;
// //   weeklySales: Array<{ week: string; revenue: number; orders: number; items: number }>;
// //   monthlySales: Array<{ month: string; revenue: number; orders: number; items: number }>;
// //   yesterdayRevenue: number;
// //   yesterdayOrders: number;
// //   yesterdayItems: number;
// //   lastWeekRevenue: number;
// //   lastWeekOrders: number;
// //   lastWeekItems: number;
// //   todayFulfilled: number;
// //   todayUnfulfilled: number;
// //   last7DaysFulfilled: number;
// //   last7DaysUnfulfilled: number;
// //   revenueChangeVsLastWeek: number;
// //   bestDay: { date: string; revenue: number; orders: number; items: number };
// //   averageDailyRevenue: number;
// //   last7DaysTotalCustomers: number;
// //   last7DaysRepeatCustomers: number;
// //   last7DaysNewCustomers: number;
// //   last7DaysRepeatCustomerRate: number;
// //   customerTypeData: { new: number; repeat: number };
// //   fulfillmentStatusData: { fulfilled: number; unfulfilled: number };
// //   weeklyRevenueTrend: Array<{ week: string; revenue: number }>;
// //   monthlyComparison: Array<{ month: string; revenue: number; orders: number }>;
// //   dailyPerformance: Array<{ day: string; revenue: number; orders: number }>;
// //   ordersLoaded: number;
// //   currentDateInShopTZ: string;
// // }

// // // types/analytics.ts - ADD THESE NEW TYPES
// // export interface GiftCardAnalytics {
// //   regularOrders: number;
// //   giftCardOrders: number;
// //   mixedOrders: number;
// //   regularRevenue: number;
// //   giftCardRevenue: number;
// //   regularItems: number;
// //   giftCardItems: number;
// // }

// // export interface ReturnAnalytics {
// //   totalRestockingFees: number;
// //   totalReturnShippingFees: number;
// //   totalReturnFees: number;
// //   ordersWithRestockingFees: number;
// //   ordersWithReturnShipping: number;
// // }

// // export interface RefundDiscrepancyAnalytics {
// //   totalRefundDiscrepancy: number;
// //   ordersWithOverRefunds: number;
// //   ordersWithUnderRefunds: number;
// //   totalOverRefundAmount: number;
// //   totalUnderRefundAmount: number;
// // }

// // // Add these to your existing AnalyticsData interface
// // export interface AnalyticsData {
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
// //   // NEW FIELDS FOR ENHANCED ANALYTICS
// //   giftCardAnalytics?: GiftCardAnalytics;
// //   returnAnalytics?: ReturnAnalytics;
// //   refundDiscrepancyAnalytics?: RefundDiscrepancyAnalytics;
// // }




























// // ==================== TYPE DEFINITIONS ====================

// export interface Order {
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

// // Gift Card Data Interface
// export interface GiftCardData {
//   totalSales: number;
//   activatedCards: number;
//   usedCards: number;
//   remainingBalance: number;
//   breakdown?: Array<{
//     title: string;
//     subtitle: string;
//     metrics: Array<{ label: string; value: string }>;
//   }>;
//   recentActivity?: {
//     activations: Array<{
//       cardNumber: string;
//       amount: number;
//       date: string;
//     }>;
//     usage: Array<{
//       cardNumber: string;
//       amount: number;
//       date: string;
//     }>;
//   };
// }

// // EventSummary type
// export type EventSummary = {
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
//   modifications?: {
//     count: number;
//     value: number;
//   };
//   totalEvents: number;
//   netValue: number;
// };

// export interface OrderStats {
//   total: number;
//   items: number;
//   fulfilled: number;
//   unfulfilled: number;
//   discounts: number;
//   returns: number;
//   netSales: number;
//   shipping: number;
//   taxes: number;
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
//   orderCount: number;
// }

// export interface CustomerData {
//   newCustomers: number;
//   repeatedCustomers: number;
//   totalCustomers: number;
// }

// // Enhanced Analytics Interfaces
// export interface GiftCardAnalytics {
//   regularOrders: number;
//   giftCardOrders: number;
//   mixedOrders: number;
//   regularRevenue: number;
//   giftCardRevenue: number;
//   regularItems: number;
//   giftCardItems: number;
// }

// export interface ReturnAnalytics {
//   totalRestockingFees: number;
//   totalReturnShippingFees: number;
//   totalReturnFees: number;
//   ordersWithRestockingFees: number;
//   ordersWithReturnShipping: number;
// }

// export interface RefundDiscrepancyAnalytics {
//   totalRefundDiscrepancy: number;
//   ordersWithOverRefunds: number;
//   ordersWithUnderRefunds: number;
//   totalOverRefundAmount: number;
//   totalUnderRefundAmount: number;
// }

// // Main Analytics Data Interface
// export interface AnalyticsData {
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
//   // Enhanced Analytics Fields
//   giftCardAnalytics?: GiftCardAnalytics;
//   returnAnalytics?: ReturnAnalytics;
//   refundDiscrepancyAnalytics?: RefundDiscrepancyAnalytics;
//   // Gift Card Data
//   giftCardData?: GiftCardData;
// }

// export interface CachedAnalyticsData extends AnalyticsData {
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

// // Dashboard Data Interfaces
// export interface OrderData {
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

// // Extended interface for email with additional fields
// export interface EmailOrderData extends OrderData {
//   fulfilledOrders: number;
//   unfulfilledOrders: number;
//   totalDiscounts: number;
//   totalShipping: number;
//   totalTaxes: number;
//   totalReturns: number;
//   returnFees: number;
//   discountRate: number;
//   shippingRate: number;
//   taxRate: number;
//   returnRate: number;
//   averageItemsPerOrder: number;
//   dailySales: Array<{ date: string; revenue: number; orders: number; items: number; fulfilled?: number }>;
//   weeklySales: Array<{ week: string; revenue: number; orders: number; items: number }>;
//   monthlySales: Array<{ month: string; revenue: number; orders: number; items: number }>;
//   yesterdayRevenue: number;
//   yesterdayOrders: number;
//   yesterdayItems: number;
//   lastWeekRevenue: number;
//   lastWeekOrders: number;
//   lastWeekItems: number;
//   todayFulfilled: number;
//   todayUnfulfilled: number;
//   last7DaysFulfilled: number;
//   last7DaysUnfulfilled: number;
//   revenueChangeVsLastWeek: number;
//   bestDay: { date: string; revenue: number; orders: number; items: number };
//   averageDailyRevenue: number;
//   last7DaysTotalCustomers: number;
//   last7DaysRepeatCustomers: number;
//   last7DaysNewCustomers: number;
//   last7DaysRepeatCustomerRate: number;
//   customerTypeData: { new: number; repeat: number };
//   fulfillmentStatusData: { fulfilled: number; unfulfilled: number };
//   weeklyRevenueTrend: Array<{ week: string; revenue: number }>;
//   monthlyComparison: Array<{ month: string; revenue: number; orders: number }>;
//   dailyPerformance: Array<{ day: string; revenue: number; orders: number }>;
//   ordersLoaded: number;
//   currentDateInShopTZ: string;
// }

























// // types/analytics.ts - CORRECTED VERSION

// // ==================== TYPE DEFINITIONS ====================

// export interface Order {
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

// // Gift Card Data Interface
// export interface GiftCardData {
//   totalSales: number;
//   activatedCards: number;
//   usedCards: number;
//   remainingBalance: number;
//   breakdown?: Array<{
//     title: string;
//     subtitle: string;
//     metrics: Array<{ label: string; value: string }>;
//   }>;
//   recentActivity?: {
//     activations: Array<{
//       cardNumber: string;
//       amount: number;
//       date: string;
//     }>;
//     usage: Array<{
//       cardNumber: string;
//       amount: number;
//       date: string;
//     }>;
//   };
// }

// // EventSummary type - SINGLE DEFINITION
// export interface EventSummary {
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
//   modifications: {
//     count: number;
//     value: number;
//   };
//   returns: {
//     count: number;
//     value: number;
//   };
//   discounts: {
//     count: number;
//     value: number;
//   };
//   totalEvents: number;
//   netValue: number;
// }

// export interface OrderStats {
//   total: number;
//   items: number;
//   fulfilled: number;
//   unfulfilled: number;
//   discounts: number;
//   returns: number;
//   netSales: number;
//   shipping: number;
//   taxes: number;
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
//   orderCount: number;
// }

// export interface CustomerData {
//   newCustomers: number;
//   repeatedCustomers: number;
//   totalCustomers: number;
// }

// // Enhanced Analytics Interfaces
// export interface GiftCardAnalytics {
//   regularOrders: number;
//   giftCardOrders: number;
//   mixedOrders: number;
//   regularRevenue: number;
//   giftCardRevenue: number;
//   regularItems: number;
//   giftCardItems: number;
// }

// export interface ReturnAnalytics {
//   totalRestockingFees: number;
//   totalReturnShippingFees: number;
//   totalReturnFees: number;
//   ordersWithRestockingFees: number;
//   ordersWithReturnShipping: number;
// }

// export interface RefundDiscrepancyAnalytics {
//   totalRefundDiscrepancy: number;
//   ordersWithOverRefunds: number;
//   ordersWithUnderRefunds: number;
//   totalOverRefundAmount: number;
//   totalUnderRefundAmount: number;
// }

// // Main Analytics Data Interface
// export interface AnalyticsData {
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
//   // Enhanced Analytics Fields
//   giftCardAnalytics?: GiftCardAnalytics;
//   returnAnalytics?: ReturnAnalytics;
//   refundDiscrepancyAnalytics?: RefundDiscrepancyAnalytics;
//   // Gift Card Data
//   giftCardData?: GiftCardData;
// }

// export interface CachedAnalyticsData extends AnalyticsData {
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

// // Dashboard Data Interfaces
// export interface OrderData {
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

// // Extended interface for email with additional fields
// export interface EmailOrderData extends OrderData {
//   fulfilledOrders: number;
//   unfulfilledOrders: number;
//   totalDiscounts: number;
//   totalShipping: number;
//   totalTaxes: number;
//   totalReturns: number;
//   returnFees: number;
//   discountRate: number;
//   shippingRate: number;
//   taxRate: number;
//   returnRate: number;
//   averageItemsPerOrder: number;
//   dailySales: Array<{ date: string; revenue: number; orders: number; items: number; fulfilled?: number }>;
//   weeklySales: Array<{ week: string; revenue: number; orders: number; items: number }>;
//   monthlySales: Array<{ month: string; revenue: number; orders: number; items: number }>;
//   yesterdayRevenue: number;
//   yesterdayOrders: number;
//   yesterdayItems: number;
//   lastWeekRevenue: number;
//   lastWeekOrders: number;
//   lastWeekItems: number;
//   todayFulfilled: number;
//   todayUnfulfilled: number;
//   last7DaysFulfilled: number;
//   last7DaysUnfulfilled: number;
//   revenueChangeVsLastWeek: number;
//   bestDay: { date: string; revenue: number; orders: number; items: number };
//   averageDailyRevenue: number;
//   last7DaysTotalCustomers: number;
//   last7DaysRepeatCustomers: number;
//   last7DaysNewCustomers: number;
//   last7DaysRepeatCustomerRate: number;
//   customerTypeData: { new: number; repeat: number };
//   fulfillmentStatusData: { fulfilled: number; unfulfilled: number };
//   weeklyRevenueTrend: Array<{ week: string; revenue: number }>;
//   monthlyComparison: Array<{ month: string; revenue: number; orders: number }>;
//   dailyPerformance: Array<{ day: string; revenue: number; orders: number }>;
//   ordersLoaded: number;
//   currentDateInShopTZ: string;
// }

// // Order Event Interface
// export interface OrderEvent {
//   orderId: string;
//   orderName: string;
//   eventType: 'refund' | 'exchange' | 'partial_refund' | 'modification' | 'return' | 'discount' | 'item_added' | 'item_removed';
//   eventDate: string;
//   amount: number;
//   currencyCode: string;
//   description: string;
//   details?: any;
// }

// // Event Detection Response Interface
// export interface EventDetectionData {
//   pastOrderEvents: OrderEvent[];
//   eventSummary: EventSummary;
//   ordersWithEventsCount: number;
//   totalEventsCount: number;
// }

// // Today's Orders Response Interface
// export interface TodayOrdersResponse {
//   today: {
//     regularOrders: any[];
//     giftCardOrders: any[];
//   };
//   summaries: {
//     regular: any;
//     giftCard: any;
//   };
//   events: EventDetectionData;
//   summary: {
//     orderCount: number;
//     date: string;
//     storeTimezone: string;
//   };
//   debug: {
//     totalFetched: number;
//     todayFiltered: number;
//     regularOrders: number;
//     giftCardOrders: number;
//   };
// }





































// // types/analytics.ts - CORRECTED VERSION

// // ==================== TYPE DEFINITIONS ====================

// export interface Order {
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

// // Gift Card Data Interface
// export interface GiftCardData {
//   totalSales: number;
//   activatedCards: number;
//   usedCards: number;
//   remainingBalance: number;
//   breakdown?: Array<{
//     title: string;
//     subtitle: string;
//     metrics: Array<{ label: string; value: string }>;
//   }>;
//   recentActivity?: {
//     activations: Array<{
//       cardNumber: string;
//       amount: number;
//       date: string;
//     }>;
//     usage: Array<{
//       cardNumber: string;
//       amount: number;
//       date: string;
//     }>;
//   };
// }

// // EventSummary type - ENHANCED WITH NEW PROPERTIES
// export interface EventSummary {
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
//   modifications: {
//     count: number;
//     value: number;
//   };
//   returns: {
//     count: number;
//     value: number;
//   };
//   discounts: {
//     count: number;
//     value: number;
//   };
//   // NEW PROPERTIES FOR COMPREHENSIVE METRICS
//   restockingFees: {
//     count: number;
//     value: number;
//   };
//   returnShippingFees: {
//     count: number;
//     value: number;
//   };
//   refundShipping: {
//     count: number;
//     value: number;
//   };
//   taxAdjustments: {
//     count: number;
//     value: number;
//   };
//   totalEvents: number;
//   netValue: number;
// }

// export interface OrderStats {
//   total: number;
//   items: number;
//   fulfilled: number;
//   unfulfilled: number;
//   discounts: number;
//   returns: number;
//   netSales: number;
//   shipping: number;
//   taxes: number;
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
//   orderCount: number;
// }

// export interface CustomerData {
//   newCustomers: number;
//   repeatedCustomers: number;
//   totalCustomers: number;
// }

// // Enhanced Analytics Interfaces
// export interface GiftCardAnalytics {
//   regularOrders: number;
//   giftCardOrders: number;
//   mixedOrders: number;
//   regularRevenue: number;
//   giftCardRevenue: number;
//   regularItems: number;
//   giftCardItems: number;
// }

// export interface ReturnAnalytics {
//   totalRestockingFees: number;
//   totalReturnShippingFees: number;
//   totalReturnFees: number;
//   ordersWithRestockingFees: number;
//   ordersWithReturnShipping: number;
// }

// export interface RefundDiscrepancyAnalytics {
//   totalRefundDiscrepancy: number;
//   ordersWithOverRefunds: number;
//   ordersWithUnderRefunds: number;
//   totalOverRefundAmount: number;
//   totalUnderRefundAmount: number;
// }

// // Main Analytics Data Interface
// export interface AnalyticsData {
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
//   // Enhanced Analytics Fields
//   giftCardAnalytics?: GiftCardAnalytics;
//   returnAnalytics?: ReturnAnalytics;
//   refundDiscrepancyAnalytics?: RefundDiscrepancyAnalytics;
//   // Gift Card Data
//   giftCardData?: GiftCardData;
// }

// export interface CachedAnalyticsData extends AnalyticsData {
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

// // Dashboard Data Interfaces
// export interface OrderData {
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

// // Extended interface for email with additional fields
// export interface EmailOrderData extends OrderData {
//   fulfilledOrders: number;
//   unfulfilledOrders: number;
//   totalDiscounts: number;
//   totalShipping: number;
//   totalTaxes: number;
//   totalReturns: number;
//   returnFees: number;
//   discountRate: number;
//   shippingRate: number;
//   taxRate: number;
//   returnRate: number;
//   averageItemsPerOrder: number;
//   dailySales: Array<{ date: string; revenue: number; orders: number; items: number; fulfilled?: number }>;
//   weeklySales: Array<{ week: string; revenue: number; orders: number; items: number }>;
//   monthlySales: Array<{ month: string; revenue: number; orders: number; items: number }>;
//   yesterdayRevenue: number;
//   yesterdayOrders: number;
//   yesterdayItems: number;
//   lastWeekRevenue: number;
//   lastWeekOrders: number;
//   lastWeekItems: number;
//   todayFulfilled: number;
//   todayUnfulfilled: number;
//   last7DaysFulfilled: number;
//   last7DaysUnfulfilled: number;
//   revenueChangeVsLastWeek: number;
//   bestDay: { date: string; revenue: number; orders: number; items: number };
//   averageDailyRevenue: number;
//   last7DaysTotalCustomers: number;
//   last7DaysRepeatCustomers: number;
//   last7DaysNewCustomers: number;
//   last7DaysRepeatCustomerRate: number;
//   customerTypeData: { new: number; repeat: number };
//   fulfillmentStatusData: { fulfilled: number; unfulfilled: number };
//   weeklyRevenueTrend: Array<{ week: string; revenue: number }>;
//   monthlyComparison: Array<{ month: string; revenue: number; orders: number }>;
//   dailyPerformance: Array<{ day: string; revenue: number; orders: number }>;
//   ordersLoaded: number;
//   currentDateInShopTZ: string;
// }

// // Order Event Interface - ENHANCED WITH NEW EVENT TYPES
// export interface OrderEvent {
//   orderId: string;
//   orderName: string;
//   eventType: 
//     | 'refund' 
//     | 'exchange' 
//     | 'partial_refund' 
//     | 'modification' 
//     | 'return' 
//     | 'discount' 
//     | 'item_added' 
//     | 'item_removed'
//     | 'refund_shipping'
//     | 'over_refund'
//     | 'under_refund'
//     | 'restocking_fee'
//     | 'return_shipping_fee'
//     | 'product_return'
//     | 'return_tax'
//     | 'tax_adjustment';
//   eventDate: string;
//   amount: number;
//   currencyCode: string;
//   description: string;
//   details?: any;
// }

// // Event Detection Response Interface
// export interface EventDetectionData {
//   pastOrderEvents: OrderEvent[];
//   eventSummary: EventSummary;
//   ordersWithEventsCount: number;
//   totalEventsCount: number;
// }

// // Today's Orders Response Interface
// export interface TodayOrdersResponse {
//   today: {
//     regularOrders: any[];
//     giftCardOrders: any[];
//   };
//   summaries: {
//     regular: any;
//     giftCard: any;
//   };
//   events: EventDetectionData;
//   summary: {
//     orderCount: number;
//     date: string;
//     storeTimezone: string;
//   };
//   debug: {
//     totalFetched: number;
//     todayFiltered: number;
//     regularOrders: number;
//     giftCardOrders: number;
//   };
// }
























// types/analytics.ts - CORRECTED VERSION

// ==================== TYPE DEFINITIONS ====================

export interface Order {
  id: number;
  created_at: string;
  total_price: string;
  total_discounts?: string;
  total_shipping_price_set?: {
    shop_money: { amount: string };
  };
  total_tax?: string;
  total_refunds?: string;
  fulfillment_status?: string;
  line_items?: Array<{
    quantity: number;
  }>;
  customer?: {
    id?: string | number;
  };
}

// Gift Card Data Interface
export interface GiftCardData {
  totalSales: number;
  activatedCards: number;
  usedCards: number;
  remainingBalance: number;
  breakdown?: Array<{
    title: string;
    subtitle: string;
    metrics: Array<{ label: string; value: string }>;
  }>;
  recentActivity?: {
    activations: Array<{
      cardNumber: string;
      amount: number;
      date: string;
    }>;
    usage: Array<{
      cardNumber: string;
      amount: number;
      date: string;
    }>;
  };
}

// EventSummary type - ENHANCED WITH NEW PROPERTIES
// EventSummary type - ENHANCED WITH NEW PROPERTIES
export interface EventSummary {
  refunds: {
    count: number;
    value: number;
  };
  exchanges: {
    count: number;
    value: number;
  };
  partialRefunds: {
    count: number;
    value: number;
  };
  modifications: {
    count: number;
    value: number;
  };
  returns: {
    count: number;
    value: number;
  };
  discounts: {
    count: number;
    value: number;
  };
  // NEW PROPERTIES FOR COMPREHENSIVE METRICS
  restockingFees: {
    count: number;
    value: number;
  };
  returnShippingFees: {
    count: number;
    value: number;
  };
  refundShipping: {
    count: number;
    value: number;
  };
  taxAdjustments: {
    count: number;
    value: number;
  };
  refundTaxes: {
    count: number;
    value: number;
  };
  newLineItems: { // ADD THIS NEW PROPERTY
    count: number;
    value: number;
  };
  totalEvents: number;
  netValue: number;
}

export interface OrderStats {
  total: number;
  items: number;
  fulfilled: number;
  unfulfilled: number;
  discounts: number;
  returns: number;
  netSales: number;
  shipping: number;
  taxes: number;
  extraFees: number;
  totalSales: number;
  shippingRefunds: number;
  netReturns: number;
  totalRefund: number;
  discountsReturned?: number;
  netDiscounts?: number;
  returnShippingCharges?: number;
  restockingFees?: number;
  returnFees?: number;
  refundDiscrepancy?: number;
  hasSubsequentEvents: boolean;
  eventSummary: EventSummary | null;
  refundsCount: number;
  financialStatus: string;
  orderCount: number;
}

export interface CustomerData {
  newCustomers: number;
  repeatedCustomers: number;
  totalCustomers: number;
}

// Enhanced Analytics Interfaces
export interface GiftCardAnalytics {
  regularOrders: number;
  giftCardOrders: number;
  mixedOrders: number;
  regularRevenue: number;
  giftCardRevenue: number;
  regularItems: number;
  giftCardItems: number;
}

export interface ReturnAnalytics {
  totalRestockingFees: number;
  totalReturnShippingFees: number;
  totalReturnFees: number;
  ordersWithRestockingFees: number;
  ordersWithReturnShipping: number;
}

export interface RefundDiscrepancyAnalytics {
  totalRefundDiscrepancy: number;
  ordersWithOverRefunds: number;
  ordersWithUnderRefunds: number;
  totalOverRefundAmount: number;
  totalUnderRefundAmount: number;
}

// Main Analytics Data Interface
export interface AnalyticsData {
  shop: string;
  totals: Record<string, OrderStats>;
  dailyTotals: Record<string, OrderStats & CustomerData>;
  weeklyTotals: Record<string, OrderStats & CustomerData>;
  monthlyTotals: Record<string, OrderStats & CustomerData>;
  totalOrders: number;
  totalCustomerData: CustomerData;
  monthRanges: string[];
  dailyKeys: string[];
  weeklyKeys: string[];
  lastUpdated: string;
  shopTimeZone: string;
  shopCurrency: string;
  // Enhanced Analytics Fields
  giftCardAnalytics?: GiftCardAnalytics;
  returnAnalytics?: ReturnAnalytics;
  refundDiscrepancyAnalytics?: RefundDiscrepancyAnalytics;
  // Gift Card Data
  giftCardData?: GiftCardData;
}

export interface CachedAnalyticsData extends AnalyticsData {
  _cacheInfo?: {
    fetchMode: "incremental" | "full";
    apiSuccess: boolean;
    cacheHealth: {
      total: number;
      valid: number;
      expired: number;
      health: number;
    };
    cacheStats: {
      size: number;
      version: number;
    };
    cacheUsed: boolean;
    cacheHit: boolean;
    fallbackUsed: boolean;
    cacheTimestamp?: number;
    performance?: {
      cacheOperationTime: number;
      totalLoaderTime: number;
    };
  };
}

// Dashboard Data Interfaces
export interface OrderData {
  totalOrders: number;
  totalCustomers: number;
  fulfillmentRate: number;
  totalRevenue: number;
  netRevenue: number;
  averageOrderValue: number;
  totalItems: number;
  todayOrders: number;
  todayRevenue: number;
  todayItems: number;
  ordersChangeVsYesterday: number;
  revenueChangeVsYesterday: number;
  itemsChangeVsYesterday: number;
  newCustomers: number;
  repeatCustomers: number;
  customerRetentionRate: number;
  averageOrderFrequency: number;
  shopTimezone: string;
  shopCurrency: string;
  totalRefunds?: number;
  totalExchanges?: number;
  totalPartialRefunds?: number;
  totalEvents?: number;
  ordersWithEvents?: number;
  netEventValue?: number;
}

// Extended interface for email with additional fields
export interface EmailOrderData extends OrderData {
  fulfilledOrders: number;
  unfulfilledOrders: number;
  totalDiscounts: number;
  totalShipping: number;
  totalTaxes: number;
  totalReturns: number;
  returnFees: number;
  discountRate: number;
  shippingRate: number;
  taxRate: number;
  returnRate: number;
  averageItemsPerOrder: number;
  dailySales: Array<{ date: string; revenue: number; orders: number; items: number; fulfilled?: number }>;
  weeklySales: Array<{ week: string; revenue: number; orders: number; items: number }>;
  monthlySales: Array<{ month: string; revenue: number; orders: number; items: number }>;
  yesterdayRevenue: number;
  yesterdayOrders: number;
  yesterdayItems: number;
  lastWeekRevenue: number;
  lastWeekOrders: number;
  lastWeekItems: number;
  todayFulfilled: number;
  todayUnfulfilled: number;
  last7DaysFulfilled: number;
  last7DaysUnfulfilled: number;
  revenueChangeVsLastWeek: number;
  bestDay: { date: string; revenue: number; orders: number; items: number };
  averageDailyRevenue: number;
  last7DaysTotalCustomers: number;
  last7DaysRepeatCustomers: number;
  last7DaysNewCustomers: number;
  last7DaysRepeatCustomerRate: number;
  customerTypeData: { new: number; repeat: number };
  fulfillmentStatusData: { fulfilled: number; unfulfilled: number };
  weeklyRevenueTrend: Array<{ week: string; revenue: number }>;
  monthlyComparison: Array<{ month: string; revenue: number; orders: number }>;
  dailyPerformance: Array<{ day: string; revenue: number; orders: number }>;
  ordersLoaded: number;
  currentDateInShopTZ: string;
}

// Order Event Interface - ENHANCED WITH NEW EVENT TYPES
// Order Event Interface - ENHANCED WITH NEW EVENT TYPES
export interface OrderEvent {
  orderId: string;
  orderName: string;
  eventType: 
    | 'refund' 
    | 'exchange' 
    | 'partial_refund' 
    | 'modification' 
    | 'return' 
    | 'discount' 
    | 'item_added' 
    | 'item_removed'
    | 'refund_shipping'
    | 'over_refund'
    | 'under_refund'
    | 'restocking_fee'
    | 'return_shipping_fee'
    | 'product_return'
    | 'return_tax'
    | 'tax_adjustment'
    | 'refund_tax'; // ADD THIS MISSING EVENT TYPE
  eventDate: string;
  amount: number;
  currencyCode: string;
  description: string;
  details?: any;
  internalId?: number;
}

// Event Detection Response Interface
export interface EventDetectionData {
  pastOrderEvents: OrderEvent[];
  eventSummary: EventSummary;
  ordersWithEventsCount: number;
  totalEventsCount: number;
}

// Today's Orders Response Interface
export interface TodayOrdersResponse {
  today: {
    regularOrders: any[];
    giftCardOrders: any[];
  };
  summaries: {
    regular: any;
    giftCard: any;
  };
  events: EventDetectionData;
  summary: {
    orderCount: number;
    date: string;
    storeTimezone: string;
  };
  debug: {
    totalFetched: number;
    todayFiltered: number;
    regularOrders: number;
    giftCardOrders: number;
  };
}


// ==================== ORDER CHANGE TRACKING TYPES ====================

export interface OrderChange {
  orderId: string;
  orderName: string;
  changeDate: string;
    changeType: 'line_item_added' | 'line_item_removed' | 'refund_issued' | 
              'return_processed' | 'discount_modified' | 'shipping_modified' | 
              'tax_modified' | 'return_fee_added' | 'restocking_fee_added' | 'modification';
  field: string;
  previousValue: number;
  newValue: number;
  delta: number;
  currencyCode: string;
  description: string;
  details?: any;
}

export interface OrderFinancialSnapshot {
  orderId: string;
  date: string; // YYYY-MM-DD in store timezone
  grossSales: number;
  discounts: number;
  returns: number;
  netSales: number;
  shippingCharges: number;
  returnFees: number;
  taxes: number;
  totalSales: number;
  lineItems: any[];
  refunds: any[];
  returnsData: any[];
  updatedAt: string;
}

