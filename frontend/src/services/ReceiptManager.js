/**
 * OptiMind Retail™ POS System - Receipt Manager
 * 
 * Handles offline receipt generation and queuing:
 * - Generate receipts offline with professional formatting
 * - Queue receipts for printing when printer available
 * - Email receipt queuing for later delivery
 * - Receipt template management
 * - Print history and audit trail
 */

import indexedDBManager from './IndexedDBManager.js';

class ReceiptManager {
  constructor() {
    this.printQueue = [];
    this.emailQueue = [];
    this.receiptTemplates = {};
  }

  /**
   * Initialize receipt manager
   */
  async initialize() {
    await indexedDBManager.initialize();
    await this.loadReceiptTemplates();
    console.log('✅ Receipt Manager initialized');
  }

  /**
   * Generate receipt for transaction
   */
  async generateReceipt(transaction, options = {}) {
    const {
      includeCustomerInfo = true,
      includeItemDetails = true,
      includePaymentDetails = true,
      receiptType = 'sale', // 'sale', 'refund', 'exchange'
      templateId = 'default'
    } = options;

    const receiptId = this.generateReceiptId();
    const generatedAt = new Date();

    // Get receipt template
    const template = this.receiptTemplates[templateId] || this.receiptTemplates['default'];

    // Generate receipt content
    const receiptContent = this.formatReceipt(transaction, template, {
      includeCustomerInfo,
      includeItemDetails,
      includePaymentDetails,
      receiptType
    });

    const receipt = {
      id: receiptId,
      transactionId: transaction.id,
      receiptType,
      content: receiptContent,
      htmlContent: this.generateHTMLReceipt(transaction, template, options),
      templateId,
      generatedAt,
      status: 'generated',
      printStatus: 'pending',
      emailStatus: 'pending',
      printAttempts: 0,
      emailAttempts: 0,
      printedAt: null,
      emailedAt: null,
      operatorId: transaction.operatorId,
      sessionId: transaction.sessionId,
      syncStatus: 'pending'
    };

    // Save receipt to IndexedDB
    await indexedDBManager.add('receipts', receipt);

    // Add to print queue if requested
    if (options.queueForPrint !== false) {
      await this.queueForPrint(receipt);
    }

    // Add to email queue if customer email available
    if (transaction.customer?.email && options.queueForEmail !== false) {
      await this.queueForEmail(receipt, transaction.customer.email);
    }

    // Add to sync queue
    await indexedDBManager.addToSyncQueue(
      'receipt',
      receiptId,
      'create',
      receipt,
      50 // Medium priority for receipts
    );

    console.log(`🧾 Receipt generated: ${receiptId}`);
    return receipt;
  }

  /**
   * Format receipt content with template
   */
  formatReceipt(transaction, template, options) {
    const lines = [];
    
    // Header
    lines.push(template.header.companyName || 'OptiMind Retail™');
    lines.push(template.header.address || '');
    lines.push(template.header.phone || '');
    lines.push(template.header.website || '');
    lines.push('='.repeat(template.layout.width || 40));

    // Transaction info
    lines.push(`Receipt: ${transaction.id}`);
    lines.push(`Date: ${new Date(transaction.timestamp).toLocaleString()}`);
    lines.push(`Operator: ${transaction.operatorId}`);
    if (options.receiptType !== 'sale') {
      lines.push(`Type: ${options.receiptType.toUpperCase()}`);
    }
    lines.push('-'.repeat(template.layout.width || 40));

    // Customer info
    if (options.includeCustomerInfo && transaction.customer) {
      lines.push('Customer:');
      lines.push(`  ${transaction.customer.name}`);
      if (transaction.customer.phone) {
        lines.push(`  ${transaction.customer.phone}`);
      }
      lines.push('-'.repeat(template.layout.width || 40));
    }

    // Items
    if (options.includeItemDetails && transaction.items) {
      transaction.items.forEach(item => {
        lines.push(`${item.name}`);
        lines.push(`  ${item.quantity} x $${item.price.toFixed(2)} = $${item.total.toFixed(2)}`);
      });
      lines.push('-'.repeat(template.layout.width || 40));
    }

    // Totals
    lines.push(`Subtotal: $${transaction.subtotal.toFixed(2)}`);
    if (transaction.tax > 0) {
      lines.push(`Tax: $${transaction.tax.toFixed(2)}`);
    }
    if (transaction.discount > 0) {
      lines.push(`Discount: -$${transaction.discount.toFixed(2)}`);
    }
    lines.push(`TOTAL: $${transaction.total.toFixed(2)}`);
    lines.push('-'.repeat(template.layout.width || 40));

    // Payment details
    if (options.includePaymentDetails && transaction.payments) {
      lines.push('Payment:');
      transaction.payments.forEach(payment => {
        lines.push(`  ${payment.method.toUpperCase()}: $${payment.amount.toFixed(2)}`);
      });
      if (transaction.change > 0) {
        lines.push(`  Change: $${transaction.change.toFixed(2)}`);
      }
      lines.push('-'.repeat(template.layout.width || 40));
    }

    // Footer
    lines.push(template.footer.message || 'Thank you for your business!');
    lines.push(template.footer.returnPolicy || '');
    lines.push('='.repeat(template.layout.width || 40));

    return lines.join('\n');
  }

