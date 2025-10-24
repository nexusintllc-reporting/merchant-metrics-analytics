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

//   async sendDailyAnalytics(
//     analyticsData: OrderData, 
//     emailOptions?: {
//       bccEmails?: string[];
//       toEmail?: string;
//       fromName?: string;
//       fromEmail?: string;
//     }
//   ) {
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

//       // Use provided email options or fall back to settings
//       const allEmails = [
//         emailOptions?.toEmail || settings.fromEmail,
//         ...(emailOptions?.bccEmails || settings.additionalEmails || [])
//       ].filter(email => email && email.trim() && this.isValidEmail(email));

//       if (allEmails.length === 0) {
//         throw new Error('No valid recipient email addresses configured');
//       }

//       // Build email with analytics data
//       const emailContent = this.buildAnalyticsEmail(analyticsData, this.shop);
      
//       const msg = {
//         to: allEmails,
//         from: {
//           email: process.env.SENDGRID_FROM_EMAIL,
//           name: emailOptions?.fromName || 'Analytics Dashboard'
//         },
//         subject: `Daily Analytics Report - ${this.shop} - ${new Date().toLocaleDateString()}`,
//         html: emailContent,
//         text: this.generateTextVersion(analyticsData, this.shop),
//       };

//       const result = await sgMail.send(msg);
      
//       return {
//         success: true,
//         message: `Email sent successfully to ${allEmails.length} recipient(s)`,
//         recipients: allEmails,
//         recipientsCount: allEmails.length, // Add this property
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
//     const formatCurrency = (amount: number) => `$${amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
//     const formatNumber = (num: number) => num.toLocaleString();
//     const formatPercent = (num: number) => `${num.toFixed(1)}%`;

//     const getTrendIcon = (value: number) => value >= 0 ? '↑' : '↓';
//     const getTrendClass = (value: number) => value >= 0 ? 'change-positive' : 'change-negative';

//     // Calculate 7-day totals
//     const last7DaysOrders = data.dailySales.reduce((sum, day) => sum + day.orders, 0);
//     const last7DaysRevenue = data.dailySales.reduce((sum, day) => sum + day.revenue, 0);
//     const last7DaysItems = data.dailySales.reduce((sum, day) => sum + day.items, 0);

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
//         .financial-grid {
//             display: grid;
//             grid-template-columns: 1fr 1fr;
//             gap: 15px;
//         }
//         .financial-card {
//             padding: 15px;
//             background: #f8f9fa;
//             border-radius: 6px;
//             border: 1px solid #e9ecef;
//         }
//         .financial-value {
//             font-size: 18px;
//             font-weight: bold;
//             color: #2c3e50;
//             margin: 0 0 5px 0;
//         }
//         .financial-label {
//             font-size: 12px;
//             color: #495057;
//             margin: 0 0 3px 0;
//             font-weight: 600;
//         }
//         .financial-rate {
//             font-size: 11px;
//             color: #6c757d;
//             margin: 0;
//         }
//         .net-revenue-card {
//             grid-column: 1 / -1;
//             background: #e7f3ff !important;
//             border-color: #007bff !important;
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
//                                 <div class="metric-change ${getTrendClass(data.ordersChangeVsYesterday)}">
//                                     ${getTrendIcon(data.ordersChangeVsYesterday)} ${Math.abs(data.ordersChangeVsYesterday).toFixed(1)}% vs yesterday
//                                 </div>
//                                 ` : ''}
//                             </div>
//                             <div class="metric-item">
//                                 <div class="metric-value">${formatCurrency(data.todayRevenue)}</div>
//                                 <div class="metric-label">Revenue</div>
//                                 ${data.revenueChangeVsYesterday !== 0 ? `
//                                 <div class="metric-change ${getTrendClass(data.revenueChangeVsYesterday)}">
//                                     ${getTrendIcon(data.revenueChangeVsYesterday)} ${Math.abs(data.revenueChangeVsYesterday).toFixed(1)}% vs yesterday
//                                 </div>
//                                 ` : ''}
//                             </div>
//                             <div class="metric-item">
//                                 <div class="metric-value">${formatNumber(data.todayItems)}</div>
//                                 <div class="metric-label">Items Sold</div>
//                                 ${data.itemsChangeVsYesterday !== 0 ? `
//                                 <div class="metric-change ${getTrendClass(data.itemsChangeVsYesterday)}">
//                                     ${getTrendIcon(data.itemsChangeVsYesterday)} ${Math.abs(data.itemsChangeVsYesterday).toFixed(1)}% vs yesterday
//                                 </div>
//                                 ` : ''}
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//             </div>
            

