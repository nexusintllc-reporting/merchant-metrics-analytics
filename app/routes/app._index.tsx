// // ==================== 1. IMPORTS ====================
// import { LoaderFunctionArgs, json } from "@remix-run/node";
// import { useLoaderData, useNavigation } from "@remix-run/react";
// import { authenticate } from "../shopify.server";
// import "../styles/orders.css";
// import { useState, useMemo } from 'react';

// // Chart.js imports
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
// } from 'chart.js';
// import { Bar, Line, Pie, Doughnut } from 'react-chartjs-2';

// // ==================== 2. CHART.JS REGISTRATION ====================
// ChartJS.register(
//   CategoryScale,
//   LinearScale,
//   BarElement,
//   LineElement,
//   PointElement,
//   ArcElement,
//   Title,
//   Tooltip,
//   Legend
// );

// // ==================== 3. TYPES ====================
// interface OrderData {
//   totalOrders: number;
//   fulfilledOrders: number;
//   unfulfilledOrders: number;
//   totalRevenue: number;
//   totalDiscounts: number;
//   totalShipping: number;
//   totalTaxes: number;
//   totalReturns: number;
//   returnFees: number;
//   netRevenue: number;
//   discountRate: number;
//   shippingRate: number;
//   taxRate: number;
//   returnRate: number;
//   totalItems: number;
//   averageOrderValue: number;
//   averageItemsPerOrder: number;
//   dailySales: Array<{ date: string; revenue: number; orders: number; items: number; discounts: number; shipping: number; taxes: number; returns: number }>;
//   weeklySales: Array<{ week: string; revenue: number; orders: number; items: number; discounts: number; shipping: number; taxes: number; returns: number }>;
//   monthlySales: Array<{ month: string; revenue: number; orders: number; items: number; discounts: number; shipping: number; taxes: number; returns: number }>;
//   todayRevenue: number;
//   todayOrders: number;
//   todayItems: number;
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
//   fulfillmentRate: number;
//   revenueChangeVsYesterday: number;
//   ordersChangeVsYesterday: number;
//   itemsChangeVsYesterday: number;
//   revenueChangeVsLastWeek: number;
//   bestDay: { date: string; revenue: number; orders: number; items: number };
//   averageDailyRevenue: number;
//   totalCustomers: number;
//   repeatCustomers: number;
//   newCustomers: number;
//   repeatCustomerRate: number;
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
//   shopTimezone: string;
//   currentDateInShopTZ: string;
//   processingTime?: number;
// }

// // ==================== 4. HELPER FUNCTIONS ====================
// function getEmptyData(): Omit<OrderData, 'shopTimezone' | 'currentDateInShopTZ'> {
//   return {
//     totalOrders: 0,
//     fulfilledOrders: 0,
//     unfulfilledOrders: 0,
//     totalRevenue: 0,
//     totalDiscounts: 0,
//     totalShipping: 0,
//     totalTaxes: 0,
//     totalReturns: 0,
//     returnFees: 0,
//     netRevenue: 0,
//     discountRate: 0,
//     shippingRate: 0,
//     taxRate: 0,
//     returnRate: 0,
//     totalItems: 0,
//     averageOrderValue: 0,
//     averageItemsPerOrder: 0,
//     dailySales: [],
//     weeklySales: [],
//     monthlySales: [],
//     todayRevenue: 0,
//     todayOrders: 0,
//     todayItems: 0,
//     yesterdayRevenue: 0,
//     yesterdayOrders: 0,
//     yesterdayItems: 0,
//     lastWeekRevenue: 0,
//     lastWeekOrders: 0,
//     lastWeekItems: 0,
//     todayFulfilled: 0,
//     todayUnfulfilled: 0,
//     last7DaysFulfilled: 0,
//     last7DaysUnfulfilled: 0,
//     fulfillmentRate: 0,
//     revenueChangeVsYesterday: 0,
//     ordersChangeVsYesterday: 0,
//     itemsChangeVsYesterday: 0,
//     revenueChangeVsLastWeek: 0,
//     bestDay: { date: '', revenue: 0, orders: 0, items: 0 },
//     averageDailyRevenue: 0,
//     totalCustomers: 0,
//     repeatCustomers: 0,
//     newCustomers: 0,
//     repeatCustomerRate: 0,
//     last7DaysTotalCustomers: 0,
//     last7DaysRepeatCustomers: 0,
//     last7DaysNewCustomers: 0,
//     last7DaysRepeatCustomerRate: 0,
//     customerTypeData: { new: 0, repeat: 0 },
//     fulfillmentStatusData: { fulfilled: 0, unfulfilled: 0 },
//     weeklyRevenueTrend: [],
//     monthlyComparison: [],
//     dailyPerformance: [],
//     ordersLoaded: 0
//   };
// }

// // ==================== 5. TIMEZONE UTILITIES ====================
// class TimezoneHelper {
//   static getLocalDateKey(utcDate: Date, timezone: string): string {
//     try {
//       return utcDate.toLocaleDateString('en-CA', { 
//         timeZone: timezone,
//         year: 'numeric',
//         month: '2-digit',
//         day: '2-digit'
//       });
//     } catch (error) {
//       return utcDate.toISOString().split('T')[0];
//     }
//   }

//   static getCurrentDateInTimezone(timezone: string): string {
//     return this.getLocalDateKey(new Date(), timezone);
//   }

//   static getDateRangeInTimezone(timezone: string, days: number): string[] {
//     const dates: string[] = [];
//     const now = new Date();
    
//     for (let i = 0; i < days; i++) {
//       const date = new Date(now);
//       date.setDate(date.getDate() - i);
//       dates.push(this.getLocalDateKey(date, timezone));
//     }
    
//     return dates.reverse();
//   }

//   static getPreviousDate(currentDate: string, timezone: string): string {
//     try {
//       const current = new Date(currentDate + 'T00:00:00');
//       const previous = new Date(current);
//       previous.setDate(previous.getDate() - 1);
//       return this.getLocalDateKey(previous, timezone);
//     } catch (error) {
//       const current = new Date(currentDate + 'T00:00:00Z');
//       const previous = new Date(current);
//       previous.setUTCDate(previous.getUTCDate() - 1);
//       return previous.toISOString().split('T')[0];
//     }
//   }

//   static getWeekStartDate(date: Date, timezone: string): Date {
//     const localDateKey = this.getLocalDateKey(date, timezone);
//     const localDate = new Date(localDateKey + 'T00:00:00');
//     const dayOfWeek = localDate.getDay();
//     const weekStart = new Date(localDate);
//     weekStart.setDate(localDate.getDate() - dayOfWeek);
//     return weekStart;
//   }

//   static getMonthKey(date: Date, timezone: string): string {
//     const localDateKey = this.getLocalDateKey(date, timezone);
//     const localDate = new Date(localDateKey + 'T00:00:00');
//     return `${localDate.getFullYear()}-${(localDate.getMonth() + 1).toString().padStart(2, "0")}`;
//   }
// }

// // ==================== 6. DATA PROCESSING ====================
// function processOrdersData(orders: any[], shopTimezone: string = 'UTC'): Omit<OrderData, 'shopTimezone' | 'currentDateInShopTZ'> {
//   const totalOrders = orders.length;
//   const fulfilledOrders = orders.filter((o: any) => o.node.displayFulfillmentStatus === "FULFILLED").length;
//   const unfulfilledOrders = totalOrders - fulfilledOrders;

//   const totalRevenue = orders.reduce((sum: number, o: any) => {
//     const amount = parseFloat(o.node.currentTotalPriceSet?.shopMoney?.amount || '0');
//     return sum + (isNaN(amount) ? 0 : amount);
//   }, 0);

//   const totalItems = orders.reduce((sum: number, o: any) => {
//     const lineItems = o.node.lineItems?.edges || [];
//     const itemsInOrder = lineItems.reduce((itemSum: number, item: any) => {
//       return itemSum + (item.node.quantity || 0);
//     }, 0);
//     return sum + itemsInOrder;
//   }, 0);

//   const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;
//   const averageItemsPerOrder = totalOrders > 0 ? totalItems / totalOrders : 0;

//   const totalDiscounts = orders.reduce((sum: number, o: any) => {
//     const amount = parseFloat(o.node.totalDiscountsSet?.shopMoney?.amount || '0');
//     return sum + (isNaN(amount) ? 0 : amount);
//   }, 0);

//   const totalShipping = orders.reduce((sum: number, o: any) => {
//     const amount = parseFloat(o.node.totalShippingPriceSet?.shopMoney?.amount || '0');
//     return sum + (isNaN(amount) ? 0 : amount);
//   }, 0);

//   const totalTaxes = orders.reduce((sum: number, o: any) => {
//     const amount = parseFloat(o.node.totalTaxSet?.shopMoney?.amount || '0');
//     return sum + (isNaN(amount) ? 0 : amount);
//   }, 0);

//   const totalReturns = orders.reduce((sum: number, o: any) => {
//     const refunds = o.node.refunds || [];
//     const refundAmount = refunds.reduce((refundSum: number, refund: any) => {
//       const amount = parseFloat(refund.totalRefundedSet?.shopMoney?.amount || '0');
//       return refundSum + (isNaN(amount) ? 0 : amount);
//     }, 0);
//     return sum + refundAmount;
//   }, 0);

//   const netRevenue = totalRevenue - totalReturns;
//   const discountRate = totalRevenue > 0 ? (totalDiscounts / totalRevenue) * 100 : 0;
//   const shippingRate = totalRevenue > 0 ? (totalShipping / totalRevenue) * 100 : 0;
//   const taxRate = totalRevenue > 0 ? (totalTaxes / totalRevenue) * 100 : 0;
//   const returnRate = totalRevenue > 0 ? (totalReturns / totalRevenue) * 100 : 0;

//   const salesByDay: Record<string, { revenue: number; orders: number; items: number; discounts: number; shipping: number; taxes: number; returns: number }> = {};
//   const salesByWeek: Record<string, { revenue: number; orders: number; items: number; discounts: number; shipping: number; taxes: number; returns: number }> = {};
//   const salesByMonth: Record<string, { revenue: number; orders: number; items: number; discounts: number; shipping: number; taxes: number; returns: number }> = {};

//   const currentDateInShopTZ = TimezoneHelper.getCurrentDateInTimezone(shopTimezone);
//   const yesterdayInShopTZ = TimezoneHelper.getPreviousDate(currentDateInShopTZ, shopTimezone);
//   const lastWeekSameDayInShopTZ = TimezoneHelper.getPreviousDate(currentDateInShopTZ, shopTimezone);
  
//   const last7DaysKeys = TimezoneHelper.getDateRangeInTimezone(shopTimezone, 7);

//   let todayRevenue = 0;
//   let todayOrders = 0;
//   let todayItems = 0;
//   let yesterdayRevenue = 0;
//   let yesterdayOrders = 0;
//   let yesterdayItems = 0;
//   let lastWeekRevenue = 0;
//   let lastWeekOrders = 0;
//   let lastWeekItems = 0;

//   let todayFulfilled = 0;
//   let todayUnfulfilled = 0;
//   let last7DaysFulfilled = 0;
//   let last7DaysUnfulfilled = 0;

//   const customerOrderCount: Record<string, number> = {};
//   const last7DaysCustomers: Record<string, number> = {};

//   orders.forEach((o: any) => {
//     const createdAtUTC = new Date(o.node.createdAt);
//     const revenue = parseFloat(o.node.currentTotalPriceSet?.shopMoney?.amount || '0');
//     const discounts = parseFloat(o.node.totalDiscountsSet?.shopMoney?.amount || '0');
//     const shipping = parseFloat(o.node.totalShippingPriceSet?.shopMoney?.amount || '0');
//     const taxes = parseFloat(o.node.totalTaxSet?.shopMoney?.amount || '0');
    
//     const lineItems = o.node.lineItems?.edges || [];
//     const itemsInOrder = lineItems.reduce((sum: number, item: any) => {
//       return sum + (item.node.quantity || 0);
//     }, 0);
    
//     const refunds = o.node.refunds || [];
//     const returns = refunds.reduce((refundSum: number, refund: any) => {
//       const amount = parseFloat(refund.totalRefundedSet?.shopMoney?.amount || '0');
//       return refundSum + (isNaN(amount) ? 0 : amount);
//     }, 0);
    
//     const dateKey = TimezoneHelper.getLocalDateKey(createdAtUTC, shopTimezone);
    
//     const isToday = dateKey === currentDateInShopTZ;
//     const isYesterday = dateKey === yesterdayInShopTZ;
//     const isLastWeekSameDay = dateKey === lastWeekSameDayInShopTZ;
//     const isLast7Days = last7DaysKeys.includes(dateKey);

//     if (isToday) {
//       todayRevenue += revenue;
//       todayOrders += 1;
//       todayItems += itemsInOrder;
      
//       if (o.node.displayFulfillmentStatus === "FULFILLED") {
//         todayFulfilled += 1;
//       } else {
//         todayUnfulfilled += 1;
//       }
//     }
    
//     if (isYesterday) {
//       yesterdayRevenue += revenue;
//       yesterdayOrders += 1;
//       yesterdayItems += itemsInOrder;
//     }
    
//     if (isLastWeekSameDay) {
//       lastWeekRevenue += revenue;
//       lastWeekOrders += 1;
//       lastWeekItems += itemsInOrder;
//     }

//     if (isLast7Days) {
//       if (o.node.displayFulfillmentStatus === "FULFILLED") {
//         last7DaysFulfilled += 1;
//       } else {
//         last7DaysUnfulfilled += 1;
//       }
//     }

//     if (!salesByDay[dateKey]) {
//       salesByDay[dateKey] = { revenue: 0, orders: 0, items: 0, discounts: 0, shipping: 0, taxes: 0, returns: 0 };
//     }
//     salesByDay[dateKey].revenue += revenue;
//     salesByDay[dateKey].orders += 1;
//     salesByDay[dateKey].items += itemsInOrder;
//     salesByDay[dateKey].discounts += discounts;
//     salesByDay[dateKey].shipping += shipping;
//     salesByDay[dateKey].taxes += taxes;
//     salesByDay[dateKey].returns += returns;

//     const weekStart = TimezoneHelper.getWeekStartDate(createdAtUTC, shopTimezone);
//     const weekKey = `${weekStart.getFullYear()}-W${Math.ceil((weekStart.getDate() + 6) / 7)}`;
    
//     if (!salesByWeek[weekKey]) {
//       salesByWeek[weekKey] = { revenue: 0, orders: 0, items: 0, discounts: 0, shipping: 0, taxes: 0, returns: 0 };
//     }
//     salesByWeek[weekKey].revenue += revenue;
//     salesByWeek[weekKey].orders += 1;
//     salesByWeek[weekKey].items += itemsInOrder;
//     salesByWeek[weekKey].discounts += discounts;
//     salesByWeek[weekKey].shipping += shipping;
//     salesByWeek[weekKey].taxes += taxes;
//     salesByWeek[weekKey].returns += returns;

//     const monthKey = TimezoneHelper.getMonthKey(createdAtUTC, shopTimezone);
//     if (!salesByMonth[monthKey]) {
//       salesByMonth[monthKey] = { revenue: 0, orders: 0, items: 0, discounts: 0, shipping: 0, taxes: 0, returns: 0 };
//     }
//     salesByMonth[monthKey].revenue += revenue;
//     salesByMonth[monthKey].orders += 1;
//     salesByMonth[monthKey].items += itemsInOrder;
//     salesByMonth[monthKey].discounts += discounts;
//     salesByMonth[monthKey].shipping += shipping;
//     salesByMonth[monthKey].taxes += taxes;
//     salesByMonth[monthKey].returns += returns;

//     const customerId = o.node.customer?.id;
//     if (customerId) {
//       customerOrderCount[customerId] = (customerOrderCount[customerId] || 0) + 1;
//     }
    
//     if (isLast7Days && customerId) {
//       last7DaysCustomers[customerId] = (last7DaysCustomers[customerId] || 0) + 1;
//     }
//   });

//   const totalCustomers = Object.keys(customerOrderCount).length;
//   const repeatCustomers = Object.values(customerOrderCount).filter(count => count > 1).length;
//   const repeatCustomerRate = totalCustomers > 0 ? (repeatCustomers / totalCustomers) * 100 : 0;
//   const newCustomers = totalCustomers - repeatCustomers;

//   const last7DaysTotalCustomers = Object.keys(last7DaysCustomers).length;
//   const last7DaysRepeatCustomers = Object.values(last7DaysCustomers).filter(count => count > 1).length;
//   const last7DaysRepeatCustomerRate = last7DaysTotalCustomers > 0 ? (last7DaysRepeatCustomers / last7DaysTotalCustomers) * 100 : 0;
//   const last7DaysNewCustomers = last7DaysTotalCustomers - last7DaysRepeatCustomers;

//   const dailySales = last7DaysKeys.map(date => {
//     const dayData = salesByDay[date] || { revenue: 0, orders: 0, items: 0, discounts: 0, shipping: 0, taxes: 0, returns: 0 };
//     return {
//       date,
//       revenue: dayData.revenue,
//       orders: dayData.orders,
//       items: dayData.items,
//       discounts: dayData.discounts,
//       shipping: dayData.shipping,
//       taxes: dayData.taxes,
//       returns: dayData.returns
//     };
//   });

//   const weeklyEntries = Object.entries(salesByWeek)
//     .sort((a, b) => a[0].localeCompare(b[0]))
//     .slice(-8);

//   const weeklySales = weeklyEntries.map(([week, data]) => ({
//     week,
//     revenue: data.revenue,
//     orders: data.orders,
//     items: data.items,
//     discounts: data.discounts,
//     shipping: data.shipping,
//     taxes: data.taxes,
//     returns: data.returns
//   }));

//   const monthlyEntries = Object.entries(salesByMonth)
//     .sort((a, b) => a[0].localeCompare(b[0]))
//     .slice(-6);

//   const monthlySales = monthlyEntries.map(([month, data]) => ({
//     month,
//     revenue: data.revenue,
//     orders: data.orders,
//     items: data.items,
//     discounts: data.discounts,
//     shipping: data.shipping,
//     taxes: data.taxes,
//     returns: data.returns
//   }));

//   const fulfillmentRate = totalOrders > 0 ? (fulfilledOrders / totalOrders) * 100 : 0;
  
//   const revenueChangeVsYesterday = yesterdayRevenue > 0 
//     ? ((todayRevenue - yesterdayRevenue) / yesterdayRevenue) * 100 
//     : todayRevenue > 0 ? 100 : 0;
  
//   const ordersChangeVsYesterday = yesterdayOrders > 0 
//     ? ((todayOrders - yesterdayOrders) / yesterdayOrders) * 100 
//     : todayOrders > 0 ? 100 : 0;

//   const itemsChangeVsYesterday = yesterdayItems > 0 
//     ? ((todayItems - yesterdayItems) / yesterdayItems) * 100 
//     : todayItems > 0 ? 100 : 0;
  
