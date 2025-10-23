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

//         console.log('🔍 [EMAIL DEBUG] === ANALYTICS DATA RECEIVED IN EMAIL SERVICE ===');
//     console.log('🔍 [EMAIL DEBUG] Data source:', analyticsData.ordersLoaded, 'orders');
//     console.log('🔍 [EMAIL DEBUG] Today revenue:', analyticsData.todayRevenue);
//     console.log('🔍 [EMAIL DEBUG] Today orders:', analyticsData.todayOrders);
//     console.log('🔍 [EMAIL DEBUG] Total revenue:', analyticsData.totalRevenue);
//     console.log('🔍 [EMAIL DEBUG] Total orders:', analyticsData.totalOrders);
    
//     // Check if data looks real or dummy
//     if (analyticsData.todayRevenue === 0 && analyticsData.totalRevenue === 0) {
//       console.log('❌ [EMAIL DEBUG] DATA APPEARS TO BE DUMMY/EMPTY!');
//     } else {
//       console.log('✅ [EMAIL DEBUG] DATA APPEARS TO BE REAL!');
//     }
        
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
//         recipientsCount: bccRecipients.length,
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

//   private buildAnalyticsEmail(data: OrderData, shop: string): string {
//     const formatCurrency = (amount: number) => {
//       return amount.toLocaleString('en-US', { 
//         style: 'currency', 
//         currency: 'USD',
//         minimumFractionDigits: 2,
//         maximumFractionDigits: 2 
//       });
//     };
    
//     const formatNumber = (num: number) => num.toLocaleString();
//     const formatPercent = (num: number) => `${num >= 0 ? '+' : ''}${num.toFixed(1)}%`;

//     const getTrendIcon = (value: number) => value >= 0 ? '↑' : '↓';

//     // Calculate real metrics from your data
//     const last7DaysRevenue = data.dailySales.reduce((sum, day) => sum + day.revenue, 0);
//     const last7DaysOrders = data.dailySales.reduce((sum, day) => sum + day.orders, 0);
//     const last7DaysItems = data.dailySales.reduce((sum, day) => sum + day.items, 0);
    
//     // Calculate fulfillment rate
//     const totalFulfillment = data.last7DaysFulfilled + data.last7DaysUnfulfilled;
//     const fulfillmentRate = totalFulfillment > 0 ? (data.last7DaysFulfilled / totalFulfillment) * 100 : 0;

//     // Helper to get day name
//     const getDayName = (dateStr: string) => {
//       const date = new Date(dateStr + 'T00:00:00');
//       return date.toLocaleDateString('en-US', { weekday: 'short' });
//     };

//     // Helper to format date
//     const formatDateDisplay = (dateStr: string) => {
//       const date = new Date(dateStr + 'T00:00:00');
//       return date.toLocaleDateString('en-US', { 
//         month: 'short', 
//         day: 'numeric'
//       });
//     };

//     return `
// <!DOCTYPE html>
// <html>
// <head>
//     <meta charset="utf-8">
//     <meta name="viewport" content="width=device-width, initial-scale=1">
//     <title>Analytics Dashboard - ${shop}</title>
//     <style>
//         /* Reset and Base Styles */
//         body {
//             font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
//             line-height: 1.6;
//             color: #333333;
//             margin: 0;
//             padding: 0;
//             background-color: #f8fafc;
//             -webkit-font-smoothing: antialiased;
//         }
        
//         .container {
//             max-width: 680px;
//             margin: 0 auto;
//             background: #ffffff;
//             border-radius: 12px;
//             overflow: hidden;
//             box-shadow: 0 4px 20px rgba(0,0,0,0.08);
//             border: 1px solid #e2e8f0;
//         }
        
//         /* Header */
//         .header {
//             background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
//             color: white;
//             padding: 40px 30px;
//             text-align: center;
//         }
        
//         .header h1 {
//             margin: 0;
//             font-size: 32px;
//             font-weight: 700;
//         }
        
//         .header .subtitle {
//             margin: 12px 0 0 0;
//             font-size: 16px;
//             opacity: 0.95;
//             font-weight: 400;
//         }
        
//         /* Content Sections */
//         .content {
//             padding: 0;
//         }
        
//         .section {
//             margin-bottom: 0;
//             border-bottom: 1px solid #e2e8f0;
//         }
        
//         .section:last-child {
//             border-bottom: none;
//         }
        
//         .section-header {
//             background: #f8fafc;
//             padding: 20px 30px;
//             border-bottom: 1px solid #e2e8f0;
//         }
        
//         .section-header h2 {
//             margin: 0;
//             font-size: 20px;
//             color: #1e293b;
//             font-weight: 600;
//         }
        
//         .section-body {
//             padding: 30px;
//         }
        
//         /* Today's Performance Grid */
//         .primary-metrics-grid {
//             display: table;
//             width: 100%;
//             border-collapse: collapse;
//             margin-bottom: 0;
//         }
        
//         .metric-card {
//             display: table-cell;
//             text-align: center;
//             padding: 25px 15px;
//             border-right: 1px solid #f1f5f9;
//             vertical-align: top;
//         }
        
//         .metric-card:last-child {
//             border-right: none;
//         }
        
//         .metric-value {
//             font-size: 32px;
//             font-weight: 700;
//             color: #1e293b;
//             margin: 0 0 8px 0;
//             line-height: 1.2;
//         }
        
//         .metric-label {
//             font-size: 14px;
//             color: #64748b;
//             margin: 0 0 12px 0;
//             text-transform: uppercase;
//             letter-spacing: 0.5px;
//             font-weight: 600;
//         }
        
//         .metric-change {
//             font-size: 12px;
//             padding: 6px 12px;
//             border-radius: 20px;
//             display: inline-block;
//             font-weight: 600;
//         }
        
//         .change-positive {
//             background: #dcfce7;
//             color: #059669;
//             border: 1px solid #bbf7d0;
//         }
        
//         .change-negative {
//             background: #fee2e2;
//             color: #dc2626;
//             border: 1px solid #fecaca;
//         }
        
//         /* Fulfillment Metrics */
//         .fulfillment-metrics-grid {
//             display: table;
//             width: 100%;
//             border-collapse: collapse;
//             margin: 20px 0 0 0;
//         }
        
//         .fulfillment-metric-card {
//             display: table-cell;
//             text-align: center;
//             padding: 20px 10px;
//             border-right: 1px solid #f1f5f9;
//         }
        
//         .fulfillment-metric-card:last-child {
//             border-right: none;
//         }
        
//         .fulfillment-metric-value {
//             font-size: 24px;
//             font-weight: 700;
//             color: #1e293b;
//             margin: 0 0 6px 0;
//         }
        
//         .fulfillment-metric-label {
//             font-size: 11px;
//             color: #64748b;
//             margin: 0;
//             text-transform: uppercase;
//             letter-spacing: 0.5px;
//             font-weight: 600;
//         }
        
//         .fulfillment-metric-period {
//             font-size: 10px;
//             color: #94a3b8;
//             margin: 4px 0 0 0;
//             text-transform: uppercase;
//             letter-spacing: 0.3px;
//         }
        
//         /* Daily Breakdown */
//         .daily-breakdown {
//             margin-top: 25px;
//         }
        
//         .daily-breakdown h4 {
//             margin: 0 0 20px 0;
//             font-size: 16px;
//             color: #1e293b;
//             font-weight: 600;
//         }
        
//         .daily-cards-container {
//             display: table;
//             width: 100%;
//             border-collapse: collapse;
//         }
        
//         .daily-card {
//             display: table-cell;
//             text-align: center;
//             padding: 20px 8px;
//             border-right: 1px solid #f1f5f9;
//             vertical-align: top;
//         }
        
//         .daily-card:last-child {
//             border-right: none;
//         }
        
//         .daily-card.current-day {
//             background: linear-gradient(135deg, #eff6ff 0%, #f0f9ff 100%);
//             border: 1px solid #bfdbfe;
//             border-radius: 8px;
//             margin: -1px;
//         }
        
//         .daily-card-header {
//             margin-bottom: 15px;
//         }
        
//         .daily-date {
//             font-size: 14px;
//             font-weight: 600;
//             color: #1e293b;
//             margin: 0 0 4px 0;
//         }
        
//         .daily-day {
//             font-size: 12px;
//             color: #64748b;
//             text-transform: uppercase;
//             letter-spacing: 0.5px;
//         }
        
//         .daily-metrics {
//             display: table;
//             width: 100%;
//             border-collapse: collapse;
//         }
        
//         .daily-metric {
//             display: table-cell;
//             text-align: center;
//             padding: 0 4px;
//         }
        
//         .daily-metric-label {
//             font-size: 10px;
//             color: #64748b;
//             text-transform: uppercase;
//             letter-spacing: 0.3px;
//             margin: 0 0 4px 0;
//             display: block;
//         }
        
//         .daily-metric-value {
//             font-size: 14px;
//             font-weight: 600;
//             color: #1e293b;
//             margin: 0;
//             display: block;
//         }
        
//         /* Customer Insights */
//         .customer-metrics-grid {
//             display: table;
//             width: 100%;
//             border-collapse: collapse;
//         }
        
//         .customer-metric-card {
//             display: table-cell;
//             text-align: center;
//             padding: 25px 15px;
//             border-right: 1px solid #f1f5f9;
//         }
        
//         .customer-metric-card:last-child {
//             border-right: none;
//         }
        
//         .customer-metric-value {
//             font-size: 28px;
//             font-weight: 700;
//             color: #1e293b;
//             margin: 0 0 8px 0;
//         }
        
//         .customer-metric-label {
//             font-size: 12px;
//             color: #64748b;
//             margin: 0;
//             text-transform: uppercase;
//             letter-spacing: 0.5px;
//             font-weight: 600;
//             line-height: 1.4;
//         }
        
//         /* Financial Metrics */
//         .financial-metrics-grid {
//             display: table;
//             width: 100%;
//             border-collapse: collapse;
//         }
        