//             <!-- Financial Breakdown -->
//             <div class="section">
//                 <div class="section-header">
//                     <h2>Financial Breakdown</h2>
//                 </div>
//                 <div class="section-body">
//                     <div class="financial-grid">
//                         <div class="financial-card">
//                             <div class="financial-value">${formatCurrency(data.totalDiscounts)}</div>
//                             <div class="financial-label">Total Discounts</div>
//                             <div class="financial-rate">${formatPercent(data.discountRate)} of revenue</div>
//                         </div>
//                         <div class="financial-card">
//                             <div class="financial-value">${formatCurrency(data.totalShipping)}</div>
//                             <div class="financial-label">Shipping Charges</div>
//                             <div class="financial-rate">${formatPercent(data.shippingRate)} of revenue</div>
//                         </div>
//                         <div class="financial-card">
//                             <div class="financial-value">${formatCurrency(data.totalTaxes)}</div>
//                             <div class="financial-label">Taxes Collected</div>
//                             <div class="financial-rate">${formatPercent(data.taxRate)} of revenue</div>
//                         </div>
//                         <div class="financial-card">
//                             <div class="financial-value">${formatCurrency(data.totalReturns)}</div>
//                             <div class="financial-label">Returns & Refunds</div>
//                             <div class="financial-rate">${formatPercent(data.returnRate)} of revenue</div>
//                         </div>
//                         <div class="financial-card net-revenue-card">
//                             <div class="financial-value">${formatCurrency(data.netRevenue)}</div>
//                             <div class="financial-label">Net Revenue</div>
//                             <div class="financial-rate">After returns and discounts</div>
//                         </div>
//                     </div>
//                 </div>
//             </div>

//                         <!-- Customer Insights -->
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

//             <!-- 7-Day Customer Insights -->
//             <div class="section">
//                 <div class="section-header">
//                     <h2>Last 7 Days Customer Insights</h2>
//                 </div>
//                 <div class="section-body">
//                     <div class="metrics-grid">
//                         <div class="metric-row">
//                             <div class="metric-item">
//                                 <div class="metric-value">${formatNumber(data.last7DaysTotalCustomers)}</div>
//                                 <div class="metric-label">Total Customers</div>
//                             </div>
//                             <div class="metric-item">
//                                 <div class="metric-value">${formatNumber(data.last7DaysNewCustomers)}</div>
//                                 <div class="metric-label">New Customers</div>
//                             </div>
//                             <div class="metric-item">
//                                 <div class="metric-value">${formatNumber(data.last7DaysRepeatCustomers)}</div>
//                                 <div class="metric-label">Repeat Customers</div>
//                             </div>
//                             <div class="metric-item">
//                                 <div class="metric-value">${data.last7DaysRepeatCustomerRate.toFixed(1)}%</div>
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
//                                 <div class="metric-value">${formatNumber(data.last7DaysFulfilled)}</div>
//                                 <div class="metric-label">7-Day Fulfilled</div>
//                             </div>
//                             <div class="metric-item">
//                                 <div class="metric-value">${formatNumber(data.last7DaysUnfulfilled)}</div>
//                                 <div class="metric-label">7-Day Unfulfilled</div>
//                             </div>
//                         </div>
//                         <div class="metric-row">
//                             <div class="metric-item">
//                                 <div class="metric-value">${data.fulfillmentRate.toFixed(1)}%</div>
//                                 <div class="metric-label">Overall Fulfillment Rate</div>
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
//                             const isToday = day.date === data.currentDateInShopTZ;
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
//                             <div class="summary-value">${formatNumber(last7DaysOrders)}</div>
//                             <div class="summary-label">Total Orders</div>
//                         </div>
//                         <div class="summary-card">
//                             <div class="summary-value">${formatCurrency(last7DaysRevenue)}</div>
//                             <div class="summary-label">Total Revenue</div>
//                         </div>
//                         <div class="summary-card">
//                             <div class="summary-value">${formatNumber(last7DaysItems)}</div>
//                             <div class="summary-label">Total Items</div>
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
//                             <div class="summary-label">Gross Revenue</div>
//                         </div>
//                         <div class="summary-card">
//                             <div class="summary-value">${formatCurrency(data.netRevenue)}</div>
//                             <div class="summary-label">Net Revenue</div>
//                         </div>
//                         <div class="summary-card">
//                             <div class="summary-value">${formatCurrency(data.averageOrderValue)}</div>
//                             <div class="summary-label">Avg Order Value</div>
//                         </div>
//                     </div>
//                 </div>
//             </div>

