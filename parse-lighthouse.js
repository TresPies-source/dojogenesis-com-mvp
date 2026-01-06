const report = require('./lighthouse-report.json');

console.log('=== Lighthouse Scores ===');
console.log('Performance:', Math.round(report.categories.performance.score * 100));
console.log('Accessibility:', Math.round(report.categories.accessibility.score * 100));
console.log('Best Practices:', Math.round(report.categories['best-practices'].score * 100));
console.log('\n=== Core Web Vitals ===');
console.log('First Contentful Paint:', report.audits['first-contentful-paint'].displayValue);
console.log('Largest Contentful Paint:', report.audits['largest-contentful-paint'].displayValue);
console.log('Cumulative Layout Shift:', report.audits['cumulative-layout-shift'].displayValue);
console.log('Speed Index:', report.audits['speed-index'].displayValue);
console.log('Total Blocking Time:', report.audits['total-blocking-time'].displayValue);