//         .financial-metric-card {
//             display: table-cell;
//             text-align: center;
//             padding: 20px 10px;
//             border-right: 1px solid #f1f5f9;
//             vertical-align: top;
//         }
        
//         .financial-metric-card:last-child {
//             border-right: none;
//         }
        
//         .financial-metric-value {
//             font-size: 18px;
//             font-weight: 700;
//             color: #1e293b;
//             margin: 0 0 6px 0;
//             line-height: 1.3;
//         }
        
//         .financial-metric-label {
//             font-size: 11px;
//             color: #64748b;
//             margin: 0 0 4px 0;
//             text-transform: uppercase;
//             letter-spacing: 0.3px;
//             font-weight: 600;
//         }
        
//         .financial-metric-rate {
//             font-size: 10px;
//             color: #94a3b8;
//             margin: 0;
//         }
        
//         .financial-metric-period {
//             font-size: 10px;
//             color: #94a3b8;
//             margin: 0;
//             font-style: italic;
//         }
        
//         /* Summary Cards */
//         .summary-grid {
//             display: table;
//             width: 100%;
//             border-collapse: collapse;
//             margin: 20px 0 0 0;
//         }
        
//         .summary-card {
//             display: table-cell;
//             text-align: center;
//             padding: 20px 10px;
//             border-right: 1px solid #f1f5f9;
//         }
        
//         .summary-card:last-child {
//             border-right: none;
//         }
        
//         .summary-value {
//             font-size: 20px;
//             font-weight: 700;
//             color: #1e293b;
//             margin: 0 0 6px 0;
//         }
        
//         .summary-label {
//             font-size: 11px;
//             color: #64748b;
//             margin: 0;
//             text-transform: uppercase;
//             letter-spacing: 0.3px;
//             font-weight: 600;
//         }
        
//         /* Footer */
//         .footer {
//             background: #f8fafc;
//             padding: 25px 30px;
//             text-align: center;
//             border-top: 1px solid #e2e8f0;
//         }
        
//         .footer-text {
//             font-size: 12px;
//             color: #64748b;
//             margin: 0;
//             line-height: 1.6;
//         }
        
//         /* Responsive */
//         @media only screen and (max-width: 600px) {
//             .container {
//                 border-radius: 0;
//             }
            
//             .header {
//                 padding: 30px 20px;
//             }
            
//             .header h1 {
//                 font-size: 24px;
//             }
            
//             .section-body {
//                 padding: 20px;
//             }
            
//             .metric-card,
//             .fulfillment-metric-card,
//             .customer-metric-card,
//             .financial-metric-card,
//             .summary-card {
//                 display: block;
//                 border-right: none;
//                 border-bottom: 1px solid #f1f5f9;
//                 padding: 20px 15px;
//             }
            
//             .daily-card {
//                 display: block;
//                 border-right: none;
//                 border-bottom: 1px solid #f1f5f9;
//                 padding: 15px 10px;
//             }
            
//             .daily-card:last-child {
//                 border-bottom: none;
//             }
//         }
//     </style>
// </head>
// <body>
//     <div class="container">
//         <!-- Header -->
//         <div class="header">
//             <h1>Analytics Dashboard</h1>
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
//                     <div class="primary-metrics-grid">
//                         <div class="metric-card orders">
//                             <div class="metric-value">${formatNumber(data.todayOrders)}</div>
//                             <div class="metric-label">Today's Orders</div>
//                             ${data.ordersChangeVsYesterday !== 0 ? `
//                             <div class="metric-change ${data.ordersChangeVsYesterday >= 0 ? 'change-positive' : 'change-negative'}">
//                                 ${getTrendIcon(data.ordersChangeVsYesterday)} ${formatPercent(data.ordersChangeVsYesterday)}
//                             </div>
//                             ` : '<div style="height: 24px;"></div>'}
//                         </div>
                        
//                         <div class="metric-card revenue">
//                             <div class="metric-value">${formatCurrency(data.todayRevenue)}</div>
//                             <div class="metric-label">Today's Total Sales</div>
//                             ${data.revenueChangeVsYesterday !== 0 ? `
//                             <div class="metric-change ${data.revenueChangeVsYesterday >= 0 ? 'change-positive' : 'change-negative'}">
//                                 ${getTrendIcon(data.revenueChangeVsYesterday)} ${formatPercent(data.revenueChangeVsYesterday)}
//                             </div>
//                             ` : '<div style="height: 24px;"></div>'}
//                         </div>
                        
//                         <div class="metric-card items">
//                             <div class="metric-value">${formatNumber(data.todayItems)}</div>
//                             <div class="metric-label">Items Ordered</div>
//                             ${data.itemsChangeVsYesterday !== 0 ? `
//                             <div class="metric-change ${data.itemsChangeVsYesterday >= 0 ? 'change-positive' : 'change-negative'}">
//                                 ${getTrendIcon(data.itemsChangeVsYesterday)} ${formatPercent(data.itemsChangeVsYesterday)}
//                             </div>
//                             ` : '<div style="height: 24px;"></div>'}
//                         </div>
//                     </div>

//                     <!-- Fulfillment Metrics -->
//                     <div class="fulfillment-metrics-grid">
//                         <div class="fulfillment-metric-card today-fulfilled">
//                             <div class="fulfillment-metric-value">${formatNumber(data.todayFulfilled)}</div>
//                             <div class="fulfillment-metric-label">FULFILLED TODAY</div>
//                             <div class="fulfillment-metric-period">Today</div>
//                         </div>
                        
//                         <div class="fulfillment-metric-card today-unfulfilled">
//                             <div class="fulfillment-metric-value">${formatNumber(data.todayUnfulfilled)}</div>
//                             <div class="fulfillment-metric-label">UNFULFILLED TODAY</div>
//                             <div class="fulfillment-metric-period">Today</div>
//                         </div>
                        
//                         <div class="fulfillment-metric-card week-fulfilled">
//                             <div class="fulfillment-metric-value">${formatNumber(data.last7DaysFulfilled)}</div>
//                             <div class="fulfillment-metric-label">FULFILLED</div>
//                             <div class="fulfillment-metric-period">Last 7 Days</div>
//                         </div>
                        
//                         <div class="fulfillment-metric-card week-unfulfilled">
//                             <div class="fulfillment-metric-value">${formatNumber(data.last7DaysUnfulfilled)}</div>
//                             <div class="fulfillment-metric-label">UNFULFILLED</div>
//                             <div class="fulfillment-metric-period">Last 7 Days</div>
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
//                     <div class="summary-grid">
//                         <div class="summary-card">
//                             <div class="summary-value">${formatNumber(last7DaysOrders)}</div>
//                             <div class="summary-label">Total Orders</div>
//                         </div>
                        
//                         <div class="summary-card">
//                             <div class="summary-value">${formatCurrency(last7DaysRevenue)}</div>
//                             <div class="summary-label">Total Sales</div>
//                         </div>
                        
//                         <div class="summary-card">
//                             <div class="summary-value">${formatNumber(last7DaysItems)}</div>
//                             <div class="summary-label">Total Items</div>
//                         </div>
                        
//                         <div class="summary-card">
//                             <div class="summary-value">${formatCurrency(data.averageDailyRevenue)}</div>
//                             <div class="summary-label">Avg Daily Sales</div>
//                         </div>
//                     </div>

//                     <!-- Daily Breakdown -->
//                     <div class="daily-breakdown">
//                         <h4>Daily Breakdown</h4>
//                         <div class="daily-cards-container">
//                             ${data.dailySales.map((day, index) => {
//                                 const isToday = index === data.dailySales.length - 1;
                                
//                                 return `
//                                 <div class="daily-card ${isToday ? 'current-day' : ''}">
//                                     <div class="daily-card-header">
//                                         <div class="daily-date">${formatDateDisplay(day.date)}</div>
//                                         <div class="daily-day">${getDayName(day.date)}</div>
//                                     </div>
                                    
//                                     <div class="daily-metrics">
//                                         <div class="daily-metric">
//                                             <span class="daily-metric-label">ORDERS</span>
//                                             <span class="daily-metric-value">${formatNumber(day.orders)}</span>
//                                         </div>
                                        
//                                         <div class="daily-metric">
//                                             <span class="daily-metric-label">TOTAL SALES</span>
//                                             <span class="daily-metric-value">${formatCurrency(day.revenue)}</span>
//                                         </div>
                                        
//                                         <div class="daily-metric">
//                                             <span class="daily-metric-label">ITEMS</span>
//                                             <span class="daily-metric-value">${formatNumber(day.items)}</span>
//                                         </div>
//                                     </div>
//                                 </div>
//                                 `;
//                             }).join('')}
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
//                     <div class="customer-metrics-grid">
//                         <div class="customer-metric-card total-customers">
//                             <div class="customer-metric-value">${formatNumber(data.totalCustomers)}</div>
//                             <div class="customer-metric-label">TOTAL CUSTOMERS</div>
//                         </div>
                        
//                         <div class="customer-metric-card new-customers">
//                             <div class="customer-metric-value">${formatNumber(data.newCustomers)}</div>
//                             <div class="customer-metric-label">NEW CUSTOMERS</div>
//                         </div>
                        
//                         <div class="customer-metric-card repeat-customers">
//                             <div class="customer-metric-value">${formatNumber(data.repeatCustomers)}</div>
//                             <div class="customer-metric-label">REPEAT CUSTOMERS</div>
//                         </div>
                        
//                         <div class="customer-metric-card loyalty-rate">
//                             <div class="customer-metric-value">${data.repeatCustomerRate.toFixed(1)}%</div>
//                             <div class="customer-metric-label">REPEAT CUSTOMER RATE</div>
//                         </div>
//                     </div>
//                 </div>
//             </div>

