import type { OrderData as BaseOrderData } from './analytics';

export interface EmailOrderData extends BaseOrderData {
  // Make all the additional fields required for emails
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
  totalExtraFees?: number;
  last7DaysOrders: number;
  last7DaysRevenue: number;
  last7DaysItems: number;
  todayEventSummary?: {
    refunds: { count: number; value: number };
    exchanges: { count: number; value: number };
    partialRefunds: { count: number; value: number };
    totalEvents: number;
    netValue: number;
    
  };

  last7DaysEventSummary?: {
    refunds: { count: number; value: number };
    exchanges: { count: number; value: number };
    partialRefunds: { count: number; value: number };
    totalEvents: number;
    netValue: number;
  };
  
  last8WeeksEventSummary?: {
    refunds: { count: number; value: number };
    exchanges: { count: number; value: number };
    partialRefunds: { count: number; value: number };
    totalEvents: number;
    netValue: number;
  };
  
  last6MonthsEventSummary?: {
    refunds: { count: number; value: number };
    exchanges: { count: number; value: number };
    partialRefunds: { count: number; value: number };
    totalEvents: number;
    netValue: number;
  };
  



  
  // Last 7 Days Financial Data
  last7DaysTotalRevenue: number;
  last7DaysTotalDiscounts: number;
  last7DaysTotalReturns: number;
  last7DaysTotalExtraFees: number;
  last7DaysTotalNetSales: number;
  last7DaysTotalShipping: number;
  last7DaysTotalTaxes: number;
  last7DaysTotalTotalSales: number;
  
  // Daily Financial Data - THIS SHOULD BE AN ARRAY
  dailyFinancials: Array<{
    date: string;
    total: number;
    discounts: number;
    returns: number;
    netSales: number;
    shipping: number;
    extraFees: number;
    taxes: number;
    totalSales: number;
  }>;

  weeklyTotalOrders: number;
  weeklyTotalRevenue: number;
  weeklyTotalItems: number;


  
  weeklyTotalDiscounts: number;
  weeklyTotalReturns: number;
  weeklyTotalExtraFees: number;
  weeklyTotalNetSales: number;
  weeklyTotalShipping: number;
  weeklyTotalTaxes: number;
  weeklyTotalTotalSales: number;
  weeklyFinancials: Array<{
    week: string;
    total: number;
    discounts: number;
    returns: number;
    netSales: number;
    shipping: number;
    extraFees: number;
    taxes: number;
    totalSales: number;
  }>;
  



 
  // UPDATE MONTHLY PROPERTIES WITH ALL FIELDS:
  monthlyFinancials: {
    totalOrders: number;
    totalRevenue: number;
    totalItems: number;
    totalDiscounts: number;
    totalReturns: number;
    totalExtraFees: number;
    totalNetSales: number;
    totalShipping: number;
    totalTaxes: number;
    totalTotalSales: number;
  };
  
  monthRanges: string[];
  
  monthlyTotals: Record<string, {
    total: number;
    discounts: number;
    returns: number;
    netSales: number;
    shipping: number;
    taxes: number;
    extraFees: number;
    totalSales: number;
    orderCount: number;
    items: number;
  }>;



  todayMismatchSummary?: {
    totalMismatches: number;
    totalDifference: number;
    hasMismatches: boolean;
  };
  
  last7DaysMismatchSummary?: {
    totalMismatches: number;
    totalDifference: number;
    hasMismatches: boolean;
  };
  
  weeklyMismatchSummary?: {
    totalMismatches: number;
    totalDifference: number;
    hasMismatches: boolean;
  };
  
  monthlyMismatchSummary?: {
    totalMismatches: number;
    totalDifference: number;
    hasMismatches: boolean;
  };

daysLeftInWeek: number;


_debug?: {
    weeklyCalculation?: {
      currentWeekKey?: string;
      currentWeekRevenue?: number;
      previousWeekKey?: string;
      previousWeekRevenue?: number;
      calculatedChange?: number;
    };
    weeklyStatsKeys?: string[];
    weeklyDataAvailable?: Array<{
      week: string;
      revenue: number;
      exists: boolean;
    }>;
  };


}




  