//             <!-- Performance Insight -->
//             ${data.revenueChangeVsYesterday !== 0 || data.revenueChangeVsLastWeek !== 0 ? `
//             <div class="highlight">
//                 <strong>Performance Insight:</strong><br>
//                 ${data.revenueChangeVsYesterday > 0 ? `📈 Revenue is up ${Math.abs(data.revenueChangeVsYesterday).toFixed(1)}% from yesterday. ` : ''}
//                 ${data.revenueChangeVsYesterday < 0 ? `📉 Revenue is down ${Math.abs(data.revenueChangeVsYesterday).toFixed(1)}% from yesterday. ` : ''}
//                 ${data.revenueChangeVsLastWeek > 0 ? `🚀 Week-over-week revenue increased ${Math.abs(data.revenueChangeVsLastWeek).toFixed(1)}%.` : ''}
//                 ${data.revenueChangeVsLastWeek < 0 ? `⚠️ Week-over-week revenue decreased ${Math.abs(data.revenueChangeVsLastWeek).toFixed(1)}%.` : ''}
//                 ${data.bestDay && data.bestDay.revenue > data.todayRevenue ? ` Your best day was ${new Date(data.bestDay.date).toLocaleDateString()} with ${formatCurrency(data.bestDay.revenue)} in revenue.` : ''}
//             </div>
//             ` : ''}
//         </div>

//         <!-- Footer -->
//         <div class="footer">
//             <p class="footer-text">
//                 This automated report was generated on ${new Date().toLocaleString()}<br>
//                 Data analyzed from ${formatNumber(data.ordersLoaded)} orders • Shop Timezone: ${data.shopTimezone}
//             </p>
//         </div>
//     </div>
// </body>
// </html>
//     `;
//   }

//     private generateTextVersion(data: OrderData, shop: string): string {
//     const formatCurrency = (amount: number) => `$${amount.toFixed(2)}`;
//     const formatPercent = (num: number) => `${num.toFixed(1)}%`;

//     return `
// ANALYTICS REPORT - ${shop}
// ${new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}

// TODAY'S PERFORMANCE:
// - Orders: ${data.todayOrders} (${data.ordersChangeVsYesterday >= 0 ? '+' : ''}${data.ordersChangeVsYesterday.toFixed(1)}% vs yesterday)
// - Revenue: ${formatCurrency(data.todayRevenue)} (${data.revenueChangeVsYesterday >= 0 ? '+' : ''}${data.revenueChangeVsYesterday.toFixed(1)}% vs yesterday)
// - Items Sold: ${data.todayItems} (${data.itemsChangeVsYesterday >= 0 ? '+' : ''}${data.itemsChangeVsYesterday.toFixed(1)}% vs yesterday)

// FINANCIAL BREAKDOWN:
// - Gross Revenue: ${formatCurrency(data.totalRevenue)}
// - Total Discounts: ${formatCurrency(data.totalDiscounts)} (${formatPercent(data.discountRate)})
// - Shipping Charges: ${formatCurrency(data.totalShipping)} (${formatPercent(data.shippingRate)})
// - Taxes Collected: ${formatCurrency(data.totalTaxes)} (${formatPercent(data.taxRate)})
// - Returns & Refunds: ${formatCurrency(data.totalReturns)} (${formatPercent(data.returnRate)})
// - NET REVENUE: ${formatCurrency(data.netRevenue)}

// CUSTOMER INSIGHTS:
// - Total Customers: ${data.totalCustomers}
// - New Customers: ${data.newCustomers}
// - Repeat Customers: ${data.repeatCustomers}
// - Repeat Rate: ${data.repeatCustomerRate.toFixed(1)}%

// 7-DAY CUSTOMER INSIGHTS:
// - Total Customers: ${data.last7DaysTotalCustomers}
// - New Customers: ${data.last7DaysNewCustomers}
// - Repeat Customers: ${data.last7DaysRepeatCustomers}
// - Repeat Rate: ${data.last7DaysRepeatCustomerRate.toFixed(1)}%

// FULFILLMENT STATUS:
// - Fulfilled Today: ${data.todayFulfilled}
// - Unfulfilled Today: ${data.todayUnfulfilled}
// - 7-Day Fulfilled: ${data.last7DaysFulfilled}
// - 7-Day Unfulfilled: ${data.last7DaysUnfulfilled}
// - Overall Fulfillment Rate: ${data.fulfillmentRate.toFixed(1)}%

// LAST 7 DAYS PERFORMANCE:
// ${data.dailySales.map(day => {
//   const date = new Date(day.date);
//   const isToday = day.date === data.currentDateInShopTZ;
//   return `- ${date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}${isToday ? ' (Today)' : ''}: ${formatCurrency(day.revenue)} | ${day.orders} orders | ${day.items} items`;
// }).join('\n')}

