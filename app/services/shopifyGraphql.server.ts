// // services/shopifyGraphql.server.ts
// const ORDERS_GRAPHQL_QUERY = `#graphql
// query OrdersByDateRange($query: String!, $first: Int!, $after: String) {
//   orders(first: $first, query: $query, sortKey: CREATED_AT, reverse: true, after: $after) {
//     pageInfo {
//       hasNextPage
//       endCursor
//     }
//     edges {
//       cursor
//       node {
//         id
//         name
//         createdAt
//         updatedAt
//         displayFinancialStatus
//         displayFulfillmentStatus
//         confirmed
//         cancelledAt
//         cancelReason
//         note
//         fullyPaid
//         # Enhanced Financial Information
//         totalReceivedSet {
//           shopMoney {
//             amount
//             currencyCode
//           }
//         }
//         totalRefundedSet {
//           shopMoney {
//             amount
//             currencyCode
//           }
//         }
//         totalOutstandingSet {
//           shopMoney {
//             amount
//             currencyCode
//           }
//         }
//         totalDiscountsSet {
//           shopMoney {
//             amount
//             currencyCode
//           }
//         }
//         totalShippingPriceSet {
//           shopMoney {
//             amount
//             currencyCode
//           }
//         }
//         totalRefundedShippingSet {
//           shopMoney {
//             amount
//             currencyCode
//           }
//         }
//         # Refund Discrepancy - Direct from Shopify
//         refundDiscrepancySet {
//           shopMoney {
//             amount
//             currencyCode
//           }
//         }
//         # Returns Information with Restocking Fees
//         returns(first: 7) {
//           nodes {
//             returnLineItems(first: 10) {
//               nodes {
//                 ... on ReturnLineItem {
//                   restockingFee {
//                     amountSet {
//                       shopMoney {
//                         amount
//                         currencyCode
//                       }
//                     }
//                   }
//                 }
//               }
//             }
//             returnShippingFees {
//               amountSet {
//                 shopMoney {
//                   amount
//                   currencyCode
//                 }
//               }
//             }
//           }
//         }
//         # Refund Information
//         refunds {
//           id
//           createdAt
//           note
//           totalRefundedSet {
//             shopMoney {
//               amount
//               currencyCode
//             }
//           }
//           refundLineItems(first: 10) {
//             edges {
//               node {
//                 lineItem {
//                   id
//                   name
//                 }
//                 quantity
//                 subtotalSet {
//                   shopMoney {
//                     amount
//                     currencyCode
//                   }
//                 }
//                 totalTaxSet {
//                   shopMoney {
//                     amount
//                     currencyCode
//                   }
//                 }
//               }
//             }
//           }
//         }
//         # Pricing Information
//         currentSubtotalPriceSet {
//           shopMoney {
//             amount
//             currencyCode
//           }
//         }
//         currentTotalTaxSet {
//           shopMoney {
//             amount
//             currencyCode
//           }
//         }
//         currentTotalDiscountsSet {
//           shopMoney {
//             amount
//             currencyCode
//           }
//         }
//         currentTotalPriceSet {
//           shopMoney {
//             amount
//             currencyCode
//           }
//         }
//         subtotalPriceSet {
//           shopMoney {
//             amount
//             currencyCode
//           }
//         }
//         totalPriceSet {
//           shopMoney {
//             amount
//             currencyCode
//           }
//         }
//         # Fulfillment Information
//         fulfillments(first: 5) {
//           id
//           status
//           createdAt
//           trackingInfo {
//             company
//             number
//             url
//           }
//         }
//         # Shipping Line Information
//         shippingLine {
//           title
//           originalPriceSet {
//             shopMoney {
//               amount
//               currencyCode
//             }
//           }
//           discountedPriceSet {
//             shopMoney {
//               amount
//               currencyCode
//             }
//           }
//         }
//         # Discount Information
//         discountApplications(first: 5) {
//           edges {
//             node {
//               __typename
//               ... on DiscountCodeApplication {
//                 code
//                 allocationMethod
//                 targetType
//                 value {
//                   ... on MoneyV2 {
//                     amount
//                     currencyCode
//                   }
//                   ... on PricingPercentageValue {
//                     percentage
//                   }
//                 }
//               }
//             }
//           }
//         }
//         # Line Items with enhanced details including tax lines
//         lineItems(first: 50) {
//           edges {
//             node {
//               id
//               name
//               title
//               quantity
//               sku
//               variantTitle
//               product {
//                 id
//                 title
//               }
//               variant {
//                 id
//                 title
//                 sku
//                 price
//               }
//               originalUnitPriceSet {
//                 shopMoney {
//                   amount
//                   currencyCode
//                 }
//               }
//               discountedUnitPriceSet {
//                 shopMoney {
//                   amount
//                   currencyCode
//                 }
//               }
//               discountedTotalSet {
//                 shopMoney {
//                   amount
//                   currencyCode
//                 }
//               }
//               originalTotalSet {
//                 shopMoney {
//                   amount
//                   currencyCode
//                 }
//               }
//               # Tax lines for each line item
//               taxLines {
//                 priceSet {
//                   shopMoney {
//                     amount
//                     currencyCode
//                   }
//                 }
//                 rate
//                 title
//               }
//             }
//           }
//         }
//       }
//     }
//   }
// }`;

