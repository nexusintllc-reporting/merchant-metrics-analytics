// import { Session } from "@shopify/shopify-api";

// // Import all our extracted core modules
// import type { OrderStats, CustomerData } from '../types/analytics';
// import type { EmailOrderData } from '../types/emailAnalytics';

// import { fetchOrdersForPeriod } from '../services/shopifyApi.server';
// import { processOrderToStats, mergeStats } from '../core/financialCalculator.server';
// import { buildCustomerOrderMap, analyzeCustomerBehavior, calculateOverallCustomerData } from '../core/customerAnalytics.server';
// import { getMonthRanges, getLastNDays, getLast8Weeks, formatWeekDisplay } from '../utils/analyticsHelpers';


// import { calculateOrderEventSummary, mergeEventSummaries } from '../core/eventDetection.server';




// export class AnalyticsCollector {
//   private session: Session;
//   private SHOPIFY_API_VERSION = '2024-04';

//   constructor(session: Session) {
//     this.session = session;
//   }

//   async collectDailyAnalytics(): Promise<EmailOrderData> {
//     try {
//       console.log(`🔄 Starting analytics collection for ${this.session.shop}`);
      
//       // Get shop timezone and currency first
//       const { shopTimezone, shopCurrency } = await this.getShopInfo();
//       console.log(`📍 Shop timezone: ${shopTimezone}, currency: ${shopCurrency}`);
      
//       // Use the same date ranges as main dashboard
//       const monthRanges = getMonthRanges(shopTimezone);
//       const startDate = monthRanges[0].start;
//       const endDate = monthRanges[monthRanges.length - 1].end;
      
//       const orders = await fetchOrdersForPeriod(
//         this.session.shop, 
//         this.session.accessToken!, 
//         startDate, 
//         endDate
//       );
      
//       console.log(`📦 Fetched ${orders.length} orders`);
      
//       if (orders.length === 0) {
//         console.log('❌ No orders found, returning empty data');
//         return this.getEmptyData(shopTimezone, shopCurrency);
//       }

//       const processedData = this.processOrdersData(orders, shopTimezone, shopCurrency);
//       console.log(`✅ Successfully processed analytics data`);
      
//       return processedData;
      
//     } catch (error: any) {
//       console.error('❌ Error in analytics collection:', error);
//       return this.getEmptyData('UTC', 'USD');
//     }
//   }

//   private async getShopInfo(): Promise<{ shopTimezone: string; shopCurrency: string }> {
//     try {
//       const url = `https://${this.session.shop}/admin/api/${this.SHOPIFY_API_VERSION}/shop.json`;
//       const response = await fetch(url, {
//         headers: {
//           'X-Shopify-Access-Token': this.session.accessToken!,
//           'Content-Type': 'application/json',
//         },
//       });

//       if (response.ok) {
//         const data = await response.json();
//         return {
//           shopTimezone: data.shop.iana_timezone || 'UTC',
//           shopCurrency: data.shop.currency || 'USD'
//         };
//       }
//     } catch (error) {
//       console.error('Error fetching shop info:', error);
//     }
//     return { shopTimezone: 'UTC', shopCurrency: 'USD' };
//   }

//   private getEmptyOrderStats(): OrderStats {
//     return {
//       total: 0,
//       items: 0,
//       fulfilled: 0,
//       unfulfilled: 0,
//       discounts: 0,
//       shipping: 0,
//       taxes: 0,
//       returns: 0,
//       orderCount: 0,
//       netSales: 0,
//       extraFees: 0,
//       totalSales: 0,
//       shippingRefunds: 0,
//       netReturns: 0,
//       totalRefund: 0,
//       hasSubsequentEvents: false,
//       eventSummary: null,
//       refundsCount: 0,
//       financialStatus: 'pending'
//     };
//   }

//   private getEmptyData(shopTimezone: string, shopCurrency: string): EmailOrderData {
//     const currentDateInShopTZ = this.getLocalDateKey(new Date(), shopTimezone);
    
//     return {
//       // Core metrics
//       totalOrders: 0,
//       totalCustomers: 0,
//       fulfillmentRate: 0,
//       totalRevenue: 0,
//       netRevenue: 0,
//       averageOrderValue: 0,
//       totalItems: 0,
//       todayOrders: 0,
//       todayRevenue: 0,
//       todayItems: 0,
//        last7DaysOrders: 0,
//   last7DaysRevenue: 0, 
//   last7DaysItems: 0,
//       ordersChangeVsYesterday: 0,
//       revenueChangeVsYesterday: 0,
//       itemsChangeVsYesterday: 0,
//       newCustomers: 0,
//       repeatCustomers: 0,
//       customerRetentionRate: 0,
//       averageOrderFrequency: 0,
//       shopTimezone,
//       shopCurrency,
//       totalRefunds: 0,
//       totalExchanges: 0,
//       totalPartialRefunds: 0,
//       totalEvents: 0,
//       ordersWithEvents: 0,
//       netEventValue: 0,

//       last7DaysTotalRevenue: 0,
//   last7DaysTotalDiscounts: 0,
//   last7DaysTotalReturns: 0,
//   last7DaysTotalExtraFees: 0,
//   last7DaysTotalNetSales: 0,
//   last7DaysTotalShipping: 0,
//   last7DaysTotalTaxes: 0,
//   last7DaysTotalTotalSales: 0,
//   dailyFinancials: [],


//   weeklyTotalOrders: 0,
// weeklyTotalRevenue: 0, 
// weeklyTotalItems: 0,



//   weeklyTotalDiscounts: 0,
//   weeklyTotalReturns: 0,
//   weeklyTotalExtraFees: 0,
//   weeklyTotalNetSales: 0,
//   weeklyTotalShipping: 0,
//   weeklyTotalTaxes: 0,
//   weeklyTotalTotalSales: 0,
//   weeklyFinancials: [],


  




//     monthlyFinancials: {
//       totalOrders: 0,
//       totalRevenue: 0,
//       totalItems: 0,
//       totalDiscounts: 0,
//       totalReturns: 0,
//       totalExtraFees: 0,
//       totalNetSales: 0,
//       totalShipping: 0,
//       totalTaxes: 0,
//       totalTotalSales: 0
//     },
//     monthRanges: [],
//     monthlyTotals: {},


    




//       // Extended email fields
//       fulfilledOrders: 0,
//       unfulfilledOrders: 0,
//       totalDiscounts: 0,
//       totalShipping: 0,
//       totalTaxes: 0,
//       totalReturns: 0,
//       returnFees: 0,
//       discountRate: 0,
//       shippingRate: 0,
//       taxRate: 0,
//       returnRate: 0,
//       averageItemsPerOrder: 0,
//       dailySales: [],
//       weeklySales: [],
//       monthlySales: [],
//       yesterdayRevenue: 0,
//       yesterdayOrders: 0,
//       yesterdayItems: 0,
//       lastWeekRevenue: 0,
//       lastWeekOrders: 0,
//       lastWeekItems: 0,
//       todayFulfilled: 0,
//       todayUnfulfilled: 0,
//       last7DaysFulfilled: 0,
//       last7DaysUnfulfilled: 0,
//       revenueChangeVsLastWeek: 0,
//       bestDay: { date: '', revenue: 0, orders: 0, items: 0 },
//       averageDailyRevenue: 0,
//       last7DaysTotalCustomers: 0,
//       last7DaysRepeatCustomers: 0,
//       last7DaysNewCustomers: 0,
//       last7DaysRepeatCustomerRate: 0,
//       customerTypeData: { new: 0, repeat: 0 },
//       fulfillmentStatusData: { fulfilled: 0, unfulfilled: 0 },
//       weeklyRevenueTrend: [],
//       monthlyComparison: [],
//       dailyPerformance: [],
//       ordersLoaded: 0,
//       currentDateInShopTZ
//     };
//   }

//   // Helper function to match main code behavior
//   private getLocalDateKey(utcDate: Date, timezone: string): string {
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

//   private getPreviousDate(currentDate: string, timezone: string): string {
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

















// // Add these helper methods to your AnalyticsCollector class

// private calculateMismatchSummary(data: any[], periodType: 'day' | 'week' | 'month'): { 
//   totalMismatches: number; 
//   totalDifference: number; 
//   hasMismatches: boolean; 
// } {
//   let totalMismatches = 0;
//   let totalDifference = 0;

//   console.log(`🔍 [MISMATCH DEBUG] Calculating ${periodType} mismatch summary for ${data.length} periods`);

//   data.forEach((periodData: any, index: number) => {
//     if (!periodData) {
//       console.log(`❌ [MISMATCH DEBUG] Period ${index} has no data`);
//       return;
//     }
    
//     const calculatedTotal = periodData.netSales + periodData.shipping + periodData.taxes + (periodData.extraFees || 0);
//     const actualTotal = periodData.totalSales;
//     const difference = Math.abs(actualTotal - calculatedTotal);
//     const mismatch = difference > 0.01;
    
//     console.log(`🔍 [MISMATCH DEBUG] ${periodType} ${index}:`);
//     console.log(`   Net Sales: ${periodData.netSales}`);
//     console.log(`   Shipping: ${periodData.shipping}`);
//     console.log(`   Taxes: ${periodData.taxes}`);
//     console.log(`   Extra Fees: ${periodData.extraFees || 0}`);
//     console.log(`   Calculated Total: ${calculatedTotal}`);
//     console.log(`   Actual Total: ${actualTotal}`);
//     console.log(`   Difference: ${difference}`);
//     console.log(`   Mismatch: ${mismatch}`);
    
//     if (mismatch) {
//       totalMismatches++;
//       totalDifference += (calculatedTotal - actualTotal);
//       console.log(`⚠️ [MISMATCH FOUND] ${periodType} ${index} has mismatch: ${difference}`);
//     }
//   });

//   const result = {
//     totalMismatches,
//     totalDifference: parseFloat(totalDifference.toFixed(2)),
//     hasMismatches: totalMismatches > 0
//   };

//   console.log(`📊 [MISMATCH RESULT] ${periodType}:`, result);
//   return result;
// }

// private getTodayMismatchSummary(data: any): { 
//   totalMismatches: number; 
//   totalDifference: number; 
//   hasMismatches: boolean; 
// } {
//   const todayData = data.dailyFinancials?.find((day: any) => day.date === data.currentDateInShopTZ);
  
//   console.log(`🔍 [TODAY MISMATCH DEBUG] Looking for today: ${data.currentDateInShopTZ}`);
//   console.log(`🔍 [TODAY MISMATCH DEBUG] Available dates:`, data.dailyFinancials?.map((d: any) => d.date));
  
//   if (!todayData) {
//     console.log(`❌ [TODAY MISMATCH DEBUG] No data found for today`);
//     return { totalMismatches: 0, totalDifference: 0, hasMismatches: false };
//   }

//   const calculatedTotal = todayData.netSales + todayData.shipping + todayData.taxes + (todayData.extraFees || 0);
//   const actualTotal = todayData.totalSales;
//   const difference = Math.abs(actualTotal - calculatedTotal);
//   const mismatch = difference > 0.01;
  
//   console.log(`🔍 [TODAY MISMATCH DEBUG] Today's data:`, todayData);
//   console.log(`🔍 [TODAY MISMATCH DEBUG] Calculated: ${calculatedTotal}, Actual: ${actualTotal}, Difference: ${difference}, Mismatch: ${mismatch}`);

//   const result = {
//     totalMismatches: mismatch ? 1 : 0,
//     totalDifference: mismatch ? parseFloat((calculatedTotal - actualTotal).toFixed(2)) : 0,
//     hasMismatches: mismatch
//   };

//   console.log(`📊 [TODAY MISMATCH RESULT]:`, result);
//   return result;
// }




  
// private processOrdersData(orders: any[], shopTimezone: string, shopCurrency: string): EmailOrderData {
//   console.log(`🔧 Processing ${orders.length} orders for analytics`);
  
//   const currentDateInShopTZ = this.getLocalDateKey(new Date(), shopTimezone);
//   const yesterdayInShopTZ = this.getPreviousDate(currentDateInShopTZ, shopTimezone);

//   // Initialize data structures - USING EXTRACTED HELPERS
//   const last7DaysKeys = getLastNDays(7, shopTimezone);
//   const last8WeeksKeys = getLast8Weeks(shopTimezone);
//   const monthRanges = getMonthRanges(shopTimezone);

//   // Get last week same day for comparison
//   const todayDate = new Date(currentDateInShopTZ + 'T00:00:00');
//   const lastWeekDate = new Date(todayDate);
//   lastWeekDate.setDate(todayDate.getDate() - 7);
//   const lastWeekSameDayInShopTZ = this.getLocalDateKey(lastWeekDate, shopTimezone);

//   const dailyStats: Record<string, OrderStats> = {};
//   const weeklyStats: Record<string, OrderStats> = {};
//   const monthlyStats: Record<string, OrderStats> = {};
//   const dailyCustomerStats: Record<string, CustomerData> = {};
//   const weeklyCustomerStats: Record<string, CustomerData> = {};
//   const monthlyCustomerStats: Record<string, CustomerData> = {};

//   // Initialize all periods with empty stats
//   last7DaysKeys.forEach(date => {
//     dailyStats[date] = this.getEmptyOrderStats();
//     dailyCustomerStats[date] = { newCustomers: 0, repeatedCustomers: 0, totalCustomers: 0 };
//   });

//   last8WeeksKeys.forEach(week => {
//     weeklyStats[week] = this.getEmptyOrderStats();
//     weeklyCustomerStats[week] = { newCustomers: 0, repeatedCustomers: 0, totalCustomers: 0 };
//   });

//   monthRanges.forEach(month => {
//     monthlyStats[month.key] = this.getEmptyOrderStats();
//     monthlyCustomerStats[month.key] = { newCustomers: 0, repeatedCustomers: 0, totalCustomers: 0 };
//   });

//   // Process customer data - USING EXTRACTED CUSTOMER ANALYTICS
//   const customerOrderMap = buildCustomerOrderMap(orders, shopTimezone);
//   const dailyCustomerAnalytics = analyzeCustomerBehavior(customerOrderMap, shopTimezone, last7DaysKeys, 'daily');
//   const weeklyCustomerAnalytics = analyzeCustomerBehavior(customerOrderMap, shopTimezone, last8WeeksKeys, 'weekly');
//   const monthlyCustomerAnalytics = analyzeCustomerBehavior(customerOrderMap, shopTimezone, monthRanges.map(r => r.key), 'monthly');
//   const totalCustomerData = calculateOverallCustomerData(customerOrderMap);

//   console.log(`👥 Customer analytics: ${totalCustomerData.totalCustomers} total customers`);

//   // Process each order - USING EXTRACTED FINANCIAL CALCULATOR
//   let processedOrders = 0;
//   orders.forEach((order: any) => {
//     try {
//       const date = new Date(order.created_at);
//       const monthKey = date.toLocaleString("default", { month: "short", year: "numeric", timeZone: shopTimezone });
//       const dayKey = this.getLocalDateKey(date, shopTimezone);
      
//       const monday = new Date(date);
//       monday.setDate(date.getDate() - ((date.getDay() + 6) % 7));
//       const weekKey = `Week of ${this.getLocalDateKey(monday, shopTimezone)}`;

//       const orderStats = processOrderToStats(order);

//       // Aggregate data - USING EXTRACTED MERGE FUNCTION
//       if (dailyStats[dayKey]) {
//         dailyStats[dayKey] = mergeStats(dailyStats[dayKey], orderStats);
//         dailyCustomerStats[dayKey] = dailyCustomerAnalytics[dayKey] || { newCustomers: 0, repeatedCustomers: 0, totalCustomers: 0 };
//       }

//       if (weeklyStats[weekKey]) {
//         weeklyStats[weekKey] = mergeStats(weeklyStats[weekKey], orderStats);
//         weeklyCustomerStats[weekKey] = weeklyCustomerAnalytics[weekKey] || { newCustomers: 0, repeatedCustomers: 0, totalCustomers: 0 };
//       }

//       if (monthlyStats[monthKey]) {
//         monthlyStats[monthKey] = mergeStats(monthlyStats[monthKey], orderStats);
//         monthlyCustomerStats[monthKey] = monthlyCustomerAnalytics[monthKey] || { newCustomers: 0, repeatedCustomers: 0, totalCustomers: 0 };
//       }
      
//       processedOrders++;
//     } catch (error) {
//       console.error('Error processing order:', error);
//     }
//   });

//   console.log(`✅ Processed ${processedOrders} orders for analytics`);

//   // Calculate today's and yesterday's data
//   const todayData = dailyStats[currentDateInShopTZ] || this.getEmptyOrderStats();
//   const yesterdayData = dailyStats[yesterdayInShopTZ] || this.getEmptyOrderStats();
//   const lastWeekData = dailyStats[lastWeekSameDayInShopTZ] || this.getEmptyOrderStats();

//   // ⬇️⬇️⬇️ EVENT SUMMARY CALCULATIONS - ADDED IN CORRECT LOCATION ⬇️⬇️⬇️
// // ⬇️⬇️⬇️ EVENT SUMMARY CALCULATIONS - ADDED IN CORRECT LOCATION ⬇️⬇️⬇️

// // Today's event summary - from todayData (handle null case)
// const todayEventSummary = todayData.eventSummary || {
//   refunds: { count: 0, value: 0 },
//   exchanges: { count: 0, value: 0 },
//   partialRefunds: { count: 0, value: 0 },
//   totalEvents: 0,
//   netValue: 0
// };

// // Last 7 days event summary - aggregate from dailyStats
// let last7DaysEventSummary = {
//   refunds: { count: 0, value: 0 },
//   exchanges: { count: 0, value: 0 },
//   partialRefunds: { count: 0, value: 0 },
//   totalEvents: 0,
//   netValue: 0
// };

// last7DaysKeys.forEach(date => {
//   const dayData = dailyStats[date];
//   if (dayData && dayData.eventSummary) {
//     const merged = mergeEventSummaries(last7DaysEventSummary, dayData.eventSummary);
//     if (merged) {
//       last7DaysEventSummary = merged;
//     }
//   }
// });

// // Last 8 weeks event summary - aggregate from weeklyStats
// let last8WeeksEventSummary = {
//   refunds: { count: 0, value: 0 },
//   exchanges: { count: 0, value: 0 },
//   partialRefunds: { count: 0, value: 0 },
//   totalEvents: 0,
//   netValue: 0
// };

// last8WeeksKeys.forEach(week => {
//   const weekData = weeklyStats[week];
//   if (weekData && weekData.eventSummary) {
//     const merged = mergeEventSummaries(last8WeeksEventSummary, weekData.eventSummary);
//     if (merged) {
//       last8WeeksEventSummary = merged;
//     }
//   }
// });


// // Calculate weekly totals - CORRECTED VERSION
// let weeklyTotalOrders = 0;
// let weeklyPerformanceRevenue = 0; // For Weekly Performance section
// let weeklyTotalItems = 0;

// // For Weekly Financial Breakdown - USE THE SAME LOGIC AS FINANCIAL CALCULATOR
// let weeklyTotalRevenue = 0;        // Gross Sales (use 'total' property)
// let weeklyTotalDiscounts = 0;
// let weeklyTotalReturns = 0;
// let weeklyTotalExtraFees = 0;
// let weeklyTotalNetSales = 0;
// let weeklyTotalShipping = 0;
// let weeklyTotalTaxes = 0;
// let weeklyTotalTotalSales = 0;    // Final Total

// last8WeeksKeys.forEach(week => {
//   const weekData = weeklyStats[week];
//   if (weekData) {
//     weeklyTotalOrders += weekData.orderCount;
//     weeklyPerformanceRevenue += weekData.totalSales; // For Weekly Performance
//     weeklyTotalItems += weekData.items;
    
//     // ✅ CORRECT: Use the same properties as your financial calculator
//     weeklyTotalRevenue += weekData.total;           // Gross Sales
//     weeklyTotalDiscounts += weekData.discounts;
//     weeklyTotalReturns += weekData.returns;
//     weeklyTotalExtraFees += weekData.extraFees || 0;
    
//     weeklyTotalNetSales += weekData.netSales;
//     weeklyTotalShipping += weekData.shipping;
//     weeklyTotalTaxes += weekData.taxes;
//     weeklyTotalTotalSales += weekData.totalSales;   // Final Total
//   }
// });

// // Verify the math makes sense - THIS SHOULD MATCH YOUR FINANCIAL CALCULATOR LOGIC
// console.log('🔍 WEEKLY FINANCIAL VERIFICATION:');
// console.log('Gross Sales (total):', weeklyTotalRevenue);
// console.log('Discounts:', weeklyTotalDiscounts);
// console.log('Returns:', weeklyTotalReturns);
// console.log('Extra Fees:', weeklyTotalExtraFees);
// console.log('Net Sales:', weeklyTotalNetSales);
// console.log('Total Sales (totalSales):', weeklyTotalTotalSales);

