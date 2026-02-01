CREATE OR REPLACE VIEW monthly_revenue AS
SELECT
  DATE_TRUNC('month', created_at) as month,
  SUM(total_price) as revenue
FROM "Order"
GROUP BY DATE_TRUNC('month', created_at);
