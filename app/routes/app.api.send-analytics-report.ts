

// // // import { json, LoaderFunctionArgs } from "@remix-run/node";
// // // import { authenticate } from "../shopify.server";
// // // import { AnalyticsCollector } from "../services/analyticsCollector.server";
// // // import { AnalyticsEmailService } from "../services/emailService.server";

// // // export async function loader({ request }: LoaderFunctionArgs) {
// // //   const { session } = await authenticate.admin(request);
  
// // //   return json({ 
// // //     message: "Analytics report endpoint",
// // //     shop: session.shop 
// // //   });
// // // }

// // // export async function action({ request }: { request: Request }) {
// // //   const { session } = await authenticate.admin(request);

// // //   try {
// // //     // Collect analytics data
// // //     const collector = new AnalyticsCollector(session);
// // //     const analyticsData = await collector.collectDailyAnalytics();
    
// // //     // Check if we have data to send
// // //     if (analyticsData.ordersLoaded === 0) {
// // //       return json({
// // //         success: true,
// // //         message: 'No order data available to send report',
// // //         skipped: true
// // //       });
// // //     }

// // //     // Send email with analytics
// // //     const emailService = new AnalyticsEmailService(session.shop);
// // //     const emailResult = await emailService.sendDailyAnalytics(analyticsData);

// // //     return json({
// // //       success: true,
// // //       message: 'Analytics report sent successfully',
// // //       data: {
// // //         ordersAnalyzed: analyticsData.ordersLoaded,
// // //         todayRevenue: analyticsData.todayRevenue,
// // //         todayOrders: analyticsData.todayOrders,
// // //         totalCustomers: analyticsData.totalCustomers
// // //       }
// // //     });

// // //   } catch (error: any) {
// // //     return json({
// // //       success: false,
// // //       error: 'Failed to send analytics report'
// // //     }, { status: 500 });
// // //   }
// // // }

// // import { json, LoaderFunctionArgs } from "@remix-run/node";
// // import { authenticate } from "../shopify.server";
// // import { AnalyticsCollector } from "../services/analyticsCollector.server";
// // import { AnalyticsEmailService } from "../services/emailService.server";

// // export async function loader({ request }: LoaderFunctionArgs) {
// //   const { session } = await authenticate.admin(request);
  
// //   return json({ 
// //     message: "Analytics report endpoint",
// //     shop: session.shop 
// //   });
// // }

// // export async function action({ request }: { request: Request }) {
// //   const { session } = await authenticate.admin(request);

// //   try {
// //     // Get the request body for BCC configuration
// //     let bccEmails = [];
// //     let toEmail = '';
// //     let fromName = '';
// //     let fromEmail = '';

// //     try {
// //       const requestBody = await request.json();
// //       bccEmails = requestBody.bccEmails || [];
// //       toEmail = requestBody.toEmail || '';
// //       fromName = requestBody.fromName || '';
// //       fromEmail = requestBody.fromEmail || '';
// //     } catch (error) {
// //       // If no JSON body, use empty defaults
// //       console.log('No email configuration provided, using defaults');
// //     }

// //     // Collect analytics data
// //     const collector = new AnalyticsCollector(session);
// //     const analyticsData = await collector.collectDailyAnalytics();
    
// //     // Check if we have data to send
// //     if (analyticsData.ordersLoaded === 0) {
// //       return json({
// //         success: true,
// //         message: 'No order data available to send report',
// //         skipped: true
// //       });
// //     }

// //     // Send email with analytics and BCC configuration
// //     const emailService = new AnalyticsEmailService(session.shop);
    
// //     // Create email options object
// //     const emailOptions = {
// //       bccEmails,
// //       toEmail,
// //       fromName, 
// //       fromEmail
// //     };

// //     const emailResult = await emailService.sendDailyAnalytics(analyticsData, emailOptions);