// // Check if the calculation matches: Gross - Discounts + Returns + Extra Fees ≈ Net Sales
// const calculatedNet = weeklyTotalRevenue - weeklyTotalDiscounts + weeklyTotalReturns + weeklyTotalExtraFees;
// console.log('Expected Net (Gross - Discounts + Returns + Extra Fees):', calculatedNet);
// console.log('Actual Net Sales from data:', weeklyTotalNetSales);
// console.log('Difference:', Math.abs(calculatedNet - weeklyTotalNetSales));




// // Create weekly financials array
// const weeklyFinancials = last8WeeksKeys.map(week => {
//   const weekData = weeklyStats[week] || this.getEmptyOrderStats();
//   return {
//     week,
//     total: weekData.total,
//     discounts: weekData.discounts,
//     returns: weekData.returns,
//     netSales: weekData.netSales,
//     shipping: weekData.shipping,
//     extraFees: weekData.extraFees || 0,
//     taxes: weekData.taxes,
//     totalSales: weekData.totalSales
//   };
// });








// // Last 6 months event summary - aggregate from monthlyStats
// let last6MonthsEventSummary = {
//   refunds: { count: 0, value: 0 },
//   exchanges: { count: 0, value: 0 },
//   partialRefunds: { count: 0, value: 0 },
//   totalEvents: 0,
//   netValue: 0
// };

// monthRanges.forEach(month => {
//   const monthData = monthlyStats[month.key];
//   if (monthData && monthData.eventSummary) {
//     const merged = mergeEventSummaries(last6MonthsEventSummary, monthData.eventSummary);
//     if (merged) {
//       last6MonthsEventSummary = merged;
//     }
//   }
// });

//   // Debug the event summaries
//   console.log('🔍 EVENT SUMMARIES FROM PROCESSED DATA:');
//   console.log('Today Events:', todayEventSummary.totalEvents, 'Refunds:', todayEventSummary.refunds.count);
//   console.log('Last 7 Days Events:', last7DaysEventSummary.totalEvents, 'Refunds:', last7DaysEventSummary.refunds.count);
//   console.log('Last 8 Weeks Events:', last8WeeksEventSummary.totalEvents, 'Refunds:', last8WeeksEventSummary.refunds.count);
//   console.log('Last 6 Months Events:', last6MonthsEventSummary.totalEvents, 'Refunds:', last6MonthsEventSummary.refunds.count);

//   // ⬆️⬆️⬆️ END EVENT SUMMARY CALCULATIONS ⬆️⬆️⬆️

//   // Calculate 7-day totals
//   let last7DaysStats = this.getEmptyOrderStats();
//   let last7DaysTotalCustomers = 0;
//   let last7DaysRepeatCustomers = 0;
//   let last7DaysNewCustomers = 0;

//   last7DaysKeys.forEach(date => {
//     const dayData = dailyStats[date];
//     const customerData = dailyCustomerStats[date];
    
//     if (dayData) {
//       last7DaysStats = mergeStats(last7DaysStats, dayData);
//     }
    
//     last7DaysTotalCustomers += customerData.totalCustomers;
//     last7DaysRepeatCustomers += customerData.repeatedCustomers;
//     last7DaysNewCustomers += customerData.newCustomers;
//   });

//   let last7DaysTotalRevenue = 0;
//   let last7DaysTotalDiscounts = 0;
//   let last7DaysTotalReturns = 0;
//   let last7DaysTotalExtraFees = 0;
//   let last7DaysTotalNetSales = 0;
//   let last7DaysTotalShipping = 0;
//   let last7DaysTotalTaxes = 0;
//   let last7DaysTotalTotalSales = 0;

//   last7DaysKeys.forEach(date => {
//     const dayData = dailyStats[date];
//     if (dayData) {
//       last7DaysTotalRevenue += dayData.total;
//       last7DaysTotalDiscounts += dayData.discounts;
//       last7DaysTotalReturns += dayData.returns;
//       last7DaysTotalExtraFees += dayData.extraFees || 0;
//       last7DaysTotalNetSales += dayData.netSales;
//       last7DaysTotalShipping += dayData.shipping;
//       last7DaysTotalTaxes += dayData.taxes;
//       last7DaysTotalTotalSales += dayData.totalSales;
//     }
//   });



  
//   // Daily financials array
// const dailyFinancials = last7DaysKeys.map(date => {
//   const dayData = dailyStats[date] || this.getEmptyOrderStats();
//   return {
//     date,
//     total: dayData.total,
//     discounts: dayData.discounts,
//     returns: dayData.returns,
//     netSales: dayData.netSales,
//     shipping: dayData.shipping,
//     extraFees: dayData.extraFees || 0,
//     taxes: dayData.taxes,
//     totalSales: dayData.totalSales
//   };
// });


// //   // Calculate weekly financial totals for last 8 weeks
// // let weeklyTotalOrders = 0;
// // let weeklyTotalRevenue = 0;
// // let weeklyTotalItems = 0;

// // last8WeeksKeys.forEach(week => {
// //   const weekData = weeklyStats[week];
// //   if (weekData) {
// //     weeklyTotalOrders += weekData.orderCount;
// //     weeklyTotalRevenue += weekData.totalSales;
// //     weeklyTotalItems += weekData.items;
// //   }
// // });

// //   // Create daily financials array
// //   const dailyFinancials = last7DaysKeys.map(date => {
// //     const dayData = dailyStats[date] || this.getEmptyOrderStats();
// //     return {
// //       date,
// //       total: dayData.total,
// //       discounts: dayData.discounts,
// //       returns: dayData.returns,
// //       netSales: dayData.netSales,
// //       shipping: dayData.shipping,
// //       extraFees: dayData.extraFees || 0,
// //       taxes: dayData.taxes,
// //       totalSales: dayData.totalSales
// //     };
// //   });








// // Add this after the weekly calculations in processOrdersData method
// // In processOrdersData method - COMPLETE MONTHLY CALCULATIONS

// // ==================== MONTHLY FINANCIAL CALCULATIONS ====================

// // Calculate monthly financial totals from monthlyStats
// let monthlyTotalOrders = 0;
// let monthlyTotalRevenue = 0;
// let monthlyTotalItems = 0;
// let monthlyTotalDiscounts = 0;
// let monthlyTotalReturns = 0;
// let monthlyTotalExtraFees = 0;
// let monthlyTotalNetSales = 0;
// let monthlyTotalShipping = 0;
// let monthlyTotalTaxes = 0;
// let monthlyTotalTotalSales = 0;

// // Calculate from monthlyStats (which has the processed financial data)
// monthRanges.forEach(month => {
//   const monthData = monthlyStats[month.key] || this.getEmptyOrderStats();
  
//   monthlyTotalOrders += monthData.orderCount;
//   monthlyTotalRevenue += monthData.total;           // Gross Sales
//   monthlyTotalItems += monthData.items;
//   monthlyTotalDiscounts += monthData.discounts;
//   monthlyTotalReturns += monthData.returns;
//   monthlyTotalExtraFees += monthData.extraFees || 0;
//   monthlyTotalNetSales += monthData.netSales;
//   monthlyTotalShipping += monthData.shipping;
//   monthlyTotalTaxes += monthData.taxes;
//   monthlyTotalTotalSales += monthData.totalSales;
// });

// // Create monthlyFinancials object with ALL calculated metrics
// const monthlyFinancials = {
//   totalOrders: monthlyTotalOrders,
//   totalRevenue: monthlyTotalRevenue,
//   totalItems: monthlyTotalItems,
//   totalDiscounts: monthlyTotalDiscounts,
//   totalReturns: monthlyTotalReturns,
//   totalExtraFees: monthlyTotalExtraFees,
//   totalNetSales: monthlyTotalNetSales,
//   totalShipping: monthlyTotalShipping,
//   totalTaxes: monthlyTotalTaxes,
//   totalTotalSales: monthlyTotalTotalSales
// };

// // Create monthlyTotals object for the details section
// const monthlyTotals: Record<string, any> = {};
// monthRanges.forEach(month => {
//   const monthData = monthlyStats[month.key] || this.getEmptyOrderStats();
//   monthlyTotals[month.key] = {
//     total: monthData.total,
//     discounts: monthData.discounts,
//     returns: monthData.returns,
//     netSales: monthData.netSales,
//     shipping: monthData.shipping,
//     taxes: monthData.taxes,
//     extraFees: monthData.extraFees || 0,
//     totalSales: monthData.totalSales,
//     orderCount: monthData.orderCount,
//     items: monthData.items
//   };
// });

// // Debug to verify calculations
// console.log('🔍 MONTHLY FINANCIAL CALCULATIONS:');
// console.log('Gross Sales (totalRevenue):', monthlyTotalRevenue);
// console.log('Discounts:', monthlyTotalDiscounts);
// console.log('Returns:', monthlyTotalReturns);
// console.log('Extra Fees:', monthlyTotalExtraFees);
// console.log('Net Sales:', monthlyTotalNetSales);
// console.log('Shipping:', monthlyTotalShipping);
// console.log('Taxes:', monthlyTotalTaxes);
// console.log('Total Sales:', monthlyTotalTotalSales);



//   // Calculate overall totals from monthly data
//   let overallStats = this.getEmptyOrderStats();
//   monthRanges.forEach(month => {
//     const monthData = monthlyStats[month.key] || this.getEmptyOrderStats();
//     overallStats = mergeStats(overallStats, monthData);
//   });

//   console.log(`📊 Overall totals: ${overallStats.orderCount} orders, ${this.formatCurrency(overallStats.totalSales, shopCurrency)} revenue`);

//   // Format data for response
//   const dailySales = last7DaysKeys.map(date => {
//     const dayData = dailyStats[date] || this.getEmptyOrderStats();
//     const customerData = dailyCustomerStats[date];
    
//     return {
//       date,
//       revenue: dayData.totalSales,
//       orders: dayData.orderCount,
//       items: dayData.items,
//       fulfilled: dayData.fulfilled
//     };
//   });

//   const weeklySales = last8WeeksKeys.map(week => {
//     const weekData = weeklyStats[week] || this.getEmptyOrderStats();
//     const customerData = weeklyCustomerStats[week];
    
//     return {
//       week,
//       revenue: weekData.totalSales,
//       orders: weekData.orderCount,
//       items: weekData.items
//     };
//   });

//   const monthlySales = monthRanges.map(month => {
//     const monthData = monthlyStats[month.key] || this.getEmptyOrderStats();
//     const customerData = monthlyCustomerStats[month.key];
    
//     return {
//       month: month.key,
//       revenue: monthData.totalSales,
//       orders: monthData.orderCount,
//       items: monthData.items
//     };
//   });

//   // Calculate percentage changes - SAME CALCULATIONS AS MAIN CODE
//   const revenueChangeVsYesterday = yesterdayData.totalSales > 0 
//     ? ((todayData.totalSales - yesterdayData.totalSales) / yesterdayData.totalSales) * 100 
//     : (todayData.totalSales > 0 ? 100 : 0);

//   const ordersChangeVsYesterday = yesterdayData.orderCount > 0 
//     ? ((todayData.orderCount - yesterdayData.orderCount) / yesterdayData.orderCount) * 100 
//     : (todayData.orderCount > 0 ? 100 : 0);

//   const itemsChangeVsYesterday = yesterdayData.items > 0 
//     ? ((todayData.items - yesterdayData.items) / yesterdayData.items) * 100 
//     : (todayData.items > 0 ? 100 : 0);

//   const revenueChangeVsLastWeek = lastWeekData.totalSales > 0 
//     ? ((todayData.totalSales - lastWeekData.totalSales) / lastWeekData.totalSales) * 100 
//     : (todayData.totalSales > 0 ? 100 : 0);

//   // Additional metrics
//   const bestDay = dailySales.reduce((best, current) => 
//     current.revenue > best.revenue ? current : best, 
//     { date: '', revenue: 0, orders: 0, items: 0, fulfilled: 0 }
//   );

//   const averageDailyRevenue = dailySales.length > 0 
//     ? dailySales.reduce((sum, day) => sum + day.revenue, 0) / dailySales.length 
//     : 0;

//   const fulfillmentRate = last7DaysStats.orderCount > 0 
//     ? (last7DaysStats.fulfilled / last7DaysStats.orderCount) * 100 
//     : 0;

//   const last7DaysRepeatCustomerRate = last7DaysTotalCustomers > 0 
//     ? (last7DaysRepeatCustomers / last7DaysTotalCustomers) * 100 
//     : 0;

//   // Financial rates
//   const discountRate = overallStats.total > 0 ? (overallStats.discounts / overallStats.total) * 100 : 0;
//   const shippingRate = overallStats.total > 0 ? (overallStats.shipping / overallStats.total) * 100 : 0;
//   const taxRate = overallStats.total > 0 ? (overallStats.taxes / overallStats.total) * 100 : 0;
//   const returnRate = overallStats.total > 0 ? (overallStats.returns / overallStats.total) * 100 : 0;

//   // Chart data - USING EXTRACTED FORMATTING
//   const weeklyRevenueTrend = weeklySales.map(week => ({
//     week: formatWeekDisplay(week.week),
//     revenue: week.revenue
//   }));

//   const monthlyComparison = monthlySales.map(month => ({
//     month: month.month.split(' ')[0],
//     revenue: month.revenue,
//     orders: month.orders
//   }));

//   const dailyPerformance = dailySales.map(day => {
//     const date = new Date(day.date);
//     const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
//     return {
//       day: dayNames[date.getDay()],
//       revenue: day.revenue,
//       orders: day.orders
//     };
//   });







// console.log('🔍 Starting mismatch calculations...');
  
//   // Today's mismatch
//   const todayMismatchSummary = this.getTodayMismatchSummary({
//     dailyFinancials: dailyFinancials,
//     currentDateInShopTZ: currentDateInShopTZ
//   });

//   // Last 7 days mismatch
//   const last7DaysMismatchSummary = this.calculateMismatchSummary(dailyFinancials, 'day');
  
//   // Weekly mismatch
//   const weeklyMismatchSummary = this.calculateMismatchSummary(weeklyFinancials, 'week');
  
//   // Monthly mismatch - FIX THIS PART
//   const monthlyData = monthRanges.map(month => {
//     const monthData = monthlyTotals[month.key];
//     if (monthData) {
//       return {
//         netSales: monthData.netSales || 0,
//         shipping: monthData.shipping || 0,
//         taxes: monthData.taxes || 0,
//         extraFees: monthData.extraFees || 0,
//         totalSales: monthData.totalSales || 0
//       };
//     }
//     return null;
//   }).filter(Boolean);
  
//   const monthlyMismatchSummary = this.calculateMismatchSummary(monthlyData, 'month');

//   console.log('📊 FINAL MISMATCH RESULTS:');
//   console.log('Today:', todayMismatchSummary);
//   console.log('Last 7 Days:', last7DaysMismatchSummary);
//   console.log('Weekly:', weeklyMismatchSummary);
//   console.log('Monthly:', monthlyMismatchSummary);






//   // Calculate additional metrics
//   const averageOrderValue = overallStats.orderCount > 0 ? overallStats.totalSales / overallStats.orderCount : 0;
//   const averageItemsPerOrder = overallStats.orderCount > 0 ? overallStats.items / overallStats.orderCount : 0;
//   const customerRetentionRate = totalCustomerData.totalCustomers > 0 ? 
//     (totalCustomerData.repeatedCustomers / totalCustomerData.totalCustomers) * 100 : 0;
//   const averageOrderFrequency = totalCustomerData.totalCustomers > 0 ? 
//     overallStats.orderCount / totalCustomerData.totalCustomers : 0;

//   // Calculate last 7 days totals from dailySales
//   const last7DaysOrders = (dailySales || []).reduce((sum, day) => sum + (day.orders || 0), 0);
//   const last7DaysRevenue = (dailySales || []).reduce((sum, day) => sum + (day.revenue || 0), 0);
//   const last7DaysItems = (dailySales || []).reduce((sum, day) => sum + (day.items || 0), 0);

//   console.log(`🎯 Final analytics prepared for email`);

//   // Return complete EmailOrderData with all required fields
//   return {
//     // Core metrics
//     totalOrders: overallStats.orderCount,
//     totalCustomers: totalCustomerData.totalCustomers,
//     fulfillmentRate,
//     totalRevenue: overallStats.total,
//     netRevenue: overallStats.netSales,
//     averageOrderValue,
//     totalItems: overallStats.items,
//     todayOrders: todayData.orderCount,
//     todayRevenue: todayData.totalSales,
//     todayItems: todayData.items,
    
//     // Event summaries
//     todayEventSummary: todayEventSummary,
//     last7DaysEventSummary: last7DaysEventSummary,
//     last8WeeksEventSummary: last8WeeksEventSummary,
//     last6MonthsEventSummary: last6MonthsEventSummary,
    
//     last7DaysOrders,
//     last7DaysRevenue, 
//     last7DaysItems,

   



// last7DaysTotalRevenue,
//   last7DaysTotalDiscounts,
//   last7DaysTotalReturns,
//   last7DaysTotalExtraFees,
//   last7DaysTotalNetSales,
//   last7DaysTotalShipping,
//   last7DaysTotalTaxes,
//   last7DaysTotalTotalSales,
  
  



//   weeklyTotalOrders: weeklyTotalOrders,
//   weeklyTotalRevenue: weeklyTotalRevenue, // Map your calculated value to the type property
//   weeklyTotalItems: weeklyTotalItems,
  
//   // Weekly Financial Breakdown - Use EXACT property names
//   weeklyTotalDiscounts: weeklyTotalDiscounts,
//   weeklyTotalReturns: weeklyTotalReturns,
//   weeklyTotalExtraFees: weeklyTotalExtraFees,
//   weeklyTotalNetSales: weeklyTotalNetSales,
//   weeklyTotalShipping: weeklyTotalShipping,
//   weeklyTotalTaxes: weeklyTotalTaxes,
//   weeklyTotalTotalSales: weeklyTotalTotalSales,
//   weeklyFinancials: weeklyFinancials,
  
//   // Daily Financial Data
//   dailyFinancials: dailyFinancials,
  
  

//   // ✅ CORRECT - Use the calculated values!
// monthlyFinancials: monthlyFinancials,
// monthRanges: monthRanges.map(m => m.key),
// monthlyTotals: monthlyTotals,





// todayMismatchSummary,
//     last7DaysMismatchSummary,
//     weeklyMismatchSummary,
//     monthlyMismatchSummary,


  

//     ordersChangeVsYesterday,
//     revenueChangeVsYesterday,
//     itemsChangeVsYesterday,
//     newCustomers: totalCustomerData.newCustomers,
//     repeatCustomers: totalCustomerData.repeatedCustomers,
//     customerRetentionRate,
//     averageOrderFrequency,
//     shopTimezone,
//     shopCurrency,
//     totalRefunds: overallStats.returns,
//     totalExchanges: 0,
//     totalPartialRefunds: 0,
//     totalEvents: 0,
//     ordersWithEvents: 0,
//     netEventValue: 0,

//     // Extended email fields
//     fulfilledOrders: overallStats.fulfilled,
//     unfulfilledOrders: overallStats.unfulfilled,
//     totalDiscounts: overallStats.discounts,
//     totalShipping: overallStats.shipping,
//     totalTaxes: overallStats.taxes,
//     totalReturns: overallStats.returns,
//     returnFees: overallStats.returnFees || 0,
//     discountRate,
//     shippingRate,
//     taxRate,
//     returnRate,
//     averageItemsPerOrder,
//     dailySales,
//     weeklySales,
//     monthlySales,
//     yesterdayRevenue: yesterdayData.totalSales,
//     yesterdayOrders: yesterdayData.orderCount,
//     yesterdayItems: yesterdayData.items,
//     lastWeekRevenue: lastWeekData.totalSales,
//     lastWeekOrders: lastWeekData.orderCount,
//     lastWeekItems: lastWeekData.items,
//     todayFulfilled: todayData.fulfilled,
//     todayUnfulfilled: todayData.unfulfilled,
//     last7DaysFulfilled: last7DaysStats.fulfilled,
//     last7DaysUnfulfilled: last7DaysStats.unfulfilled,
//     revenueChangeVsLastWeek,
//     bestDay: { date: bestDay.date, revenue: bestDay.revenue, orders: bestDay.orders, items: bestDay.items },
//     averageDailyRevenue,
//     last7DaysTotalCustomers,
//     last7DaysRepeatCustomers,
//     last7DaysNewCustomers,
//     last7DaysRepeatCustomerRate,
//     customerTypeData: { new: totalCustomerData.newCustomers, repeat: totalCustomerData.repeatedCustomers },
//     fulfillmentStatusData: { fulfilled: overallStats.fulfilled, unfulfilled: overallStats.unfulfilled },
//     weeklyRevenueTrend,
//     monthlyComparison,
//     dailyPerformance,
//     ordersLoaded: orders.length,
//     currentDateInShopTZ,
//   };

