// import sgMail from "@sendgrid/mail";
// import { StoreEmailSettings } from "../models/StoreEmailSettings.server";
// import type { EmailOrderData } from "../types/emailAnalytics";


// import { formatWeekDisplay } from '../utils/analyticsHelpers'; // Adjust the path as needed


// // Initialize SendGrid
// if (process.env.SENDGRID_API_KEY) {
//   sgMail.setApiKey(process.env.SENDGRID_API_KEY);
// }

// export class AnalyticsEmailService {
//   private shop: string;

//   constructor(shop: string) {
//     this.shop = shop;
//   }

//   async sendDailyAnalytics(
//     analyticsData: EmailOrderData, 
//     emailOptions: {
//       bccEmails?: string[];
//     } = {}
//   ): Promise<{
//     success: boolean;
//     skipped?: boolean;
//     message: string;
//     recipients: string[];
//     recipientsCount: number;
//     result?: any;
//   }> {
//     try {
//       // Validate SendGrid configuration
//       if (!process.env.SENDGRID_API_KEY) {
//         throw new Error('Email service not configured');
//       }

//       if (!process.env.SENDGRID_FROM_EMAIL) {
//         throw new Error('Sender email not configured');
//       }

//       // Fetch store email settings
//       const settings = await StoreEmailSettings.get(this.shop);
      
//       if (!settings) {
//         throw new Error('Email settings not configured for this store');
//       }

//       if (!settings.enabled) {
//         return {
//           success: true,
//           skipped: true,
//           message: 'Email notifications are disabled',
//           recipients: [],
//           recipientsCount: 0
//         };
//       }

//       // Get all email addresses (primary + additional)
//       const allEmails = [
//         settings.fromEmail,
//         ...(settings.additionalEmails || [])
//       ].filter(email => email && email.trim() && this.isValidEmail(email));

//       if (allEmails.length === 0) {
//         throw new Error('No valid recipient email addresses configured');
//       }

//       // Build email with analytics data
//       const emailContent = this.buildAnalyticsEmail(analyticsData, this.shop);
      
//       // Use BCC approach to avoid duplicate email errors
//       const msg: any = {
//         to: process.env.SENDGRID_FROM_EMAIL,
//         from: {
//           email: process.env.SENDGRID_FROM_EMAIL,
//           name: 'Analytics Dashboard'
//         },
//         subject: `Daily Analytics Report - ${this.shop} - ${new Date().toLocaleDateString()}`,
//         html: emailContent,
//         text: this.generateTextVersion(analyticsData, this.shop),
//       };

//       // Add all recipients to BCC
//       let bccRecipients: string[] = [];
      
//       if (emailOptions.bccEmails && emailOptions.bccEmails.length > 0) {
//         bccRecipients = emailOptions.bccEmails.filter(email => 
//           email && email.trim() && this.isValidEmail(email)
//         );
//       } else {
//         bccRecipients = allEmails;
//       }

//       // Remove duplicates from BCC list
//       const uniqueBccRecipients = [...new Set(bccRecipients)];

//       if (uniqueBccRecipients.length > 0) {
//         msg.bcc = uniqueBccRecipients;
//       }

//       const result = await sgMail.send(msg);
      
//       return {
//         success: true,
//         message: `Email sent successfully to ${uniqueBccRecipients.length} recipient(s) via BCC`,
//         recipients: uniqueBccRecipients,
//         recipientsCount: uniqueBccRecipients.length,
//         result
//       };

//     } catch (error: any) {
//       console.error('🔍 DEBUG: SendGrid Error Details:', error);
//       console.error('🔍 DEBUG: SendGrid Response:', error?.response?.body);
//       console.error('🔍 DEBUG: SendGrid Code:', error?.code);
      
//       throw new Error(`Failed to send analytics email: ${error.message}`);
//     }
//   }

//   private isValidEmail(email: string): boolean {
//     const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//     return emailRegex.test(email);
//   }





// // Add this single method to your AnalyticsEmailService class

// private generateMismatchSummaryHTML(
//   mismatchSummary: { 
//     totalMismatches: number; 
//     totalDifference: number; 
//     hasMismatches: boolean; 
//   }, 
//   periodType: 'day' | 'week' | 'month'
// ): string {
//   if (!mismatchSummary.hasMismatches) {
//     return '';
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

//   return `
//     <div class="mismatch-summary-card" style="
//       border: 1px solid #e5e7eb;
//       border-radius: 8px;
//       padding: 20px;
//       margin: 16px 0;
//       background: #f8fafc;
//       border-left: 4px solid #dc2626;
//     ">
//       <h3 style="margin: 0 0 16px 0; font-size: 18px; color: #1f2937;">
//         ⚠️ Calculation Verification
//       </h3>
      
//       <div class="mismatch-summary-content" style="
//         display: flex;
//         gap: 32px;
//         margin-bottom: 16px;
//       ">
//         <div class="mismatch-metric" style="text-align: center;">
//           <div class="mismatch-value" style="
//             font-size: 24px;
//             font-weight: bold;
//             color: #dc2626;
//           ">${mismatchSummary.totalMismatches}</div>
//           <div class="mismatch-label" style="
//             font-size: 14px;
//             color: #6b7280;
//           ">${getPeriodLabel()} with Mismatches</div>
//         </div>
        
//         <div class="mismatch-metric" style="text-align: center;">
//           <div 
//             class="mismatch-value" 
//             style="
//               font-size: 24px;
//               font-weight: bold;
//               color: ${getDifferenceColor(mismatchSummary.totalDifference)};
//             "
//           >
//             ${getDifferenceText(mismatchSummary.totalDifference)}
//           </div>
//           <div class="mismatch-label" style="
//             font-size: 14px;
//             color: #6b7280;
//           ">Total Difference</div>
//         </div>
//       </div>
      
//       <div class="mismatch-note" style="
//         font-size: 14px;
//         font-style: italic;
//         color: #dc2626;
//       ">
//         Found ${mismatchSummary.totalMismatches} ${getPeriodLabel().toLowerCase()} with calculation discrepancies
//       </div>
//     </div>
//   `;
// }





//   private buildAnalyticsEmail(data: EmailOrderData, shop: string): string {
//     // SAFE FORMATTING FUNCTIONS WITH UNDEFINED HANDLING
//     const formatCurrency = (amount: number | undefined) => {
//       const safeAmount = amount || 0;
//       return safeAmount.toLocaleString('en-US', { 
//         style: 'currency', 
//         currency: data.shopCurrency || 'USD',
//         minimumFractionDigits: 2 
//       });
//     };
    
//     const formatNumber = (num: number | undefined) => {
//       const safeNum = num || 0;
//       return safeNum.toLocaleString('en-US');
//     };

//     const formatPercent = (num: number | undefined) => {
//       const safeNum = num || 0;
//       return `${safeNum.toFixed(1)}%`;
//     };

//     // Helper function to format date display
//     const formatDateDisplay = (dateStr: string) => {
//       const date = new Date(dateStr + 'T00:00:00');
//       return date.toLocaleDateString('en-US', { 
//         month: 'short', 
//         day: 'numeric'
//       });
//     };

//     const getDayName = (dateStr: string) => {
//       const date = new Date(dateStr + 'T00:00:00');
//       return date.toLocaleDateString('en-US', { 
//         weekday: 'short'
//       });
//     };

//     const currentDate = data.currentDateInShopTZ || new Date().toISOString().split('T')[0];
//     const timestamp = new Date().toLocaleDateString() + ' at ' + new Date().toLocaleTimeString();


// console.log('🔍 [EMAIL DEBUG] Checking mismatch data in email template:');
//   console.log('Today Mismatch:', data.todayMismatchSummary);
//   console.log('Last 7 Days Mismatch:', data.last7DaysMismatchSummary);
//   console.log('Weekly Mismatch:', data.weeklyMismatchSummary);
//   console.log('Monthly Mismatch:', data.monthlyMismatchSummary);

//   // Check if we have the data at all
//   console.log('🔍 [EMAIL DEBUG] Full data keys:', Object.keys(data));
//   console.log('🔍 [EMAIL DEBUG] Has todayMismatchSummary:', 'todayMismatchSummary' in data);


//     return `
// <!DOCTYPE html>
// <html>
// <head>
//   <meta charset="utf-8">
//   <meta name="viewport" content="width=device-width, initial-scale=1.0">
//   <title>Daily Analytics Report - ${shop}</title>
// </head>
// <body>
//   <div style="max-width: 1000px; margin: 0 auto; font-family: Arial, sans-serif;">
    
//     <!-- HEADER -->
//     <div style="background: #2c3e50; color: white; padding: 30px; text-align: center;">
//       <h1 style="margin: 0 0 10px 0;">📊 Daily Analytics Report</h1>
//       <div style="color: rgba(255,255,255,0.9);">${shop} • ${timestamp}</div>
//       <div style="color: rgba(255,255,255,0.9);">Store Timezone: ${data.shopTimezone} • Currency: ${data.shopCurrency}</div>
//     </div>

//     <!-- TODAY'S PERFORMANCE -->
//     <div style="padding: 25px; border-bottom: 2px solid #eee;">
//       <h2 style="color: #2c3e50; margin: 0 0 20px 0;">🎯 Today's Performance (${formatDateDisplay(currentDate)})</h2>


//  ${data.todayMismatchSummary ? this.generateMismatchSummaryHTML(data.todayMismatchSummary, 'day') : ''}

      
//       <!-- Primary Metrics -->
//       <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; margin: 20px 0;">
//         <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; text-align: center;">
//           <div style="font-size: 24px; font-weight: bold; color: #2c3e50;">${formatNumber(data.todayOrders)}</div>
//           <div style="color: #666; font-weight: 600;">Today's Orders</div>
//         </div>
        
//         <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; text-align: center;">
//           <div style="font-size: 24px; font-weight: bold; color: #2c3e50;">${formatCurrency(data.todayRevenue)}</div>
//           <div style="color: #666; font-weight: 600;">Today's Total Sales</div>
//         </div>
        
//         <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; text-align: center;">
//           <div style="font-size: 24px; font-weight: bold; color: #2c3e50;">${formatNumber(data.todayItems)}</div>
//           <div style="color: #666; font-weight: 600;">Items Ordered</div>
//         </div>
//       </div>

//       <!-- Fulfillment Metrics -->
//       <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 15px; margin: 20px 0;">
//         <div style="background: #e8f5e8; padding: 15px; border-radius: 6px; text-align: center;">
//           <div style="font-size: 20px; font-weight: bold; color: #27ae60;">${formatNumber(data.todayFulfilled)}</div>
//           <div style="color: #666; font-size: 12px; font-weight: 600;">FULFILLED TODAY</div>
//         </div>
        
//         <div style="background: #ffe8e8; padding: 15px; border-radius: 6px; text-align: center;">
//           <div style="font-size: 20px; font-weight: bold; color: #e74c3c;">${formatNumber(data.todayUnfulfilled)}</div>
//           <div style="color: #666; font-size: 12px; font-weight: 600;">UNFULFILLED TODAY</div>
//         </div>
        
//         <div style="background: #e8f5e8; padding: 15px; border-radius: 6px; text-align: center;">
//           <div style="font-size: 20px; font-weight: bold; color: #27ae60;">${formatNumber(data.last7DaysFulfilled)}</div>
//           <div style="color: #666; font-size: 12px; font-weight: 600;">FULFILLED</div>
//           <div style="color: #999; font-size: 11px;">Last 7 Days</div>
//         </div>
        
//         <div style="background: #ffe8e8; padding: 15px; border-radius: 6px; text-align: center;">
//           <div style="font-size: 20px; font-weight: bold; color: #e74c3c;">${formatNumber(data.last7DaysUnfulfilled)}</div>
//           <div style="color: #666; font-size: 12px; font-weight: 600;">UNFULFILLED</div>
//           <div style="color: #999; font-size: 11px;">Last 7 Days</div>
//         </div>
//       </div>
//     </div>


//       <!-- Event Summary Details -->
//       ${data.todayEventSummary && data.todayEventSummary.totalEvents > 0 ? `
//         <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; border: 1px solid #dee2e6;">
//           <h3 style="margin: 0 0 20px 0; color: #2c3e50; text-align: center;">
//             Order Adjustments (${data.todayEventSummary.totalEvents} event${data.todayEventSummary.totalEvents !== 1 ? 's' : ''})
//           </h3>
          
//           <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 15px;">
//             ${data.todayEventSummary.refunds.count > 0 ? `
//               <div style="background: white; padding: 15px; border-radius: 6px; text-align: center; border: 1px solid #e9ecef;">
//                 <div style="color: #666; font-size: 12px; font-weight: 600; margin-bottom: 8px;">Full Refunds</div>
//                 <div style="font-size: 18px; font-weight: bold; color: #dc3545;">-${formatCurrency(Math.abs(data.todayEventSummary.refunds.value))}</div>
//                 <div style="color: #999; font-size: 11px; margin-top: 5px;">
//                   ${data.todayEventSummary.refunds.count} refund${data.todayEventSummary.refunds.count !== 1 ? 's' : ''}
//                 </div>
//               </div>
//             ` : ''}
            
//             ${data.todayEventSummary.partialRefunds.count > 0 ? `
//               <div style="background: white; padding: 15px; border-radius: 6px; text-align: center; border: 1px solid #e9ecef;">
//                 <div style="color: #666; font-size: 12px; font-weight: 600; margin-bottom: 8px;">Partial Refunds</div>
//                 <div style="font-size: 18px; font-weight: bold; color: #fd7e14;">-${formatCurrency(Math.abs(data.todayEventSummary.partialRefunds.value))}</div>
//                 <div style="color: #999; font-size: 11px; margin-top: 5px;">
//                   ${data.todayEventSummary.partialRefunds.count} refund${data.todayEventSummary.partialRefunds.count !== 1 ? 's' : ''}
//                 </div>
//               </div>
//             ` : ''}
            
//             ${data.todayEventSummary.exchanges.count > 0 ? `
//               <div style="background: white; padding: 15px; border-radius: 6px; text-align: center; border: 1px solid #e9ecef;">
//                 <div style="color: #666; font-size: 12px; font-weight: 600; margin-bottom: 8px;">Exchanges</div>
//                 <div style="font-size: 18px; font-weight: bold; color: #6f42c1;">-${formatCurrency(Math.abs(data.todayEventSummary.exchanges.value))}</div>
//                 <div style="color: #999; font-size: 11px; margin-top: 5px;">
//                   ${data.todayEventSummary.exchanges.count} exchange${data.todayEventSummary.exchanges.count !== 1 ? 's' : ''}
//                 </div>
//               </div>
//             ` : ''}
            
//             <div style="background: white; padding: 15px; border-radius: 6px; text-align: center; border: 1px solid #e9ecef;">
//               <div style="color: #666; font-size: 12px; font-weight: 600; margin-bottom: 8px;">Net Impact</div>
//               <div style="font-size: 18px; font-weight: bold; color: #2c3e50;">-${formatCurrency(Math.abs(data.todayEventSummary.netValue))}</div>
//               <div style="color: #999; font-size: 11px; margin-top: 5px;">
//                 across ${data.todayEventSummary.totalEvents} event${data.todayEventSummary.totalEvents !== 1 ? 's' : ''}
//               </div>
//             </div>
//           </div>
//         </div>
//       ` : `
//         <div style="background: #e8f5e8; padding: 15px; border-radius: 8px; text-align: center; border-left: 4px solid #28a745;">
//           <div style="color: #155724; font-weight: 600;">No order adjustments today</div>
//           <div style="color: #999; font-size: 12px; margin-top: 5px;">All orders processed without refunds or exchanges</div>
//         </div>
//       `}



//     <!-- LAST 7 DAYS PERFORMANCE -->
//     <!-- LAST 7 DAYS PERFORMANCE -->
// <div style="padding: 25px; border-bottom: 2px solid #eee;">
//   <h2 style="color: #2c3e50; margin: 0 0 20px 0;">📈 Last 7 Days Performance</h2>
  
//   <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 15px;">
//     <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; text-align: center;">
//       <div style="font-size: 20px; font-weight: bold; color: #2c3e50;">${formatNumber(data.last7DaysOrders)}</div>
//       <div style="color: #666; font-weight: 600;">TOTAL ORDERS</div>
//     </div>
    
//     <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; text-align: center;">
//       <div style="font-size: 20px; font-weight: bold; color: #2c3e50;">${formatCurrency(data.last7DaysRevenue)}</div>
//       <div style="color: #666; font-weight: 600;">TOTAL SALES</div>
//     </div>
    
//     <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; text-align: center;">
//       <div style="font-size: 20px; font-weight: bold; color: #2c3e50;">${formatNumber(data.last7DaysItems)}</div>
//       <div style="color: #666; font-weight: 600;">TOTAL ITEMS</div>
//     </div>
    
//     <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; text-align: center;">
//       <div style="font-size: 20px; font-weight: bold; color: #2c3e50;">${formatCurrency(data.averageDailyRevenue)}</div>
//       <div style="color: #666; font-weight: 600;">AVG DAILY SALES</div>
//     </div>
//   </div>
// </div>



// <!-- DAILY BREAKDOWN -->
//     <div style="padding: 25px; border-bottom: 2px solid #eee;">
//       <h2 style="color: #2c3e50; margin: 0 0 20px 0;">📅 Daily Breakdown (Last 7 Days)</h2>
      