// 7-DAY TOTALS:
// - Total Orders: ${data.dailySales.reduce((sum, day) => sum + day.orders, 0)}
// - Total Revenue: ${formatCurrency(data.dailySales.reduce((sum, day) => sum + day.revenue, 0))}
// - Total Items: ${data.dailySales.reduce((sum, day) => sum + day.items, 0)}
// - Avg Daily Revenue: ${formatCurrency(data.averageDailyRevenue)}

// BUSINESS OVERVIEW:
// - All-Time Orders: ${data.totalOrders}
// - Gross Revenue: ${formatCurrency(data.totalRevenue)}
// - Net Revenue: ${formatCurrency(data.netRevenue)}
// - Average Order Value: ${formatCurrency(data.averageOrderValue)}

// PERFORMANCE INSIGHTS:
// ${data.revenueChangeVsYesterday > 0 ? `📈 Revenue increased ${Math.abs(data.revenueChangeVsYesterday).toFixed(1)}% from yesterday` : data.revenueChangeVsYesterday < 0 ? `📉 Revenue decreased ${Math.abs(data.revenueChangeVsYesterday).toFixed(1)}% from yesterday` : 'Revenue unchanged from yesterday'}
// ${data.revenueChangeVsLastWeek > 0 ? `🚀 Week-over-week revenue increased ${Math.abs(data.revenueChangeVsLastWeek).toFixed(1)}%` : data.revenueChangeVsLastWeek < 0 ? `⚠️ Week-over-week revenue decreased ${Math.abs(data.revenueChangeVsLastWeek).toFixed(1)}%` : ''}

