import type { OrderData } from '../../types/analytics';

export const generatePDFReport = (data: OrderData) => {
  const printWindow = window.open('', '_blank');
  if (!printWindow) return;

  const timestamp = new Date().toLocaleDateString();
  const time = new Date().toLocaleTimeString();
  
  const totalRefunds = data.totalRefunds || 0;
  const totalExchanges = data.totalExchanges || 0;
  const netEventValue = data.netEventValue || 0;
  
  const pdfContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Orders Dashboard Report</title>
      <style>
        .currency-value::before {
          content: '${data.shopCurrency === 'EUR' ? '€' : data.shopCurrency === 'GBP' ? '£' : data.shopCurrency === 'CAD' ? 'C$' : data.shopCurrency === 'AUD' ? 'A$' : data.shopCurrency === 'JPY' ? '¥' : '$'}';
        }
        body { 
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; 
          margin: 40px; 
          color: #333;
          line-height: 1.4;
        }
        .header { 
          text-align: center; 
          border-bottom: 3px solid #2c3e50; 
          padding-bottom: 25px; 
          margin-bottom: 35px; 
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          padding: 30px;
          margin: -40px -40px 35px -40px;
          border-radius: 0 0 20px 20px;
        }
        .header h1 { 
          margin: 0; 
          color: white;
          font-size: 2.2em;
          font-weight: 700;
        }
        .header .date { 
          color: rgba(255,255,255,0.9); 
          margin-top: 8px;
          font-size: 1.1em;
        }
        .section { 
          margin-bottom: 40px; 
          break-inside: avoid;
          background: white;
          padding: 25px;
          border-radius: 12px;
          box-shadow: 0 2px 10px rgba(0,0,0,0.08);
          border-left: 4px solid #3498db;
        }
        .section h2 { 
          color: #2c3e50; 
          border-bottom: 2px solid #ecf0f1; 
          padding-bottom: 12px; 
          margin-bottom: 20px;
          font-size: 1.4em;
        }
        .metrics-grid { 
          display: grid; 
          grid-template-columns: repeat(3, 1fr); 
          gap: 25px; 
          margin: 25px 0; 
        }
        .metric-card { 
          background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
          padding: 25px; 
          border-radius: 10px; 
          text-align: center; 
          border-left: 4px solid #3498db;
          transition: all 0.3s ease;
        }
        .metric-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 5px 15px rgba(0,0,0,0.1);
        }
        .metric-value { 
          font-size: 2em; 
          font-weight: bold; 
          color: #2c3e50; 
          margin-bottom: 8px;
        }
        .metric-label { 
          color: #666; 
          margin-top: 8px;
          font-weight: 600;
        }
        .growth-indicator {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 5px;
          font-size: 0.9em;
          font-weight: 600;
          margin-top: 10px;
          padding: 4px 12px;
          border-radius: 20px;
          width: fit-content;
          margin: 10px auto 0;
        }
        .growth-positive {
          background: #d4edda;
          color: #155724;
          border: 1px solid #c3e6cb;
        }
        .growth-negative {
          background: #f8d7da;
          color: #721c24;
          border: 1px solid #f5c6cb;
        }
        .growth-arrow {
          font-weight: bold;
        }
        .financial-grid { 
          display: grid; 
          grid-template-columns: repeat(2, 1fr); 
          gap: 20px; 
        }
        .financial-card { 
          background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
          padding: 20px; 
          border-radius: 8px; 
          border-left: 4px solid #27ae60;
          transition: all 0.3s ease;
        }
        .financial-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 5px 15px rgba(0,0,0,0.1);
        }
        .financial-value { 
          font-size: 1.5em; 
          font-weight: bold; 
          color: #2c3e50; 
        }
        .financial-label { 
          color: #666; 
          font-size: 0.9em;
          font-weight: 600;
        }
        .summary-table { 
          width: 100%; 
          border-collapse: collapse; 
          margin: 20px 0; 
          box-shadow: 0 1px 3px rgba(0,0,0,0.1);
        }
        .summary-table th, .summary-table td { 
          padding: 15px; 
          text-align: left; 
          border-bottom: 1px solid #ddd; 
        }
        .summary-table th { 
          background: #f8f9fa; 
          font-weight: bold;
          color: #2c3e50;
        }
        .positive { color: #27ae60; }
        .negative { color: #e74c3c; }
        .footer { 
          margin-top: 50px; 
          padding-top: 25px; 
          border-top: 2px solid #ddd; 
          text-align: center; 
          color: #666;
          font-size: 0.9em;
        }
        @media print { 
          body { margin: 20px; } 
          .metric-card, .financial-card { break-inside: avoid; }
          .section { break-inside: avoid; page-break-inside: avoid; }
          .header { margin: -20px -20px 25px -20px; }
        }
        @page {
          margin: 1cm;
          size: A4;
        }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>Orders Dashboard Report</h1>
        <div class="date">Generated: ${timestamp} at ${time}</div>
        <div class="date">Store Timezone: ${data.shopTimezone}</div>
      </div>

      <div class="section">
        <h2>Executive Summary</h2>
        <div class="metrics-grid">
          <div class="metric-card">
            <div class="metric-value">${data.totalOrders}</div>
            <div class="metric-label">Total Orders</div>
          </div>
          <div class="metric-card">
            <div class="metric-value">${data.totalCustomers}</div>
            <div class="metric-label">Total Customers</div>
          </div>
          <div class="metric-card">
            <div class="metric-value">${data.fulfillmentRate.toFixed(1)}%</div>
            <div class="metric-label">Fulfillment Rate</div>
          </div>
        </div>
      </div>

      <div class="section">
        <h2>Financial Overview</h2>
        <div class="financial-grid">
          <div class="financial-card">
            <div class="financial-value">${data.totalRevenue.toLocaleString('en-US', { style: 'currency', currency: data.shopCurrency || 'USD' })}</div>
            <div class="financial-label">Total Revenue</div>
          </div>
          <div class="financial-card">
            <div class="financial-value">${data.netRevenue.toLocaleString('en-US', { style: 'currency', currency: data.shopCurrency || 'USD' })}</div>
            <div class="financial-label">Net Revenue</div>
          </div>
          <div class="financial-card">
            <div class="financial-value">${data.averageOrderValue.toLocaleString('en-US', { style: 'currency', currency: data.shopCurrency || 'USD' })}</div>
            <div class="financial-label">Average Order Value</div>
          </div>
          <div class="financial-card">
            <div class="financial-value">${data.totalItems}</div>
            <div class="financial-label">Total Items Sold</div>
          </div>
        </div>
      </div>

      <div class="section">
        <h2>Today's Performance</h2>
        <div class="metrics-grid">
          <div class="metric-card">
            <div class="metric-value">${data.todayOrders}</div>
            <div class="metric-label">Today's Orders</div>
            ${data.ordersChangeVsYesterday !== 0 ? `
              <div class="growth-indicator ${data.ordersChangeVsYesterday >= 0 ? 'growth-positive' : 'growth-negative'}">
                <span class="growth-arrow">${data.ordersChangeVsYesterday >= 0 ? '↗' : '↘'}</span>
                ${Math.abs(data.ordersChangeVsYesterday).toFixed(1)}% vs yesterday
              </div>
            ` : '<div class="growth-indicator" style="visibility: hidden;">-</div>'}
          </div>
          <div class="metric-card">
            <div class="metric-value">${data.todayRevenue.toLocaleString('en-US', { style: 'currency', currency: data.shopCurrency || 'USD' })}</div>
            <div class="metric-label">Today's Revenue</div>
            ${data.revenueChangeVsYesterday !== 0 ? `
              <div class="growth-indicator ${data.revenueChangeVsYesterday >= 0 ? 'growth-positive' : 'growth-negative'}">
                <span class="growth-arrow">${data.revenueChangeVsYesterday >= 0 ? '↗' : '↘'}</span>
                ${Math.abs(data.revenueChangeVsYesterday).toFixed(1)}% vs yesterday
              </div>
            ` : '<div class="growth-indicator" style="visibility: hidden;">-</div>'}
          </div>
          <div class="metric-card">
            <div class="metric-value">${data.todayItems}</div>
            <div class="metric-label">Items Ordered Today</div>
            ${data.itemsChangeVsYesterday !== 0 ? `
              <div class="growth-indicator ${data.itemsChangeVsYesterday >= 0 ? 'growth-positive' : 'growth-negative'}">
                <span class="growth-arrow">${data.itemsChangeVsYesterday >= 0 ? '↗' : '↘'}</span>
                ${Math.abs(data.itemsChangeVsYesterday).toFixed(1)}% vs yesterday
              </div>
            ` : '<div class="growth-indicator" style="visibility: hidden;">-</div>'}
          </div>
        </div>
      </div>

      <div class="section">
        <h2>Customer Insights</h2>
        <div class="financial-grid">
          <div class="financial-card">
            <div class="financial-value">${data.newCustomers}</div>
            <div class="financial-label">New Customers</div>
          </div>
          <div class="financial-card">
            <div class="financial-value">${data.repeatCustomers}</div>
            <div class="financial-label">Repeat Customers</div>
          </div>
          <div class="financial-card">
            <div class="financial-value">${data.customerRetentionRate.toFixed(1)}%</div>
            <div class="financial-label">Retention Rate</div>
          </div>
          <div class="financial-card">
            <div class="financial-value">${data.averageOrderFrequency.toFixed(1)}</div>
            <div class="financial-label">Avg Order Frequency</div>
          </div>
        </div>
      </div>

      <div class="section">
        <h2>Event Summary</h2>
        <div class="financial-grid">
          <div class="financial-card">
            <div class="financial-value">${data.totalRefunds || 0}</div>
            <div class="financial-label">Full Refunds</div>
          </div>
          <div class="financial-card">
            <div class="financial-value">${data.totalPartialRefunds || 0}</div>
            <div class="financial-label">Partial Refunds</div>
          </div>
          <div class="financial-card">
            <div class="financial-value">${data.totalExchanges || 0}</div>
            <div class="financial-label">Exchanges</div>
          </div>
          <div class="financial-card">
            <div class="financial-value">${(data.netEventValue || 0).toLocaleString('en-US', { style: 'currency', currency: data.shopCurrency || 'USD' })}</div>
            <div class="financial-label">Net Event Impact</div>
          </div>
        </div>
        <div style="text-align: center; margin-top: 16px; color: #666; font-size: 0.9em;">
          Across ${data.totalEvents || 0} total events in ${data.ordersWithEvents || 0} orders
        </div>
      </div>

      <div class="footer">
        <p><strong>Orders Dashboard Summary Report</strong> - Key Business Metrics</p>
        <p>Generated by Nexus | ${timestamp}</p>
      </div>
    </body>
    </html>
  `;

  printWindow.document.write(pdfContent);
  printWindow.document.close();
  
  setTimeout(() => {
    printWindow.print();
    printWindow.onafterprint = () => {
      setTimeout(() => {
        printWindow.close();
      }, 100);
    };
  }, 1000);
};