//       <div style="display: grid; grid-template-columns: repeat(7, 1fr); gap: 10px;">
//         ${(data.dailySales || []).map(day => {
//           const isToday = day.date === currentDate;
//           return `
//             <div style="background: ${isToday ? '#e3f2fd' : '#f8f9fa'}; padding: 15px; border-radius: 6px; text-align: center; border: 1px solid ${isToday ? '#2196f3' : '#e9ecef'};">
//               <div style="font-weight: bold; color: #2c3e50;">${formatDateDisplay(day.date)}</div>
//               <div style="color: #666; font-size: 12px; margin-bottom: 8px;">${getDayName(day.date)}</div>
//               <div style="margin: 5px 0;">
//                 <span style="color: #666; font-size: 11px;">ORDERS</span>
//                 <div style="font-weight: bold; color: #2c3e50;">${formatNumber(day.orders)}</div>
//               </div>
//               <div style="margin: 5px 0;">
//                 <span style="color: #666; font-size: 11px;">TOTAL SALES</span>
//                 <div style="font-weight: bold; color: #2c3e50;">${formatCurrency(day.revenue)}</div>
//               </div>
//               <div style="margin: 5px 0;">
//                 <span style="color: #666; font-size: 11px;">ITEMS</span>
//                 <div style="font-weight: bold; color: #2c3e50;">${formatNumber(day.items)}</div>
//               </div>
//             </div>
//           `;
//         }).join('')}
//       </div>
//     </div>


//         <!-- LAST 7 DAYS: REFUNDS, EXCHANGES & ADJUSTMENTS -->
//     <div style="padding: 25px; border-bottom: 2px solid #eee;">
//       <h2 style="color: #2c3e50; margin: 0 0 20px 0;">📊 Last 7 Days: Refunds, Exchanges & Adjustments</h2>
      
//       ${data.last7DaysEventSummary && data.last7DaysEventSummary.totalEvents > 0 ? `
//         <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; border: 1px solid #dee2e6;">
//           <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 15px;">
//             ${data.last7DaysEventSummary.refunds.count > 0 ? `
//               <div style="background: white; padding: 15px; border-radius: 6px; text-align: center; border: 1px solid #e9ecef;">
//                 <div style="color: #666; font-size: 12px; font-weight: 600; margin-bottom: 8px;">Full Refunds</div>
//                 <div style="font-size: 18px; font-weight: bold; color: #dc3545;">-${formatCurrency(Math.abs(data.last7DaysEventSummary.refunds.value))}</div>
//                 <div style="color: #999; font-size: 11px; margin-top: 5px;">${data.last7DaysEventSummary.refunds.count} refunds</div>
//               </div>
//             ` : ''}
            
//             ${data.last7DaysEventSummary.partialRefunds.count > 0 ? `
//               <div style="background: white; padding: 15px; border-radius: 6px; text-align: center; border: 1px solid #e9ecef;">
//                 <div style="color: #666; font-size: 12px; font-weight: 600; margin-bottom: 8px;">Partial Refunds</div>
//                 <div style="font-size: 18px; font-weight: bold; color: #fd7e14;">-${formatCurrency(Math.abs(data.last7DaysEventSummary.partialRefunds.value))}</div>
//                 <div style="color: #999; font-size: 11px; margin-top: 5px;">${data.last7DaysEventSummary.partialRefunds.count} refunds</div>
//               </div>
//             ` : ''}
            
//             ${data.last7DaysEventSummary.exchanges.count > 0 ? `
//               <div style="background: white; padding: 15px; border-radius: 6px; text-align: center; border: 1px solid #e9ecef;">
//                 <div style="color: #666; font-size: 12px; font-weight: 600; margin-bottom: 8px;">Exchanges</div>
//                 <div style="font-size: 18px; font-weight: bold; color: #6f42c1;">-${formatCurrency(Math.abs(data.last7DaysEventSummary.exchanges.value))}</div>
//                 <div style="color: #999; font-size: 11px; margin-top: 5px;">${data.last7DaysEventSummary.exchanges.count} exchanges</div>
//               </div>
//             ` : ''}
            
//             <div style="background: white; padding: 15px; border-radius: 6px; text-align: center; border: 1px solid #e9ecef;">
//               <div style="color: #666; font-size: 12px; font-weight: 600; margin-bottom: 8px;">Net Impact</div>
//               <div style="font-size: 18px; font-weight: bold; color: #2c3e50;">-${formatCurrency(Math.abs(data.last7DaysEventSummary.netValue))}</div>
//               <div style="color: #999; font-size: 11px; margin-top: 5px;">across ${data.last7DaysEventSummary.totalEvents} events</div>
//             </div>
//           </div>
//         </div>
//       ` : `
//         <div style="background: #e8f5e8; padding: 15px; border-radius: 8px; text-align: center;">
//           <div style="color: #155724; font-weight: 600;">No adjustments in the last 7 days</div>
//         </div>
//       `}
//     </div>

//         <!-- WEEK-OVER-WEEK INSIGHT -->
//     <div style="padding: 25px; border-bottom: 2px solid #eee;">
//       <h2 style="color: #2c3e50; margin: 0 0 20px 0;">📊 Week-over-Week Insight</h2>
      
//       <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 20px;">
//         <!-- Revenue Change vs Last Week -->
//         <div style="background: ${data.revenueChangeVsLastWeek >= 0 ? '#e8f5e8' : '#ffebee'}; padding: 20px; border-radius: 8px; text-align: center; border-left: 4px solid ${data.revenueChangeVsLastWeek >= 0 ? '#28a745' : '#dc3545'};">
//           <h3 style="margin: 0 0 10px 0; color: #2c3e50;">Week-over-Week Revenue Change</h3>
//           <div style="font-size: 24px; font-weight: bold; color: ${data.revenueChangeVsLastWeek >= 0 ? '#28a745' : '#dc3545'};">
//             ${data.revenueChangeVsLastWeek >= 0 ? '↗' : '↘'} ${Math.abs(data.revenueChangeVsLastWeek || 0).toFixed(1)}%
//           </div>
//           <div style="color: #666; margin-top: 8px;">
//             ${data.revenueChangeVsLastWeek >= 0 ? 'Increase' : 'Decrease'} from last week
//           </div>
//         </div>

//         <!-- Performance Summary -->
//         <div style="background: #e3f2fd; padding: 20px; border-radius: 8px; border-left: 4px solid #2196f3;">
//           <h3 style="margin: 0 0 15px 0; color: #2c3e50;">Performance Insight</h3>
//           <div style="color: #666; line-height: 1.6;">
//             ${data.revenueChangeVsYesterday > 0 ? 
//               `📈 Revenue increased ${Math.abs(data.revenueChangeVsYesterday).toFixed(1)}% from yesterday` : 
//               data.revenueChangeVsYesterday < 0 ? 
//               `📉 Revenue decreased ${Math.abs(data.revenueChangeVsYesterday).toFixed(1)}% from yesterday` : 
//               '📊 Revenue unchanged from yesterday'
//             }
//             ${data.revenueChangeVsLastWeek > 0 ? 
//               `<br>🚀 Week-over-week revenue increased ${Math.abs(data.revenueChangeVsLastWeek || 0).toFixed(1)}%` : 
//               data.revenueChangeVsLastWeek < 0 ? 
//               `<br>⚠️ Week-over-week revenue decreased ${Math.abs(data.revenueChangeVsLastWeek || 0).toFixed(1)}%` : 
//               ''
//             }
//             ${data.bestDay && data.bestDay.revenue > data.todayRevenue ? 
//               `<br>🏆 Best day: ${formatDateDisplay(data.bestDay.date)} with ${formatCurrency(data.bestDay.revenue)}` : 
//               ''
//             }
//           </div>
//         </div>
//       </div>

//       <!-- Additional Metrics -->
//       <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 15px; margin-top: 20px;">
//         <div style="background: #f8f9fa; padding: 15px; border-radius: 6px; text-align: center;">
//           <div style="font-size: 16px; font-weight: bold; color: #2c3e50;">${formatCurrency(data.averageDailyRevenue)}</div>
//           <div style="color: #666; font-size: 12px;">Average Daily Revenue</div>
//         </div>
        
//         <div style="background: #f8f9fa; padding: 15px; border-radius: 6px; text-align: center;">
//           <div style="font-size: 16px; font-weight: bold; color: #2c3e50;">${formatNumber(data.averageOrderValue)}</div>
//           <div style="color: #666; font-size: 12px;">Average Order Value</div>
//         </div>
        
//         <div style="background: #f8f9fa; padding: 15px; border-radius: 6px; text-align: center;">
//           <div style="font-size: 16px; font-weight: bold; color: #2c3e50;">${formatNumber(data.averageItemsPerOrder)}</div>
//           <div style="color: #666; font-size: 12px;">Avg Items/Order</div>
//         </div>
//       </div>
//     </div>

    
//     <!-- CUSTOMER INSIGHTS -->
//     <div style="padding: 25px; border-bottom: 2px solid #eee;">
//       <h2 style="color: #2c3e50; margin: 0 0 20px 0;">👥 Customer Insights</h2>
      
//       <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 15px;">
//         <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; text-align: center;">
//           <div style="font-size: 20px; font-weight: bold; color: #2c3e50;">${formatNumber(data.totalCustomers)}</div>
//           <div style="color: #666; font-weight: 600;">TOTAL CUSTOMERS</div>
//         </div>
        
//         <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; text-align: center;">
//           <div style="font-size: 20px; font-weight: bold; color: #2c3e50;">${formatNumber(data.newCustomers)}</div>
//           <div style="color: #666; font-weight: 600;">NEW CUSTOMERS</div>
//         </div>
        
//         <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; text-align: center;">
//           <div style="font-size: 20px; font-weight: bold; color: #2c3e50;">${formatNumber(data.repeatCustomers)}</div>
//           <div style="color: #666; font-weight: 600;">REPEAT CUSTOMERS</div>
//         </div>
        
//         <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; text-align: center;">
//           <div style="font-size: 20px; font-weight: bold; color: #2c3e50;">
//             ${data.totalCustomers > 0 ? formatPercent((data.repeatCustomers / data.totalCustomers) * 100) : '0.0%'}
//           </div>
//           <div style="color: #666; font-weight: 600;">REPEAT CUSTOMER RATE</div>
//         </div>
//       </div>
//     </div>

//         <!-- LAST 7 DAYS CUSTOMER INSIGHTS -->
//     <div style="padding: 25px; border-bottom: 2px solid #eee;">
//       <h2 style="color: #2c3e50; margin: 0 0 20px 0;">👥 Last 7 Days Customer Insights</h2>
      
//       <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 15px;">
//         <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; text-align: center;">
//           <div style="font-size: 20px; font-weight: bold; color: #2c3e50;">${formatNumber(data.last7DaysTotalCustomers)}</div>
//           <div style="color: #666; font-weight: 600;">7-DAY TOTAL CUSTOMERS</div>
//         </div>
        
//         <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; text-align: center;">
//           <div style="font-size: 20px; font-weight: bold; color: #2c3e50;">${formatNumber(data.last7DaysNewCustomers)}</div>
//           <div style="color: #666; font-weight: 600;">7-DAY NEW CUSTOMERS</div>
//         </div>
        
//         <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; text-align: center;">
//           <div style="font-size: 20px; font-weight: bold; color: #2c3e50;">${formatNumber(data.last7DaysRepeatCustomers)}</div>
//           <div style="color: #666; font-weight: 600;">7-DAY REPEAT CUSTOMERS</div>
//         </div>
        
//         <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; text-align: center;">
//           <div style="font-size: 20px; font-weight: bold; color: #2c3e50;">${formatPercent(data.last7DaysRepeatCustomerRate)}</div>
//           <div style="color: #666; font-weight: 600;">7-DAY REPEAT RATE</div>
//         </div>
//       </div>
//     </div>



//     <!-- LAST 7 DAYS FINANCIAL BREAKDOWN -->
//           <!-- LAST 7 DAYS FINANCIAL BREAKDOWN -->
//     <div style="padding: 25px; border-bottom: 2px solid #eee;">
//       <h2 style="color: #2c3e50; margin: 0 0 20px 0;">💰 Last 7 Days Financial Breakdown</h2>


// ${data.last7DaysMismatchSummary ? this.generateMismatchSummaryHTML(data.last7DaysMismatchSummary, 'day') : ''}


//       <!-- Financial Summary -->
//       <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 15px; margin-bottom: 25px;">
//         <div style="background: #f8f9fa; padding: 15px; border-radius: 6px;">
//           <div style="font-size: 18px; font-weight: bold; color: #2c3e50;">${formatCurrency(data.last7DaysTotalRevenue)}</div>
//           <div style="color: #666; font-size: 12px;">Gross Sales</div>
//           <div style="color: #999; font-size: 11px;">7 Days</div>
//         </div>
        
//         <div style="background: #f8f9fa; padding: 15px; border-radius: 6px;">
//           <div style="font-size: 18px; font-weight: bold; color: #2c3e50;">${formatCurrency(data.last7DaysTotalDiscounts)}</div>
//           <div style="color: #666; font-size: 12px;">Total Discounts</div>
//           <div style="color: #999; font-size: 11px;">${formatPercent(data.last7DaysTotalDiscounts / data.last7DaysTotalRevenue * 100)} of gross</div>
//         </div>
        
//         <div style="background: #f8f9fa; padding: 15px; border-radius: 6px;">
//           <div style="font-size: 18px; font-weight: bold; color: #2c3e50;">${formatCurrency(data.last7DaysTotalReturns)}</div>
//           <div style="color: #666; font-size: 12px;">Returns & Refunds</div>
//           <div style="color: #999; font-size: 11px;">${formatPercent(data.last7DaysTotalReturns / data.last7DaysTotalRevenue * 100)} of gross</div>
//         </div>
        
//         <div style="background: #f8f9fa; padding: 15px; border-radius: 6px;">
//           <div style="font-size: 18px; font-weight: bold; color: #2c3e50;">${formatCurrency(data.last7DaysTotalExtraFees)}</div>
//           <div style="color: #666; font-size: 12px;">Return Fees</div>
//           <div style="color: #999; font-size: 11px;">${formatPercent(data.last7DaysTotalExtraFees / data.last7DaysTotalRevenue * 100)} of gross</div>
//         </div>
        
//         <div style="background: #f8f9fa; padding: 15px; border-radius: 6px;">
//           <div style="font-size: 18px; font-weight: bold; color: #2c3e50;">${formatCurrency(data.last7DaysTotalNetSales)}</div>
//           <div style="color: #666; font-size: 12px;">Net Sales</div>
//           <div style="color: #999; font-size: 11px;">After ALL deductions</div>
//         </div>
        
//         <div style="background: #f8f9fa; padding: 15px; border-radius: 6px;">
//           <div style="font-size: 18px; font-weight: bold; color: #2c3e50;">${formatCurrency(data.last7DaysTotalShipping)}</div>
//           <div style="color: #666; font-size: 12px;">Shipping Charges</div>
//           <div style="color: #999; font-size: 11px;">${formatPercent(data.last7DaysTotalShipping / data.last7DaysTotalNetSales * 100)} of net sales</div>
//         </div>
        
//         <div style="background: #f8f9fa; padding: 15px; border-radius: 6px;">
//           <div style="font-size: 18px; font-weight: bold; color: #2c3e50;">${formatCurrency(data.last7DaysTotalTaxes)}</div>
//           <div style="color: #666; font-size: 12px;">Taxes Collected</div>
//           <div style="color: #999; font-size: 11px;">${formatPercent(data.last7DaysTotalTaxes / data.last7DaysTotalNetSales * 100)} of net sales</div>
//         </div>
        
//         <div style="background: #f8f9fa; padding: 15px; border-radius: 6px;">
//           <div style="font-size: 18px; font-weight: bold; color: #2c3e50;">${formatCurrency(data.last7DaysTotalTotalSales)}</div>
//           <div style="color: #666; font-size: 12px;">Total Sales</div>
//           <div style="color: #999; font-size: 11px;">Final amount</div>
//         </div>
//       </div>

//       <!-- Daily Financial Details -->
//       <h3 style="margin: 30px 0 15px 0;">Daily Financial Details</h3>
//       <div style="display: grid; grid-template-columns: repeat(7, 1fr); gap: 10px;">
//         ${(data.dailyFinancials || []).map((day, index) => {
//           const isToday = day.date === currentDate;
          
//           return `
//             <div style="background: ${isToday ? '#e3f2fd' : '#f8f9fa'}; padding: 15px; border-radius: 6px; border: 1px solid ${isToday ? '#2196f3' : '#e9ecef'};">
//               <div style="font-weight: bold; color: #2c3e50;">${formatDateDisplay(day.date)}</div>
//               <div style="color: #666; font-size: 12px; margin-bottom: 8px;">${getDayName(day.date)}</div>
              
//               <div style="margin: 3px 0; font-size: 11px;">
//                 <span style="color: #666;">Gross Sales:</span>
//                 <div style="font-weight: bold;">${formatCurrency(day.total)}</div>
//               </div>
              
//               <div style="margin: 3px 0; font-size: 11px;">
//                 <span style="color: #666;">Discounts:</span>
//                 <div style="font-weight: bold;">${formatCurrency(day.discounts)}</div>
//               </div>
              
//               <div style="margin: 3px 0; font-size: 11px;">
//                 <span style="color: #666;">Returns:</span>
//                 <div style="font-weight: bold;">${formatCurrency(day.returns)}</div>
//               </div>
              
//               <div style="margin: 3px 0; font-size: 11px;">
//                 <span style="color: #666;">Net Sales:</span>
//                 <div style="font-weight: bold;">${formatCurrency(day.netSales)}</div>
//               </div>
              
//               <div style="margin: 3px 0; font-size: 11px;">
//                 <span style="color: #666;">Shipping:</span>
//                 <div style="font-weight: bold;">${formatCurrency(day.shipping)}</div>
//               </div>
              
//               <div style="margin: 3px 0; font-size: 11px;">
//                 <span style="color: #666;">Return Fees:</span>
//                 <div style="font-weight: bold;">${formatCurrency(day.extraFees)}</div>
//               </div>
              