// Data analyzed from ${data.ordersLoaded} orders
// Shop Timezone: ${data.shopTimezone}
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

  async sendDailyAnalytics(
    analyticsData: OrderData, 
    emailOptions?: {
      bccEmails?: string[];
      toEmail?: string;
      fromName?: string;
      fromEmail?: string;
    }
  ) {
    try {
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

      // Use provided email options or fall back to settings
      const allEmails = [
        emailOptions?.toEmail || settings.fromEmail,
        ...(emailOptions?.bccEmails || settings.additionalEmails || [])
      ].filter(email => email && email.trim() && this.isValidEmail(email));

      if (allEmails.length === 0) {
        throw new Error('No valid recipient email addresses configured');
      }

      // Build email with analytics data
      const emailContent = this.buildAnalyticsEmail(analyticsData, this.shop);
      
      const msg = {
        to: allEmails,
        from: {
          email: process.env.SENDGRID_FROM_EMAIL,
          name: emailOptions?.fromName || 'Analytics Dashboard'
        },
        subject: `Daily Analytics Report - ${this.shop} - ${new Date().toLocaleDateString()}`,
        html: emailContent,
        text: this.generateTextVersion(analyticsData, this.shop),
      };

      const result = await sgMail.send(msg);
      
      return {
        success: true,
        message: `Email sent successfully to ${allEmails.length} recipient(s)`,
        recipients: allEmails,
        recipientsCount: allEmails.length,
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
    const formatCurrency = (amount: number) => `$${amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    const formatNumber = (num: number) => num.toLocaleString();
    const formatPercent = (num: number) => `${num.toFixed(1)}%`;

    const getTrendIcon = (value: number) => value >= 0 ? '↑' : '↓';
    const getTrendClass = (value: number) => value >= 0 ? 'change-positive' : 'change-negative';

    // Calculate 7-day totals
    const last7DaysOrders = data.dailySales.reduce((sum, day) => sum + day.orders, 0);
    const last7DaysRevenue = data.dailySales.reduce((sum, day) => sum + day.revenue, 0);
    const last7DaysItems = data.dailySales.reduce((sum, day) => sum + day.items, 0);

    return `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Analytics Report - ${shop}</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333333;
            margin: 0;
            padding: 0;
            background-color: #f8f9fa;
        }
        .container {
            max-width: 600px;
            margin: 0 auto;
            background: #ffffff;
            border-radius: 8px;
            overflow: hidden;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }
        .header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 30px 20px;
            text-align: center;
        }
        .header h1 {
            margin: 0;
            font-size: 28px;
            font-weight: bold;
        }
        .header .subtitle {
            margin: 8px 0 0 0;
            font-size: 16px;
            opacity: 0.9;
        }
        .content {
            padding: 30px;
        }
        .section {
            margin-bottom: 30px;
            border: 1px solid #e9ecef;
            border-radius: 8px;
            overflow: hidden;
        }
        .section-header {
            background: #f8f9fa;
            padding: 15px 20px;
            border-bottom: 1px solid #e9ecef;
        }
        .section-header h2 {
            margin: 0;
            font-size: 18px;
            color: #495057;
            font-weight: 600;
        }
        .section-body {
            padding: 20px;
        }
        .metrics-grid {
            display: block;
        }
        .metric-row {
            display: flex;
            justify-content: space-between;
            margin-bottom: 15px;
            padding-bottom: 15px;
            border-bottom: 1px solid #f1f3f4;
        }
        .metric-row:last-child {
            margin-bottom: 0;
            padding-bottom: 0;
            border-bottom: none;
        }
        .metric-item {
            flex: 1;
            text-align: center;
        }
        .metric-value {
            font-size: 24px;
            font-weight: bold;
            color: #2c3e50;
            margin: 0 0 5px 0;
        }
        .metric-label {
            font-size: 12px;
            color: #6c757d;
            margin: 0;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }
        .metric-change {
            font-size: 11px;
            padding: 2px 8px;
            border-radius: 10px;
            display: inline-block;
            margin-top: 4px;
        }
        .change-positive {
            background: #d4edda;
            color: #155724;
        }
        .change-negative {
            background: #f8d7da;
            color: #721c24;
        }
        .daily-grid {
            display: block;
        }
        .daily-row {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 10px 0;
            border-bottom: 1px solid #f1f3f4;
        }
        .daily-row:last-child {
            border-bottom: none;
        }
        .daily-date {
            font-weight: 600;
            color: #495057;
            min-width: 80px;
        }
        .daily-metrics {
            display: flex;
            gap: 20px;
        }
        .daily-metric {
            text-align: right;
            min-width: 80px;
        }
        .daily-value {
            font-weight: 600;
            color: #2c3e50;
        }
        .daily-label {
            font-size: 10px;
            color: #6c757d;
            text-transform: uppercase;
        }
        .today-highlight {
            background: #e7f3ff;
            border-left: 4px solid #007bff;
            margin: 0 -20px;
            padding: 10px 20px;
        }
        .summary-grid {
            display: flex;
            justify-content: space-between;
            flex-wrap: wrap;
            gap: 15px;
        }
        .summary-card {
            flex: 1;
            min-width: 120px;
            text-align: center;
            padding: 15px;
            background: #f8f9fa;
            border-radius: 6px;
            border: 1px solid #e9ecef;
        }
        .summary-value {
            font-size: 20px;
            font-weight: bold;
            color: #2c3e50;
            margin: 0 0 5px 0;
        }
        .summary-label {
            font-size: 11px;
            color: #6c757d;
            margin: 0;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }
        .footer {
            background: #f8f9fa;
            padding: 20px;
            text-align: center;
            border-top: 1px solid #e9ecef;
        }
        .footer-text {
            font-size: 12px;
            color: #6c757d;
            margin: 0;
        }
        .highlight {
            background: #fff3cd;
            padding: 15px;
            border-radius: 6px;
            border-left: 4px solid #ffc107;
            margin: 15px 0;
        }
        .highlight strong {
            color: #856404;
        }
        .financial-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 15px;
        }
        .financial-card {
            padding: 15px;
            background: #f8f9fa;
            border-radius: 6px;
            border: 1px solid #e9ecef;
        }
        .financial-value {
            font-size: 18px;
            font-weight: bold;
            color: #2c3e50;
            margin: 0 0 5px 0;
        }
        .financial-label {
            font-size: 12px;
            color: #495057;
            margin: 0 0 3px 0;
            font-weight: 600;
        }
        .financial-rate {
            font-size: 11px;
            color: #6c757d;
            margin: 0;
        }
        .net-revenue-card {
            grid-column: 1 / -1;
            background: #e7f3ff !important;
            border-color: #007bff !important;
        }
    </style>