// interface GraphQLResponse {
//   data: {
//     orders: {
//       pageInfo: {
//         hasNextPage: boolean;
//         endCursor: string | null;
//       };
//       edges: Array<{
//         cursor: string;
//         node: any;
//       }>;
//     };
//   };
//   errors?: Array<{
//     message: string;
//   }>;
// }

// export async function fetchOrdersWithGraphQL(
//   shop: string,
//   accessToken: string,
//   query: string,
//   first: number = 250
// ): Promise<any[]> {
//   let allOrders: any[] = [];
//   let hasNextPage = true;
//   let endCursor: string | null = null;
//   let pageCount = 0;
//   const MAX_PAGES = 200; // Increased limit for large stores

//   while (hasNextPage && pageCount < MAX_PAGES) {
//     pageCount++;
    
//     try {
//       const response = await fetch(`https://${shop}/admin/api/${process.env.SHOPIFY_API_VERSION || '2024-04'}/graphql.json`, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//           'X-Shopify-Access-Token': accessToken,
//         },
//         body: JSON.stringify({
//           query: ORDERS_GRAPHQL_QUERY,
//           variables: {
//             query,
//             first,
//             after: endCursor
//           }
//         }),
//       });

//       if (!response.ok) {
//         if (response.status === 429) {
//           const retryAfter = response.headers.get('Retry-After') || '10';
//           const waitTime = parseInt(retryAfter) * 1000;
//           console.log(`⏳ Rate limited, waiting ${waitTime}ms`);
//           await new Promise(resolve => setTimeout(resolve, waitTime));
//           continue;
//         }
//         throw new Error(`GraphQL HTTP error! status: ${response.status}`);
//       }

//       const result: GraphQLResponse = await response.json();

//       if (result.errors) {
//         console.error('GraphQL Errors:', result.errors);
//         throw new Error(`GraphQL query failed: ${result.errors[0]?.message}`);
//       }

//       const ordersData = result.data.orders;
//       const orders = ordersData.edges.map((edge: any) => edge.node);
      
//       allOrders = [...allOrders, ...orders];
      
//       hasNextPage = ordersData.pageInfo.hasNextPage;
//       endCursor = ordersData.pageInfo.endCursor;

//       console.log(`📄 GraphQL page ${pageCount}: ${orders.length} orders (total: ${allOrders.length})`);

//       // Add small delay between pages to be respectful of rate limits
//       if (hasNextPage) {
//         await new Promise(resolve => setTimeout(resolve, 500));
//       }

//     } catch (error) {
//       console.error('Error fetching orders with GraphQL:', error);
//       throw error;
//     }
//   }

//   if (pageCount >= MAX_PAGES) {
//     console.warn(`⚠️  Reached maximum page limit (${MAX_PAGES}), some orders may be missing`);
//   }

//   console.log(`📊 GraphQL fetched ${allOrders.length} orders across ${pageCount} pages`);
//   return allOrders;
// }

// export async function fetchOrdersForPeriodGraphQL(
//   shop: string,
//   accessToken: string,
//   startDate: string,
//   endDate: string
// ): Promise<any[]> {
//   const query = `created_at:>=${startDate} AND created_at:<=${endDate}`;
//   console.log(`🔍 GraphQL query: ${query}`);
//   return fetchOrdersWithGraphQL(shop, accessToken, query);
// }

