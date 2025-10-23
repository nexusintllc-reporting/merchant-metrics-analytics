// // import sgMail from "@sendgrid/mail";
// // import { StoreEmailSettings } from "../models/StoreEmailSettings.server";
// // import { OrderData } from "./analyticsCollector.server";

// // // Initialize SendGrid
// // if (process.env.SENDGRID_API_KEY) {
// //   sgMail.setApiKey(process.env.SENDGRID_API_KEY);
// // }

// // export class AnalyticsEmailService {
// //   private shop: string;

// //   constructor(shop: string) {
// //     this.shop = shop;
// //   }

// //   async sendDailyAnalytics(analyticsData: OrderData) {
// //     try {
// //       // Validate SendGrid configuration
// //       if (!process.env.SENDGRID_API_KEY) {
// //         throw new Error('Email service not configured');
// //       }

// //       if (!process.env.SENDGRID_FROM_EMAIL) {
// //         throw new Error('Sender email not configured');
// //       }

// //       // Fetch store email settings
// //       const settings = await StoreEmailSettings.get(this.shop);
      
// //       if (!settings) {
// //         throw new Error('Email settings not configured for this store');
// //       }

// //       if (!settings.enabled) {
// //         return {
// //           success: true,
// //           skipped: true,
// //           message: 'Email notifications are disabled'
// //         };
// //       }

// //       // NEW: Get all email addresses (primary + additional)
// //       const allEmails = [
// //         settings.fromEmail,
// //         ...(settings.additionalEmails || [])
// //       ].filter(email => email && email.trim() && this.isValidEmail(email));

// //       if (allEmails.length === 0) {
// //         throw new Error('No valid recipient email addresses configured');
// //       }

// //       // Build email with analytics data
// //       const emailContent = this.buildAnalyticsEmail(analyticsData, this.shop);
      
// //       const msg = {
// //         to: allEmails, // NEW: Send to all emails
// //         from: process.env.SENDGRID_FROM_EMAIL,
// //         subject: `Daily Analytics Report - ${this.shop} - ${new Date().toLocaleDateString()}`,
// //         html: emailContent,
// //         text: this.generateTextVersion(analyticsData, this.shop),
// //       };

// //       const result = await sgMail.send(msg);
      
// //       return {
// //         success: true,
// //         message: `Email sent successfully to ${allEmails.length} recipient(s)`,
// //         recipients: allEmails,
// //         result
// //       };

// //     } catch (error: any) {
// //       console.error('🔍 DEBUG: SendGrid Error Details:', error);
// //       console.error('🔍 DEBUG: SendGrid Response:', error?.response?.body);
// //       console.error('🔍 DEBUG: SendGrid Code:', error?.code);
      
// //       throw new Error(`Failed to send analytics email: ${error.message}`);
// //     }
// //   }

// //   private isValidEmail(email: string): boolean {
// //     const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
// //     return emailRegex.test(email);
// //   }

// //   private buildAnalyticsEmail(data: OrderData, shop: string): string {
// //     const formatCurrency = (amount: number) => `$${amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
// //     const formatNumber = (num: number) => num.toLocaleString();
// //     const formatPercent = (num: number) => `${num >= 0 ? '+' : ''}${num.toFixed(1)}%`;

// //     const getTrendIcon = (value: number) => value >= 0 ? '↑' : '↓';

// //     return `
// // <!DOCTYPE html>
// // <html>
// // <head>
// //     <meta charset="utf-8">
// //     <meta name="viewport" content="width=device-width, initial-scale=1">
// //     <title>Analytics Report - ${shop}</title>
// //     <style>
// //         body {
// //             font-family: Arial, sans-serif;
// //             line-height: 1.6;
// //             color: #333333;
// //             margin: 0;
// //             padding: 0;
// //             background-color: #f8f9fa;
// //         }
// //         .container {
// //             max-width: 600px;
// //             margin: 0 auto;
// //             background: #ffffff;
// //             border-radius: 8px;
// //             overflow: hidden;
// //             box-shadow: 0 2px 10px rgba(0,0,0,0.1);
// //         }
// //         .header {
// //             background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
// //             color: white;
// //             padding: 30px 20px;
// //             text-align: center;
// //         }
// //         .header h1 {
// //             margin: 0;
// //             font-size: 28px;
// //             font-weight: bold;
// //         }
// //         .header .subtitle {
// //             margin: 8px 0 0 0;
// //             font-size: 16px;
// //             opacity: 0.9;
// //         }
// //         .content {
// //             padding: 30px;
// //         }
// //         .section {
// //             margin-bottom: 30px;
// //             border: 1px solid #e9ecef;
// //             border-radius: 8px;
// //             overflow: hidden;
// //         }
// //         .section-header {
// //             background: #f8f9fa;
// //             padding: 15px 20px;
// //             border-bottom: 1px solid #e9ecef;
// //         }
// //         .section-header h2 {
// //             margin: 0;
// //             font-size: 18px;
// //             color: #495057;
// //             font-weight: 600;
// //         }
// //         .section-body {
// //             padding: 20px;
// //         }
// //         .metrics-grid {
// //             display: block;
// //         }
// //         .metric-row {
// //             display: flex;
// //             justify-content: space-between;
// //             margin-bottom: 15px;
// //             padding-bottom: 15px;
// //             border-bottom: 1px solid #f1f3f4;
// //         }
// //         .metric-row:last-child {
// //             margin-bottom: 0;
// //             padding-bottom: 0;
// //             border-bottom: none;
// //         }
// //         .metric-item {
// //             flex: 1;
// //             text-align: center;
// //         }
// //         .metric-value {
// //             font-size: 24px;
// //             font-weight: bold;
// //             color: #2c3e50;
// //             margin: 0 0 5px 0;
// //         }
// //         .metric-label {
// //             font-size: 12px;
// //             color: #6c757d;
// //             margin: 0;
// //             text-transform: uppercase;
// //             letter-spacing: 0.5px;
// //         }
// //         .metric-change {
// //             font-size: 11px;
// //             padding: 2px 8px;
// //             border-radius: 10px;
// //             display: inline-block;
// //             margin-top: 4px;
// //         }
// //         .change-positive {
// //             background: #d4edda;
// //             color: #155724;
// //         }
// //         .change-negative {
// //             background: #f8d7da;
// //             color: #721c24;
// //         }
// //         .daily-grid {
// //             display: block;
// //         }
// //         .daily-row {
// //             display: flex;
// //             justify-content: space-between;
// //             align-items: center;
// //             padding: 10px 0;
// //             border-bottom: 1px solid #f1f3f4;
// //         }
// //         .daily-row:last-child {
// //             border-bottom: none;
// //         }
// //         .daily-date {
// //             font-weight: 600;
// //             color: #495057;
// //             min-width: 80px;
// //         }
// //         .daily-metrics {
// //             display: flex;
// //             gap: 20px;
// //         }
// //         .daily-metric {
// //             text-align: right;
// //             min-width: 80px;
// //         }
// //         .daily-value {
// //             font-weight: 600;
// //             color: #2c3e50;
// //         }
// //         .daily-label {
// //             font-size: 10px;
// //             color: #6c757d;
// //             text-transform: uppercase;
// //         }
// //         .today-highlight {
// //             background: #e7f3ff;
// //             border-left: 4px solid #007bff;
// //             margin: 0 -20px;
// //             padding: 10px 20px;
// //         }
// //         .summary-grid {
// //             display: flex;
// //             justify-content: space-between;
// //             flex-wrap: wrap;
// //             gap: 15px;
// //         }
// //         .summary-card {
// //             flex: 1;
// //             min-width: 120px;
// //             text-align: center;
// //             padding: 15px;
// //             background: #f8f9fa;
// //             border-radius: 6px;
// //             border: 1px solid #e9ecef;
// //         }
// //         .summary-value {
// //             font-size: 20px;
// //             font-weight: bold;
// //             color: #2c3e50;
// //             margin: 0 0 5px 0;
// //         }
// //         .summary-label {
// //             font-size: 11px;
// //             color: #6c757d;
// //             margin: 0;
// //             text-transform: uppercase;
// //             letter-spacing: 0.5px;
// //         }
// //         .footer {
// //             background: #f8f9fa;
// //             padding: 20px;
// //             text-align: center;
// //             border-top: 1px solid #e9ecef;
// //         }
// //         .footer-text {
// //             font-size: 12px;
// //             color: #6c757d;
// //             margin: 0;
// //         }
// //         .highlight {
// //             background: #fff3cd;
// //             padding: 15px;
// //             border-radius: 6px;
// //             border-left: 4px solid #ffc107;
// //             margin: 15px 0;
// //         }
// //         .highlight strong {
// //             color: #856404;
// //         }
// //     </style>
// // </head>
// // <body>
// //     <div class="container">
// //         <!-- Header -->
// //         <div class="header">
// //             <h1>Analytics Report</h1>
// //             <div class="subtitle">${shop} • ${new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</div>
// //         </div>