// }

//   private formatCurrency(amount: number, currency: string): string {
//     return amount.toLocaleString('en-US', { 
//       style: 'currency', 
//       currency: currency,
//       minimumFractionDigits: 2 
//     });
//   }
// }







































































// import { Session } from "@shopify/shopify-api";
// import type { OrderStats, CustomerData } from '../types/analytics';
// import type { EmailOrderData } from '../types/emailAnalytics';
// import { fetchOrdersForPeriod } from '../services/shopifyApi.server';
// import { processOrderToStats, mergeStats } from '../core/financialCalculator.server';
// import { buildCustomerOrderMap, analyzeCustomerBehavior, calculateOverallCustomerData } from '../core/customerAnalytics.server';
// import { getMonthRanges, getLastNDays, getLast8Weeks, formatWeekDisplay } from '../utils/analyticsHelpers';
// import { calculateOrderEventSummary, mergeEventSummaries } from '../core/eventDetection.server';

// export class AnalyticsCollector {
//   private session: Session;
//   private SHOPIFY_API_VERSION = '2024-04';
//   private shopCurrency: string = 'USD'; // ✅ Cache the currency
//   private shopTimezone: string = 'UTC'; // ✅ Cache the timezone

//   constructor(session: Session) {
//     this.session = session;
//   }

//   async collectDailyAnalytics(): Promise<EmailOrderData> {
//     try {
//       console.log(`🔄 Starting analytics collection for ${this.session.shop}`);
      
//       // ✅ STEP 1: Get shop timezone and currency FIRST
//       const { shopTimezone, shopCurrency } = await this.getShopInfo();
//       this.shopTimezone = shopTimezone;
//       this.shopCurrency = shopCurrency;
      
//       console.log(`📍 Shop timezone: ${this.shopTimezone}, currency: ${this.shopCurrency}`);
      
//       // Use the same date ranges as main dashboard
//       const monthRanges = getMonthRanges(this.shopTimezone);
//       const startDate = monthRanges[0].start;
//       const endDate = monthRanges[monthRanges.length - 1].end;
      
//       const orders = await fetchOrdersForPeriod(
//         this.session.shop, 
//         this.session.accessToken!, 
//         startDate, 
//         endDate
//       );
      
//       console.log(`📦 Fetched ${orders.length} orders`);
      
//       if (orders.length === 0) {
//         console.log('❌ No orders found, returning empty data');
//         return this.getEmptyData(this.shopTimezone, this.shopCurrency);
//       }

//       const processedData = this.processOrdersData(orders, this.shopTimezone, this.shopCurrency);
//       console.log(`✅ Successfully processed analytics data`);
      
//       return processedData;
      
//     } catch (error: any) {
//       console.error('❌ Error in analytics collection:', error);
//       return this.getEmptyData('UTC', 'USD');
//     }
//   }

//   private async getShopInfo(): Promise<{ shopTimezone: string; shopCurrency: string }> {
//     try {
//       const url = `https://${this.session.shop}/admin/api/${this.SHOPIFY_API_VERSION}/shop.json`;
//       const response = await fetch(url, {
//         headers: {
//           'X-Shopify-Access-Token': this.session.accessToken!,
//           'Content-Type': 'application/json',
//         },
//       });

//       if (response.ok) {
//         const data = await response.json();
//         console.log(`🏪 Shop API Response - Currency: ${data.shop.currency}, Timezone: ${data.shop.iana_timezone}`);
//         return {
//           shopTimezone: data.shop.iana_timezone || 'UTC',
//           shopCurrency: data.shop.currency || 'USD'
//         };
//       } else {
//         console.error(`❌ Shop API failed: ${response.status}`);
//       }
//     } catch (error) {
//       console.error('❌ Error fetching shop info:', error);
//     }
    
//     // Fallback values
//     return { shopTimezone: 'UTC', shopCurrency: 'USD' };
//   }

//   // ✅ REMOVED the duplicate formatCurrency method - you already have one at the bottom

//   // Your existing methods continue unchanged...
//   private getEmptyOrderStats(): OrderStats {
//     return {
//       total: 0,
//       items: 0,
//       fulfilled: 0,
//       unfulfilled: 0,
//       discounts: 0,
//       shipping: 0,
//       taxes: 0,
//       returns: 0,
//       orderCount: 0,
//       netSales: 0,
//       extraFees: 0,
//       totalSales: 0,
//       shippingRefunds: 0,
//       netReturns: 0,
//       totalRefund: 0,
//       hasSubsequentEvents: false,
//       eventSummary: null,
//       refundsCount: 0,
//       financialStatus: 'pending'
//     };
//   }

//   private getEmptyData(shopTimezone: string, shopCurrency: string): EmailOrderData {
//     const currentDateInShopTZ = this.getLocalDateKey(new Date(), shopTimezone);
    
//     return {
//       // Core metrics
//       totalOrders: 0,
//       totalCustomers: 0,
//       fulfillmentRate: 0,
//       totalRevenue: 0,
//       netRevenue: 0,
//       averageOrderValue: 0,
//       totalItems: 0,
//       todayOrders: 0,
//       todayRevenue: 0,
//       todayItems: 0,
//       last7DaysOrders: 0,
//       last7DaysRevenue: 0, 
//       last7DaysItems: 0,
//       ordersChangeVsYesterday: 0,
//       revenueChangeVsYesterday: 0,
//       itemsChangeVsYesterday: 0,
//       newCustomers: 0,
//       repeatCustomers: 0,
//       customerRetentionRate: 0,
//       averageOrderFrequency: 0,
//       shopTimezone, // ✅ Now properly set
//       shopCurrency, // ✅ Now properly set
//       totalRefunds: 0,
//       totalExchanges: 0,
//       totalPartialRefunds: 0,
//       totalEvents: 0,
//       ordersWithEvents: 0,
//       netEventValue: 0,

//       // ... rest of your existing empty data structure
//       last7DaysTotalRevenue: 0,
//       last7DaysTotalDiscounts: 0,
//       last7DaysTotalReturns: 0,
//       last7DaysTotalExtraFees: 0,
//       last7DaysTotalNetSales: 0,
//       last7DaysTotalShipping: 0,
//       last7DaysTotalTaxes: 0,
//       last7DaysTotalTotalSales: 0,
//       dailyFinancials: [],

//       weeklyTotalOrders: 0,
//       weeklyTotalRevenue: 0, 
//       weeklyTotalItems: 0,
//       weeklyTotalDiscounts: 0,
//       weeklyTotalReturns: 0,
//       weeklyTotalExtraFees: 0,
//       weeklyTotalNetSales: 0,
//       weeklyTotalShipping: 0,
//       weeklyTotalTaxes: 0,
//       weeklyTotalTotalSales: 0,
//       weeklyFinancials: [],

//       monthlyFinancials: {
//         totalOrders: 0,
//         totalRevenue: 0,
//         totalItems: 0,
//         totalDiscounts: 0,
//         totalReturns: 0,
//         totalExtraFees: 0,
//         totalNetSales: 0,
//         totalShipping: 0,
//         totalTaxes: 0,
//         totalTotalSales: 0
//       },
//       monthRanges: [],
//       monthlyTotals: {},

//       // In your return statement, add:
// daysLeftInWeek:0,

//       // Extended email fields
//       fulfilledOrders: 0,
//       unfulfilledOrders: 0,
//       totalDiscounts: 0,
//       totalShipping: 0,
//       totalTaxes: 0,
//       totalReturns: 0,
//       returnFees: 0,
//       discountRate: 0,
//       shippingRate: 0,
//       taxRate: 0,
//       returnRate: 0,
//       averageItemsPerOrder: 0,
//       dailySales: [],
//       weeklySales: [],
//       monthlySales: [],
//       yesterdayRevenue: 0,
//       yesterdayOrders: 0,
//       yesterdayItems: 0,
//       lastWeekRevenue: 0,
//       lastWeekOrders: 0,
//       lastWeekItems: 0,
//       todayFulfilled: 0,
//       todayUnfulfilled: 0,
//       last7DaysFulfilled: 0,
//       last7DaysUnfulfilled: 0,
//       revenueChangeVsLastWeek: 0,
//       bestDay: { date: '', revenue: 0, orders: 0, items: 0 },
//       averageDailyRevenue: 0,
//       last7DaysTotalCustomers: 0,
//       last7DaysRepeatCustomers: 0,
//       last7DaysNewCustomers: 0,
//       last7DaysRepeatCustomerRate: 0,
//       customerTypeData: { new: 0, repeat: 0 },
//       fulfillmentStatusData: { fulfilled: 0, unfulfilled: 0 },
//       weeklyRevenueTrend: [],
//       monthlyComparison: [],
//       dailyPerformance: [],
//       ordersLoaded: 0,
//       currentDateInShopTZ,

//       // Event summaries
//       todayEventSummary: {
//         refunds: { count: 0, value: 0 },
//         exchanges: { count: 0, value: 0 },
//         partialRefunds: { count: 0, value: 0 },
//         totalEvents: 0,
//         netValue: 0
//       },
//       last7DaysEventSummary: {
//         refunds: { count: 0, value: 0 },
//         exchanges: { count: 0, value: 0 },
//         partialRefunds: { count: 0, value: 0 },
//         totalEvents: 0,
//         netValue: 0
//       },
//       last8WeeksEventSummary: {
//         refunds: { count: 0, value: 0 },
//         exchanges: { count: 0, value: 0 },
//         partialRefunds: { count: 0, value: 0 },
//         totalEvents: 0,
//         netValue: 0
//       },
//       last6MonthsEventSummary: {
//         refunds: { count: 0, value: 0 },
//         exchanges: { count: 0, value: 0 },
//         partialRefunds: { count: 0, value: 0 },
//         totalEvents: 0,
//         netValue: 0
//       },

//       // Mismatch summaries
//       todayMismatchSummary: {
//         totalMismatches: 0,
//         totalDifference: 0,
//         hasMismatches: false
//       },
//       last7DaysMismatchSummary: {
//         totalMismatches: 0,
//         totalDifference: 0,
//         hasMismatches: false
//       },
//       weeklyMismatchSummary: {
//         totalMismatches: 0,
//         totalDifference: 0,
//         hasMismatches: false
//       },
//       monthlyMismatchSummary: {
//         totalMismatches: 0,
//         totalDifference: 0,
//         hasMismatches: false
//       }
//     };
//   }

//   // Your existing helper methods continue here...
//   private getLocalDateKey(utcDate: Date, timezone: string): string {
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

//   private getPreviousDate(currentDate: string, timezone: string): string {
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
  
// // Add these helper methods to your AnalyticsCollector class

// private calculateMismatchSummary(data: any[], periodType: 'day' | 'week' | 'month'): { 
//   totalMismatches: number; 
//   totalDifference: number; 
//   hasMismatches: boolean; 
// } {
//   let totalMismatches = 0;
//   let totalDifference = 0;

//   console.log(`🔍 [MISMATCH DEBUG] Calculating ${periodType} mismatch summary for ${data.length} periods`);

//   data.forEach((periodData: any, index: number) => {
//     if (!periodData) {
//       console.log(`❌ [MISMATCH DEBUG] Period ${index} has no data`);
//       return;
//     }
    
//     const calculatedTotal = periodData.netSales + periodData.shipping + periodData.taxes + (periodData.extraFees || 0);
//     const actualTotal = periodData.totalSales;
//     const difference = Math.abs(actualTotal - calculatedTotal);
//     const mismatch = difference > 0.01;
    
//     console.log(`🔍 [MISMATCH DEBUG] ${periodType} ${index}:`);
//     console.log(`   Net Sales: ${periodData.netSales}`);
//     console.log(`   Shipping: ${periodData.shipping}`);
//     console.log(`   Taxes: ${periodData.taxes}`);
//     console.log(`   Extra Fees: ${periodData.extraFees || 0}`);
//     console.log(`   Calculated Total: ${calculatedTotal}`);
//     console.log(`   Actual Total: ${actualTotal}`);
//     console.log(`   Difference: ${difference}`);
//     console.log(`   Mismatch: ${mismatch}`);
    
//     if (mismatch) {
//       totalMismatches++;
//       totalDifference += (calculatedTotal - actualTotal);
//       console.log(`⚠️ [MISMATCH FOUND] ${periodType} ${index} has mismatch: ${difference}`);
//     }
//   });

//   const result = {
//     totalMismatches,
//     totalDifference: parseFloat(totalDifference.toFixed(2)),
//     hasMismatches: totalMismatches > 0
//   };

//   console.log(`📊 [MISMATCH RESULT] ${periodType}:`, result);
//   return result;
// }

// private getTodayMismatchSummary(data: any): { 
//   totalMismatches: number; 
//   totalDifference: number; 
//   hasMismatches: boolean; 
// } {
//   const todayData = data.dailyFinancials?.find((day: any) => day.date === data.currentDateInShopTZ);
  
//   console.log(`🔍 [TODAY MISMATCH DEBUG] Looking for today: ${data.currentDateInShopTZ}`);
//   console.log(`🔍 [TODAY MISMATCH DEBUG] Available dates:`, data.dailyFinancials?.map((d: any) => d.date));
  
//   if (!todayData) {
//     console.log(`❌ [TODAY MISMATCH DEBUG] No data found for today`);
//     return { totalMismatches: 0, totalDifference: 0, hasMismatches: false };
//   }

//   const calculatedTotal = todayData.netSales + todayData.shipping + todayData.taxes + (todayData.extraFees || 0);
//   const actualTotal = todayData.totalSales;
//   const difference = Math.abs(actualTotal - calculatedTotal);
//   const mismatch = difference > 0.01;
  
//   console.log(`🔍 [TODAY MISMATCH DEBUG] Today's data:`, todayData);
//   console.log(`🔍 [TODAY MISMATCH DEBUG] Calculated: ${calculatedTotal}, Actual: ${actualTotal}, Difference: ${difference}, Mismatch: ${mismatch}`);

//   const result = {
//     totalMismatches: mismatch ? 1 : 0,
//     totalDifference: mismatch ? parseFloat((calculatedTotal - actualTotal).toFixed(2)) : 0,
//     hasMismatches: mismatch
//   };

//   console.log(`📊 [TODAY MISMATCH RESULT]:`, result);
//   return result;
// }




  
// private processOrdersData(orders: any[], shopTimezone: string, shopCurrency: string): EmailOrderData {
//   console.log(`🔧 Processing ${orders.length} orders for analytics`);
  
//   const currentDateInShopTZ = this.getLocalDateKey(new Date(), shopTimezone);
//   const yesterdayInShopTZ = this.getPreviousDate(currentDateInShopTZ, shopTimezone);

//   // Initialize data structures - USING EXTRACTED HELPERS
//   const last7DaysKeys = getLastNDays(7, shopTimezone);
//   const last8WeeksKeys = getLast8Weeks(shopTimezone);
//   const monthRanges = getMonthRanges(shopTimezone);

//   // Get last week same day for comparison
//   const todayDate = new Date(currentDateInShopTZ + 'T00:00:00');
//   const lastWeekDate = new Date(todayDate);
//   lastWeekDate.setDate(todayDate.getDate() - 7);
//   const lastWeekSameDayInShopTZ = this.getLocalDateKey(lastWeekDate, shopTimezone);


//    console.log(`📅 Date Debug:`);
//   console.log(`   Today: ${currentDateInShopTZ}`);
//   console.log(`   Last Week Same Day: ${lastWeekSameDayInShopTZ}`);
//   console.log(`   Yesterday: ${yesterdayInShopTZ}`);

//   const dailyStats: Record<string, OrderStats> = {};
//   const weeklyStats: Record<string, OrderStats> = {};
//   const monthlyStats: Record<string, OrderStats> = {};
//   const dailyCustomerStats: Record<string, CustomerData> = {};
//   const weeklyCustomerStats: Record<string, CustomerData> = {};
//   const monthlyCustomerStats: Record<string, CustomerData> = {};

//   // Initialize all periods with empty stats
//   last7DaysKeys.forEach(date => {
//     dailyStats[date] = this.getEmptyOrderStats();
//     dailyCustomerStats[date] = { newCustomers: 0, repeatedCustomers: 0, totalCustomers: 0 };
//   });

//   last8WeeksKeys.forEach(week => {
//     weeklyStats[week] = this.getEmptyOrderStats();
//     weeklyCustomerStats[week] = { newCustomers: 0, repeatedCustomers: 0, totalCustomers: 0 };
//   });

//   monthRanges.forEach(month => {
//     monthlyStats[month.key] = this.getEmptyOrderStats();
//     monthlyCustomerStats[month.key] = { newCustomers: 0, repeatedCustomers: 0, totalCustomers: 0 };
//   });

//   // Process customer data - USING EXTRACTED CUSTOMER ANALYTICS
//   const customerOrderMap = buildCustomerOrderMap(orders, shopTimezone);
//   const dailyCustomerAnalytics = analyzeCustomerBehavior(customerOrderMap, shopTimezone, last7DaysKeys, 'daily');
//   const weeklyCustomerAnalytics = analyzeCustomerBehavior(customerOrderMap, shopTimezone, last8WeeksKeys, 'weekly');
//   const monthlyCustomerAnalytics = analyzeCustomerBehavior(customerOrderMap, shopTimezone, monthRanges.map(r => r.key), 'monthly');
//   const totalCustomerData = calculateOverallCustomerData(customerOrderMap);

//   console.log(`👥 Customer analytics: ${totalCustomerData.totalCustomers} total customers`);

//   // Process each order - USING EXTRACTED FINANCIAL CALCULATOR
//   let processedOrders = 0;
//   orders.forEach((order: any) => {
//     try {
//       const date = new Date(order.created_at);
//       const monthKey = date.toLocaleString("default", { month: "short", year: "numeric", timeZone: shopTimezone });
//       const dayKey = this.getLocalDateKey(date, shopTimezone);
      
//       const monday = new Date(date);
//       monday.setDate(date.getDate() - ((date.getDay() + 6) % 7));
//       const weekKey = `Week of ${this.getLocalDateKey(monday, shopTimezone)}`;

//       const orderStats = processOrderToStats(order);

//       // Aggregate data - USING EXTRACTED MERGE FUNCTION
//       if (dailyStats[dayKey]) {
//         dailyStats[dayKey] = mergeStats(dailyStats[dayKey], orderStats);
//         dailyCustomerStats[dayKey] = dailyCustomerAnalytics[dayKey] || { newCustomers: 0, repeatedCustomers: 0, totalCustomers: 0 };
//       }

//       if (weeklyStats[weekKey]) {
//         weeklyStats[weekKey] = mergeStats(weeklyStats[weekKey], orderStats);
//         weeklyCustomerStats[weekKey] = weeklyCustomerAnalytics[weekKey] || { newCustomers: 0, repeatedCustomers: 0, totalCustomers: 0 };
//       }

//       if (monthlyStats[monthKey]) {
//         monthlyStats[monthKey] = mergeStats(monthlyStats[monthKey], orderStats);
//         monthlyCustomerStats[monthKey] = monthlyCustomerAnalytics[monthKey] || { newCustomers: 0, repeatedCustomers: 0, totalCustomers: 0 };
//       }
      
//       processedOrders++;
//     } catch (error) {
//       console.error('Error processing order:', error);
//     }
//   });

//   console.log(`✅ Processed ${processedOrders} orders for analytics`);

//   // Calculate today's and yesterday's data
//   const todayData = dailyStats[currentDateInShopTZ] || this.getEmptyOrderStats();
//   const yesterdayData = dailyStats[yesterdayInShopTZ] || this.getEmptyOrderStats();
//   const lastWeekData = dailyStats[lastWeekSameDayInShopTZ] || this.getEmptyOrderStats();


//   console.log(`📊 Data Availability:`);
//   console.log(`   Today Data:`, todayData);
//   console.log(`   Last Week Data:`, lastWeekData);
//   console.log(`   Today Revenue: ${todayData.totalSales}`);
//   console.log(`   Last Week Revenue: ${lastWeekData.totalSales}`);

  


//   // ⬇️⬇️⬇️ EVENT SUMMARY CALCULATIONS - ADDED IN CORRECT LOCATION ⬇️⬇️⬇️
// // ⬇️⬇️⬇️ EVENT SUMMARY CALCULATIONS - ADDED IN CORRECT LOCATION ⬇️⬇️⬇️

// // Today's event summary - from todayData (handle null case)
// const todayEventSummary = todayData.eventSummary || {
//   refunds: { count: 0, value: 0 },
//   exchanges: { count: 0, value: 0 },
//   partialRefunds: { count: 0, value: 0 },
//   totalEvents: 0,
//   netValue: 0
// };