//               <div style="margin: 3px 0; font-size: 11px;">
//                 <span style="color: #666;">Taxes:</span>
//                 <div style="font-weight: bold;">${formatCurrency(day.taxes)}</div>
//               </div>
              
//               <div style="margin: 3px 0; font-size: 11px;">
//                 <span style="color: #666;">Total Sales:</span>
//                 <div style="font-weight: bold;">${formatCurrency(day.totalSales)}</div>
//               </div>
//             </div>
//           `;
//         }).join('')}
//       </div>
//     </div>


//     <!-- WEEKLY PERFORMANCE (LAST 8 WEEKS) -->
//     <div style="padding: 25px; border-bottom: 2px solid #eee;">
//       <h2 style="color: #2c3e50; margin: 0 0 20px 0;">📅 Weekly Performance (Last 8 Weeks)</h2>


//           ${data.weeklyMismatchSummary ? this.generateMismatchSummaryHTML(data.weeklyMismatchSummary, 'week') : ''}

      
//       <!-- Weekly Summary -->
//       <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 15px; margin-bottom: 25px;">
//         <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; text-align: center;">
//           <div style="font-size: 20px; font-weight: bold; color: #2c3e50;">${formatNumber(data.totalOrders)}</div>
//           <div style="color: #666; font-weight: 600;">Total Orders</div>
//         </div>
        
//         <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; text-align: center;">
//           <div style="font-size: 20px; font-weight: bold; color: #2c3e50;">${formatCurrency(data.totalRevenue)}</div>
//           <div style="color: #666; font-weight: 600;">Total Revenue</div>
//         </div>
        
//         <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; text-align: center;">
//           <div style="font-size: 20px; font-weight: bold; color: #2c3e50;">${formatNumber(data.totalItems)}</div>
//           <div style="color: #666; font-weight: 600;">Total Items</div>
//         </div>
        
//         <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; text-align: center;">
//           <div style="font-size: 20px; font-weight: bold; color: #2c3e50;">${formatCurrency(data.totalRevenue / 8)}</div>
//           <div style="color: #666; font-weight: 600;">Avg Weekly Revenue</div>
//         </div>
//       </div>

//       <!-- Weekly Breakdown -->
//       <h3 style="margin: 30px 0 15px 0;">Weekly Breakdown</h3>
//       <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 15px;">
//         ${(data.weeklySales || []).slice(0, 8).map((week, index) => {
//           const isCurrentWeek = index === (data.weeklySales?.length || 0) - 1;
          
//           return `
//             <div style="background: ${isCurrentWeek ? '#e3f2fd' : '#f8f9fa'}; padding: 15px; border-radius: 6px; text-align: center; border: 1px solid ${isCurrentWeek ? '#2196f3' : '#e9ecef'};">
//               <div style="font-weight: bold; color: #2c3e50; font-size: 14px;">${formatWeekDisplay(week.week)}</div>
//               <div style="margin: 8px 0;">
//                 <span style="color: #666; font-size: 11px;">Orders</span>
//                 <div style="font-weight: bold; color: #2c3e50;">${formatNumber(week.orders)}</div>
//               </div>
//               <div style="margin: 8px 0;">
//                 <span style="color: #666; font-size: 11px;">Total Sales</span>
//                 <div style="font-weight: bold; color: #2c3e50;">${formatCurrency(week.revenue)}</div>
//               </div>
//               <div style="margin: 8px 0;">
//                 <span style="color: #666; font-size: 11px;">Items</span>
//                 <div style="font-weight: bold; color: #2c3e50;">${formatNumber(week.items)}</div>
//               </div>
//             </div>
//           `;
//         }).join('')}
//       </div>
//     </div>



//         <!-- 8-WEEK PERIOD: ORDER EVENTS & FINANCIAL ADJUSTMENTS -->
//     <div style="padding: 25px; border-bottom: 2px solid #eee;">
//       <h2 style="color: #2c3e50; margin: 0 0 20px 0;">📅 8-Week Period: Order Events & Financial Adjustments</h2>
      
//       ${data.last8WeeksEventSummary && data.last8WeeksEventSummary.totalEvents > 0 ? `
//         <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; border: 1px solid #dee2e6;">
//           <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 15px;">
//             ${data.last8WeeksEventSummary.refunds.count > 0 ? `
//               <div style="background: white; padding: 15px; border-radius: 6px; text-align: center; border: 1px solid #e9ecef;">
//                 <div style="color: #666; font-size: 12px; font-weight: 600; margin-bottom: 8px;">Full Refunds</div>
//                 <div style="font-size: 18px; font-weight: bold; color: #dc3545;">-${formatCurrency(Math.abs(data.last8WeeksEventSummary.refunds.value))}</div>
//                 <div style="color: #999; font-size: 11px; margin-top: 5px;">${data.last8WeeksEventSummary.refunds.count} refunds</div>
//               </div>
//             ` : ''}
            
//             ${data.last8WeeksEventSummary.partialRefunds.count > 0 ? `
//               <div style="background: white; padding: 15px; border-radius: 6px; text-align: center; border: 1px solid #e9ecef;">
//                 <div style="color: #666; font-size: 12px; font-weight: 600; margin-bottom: 8px;">Partial Refunds</div>
//                 <div style="font-size: 18px; font-weight: bold; color: #fd7e14;">-${formatCurrency(Math.abs(data.last8WeeksEventSummary.partialRefunds.value))}</div>
//                 <div style="color: #999; font-size: 11px; margin-top: 5px;">${data.last8WeeksEventSummary.partialRefunds.count} refunds</div>
//               </div>
//             ` : ''}
            
//             ${data.last8WeeksEventSummary.exchanges.count > 0 ? `
//               <div style="background: white; padding: 15px; border-radius: 6px; text-align: center; border: 1px solid #e9ecef;">
//                 <div style="color: #666; font-size: 12px; font-weight: 600; margin-bottom: 8px;">Exchanges</div>
//                 <div style="font-size: 18px; font-weight: bold; color: #6f42c1;">-${formatCurrency(Math.abs(data.last8WeeksEventSummary.exchanges.value))}</div>
//                 <div style="color: #999; font-size: 11px; margin-top: 5px;">${data.last8WeeksEventSummary.exchanges.count} exchanges</div>
//               </div>
//             ` : ''}
            
//             <div style="background: white; padding: 15px; border-radius: 6px; text-align: center; border: 1px solid #e9ecef;">
//               <div style="color: #666; font-size: 12px; font-weight: 600; margin-bottom: 8px;">Net Impact</div>
//               <div style="font-size: 18px; font-weight: bold; color: #2c3e50;">-${formatCurrency(Math.abs(data.last8WeeksEventSummary.netValue))}</div>
//               <div style="color: #999; font-size: 11px; margin-top: 5px;">across ${data.last8WeeksEventSummary.totalEvents} events</div>
//             </div>
//           </div>
//         </div>
//       ` : `
//         <div style="background: #e8f5e8; padding: 15px; border-radius: 8px; text-align: center;">
//           <div style="color: #155724; font-weight: 600;">No adjustments in the last 8 weeks</div>
//         </div>
//       `}
//     </div>


//     <!-- WEEKLY FINANCIAL BREAKDOWN (LAST 8 WEEKS) -->
//     <div style="padding: 25px; border-bottom: 2px solid #eee;">
//       <h2 style="color: #2c3e50; margin: 0 0 20px 0;">💰 Weekly Financial Breakdown (Last 8 Weeks)</h2>

//       <!-- Financial Summary -->
//       <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 15px; margin-bottom: 25px;">
//         <!-- Gross Sales -->
//         <div style="background: #f8f9fa; padding: 15px; border-radius: 6px;">
//           <div style="font-size: 18px; font-weight: bold; color: #2c3e50;">${formatCurrency(data.weeklyTotalRevenue)}</div>
//           <div style="color: #666; font-size: 12px;">Gross Sales</div>
//           <div style="color: #999; font-size: 11px;">8 Weeks</div>
//         </div>
        
//         <!-- Total Discounts -->
//         <div style="background: #f8f9fa; padding: 15px; border-radius: 6px;">
//           <div style="font-size: 18px; font-weight: bold; color: #2c3e50;">${formatCurrency(data.weeklyTotalDiscounts)}</div>
//           <div style="color: #666; font-size: 12px;">Total Discounts</div>
//           <div style="color: #999; font-size: 11px;">${formatPercent(data.weeklyTotalDiscounts / data.weeklyTotalRevenue * 100)} of gross</div>
//         </div>
        
//         <!-- Returns & Refunds -->
//         <div style="background: #f8f9fa; padding: 15px; border-radius: 6px;">
//           <div style="font-size: 18px; font-weight: bold; color: #2c3e50;">${formatCurrency(data.weeklyTotalReturns)}</div>
//           <div style="color: #666; font-size: 12px;">Returns & Refunds</div>
//           <div style="color: #999; font-size: 11px;">${formatPercent(data.weeklyTotalReturns / data.weeklyTotalRevenue * 100)} of gross</div>
//         </div>
        
//         <!-- Return Fees -->
//         <div style="background: #f8f9fa; padding: 15px; border-radius: 6px;">
//           <div style="font-size: 18px; font-weight: bold; color: #2c3e50;">${formatCurrency(data.weeklyTotalExtraFees)}</div>
//           <div style="color: #666; font-size: 12px;">Return Fees</div>
//           <div style="color: #999; font-size: 11px;">${formatPercent(data.weeklyTotalExtraFees / data.weeklyTotalRevenue * 100)} of gross</div>
//         </div>
        
//         <!-- Net Sales -->
//         <div style="background: #f8f9fa; padding: 15px; border-radius: 6px;">
//           <div style="font-size: 18px; font-weight: bold; color: #2c3e50;">${formatCurrency(data.weeklyTotalNetSales)}</div>
//           <div style="color: #666; font-size: 12px;">Net Sales</div>
//           <div style="color: #999; font-size: 11px;">After ALL deductions</div>
//         </div>
        
//         <!-- Shipping Charges -->
//         <div style="background: #f8f9fa; padding: 15px; border-radius: 6px;">
//           <div style="font-size: 18px; font-weight: bold; color: #2c3e50;">${formatCurrency(data.weeklyTotalShipping)}</div>
//           <div style="color: #666; font-size: 12px;">Shipping Charges</div>
//           <div style="color: #999; font-size: 11px;">${formatPercent(data.weeklyTotalShipping / data.weeklyTotalNetSales * 100)} of net sales</div>
//         </div>
        
//         <!-- Taxes Collected -->
//         <div style="background: #f8f9fa; padding: 15px; border-radius: 6px;">
//           <div style="font-size: 18px; font-weight: bold; color: #2c3e50;">${formatCurrency(data.weeklyTotalTaxes)}</div>
//           <div style="color: #666; font-size: 12px;">Taxes Collected</div>
//           <div style="color: #999; font-size: 11px;">${formatPercent(data.weeklyTotalTaxes / data.weeklyTotalNetSales * 100)} of net sales</div>
//         </div>
        
//         <!-- Total Sales -->
//         <div style="background: #f8f9fa; padding: 15px; border-radius: 6px;">
//           <div style="font-size: 18px; font-weight: bold; color: #2c3e50;">${formatCurrency(data.weeklyTotalTotalSales)}</div>
//           <div style="color: #666; font-size: 12px;">Total Sales</div>
//           <div style="color: #999; font-size: 11px;">Final amount</div>
//         </div>
//       </div>

//       <!-- Weekly Financial Details -->
//       <h3 style="margin: 30px 0 15px 0;">Weekly Financial Details</h3>
//       <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 15px;">
//         ${(data.weeklyFinancials || []).map((week, index) => {
//           const isCurrentWeek = index === (data.weeklyFinancials?.length || 0) - 1;
          
//           return `
//             <div style="background: ${isCurrentWeek ? '#e3f2fd' : '#f8f9fa'}; padding: 15px; border-radius: 6px; border: 1px solid ${isCurrentWeek ? '#2196f3' : '#e9ecef'};">
//               <div style="font-weight: bold; color: #2c3e50; font-size: 14px;">${formatWeekDisplay(week.week)}</div>
              
//               <div style="margin: 3px 0; font-size: 11px;">
//                 <span style="color: #666;">Gross Sales:</span>
//                 <div style="font-weight: bold;">${formatCurrency(week.total)}</div>
//               </div>
              
//               <div style="margin: 3px 0; font-size: 11px;">
//                 <span style="color: #666;">Discounts:</span>
//                 <div style="font-weight: bold;">${formatCurrency(week.discounts)}</div>
//               </div>
              
//               <div style="margin: 3px 0; font-size: 11px;">
//                 <span style="color: #666;">Returns:</span>
//                 <div style="font-weight: bold;">${formatCurrency(week.returns)}</div>
//               </div>
              
//               <div style="margin: 3px 0; font-size: 11px;">
//                 <span style="color: #666;">Net Sales:</span>
//                 <div style="font-weight: bold;">${formatCurrency(week.netSales)}</div>
//               </div>
              
//               <div style="margin: 3px 0; font-size: 11px;">
//                 <span style="color: #666;">Shipping:</span>
//                 <div style="font-weight: bold;">${formatCurrency(week.shipping)}</div>
//               </div>
              
//               <div style="margin: 3px 0; font-size: 11px;">
//                 <span style="color: #666;">Return Fees:</span>
//                 <div style="font-weight: bold;">${formatCurrency(week.extraFees)}</div>
//               </div>
              
//               <div style="margin: 3px 0; font-size: 11px;">
//                 <span style="color: #666;">Taxes:</span>
//                 <div style="font-weight: bold;">${formatCurrency(week.taxes)}</div>
//               </div>
              
//               <div style="margin: 3px 0; font-size: 11px;">
//                 <span style="color: #666;">Total Sales:</span>
//                 <div style="font-weight: bold;">${formatCurrency(week.totalSales)}</div>
//               </div>
//             </div>
//           `;
//         }).join('')}
//       </div>
//     </div>



// <!-- MONTHLY PERFORMANCE (LAST 6 MONTHS) -->
// <div style="padding: 25px; border-bottom: 2px solid #eee;">
//   <h2 style="color: #2c3e50; margin: 0 0 20px 0;">📅 Monthly Performance (Last 6 Months)</h2>



//   ${data.monthlyMismatchSummary ? this.generateMismatchSummaryHTML(data.monthlyMismatchSummary, 'month') : ''}
  
//   <!-- Monthly Summary -->
//   <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 15px; margin-bottom: 25px;">
//     <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; text-align: center;">
//       <div style="font-size: 20px; font-weight: bold; color: #2c3e50;">${formatNumber(data.monthlyFinancials.totalOrders)}</div>
//       <div style="color: #666; font-weight: 600;">Total Orders</div>
//     </div>
    
//     <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; text-align: center;">
//       <div style="font-size: 20px; font-weight: bold; color: #2c3e50;">${formatCurrency(data.monthlyFinancials.totalRevenue)}</div>
//       <div style="color: #666; font-weight: 600;">Total Revenue</div>
//     </div>
    
//     <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; text-align: center;">
//       <div style="font-size: 20px; font-weight: bold; color: #2c3e50;">${formatNumber(data.monthlyFinancials.totalItems)}</div>
//       <div style="color: #666; font-weight: 600;">Total Items</div>
//     </div>
    
//     <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; text-align: center;">
//       <div style="font-size: 20px; font-weight: bold; color: #2c3e50;">${formatCurrency(data.monthlyFinancials.totalRevenue / data.monthRanges.length)}</div>
//       <div style="color: #666; font-weight: 600;">Avg Monthly Revenue</div>
//     </div>
//   </div>

//   <!-- Monthly Breakdown -->
//   <h3 style="margin: 30px 0 15px 0;">Monthly Breakdown</h3>
//   <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 15px;">
//     ${data.monthRanges.map((month, index) => {
//       // Use monthlyTotals directly like weekly sections do
//       const monthData = data.monthlyTotals[month] || {
//         total: 0,
//         totalSales: 0,
//         orderCount: 0,
//         items: 0
//       };
      
//       const currentMonth = new Date().toLocaleString("default", { month: "short", year: "numeric", timeZone: data.shopTimezone });
//       const isCurrentMonth = month === currentMonth;
      
//       // Calculate average revenue for performance indicator
//       const totalRevenue = data.monthRanges.reduce((sum, m) => {
//         const mData = data.monthlyTotals[m] || { total: 0 };
//         return sum + mData.total;
//       }, 0);
//       const avgRevenue = totalRevenue / data.monthRanges.length;
      
//       const performanceLevel = monthData.total > avgRevenue * 1.2 ? 'high' : 
//                              monthData.total > avgRevenue * 0.8 ? 'medium' : 'low';
      
//       const performanceColor = performanceLevel === 'high' ? '#28a745' : 
//                               performanceLevel === 'medium' ? '#ffc107' : '#dc3545';
      
//       return `
//         <div style="background: ${isCurrentMonth ? '#e3f2fd' : '#f8f9fa'}; padding: 15px; border-radius: 6px; border: 1px solid ${isCurrentMonth ? '#2196f3' : performanceColor}; border-left: 4px solid ${performanceColor};">
//           ${isCurrentMonth ? `
//             <div style="background: #2196f3; color: white; padding: 2px 8px; border-radius: 12px; font-size: 10px; display: inline-block; margin-bottom: 10px;">Current</div>
//           ` : ''}
          
//           <div style="font-weight: bold; color: #2c3e50; font-size: 14px;">${month.split(' ')[0]}</div>
//           <div style="color: #666; font-size: 12px; margin-bottom: 10px;">${month.split(' ')[1]}</div>
          
//           <div style="margin: 8px 0;">
//             <span style="color: #666; font-size: 11px;">Orders</span>
//             <div style="font-weight: bold; color: #2c3e50;">${formatNumber(monthData.orderCount)}</div>
//           </div>
          