//             <!-- Financial Overview -->
//             <div class="section">
//                 <div class="section-header">
//                     <h2>Financial Overview</h2>
//                 </div>
//                 <div class="section-body">
//                     <div class="financial-metrics-grid">
//                         <div class="financial-metric-card revenue">
//                             <div class="financial-metric-value">${formatCurrency(data.totalRevenue)}</div>
//                             <div class="financial-metric-label">Total Revenue</div>
//                             <div class="financial-metric-period">All Time</div>
//                         </div>
                        
//                         <div class="financial-metric-card aov">
//                             <div class="financial-metric-value">${formatCurrency(data.averageOrderValue)}</div>
//                             <div class="financial-metric-label">Avg Order Value</div>
//                             <div class="financial-metric-period">All Orders</div>
//                         </div>
                        
//                         <div class="financial-metric-card fulfillment">
//                             <div class="financial-metric-value">${fulfillmentRate.toFixed(1)}%</div>
//                             <div class="financial-metric-label">Fulfillment Rate</div>
//                             <div class="financial-metric-period">Last 7 Days</div>
//                         </div>
                        
//                         <div class="financial-metric-card items-per-order">
//                             <div class="financial-metric-value">${data.averageItemsPerOrder.toFixed(1)}</div>
//                             <div class="financial-metric-label">Items Per Order</div>
//                             <div class="financial-metric-period">Average</div>
//                         </div>
//                     </div>
//                 </div>
//             </div>

//             <!-- Business Overview -->
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
//         </div>

//         <!-- Footer -->
//         <div class="footer">
//             <p class="footer-text">
//                 <strong>Orders Analyzed:</strong> ${formatNumber(data.ordersLoaded)} orders • 
//                 <strong>Net Revenue:</strong> ${formatCurrency(data.totalRevenue)} • 
//                 <strong>Data Updated:</strong> ${new Date().toLocaleDateString()}
//             </p>
//             <p class="footer-text">Analytics Dashboard - Nexus Powering Your Business Insights</p>
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






// ==================== 1.0 IMPORTS & SETUP ====================

import sgMail from "@sendgrid/mail";
import { StoreEmailSettings } from "../models/StoreEmailSettings.server";
import { useState, useEffect, useMemo } from "react";
import "../styles/orders.css";

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
  Filler,
} from 'chart.js';
import { Bar, Line, Pie, Doughnut } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

// ==================== 1.1 API CONFIGURATION ====================

const SHOPIFY_API_VERSION = process.env.SHOPIFY_API_VERSION || '2024-04';

// ==================== 2.0 TYPE DEFINITIONS ====================

interface Order {
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

type EventSummary = {
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
  totalEvents: number;
  netValue: number;
};

interface OrderStats {
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

interface CustomerData {
  newCustomers: number;
  repeatedCustomers: number;
  totalCustomers: number;
}

interface AnalyticsData {
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
}

interface CachedAnalyticsData extends AnalyticsData {
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

interface OrderData {
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

// ==================== 3.0 CACHE MANAGER ====================

class PersistentCacheManager {
  private memoryStorage: Map<string, any> = new Map();
  public version = 1;

  private performanceMetrics = {
    setOperations: 0,
    getOperations: 0,
    removeOperations: 0,
    totalSetTime: 0,
    totalGetTime: 0,
    totalRemoveTime: 0
  };

  private validateCacheData(data: any): boolean {
    try {
      if (!data) return false;
      if (data.orders && !Array.isArray(data.orders)) return false;
      if (data.lastUpdatedAt && isNaN(Date.parse(data.lastUpdatedAt))) return false;
      return true;
    } catch (error) {
      return false;
    }
  }

  private async getPersistentStorage(): Promise<Map<string, any>> {
    return this.memoryStorage;
  }

  async set<T>(key: string, value: T, ttl: number = 30 * 60 * 1000): Promise<void> {
    const startTime = performance.now();
    
    try {
      if (!key || typeof key !== 'string') {
        throw new Error('Invalid cache key');
      }

      if (!this.validateCacheData(value)) {
        throw new Error('Invalid cache data structure');
      }

      const storage = await this.getPersistentStorage();
      const entry = {
        value,
        timestamp: Date.now(),
        ttl,
        key,
        version: this.version
      };
      
      storage.set(key, entry);
      
      if (typeof window !== 'undefined' && window.localStorage) {
        try {
          localStorage.setItem(key, JSON.stringify(entry));
        } catch (e) {
        }
      }
      await this.enforceSizeLimit(50);
      
    } catch (error) {
      throw error;
    } finally {
      const duration = performance.now() - startTime;
      this.performanceMetrics.setOperations++;
      this.performanceMetrics.totalSetTime += duration;
    }
  }

  async get<T>(key: string): Promise<{ value: T; timestamp: number } | null> {
    const startTime = performance.now();
    
    try {
      const storage = await this.getPersistentStorage();
      let entry = storage.get(key);
      
      if (!entry && typeof window !== 'undefined' && window.localStorage) {
        try {
          const stored = localStorage.getItem(key);
          if (stored) {
            entry = JSON.parse(stored);
            storage.set(key, entry);
          }
        } catch (e) {
          await this.remove(key);
          return null;
        }
      }

      if (!entry) {
        return null;
      }

      const isExpired = Date.now() - entry.timestamp > entry.ttl;
      if (isExpired) {
        await this.remove(key);
        return null;
      }

      if (!this.validateCacheData(entry.value)) {
        await this.remove(key);
        return null;
      }

      return { value: entry.value, timestamp: entry.timestamp };
    } catch (error) {
      await this.remove(key);
      return null;
    } finally {
      const duration = performance.now() - startTime;
      this.performanceMetrics.getOperations++;
      this.performanceMetrics.totalGetTime += duration;
    }
  }

  async remove(key: string): Promise<void> {
    const startTime = performance.now();
    
    try {
      const storage = await this.getPersistentStorage();
      storage.delete(key);
      
      if (typeof window !== 'undefined' && window.localStorage) {
        try {
          localStorage.removeItem(key);
        } catch (e) {
        }
      }
    } catch (error) {
    } finally {
      const duration = performance.now() - startTime;
      this.performanceMetrics.removeOperations++;
      this.performanceMetrics.totalRemoveTime += duration;
    }
  }

  async emergencyReset(shop: string): Promise<void> {
    const keys = [
      makeCacheKey(shop, "orders"),
    ];
    
    for (const key of keys) {
      await this.remove(key);
    }
  }

  async cleanAllExpired(): Promise<number> {
    let cleanedCount = 0;
    const storage = await this.getPersistentStorage();
    const now = Date.now();
    
    for (const [key, entry] of storage.entries()) {
      if (now - entry.timestamp > entry.ttl) {
        await this.remove(key);
        cleanedCount++;
      }
    }
    
    if (typeof window !== 'undefined' && window.localStorage) {
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.includes('::analytics::')) {
          try {
            const stored = localStorage.getItem(key);
            if (stored) {
              const entry = JSON.parse(stored);
              if (now - entry.timestamp > entry.ttl) {
                localStorage.removeItem(key);
                cleanedCount++;
              }
            }
          } catch (e) {
            localStorage.removeItem(key);
            cleanedCount++;
          }
        }
      }
    }
    
    return cleanedCount;
  }

  async enforceSizeLimit(maxSize: number = 100): Promise<void> {
    const storage = await this.getPersistentStorage();
    if (storage.size <= maxSize) return;
    
    const entries = Array.from(storage.entries())
      .sort((a, b) => a[1].timestamp - b[1].timestamp);
      
    const toRemove = storage.size - maxSize;
    for (let i = 0; i < toRemove; i++) {
      await this.remove(entries[i][0]);
    }
  }

  getStats() {
    return {
      size: this.memoryStorage.size,
      version: this.version
    };
  }

  getPerformanceReport() {
    const avgSetTime = this.performanceMetrics.setOperations > 0 
      ? this.performanceMetrics.totalSetTime / this.performanceMetrics.setOperations 
      : 0;
    
    const avgGetTime = this.performanceMetrics.getOperations > 0 
      ? this.performanceMetrics.totalGetTime / this.performanceMetrics.getOperations 
      : 0;
    
    const avgRemoveTime = this.performanceMetrics.removeOperations > 0 
      ? this.performanceMetrics.totalRemoveTime / this.performanceMetrics.removeOperations 
      : 0;

    return {
      operations: {
        set: this.performanceMetrics.setOperations,
        get: this.performanceMetrics.getOperations,
        remove: this.performanceMetrics.removeOperations
      },
      averageTimes: {
        set: parseFloat(avgSetTime.toFixed(2)),
        get: parseFloat(avgGetTime.toFixed(2)),
        remove: parseFloat(avgRemoveTime.toFixed(2))
      },
      totalTimes: {
        set: parseFloat(this.performanceMetrics.totalSetTime.toFixed(2)),
        get: parseFloat(this.performanceMetrics.totalGetTime.toFixed(2)),
        remove: parseFloat(this.performanceMetrics.totalRemoveTime.toFixed(2))
      }
    };
  }