// // Last 7 days event summary - aggregate from dailyStats
// let last7DaysEventSummary = {
//   refunds: { count: 0, value: 0 },
//   exchanges: { count: 0, value: 0 },
//   partialRefunds: { count: 0, value: 0 },
//   totalEvents: 0,
//   netValue: 0
// };

// last7DaysKeys.forEach(date => {
//   const dayData = dailyStats[date];
//   if (dayData && dayData.eventSummary) {
//     const merged = mergeEventSummaries(last7DaysEventSummary, dayData.eventSummary);
//     if (merged) {
//       last7DaysEventSummary = merged;
//     }
//   }
// });

// // Last 8 weeks event summary - aggregate from weeklyStats
// let last8WeeksEventSummary = {
//   refunds: { count: 0, value: 0 },
//   exchanges: { count: 0, value: 0 },
//   partialRefunds: { count: 0, value: 0 },
//   totalEvents: 0,
//   netValue: 0
// };

// last8WeeksKeys.forEach(week => {
//   const weekData = weeklyStats[week];
//   if (weekData && weekData.eventSummary) {
//     const merged = mergeEventSummaries(last8WeeksEventSummary, weekData.eventSummary);
//     if (merged) {
//       last8WeeksEventSummary = merged;
//     }
//   }
// });


// // Calculate weekly totals - CORRECTED VERSION
// let weeklyTotalOrders = 0;
// let weeklyPerformanceRevenue = 0; // For Weekly Performance section
// let weeklyTotalItems = 0;

// // For Weekly Financial Breakdown - USE THE SAME LOGIC AS FINANCIAL CALCULATOR
// let weeklyTotalRevenue = 0;        // Gross Sales (use 'total' property)
// let weeklyTotalDiscounts = 0;
// let weeklyTotalReturns = 0;
// let weeklyTotalExtraFees = 0;
// let weeklyTotalNetSales = 0;
// let weeklyTotalShipping = 0;
// let weeklyTotalTaxes = 0;
// let weeklyTotalTotalSales = 0;    // Final Total

// last8WeeksKeys.forEach(week => {
//   const weekData = weeklyStats[week];
//   if (weekData) {
//     weeklyTotalOrders += weekData.orderCount;
//     weeklyPerformanceRevenue += weekData.totalSales; // For Weekly Performance
//     weeklyTotalItems += weekData.items;
    
//     // ✅ CORRECT: Use the same properties as your financial calculator
//     weeklyTotalRevenue += weekData.total;           // Gross Sales
//     weeklyTotalDiscounts += weekData.discounts;
//     weeklyTotalReturns += weekData.returns;
//     weeklyTotalExtraFees += weekData.extraFees || 0;
    
//     weeklyTotalNetSales += weekData.netSales;
//     weeklyTotalShipping += weekData.shipping;
//     weeklyTotalTaxes += weekData.taxes;
//     weeklyTotalTotalSales += weekData.totalSales;   // Final Total
//   }
// });

// // Verify the math makes sense - THIS SHOULD MATCH YOUR FINANCIAL CALCULATOR LOGIC
// console.log('🔍 WEEKLY FINANCIAL VERIFICATION:');
// console.log('Gross Sales (total):', weeklyTotalRevenue);
// console.log('Discounts:', weeklyTotalDiscounts);
// console.log('Returns:', weeklyTotalReturns);
// console.log('Extra Fees:', weeklyTotalExtraFees);
// console.log('Net Sales:', weeklyTotalNetSales);
// console.log('Total Sales (totalSales):', weeklyTotalTotalSales);

// // Check if the calculation matches: Gross - Discounts + Returns + Extra Fees ≈ Net Sales
// const calculatedNet = weeklyTotalRevenue - weeklyTotalDiscounts + weeklyTotalReturns + weeklyTotalExtraFees;
// console.log('Expected Net (Gross - Discounts + Returns + Extra Fees):', calculatedNet);
// console.log('Actual Net Sales from data:', weeklyTotalNetSales);
// console.log('Difference:', Math.abs(calculatedNet - weeklyTotalNetSales));




// // Create weekly financials array
// const weeklyFinancials = last8WeeksKeys.map(week => {
//   const weekData = weeklyStats[week] || this.getEmptyOrderStats();
//   return {
//     week,
//     total: weekData.total,
//     discounts: weekData.discounts,
//     returns: weekData.returns,
//     netSales: weekData.netSales,
//     shipping: weekData.shipping,
//     extraFees: weekData.extraFees || 0,
//     taxes: weekData.taxes,
//     totalSales: weekData.totalSales
//   };
// });








// // Last 6 months event summary - aggregate from monthlyStats
// let last6MonthsEventSummary = {
//   refunds: { count: 0, value: 0 },
//   exchanges: { count: 0, value: 0 },
//   partialRefunds: { count: 0, value: 0 },
//   totalEvents: 0,
//   netValue: 0
// };

// monthRanges.forEach(month => {
//   const monthData = monthlyStats[month.key];
//   if (monthData && monthData.eventSummary) {
//     const merged = mergeEventSummaries(last6MonthsEventSummary, monthData.eventSummary);
//     if (merged) {
//       last6MonthsEventSummary = merged;
//     }
//   }
// });

//   // Debug the event summaries
//   console.log('🔍 EVENT SUMMARIES FROM PROCESSED DATA:');
//   console.log('Today Events:', todayEventSummary.totalEvents, 'Refunds:', todayEventSummary.refunds.count);
//   console.log('Last 7 Days Events:', last7DaysEventSummary.totalEvents, 'Refunds:', last7DaysEventSummary.refunds.count);
//   console.log('Last 8 Weeks Events:', last8WeeksEventSummary.totalEvents, 'Refunds:', last8WeeksEventSummary.refunds.count);
//   console.log('Last 6 Months Events:', last6MonthsEventSummary.totalEvents, 'Refunds:', last6MonthsEventSummary.refunds.count);

//   // ⬆️⬆️⬆️ END EVENT SUMMARY CALCULATIONS ⬆️⬆️⬆️

//   // Calculate 7-day totals
//   let last7DaysStats = this.getEmptyOrderStats();
//   let last7DaysTotalCustomers = 0;
//   let last7DaysRepeatCustomers = 0;
//   let last7DaysNewCustomers = 0;

//   last7DaysKeys.forEach(date => {
//     const dayData = dailyStats[date];
//     const customerData = dailyCustomerStats[date];
    
//     if (dayData) {
//       last7DaysStats = mergeStats(last7DaysStats, dayData);
//     }
    
//     last7DaysTotalCustomers += customerData.totalCustomers;
//     last7DaysRepeatCustomers += customerData.repeatedCustomers;
//     last7DaysNewCustomers += customerData.newCustomers;
//   });

//   let last7DaysTotalRevenue = 0;
//   let last7DaysTotalDiscounts = 0;
//   let last7DaysTotalReturns = 0;
//   let last7DaysTotalExtraFees = 0;
//   let last7DaysTotalNetSales = 0;
//   let last7DaysTotalShipping = 0;
//   let last7DaysTotalTaxes = 0;
//   let last7DaysTotalTotalSales = 0;

//   last7DaysKeys.forEach(date => {
//     const dayData = dailyStats[date];
//     if (dayData) {
//       last7DaysTotalRevenue += dayData.total;
//       last7DaysTotalDiscounts += dayData.discounts;
//       last7DaysTotalReturns += dayData.returns;
//       last7DaysTotalExtraFees += dayData.extraFees || 0;
//       last7DaysTotalNetSales += dayData.netSales;
//       last7DaysTotalShipping += dayData.shipping;
//       last7DaysTotalTaxes += dayData.taxes;
//       last7DaysTotalTotalSales += dayData.totalSales;
//     }
//   });



  
//   // Daily financials array
// const dailyFinancials = last7DaysKeys.map(date => {
//   const dayData = dailyStats[date] || this.getEmptyOrderStats();
//   return {
//     date,
//     total: dayData.total,
//     discounts: dayData.discounts,
//     returns: dayData.returns,
//     netSales: dayData.netSales,
//     shipping: dayData.shipping,
//     extraFees: dayData.extraFees || 0,
//     taxes: dayData.taxes,
//     totalSales: dayData.totalSales
//   };
// });


// //   // Calculate weekly financial totals for last 8 weeks
// // let weeklyTotalOrders = 0;
// // let weeklyTotalRevenue = 0;
// // let weeklyTotalItems = 0;

// // last8WeeksKeys.forEach(week => {
// //   const weekData = weeklyStats[week];
// //   if (weekData) {
// //     weeklyTotalOrders += weekData.orderCount;
// //     weeklyTotalRevenue += weekData.totalSales;
// //     weeklyTotalItems += weekData.items;
// //   }
// // });

// //   // Create daily financials array
// //   const dailyFinancials = last7DaysKeys.map(date => {
// //     const dayData = dailyStats[date] || this.getEmptyOrderStats();
// //     return {
// //       date,
// //       total: dayData.total,
// //       discounts: dayData.discounts,
// //       returns: dayData.returns,
// //       netSales: dayData.netSales,
// //       shipping: dayData.shipping,
// //       extraFees: dayData.extraFees || 0,
// //       taxes: dayData.taxes,
// //       totalSales: dayData.totalSales
// //     };
// //   });








// // Add this after the weekly calculations in processOrdersData method
// // In processOrdersData method - COMPLETE MONTHLY CALCULATIONS

// // ==================== MONTHLY FINANCIAL CALCULATIONS ====================

// // Calculate monthly financial totals from monthlyStats
// let monthlyTotalOrders = 0;
// let monthlyTotalRevenue = 0;
// let monthlyTotalItems = 0;
// let monthlyTotalDiscounts = 0;
// let monthlyTotalReturns = 0;
// let monthlyTotalExtraFees = 0;
// let monthlyTotalNetSales = 0;
// let monthlyTotalShipping = 0;
// let monthlyTotalTaxes = 0;
// let monthlyTotalTotalSales = 0;

// // Calculate from monthlyStats (which has the processed financial data)
// monthRanges.forEach(month => {
//   const monthData = monthlyStats[month.key] || this.getEmptyOrderStats();
  
//   monthlyTotalOrders += monthData.orderCount;
//   monthlyTotalRevenue += monthData.total;           // Gross Sales
//   monthlyTotalItems += monthData.items;
//   monthlyTotalDiscounts += monthData.discounts;
//   monthlyTotalReturns += monthData.returns;
//   monthlyTotalExtraFees += monthData.extraFees || 0;
//   monthlyTotalNetSales += monthData.netSales;
//   monthlyTotalShipping += monthData.shipping;
//   monthlyTotalTaxes += monthData.taxes;
//   monthlyTotalTotalSales += monthData.totalSales;
// });

// // Create monthlyFinancials object with ALL calculated metrics
// const monthlyFinancials = {
//   totalOrders: monthlyTotalOrders,
//   totalRevenue: monthlyTotalRevenue,
//   totalItems: monthlyTotalItems,
//   totalDiscounts: monthlyTotalDiscounts,
//   totalReturns: monthlyTotalReturns,
//   totalExtraFees: monthlyTotalExtraFees,
//   totalNetSales: monthlyTotalNetSales,
//   totalShipping: monthlyTotalShipping,
//   totalTaxes: monthlyTotalTaxes,
//   totalTotalSales: monthlyTotalTotalSales
// };

// // Create monthlyTotals object for the details section
// const monthlyTotals: Record<string, any> = {};
// monthRanges.forEach(month => {
//   const monthData = monthlyStats[month.key] || this.getEmptyOrderStats();
//   monthlyTotals[month.key] = {
//     total: monthData.total,
//     discounts: monthData.discounts,
//     returns: monthData.returns,
//     netSales: monthData.netSales,
//     shipping: monthData.shipping,
//     taxes: monthData.taxes,
//     extraFees: monthData.extraFees || 0,
//     totalSales: monthData.totalSales,
//     orderCount: monthData.orderCount,
//     items: monthData.items
//   };
// });

// // Debug to verify calculations
// console.log('🔍 MONTHLY FINANCIAL CALCULATIONS:');
// console.log('Gross Sales (totalRevenue):', monthlyTotalRevenue);
// console.log('Discounts:', monthlyTotalDiscounts);
// console.log('Returns:', monthlyTotalReturns);
// console.log('Extra Fees:', monthlyTotalExtraFees);
// console.log('Net Sales:', monthlyTotalNetSales);
// console.log('Shipping:', monthlyTotalShipping);
// console.log('Taxes:', monthlyTotalTaxes);
// console.log('Total Sales:', monthlyTotalTotalSales);



//   // Calculate overall totals from monthly data
//   let overallStats = this.getEmptyOrderStats();
//   monthRanges.forEach(month => {
//     const monthData = monthlyStats[month.key] || this.getEmptyOrderStats();
//     overallStats = mergeStats(overallStats, monthData);
//   });

//   console.log(`📊 Overall totals: ${overallStats.orderCount} orders, ${this.formatCurrency(overallStats.totalSales, shopCurrency)} revenue`);

//   // Format data for response
//   const dailySales = last7DaysKeys.map(date => {
//     const dayData = dailyStats[date] || this.getEmptyOrderStats();
//     const customerData = dailyCustomerStats[date];
    
//     return {
//       date,
//       revenue: dayData.totalSales,
//       orders: dayData.orderCount,
//       items: dayData.items,
//       fulfilled: dayData.fulfilled
//     };
//   });

//   const weeklySales = last8WeeksKeys.map(week => {
//     const weekData = weeklyStats[week] || this.getEmptyOrderStats();
//     const customerData = weeklyCustomerStats[week];
    
//     return {
//       week,
//       revenue: weekData.totalSales,
//       orders: weekData.orderCount,
//       items: weekData.items
//     };
//   });

//   const monthlySales = monthRanges.map(month => {
//     const monthData = monthlyStats[month.key] || this.getEmptyOrderStats();
//     const customerData = monthlyCustomerStats[month.key];
    
//     return {
//       month: month.key,
//       revenue: monthData.totalSales,
//       orders: monthData.orderCount,
//       items: monthData.items
//     };
//   });

//   // Calculate percentage changes - SAME CALCULATIONS AS MAIN CODE
//   const revenueChangeVsYesterday = yesterdayData.totalSales > 0 
//     ? ((todayData.totalSales - yesterdayData.totalSales) / yesterdayData.totalSales) * 100 
//     : (todayData.totalSales > 0 ? 100 : 0);

//   const ordersChangeVsYesterday = yesterdayData.orderCount > 0 
//     ? ((todayData.orderCount - yesterdayData.orderCount) / yesterdayData.orderCount) * 100 
//     : (todayData.orderCount > 0 ? 100 : 0);

//   const itemsChangeVsYesterday = yesterdayData.items > 0 
//     ? ((todayData.items - yesterdayData.items) / yesterdayData.items) * 100 
//     : (todayData.items > 0 ? 100 : 0);

//   // const revenueChangeVsLastWeek = lastWeekData.totalSales > 0 
//   //   ? ((todayData.totalSales - lastWeekData.totalSales) / lastWeekData.totalSales) * 100 
//   //   : (todayData.totalSales > 0 ? 100 : 0);

//  const getWeekOverWeekChange = () => {
//   try {
//     console.log('🔄 DEBUG: Starting Week-over-Week Calculation');
    
//     // Get the weekly data keys and REVERSE them to get most recent first
//     const weeklyKeys = getLast8Weeks(shopTimezone).reverse(); // 🆕 ADD .reverse() here
//     console.log('📅 DEBUG: Weekly keys (REVERSED - most recent first):', weeklyKeys);
    
//     // Debug: Show ALL weekly data available
//     console.log('🔍 DEBUG: All Weekly Stats Data:');
//     weeklyKeys.forEach((weekKey, index) => {
//       const weekData = weeklyStats[weekKey];
//       if (weekData) {
//         console.log(`   ✅ Week ${index + 1} (${weekKey}):`, {
//           revenue: weekData.totalSales,
//           orders: weekData.orderCount,
//           items: weekData.items,
//           total: weekData.total,
//           netSales: weekData.netSales
//         });
//       } else {
//         console.log(`   ❌ Week ${index + 1} (${weekKey}): NO DATA`);
//       }
//     });
    
//     if (weeklyKeys.length < 2) {
//       console.log('❌ DEBUG: Not enough weekly data available');
//       return 0;
//     }
    
//     // Current week (most recent week) - NOW CORRECT!
//     const currentWeekKey = weeklyKeys[0]; // First item after reverse = most recent
//     const currentWeekData = weeklyStats[currentWeekKey];
//     const currentWeekRevenue = currentWeekData?.totalSales || 0;
    
//     // Previous week (week before current week) - NOW CORRECT!
//     const previousWeekKey = weeklyKeys[1]; // Second item after reverse = previous week
//     const previousWeekData = weeklyStats[previousWeekKey];
//     const previousWeekRevenue = previousWeekData?.totalSales || 0;
    
//     console.log('🎯 DEBUG: Calculation Details (CORRECTED):');
//     console.log(`   Current Week Key: "${currentWeekKey}"`);
//     console.log(`   Current Week Revenue: ${currentWeekRevenue}`);
//     console.log(`   Previous Week Key: "${previousWeekKey}"`);
//     console.log(`   Previous Week Revenue: ${previousWeekRevenue}`);
    
//     // Calculate percentage change
//     if (previousWeekRevenue > 0 && currentWeekRevenue > 0) {
//       const change = ((currentWeekRevenue - previousWeekRevenue) / previousWeekRevenue) * 100;
//       console.log(`   ✅ Change Calculation: ((${currentWeekRevenue} - ${previousWeekRevenue}) / ${previousWeekRevenue}) * 100 = ${change.toFixed(1)}%`);
//       return change;
//     } else if (currentWeekRevenue > 0 && previousWeekRevenue === 0) {
//       console.log(`   ℹ️ Change: 100% (current week has revenue, previous week has none)`);
//       return 100;
//     } else if (currentWeekRevenue === 0 && previousWeekRevenue > 0) {
//       const change = -100;
//       console.log(`   ℹ️ Change: ${change}% (current week has no revenue, previous week had revenue)`);
//       return change;
//     } else {
//       console.log(`   ℹ️ Change: 0% (both weeks have no revenue or both have zero revenue)`);
//       return 0;
//     }
//   } catch (error) {
//     console.error('❌ Error calculating week-over-week change:', error);
//     return 0;
//   }
// };

// const revenueChangeVsLastWeek = getWeekOverWeekChange();


// console.log(`📈 Week-over-Week Calculation:`);
//   console.log(`   Formula: ((${todayData.totalSales} - ${lastWeekData.totalSales}) / ${lastWeekData.totalSales}) * 100`);
//   console.log(`   Result: ${revenueChangeVsLastWeek}%`);


//   // Additional metrics
//   const bestDay = dailySales.reduce((best, current) => 
//     current.revenue > best.revenue ? current : best, 
//     { date: '', revenue: 0, orders: 0, items: 0, fulfilled: 0 }
//   );

//   const averageDailyRevenue = dailySales.length > 0 
//     ? dailySales.reduce((sum, day) => sum + day.revenue, 0) / dailySales.length 
//     : 0;

//   const fulfillmentRate = last7DaysStats.orderCount > 0 
//     ? (last7DaysStats.fulfilled / last7DaysStats.orderCount) * 100 
//     : 0;

//   const last7DaysRepeatCustomerRate = last7DaysTotalCustomers > 0 
//     ? (last7DaysRepeatCustomers / last7DaysTotalCustomers) * 100 
//     : 0;

//   // Financial rates
//   const discountRate = overallStats.total > 0 ? (overallStats.discounts / overallStats.total) * 100 : 0;
//   const shippingRate = overallStats.total > 0 ? (overallStats.shipping / overallStats.total) * 100 : 0;
//   const taxRate = overallStats.total > 0 ? (overallStats.taxes / overallStats.total) * 100 : 0;
//   const returnRate = overallStats.total > 0 ? (overallStats.returns / overallStats.total) * 100 : 0;

//   // Chart data - USING EXTRACTED FORMATTING
//   const weeklyRevenueTrend = weeklySales.map(week => ({
//     week: formatWeekDisplay(week.week),
//     revenue: week.revenue
//   }));

//   const monthlyComparison = monthlySales.map(month => ({
//     month: month.month.split(' ')[0],
//     revenue: month.revenue,
//     orders: month.orders
//   }));

//   const dailyPerformance = dailySales.map(day => {
//     const date = new Date(day.date);
//     const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
//     return {
//       day: dayNames[date.getDay()],
//       revenue: day.revenue,
//       orders: day.orders
//     };
//   });







// console.log('🔍 Starting mismatch calculations...');
  
//   // Today's mismatch
//   const todayMismatchSummary = this.getTodayMismatchSummary({
//     dailyFinancials: dailyFinancials,
//     currentDateInShopTZ: currentDateInShopTZ
//   });