//   const revenueChangeVsLastWeek = lastWeekRevenue > 0 
//     ? ((todayRevenue - lastWeekRevenue) / lastWeekRevenue) * 100 
//     : todayRevenue > 0 ? 100 : 0;

//   const bestDay = dailySales.reduce((best, current) => 
//     current.revenue > best.revenue ? current : best, { date: '', revenue: 0, orders: 0, items: 0, discounts: 0, shipping: 0, taxes: 0, returns: 0 }
//   );

//   const averageDailyRevenue = dailySales.length > 0 
//     ? dailySales.reduce((sum, day) => sum + day.revenue, 0) / dailySales.length 
//     : 0;

//   const customerTypeData = {
//     new: newCustomers,
//     repeat: repeatCustomers
//   };

//   const fulfillmentStatusData = {
//     fulfilled: fulfilledOrders,
//     unfulfilled: unfulfilledOrders
//   };

//   const weeklyRevenueTrend = weeklySales.map(week => ({
//     week: `Week ${week.week.split('-W')[1]}`,
//     revenue: week.revenue
//   }));

//   const monthlyComparison = monthlySales.map(month => {
//     const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
//     const monthNumber = parseInt(month.month.split('-')[1]);
//     return {
//       month: monthNames[monthNumber - 1],
//       revenue: month.revenue,
//       orders: month.orders
//     };
//   });

//   const dailyPerformance = dailySales.map(day => {
//     const date = new Date(day.date);
//     const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
//     return {
//       day: dayNames[date.getDay()],
//       revenue: day.revenue,
//       orders: day.orders
//     };
//   });

//   return {
//     totalOrders,
//     fulfilledOrders,
//     unfulfilledOrders,
//     totalRevenue,
//     totalDiscounts,
//     totalShipping,
//     totalTaxes,
//     totalReturns,
//     returnFees: totalReturns,
//     netRevenue,
//     discountRate,
//     shippingRate,
//     taxRate,
//     returnRate,
//     totalItems,
//     averageOrderValue,
//     averageItemsPerOrder,
//     dailySales,
//     weeklySales,
//     monthlySales,
//     todayRevenue,
//     todayOrders,
//     todayItems,
//     yesterdayRevenue,
//     yesterdayOrders,
//     yesterdayItems,
//     lastWeekRevenue,
//     lastWeekOrders,
//     lastWeekItems,
//     todayFulfilled,
//     todayUnfulfilled,
//     last7DaysFulfilled,
//     last7DaysUnfulfilled,
//     fulfillmentRate,
//     revenueChangeVsYesterday,
//     ordersChangeVsYesterday,
//     itemsChangeVsYesterday,
//     revenueChangeVsLastWeek,
//     bestDay,
//     averageDailyRevenue,
//     totalCustomers,
//     repeatCustomers,
//     newCustomers,
//     repeatCustomerRate,
//     last7DaysTotalCustomers,
//     last7DaysRepeatCustomers,
//     last7DaysNewCustomers, 
//     last7DaysRepeatCustomerRate,
//     customerTypeData,
//     fulfillmentStatusData,
//     weeklyRevenueTrend,
//     monthlyComparison,
//     dailyPerformance,
//     ordersLoaded: orders.length,
//   };
// }

// // ==================== 7. REQUEST VALIDATION ====================
// const validateRequest = (request: Request) => {
//   const url = new URL(request.url);
//   const allowedPaths = ['/app', '/products'];
  
//   if (!allowedPaths.some(path => url.pathname.startsWith(path))) {
//     throw new Error('Invalid request path');
//   }
// };

// // ==================== 8. API SAFETY ====================
// class APISafety {
//   static readonly MAX_RETRIES = 3;
//   static readonly TIMEOUT_MS = 10000;
//   static readonly BATCH_SIZE = 50;
//   static readonly MAX_API_CALLS = 10;

//   static async safeGraphQLCall(admin: any, query: string, retryCount = 0): Promise<any> {
//     try {
//       const timeoutPromise = new Promise((_, reject) => {
//         setTimeout(() => reject(new Error('Request timeout')), this.TIMEOUT_MS);
//       });

//       const graphqlPromise = admin.graphql(query);
      
//       const response = await Promise.race([graphqlPromise, timeoutPromise]) as any;
//       const data = await response.json();

//       if (data.errors && data.errors.length > 0) {
//         throw new Error('GraphQL API error');
//       }

//       return data;
//     } catch (error: any) {
//       if (retryCount < this.MAX_RETRIES) {
//         await new Promise(resolve => setTimeout(resolve, 1000 * Math.pow(2, retryCount)));
//         return this.safeGraphQLCall(admin, query, retryCount + 1);
//       }
//       throw error;
//     }
//   }

//   static validateOrderData(order: any): boolean {
//     if (!order || !order.node) return false;
    
//     try {
//       const amount = parseFloat(order.node.currentTotalPriceSet?.shopMoney?.amount || '0');
//       return !isNaN(amount) && amount >= 0;
//     } catch {
//       return false;
//     }
//   }
// }

// // ==================== 9. LOADER FUNCTION ====================
// export const loader = async ({ request }: LoaderFunctionArgs) => {
//   const startTime = Date.now();
  
//   try {
//     validateRequest(request);

//     const { admin, session } = await authenticate.admin(request);

//     const shopResponse = await APISafety.safeGraphQLCall(admin, `
//       {
//         shop {
//           ianaTimezone
//         }
//       }
//     `);
    
//     const shopData = shopResponse;
//     const shopTimezone = shopData.data?.shop?.ianaTimezone || 'UTC';

//     const MAX_ORDERS = 250;
//     let allOrders: any[] = [];
//     let hasNextPage = true;
//     let endCursor: string | null = null;
//     let apiCallCount = 0;

//     while (hasNextPage && allOrders.length < MAX_ORDERS && apiCallCount < APISafety.MAX_API_CALLS) {
//       const ordersQuery = `
//         {
//           orders(
//             first: ${APISafety.BATCH_SIZE}, 
//             ${endCursor ? `after: "${endCursor}",` : ''}
//             sortKey: CREATED_AT, 
//             reverse: true
//           ) {
//             pageInfo {
//               hasNextPage
//               endCursor
//             }
//             edges {
//               node {
//                 id
//                 createdAt
//                 displayFulfillmentStatus
//                 currentTotalPriceSet {
//                   shopMoney {
//                     amount
//                   }
//                 }
//                 totalShippingPriceSet {
//                   shopMoney {
//                     amount
//                   }
//                 }
//                 totalTaxSet {
//                   shopMoney {
//                     amount
//                   }
//                 }
//                 totalDiscountsSet {
//                   shopMoney {
//                     amount
//                   }
//                 }
//                 lineItems(first: 10) {
//                   edges {
//                     node {
//                       quantity
//                       originalTotalSet {
//                         shopMoney {
//                           amount
//                         }
//                       }
//                       discountedTotalSet {
//                         shopMoney {
//                           amount
//                         }
//                       }
//                     }
//                   }
//                 }
//                 refunds {
//                   totalRefundedSet {
//                     shopMoney {
//                       amount
//                     }
//                   }
//                 }
//                 customer {
//                   id
//                 }
//               }
//             }
//           }
//         }
//       `;

//       const ordersData = await APISafety.safeGraphQLCall(admin, ordersQuery);
//       apiCallCount++;
      
//       const ordersPage = ordersData.data?.orders?.edges || [];
      
//       const validOrders = ordersPage.filter(APISafety.validateOrderData);
//       allOrders = [...allOrders, ...validOrders];
      
//       hasNextPage = ordersData.data?.orders?.pageInfo?.hasNextPage || false;
//       endCursor = ordersData.data?.orders?.pageInfo?.endCursor;
      
//       if (!hasNextPage || allOrders.length >= MAX_ORDERS) break;

//       await new Promise(resolve => setTimeout(resolve, 100));
//     }

//     const orders = allOrders;
//     const processingTime = Date.now() - startTime;

//     if (orders.length === 0) {
//       return json({ 
//         ...getEmptyData(), 
//         shopTimezone,
//         currentDateInShopTZ: TimezoneHelper.getCurrentDateInTimezone(shopTimezone),
//         processingTime,
//         ordersLoaded: 0
//       });
//     }

//     const processedData = processOrdersData(orders, shopTimezone);
//     return json({ 
//       ...processedData, 
//       shopTimezone,
//       currentDateInShopTZ: TimezoneHelper.getCurrentDateInTimezone(shopTimezone),
//       processingTime
//     });
    
//   } catch (error: any) {
//     return json({ 
//       ...getEmptyData(), 
//       shopTimezone: 'UTC',
//       currentDateInShopTZ: TimezoneHelper.getCurrentDateInTimezone('UTC'),
//       processingTime: Date.now() - startTime,
//       ordersLoaded: 0
//     });
//   }
// };

// // ==================== 10. ICON COMPONENTS ====================
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
//   )
// };

// // ==================== 11. LOADING COMPONENT ====================
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
//         <h2>Loading Orders Dashboard</h2>
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

// // ==================== 12. MAIN COMPONENT ====================
// export default function Orders() {
//   const data = useLoaderData<typeof loader>();
//   const navigation = useNavigation();
//   const [isExporting, setIsExporting] = useState(false);

//   const isLoading = navigation.state === 'loading';

//   // const formatCurrency = (amount: number) => `$${amount.toFixed(2)}`;
//   // const formatNumber = (num: number) => num.toFixed(0);
//   // const formatPercent = (num: number) => `${num.toFixed(1)}%`;

//   const formatCurrency = (amount: number) => amount.toLocaleString('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 2 });
// const formatNumber = (num: number) => num.toLocaleString('en-US');
// const formatPercent = (num: number) => `${num.toFixed(1)}%`;

//   // ==================== 6-MONTH CALCULATIONS ====================
//   const sixMonthCustomerMetrics = useMemo(() => {
//     if (data.monthlySales.length === 0) return { new: 0, repeat: 0 };
    
//     const total6MonthOrders = data.monthlySales.reduce((sum, month) => sum + month.orders, 0);
//     const avgOrdersPerCustomer = data.totalOrders / data.totalCustomers;
//     const estimated6MonthCustomers = Math.round(total6MonthOrders / (avgOrdersPerCustomer || 1));
    
//     const newCustomerRatio = data.newCustomers / data.totalCustomers;
//     const repeatCustomerRatio = data.repeatCustomers / data.totalCustomers;
    
//     return {
//       new: Math.round(estimated6MonthCustomers * newCustomerRatio),
//       repeat: Math.round(estimated6MonthCustomers * repeatCustomerRatio)
//     };
//   }, [data.monthlySales, data.totalOrders, data.totalCustomers, data.newCustomers, data.repeatCustomers]);

//   const sixMonthFulfillmentMetrics = useMemo(() => {
//     if (data.monthlySales.length === 0) return { fulfilled: 0, unfulfilled: 0 };
    
//     const total6MonthOrders = data.monthlySales.reduce((sum, month) => sum + month.orders, 0);
//     const fulfillmentRate = data.fulfillmentRate / 100;
    
//     return {
//       fulfilled: Math.round(total6MonthOrders * fulfillmentRate),
//       unfulfilled: Math.round(total6MonthOrders * (1 - fulfillmentRate))
//     };
//   }, [data.monthlySales, data.fulfillmentRate]);

//   // Calculate financial totals for different periods
//   const last7DaysFinancials = useMemo(() => {
//     const totalRevenue = data.dailySales.reduce((sum, day) => sum + day.revenue, 0);
//     const totalDiscounts = data.dailySales.reduce((sum, day) => sum + day.discounts, 0);
//     const totalShipping = data.dailySales.reduce((sum, day) => sum + day.shipping, 0);
//     const totalTaxes = data.dailySales.reduce((sum, day) => sum + day.taxes, 0);
//     const totalReturns = data.dailySales.reduce((sum, day) => sum + day.returns, 0);
//     const netRevenue = totalRevenue - totalReturns;
    
//     return {
//       totalRevenue,
//       totalDiscounts,
//       totalShipping,
//       totalTaxes,
//       totalReturns,
//       netRevenue,
//       discountRate: totalRevenue > 0 ? (totalDiscounts / totalRevenue) * 100 : 0,
//       shippingRate: totalRevenue > 0 ? (totalShipping / totalRevenue) * 100 : 0,
//       taxRate: totalRevenue > 0 ? (totalTaxes / totalRevenue) * 100 : 0,
//       returnRate: totalRevenue > 0 ? (totalReturns / totalRevenue) * 100 : 0
//     };
//   }, [data.dailySales]);

//   const weeklyFinancials = useMemo(() => {
//     const totalRevenue = data.weeklySales.reduce((sum, week) => sum + week.revenue, 0);
//     const totalDiscounts = data.weeklySales.reduce((sum, week) => sum + week.discounts, 0);
//     const totalShipping = data.weeklySales.reduce((sum, week) => sum + week.shipping, 0);
//     const totalTaxes = data.weeklySales.reduce((sum, week) => sum + week.taxes, 0);
//     const totalReturns = data.weeklySales.reduce((sum, week) => sum + week.returns, 0);
//     const netRevenue = totalRevenue - totalReturns;
    
//     return {
//       totalRevenue,
//       totalDiscounts,
//       totalShipping,
//       totalTaxes,
//       totalReturns,
//       netRevenue,
//       discountRate: totalRevenue > 0 ? (totalDiscounts / totalRevenue) * 100 : 0,
//       shippingRate: totalRevenue > 0 ? (totalShipping / totalRevenue) * 100 : 0,
//       taxRate: totalRevenue > 0 ? (totalTaxes / totalRevenue) * 100 : 0,
//       returnRate: totalRevenue > 0 ? (totalReturns / totalRevenue) * 100 : 0
//     };
//   }, [data.weeklySales]);

//   const monthlyFinancials = useMemo(() => {
//     const totalRevenue = data.monthlySales.reduce((sum, month) => sum + month.revenue, 0);
//     const totalDiscounts = data.monthlySales.reduce((sum, month) => sum + month.discounts, 0);
//     const totalShipping = data.monthlySales.reduce((sum, month) => sum + month.shipping, 0);
//     const totalTaxes = data.monthlySales.reduce((sum, month) => sum + month.taxes, 0);
//     const totalReturns = data.monthlySales.reduce((sum, month) => sum + month.returns, 0);
//     const netRevenue = totalRevenue - totalReturns;
    
//     return {
//       totalRevenue,
//       totalDiscounts,
//       totalShipping,
//       totalTaxes,
//       totalReturns,
//       netRevenue,
//       discountRate: totalRevenue > 0 ? (totalDiscounts / totalRevenue) * 100 : 0,
//       shippingRate: totalRevenue > 0 ? (totalShipping / totalRevenue) * 100 : 0,
//       taxRate: totalRevenue > 0 ? (totalTaxes / totalRevenue) * 100 : 0,
//       returnRate: totalRevenue > 0 ? (totalReturns / totalRevenue) * 100 : 0
//     };
//   }, [data.monthlySales]);

//   // ==================== CHART DATA MEMOIZATION ====================
//   const chartData = useMemo(() => {
//     return {
//       customerDistribution: {
//         labels: ['New Customers', 'Repeat Customers'],
//         datasets: [
//           {
//             data: [sixMonthCustomerMetrics.new, sixMonthCustomerMetrics.repeat],
//             backgroundColor: ['#f59e0b', '#10b981'],
//             borderWidth: 2,
//             borderColor: '#fff'
//           }
//         ]
//       },
//       orderFulfillment: {
//         labels: ['Fulfilled', 'Unfulfilled'],
//         datasets: [
//           {
//             data: [sixMonthFulfillmentMetrics.fulfilled, sixMonthFulfillmentMetrics.unfulfilled],
//             backgroundColor: ['#10b981', '#ef4444'],
//             borderWidth: 2,
//             borderColor: '#fff'
//           }
//         ]
//       },
//       weeklyRevenue: {
//         labels: data.weeklyRevenueTrend.map(w => w.week),
//         datasets: [
//           {
//             label: 'Revenue',
//             data: data.weeklyRevenueTrend.map(w => w.revenue),
//             borderColor: '#3b82f6',
//             backgroundColor: 'rgba(59, 130, 246, 0.1)',
//             tension: 0.4,
//             fill: true,
//             borderWidth: 2,
//             pointBackgroundColor: '#3b82f6',
//             pointBorderColor: '#fff',
//             pointBorderWidth: 2,
//             pointRadius: 3,
//             pointHoverRadius: 5
//           }
//         ]
//       },
//       monthlyPerformance: {
//         labels: data.monthlyComparison.map(m => m.month),
//         datasets: [
//           {
//             label: 'Revenue',
//             data: data.monthlyComparison.map(m => m.revenue),
//             backgroundColor: 'rgba(59, 130, 246, 0.8)',
//             borderRadius: 4,
//             borderSkipped: false,
//           },
//           {
//             label: 'Orders',
//             data: data.monthlyComparison.map(m => m.orders),
//             backgroundColor: 'rgba(139, 92, 246, 0.8)',
//             borderRadius: 4,
//             borderSkipped: false,
//           }
//         ]
//       },
//       financialBreakdown: {
//         labels: ['Gross Revenue', 'Discounts', 'Shipping', 'Taxes', 'Returns'],
//         datasets: [
//           {
//             data: [
//               data.monthlySales.reduce((sum, month) => sum + month.revenue, 0),
//               data.monthlySales.reduce((sum, month) => sum + month.discounts, 0),
//               data.monthlySales.reduce((sum, month) => sum + month.shipping, 0),
//               data.monthlySales.reduce((sum, month) => sum + month.taxes, 0),
//               data.monthlySales.reduce((sum, month) => sum + month.returns, 0)
//             ],
//             backgroundColor: [
//               '#3b82f6', '#f59e0b', '#10b981', '#8b5cf6', '#ef4444'
//             ],
//             borderWidth: 2,
//             borderColor: '#fff',
//             hoverOffset: 8
//           }
//         ]
//       }
//     };
//   }, [data, sixMonthCustomerMetrics, sixMonthFulfillmentMetrics]);