// //         <!-- Content -->
// //         <div class="content">
// //             <!-- Today's Performance -->
// //             <div class="section">
// //                 <div class="section-header">
// //                     <h2>Today's Performance</h2>
// //                 </div>
// //                 <div class="section-body">
// //                     <div class="metrics-grid">
// //                         <div class="metric-row">
// //                             <div class="metric-item">
// //                                 <div class="metric-value">${formatNumber(data.todayOrders)}</div>
// //                                 <div class="metric-label">Orders</div>
// //                                 ${data.ordersChangeVsYesterday !== 0 ? `
// //                                 <div class="metric-change ${data.ordersChangeVsYesterday >= 0 ? 'change-positive' : 'change-negative'}">
// //                                     ${getTrendIcon(data.ordersChangeVsYesterday)} ${formatPercent(data.ordersChangeVsYesterday)}
// //                                 </div>
// //                                 ` : ''}
// //                             </div>
// //                             <div class="metric-item">
// //                                 <div class="metric-value">${formatCurrency(data.todayRevenue)}</div>
// //                                 <div class="metric-label">Revenue</div>
// //                                 ${data.revenueChangeVsYesterday !== 0 ? `
// //                                 <div class="metric-change ${data.revenueChangeVsYesterday >= 0 ? 'change-positive' : 'change-negative'}">
// //                                     ${getTrendIcon(data.revenueChangeVsYesterday)} ${formatPercent(data.revenueChangeVsYesterday)}
// //                                 </div>
// //                                 ` : ''}
// //                             </div>
// //                             <div class="metric-item">
// //                                 <div class="metric-value">${formatNumber(data.todayItems)}</div>
// //                                 <div class="metric-label">Items Sold</div>
// //                                 ${data.itemsChangeVsYesterday !== 0 ? `
// //                                 <div class="metric-change ${data.itemsChangeVsYesterday >= 0 ? 'change-positive' : 'change-negative'}">
// //                                     ${getTrendIcon(data.itemsChangeVsYesterday)} ${formatPercent(data.itemsChangeVsYesterday)}
// //                                 </div>
// //                                 ` : ''}
// //                             </div>
// //                         </div>
// //                     </div>
// //                 </div>
// //             </div>

// //             <!-- Customer Insights -->
// //             <div class="section">
// //                 <div class="section-header">
// //                     <h2>Customer Insights</h2>
// //                 </div>
// //                 <div class="section-body">
// //                     <div class="metrics-grid">
// //                         <div class="metric-row">
// //                             <div class="metric-item">
// //                                 <div class="metric-value">${formatNumber(data.totalCustomers)}</div>
// //                                 <div class="metric-label">Total Customers</div>
// //                             </div>
// //                             <div class="metric-item">
// //                                 <div class="metric-value">${formatNumber(data.newCustomers)}</div>
// //                                 <div class="metric-label">New Customers</div>
// //                             </div>
// //                             <div class="metric-item">
// //                                 <div class="metric-value">${formatNumber(data.repeatCustomers)}</div>
// //                                 <div class="metric-label">Repeat Customers</div>
// //                             </div>
// //                             <div class="metric-item">
// //                                 <div class="metric-value">${data.repeatCustomerRate.toFixed(1)}%</div>
// //                                 <div class="metric-label">Repeat Rate</div>
// //                             </div>
// //                         </div>
// //                     </div>
// //                 </div>
// //             </div>

// //             <!-- Fulfillment Status -->
// //             <div class="section">
// //                 <div class="section-header">
// //                     <h2>Order Fulfillment</h2>
// //                 </div>
// //                 <div class="section-body">
// //                     <div class="metrics-grid">
// //                         <div class="metric-row">
// //                             <div class="metric-item">
// //                                 <div class="metric-value">${formatNumber(data.todayFulfilled)}</div>
// //                                 <div class="metric-label">Fulfilled Today</div>
// //                             </div>
// //                             <div class="metric-item">
// //                                 <div class="metric-value">${formatNumber(data.todayUnfulfilled)}</div>
// //                                 <div class="metric-label">Unfulfilled Today</div>
// //                             </div>
// //                             <div class="metric-item">
// //                                 <div class="metric-value">${data.fulfillmentRate.toFixed(1)}%</div>
// //                                 <div class="metric-label">Fulfillment Rate</div>
// //                             </div>
// //                         </div>
// //                     </div>
// //                 </div>
// //             </div>

// //             <!-- Last 7 Days Performance -->
// //             <div class="section">
// //                 <div class="section-header">
// //                     <h2>Last 7 Days Performance</h2>
// //                 </div>
// //                 <div class="section-body">
// //                     <div class="daily-grid">
// //                         ${data.dailySales.map(day => {
// //                             const date = new Date(day.date);
// //                             const isToday = day.date === new Date().toISOString().split('T')[0];
// //                             const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
// //                             const dateStr = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
                            
// //                             return `
// //                             <div class="daily-row ${isToday ? 'today-highlight' : ''}">
// //                                 <div class="daily-date">
// //                                     ${dayName}, ${dateStr}
// //                                     ${isToday ? ' <strong>(Today)</strong>' : ''}
// //                                 </div>
// //                                 <div class="daily-metrics">
// //                                     <div class="daily-metric">
// //                                         <div class="daily-value">${formatCurrency(day.revenue)}</div>
// //                                         <div class="daily-label">Revenue</div>
// //                                     </div>
// //                                     <div class="daily-metric">
// //                                         <div class="daily-value">${formatNumber(day.orders)}</div>
// //                                         <div class="daily-label">Orders</div>
// //                                     </div>
// //                                     <div class="daily-metric">
// //                                         <div class="daily-value">${formatNumber(day.items)}</div>
// //                                         <div class="daily-label">Items</div>
// //                                     </div>
// //                                 </div>
// //                             </div>
// //                             `;
// //                         }).join('')}
// //                     </div>

// //                     <!-- 7-Day Summary -->
// //                     <div class="summary-grid" style="margin-top: 20px;">
// //                         <div class="summary-card">
// //                             <div class="summary-value">${formatNumber(data.dailySales.reduce((sum, day) => sum + day.orders, 0))}</div>
// //                             <div class="summary-label">Total Orders</div>
// //                         </div>
// //                         <div class="summary-card">
// //                             <div class="summary-value">${formatCurrency(data.dailySales.reduce((sum, day) => sum + day.revenue, 0))}</div>
// //                             <div class="summary-label">Total Revenue</div>
// //                         </div>
// //                         <div class="summary-card">
// //                             <div class="summary-value">${formatCurrency(data.averageDailyRevenue)}</div>
// //                             <div class="summary-label">Avg Daily Revenue</div>
// //                         </div>
// //                     </div>
// //                 </div>
// //             </div>