//   // Last 7 days mismatch
//   const last7DaysMismatchSummary = this.calculateMismatchSummary(dailyFinancials, 'day');
  
//   // Weekly mismatch
//   const weeklyMismatchSummary = this.calculateMismatchSummary(weeklyFinancials, 'week');
  
//   // Monthly mismatch - FIX THIS PART
//   const monthlyData = monthRanges.map(month => {
//     const monthData = monthlyTotals[month.key];
//     if (monthData) {
//       return {
//         netSales: monthData.netSales || 0,
//         shipping: monthData.shipping || 0,
//         taxes: monthData.taxes || 0,
//         extraFees: monthData.extraFees || 0,
//         totalSales: monthData.totalSales || 0
//       };
//     }
//     return null;
//   }).filter(Boolean);
  
//   const monthlyMismatchSummary = this.calculateMismatchSummary(monthlyData, 'month');

//   console.log('📊 FINAL MISMATCH RESULTS:');
//   console.log('Today:', todayMismatchSummary);
//   console.log('Last 7 Days:', last7DaysMismatchSummary);
//   console.log('Weekly:', weeklyMismatchSummary);
//   console.log('Monthly:', monthlyMismatchSummary);






//   // Calculate additional metrics
//   const averageOrderValue = overallStats.orderCount > 0 ? overallStats.totalSales / overallStats.orderCount : 0;
//   const averageItemsPerOrder = overallStats.orderCount > 0 ? overallStats.items / overallStats.orderCount : 0;
//   const customerRetentionRate = totalCustomerData.totalCustomers > 0 ? 
//     (totalCustomerData.repeatedCustomers / totalCustomerData.totalCustomers) * 100 : 0;
//   const averageOrderFrequency = totalCustomerData.totalCustomers > 0 ? 
//     overallStats.orderCount / totalCustomerData.totalCustomers : 0;

//   // Calculate last 7 days totals from dailySales
//   const last7DaysOrders = (dailySales || []).reduce((sum, day) => sum + (day.orders || 0), 0);
//   const last7DaysRevenue = (dailySales || []).reduce((sum, day) => sum + (day.revenue || 0), 0);
//   const last7DaysItems = (dailySales || []).reduce((sum, day) => sum + (day.items || 0), 0);

//   console.log(`🎯 Final analytics prepared for email`);



//   console.log(`🎯 Final analytics prepared for email`);

// // 🆕 CALCULATE DAYS LEFT IN CURRENT WEEK
// // 🆕 SIMPLE CORRECT CALCULATION
// const today = new Date();
// const dayOfWeek = today.getDay(); // 0=Sunday, 1=Monday, ..., 6=Saturday

// // If it's Sunday (0), 0 days left. Otherwise, 7 - dayOfWeek
// const daysLeftInWeek = dayOfWeek === 0 ? 0 : (7 - dayOfWeek);

// console.log(`📅 Days left in current week: ${daysLeftInWeek} (today: ${['Sun','Mon','Tue','Wed','Thu','Fri','Sat'][dayOfWeek]})`);



//   // Return complete EmailOrderData with all required fields
//   return {
//     // Core metrics
//     totalOrders: overallStats.orderCount,
//     totalCustomers: totalCustomerData.totalCustomers,
//     fulfillmentRate,
//     totalRevenue: overallStats.total,
//     netRevenue: overallStats.netSales,
//     averageOrderValue,
//     totalItems: overallStats.items,
//     todayOrders: todayData.orderCount,
//     todayRevenue: todayData.totalSales,
//     todayItems: todayData.items,
    
//     // Event summaries
//     todayEventSummary: todayEventSummary,
//     last7DaysEventSummary: last7DaysEventSummary,
//     last8WeeksEventSummary: last8WeeksEventSummary,
//     last6MonthsEventSummary: last6MonthsEventSummary,
    
//     last7DaysOrders,
//     last7DaysRevenue, 
//     last7DaysItems,

   



// last7DaysTotalRevenue,
//   last7DaysTotalDiscounts,
//   last7DaysTotalReturns,
//   last7DaysTotalExtraFees,
//   last7DaysTotalNetSales,
//   last7DaysTotalShipping,
//   last7DaysTotalTaxes,
//   last7DaysTotalTotalSales,
  
  



//   weeklyTotalOrders: weeklyTotalOrders,
//   weeklyTotalRevenue: weeklyTotalRevenue, // Map your calculated value to the type property
//   weeklyTotalItems: weeklyTotalItems,
  
//   // Weekly Financial Breakdown - Use EXACT property names
//   weeklyTotalDiscounts: weeklyTotalDiscounts,
//   weeklyTotalReturns: weeklyTotalReturns,
//   weeklyTotalExtraFees: weeklyTotalExtraFees,
//   weeklyTotalNetSales: weeklyTotalNetSales,
//   weeklyTotalShipping: weeklyTotalShipping,
//   weeklyTotalTaxes: weeklyTotalTaxes,
//   weeklyTotalTotalSales: weeklyTotalTotalSales,
//   weeklyFinancials: weeklyFinancials,
  
//   // Daily Financial Data
//   dailyFinancials: dailyFinancials,
  
  

//   // ✅ CORRECT - Use the calculated values!
// monthlyFinancials: monthlyFinancials,
// monthRanges: monthRanges.map(m => m.key),
// monthlyTotals: monthlyTotals,





// todayMismatchSummary,
//     last7DaysMismatchSummary,
//     weeklyMismatchSummary,
//     monthlyMismatchSummary,


  


//     // In your return statement, add:
// daysLeftInWeek,



//     ordersChangeVsYesterday,
//     revenueChangeVsYesterday,
//     itemsChangeVsYesterday,
//     newCustomers: totalCustomerData.newCustomers,
//     repeatCustomers: totalCustomerData.repeatedCustomers,
//     customerRetentionRate,
//     averageOrderFrequency,
//     shopTimezone,
//     shopCurrency,
//     totalRefunds: overallStats.returns,
//     totalExchanges: 0,
//     totalPartialRefunds: 0,
//     totalEvents: 0,
//     ordersWithEvents: 0,
//     netEventValue: 0,

//     // Extended email fields
//     fulfilledOrders: overallStats.fulfilled,
//     unfulfilledOrders: overallStats.unfulfilled,
//     totalDiscounts: overallStats.discounts,
//     totalShipping: overallStats.shipping,
//     totalTaxes: overallStats.taxes,
//     totalReturns: overallStats.returns,
//     returnFees: overallStats.returnFees || 0,
//     discountRate,
//     shippingRate,
//     taxRate,
//     returnRate,
//     averageItemsPerOrder,
//     dailySales,
//     weeklySales,
//     monthlySales,
//     yesterdayRevenue: yesterdayData.totalSales,
//     yesterdayOrders: yesterdayData.orderCount,
//     yesterdayItems: yesterdayData.items,
//     lastWeekRevenue: lastWeekData.totalSales,
//     lastWeekOrders: lastWeekData.orderCount,
//     lastWeekItems: lastWeekData.items,
//     todayFulfilled: todayData.fulfilled,
//     todayUnfulfilled: todayData.unfulfilled,
//     last7DaysFulfilled: last7DaysStats.fulfilled,
//     last7DaysUnfulfilled: last7DaysStats.unfulfilled,
//     revenueChangeVsLastWeek,
//     bestDay: { date: bestDay.date, revenue: bestDay.revenue, orders: bestDay.orders, items: bestDay.items },
//     averageDailyRevenue,
//     last7DaysTotalCustomers,
//     last7DaysRepeatCustomers,
//     last7DaysNewCustomers,
//     last7DaysRepeatCustomerRate,
//     customerTypeData: { new: totalCustomerData.newCustomers, repeat: totalCustomerData.repeatedCustomers },
//     fulfillmentStatusData: { fulfilled: overallStats.fulfilled, unfulfilled: overallStats.unfulfilled },
//     weeklyRevenueTrend,
//     monthlyComparison,
//     dailyPerformance,
//     ordersLoaded: orders.length,
//     currentDateInShopTZ,
//   };

// }

//   private formatCurrency(amount: number, currency: string): string {
//     return amount.toLocaleString('en-US', { 
//       style: 'currency', 
//       currency: currency,
//       minimumFractionDigits: 2 
//     });
//   }
// }









































































// // analyticsCollector.server.ts - Updated imports
// import { Session } from "@shopify/shopify-api";
// import type { OrderStats, CustomerData } from '../types/analytics';
// import type { EmailOrderData } from '../types/emailAnalytics';
// import { fetchOrdersForPeriodGraphQL } from '../services/shopifyGraphql.server'; // Updated import
// import { processOrderToStats, mergeStats } from '../core/financialCalculator.server';
// import { buildCustomerOrderMap, analyzeCustomerBehavior, calculateOverallCustomerData } from '../core/customerAnalytics.server';
// import { getMonthRanges, getLastNDays, getLast8Weeks, formatWeekDisplay } from '../utils/analyticsHelpers';
// import { mergeEventSummaries } from '../core/eventDetection.server';

// export class AnalyticsCollector {
//   private session: Session;
//   private SHOPIFY_API_VERSION = '2024-04';

//   constructor(session: Session) {
//     this.session = session;
//   }

//   async collectDailyAnalytics(): Promise<EmailOrderData> {
//     try {
//       console.log(`🔄 Starting GraphQL analytics collection for ${this.session.shop}`);
      
//       // Get shop info
//       const { shopTimezone, shopCurrency } = await this.getShopInfo();
//       console.log(`📍 Shop timezone: ${shopTimezone}, currency: ${shopCurrency}`);

//       // Use the same date ranges as main dashboard
//       const monthRanges = getMonthRanges(shopTimezone);
//       const startDate = monthRanges[0].start;
//       const endDate = monthRanges[monthRanges.length - 1].end;

//       // Use GraphQL instead of REST
//       const orders = await fetchOrdersForPeriodGraphQL(
//         this.session.shop,
//         this.session.accessToken!,
//         startDate,
//         endDate
//       );

//       console.log(`📦 GraphQL fetched ${orders.length} orders`);

//       if (orders.length === 0) {
//         console.log('❌ No orders found, returning empty data');
//         return this.getEmptyData(shopTimezone, shopCurrency);
//       }

//       const processedData = this.processOrdersData(orders, shopTimezone, shopCurrency);
//       console.log(`✅ Successfully processed GraphQL analytics data`);
//       return processedData;

//     } catch (error: any) {
//       console.error('❌ Error in GraphQL analytics collection:', error);
//       return this.getEmptyData('UTC', 'USD');
//     }
//   }




//   private async getShopInfo(): Promise<{ shopTimezone: string; shopCurrency: string }> {
//     try {
//       const url = `https://${this.session.shop}/admin/api/${this.SHOPIFY_API_VERSION}/shop.json`;
//       const response = await fetch(url, {
//         headers: {
//           'X-Shopify-Access-Token': this.session.accessToken!,
//           'Content-Type': 'application/json',
//         },
//       });

//       if (response.ok) {
//         const data = await response.json();
//         console.log(`🏪 Shop API Response - Currency: ${data.shop.currency}, Timezone: ${data.shop.iana_timezone}`);
//         return {
//           shopTimezone: data.shop.iana_timezone || 'UTC',
//           shopCurrency: data.shop.currency || 'USD'
//         };
//       } else {
//         console.error(`❌ Shop API failed: ${response.status}`);
//       }
//     } catch (error) {
//       console.error('❌ Error fetching shop info:', error);
//     }
    
//     // Fallback values
//     return { shopTimezone: 'UTC', shopCurrency: 'USD' };
//   }

//   // ✅ REMOVED the duplicate formatCurrency method - you already have one at the bottom

//   // Your existing methods continue unchanged...
//   private getEmptyOrderStats(): OrderStats {
//     return {
//       total: 0,
//       items: 0,
//       fulfilled: 0,
//       unfulfilled: 0,
//       discounts: 0,
//       shipping: 0,
//       taxes: 0,
//       returns: 0,
//       orderCount: 0,
//       netSales: 0,
//       extraFees: 0,
//       totalSales: 0,
//       shippingRefunds: 0,
//       netReturns: 0,
//       totalRefund: 0,
//       hasSubsequentEvents: false,
//       eventSummary: null,
//       refundsCount: 0,
//       financialStatus: 'pending'
//     };
//   }

//   private getEmptyData(shopTimezone: string, shopCurrency: string): EmailOrderData {
//     const currentDateInShopTZ = this.getLocalDateKey(new Date(), shopTimezone);
    
//     return {
//       // Core metrics
//       totalOrders: 0,
//       totalCustomers: 0,
//       fulfillmentRate: 0,
//       totalRevenue: 0,
//       netRevenue: 0,
//       averageOrderValue: 0,
//       totalItems: 0,
//       todayOrders: 0,
//       todayRevenue: 0,
//       todayItems: 0,
//       last7DaysOrders: 0,
//       last7DaysRevenue: 0, 
//       last7DaysItems: 0,
//       ordersChangeVsYesterday: 0,
//       revenueChangeVsYesterday: 0,
//       itemsChangeVsYesterday: 0,
//       newCustomers: 0,
//       repeatCustomers: 0,
//       customerRetentionRate: 0,
//       averageOrderFrequency: 0,
//       shopTimezone, // ✅ Now properly set
//       shopCurrency, // ✅ Now properly set
//       totalRefunds: 0,
//       totalExchanges: 0,
//       totalPartialRefunds: 0,
//       totalEvents: 0,
//       ordersWithEvents: 0,
//       netEventValue: 0,

//       // ... rest of your existing empty data structure
//       last7DaysTotalRevenue: 0,
//       last7DaysTotalDiscounts: 0,
//       last7DaysTotalReturns: 0,
//       last7DaysTotalExtraFees: 0,
//       last7DaysTotalNetSales: 0,
//       last7DaysTotalShipping: 0,
//       last7DaysTotalTaxes: 0,
//       last7DaysTotalTotalSales: 0,
//       dailyFinancials: [],

//       weeklyTotalOrders: 0,
//       weeklyTotalRevenue: 0, 
//       weeklyTotalItems: 0,
//       weeklyTotalDiscounts: 0,
//       weeklyTotalReturns: 0,
//       weeklyTotalExtraFees: 0,
//       weeklyTotalNetSales: 0,
//       weeklyTotalShipping: 0,
//       weeklyTotalTaxes: 0,
//       weeklyTotalTotalSales: 0,
//       weeklyFinancials: [],

//       monthlyFinancials: {
//         totalOrders: 0,
//         totalRevenue: 0,
//         totalItems: 0,
//         totalDiscounts: 0,
//         totalReturns: 0,
//         totalExtraFees: 0,
//         totalNetSales: 0,
//         totalShipping: 0,
//         totalTaxes: 0,
//         totalTotalSales: 0
//       },
//       monthRanges: [],
//       monthlyTotals: {},

//       // In your return statement, add:
// daysLeftInWeek:0,

//       // Extended email fields
//       fulfilledOrders: 0,
//       unfulfilledOrders: 0,
//       totalDiscounts: 0,
//       totalShipping: 0,
//       totalTaxes: 0,
//       totalReturns: 0,
//       returnFees: 0,
//       discountRate: 0,
//       shippingRate: 0,
//       taxRate: 0,
//       returnRate: 0,
//       averageItemsPerOrder: 0,
//       dailySales: [],
//       weeklySales: [],
//       monthlySales: [],
//       yesterdayRevenue: 0,
//       yesterdayOrders: 0,
//       yesterdayItems: 0,
//       lastWeekRevenue: 0,
//       lastWeekOrders: 0,
//       lastWeekItems: 0,
//       todayFulfilled: 0,
//       todayUnfulfilled: 0,
//       last7DaysFulfilled: 0,
//       last7DaysUnfulfilled: 0,
//       revenueChangeVsLastWeek: 0,
//       bestDay: { date: '', revenue: 0, orders: 0, items: 0 },
//       averageDailyRevenue: 0,
//       last7DaysTotalCustomers: 0,
//       last7DaysRepeatCustomers: 0,
//       last7DaysNewCustomers: 0,
//       last7DaysRepeatCustomerRate: 0,
//       customerTypeData: { new: 0, repeat: 0 },
//       fulfillmentStatusData: { fulfilled: 0, unfulfilled: 0 },
//       weeklyRevenueTrend: [],
//       monthlyComparison: [],
//       dailyPerformance: [],
//       ordersLoaded: 0,
//       currentDateInShopTZ,

//       // Event summaries
//       todayEventSummary: {
//         refunds: { count: 0, value: 0 },
//         exchanges: { count: 0, value: 0 },
//         partialRefunds: { count: 0, value: 0 },
//         totalEvents: 0,
//         netValue: 0
//       },
//       last7DaysEventSummary: {
//         refunds: { count: 0, value: 0 },
//         exchanges: { count: 0, value: 0 },
//         partialRefunds: { count: 0, value: 0 },
//         totalEvents: 0,
//         netValue: 0
//       },
//       last8WeeksEventSummary: {
//         refunds: { count: 0, value: 0 },
//         exchanges: { count: 0, value: 0 },
//         partialRefunds: { count: 0, value: 0 },
//         totalEvents: 0,
//         netValue: 0
//       },
//       last6MonthsEventSummary: {
//         refunds: { count: 0, value: 0 },
//         exchanges: { count: 0, value: 0 },
//         partialRefunds: { count: 0, value: 0 },
//         totalEvents: 0,
//         netValue: 0
//       },

//       // Mismatch summaries
//       todayMismatchSummary: {
//         totalMismatches: 0,
//         totalDifference: 0,
//         hasMismatches: false
//       },
//       last7DaysMismatchSummary: {
//         totalMismatches: 0,
//         totalDifference: 0,
//         hasMismatches: false
//       },
//       weeklyMismatchSummary: {
//         totalMismatches: 0,
//         totalDifference: 0,
//         hasMismatches: false
//       },
//       monthlyMismatchSummary: {
//         totalMismatches: 0,
//         totalDifference: 0,
//         hasMismatches: false
//       }
//     };
//   }

//   // Your existing helper methods continue here...
//   private getLocalDateKey(utcDate: Date, timezone: string): string {
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

//   private getPreviousDate(currentDate: string, timezone: string): string {
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
  
// // Add these helper methods to your AnalyticsCollector class

// private calculateMismatchSummary(data: any[], periodType: 'day' | 'week' | 'month'): { 
//   totalMismatches: number; 
//   totalDifference: number; 
//   hasMismatches: boolean; 
// } {
//   let totalMismatches = 0;
//   let totalDifference = 0;

//   console.log(`🔍 [MISMATCH DEBUG] Calculating ${periodType} mismatch summary for ${data.length} periods`);

//   data.forEach((periodData: any, index: number) => {
//     if (!periodData) {
//       console.log(`❌ [MISMATCH DEBUG] Period ${index} has no data`);
//       return;
//     }
    
//     const calculatedTotal = periodData.netSales + periodData.shipping + periodData.taxes + (periodData.extraFees || 0);
//     const actualTotal = periodData.totalSales;
//     const difference = Math.abs(actualTotal - calculatedTotal);
//     const mismatch = difference > 0.01;
    
//     console.log(`🔍 [MISMATCH DEBUG] ${periodType} ${index}:`);
//     console.log(`   Net Sales: ${periodData.netSales}`);
//     console.log(`   Shipping: ${periodData.shipping}`);
//     console.log(`   Taxes: ${periodData.taxes}`);
//     console.log(`   Extra Fees: ${periodData.extraFees || 0}`);
//     console.log(`   Calculated Total: ${calculatedTotal}`);
//     console.log(`   Actual Total: ${actualTotal}`);
//     console.log(`   Difference: ${difference}`);
//     console.log(`   Mismatch: ${mismatch}`);
    
//     if (mismatch) {
//       totalMismatches++;
//       totalDifference += (calculatedTotal - actualTotal);
//       console.log(`⚠️ [MISMATCH FOUND] ${periodType} ${index} has mismatch: ${difference}`);
//     }
//   });

//   const result = {
//     totalMismatches,
//     totalDifference: parseFloat(totalDifference.toFixed(2)),
//     hasMismatches: totalMismatches > 0
//   };

//   console.log(`📊 [MISMATCH RESULT] ${periodType}:`, result);
//   return result;
// }

// private getTodayMismatchSummary(data: any): { 
//   totalMismatches: number; 
//   totalDifference: number; 
//   hasMismatches: boolean; 
// } {
//   const todayData = data.dailyFinancials?.find((day: any) => day.date === data.currentDateInShopTZ);
  
//   console.log(`🔍 [TODAY MISMATCH DEBUG] Looking for today: ${data.currentDateInShopTZ}`);
//   console.log(`🔍 [TODAY MISMATCH DEBUG] Available dates:`, data.dailyFinancials?.map((d: any) => d.date));
  