//   // ==================== CHART OPTIONS MEMOIZATION ====================
//   const chartOptions = useMemo(() => ({
//     pie: {
//       responsive: true,
//       maintainAspectRatio: false,
//       plugins: { legend: { display: false } },
//       animation: {
//         duration: 500,
//         easing: 'easeOutQuart' as const
//       }
//     },
//     line: {
//       responsive: true,
//       maintainAspectRatio: false,
//       plugins: { 
//         legend: { display: false },
//         tooltip: {
//           mode: 'index' as const,
//           intersect: false
//         }
//       },
//       interaction: {
//         mode: 'nearest' as const,
//         axis: 'x' as const,
//         intersect: false
//       },
//       scales: {
//         x: {
//           grid: { display: false }
//         },
//         y: {
//           beginAtZero: true,
//           ticks: {
//             callback: function(this: any, value: any) {
//               return '$' + value;
//             }
//           },
//           grid: { color: 'rgba(0, 0, 0, 0.1)' }
//         }
//       },
//       animation: {
//         duration: 600,
//         easing: 'easeOutQuart' as const
//       }
//     },
//     bar: {
//       responsive: true,
//       maintainAspectRatio: false,
//       plugins: { 
//         legend: { display: false },
//         tooltip: {
//           mode: 'index' as const,
//           intersect: false
//         }
//       },
//       interaction: {
//         mode: 'index' as const,
//         intersect: false
//       },
//       scales: {
//         x: { grid: { display: false } },
//         y: { 
//           beginAtZero: true,
//           grid: { color: 'rgba(0, 0, 0, 0.1)' }
//         }
//       },
//       animation: {
//         duration: 600,
//         easing: 'easeOutQuart' as const
//       }
//     },
//     financialPie: {
//       responsive: true,
//       maintainAspectRatio: false,
//       plugins: { 
//         legend: { 
//           display: false 
//         },
//         tooltip: {
//           callbacks: {
//             label: function(context: any) {
//               const label = context.label || '';
//               const value = context.parsed;
//               const total = context.dataset.data.reduce((a: number, b: number) => a + b, 0);
//               const percentage = ((value / total) * 100).toFixed(1);
//               return `${label}: ${formatCurrency(value)} (${percentage}%)`;
//             }
//           }
//         }
//       },
//       animation: {
//         duration: 600,
//         easing: 'easeOutQuart' as const
//       }
//     }
//   }), []);

//   // ==================== INDIVIDUAL CHART COMPONENTS ====================
//   const CustomerDistributionChart = useMemo(() => (
//     <Pie 
//       data={chartData.customerDistribution}
//       options={chartOptions.pie}
//       height={120}
//       redraw={false}
//     />
//   ), [chartData.customerDistribution, chartOptions.pie]);

//   const OrderFulfillmentChart = useMemo(() => (
//     <Doughnut 
//       data={chartData.orderFulfillment}
//       options={chartOptions.pie}
//       height={120}
//       redraw={false}
//     />
//   ), [chartData.orderFulfillment, chartOptions.pie]);

//   const RevenueTrendChart = useMemo(() => (
//     <Line 
//       data={chartData.weeklyRevenue}
//       options={chartOptions.line}
//       height={120}
//       redraw={false}
//     />
//   ), [chartData.weeklyRevenue, chartOptions.line]);

//   const MonthlyPerformanceChart = useMemo(() => (
//     <Bar 
//       data={chartData.monthlyPerformance}
//       options={chartOptions.bar}
//       height={120}
//       redraw={false}
//     />
//   ), [chartData.monthlyPerformance, chartOptions.bar]);

//   const FinancialBreakdownChart = useMemo(() => (
//     <Pie 
//       data={chartData.financialBreakdown}
//       options={chartOptions.financialPie}
//       height={120}
//       redraw={false}
//     />
//   ), [chartData.financialBreakdown, chartOptions.financialPie]);

//   // ==================== LOADING STATE ====================
//   if (isLoading) {
//     return (
//       <div className="orders-dashboard">
//         <div className="dashboard-header">
//           <h1>Orders Dashboard</h1>
//         </div>
//         <LoadingProgress />
//       </div>
//     );
//   }

//   // ==================== COMPONENT RENDER ====================
//   return (
//     <div className="orders-dashboard">
//       <div className="dashboard-header">
//         <h1>Orders Dashboard</h1>
//         <button
//           className="print-button"
//           onClick={() => window.print()}
//           disabled={isExporting}
//         >
//           <Icon.Print />
//           Print Report
//         </button>
//       </div>

     
//       <div id="dashboard-content">
        
//         {/* TODAY'S PERFORMANCE SECTION */}
//         <div className="today-performance">
//           <h2>Today's Performance</h2>
          
//           {/* Primary Metrics Grid */}
//           <div className="primary-metrics-grid">
//             <div className={`metric-card orders ${data.ordersChangeVsYesterday >= 0 ? 'positive' : 'negative'}`}>
//               <p className="metric-value">{formatNumber(data.todayOrders)}</p>
//               <p className="metric-label">Today's Orders</p>
//               {data.ordersChangeVsYesterday !== 0 && (
//                 <div className={`metric-change ${data.ordersChangeVsYesterday >= 0 ? 'positive' : 'negative'}`}>
//                   {data.ordersChangeVsYesterday >= 0 ? <Icon.TrendUp /> : <Icon.TrendDown />} 
//                   {Math.abs(data.ordersChangeVsYesterday).toFixed(1)}% vs yesterday
//                 </div>
//               )}
//             </div>
            
//             <div className={`metric-card revenue ${data.revenueChangeVsYesterday >= 0 ? 'positive' : 'negative'}`}>
//               <p className="metric-value">{formatCurrency(data.todayRevenue)}</p>
//               <p className="metric-label">Today's Revenue</p>
//               {data.revenueChangeVsYesterday !== 0 && (
//                 <div className={`metric-change ${data.revenueChangeVsYesterday >= 0 ? 'positive' : 'negative'}`}>
//                   {data.revenueChangeVsYesterday >= 0 ? <Icon.TrendUp /> : <Icon.TrendDown />} 
//                   {Math.abs(data.revenueChangeVsYesterday).toFixed(1)}% vs yesterday
//                 </div>
//               )}
//             </div>
            
//             <div className={`metric-card items ${data.itemsChangeVsYesterday >= 0 ? 'positive' : 'negative'}`}>
//               <p className="metric-value">{formatNumber(data.todayItems)}</p>
//               <p className="metric-label">Items Ordered</p>
//               {data.itemsChangeVsYesterday !== 0 && (
//                 <div className={`metric-change ${data.itemsChangeVsYesterday >= 0 ? 'positive' : 'negative'}`}>
//                   {data.itemsChangeVsYesterday >= 0 ? <Icon.TrendUp /> : <Icon.TrendDown />} 
//                   {Math.abs(data.itemsChangeVsYesterday).toFixed(1)}% vs yesterday
//                 </div>
//               )}
//             </div>
//           </div>

//           {/* FULFILLMENT METRICS */}
//           <div className="fulfillment-metrics-grid">
//             <div className="fulfillment-metric-card today-fulfilled">
//               <div className="fulfillment-metric-value">{formatNumber(data.todayFulfilled)}</div>
//               <div className="fulfillment-metric-label">Fulfilled Today</div>
//               <div className="fulfillment-metric-period">Today</div>
//             </div>
            
//             <div className="fulfillment-metric-card today-unfulfilled">
//               <div className="fulfillment-metric-value">{formatNumber(data.todayUnfulfilled)}</div>
//               <div className="fulfillment-metric-label">Unfulfilled Today</div>
//               <div className="fulfillment-metric-period">Today</div>
//             </div>
            
//             <div className="fulfillment-metric-card week-fulfilled">
//               <div className="fulfillment-metric-value">{formatNumber(data.last7DaysFulfilled)}</div>
//               <div className="fulfillment-metric-label">Fulfilled</div>
//               <div className="fulfillment-metric-period">Last 7 Days</div>
//             </div>
            
//             <div className="fulfillment-metric-card week-unfulfilled">
//               <div className="fulfillment-metric-value">{formatNumber(data.last7DaysUnfulfilled)}</div>
//               <div className="fulfillment-metric-label">Unfulfilled</div>
//               <div className="fulfillment-metric-period">Last 7 Days</div>
//             </div>
//           </div>

//           {/* LAST 7 DAYS SUMMARY */}
//           <div className="last7days-section">
//             <h3>Last 7 Days Performance</h3>
            
//             {/* 7 Days Totals */}
//             <div className="last7days-grid">
//               <div className="last7days-total-card">
//                 <div className="last7days-total-value">
//                   {formatNumber(data.dailySales.reduce((sum, day) => sum + day.orders, 0))}
//                 </div>
//                 <div className="last7days-total-label">Total Orders</div>
//               </div>
              
//               <div className="last7days-total-card">
//                 <div className="last7days-total-value">
//                   {formatCurrency(data.dailySales.reduce((sum, day) => sum + day.revenue, 0))}
//                 </div>
//                 <div className="last7days-total-label">Total Revenue</div>
//               </div>
              
//               <div className="last7days-total-card">
//                 <div className="last7days-total-value">
//                   {formatNumber(data.dailySales.reduce((sum, day) => sum + day.items, 0))}
//                 </div>
//                 <div className="last7days-total-label">Total Items</div>
//               </div>
              
//               <div className="last7days-total-card">
//                 <div className="last7days-total-value">
//                   {formatCurrency(data.averageDailyRevenue)}
//                 </div>
//                 <div className="last7days-total-label">Avg Daily Revenue</div>
//               </div>
//             </div>

//             {/* Daily Breakdown */}
//             <div className="daily-breakdown">
//               <h4>Daily Breakdown</h4>
//               <div className="daily-cards-container">
//                 {data.dailySales.map((day, index) => {
//                   const [year, month, dayNum] = day.date.split('-').map(Number);
//                   const date = new Date(year, month - 1, dayNum);
                  
//                   const isToday = day.date === data.currentDateInShopTZ;
//                   const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
                  
//                   return (
//                     <div key={day.date} className={`daily-card ${isToday ? 'today' : ''}`}>
//                       <div className="daily-card-header">
//                         <div className="daily-date">
//                           {date.getDate()}/{date.getMonth() + 1}
//                         </div>
//                         <div className="daily-day">
//                           {dayNames[date.getDay()]}
//                         </div>
//                       </div>
                      
//                       <div className="daily-metrics">
//                         <div className="daily-metric orders">
//                           <span className="daily-metric-label">Orders</span>
//                           <span className="daily-metric-value">{formatNumber(day.orders)}</span>
//                         </div>
                        
//                         <div className="daily-metric revenue">
//                           <span className="daily-metric-label">Revenue</span>
//                           <span className="daily-metric-value">{formatCurrency(day.revenue)}</span>
//                         </div>
                        
//                         <div className="daily-metric items">
//                           <span className="daily-metric-label">Items</span>
//                           <span className="daily-metric-value">{formatNumber(day.items)}</span>
//                         </div>
//                       </div>
//                     </div>
//                   );
//                 })}
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* WEEK-OVER-WEEK INSIGHT */}
//         <div className="secondary-metrics">
//           <div className="insight-card">
//             <h4>Week-over-Week Revenue Change</h4>
//             <p className={`insight-value ${data.revenueChangeVsLastWeek >= 0 ? 'text-positive' : 'text-negative'}`}>
//               {data.revenueChangeVsLastWeek >= 0 ? <Icon.TrendUp /> : <Icon.TrendDown />} 
//               {Math.abs(data.revenueChangeVsLastWeek).toFixed(1)}%
//             </p>
//           </div>
//         </div>

//         {/* CUSTOMER INSIGHTS */}
//         <div className="customer-metrics">
//           <h3>Customer Insights</h3>
//           <div className="customer-metrics-grid">
//             <div className="customer-metric-card total-customers">
//               <div className="customer-metric-value">{formatNumber(data.totalCustomers)}</div>
//               <div className="customer-metric-label">Total Customers</div>
//             </div>
            
//             <div className="customer-metric-card new-customers">
//               <div className="customer-metric-value">{formatNumber(data.newCustomers)}</div>
//               <div className="customer-metric-label">New Customers</div>
//             </div>
            
//             <div className="customer-metric-card repeat-customers">
//               <div className="customer-metric-value">{formatNumber(data.repeatCustomers)}</div>
//               <div className="customer-metric-label">Repeat Customers</div>
//             </div>
            
//             <div className="customer-metric-card loyalty-rate">
//               <div className="customer-metric-value">{formatPercent(data.repeatCustomerRate)}</div>
//               <div className="customer-metric-label">Repeat Customer Rate</div>
//             </div>
//           </div>
//         </div>

//         {/* 7-DAY CUSTOMER INSIGHTS */}
//         <div className="customer-metrics">
//           <h3>Last 7 Days Customer Insights</h3>
          
//           <div className="customer-metrics-grid">
//             <div className="customer-metric-card total-customers">
//               <div className="customer-metric-value">{formatNumber(data.last7DaysTotalCustomers)}</div>
//               <div className="customer-metric-label">7-Day Total Customers</div>
//             </div>
            
//             <div className="customer-metric-card new-customers">
//               <div className="customer-metric-value">{formatNumber(data.last7DaysNewCustomers)}</div>
//               <div className="customer-metric-label">7-Day New Customers</div>
//             </div>
            
//             <div className="customer-metric-card repeat-customers">
//               <div className="customer-metric-value">{formatNumber(data.last7DaysRepeatCustomers)}</div>
//               <div className="customer-metric-label">7-Day Repeat Customers</div>
//             </div>
            
//             <div className="customer-metric-card loyalty-rate">
//               <div className="customer-metric-value">{formatPercent(data.last7DaysRepeatCustomerRate)}</div>
//               <div className="customer-metric-label">7-Day Repeat Rate</div>
//             </div>
//           </div>
//         </div>

//         {/* ==================== FINANCIAL BREAKDOWN SECTIONS ==================== */}

//         {/* 7-DAY FINANCIAL BREAKDOWN */}
//         <div className="financial-metrics">
//           <h3>Last 7 Days Financial Breakdown</h3>
//           <div className="financial-metrics-grid">
//             <div className="financial-metric-card revenue">
//               <div className="financial-metric-value">{formatCurrency(last7DaysFinancials.totalRevenue)}</div>
//               <div className="financial-metric-label">Gross Revenue</div>
//               <div className="financial-metric-period">7 Days</div>
//             </div>
            
//             <div className="financial-metric-card discounts">
//               <div className="financial-metric-value">{formatCurrency(last7DaysFinancials.totalDiscounts)}</div>
//               <div className="financial-metric-label">Total Discounts</div>
//               <div className="financial-metric-rate">{formatPercent(last7DaysFinancials.discountRate)} of revenue</div>
//             </div>
            
//             <div className="financial-metric-card shipping">
//               <div className="financial-metric-value">{formatCurrency(last7DaysFinancials.totalShipping)}</div>
//               <div className="financial-metric-label">Shipping Charges</div>
//               <div className="financial-metric-rate">{formatPercent(last7DaysFinancials.shippingRate)} of revenue</div>
//             </div>
            
//             <div className="financial-metric-card taxes">
//               <div className="financial-metric-value">{formatCurrency(last7DaysFinancials.totalTaxes)}</div>
//               <div className="financial-metric-label">Taxes Collected</div>
//               <div className="financial-metric-rate">{formatPercent(last7DaysFinancials.taxRate)} of revenue</div>
//             </div>
            
//             <div className="financial-metric-card returns">
//               <div className="financial-metric-value">{formatCurrency(last7DaysFinancials.totalReturns)}</div>
//               <div className="financial-metric-label">Returns & Refunds</div>
//               <div className="financial-metric-rate">{formatPercent(last7DaysFinancials.returnRate)} of revenue</div>
//             </div>
            
//             <div className="financial-metric-card net-revenue">
//               <div className="financial-metric-value">{formatCurrency(last7DaysFinancials.netRevenue)}</div>
//               <div className="financial-metric-label">Net Revenue</div>
//               <div className="financial-metric-period">After returns</div>
//             </div>
//           </div>

//           {/* Daily Financial Breakdown */}
//           <div className="daily-financial-breakdown">
//             <h4>Daily Financial Details</h4>
//             <div className="daily-financial-cards">
//               {data.dailySales.map((day, index) => {
//                 const [year, month, dayNum] = day.date.split('-').map(Number);
//                 const date = new Date(year, month - 1, dayNum);
//                 const isToday = day.date === data.currentDateInShopTZ;
//                 const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
//                 const dayNetRevenue = day.revenue - day.returns;
                
//                 return (
//                   <div key={day.date} className={`daily-financial-card ${isToday ? 'today' : ''}`}>
//                     <div className="daily-financial-header">
//                       <div className="daily-financial-date">
//                         {date.getDate()}/{date.getMonth() + 1}
//                       </div>
//                       <div className="daily-financial-day">
//                         {dayNames[date.getDay()]}
//                       </div>
//                     </div>
                    
//                     <div className="daily-financial-metrics">
//                       <div className="daily-financial-metric gross-revenue">
//                         <span className="daily-financial-label">Gross Revenue</span>
//                         <span className="daily-financial-value">{formatCurrency(day.revenue)}</span>
//                       </div>
                      
//                       <div className="daily-financial-metric discounts">
//                         <span className="daily-financial-label">Discounts</span>
//                         <span className="daily-financial-value">{formatCurrency(day.discounts)}</span>
//                       </div>
                      
//                       <div className="daily-financial-metric shipping">
//                         <span className="daily-financial-label">Shipping</span>
//                         <span className="daily-financial-value">{formatCurrency(day.shipping)}</span>
//                       </div>
                      
//                       <div className="daily-financial-metric taxes">
//                         <span className="daily-financial-label">Taxes</span>
//                         <span className="daily-financial-value">{formatCurrency(day.taxes)}</span>
//                       </div>
                      
//                       <div className="daily-financial-metric returns">
//                         <span className="daily-financial-label">Returns</span>
//                         <span className="daily-financial-value">{formatCurrency(day.returns)}</span>
//                       </div>
                      
//                       <div className="daily-financial-metric net-revenue">
//                         <span className="daily-financial-label">Net Revenue</span>
//                         <span className="daily-financial-value">{formatCurrency(dayNetRevenue)}</span>
//                       </div>
//                     </div>
//                   </div>
//                 );
//               })}
//             </div>
//           </div>
//         </div>

//         {/* WEEKLY FINANCIAL BREAKDOWN */}
//         <div className="financial-metrics">
//           <h3>Weekly Financial Breakdown (Last 8 Weeks)</h3>
//           <div className="financial-metrics-grid">
//             <div className="financial-metric-card revenue">
//               <div className="financial-metric-value">{formatCurrency(weeklyFinancials.totalRevenue)}</div>
//               <div className="financial-metric-label">Gross Revenue</div>
//               <div className="financial-metric-period">8 Weeks</div>
//             </div>
            
//             <div className="financial-metric-card discounts">
//               <div className="financial-metric-value">{formatCurrency(weeklyFinancials.totalDiscounts)}</div>
//               <div className="financial-metric-label">Total Discounts</div>
//               <div className="financial-metric-rate">{formatPercent(weeklyFinancials.discountRate)} of revenue</div>
//             </div>
            
//             <div className="financial-metric-card shipping">
//               <div className="financial-metric-value">{formatCurrency(weeklyFinancials.totalShipping)}</div>
//               <div className="financial-metric-label">Shipping Charges</div>
//               <div className="financial-metric-rate">{formatPercent(weeklyFinancials.shippingRate)} of revenue</div>
//             </div>
            
//             <div className="financial-metric-card taxes">
//               <div className="financial-metric-value">{formatCurrency(weeklyFinancials.totalTaxes)}</div>
//               <div className="financial-metric-label">Taxes Collected</div>
//               <div className="financial-metric-rate">{formatPercent(weeklyFinancials.taxRate)} of revenue</div>
//             </div>
            