// //             <!-- Overall Business Summary -->
// //             <div class="section">
// //                 <div class="section-header">
// //                     <h2>Business Overview</h2>
// //                 </div>
// //                 <div class="section-body">
// //                     <div class="summary-grid">
// //                         <div class="summary-card">
// //                             <div class="summary-value">${formatNumber(data.totalOrders)}</div>
// //                             <div class="summary-label">All-Time Orders</div>
// //                         </div>
// //                         <div class="summary-card">
// //                             <div class="summary-value">${formatCurrency(data.totalRevenue)}</div>
// //                             <div class="summary-label">All-Time Revenue</div>
// //                         </div>
// //                         <div class="summary-card">
// //                             <div class="summary-value">${formatCurrency(data.averageOrderValue)}</div>
// //                             <div class="summary-label">Avg Order Value</div>
// //                         </div>
// //                         <div class="summary-card">
// //                             <div class="summary-value">${formatNumber(data.ordersLoaded)}</div>
// //                             <div class="summary-label">Orders Analyzed</div>
// //                         </div>
// //                     </div>
// //                 </div>
// //             </div>

// //             <!-- Performance Insight -->
// //             ${data.revenueChangeVsYesterday !== 0 || data.ordersChangeVsYesterday !== 0 ? `
// //             <div class="highlight">
// //                 <strong>Performance Insight:</strong><br>
// //                 ${data.revenueChangeVsYesterday > 0 ? `Revenue is up ${formatPercent(data.revenueChangeVsYesterday)} from yesterday.` : ''}
// //                 ${data.revenueChangeVsYesterday < 0 ? `Revenue is down ${formatPercent(Math.abs(data.revenueChangeVsYesterday))} from yesterday.` : ''}
// //                 ${data.revenueChangeVsYesterday === 0 && data.ordersChangeVsYesterday > 0 ? `Order volume is up ${formatPercent(data.ordersChangeVsYesterday)} from yesterday.` : ''}
// //                 ${data.bestDay && data.bestDay.revenue > data.todayRevenue ? `Your best day was ${new Date(data.bestDay.date).toLocaleDateString()} with ${formatCurrency(data.bestDay.revenue)} in revenue.` : ''}
// //             </div>
// //             ` : ''}
// //         </div>

// //         <!-- Footer -->
// //         <div class="footer">
// //             <p class="footer-text">
// //                 This automated report was generated on ${new Date().toLocaleString()}<br>
// //                 Data analyzed from ${formatNumber(data.ordersLoaded)} orders
// //             </p>
// //         </div>
// //     </div>
// // </body>
// // </html>
// //     `;
// //   }

// //   private generateTextVersion(data: OrderData, shop: string): string {
// //     const formatCurrency = (amount: number) => `$${amount.toFixed(2)}`;
// //     const formatPercent = (num: number) => `${num >= 0 ? '+' : ''}${num.toFixed(1)}%`;

// //     return `
// // ANALYTICS REPORT - ${shop}
// // ${new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}

// // TODAY'S PERFORMANCE:
// // - Orders: ${data.todayOrders} (${formatPercent(data.ordersChangeVsYesterday)} vs yesterday)
// // - Revenue: ${formatCurrency(data.todayRevenue)} (${formatPercent(data.revenueChangeVsYesterday)} vs yesterday)
// // - Items Sold: ${data.todayItems} (${formatPercent(data.itemsChangeVsYesterday)} vs yesterday)

// // CUSTOMER INSIGHTS:
// // - Total Customers: ${data.totalCustomers}
// // - New Customers: ${data.newCustomers}
// // - Repeat Customers: ${data.repeatCustomers}
// // - Repeat Rate: ${data.repeatCustomerRate.toFixed(1)}%

// // FULFILLMENT:
// // - Fulfilled Today: ${data.todayFulfilled}
// // - Unfulfilled Today: ${data.todayUnfulfilled}
// // - Fulfillment Rate: ${data.fulfillmentRate.toFixed(1)}%

// // LAST 7 DAYS:
// // ${data.dailySales.map(day => {
// //   const date = new Date(day.date);
// //   return `- ${date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}: ${formatCurrency(day.revenue)} (${day.orders} orders)`;
// // }).join('\n')}

// // BUSINESS OVERVIEW:
// // - All-Time Orders: ${data.totalOrders}
// // - All-Time Revenue: ${formatCurrency(data.totalRevenue)}
// // - Average Order Value: ${formatCurrency(data.averageOrderValue)}

// // Data analyzed from ${data.ordersLoaded} orders.
// // Generated on ${new Date().toLocaleString()}
// //     `;
// //   }
// // }

// import sgMail from "@sendgrid/mail";
// import { StoreEmailSettings } from "../models/StoreEmailSettings.server";
// import { OrderData } from "./analyticsCollector.server";

// // Initialize SendGrid
// if (process.env.SENDGRID_API_KEY) {
//   sgMail.setApiKey(process.env.SENDGRID_API_KEY);
// }

// export class AnalyticsEmailService {
//   private shop: string;

//   constructor(shop: string) {
//     this.shop = shop;
//   }

//   async sendDailyAnalytics(analyticsData: OrderData, emailOptions: {
//     bccEmails?: string[];
//   } = {}) {
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
//           message: 'Email notifications are disabled'
//         };
//       }

//       // Get all email addresses (primary + additional) - KEEP YOUR ORIGINAL LOGIC
//       const allEmails = [
//         settings.fromEmail,
//         ...(settings.additionalEmails || [])
//       ].filter(email => email && email.trim() && this.isValidEmail(email));

//       if (allEmails.length === 0) {
//         throw new Error('No valid recipient email addresses configured');
//       }

//       // Build email with analytics data
//       const emailContent = this.buildAnalyticsEmail(analyticsData, this.shop);
      
//       // Use BCC from options if provided, otherwise use your original logic
//       const msg: any = {
//         to: process.env.SENDGRID_FROM_EMAIL, // Send to yourself in "To" field
//         from: process.env.SENDGRID_FROM_EMAIL,
//         subject: `Daily Analytics Report - ${this.shop} - ${new Date().toLocaleDateString()}`,
//         html: emailContent,
//         text: this.generateTextVersion(analyticsData, this.shop),
//       };

//       // Add all recipients to BCC (this hides emails from each other)
//       let bccRecipients: string[] = [];
      
//       if (emailOptions.bccEmails && emailOptions.bccEmails.length > 0) {
//         // Use BCC emails from frontend
//         bccRecipients = emailOptions.bccEmails.filter(email => email && email.trim());
//       } else {
//         // Use your original email list in BCC
//         bccRecipients = allEmails;
//       }

//       if (bccRecipients.length > 0) {
//         msg.bcc = bccRecipients;
//       }

//       const result = await sgMail.send(msg);
      
//       return {
//         success: true,
//         message: `Email sent successfully to ${bccRecipients.length} recipient(s) via BCC`,
//         recipients: bccRecipients,
//         recipientsCount: bccRecipients.length, // Add this property
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


//   // KEEP ALL YOUR ORIGINAL METHODS BELOW - THEY WORK FINE
//   private buildAnalyticsEmail(data: OrderData, shop: string): string {
//     // ... your existing beautiful HTML template ...
//     const formatCurrency = (amount: number) => `$${amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
//     const formatNumber = (num: number) => num.toLocaleString();
//     const formatPercent = (num: number) => `${num >= 0 ? '+' : ''}${num.toFixed(1)}%`;

//     const getTrendIcon = (value: number) => value >= 0 ? '↑' : '↓';