//   if (!todayData) {
//     console.log(`❌ [TODAY MISMATCH DEBUG] No data found for today`);
//     return { totalMismatches: 0, totalDifference: 0, hasMismatches: false };
//   }

//   const calculatedTotal = todayData.netSales + todayData.shipping + todayData.taxes + (todayData.extraFees || 0);
//   const actualTotal = todayData.totalSales;
//   const difference = Math.abs(actualTotal - calculatedTotal);
//   const mismatch = difference > 0.01;
  
//   console.log(`🔍 [TODAY MISMATCH DEBUG] Today's data:`, todayData);
//   console.log(`🔍 [TODAY MISMATCH DEBUG] Calculated: ${calculatedTotal}, Actual: ${actualTotal}, Difference: ${difference}, Mismatch: ${mismatch}`);

//   const result = {
//     totalMismatches: mismatch ? 1 : 0,
//     totalDifference: mismatch ? parseFloat((calculatedTotal - actualTotal).toFixed(2)) : 0,
//     hasMismatches: mismatch
//   };

//   console.log(`📊 [TODAY MISMATCH RESULT]:`, result);
//   return result;
// }




  
// private processOrdersData(orders: any[], shopTimezone: string, shopCurrency: string): EmailOrderData {
//   console.log(`🔧 Processing ${orders.length} orders for analytics`);
  
//   const currentDateInShopTZ = this.getLocalDateKey(new Date(), shopTimezone);
//   const yesterdayInShopTZ = this.getPreviousDate(currentDateInShopTZ, shopTimezone);

//   // Initialize data structures - USING EXTRACTED HELPERS
//   const last7DaysKeys = getLastNDays(7, shopTimezone);
//   const last8WeeksKeys = getLast8Weeks(shopTimezone);
//   const monthRanges = getMonthRanges(shopTimezone);

//   // Get last week same day for comparison
//   const todayDate = new Date(currentDateInShopTZ + 'T00:00:00');
//   const lastWeekDate = new Date(todayDate);
//   lastWeekDate.setDate(todayDate.getDate() - 7);
//   const lastWeekSameDayInShopTZ = this.getLocalDateKey(lastWeekDate, shopTimezone);


//    console.log(`📅 Date Debug:`);
//   console.log(`   Today: ${currentDateInShopTZ}`);
//   console.log(`   Last Week Same Day: ${lastWeekSameDayInShopTZ}`);
//   console.log(`   Yesterday: ${yesterdayInShopTZ}`);

//   const dailyStats: Record<string, OrderStats> = {};
//   const weeklyStats: Record<string, OrderStats> = {};
//   const monthlyStats: Record<string, OrderStats> = {};
//   const dailyCustomerStats: Record<string, CustomerData> = {};
//   const weeklyCustomerStats: Record<string, CustomerData> = {};
//   const monthlyCustomerStats: Record<string, CustomerData> = {};

//   // Initialize all periods with empty stats
//   last7DaysKeys.forEach(date => {
//     dailyStats[date] = this.getEmptyOrderStats();
//     dailyCustomerStats[date] = { newCustomers: 0, repeatedCustomers: 0, totalCustomers: 0 };
//   });

//   last8WeeksKeys.forEach(week => {
//     weeklyStats[week] = this.getEmptyOrderStats();
//     weeklyCustomerStats[week] = { newCustomers: 0, repeatedCustomers: 0, totalCustomers: 0 };
//   });

//   monthRanges.forEach(month => {
//     monthlyStats[month.key] = this.getEmptyOrderStats();
//     monthlyCustomerStats[month.key] = { newCustomers: 0, repeatedCustomers: 0, totalCustomers: 0 };
//   });

//   // Process customer data - USING EXTRACTED CUSTOMER ANALYTICS
//   const customerOrderMap = buildCustomerOrderMap(orders, shopTimezone);
//   const dailyCustomerAnalytics = analyzeCustomerBehavior(customerOrderMap, shopTimezone, last7DaysKeys, 'daily');
//   const weeklyCustomerAnalytics = analyzeCustomerBehavior(customerOrderMap, shopTimezone, last8WeeksKeys, 'weekly');
//   const monthlyCustomerAnalytics = analyzeCustomerBehavior(customerOrderMap, shopTimezone, monthRanges.map(r => r.key), 'monthly');
//   const totalCustomerData = calculateOverallCustomerData(customerOrderMap);

//   console.log(`👥 Customer analytics: ${totalCustomerData.totalCustomers} total customers`);

//   // Process each order - USING EXTRACTED FINANCIAL CALCULATOR
//   let processedOrders = 0;
//   orders.forEach((order: any) => {
//     try {
//       const date = new Date(order.created_at);
//       const monthKey = date.toLocaleString("default", { month: "short", year: "numeric", timeZone: shopTimezone });
//       const dayKey = this.getLocalDateKey(date, shopTimezone);
      
//       const monday = new Date(date);
//       monday.setDate(date.getDate() - ((date.getDay() + 6) % 7));
//       const weekKey = `Week of ${this.getLocalDateKey(monday, shopTimezone)}`;

//       const orderStats = processOrderToStats(order);

//       // Aggregate data - USING EXTRACTED MERGE FUNCTION
//       if (dailyStats[dayKey]) {
//         dailyStats[dayKey] = mergeStats(dailyStats[dayKey], orderStats);
//         dailyCustomerStats[dayKey] = dailyCustomerAnalytics[dayKey] || { newCustomers: 0, repeatedCustomers: 0, totalCustomers: 0 };
//       }

//       if (weeklyStats[weekKey]) {
//         weeklyStats[weekKey] = mergeStats(weeklyStats[weekKey], orderStats);
//         weeklyCustomerStats[weekKey] = weeklyCustomerAnalytics[weekKey] || { newCustomers: 0, repeatedCustomers: 0, totalCustomers: 0 };
//       }

//       if (monthlyStats[monthKey]) {
//         monthlyStats[monthKey] = mergeStats(monthlyStats[monthKey], orderStats);
//         monthlyCustomerStats[monthKey] = monthlyCustomerAnalytics[monthKey] || { newCustomers: 0, repeatedCustomers: 0, totalCustomers: 0 };
//       }
      
//       processedOrders++;
//     } catch (error) {
//       console.error('Error processing order:', error);
//     }
//   });

//   console.log(`✅ Processed ${processedOrders} orders for analytics`);

//   // Calculate today's and yesterday's data
//   const todayData = dailyStats[currentDateInShopTZ] || this.getEmptyOrderStats();
//   const yesterdayData = dailyStats[yesterdayInShopTZ] || this.getEmptyOrderStats();
//   const lastWeekData = dailyStats[lastWeekSameDayInShopTZ] || this.getEmptyOrderStats();


//   console.log(`📊 Data Availability:`);
//   console.log(`   Today Data:`, todayData);
//   console.log(`   Last Week Data:`, lastWeekData);
//   console.log(`   Today Revenue: ${todayData.totalSales}`);
//   console.log(`   Last Week Revenue: ${lastWeekData.totalSales}`);

  


//   // ⬇️⬇️⬇️ EVENT SUMMARY CALCULATIONS - ADDED IN CORRECT LOCATION ⬇️⬇️⬇️
// // ⬇️⬇️⬇️ EVENT SUMMARY CALCULATIONS - ADDED IN CORRECT LOCATION ⬇️⬇️⬇️

// // Today's event summary - from todayData (handle null case)
// const todayEventSummary = todayData.eventSummary || {
//   refunds: { count: 0, value: 0 },
//   exchanges: { count: 0, value: 0 },
//   partialRefunds: { count: 0, value: 0 },
//   totalEvents: 0,
//   netValue: 0
// };

// // Last 7 days event summary - aggregate from dailyStats
// let last7DaysEventSummary = {
//   refunds: { count: 0, value: 0 },
//   exchanges: { count: 0, value: 0 },
//   partialRefunds: { count: 0, value: 0 },
//   totalEvents: 0,
//   netValue: 0
// };

// last7DaysKeys.forEach(date => {
//   const dayData = dailyStats[date];
//   if (dayData && dayData.eventSummary) {
//     const merged = mergeEventSummaries(last7DaysEventSummary, dayData.eventSummary);
//     if (merged) {
//       last7DaysEventSummary = merged;
//     }
//   }
// });

// // Last 8 weeks event summary - aggregate from weeklyStats
// let last8WeeksEventSummary = {
//   refunds: { count: 0, value: 0 },
//   exchanges: { count: 0, value: 0 },
//   partialRefunds: { count: 0, value: 0 },
//   totalEvents: 0,
//   netValue: 0
// };

// last8WeeksKeys.forEach(week => {
//   const weekData = weeklyStats[week];
//   if (weekData && weekData.eventSummary) {
//     const merged = mergeEventSummaries(last8WeeksEventSummary, weekData.eventSummary);
//     if (merged) {
//       last8WeeksEventSummary = merged;
//     }
//   }
// });


// // Calculate weekly totals - CORRECTED VERSION
// let weeklyTotalOrders = 0;
// let weeklyPerformanceRevenue = 0; // For Weekly Performance section
// let weeklyTotalItems = 0;

// // For Weekly Financial Breakdown - USE THE SAME LOGIC AS FINANCIAL CALCULATOR
// let weeklyTotalRevenue = 0;        // Gross Sales (use 'total' property)
// let weeklyTotalDiscounts = 0;
// let weeklyTotalReturns = 0;
// let weeklyTotalExtraFees = 0;
// let weeklyTotalNetSales = 0;
// let weeklyTotalShipping = 0;
// let weeklyTotalTaxes = 0;
// let weeklyTotalTotalSales = 0;    // Final Total

// last8WeeksKeys.forEach(week => {
//   const weekData = weeklyStats[week];
//   if (weekData) {
//     weeklyTotalOrders += weekData.orderCount;
//     weeklyPerformanceRevenue += weekData.totalSales; // For Weekly Performance
//     weeklyTotalItems += weekData.items;
    
//     // ✅ CORRECT: Use the same properties as your financial calculator
//     weeklyTotalRevenue += weekData.total;           // Gross Sales
//     weeklyTotalDiscounts += weekData.discounts;
//     weeklyTotalReturns += weekData.returns;
//     weeklyTotalExtraFees += weekData.extraFees || 0;
    
//     weeklyTotalNetSales += weekData.netSales;
//     weeklyTotalShipping += weekData.shipping;
//     weeklyTotalTaxes += weekData.taxes;
//     weeklyTotalTotalSales += weekData.totalSales;   // Final Total
//   }
// });

// // Verify the math makes sense - THIS SHOULD MATCH YOUR FINANCIAL CALCULATOR LOGIC
// console.log('🔍 WEEKLY FINANCIAL VERIFICATION:');
// console.log('Gross Sales (total):', weeklyTotalRevenue);
// console.log('Discounts:', weeklyTotalDiscounts);
// console.log('Returns:', weeklyTotalReturns);
// console.log('Extra Fees:', weeklyTotalExtraFees);
// console.log('Net Sales:', weeklyTotalNetSales);
// console.log('Total Sales (totalSales):', weeklyTotalTotalSales);

// // Check if the calculation matches: Gross - Discounts + Returns + Extra Fees ≈ Net Sales
// const calculatedNet = weeklyTotalRevenue - weeklyTotalDiscounts + weeklyTotalReturns + weeklyTotalExtraFees;
// console.log('Expected Net (Gross - Discounts + Returns + Extra Fees):', calculatedNet);
// console.log('Actual Net Sales from data:', weeklyTotalNetSales);
// console.log('Difference:', Math.abs(calculatedNet - weeklyTotalNetSales));




// // Create weekly financials array
// const weeklyFinancials = last8WeeksKeys.map(week => {
//   const weekData = weeklyStats[week] || this.getEmptyOrderStats();
//   return {
//     week,
//     total: weekData.total,
//     discounts: weekData.discounts,
//     returns: weekData.returns,
//     netSales: weekData.netSales,
//     shipping: weekData.shipping,
//     extraFees: weekData.extraFees || 0,
//     taxes: weekData.taxes,
//     totalSales: weekData.totalSales
//   };
// });








// // Last 6 months event summary - aggregate from monthlyStats
// let last6MonthsEventSummary = {
//   refunds: { count: 0, value: 0 },
//   exchanges: { count: 0, value: 0 },
//   partialRefunds: { count: 0, value: 0 },
//   totalEvents: 0,
//   netValue: 0
// };

// monthRanges.forEach(month => {
//   const monthData = monthlyStats[month.key];
//   if (monthData && monthData.eventSummary) {
//     const merged = mergeEventSummaries(last6MonthsEventSummary, monthData.eventSummary);
//     if (merged) {
//       last6MonthsEventSummary = merged;
//     }
//   }
// });

//   // Debug the event summaries
//   console.log('🔍 EVENT SUMMARIES FROM PROCESSED DATA:');
//   console.log('Today Events:', todayEventSummary.totalEvents, 'Refunds:', todayEventSummary.refunds.count);
//   console.log('Last 7 Days Events:', last7DaysEventSummary.totalEvents, 'Refunds:', last7DaysEventSummary.refunds.count);
//   console.log('Last 8 Weeks Events:', last8WeeksEventSummary.totalEvents, 'Refunds:', last8WeeksEventSummary.refunds.count);
//   console.log('Last 6 Months Events:', last6MonthsEventSummary.totalEvents, 'Refunds:', last6MonthsEventSummary.refunds.count);

//   // ⬆️⬆️⬆️ END EVENT SUMMARY CALCULATIONS ⬆️⬆️⬆️

//   // Calculate 7-day totals
//   let last7DaysStats = this.getEmptyOrderStats();
//   let last7DaysTotalCustomers = 0;
//   let last7DaysRepeatCustomers = 0;
//   let last7DaysNewCustomers = 0;

//   last7DaysKeys.forEach(date => {
//     const dayData = dailyStats[date];
//     const customerData = dailyCustomerStats[date];
    
//     if (dayData) {
//       last7DaysStats = mergeStats(last7DaysStats, dayData);
//     }
    
//     last7DaysTotalCustomers += customerData.totalCustomers;
//     last7DaysRepeatCustomers += customerData.repeatedCustomers;
//     last7DaysNewCustomers += customerData.newCustomers;
//   });

//   let last7DaysTotalRevenue = 0;
//   let last7DaysTotalDiscounts = 0;
//   let last7DaysTotalReturns = 0;
//   let last7DaysTotalExtraFees = 0;
//   let last7DaysTotalNetSales = 0;
//   let last7DaysTotalShipping = 0;
//   let last7DaysTotalTaxes = 0;
//   let last7DaysTotalTotalSales = 0;

//   last7DaysKeys.forEach(date => {
//     const dayData = dailyStats[date];
//     if (dayData) {
//       last7DaysTotalRevenue += dayData.total;
//       last7DaysTotalDiscounts += dayData.discounts;
//       last7DaysTotalReturns += dayData.returns;
//       last7DaysTotalExtraFees += dayData.extraFees || 0;
//       last7DaysTotalNetSales += dayData.netSales;
//       last7DaysTotalShipping += dayData.shipping;
//       last7DaysTotalTaxes += dayData.taxes;
//       last7DaysTotalTotalSales += dayData.totalSales;
//     }
//   });



  
//   // Daily financials array
// const dailyFinancials = last7DaysKeys.map(date => {
//   const dayData = dailyStats[date] || this.getEmptyOrderStats();
//   return {
//     date,
//     total: dayData.total,
//     discounts: dayData.discounts,
//     returns: dayData.returns,
//     netSales: dayData.netSales,
//     shipping: dayData.shipping,
//     extraFees: dayData.extraFees || 0,
//     taxes: dayData.taxes,
//     totalSales: dayData.totalSales
//   };
// });


// //   // Calculate weekly financial totals for last 8 weeks
// // let weeklyTotalOrders = 0;
// // let weeklyTotalRevenue = 0;
// // let weeklyTotalItems = 0;

// // last8WeeksKeys.forEach(week => {
// //   const weekData = weeklyStats[week];
// //   if (weekData) {
// //     weeklyTotalOrders += weekData.orderCount;
// //     weeklyTotalRevenue += weekData.totalSales;
// //     weeklyTotalItems += weekData.items;
// //   }
// // });

// //   // Create daily financials array
// //   const dailyFinancials = last7DaysKeys.map(date => {
// //     const dayData = dailyStats[date] || this.getEmptyOrderStats();
// //     return {
// //       date,
// //       total: dayData.total,
// //       discounts: dayData.discounts,
// //       returns: dayData.returns,
// //       netSales: dayData.netSales,
// //       shipping: dayData.shipping,
// //       extraFees: dayData.extraFees || 0,
// //       taxes: dayData.taxes,
// //       totalSales: dayData.totalSales
// //     };
// //   });








// // Add this after the weekly calculations in processOrdersData method
// // In processOrdersData method - COMPLETE MONTHLY CALCULATIONS

// // ==================== MONTHLY FINANCIAL CALCULATIONS ====================

// // Calculate monthly financial totals from monthlyStats
// let monthlyTotalOrders = 0;
// let monthlyTotalRevenue = 0;
// let monthlyTotalItems = 0;
// let monthlyTotalDiscounts = 0;
// let monthlyTotalReturns = 0;
// let monthlyTotalExtraFees = 0;
// let monthlyTotalNetSales = 0;
// let monthlyTotalShipping = 0;
// let monthlyTotalTaxes = 0;
// let monthlyTotalTotalSales = 0;

// // Calculate from monthlyStats (which has the processed financial data)
// monthRanges.forEach(month => {
//   const monthData = monthlyStats[month.key] || this.getEmptyOrderStats();
  
//   monthlyTotalOrders += monthData.orderCount;
//   monthlyTotalRevenue += monthData.total;           // Gross Sales
//   monthlyTotalItems += monthData.items;
//   monthlyTotalDiscounts += monthData.discounts;
//   monthlyTotalReturns += monthData.returns;
//   monthlyTotalExtraFees += monthData.extraFees || 0;
//   monthlyTotalNetSales += monthData.netSales;
//   monthlyTotalShipping += monthData.shipping;
//   monthlyTotalTaxes += monthData.taxes;
//   monthlyTotalTotalSales += monthData.totalSales;
// });

// // Create monthlyFinancials object with ALL calculated metrics
// const monthlyFinancials = {
//   totalOrders: monthlyTotalOrders,
//   totalRevenue: monthlyTotalRevenue,
//   totalItems: monthlyTotalItems,
//   totalDiscounts: monthlyTotalDiscounts,
//   totalReturns: monthlyTotalReturns,
//   totalExtraFees: monthlyTotalExtraFees,
//   totalNetSales: monthlyTotalNetSales,
//   totalShipping: monthlyTotalShipping,
//   totalTaxes: monthlyTotalTaxes,
//   totalTotalSales: monthlyTotalTotalSales
// };

// // Create monthlyTotals object for the details section
// const monthlyTotals: Record<string, any> = {};
// monthRanges.forEach(month => {
//   const monthData = monthlyStats[month.key] || this.getEmptyOrderStats();
//   monthlyTotals[month.key] = {
//     total: monthData.total,
//     discounts: monthData.discounts,
//     returns: monthData.returns,
//     netSales: monthData.netSales,
//     shipping: monthData.shipping,
//     taxes: monthData.taxes,
//     extraFees: monthData.extraFees || 0,
//     totalSales: monthData.totalSales,
//     orderCount: monthData.orderCount,
//     items: monthData.items
//   };
// });

// // Debug to verify calculations
// console.log('🔍 MONTHLY FINANCIAL CALCULATIONS:');
// console.log('Gross Sales (totalRevenue):', monthlyTotalRevenue);
// console.log('Discounts:', monthlyTotalDiscounts);
// console.log('Returns:', monthlyTotalReturns);
// console.log('Extra Fees:', monthlyTotalExtraFees);
// console.log('Net Sales:', monthlyTotalNetSales);
// console.log('Shipping:', monthlyTotalShipping);
// console.log('Taxes:', monthlyTotalTaxes);
// console.log('Total Sales:', monthlyTotalTotalSales);



//   // Calculate overall totals from monthly data
//   let overallStats = this.getEmptyOrderStats();
//   monthRanges.forEach(month => {
//     const monthData = monthlyStats[month.key] || this.getEmptyOrderStats();
//     overallStats = mergeStats(overallStats, monthData);
//   });

//   console.log(`📊 Overall totals: ${overallStats.orderCount} orders, ${this.formatCurrency(overallStats.totalSales, shopCurrency)} revenue`);

//   // Format data for response
//   const dailySales = last7DaysKeys.map(date => {
//     const dayData = dailyStats[date] || this.getEmptyOrderStats();
//     const customerData = dailyCustomerStats[date];
    
//     return {
//       date,
//       revenue: dayData.totalSales,
//       orders: dayData.orderCount,
//       items: dayData.items,
//       fulfilled: dayData.fulfilled
//     };
//   });