//             <div className="financial-metric-card returns">
//               <div className="financial-metric-value">{formatCurrency(weeklyFinancials.totalReturns)}</div>
//               <div className="financial-metric-label">Returns & Refunds</div>
//               <div className="financial-metric-rate">{formatPercent(weeklyFinancials.returnRate)} of revenue</div>
//             </div>
            
//             <div className="financial-metric-card net-revenue">
//               <div className="financial-metric-value">{formatCurrency(weeklyFinancials.netRevenue)}</div>
//               <div className="financial-metric-label">Net Revenue</div>
//               <div className="financial-metric-period">After returns</div>
//             </div>
//           </div>

//           {/* Weekly Financial Breakdown */}
//           <div className="weekly-financial-breakdown">
//             <h4>Weekly Financial Details</h4>
//             <div className="weekly-financial-cards">
//               {data.weeklySales.map((week, index) => {
//                 const weekNetRevenue = week.revenue - week.returns;
//                 const discountRate = week.revenue > 0 ? (week.discounts / week.revenue) * 100 : 0;
//                 const shippingRate = week.revenue > 0 ? (week.shipping / week.revenue) * 100 : 0;
//                 const taxRate = week.revenue > 0 ? (week.taxes / week.revenue) * 100 : 0;
//                 const returnRate = week.revenue > 0 ? (week.returns / week.revenue) * 100 : 0;
                
//                 return (
//                   <div key={week.week} className="weekly-financial-card">
//                     <div className="weekly-financial-header">
//                       <div className="weekly-financial-label">Week {week.week.split('-W')[1]}</div>
//                       <div className="weekly-financial-period">{week.week.split('-')[0]}</div>
//                     </div>
                    
//                     <div className="weekly-financial-metrics">
//                       <div className="weekly-financial-metric gross-revenue">
//                         <span className="weekly-financial-label">Gross Revenue</span>
//                         <span className="weekly-financial-value">{formatCurrency(week.revenue)}</span>
//                       </div>
                      
//                       <div className="weekly-financial-metric discounts">
//                         <span className="weekly-financial-label">Discounts</span>
//                         <span className="weekly-financial-value">{formatCurrency(week.discounts)}</span>
//                         <span className="weekly-financial-rate">{formatPercent(discountRate)}</span>
//                       </div>
                      
//                       <div className="weekly-financial-metric shipping">
//                         <span className="weekly-financial-label">Shipping</span>
//                         <span className="weekly-financial-value">{formatCurrency(week.shipping)}</span>
//                         <span className="weekly-financial-rate">{formatPercent(shippingRate)}</span>
//                       </div>
                      
//                       <div className="weekly-financial-metric taxes">
//                         <span className="weekly-financial-label">Taxes</span>
//                         <span className="weekly-financial-value">{formatCurrency(week.taxes)}</span>
//                         <span className="weekly-financial-rate">{formatPercent(taxRate)}</span>
//                       </div>
                      
//                       <div className="weekly-financial-metric returns">
//                         <span className="weekly-financial-label">Returns</span>
//                         <span className="weekly-financial-value">{formatCurrency(week.returns)}</span>
//                         <span className="weekly-financial-rate">{formatPercent(returnRate)}</span>
//                       </div>
                      
//                       <div className="weekly-financial-metric net-revenue">
//                         <span className="weekly-financial-label">Net Revenue</span>
//                         <span className="weekly-financial-value">{formatCurrency(weekNetRevenue)}</span>
//                       </div>
//                     </div>
//                   </div>
//                 );
//               })}
//             </div>
//           </div>
//         </div>

//         {/* MONTHLY FINANCIAL BREAKDOWN */}
//         <div className="financial-metrics">
//           <h3>Monthly Financial Breakdown (Last 6 Months)</h3>
//           <div className="financial-metrics-grid">
//             <div className="financial-metric-card revenue">
//               <div className="financial-metric-value">{formatCurrency(monthlyFinancials.totalRevenue)}</div>
//               <div className="financial-metric-label">Gross Revenue</div>
//               <div className="financial-metric-period">6 Months</div>
//             </div>
            
//             <div className="financial-metric-card discounts">
//               <div className="financial-metric-value">{formatCurrency(monthlyFinancials.totalDiscounts)}</div>
//               <div className="financial-metric-label">Total Discounts</div>
//               <div className="financial-metric-rate">{formatPercent(monthlyFinancials.discountRate)} of revenue</div>
//             </div>
            
//             <div className="financial-metric-card shipping">
//               <div className="financial-metric-value">{formatCurrency(monthlyFinancials.totalShipping)}</div>
//               <div className="financial-metric-label">Shipping Charges</div>
//               <div className="financial-metric-rate">{formatPercent(monthlyFinancials.shippingRate)} of revenue</div>
//             </div>
            
//             <div className="financial-metric-card taxes">
//               <div className="financial-metric-value">{formatCurrency(monthlyFinancials.totalTaxes)}</div>
//               <div className="financial-metric-label">Taxes Collected</div>
//               <div className="financial-metric-rate">{formatPercent(monthlyFinancials.taxRate)} of revenue</div>
//             </div>
            
//             <div className="financial-metric-card returns">
//               <div className="financial-metric-value">{formatCurrency(monthlyFinancials.totalReturns)}</div>
//               <div className="financial-metric-label">Returns & Refunds</div>
//               <div className="financial-metric-rate">{formatPercent(monthlyFinancials.returnRate)} of revenue</div>
//             </div>
            
//             <div className="financial-metric-card net-revenue">
//               <div className="financial-metric-value">{formatCurrency(monthlyFinancials.netRevenue)}</div>
//               <div className="financial-metric-label">Net Revenue</div>
//               <div className="financial-metric-period">After returns</div>
//             </div>
//           </div>

//           {/* Monthly Financial Breakdown */}
//           <div className="monthly-financial-breakdown">
//             <h4>Monthly Financial Details</h4>
//             <div className="monthly-financial-cards">
//               {data.monthlySales.map((monthData, index) => {
//                 const monthNumber = parseInt(monthData.month.split('-')[1]);
//                 const year = monthData.month.split('-')[0];
//                 const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
//                 const monthName = monthNames[monthNumber - 1];
//                 const monthNetRevenue = monthData.revenue - monthData.returns;
//                 const discountRate = monthData.revenue > 0 ? (monthData.discounts / monthData.revenue) * 100 : 0;
//                 const shippingRate = monthData.revenue > 0 ? (monthData.shipping / monthData.revenue) * 100 : 0;
//                 const taxRate = monthData.revenue > 0 ? (monthData.taxes / monthData.revenue) * 100 : 0;
//                 const returnRate = monthData.revenue > 0 ? (monthData.returns / monthData.revenue) * 100 : 0;
                
//                 // Determine performance badge
//                 const avgRevenue = data.monthlySales.reduce((sum, month) => sum + month.revenue, 0) / data.monthlySales.length;
//                 const performanceLevel = monthData.revenue > avgRevenue * 1.2 ? 'high' : 
//                                        monthData.revenue > avgRevenue * 0.8 ? 'medium' : 'low';
                
//                 return (
//                   <div key={monthData.month} className="monthly-financial-card">
//                     <div className={`performance-badge ${performanceLevel}`}></div>
//                     <div className="monthly-financial-header">
//                       <div className="monthly-financial-label">{monthName}</div>
//                       <div className="monthly-financial-period">{year}</div>
//                     </div>
                    
//                     <div className="monthly-financial-metrics">
//                       <div className="monthly-financial-metric gross-revenue">
//                         <span className="monthly-financial-label">Gross Revenue</span>
//                         <span className="monthly-financial-value">{formatCurrency(monthData.revenue)}</span>
//                       </div>
                      
//                       <div className="monthly-financial-metric discounts">
//                         <span className="monthly-financial-label">Discounts</span>
//                         <span className="monthly-financial-value">{formatCurrency(monthData.discounts)}</span>
//                        <span className="monthly-financial-rate">{formatPercent(discountRate)}</span>
//                       </div>
                      
//                       <div className="monthly-financial-metric shipping">
//                         <span className="monthly-financial-label">Shipping</span>
//                         <span className="monthly-financial-value">{formatCurrency(monthData.shipping)}</span>
//                         <span className="monthly-financial-rate">{formatPercent(shippingRate)}</span>
//                       </div>
                      
//                       <div className="monthly-financial-metric taxes">
//                         <span className="monthly-financial-label">Taxes</span>
//                         <span className="monthly-financial-value">{formatCurrency(monthData.taxes)}</span>
//                         <span className="monthly-financial-rate">{formatPercent(taxRate)}</span>
//                       </div>
                      
//                       <div className="monthly-financial-metric returns">
//                         <span className="monthly-financial-label">Returns</span>
//                         <span className="monthly-financial-value">{formatCurrency(monthData.returns)}</span>
//                         <span className="monthly-financial-rate">{formatPercent(returnRate)}</span>
//                       </div>
                      
//                       <div className="monthly-financial-metric net-revenue">
//                         <span className="monthly-financial-label">Net Revenue</span>
//                         <span className="monthly-financial-value">{formatCurrency(monthNetRevenue)}</span>
//                       </div>
//                     </div>
//                   </div>
//                 );
//               })}
//             </div>
//           </div>
//         </div>

//         {/* WEEKLY PERFORMANCE SUMMARY */}
//         <div className="weekly-performance">
//           <h3>Weekly Performance (Last 8 Weeks)</h3>
          
//           {/* Weekly Totals */}
//           <div className="weekly-grid">
//             <div className="weekly-card">
//               <div className="weekly-value">
//                 {formatNumber(data.weeklySales.reduce((sum, week) => sum + week.orders, 0))}
//               </div>
//               <div className="weekly-label">Total Orders</div>
//             </div>
            
//             <div className="weekly-card">
//               <div className="weekly-value">
//                 {formatCurrency(data.weeklySales.reduce((sum, week) => sum + week.revenue, 0))}
//               </div>
//               <div className="weekly-label">Total Revenue</div>
//             </div>
            
//             <div className="weekly-card">
//               <div className="weekly-value">
//                 {formatNumber(data.weeklySales.reduce((sum, week) => sum + week.items, 0))}
//               </div>
//               <div className="weekly-label">Total Items</div>
//             </div>
            
//             <div className="weekly-card">
//               <div className="weekly-value">
//                 {formatCurrency(data.weeklySales.length > 0 ? data.weeklySales.reduce((sum, week) => sum + week.revenue, 0) / data.weeklySales.length : 0)}
//               </div>
//               <div className="weekly-label">Avg Weekly Revenue</div>
//             </div>
//           </div>

//           {/* Weekly Breakdown */}
//           <div className="weekly-breakdown">
//             <h4>Weekly Breakdown</h4>
//             <div className="weekly-cards-container">
//               {data.weeklySales.map((week, index) => (
//                 <div key={week.week} className="week-card">
//                   <div className="week-header">
//                     <div className="week-label">Week {week.week.split('-W')[1]}</div>
//                     <div className="week-period">{week.week.split('-')[0]}</div>
//                   </div>
                  
//                   <div className="week-metrics">
//                     <div className="week-metric orders">
//                       <span className="week-metric-label">Orders</span>
//                       <span className="week-metric-value">{formatNumber(week.orders)}</span>
//                     </div>
                    
//                     <div className="week-metric revenue">
//                       <span className="week-metric-label">Revenue</span>
//                       <span className="week-metric-value">{formatCurrency(week.revenue)}</span>
//                     </div>
                    
//                     <div className="week-metric items">
//                       <span className="week-metric-label">Items</span>
//                       <span className="week-metric-value">{formatNumber(week.items)}</span>
//                     </div>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </div>
//         </div>

//         {/* MONTHLY PERFORMANCE SUMMARY */}
//         <div className="monthly-performance">
//           <h3>Monthly Performance (Last 6 Months)</h3>
          
//           {/* Monthly Totals */}
//           <div className="monthly-grid">
//             <div className="monthly-card">
//               <div className="monthly-value">
//                 {formatNumber(data.monthlySales.reduce((sum, month) => sum + month.orders, 0))}
//               </div>
//               <div className="monthly-label">Total Orders</div>
//             </div>
            
//             <div className="monthly-card">
//               <div className="monthly-value">
//                 {formatCurrency(data.monthlySales.reduce((sum, month) => sum + month.revenue, 0))}
//               </div>
//               <div className="monthly-label">Total Revenue</div>
//             </div>
            
//             <div className="monthly-card">
//               <div className="monthly-value">
//                 {formatNumber(data.monthlySales.reduce((sum, month) => sum + month.items, 0))}
//               </div>
//               <div className="monthly-label">Total Items</div>
//             </div>
            
//             <div className="monthly-card">
//               <div className="monthly-value">
//                 {formatCurrency(data.monthlySales.length > 0 ? data.monthlySales.reduce((sum, month) => sum + month.revenue, 0) / data.monthlySales.length : 0)}
//               </div>
//               <div className="monthly-label">Avg Monthly Revenue</div>
//             </div>
//           </div>

//           {/* Monthly Breakdown */}
//           <div className="monthly-breakdown">
//             <h4>Monthly Breakdown</h4>
//             <div className="monthly-cards-container">
//               {data.monthlySales.map((monthData, index) => {
//                 const monthNumber = parseInt(monthData.month.split('-')[1]);
//                 const year = monthData.month.split('-')[0];
//                 const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
//                 const monthName = monthNames[monthNumber - 1];
                
//                 // Determine performance badge
//                 const avgRevenue = data.monthlySales.reduce((sum, month) => sum + month.revenue, 0) / data.monthlySales.length;
//                 const performanceLevel = monthData.revenue > avgRevenue * 1.2 ? 'high' : 
//                                        monthData.revenue > avgRevenue * 0.8 ? 'medium' : 'low';
                
//                 return (
//                   <div key={monthData.month} className="month-card">
//                     <div className={`performance-badge ${performanceLevel}`}></div>
//                     <div className="month-header">
//                       <div className="month-label">{monthName}</div>
//                       <div className="month-period">{year}</div>
//                     </div>
                    
//                     <div className="month-metrics">
//                       <div className="month-metric orders">
//                         <span className="month-metric-label">Orders</span>
//                         <span className="month-metric-value">{formatNumber(monthData.orders)}</span>
//                       </div>
                      
//                       <div className="month-metric revenue">
//                         <span className="month-metric-label">Revenue</span>
//                         <span className="month-metric-value">{formatCurrency(monthData.revenue)}</span>
//                       </div>
                      
//                       <div className="month-metric items">
//                         <span className="month-metric-label">Items</span>
//                         <span className="month-metric-value">{formatNumber(monthData.items)}</span>
//                       </div>
//                     </div>
//                   </div>
//                 );
//               })}
//             </div>
//           </div>
//         </div>

//         {/* CHARTS & ANALYTICS SECTION */}
//         <div className="charts-section">
//           <h2>6-Month Analytics & Insights</h2>
          
//           <div className="charts-grid">
//             {/* 6-Month Customer Distribution Pie Chart */}
//             <div className="chart-container">
//               <div className="chart-header">
//                 <div className="chart-title">6-Month Customer Distribution</div>
//                 <div className="chart-legend">
//                   <div className="legend-item">
//                     <div className="legend-color new"></div>
//                     <span>New</span>
//                   </div>
//                   <div className="legend-item">
//                     <div className="legend-color repeat"></div>
//                     <span>Repeat</span>
//                   </div>
//                 </div>
//               </div>
//               {CustomerDistributionChart}
//               <div className="mini-stats">
//                 <div className="mini-stat-card">
//                   <div className="mini-stat-value">{formatPercent(
//                     sixMonthCustomerMetrics.repeat / (sixMonthCustomerMetrics.new + sixMonthCustomerMetrics.repeat || 1) * 100
//                   )}</div>
//                   <div className="mini-stat-label">6-Month Repeat Rate</div>
//                 </div>
//                 <div className="mini-stat-card">
//                   <div className="mini-stat-value">{formatNumber(
//                     sixMonthCustomerMetrics.new + sixMonthCustomerMetrics.repeat
//                   )}</div>
//                   <div className="mini-stat-label">6-Month Customers</div>
//                 </div>
//               </div>
//             </div>

//             {/* 6-Month Order Fulfillment Doughnut Chart */}
//             <div className="chart-container">
//               <div className="chart-header">
//                 <div className="chart-title">6-Month Order Fulfillment</div>
//                 <div className="chart-legend">
//                   <div className="legend-item">
//                     <div className="legend-color fulfilled"></div>
//                     <span>Fulfilled</span>
//                   </div>
//                   <div className="legend-item">
//                     <div className="legend-color unfulfilled"></div>
//                     <span>Unfulfilled</span>
//                   </div>
//                 </div>
//               </div>
//               {OrderFulfillmentChart}
//               <div className="mini-stats">
//                 <div className="mini-stat-card">
//                   <div className="mini-stat-value">{formatPercent(
//                     (sixMonthFulfillmentMetrics.fulfilled / (sixMonthFulfillmentMetrics.fulfilled + sixMonthFulfillmentMetrics.unfulfilled || 1)) * 100
//                   )}</div>
//                   <div className="mini-stat-label">6-Month Fulfillment Rate</div>
//                 </div>
//                 <div className="mini-stat-card">
//                   <div className="mini-stat-value">{formatNumber(
//                     sixMonthFulfillmentMetrics.fulfilled + sixMonthFulfillmentMetrics.unfulfilled
//                   )}</div>
//                   <div className="mini-stat-label">6-Month Orders</div>
//                 </div>
//               </div>
//             </div>

//             {/* Weekly Revenue Trend Line Chart */}
//             <div className="chart-container">
//               <div className="chart-header">
//                 <div className="chart-title">Weekly Revenue</div>
//                 <div className="chart-legend">
//                   <div className="legend-item">
//                     <div className="legend-color revenue"></div>
//                     <span>Revenue</span>
//                   </div>
//                 </div>
//               </div>
//               {RevenueTrendChart}
//             </div>

//             {/* 6-Month Performance Bar Chart */}
//             <div className="chart-container">
//               <div className="chart-header">
//                 <div className="chart-title">6-Month Performance</div>
//                 <div className="chart-legend">
//                   <div className="legend-item">
//                     <div className="legend-color revenue"></div>
//                     <span>Revenue</span>
//                   </div>
//                   <div className="legend-item">
//                     <div className="legend-color orders"></div>
//                     <span>Orders</span>
//                   </div>
//                 </div>
//               </div>
//               {MonthlyPerformanceChart}
//             </div>