// export async function fetchOrdersSinceGraphQL(
//   shop: string,
//   accessToken: string,
//   sinceDate: string,
//   cachedOrders: any[] = []
// ): Promise<{ orders: any[]; hasMore: boolean }> {
//   const query = `updated_at:>=${sinceDate}`;
//   console.log(`🔍 GraphQL incremental query: ${query}`);
//   const newOrders = await fetchOrdersWithGraphQL(shop, accessToken, query);
  
//   return {
//     orders: newOrders,
//     hasMore: false // GraphQL handles pagination internally
//   };
// }











































































// services/shopifyGraphql.server.ts - EXACT COPY FROM ORIGINAL WORKING CODE
const ORDERS_GRAPHQL_QUERY = `#graphql
query OrdersByDateRange($query: String!, $first: Int!, $after: String) {
  orders(first: $first, query: $query, sortKey: CREATED_AT, reverse: true, after: $after) {
    pageInfo {
      hasNextPage
      endCursor
    }
    edges {
      cursor
      node {
        id
        name
        createdAt
        updatedAt
        displayFinancialStatus
        displayFulfillmentStatus
        confirmed
        cancelledAt
        cancelReason
        note
        fullyPaid
        # Enhanced Financial Information
        totalReceivedSet {
          shopMoney {
            amount
            currencyCode
          }
        }
        totalRefundedSet {
          shopMoney {
            amount
            currencyCode
          }
        }
        totalOutstandingSet {
          shopMoney {
            amount
            currencyCode
          }
        }
        totalDiscountsSet {
          shopMoney {
            amount
            currencyCode
          }
        }
        totalShippingPriceSet {
          shopMoney {
            amount
            currencyCode
          }
        }
        totalRefundedShippingSet {
          shopMoney {
            amount
            currencyCode
          }
        }
        # Refund Discrepancy - Direct from Shopify
        refundDiscrepancySet {
          shopMoney {
            amount
            currencyCode
          }
        }
        # Returns Information with Restocking Fees
        returns(first: 7) {
          nodes {
            returnLineItems(first: 10) {
              nodes {
                ... on ReturnLineItem {
                  restockingFee {
                    amountSet {
                      shopMoney {
                        amount
                        currencyCode
                      }
                    }
                  }
                }
              }
            }
            returnShippingFees {
              amountSet {
                shopMoney {
                  amount
                  currencyCode
                }
              }
            }
          }
        }
        # Refund Information
        refunds {
          id
          createdAt
          note
          totalRefundedSet {
            shopMoney {
              amount
              currencyCode
            }
          }
          refundLineItems(first: 10) {
            edges {
              node {
                lineItem {
                  id
                  name
                }
                quantity
                subtotalSet {
                  shopMoney {
                    amount
                    currencyCode
                  }
                }
                totalTaxSet {
                  shopMoney {
                    amount
                    currencyCode
                  }
                }
              }
            }
          }
        }
        # Pricing Information
        currentSubtotalPriceSet {
          shopMoney {
            amount
            currencyCode
          }
        }
        currentTotalTaxSet {
          shopMoney {
            amount
            currencyCode
          }
        }
        currentTotalDiscountsSet {
          shopMoney {
            amount
            currencyCode
          }
        }
        currentTotalPriceSet {
          shopMoney {
            amount
            currencyCode
          }
        }
        subtotalPriceSet {
          shopMoney {
            amount
            currencyCode
          }
        }
        totalPriceSet {
          shopMoney {
            amount
            currencyCode
          }
        }
        # Fulfillment Information
        fulfillments(first: 5) {
          id
          status
          createdAt
          trackingInfo {
            company
            number
            url
          }
        }
        # Shipping Line Information
        shippingLine {
          title
          originalPriceSet {
            shopMoney {
              amount
              currencyCode
            }
          }
          discountedPriceSet {
            shopMoney {
              amount
              currencyCode
            }
          }
        }
        # Discount Information
        discountApplications(first: 5) {
          edges {
            node {
              __typename
              ... on DiscountCodeApplication {
                code
                allocationMethod
                targetType
                value {
                  ... on MoneyV2 {
                    amount
                    currencyCode
                  }
                  ... on PricingPercentageValue {
                    percentage
                  }
                }
              }
            }
          }
        }
        # Line Items with enhanced details including tax lines
        lineItems(first: 50) {
          edges {
            node {
              id
              name
              title
              quantity
              sku
              variantTitle
              product {
                id
                title
              }
              variant {
                id
                title
                sku
                price
              }
              originalUnitPriceSet {
                shopMoney {
                  amount
                  currencyCode
                }
              }
              discountedUnitPriceSet {
                shopMoney {
                  amount
                  currencyCode
                }
              }
              discountedTotalSet {
                shopMoney {
                  amount
                  currencyCode
                }
              }
              originalTotalSet {
                shopMoney {
                  amount
                  currencyCode
                }
              }
              # Tax lines for each line item
              taxLines {
                priceSet {
                  shopMoney {
                    amount
                    currencyCode
                  }
                }
                rate
                title
              }
            }
          }
        }
      }
    }
  }
}`;