</head>
<body>
    <div class="container">
        <!-- Header -->
        <div class="header">
            <h1>Analytics Report</h1>
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
                    <div class="metrics-grid">
                        <div class="metric-row">
                            <div class="metric-item">
                                <div class="metric-value">${formatNumber(data.todayOrders)}</div>
                                <div class="metric-label">Orders</div>
                                ${data.ordersChangeVsYesterday !== 0 ? `
                                <div class="metric-change ${getTrendClass(data.ordersChangeVsYesterday)}">
                                    ${getTrendIcon(data.ordersChangeVsYesterday)} ${Math.abs(data.ordersChangeVsYesterday).toFixed(1)}% vs yesterday
                                </div>
                                ` : ''}
                            </div>
                            <div class="metric-item">
                                <div class="metric-value">${formatCurrency(data.todayRevenue)}</div>
                                <div class="metric-label">Revenue</div>
                                ${data.revenueChangeVsYesterday !== 0 ? `
                                <div class="metric-change ${getTrendClass(data.revenueChangeVsYesterday)}">
                                    ${getTrendIcon(data.revenueChangeVsYesterday)} ${Math.abs(data.revenueChangeVsYesterday).toFixed(1)}% vs yesterday
                                </div>
                                ` : ''}
                            </div>
                            <div class="metric-item">
                                <div class="metric-value">${formatNumber(data.todayItems)}</div>
                                <div class="metric-label">Items Sold</div>
                                ${data.itemsChangeVsYesterday !== 0 ? `
                                <div class="metric-change ${getTrendClass(data.itemsChangeVsYesterday)}">
                                    ${getTrendIcon(data.itemsChangeVsYesterday)} ${Math.abs(data.itemsChangeVsYesterday).toFixed(1)}% vs yesterday
                                </div>
                                ` : ''}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Financial Breakdown -->
            <div class="section">
                <div class="section-header">
                    <h2>Financial Breakdown</h2>
                </div>
                <div class="section-body">
                    <div class="financial-grid">
                        <div class="financial-card">
                            <div class="financial-value">${formatCurrency(data.totalDiscounts)}</div>
                            <div class="financial-label">Total Discounts</div>
                            <div class="financial-rate">${formatPercent(data.discountRate)} of revenue</div>
                        </div>
                        <div class="financial-card">
                            <div class="financial-value">${formatCurrency(data.totalShipping)}</div>
                            <div class="financial-label">Shipping Charges</div>
                            <div class="financial-rate">${formatPercent(data.shippingRate)} of revenue</div>
                        </div>
                        <div class="financial-card">
                            <div class="financial-value">${formatCurrency(data.totalTaxes)}</div>
                            <div class="financial-label">Taxes Collected</div>
                            <div class="financial-rate">${formatPercent(data.taxRate)} of revenue</div>
                        </div>
                        <div class="financial-card">
                            <div class="financial-value">${formatCurrency(data.totalReturns)}</div>
                            <div class="financial-label">Returns & Refunds</div>
                            <div class="financial-rate">${formatPercent(data.returnRate)} of revenue</div>
                        </div>
                        <div class="financial-card net-revenue-card">
                            <div class="financial-value">${formatCurrency(data.netRevenue)}</div>
                            <div class="financial-label">Net Revenue</div>
                            <div class="financial-rate">After returns and discounts</div>
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
                    <div class="metrics-grid">
                        <div class="metric-row">
                            <div class="metric-item">
                                <div class="metric-value">${formatNumber(data.totalCustomers)}</div>
                                <div class="metric-label">Total Customers</div>
                            </div>
                            <div class="metric-item">
                                <div class="metric-value">${formatNumber(data.newCustomers)}</div>
                                <div class="metric-label">New Customers</div>
                            </div>
                            <div class="metric-item">
                                <div class="metric-value">${formatNumber(data.repeatCustomers)}</div>
                                <div class="metric-label">Repeat Customers</div>
                            </div>
                            <div class="metric-item">
                                <div class="metric-value">${data.repeatCustomerRate.toFixed(1)}%</div>
                                <div class="metric-label">Repeat Rate</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- 7-Day Customer Insights -->
            <div class="section">
                <div class="section-header">
                    <h2>Last 7 Days Customer Insights</h2>
                </div>
                <div class="section-body">
                    <div class="metrics-grid">
                        <div class="metric-row">
                            <div class="metric-item">
                                <div class="metric-value">${formatNumber(data.last7DaysTotalCustomers)}</div>
                                <div class="metric-label">Total Customers</div>
                            </div>
                            <div class="metric-item">
                                <div class="metric-value">${formatNumber(data.last7DaysNewCustomers)}</div>
                                <div class="metric-label">New Customers</div>
                            </div>
                            <div class="metric-item">
                                <div class="metric-value">${formatNumber(data.last7DaysRepeatCustomers)}</div>
                                <div class="metric-label">Repeat Customers</div>
                            </div>
                            <div class="metric-item">
                                <div class="metric-value">${data.last7DaysRepeatCustomerRate.toFixed(1)}%</div>
                                <div class="metric-label">Repeat Rate</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Fulfillment Status -->
            <div class="section">
                <div class="section-header">
                    <h2>Order Fulfillment</h2>
                </div>
                <div class="section-body">
                    <div class="metrics-grid">
                        <div class="metric-row">
                            <div class="metric-item">
                                <div class="metric-value">${formatNumber(data.todayFulfilled)}</div>
                                <div class="metric-label">Fulfilled Today</div>
                            </div>
                            <div class="metric-item">
                                <div class="metric-value">${formatNumber(data.todayUnfulfilled)}</div>
                                <div class="metric-label">Unfulfilled Today</div>
                            </div>
                            <div class="metric-item">
                                <div class="metric-value">${formatNumber(data.last7DaysFulfilled)}</div>
                                <div class="metric-label">7-Day Fulfilled</div>
                            </div>
                            <div class="metric-item">
                                <div class="metric-value">${formatNumber(data.last7DaysUnfulfilled)}</div>
                                <div class="metric-label">7-Day Unfulfilled</div>
                            </div>
                        </div>
                        <div class="metric-row">
                            <div class="metric-item">
                                <div class="metric-value">${data.fulfillmentRate.toFixed(1)}%</div>
                                <div class="metric-label">Overall Fulfillment Rate</div>
                            </div>
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
                    <div class="daily-grid">
                        ${data.dailySales.map(day => {
                            const date = new Date(day.date);
                            const isToday = day.date === data.currentDateInShopTZ;
                            const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
                            const dateStr = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
                            
                            return `
                            <div class="daily-row ${isToday ? 'today-highlight' : ''}">
                                <div class="daily-date">
                                    ${dayName}, ${dateStr}
                                    ${isToday ? ' <strong>(Today)</strong>' : ''}
                                </div>
                                <div class="daily-metrics">
                                    <div class="daily-metric">
                                        <div class="daily-value">${formatCurrency(day.revenue)}</div>
                                        <div class="daily-label">Revenue</div>
                                    </div>
                                    <div class="daily-metric">
                                        <div class="daily-value">${formatNumber(day.orders)}</div>
                                        <div class="daily-label">Orders</div>
                                    </div>
                                    <div class="daily-metric">
                                        <div class="daily-value">${formatNumber(day.items)}</div>
                                        <div class="daily-label">Items</div>
                                    </div>
                                </div>
                            </div>
                            `;
                        }).join('')}
                    </div>

                    <!-- 7-Day Summary -->
                    <div class="summary-grid" style="margin-top: 20px;">
                        <div class="summary-card">
                            <div class="summary-value">${formatNumber(last7DaysOrders)}</div>
                            <div class="summary-label">Total Orders</div>
                        </div>
                        <div class="summary-card">
                            <div class="summary-value">${formatCurrency(last7DaysRevenue)}</div>
                            <div class="summary-label">Total Revenue</div>
                        </div>
                        <div class="summary-card">
                            <div class="summary-value">${formatNumber(last7DaysItems)}</div>
                            <div class="summary-label">Total Items</div>
                        </div>
                        <div class="summary-card">
                            <div class="summary-value">${formatCurrency(data.averageDailyRevenue)}</div>
                            <div class="summary-label">Avg Daily Revenue</div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Overall Business Summary -->
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
                            <div class="summary-label">Gross Revenue</div>
                        </div>
                        <div class="summary-card">
                            <div class="summary-value">${formatCurrency(data.netRevenue)}</div>
                            <div class="summary-label">Net Revenue</div>
                        </div>
                        <div class="summary-card">
                            <div class="summary-value">${formatNumber(data.ordersLoaded)}</div>
                            <div class="summary-label">Orders Analyzed</div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Performance Insight -->
            ${data.revenueChangeVsYesterday !== 0 || data.revenueChangeVsLastWeek !== 0 ? `
            <div class="highlight">
                <strong>Performance Insight:</strong><br>
                ${data.revenueChangeVsYesterday > 0 ? `📈 Revenue is up ${Math.abs(data.revenueChangeVsYesterday).toFixed(1)}% from yesterday. ` : ''}
                ${data.revenueChangeVsYesterday < 0 ? `📉 Revenue is down ${Math.abs(data.revenueChangeVsYesterday).toFixed(1)}% from yesterday. ` : ''}
                ${data.revenueChangeVsLastWeek > 0 ? `🚀 Week-over-week revenue increased ${Math.abs(data.revenueChangeVsLastWeek).toFixed(1)}%.` : ''}
                ${data.revenueChangeVsLastWeek < 0 ? `⚠️ Week-over-week revenue decreased ${Math.abs(data.revenueChangeVsLastWeek).toFixed(1)}%.` : ''}
                ${data.bestDay && data.bestDay.revenue > data.todayRevenue ? ` Your best day was ${new Date(data.bestDay.date).toLocaleDateString()} with ${formatCurrency(data.bestDay.revenue)} in revenue.` : ''}
            </div>
            ` : ''}
        </div>

        <!-- Footer -->
        <div class="footer">
            <p class="footer-text">
                This automated report was generated on ${new Date().toLocaleString()}<br>
                Data analyzed from ${formatNumber(data.ordersLoaded)} orders • Shop Timezone: ${data.shopTimezone}
            </p>
        </div>
    </div>