//     return `
// <!DOCTYPE html>
// <html>
// <head>
//     <meta charset="utf-8">
//     <meta name="viewport" content="width=device-width, initial-scale=1">
//     <title>Analytics Report - ${shop}</title>
//     <style>
//         body {
//             font-family: Arial, sans-serif;
//             line-height: 1.6;
//             color: #333333;
//             margin: 0;
//             padding: 0;
//             background-color: #f8f9fa;
//         }
//         .container {
//             max-width: 600px;
//             margin: 0 auto;
//             background: #ffffff;
//             border-radius: 8px;
//             overflow: hidden;
//             box-shadow: 0 2px 10px rgba(0,0,0,0.1);
//         }
//         .header {
//             background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
//             color: white;
//             padding: 30px 20px;
//             text-align: center;
//         }
//         .header h1 {
//             margin: 0;
//             font-size: 28px;
//             font-weight: bold;
//         }
//         .header .subtitle {
//             margin: 8px 0 0 0;
//             font-size: 16px;
//             opacity: 0.9;
//         }
//         .content {
//             padding: 30px;
//         }
//         .section {
//             margin-bottom: 30px;
//             border: 1px solid #e9ecef;
//             border-radius: 8px;
//             overflow: hidden;
//         }
//         .section-header {
//             background: #f8f9fa;
//             padding: 15px 20px;
//             border-bottom: 1px solid #e9ecef;
//         }
//         .section-header h2 {
//             margin: 0;
//             font-size: 18px;
//             color: #495057;
//             font-weight: 600;
//         }
//         .section-body {
//             padding: 20px;
//         }
//         .metrics-grid {
//             display: block;
//         }
//         .metric-row {
//             display: flex;
//             justify-content: space-between;
//             margin-bottom: 15px;
//             padding-bottom: 15px;
//             border-bottom: 1px solid #f1f3f4;
//         }
//         .metric-row:last-child {
//             margin-bottom: 0;
//             padding-bottom: 0;
//             border-bottom: none;
//         }
//         .metric-item {
//             flex: 1;
//             text-align: center;
//         }
//         .metric-value {
//             font-size: 24px;
//             font-weight: bold;
//             color: #2c3e50;
//             margin: 0 0 5px 0;
//         }
//         .metric-label {
//             font-size: 12px;
//             color: #6c757d;
//             margin: 0;
//             text-transform: uppercase;
//             letter-spacing: 0.5px;
//         }
//         .metric-change {
//             font-size: 11px;
//             padding: 2px 8px;
//             border-radius: 10px;
//             display: inline-block;
//             margin-top: 4px;
//         }
//         .change-positive {
//             background: #d4edda;
//             color: #155724;
//         }
//         .change-negative {
//             background: #f8d7da;
//             color: #721c24;
//         }
//         .daily-grid {
//             display: block;
//         }
//         .daily-row {
//             display: flex;
//             justify-content: space-between;
//             align-items: center;
//             padding: 10px 0;
//             border-bottom: 1px solid #f1f3f4;
//         }
//         .daily-row:last-child {
//             border-bottom: none;
//         }
//         .daily-date {
//             font-weight: 600;
//             color: #495057;
//             min-width: 80px;
//         }
//         .daily-metrics {
//             display: flex;
//             gap: 20px;
//         }
//         .daily-metric {
//             text-align: right;
//             min-width: 80px;
//         }
//         .daily-value {
//             font-weight: 600;
//             color: #2c3e50;
//         }
//         .daily-label {
//             font-size: 10px;
//             color: #6c757d;
//             text-transform: uppercase;
//         }
//         .today-highlight {
//             background: #e7f3ff;
//             border-left: 4px solid #007bff;
//             margin: 0 -20px;
//             padding: 10px 20px;
//         }
//         .summary-grid {
//             display: flex;
//             justify-content: space-between;
//             flex-wrap: wrap;
//             gap: 15px;
//         }
//         .summary-card {
//             flex: 1;
//             min-width: 120px;
//             text-align: center;
//             padding: 15px;
//             background: #f8f9fa;
//             border-radius: 6px;
//             border: 1px solid #e9ecef;
//         }
//         .summary-value {
//             font-size: 20px;
//             font-weight: bold;
//             color: #2c3e50;
//             margin: 0 0 5px 0;
//         }
//         .summary-label {
//             font-size: 11px;
//             color: #6c757d;
//             margin: 0;
//             text-transform: uppercase;
//             letter-spacing: 0.5px;
//         }
//         .footer {
//             background: #f8f9fa;
//             padding: 20px;
//             text-align: center;
//             border-top: 1px solid #e9ecef;
//         }
//         .footer-text {
//             font-size: 12px;
//             color: #6c757d;
//             margin: 0;
//         }
//         .highlight {
//             background: #fff3cd;
//             padding: 15px;
//             border-radius: 6px;
//             border-left: 4px solid #ffc107;
//             margin: 15px 0;
//         }
//         .highlight strong {
//             color: #856404;
//         }
//     </style>
// </head>
// <body>
//     <div class="container">
//         <!-- Header -->
//         <div class="header">
//             <h1>Analytics Report</h1>
//             <div class="subtitle">${shop} • ${new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</div>
//         </div>

//         <!-- Content -->
//         <div class="content">
//             <!-- Today's Performance -->
//             <div class="section">
//                 <div class="section-header">
//                     <h2>Today's Performance</h2>
//                 </div>
//                 <div class="section-body">
//                     <div class="metrics-grid">
//                         <div class="metric-row">
//                             <div class="metric-item">
//                                 <div class="metric-value">${formatNumber(data.todayOrders)}</div>
//                                 <div class="metric-label">Orders</div>
//                                 ${data.ordersChangeVsYesterday !== 0 ? `
//                                 <div class="metric-change ${data.ordersChangeVsYesterday >= 0 ? 'change-positive' : 'change-negative'}">
//                                     ${getTrendIcon(data.ordersChangeVsYesterday)} ${formatPercent(data.ordersChangeVsYesterday)}
//                                 </div>
//                                 ` : ''}
//                             </div>
//                             <div class="metric-item">
//                                 <div class="metric-value">${formatCurrency(data.todayRevenue)}</div>
//                                 <div class="metric-label">Revenue</div>
//                                 ${data.revenueChangeVsYesterday !== 0 ? `
//                                 <div class="metric-change ${data.revenueChangeVsYesterday >= 0 ? 'change-positive' : 'change-negative'}">
//                                     ${getTrendIcon(data.revenueChangeVsYesterday)} ${formatPercent(data.revenueChangeVsYesterday)}
//                                 </div>
//                                 ` : ''}
//                             </div>
//                             <div class="metric-item">
//                                 <div class="metric-value">${formatNumber(data.todayItems)}</div>
//                                 <div class="metric-label">Items Sold</div>
//                                 ${data.itemsChangeVsYesterday !== 0 ? `
//                                 <div class="metric-change ${data.itemsChangeVsYesterday >= 0 ? 'change-positive' : 'change-negative'}">
//                                     ${getTrendIcon(data.itemsChangeVsYesterday)} ${formatPercent(data.itemsChangeVsYesterday)}
//                                 </div>
//                                 ` : ''}
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//             </div>

//             <!-- Customer Insights -->
//             <div class="section">
//                 <div class="section-header">
//                     <h2>Customer Insights</h2>
//                 </div>
//                 <div class="section-body">
//                     <div class="metrics-grid">
//                         <div class="metric-row">
//                             <div class="metric-item">
//                                 <div class="metric-value">${formatNumber(data.totalCustomers)}</div>
//                                 <div class="metric-label">Total Customers</div>
//                             </div>
//                             <div class="metric-item">
//                                 <div class="metric-value">${formatNumber(data.newCustomers)}</div>
//                                 <div class="metric-label">New Customers</div>
//                             </div>
//                             <div class="metric-item">
//                                 <div class="metric-value">${formatNumber(data.repeatCustomers)}</div>
//                                 <div class="metric-label">Repeat Customers</div>
//                             </div>
//                             <div class="metric-item">
//                                 <div class="metric-value">${data.repeatCustomerRate.toFixed(1)}%</div>
//                                 <div class="metric-label">Repeat Rate</div>
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//             </div>

//             <!-- Fulfillment Status -->
//             <div class="section">
//                 <div class="section-header">
//                     <h2>Order Fulfillment</h2>
//                 </div>
//                 <div class="section-body">
//                     <div class="metrics-grid">
//                         <div class="metric-row">
//                             <div class="metric-item">
//                                 <div class="metric-value">${formatNumber(data.todayFulfilled)}</div>
//                                 <div class="metric-label">Fulfilled Today</div>
//                             </div>
//                             <div class="metric-item">
//                                 <div class="metric-value">${formatNumber(data.todayUnfulfilled)}</div>
//                                 <div class="metric-label">Unfulfilled Today</div>
//                             </div>
//                             <div class="metric-item">
//                                 <div class="metric-value">${data.fulfillmentRate.toFixed(1)}%</div>
//                                 <div class="metric-label">Fulfillment Rate</div>
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//             </div>