// //     return json({
// //       success: true,
// //       message: 'Analytics report sent successfully',
// //       data: {
// //         ordersAnalyzed: analyticsData.ordersLoaded,
// //         todayRevenue: analyticsData.todayRevenue,
// //         todayOrders: analyticsData.todayOrders,
// //         totalCustomers: analyticsData.totalCustomers,
// //         recipientsCount: emailResult.recipientsCount || 0
// //       }
// //     });

// //   } catch (error: any) {
// //     console.error('Analytics report error:', error);
// //     return json({
// //       success: false,
// //       error: 'Failed to send analytics report: ' + error.message
// //     }, { status: 500 });
// //   }
// // }



// import { json, LoaderFunctionArgs } from "@remix-run/node";
// import { authenticate } from "../shopify.server";
// import { AnalyticsCollector } from "../services/analyticsCollector.server";
// import { AnalyticsEmailService } from "../services/emailService.server";
// import { getOfflineSession } from "../utils/sessionManager.server"; // ADD THIS IMPORT

// export async function loader({ request }: LoaderFunctionArgs) {
//   const { session } = await authenticate.admin(request);
  
//   return json({ 
//     message: "Analytics report endpoint",
//     shop: session.shop 
//   });
// }

// export async function action({ request }: { request: Request }) {
//   let session;
//   let shop;

//   try {
//     // First try to authenticate as admin (for requests from the UI)
//     const auth = await authenticate.admin(request);
//     session = auth.session;
//     shop = auth.session.shop;
//     console.log(`✅ Using admin session for shop: ${shop}`);
//   } catch (error) {
//     // If admin auth fails, try to get session from request body (for background jobs)
//     console.log('🔄 Admin auth failed, trying offline session...');
    
//     try {
//       const requestBody = await request.json();
//       shop = requestBody.shop;
      
//       if (shop) {
//         console.log(`🔍 Looking for offline session for shop: ${shop}`);
//         session = await getOfflineSession(shop);
//         if (session) {
//           console.log(`✅ Using offline session for shop: ${shop}`);
//         } else {
//           console.log(`❌ No offline session found for shop: ${shop}`);
//         }
//       } else {
//         console.log('❌ No shop provided in request body');
//       }
//     } catch (e) {
//       console.error('❌ Failed to parse request body:', e);
//     }
//   }

//   // If still no session, return error
//   if (!session || !shop) {
//     console.log('❌ No valid session found for analytics report');
//     return json({
//       success: false,
//       error: 'No valid session found. Please ensure you are logged into the Shopify admin.'
//     }, { status: 401 });
//   }

//   try {
//     // Get the request body for BCC configuration
//     let bccEmails = [];
//     let toEmail = '';
//     let fromName = '';
//     let fromEmail = '';

//     try {
//       const requestBody = await request.json();
//       bccEmails = requestBody.bccEmails || [];
//       toEmail = requestBody.toEmail || '';
//       fromName = requestBody.fromName || '';
//       fromEmail = requestBody.fromEmail || '';
//     } catch (error) {
//       console.log('No email configuration provided, using defaults');
//     }

//     console.log(`🔍 DEBUG: Starting analytics collection for shop: ${shop}`);
    
//     // Collect analytics data
//     const collector = new AnalyticsCollector(session);
//     const analyticsData = await collector.collectDailyAnalytics();
    
//     console.log(`🔍 DEBUG: Analytics data collected - orders loaded: ${analyticsData.ordersLoaded}`);

//     // Check if we have data to send
//     if (analyticsData.ordersLoaded === 0) {
//       return json({
//         success: true,
//         message: 'No order data available to send report',
//         skipped: true
//       });
//     }

//     // Send email with analytics and BCC configuration
//     const emailService = new AnalyticsEmailService(shop);
    
//     // Create email options object
//     const emailOptions = {
//       bccEmails,
//       toEmail,
//       fromName, 
//       fromEmail
//     };

//     console.log(`📧 Sending email to ${bccEmails.length} BCC recipients`);
//     const emailResult = await emailService.sendDailyAnalytics(analyticsData, emailOptions);