//   const weeklySales = last8WeeksKeys.map(week => {
//     const weekData = weeklyStats[week] || this.getEmptyOrderStats();
//     const customerData = weeklyCustomerStats[week];
    
//     return {
//       week,
//       revenue: weekData.totalSales,
//       orders: weekData.orderCount,
//       items: weekData.items
//     };
//   });

//   const monthlySales = monthRanges.map(month => {
//     const monthData = monthlyStats[month.key] || this.getEmptyOrderStats();
//     const customerData = monthlyCustomerStats[month.key];
    
//     return {
//       month: month.key,
//       revenue: monthData.totalSales,
//       orders: monthData.orderCount,
//       items: monthData.items
//     };
//   });

//   // Calculate percentage changes - SAME CALCULATIONS AS MAIN CODE
//   const revenueChangeVsYesterday = yesterdayData.totalSales > 0 
//     ? ((todayData.totalSales - yesterdayData.totalSales) / yesterdayData.totalSales) * 100 
//     : (todayData.totalSales > 0 ? 100 : 0);

//   const ordersChangeVsYesterday = yesterdayData.orderCount > 0 
//     ? ((todayData.orderCount - yesterdayData.orderCount) / yesterdayData.orderCount) * 100 
//     : (todayData.orderCount > 0 ? 100 : 0);

//   const itemsChangeVsYesterday = yesterdayData.items > 0 
//     ? ((todayData.items - yesterdayData.items) / yesterdayData.items) * 100 
//     : (todayData.items > 0 ? 100 : 0);

//   // const revenueChangeVsLastWeek = lastWeekData.totalSales > 0 
//   //   ? ((todayData.totalSales - lastWeekData.totalSales) / lastWeekData.totalSales) * 100 
//   //   : (todayData.totalSales > 0 ? 100 : 0);

//  const getWeekOverWeekChange = () => {
//   try {
//     console.log('🔄 DEBUG: Starting Week-over-Week Calculation');
    
//     // Get the weekly data keys and REVERSE them to get most recent first
//     const weeklyKeys = getLast8Weeks(shopTimezone).reverse(); // 🆕 ADD .reverse() here
//     console.log('📅 DEBUG: Weekly keys (REVERSED - most recent first):', weeklyKeys);
    
//     // Debug: Show ALL weekly data available
//     console.log('🔍 DEBUG: All Weekly Stats Data:');
//     weeklyKeys.forEach((weekKey, index) => {
//       const weekData = weeklyStats[weekKey];
//       if (weekData) {
//         console.log(`   ✅ Week ${index + 1} (${weekKey}):`, {
//           revenue: weekData.totalSales,
//           orders: weekData.orderCount,
//           items: weekData.items,
//           total: weekData.total,
//           netSales: weekData.netSales
//         });
//       } else {
//         console.log(`   ❌ Week ${index + 1} (${weekKey}): NO DATA`);
//       }
//     });
    
//     if (weeklyKeys.length < 2) {
//       console.log('❌ DEBUG: Not enough weekly data available');
//       return 0;
//     }
    
//     // Current week (most recent week) - NOW CORRECT!
//     const currentWeekKey = weeklyKeys[0]; // First item after reverse = most recent
//     const currentWeekData = weeklyStats[currentWeekKey];
//     const currentWeekRevenue = currentWeekData?.totalSales || 0;
    
//     // Previous week (week before current week) - NOW CORRECT!
//     const previousWeekKey = weeklyKeys[1]; // Second item after reverse = previous week
//     const previousWeekData = weeklyStats[previousWeekKey];
//     const previousWeekRevenue = previousWeekData?.totalSales || 0;
    
//     console.log('🎯 DEBUG: Calculation Details (CORRECTED):');
//     console.log(`   Current Week Key: "${currentWeekKey}"`);
//     console.log(`   Current Week Revenue: ${currentWeekRevenue}`);
//     console.log(`   Previous Week Key: "${previousWeekKey}"`);
//     console.log(`   Previous Week Revenue: ${previousWeekRevenue}`);
    
//     // Calculate percentage change
//     if (previousWeekRevenue > 0 && currentWeekRevenue > 0) {
//       const change = ((currentWeekRevenue - previousWeekRevenue) / previousWeekRevenue) * 100;
//       console.log(`   ✅ Change Calculation: ((${currentWeekRevenue} - ${previousWeekRevenue}) / ${previousWeekRevenue}) * 100 = ${change.toFixed(1)}%`);
//       return change;
//     } else if (currentWeekRevenue > 0 && previousWeekRevenue === 0) {
//       console.log(`   ℹ️ Change: 100% (current week has revenue, previous week has none)`);
//       return 100;
//     } else if (currentWeekRevenue === 0 && previousWeekRevenue > 0) {
//       const change = -100;
//       console.log(`   ℹ️ Change: ${change}% (current week has no revenue, previous week had revenue)`);
//       return change;
//     } else {
//       console.log(`   ℹ️ Change: 0% (both weeks have no revenue or both have zero revenue)`);
//       return 0;
//     }
//   } catch (error) {
//     console.error('❌ Error calculating week-over-week change:', error);
//     return 0;
//   }
// };

// const revenueChangeVsLastWeek = getWeekOverWeekChange();


// console.log(`📈 Week-over-Week Calculation:`);
//   console.log(`   Formula: ((${todayData.totalSales} - ${lastWeekData.totalSales}) / ${lastWeekData.totalSales}) * 100`);
//   console.log(`   Result: ${revenueChangeVsLastWeek}%`);


//   // Additional metrics
//   const bestDay = dailySales.reduce((best, current) => 
//     current.revenue > best.revenue ? current : best, 
//     { date: '', revenue: 0, orders: 0, items: 0, fulfilled: 0 }
//   );

//   const averageDailyRevenue = dailySales.length > 0 
//     ? dailySales.reduce((sum, day) => sum + day.revenue, 0) / dailySales.length 
//     : 0;

//   const fulfillmentRate = last7DaysStats.orderCount > 0 
//     ? (last7DaysStats.fulfilled / last7DaysStats.orderCount) * 100 
//     : 0;

//   const last7DaysRepeatCustomerRate = last7DaysTotalCustomers > 0 
//     ? (last7DaysRepeatCustomers / last7DaysTotalCustomers) * 100 
//     : 0;

//   // Financial rates
//   const discountRate = overallStats.total > 0 ? (overallStats.discounts / overallStats.total) * 100 : 0;
//   const shippingRate = overallStats.total > 0 ? (overallStats.shipping / overallStats.total) * 100 : 0;
//   const taxRate = overallStats.total > 0 ? (overallStats.taxes / overallStats.total) * 100 : 0;
//   const returnRate = overallStats.total > 0 ? (overallStats.returns / overallStats.total) * 100 : 0;

//   // Chart data - USING EXTRACTED FORMATTING
//   const weeklyRevenueTrend = weeklySales.map(week => ({
//     week: formatWeekDisplay(week.week),
//     revenue: week.revenue
//   }));

//   const monthlyComparison = monthlySales.map(month => ({
//     month: month.month.split(' ')[0],
//     revenue: month.revenue,
//     orders: month.orders
//   }));

//   const dailyPerformance = dailySales.map(day => {
//     const date = new Date(day.date);
//     const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
//     return {
//       day: dayNames[date.getDay()],
//       revenue: day.revenue,
//       orders: day.orders
//     };
//   });







// console.log('🔍 Starting mismatch calculations...');
  
//   // Today's mismatch
//   const todayMismatchSummary = this.getTodayMismatchSummary({
//     dailyFinancials: dailyFinancials,
//     currentDateInShopTZ: currentDateInShopTZ
//   });

//   // Last 7 days mismatch
//   const last7DaysMismatchSummary = this.calculateMismatchSummary(dailyFinancials, 'day');
  
//   // Weekly mismatch
//   const weeklyMismatchSummary = this.calculateMismatchSummary(weeklyFinancials, 'week');
  
//   // Monthly mismatch - FIX THIS PART
//   const monthlyData = monthRanges.map(month => {
//     const monthData = monthlyTotals[month.key];
//     if (monthData) {
//       return {
//         netSales: monthData.netSales || 0,
//         shipping: monthData.shipping || 0,
//         taxes: monthData.taxes || 0,
//         extraFees: monthData.extraFees || 0,
//         totalSales: monthData.totalSales || 0
//       };
//     }
//     return null;
//   }).filter(Boolean);
  
//   const monthlyMismatchSummary = this.calculateMismatchSummary(monthlyData, 'month');

//   console.log('📊 FINAL MISMATCH RESULTS:');
//   console.log('Today:', todayMismatchSummary);
//   console.log('Last 7 Days:', last7DaysMismatchSummary);
//   console.log('Weekly:', weeklyMismatchSummary);
//   console.log('Monthly:', monthlyMismatchSummary);






//   // Calculate additional metrics
//   const averageOrderValue = overallStats.orderCount > 0 ? overallStats.totalSales / overallStats.orderCount : 0;
//   const averageItemsPerOrder = overallStats.orderCount > 0 ? overallStats.items / overallStats.orderCount : 0;
//   const customerRetentionRate = totalCustomerData.totalCustomers > 0 ? 
//     (totalCustomerData.repeatedCustomers / totalCustomerData.totalCustomers) * 100 : 0;
//   const averageOrderFrequency = totalCustomerData.totalCustomers > 0 ? 
//     overallStats.orderCount / totalCustomerData.totalCustomers : 0;

//   // Calculate last 7 days totals from dailySales
//   const last7DaysOrders = (dailySales || []).reduce((sum, day) => sum + (day.orders || 0), 0);
//   const last7DaysRevenue = (dailySales || []).reduce((sum, day) => sum + (day.revenue || 0), 0);
//   const last7DaysItems = (dailySales || []).reduce((sum, day) => sum + (day.items || 0), 0);

//   console.log(`🎯 Final analytics prepared for email`);



//   console.log(`🎯 Final analytics prepared for email`);

// // 🆕 CALCULATE DAYS LEFT IN CURRENT WEEK
// // 🆕 SIMPLE CORRECT CALCULATION
// const today = new Date();
// const dayOfWeek = today.getDay(); // 0=Sunday, 1=Monday, ..., 6=Saturday

// // If it's Sunday (0), 0 days left. Otherwise, 7 - dayOfWeek
// const daysLeftInWeek = dayOfWeek === 0 ? 0 : (7 - dayOfWeek);

// console.log(`📅 Days left in current week: ${daysLeftInWeek} (today: ${['Sun','Mon','Tue','Wed','Thu','Fri','Sat'][dayOfWeek]})`);



//   // Return complete EmailOrderData with all required fields
//   return {
//     // Core metrics
//     totalOrders: overallStats.orderCount,
//     totalCustomers: totalCustomerData.totalCustomers,
//     fulfillmentRate,
//     totalRevenue: overallStats.total,
//     netRevenue: overallStats.netSales,
//     averageOrderValue,
//     totalItems: overallStats.items,
//     todayOrders: todayData.orderCount,
//     todayRevenue: todayData.totalSales,
//     todayItems: todayData.items,
    
//     // Event summaries
//     todayEventSummary: todayEventSummary,
//     last7DaysEventSummary: last7DaysEventSummary,
//     last8WeeksEventSummary: last8WeeksEventSummary,
//     last6MonthsEventSummary: last6MonthsEventSummary,
    
//     last7DaysOrders,
//     last7DaysRevenue, 
//     last7DaysItems,

   



// last7DaysTotalRevenue,
//   last7DaysTotalDiscounts,
//   last7DaysTotalReturns,
//   last7DaysTotalExtraFees,
//   last7DaysTotalNetSales,
//   last7DaysTotalShipping,
//   last7DaysTotalTaxes,
//   last7DaysTotalTotalSales,
  
  



//   weeklyTotalOrders: weeklyTotalOrders,
//   weeklyTotalRevenue: weeklyTotalRevenue, // Map your calculated value to the type property
//   weeklyTotalItems: weeklyTotalItems,
  
//   // Weekly Financial Breakdown - Use EXACT property names
//   weeklyTotalDiscounts: weeklyTotalDiscounts,
//   weeklyTotalReturns: weeklyTotalReturns,
//   weeklyTotalExtraFees: weeklyTotalExtraFees,
//   weeklyTotalNetSales: weeklyTotalNetSales,
//   weeklyTotalShipping: weeklyTotalShipping,
//   weeklyTotalTaxes: weeklyTotalTaxes,
//   weeklyTotalTotalSales: weeklyTotalTotalSales,
//   weeklyFinancials: weeklyFinancials,
  
//   // Daily Financial Data
//   dailyFinancials: dailyFinancials,
  
  

//   // ✅ CORRECT - Use the calculated values!
// monthlyFinancials: monthlyFinancials,
// monthRanges: monthRanges.map(m => m.key),
// monthlyTotals: monthlyTotals,





// todayMismatchSummary,
//     last7DaysMismatchSummary,
//     weeklyMismatchSummary,
//     monthlyMismatchSummary,


  


//     // In your return statement, add:
// daysLeftInWeek,



//     ordersChangeVsYesterday,
//     revenueChangeVsYesterday,
//     itemsChangeVsYesterday,
//     newCustomers: totalCustomerData.newCustomers,
//     repeatCustomers: totalCustomerData.repeatedCustomers,
//     customerRetentionRate,
//     averageOrderFrequency,
//     shopTimezone,
//     shopCurrency,
//     totalRefunds: overallStats.returns,
//     totalExchanges: 0,
//     totalPartialRefunds: 0,
//     totalEvents: 0,
//     ordersWithEvents: 0,
//     netEventValue: 0,

//     // Extended email fields
//     fulfilledOrders: overallStats.fulfilled,
//     unfulfilledOrders: overallStats.unfulfilled,
//     totalDiscounts: overallStats.discounts,
//     totalShipping: overallStats.shipping,
//     totalTaxes: overallStats.taxes,
//     totalReturns: overallStats.returns,
//     returnFees: overallStats.returnFees || 0,
//     discountRate,
//     shippingRate,
//     taxRate,
//     returnRate,
//     averageItemsPerOrder,
//     dailySales,
//     weeklySales,
//     monthlySales,
//     yesterdayRevenue: yesterdayData.totalSales,
//     yesterdayOrders: yesterdayData.orderCount,
//     yesterdayItems: yesterdayData.items,
//     lastWeekRevenue: lastWeekData.totalSales,
//     lastWeekOrders: lastWeekData.orderCount,
//     lastWeekItems: lastWeekData.items,
//     todayFulfilled: todayData.fulfilled,
//     todayUnfulfilled: todayData.unfulfilled,
//     last7DaysFulfilled: last7DaysStats.fulfilled,
//     last7DaysUnfulfilled: last7DaysStats.unfulfilled,
//     revenueChangeVsLastWeek,
//     bestDay: { date: bestDay.date, revenue: bestDay.revenue, orders: bestDay.orders, items: bestDay.items },
//     averageDailyRevenue,
//     last7DaysTotalCustomers,
//     last7DaysRepeatCustomers,
//     last7DaysNewCustomers,
//     last7DaysRepeatCustomerRate,
//     customerTypeData: { new: totalCustomerData.newCustomers, repeat: totalCustomerData.repeatedCustomers },
//     fulfillmentStatusData: { fulfilled: overallStats.fulfilled, unfulfilled: overallStats.unfulfilled },
//     weeklyRevenueTrend,
//     monthlyComparison,
//     dailyPerformance,
//     ordersLoaded: orders.length,
//     currentDateInShopTZ,
//   };

// }

//   private formatCurrency(amount: number, currency: string): string {
//     return amount.toLocaleString('en-US', { 
//       style: 'currency', 
//       currency: currency,
//       minimumFractionDigits: 2 
//     });
//   }
// }






















































// // analyticsLoader.server.ts - OPTIMIZED VERSION
// import { json } from "@remix-run/node";
// import { authenticate } from "../shopify.server";
// import { cacheManager } from "../utils/cacheManager";
// import { makeCacheKey, nowISO, getMonthRanges, getLastNDays, getLast8Weeks } from "../utils/analyticsHelpers";
// import { fetchOrdersSinceGraphQL, fetchOrdersForPeriodGraphQL } from "../services/shopifyGraphql.server";
// import { processOrderToStats, mergeStats } from "../core/financialCalculator.server";
// import { buildCustomerOrderMap, analyzeCustomerBehavior, calculateOverallCustomerData } from "../core/customerAnalytics.server";
// import type { CachedAnalyticsData, OrderStats, CustomerData } from "../types/analytics";

// // Memory optimization: Process orders in smaller batches with cleanup
// async function processOrdersInBatches(
//   orders: any[], 
//   dailyTotals: Record<string, OrderStats & CustomerData>,
//   weeklyTotals: Record<string, OrderStats & CustomerData>,
//   monthlyTotals: Record<string, OrderStats & CustomerData>,
//   totals: Record<string, OrderStats>,
//   dailyCustomerAnalytics: Record<string, CustomerData>,
//   weeklyCustomerAnalytics: Record<string, CustomerData>,
//   monthlyCustomerAnalytics: Record<string, CustomerData>,
//   shopTimeZone: string
// ): Promise<number> {
//   const BATCH_SIZE = 100; // Smaller batch size for memory management
//   let processedCount = 0;
//   let batchNumber = 0;

//   for (let i = 0; i < orders.length; i += BATCH_SIZE) {
//     batchNumber++;
//     const batch = orders.slice(i, i + BATCH_SIZE);
//     let batchStats = {
//       daily: { ...dailyTotals },
//       weekly: { ...weeklyTotals },
//       monthly: { ...monthlyTotals },
//       totals: { ...totals }
//     };

//     batch.forEach((order: any) => {
//       try {
//         const date = new Date(order.createdAt);
//         const monthKey = date.toLocaleString("default", { month: "short", year: "numeric", timeZone: shopTimeZone });
//         const dayKey = date.toLocaleDateString("en-CA", { timeZone: shopTimeZone });
        
//         const monday = new Date(date);
//         monday.setDate(date.getDate() - ((date.getDay() + 6) % 7));
//         const weekKey = `Week of ${monday.toLocaleDateString("en-CA", { timeZone: shopTimeZone })}`;

//         const orderStats = processOrderToStats(order);

//         if (batchStats.totals[monthKey]) {
//           batchStats.totals[monthKey] = mergeStats(batchStats.totals[monthKey], orderStats);
//         }

//         if (batchStats.daily[dayKey]) {
//           batchStats.daily[dayKey] = {
//             ...mergeStats(batchStats.daily[dayKey], orderStats),
//             newCustomers: dailyCustomerAnalytics[dayKey]?.newCustomers || 0,
//             repeatedCustomers: dailyCustomerAnalytics[dayKey]?.repeatedCustomers || 0,
//             totalCustomers: dailyCustomerAnalytics[dayKey]?.totalCustomers || 0
//           };
//         }

//         if (batchStats.weekly[weekKey]) {
//           batchStats.weekly[weekKey] = {
//             ...mergeStats(batchStats.weekly[weekKey], orderStats),
//             newCustomers: weeklyCustomerAnalytics[weekKey]?.newCustomers || 0,
//             repeatedCustomers: weeklyCustomerAnalytics[weekKey]?.repeatedCustomers || 0,
//             totalCustomers: weeklyCustomerAnalytics[weekKey]?.totalCustomers || 0
//           };
//         }

//         if (batchStats.monthly[monthKey]) {
//           batchStats.monthly[monthKey] = {
//             ...mergeStats(batchStats.monthly[monthKey], orderStats),
//             newCustomers: monthlyCustomerAnalytics[monthKey]?.newCustomers || 0,
//             repeatedCustomers: monthlyCustomerAnalytics[monthKey]?.repeatedCustomers || 0,
//             totalCustomers: monthlyCustomerAnalytics[monthKey]?.totalCustomers || 0
//           };
//         }

//         processedCount++;
//       } catch (error) {
//         console.error('Error processing individual order in batch:', error);
//       }
//     });

//     // Merge batch results into main totals
//     Object.keys(batchStats.daily).forEach(key => {
//       if (dailyTotals[key]) {
//         dailyTotals[key] = batchStats.daily[key];
//       }
//     });

//     Object.keys(batchStats.weekly).forEach(key => {
//       if (weeklyTotals[key]) {
//         weeklyTotals[key] = batchStats.weekly[key];
//       }
//     });

//     Object.keys(batchStats.monthly).forEach(key => {
//       if (monthlyTotals[key]) {
//         monthlyTotals[key] = batchStats.monthly[key];
//       }
//     });

//     Object.keys(batchStats.totals).forEach(key => {
//       if (totals[key]) {
//         totals[key] = batchStats.totals[key];
//       }
//     });

//     // Force garbage collection if available
//     if (global.gc) {
//       global.gc();
//     }

//     console.log(`✅ Processed batch ${batchNumber}: ${batch.length} orders (total: ${processedCount})`);
//   }