//             {/* 6-Month Financial Breakdown Pie Chart */}
//             <div className="chart-container">
//               <div className="chart-header">
//                 <div className="chart-title">6-Month Financial Breakdown</div>
//                 <div className="chart-legend">
//                   <div className="legend-item">
//                     <div className="legend-color revenue"></div>
//                     <span>Revenue</span>
//                   </div>
//                   <div className="legend-item">
//                     <div className="legend-color discounts"></div>
//                     <span>Discounts</span>
//                   </div>
//                   <div className="legend-item">
//                     <div className="legend-color shipping"></div>
//                     <span>Shipping</span>
//                   </div>
//                   <div className="legend-item">
//                     <div className="legend-color taxes"></div>
//                     <span>Taxes</span>
//                   </div>
//                   <div className="legend-item">
//                     <div className="legend-color returns"></div>
//                     <span>Returns</span>
//                   </div>
//                 </div>
//               </div>
//               {FinancialBreakdownChart}
//               <div className="mini-stats">
//                 <div className="mini-stat-card">
//                   <div className="mini-stat-value">{formatCurrency(
//                     data.monthlySales.reduce((sum, month) => sum + month.revenue, 0) - 
//                     data.monthlySales.reduce((sum, month) => sum + month.returns, 0)
//                   )}</div>
//                   <div className="mini-stat-label">6-Month Net Revenue</div>
//                 </div>
//                 <div className="mini-stat-card">
//                   <div className="mini-stat-value">{formatPercent(
//                     (data.monthlySales.reduce((sum, month) => sum + month.returns, 0) / 
//                     data.monthlySales.reduce((sum, month) => sum + month.revenue, 0) * 100) || 0
//                   )}</div>
//                   <div className="mini-stat-label">6-Month Return Rate</div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
         
//         <div className="app-footer">
//           <div className="footer-content">
//             <p>
//               <strong>Orders Analyzed:</strong> {data.ordersLoaded} orders • 
//               <strong> Net Revenue:</strong> {formatCurrency(data.netRevenue)} • 
//               <strong> Data Updated:</strong> {new Date().toLocaleDateString()}
//             </p>
//             <p className="footer-brand">Orders Dashboard - Powering Your Business Insights</p>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }


// ==================== 1. IMPORTS ====================
import { LoaderFunctionArgs, json } from "@remix-run/node";
import { useLoaderData, useNavigation } from "@remix-run/react";
import { authenticate } from "../shopify.server";
import "../styles/orders.css";
import { useState, useMemo } from 'react';

// Chart.js imports
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar, Line, Pie, Doughnut } from 'react-chartjs-2';

// ==================== 2. CHART.JS REGISTRATION ====================
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

// ==================== 3. TYPES ====================
interface OrderData {
  totalOrders: number;
  fulfilledOrders: number;
  unfulfilledOrders: number;
  totalRevenue: number;
  totalDiscounts: number;
  totalShipping: number;
  totalTaxes: number;
  totalReturns: number;
  returnFees: number;
  netRevenue: number;
  discountRate: number;
  shippingRate: number;
  taxRate: number;
  returnRate: number;
  totalItems: number;
  averageOrderValue: number;
  averageItemsPerOrder: number;
  dailySales: Array<{ date: string; revenue: number; orders: number; items: number; discounts: number; shipping: number; taxes: number; returns: number }>;
  weeklySales: Array<{ week: string; revenue: number; orders: number; items: number; discounts: number; shipping: number; taxes: number; returns: number }>;
  monthlySales: Array<{ month: string; revenue: number; orders: number; items: number; discounts: number; shipping: number; taxes: number; returns: number }>;
  todayRevenue: number;
  todayOrders: number;
  todayItems: number;
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
  fulfillmentRate: number;
  revenueChangeVsYesterday: number;
  ordersChangeVsYesterday: number;
  itemsChangeVsYesterday: number;
  revenueChangeVsLastWeek: number;
  bestDay: { date: string; revenue: number; orders: number; items: number };
  averageDailyRevenue: number;
  totalCustomers: number;
  repeatCustomers: number;
  newCustomers: number;
  repeatCustomerRate: number;
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
  shopTimezone: string;
  shopCurrency: string;
  moneyFormat: string;
  currentDateInShopTZ: string;
  processingTime?: number;
}

// ==================== 4. HELPER FUNCTIONS ====================
function getEmptyData(): Omit<OrderData, 'shopTimezone' | 'currentDateInShopTZ' | 'shopCurrency' | 'moneyFormat'> {
  return {
    totalOrders: 0,
    fulfilledOrders: 0,
    unfulfilledOrders: 0,
    totalRevenue: 0,
    totalDiscounts: 0,
    totalShipping: 0,
    totalTaxes: 0,
    totalReturns: 0,
    returnFees: 0,
    netRevenue: 0,
    discountRate: 0,
    shippingRate: 0,
    taxRate: 0,
    returnRate: 0,
    totalItems: 0,
    averageOrderValue: 0,
    averageItemsPerOrder: 0,
    dailySales: [],
    weeklySales: [],
    monthlySales: [],
    todayRevenue: 0,
    todayOrders: 0,
    todayItems: 0,
    yesterdayRevenue: 0,
    yesterdayOrders: 0,
    yesterdayItems: 0,
    lastWeekRevenue: 0,
    lastWeekOrders: 0,
    lastWeekItems: 0,
    todayFulfilled: 0,
    todayUnfulfilled: 0,
    last7DaysFulfilled: 0,
    last7DaysUnfulfilled: 0,
    fulfillmentRate: 0,
    revenueChangeVsYesterday: 0,
    ordersChangeVsYesterday: 0,
    itemsChangeVsYesterday: 0,
    revenueChangeVsLastWeek: 0,
    bestDay: { date: '', revenue: 0, orders: 0, items: 0 },
    averageDailyRevenue: 0,
    totalCustomers: 0,
    repeatCustomers: 0,
    newCustomers: 0,
    repeatCustomerRate: 0,
    last7DaysTotalCustomers: 0,
    last7DaysRepeatCustomers: 0,
    last7DaysNewCustomers: 0,
    last7DaysRepeatCustomerRate: 0,
    customerTypeData: { new: 0, repeat: 0 },
    fulfillmentStatusData: { fulfilled: 0, unfulfilled: 0 },
    weeklyRevenueTrend: [],
    monthlyComparison: [],
    dailyPerformance: [],
    ordersLoaded: 0
  };
}

// ==================== 5. TIMEZONE UTILITIES ====================
class TimezoneHelper {
  static getLocalDateKey(utcDate: Date, timezone: string): string {
    try {
      return utcDate.toLocaleDateString('en-CA', { 
        timeZone: timezone,
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
      });
    } catch (error) {
      return utcDate.toISOString().split('T')[0];
    }
  }

  static getCurrentDateInTimezone(timezone: string): string {
    return this.getLocalDateKey(new Date(), timezone);
  }

  static getDateRangeInTimezone(timezone: string, days: number): string[] {
    const dates: string[] = [];
    const now = new Date();
    
    for (let i = 0; i < days; i++) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);
      dates.push(this.getLocalDateKey(date, timezone));
    }
    
    return dates.reverse();
  }

  static getPreviousDate(currentDate: string, timezone: string): string {
    try {
      const current = new Date(currentDate + 'T00:00:00');
      const previous = new Date(current);
      previous.setDate(previous.getDate() - 1);
      return this.getLocalDateKey(previous, timezone);
    } catch (error) {
      const current = new Date(currentDate + 'T00:00:00Z');
      const previous = new Date(current);
      previous.setUTCDate(previous.getUTCDate() - 1);
      return previous.toISOString().split('T')[0];
    }
  }

  static getWeekStartDate(date: Date, timezone: string): Date {
    const localDateKey = this.getLocalDateKey(date, timezone);
    const localDate = new Date(localDateKey + 'T00:00:00');
    const dayOfWeek = localDate.getDay();
    const weekStart = new Date(localDate);
    weekStart.setDate(localDate.getDate() - dayOfWeek);
    return weekStart;
  }

  static getMonthKey(date: Date, timezone: string): string {
    const localDateKey = this.getLocalDateKey(date, timezone);
    const localDate = new Date(localDateKey + 'T00:00:00');
    return `${localDate.getFullYear()}-${(localDate.getMonth() + 1).toString().padStart(2, "0")}`;
  }
}

// ==================== 6. DATA PROCESSING ====================
function processOrdersData(orders: any[], shopTimezone: string = 'UTC'): Omit<OrderData, 'shopTimezone' | 'currentDateInShopTZ' | 'shopCurrency' | 'moneyFormat'> {
  const totalOrders = orders.length;
  const fulfilledOrders = orders.filter((o: any) => o.node.displayFulfillmentStatus === "FULFILLED").length;
  const unfulfilledOrders = totalOrders - fulfilledOrders;

  const totalRevenue = orders.reduce((sum: number, o: any) => {
    const amount = parseFloat(o.node.currentTotalPriceSet?.shopMoney?.amount || '0');
    return sum + (isNaN(amount) ? 0 : amount);
  }, 0);

  const totalItems = orders.reduce((sum: number, o: any) => {
    const lineItems = o.node.lineItems?.edges || [];
    const itemsInOrder = lineItems.reduce((itemSum: number, item: any) => {
      return itemSum + (item.node.quantity || 0);
    }, 0);
    return sum + itemsInOrder;
  }, 0);

  const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;
  const averageItemsPerOrder = totalOrders > 0 ? totalItems / totalOrders : 0;

  const totalDiscounts = orders.reduce((sum: number, o: any) => {
    const amount = parseFloat(o.node.totalDiscountsSet?.shopMoney?.amount || '0');
    return sum + (isNaN(amount) ? 0 : amount);
  }, 0);

  const totalShipping = orders.reduce((sum: number, o: any) => {
    const amount = parseFloat(o.node.totalShippingPriceSet?.shopMoney?.amount || '0');
    return sum + (isNaN(amount) ? 0 : amount);
  }, 0);

  const totalTaxes = orders.reduce((sum: number, o: any) => {
    const amount = parseFloat(o.node.totalTaxSet?.shopMoney?.amount || '0');
    return sum + (isNaN(amount) ? 0 : amount);
  }, 0);

  const totalReturns = orders.reduce((sum: number, o: any) => {
    const refunds = o.node.refunds || [];
    const refundAmount = refunds.reduce((refundSum: number, refund: any) => {
      const amount = parseFloat(refund.totalRefundedSet?.shopMoney?.amount || '0');
      return refundSum + (isNaN(amount) ? 0 : amount);
    }, 0);
    return sum + refundAmount;
  }, 0);

  const netRevenue = totalRevenue - totalReturns;
  const discountRate = totalRevenue > 0 ? (totalDiscounts / totalRevenue) * 100 : 0;
  const shippingRate = totalRevenue > 0 ? (totalShipping / totalRevenue) * 100 : 0;
  const taxRate = totalRevenue > 0 ? (totalTaxes / totalRevenue) * 100 : 0;
  const returnRate = totalRevenue > 0 ? (totalReturns / totalRevenue) * 100 : 0;

  const salesByDay: Record<string, { revenue: number; orders: number; items: number; discounts: number; shipping: number; taxes: number; returns: number }> = {};
  const salesByWeek: Record<string, { revenue: number; orders: number; items: number; discounts: number; shipping: number; taxes: number; returns: number }> = {};
  const salesByMonth: Record<string, { revenue: number; orders: number; items: number; discounts: number; shipping: number; taxes: number; returns: number }> = {};

  const currentDateInShopTZ = TimezoneHelper.getCurrentDateInTimezone(shopTimezone);
  const yesterdayInShopTZ = TimezoneHelper.getPreviousDate(currentDateInShopTZ, shopTimezone);
  const lastWeekSameDayInShopTZ = TimezoneHelper.getPreviousDate(currentDateInShopTZ, shopTimezone);
  
  const last7DaysKeys = TimezoneHelper.getDateRangeInTimezone(shopTimezone, 7);

  let todayRevenue = 0;
  let todayOrders = 0;
  let todayItems = 0;
  let yesterdayRevenue = 0;
  let yesterdayOrders = 0;
  let yesterdayItems = 0;
  let lastWeekRevenue = 0;
  let lastWeekOrders = 0;
  let lastWeekItems = 0;

  let todayFulfilled = 0;
  let todayUnfulfilled = 0;
  let last7DaysFulfilled = 0;
  let last7DaysUnfulfilled = 0;

  const customerOrderCount: Record<string, number> = {};
  const last7DaysCustomers: Record<string, number> = {};

  orders.forEach((o: any) => {
    const createdAtUTC = new Date(o.node.createdAt);
    const revenue = parseFloat(o.node.currentTotalPriceSet?.shopMoney?.amount || '0');
    const discounts = parseFloat(o.node.totalDiscountsSet?.shopMoney?.amount || '0');
    const shipping = parseFloat(o.node.totalShippingPriceSet?.shopMoney?.amount || '0');
    const taxes = parseFloat(o.node.totalTaxSet?.shopMoney?.amount || '0');
    
    const lineItems = o.node.lineItems?.edges || [];
    const itemsInOrder = lineItems.reduce((sum: number, item: any) => {
      return sum + (item.node.quantity || 0);
    }, 0);
    
    const refunds = o.node.refunds || [];
    const returns = refunds.reduce((refundSum: number, refund: any) => {
      const amount = parseFloat(refund.totalRefundedSet?.shopMoney?.amount || '0');
      return refundSum + (isNaN(amount) ? 0 : amount);
    }, 0);
    
    const dateKey = TimezoneHelper.getLocalDateKey(createdAtUTC, shopTimezone);
    
    const isToday = dateKey === currentDateInShopTZ;
    const isYesterday = dateKey === yesterdayInShopTZ;
    const isLastWeekSameDay = dateKey === lastWeekSameDayInShopTZ;
    const isLast7Days = last7DaysKeys.includes(dateKey);

    if (isToday) {
      todayRevenue += revenue;
      todayOrders += 1;
      todayItems += itemsInOrder;
      
      if (o.node.displayFulfillmentStatus === "FULFILLED") {
        todayFulfilled += 1;
      } else {
        todayUnfulfilled += 1;
      }
    }
    
    if (isYesterday) {
      yesterdayRevenue += revenue;
      yesterdayOrders += 1;
      yesterdayItems += itemsInOrder;
    }
    
    if (isLastWeekSameDay) {
      lastWeekRevenue += revenue;
      lastWeekOrders += 1;
      lastWeekItems += itemsInOrder;
    }

    if (isLast7Days) {
      if (o.node.displayFulfillmentStatus === "FULFILLED") {
        last7DaysFulfilled += 1;
      } else {
        last7DaysUnfulfilled += 1;
      }
    }

    if (!salesByDay[dateKey]) {
      salesByDay[dateKey] = { revenue: 0, orders: 0, items: 0, discounts: 0, shipping: 0, taxes: 0, returns: 0 };
    }
    salesByDay[dateKey].revenue += revenue;
    salesByDay[dateKey].orders += 1;
    salesByDay[dateKey].items += itemsInOrder;
    salesByDay[dateKey].discounts += discounts;
    salesByDay[dateKey].shipping += shipping;
    salesByDay[dateKey].taxes += taxes;
    salesByDay[dateKey].returns += returns;

    const weekStart = TimezoneHelper.getWeekStartDate(createdAtUTC, shopTimezone);
    const weekKey = `${weekStart.getFullYear()}-W${Math.ceil((weekStart.getDate() + 6) / 7)}`;
    
    if (!salesByWeek[weekKey]) {
      salesByWeek[weekKey] = { revenue: 0, orders: 0, items: 0, discounts: 0, shipping: 0, taxes: 0, returns: 0 };
    }
    salesByWeek[weekKey].revenue += revenue;
    salesByWeek[weekKey].orders += 1;
    salesByWeek[weekKey].items += itemsInOrder;
    salesByWeek[weekKey].discounts += discounts;
    salesByWeek[weekKey].shipping += shipping;
    salesByWeek[weekKey].taxes += taxes;
    salesByWeek[weekKey].returns += returns;

    const monthKey = TimezoneHelper.getMonthKey(createdAtUTC, shopTimezone);
    if (!salesByMonth[monthKey]) {
      salesByMonth[monthKey] = { revenue: 0, orders: 0, items: 0, discounts: 0, shipping: 0, taxes: 0, returns: 0 };
    }
    salesByMonth[monthKey].revenue += revenue;
    salesByMonth[monthKey].orders += 1;
    salesByMonth[monthKey].items += itemsInOrder;
    salesByMonth[monthKey].discounts += discounts;
    salesByMonth[monthKey].shipping += shipping;
    salesByMonth[monthKey].taxes += taxes;
    salesByMonth[monthKey].returns += returns;

    const customerId = o.node.customer?.id;
    if (customerId) {
      customerOrderCount[customerId] = (customerOrderCount[customerId] || 0) + 1;
    }
    
    if (isLast7Days && customerId) {
      last7DaysCustomers[customerId] = (last7DaysCustomers[customerId] || 0) + 1;
    }
  });

  const totalCustomers = Object.keys(customerOrderCount).length;
  const repeatCustomers = Object.values(customerOrderCount).filter(count => count > 1).length;
  const repeatCustomerRate = totalCustomers > 0 ? (repeatCustomers / totalCustomers) * 100 : 0;
  const newCustomers = totalCustomers - repeatCustomers;

  const last7DaysTotalCustomers = Object.keys(last7DaysCustomers).length;
  const last7DaysRepeatCustomers = Object.values(last7DaysCustomers).filter(count => count > 1).length;
  const last7DaysRepeatCustomerRate = last7DaysTotalCustomers > 0 ? (last7DaysRepeatCustomers / last7DaysTotalCustomers) * 100 : 0;
  const last7DaysNewCustomers = last7DaysTotalCustomers - last7DaysRepeatCustomers;

  const dailySales = last7DaysKeys.map(date => {
    const dayData = salesByDay[date] || { revenue: 0, orders: 0, items: 0, discounts: 0, shipping: 0, taxes: 0, returns: 0 };
    return {
      date,
      revenue: dayData.revenue,
      orders: dayData.orders,
      items: dayData.items,
      discounts: dayData.discounts,
      shipping: dayData.shipping,
      taxes: dayData.taxes,
      returns: dayData.returns
    };
  });

  const weeklyEntries = Object.entries(salesByWeek)
    .sort((a, b) => a[0].localeCompare(b[0]))
    .slice(-8);

  const weeklySales = weeklyEntries.map(([week, data]) => ({
    week,
    revenue: data.revenue,
    orders: data.orders,
    items: data.items,
    discounts: data.discounts,
    shipping: data.shipping,
    taxes: data.taxes,
    returns: data.returns
  }));

  const monthlyEntries = Object.entries(salesByMonth)
    .sort((a, b) => a[0].localeCompare(b[0]))
    .slice(-6);

  const monthlySales = monthlyEntries.map(([month, data]) => ({
    month,
    revenue: data.revenue,
    orders: data.orders,
    items: data.items,
    discounts: data.discounts,
    shipping: data.shipping,
    taxes: data.taxes,
    returns: data.returns
  }));

  const fulfillmentRate = totalOrders > 0 ? (fulfilledOrders / totalOrders) * 100 : 0;
  
  const revenueChangeVsYesterday = yesterdayRevenue > 0 
    ? ((todayRevenue - yesterdayRevenue) / yesterdayRevenue) * 100 
    : todayRevenue > 0 ? 100 : 0;
  
  const ordersChangeVsYesterday = yesterdayOrders > 0 
    ? ((todayOrders - yesterdayOrders) / yesterdayOrders) * 100 
    : todayOrders > 0 ? 100 : 0;

  const itemsChangeVsYesterday = yesterdayItems > 0 
    ? ((todayItems - yesterdayItems) / yesterdayItems) * 100 
    : todayItems > 0 ? 100 : 0;
  
  const revenueChangeVsLastWeek = lastWeekRevenue > 0 
    ? ((todayRevenue - lastWeekRevenue) / lastWeekRevenue) * 100 
    : todayRevenue > 0 ? 100 : 0;

  const bestDay = dailySales.reduce((best, current) => 
    current.revenue > best.revenue ? current : best, { date: '', revenue: 0, orders: 0, items: 0, discounts: 0, shipping: 0, taxes: 0, returns: 0 }
  );

  const averageDailyRevenue = dailySales.length > 0 
    ? dailySales.reduce((sum, day) => sum + day.revenue, 0) / dailySales.length 
    : 0;

  const customerTypeData = {
    new: newCustomers,
    repeat: repeatCustomers
  };

  const fulfillmentStatusData = {
    fulfilled: fulfilledOrders,
    unfulfilled: unfulfilledOrders
  };

  const weeklyRevenueTrend = weeklySales.map(week => ({
    week: `Week ${week.week.split('-W')[1]}`,
    revenue: week.revenue
  }));

  const monthlyComparison = monthlySales.map(month => {
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const monthNumber = parseInt(month.month.split('-')[1]);
    return {
      month: monthNames[monthNumber - 1],
      revenue: month.revenue,
      orders: month.orders
    };
  });

  const dailyPerformance = dailySales.map(day => {
    const date = new Date(day.date);
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    return {
      day: dayNames[date.getDay()],
      revenue: day.revenue,
      orders: day.orders
    };
  });

  return {
    totalOrders,
    fulfilledOrders,
    unfulfilledOrders,
    totalRevenue,
    totalDiscounts,
    totalShipping,
    totalTaxes,
    totalReturns,
    returnFees: totalReturns,
    netRevenue,
    discountRate,
    shippingRate,
    taxRate,
    returnRate,
    totalItems,
    averageOrderValue,
    averageItemsPerOrder,
    dailySales,
    weeklySales,
    monthlySales,
    todayRevenue,
    todayOrders,
    todayItems,
    yesterdayRevenue,
    yesterdayOrders,
    yesterdayItems,
    lastWeekRevenue,
    lastWeekOrders,
    lastWeekItems,
    todayFulfilled,
    todayUnfulfilled,
    last7DaysFulfilled,
    last7DaysUnfulfilled,
    fulfillmentRate,
    revenueChangeVsYesterday,
    ordersChangeVsYesterday,
    itemsChangeVsYesterday,
    revenueChangeVsLastWeek,
    bestDay,
    averageDailyRevenue,
    totalCustomers,
    repeatCustomers,
    newCustomers,
    repeatCustomerRate,
    last7DaysTotalCustomers,
    last7DaysRepeatCustomers,
    last7DaysNewCustomers, 
    last7DaysRepeatCustomerRate,
    customerTypeData,
    fulfillmentStatusData,
    weeklyRevenueTrend,
    monthlyComparison,
    dailyPerformance,
    ordersLoaded: orders.length,
  };
}

