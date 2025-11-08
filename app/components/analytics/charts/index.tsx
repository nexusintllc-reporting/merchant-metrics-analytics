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
import type { AnalyticsData } from '../../../types/analytics';

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

export const ChartComponents = {
  formatCurrency: (amount: number, currency: string = 'USD') => {
    return amount.toLocaleString('en-US', { 
      style: 'currency', 
      currency: currency,
      minimumFractionDigits: 2 
    });
  },

  CustomerDistribution: ({ data }: { data: AnalyticsData }) => {
    const chartData = {
      labels: ['New Customers', 'Repeat Customers'],
      datasets: [
        {
          data: [data.totalCustomerData.newCustomers, data.totalCustomerData.repeatedCustomers],
          backgroundColor: ['#f59e0b', '#10b981'],
          borderWidth: 2,
          borderColor: '#fff'
        }
      ]
    };

    const options = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { display: false } },
      animation: { duration: 500 }
    };

    return (
      <div className="chart-container">
        <div className="chart-header">
          <div className="chart-title">Customer Distribution</div>
          <div className="chart-legend">
            <div className="legend-item">
              <div className="legend-color new"></div>
              <span>New</span>
            </div>
            <div className="legend-item">
              <div className="legend-color repeat"></div>
              <span>Repeat</span>
            </div>
          </div>
        </div>
        <Pie data={chartData} options={options} height={120} />
        <div className="mini-stats">
          <div className="mini-stat-card">
            <div className="mini-stat-value">
              {data.totalCustomerData.totalCustomers > 0 
                ? `${((data.totalCustomerData.repeatedCustomers / data.totalCustomerData.totalCustomers) * 100).toFixed(1)}%`
                : '0.0%'
              }
            </div>
            <div className="mini-stat-label">Repeat Rate</div>
          </div>
          <div className="mini-stat-card">
            <div className="mini-stat-value">{data.totalCustomerData.totalCustomers}</div>
            <div className="mini-stat-label">Total Customers</div>
          </div>
        </div>
      </div>
    );
  },

  RevenueTrend: ({ data }: { data: AnalyticsData }) => {
    const weeklyData = data.weeklyKeys.map(week => {
      const weekData = data.weeklyTotals[week];
      return {
        week: week.replace('Week of ', ''),
        revenue: weekData?.total || 0,
        totalSales: weekData?.totalSales || 0
      };
    });

    const totalRevenue = weeklyData.reduce((sum, w) => sum + w.revenue, 0);
    const totalSales = weeklyData.reduce((sum, w) => sum + w.totalSales, 0);
    const avgWeeklyRevenue = totalRevenue / weeklyData.length;

    const chartData = {
      labels: weeklyData.map(w => w.week),
      datasets: [
        {
          label: 'Revenue',
          data: weeklyData.map(w => w.revenue),
          borderColor: '#3b82f6',
          backgroundColor: 'rgba(59, 130, 246, 0.1)',
          tension: 0.4,
          fill: true,
          borderWidth: 2
        }
      ]
    };

    const options = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { display: false } },
      scales: {
        x: { grid: { display: false } },
        y: { 
          beginAtZero: true,
          ticks: {
            callback: function(this: any, value: any) {
              return '$' + value;
            }
          }
        }
      }
    };

    return (
      <div className="chart-container">
        <div className="chart-header">
          <div className="chart-title">Weekly Revenue Trend</div>
          <div className="chart-legend">
            <div className="legend-item">
              <div className="legend-color revenue"></div>
              <span>Revenue</span>
            </div>
          </div>
        </div>
        <Line data={chartData} options={options} height={120} />
        <div className="mini-stats">
          <div className="mini-stat-card">
            <div className="mini-stat-value">
              {ChartComponents.formatCurrency(totalRevenue, data.shopCurrency)}
            </div>
            <div className="mini-stat-label">Total Revenue</div>
          </div>
          <div className="mini-stat-card">
            <div className="mini-stat-value">
              {ChartComponents.formatCurrency(avgWeeklyRevenue, data.shopCurrency)}
            </div>
            <div className="mini-stat-label">Avg Weekly</div>
          </div>
          <div className="mini-stat-card">
            <div className="mini-stat-value">
              {ChartComponents.formatCurrency(totalSales, data.shopCurrency)}
            </div>
            <div className="mini-stat-label">Total Sales</div>
          </div>
        </div>
      </div>
    );
  },

  MonthlyPerformance: ({ data }: { data: AnalyticsData }) => {
    const monthlyData = data.monthRanges.map(month => {
      const monthData = data.monthlyTotals[month];
      return {
        month: month,
        revenue: monthData?.total || 0,
        orders: monthData?.orderCount || 0,
        totalSales: monthData?.totalSales || 0
      };
    });

    const totalRevenue = monthlyData.reduce((sum, m) => sum + m.revenue, 0);
    const totalOrders = monthlyData.reduce((sum, m) => sum + m.orders, 0);
    const totalSales = monthlyData.reduce((sum, m) => sum + m.totalSales, 0);
    const avgMonthlyRevenue = totalRevenue / monthlyData.length;

    const chartData = {
      labels: monthlyData.map(m => m.month),
      datasets: [
        {
          label: 'Revenue',
          data: monthlyData.map(m => m.revenue),
          backgroundColor: 'rgba(59, 130, 246, 0.8)',
          borderRadius: 4
        },
        {
          label: 'Orders',
          data: monthlyData.map(m => m.orders),
          backgroundColor: 'rgba(139, 92, 246, 0.8)',
          borderRadius: 4
        }
      ]
    };

    const options = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { display: false } },
      scales: {
        x: { grid: { display: false } },
        y: { beginAtZero: true }
      }
    };

    return (
      <div className="chart-container">
        <div className="chart-header">
          <div className="chart-title">Monthly Performance</div>
          <div className="chart-legend">
            <div className="legend-item">
              <div className="legend-color revenue"></div>
              <span>Revenue</span>
            </div>
            <div className="legend-item">
              <div className="legend-color orders"></div>
              <span>Orders</span>
            </div>
          </div>
        </div>
        <Bar data={chartData} options={options} height={120} />
        <div className="mini-stats">
          <div className="mini-stat-card">
            <div className="mini-stat-value">
              {ChartComponents.formatCurrency(totalRevenue, data.shopCurrency)}
            </div>
            <div className="mini-stat-label">Total Revenue</div>
          </div>
          <div className="mini-stat-card">
            <div className="mini-stat-value">
              {totalOrders}
            </div>
            <div className="mini-stat-label">Total Orders</div>
          </div>
          <div className="mini-stat-card">
            <div className="mini-stat-value">
              {ChartComponents.formatCurrency(totalSales, data.shopCurrency)}
            </div>
            <div className="mini-stat-label">Total Sales</div>
          </div>
        </div>
      </div>
    );
  },

  FinancialBreakdown: ({ data }: { data: AnalyticsData }) => {
    const financialData = {
      grossRevenue: Object.values(data.totals).reduce((sum: number, month: any) => sum + month.total, 0),
      netRevenue: Object.values(data.totals).reduce((sum: number, month: any) => sum + month.totalSales, 0),
      discounts: Object.values(data.totals).reduce((sum: number, month: any) => sum + month.discounts, 0),
      shipping: Object.values(data.totals).reduce((sum: number, month: any) => sum + month.shipping, 0),
      taxes: Object.values(data.totals).reduce((sum: number, month: any) => sum + month.taxes, 0),
      returns: Object.values(data.totals).reduce((sum: number, month: any) => sum + month.returns, 0)
    };

    const chartData = {
      labels: ['Gross Revenue', 'Discounts', 'Shipping', 'Taxes', 'Returns'],
      datasets: [
        {
          data: [
            financialData.grossRevenue,
            financialData.discounts,
            financialData.shipping,
            financialData.taxes,
            financialData.returns
          ],
          backgroundColor: ['#3b82f6', '#f59e0b', '#10b981', '#8b5cf6', '#ef4444'],
          borderWidth: 2,
          borderColor: '#fff'
        }
      ]
    };

    const options = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { display: false } }
    };

    return (
      <div className="chart-container">
        <div className="chart-header">
          <div className="chart-title">Financial Breakdown</div>
          <div className="chart-legend">
            <div className="legend-item">
              <div className="legend-color revenue"></div>
              <span>Revenue</span>
            </div>
            <div className="legend-item">
              <div className="legend-color discounts"></div>
              <span>Discounts</span>
            </div>
            <div className="legend-item">
              <div className="legend-color shipping"></div>
              <span>Shipping</span>
            </div>
            <div className="legend-item">
              <div className="legend-color taxes"></div>
              <span>Taxes</span>
            </div>
            <div className="legend-item">
              <div className="legend-color returns"></div>
              <span>Returns</span>
            </div>
          </div>
        </div>
        <Pie data={chartData} options={options} height={120} />
        <div className="mini-stats">
          <div className="mini-stat-card">
            <div className="mini-stat-value">
              {ChartComponents.formatCurrency(financialData.netRevenue, data.shopCurrency)}
            </div>
            <div className="mini-stat-label">Net Revenue</div>
          </div>
          <div className="mini-stat-card">
            <div className="mini-stat-value">
              {financialData.grossRevenue > 0 
                ? `${((Math.abs(financialData.returns) / financialData.grossRevenue) * 100).toFixed(1)}%`
                : '0.0%'
              }
            </div>
            <div className="mini-stat-label">Return Rate</div>
          </div>
        </div>
      </div>
    );
  }
};