  /**
   * Generate HTML receipt for email/web display
   */
  generateHTMLReceipt(transaction, template, options) {
    const styles = `
      <style>
        .receipt { font-family: monospace; width: 300px; margin: 0 auto; }
        .header { text-align: center; margin-bottom: 20px; }
        .line { border-bottom: 1px solid #ccc; margin: 10px 0; }
        .total { font-weight: bold; font-size: 1.2em; }
        .items { margin: 15px 0; }
        .item { margin: 5px 0; }
        .footer { text-align: center; margin-top: 20px; font-size: 0.9em; }
      </style>
    `;

    let html = `<div class="receipt">${styles}`;
    
    // Header
    html += `<div class="header">
      <h2>${template.header.companyName || 'OptiMind Retail™'}</h2>
      <p>${template.header.address || ''}</p>
      <p>${template.header.phone || ''}</p>
    </div>`;

    // Transaction info
    html += `<div class="line"></div>
      <p><strong>Receipt:</strong> ${transaction.id}</p>
      <p><strong>Date:</strong> ${new Date(transaction.timestamp).toLocaleString()}</p>
      <p><strong>Operator:</strong> ${transaction.operatorId}</p>`;

    // Customer info
    if (options.includeCustomerInfo && transaction.customer) {
      html += `<div class="line"></div>
        <p><strong>Customer:</strong></p>
        <p>${transaction.customer.name}</p>
        ${transaction.customer.phone ? `<p>${transaction.customer.phone}</p>` : ''}`;
    }

    // Items
    if (options.includeItemDetails && transaction.items) {
      html += `<div class="items">`;
      transaction.items.forEach(item => {
        html += `<div class="item">
          <strong>${item.name}</strong><br>
          ${item.quantity} x $${item.price.toFixed(2)} = $${item.total.toFixed(2)}
        </div>`;
      });
      html += `</div>`;
    }

    // Totals
    html += `<div class="line"></div>
      <p>Subtotal: $${transaction.subtotal.toFixed(2)}</p>
      ${transaction.tax > 0 ? `<p>Tax: $${transaction.tax.toFixed(2)}</p>` : ''}
      ${transaction.discount > 0 ? `<p>Discount: -$${transaction.discount.toFixed(2)}</p>` : ''}
      <p class="total">TOTAL: $${transaction.total.toFixed(2)}</p>`;

    // Payment details
    if (options.includePaymentDetails && transaction.payments) {
      html += `<div class="line"></div>
        <p><strong>Payment:</strong></p>`;
      transaction.payments.forEach(payment => {
        html += `<p>${payment.method.toUpperCase()}: $${payment.amount.toFixed(2)}</p>`;
      });
      if (transaction.change > 0) {
        html += `<p>Change: $${transaction.change.toFixed(2)}</p>`;
      }
    }

    // Footer
    html += `<div class="footer">
      <div class="line"></div>
      <p>${template.footer.message || 'Thank you for your business!'}</p>
      <p>${template.footer.returnPolicy || ''}</p>
    </div>`;

    html += `</div>`;
    return html;
  }