// ==================== 7. REQUEST VALIDATION ====================
const validateRequest = (request: Request) => {
  const url = new URL(request.url);
  const allowedPaths = ['/app', '/products'];
  
  if (!allowedPaths.some(path => url.pathname.startsWith(path))) {
    throw new Error('Invalid request path');
  }
};

// ==================== 8. API SAFETY ====================
class APISafety {
  static readonly MAX_RETRIES = 3;
  static readonly TIMEOUT_MS = 10000;
  static readonly BATCH_SIZE = 50;
  static readonly MAX_API_CALLS = 10;

  static async safeGraphQLCall(admin: any, query: string, retryCount = 0): Promise<any> {
    try {
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('Request timeout')), this.TIMEOUT_MS);
      });

      const graphqlPromise = admin.graphql(query);
      
      const response = await Promise.race([graphqlPromise, timeoutPromise]) as any;
      const data = await response.json();

      if (data.errors && data.errors.length > 0) {
        throw new Error('GraphQL API error');
      }

      return data;
    } catch (error: any) {
      if (retryCount < this.MAX_RETRIES) {
        await new Promise(resolve => setTimeout(resolve, 1000 * Math.pow(2, retryCount)));
        return this.safeGraphQLCall(admin, query, retryCount + 1);
      }
      throw error;
    }
  }

  static validateOrderData(order: any): boolean {
    if (!order || !order.node) return false;
    
    try {
      const amount = parseFloat(order.node.currentTotalPriceSet?.shopMoney?.amount || '0');
      return !isNaN(amount) && amount >= 0;
    } catch {
      return false;
    }
  }
}

// ==================== 9. LOADER FUNCTION ====================
export const loader = async ({ request }: LoaderFunctionArgs) => {
  const startTime = Date.now();
  
  try {
    validateRequest(request);

    const { admin, session } = await authenticate.admin(request);

    const shopResponse = await APISafety.safeGraphQLCall(admin, `
      {
        shop {
          ianaTimezone
        }
      }
    `);
    
    const shopData = shopResponse;
    const shopTimezone = shopData.data?.shop?.ianaTimezone || 'UTC';

    const MAX_ORDERS = 250;
    let allOrders: any[] = [];
    let hasNextPage = true;
    let endCursor: string | null = null;
    let apiCallCount = 0;

    while (hasNextPage && allOrders.length < MAX_ORDERS && apiCallCount < APISafety.MAX_API_CALLS) {
      const ordersQuery = `
        {
          orders(
            first: ${APISafety.BATCH_SIZE}, 
            ${endCursor ? `after: "${endCursor}",` : ''}
            sortKey: CREATED_AT, 
            reverse: true
          ) {
            pageInfo {
              hasNextPage
              endCursor
            }
            edges {
              node {
                id
                createdAt
                displayFulfillmentStatus
                currentTotalPriceSet {
                  shopMoney {
                    amount
                  }
                }
                totalShippingPriceSet {
                  shopMoney {
                    amount
                  }
                }
                totalTaxSet {
                  shopMoney {
                    amount
                  }
                }
                totalDiscountsSet {
                  shopMoney {
                    amount
                  }
                }
                lineItems(first: 10) {
                  edges {
                    node {
                      quantity
                      originalTotalSet {
                        shopMoney {
                          amount
                        }
                      }
                      discountedTotalSet {
                        shopMoney {
                          amount
                        }
                      }
                    }
                  }
                }
                refunds {
                  totalRefundedSet {
                    shopMoney {
                      amount
                    }
                  }
                }
                customer {
                  id
                }
              }
            }
          }
        }
      `;

      const ordersData = await APISafety.safeGraphQLCall(admin, ordersQuery);
      apiCallCount++;
      
      const ordersPage = ordersData.data?.orders?.edges || [];
      
      const validOrders = ordersPage.filter(APISafety.validateOrderData);
      allOrders = [...allOrders, ...validOrders];
      
      hasNextPage = ordersData.data?.orders?.pageInfo?.hasNextPage || false;
      endCursor = ordersData.data?.orders?.pageInfo?.endCursor;
      
      if (!hasNextPage || allOrders.length >= MAX_ORDERS) break;

      await new Promise(resolve => setTimeout(resolve, 100));
    }

    const orders = allOrders;
    const processingTime = Date.now() - startTime;

    if (orders.length === 0) {
      return json({ 
        ...getEmptyData(), 
        shopTimezone,
        currentDateInShopTZ: TimezoneHelper.getCurrentDateInTimezone(shopTimezone),
        processingTime,
        ordersLoaded: 0
      });
    }

    const processedData = processOrdersData(orders, shopTimezone);
    return json({ 
      ...processedData, 
      shopTimezone,
      currentDateInShopTZ: TimezoneHelper.getCurrentDateInTimezone(shopTimezone),
      processingTime
    });
    
  } catch (error: any) {
    return json({ 
      ...getEmptyData(), 
      shopTimezone: 'UTC',
      currentDateInShopTZ: TimezoneHelper.getCurrentDateInTimezone('UTC'),
      processingTime: Date.now() - startTime,
      ordersLoaded: 0
    });
  }
};

// ==================== 10. ICON COMPONENTS ====================
const Icon = {
  Print: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
      <path d="M19 8H5c-1.66 0-3 1.34-3 3v6h4v4h12v-4h4v-6c0-1.66-1.34-3-3-3zm-3 11H8v-5h8v5zm3-7c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1zm-1-9H6v4h12V3z"/>
    </svg>
  ),
  TrendUp: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
      <path d="M16 6l2.29 2.29-4.88 4.88-4-4L2 16.59 3.41 18l6-6 4 4 6.3-6.29L22 12V6z"/>
    </svg>
  ),
  TrendDown: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
      <path d="M16 18l2.29-2.29-4.88-4.88-4 4L2 7.41 3.41 6l6 6 4-4 6.3 6.29L22 12v6z"/>
    </svg>
  )
};