// REST OF THE FILE REMAINS EXACTLY THE SAME AS YOUR ORIGINAL
interface GraphQLResponse {
  data: {
    orders: {
      pageInfo: {
        hasNextPage: boolean;
        endCursor: string | null;
      };
      edges: Array<{
        cursor: string;
        node: any;
      }>;
    };
  };
  errors?: Array<{
    message: string;
  }>;
}

export async function fetchOrdersWithGraphQL(
  shop: string,
  accessToken: string,
  query: string,
  first: number = 250
): Promise<any[]> {
  let allOrders: any[] = [];
  let hasNextPage = true;
  let endCursor: string | null = null;
  let pageCount = 0;
  const MAX_PAGES = 200;

  while (hasNextPage && pageCount < MAX_PAGES) {
    pageCount++;
    
    try {
      const response = await fetch(`https://${shop}/admin/api/${process.env.SHOPIFY_API_VERSION || '2024-04'}/graphql.json`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Shopify-Access-Token': accessToken,
        },
        body: JSON.stringify({
          query: ORDERS_GRAPHQL_QUERY,
          variables: {
            query,
            first,
            after: endCursor
          }
        }),
      });

      if (!response.ok) {
        if (response.status === 429) {
          const retryAfter = response.headers.get('Retry-After') || '10';
          const waitTime = parseInt(retryAfter) * 1000;
          console.log(`⏳ Rate limited, waiting ${waitTime}ms`);
          await new Promise(resolve => setTimeout(resolve, waitTime));
          continue;
        }
        throw new Error(`GraphQL HTTP error! status: ${response.status}`);
      }

      const result: GraphQLResponse = await response.json();

      if (result.errors) {
        console.error('GraphQL Errors:', result.errors);
        throw new Error(`GraphQL query failed: ${result.errors[0]?.message}`);
      }

      const ordersData = result.data.orders;
      const orders = ordersData.edges.map((edge: any) => edge.node);
      
      allOrders = [...allOrders, ...orders];
      
      hasNextPage = ordersData.pageInfo.hasNextPage;
      endCursor = ordersData.pageInfo.endCursor;

      console.log(`📄 GraphQL page ${pageCount}: ${orders.length} orders (total: ${allOrders.length})`);

      // Add small delay between pages to be respectful of rate limits
      if (hasNextPage) {
        await new Promise(resolve => setTimeout(resolve, 500));
      }

    } catch (error) {
      console.error('Error fetching orders with GraphQL:', error);
      throw error;
    }
  }

  if (pageCount >= MAX_PAGES) {
    console.warn(`⚠️  Reached maximum page limit (${MAX_PAGES}), some orders may be missing`);
  }

  console.log(`📊 GraphQL fetched ${allOrders.length} orders across ${pageCount} pages`);
  return allOrders;
}

export async function fetchOrdersForPeriodGraphQL(
  shop: string,
  accessToken: string,
  startDate: string,
  endDate: string
): Promise<any[]> {
  const query = `created_at:>=${startDate} AND created_at:<=${endDate}`;
  console.log(`🔍 GraphQL query: ${query}`);
  return fetchOrdersWithGraphQL(shop, accessToken, query);
}

export async function fetchOrdersSinceGraphQL(
  shop: string,
  accessToken: string,
  sinceDate: string,
  cachedOrders: any[] = []
): Promise<{ orders: any[]; hasMore: boolean }> {
  const query = `updated_at:>=${sinceDate}`;
  console.log(`🔍 GraphQL incremental query: ${query}`);
  const newOrders = await fetchOrdersWithGraphQL(shop, accessToken, query);
  
  return {
    orders: newOrders,
    hasMore: false
  };
}






































