  /**
   * Queue receipt for printing
   */
  async queueForPrint(receipt) {
    const printJob = {
      id: `PRINT_${receipt.id}`,
      receiptId: receipt.id,
      transactionId: receipt.transactionId,
      content: receipt.content,
      priority: 100, // High priority for receipts
      status: 'queued',
      queuedAt: new Date(),
      attempts: 0,
      maxAttempts: 3,
      lastAttempt: null,
      printedAt: null
    };

    await indexedDBManager.add('printQueue', printJob);
    this.printQueue.push(printJob);

    console.log(`🖨️ Receipt queued for printing: ${receipt.id}`);
  }

  /**
   * Queue receipt for email
   */
  async queueForEmail(receipt, customerEmail) {
    const emailJob = {
      id: `EMAIL_${receipt.id}`,
      receiptId: receipt.id,
      transactionId: receipt.transactionId,
      recipient: customerEmail,
      subject: `Receipt ${receipt.id} - ${new Date(receipt.generatedAt).toLocaleDateString()}`,
      htmlContent: receipt.htmlContent,
      status: 'queued',
      queuedAt: new Date(),
      attempts: 0,
      maxAttempts: 3,
      lastAttempt: null,
      sentAt: null
    };

    await indexedDBManager.add('emailQueue', emailJob);
    this.emailQueue.push(emailJob);

    console.log(`📧 Receipt queued for email: ${receipt.id} → ${customerEmail}`);
  }

  /**
   * Process print queue
   */
  async processPrintQueue() {
    const pendingJobs = await indexedDBManager.getAll('printQueue');
    const queuedJobs = pendingJobs.filter(job => job.status === 'queued');

    for (const job of queuedJobs) {
      try {
        await this.printReceipt(job);
        job.status = 'completed';
        job.printedAt = new Date();
        
        // Update receipt status
        const receipt = await indexedDBManager.get('receipts', job.receiptId);
        if (receipt) {
          receipt.printStatus = 'printed';
          receipt.printedAt = new Date();
          await indexedDBManager.update('receipts', receipt);
        }

        await indexedDBManager.update('printQueue', job);
        console.log(`✅ Receipt printed: ${job.receiptId}`);
        
      } catch (error) {
        job.attempts += 1;
        job.lastAttempt = new Date();
        
        if (job.attempts >= job.maxAttempts) {
          job.status = 'failed';
          console.error(`❌ Receipt print failed after ${job.maxAttempts} attempts: ${job.receiptId}`);
        } else {
          job.status = 'retry';
          console.warn(`⚠️ Receipt print failed, will retry: ${job.receiptId}`);
        }
        
        await indexedDBManager.update('printQueue', job);
      }
    }

    return queuedJobs.length;
  }

  /**
   * Process email queue
   */
  async processEmailQueue() {
    const pendingJobs = await indexedDBManager.getAll('emailQueue');
    const queuedJobs = pendingJobs.filter(job => job.status === 'queued');

    for (const job of queuedJobs) {
      try {
        await this.sendReceiptEmail(job);
        job.status = 'completed';
        job.sentAt = new Date();
        
        // Update receipt status
        const receipt = await indexedDBManager.get('receipts', job.receiptId);
        if (receipt) {
          receipt.emailStatus = 'sent';
          receipt.emailedAt = new Date();
          await indexedDBManager.update('receipts', receipt);
        }

        await indexedDBManager.update('emailQueue', job);
        console.log(`✅ Receipt emailed: ${job.receiptId} → ${job.recipient}`);
        
      } catch (error) {
        job.attempts += 1;
        job.lastAttempt = new Date();
        
        if (job.attempts >= job.maxAttempts) {
          job.status = 'failed';
          console.error(`❌ Receipt email failed after ${job.maxAttempts} attempts: ${job.receiptId}`);
        } else {
          job.status = 'retry';
          console.warn(`⚠️ Receipt email failed, will retry: ${job.receiptId}`);
        }
        
        await indexedDBManager.update('emailQueue', job);
      }
    }

    return queuedJobs.length;
  }

