// // import { json } from "@remix-run/node";
// // import { authenticate } from "../shopify.server";
// // import { cacheManager } from "../utils/cacheManager";
// // import { makeCacheKey, nowISO, getMonthRanges, getLastNDays, getLast8Weeks } from "../utils/analyticsHelpers";
// // import { fetchOrdersSince, fetchOrdersForPeriod } from "../services/shopifyApi.server";
// // import { processOrderToStats, mergeStats } from "./financialCalculator.server";
// // import { buildCustomerOrderMap, analyzeCustomerBehavior, calculateOverallCustomerData } from "./customerAnalytics.server";
// // import type { CachedAnalyticsData, OrderStats, CustomerData } from "../types/analytics";

// // export async function analyticsLoader({ request }: { request: Request }) {
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

// //     const shopRes = await fetch(`https://${shop}/admin/api/${process.env.SHOPIFY_API_VERSION || '2024-04'}/shop.json`, {     
// //       headers: { "X-Shopify-Access-Token": accessToken },
// //     });
    
// //     if (!shopRes.ok) throw new Error(`Failed to fetch shop info: ${shopRes.status}`);
    
// //     const shopData = await shopRes.json();
// //     const shopTimeZone = shopData.shop.iana_timezone || "UTC";
// //     const shopCurrency = shopData.shop.currency || "USD";

// //     const monthRanges = getMonthRanges(shopTimeZone);
// //     const dailyKeys = getLastNDays(7, shopTimeZone);
// //     const weeklyKeys = getLast8Weeks(shopTimeZone);

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
    
// //     cacheOperationTime = performance.now() - cacheStartTime;

// //     const cacheHealth = cacheManager.healthReport();
// //     const shouldClean = cacheHealth.health < 0.7 || Math.random() < 0.1;
    
// //     if (shouldClean) {
// //       await cacheManager.cleanAllExpired();
// //       await cacheManager.enforceSizeLimit(50);
// //     }

// //     let allOrders: any[] = [];

// //     try {
// //       if (cacheEntry && cacheEntry.value.lastUpdatedAt) {
// //         cacheUsed = true;
// //         cacheHit = true;
// //         fetchMode = "incremental";

// //         const apiStart = performance.now();
// //         const result = await fetchOrdersSince(shop, accessToken, cacheEntry.value.lastUpdatedAt, cacheEntry.value.orders);
// //         const apiTime = performance.now() - apiStart;
        
// //         if (result.orders.length > 0) {
// //           apiSuccess = true;
// //           const orderMap = new Map();
// //           cacheEntry.value.orders.forEach((order: any) => orderMap.set(order.id, order));
// //           result.orders.forEach((order: any) => orderMap.set(order.id, order));
          
// //           allOrders = Array.from(orderMap.values());
// //           await cacheManager.set(ordersKey, { 
// //             orders: allOrders, 
// //             lastUpdatedAt: nowISO() 
// //           }, 30 * 60 * 1000);
// //         } else {
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

// //     const timing = {
// //       customerAnalysis: 0,
// //       orderProcessing: 0,
// //       calculations: 0
// //     };

// //     const customerStart = performance.now();
// //     const customerOrderMap = buildCustomerOrderMap(allOrders, shopTimeZone);
// //     const dailyCustomerAnalytics = analyzeCustomerBehavior(customerOrderMap, shopTimeZone, dailyKeys, 'daily');
// //     const weeklyCustomerAnalytics = analyzeCustomerBehavior(customerOrderMap, shopTimeZone, weeklyKeys, 'weekly');
// //     const monthlyCustomerAnalytics = analyzeCustomerBehavior(customerOrderMap, shopTimeZone, monthRanges.map(r => r.key), 'monthly');
// //     timing.customerAnalysis = performance.now() - customerStart;

// //     const orderProcessStart = performance.now();
    
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
// //     }
    
// //     timing.orderProcessing = performance.now() - orderProcessStart;

// //     const calculationsStart = performance.now();
// //     const totalCustomerData = calculateOverallCustomerData(customerOrderMap);
// //     timing.calculations = performance.now() - calculationsStart;

// //     const totalLoaderTime = performance.now() - loaderStartTime;
// //     const cachePerformance = cacheManager.getPerformanceReport();

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
// //         performance: {
// //           cacheOperationTime: parseFloat(cacheOperationTime.toFixed(2)),
// //           totalLoaderTime: parseFloat(totalLoaderTime.toFixed(2))
// //         }
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
// // }










