//             <!-- Last 7 Days Performance -->
//             <div class="section">
//                 <div class="section-header">
//                     <h2>Last 7 Days Performance</h2>
//                 </div>
//                 <div class="section-body">
//                     <div class="daily-grid">
//                         ${data.dailySales.map(day => {
//                             const date = new Date(day.date);
//                             const isToday = day.date === new Date().toISOString().split('T')[0];
//                             const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
//                             const dateStr = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
                            
//                             return `
//                             <div class="daily-row ${isToday ? 'today-highlight' : ''}">
//                                 <div class="daily-date">
//                                     ${dayName}, ${dateStr}
//                                     ${isToday ? ' <strong>(Today)</strong>' : ''}
//                                 </div>
//                                 <div class="daily-metrics">
//                                     <div class="daily-metric">
//                                         <div class="daily-value">${formatCurrency(day.revenue)}</div>
//                                         <div class="daily-label">Revenue</div>
//                                     </div>
//                                     <div class="daily-metric">
//                                         <div class="daily-value">${formatNumber(day.orders)}</div>
//                                         <div class="daily-label">Orders</div>
//                                     </div>
//                                     <div class="daily-metric">
//                                         <div class="daily-value">${formatNumber(day.items)}</div>
//                                         <div class="daily-label">Items</div>
//                                     </div>
//                                 </div>
//                             </div>
//                             `;
//                         }).join('')}
//                     </div>

//                     <!-- 7-Day Summary -->
//                     <div class="summary-grid" style="margin-top: 20px;">
//                         <div class="summary-card">
//                             <div class="summary-value">${formatNumber(data.dailySales.reduce((sum, day) => sum + day.orders, 0))}</div>
//                             <div class="summary-label">Total Orders</div>
//                         </div>
//                         <div class="summary-card">
//                             <div class="summary-value">${formatCurrency(data.dailySales.reduce((sum, day) => sum + day.revenue, 0))}</div>
//                             <div class="summary-label">Total Revenue</div>
//                         </div>
//                         <div class="summary-card">
//                             <div class="summary-value">${formatCurrency(data.averageDailyRevenue)}</div>
//                             <div class="summary-label">Avg Daily Revenue</div>
//                         </div>
//                     </div>
//                 </div>
//             </div>

//             <!-- Overall Business Summary -->
//             <div class="section">
//                 <div class="section-header">
//                     <h2>Business Overview</h2>
//                 </div>
//                 <div class="section-body">
//                     <div class="summary-grid">
//                         <div class="summary-card">
//                             <div class="summary-value">${formatNumber(data.totalOrders)}</div>
//                             <div class="summary-label">All-Time Orders</div>
//                         </div>
//                         <div class="summary-card">
//                             <div class="summary-value">${formatCurrency(data.totalRevenue)}</div>
//                             <div class="summary-label">All-Time Revenue</div>
//                         </div>
//                         <div class="summary-card">
//                             <div class="summary-value">${formatCurrency(data.averageOrderValue)}</div>
//                             <div class="summary-label">Avg Order Value</div>
//                         </div>
//                         <div class="summary-card">
//                             <div class="summary-value">${formatNumber(data.ordersLoaded)}</div>
//                             <div class="summary-label">Orders Analyzed</div>
//                         </div>
//                     </div>
//                 </div>
//             </div>

//             <!-- Performance Insight -->
//             ${data.revenueChangeVsYesterday !== 0 || data.ordersChangeVsYesterday !== 0 ? `
//             <div class="highlight">
//                 <strong>Performance Insight:</strong><br>
//                 ${data.revenueChangeVsYesterday > 0 ? `Revenue is up ${formatPercent(data.revenueChangeVsYesterday)} from yesterday.` : ''}
//                 ${data.revenueChangeVsYesterday < 0 ? `Revenue is down ${formatPercent(Math.abs(data.revenueChangeVsYesterday))} from yesterday.` : ''}
//                 ${data.revenueChangeVsYesterday === 0 && data.ordersChangeVsYesterday > 0 ? `Order volume is up ${formatPercent(data.ordersChangeVsYesterday)} from yesterday.` : ''}
//                 ${data.bestDay && data.bestDay.revenue > data.todayRevenue ? `Your best day was ${new Date(data.bestDay.date).toLocaleDateString()} with ${formatCurrency(data.bestDay.revenue)} in revenue.` : ''}
//             </div>
//             ` : ''}
//         </div>

//         <!-- Footer -->
//         <div class="footer">
//             <p class="footer-text">
//                 This automated report was generated on ${new Date().toLocaleString()}<br>
//                 Data analyzed from ${formatNumber(data.ordersLoaded)} orders
//             </p>
//         </div>
//     </div>
// </body>
// </html>
//     `;
//   }

//   private generateTextVersion(data: OrderData, shop: string): string {
//     const formatCurrency = (amount: number) => `$${amount.toFixed(2)}`;
//     const formatPercent = (num: number) => `${num >= 0 ? '+' : ''}${num.toFixed(1)}%`;

//     return `
// ANALYTICS REPORT - ${shop}
// ${new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}

// TODAY'S PERFORMANCE:
// - Orders: ${data.todayOrders} (${formatPercent(data.ordersChangeVsYesterday)} vs yesterday)
// - Revenue: ${formatCurrency(data.todayRevenue)} (${formatPercent(data.revenueChangeVsYesterday)} vs yesterday)
// - Items Sold: ${data.todayItems} (${formatPercent(data.itemsChangeVsYesterday)} vs yesterday)

// CUSTOMER INSIGHTS:
// - Total Customers: ${data.totalCustomers}
// - New Customers: ${data.newCustomers}
// - Repeat Customers: ${data.repeatCustomers}
// - Repeat Rate: ${data.repeatCustomerRate.toFixed(1)}%

// FULFILLMENT:
// - Fulfilled Today: ${data.todayFulfilled}
// - Unfulfilled Today: ${data.todayUnfulfilled}
// - Fulfillment Rate: ${data.fulfillmentRate.toFixed(1)}%

// LAST 7 DAYS:
// ${data.dailySales.map(day => {
//   const date = new Date(day.date);
//   return `- ${date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}: ${formatCurrency(day.revenue)} (${day.orders} orders)`;
// }).join('\n')}

// BUSINESS OVERVIEW:
// - All-Time Orders: ${data.totalOrders}
// - All-Time Revenue: ${formatCurrency(data.totalRevenue)}
// - Average Order Value: ${formatCurrency(data.averageOrderValue)}

// Data analyzed from ${data.ordersLoaded} orders.
// Generated on ${new Date().toLocaleString()}
//     `;
//   }
// }

import sgMail from "@sendgrid/mail";
import { StoreEmailSettings } from "../models/StoreEmailSettings.server";
import { OrderData } from "./analyticsCollector.server";

// Initialize SendGrid
if (process.env.SENDGRID_API_KEY) {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
}

export class AnalyticsEmailService {
  private shop: string;

  constructor(shop: string) {
    this.shop = shop;
  }