//     return json({
//       success: true,
//       message: 'Analytics report sent successfully',
//       data: {
//         ordersAnalyzed: analyticsData.ordersLoaded,
//         todayRevenue: analyticsData.todayRevenue,
//         todayOrders: analyticsData.todayOrders,
//         totalCustomers: analyticsData.totalCustomers,
//         recipientsCount: emailResult.recipientsCount || 0
//       }
//     });

//   } catch (error: any) {
//     console.error('Analytics report error:', error);
//     return json({
//       success: false,
//       error: 'Failed to send analytics report: ' + error.message
//     }, { status: 500 });
//   }
// }

import { json, LoaderFunctionArgs } from "@remix-run/node";
import { authenticate } from "../shopify.server";
import { AnalyticsCollector } from "../services/analyticsCollector.server";
import { AnalyticsEmailService } from "../services/emailService.server";
import { getOfflineSession } from "../utils/sessionManager.server";

export async function loader({ request }: LoaderFunctionArgs) {
  const { session } = await authenticate.admin(request);
  
  return json({ 
    message: "Analytics report endpoint",
    shop: session.shop 
  });
}

export async function action({ request }: { request: Request }) {
  let session;
  let shop;

  try {
    // First try to authenticate as admin (for requests from the UI)
    const auth = await authenticate.admin(request);
    session = auth.session;
    shop = auth.session.shop;
    console.log(`✅ Using admin session for shop: ${shop}`);
  } catch (error) {
    // If admin auth fails, try to get session from request body (for background jobs)
    console.log('🔄 Admin auth failed, trying offline session...');
    
    try {
      const requestBody = await request.json();
      shop = requestBody.shop;
      
      if (shop) {
        console.log(`🔍 Looking for offline session for shop: ${shop}`);
        session = await getOfflineSession(shop);
        if (session) {
          console.log(`✅ Using offline session for shop: ${shop}`);
        } else {
          console.log(`❌ No offline session found for shop: ${shop}`);
        }
      } else {
        console.log('❌ No shop provided in request body');
      }
    } catch (e) {
      console.error('❌ Failed to parse request body:', e);
    }
  }

  // If still no session, return error
  if (!session || !shop) {
    console.log('❌ No valid session found for analytics report');
    return json({
      success: false,
      error: 'No valid session found. Please ensure you are logged into the Shopify admin.'
    }, { status: 401 });
  }

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
      console.log('No email configuration provided, using defaults');
    }

    console.log(`🔍 DEBUG: Starting analytics collection for shop: ${shop}`);
    
    // Collect analytics data
    const collector = new AnalyticsCollector(session);
    const analyticsData = await collector.collectDailyAnalytics();
    
    console.log(`🔍 DEBUG: Analytics data collected - orders loaded: ${analyticsData.ordersLoaded}`);

    // Check if we have data to send
    if (analyticsData.ordersLoaded === 0) {
      return json({
        success: true,
        message: 'No order data available to send report',
        skipped: true
      });
    }

    // Send email with analytics and BCC configuration
    const emailService = new AnalyticsEmailService(shop);
    
    // Create email options object
    const emailOptions = {
      bccEmails,
      toEmail,
      fromName, 
      fromEmail
    };

    console.log(`📧 Sending email to ${bccEmails.length} BCC recipients`);
    const emailResult = await emailService.sendDailyAnalytics(analyticsData, emailOptions);

    // Use recipients.length instead of recipientsCount for backward compatibility
    const recipientsCount = emailResult.recipients ? emailResult.recipients.length : 0;

    return json({
      success: true,
      message: 'Analytics report sent successfully',
      data: {
        ordersAnalyzed: analyticsData.ordersLoaded,
        todayRevenue: analyticsData.todayRevenue,
        todayOrders: analyticsData.todayOrders,
        totalCustomers: analyticsData.totalCustomers,
        recipientsCount: recipientsCount
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