  healthReport() {
    const now = Date.now();
    let expiredCount = 0;
    let validCount = 0;

    for (const entry of this.memoryStorage.values()) {
      if (now - entry.timestamp > entry.ttl) {
        expiredCount++;
      } else {
        validCount++;
      }
    }

    const total = this.memoryStorage.size;
    const health = total > 0 ? validCount / total : 1;

    return {
      total: total,
      valid: validCount,
      expired: expiredCount,
      health: health,
      sizeInfo: {
        memorySize: total,
        recommendedMax: 50,
        needsCleaning: total > 50
      }
    };
  }
}

const cacheManager = new PersistentCacheManager();

// ==================== 4.0 HELPER FUNCTIONS ====================

function makeCacheKey(shop: string, segment: string): string {
  return `${shop}::analytics::${segment}::v${cacheManager.version}`;
}

function nowISO(): string {
  return new Date().toISOString();
}

function getMonthRanges(shopTimeZone: string = "UTC") {
  const ranges: { start: string; end: string; key: string }[] = [];
  const now = new Date();

  for (let i = 6; i >= 0; i--) {
    const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const start = new Date(date.getFullYear(), date.getMonth(), 1);
    const end = new Date(date.getFullYear(), date.getMonth() + 1, 0, 23, 59, 59);
    ranges.push({
      start: start.toISOString(),
      end: end.toISOString(),
      key: date.toLocaleString("default", { month: "short", year: "numeric" }),
    });
  }

  return ranges;
}

function getLastNDays(n: number, shopTimeZone: string = "UTC") {
  const days: string[] = [];
  const now = new Date();
  
  for (let i = n - 1; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(now.getDate() - i);
    const dayKey = d.toLocaleDateString("en-CA", { timeZone: shopTimeZone });
    days.push(dayKey);
  }
  
  return days;
}

function getLast8Weeks(shopTimeZone: string = "UTC") {
  const weeks: string[] = [];
  const now = new Date();
  const monday = new Date(now);
  monday.setDate(now.getDate() - ((now.getDay() + 6) % 7));
  for (let i = 7; i >= 0; i--) {
    const startOfWeek = new Date(monday);
    startOfWeek.setDate(monday.getDate() - i * 7);
    const key = `Week of ${startOfWeek.toLocaleDateString("en-CA", { timeZone: shopTimeZone })}`;
    weeks.push(key);
  }
  return weeks;
}

function formatWeekDisplay(weekKey: string): string {
  if (weekKey.startsWith('Week of ')) {
    const dateStr = weekKey.replace('Week of ', '');
    const startOfWeek = new Date(dateStr + 'T00:00:00');
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);
    
    const startMonth = startOfWeek.toLocaleDateString("en-US", { month: "short" });
    const startDay = startOfWeek.getDate();
    const endMonth = endOfWeek.toLocaleDateString("en-US", { month: "short" });
    const endDay = endOfWeek.getDate();
    
    return `${startMonth} ${startDay}-${endMonth} ${endDay}`;
  }
  return weekKey;
}

// ==================== 5.0 API FETCHING FUNCTIONS ====================

async function fetchOrdersSince(
  shop: string, 
  accessToken: string, 
  sinceDate: string, 
  cachedOrders: any[] = []
): Promise<{ orders: any[]; hasMore: boolean }> {

  let newOrders: any[] = [];
  let url = `https://${shop}/admin/api/${SHOPIFY_API_VERSION}/orders.json?status=any&limit=250&updated_at_min=${sinceDate}`;
  let pageCount = 0;
  let hasMore = true;

  while (url && hasMore) {
    pageCount++;

    const response = await fetch(url, { 
      headers: { "X-Shopify-Access-Token": accessToken } 
    });

    if (!response.ok) {
      if (response.status === 429) {
        const retryAfter = response.headers.get('Retry-After') || '10';
        const waitTime = parseInt(retryAfter) * 1000;
        await new Promise(resolve => setTimeout(resolve, waitTime));
        continue;
      }
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    const apiOrders: any[] = data.orders || [];
    
    newOrders = newOrders.concat(apiOrders);

    const linkHeader = response.headers.get("Link");
    const nextMatch = linkHeader?.match(/<([^>]+)>; rel="next"/);
    url = nextMatch ? nextMatch[1] : "";
    hasMore = !!url;

    if (url) {
      await new Promise(resolve => setTimeout(resolve, 200));
    }
  }

  return { orders: newOrders, hasMore: false };
}

async function fetchOrdersForPeriod(shop: string, accessToken: string, startDate: string, endDate: string) {
  let allOrders: any[] = [];
  let url = `https://${shop}/admin/api/${SHOPIFY_API_VERSION}/orders.json?status=any&limit=250&created_at_min=${startDate}&created_at_max=${endDate}`;
  let pageCount = 0;

  while (url) {
    pageCount++;

    const response = await fetch(url, { 
      headers: { "X-Shopify-Access-Token": accessToken } 
    });

    if (!response.ok) {
      if (response.status === 429) {
        const retryAfter = response.headers.get('Retry-After') || '10';
        const waitTime = parseInt(retryAfter) * 1000;
        await new Promise(resolve => setTimeout(resolve, waitTime));
        continue;
      } else {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    }

    const data = await response.json();
    const ordersCount = data.orders?.length || 0;
    
    allOrders = allOrders.concat(data.orders || []);

    const linkHeader = response.headers.get("Link");
    const nextMatch = linkHeader?.match(/<([^>]+)>; rel="next"/);
    url = nextMatch ? nextMatch[1] : "";
  }

  return allOrders;
}

// ==================== 6.0 EVENT DETECTION LOGIC ====================

function calculateOrderEventSummary(order: any, periodStart: Date, periodEnd: Date): EventSummary | null {
  const eventSummary: EventSummary = {
    refunds: { count: 0, value: 0 },
    exchanges: { count: 0, value: 0 },
    partialRefunds: { count: 0, value: 0 },
    totalEvents: 0,
    netValue: 0
  };

  const orderRefunds = order.refunds || [];
  let hasEvents = false;

  orderRefunds.forEach((refund: any) => {
    const refundDate = new Date(refund.created_at);
    
    if (refundDate >= periodStart && refundDate <= periodEnd) {
      let refundAmount = 0;
      
      if (refund.transactions && refund.transactions.length > 0) {
        refund.transactions.forEach((transaction: any) => {
          if (transaction.kind === 'refund' && transaction.status === 'success') {
            refundAmount += Math.abs(parseFloat(transaction.amount) || 0);
          }
        });
      }

      const isFullRefund = refundAmount === parseFloat(order.total_price);
      const hasExchangeTags = order.tags?.includes('exchange') || order.note?.includes('exchange');
      const hasMultipleFulfillments = order.fulfillments && order.fulfillments.length > 1;
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

  return hasEvents ? eventSummary : null;
}

// ==================== 7.0 FINANCIAL CALCULATION ENGINE ====================

function processSimpleOrder(order: any): OrderStats {
  const grossSales = parseFloat(order.total_line_items_price) || 0;
  const totalDiscounts = Math.abs(parseFloat(order.total_discounts) || 0);
  const shipping = parseFloat(order.total_shipping_price_set?.shop_money?.amount || "0") || 0;
  const taxes = parseFloat(order.current_total_tax) || 0;
  const totalSales = parseFloat(order.current_total_price) || 0;
  
  const itemsCount = order.line_items?.reduce((sum: number, li: any) => sum + li.quantity, 0) || 0;
  const fulfilledCount = order.fulfillment_status === "fulfilled" ? 1 : 0;
  const unfulfilledCount = order.fulfillment_status !== "fulfilled" ? 1 : 0;

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
    financialStatus: order.financial_status || 'pending'
  };
}

function processOrderToStats(order: any): OrderStats {
  const hasRefunds = order.refunds && order.refunds.length > 0;
  const hasComplexFulfillment = order.fulfillments && order.fulfillments.length > 1;
  const hasExchangeTags = order.tags?.includes('exchange') || order.note?.includes('exchange');
  
  if (!hasRefunds && !hasComplexFulfillment && !hasExchangeTags) {
    return processSimpleOrder(order);
  }

  const grossSales = parseFloat(order.total_line_items_price) || 0;
  const totalDiscounts = Math.abs(parseFloat(order.total_discounts) || 0);
  const originalShipping = parseFloat(order.total_shipping_price_set?.shop_money?.amount || "0") || 0;
  const taxes = parseFloat(order.current_total_tax) || 0;
  const totalSales = parseFloat(order.current_total_price) || 0;

  let grossReturns = 0;
  let discountsReturned = 0;
  let shippingRefunds = 0;
  let returnShippingCharges = 0;
  let restockingFees = 0;
  let returnFees = 0;
  let positiveAdjustments = 0;
  let totalItemRefunds = 0;
  let totalActualRefund = 0;
  let extraFees = 0;
  let refundDiscrepancy = 0;
  let netReturns = 0;

  let isExchangeOrder = false;
  let exchangeItemValue = 0;

  const orderRefunds = order.refunds || [];

  if (orderRefunds.length > 0) {
    for (let i = 0; i < orderRefunds.length; i++) {
      const refund = orderRefunds[i];
      
      if (refund.transactions && refund.transactions.length > 0) {
        for (let j = 0; j < refund.transactions.length; j++) {
          const transaction = refund.transactions[j];
          if (transaction.kind === 'refund' && transaction.status === 'success') {
            const refundAmount = Math.abs(parseFloat(transaction.amount) || 0);
            totalActualRefund += refundAmount;
            netReturns += refundAmount;
          }
        }
      }

      if (refund.refund_line_items) {
        for (let j = 0; j < refund.refund_line_items.length; j++) {
          const item = refund.refund_line_items[j];
          const itemValue = Math.abs(parseFloat(item.subtotal) || 0);
          grossReturns -= itemValue;
          totalItemRefunds += itemValue;
          
          const lineItemDiscount = parseFloat(item.total_discount) || 0;
          discountsReturned += Math.abs(lineItemDiscount);
        }
      }
      
      if (refund.order_adjustments && refund.order_adjustments.length > 0) {
        for (let j = 0; j < refund.order_adjustments.length; j++) {
          const adjustment = refund.order_adjustments[j];
          const amount = parseFloat(adjustment.amount) || 0;
          const absAmount = Math.abs(amount);
          
          if (adjustment.kind === 'shipping_refund') {
            shippingRefunds += amount;
          }
          else if (adjustment.kind === 'return_shipping' || adjustment.reason?.includes('shipping')) {
            returnShippingCharges += absAmount;
          }
          else if (adjustment.kind === 'restocking_fee' || adjustment.reason?.includes('restock')) {
            restockingFees += absAmount;
          }
          else if (adjustment.kind === 'return_fee' || adjustment.reason?.includes('fee')) {
            returnFees += absAmount;
          }
          else if (adjustment.kind === 'refund_discrepancy') {
            refundDiscrepancy += amount;
            if (amount > 0) {
              positiveAdjustments += absAmount;
            } else if (amount < 0) {
              grossReturns += amount;
            }
          }
        }
      }
      
      if (refund.total_additional_fees_set) {
        const additionalFees = parseFloat(refund.total_additional_fees_set?.shop_money?.amount || "0") || 0;
        returnFees += additionalFees;
      }
    }
  }

  const shopifyReturns = grossReturns + positiveAdjustments - discountsReturned;
  const totalRefund = shopifyReturns + refundDiscrepancy;
  const isFullRefund = Math.abs(grossSales + shopifyReturns) < 0.01;

  const netDiscounts = totalDiscounts - discountsReturned;
  const shippingCharges = Math.max(0, originalShipping - Math.abs(shippingRefunds));

  let netSales;
  let adjustedTotalSales = totalSales;

  if (orderRefunds.length > 0) {
    const hasMultipleFulfillments = order.fulfillments && order.fulfillments.length > 1;
    
    if (hasMultipleFulfillments) {
      isExchangeOrder = true;
      
      if (order.line_items) {
        for (let i = 0; i < order.line_items.length; i++) {
          const item = order.line_items[i];
          let isRefunded = false;
          
          if (orderRefunds[0]?.refund_line_items) {
            for (let j = 0; j < orderRefunds[0].refund_line_items.length; j++) {
              const refundItem = orderRefunds[0].refund_line_items[j];
              if (refundItem.line_item_id === item.id) {
                isRefunded = true;
                break;
              }
            }
          }
          
          if (!isRefunded && item.fulfillment_status === 'fulfilled') {
            const itemPrice = parseFloat(item.price) || 0;
            const itemQuantity = item.current_quantity || item.quantity || 0;
            exchangeItemValue += itemPrice * itemQuantity;
          }
        }
      }
    }
    
    if (!isExchangeOrder) {
      const hasExchangeTags = order.tags?.includes('exchange') || 
                             order.note?.includes('exchange') ||
                             order.note?.includes('exchanged');
      const hasComplexRefundHistory = orderRefunds.length > 1;
      
      if (hasExchangeTags || hasComplexRefundHistory) {
        isExchangeOrder = true;
        
        if (order.line_items) {
          for (let i = 0; i < order.line_items.length; i++) {
            const item = order.line_items[i];
            if (item.fulfillment_status === 'fulfilled') {
              const itemPrice = parseFloat(item.price) || 0;
              const itemQuantity = item.current_quantity || item.quantity || 0;
              exchangeItemValue += itemPrice * itemQuantity;
            }
          }
        }
      }
    }
  }

  if (isFullRefund && orderRefunds.length > 0) {
    netSales = 0;
  } else {
    netSales = grossSales - netDiscounts + shopifyReturns + returnShippingCharges + restockingFees - refundDiscrepancy;
  }

  let appliedFunction = 'none';

  if (isFullRefund && isExchangeOrder && orderRefunds.length > 0) {
    extraFees = Math.max(0, Math.abs(totalSales) - exchangeItemValue);
    appliedFunction = 'full_refund_with_exchange';
  }
  else if (isFullRefund && orderRefunds.length > 0) {
    extraFees = Math.abs(totalSales);
    appliedFunction = 'full_refund_no_exchange';
  } 
  else if (isExchangeOrder && !isFullRefund) {
    extraFees = Math.max(0, totalSales - shippingCharges - netSales);
    appliedFunction = 'exchange_partial';
  }
  else if (isExchangeOrder && !isFullRefund && totalItemRefunds > 0 && totalActualRefund > 0) {
    const refundDifference = totalItemRefunds - totalActualRefund;
    if (refundDifference > 0.01) {
      extraFees = Math.max(0, refundDifference - exchangeItemValue);
      appliedFunction = 'partial_refund_with_exchange';
    }
  }
  else if (!isFullRefund && totalItemRefunds > 0 && totalActualRefund > 0) {
    const refundDifference = totalItemRefunds - totalActualRefund;
    if (refundDifference > 0.01) {
      extraFees = refundDifference;
      appliedFunction = 'regular_partial_refund';
    }
  }

  if (isFullRefund && orderRefunds.length > 0) {
    adjustedTotalSales = extraFees;
  }

  const shouldApplyCatchAll = 
    Math.abs(netSales) < 0.01 &&
    totalSales > 0.01 &&
    Math.abs(extraFees - (totalSales - shippingCharges)) > 0.01;

  if (shouldApplyCatchAll) {
    extraFees = Math.max(0, totalSales - shippingCharges);
    appliedFunction = 'final_catch_all_override';
  }

  if (refundDiscrepancy < -0.01) {
    adjustedTotalSales = Math.max(0, adjustedTotalSales + refundDiscrepancy);
  }

  const orderDate = new Date(order.created_at);
  const periodStart = new Date(orderDate.getFullYear(), orderDate.getMonth(), orderDate.getDate());
  const periodEnd = new Date(periodStart);
  periodEnd.setDate(periodStart.getDate() + 1);
  
  const eventSummary = calculateOrderEventSummary(order, periodStart, periodEnd);

  const itemsCount = order.line_items?.reduce((sum: number, li: any) => sum + li.quantity, 0) || 0;
  const fulfilledCount = order.fulfillment_status === "fulfilled" ? 1 : 0;
  const unfulfilledCount = order.fulfillment_status !== "fulfilled" ? 1 : 0;

  return {
    total: parseFloat(grossSales.toFixed(2)),
    discounts: parseFloat(totalDiscounts.toFixed(2)),
    returns: parseFloat(shopifyReturns.toFixed(2)),
    netSales: parseFloat(netSales.toFixed(2)),
    shipping: parseFloat(shippingCharges.toFixed(2)),
    taxes: parseFloat(taxes.toFixed(2)),
    extraFees: parseFloat(extraFees.toFixed(2)),
    totalSales: parseFloat(adjustedTotalSales.toFixed(2)),
    shippingRefunds: parseFloat(Math.abs(shippingRefunds).toFixed(2)),
    netReturns: parseFloat(netReturns.toFixed(2)),
    totalRefund: parseFloat(totalRefund.toFixed(2)),
    
    items: itemsCount,
    fulfilled: fulfilledCount,
    unfulfilled: unfulfilledCount,
    orderCount: 1,
    
    discountsReturned: parseFloat(discountsReturned.toFixed(2)),
    netDiscounts: parseFloat(netDiscounts.toFixed(2)),
    returnShippingCharges: parseFloat(returnShippingCharges.toFixed(2)),
    restockingFees: parseFloat(restockingFees.toFixed(2)),
    returnFees: parseFloat(returnFees.toFixed(2)),
    refundDiscrepancy: parseFloat(refundDiscrepancy.toFixed(2)),
    
    hasSubsequentEvents: !!eventSummary,
    eventSummary: eventSummary,
    refundsCount: orderRefunds.length,
    financialStatus: order.financial_status || 'pending'
  };
}

function mergeStats(existing: OrderStats, newStats: OrderStats): OrderStats {
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

function mergeEventSummaries(a: EventSummary | null, b: EventSummary | null): EventSummary | null {
  if (!a && !b) return null;
  if (!a) return b;
  if (!b) return a;
  
  return {
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
}

// ==================== 8.0 CUSTOMER TRACKING LOGIC ====================

function buildCustomerOrderMap(allOrders: any[], shopTimeZone: string) {
  const customerOrderMap: Record<string, Date[]> = {};
  
  for (let i = 0; i < allOrders.length; i++) {
    const order = allOrders[i];
    const custId = order?.customer?.id;
    
    if (custId === undefined || custId === null) continue;
    
    const customerId = custId.toString();
    
    if (!customerOrderMap[customerId]) {
      customerOrderMap[customerId] = [];
    }
    
    customerOrderMap[customerId].push(new Date(order.created_at));
  }
  
  return customerOrderMap;
}

function analyzeCustomerBehavior(
  customerOrderMap: Record<string, Date[]>, 
  shopTimeZone: string,
  periodKeys: string[],
  periodType: 'daily' | 'weekly' | 'monthly'
): Record<string, CustomerData> {
  const periodAnalytics: Record<string, CustomerData> = {};
  
  for (const key of periodKeys) {
    periodAnalytics[key] = { newCustomers: 0, repeatedCustomers: 0, totalCustomers: 0 };
  }

  const customerIds = Object.keys(customerOrderMap);
  
  for (let i = 0; i < customerIds.length; i++) {
    const customerId = customerIds[i];
    const orderDates = customerOrderMap[customerId];
    if (orderDates.length === 0) continue;
    
    let firstOrderDate = orderDates[0];
    for (let j = 1; j < orderDates.length; j++) {
      if (orderDates[j] < firstOrderDate) {
        firstOrderDate = orderDates[j];
      }
    }
    
    let firstOrderKey: string;
    if (periodType === 'daily') {
      firstOrderKey = firstOrderDate.toLocaleDateString("en-CA", { timeZone: shopTimeZone });
    } else if (periodType === 'monthly') {
      firstOrderKey = firstOrderDate.toLocaleString("default", { month: "short", year: "numeric", timeZone: shopTimeZone });
    } else {
      const firstOrderMonday = new Date(firstOrderDate);
      firstOrderMonday.setDate(firstOrderDate.getDate() - ((firstOrderDate.getDay() + 6) % 7));
      firstOrderKey = `Week of ${firstOrderMonday.toLocaleDateString("en-CA", { timeZone: shopTimeZone })}`;
    }
    
    for (let j = 0; j < orderDates.length; j++) {
      const orderDate = orderDates[j];
      let orderKey: string;
      
      if (periodType === 'daily') {
        orderKey = orderDate.toLocaleDateString("en-CA", { timeZone: shopTimeZone });
      } else if (periodType === 'monthly') {
        orderKey = orderDate.toLocaleString("default", { month: "short", year: "numeric", timeZone: shopTimeZone });
      } else {
        const orderMonday = new Date(orderDate);
        orderMonday.setDate(orderDate.getDate() - ((orderDate.getDay() + 6) % 7));
        orderKey = `Week of ${orderMonday.toLocaleDateString("en-CA", { timeZone: shopTimeZone })}`;
      }
      
      if (periodAnalytics[orderKey]) {
        if (firstOrderKey === orderKey) {
          periodAnalytics[orderKey].newCustomers++;
        } else {
          periodAnalytics[orderKey].repeatedCustomers++;
        }
        
        periodAnalytics[orderKey].totalCustomers++;
      }
    }
  }
  
  return periodAnalytics;
}

function calculateOverallCustomerData(customerOrderMap: Record<string, Date[]>): CustomerData {
  const customers = Object.values(customerOrderMap);
  const totalCustomers = customers.length;
  
  let newCustomers = 0;
  let repeatedCustomers = 0;

  customers.forEach(orderDates => {
    if (orderDates.length === 1) {
      newCustomers++;
    } else {
      repeatedCustomers++;
    }
  });

  return {
    newCustomers,
    repeatedCustomers,
    totalCustomers,
  };
}

// ==================== 9.0 LOADER FUNCTION ====================

async function generateCompleteAnalytics(shop: string, accessToken: string): Promise<AnalyticsData> {
  let cacheUsed = false;
  let apiSuccess = false;
  let fetchMode: "incremental" | "full" = "full";
  let cacheHit = false;
  let fallbackUsed = false;

  const loaderStartTime = performance.now();
  let cacheOperationTime = 0;

  try {
    const shopRes = await fetch(`https://${shop}/admin/api/${SHOPIFY_API_VERSION}/shop.json`, {     
      headers: { "X-Shopify-Access-Token": accessToken },
    });
    
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
      monthlyTotals[r.key] = { ...initStats(), newCustomers: 0, repeatedCustomers: 0, totalCustomers: 0 };
    });
    dailyKeys.forEach((d) => (dailyTotals[d] = { ...initStats(), newCustomers: 0, repeatedCustomers: 0, totalCustomers: 0 }));
    weeklyKeys.forEach((w) => (weeklyTotals[w] = { ...initStats(), newCustomers: 0, repeatedCustomers: 0, totalCustomers: 0 }));

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
        const result = await fetchOrdersSince(shop, accessToken, cacheEntry.value.lastUpdatedAt, cacheEntry.value.orders);
        const apiTime = performance.now() - apiStart;
        
        if (result.orders.length > 0) {
          apiSuccess = true;
          const orderMap = new Map();
          cacheEntry.value.orders.forEach((order: any) => orderMap.set(order.id, order));
          result.orders.forEach((order: any) => orderMap.set(order.id, order));
          
          allOrders = Array.from(orderMap.values());
          await cacheManager.set(ordersKey, { 
            orders: allOrders, 
            lastUpdatedAt: nowISO() 
          }, 30 * 60 * 1000);
        } else {
          allOrders = cacheEntry.value.orders;
          apiSuccess = true;
        }
      } else {
        fetchMode = "full";
      }

      if (fetchMode === "full") {
        allOrders = await fetchOrdersForPeriod(
          shop,
          accessToken,
          monthRanges[0].start,
          monthRanges[monthRanges.length - 1].end
        );
        apiSuccess = true;
        await cacheManager.set(ordersKey, { 
          orders: allOrders, 
          lastUpdatedAt: nowISO() 
        }, 30 * 60 * 1000);
      }

    } catch (error) {
      if (cacheEntry && cacheEntry.value.orders) {
        allOrders = cacheEntry.value.orders;
        apiSuccess = true;
        fallbackUsed = true;
      } else {
        await cacheManager.remove(ordersKey);
        throw error;
      }
    }

    const timing = {
      customerAnalysis: 0,
      orderProcessing: 0,
      calculations: 0
    };

    const customerStart = performance.now();
    const customerOrderMap = buildCustomerOrderMap(allOrders, shopTimeZone);
    const dailyCustomerAnalytics = analyzeCustomerBehavior(customerOrderMap, shopTimeZone, dailyKeys, 'daily');
    const weeklyCustomerAnalytics = analyzeCustomerBehavior(customerOrderMap, shopTimeZone, weeklyKeys, 'weekly');
    const monthlyCustomerAnalytics = analyzeCustomerBehavior(customerOrderMap, shopTimeZone, monthRanges.map(r => r.key), 'monthly');
    timing.customerAnalysis = performance.now() - customerStart;

    const orderProcessStart = performance.now();
    
    const BATCH_SIZE = 500;
    let processedCount = 0;
    
    for (let i = 0; i < allOrders.length; i += BATCH_SIZE) {
      const batch = allOrders.slice(i, i + BATCH_SIZE);
      
      batch.forEach((order: any) => {
        const date = new Date(order.created_at);
        const monthKey = date.toLocaleString("default", { month: "short", year: "numeric", timeZone: shopTimeZone });
        const dayKey = date.toLocaleDateString("en-CA", { timeZone: shopTimeZone });
        
        const monday = new Date(date);
        monday.setDate(date.getDate() - ((date.getDay() + 6) % 7));
        const weekKey = `Week of ${monday.toLocaleDateString("en-CA", { timeZone: shopTimeZone })}`;

        const orderStats = processOrderToStats(order);

        if (totals[monthKey]) {
          totals[monthKey] = mergeStats(totals[monthKey], orderStats);
        }

        if (dailyTotals[dayKey]) {
          dailyTotals[dayKey] = {
            ...mergeStats(dailyTotals[dayKey], orderStats),
            newCustomers: dailyCustomerAnalytics[dayKey]?.newCustomers || 0,
            repeatedCustomers: dailyCustomerAnalytics[dayKey]?.repeatedCustomers || 0,
            totalCustomers: dailyCustomerAnalytics[dayKey]?.totalCustomers || 0
          };
        }

        if (weeklyTotals[weekKey]) {
          weeklyTotals[weekKey] = {
            ...mergeStats(weeklyTotals[weekKey], orderStats),
            newCustomers: weeklyCustomerAnalytics[weekKey]?.newCustomers || 0,
            repeatedCustomers: weeklyCustomerAnalytics[weekKey]?.repeatedCustomers || 0,
            totalCustomers: weeklyCustomerAnalytics[weekKey]?.totalCustomers || 0
          };
        }

        if (monthlyTotals[monthKey]) {
          monthlyTotals[monthKey] = {
            ...mergeStats(monthlyTotals[monthKey], orderStats),
            newCustomers: monthlyCustomerAnalytics[monthKey]?.newCustomers || 0,
            repeatedCustomers: monthlyCustomerAnalytics[monthKey]?.repeatedCustomers || 0,
            totalCustomers: monthlyCustomerAnalytics[monthKey]?.totalCustomers || 0
          };
        }
        
        processedCount++;
      });
    }
    
    timing.orderProcessing = performance.now() - orderProcessStart;

    const calculationsStart = performance.now();
    const totalCustomerData = calculateOverallCustomerData(customerOrderMap);
    timing.calculations = performance.now() - calculationsStart;

    const totalLoaderTime = performance.now() - loaderStartTime;
    const cachePerformance = cacheManager.getPerformanceReport();

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

    return result;
    
  } catch (error: unknown) {
    const errorMsg = `Analytics generation error: ${error instanceof Error ? error.message : 'Unknown error'}`;
    
    throw new Error(errorMsg);
  }
}

// ==================== 10.0 EMAIL SERVICE INTEGRATION ====================

export class AnalyticsEmailService {
  private shop: string;
  private accessToken: string;

  constructor(shop: string, accessToken: string) {
    this.shop = shop;
    this.accessToken = accessToken;
  }

  async sendDailyAnalytics(emailOptions: {
    bccEmails?: string[];
  } = {}) {
    try {
      console.log('🔍 [EMAIL] Starting complete analytics collection...');
      
      // 1. GENERATE COMPLETE ANALYTICS (using the same logic as main code)
      const completeAnalytics = await generateCompleteAnalytics(this.shop, this.accessToken);
      
      console.log('🔍 [EMAIL] Complete analytics generated:', {
        totalOrders: completeAnalytics.totalOrders,
        timePeriods: {
          daily: completeAnalytics.dailyKeys.length,
          weekly: completeAnalytics.weeklyKeys.length, 
          monthly: completeAnalytics.monthRanges.length
        }
      });

      // 2. VALIDATE SENDGRID CONFIGURATION
      if (!process.env.SENDGRID_API_KEY) {
        throw new Error('Email service not configured');
      }

      if (!process.env.SENDGRID_FROM_EMAIL) {
        throw new Error('Sender email not configured');
      }

      // 3. GET STORE EMAIL SETTINGS
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

      // 4. PROCESS EMAIL RECIPIENTS
      const allEmails = [
        settings.fromEmail,
        ...(settings.additionalEmails || [])
      ].filter(email => email && email.trim() && this.isValidEmail(email));

      if (allEmails.length === 0) {
        throw new Error('No valid recipient email addresses configured');
      }

      // 5. BUILD COMPREHENSIVE EMAIL CONTENT
      const emailContent = this.buildComprehensiveAnalyticsEmail(completeAnalytics, this.shop);
      
      // 6. SEND EMAIL
      const bccRecipients = emailOptions.bccEmails && emailOptions.bccEmails.length > 0 
        ? emailOptions.bccEmails.filter(email => email && email.trim())
        : allEmails;

      const msg: any = {
        to: process.env.SENDGRID_FROM_EMAIL,
        from: process.env.SENDGRID_FROM_EMAIL,
        subject: `Daily Analytics Report - ${this.shop} - ${new Date().toLocaleDateString()}`,
        html: emailContent,
        text: this.generateComprehensiveTextVersion(completeAnalytics, this.shop),
      };

      if (bccRecipients.length > 0) {
        msg.bcc = bccRecipients;
      }

      const result = await sgMail.send(msg);
      
      return {
        success: true,
        message: `Complete analytics email sent to ${bccRecipients.length} recipient(s)`,
        recipients: bccRecipients,
        recipientsCount: bccRecipients.length,
        result,
        analyticsSummary: {
          totalOrders: completeAnalytics.totalOrders,
          timePeriods: '7 days, 8 weeks, 6 months',
          calculations: 'Complete financial processing with refunds/exchanges'
        }
      };

    } catch (error: any) {
      console.error('🔍 [EMAIL ERROR] Complete analytics failed:', error);
      throw new Error(`Failed to send complete analytics email: ${error.message}`);
    }
  }

  private buildComprehensiveAnalyticsEmail(analytics: AnalyticsData, shop: string): string {
    // This will use the same email template structure but with COMPLETE calculated data
    // We'll implement this in the next section
    return this.buildAnalyticsEmailFromCompleteData(analytics, shop);
  }

  private generateComprehensiveTextVersion(analytics: AnalyticsData, shop: string): string {
    // This will generate text version using COMPLETE analytics data
    // We'll implement this in the next section
    return this.generateTextVersionFromCompleteData(analytics, shop);
  }

  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  // These methods will be implemented in the next sections
  private buildAnalyticsEmailFromCompleteData(analytics: AnalyticsData, shop: string): string {
    // TO BE IMPLEMENTED - will convert complete analytics to email HTML
    return '';
  }

  private generateTextVersionFromCompleteData(analytics: AnalyticsData, shop: string): string {
    // TO BE IMPLEMENTED - will convert complete analytics to text
    return '';
  }
}

// ==================== 11.0 EMAIL TEMPLATE BUILDER ====================

private buildAnalyticsEmailFromCompleteData(analytics: AnalyticsData, shop: string): string {
  const formatCurrency = (amount: number) => {
    return amount.toLocaleString('en-US', { 
      style: 'currency', 
      currency: analytics.shopCurrency || 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2 
    });
  };
  
  const formatNumber = (num: number) => num.toLocaleString();
  const formatPercent = (num: number) => `${num.toFixed(1)}%`;

  // Get today's data
  const todayKey = new Date().toLocaleDateString("en-CA", { timeZone: analytics.shopTimeZone });
  const todayData = analytics.dailyTotals[todayKey] || this.getEmptyOrderStats();

  // Get last 7 days totals
  const last7DaysData = this.calculateLast7DaysData(analytics);
  
  // Get customer data
  const customerData = analytics.totalCustomerData;

  return `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Analytics Dashboard - ${shop}</title>
    <style>
        /* INCLUDE THE COMPLETE CSS FROM YOUR SECOND CODE HERE */
        ${this.getEmailCSS()}
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
                            <div class="metric-value">${formatNumber(todayData.orderCount)}</div>
                            <div class="metric-label">Today's Orders</div>
                        </div>
                        
                        <div class="metric-card revenue">
                            <div class="metric-value">${formatCurrency(todayData.totalSales)}</div>
                            <div class="metric-label">Today's Total Sales</div>
                        </div>
                        
                        <div class="metric-card items">
                            <div class="metric-value">${formatNumber(todayData.items)}</div>
                            <div class="metric-label">Items Ordered</div>
                        </div>
                    </div>

                    <!-- Fulfillment Metrics -->
                    <div class="fulfillment-metrics-grid">
                        <div class="fulfillment-metric-card today-fulfilled">
                            <div class="fulfillment-metric-value">${formatNumber(todayData.fulfilled)}</div>
                            <div class="fulfillment-metric-label">FULFILLED TODAY</div>
                            <div class="fulfillment-metric-period">Today</div>
                        </div>
                        
                        <div class="fulfillment-metric-card today-unfulfilled">
                            <div class="fulfillment-metric-value">${formatNumber(todayData.unfulfilled)}</div>
                            <div class="fulfillment-metric-label">UNFULFILLED TODAY</div>
                            <div class="fulfillment-metric-period">Today</div>
                        </div>
                        
                        <div class="fulfillment-metric-card week-fulfilled">
                            <div class="fulfillment-metric-value">${formatNumber(last7DaysData.totalFulfilled)}</div>
                            <div class="fulfillment-metric-label">FULFILLED</div>
                            <div class="fulfillment-metric-period">Last 7 Days</div>
                        </div>
                        
                        <div class="fulfillment-metric-card week-unfulfilled">
                            <div class="fulfillment-metric-value">${formatNumber(last7DaysData.totalUnfulfilled)}</div>
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
                            <div class="summary-value">${formatNumber(last7DaysData.totalOrders)}</div>
                            <div class="summary-label">Total Orders</div>
                        </div>
                        
                        <div class="summary-card">
                            <div class="summary-value">${formatCurrency(last7DaysData.totalRevenue)}</div>
                            <div class="summary-label">Total Sales</div>
                        </div>
                        
                        <div class="summary-card">
                            <div class="summary-value">${formatNumber(last7DaysData.totalItems)}</div>
                            <div class="summary-label">Total Items</div>
                        </div>
                        
                        <div class="summary-card">
                            <div class="summary-value">${formatCurrency(last7DaysData.avgDailyRevenue)}</div>
                            <div class="summary-label">Avg Daily Sales</div>
                        </div>
                    </div>

                    <!-- Daily Breakdown -->
                    <div class="daily-breakdown">
                        <h4>Daily Breakdown</h4>
                        <div class="daily-cards-container">
                            ${analytics.dailyKeys.map((dayKey) => {
                                const dayData = analytics.dailyTotals[dayKey] || this.getEmptyOrderStats();
                                const isToday = dayKey === todayKey;
                                const dayName = this.getDayName(dayKey);
                                const formattedDate = this.formatDateDisplay(dayKey);
                                
                                return `
                                <div class="daily-card ${isToday ? 'current-day' : ''}">
                                    <div class="daily-card-header">
                                        <div class="daily-date">${formattedDate}</div>
                                        <div class="daily-day">${dayName}</div>
                                    </div>
                                    
                                    <div class="daily-metrics">
                                        <div class="daily-metric">
                                            <span class="daily-metric-label">ORDERS</span>
                                            <span class="daily-metric-value">${formatNumber(dayData.orderCount)}</span>
                                        </div>
                                        
                                        <div class="daily-metric">
                                            <span class="daily-metric-label">TOTAL SALES</span>
                                            <span class="daily-metric-value">${formatCurrency(dayData.totalSales)}</span>
                                        </div>
                                        
                                        <div class="daily-metric">
                                            <span class="daily-metric-label">ITEMS</span>
                                            <span class="daily-metric-value">${formatNumber(dayData.items)}</span>
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
                            <div class="customer-metric-value">${formatNumber(customerData.totalCustomers)}</div>
                            <div class="customer-metric-label">TOTAL CUSTOMERS</div>
                        </div>
                        
                        <div class="customer-metric-card new-customers">
                            <div class="customer-metric-value">${formatNumber(customerData.newCustomers)}</div>
                            <div class="customer-metric-label">NEW CUSTOMERS</div>
                        </div>
                        
                        <div class="customer-metric-card repeat-customers">
                            <div class="customer-metric-value">${formatNumber(customerData.repeatedCustomers)}</div>
                            <div class="customer-metric-label">REPEAT CUSTOMERS</div>
                        </div>
                        
                        <div class="customer-metric-card loyalty-rate">
                            <div class="customer-metric-value">${customerData.totalCustomers > 0 ? formatPercent((customerData.repeatedCustomers / customerData.totalCustomers) * 100) : '0.0%'}</div>
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
                            <div class="financial-metric-value">${formatCurrency(this.calculateTotalRevenue(analytics))}</div>
                            <div class="financial-metric-label">Total Revenue</div>
                            <div class="financial-metric-period">All Time</div>
                        </div>
                        
                        <div class="financial-metric-card aov">
                            <div class="financial-metric-value">${formatCurrency(this.calculateAverageOrderValue(analytics))}</div>
                            <div class="financial-metric-label">Avg Order Value</div>
                            <div class="financial-metric-period">All Orders</div>
                        </div>
                        
                        <div class="financial-metric-card fulfillment">
                            <div class="financial-metric-value">${formatPercent(this.calculateFulfillmentRate(analytics))}</div>
                            <div class="financial-metric-label">Fulfillment Rate</div>
                            <div class="financial-metric-period">Last 7 Days</div>
                        </div>
                        
                        <div class="financial-metric-card items-per-order">
                            <div class="financial-metric-value">${this.calculateAverageItemsPerOrder(analytics).toFixed(1)}</div>
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
                            <div class="summary-value">${formatNumber(analytics.totalOrders)}</div>
                            <div class="summary-label">All-Time Orders</div>
                        </div>
                        
                        <div class="summary-card">
                            <div class="summary-value">${formatCurrency(this.calculateTotalRevenue(analytics))}</div>
                            <div class="summary-label">All-Time Revenue</div>
                        </div>
                        
                        <div class="summary-card">
                            <div class="summary-value">${formatCurrency(this.calculateAverageOrderValue(analytics))}</div>
                            <div class="summary-label">Avg Order Value</div>
                        </div>
                        
                        <div class="summary-card">
                            <div class="summary-value">${formatNumber(analytics.totalOrders)}</div>
                            <div class="summary-label">Orders Analyzed</div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Event Summary -->
            ${this.renderEventSummarySection(analytics, formatCurrency, formatNumber)}
        </div>

        <!-- Footer -->
        <div class="footer">
            <p class="footer-text">
                <strong>Orders Analyzed:</strong> ${formatNumber(analytics.totalOrders)} orders • 
                <strong>Net Revenue:</strong> ${formatCurrency(this.calculateNetRevenue(analytics))} • 
                <strong>Data Updated:</strong> ${new Date(analytics.lastUpdated).toLocaleDateString()}
            </p>
            <p class="footer-text">Analytics Dashboard - Nexus Powering Your Business Insights</p>
        </div>
    </div>
</body>
</html>
    `;
}

private generateTextVersionFromCompleteData(analytics: AnalyticsData, shop: string): string {
  const formatCurrency = (amount: number) => `$${amount.toFixed(2)}`;
  const formatPercent = (num: number) => `${num.toFixed(1)}%`;

  const todayKey = new Date().toLocaleDateString("en-CA", { timeZone: analytics.shopTimeZone });
  const todayData = analytics.dailyTotals[todayKey] || this.getEmptyOrderStats();
  const last7DaysData = this.calculateLast7DaysData(analytics);
  const customerData = analytics.totalCustomerData;

  const dailyBreakdown = analytics.dailyKeys.map(dayKey => {
    const dayData = analytics.dailyTotals[dayKey] || this.getEmptyOrderStats();
    const date = new Date(dayKey + 'T00:00:00');
    return `- ${date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}: ${formatCurrency(dayData.totalSales)} (${dayData.orderCount} orders)`;
  }).join('\n');

  return `
ANALYTICS REPORT - ${shop}
${new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}

TODAY'S PERFORMANCE:
- Orders: ${todayData.orderCount}
- Revenue: ${formatCurrency(todayData.totalSales)}
- Items Sold: ${todayData.items}
- Fulfilled Today: ${todayData.fulfilled}
- Unfulfilled Today: ${todayData.unfulfilled}

CUSTOMER INSIGHTS:
- Total Customers: ${customerData.totalCustomers}
- New Customers: ${customerData.newCustomers}
- Repeat Customers: ${customerData.repeatedCustomers}
- Repeat Rate: ${customerData.totalCustomers > 0 ? formatPercent((customerData.repeatedCustomers / customerData.totalCustomers) * 100) : '0.0%'}

FULFILLMENT:
- Last 7 Days Fulfilled: ${last7DaysData.totalFulfilled}
- Last 7 Days Unfulfilled: ${last7DaysData.totalUnfulfilled}
- Fulfillment Rate: ${formatPercent(this.calculateFulfillmentRate(analytics))}

LAST 7 DAYS:
${dailyBreakdown}

FINANCIAL OVERVIEW:
- Total Revenue: ${formatCurrency(this.calculateTotalRevenue(analytics))}
- Net Revenue: ${formatCurrency(this.calculateNetRevenue(analytics))}
- Average Order Value: ${formatCurrency(this.calculateAverageOrderValue(analytics))}
- Average Items Per Order: ${this.calculateAverageItemsPerOrder(analytics).toFixed(1)}

BUSINESS OVERVIEW:
- All-Time Orders: ${analytics.totalOrders}
- Orders Analyzed: ${analytics.totalOrders}
- Total Items Sold: ${this.calculateTotalItems(analytics)}

Data analyzed from ${analytics.totalOrders} orders.
Generated on ${new Date().toLocaleString()}
    `;
}

// ==================== 12.0 HELPER METHODS FOR EMAIL ====================

private getEmptyOrderStats(): OrderStats & CustomerData {
  return {
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
    financialStatus: 'pending',
    newCustomers: 0,
    repeatedCustomers: 0,
    totalCustomers: 0
  };
}

private calculateLast7DaysData(analytics: AnalyticsData): {
  totalOrders: number;
  totalRevenue: number;
  totalItems: number;
  totalFulfilled: number;
  totalUnfulfilled: number;
  avgDailyRevenue: number;
} {
  let totalOrders = 0;
  let totalRevenue = 0;
  let totalItems = 0;
  let totalFulfilled = 0;
  let totalUnfulfilled = 0;

  analytics.dailyKeys.forEach(dayKey => {
    const dayData = analytics.dailyTotals[dayKey];
    if (dayData) {
      totalOrders += dayData.orderCount;
      totalRevenue += dayData.totalSales;
      totalItems += dayData.items;
      totalFulfilled += dayData.fulfilled;
      totalUnfulfilled += dayData.unfulfilled;
    }
  });

  return {
    totalOrders,
    totalRevenue,
    totalItems,
    totalFulfilled,
    totalUnfulfilled,
    avgDailyRevenue: totalRevenue / Math.max(analytics.dailyKeys.length, 1)
  };
}

private calculateTotalRevenue(analytics: AnalyticsData): number {
  let total = 0;
  Object.values(analytics.totals).forEach(monthData => {
    total += monthData.totalSales;
  });
  return total;
}

private calculateNetRevenue(analytics: AnalyticsData): number {
  let total = 0;
  Object.values(analytics.totals).forEach(monthData => {
    total += monthData.netSales;
  });
  return total;
}

private calculateAverageOrderValue(analytics: AnalyticsData): number {
  const totalRevenue = this.calculateTotalRevenue(analytics);
  return analytics.totalOrders > 0 ? totalRevenue / analytics.totalOrders : 0;
}

private calculateFulfillmentRate(analytics: AnalyticsData): number {
  const last7DaysData = this.calculateLast7DaysData(analytics);
  const totalFulfillment = last7DaysData.totalFulfilled + last7DaysData.totalUnfulfilled;
  return totalFulfillment > 0 ? (last7DaysData.totalFulfilled / totalFulfillment) * 100 : 0;
}

private calculateAverageItemsPerOrder(analytics: AnalyticsData): number {
  let totalItems = 0;
  let totalOrders = 0;
  
  Object.values(analytics.totals).forEach(monthData => {
    totalItems += monthData.items;
    totalOrders += monthData.orderCount;
  });
  
  return totalOrders > 0 ? totalItems / totalOrders : 0;
}

private calculateTotalItems(analytics: AnalyticsData): number {
  let totalItems = 0;
  Object.values(analytics.totals).forEach(monthData => {
    totalItems += monthData.items;
  });
  return totalItems;
}

private getDayName(dateStr: string): string {
  try {
    const date = new Date(dateStr + 'T00:00:00');
    return date.toLocaleDateString('en-US', { weekday: 'short' });
  } catch {
    return 'N/A';
  }
}

private formatDateDisplay(dateStr: string): string {
  try {
    const date = new Date(dateStr + 'T00:00:00');
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric'
    });
  } catch {
    return 'Invalid Date';
  }
}

private renderEventSummarySection(analytics: AnalyticsData, formatCurrency: (amount: number) => string, formatNumber: (num: number) => string): string {
  // Calculate total events across all time periods
  let totalRefunds = 0;
  let totalExchanges = 0;
  let totalPartialRefunds = 0;
  let totalEvents = 0;
  let netEventValue = 0;
  let ordersWithEvents = 0;

  Object.values(analytics.totals).forEach(monthData => {
    if (monthData.eventSummary) {
      totalRefunds += monthData.eventSummary.refunds.count;
      totalExchanges += monthData.eventSummary.exchanges.count;
      totalPartialRefunds += monthData.eventSummary.partialRefunds.count;
      totalEvents += monthData.eventSummary.totalEvents;
      netEventValue += monthData.eventSummary.netValue;
    }
    if (monthData.hasSubsequentEvents) {
      ordersWithEvents += monthData.orderCount;
    }
  });

  if (totalEvents === 0) return '';

  return `
            <div class="section">
                <div class="section-header">
                    <h2>Order Events & Adjustments</h2>
                </div>
                <div class="section-body">
                    <div class="event-summary-grid">
                        ${totalRefunds > 0 ? `
                        <div class="event-card refunds">
                            <div class="event-label">Full Refunds</div>
                            <div class="event-value">${formatCurrency(totalRefunds)}</div>
                            <div class="event-count">${formatNumber(totalRefunds)} refund${totalRefunds !== 1 ? 's' : ''}</div>
                        </div>
                        ` : ''}
                        
                        ${totalPartialRefunds > 0 ? `
                        <div class="event-card partial-refunds">
                            <div class="event-label">Partial Refunds</div>
                            <div class="event-value">${formatCurrency(totalPartialRefunds)}</div>
                            <div class="event-count">${formatNumber(totalPartialRefunds)} refund${totalPartialRefunds !== 1 ? 's' : ''}</div>
                        </div>
                        ` : ''}
                        
                        ${totalExchanges > 0 ? `
                        <div class="event-card exchanges">
                            <div class="event-label">Exchanges</div>
                            <div class="event-value">${formatCurrency(totalExchanges)}</div>
                            <div class="event-count">${formatNumber(totalExchanges)} exchange${totalExchanges !== 1 ? 's' : ''}</div>
                        </div>
                        ` : ''}
                        
                        <div class="event-card net-summary">
                            <div class="event-label">Net Impact</div>
                            <div class="event-value">${formatCurrency(netEventValue)}</div>
                            <div class="event-count">across ${formatNumber(totalEvents)} event${totalEvents !== 1 ? 's' : ''} in ${formatNumber(ordersWithEvents)} orders</div>
                        </div>
                    </div>
                </div>
            </div>
  `;
}

private getEmailCSS(): string {
  // Return the EXACT same CSS from your second code
  return `
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
        
        /* Event Summary */
        .event-summary-grid {
            display: table;
            width: 100%;
            border-collapse: collapse;
        }
        
        .event-card {
            display: table-cell;
            text-align: center;
            padding: 20px 15px;
            border-right: 1px solid #f1f5f9;
        }
        
        .event-card:last-child {
            border-right: none;
        }
        
        .event-label {
            font-size: 12px;
            color: #64748b;
            font-weight: 600;
            margin-bottom: 8px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }
        
        .event-value {
            font-size: 20px;
            font-weight: 700;
            color: #1e293b;
            margin-bottom: 4px;
        }
        
        .event-count {
            font-size: 11px;
            color: #94a3b8;
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
            .summary-card,
            .daily-card,
            .event-card {
                display: block;
                border-right: none;
                border-bottom: 1px solid #f1f5f9;
                padding: 20px 15px;
            }
            
            .daily-card:last-child {
                border-bottom: none;
            }
        }
    `;
}