  async sendDailyAnalytics(analyticsData: OrderData, emailOptions: {
    bccEmails?: string[];
  } = {}) {
    try {

        console.log('🔍 [EMAIL DEBUG] === ANALYTICS DATA RECEIVED IN EMAIL SERVICE ===');
    console.log('🔍 [EMAIL DEBUG] Data source:', analyticsData.ordersLoaded, 'orders');
    console.log('🔍 [EMAIL DEBUG] Today revenue:', analyticsData.todayRevenue);
    console.log('🔍 [EMAIL DEBUG] Today orders:', analyticsData.todayOrders);
    console.log('🔍 [EMAIL DEBUG] Total revenue:', analyticsData.totalRevenue);
    console.log('🔍 [EMAIL DEBUG] Total orders:', analyticsData.totalOrders);
    
    // Check if data looks real or dummy
    if (analyticsData.todayRevenue === 0 && analyticsData.totalRevenue === 0) {
      console.log('❌ [EMAIL DEBUG] DATA APPEARS TO BE DUMMY/EMPTY!');
    } else {
      console.log('✅ [EMAIL DEBUG] DATA APPEARS TO BE REAL!');
    }
        
      // Validate SendGrid configuration
      if (!process.env.SENDGRID_API_KEY) {
        throw new Error('Email service not configured');
      }

      if (!process.env.SENDGRID_FROM_EMAIL) {
        throw new Error('Sender email not configured');
      }

      // Fetch store email settings
      const settings = await StoreEmailSettings.get(this.shop);
      
      if (!settings) {
        throw new Error('Email settings not configured for this store');
      }

      if (!settings.enabled) {
        return {
          success: true,
          skipped: true,
          message: 'Email notifications are disabled'
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

      // Build email with analytics data
      const emailContent = this.buildAnalyticsEmail(analyticsData, this.shop);
      
      // Use BCC from options if provided, otherwise use your original logic
      const msg: any = {
        to: process.env.SENDGRID_FROM_EMAIL, // Send to yourself in "To" field
        from: process.env.SENDGRID_FROM_EMAIL,
        subject: `Daily Analytics Report - ${this.shop} - ${new Date().toLocaleDateString()}`,
        html: emailContent,
        text: this.generateTextVersion(analyticsData, this.shop),
      };

      // Add all recipients to BCC (this hides emails from each other)
      let bccRecipients: string[] = [];
      
      if (emailOptions.bccEmails && emailOptions.bccEmails.length > 0) {
        // Use BCC emails from frontend
        bccRecipients = emailOptions.bccEmails.filter(email => email && email.trim());
      } else {
        // Use your original email list in BCC
        bccRecipients = allEmails;
      }

      if (bccRecipients.length > 0) {
        msg.bcc = bccRecipients;
      }

      const result = await sgMail.send(msg);
      
      return {
        success: true,
        message: `Email sent successfully to ${bccRecipients.length} recipient(s) via BCC`,
        recipients: bccRecipients,
        recipientsCount: bccRecipients.length,
        result
      };

    } catch (error: any) {
      console.error('🔍 DEBUG: SendGrid Error Details:', error);
      console.error('🔍 DEBUG: SendGrid Response:', error?.response?.body);
      console.error('🔍 DEBUG: SendGrid Code:', error?.code);
      
      throw new Error(`Failed to send analytics email: ${error.message}`);
    }
  }

  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  private buildAnalyticsEmail(data: OrderData, shop: string): string {
    const formatCurrency = (amount: number) => {
      return amount.toLocaleString('en-US', { 
        style: 'currency', 
        currency: 'USD',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2 
      });
    };
    
    const formatNumber = (num: number) => num.toLocaleString();
    const formatPercent = (num: number) => `${num >= 0 ? '+' : ''}${num.toFixed(1)}%`;

    const getTrendIcon = (value: number) => value >= 0 ? '↑' : '↓';

    // Calculate real metrics from your data
    const last7DaysRevenue = data.dailySales.reduce((sum, day) => sum + day.revenue, 0);
    const last7DaysOrders = data.dailySales.reduce((sum, day) => sum + day.orders, 0);
    const last7DaysItems = data.dailySales.reduce((sum, day) => sum + day.items, 0);
    
    // Calculate fulfillment rate
    const totalFulfillment = data.last7DaysFulfilled + data.last7DaysUnfulfilled;
    const fulfillmentRate = totalFulfillment > 0 ? (data.last7DaysFulfilled / totalFulfillment) * 100 : 0;

    // Helper to get day name
    const getDayName = (dateStr: string) => {
      const date = new Date(dateStr + 'T00:00:00');
      return date.toLocaleDateString('en-US', { weekday: 'short' });
    };

    // Helper to format date
    const formatDateDisplay = (dateStr: string) => {
      const date = new Date(dateStr + 'T00:00:00');
      return date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric'
      });
    };

    return `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Analytics Dashboard - ${shop}</title>
    <style>
        /* Reset and Base Styles */
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            line-height: 1.6;
            color: #333333;
            margin: 0;
            padding: 0;
            background-color: #f8fafc;
            -webkit-font-smoothing: antialiased;
        }
        
        .container {
            max-width: 680px;
            margin: 0 auto;
            background: #ffffff;
            border-radius: 12px;
            overflow: hidden;
            box-shadow: 0 4px 20px rgba(0,0,0,0.08);
            border: 1px solid #e2e8f0;
        }
        
        /* Header */
        .header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 40px 30px;
            text-align: center;
        }
        
        .header h1 {
            margin: 0;
            font-size: 32px;
            font-weight: 700;
        }
        
        .header .subtitle {
            margin: 12px 0 0 0;
            font-size: 16px;
            opacity: 0.95;
            font-weight: 400;
        }
        
        /* Content Sections */
        .content {
            padding: 0;
        }
        
        .section {
            margin-bottom: 0;
            border-bottom: 1px solid #e2e8f0;
        }
        
        .section:last-child {
            border-bottom: none;
        }
        
        .section-header {
            background: #f8fafc;
            padding: 20px 30px;
            border-bottom: 1px solid #e2e8f0;
        }
        
        .section-header h2 {
            margin: 0;
            font-size: 20px;
            color: #1e293b;
            font-weight: 600;
        }
        
        .section-body {
            padding: 30px;
        }
        
        /* Today's Performance Grid */
        .primary-metrics-grid {
            display: table;
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 0;
        }
        
        .metric-card {
            display: table-cell;
            text-align: center;
            padding: 25px 15px;
            border-right: 1px solid #f1f5f9;
            vertical-align: top;
        }
        
        .metric-card:last-child {
            border-right: none;
        }
        
        .metric-value {
            font-size: 32px;
            font-weight: 700;
            color: #1e293b;
            margin: 0 0 8px 0;
            line-height: 1.2;
        }
        
        .metric-label {
            font-size: 14px;
            color: #64748b;
            margin: 0 0 12px 0;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            font-weight: 600;
        }
        
        .metric-change {
            font-size: 12px;
            padding: 6px 12px;
            border-radius: 20px;
            display: inline-block;
            font-weight: 600;
        }
        
        .change-positive {
            background: #dcfce7;
            color: #059669;
            border: 1px solid #bbf7d0;
        }
        
        .change-negative {
            background: #fee2e2;
            color: #dc2626;
            border: 1px solid #fecaca;
        }
        
        /* Fulfillment Metrics */
        .fulfillment-metrics-grid {
            display: table;
            width: 100%;
            border-collapse: collapse;
            margin: 20px 0 0 0;
        }
        
        .fulfillment-metric-card {
            display: table-cell;
            text-align: center;
            padding: 20px 10px;
            border-right: 1px solid #f1f5f9;
        }
        
        .fulfillment-metric-card:last-child {
            border-right: none;
        }
        
        .fulfillment-metric-value {
            font-size: 24px;
            font-weight: 700;
            color: #1e293b;
            margin: 0 0 6px 0;
        }
        
        .fulfillment-metric-label {
            font-size: 11px;
            color: #64748b;
            margin: 0;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            font-weight: 600;
        }
        
        .fulfillment-metric-period {
            font-size: 10px;
            color: #94a3b8;
            margin: 4px 0 0 0;
            text-transform: uppercase;
            letter-spacing: 0.3px;
        }
        
        /* Daily Breakdown */
        .daily-breakdown {
            margin-top: 25px;
        }
        
        .daily-breakdown h4 {
            margin: 0 0 20px 0;
            font-size: 16px;
            color: #1e293b;
            font-weight: 600;
        }
        
        .daily-cards-container {
            display: table;
            width: 100%;
            border-collapse: collapse;
        }
        
        .daily-card {
            display: table-cell;
            text-align: center;
            padding: 20px 8px;
            border-right: 1px solid #f1f5f9;
            vertical-align: top;
        }
        
        .daily-card:last-child {
            border-right: none;
        }
        
        .daily-card.current-day {
            background: linear-gradient(135deg, #eff6ff 0%, #f0f9ff 100%);
            border: 1px solid #bfdbfe;
            border-radius: 8px;
            margin: -1px;
        }
        
        .daily-card-header {
            margin-bottom: 15px;
        }
        
        .daily-date {
            font-size: 14px;
            font-weight: 600;
            color: #1e293b;
            margin: 0 0 4px 0;
        }
        
        .daily-day {
            font-size: 12px;
            color: #64748b;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }
        
        .daily-metrics {
            display: table;
            width: 100%;
            border-collapse: collapse;
        }
        
        .daily-metric {
            display: table-cell;
            text-align: center;
            padding: 0 4px;
        }
        
        .daily-metric-label {
            font-size: 10px;
            color: #64748b;
            text-transform: uppercase;
            letter-spacing: 0.3px;
            margin: 0 0 4px 0;
            display: block;
        }
        
        .daily-metric-value {
            font-size: 14px;
            font-weight: 600;
            color: #1e293b;
            margin: 0;
            display: block;
        }
        
        /* Customer Insights */
        .customer-metrics-grid {
            display: table;
            width: 100%;
            border-collapse: collapse;
        }
        
        .customer-metric-card {
            display: table-cell;
            text-align: center;
            padding: 25px 15px;
            border-right: 1px solid #f1f5f9;
        }
        
        .customer-metric-card:last-child {
            border-right: none;
        }
        
        .customer-metric-value {
            font-size: 28px;
            font-weight: 700;
            color: #1e293b;
            margin: 0 0 8px 0;
        }
        
        .customer-metric-label {
            font-size: 12px;
            color: #64748b;
            margin: 0;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            font-weight: 600;
            line-height: 1.4;
        }
        
        /* Financial Metrics */
        .financial-metrics-grid {
            display: table;
            width: 100%;
            border-collapse: collapse;
        }
        
        .financial-metric-card {
            display: table-cell;
            text-align: center;
            padding: 20px 10px;
            border-right: 1px solid #f1f5f9;
            vertical-align: top;
        }
        
        .financial-metric-card:last-child {
            border-right: none;
        }
        
        .financial-metric-value {
            font-size: 18px;
            font-weight: 700;
            color: #1e293b;
            margin: 0 0 6px 0;
            line-height: 1.3;
        }
        
        .financial-metric-label {
            font-size: 11px;
            color: #64748b;
            margin: 0 0 4px 0;
            text-transform: uppercase;
            letter-spacing: 0.3px;
            font-weight: 600;
        }
        
        .financial-metric-rate {
            font-size: 10px;
            color: #94a3b8;
            margin: 0;
        }
        
        .financial-metric-period {
            font-size: 10px;
            color: #94a3b8;
            margin: 0;
            font-style: italic;
        }
        
        /* Summary Cards */
        .summary-grid {
            display: table;
            width: 100%;
            border-collapse: collapse;
            margin: 20px 0 0 0;
        }
        
        .summary-card {
            display: table-cell;
            text-align: center;
            padding: 20px 10px;
            border-right: 1px solid #f1f5f9;
        }
        
        .summary-card:last-child {
            border-right: none;
        }
        
        .summary-value {
            font-size: 20px;
            font-weight: 700;
            color: #1e293b;
            margin: 0 0 6px 0;
        }
        
        .summary-label {
            font-size: 11px;
            color: #64748b;
            margin: 0;
            text-transform: uppercase;
            letter-spacing: 0.3px;
            font-weight: 600;
        }
        
        /* Footer */
        .footer {
            background: #f8fafc;
            padding: 25px 30px;
            text-align: center;
            border-top: 1px solid #e2e8f0;
        }
        
        .footer-text {
            font-size: 12px;
            color: #64748b;
            margin: 0;
            line-height: 1.6;
        }
        
        /* Responsive */
        @media only screen and (max-width: 600px) {
            .container {
                border-radius: 0;
            }
            
            .header {
                padding: 30px 20px;
            }
            
            .header h1 {
                font-size: 24px;
            }
            
            .section-body {
                padding: 20px;
            }
            
            .metric-card,
            .fulfillment-metric-card,
            .customer-metric-card,
            .financial-metric-card,
            .summary-card {
                display: block;
                border-right: none;
                border-bottom: 1px solid #f1f5f9;
                padding: 20px 15px;
            }
            
            .daily-card {
                display: block;
                border-right: none;
                border-bottom: 1px solid #f1f5f9;
                padding: 15px 10px;
            }
            
            .daily-card:last-child {
                border-bottom: none;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <!-- Header -->
        <div class="header">
            <h1>Analytics Dashboard</h1>
            <div class="subtitle">${shop} • ${new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</div>
        </div>

        <!-- Content -->
        <div class="content">
            <!-- Today's Performance -->
            <div class="section">
                <div class="section-header">
                    <h2>Today's Performance</h2>
                </div>
                <div class="section-body">
                    <div class="primary-metrics-grid">
                        <div class="metric-card orders">
                            <div class="metric-value">${formatNumber(data.todayOrders)}</div>
                            <div class="metric-label">Today's Orders</div>
                            ${data.ordersChangeVsYesterday !== 0 ? `
                            <div class="metric-change ${data.ordersChangeVsYesterday >= 0 ? 'change-positive' : 'change-negative'}">
                                ${getTrendIcon(data.ordersChangeVsYesterday)} ${formatPercent(data.ordersChangeVsYesterday)}
                            </div>
                            ` : '<div style="height: 24px;"></div>'}
                        </div>
                        
                        <div class="metric-card revenue">
                            <div class="metric-value">${formatCurrency(data.todayRevenue)}</div>
                            <div class="metric-label">Today's Total Sales</div>
                            ${data.revenueChangeVsYesterday !== 0 ? `
                            <div class="metric-change ${data.revenueChangeVsYesterday >= 0 ? 'change-positive' : 'change-negative'}">
                                ${getTrendIcon(data.revenueChangeVsYesterday)} ${formatPercent(data.revenueChangeVsYesterday)}
                            </div>
                            ` : '<div style="height: 24px;"></div>'}
                        </div>
                        
                        <div class="metric-card items">
                            <div class="metric-value">${formatNumber(data.todayItems)}</div>
                            <div class="metric-label">Items Ordered</div>
                            ${data.itemsChangeVsYesterday !== 0 ? `
                            <div class="metric-change ${data.itemsChangeVsYesterday >= 0 ? 'change-positive' : 'change-negative'}">
                                ${getTrendIcon(data.itemsChangeVsYesterday)} ${formatPercent(data.itemsChangeVsYesterday)}
                            </div>
                            ` : '<div style="height: 24px;"></div>'}
                        </div>
                    </div>

                    <!-- Fulfillment Metrics -->
                    <div class="fulfillment-metrics-grid">
                        <div class="fulfillment-metric-card today-fulfilled">
                            <div class="fulfillment-metric-value">${formatNumber(data.todayFulfilled)}</div>
                            <div class="fulfillment-metric-label">FULFILLED TODAY</div>
                            <div class="fulfillment-metric-period">Today</div>
                        </div>
                        
                        <div class="fulfillment-metric-card today-unfulfilled">
                            <div class="fulfillment-metric-value">${formatNumber(data.todayUnfulfilled)}</div>
                            <div class="fulfillment-metric-label">UNFULFILLED TODAY</div>
                            <div class="fulfillment-metric-period">Today</div>
                        </div>
                        
                        <div class="fulfillment-metric-card week-fulfilled">
                            <div class="fulfillment-metric-value">${formatNumber(data.last7DaysFulfilled)}</div>
                            <div class="fulfillment-metric-label">FULFILLED</div>
                            <div class="fulfillment-metric-period">Last 7 Days</div>
                        </div>
                        
                        <div class="fulfillment-metric-card week-unfulfilled">
                            <div class="fulfillment-metric-value">${formatNumber(data.last7DaysUnfulfilled)}</div>
                            <div class="fulfillment-metric-label">UNFULFILLED</div>
                            <div class="fulfillment-metric-period">Last 7 Days</div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Last 7 Days Performance -->
            <div class="section">
                <div class="section-header">
                    <h2>Last 7 Days Performance</h2>
                </div>
                <div class="section-body">
                    <div class="summary-grid">
                        <div class="summary-card">
                            <div class="summary-value">${formatNumber(last7DaysOrders)}</div>
                            <div class="summary-label">Total Orders</div>
                        </div>
                        
                        <div class="summary-card">
                            <div class="summary-value">${formatCurrency(last7DaysRevenue)}</div>
                            <div class="summary-label">Total Sales</div>
                        </div>
                        
                        <div class="summary-card">
                            <div class="summary-value">${formatNumber(last7DaysItems)}</div>
                            <div class="summary-label">Total Items</div>
                        </div>
                        
                        <div class="summary-card">
                            <div class="summary-value">${formatCurrency(data.averageDailyRevenue)}</div>
                            <div class="summary-label">Avg Daily Sales</div>
                        </div>
                    </div>

                    <!-- Daily Breakdown -->
                    <div class="daily-breakdown">
                        <h4>Daily Breakdown</h4>
                        <div class="daily-cards-container">
                            ${data.dailySales.map((day, index) => {
                                const isToday = index === data.dailySales.length - 1;
                                
                                return `
                                <div class="daily-card ${isToday ? 'current-day' : ''}">
                                    <div class="daily-card-header">
                                        <div class="daily-date">${formatDateDisplay(day.date)}</div>
                                        <div class="daily-day">${getDayName(day.date)}</div>
                                    </div>
                                    
                                    <div class="daily-metrics">
                                        <div class="daily-metric">
                                            <span class="daily-metric-label">ORDERS</span>
                                            <span class="daily-metric-value">${formatNumber(day.orders)}</span>
                                        </div>
                                        
                                        <div class="daily-metric">
                                            <span class="daily-metric-label">TOTAL SALES</span>
                                            <span class="daily-metric-value">${formatCurrency(day.revenue)}</span>
                                        </div>
                                        
                                        <div class="daily-metric">
                                            <span class="daily-metric-label">ITEMS</span>
                                            <span class="daily-metric-value">${formatNumber(day.items)}</span>
                                        </div>
                                    </div>
                                </div>
                                `;
                            }).join('')}
                        </div>
                    </div>
                </div>
            </div>

            <!-- Customer Insights -->
            <div class="section">
                <div class="section-header">
                    <h2>Customer Insights</h2>
                </div>
                <div class="section-body">
                    <div class="customer-metrics-grid">
                        <div class="customer-metric-card total-customers">
                            <div class="customer-metric-value">${formatNumber(data.totalCustomers)}</div>
                            <div class="customer-metric-label">TOTAL CUSTOMERS</div>
                        </div>
                        
                        <div class="customer-metric-card new-customers">
                            <div class="customer-metric-value">${formatNumber(data.newCustomers)}</div>
                            <div class="customer-metric-label">NEW CUSTOMERS</div>
                        </div>
                        
                        <div class="customer-metric-card repeat-customers">
                            <div class="customer-metric-value">${formatNumber(data.repeatCustomers)}</div>
                            <div class="customer-metric-label">REPEAT CUSTOMERS</div>
                        </div>
                        
                        <div class="customer-metric-card loyalty-rate">
                            <div class="customer-metric-value">${data.repeatCustomerRate.toFixed(1)}%</div>
                            <div class="customer-metric-label">REPEAT CUSTOMER RATE</div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Financial Overview -->
            <div class="section">
                <div class="section-header">
                    <h2>Financial Overview</h2>
                </div>
                <div class="section-body">
                    <div class="financial-metrics-grid">
                        <div class="financial-metric-card revenue">
                            <div class="financial-metric-value">${formatCurrency(data.totalRevenue)}</div>
                            <div class="financial-metric-label">Total Revenue</div>
                            <div class="financial-metric-period">All Time</div>
                        </div>
                        
                        <div class="financial-metric-card aov">
                            <div class="financial-metric-value">${formatCurrency(data.averageOrderValue)}</div>
                            <div class="financial-metric-label">Avg Order Value</div>
                            <div class="financial-metric-period">All Orders</div>
                        </div>
                        
                        <div class="financial-metric-card fulfillment">
                            <div class="financial-metric-value">${fulfillmentRate.toFixed(1)}%</div>
                            <div class="financial-metric-label">Fulfillment Rate</div>
                            <div class="financial-metric-period">Last 7 Days</div>
                        </div>
                        
                        <div class="financial-metric-card items-per-order">
                            <div class="financial-metric-value">${data.averageItemsPerOrder.toFixed(1)}</div>
                            <div class="financial-metric-label">Items Per Order</div>
                            <div class="financial-metric-period">Average</div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Business Overview -->
            <div class="section">
                <div class="section-header">
                    <h2>Business Overview</h2>
                </div>
                <div class="section-body">
                    <div class="summary-grid">
                        <div class="summary-card">
                            <div class="summary-value">${formatNumber(data.totalOrders)}</div>
                            <div class="summary-label">All-Time Orders</div>
                        </div>
                        
                        <div class="summary-card">
                            <div class="summary-value">${formatCurrency(data.totalRevenue)}</div>
                            <div class="summary-label">All-Time Revenue</div>
                        </div>
                        
                        <div class="summary-card">
                            <div class="summary-value">${formatCurrency(data.averageOrderValue)}</div>
                            <div class="summary-label">Avg Order Value</div>
                        </div>
                        
                        <div class="summary-card">
                            <div class="summary-value">${formatNumber(data.ordersLoaded)}</div>
                            <div class="summary-label">Orders Analyzed</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Footer -->
        <div class="footer">
            <p class="footer-text">
                <strong>Orders Analyzed:</strong> ${formatNumber(data.ordersLoaded)} orders • 
                <strong>Net Revenue:</strong> ${formatCurrency(data.totalRevenue)} • 
                <strong>Data Updated:</strong> ${new Date().toLocaleDateString()}
            </p>
            <p class="footer-text">Analytics Dashboard - Nexus Powering Your Business Insights</p>
        </div>
    </div>
</body>
</html>
    `;
  }