//           <div style="margin: 8px 0;">
//             <span style="color: #666; font-size: 11px;">Total Sales</span>
//             <div style="font-weight: bold; color: #2c3e50;">${formatCurrency(monthData.totalSales)}</div>
//           </div>
          
//           <div style="margin: 8px 0;">
//             <span style="color: #666; font-size: 11px;">Items</span>
//             <div style="font-weight: bold; color: #2c3e50;">${formatNumber(monthData.items)}</div>
//           </div>
          
//           <div style="margin: 8px 0;">
//             <span style="color: #666; font-size: 11px;">Performance</span>
//             <div style="font-weight: bold; color: ${performanceColor}; font-size: 11px;">
//               ${performanceLevel.toUpperCase()}
//             </div>
//           </div>
//         </div>
//       `;
//     }).join('')}
//   </div>
// </div>







//         <!-- 6-MONTH OVERVIEW: ALL ORDER EVENTS & ADJUSTMENTS -->
//     <div style="padding: 25px; border-bottom: 2px solid #eee;">
//       <h2 style="color: #2c3e50; margin: 0 0 20px 0;">📈 6-Month Overview: All Order Events & Adjustments</h2>
      
//       ${data.last6MonthsEventSummary && data.last6MonthsEventSummary.totalEvents > 0 ? `
//         <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; border: 1px solid #dee2e6;">
//           <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 15px;">
//             ${data.last6MonthsEventSummary.refunds.count > 0 ? `
//               <div style="background: white; padding: 15px; border-radius: 6px; text-align: center; border: 1px solid #e9ecef;">
//                 <div style="color: #666; font-size: 12px; font-weight: 600; margin-bottom: 8px;">Full Refunds</div>
//                 <div style="font-size: 18px; font-weight: bold; color: #dc3545;">-${formatCurrency(Math.abs(data.last6MonthsEventSummary.refunds.value))}</div>
//                 <div style="color: #999; font-size: 11px; margin-top: 5px;">${data.last6MonthsEventSummary.refunds.count} refunds</div>
//               </div>
//             ` : ''}
            
//             ${data.last6MonthsEventSummary.partialRefunds.count > 0 ? `
//               <div style="background: white; padding: 15px; border-radius: 6px; text-align: center; border: 1px solid #e9ecef;">
//                 <div style="color: #666; font-size: 12px; font-weight: 600; margin-bottom: 8px;">Partial Refunds</div>
//                 <div style="font-size: 18px; font-weight: bold; color: #fd7e14;">-${formatCurrency(Math.abs(data.last6MonthsEventSummary.partialRefunds.value))}</div>
//                 <div style="color: #999; font-size: 11px; margin-top: 5px;">${data.last6MonthsEventSummary.partialRefunds.count} refunds</div>
//               </div>
//             ` : ''}
            
//             ${data.last6MonthsEventSummary.exchanges.count > 0 ? `
//               <div style="background: white; padding: 15px; border-radius: 6px; text-align: center; border: 1px solid #e9ecef;">
//                 <div style="color: #666; font-size: 12px; font-weight: 600; margin-bottom: 8px;">Exchanges</div>
//                 <div style="font-size: 18px; font-weight: bold; color: #6f42c1;">-${formatCurrency(Math.abs(data.last6MonthsEventSummary.exchanges.value))}</div>
//                 <div style="color: #999; font-size: 11px; margin-top: 5px;">${data.last6MonthsEventSummary.exchanges.count} exchanges</div>
//               </div>
//             ` : ''}
            
//             <div style="background: white; padding: 15px; border-radius: 6px; text-align: center; border: 1px solid #e9ecef;">
//               <div style="color: #666; font-size: 12px; font-weight: 600; margin-bottom: 8px;">Net Impact</div>
//               <div style="font-size: 18px; font-weight: bold; color: #2c3e50;">-${formatCurrency(Math.abs(data.last6MonthsEventSummary.netValue))}</div>
//               <div style="color: #999; font-size: 11px; margin-top: 5px;">across ${data.last6MonthsEventSummary.totalEvents} events</div>
//             </div>
//           </div>
//         </div>
//       ` : `
//         <div style="background: #e8f5e8; padding: 15px; border-radius: 8px; text-align: center;">
//           <div style="color: #155724; font-weight: 600;">No adjustments in the last 6 months</div>
//         </div>
//       `}
//     </div>






// <!-- MONTHLY FINANCIAL BREAKDOWN (LAST 6 MONTHS) -->
// <div style="padding: 25px; border-bottom: 2px solid #eee;">
//   <h2 style="color: #2c3e50; margin: 0 0 20px 0;">💰 Monthly Financial Breakdown (Last 6 Months)</h2>

//   <!-- Financial Summary - ALL 8 METRICS -->
//   <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 15px; margin-bottom: 25px;">
//     <!-- Gross Sales -->
//     <div style="background: #f8f9fa; padding: 15px; border-radius: 6px;">
//       <div style="font-size: 18px; font-weight: bold; color: #2c3e50;">${formatCurrency(data.monthlyFinancials.totalRevenue)}</div>
//       <div style="color: #666; font-size: 12px;">Gross Sales</div>
//       <div style="color: #999; font-size: 11px;">6 Months</div>
//     </div>
    
//     <!-- Total Discounts -->
//     <div style="background: #f8f9fa; padding: 15px; border-radius: 6px;">
//       <div style="font-size: 18px; font-weight: bold; color: #2c3e50;">${formatCurrency(data.monthlyFinancials.totalDiscounts)}</div>
//       <div style="color: #666; font-size: 12px;">Total Discounts</div>
//       <div style="color: #999; font-size: 11px;">${data.monthlyFinancials.totalRevenue > 0 ? formatPercent((data.monthlyFinancials.totalDiscounts / data.monthlyFinancials.totalRevenue) * 100) : '0.0%'} of gross</div>
//     </div>
    
//     <!-- Returns & Refunds -->
//     <div style="background: #f8f9fa; padding: 15px; border-radius: 6px;">
//       <div style="font-size: 18px; font-weight: bold; color: #2c3e50;">${formatCurrency(data.monthlyFinancials.totalReturns)}</div>
//       <div style="color: #666; font-size: 12px;">Returns & Refunds</div>
//       <div style="color: #999; font-size: 11px;">${data.monthlyFinancials.totalRevenue > 0 ? formatPercent((data.monthlyFinancials.totalReturns / data.monthlyFinancials.totalRevenue) * 100) : '0.0%'} of gross</div>
//     </div>
    
//     <!-- Return Fees -->
//     <div style="background: #f8f9fa; padding: 15px; border-radius: 6px;">
//       <div style="font-size: 18px; font-weight: bold; color: #2c3e50;">${formatCurrency(data.monthlyFinancials.totalExtraFees)}</div>
//       <div style="color: #666; font-size: 12px;">Return Fees</div>
//       <div style="color: #999; font-size: 11px;">${data.monthlyFinancials.totalRevenue > 0 ? formatPercent((data.monthlyFinancials.totalExtraFees / data.monthlyFinancials.totalRevenue) * 100) : '0.0%'} of gross</div>
//     </div>
    
//     <!-- Net Sales -->
//     <div style="background: #f8f9fa; padding: 15px; border-radius: 6px;">
//       <div style="font-size: 18px; font-weight: bold; color: #2c3e50;">${formatCurrency(data.monthlyFinancials.totalNetSales)}</div>
//       <div style="color: #666; font-size: 12px;">Net Sales</div>
//       <div style="color: #999; font-size: 11px;">After ALL deductions</div>
//     </div>
    
//     <!-- Shipping Charges -->
//     <div style="background: #f8f9fa; padding: 15px; border-radius: 6px;">
//       <div style="font-size: 18px; font-weight: bold; color: #2c3e50;">${formatCurrency(data.monthlyFinancials.totalShipping)}</div>
//       <div style="color: #666; font-size: 12px;">Shipping Charges</div>
//       <div style="color: #999; font-size: 11px;">${data.monthlyFinancials.totalNetSales > 0 ? formatPercent((data.monthlyFinancials.totalShipping / data.monthlyFinancials.totalNetSales) * 100) : '0.0%'} of net sales</div>
//     </div>
    
//     <!-- Taxes Collected -->
//     <div style="background: #f8f9fa; padding: 15px; border-radius: 6px;">
//       <div style="font-size: 18px; font-weight: bold; color: #2c3e50;">${formatCurrency(data.monthlyFinancials.totalTaxes)}</div>
//       <div style="color: #666; font-size: 12px;">Taxes Collected</div>
//       <div style="color: #999; font-size: 11px;">${data.monthlyFinancials.totalNetSales > 0 ? formatPercent((data.monthlyFinancials.totalTaxes / data.monthlyFinancials.totalNetSales) * 100) : '0.0%'} of net sales</div>
//     </div>
    
//     <!-- Total Sales -->
//     <div style="background: #f8f9fa; padding: 15px; border-radius: 6px;">
//       <div style="font-size: 18px; font-weight: bold; color: #2c3e50;">${formatCurrency(data.monthlyFinancials.totalTotalSales)}</div>
//       <div style="color: #666; font-size: 12px;">Total Sales</div>
//       <div style="color: #999; font-size: 11px;">Final amount</div>
//     </div>
//   </div>

//   <!-- Monthly Financial Details -->
//   <h3 style="margin: 30px 0 15px 0;">Monthly Financial Details</h3>
//   <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 15px;">
//     ${data.monthRanges.map((month, index) => {
//       const monthData = data.monthlyTotals[month] || {
//         total: 0,
//         discounts: 0,
//         returns: 0,
//         netSales: 0,
//         shipping: 0,
//         taxes: 0,
//         extraFees: 0,
//         totalSales: 0
//       };
      
//       const currentMonth = new Date().toLocaleString("default", { month: "short", year: "numeric", timeZone: data.shopTimezone });
//       const isCurrentMonth = month === currentMonth;
      
//       return `
//         <div style="background: ${isCurrentMonth ? '#e3f2fd' : '#f8f9fa'}; padding: 15px; border-radius: 6px; border: 1px solid ${isCurrentMonth ? '#2196f3' : '#e9ecef'};">
//           ${isCurrentMonth ? `
//             <div style="background: #2196f3; color: white; padding: 2px 8px; border-radius: 12px; font-size: 10px; display: inline-block; margin-bottom: 10px;">Current</div>
//           ` : ''}
          
//           <div style="font-weight: bold; color: #2c3e50; font-size: 14px;">${month.split(' ')[0]}</div>
//           <div style="color: #666; font-size: 12px; margin-bottom: 10px;">${month.split(' ')[1]}</div>
          
//           <div style="margin: 3px 0; font-size: 11px;">
//             <span style="color: #666;">Gross Sales:</span>
//             <div style="font-weight: bold;">${formatCurrency(monthData.total)}</div>
//           </div>
          
//           <div style="margin: 3px 0; font-size: 11px;">
//             <span style="color: #666;">Discounts:</span>
//             <div style="font-weight: bold;">${formatCurrency(monthData.discounts)}</div>
//           </div>
          
//           <div style="margin: 3px 0; font-size: 11px;">
//             <span style="color: #666;">Returns:</span>
//             <div style="font-weight: bold;">${formatCurrency(monthData.returns)}</div>
//           </div>
          
//           <div style="margin: 3px 0; font-size: 11px;">
//             <span style="color: #666;">Net Sales:</span>
//             <div style="font-weight: bold;">${formatCurrency(monthData.netSales)}</div>
//           </div>
          
//           <div style="margin: 3px 0; font-size: 11px;">
//             <span style="color: #666;">Shipping Charges:</span>
//             <div style="font-weight: bold;">${formatCurrency(monthData.shipping)}</div>
//           </div>
          
//           <div style="margin: 3px 0; font-size: 11px;">
//             <span style="color: #666;">Return Fees:</span>
//             <div style="font-weight: bold;">${formatCurrency(monthData.extraFees || 0)}</div>
//           </div>
          
//           <div style="margin: 3px 0; font-size: 11px;">
//             <span style="color: #666;">Taxes:</span>
//             <div style="font-weight: bold;">${formatCurrency(monthData.taxes)}</div>
//           </div>
          
//           <div style="margin: 3px 0; font-size: 11px;">
//             <span style="color: #666;">Total Sales:</span>
//             <div style="font-weight: bold;">${formatCurrency(monthData.totalSales)}</div>
//           </div>
//         </div>
//       `;
//     }).join('')}
//   </div>
// </div>
    




//     <!-- FOOTER -->
//     <div style="background: #2c3e50; color: white; padding: 20px; text-align: center;">
//       <p style="margin: 0 0 10px 0;"><strong>Analytics Dashboard Report</strong> - Comprehensive Business Insights</p>
//       <p style="margin: 0 0 10px 0; font-size: 12px;">Generated automatically By Nexus • ${timestamp}</p>
//       <p style="margin: 0; font-size: 12px;">For detailed analytics and interactive charts, visit your dashboard</p>
//     </div>



//   </div>
// </body>
// </html>
//     `;
//   }

//   private generateTextVersion(data: EmailOrderData, shop: string): string {
//     const formatCurrency = (amount: number | undefined) => {
//       const safeAmount = amount || 0;
//       return safeAmount.toLocaleString('en-US', { 
//         style: 'currency', 
//         currency: data.shopCurrency || 'USD',
//         minimumFractionDigits: 2 
//       });
//     };

//     const formatNumber = (num: number | undefined) => {
//       const safeNum = num || 0;
//       return safeNum.toLocaleString('en-US');
//     };

//     return `
// DAILY ANALYTICS REPORT - ${shop}
// Generated: ${new Date().toLocaleDateString()}

// TODAY'S PERFORMANCE:
// - Orders: ${formatNumber(data.todayOrders)}
// - Revenue: ${formatCurrency(data.todayRevenue)}
// - Items: ${formatNumber(data.todayItems)}

// LAST 7 DAYS PERFORMANCE:
// - Total Orders: ${formatNumber(data.totalOrders)}
// - Total Sales: ${formatCurrency(data.totalRevenue)}
// - Total Items: ${formatNumber(data.totalItems)}
// - Avg Daily Sales: ${formatCurrency(data.averageDailyRevenue)}

// FINANCIAL BREAKDOWN:
// - Gross Revenue: ${formatCurrency(data.totalRevenue)}
// - Total Discounts: ${formatCurrency(data.totalDiscounts)}
// - Returns & Refunds: ${formatCurrency(data.totalReturns)}
// - Net Revenue: ${formatCurrency(data.netRevenue)}
// - Shipping: ${formatCurrency(data.totalShipping)}
// - Taxes: ${formatCurrency(data.totalTaxes)}

// CUSTOMER INSIGHTS:
// - Total Customers: ${formatNumber(data.totalCustomers)}
// - New Customers: ${formatNumber(data.newCustomers)}
// - Repeat Customers: ${formatNumber(data.repeatCustomers)}

// For detailed analytics and interactive charts, visit your dashboard.
//     `;
//   }
// }

//==================================================================== Above is correct and final code ====================================================================================================================================================================================













































































































































































import sgMail from "@sendgrid/mail";
import { StoreEmailSettings } from "../models/StoreEmailSettings.server";
import type { EmailOrderData } from "../types/emailAnalytics";
import { formatWeekDisplay } from '../utils/analyticsHelpers';

// Initialize SendGrid
if (process.env.SENDGRID_API_KEY) {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
}

export class AnalyticsEmailService {
  private shop: string;

  constructor(shop: string) {
    this.shop = shop;
  }