  /**
   * Print receipt (mock implementation - integrate with actual printer)
   */
  async printReceipt(printJob) {
    // This would integrate with actual printer hardware
    // For now, we'll simulate printing
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        // Simulate printer availability check
        if (Math.random() > 0.1) { // 90% success rate
          resolve();
        } else {
          reject(new Error('Printer not available'));
        }
      }, 1000);
    });
  }

  /**
   * Send receipt email (mock implementation - integrate with email service)
   */
  async sendReceiptEmail(emailJob) {
    // This would integrate with actual email service
    // For now, we'll simulate email sending
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        // Simulate email service availability
        if (Math.random() > 0.05) { // 95% success rate
          resolve();
        } else {
          reject(new Error('Email service not available'));
        }
      }, 2000);
    });
  }

  /**
   * Load receipt templates
   */
  async loadReceiptTemplates() {
    this.receiptTemplates = {
      default: {
        header: {
          companyName: 'OptiMind Retail™',
          address: '123 Business Street, City, State 12345',
          phone: 'Phone: (555) 123-4567',
          website: 'www.optimind-retail.com'
        },
        layout: {
          width: 40,
          showLogo: false,
          showQRCode: false
        },
        footer: {
          message: 'Thank you for your business!',
          returnPolicy: 'Returns accepted within 30 days with receipt',
          support: 'Customer Service: (555) 123-4567'
        }
      },
      minimal: {
        header: {
          companyName: 'OptiMind Retail™'
        },
        layout: {
          width: 32
        },
        footer: {
          message: 'Thank you!'
        }
      }
    };
  }

  /**
   * Get receipt history
   */
  async getReceiptHistory(limit = 50, offset = 0) {
    const allReceipts = await indexedDBManager.getAll('receipts');
    
    const sortedReceipts = allReceipts
      .sort((a, b) => new Date(b.generatedAt) - new Date(a.generatedAt))
      .slice(offset, offset + limit);

    return sortedReceipts;
  }

  /**
   * Get queue status
   */
  async getQueueStatus() {
    const printJobs = await indexedDBManager.getAll('printQueue');
    const emailJobs = await indexedDBManager.getAll('emailQueue');
    
    return {
      printQueue: {
        total: printJobs.length,
        queued: printJobs.filter(j => j.status === 'queued').length,
        processing: printJobs.filter(j => j.status === 'retry').length,
        completed: printJobs.filter(j => j.status === 'completed').length,
        failed: printJobs.filter(j => j.status === 'failed').length
      },
      emailQueue: {
        total: emailJobs.length,
        queued: emailJobs.filter(j => j.status === 'queued').length,
        processing: emailJobs.filter(j => j.status === 'retry').length,
        completed: emailJobs.filter(j => j.status === 'completed').length,
        failed: emailJobs.filter(j => j.status === 'failed').length
      }
    };
  }

  /**
   * Generate unique receipt ID
   */
  generateReceiptId() {
    const timestamp = Date.now().toString(36);
    const random = Math.random().toString(36).substr(2, 5);
    return `RECEIPT_${timestamp}_${random}`.toUpperCase();
  }

  /**
   * Get receipt statistics
   */
  async getReceiptStats() {
    const allReceipts = await indexedDBManager.getAll('receipts');
    const allPrintJobs = await indexedDBManager.getAll('printQueue');
    const allEmailJobs = await indexedDBManager.getAll('emailQueue');
    
    const stats = {
      totalReceipts: allReceipts.length,
      printedReceipts: allReceipts.filter(r => r.printStatus === 'printed').length,
      emailedReceipts: allReceipts.filter(r => r.emailStatus === 'sent').length,
      pendingPrint: allPrintJobs.filter(j => j.status === 'queued').length,
      pendingEmail: allEmailJobs.filter(j => j.status === 'queued').length,
      failedPrint: allPrintJobs.filter(j => j.status === 'failed').length,
      failedEmail: allEmailJobs.filter(j => j.status === 'failed').length
    };

    return stats;
  }
}

// Export singleton instance
const receiptManager = new ReceiptManager();
export default receiptManager;