</body>
</html>
    `;
  }

  private generateTextVersion(data: OrderData, shop: string): string {
    const formatCurrency = (amount: number) => `$${amount.toFixed(2)}`;
    const formatPercent = (num: number) => `${num.toFixed(1)}%`;

    // Calculate 7-day totals
    const last7DaysOrders = data.dailySales.reduce((sum, day) => sum + day.orders, 0);
    const last7DaysRevenue = data.dailySales.reduce((sum, day) => sum + day.revenue, 0);
    const last7DaysItems = data.dailySales.reduce((sum, day) => sum + day.items, 0);

    return `
ANALYTICS REPORT - ${shop}
${new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}

TODAY'S PERFORMANCE:
- Orders: ${data.todayOrders} (${data.ordersChangeVsYesterday >= 0 ? '+' : ''}${data.ordersChangeVsYesterday.toFixed(1)}% vs yesterday)
- Revenue: ${formatCurrency(data.todayRevenue)} (${data.revenueChangeVsYesterday >= 0 ? '+' : ''}${data.revenueChangeVsYesterday.toFixed(1)}% vs yesterday)
- Items Sold: ${data.todayItems} (${data.itemsChangeVsYesterday >= 0 ? '+' : ''}${data.itemsChangeVsYesterday.toFixed(1)}% vs yesterday)