  async sendDailyAnalytics(
    analyticsData: EmailOrderData, 
    emailOptions: {
      bccEmails?: string[];
    } = {}
  ): Promise<{
    success: boolean;
    skipped?: boolean;
    message: string;
    recipients: string[];
    recipientsCount: number;
    result?: any;
  }> {
    try {
      console.log(`📧 Starting email send for ${this.shop}, Currency: ${analyticsData.shopCurrency}`);

      // Validate SendGrid configuration
      if (!process.env.SENDGRID_API_KEY) {
        throw new Error('Email service not configured');
      }

      if (!process.env.SENDGRID_FROM_EMAIL) {
        throw new Error('Sender email not configured');
      }

      // Use the currency from analyticsData (which comes from AnalyticsCollector)
      const shopCurrency = analyticsData.shopCurrency || 'USD';
      const shopTimezone = analyticsData.shopTimezone || 'UTC';

      console.log(`💰 Email Currency: ${shopCurrency}, Timezone: ${shopTimezone}`);

      // Fetch store email settings
      const settings = await StoreEmailSettings.get(this.shop);
      
      if (!settings) {
        throw new Error('Email settings not configured for this store');
      }

      if (!settings.enabled) {
        return {
          success: true,
          skipped: true,
          message: 'Email notifications are disabled',
          recipients: [],
          recipientsCount: 0
        };
      }

      // Get all email addresses (primary + additional)
      const allEmails = [
        settings.fromEmail,
        ...(settings.additionalEmails || [])
      ].filter(email => email && email.trim() && this.isValidEmail(email));

      if (allEmails.length === 0) {
        throw new Error('No valid recipient email addresses configured');
      }

      // Build email with analytics data - pass currency to formatters
      const emailContent = this.buildAnalyticsEmail(analyticsData, this.shop, shopCurrency, shopTimezone);
      
      // Use BCC approach to avoid duplicate email errors
      const msg: any = {
        to: process.env.SENDGRID_FROM_EMAIL,
        from: {
          email: process.env.SENDGRID_FROM_EMAIL,
          name: 'Analytics Dashboard'
        },
        subject: `Daily Analytics Report - ${this.shop} - ${new Date().toLocaleDateString()}`,
        html: emailContent,
        text: this.generateTextVersion(analyticsData, this.shop, shopCurrency, shopTimezone),
      };

      // Add all recipients to BCC
      let bccRecipients: string[] = [];
      
      if (emailOptions.bccEmails && emailOptions.bccEmails.length > 0) {
        bccRecipients = emailOptions.bccEmails.filter(email => 
          email && email.trim() && this.isValidEmail(email)
        );
      } else {
        bccRecipients = allEmails;
      }

      // Remove duplicates from BCC list
      const uniqueBccRecipients = [...new Set(bccRecipients)];

      if (uniqueBccRecipients.length > 0) {
        msg.bcc = uniqueBccRecipients;
      }

      const result = await sgMail.send(msg);
      
      return {
        success: true,
        message: `Email sent successfully to ${uniqueBccRecipients.length} recipient(s) via BCC`,
        recipients: uniqueBccRecipients,
        recipientsCount: uniqueBccRecipients.length,
        result
      };

    } catch (error: any) {
      console.error('❌ Failed to send analytics email:', error.message);
      throw new Error(`Failed to send analytics email: ${error.message}`);
    }
  }

  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  private generateMismatchSummaryHTML(
    mismatchSummary: { 
      totalMismatches: number; 
      totalDifference: number; 
      hasMismatches: boolean; 
    }, 
    periodType: 'day' | 'week' | 'month'
  ): string {
    if (!mismatchSummary.hasMismatches) {
      return '';
    }

    const getPeriodLabel = () => {
      switch (periodType) {
        case 'day': return 'Days';
        case 'week': return 'Weeks'; 
        case 'month': return 'Months';
        default: return 'Periods';
      }
    };

    const getDifferenceColor = (difference: number) => {
      return Math.abs(difference) > 0.01 ? '#dc2626' : '#059669';
    };

    const getDifferenceText = (difference: number) => {
      const absDiff = Math.abs(difference);
      if (absDiff <= 0.01) return 'Perfect Match';
      return `$${absDiff.toFixed(2)}`;
    };

    return `
      <div class="mismatch-summary-card" style="
        border: 1px solid #e5e7eb;
        border-radius: 8px;
        padding: 20px;
        margin: 16px 0;
        background: #f8fafc;
        border-left: 4px solid #dc2626;
      ">
        <h3 style="margin: 0 0 16px 0; font-size: 18px; color: #1f2937;">
          ⚠️ Calculation Verification
        </h3>
        
        <div class="mismatch-summary-content" style="
          display: flex;
          gap: 32px;
          margin-bottom: 16px;
        ">
          <div class="mismatch-metric" style="text-align: center;">
            <div class="mismatch-value" style="
              font-size: 24px;
              font-weight: bold;
              color: #dc2626;
            ">${mismatchSummary.totalMismatches}</div>
            <div class="mismatch-label" style="
              font-size: 14px;
              color: #6b7280;
            ">${getPeriodLabel()} with Mismatches</div>
          </div>
          
          <div class="mismatch-metric" style="text-align: center;">
            <div 
              class="mismatch-value" 
              style="
                font-size: 24px;
                font-weight: bold;
                color: ${getDifferenceColor(mismatchSummary.totalDifference)};
              "
            >
              ${getDifferenceText(mismatchSummary.totalDifference)}
            </div>
            <div class="mismatch-label" style="
              font-size: 14px;
              color: #6b7280;
            ">Total Difference</div>
          </div>
        </div>
        
        <div class="mismatch-note" style="
          font-size: 14px;
          font-style: italic;
          color: #dc2626;
        ">
          Found ${mismatchSummary.totalMismatches} ${getPeriodLabel().toLowerCase()} with calculation discrepancies
        </div>
      </div>
    `;
  }

