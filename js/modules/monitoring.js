// Performance Monitoring
class PerformanceMonitor {
  constructor() {
    this.metrics = {};
    this.initWebVitals();
  }

  initWebVitals() {
    // Core Web Vitals
    this.observeCLS();
    this.observeFID();
    this.observeLCP();
    
    // Additional metrics
    this.observeTTFB();
    this.observeFCP();
  }

  observeCLS() {
    let clsValue = 0;
    let clsEntries = [];

    const observer = new PerformanceObserver((entryList) => {
      for (const entry of entryList.getEntries()) {
        if (!entry.hadRecentInput) {
          const firstSessionEntry = clsEntries.length === 0;
          const largestShiftValue = entry.value > clsValue;
          
          if (firstSessionEntry || largestShiftValue) {
            clsValue = entry.value;
            clsEntries = [entry];
          }
        }
      }
      
      this.metrics.cls = clsValue;
    });

    observer.observe({ entryTypes: ['layout-shift'] });
  }

  observeFID() {
    new PerformanceObserver((entryList) => {
      for (const entry of entryList.getEntries()) {
        this.metrics.fid = entry.processingStart - entry.startTime;
      }
    }).observe({ type: 'first-input', buffered: true });
  }

  observeLCP() {
    new PerformanceObserver((entryList) => {
      const entries = entryList.getEntries();
      const lastEntry = entries[entries.length - 1];
      this.metrics.lcp = lastEntry.startTime;
    }).observe({ entryTypes: ['largest-contentful-paint'] });
  }

  observeTTFB() {
    new PerformanceObserver((entryList) => {
      const entries = entryList.getEntries();
      this.metrics.ttfb = entries[0].responseStart;
    }).observe({ entryTypes: ['navigation'] });
  }

  observeFCP() {
    new PerformanceObserver((entryList) => {
      const entries = entryList.getEntries();
      this.metrics.fcp = entries[0].startTime;
    }).observe({ entryTypes: ['paint'] });
  }

  getMetrics() {
    return this.metrics;
  }

  sendToAnalytics() {
    // Send metrics to your analytics service
    console.log('Performance Metrics:', this.metrics);
  }
}

// Error Tracking
class ErrorTracker {
  constructor() {
    this.errors = [];
    this.init();
  }

  init() {
    window.addEventListener('error', (event) => {
      this.logError({
        type: 'runtime',
        message: event.message,
        source: event.filename,
        line: event.lineno,
        column: event.colno,
        stack: event.error?.stack
      });
    });

    window.addEventListener('unhandledrejection', (event) => {
      this.logError({
        type: 'promise',
        message: event.reason.message,
        stack: event.reason.stack
      });
    });
  }

  logError(error) {
    this.errors.push({
      ...error,
      timestamp: new Date().toISOString(),
      url: window.location.href,
      userAgent: navigator.userAgent
    });

    this.sendToErrorService(error);
  }

  sendToErrorService(error) {
    // Send to your error tracking service
    console.error('Error logged:', error);
  }
}

// Initialize monitoring
const performance = new PerformanceMonitor();
const errorTracker = new ErrorTracker();

export { performance, errorTracker };