// ==================== 11. LOADING COMPONENT ====================
function LoadingProgress() {
  const loadingSteps = [
    "Fetching recent orders...",
    "Analyzing revenue data...", 
    "Processing customer insights...",
    "Calculating fulfillment rates...",
    "Generating sales analytics..."
  ];

  return (
    <div className="loading-progress-container">
      <div className="loading-header">
        <h2>Loading Orders Dashboard</h2>
        <p>Analyzing your order data and generating insights...</p>
      </div>
      
      <div className="progress-bar-container">
        <div className="progress-bar">
          <div className="progress-fill"></div>
        </div>
      </div>

      <div className="loading-steps">
        {loadingSteps.map((step, index) => (
          <div key={index} className="loading-step">
            <div className="step-indicator"></div>
            <div className="step-text">{step}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ==================== 12. MAIN COMPONENT ====================
export default function Orders() {
    const data = useLoaderData<typeof loader>() as OrderData;
  const navigation = useNavigation();
  const [isExporting, setIsExporting] = useState(false);

  const isLoading = navigation.state === 'loading';

  // const formatCurrency = (amount: number) => `$${amount.toFixed(2)}`;
  // const formatNumber = (num: number) => num.toFixed(0);
  // const formatPercent = (num: number) => `${num.toFixed(1)}%`;

   // Clean multi-currency formatting with proper typing
  const formatCurrency = (amount: number) => {
    try {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: data.shopCurrency || 'USD',
        minimumFractionDigits: 2
      }).format(amount);
    } catch (error) {
      // Fallback using Shopify's money format
      return data.moneyFormat.replace('{{amount}}', amount.toFixed(2));
    }
  };

  const formatNumber = (num: number) => num.toLocaleString('en-US');
  const formatPercent = (num: number) => `${num.toFixed(1)}%`;

  // ==================== 6-MONTH CALCULATIONS ====================
  const sixMonthCustomerMetrics = useMemo(() => {
    if (data.monthlySales.length === 0) return { new: 0, repeat: 0 };
    
    const total6MonthOrders = data.monthlySales.reduce((sum, month) => sum + month.orders, 0);
    const avgOrdersPerCustomer = data.totalOrders / data.totalCustomers;
    const estimated6MonthCustomers = Math.round(total6MonthOrders / (avgOrdersPerCustomer || 1));
    
    const newCustomerRatio = data.newCustomers / data.totalCustomers;
    const repeatCustomerRatio = data.repeatCustomers / data.totalCustomers;
    
    return {
      new: Math.round(estimated6MonthCustomers * newCustomerRatio),
      repeat: Math.round(estimated6MonthCustomers * repeatCustomerRatio)
    };
  }, [data.monthlySales, data.totalOrders, data.totalCustomers, data.newCustomers, data.repeatCustomers]);

  const sixMonthFulfillmentMetrics = useMemo(() => {
    if (data.monthlySales.length === 0) return { fulfilled: 0, unfulfilled: 0 };
    
    const total6MonthOrders = data.monthlySales.reduce((sum, month) => sum + month.orders, 0);
    const fulfillmentRate = data.fulfillmentRate / 100;
    
    return {
      fulfilled: Math.round(total6MonthOrders * fulfillmentRate),
      unfulfilled: Math.round(total6MonthOrders * (1 - fulfillmentRate))
    };
  }, [data.monthlySales, data.fulfillmentRate]);

  // Calculate financial totals for different periods
  const last7DaysFinancials = useMemo(() => {
    const totalRevenue = data.dailySales.reduce((sum, day) => sum + day.revenue, 0);
    const totalDiscounts = data.dailySales.reduce((sum, day) => sum + day.discounts, 0);
    const totalShipping = data.dailySales.reduce((sum, day) => sum + day.shipping, 0);
    const totalTaxes = data.dailySales.reduce((sum, day) => sum + day.taxes, 0);
    const totalReturns = data.dailySales.reduce((sum, day) => sum + day.returns, 0);
    const netRevenue = totalRevenue - totalReturns;
    
    return {
      totalRevenue,
      totalDiscounts,
      totalShipping,
      totalTaxes,
      totalReturns,
      netRevenue,
      discountRate: totalRevenue > 0 ? (totalDiscounts / totalRevenue) * 100 : 0,
      shippingRate: totalRevenue > 0 ? (totalShipping / totalRevenue) * 100 : 0,
      taxRate: totalRevenue > 0 ? (totalTaxes / totalRevenue) * 100 : 0,
      returnRate: totalRevenue > 0 ? (totalReturns / totalRevenue) * 100 : 0
    };
  }, [data.dailySales]);

  const weeklyFinancials = useMemo(() => {
    const totalRevenue = data.weeklySales.reduce((sum, week) => sum + week.revenue, 0);
    const totalDiscounts = data.weeklySales.reduce((sum, week) => sum + week.discounts, 0);
    const totalShipping = data.weeklySales.reduce((sum, week) => sum + week.shipping, 0);
    const totalTaxes = data.weeklySales.reduce((sum, week) => sum + week.taxes, 0);
    const totalReturns = data.weeklySales.reduce((sum, week) => sum + week.returns, 0);
    const netRevenue = totalRevenue - totalReturns;
    
    return {
      totalRevenue,
      totalDiscounts,
      totalShipping,
      totalTaxes,
      totalReturns,
      netRevenue,
      discountRate: totalRevenue > 0 ? (totalDiscounts / totalRevenue) * 100 : 0,
      shippingRate: totalRevenue > 0 ? (totalShipping / totalRevenue) * 100 : 0,
      taxRate: totalRevenue > 0 ? (totalTaxes / totalRevenue) * 100 : 0,
      returnRate: totalRevenue > 0 ? (totalReturns / totalRevenue) * 100 : 0
    };
  }, [data.weeklySales]);

  const monthlyFinancials = useMemo(() => {
    const totalRevenue = data.monthlySales.reduce((sum, month) => sum + month.revenue, 0);
    const totalDiscounts = data.monthlySales.reduce((sum, month) => sum + month.discounts, 0);
    const totalShipping = data.monthlySales.reduce((sum, month) => sum + month.shipping, 0);
    const totalTaxes = data.monthlySales.reduce((sum, month) => sum + month.taxes, 0);
    const totalReturns = data.monthlySales.reduce((sum, month) => sum + month.returns, 0);
    const netRevenue = totalRevenue - totalReturns;
    
    return {
      totalRevenue,
      totalDiscounts,
      totalShipping,
      totalTaxes,
      totalReturns,
      netRevenue,
      discountRate: totalRevenue > 0 ? (totalDiscounts / totalRevenue) * 100 : 0,
      shippingRate: totalRevenue > 0 ? (totalShipping / totalRevenue) * 100 : 0,
      taxRate: totalRevenue > 0 ? (totalTaxes / totalRevenue) * 100 : 0,
      returnRate: totalRevenue > 0 ? (totalReturns / totalRevenue) * 100 : 0
    };
  }, [data.monthlySales]);

  // ==================== CHART DATA MEMOIZATION ====================
  const chartData = useMemo(() => {
    return {
      customerDistribution: {
        labels: ['New Customers', 'Repeat Customers'],
        datasets: [
          {
            data: [sixMonthCustomerMetrics.new, sixMonthCustomerMetrics.repeat],
            backgroundColor: ['#f59e0b', '#10b981'],
            borderWidth: 2,
            borderColor: '#fff'
          }
        ]
      },
      orderFulfillment: {
        labels: ['Fulfilled', 'Unfulfilled'],
        datasets: [
          {
            data: [sixMonthFulfillmentMetrics.fulfilled, sixMonthFulfillmentMetrics.unfulfilled],
            backgroundColor: ['#10b981', '#ef4444'],
            borderWidth: 2,
            borderColor: '#fff'
          }
        ]
      },
      weeklyRevenue: {
        labels: data.weeklyRevenueTrend.map(w => w.week),
        datasets: [
          {
            label: 'Revenue',
            data: data.weeklyRevenueTrend.map(w => w.revenue),
            borderColor: '#3b82f6',
            backgroundColor: 'rgba(59, 130, 246, 0.1)',
            tension: 0.4,
            fill: true,
            borderWidth: 2,
            pointBackgroundColor: '#3b82f6',
            pointBorderColor: '#fff',
            pointBorderWidth: 2,
            pointRadius: 3,
            pointHoverRadius: 5
          }
        ]
      },
      monthlyPerformance: {
        labels: data.monthlyComparison.map(m => m.month),
        datasets: [
          {
            label: 'Revenue',
            data: data.monthlyComparison.map(m => m.revenue),
            backgroundColor: 'rgba(59, 130, 246, 0.8)',
            borderRadius: 4,
            borderSkipped: false,
          },
          {
            label: 'Orders',
            data: data.monthlyComparison.map(m => m.orders),
            backgroundColor: 'rgba(139, 92, 246, 0.8)',
            borderRadius: 4,
            borderSkipped: false,
          }
        ]
      },
      financialBreakdown: {
        labels: ['Gross Revenue', 'Discounts', 'Shipping', 'Taxes', 'Returns'],
        datasets: [
          {
            data: [
              data.monthlySales.reduce((sum, month) => sum + month.revenue, 0),
              data.monthlySales.reduce((sum, month) => sum + month.discounts, 0),
              data.monthlySales.reduce((sum, month) => sum + month.shipping, 0),
              data.monthlySales.reduce((sum, month) => sum + month.taxes, 0),
              data.monthlySales.reduce((sum, month) => sum + month.returns, 0)
            ],
            backgroundColor: [
              '#3b82f6', '#f59e0b', '#10b981', '#8b5cf6', '#ef4444'
            ],
            borderWidth: 2,
            borderColor: '#fff',
            hoverOffset: 8
          }
        ]
      }
    };
  }, [data, sixMonthCustomerMetrics, sixMonthFulfillmentMetrics]);

  // ==================== CHART OPTIONS MEMOIZATION ====================
  const chartOptions = useMemo(() => ({
    pie: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { display: false } },
      animation: {
        duration: 500,
        easing: 'easeOutQuart' as const
      }
    },
    line: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { 
        legend: { display: false },
        tooltip: {
          mode: 'index' as const,
          intersect: false,
          callbacks: {
            label: function(context: any) {
              return `Revenue: ${formatCurrency(context.parsed.y)}`;
            }
          }
        }
      },
      interaction: {
        mode: 'nearest' as const,
        axis: 'x' as const,
        intersect: false
      },
      scales: {
        x: {
          grid: { display: false }
        },
        y: {
          beginAtZero: true,
          ticks: {
            callback: function(this: any, value: any) {
              return formatCurrency(value);
            }
          },
          grid: { color: 'rgba(0, 0, 0, 0.1)' }
        }
      },
      animation: {
        duration: 600,
        easing: 'easeOutQuart' as const
      }
    },
    bar: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { 
        legend: { display: false },
        tooltip: {
          mode: 'index' as const,
          intersect: false,
          callbacks: {
            label: function(context: any) {
              const datasetLabel = context.dataset.label || '';
              const value = context.parsed.y;
              return `${datasetLabel}: ${formatCurrency(value)}`;
            }
          }
        }
      },
      interaction: {
        mode: 'index' as const,
        intersect: false
      },
      scales: {
        x: { grid: { display: false } },
        y: { 
          beginAtZero: true,
          ticks: {
            callback: function(this: any, value: any) {
              return formatCurrency(value);
            }
          },
          grid: { color: 'rgba(0, 0, 0, 0.1)' }
        }
      },
      animation: {
        duration: 600,
        easing: 'easeOutQuart' as const
      }
    },
    financialPie: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { 
        legend: { 
          display: false 
        },
        tooltip: {
          callbacks: {
            label: function(context: any) {
              const label = context.label || '';
              const value = context.parsed;
              const total = context.dataset.data.reduce((a: number, b: number) => a + b, 0);
              const percentage = ((value / total) * 100).toFixed(1);
              return `${label}: ${formatCurrency(value)} (${percentage}%)`;
            }
          }
        }
      },
      animation: {
        duration: 600,
        easing: 'easeOutQuart' as const
      }
    }
  }), [data.shopCurrency]);

  // ==================== INDIVIDUAL CHART COMPONENTS ====================
  const CustomerDistributionChart = useMemo(() => (
    <Pie 
      data={chartData.customerDistribution}
      options={chartOptions.pie}
      height={120}
      redraw={false}
    />
  ), [chartData.customerDistribution, chartOptions.pie]);

  const OrderFulfillmentChart = useMemo(() => (
    <Doughnut 
      data={chartData.orderFulfillment}
      options={chartOptions.pie}
      height={120}
      redraw={false}
    />
  ), [chartData.orderFulfillment, chartOptions.pie]);

  const RevenueTrendChart = useMemo(() => (
    <Line 
      data={chartData.weeklyRevenue}
      options={chartOptions.line}
      height={120}
      redraw={false}
    />
  ), [chartData.weeklyRevenue, chartOptions.line]);

  const MonthlyPerformanceChart = useMemo(() => (
    <Bar 
      data={chartData.monthlyPerformance}
      options={chartOptions.bar}
      height={120}
      redraw={false}
    />
  ), [chartData.monthlyPerformance, chartOptions.bar]);

  const FinancialBreakdownChart = useMemo(() => (
    <Pie 
      data={chartData.financialBreakdown}
      options={chartOptions.financialPie}
      height={120}
      redraw={false}
    />
  ), [chartData.financialBreakdown, chartOptions.financialPie]);

  // ==================== LOADING STATE ====================
  if (isLoading) {
    return (
      <div className="orders-dashboard">
        <div className="dashboard-header">
          <h1>Orders Dashboard</h1>
        </div>
        <LoadingProgress />
      </div>
    );
  }

  // ==================== COMPONENT RENDER ====================
  return (
    <div className="orders-dashboard">
      <div className="dashboard-header">
        <h1>Orders Dashboard</h1>
        <button
          className="print-button"
          onClick={() => window.print()}
          disabled={isExporting}
        >
          <Icon.Print />
          Print Report
        </button>
      </div>
      

     
      <div id="dashboard-content">
        
        {/* TODAY'S PERFORMANCE SECTION */}
        <div className="today-performance">
          <h2>Today's Performance</h2>
          
          {/* Primary Metrics Grid */}
          <div className="primary-metrics-grid">
            <div className={`metric-card orders ${data.ordersChangeVsYesterday >= 0 ? 'positive' : 'negative'}`}>
              <p className="metric-value">{formatNumber(data.todayOrders)}</p>
              <p className="metric-label">Today's Orders</p>
              {data.ordersChangeVsYesterday !== 0 && (
                <div className={`metric-change ${data.ordersChangeVsYesterday >= 0 ? 'positive' : 'negative'}`}>
                  {data.ordersChangeVsYesterday >= 0 ? <Icon.TrendUp /> : <Icon.TrendDown />} 
                  {Math.abs(data.ordersChangeVsYesterday).toFixed(1)}% vs yesterday
                </div>
              )}
            </div>
            
            <div className={`metric-card revenue ${data.revenueChangeVsYesterday >= 0 ? 'positive' : 'negative'}`}>
              <p className="metric-value">{formatCurrency(data.todayRevenue)}</p>
              <p className="metric-label">Today's Revenue</p>
              {data.revenueChangeVsYesterday !== 0 && (
                <div className={`metric-change ${data.revenueChangeVsYesterday >= 0 ? 'positive' : 'negative'}`}>
                  {data.revenueChangeVsYesterday >= 0 ? <Icon.TrendUp /> : <Icon.TrendDown />} 
                  {Math.abs(data.revenueChangeVsYesterday).toFixed(1)}% vs yesterday
                </div>
              )}
            </div>
            
            <div className={`metric-card items ${data.itemsChangeVsYesterday >= 0 ? 'positive' : 'negative'}`}>
              <p className="metric-value">{formatNumber(data.todayItems)}</p>
              <p className="metric-label">Items Ordered</p>
              {data.itemsChangeVsYesterday !== 0 && (
                <div className={`metric-change ${data.itemsChangeVsYesterday >= 0 ? 'positive' : 'negative'}`}>
                  {data.itemsChangeVsYesterday >= 0 ? <Icon.TrendUp /> : <Icon.TrendDown />} 
                  {Math.abs(data.itemsChangeVsYesterday).toFixed(1)}% vs yesterday
                </div>
              )}
            </div>
          </div>

          {/* FULFILLMENT METRICS */}
          <div className="fulfillment-metrics-grid">
            <div className="fulfillment-metric-card today-fulfilled">
              <div className="fulfillment-metric-value">{formatNumber(data.todayFulfilled)}</div>
              <div className="fulfillment-metric-label">Fulfilled Today</div>
              <div className="fulfillment-metric-period">Today</div>
            </div>
            
            <div className="fulfillment-metric-card today-unfulfilled">
              <div className="fulfillment-metric-value">{formatNumber(data.todayUnfulfilled)}</div>
              <div className="fulfillment-metric-label">Unfulfilled Today</div>
              <div className="fulfillment-metric-period">Today</div>
            </div>
            
            <div className="fulfillment-metric-card week-fulfilled">
              <div className="fulfillment-metric-value">{formatNumber(data.last7DaysFulfilled)}</div>
              <div className="fulfillment-metric-label">Fulfilled</div>
              <div className="fulfillment-metric-period">Last 7 Days</div>
            </div>
            
            <div className="fulfillment-metric-card week-unfulfilled">
              <div className="fulfillment-metric-value">{formatNumber(data.last7DaysUnfulfilled)}</div>
              <div className="fulfillment-metric-label">Unfulfilled</div>
              <div className="fulfillment-metric-period">Last 7 Days</div>
            </div>
          </div>

          {/* LAST 7 DAYS SUMMARY */}
          <div className="last7days-section">
            <h3>Last 7 Days Performance</h3>
            
            {/* 7 Days Totals */}
            <div className="last7days-grid">
              <div className="last7days-total-card">
                <div className="last7days-total-value">
                  {formatNumber(data.dailySales.reduce((sum, day) => sum + day.orders, 0))}
                </div>
                <div className="last7days-total-label">Total Orders</div>
              </div>
              
              <div className="last7days-total-card">
                <div className="last7days-total-value">
                  {formatCurrency(data.dailySales.reduce((sum, day) => sum + day.revenue, 0))}
                </div>
                <div className="last7days-total-label">Total Revenue</div>
              </div>
              
              <div className="last7days-total-card">
                <div className="last7days-total-value">
                  {formatNumber(data.dailySales.reduce((sum, day) => sum + day.items, 0))}
                </div>
                <div className="last7days-total-label">Total Items</div>
              </div>
              
              <div className="last7days-total-card">
                <div className="last7days-total-value">
                  {formatCurrency(data.averageDailyRevenue)}
                </div>
                <div className="last7days-total-label">Avg Daily Revenue</div>
              </div>
            </div>

            {/* Daily Breakdown */}
            <div className="daily-breakdown">
              <h4>Daily Breakdown</h4>
              <div className="daily-cards-container">
                {data.dailySales.map((day, index) => {
                  const [year, month, dayNum] = day.date.split('-').map(Number);
                  const date = new Date(year, month - 1, dayNum);
                  
                  const isToday = day.date === data.currentDateInShopTZ;
                  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
                  
                  return (
                    <div key={day.date} className={`daily-card ${isToday ? 'today' : ''}`}>
                      <div className="daily-card-header">
                        <div className="daily-date">
                          {date.getDate()}/{date.getMonth() + 1}
                        </div>
                        <div className="daily-day">
                          {dayNames[date.getDay()]}
                        </div>
                      </div>
                      
                      <div className="daily-metrics">
                        <div className="daily-metric orders">
                          <span className="daily-metric-label">Orders</span>
                          <span className="daily-metric-value">{formatNumber(day.orders)}</span>
                        </div>
                        
                        <div className="daily-metric revenue">
                          <span className="daily-metric-label">Revenue</span>
                          <span className="daily-metric-value">{formatCurrency(day.revenue)}</span>
                        </div>
                        
                        <div className="daily-metric items">
                          <span className="daily-metric-label">Items</span>
                          <span className="daily-metric-value">{formatNumber(day.items)}</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* WEEK-OVER-WEEK INSIGHT */}
        <div className="secondary-metrics">
          <div className="insight-card">
            <h4>Week-over-Week Revenue Change</h4>
            <p className={`insight-value ${data.revenueChangeVsLastWeek >= 0 ? 'text-positive' : 'text-negative'}`}>
              {data.revenueChangeVsLastWeek >= 0 ? <Icon.TrendUp /> : <Icon.TrendDown />} 
              {Math.abs(data.revenueChangeVsLastWeek).toFixed(1)}%
            </p>
          </div>
        </div>

        {/* CUSTOMER INSIGHTS */}
        <div className="customer-metrics">
          <h3>Customer Insights</h3>
          <div className="customer-metrics-grid">
            <div className="customer-metric-card total-customers">
              <div className="customer-metric-value">{formatNumber(data.totalCustomers)}</div>
              <div className="customer-metric-label">Total Customers</div>
            </div>
            
            <div className="customer-metric-card new-customers">
              <div className="customer-metric-value">{formatNumber(data.newCustomers)}</div>
              <div className="customer-metric-label">New Customers</div>
            </div>
            
            <div className="customer-metric-card repeat-customers">
              <div className="customer-metric-value">{formatNumber(data.repeatCustomers)}</div>
              <div className="customer-metric-label">Repeat Customers</div>
            </div>
            
            <div className="customer-metric-card loyalty-rate">
              <div className="customer-metric-value">{formatPercent(data.repeatCustomerRate)}</div>
              <div className="customer-metric-label">Repeat Customer Rate</div>
            </div>
          </div>
        </div>

        {/* 7-DAY CUSTOMER INSIGHTS */}
        <div className="customer-metrics">
          <h3>Last 7 Days Customer Insights</h3>
          
          <div className="customer-metrics-grid">
            <div className="customer-metric-card total-customers">
              <div className="customer-metric-value">{formatNumber(data.last7DaysTotalCustomers)}</div>
              <div className="customer-metric-label">7-Day Total Customers</div>
            </div>
            
            <div className="customer-metric-card new-customers">
              <div className="customer-metric-value">{formatNumber(data.last7DaysNewCustomers)}</div>
              <div className="customer-metric-label">7-Day New Customers</div>
            </div>
            
            <div className="customer-metric-card repeat-customers">
              <div className="customer-metric-value">{formatNumber(data.last7DaysRepeatCustomers)}</div>
              <div className="customer-metric-label">7-Day Repeat Customers</div>
            </div>
            
            <div className="customer-metric-card loyalty-rate">
              <div className="customer-metric-value">{formatPercent(data.last7DaysRepeatCustomerRate)}</div>
              <div className="customer-metric-label">7-Day Repeat Rate</div>
            </div>
          </div>
        </div>

        {/* ==================== FINANCIAL BREAKDOWN SECTIONS ==================== */}

        {/* 7-DAY FINANCIAL BREAKDOWN */}
        <div className="financial-metrics">
          <h3>Last 7 Days Financial Breakdown</h3>
          <div className="financial-metrics-grid">
            <div className="financial-metric-card revenue">
              <div className="financial-metric-value">{formatCurrency(last7DaysFinancials.totalRevenue)}</div>
              <div className="financial-metric-label">Gross Revenue</div>
              <div className="financial-metric-period">7 Days</div>
            </div>
            
            <div className="financial-metric-card discounts">
              <div className="financial-metric-value">{formatCurrency(last7DaysFinancials.totalDiscounts)}</div>
              <div className="financial-metric-label">Total Discounts</div>
              <div className="financial-metric-rate">{formatPercent(last7DaysFinancials.discountRate)} of revenue</div>
            </div>
            
            <div className="financial-metric-card shipping">
              <div className="financial-metric-value">{formatCurrency(last7DaysFinancials.totalShipping)}</div>
              <div className="financial-metric-label">Shipping Charges</div>
              <div className="financial-metric-rate">{formatPercent(last7DaysFinancials.shippingRate)} of revenue</div>
            </div>
            
            <div className="financial-metric-card taxes">
              <div className="financial-metric-value">{formatCurrency(last7DaysFinancials.totalTaxes)}</div>
              <div className="financial-metric-label">Taxes Collected</div>
              <div className="financial-metric-rate">{formatPercent(last7DaysFinancials.taxRate)} of revenue</div>
            </div>
            
            <div className="financial-metric-card returns">
              <div className="financial-metric-value">{formatCurrency(last7DaysFinancials.totalReturns)}</div>
              <div className="financial-metric-label">Returns & Refunds</div>
              <div className="financial-metric-rate">{formatPercent(last7DaysFinancials.returnRate)} of revenue</div>
            </div>
            
            <div className="financial-metric-card net-revenue">
              <div className="financial-metric-value">{formatCurrency(last7DaysFinancials.netRevenue)}</div>
              <div className="financial-metric-label">Net Revenue</div>
              <div className="financial-metric-period">After returns</div>
            </div>
          </div>

          {/* Daily Financial Breakdown */}
          <div className="daily-financial-breakdown">
            <h4>Daily Financial Details</h4>
            <div className="daily-financial-cards">
              {data.dailySales.map((day, index) => {
                const [year, month, dayNum] = day.date.split('-').map(Number);
                const date = new Date(year, month - 1, dayNum);
                const isToday = day.date === data.currentDateInShopTZ;
                const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
                const dayNetRevenue = day.revenue - day.returns;
                
                return (
                  <div key={day.date} className={`daily-financial-card ${isToday ? 'today' : ''}`}>
                    <div className="daily-financial-header">
                      <div className="daily-financial-date">
                        {date.getDate()}/{date.getMonth() + 1}
                      </div>
                      <div className="daily-financial-day">
                        {dayNames[date.getDay()]}
                      </div>
                    </div>
                    
                    <div className="daily-financial-metrics">
                      <div className="daily-financial-metric gross-revenue">
                        <span className="daily-financial-label">Gross Revenue</span>
                        <span className="daily-financial-value">{formatCurrency(day.revenue)}</span>
                      </div>
                      
                      <div className="daily-financial-metric discounts">
                        <span className="daily-financial-label">Discounts</span>
                        <span className="daily-financial-value">{formatCurrency(day.discounts)}</span>
                      </div>
                      
                      <div className="daily-financial-metric shipping">
                        <span className="daily-financial-label">Shipping</span>
                        <span className="daily-financial-value">{formatCurrency(day.shipping)}</span>
                      </div>
                      
                      <div className="daily-financial-metric taxes">
                        <span className="daily-financial-label">Taxes</span>
                        <span className="daily-financial-value">{formatCurrency(day.taxes)}</span>
                      </div>
                      
                      <div className="daily-financial-metric returns">
                        <span className="daily-financial-label">Returns</span>
                        <span className="daily-financial-value">{formatCurrency(day.returns)}</span>
                      </div>
                      
                      <div className="daily-financial-metric net-revenue">
                        <span className="daily-financial-label">Net Revenue</span>
                        <span className="daily-financial-value">{formatCurrency(dayNetRevenue)}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* WEEKLY FINANCIAL BREAKDOWN */}
        <div className="financial-metrics">
          <h3>Weekly Financial Breakdown (Last 8 Weeks)</h3>
          <div className="financial-metrics-grid">
            <div className="financial-metric-card revenue">
              <div className="financial-metric-value">{formatCurrency(weeklyFinancials.totalRevenue)}</div>
              <div className="financial-metric-label">Gross Revenue</div>
              <div className="financial-metric-period">8 Weeks</div>
            </div>
            
            <div className="financial-metric-card discounts">
              <div className="financial-metric-value">{formatCurrency(weeklyFinancials.totalDiscounts)}</div>
              <div className="financial-metric-label">Total Discounts</div>
              <div className="financial-metric-rate">{formatPercent(weeklyFinancials.discountRate)} of revenue</div>
            </div>
            
            <div className="financial-metric-card shipping">
              <div className="financial-metric-value">{formatCurrency(weeklyFinancials.totalShipping)}</div>
              <div className="financial-metric-label">Shipping Charges</div>
              <div className="financial-metric-rate">{formatPercent(weeklyFinancials.shippingRate)} of revenue</div>
            </div>
            
            <div className="financial-metric-card taxes">
              <div className="financial-metric-value">{formatCurrency(weeklyFinancials.totalTaxes)}</div>
              <div className="financial-metric-label">Taxes Collected</div>
              <div className="financial-metric-rate">{formatPercent(weeklyFinancials.taxRate)} of revenue</div>
            </div>
            
            <div className="financial-metric-card returns">
              <div className="financial-metric-value">{formatCurrency(weeklyFinancials.totalReturns)}</div>
              <div className="financial-metric-label">Returns & Refunds</div>
              <div className="financial-metric-rate">{formatPercent(weeklyFinancials.returnRate)} of revenue</div>
            </div>
            
            <div className="financial-metric-card net-revenue">
              <div className="financial-metric-value">{formatCurrency(weeklyFinancials.netRevenue)}</div>
              <div className="financial-metric-label">Net Revenue</div>
              <div className="financial-metric-period">After returns</div>
            </div>
          </div>

          {/* Weekly Financial Breakdown */}
          <div className="weekly-financial-breakdown">
            <h4>Weekly Financial Details</h4>
            <div className="weekly-financial-cards">
              {data.weeklySales.map((week, index) => {
                const weekNetRevenue = week.revenue - week.returns;
                const discountRate = week.revenue > 0 ? (week.discounts / week.revenue) * 100 : 0;
                const shippingRate = week.revenue > 0 ? (week.shipping / week.revenue) * 100 : 0;
                const taxRate = week.revenue > 0 ? (week.taxes / week.revenue) * 100 : 0;
                const returnRate = week.revenue > 0 ? (week.returns / week.revenue) * 100 : 0;
                
                return (
                  <div key={week.week} className="weekly-financial-card">
                    <div className="weekly-financial-header">
                      <div className="weekly-financial-label">Week {week.week.split('-W')[1]}</div>
                      <div className="weekly-financial-period">{week.week.split('-')[0]}</div>
                    </div>
                    
                    <div className="weekly-financial-metrics">
                      <div className="weekly-financial-metric gross-revenue">
                        <span className="weekly-financial-label">Gross Revenue</span>
                        <span className="weekly-financial-value">{formatCurrency(week.revenue)}</span>
                      </div>
                      
                      <div className="weekly-financial-metric discounts">
                        <span className="weekly-financial-label">Discounts</span>
                        <span className="weekly-financial-value">{formatCurrency(week.discounts)}</span>
                        <span className="weekly-financial-rate">{formatPercent(discountRate)}</span>
                      </div>
                      
                      <div className="weekly-financial-metric shipping">
                        <span className="weekly-financial-label">Shipping</span>
                        <span className="weekly-financial-value">{formatCurrency(week.shipping)}</span>
                        <span className="weekly-financial-rate">{formatPercent(shippingRate)}</span>
                      </div>
                      
                      <div className="weekly-financial-metric taxes">
                        <span className="weekly-financial-label">Taxes</span>
                        <span className="weekly-financial-value">{formatCurrency(week.taxes)}</span>
                        <span className="weekly-financial-rate">{formatPercent(taxRate)}</span>
                      </div>
                      
                      <div className="weekly-financial-metric returns">
                        <span className="weekly-financial-label">Returns</span>
                        <span className="weekly-financial-value">{formatCurrency(week.returns)}</span>
                        <span className="weekly-financial-rate">{formatPercent(returnRate)}</span>
                      </div>
                      
                      <div className="weekly-financial-metric net-revenue">
                        <span className="weekly-financial-label">Net Revenue</span>
                        <span className="weekly-financial-value">{formatCurrency(weekNetRevenue)}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* MONTHLY FINANCIAL BREAKDOWN */}
        <div className="financial-metrics">
          <h3>Monthly Financial Breakdown (Last 6 Months)</h3>
          <div className="financial-metrics-grid">
            <div className="financial-metric-card revenue">
              <div className="financial-metric-value">{formatCurrency(monthlyFinancials.totalRevenue)}</div>
              <div className="financial-metric-label">Gross Revenue</div>
              <div className="financial-metric-period">6 Months</div>
            </div>
            
            <div className="financial-metric-card discounts">
              <div className="financial-metric-value">{formatCurrency(monthlyFinancials.totalDiscounts)}</div>
              <div className="financial-metric-label">Total Discounts</div>
              <div className="financial-metric-rate">{formatPercent(monthlyFinancials.discountRate)} of revenue</div>
            </div>
            
            <div className="financial-metric-card shipping">
              <div className="financial-metric-value">{formatCurrency(monthlyFinancials.totalShipping)}</div>
              <div className="financial-metric-label">Shipping Charges</div>
              <div className="financial-metric-rate">{formatPercent(monthlyFinancials.shippingRate)} of revenue</div>
            </div>
            
            <div className="financial-metric-card taxes">
              <div className="financial-metric-value">{formatCurrency(monthlyFinancials.totalTaxes)}</div>
              <div className="financial-metric-label">Taxes Collected</div>
              <div className="financial-metric-rate">{formatPercent(monthlyFinancials.taxRate)} of revenue</div>
            </div>
            
            <div className="financial-metric-card returns">
              <div className="financial-metric-value">{formatCurrency(monthlyFinancials.totalReturns)}</div>
              <div className="financial-metric-label">Returns & Refunds</div>
              <div className="financial-metric-rate">{formatPercent(monthlyFinancials.returnRate)} of revenue</div>
            </div>
            
            <div className="financial-metric-card net-revenue">
              <div className="financial-metric-value">{formatCurrency(monthlyFinancials.netRevenue)}</div>
              <div className="financial-metric-label">Net Revenue</div>
              <div className="financial-metric-period">After returns</div>
            </div>
          </div>

          {/* Monthly Financial Breakdown */}
          <div className="monthly-financial-breakdown">
            <h4>Monthly Financial Details</h4>
            <div className="monthly-financial-cards">
              {data.monthlySales.map((monthData, index) => {
                const monthNumber = parseInt(monthData.month.split('-')[1]);
                const year = monthData.month.split('-')[0];
                const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
                const monthName = monthNames[monthNumber - 1];
                const monthNetRevenue = monthData.revenue - monthData.returns;
                const discountRate = monthData.revenue > 0 ? (monthData.discounts / monthData.revenue) * 100 : 0;
                const shippingRate = monthData.revenue > 0 ? (monthData.shipping / monthData.revenue) * 100 : 0;
                const taxRate = monthData.revenue > 0 ? (monthData.taxes / monthData.revenue) * 100 : 0;
                const returnRate = monthData.revenue > 0 ? (monthData.returns / monthData.revenue) * 100 : 0;
                
                // Determine performance badge
                const avgRevenue = data.monthlySales.reduce((sum, month) => sum + month.revenue, 0) / data.monthlySales.length;
                const performanceLevel = monthData.revenue > avgRevenue * 1.2 ? 'high' : 
                                       monthData.revenue > avgRevenue * 0.8 ? 'medium' : 'low';
                
                return (
                  <div key={monthData.month} className="monthly-financial-card">
                    <div className={`performance-badge ${performanceLevel}`}></div>
                    <div className="monthly-financial-header">
                      <div className="monthly-financial-label">{monthName}</div>
                      <div className="monthly-financial-period">{year}</div>
                    </div>
                    
                    <div className="monthly-financial-metrics">
                      <div className="monthly-financial-metric gross-revenue">
                        <span className="monthly-financial-label">Gross Revenue</span>
                        <span className="monthly-financial-value">{formatCurrency(monthData.revenue)}</span>
                      </div>
                      
                      <div className="monthly-financial-metric discounts">
                        <span className="monthly-financial-label">Discounts</span>
                        <span className="monthly-financial-value">{formatCurrency(monthData.discounts)}</span>
                       <span className="monthly-financial-rate">{formatPercent(discountRate)}</span>
                      </div>
                      
                      <div className="monthly-financial-metric shipping">
                        <span className="monthly-financial-label">Shipping</span>
                        <span className="monthly-financial-value">{formatCurrency(monthData.shipping)}</span>
                        <span className="monthly-financial-rate">{formatPercent(shippingRate)}</span>
                      </div>
                      
                      <div className="monthly-financial-metric taxes">
                        <span className="monthly-financial-label">Taxes</span>
                        <span className="monthly-financial-value">{formatCurrency(monthData.taxes)}</span>
                        <span className="monthly-financial-rate">{formatPercent(taxRate)}</span>
                      </div>
                      
                      <div className="monthly-financial-metric returns">
                        <span className="monthly-financial-label">Returns</span>
                        <span className="monthly-financial-value">{formatCurrency(monthData.returns)}</span>
                        <span className="monthly-financial-rate">{formatPercent(returnRate)}</span>
                      </div>
                      
                      <div className="monthly-financial-metric net-revenue">
                        <span className="monthly-financial-label">Net Revenue</span>
                        <span className="monthly-financial-value">{formatCurrency(monthNetRevenue)}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* WEEKLY PERFORMANCE SUMMARY */}
        <div className="weekly-performance">
          <h3>Weekly Performance (Last 8 Weeks)</h3>
          
          {/* Weekly Totals */}
          <div className="weekly-grid">
            <div className="weekly-card">
              <div className="weekly-value">
                {formatNumber(data.weeklySales.reduce((sum, week) => sum + week.orders, 0))}
              </div>
              <div className="weekly-label">Total Orders</div>
            </div>
            
            <div className="weekly-card">
              <div className="weekly-value">
                {formatCurrency(data.weeklySales.reduce((sum, week) => sum + week.revenue, 0))}
              </div>
              <div className="weekly-label">Total Revenue</div>
            </div>
            
            <div className="weekly-card">
              <div className="weekly-value">
                {formatNumber(data.weeklySales.reduce((sum, week) => sum + week.items, 0))}
              </div>
              <div className="weekly-label">Total Items</div>
            </div>
            
            <div className="weekly-card">
              <div className="weekly-value">
                {formatCurrency(data.weeklySales.length > 0 ? data.weeklySales.reduce((sum, week) => sum + week.revenue, 0) / data.weeklySales.length : 0)}
              </div>
              <div className="weekly-label">Avg Weekly Revenue</div>
            </div>
          </div>

          {/* Weekly Breakdown */}
          <div className="weekly-breakdown">
            <h4>Weekly Breakdown</h4>
            <div className="weekly-cards-container">
              {data.weeklySales.map((week, index) => (
                <div key={week.week} className="week-card">
                  <div className="week-header">
                    <div className="week-label">Week {week.week.split('-W')[1]}</div>
                    <div className="week-period">{week.week.split('-')[0]}</div>
                  </div>
                  
                  <div className="week-metrics">
                    <div className="week-metric orders">
                      <span className="week-metric-label">Orders</span>
                      <span className="week-metric-value">{formatNumber(week.orders)}</span>
                    </div>
                    
                    <div className="week-metric revenue">
                      <span className="week-metric-label">Revenue</span>
                      <span className="week-metric-value">{formatCurrency(week.revenue)}</span>
                    </div>
                    
                    <div className="week-metric items">
                      <span className="week-metric-label">Items</span>
                      <span className="week-metric-value">{formatNumber(week.items)}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* MONTHLY PERFORMANCE SUMMARY */}
        <div className="monthly-performance">
          <h3>Monthly Performance (Last 6 Months)</h3>
          
          {/* Monthly Totals */}
          <div className="monthly-grid">
            <div className="monthly-card">
              <div className="monthly-value">
                {formatNumber(data.monthlySales.reduce((sum, month) => sum + month.orders, 0))}
              </div>
              <div className="monthly-label">Total Orders</div>
            </div>
            
            <div className="monthly-card">
              <div className="monthly-value">
                {formatCurrency(data.monthlySales.reduce((sum, month) => sum + month.revenue, 0))}
              </div>
              <div className="monthly-label">Total Revenue</div>
            </div>
            
            <div className="monthly-card">
              <div className="monthly-value">
                {formatNumber(data.monthlySales.reduce((sum, month) => sum + month.items, 0))}
              </div>
              <div className="monthly-label">Total Items</div>
            </div>
            
            <div className="monthly-card">
              <div className="monthly-value">
                {formatCurrency(data.monthlySales.length > 0 ? data.monthlySales.reduce((sum, month) => sum + month.revenue, 0) / data.monthlySales.length : 0)}
              </div>
              <div className="monthly-label">Avg Monthly Revenue</div>
            </div>
          </div>

          {/* Monthly Breakdown */}
          <div className="monthly-breakdown">
            <h4>Monthly Breakdown</h4>
            <div className="monthly-cards-container">
              {data.monthlySales.map((monthData, index) => {
                const monthNumber = parseInt(monthData.month.split('-')[1]);
                const year = monthData.month.split('-')[0];
                const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
                const monthName = monthNames[monthNumber - 1];
                
                // Determine performance badge
                const avgRevenue = data.monthlySales.reduce((sum, month) => sum + month.revenue, 0) / data.monthlySales.length;
                const performanceLevel = monthData.revenue > avgRevenue * 1.2 ? 'high' : 
                                       monthData.revenue > avgRevenue * 0.8 ? 'medium' : 'low';
                
                return (
                  <div key={monthData.month} className="month-card">
                    <div className={`performance-badge ${performanceLevel}`}></div>
                    <div className="month-header">
                      <div className="month-label">{monthName}</div>
                      <div className="month-period">{year}</div>
                    </div>
                    
                    <div className="month-metrics">
                      <div className="month-metric orders">
                        <span className="month-metric-label">Orders</span>
                        <span className="month-metric-value">{formatNumber(monthData.orders)}</span>
                      </div>
                      
                      <div className="month-metric revenue">
                        <span className="month-metric-label">Revenue</span>
                        <span className="month-metric-value">{formatCurrency(monthData.revenue)}</span>
                      </div>
                      
                      <div className="month-metric items">
                        <span className="month-metric-label">Items</span>
                        <span className="month-metric-value">{formatNumber(monthData.items)}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* CHARTS & ANALYTICS SECTION */}
        <div className="charts-section">
          <h2>6-Month Analytics & Insights</h2>
          
          <div className="charts-grid">
            {/* 6-Month Customer Distribution Pie Chart */}
            <div className="chart-container">
              <div className="chart-header">
                <div className="chart-title">6-Month Customer Distribution</div>
                <div className="chart-legend">
                  <div className="legend-item">
                    <div className="legend-color new"></div>
                    <span>New</span>
                  </div>
                  <div className="legend-item">
                    <div className="legend-color repeat"></div>
                    <span>Repeat</span>
                  </div>
                </div>
              </div>
              {CustomerDistributionChart}
              <div className="mini-stats">
                <div className="mini-stat-card">
                  <div className="mini-stat-value">{formatPercent(
                    sixMonthCustomerMetrics.repeat / (sixMonthCustomerMetrics.new + sixMonthCustomerMetrics.repeat || 1) * 100
                  )}</div>
                  <div className="mini-stat-label">6-Month Repeat Rate</div>
                </div>
                <div className="mini-stat-card">
                  <div className="mini-stat-value">{formatNumber(
                    sixMonthCustomerMetrics.new + sixMonthCustomerMetrics.repeat
                  )}</div>
                  <div className="mini-stat-label">6-Month Customers</div>
                </div>
              </div>
            </div>

            {/* 6-Month Order Fulfillment Doughnut Chart */}
            <div className="chart-container">
              <div className="chart-header">
                <div className="chart-title">6-Month Order Fulfillment</div>
                <div className="chart-legend">
                  <div className="legend-item">
                    <div className="legend-color fulfilled"></div>
                    <span>Fulfilled</span>
                  </div>
                  <div className="legend-item">
                    <div className="legend-color unfulfilled"></div>
                    <span>Unfulfilled</span>
                  </div>
                </div>
              </div>
              {OrderFulfillmentChart}
              <div className="mini-stats">
                <div className="mini-stat-card">
                  <div className="mini-stat-value">{formatPercent(
                    (sixMonthFulfillmentMetrics.fulfilled / (sixMonthFulfillmentMetrics.fulfilled + sixMonthFulfillmentMetrics.unfulfilled || 1)) * 100
                  )}</div>
                  <div className="mini-stat-label">6-Month Fulfillment Rate</div>
                </div>
                <div className="mini-stat-card">
                  <div className="mini-stat-value">{formatNumber(
                    sixMonthFulfillmentMetrics.fulfilled + sixMonthFulfillmentMetrics.unfulfilled
                  )}</div>
                  <div className="mini-stat-label">6-Month Orders</div>
                </div>
              </div>
            </div>

            {/* Weekly Revenue Trend Line Chart */}
            <div className="chart-container">
              <div className="chart-header">
                <div className="chart-title">Weekly Revenue</div>
                <div className="chart-legend">
                  <div className="legend-item">
                    <div className="legend-color revenue"></div>
                    <span>Revenue</span>
                  </div>
                </div>
              </div>
              {RevenueTrendChart}
            </div>

            {/* 6-Month Performance Bar Chart */}
            <div className="chart-container">
              <div className="chart-header">
                <div className="chart-title">6-Month Performance</div>
                <div className="chart-legend">
                  <div className="legend-item">
                    <div className="legend-color revenue"></div>
                    <span>Revenue</span>
                  </div>
                  <div className="legend-item">
                    <div className="legend-color orders"></div>
                    <span>Orders</span>
                  </div>
                </div>
              </div>
              {MonthlyPerformanceChart}
            </div>

            {/* 6-Month Financial Breakdown Pie Chart */}
            <div className="chart-container">
              <div className="chart-header">
                <div className="chart-title">6-Month Financial Breakdown</div>
                <div className="chart-legend">
                  <div className="legend-item">
                    <div className="legend-color revenue"></div>
                    <span>Revenue</span>
                  </div>
                  <div className="legend-item">
                    <div className="legend-color discounts"></div>
                    <span>Discounts</span>
                  </div>
                  <div className="legend-item">
                    <div className="legend-color shipping"></div>
                    <span>Shipping</span>
                  </div>
                  <div className="legend-item">
                    <div className="legend-color taxes"></div>
                    <span>Taxes</span>
                  </div>
                  <div className="legend-item">
                    <div className="legend-color returns"></div>
                    <span>Returns</span>
                  </div>
                </div>
              </div>
              {FinancialBreakdownChart}
              <div className="mini-stats">
                <div className="mini-stat-card">
                  <div className="mini-stat-value">{formatCurrency(
                    data.monthlySales.reduce((sum, month) => sum + month.revenue, 0) - 
                    data.monthlySales.reduce((sum, month) => sum + month.returns, 0)
                  )}</div>
                  <div className="mini-stat-label">6-Month Net Revenue</div>
                </div>
                <div className="mini-stat-card">
                  <div className="mini-stat-value">{formatPercent(
                    (data.monthlySales.reduce((sum, month) => sum + month.returns, 0) / 
                    data.monthlySales.reduce((sum, month) => sum + month.revenue, 0) * 100) || 0
                  )}</div>
                  <div className="mini-stat-label">6-Month Return Rate</div>
                </div>
              </div>
            </div>
          </div>
        </div>
         
        <div className="app-footer">
          <div className="footer-content">
            <p>
              <strong>Orders Analyzed:</strong> {data.ordersLoaded} orders • 
              <strong> Net Revenue:</strong> {formatCurrency(data.netRevenue)} • 
              <strong> Data Updated:</strong> {new Date().toLocaleDateString()}
            </p>
            <p className="footer-brand">Orders Dashboard - Powering Your Business Insights</p>
          </div>
        </div>
      </div>
    </div>
  );
}


