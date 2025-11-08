// import type { CustomerData } from '../types/analytics';

// export function buildCustomerOrderMap(allOrders: any[], shopTimeZone: string) {
//   const customerOrderMap: Record<string, Date[]> = {};
  
//   for (let i = 0; i < allOrders.length; i++) {
//     const order = allOrders[i];
//     const custId = order?.customer?.id;
    
//     if (custId === undefined || custId === null) continue;
    
//     const customerId = custId.toString();
    
//     if (!customerOrderMap[customerId]) {
//       customerOrderMap[customerId] = [];
//     }
    
//     customerOrderMap[customerId].push(new Date(order.created_at));
//   }
  
//   return customerOrderMap;
// }

// export function analyzeCustomerBehavior(
//   customerOrderMap: Record<string, Date[]>, 
//   shopTimeZone: string,
//   periodKeys: string[],
//   periodType: 'daily' | 'weekly' | 'monthly'
// ): Record<string, CustomerData> {
//   const periodAnalytics: Record<string, CustomerData> = {};
  
//   for (const key of periodKeys) {
//     periodAnalytics[key] = { newCustomers: 0, repeatedCustomers: 0, totalCustomers: 0 };
//   }

//   const customerIds = Object.keys(customerOrderMap);
  
//   for (let i = 0; i < customerIds.length; i++) {
//     const customerId = customerIds[i];
//     const orderDates = customerOrderMap[customerId];
//     if (orderDates.length === 0) continue;
    
//     let firstOrderDate = orderDates[0];
//     for (let j = 1; j < orderDates.length; j++) {
//       if (orderDates[j] < firstOrderDate) {
//         firstOrderDate = orderDates[j];
//       }
//     }
    
//     let firstOrderKey: string;
//     if (periodType === 'daily') {
//       firstOrderKey = firstOrderDate.toLocaleDateString("en-CA", { timeZone: shopTimeZone });
//     } else if (periodType === 'monthly') {
//       firstOrderKey = firstOrderDate.toLocaleString("default", { month: "short", year: "numeric", timeZone: shopTimeZone });
//     } else {
//       const firstOrderMonday = new Date(firstOrderDate);
//       firstOrderMonday.setDate(firstOrderDate.getDate() - ((firstOrderDate.getDay() + 6) % 7));
//       firstOrderKey = `Week of ${firstOrderMonday.toLocaleDateString("en-CA", { timeZone: shopTimeZone })}`;
//     }
    
//     for (let j = 0; j < orderDates.length; j++) {
//       const orderDate = orderDates[j];
//       let orderKey: string;
      
//       if (periodType === 'daily') {
//         orderKey = orderDate.toLocaleDateString("en-CA", { timeZone: shopTimeZone });
//       } else if (periodType === 'monthly') {
//         orderKey = orderDate.toLocaleString("default", { month: "short", year: "numeric", timeZone: shopTimeZone });
//       } else {
//         const orderMonday = new Date(orderDate);
//         orderMonday.setDate(orderDate.getDate() - ((orderDate.getDay() + 6) % 7));
//         orderKey = `Week of ${orderMonday.toLocaleDateString("en-CA", { timeZone: shopTimeZone })}`;
//       }
      
//       if (periodAnalytics[orderKey]) {
//         if (firstOrderKey === orderKey) {
//           periodAnalytics[orderKey].newCustomers++;
//         } else {
//           periodAnalytics[orderKey].repeatedCustomers++;
//         }
        
//         periodAnalytics[orderKey].totalCustomers++;
//       }
//     }
//   }
  
//   return periodAnalytics;
// }

// export function calculateOverallCustomerData(customerOrderMap: Record<string, Date[]>): CustomerData {
//   const customers = Object.values(customerOrderMap);
//   const totalCustomers = customers.length;
  
//   let newCustomers = 0;
//   let repeatedCustomers = 0;

//   customers.forEach(orderDates => {
//     if (orderDates.length === 1) {
//       newCustomers++;
//     } else {
//       repeatedCustomers++;
//     }
//   });

//   return {
//     newCustomers,
//     repeatedCustomers,
//     totalCustomers,
//   };
// }







































// customerAnalytics.server.ts
import type { CustomerData } from '../types/analytics';

export function buildCustomerOrderMap(allOrders: any[], shopTimeZone: string) {
  const customerOrderMap: Record<string, Date[]> = {};

  for (let i = 0; i < allOrders.length; i++) {
    const order = allOrders[i];
    
    // Handle both GraphQL and REST customer ID structures
    let customerId: string | null = null;
    
    if (order.customer) {
      // GraphQL structure
      if (order.customer.id) {
        customerId = order.customer.id.toString();
      }
      // REST structure (fallback)
      else if (order.customer.id !== undefined) {
        customerId = order.customer.id.toString();
      }
    }
    
    if (customerId === null || customerId === undefined) continue;

    if (!customerOrderMap[customerId]) {
      customerOrderMap[customerId] = [];
    }
    
    // Use appropriate date field (GraphQL vs REST)
    const orderDate = new Date(order.createdAt || order.created_at);
    customerOrderMap[customerId].push(orderDate);
  }

  return customerOrderMap;
}

export function analyzeCustomerBehavior(
  customerOrderMap: Record<string, Date[]>,
  shopTimeZone: string,
  periodKeys: string[],
  periodType: 'daily' | 'weekly' | 'monthly'
): Record<string, CustomerData> {
  const periodAnalytics: Record<string, CustomerData> = {};

  for (const key of periodKeys) {
    periodAnalytics[key] = {
      newCustomers: 0,
      repeatedCustomers: 0,
      totalCustomers: 0
    };
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

export function calculateOverallCustomerData(customerOrderMap: Record<string, Date[]>): CustomerData {
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