FINANCIAL BREAKDOWN:
- Gross Revenue: ${formatCurrency(data.totalRevenue)}
- Total Discounts: ${formatCurrency(data.totalDiscounts)} (${formatPercent(data.discountRate)})
- Shipping Charges: ${formatCurrency(data.totalShipping)} (${formatPercent(data.shippingRate)})
- Taxes Collected: ${formatCurrency(data.totalTaxes)} (${formatPercent(data.taxRate)})
- Returns & Refunds: ${formatCurrency(data.totalReturns)} (${formatPercent(data.returnRate)})
- NET REVENUE: ${formatCurrency(data.netRevenue)}

CUSTOMER INSIGHTS:
- Total Customers: ${data.totalCustomers}
- New Customers: ${data.newCustomers}
- Repeat Customers: ${data.repeatCustomers}
- Repeat Rate: ${data.repeatCustomerRate.toFixed(1)}%

7-DAY CUSTOMER INSIGHTS:
- Total Customers: ${data.last7DaysTotalCustomers}
- New Customers: ${data.last7DaysNewCustomers}
- Repeat Customers: ${data.last7DaysRepeatCustomers}
- Repeat Rate: ${data.last7DaysRepeatCustomerRate.toFixed(1)}%

FULFILLMENT STATUS:
- Fulfilled Today: ${data.todayFulfilled}
- Unfulfilled Today: ${data.todayUnfulfilled}
- 7-Day Fulfilled: ${data.last7DaysFulfilled}
- 7-Day Unfulfilled: ${data.last7DaysUnfulfilled}
- Overall Fulfillment Rate: ${data.fulfillmentRate.toFixed(1)}%

LAST 7 DAYS PERFORMANCE:
${data.dailySales.map(day => {
  const date = new Date(day.date);
  const isToday = day.date === data.currentDateInShopTZ;
  return `- ${date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}${isToday ? ' (Today)' : ''}: ${formatCurrency(day.revenue)} | ${day.orders} orders | ${day.items} items`;
}).join('\n')}

7-DAY TOTALS:
- Total Orders: ${last7DaysOrders}
- Total Revenue: ${formatCurrency(last7DaysRevenue)}
- Total Items: ${last7DaysItems}
- Avg Daily Revenue: ${formatCurrency(data.averageDailyRevenue)}

BUSINESS OVERVIEW:
- All-Time Orders: ${data.totalOrders}
- Gross Revenue: ${formatCurrency(data.totalRevenue)}
- Net Revenue: ${formatCurrency(data.netRevenue)}
- Average Order Value: ${formatCurrency(data.averageOrderValue)}

PERFORMANCE INSIGHTS:
${data.revenueChangeVsYesterday > 0 ? `📈 Revenue increased ${Math.abs(data.revenueChangeVsYesterday).toFixed(1)}% from yesterday` : data.revenueChangeVsYesterday < 0 ? `📉 Revenue decreased ${Math.abs(data.revenueChangeVsYesterday).toFixed(1)}% from yesterday` : 'Revenue unchanged from yesterday'}
${data.revenueChangeVsLastWeek > 0 ? `🚀 Week-over-week revenue increased ${Math.abs(data.revenueChangeVsLastWeek).toFixed(1)}%` : data.revenueChangeVsLastWeek < 0 ? `⚠️ Week-over-week revenue decreased ${Math.abs(data.revenueChangeVsLastWeek).toFixed(1)}%` : ''}

Data analyzed from ${data.ordersLoaded} orders
Shop Timezone: ${data.shopTimezone}
Generated on ${new Date().toLocaleString()}
    `;
  }
}