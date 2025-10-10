

// import { json, LoaderFunctionArgs } from "@remix-run/node";
// import { authenticate } from "../shopify.server";
// import { AnalyticsCollector } from "../services/analyticsCollector.server";
// import { AnalyticsEmailService } from "../services/emailService.server";

// export async function loader({ request }: LoaderFunctionArgs) {
//   const { session } = await authenticate.admin(request);
  
//   return json({ 
//     message: "Analytics report endpoint",
//     shop: session.shop 
//   });
// }

// export async function action({ request }: { request: Request }) {
//   const { session } = await authenticate.admin(request);

//   try {
//     // Collect analytics data
//     const collector = new AnalyticsCollector(session);
//     const analyticsData = await collector.collectDailyAnalytics();
    
//     // Check if we have data to send
//     if (analyticsData.ordersLoaded === 0) {
//       return json({
//         success: true,
//         message: 'No order data available to send report',
//         skipped: true
//       });
//     }

//     // Send email with analytics
//     const emailService = new AnalyticsEmailService(session.shop);
//     const emailResult = await emailService.sendDailyAnalytics(analyticsData);

//     return json({
//       success: true,
//       message: 'Analytics report sent successfully',
//       data: {
//         ordersAnalyzed: analyticsData.ordersLoaded,
//         todayRevenue: analyticsData.todayRevenue,
//         todayOrders: analyticsData.todayOrders,
//         totalCustomers: analyticsData.totalCustomers
//       }
//     });

//   } catch (error: any) {
//     return json({
//       success: false,
//       error: 'Failed to send analytics report'
//     }, { status: 500 });
//   }
// }

import { json, LoaderFunctionArgs } from "@remix-run/node";
import { authenticate } from "../shopify.server";
import { AnalyticsCollector } from "../services/analyticsCollector.server";
import { AnalyticsEmailService } from "../services/emailService.server";

export async function loader({ request }: LoaderFunctionArgs) {
  const { session } = await authenticate.admin(request);
  
  return json({ 
    message: "Analytics report endpoint",
    shop: session.shop 
  });
}

export async function action({ request }: { request: Request }) {
  const { session } = await authenticate.admin(request);

  try {
    // Get the request body for BCC configuration
    let bccEmails = [];
    let toEmail = '';
    let fromName = '';
    let fromEmail = '';

    try {
      const requestBody = await request.json();
      bccEmails = requestBody.bccEmails || [];
      toEmail = requestBody.toEmail || '';
      fromName = requestBody.fromName || '';
      fromEmail = requestBody.fromEmail || '';
    } catch (error) {
      // If no JSON body, use empty defaults
      console.log('No email configuration provided, using defaults');
    }

    // Collect analytics data
    const collector = new AnalyticsCollector(session);
    const analyticsData = await collector.collectDailyAnalytics();
    
    // Check if we have data to send
    if (analyticsData.ordersLoaded === 0) {
      return json({
        success: true,
        message: 'No order data available to send report',
        skipped: true
      });
    }

    // Send email with analytics and BCC configuration
    const emailService = new AnalyticsEmailService(session.shop);
    
    // Create email options object
    const emailOptions = {
      bccEmails,
      toEmail,
      fromName, 
      fromEmail
    };

    const emailResult = await emailService.sendDailyAnalytics(analyticsData, emailOptions);

    return json({
      success: true,
      message: 'Analytics report sent successfully',
      data: {
        ordersAnalyzed: analyticsData.ordersLoaded,
        todayRevenue: analyticsData.todayRevenue,
        todayOrders: analyticsData.todayOrders,
        totalCustomers: analyticsData.totalCustomers,
        recipientsCount: emailResult.recipientsCount || 0
      }
    });

  } catch (error: any) {
    console.error('Analytics report error:', error);
    return json({
      success: false,
      error: 'Failed to send analytics report: ' + error.message
    }, { status: 500 });
  }
}