  private generateTextVersion(data: OrderData, shop: string): string {
    const formatCurrency = (amount: number) => `$${amount.toFixed(2)}`;
    const formatPercent = (num: number) => `${num >= 0 ? '+' : ''}${num.toFixed(1)}%`;

    return `
ANALYTICS REPORT - ${shop}
${new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}

TODAY'S PERFORMANCE:
- Orders: ${data.todayOrders} (${formatPercent(data.ordersChangeVsYesterday)} vs yesterday)
- Revenue: ${formatCurrency(data.todayRevenue)} (${formatPercent(data.revenueChangeVsYesterday)} vs yesterday)
- Items Sold: ${data.todayItems} (${formatPercent(data.itemsChangeVsYesterday)} vs yesterday)

CUSTOMER INSIGHTS:
- Total Customers: ${data.totalCustomers}
- New Customers: ${data.newCustomers}
- Repeat Customers: ${data.repeatCustomers}
- Repeat Rate: ${data.repeatCustomerRate.toFixed(1)}%

FULFILLMENT:
- Fulfilled Today: ${data.todayFulfilled}
- Unfulfilled Today: ${data.todayUnfulfilled}
- Fulfillment Rate: ${data.fulfillmentRate.toFixed(1)}%

LAST 7 DAYS:
${data.dailySales.map(day => {
  const date = new Date(day.date);
  return `- ${date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}: ${formatCurrency(day.revenue)} (${day.orders} orders)`;
}).join('\n')}

BUSINESS OVERVIEW:
- All-Time Orders: ${data.totalOrders}
- All-Time Revenue: ${formatCurrency(data.totalRevenue)}
- Average Order Value: ${formatCurrency(data.averageOrderValue)}

Data analyzed from ${data.ordersLoaded} orders.
Generated on ${new Date().toLocaleString()}
    `;
  }
}