// // analyticsLoader.server.ts
// import { json } from "@remix-run/node";
// import { authenticate } from "../shopify.server";
// import { cacheManager } from "../utils/cacheManager";
// import { makeCacheKey, nowISO, getMonthRanges, getLastNDays, getLast8Weeks } from "../utils/analyticsHelpers";
// import { fetchOrdersSinceGraphQL, fetchOrdersForPeriodGraphQL } from "../services/shopifyGraphql.server";
// import { processOrderToStats, mergeStats } from "./financialCalculator.server";
// import { buildCustomerOrderMap, analyzeCustomerBehavior, calculateOverallCustomerData } from "./customerAnalytics.server";
// import type { CachedAnalyticsData, OrderStats, CustomerData } from "../types/analytics";

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

//     // Get shop info using GraphQL
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

//     const timing = { customerAnalysis: 0, orderProcessing: 0, calculations: 0 };
//     const customerStart = performance.now();
    
//     const customerOrderMap = buildCustomerOrderMap(allOrders, shopTimeZone);
//     const dailyCustomerAnalytics = analyzeCustomerBehavior(customerOrderMap, shopTimeZone, dailyKeys, 'daily');
//     const weeklyCustomerAnalytics = analyzeCustomerBehavior(customerOrderMap, shopTimeZone, weeklyKeys, 'weekly');
//     const monthlyCustomerAnalytics = analyzeCustomerBehavior(customerOrderMap, shopTimeZone, monthRanges.map(r => r.key), 'monthly');
    
//     timing.customerAnalysis = performance.now() - customerStart;

//     const orderProcessStart = performance.now();
//     const BATCH_SIZE = 500;
//     let processedCount = 0;

//     console.log(`🔧 Processing ${allOrders.length} orders from GraphQL...`);

//     for (let i = 0; i < allOrders.length; i += BATCH_SIZE) {
//       const batch = allOrders.slice(i, i + BATCH_SIZE);
      
//       batch.forEach((order: any) => {
//         try {
//           const date = new Date(order.createdAt);
//           const monthKey = date.toLocaleString("default", { month: "short", year: "numeric", timeZone: shopTimeZone });
//           const dayKey = date.toLocaleDateString("en-CA", { timeZone: shopTimeZone });
          
//           const monday = new Date(date);
//           monday.setDate(date.getDate() - ((date.getDay() + 6) % 7));
//           const weekKey = `Week of ${monday.toLocaleDateString("en-CA", { timeZone: shopTimeZone })}`;

//           const orderStats = processOrderToStats(order);

//           if (totals[monthKey]) {
//             totals[monthKey] = mergeStats(totals[monthKey], orderStats);
//           }

//           if (dailyTotals[dayKey]) {
//             dailyTotals[dayKey] = {
//               ...mergeStats(dailyTotals[dayKey], orderStats),
//               newCustomers: dailyCustomerAnalytics[dayKey]?.newCustomers || 0,
//               repeatedCustomers: dailyCustomerAnalytics[dayKey]?.repeatedCustomers || 0,
//               totalCustomers: dailyCustomerAnalytics[dayKey]?.totalCustomers || 0
//             };
//           }

//           if (weeklyTotals[weekKey]) {
//             weeklyTotals[weekKey] = {
//               ...mergeStats(weeklyTotals[weekKey], orderStats),
//               newCustomers: weeklyCustomerAnalytics[weekKey]?.newCustomers || 0,
//               repeatedCustomers: weeklyCustomerAnalytics[weekKey]?.repeatedCustomers || 0,
//               totalCustomers: weeklyCustomerAnalytics[weekKey]?.totalCustomers || 0
//             };
//           }

//           if (monthlyTotals[monthKey]) {
//             monthlyTotals[monthKey] = {
//               ...mergeStats(monthlyTotals[monthKey], orderStats),
//               newCustomers: monthlyCustomerAnalytics[monthKey]?.newCustomers || 0,
//               repeatedCustomers: monthlyCustomerAnalytics[monthKey]?.repeatedCustomers || 0,
//               totalCustomers: monthlyCustomerAnalytics[monthKey]?.totalCustomers || 0
//             };
//           }

//           processedCount++;
//         } catch (error) {
//           console.error('Error processing individual order:', error);
//         }
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

//     console.log(`✅ GraphQL analytics loader completed: ${allOrders.length} orders processed`);
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
































// core/analyticsLoader.server.ts - ENHANCED WITH GIFT CARD PROCESSING
import { json } from "@remix-run/node";
import { authenticate } from "../shopify.server";
import { cacheManager } from "../utils/cacheManager";
import { makeCacheKey, nowISO, getMonthRanges, getLastNDays, getLast8Weeks } from "../utils/analyticsHelpers";
import { fetchOrdersSinceGraphQL, fetchOrdersForPeriodGraphQL } from "../services/shopifyGraphql.server";
import { processOrderToStats, mergeStats } from "./financialCalculator.server";
import { buildCustomerOrderMap, analyzeCustomerBehavior, calculateOverallCustomerData } from "./customerAnalytics.server";
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