//   return processedCount;
// }

// export async function analyticsLoader({ request }: { request: Request }) {
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

//     // Get shop info using REST (compatible with both)
//     const shopRes = await fetch(`https://${shop}/admin/api/${process.env.SHOPIFY_API_VERSION || '2024-04'}/shop.json`, {
//       headers: {
//         "X-Shopify-Access-Token": accessToken,
//       },
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
//       monthlyTotals[r.key] = {
//         ...initStats(),
//         newCustomers: 0,
//         repeatedCustomers: 0,
//         totalCustomers: 0
//       };
//     });

//     dailyKeys.forEach((d) => (dailyTotals[d] = {
//       ...initStats(),
//       newCustomers: 0,
//       repeatedCustomers: 0,
//       totalCustomers: 0
//     }));

//     weeklyKeys.forEach((w) => (weeklyTotals[w] = {
//       ...initStats(),
//       newCustomers: 0,
//       repeatedCustomers: 0,
//       totalCustomers: 0
//     }));

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
//         const result = await fetchOrdersSinceGraphQL(shop, accessToken, cacheEntry.value.lastUpdatedAt, cacheEntry.value.orders);
//         const apiTime = performance.now() - apiStart;

//         if (result.orders.length > 0) {
//           apiSuccess = true;
//           const orderMap = new Map();
//           cacheEntry.value.orders.forEach((order: any) => orderMap.set(order.id, order));
//           result.orders.forEach((order: any) => orderMap.set(order.id, order));
//           allOrders = Array.from(orderMap.values());
//           await cacheManager.set(ordersKey, { orders: allOrders, lastUpdatedAt: nowISO() }, 30 * 60 * 1000);
//         } else {
//           allOrders = cacheEntry.value.orders;
//           apiSuccess = true;
//         }
//       } else {
//         fetchMode = "full";
//       }

//       if (fetchMode === "full") {
//         console.log(`🔄 Fetching full order history via GraphQL for periods: ${monthRanges[0].start} to ${monthRanges[monthRanges.length - 1].end}`);
//         allOrders = await fetchOrdersForPeriodGraphQL(
//           shop,
//           accessToken,
//           monthRanges[0].start,
//           monthRanges[monthRanges.length - 1].end
//         );
//         apiSuccess = true;
//         await cacheManager.set(ordersKey, { orders: allOrders, lastUpdatedAt: nowISO() }, 30 * 60 * 1000);
//       }
//     } catch (error) {
//       console.error('Error fetching orders:', error);
//       if (cacheEntry && cacheEntry.value.orders) {
//         allOrders = cacheEntry.value.orders;
//         apiSuccess = true;
//         fallbackUsed = true;
//       } else {
//         await cacheManager.remove(ordersKey);
//         throw error;
//       }
//     }

//     // Early return if no orders
//     if (allOrders.length === 0) {
//       console.log('⚠️ No orders found, returning empty analytics');
//       const emptyResult: CachedAnalyticsData = {
//         shop,
//         totals,
//         dailyTotals,
//         weeklyTotals,
//         monthlyTotals,
//         totalOrders: 0,
//         totalCustomerData: { newCustomers: 0, repeatedCustomers: 0, totalCustomers: 0 },
//         monthRanges: monthRanges.map((r) => r.key),
//         dailyKeys,
//         weeklyKeys,
//         lastUpdated: new Date().toISOString(),
//         shopTimeZone,
//         shopCurrency
//       };
//       return json(emptyResult);
//     }

//     console.log(`🔧 Processing ${allOrders.length} orders in optimized batches...`);

//     const timing = { customerAnalysis: 0, orderProcessing: 0, calculations: 0 };
//     const customerStart = performance.now();
    
//     const customerOrderMap = buildCustomerOrderMap(allOrders, shopTimeZone);
//     const dailyCustomerAnalytics = analyzeCustomerBehavior(customerOrderMap, shopTimeZone, dailyKeys, 'daily');
//     const weeklyCustomerAnalytics = analyzeCustomerBehavior(customerOrderMap, shopTimeZone, weeklyKeys, 'weekly');
//     const monthlyCustomerAnalytics = analyzeCustomerBehavior(customerOrderMap, shopTimeZone, monthRanges.map(r => r.key), 'monthly');
    
//     timing.customerAnalysis = performance.now() - customerStart;

//     const orderProcessStart = performance.now();
    
//     const processedCount = await processOrdersInBatches(
//       allOrders,
//       dailyTotals,
//       weeklyTotals,
//       monthlyTotals,
//       totals,
//       dailyCustomerAnalytics,
//       weeklyCustomerAnalytics,
//       monthlyCustomerAnalytics,
//       shopTimeZone
//     );

//     timing.orderProcessing = performance.now() - orderProcessStart;

//     const calculationsStart = performance.now();
//     const totalCustomerData = calculateOverallCustomerData(customerOrderMap);
//     timing.calculations = performance.now() - calculationsStart;

//     const totalLoaderTime = performance.now() - loaderStartTime;

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

//     console.log(`✅ GraphQL analytics loader completed: ${processedCount}/${allOrders.length} orders processed successfully`);
//     return json(result);

//   } catch (error: unknown) {
//     const errorMsg = `Loader error: ${error instanceof Error ? error.message : 'Unknown error'}`;
//     console.error('❌ Analytics loader error:', error);
//     return json({
//       shop: "unknown",
//       error: errorMsg,
//       userMessage: "Sorry for the inconvenience! Please try refreshing the page.",
//       timestamp: new Date().toISOString()
//     });
//   }
// }


































// analyticsLoader.server.ts - WITH SAFE API CALLS
import { json } from "@remix-run/node";
import { authenticate } from "../shopify.server";
import { cacheManager } from "../utils/cacheManager";
import { makeCacheKey, nowISO, getMonthRanges, getLastNDays, getLast8Weeks } from "../utils/analyticsHelpers";
import { fetchOrdersSinceGraphQL, fetchOrdersForPeriodGraphQL } from "../services/shopifyGraphql.server";
import { processOrderToStats, mergeStats } from "../core/financialCalculator.server";
import { buildCustomerOrderMap, analyzeCustomerBehavior, calculateOverallCustomerData } from "../core/customerAnalytics.server";
import type { CachedAnalyticsData, OrderStats, CustomerData } from "../types/analytics";

// Safe API Call Helper
async function safeApiCall<T>(
  fn: () => Promise<T>,
  {
    retries = 5,
    initialDelay = 2000,
    maxDelay = 20000,
    backoff = 2,
    label = "API Call"
  }: { retries?: number; initialDelay?: number; maxDelay?: number; backoff?: number; label?: string } = {}
): Promise<T> {
  let attempt = 0;
  let delay = initialDelay;

  while (true) {
    try {
      const result = await fn();
      return result;
    } catch (err: any) {
      attempt++;
      if (attempt > retries) {
        console.error(`❌ ${label} failed after ${retries} retries:`, err);
        throw err;
      }

      // Handle rate limit headers or known Shopify transient errors
      const waitReason =
        err?.message?.includes("rate limit") ||
        err?.message?.includes("502") ||
        err?.message?.includes("503") ||
        err?.message?.includes("504") ||
        err?.message?.includes("ETIMEDOUT") ||
        err?.message?.includes("ENOTFOUND")
          ? "Rate limit or timeout"
          : "Unknown";

      console.warn(`⚠️ ${label} attempt ${attempt} failed (${waitReason}). Retrying in ${delay / 1000}s...`);
      await new Promise((r) => setTimeout(r, delay));
      delay = Math.min(delay * backoff, maxDelay);
    }
  }
}

// Memory optimization: Process orders in smaller batches with cleanup
async function processOrdersInBatches(
  orders: any[], 
  dailyTotals: Record<string, OrderStats & CustomerData>,
  weeklyTotals: Record<string, OrderStats & CustomerData>,
  monthlyTotals: Record<string, OrderStats & CustomerData>,
  totals: Record<string, OrderStats>,
  dailyCustomerAnalytics: Record<string, CustomerData>,
  weeklyCustomerAnalytics: Record<string, CustomerData>,
  monthlyCustomerAnalytics: Record<string, CustomerData>,
  shopTimeZone: string
): Promise<number> {
  const BATCH_SIZE = 100;
  let processedCount = 0;
  let batchNumber = 0;

  for (let i = 0; i < orders.length; i += BATCH_SIZE) {
    batchNumber++;
    const batch = orders.slice(i, i + BATCH_SIZE);
    let batchStats = {
      daily: { ...dailyTotals },
      weekly: { ...weeklyTotals },
      monthly: { ...monthlyTotals },
      totals: { ...totals }
    };

    batch.forEach((order: any) => {
      try {
        const date = new Date(order.createdAt);
        const monthKey = date.toLocaleString("default", { month: "short", year: "numeric", timeZone: shopTimeZone });
        const dayKey = date.toLocaleDateString("en-CA", { timeZone: shopTimeZone });
        
        const monday = new Date(date);
        monday.setDate(date.getDate() - ((date.getDay() + 6) % 7));
        const weekKey = `Week of ${monday.toLocaleDateString("en-CA", { timeZone: shopTimeZone })}`;

        const orderStats = processOrderToStats(order);

        if (batchStats.totals[monthKey]) {
          batchStats.totals[monthKey] = mergeStats(batchStats.totals[monthKey], orderStats);
        }

        if (batchStats.daily[dayKey]) {
          batchStats.daily[dayKey] = {
            ...mergeStats(batchStats.daily[dayKey], orderStats),
            newCustomers: dailyCustomerAnalytics[dayKey]?.newCustomers || 0,
            repeatedCustomers: dailyCustomerAnalytics[dayKey]?.repeatedCustomers || 0,
            totalCustomers: dailyCustomerAnalytics[dayKey]?.totalCustomers || 0
          };
        }

        if (batchStats.weekly[weekKey]) {
          batchStats.weekly[weekKey] = {
            ...mergeStats(batchStats.weekly[weekKey], orderStats),
            newCustomers: weeklyCustomerAnalytics[weekKey]?.newCustomers || 0,
            repeatedCustomers: weeklyCustomerAnalytics[weekKey]?.repeatedCustomers || 0,
            totalCustomers: weeklyCustomerAnalytics[weekKey]?.totalCustomers || 0
          };
        }

        if (batchStats.monthly[monthKey]) {
          batchStats.monthly[monthKey] = {
            ...mergeStats(batchStats.monthly[monthKey], orderStats),
            newCustomers: monthlyCustomerAnalytics[monthKey]?.newCustomers || 0,
            repeatedCustomers: monthlyCustomerAnalytics[monthKey]?.repeatedCustomers || 0,
            totalCustomers: monthlyCustomerAnalytics[monthKey]?.totalCustomers || 0
          };
        }

        processedCount++;
      } catch (error) {
        console.error('Error processing individual order in batch:', error);
      }
    });

    // Merge batch results into main totals
    Object.keys(batchStats.daily).forEach(key => {
      if (dailyTotals[key]) {
        dailyTotals[key] = batchStats.daily[key];
      }
    });

    Object.keys(batchStats.weekly).forEach(key => {
      if (weeklyTotals[key]) {
        weeklyTotals[key] = batchStats.weekly[key];
      }
    });

    Object.keys(batchStats.monthly).forEach(key => {
      if (monthlyTotals[key]) {
        monthlyTotals[key] = batchStats.monthly[key];
      }
    });

    Object.keys(batchStats.totals).forEach(key => {
      if (totals[key]) {
        totals[key] = batchStats.totals[key];
      }
    });

    // Safe garbage collection
    if (typeof global.gc === "function") {
      global.gc();
    }

    console.log(`✅ Processed batch ${batchNumber}: ${batch.length} orders (total: ${processedCount})`);

    // Add delay every 5 batches to prevent event loop blocking
    if (batchNumber % 5 === 0) {
      console.log(`⏳ Taking a brief pause between batches...`);
      await new Promise(resolve => setTimeout(resolve, 500));
    }
  }

  return processedCount;
}

export async function analyticsLoader({ request }: { request: Request }) {
  let cacheUsed = false;
  let apiSuccess = false;
  let fetchMode: "incremental" | "full" = "full";
  let cacheHit = false;
  let fallbackUsed = false;
  const loaderStartTime = performance.now();
  let cacheOperationTime = 0;

  try {
    const { session } = await authenticate.admin(request);
    const shop = session.shop;
    const accessToken = session.accessToken!;

    // Get shop info with safe API call
    const shopRes = await safeApiCall(
      async () =>
        fetch(`https://${shop}/admin/api/${process.env.SHOPIFY_API_VERSION || '2024-04'}/shop.json`, {
          headers: { "X-Shopify-Access-Token": accessToken },
        }),
      { label: "Shop Info Fetch" }
    );

    if (!shopRes.ok) throw new Error(`Failed to fetch shop info: ${shopRes.status}`);
    const shopData = await shopRes.json();
    const shopTimeZone = shopData.shop.iana_timezone || "UTC";
    const shopCurrency = shopData.shop.currency || "USD";

    const monthRanges = getMonthRanges(shopTimeZone);
    const dailyKeys = getLastNDays(7, shopTimeZone);
    const weeklyKeys = getLast8Weeks(shopTimeZone);

    const initStats = (): OrderStats => ({
      total: 0,
      discounts: 0,
      returns: 0,
      netSales: 0,
      shipping: 0,
      taxes: 0,
      extraFees: 0,
      totalSales: 0,
      shippingRefunds: 0,
      netReturns: 0,
      totalRefund: 0,
      items: 0,
      fulfilled: 0,
      unfulfilled: 0,
      orderCount: 0,
      discountsReturned: 0,
      netDiscounts: 0,
      returnShippingCharges: 0,
      restockingFees: 0,
      returnFees: 0,
      refundDiscrepancy: 0,
      hasSubsequentEvents: false,
      eventSummary: null,
      refundsCount: 0,
      financialStatus: 'pending'
    });

    const totals: Record<string, OrderStats> = {};
    const dailyTotals: Record<string, OrderStats & CustomerData> = {};
    const weeklyTotals: Record<string, OrderStats & CustomerData> = {};
    const monthlyTotals: Record<string, OrderStats & CustomerData> = {};

    monthRanges.forEach((r) => {
      totals[r.key] = initStats();
      monthlyTotals[r.key] = {
        ...initStats(),
        newCustomers: 0,
        repeatedCustomers: 0,
        totalCustomers: 0
      };
    });

    dailyKeys.forEach((d) => (dailyTotals[d] = {
      ...initStats(),
      newCustomers: 0,
      repeatedCustomers: 0,
      totalCustomers: 0
    }));

    weeklyKeys.forEach((w) => (weeklyTotals[w] = {
      ...initStats(),
      newCustomers: 0,
      repeatedCustomers: 0,
      totalCustomers: 0
    }));

    const ordersKey = makeCacheKey(shop, "orders");
    const cacheStartTime = performance.now();
    const cacheEntry = await cacheManager.get<{ orders: any[]; lastUpdatedAt?: string }>(ordersKey);
    cacheOperationTime = performance.now() - cacheStartTime;

    const cacheHealth = cacheManager.healthReport();
    const shouldClean = cacheHealth.health < 0.7 || Math.random() < 0.1;

    if (shouldClean) {
      await cacheManager.cleanAllExpired();
      await cacheManager.enforceSizeLimit(50);
    }

    let allOrders: any[] = [];

    try {
     if (cacheEntry && cacheEntry.value.lastUpdatedAt) {
  cacheUsed = true;
  cacheHit = true;
  fetchMode = "incremental";
  
  const apiStart = performance.now();
  const result = await safeApiCall(
    () => fetchOrdersSinceGraphQL(shop, accessToken, cacheEntry.value.lastUpdatedAt!, cacheEntry.value.orders),
    { label: "Incremental Orders Fetch" }
  );
  const apiTime = performance.now() - apiStart;

  if (result.orders.length > 0) {
    apiSuccess = true;
    const orderMap = new Map();
    cacheEntry.value.orders.forEach((order: any) => orderMap.set(order.id, order));
    result.orders.forEach((order: any) => orderMap.set(order.id, order));
    allOrders = Array.from(orderMap.values());
    await cacheManager.set(ordersKey, { orders: allOrders, lastUpdatedAt: nowISO() }, 30 * 60 * 1000);
  } else {
    allOrders = cacheEntry.value.orders;
    apiSuccess = true;
  }

      } else {
        fetchMode = "full";
      }

      if (fetchMode === "full") {
        console.log(`🔄 Fetching full order history via GraphQL for periods: ${monthRanges[0].start} to ${monthRanges[monthRanges.length - 1].end}`);
        allOrders = await safeApiCall(
          () => fetchOrdersForPeriodGraphQL(
            shop,
            accessToken,
            monthRanges[0].start,
            monthRanges[monthRanges.length - 1].end
          ),
          { label: "Full Orders Fetch" }
        );
        apiSuccess = true;
        await cacheManager.set(ordersKey, { orders: allOrders, lastUpdatedAt: nowISO() }, 30 * 60 * 1000);
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
      if (cacheEntry && cacheEntry.value.orders) {
        console.warn("⚠️ Using cached orders due to API error, waiting briefly before fallback...");
        await new Promise((r) => setTimeout(r, 3000));
        allOrders = cacheEntry.value.orders;
        apiSuccess = true;
        fallbackUsed = true;
      } else {
        await cacheManager.remove(ordersKey);
        throw error;
      }
    }

    // Early return if no orders
    if (allOrders.length === 0) {
      console.log('⚠️ No orders found, returning empty analytics');
      const emptyResult: CachedAnalyticsData = {
        shop,
        totals,
        dailyTotals,
        weeklyTotals,
        monthlyTotals,
        totalOrders: 0,
        totalCustomerData: { newCustomers: 0, repeatedCustomers: 0, totalCustomers: 0 },
        monthRanges: monthRanges.map((r) => r.key),
        dailyKeys,
        weeklyKeys,
        lastUpdated: new Date().toISOString(),
        shopTimeZone,
        shopCurrency
      };
      return json(emptyResult);
    }

    console.log(`🔧 Processing ${allOrders.length} orders in optimized batches...`);

    const timing = { customerAnalysis: 0, orderProcessing: 0, calculations: 0 };
    const customerStart = performance.now();
    
    const customerOrderMap = buildCustomerOrderMap(allOrders, shopTimeZone);
    const dailyCustomerAnalytics = analyzeCustomerBehavior(customerOrderMap, shopTimeZone, dailyKeys, 'daily');
    const weeklyCustomerAnalytics = analyzeCustomerBehavior(customerOrderMap, shopTimeZone, weeklyKeys, 'weekly');
    const monthlyCustomerAnalytics = analyzeCustomerBehavior(customerOrderMap, shopTimeZone, monthRanges.map(r => r.key), 'monthly');
    
    timing.customerAnalysis = performance.now() - customerStart;

    const orderProcessStart = performance.now();
    
    const processedCount = await processOrdersInBatches(
      allOrders,
      dailyTotals,
      weeklyTotals,
      monthlyTotals,
      totals,
      dailyCustomerAnalytics,
      weeklyCustomerAnalytics,
      monthlyCustomerAnalytics,
      shopTimeZone
    );

    timing.orderProcessing = performance.now() - orderProcessStart;

    const calculationsStart = performance.now();
    const totalCustomerData = calculateOverallCustomerData(customerOrderMap);
    timing.calculations = performance.now() - calculationsStart;

    const totalLoaderTime = performance.now() - loaderStartTime;

    const result: CachedAnalyticsData = {
      shop,
      totals,
      dailyTotals,
      weeklyTotals,
      monthlyTotals,
      totalOrders: allOrders.length,
      totalCustomerData,
      monthRanges: monthRanges.map((r) => r.key),
      dailyKeys,
      weeklyKeys,
      lastUpdated: new Date().toISOString(),
      shopTimeZone,
      shopCurrency,
      _cacheInfo: {
        fetchMode,
        apiSuccess,
        cacheHealth: cacheManager.healthReport(),
        cacheStats: cacheManager.getStats(),
        cacheUsed,
        cacheHit,
        fallbackUsed,
        cacheTimestamp: cacheEntry?.timestamp,
        performance: {
          cacheOperationTime: parseFloat(cacheOperationTime.toFixed(2)),
          totalLoaderTime: parseFloat(totalLoaderTime.toFixed(2))
        }
      }
    };

    console.log(`✅ GraphQL analytics loader completed: ${processedCount}/${allOrders.length} orders processed successfully`);
    return json(result);

  } catch (error: unknown) {
    const errorMsg = `Loader error: ${error instanceof Error ? error.message : 'Unknown error'}`;
    console.error('❌ Analytics loader error:', error);
    return json({
      shop: "unknown",
      error: errorMsg,
      userMessage: "Sorry for the inconvenience! Please try refreshing the page.",
      timestamp: new Date().toISOString()
    });
  }
}