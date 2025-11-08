const SHOPIFY_API_VERSION = process.env.SHOPIFY_API_VERSION || '2024-04';

export async function fetchOrdersSince(
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

export async function fetchOrdersForPeriod(shop: string, accessToken: string, startDate: string, endDate: string) {
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