  private buildAnalyticsEmail(data: EmailOrderData, shop: string, shopCurrency: string, shopTimezone: string): string {
    console.log(`📧 Building email with currency: ${shopCurrency}, timezone: ${shopTimezone}`);

    // Use the passed shopCurrency parameter
    const formatCurrency = (amount: number | undefined) => {
      const safeAmount = amount || 0;
      return safeAmount.toLocaleString('en-US', { 
        style: 'currency', 
        currency: shopCurrency,
        minimumFractionDigits: 2 
      });
    };
    
    const formatNumber = (num: number | undefined) => {
      const safeNum = num || 0;
      return safeNum.toLocaleString('en-US');
    };

    const formatPercent = (num: number | undefined) => {
      const safeNum = num || 0;
      return `${safeNum.toFixed(1)}%`;
    };

    // Helper function to format date display
    const formatDateDisplay = (dateStr: string) => {
      try {
        const date = new Date(dateStr + 'T00:00:00');
        return date.toLocaleDateString('en-US', { 
          month: 'short', 
          day: 'numeric',
          timeZone: shopTimezone 
        });
      } catch (error) {
        return dateStr;
      }
    };

    const getDayName = (dateStr: string) => {
      try {
        const date = new Date(dateStr + 'T00:00:00');
        return date.toLocaleDateString('en-US', { 
          weekday: 'short',
          timeZone: shopTimezone 
        });
      } catch (error) {
        return '';
      }
    };

    const currentDate = data.currentDateInShopTZ || new Date().toISOString().split('T')[0];
    const timestamp = new Date().toLocaleDateString() + ' at ' + new Date().toLocaleTimeString();

    return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Daily Analytics Report - ${shop}</title>
</head>
<body>
  <div style="max-width: 1000px; margin: 0 auto; font-family: Arial, sans-serif;">
    
    <!-- HEADER -->
    <div style="background: #2c3e50; color: white; padding: 30px; text-align: center;">
      <h1 style="margin: 0 0 10px 0;">📊 Daily Analytics Report</h1>
      <div style="color: rgba(255,255,255,0.9);">${shop} • ${timestamp}</div>
      <div style="color: rgba(255,255,255,0.9);">Store Timezone: ${shopTimezone} • Currency: ${shopCurrency}</div>
    </div>

    <!-- TODAY'S PERFORMANCE -->
    <div style="padding: 25px; border-bottom: 2px solid #eee;">
      <h2 style="color: #2c3e50; margin: 0 0 20px 0;">🎯 Today's Performance (${formatDateDisplay(currentDate)})</h2>

      ${data.todayMismatchSummary ? this.generateMismatchSummaryHTML(data.todayMismatchSummary, 'day') : ''}
      
      <!-- Primary Metrics -->
      <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; margin: 20px 0;">
        <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; text-align: center;">
          <div style="font-size: 24px; font-weight: bold; color: #2c3e50;">${formatNumber(data.todayOrders)}</div>
          <div style="color: #666; font-weight: 600;">Today's Orders</div>
        </div>
        
        <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; text-align: center;">
          <div style="font-size: 24px; font-weight: bold; color: #2c3e50;">${formatCurrency(data.todayRevenue)}</div>
          <div style="color: #666; font-weight: 600;">Today's Total Sales</div>
        </div>
        
        <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; text-align: center;">
          <div style="font-size: 24px; font-weight: bold; color: #2c3e50;">${formatNumber(data.todayItems)}</div>
          <div style="color: #666; font-weight: 600;">Items Ordered</div>
        </div>
      </div>

      <!-- Fulfillment Metrics -->
      <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 15px; margin: 20px 0;">
        <div style="background: #e8f5e8; padding: 15px; border-radius: 6px; text-align: center;">
          <div style="font-size: 20px; font-weight: bold; color: #27ae60;">${formatNumber(data.todayFulfilled)}</div>
          <div style="color: #666; font-size: 12px; font-weight: 600;">FULFILLED TODAY</div>
        </div>
        
        <div style="background: #ffe8e8; padding: 15px; border-radius: 6px; text-align: center;">
          <div style="font-size: 20px; font-weight: bold; color: #e74c3c;">${formatNumber(data.todayUnfulfilled)}</div>
          <div style="color: #666; font-size: 12px; font-weight: 600;">UNFULFILLED TODAY</div>
        </div>
        
        <div style="background: #e8f5e8; padding: 15px; border-radius: 6px; text-align: center;">
          <div style="font-size: 20px; font-weight: bold; color: #27ae60;">${formatNumber(data.last7DaysFulfilled)}</div>
          <div style="color: #666; font-size: 12px; font-weight: 600;">FULFILLED</div>
          <div style="color: #999; font-size: 11px;">Last 7 Days</div>
        </div>
        
        <div style="background: #ffe8e8; padding: 15px; border-radius: 6px; text-align: center;">
          <div style="font-size: 20px; font-weight: bold; color: #e74c3c;">${formatNumber(data.last7DaysUnfulfilled)}</div>
          <div style="color: #666; font-size: 12px; font-weight: 600;">UNFULFILLED</div>
          <div style="color: #999; font-size: 11px;">Last 7 Days</div>
        </div>
      </div>

      <!-- Event Summary Details -->
      ${data.todayEventSummary && data.todayEventSummary.totalEvents > 0 ? `
        <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; border: 1px solid #dee2e6;">
          <h3 style="margin: 0 0 20px 0; color: #2c3e50; text-align: center;">
            Order Adjustments (${data.todayEventSummary.totalEvents} event${data.todayEventSummary.totalEvents !== 1 ? 's' : ''})
          </h3>
          
          <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 15px;">
            ${data.todayEventSummary.refunds.count > 0 ? `
              <div style="background: white; padding: 15px; border-radius: 6px; text-align: center; border: 1px solid #e9ecef;">
                <div style="color: #666; font-size: 12px; font-weight: 600; margin-bottom: 8px;">Full Refunds</div>
                <div style="font-size: 18px; font-weight: bold; color: #dc3545;">-${formatCurrency(Math.abs(data.todayEventSummary.refunds.value))}</div>
                <div style="color: #999; font-size: 11px; margin-top: 5px;">
                  ${data.todayEventSummary.refunds.count} refund${data.todayEventSummary.refunds.count !== 1 ? 's' : ''}
                </div>
              </div>
            ` : ''}
            
            ${data.todayEventSummary.partialRefunds.count > 0 ? `
              <div style="background: white; padding: 15px; border-radius: 6px; text-align: center; border: 1px solid #e9ecef;">
                <div style="color: #666; font-size: 12px; font-weight: 600; margin-bottom: 8px;">Partial Refunds</div>
                <div style="font-size: 18px; font-weight: bold; color: #fd7e14;">-${formatCurrency(Math.abs(data.todayEventSummary.partialRefunds.value))}</div>
                <div style="color: #999; font-size: 11px; margin-top: 5px;">
                  ${data.todayEventSummary.partialRefunds.count} refund${data.todayEventSummary.partialRefunds.count !== 1 ? 's' : ''}
                </div>
              </div>
            ` : ''}
            
            ${data.todayEventSummary.exchanges.count > 0 ? `
              <div style="background: white; padding: 15px; border-radius: 6px; text-align: center; border: 1px solid #e9ecef;">
                <div style="color: #666; font-size: 12px; font-weight: 600; margin-bottom: 8px;">Exchanges</div>
                <div style="font-size: 18px; font-weight: bold; color: #6f42c1;">-${formatCurrency(Math.abs(data.todayEventSummary.exchanges.value))}</div>
                <div style="color: #999; font-size: 11px; margin-top: 5px;">
                  ${data.todayEventSummary.exchanges.count} exchange${data.todayEventSummary.exchanges.count !== 1 ? 's' : ''}
                </div>
              </div>
            ` : ''}
            
            <div style="background: white; padding: 15px; border-radius: 6px; text-align: center; border: 1px solid #e9ecef;">
              <div style="color: #666; font-size: 12px; font-weight: 600; margin-bottom: 8px;">Net Impact</div>
              <div style="font-size: 18px; font-weight: bold; color: #2c3e50;">-${formatCurrency(Math.abs(data.todayEventSummary.netValue))}</div>
              <div style="color: #999; font-size: 11px; margin-top: 5px;">
                across ${data.todayEventSummary.totalEvents} event${data.todayEventSummary.totalEvents !== 1 ? 's' : ''}
              </div>
            </div>
          </div>
        </div>
      ` : `
        <div style="background: #e8f5e8; padding: 15px; border-radius: 8px; text-align: center; border-left: 4px solid #28a745;">
          <div style="color: #155724; font-weight: 600;">No order adjustments today</div>
          <div style="color: #999; font-size: 12px; margin-top: 5px;">All orders processed without refunds or exchanges</div>
        </div>
      `}
    </div>

    <!-- LAST 7 DAYS PERFORMANCE -->
    <div style="padding: 25px; border-bottom: 2px solid #eee;">
      <h2 style="color: #2c3e50; margin: 0 0 20px 0;">📈 Last 7 Days Performance</h2>
      
      <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 15px;">
        <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; text-align: center;">
          <div style="font-size: 20px; font-weight: bold; color: #2c3e50;">${formatNumber(data.last7DaysOrders)}</div>
          <div style="color: #666; font-weight: 600;">TOTAL ORDERS</div>
        </div>
        
        <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; text-align: center;">
          <div style="font-size: 20px; font-weight: bold; color: #2c3e50;">${formatCurrency(data.last7DaysRevenue)}</div>
          <div style="color: #666; font-weight: 600;">TOTAL SALES</div>
        </div>
        
        <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; text-align: center;">
          <div style="font-size: 20px; font-weight: bold; color: #2c3e50;">${formatNumber(data.last7DaysItems)}</div>
          <div style="color: #666; font-weight: 600;">TOTAL ITEMS</div>
        </div>
        
        <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; text-align: center;">
          <div style="font-size: 20px; font-weight: bold; color: #2c3e50;">${formatCurrency(data.averageDailyRevenue)}</div>
          <div style="color: #666; font-weight: 600;">AVG DAILY SALES</div>
        </div>
      </div>
    </div>

    <!-- DAILY BREAKDOWN -->
    <div style="padding: 25px; border-bottom: 2px solid #eee;">
      <h2 style="color: #2c3e50; margin: 0 0 20px 0;">📅 Daily Breakdown (Last 7 Days)</h2>
      
      <div style="display: grid; grid-template-columns: repeat(7, 1fr); gap: 10px;">
        ${(data.dailySales || []).map(day => {
          const isToday = day.date === currentDate;
          return `
            <div style="background: ${isToday ? '#e3f2fd' : '#f8f9fa'}; padding: 15px; border-radius: 6px; text-align: center; border: 1px solid ${isToday ? '#2196f3' : '#e9ecef'};">
              <div style="font-weight: bold; color: #2c3e50;">${formatDateDisplay(day.date)}</div>
              <div style="color: #666; font-size: 12px; margin-bottom: 8px;">${getDayName(day.date)}</div>
              <div style="margin: 5px 0;">
                <span style="color: #666; font-size: 11px;">ORDERS</span>
                <div style="font-weight: bold; color: #2c3e50;">${formatNumber(day.orders)}</div>
              </div>
              <div style="margin: 5px 0;">
                <span style="color: #666; font-size: 11px;">TOTAL SALES</span>
                <div style="font-weight: bold; color: #2c3e50;">${formatCurrency(day.revenue)}</div>
              </div>
              <div style="margin: 5px 0;">
                <span style="color: #666; font-size: 11px;">ITEMS</span>
                <div style="font-weight: bold; color: #2c3e50;">${formatNumber(day.items)}</div>
              </div>
            </div>
          `;
        }).join('')}
      </div>
    </div>

    <!-- LAST 7 DAYS: REFUNDS, EXCHANGES & ADJUSTMENTS -->
    <div style="padding: 25px; border-bottom: 2px solid #eee;">
      <h2 style="color: #2c3e50; margin: 0 0 20px 0;">📊 Last 7 Days: Refunds, Exchanges & Adjustments</h2>
      
      ${data.last7DaysEventSummary && data.last7DaysEventSummary.totalEvents > 0 ? `
        <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; border: 1px solid #dee2e6;">
          <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 15px;">
            ${data.last7DaysEventSummary.refunds.count > 0 ? `
              <div style="background: white; padding: 15px; border-radius: 6px; text-align: center; border: 1px solid #e9ecef;">
                <div style="color: #666; font-size: 12px; font-weight: 600; margin-bottom: 8px;">Full Refunds</div>
                <div style="font-size: 18px; font-weight: bold; color: #dc3545;">-${formatCurrency(Math.abs(data.last7DaysEventSummary.refunds.value))}</div>
                <div style="color: #999; font-size: 11px; margin-top: 5px;">${data.last7DaysEventSummary.refunds.count} refunds</div>
              </div>
            ` : ''}
            
            ${data.last7DaysEventSummary.partialRefunds.count > 0 ? `
              <div style="background: white; padding: 15px; border-radius: 6px; text-align: center; border: 1px solid #e9ecef;">
                <div style="color: #666; font-size: 12px; font-weight: 600; margin-bottom: 8px;">Partial Refunds</div>
                <div style="font-size: 18px; font-weight: bold; color: #fd7e14;">-${formatCurrency(Math.abs(data.last7DaysEventSummary.partialRefunds.value))}</div>
                <div style="color: #999; font-size: 11px; margin-top: 5px;">${data.last7DaysEventSummary.partialRefunds.count} refunds</div>
              </div>
            ` : ''}
            
            ${data.last7DaysEventSummary.exchanges.count > 0 ? `
              <div style="background: white; padding: 15px; border-radius: 6px; text-align: center; border: 1px solid #e9ecef;">
                <div style="color: #666; font-size: 12px; font-weight: 600; margin-bottom: 8px;">Exchanges</div>
                <div style="font-size: 18px; font-weight: bold; color: #6f42c1;">-${formatCurrency(Math.abs(data.last7DaysEventSummary.exchanges.value))}</div>
                <div style="color: #999; font-size: 11px; margin-top: 5px;">${data.last7DaysEventSummary.exchanges.count} exchanges</div>
              </div>
            ` : ''}
            
            <div style="background: white; padding: 15px; border-radius: 6px; text-align: center; border: 1px solid #e9ecef;">
              <div style="color: #666; font-size: 12px; font-weight: 600; margin-bottom: 8px;">Net Impact</div>
              <div style="font-size: 18px; font-weight: bold; color: #2c3e50;">-${formatCurrency(Math.abs(data.last7DaysEventSummary.netValue))}</div>
              <div style="color: #999; font-size: 11px; margin-top: 5px;">across ${data.last7DaysEventSummary.totalEvents} events</div>
            </div>
          </div>
        </div>
      ` : `
        <div style="background: #e8f5e8; padding: 15px; border-radius: 8px; text-align: center;">
          <div style="color: #155724; font-weight: 600;">No adjustments in the last 7 days</div>
        </div>
      `}
    </div>

    <!-- WEEK-OVER-WEEK INSIGHT -->
   <!-- WEEK-OVER-WEEK PERFORMANCE -->
<div style="padding: 25px; border-bottom: 2px solid #eee;">
  <h2 style="color: #2c3e50; margin: 0 0 20px 0;">📈 Week-over-Week Performance</h2>
  
  <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 20px;">
    <!-- Week-over-Week Change -->
    <div style="background: ${data.revenueChangeVsLastWeek >= 0 ? '#e8f5e8' : '#ffebee'}; padding: 20px; border-radius: 8px; text-align: center; border-left: 4px solid ${data.revenueChangeVsLastWeek >= 0 ? '#28a745' : '#dc3545'};">
      <h3 style="margin: 0 0 10px 0; color: #2c3e50;">Week-over-Week Revenue</h3>
      <div style="font-size: 24px; font-weight: bold; color: ${data.revenueChangeVsLastWeek >= 0 ? '#28a745' : '#dc3545'};">
        ${data.revenueChangeVsLastWeek >= 0 ? '↗' : '↘'} ${Math.abs(data.revenueChangeVsLastWeek || 0).toFixed(1)}%
      </div>
      <div style="color: #666; margin-top: 8px;">
        ${data.revenueChangeVsLastWeek >= 0 ? 'Increase' : 'Decrease'} from last week
      </div>
      <div style="color: #999; font-size: 12px; margin-top: 5px; font-style: italic;">
  ${data.daysLeftInWeek > 0 ? `${data.daysLeftInWeek} days left in current week` : 'Current week complete'}
</div>
    </div>

    <!-- Performance Insights -->
    <div style="background: #e3f2fd; padding: 20px; border-radius: 8px; border-left: 4px solid #2196f3;">
      <h3 style="margin: 0 0 15px 0; color: #2c3e50;">Performance Insight</h3>
      <div style="color: #666; line-height: 1.6;">
        ${data.revenueChangeVsYesterday > 0 ? 
          `📈 Revenue increased ${Math.abs(data.revenueChangeVsYesterday).toFixed(1)}% from yesterday` : 
          data.revenueChangeVsYesterday < 0 ? 
          `📉 Revenue decreased ${Math.abs(data.revenueChangeVsYesterday).toFixed(1)}% from yesterday` : 
          '📊 Revenue unchanged from yesterday'
        }
        ${data.revenueChangeVsLastWeek > 0 ? 
          `<br>🚀 Week-over-week revenue increased ${Math.abs(data.revenueChangeVsLastWeek || 0).toFixed(1)}%` : 
          data.revenueChangeVsLastWeek < 0 ? 
          `<br>⚠️ Week-over-week revenue decreased ${Math.abs(data.revenueChangeVsLastWeek || 0).toFixed(1)}%` : 
          ''
        }
        ${data.bestDay && data.bestDay.revenue > data.todayRevenue ? 
          `<br>🏆 Best day: ${formatDateDisplay(data.bestDay.date)} with ${formatCurrency(data.bestDay.revenue)}` : 
          ''
        }
      </div>
    </div>
  </div>
</div>
    
    <!-- CUSTOMER INSIGHTS -->
    <div style="padding: 25px; border-bottom: 2px solid #eee;">
      <h2 style="color: #2c3e50; margin: 0 0 20px 0;">👥 Customer Insights</h2>
      
      <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 15px;">
        <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; text-align: center;">
          <div style="font-size: 20px; font-weight: bold; color: #2c3e50;">${formatNumber(data.totalCustomers)}</div>
          <div style="color: #666; font-weight: 600;">TOTAL CUSTOMERS</div>
        </div>
        
        <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; text-align: center;">
          <div style="font-size: 20px; font-weight: bold; color: #2c3e50;">${formatNumber(data.newCustomers)}</div>
          <div style="color: #666; font-weight: 600;">NEW CUSTOMERS</div>
        </div>
        
        <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; text-align: center;">
          <div style="font-size: 20px; font-weight: bold; color: #2c3e50;">${formatNumber(data.repeatCustomers)}</div>
          <div style="color: #666; font-weight: 600;">REPEAT CUSTOMERS</div>
        </div>
        
        <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; text-align: center;">
          <div style="font-size: 20px; font-weight: bold; color: #2c3e50;">
            ${data.totalCustomers > 0 ? formatPercent((data.repeatCustomers / data.totalCustomers) * 100) : '0.0%'}
          </div>
          <div style="color: #666; font-weight: 600;">REPEAT CUSTOMER RATE</div>
        </div>
      </div>
    </div>

    <!-- LAST 7 DAYS CUSTOMER INSIGHTS -->
    <div style="padding: 25px; border-bottom: 2px solid #eee;">
      <h2 style="color: #2c3e50; margin: 0 0 20px 0;">👥 Last 7 Days Customer Insights</h2>
      
      <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 15px;">
        <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; text-align: center;">
          <div style="font-size: 20px; font-weight: bold; color: #2c3e50;">${formatNumber(data.last7DaysTotalCustomers)}</div>
          <div style="color: #666; font-weight: 600;">7-DAY TOTAL CUSTOMERS</div>
        </div>
        
        <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; text-align: center;">
          <div style="font-size: 20px; font-weight: bold; color: #2c3e50;">${formatNumber(data.last7DaysNewCustomers)}</div>
          <div style="color: #666; font-weight: 600;">7-DAY NEW CUSTOMERS</div>
        </div>
        
        <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; text-align: center;">
          <div style="font-size: 20px; font-weight: bold; color: #2c3e50;">${formatNumber(data.last7DaysRepeatCustomers)}</div>
          <div style="color: #666; font-weight: 600;">7-DAY REPEAT CUSTOMERS</div>
        </div>
        
        <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; text-align: center;">
          <div style="font-size: 20px; font-weight: bold; color: #2c3e50;">${formatPercent(data.last7DaysRepeatCustomerRate)}</div>
          <div style="color: #666; font-weight: 600;">7-DAY REPEAT RATE</div>
        </div>
      </div>
    </div>

    <!-- LAST 7 DAYS FINANCIAL BREAKDOWN -->
    <div style="padding: 25px; border-bottom: 2px solid #eee;">
      <h2 style="color: #2c3e50; margin: 0 0 20px 0;">💰 Last 7 Days Financial Breakdown</h2>

      ${data.last7DaysMismatchSummary ? this.generateMismatchSummaryHTML(data.last7DaysMismatchSummary, 'day') : ''}

      <!-- Financial Summary -->
      <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 15px; margin-bottom: 25px;">
        <div style="background: #f8f9fa; padding: 15px; border-radius: 6px;">
          <div style="font-size: 18px; font-weight: bold; color: #2c3e50;">${formatCurrency(data.last7DaysTotalRevenue)}</div>
          <div style="color: #666; font-size: 12px;">Gross Sales</div>
          <div style="color: #999; font-size: 11px;">7 Days</div>
        </div>
        
        <div style="background: #f8f9fa; padding: 15px; border-radius: 6px;">
          <div style="font-size: 18px; font-weight: bold; color: #2c3e50;">${formatCurrency(data.last7DaysTotalDiscounts)}</div>
          <div style="color: #666; font-size: 12px;">Total Discounts</div>
          <div style="color: #999; font-size: 11px;">${formatPercent(data.last7DaysTotalDiscounts / data.last7DaysTotalRevenue * 100)} of gross</div>
        </div>
        
        <div style="background: #f8f9fa; padding: 15px; border-radius: 6px;">
          <div style="font-size: 18px; font-weight: bold; color: #2c3e50;">${formatCurrency(data.last7DaysTotalReturns)}</div>
          <div style="color: #666; font-size: 12px;">Returns & Refunds</div>
          <div style="color: #999; font-size: 11px;">${formatPercent(data.last7DaysTotalReturns / data.last7DaysTotalRevenue * 100)} of gross</div>
        </div>
        
        <div style="background: #f8f9fa; padding: 15px; border-radius: 6px;">
          <div style="font-size: 18px; font-weight: bold; color: #2c3e50;">${formatCurrency(data.last7DaysTotalExtraFees)}</div>
          <div style="color: #666; font-size: 12px;">Return Fees</div>
          <div style="color: #999; font-size: 11px;">${formatPercent(data.last7DaysTotalExtraFees / data.last7DaysTotalRevenue * 100)} of gross</div>
        </div>
        
        <div style="background: #f8f9fa; padding: 15px; border-radius: 6px;">
          <div style="font-size: 18px; font-weight: bold; color: #2c3e50;">${formatCurrency(data.last7DaysTotalNetSales)}</div>
          <div style="color: #666; font-size: 12px;">Net Sales</div>
          <div style="color: #999; font-size: 11px;">After ALL deductions</div>
        </div>
        
        <div style="background: #f8f9fa; padding: 15px; border-radius: 6px;">
          <div style="font-size: 18px; font-weight: bold; color: #2c3e50;">${formatCurrency(data.last7DaysTotalShipping)}</div>
          <div style="color: #666; font-size: 12px;">Shipping Charges</div>
          <div style="color: #999; font-size: 11px;">${formatPercent(data.last7DaysTotalShipping / data.last7DaysTotalNetSales * 100)} of net sales</div>
        </div>
        
        <div style="background: #f8f9fa; padding: 15px; border-radius: 6px;">
          <div style="font-size: 18px; font-weight: bold; color: #2c3e50;">${formatCurrency(data.last7DaysTotalTaxes)}</div>
          <div style="color: #666; font-size: 12px;">Taxes Collected</div>
          <div style="color: #999; font-size: 11px;">${formatPercent(data.last7DaysTotalTaxes / data.last7DaysTotalNetSales * 100)} of net sales</div>
        </div>
        
        <div style="background: #f8f9fa; padding: 15px; border-radius: 6px;">
          <div style="font-size: 18px; font-weight: bold; color: #2c3e50;">${formatCurrency(data.last7DaysTotalTotalSales)}</div>
          <div style="color: #666; font-size: 12px;">Total Sales</div>
          <div style="color: #999; font-size: 11px;">Final amount</div>
        </div>
      </div>

      <!-- Daily Financial Details -->
      <h3 style="margin: 30px 0 15px 0;">Daily Financial Details</h3>
      <div style="display: grid; grid-template-columns: repeat(7, 1fr); gap: 10px;">
        ${(data.dailyFinancials || []).map((day, index) => {
          const isToday = day.date === currentDate;
          
          return `
            <div style="background: ${isToday ? '#e3f2fd' : '#f8f9fa'}; padding: 15px; border-radius: 6px; border: 1px solid ${isToday ? '#2196f3' : '#e9ecef'};">
              <div style="font-weight: bold; color: #2c3e50;">${formatDateDisplay(day.date)}</div>
              <div style="color: #666; font-size: 12px; margin-bottom: 8px;">${getDayName(day.date)}</div>
              
              <div style="margin: 3px 0; font-size: 11px;">
                <span style="color: #666;">Gross Sales:</span>
                <div style="font-weight: bold;">${formatCurrency(day.total)}</div>
              </div>
              
              <div style="margin: 3px 0; font-size: 11px;">
                <span style="color: #666;">Discounts:</span>
                <div style="font-weight: bold;">${formatCurrency(day.discounts)}</div>
              </div>
              
              <div style="margin: 3px 0; font-size: 11px;">
                <span style="color: #666;">Returns:</span>
                <div style="font-weight: bold;">${formatCurrency(day.returns)}</div>
              </div>
              
              <div style="margin: 3px 0; font-size: 11px;">
                <span style="color: #666;">Net Sales:</span>
                <div style="font-weight: bold;">${formatCurrency(day.netSales)}</div>
              </div>
              
              <div style="margin: 3px 0; font-size: 11px;">
                <span style="color: #666;">Shipping:</span>
                <div style="font-weight: bold;">${formatCurrency(day.shipping)}</div>
              </div>
              
              <div style="margin: 3px 0; font-size: 11px;">
                <span style="color: #666;">Return Fees:</span>
                <div style="font-weight: bold;">${formatCurrency(day.extraFees)}</div>
              </div>
              
              <div style="margin: 3px 0; font-size: 11px;">
                <span style="color: #666;">Taxes:</span>
                <div style="font-weight: bold;">${formatCurrency(day.taxes)}</div>
              </div>
              
              <div style="margin: 3px 0; font-size: 11px;">
                <span style="color: #666;">Total Sales:</span>
                <div style="font-weight: bold;">${formatCurrency(day.totalSales)}</div>
              </div>
            </div>
          `;
        }).join('')}
      </div>
    </div>

    <!-- WEEKLY PERFORMANCE (LAST 8 WEEKS) -->
    <div style="padding: 25px; border-bottom: 2px solid #eee;">
      <h2 style="color: #2c3e50; margin: 0 0 20px 0;">📅 Weekly Performance (Last 8 Weeks)</h2>

      ${data.weeklyMismatchSummary ? this.generateMismatchSummaryHTML(data.weeklyMismatchSummary, 'week') : ''}
      
      <!-- Weekly Summary -->
      <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 15px; margin-bottom: 25px;">
        <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; text-align: center;">
          <div style="font-size: 20px; font-weight: bold; color: #2c3e50;">${formatNumber(data.weeklyTotalOrders)}</div>
          <div style="color: #666; font-weight: 600;">Total Orders</div>
        </div>
        
        <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; text-align: center;">
          <div style="font-size: 20px; font-weight: bold; color: #2c3e50;">${formatCurrency(data.weeklyTotalRevenue)}</div>
          <div style="color: #666; font-weight: 600;">Total Revenue</div>
        </div>
        
        <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; text-align: center;">
          <div style="font-size: 20px; font-weight: bold; color: #2c3e50;">${formatNumber(data.weeklyTotalItems)}</div>
          <div style="color: #666; font-weight: 600;">Total Items</div>
        </div>
        
        <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; text-align: center;">
          <div style="font-size: 20px; font-weight: bold; color: #2c3e50;">${formatCurrency(data.weeklyTotalRevenue / 8)}</div>
          <div style="color: #666; font-weight: 600;">Avg Weekly Revenue</div>
        </div>
      </div>

      <!-- Weekly Breakdown -->
      <h3 style="margin: 30px 0 15px 0;">Weekly Breakdown</h3>
      <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 15px;">
        ${(data.weeklySales || []).slice(0, 8).map((week, index) => {
          const isCurrentWeek = index === (data.weeklySales?.length || 0) - 1;
          
          return `
            <div style="background: ${isCurrentWeek ? '#e3f2fd' : '#f8f9fa'}; padding: 15px; border-radius: 6px; text-align: center; border: 1px solid ${isCurrentWeek ? '#2196f3' : '#e9ecef'};">
              <div style="font-weight: bold; color: #2c3e50; font-size: 14px;">${formatWeekDisplay(week.week)}</div>
              <div style="margin: 8px 0;">
                <span style="color: #666; font-size: 11px;">Orders</span>
                <div style="font-weight: bold; color: #2c3e50;">${formatNumber(week.orders)}</div>
              </div>
              <div style="margin: 8px 0;">
                <span style="color: #666; font-size: 11px;">Total Sales</span>
                <div style="font-weight: bold; color: #2c3e50;">${formatCurrency(week.revenue)}</div>
              </div>
              <div style="margin: 8px 0;">
                <span style="color: #666; font-size: 11px;">Items</span>
                <div style="font-weight: bold; color: #2c3e50;">${formatNumber(week.items)}</div>
              </div>
            </div>
          `;
        }).join('')}
      </div>
    </div>

    <!-- 8-WEEK PERIOD: ORDER EVENTS & FINANCIAL ADJUSTMENTS -->
    <div style="padding: 25px; border-bottom: 2px solid #eee;">
      <h2 style="color: #2c3e50; margin: 0 0 20px 0;">📅 8-Week Period: Order Events & Financial Adjustments</h2>
      
      ${data.last8WeeksEventSummary && data.last8WeeksEventSummary.totalEvents > 0 ? `
        <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; border: 1px solid #dee2e6;">
          <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 15px;">
            ${data.last8WeeksEventSummary.refunds.count > 0 ? `
              <div style="background: white; padding: 15px; border-radius: 6px; text-align: center; border: 1px solid #e9ecef;">
                <div style="color: #666; font-size: 12px; font-weight: 600; margin-bottom: 8px;">Full Refunds</div>
                <div style="font-size: 18px; font-weight: bold; color: #dc3545;">-${formatCurrency(Math.abs(data.last8WeeksEventSummary.refunds.value))}</div>
                <div style="color: #999; font-size: 11px; margin-top: 5px;">${data.last8WeeksEventSummary.refunds.count} refunds</div>
              </div>
            ` : ''}
            
            ${data.last8WeeksEventSummary.partialRefunds.count > 0 ? `
              <div style="background: white; padding: 15px; border-radius: 6px; text-align: center; border: 1px solid #e9ecef;">
                <div style="color: #666; font-size: 12px; font-weight: 600; margin-bottom: 8px;">Partial Refunds</div>
                <div style="font-size: 18px; font-weight: bold; color: #fd7e14;">-${formatCurrency(Math.abs(data.last8WeeksEventSummary.partialRefunds.value))}</div>
                <div style="color: #999; font-size: 11px; margin-top: 5px;">${data.last8WeeksEventSummary.partialRefunds.count} refunds</div>
              </div>
            ` : ''}
            
            ${data.last8WeeksEventSummary.exchanges.count > 0 ? `
              <div style="background: white; padding: 15px; border-radius: 6px; text-align: center; border: 1px solid #e9ecef;">
                <div style="color: #666; font-size: 12px; font-weight: 600; margin-bottom: 8px;">Exchanges</div>
                <div style="font-size: 18px; font-weight: bold; color: #6f42c1;">-${formatCurrency(Math.abs(data.last8WeeksEventSummary.exchanges.value))}</div>
                <div style="color: #999; font-size: 11px; margin-top: 5px;">${data.last8WeeksEventSummary.exchanges.count} exchanges</div>
              </div>
            ` : ''}
            
            <div style="background: white; padding: 15px; border-radius: 6px; text-align: center; border: 1px solid #e9ecef;">
              <div style="color: #666; font-size: 12px; font-weight: 600; margin-bottom: 8px;">Net Impact</div>
              <div style="font-size: 18px; font-weight: bold; color: #2c3e50;">-${formatCurrency(Math.abs(data.last8WeeksEventSummary.netValue))}</div>
              <div style="color: #999; font-size: 11px; margin-top: 5px;">across ${data.last8WeeksEventSummary.totalEvents} events</div>
            </div>
          </div>
        </div>
      ` : `
        <div style="background: #e8f5e8; padding: 15px; border-radius: 8px; text-align: center;">
          <div style="color: #155724; font-weight: 600;">No adjustments in the last 8 weeks</div>
        </div>
      `}
    </div>

    <!-- WEEKLY FINANCIAL BREAKDOWN (LAST 8 WEEKS) -->
    <div style="padding: 25px; border-bottom: 2px solid #eee;">
      <h2 style="color: #2c3e50; margin: 0 0 20px 0;">💰 Weekly Financial Breakdown (Last 8 Weeks)</h2>

      <!-- Financial Summary -->
      <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 15px; margin-bottom: 25px;">
        <!-- Gross Sales -->
        <div style="background: #f8f9fa; padding: 15px; border-radius: 6px;">
          <div style="font-size: 18px; font-weight: bold; color: #2c3e50;">${formatCurrency(data.weeklyTotalRevenue)}</div>
          <div style="color: #666; font-size: 12px;">Gross Sales</div>
          <div style="color: #999; font-size: 11px;">8 Weeks</div>
        </div>
        
        <!-- Total Discounts -->
        <div style="background: #f8f9fa; padding: 15px; border-radius: 6px;">
          <div style="font-size: 18px; font-weight: bold; color: #2c3e50;">${formatCurrency(data.weeklyTotalDiscounts)}</div>
          <div style="color: #666; font-size: 12px;">Total Discounts</div>
          <div style="color: #999; font-size: 11px;">${formatPercent(data.weeklyTotalDiscounts / data.weeklyTotalRevenue * 100)} of gross</div>
        </div>
        
        <!-- Returns & Refunds -->
        <div style="background: #f8f9fa; padding: 15px; border-radius: 6px;">
          <div style="font-size: 18px; font-weight: bold; color: #2c3e50;">${formatCurrency(data.weeklyTotalReturns)}</div>
          <div style="color: #666; font-size: 12px;">Returns & Refunds</div>
          <div style="color: #999; font-size: 11px;">${formatPercent(data.weeklyTotalReturns / data.weeklyTotalRevenue * 100)} of gross</div>
        </div>
        
        <!-- Return Fees -->
        <div style="background: #f8f9fa; padding: 15px; border-radius: 6px;">
          <div style="font-size: 18px; font-weight: bold; color: #2c3e50;">${formatCurrency(data.weeklyTotalExtraFees)}</div>
          <div style="color: #666; font-size: 12px;">Return Fees</div>
          <div style="color: #999; font-size: 11px;">${formatPercent(data.weeklyTotalExtraFees / data.weeklyTotalRevenue * 100)} of gross</div>
        </div>
        
        <!-- Net Sales -->
        <div style="background: #f8f9fa; padding: 15px; border-radius: 6px;">
          <div style="font-size: 18px; font-weight: bold; color: #2c3e50;">${formatCurrency(data.weeklyTotalNetSales)}</div>
          <div style="color: #666; font-size: 12px;">Net Sales</div>
          <div style="color: #999; font-size: 11px;">After ALL deductions</div>
        </div>
        
        <!-- Shipping Charges -->
        <div style="background: #f8f9fa; padding: 15px; border-radius: 6px;">
          <div style="font-size: 18px; font-weight: bold; color: #2c3e50;">${formatCurrency(data.weeklyTotalShipping)}</div>
          <div style="color: #666; font-size: 12px;">Shipping Charges</div>
          <div style="color: #999; font-size: 11px;">${formatPercent(data.weeklyTotalShipping / data.weeklyTotalNetSales * 100)} of net sales</div>
        </div>
        
        <!-- Taxes Collected -->
        <div style="background: #f8f9fa; padding: 15px; border-radius: 6px;">
          <div style="font-size: 18px; font-weight: bold; color: #2c3e50;">${formatCurrency(data.weeklyTotalTaxes)}</div>
          <div style="color: #666; font-size: 12px;">Taxes Collected</div>
          <div style="color: #999; font-size: 11px;">${formatPercent(data.weeklyTotalTaxes / data.weeklyTotalNetSales * 100)} of net sales</div>
        </div>
        
        <!-- Total Sales -->
        <div style="background: #f8f9fa; padding: 15px; border-radius: 6px;">
          <div style="font-size: 18px; font-weight: bold; color: #2c3e50;">${formatCurrency(data.weeklyTotalTotalSales)}</div>
          <div style="color: #666; font-size: 12px;">Total Sales</div>
          <div style="color: #999; font-size: 11px;">Final amount</div>
        </div>
      </div>

      <!-- Weekly Financial Details -->
      <h3 style="margin: 30px 0 15px 0;">Weekly Financial Details</h3>
      <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 15px;">
        ${(data.weeklyFinancials || []).map((week, index) => {
          const isCurrentWeek = index === (data.weeklyFinancials?.length || 0) - 1;
          
          return `
            <div style="background: ${isCurrentWeek ? '#e3f2fd' : '#f8f9fa'}; padding: 15px; border-radius: 6px; border: 1px solid ${isCurrentWeek ? '#2196f3' : '#e9ecef'};">
              <div style="font-weight: bold; color: #2c3e50; font-size: 14px;">${formatWeekDisplay(week.week)}</div>
              
              <div style="margin: 3px 0; font-size: 11px;">
                <span style="color: #666;">Gross Sales:</span>
                <div style="font-weight: bold;">${formatCurrency(week.total)}</div>
              </div>
              
              <div style="margin: 3px 0; font-size: 11px;">
                <span style="color: #666;">Discounts:</span>
                <div style="font-weight: bold;">${formatCurrency(week.discounts)}</div>
              </div>
              
              <div style="margin: 3px 0; font-size: 11px;">
                <span style="color: #666;">Returns:</span>
                <div style="font-weight: bold;">${formatCurrency(week.returns)}</div>
              </div>
              
              <div style="margin: 3px 0; font-size: 11px;">
                <span style="color: #666;">Net Sales:</span>
                <div style="font-weight: bold;">${formatCurrency(week.netSales)}</div>
              </div>
              
              <div style="margin: 3px 0; font-size: 11px;">
                <span style="color: #666;">Shipping:</span>
                <div style="font-weight: bold;">${formatCurrency(week.shipping)}</div>
              </div>
              
              <div style="margin: 3px 0; font-size: 11px;">
                <span style="color: #666;">Return Fees:</span>
                <div style="font-weight: bold;">${formatCurrency(week.extraFees)}</div>
              </div>
              
              <div style="margin: 3px 0; font-size: 11px;">
                <span style="color: #666;">Taxes:</span>
                <div style="font-weight: bold;">${formatCurrency(week.taxes)}</div>
              </div>
              
              <div style="margin: 3px 0; font-size: 11px;">
                <span style="color: #666;">Total Sales:</span>
                <div style="font-weight: bold;">${formatCurrency(week.totalSales)}</div>
              </div>
            </div>
          `;
        }).join('')}
      </div>
    </div>

    <!-- MONTHLY PERFORMANCE (LAST 6 MONTHS) -->
    <div style="padding: 25px; border-bottom: 2px solid #eee;">
      <h2 style="color: #2c3e50; margin: 0 0 20px 0;">📅 Monthly Performance (Last 6 Months)</h2>

      ${data.monthlyMismatchSummary ? this.generateMismatchSummaryHTML(data.monthlyMismatchSummary, 'month') : ''}
      
      <!-- Monthly Summary -->
      <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 15px; margin-bottom: 25px;">
        <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; text-align: center;">
          <div style="font-size: 20px; font-weight: bold; color: #2c3e50;">${formatNumber(data.monthlyFinancials.totalOrders)}</div>
          <div style="color: #666; font-weight: 600;">Total Orders</div>
        </div>
        
        <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; text-align: center;">
          <div style="font-size: 20px; font-weight: bold; color: #2c3e50;">${formatCurrency(data.monthlyFinancials.totalRevenue)}</div>
          <div style="color: #666; font-weight: 600;">Total Revenue</div>
        </div>
        
        <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; text-align: center;">
          <div style="font-size: 20px; font-weight: bold; color: #2c3e50;">${formatNumber(data.monthlyFinancials.totalItems)}</div>
          <div style="color: #666; font-weight: 600;">Total Items</div>
        </div>
        
        <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; text-align: center;">
          <div style="font-size: 20px; font-weight: bold; color: #2c3e50;">${formatCurrency(data.monthlyFinancials.totalRevenue / data.monthRanges.length)}</div>
          <div style="color: #666; font-weight: 600;">Avg Monthly Revenue</div>
        </div>
      </div>

      <!-- Monthly Breakdown -->
      <h3 style="margin: 30px 0 15px 0;">Monthly Breakdown</h3>
      <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 15px;">
        ${data.monthRanges.map((month, index) => {
          // Use monthlyTotals directly like weekly sections do
          const monthData = data.monthlyTotals[month] || {
            total: 0,
            totalSales: 0,
            orderCount: 0,
            items: 0
          };
          
          const currentMonth = new Date().toLocaleString("default", { month: "short", year: "numeric", timeZone: shopTimezone });
          const isCurrentMonth = month === currentMonth;
          
          // Calculate average revenue for performance indicator
          const totalRevenue = data.monthRanges.reduce((sum, m) => {
            const mData = data.monthlyTotals[m] || { total: 0 };
            return sum + mData.total;
          }, 0);
          const avgRevenue = totalRevenue / data.monthRanges.length;
          
          const performanceLevel = monthData.total > avgRevenue * 1.2 ? 'high' : 
                                 monthData.total > avgRevenue * 0.8 ? 'medium' : 'low';
          
          const performanceColor = performanceLevel === 'high' ? '#28a745' : 
                                  performanceLevel === 'medium' ? '#ffc107' : '#dc3545';
          
          return `
            <div style="background: ${isCurrentMonth ? '#e3f2fd' : '#f8f9fa'}; padding: 15px; border-radius: 6px; border: 1px solid ${isCurrentMonth ? '#2196f3' : performanceColor}; border-left: 4px solid ${performanceColor};">
              ${isCurrentMonth ? `
                <div style="background: #2196f3; color: white; padding: 2px 8px; border-radius: 12px; font-size: 10px; display: inline-block; margin-bottom: 10px;">Current</div>
              ` : ''}
              
              <div style="font-weight: bold; color: #2c3e50; font-size: 14px;">${month.split(' ')[0]}</div>
              <div style="color: #666; font-size: 12px; margin-bottom: 10px;">${month.split(' ')[1]}</div>
              
              <div style="margin: 8px 0;">
                <span style="color: #666; font-size: 11px;">Orders</span>
                <div style="font-weight: bold; color: #2c3e50;">${formatNumber(monthData.orderCount)}</div>
              </div>
              
              <div style="margin: 8px 0;">
                <span style="color: #666; font-size: 11px;">Total Sales</span>
                <div style="font-weight: bold; color: #2c3e50;">${formatCurrency(monthData.totalSales)}</div>
              </div>
              
              <div style="margin: 8px 0;">
                <span style="color: #666; font-size: 11px;">Items</span>
                <div style="font-weight: bold; color: #2c3e50;">${formatNumber(monthData.items)}</div>
              </div>
              
              <div style="margin: 8px 0;">
                <span style="color: #666; font-size: 11px;">Performance</span>
                <div style="font-weight: bold; color: ${performanceColor}; font-size: 11px;">
                  ${performanceLevel.toUpperCase()}
                </div>
              </div>
            </div>
          `;
        }).join('')}
      </div>
    </div>

    <!-- 6-MONTH OVERVIEW: ALL ORDER EVENTS & ADJUSTMENTS -->
    <div style="padding: 25px; border-bottom: 2px solid #eee;">
      <h2 style="color: #2c3e50; margin: 0 0 20px 0;">📈 6-Month Overview: All Order Events & Adjustments</h2>
      
      ${data.last6MonthsEventSummary && data.last6MonthsEventSummary.totalEvents > 0 ? `
        <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; border: 1px solid #dee2e6;">
          <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 15px;">
            ${data.last6MonthsEventSummary.refunds.count > 0 ? `
              <div style="background: white; padding: 15px; border-radius: 6px; text-align: center; border: 1px solid #e9ecef;">
                <div style="color: #666; font-size: 12px; font-weight: 600; margin-bottom: 8px;">Full Refunds</div>
                <div style="font-size: 18px; font-weight: bold; color: #dc3545;">-${formatCurrency(Math.abs(data.last6MonthsEventSummary.refunds.value))}</div>
                <div style="color: #999; font-size: 11px; margin-top: 5px;">${data.last6MonthsEventSummary.refunds.count} refunds</div>
              </div>
            ` : ''}
            
            ${data.last6MonthsEventSummary.partialRefunds.count > 0 ? `
              <div style="background: white; padding: 15px; border-radius: 6px; text-align: center; border: 1px solid #e9ecef;">
                <div style="color: #666; font-size: 12px; font-weight: 600; margin-bottom: 8px;">Partial Refunds</div>
                <div style="font-size: 18px; font-weight: bold; color: #fd7e14;">-${formatCurrency(Math.abs(data.last6MonthsEventSummary.partialRefunds.value))}</div>
                <div style="color: #999; font-size: 11px; margin-top: 5px;">${data.last6MonthsEventSummary.partialRefunds.count} refunds</div>
              </div>
            ` : ''}
            
            ${data.last6MonthsEventSummary.exchanges.count > 0 ? `
              <div style="background: white; padding: 15px; border-radius: 6px; text-align: center; border: 1px solid #e9ecef;">
                <div style="color: #666; font-size: 12px; font-weight: 600; margin-bottom: 8px;">Exchanges</div>
                <div style="font-size: 18px; font-weight: bold; color: #6f42c1;">-${formatCurrency(Math.abs(data.last6MonthsEventSummary.exchanges.value))}</div>
                <div style="color: #999; font-size: 11px; margin-top: 5px;">${data.last6MonthsEventSummary.exchanges.count} exchanges</div>
              </div>
            ` : ''}
            
            <div style="background: white; padding: 15px; border-radius: 6px; text-align: center; border: 1px solid #e9ecef;">
              <div style="color: #666; font-size: 12px; font-weight: 600; margin-bottom: 8px;">Net Impact</div>
              <div style="font-size: 18px; font-weight: bold; color: #2c3e50;">-${formatCurrency(Math.abs(data.last6MonthsEventSummary.netValue))}</div>
              <div style="color: #999; font-size: 11px; margin-top: 5px;">across ${data.last6MonthsEventSummary.totalEvents} events</div>
            </div>
          </div>
        </div>
      ` : `
        <div style="background: #e8f5e8; padding: 15px; border-radius: 8px; text-align: center;">
          <div style="color: #155724; font-weight: 600;">No adjustments in the last 6 months</div>
        </div>
      `}
    </div>

    <!-- MONTHLY FINANCIAL BREAKDOWN (LAST 6 MONTHS) -->
    <div style="padding: 25px; border-bottom: 2px solid #eee;">
      <h2 style="color: #2c3e50; margin: 0 0 20px 0;">💰 Monthly Financial Breakdown (Last 6 Months)</h2>

      <!-- Financial Summary - ALL 8 METRICS -->
      <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 15px; margin-bottom: 25px;">
        <!-- Gross Sales -->
        <div style="background: #f8f9fa; padding: 15px; border-radius: 6px;">
          <div style="font-size: 18px; font-weight: bold; color: #2c3e50;">${formatCurrency(data.monthlyFinancials.totalRevenue)}</div>
          <div style="color: #666; font-size: 12px;">Gross Sales</div>
          <div style="color: #999; font-size: 11px;">6 Months</div>
        </div>
        
        <!-- Total Discounts -->
        <div style="background: #f8f9fa; padding: 15px; border-radius: 6px;">
          <div style="font-size: 18px; font-weight: bold; color: #2c3e50;">${formatCurrency(data.monthlyFinancials.totalDiscounts)}</div>
          <div style="color: #666; font-size: 12px;">Total Discounts</div>
          <div style="color: #999; font-size: 11px;">${data.monthlyFinancials.totalRevenue > 0 ? formatPercent((data.monthlyFinancials.totalDiscounts / data.monthlyFinancials.totalRevenue) * 100) : '0.0%'} of gross</div>
        </div>
        
        <!-- Returns & Refunds -->
        <div style="background: #f8f9fa; padding: 15px; border-radius: 6px;">
          <div style="font-size: 18px; font-weight: bold; color: #2c3e50;">${formatCurrency(data.monthlyFinancials.totalReturns)}</div>
          <div style="color: #666; font-size: 12px;">Returns & Refunds</div>
          <div style="color: #999; font-size: 11px;">${data.monthlyFinancials.totalRevenue > 0 ? formatPercent((data.monthlyFinancials.totalReturns / data.monthlyFinancials.totalRevenue) * 100) : '0.0%'} of gross</div>
        </div>
        
        <!-- Return Fees -->
        <div style="background: #f8f9fa; padding: 15px; border-radius: 6px;">
          <div style="font-size: 18px; font-weight: bold; color: #2c3e50;">${formatCurrency(data.monthlyFinancials.totalExtraFees)}</div>
          <div style="color: #666; font-size: 12px;">Return Fees</div>
          <div style="color: #999; font-size: 11px;">${data.monthlyFinancials.totalRevenue > 0 ? formatPercent((data.monthlyFinancials.totalExtraFees / data.monthlyFinancials.totalRevenue) * 100) : '0.0%'} of gross</div>
        </div>
        
        <!-- Net Sales -->
        <div style="background: #f8f9fa; padding: 15px; border-radius: 6px;">
          <div style="font-size: 18px; font-weight: bold; color: #2c3e50;">${formatCurrency(data.monthlyFinancials.totalNetSales)}</div>
          <div style="color: #666; font-size: 12px;">Net Sales</div>
          <div style="color: #999; font-size: 11px;">After ALL deductions</div>
        </div>
        
        <!-- Shipping Charges -->
        <div style="background: #f8f9fa; padding: 15px; border-radius: 6px;">
          <div style="font-size: 18px; font-weight: bold; color: #2c3e50;">${formatCurrency(data.monthlyFinancials.totalShipping)}</div>
          <div style="color: #666; font-size: 12px;">Shipping Charges</div>
          <div style="color: #999; font-size: 11px;">${data.monthlyFinancials.totalNetSales > 0 ? formatPercent((data.monthlyFinancials.totalShipping / data.monthlyFinancials.totalNetSales) * 100) : '0.0%'} of net sales</div>
        </div>
        
        <!-- Taxes Collected -->
        <div style="background: #f8f9fa; padding: 15px; border-radius: 6px;">
          <div style="font-size: 18px; font-weight: bold; color: #2c3e50;">${formatCurrency(data.monthlyFinancials.totalTaxes)}</div>
          <div style="color: #666; font-size: 12px;">Taxes Collected</div>
          <div style="color: #999; font-size: 11px;">${data.monthlyFinancials.totalNetSales > 0 ? formatPercent((data.monthlyFinancials.totalTaxes / data.monthlyFinancials.totalNetSales) * 100) : '0.0%'} of net sales</div>
        </div>
        
        <!-- Total Sales -->
        <div style="background: #f8f9fa; padding: 15px; border-radius: 6px;">
          <div style="font-size: 18px; font-weight: bold; color: #2c3e50;">${formatCurrency(data.monthlyFinancials.totalTotalSales)}</div>
          <div style="color: #666; font-size: 12px;">Total Sales</div>
          <div style="color: #999; font-size: 11px;">Final amount</div>
        </div>
      </div>

      <!-- Monthly Financial Details -->
      <h3 style="margin: 30px 0 15px 0;">Monthly Financial Details</h3>
      <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 15px;">
        ${data.monthRanges.map((month, index) => {
          const monthData = data.monthlyTotals[month] || {
            total: 0,
            discounts: 0,
            returns: 0,
            netSales: 0,
            shipping: 0,
            taxes: 0,
            extraFees: 0,
            totalSales: 0
          };
          
          const currentMonth = new Date().toLocaleString("default", { month: "short", year: "numeric", timeZone: shopTimezone });
          const isCurrentMonth = month === currentMonth;
          
          return `
            <div style="background: ${isCurrentMonth ? '#e3f2fd' : '#f8f9fa'}; padding: 15px; border-radius: 6px; border: 1px solid ${isCurrentMonth ? '#2196f3' : '#e9ecef'};">
              ${isCurrentMonth ? `
                <div style="background: #2196f3; color: white; padding: 2px 8px; border-radius: 12px; font-size: 10px; display: inline-block; margin-bottom: 10px;">Current</div>
              ` : ''}
              
              <div style="font-weight: bold; color: #2c3e50; font-size: 14px;">${month.split(' ')[0]}</div>
              <div style="color: #666; font-size: 12px; margin-bottom: 10px;">${month.split(' ')[1]}</div>
              
              <div style="margin: 3px 0; font-size: 11px;">
                <span style="color: #666;">Gross Sales:</span>
                <div style="font-weight: bold;">${formatCurrency(monthData.total)}</div>
              </div>
              
              <div style="margin: 3px 0; font-size: 11px;">
                <span style="color: #666;">Discounts:</span>
                <div style="font-weight: bold;">${formatCurrency(monthData.discounts)}</div>
              </div>
              
              <div style="margin: 3px 0; font-size: 11px;">
                <span style="color: #666;">Returns:</span>
                <div style="font-weight: bold;">${formatCurrency(monthData.returns)}</div>
              </div>
              
              <div style="margin: 3px 0; font-size: 11px;">
                <span style="color: #666;">Net Sales:</span>
                <div style="font-weight: bold;">${formatCurrency(monthData.netSales)}</div>
              </div>
              
              <div style="margin: 3px 0; font-size: 11px;">
                <span style="color: #666;">Shipping Charges:</span>
                <div style="font-weight: bold;">${formatCurrency(monthData.shipping)}</div>
              </div>
              
              <div style="margin: 3px 0; font-size: 11px;">
                <span style="color: #666;">Return Fees:</span>
                <div style="font-weight: bold;">${formatCurrency(monthData.extraFees || 0)}</div>
              </div>
              
              <div style="margin: 3px 0; font-size: 11px;">
                <span style="color: #666;">Taxes:</span>
                <div style="font-weight: bold;">${formatCurrency(monthData.taxes)}</div>
              </div>
              
              <div style="margin: 3px 0; font-size: 11px;">
                <span style="color: #666;">Total Sales:</span>
                <div style="font-weight: bold;">${formatCurrency(monthData.totalSales)}</div>
              </div>
            </div>
          `;
        }).join('')}
      </div>
    </div>

    <!-- FOOTER -->
    <div style="background: #2c3e50; color: white; padding: 20px; text-align: center;">
      <p style="margin: 0 0 10px 0;"><strong>Analytics Dashboard Report</strong> - Comprehensive Business Insights</p>
      <p style="margin: 0 0 10px 0; font-size: 12px;">Generated automatically By Nexus • ${timestamp}</p>
      <p style="margin: 0; font-size: 12px;">For detailed analytics and interactive charts, visit your dashboard</p>
    </div>

  </div>
</body>
</html>
    `;
  }

  private generateTextVersion(data: EmailOrderData, shop: string, shopCurrency: string, shopTimezone: string): string {
  console.log(`📧 Generating text version with currency: ${shopCurrency}`);

  // Use the passed shopCurrency parameter
  const formatCurrency = (amount: number | undefined) => {
    const safeAmount = amount || 0;
    return safeAmount.toLocaleString('en-US', { 
      style: 'currency', 
      currency: shopCurrency,
      minimumFractionDigits: 2 
    });
  };

  const formatNumber = (num: number | undefined) => {
    const safeNum = num || 0;
    return safeNum.toLocaleString('en-US');
  };

  const formatPercent = (num: number | undefined) => {
    const safeNum = num || 0;
    return `${safeNum.toFixed(1)}%`;
  };

  // Helper function to format date display
  const formatDateDisplay = (dateStr: string) => {
    try {
      const date = new Date(dateStr + 'T00:00:00');
      return date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric',
        timeZone: shopTimezone 
      });
    } catch (error) {
      return dateStr;
    }
  };

  const currentDate = data.currentDateInShopTZ || new Date().toISOString().split('T')[0];
  const timestamp = new Date().toLocaleDateString() + ' at ' + new Date().toLocaleTimeString();

  // Event summary text
  const getEventSummaryText = (eventSummary: any, title: string) => {
    if (!eventSummary || eventSummary.totalEvents === 0) return '';
    
    return `
${title} (${eventSummary.totalEvents} event${eventSummary.totalEvents !== 1 ? 's' : ''}):
- Full Refunds: ${eventSummary.refunds.count} (${formatCurrency(Math.abs(eventSummary.refunds.value))})
- Partial Refunds: ${eventSummary.partialRefunds.count} (${formatCurrency(Math.abs(eventSummary.partialRefunds.value))})
- Exchanges: ${eventSummary.exchanges.count} (${formatCurrency(Math.abs(eventSummary.exchanges.value))})
- Net Impact: ${formatCurrency(Math.abs(eventSummary.netValue))}
`;
  };

  // Mismatch summary text
  const getMismatchSummaryText = (mismatchSummary: any, periodType: string) => {
    if (!mismatchSummary || !mismatchSummary.hasMismatches) return '';
    
    const periodLabel = periodType === 'day' ? 'Days' : periodType === 'week' ? 'Weeks' : 'Months';
    return `⚠️ CALCULATION VERIFICATION: ${mismatchSummary.totalMismatches} ${periodLabel.toLowerCase()} with mismatches (Total difference: ${formatCurrency(Math.abs(mismatchSummary.totalDifference))})
`;
  };

  return `
DAILY ANALYTICS REPORT - ${shop}
Generated: ${timestamp}
Store Timezone: ${shopTimezone} | Currency: ${shopCurrency}

================================================================================
TODAY'S PERFORMANCE (${formatDateDisplay(currentDate)})
================================================================================

${getMismatchSummaryText(data.todayMismatchSummary, 'day')}
- Orders: ${formatNumber(data.todayOrders)}
- Revenue: ${formatCurrency(data.todayRevenue)}
- Items: ${formatNumber(data.todayItems)}
- Fulfilled: ${formatNumber(data.todayFulfilled)}
- Unfulfilled: ${formatNumber(data.todayUnfulfilled)}

${getEventSummaryText(data.todayEventSummary, "TODAY'S ORDER ADJUSTMENTS")}

================================================================================
LAST 7 DAYS PERFORMANCE
================================================================================

- Total Orders: ${formatNumber(data.last7DaysOrders)}
- Total Sales: ${formatCurrency(data.last7DaysRevenue)}
- Total Items: ${formatNumber(data.last7DaysItems)}
- Avg Daily Sales: ${formatCurrency(data.averageDailyRevenue)}

DAILY BREAKDOWN:
${(data.dailySales || []).map(day => 
  `  ${formatDateDisplay(day.date)}: ${formatNumber(day.orders)} orders, ${formatCurrency(day.revenue)} revenue, ${formatNumber(day.items)} items`
).join('\n')}

${getEventSummaryText(data.last7DaysEventSummary, "LAST 7 DAYS ADJUSTMENTS")}

================================================================================
WEEK-OVER-WEEK INSIGHT
================================================================================

- Revenue Change vs Last Week: ${data.revenueChangeVsLastWeek >= 0 ? '↗' : '↘'} ${Math.abs(data.revenueChangeVsLastWeek || 0).toFixed(1)}%
- Average Order Value: ${formatCurrency(data.averageOrderValue)}
- Average Items Per Order: ${formatNumber(data.averageItemsPerOrder)}

================================================================================
CUSTOMER INSIGHTS
================================================================================

OVERALL CUSTOMERS:
- Total Customers: ${formatNumber(data.totalCustomers)}
- New Customers: ${formatNumber(data.newCustomers)}
- Repeat Customers: ${formatNumber(data.repeatCustomers)}
- Repeat Customer Rate: ${formatPercent(data.customerRetentionRate)}

LAST 7 DAYS CUSTOMERS:
- Total Customers: ${formatNumber(data.last7DaysTotalCustomers)}
- New Customers: ${formatNumber(data.last7DaysNewCustomers)}
- Repeat Customers: ${formatNumber(data.last7DaysRepeatCustomers)}
- Repeat Rate: ${formatPercent(data.last7DaysRepeatCustomerRate)}

================================================================================
FINANCIAL BREAKDOWN - LAST 7 DAYS
================================================================================

${getMismatchSummaryText(data.last7DaysMismatchSummary, 'day')}
GROSS SALES: ${formatCurrency(data.last7DaysTotalRevenue)}
- Total Discounts: ${formatCurrency(data.last7DaysTotalDiscounts)} (${formatPercent(data.last7DaysTotalDiscounts / data.last7DaysTotalRevenue * 100)} of gross)
- Returns & Refunds: ${formatCurrency(data.last7DaysTotalReturns)} (${formatPercent(data.last7DaysTotalReturns / data.last7DaysTotalRevenue * 100)} of gross)
- Return Fees: ${formatCurrency(data.last7DaysTotalExtraFees)} (${formatPercent(data.last7DaysTotalExtraFees / data.last7DaysTotalRevenue * 100)} of gross)

NET SALES: ${formatCurrency(data.last7DaysTotalNetSales)}
- Shipping Charges: ${formatCurrency(data.last7DaysTotalShipping)} (${formatPercent(data.last7DaysTotalShipping / data.last7DaysTotalNetSales * 100)} of net)
- Taxes Collected: ${formatCurrency(data.last7DaysTotalTaxes)} (${formatPercent(data.last7DaysTotalTaxes / data.last7DaysTotalNetSales * 100)} of net)

TOTAL SALES: ${formatCurrency(data.last7DaysTotalTotalSales)}

DAILY FINANCIAL DETAILS:
${(data.dailyFinancials || []).map(day => 
  `  ${formatDateDisplay(day.date)}: Gross ${formatCurrency(day.total)}, Net ${formatCurrency(day.netSales)}, Final ${formatCurrency(day.totalSales)}`
).join('\n')}

================================================================================
WEEKLY PERFORMANCE (LAST 8 WEEKS)
================================================================================

${getMismatchSummaryText(data.weeklyMismatchSummary, 'week')}
- Total Orders: ${formatNumber(data.weeklyTotalOrders)}
- Total Revenue: ${formatCurrency(data.weeklyTotalRevenue)}
- Total Items: ${formatNumber(data.weeklyTotalItems)}
- Avg Weekly Revenue: ${formatCurrency(data.weeklyTotalRevenue / 8)}

WEEKLY BREAKDOWN:
${(data.weeklySales || []).slice(0, 8).map(week => 
  `  ${formatWeekDisplay(week.week)}: ${formatNumber(week.orders)} orders, ${formatCurrency(week.revenue)} revenue`
).join('\n')}

${getEventSummaryText(data.last8WeeksEventSummary, "8-WEEK PERIOD ADJUSTMENTS")}

WEEKLY FINANCIAL BREAKDOWN:
- Gross Sales: ${formatCurrency(data.weeklyTotalRevenue)}
- Total Discounts: ${formatCurrency(data.weeklyTotalDiscounts)}
- Returns & Refunds: ${formatCurrency(data.weeklyTotalReturns)}
- Return Fees: ${formatCurrency(data.weeklyTotalExtraFees)}
- Net Sales: ${formatCurrency(data.weeklyTotalNetSales)}
- Shipping: ${formatCurrency(data.weeklyTotalShipping)}
- Taxes: ${formatCurrency(data.weeklyTotalTaxes)}
- Total Sales: ${formatCurrency(data.weeklyTotalTotalSales)}

================================================================================
MONTHLY PERFORMANCE (LAST 6 MONTHS)
================================================================================

${getMismatchSummaryText(data.monthlyMismatchSummary, 'month')}
- Total Orders: ${formatNumber(data.monthlyFinancials.totalOrders)}
- Total Revenue: ${formatCurrency(data.monthlyFinancials.totalRevenue)}
- Total Items: ${formatNumber(data.monthlyFinancials.totalItems)}
- Avg Monthly Revenue: ${formatCurrency(data.monthlyFinancials.totalRevenue / data.monthRanges.length)}

MONTHLY BREAKDOWN:
${data.monthRanges.map(month => {
  const monthData = data.monthlyTotals[month] || { orderCount: 0, totalSales: 0, items: 0 };
  return `  ${month}: ${formatNumber(monthData.orderCount)} orders, ${formatCurrency(monthData.totalSales)} revenue, ${formatNumber(monthData.items)} items`;
}).join('\n')}

${getEventSummaryText(data.last6MonthsEventSummary, "6-MONTH OVERVIEW ADJUSTMENTS")}

MONTHLY FINANCIAL BREAKDOWN:
- Gross Sales: ${formatCurrency(data.monthlyFinancials.totalRevenue)}
- Total Discounts: ${formatCurrency(data.monthlyFinancials.totalDiscounts)}
- Returns & Refunds: ${formatCurrency(data.monthlyFinancials.totalReturns)}
- Return Fees: ${formatCurrency(data.monthlyFinancials.totalExtraFees)}
- Net Sales: ${formatCurrency(data.monthlyFinancials.totalNetSales)}
- Shipping: ${formatCurrency(data.monthlyFinancials.totalShipping)}
- Taxes: ${formatCurrency(data.monthlyFinancials.totalTaxes)}
- Total Sales: ${formatCurrency(data.monthlyFinancials.totalTotalSales)}

================================================================================
OVERALL SUMMARY
================================================================================

- Total Orders Processed: ${formatNumber(data.totalOrders)}
- Total Revenue: ${formatCurrency(data.totalRevenue)}
- Net Revenue: ${formatCurrency(data.netRevenue)}
- Fulfillment Rate: ${formatPercent(data.fulfillmentRate)}
- Orders Loaded: ${formatNumber(data.ordersLoaded)}

================================================================================
END OF REPORT
================================================================================

For detailed analytics and interactive charts, visit your dashboard.
This report was generated automatically by Nexus Analytics.
`;
}
}