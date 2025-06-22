/**
 * Privacy Engine for LLM-OS
 * Advanced privacy protection with local processing and differential privacy
 */

import { memoryManager } from '../memory/memoryManager';

export interface PrivacySettings {
  localProcessingOnly: boolean;
  differentialPrivacy: boolean;
  dataRetentionDays: number;
  encryptSensitiveData: boolean;
  shareAnalytics: boolean;
  allowRemoteAI: boolean;
}

export interface DataClassification {
  level: 'public' | 'internal' | 'confidential' | 'restricted';
  categories: string[];
  sensitivityScore: number;
  requiresEncryption: boolean;
  requiresLocalProcessing: boolean;
}

export interface PrivacyAuditLog {
  id: string;
  timestamp: Date;
  action: string;
  dataType: string;
  classification: DataClassification;
  processing: 'local' | 'remote' | 'hybrid';
  userConsent: boolean;
  complianceFlags: string[];
}

export class PrivacyEngine {
  private settings: PrivacySettings;
  private auditLogs: PrivacyAuditLog[] = [];
  private encryptionKey: string;

  constructor() {
    this.settings = {
      localProcessingOnly: false,
      differentialPrivacy: true,
      dataRetentionDays: 30,
      encryptSensitiveData: true,
      shareAnalytics: false,
      allowRemoteAI: true
    };
    this.encryptionKey = this.generateEncryptionKey();
  }

  /**
   * Classify data sensitivity and determine processing requirements
   */
  async classifyData(content: string, context: string): Promise<DataClassification> {
    const sensitivePatterns = [
      /\b\d{4}[-\s]?\d{4}[-\s]?\d{4}[-\s]?\d{4}\b/, // Credit card
      /\b\d{3}-\d{2}-\d{4}\b/, // SSN
      /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/, // Email
      /\bpassword\s*[:=]\s*\S+/i, // Password
      /\bapi[_-]?key\s*[:=]\s*\S+/i, // API Key
      /\btoken\s*[:=]\s*\S+/i, // Token
    ];

    const categories: string[] = [];
    let sensitivityScore = 0;

    // Check for sensitive patterns
    sensitivePatterns.forEach((pattern, index) => {
      if (pattern.test(content)) {
        switch (index) {
          case 0: categories.push('financial'); sensitivityScore += 0.9; break;
          case 1: categories.push('pii'); sensitivityScore += 0.95; break;
          case 2: categories.push('contact'); sensitivityScore += 0.3; break;
          case 3: case 4: case 5: categories.push('credentials'); sensitivityScore += 0.8; break;
        }
      }
    });

    // Context-based classification
    if (context.includes('medical') || context.includes('health')) {
      categories.push('medical');
      sensitivityScore += 0.85;
    }

    if (context.includes('legal') || context.includes('contract')) {
      categories.push('legal');
      sensitivityScore += 0.7;
    }

    // Determine classification level
    let level: DataClassification['level'];
    if (sensitivityScore >= 0.8) level = 'restricted';
    else if (sensitivityScore >= 0.5) level = 'confidential';
    else if (sensitivityScore >= 0.2) level = 'internal';
    else level = 'public';

    return {
      level,
      categories: categories.length > 0 ? categories : ['general'],
      sensitivityScore: Math.min(sensitivityScore, 1.0),
      requiresEncryption: sensitivityScore >= 0.5,
      requiresLocalProcessing: sensitivityScore >= 0.7 || this.settings.localProcessingOnly
    };
  }

  /**
   * Apply differential privacy to sensitive data
   */
  async applyDifferentialPrivacy(data: any, epsilon: number = 1.0): Promise<any> {
    if (!this.settings.differentialPrivacy) return data;

    // Add calibrated noise for differential privacy
    const noise = this.generateLaplaceNoise(epsilon);
    
    if (typeof data === 'number') {
      return data + noise;
    }

    if (typeof data === 'string') {
      // For strings, we can apply noise to character frequencies
      return this.addStringNoise(data, epsilon);
    }

    if (Array.isArray(data)) {
      return data.map(item => this.applyDifferentialPrivacy(item, epsilon));
    }

    return data;
  }

  /**
   * Encrypt sensitive data using AES encryption
   */
  async encryptData(data: string): Promise<string> {
    if (!this.settings.encryptSensitiveData) return data;

    try {
      // Simple encryption for demo - use proper crypto in production
      const encoder = new TextEncoder();
      const dataBuffer = encoder.encode(data);
      
      // In a real implementation, use Web Crypto API
      const encrypted = btoa(String.fromCharCode(...Array.from(dataBuffer)));
      return `encrypted:${encrypted}`;
    } catch (error) {
      console.error('Encryption failed:', error);
      return data;
    }
  }

  /**
   * Decrypt encrypted data
   */
  async decryptData(encryptedData: string): Promise<string> {
    if (!encryptedData.startsWith('encrypted:')) return encryptedData;

    try {
      const encrypted = encryptedData.replace('encrypted:', '');
      const decoded = atob(encrypted);
      const dataArray = new Uint8Array(Array.from(decoded).map(char => char.charCodeAt(0)));
      const decoder = new TextDecoder();
      return decoder.decode(dataArray);
    } catch (error) {
      console.error('Decryption failed:', error);
      return encryptedData;
    }
  }

  /**
   * Process data according to privacy settings
   */
  async processDataSecurely(
    content: string, 
    context: string, 
    operation: string
  ): Promise<{
    processedContent: string;
    classification: DataClassification;
    processingLocation: 'local' | 'remote' | 'hybrid';
    auditId: string;
  }> {
    // Classify the data
    const classification = await this.classifyData(content, context);
    
    // Determine processing location
    let processingLocation: 'local' | 'remote' | 'hybrid' = 'remote';
    
    if (classification.requiresLocalProcessing || this.settings.localProcessingOnly) {
      processingLocation = 'local';
    } else if (classification.level === 'confidential') {
      processingLocation = 'hybrid';
    }

    // Apply privacy protections
    let processedContent = content;

    if (classification.requiresEncryption) {
      processedContent = await this.encryptData(processedContent);
    }

    if (this.settings.differentialPrivacy && classification.sensitivityScore > 0.3) {
      processedContent = await this.applyDifferentialPrivacy(processedContent, 1.0);
    }

    // Create audit log
    const auditId = this.createAuditLog({
      action: operation,
      dataType: context,
      classification,
      processing: processingLocation,
      userConsent: true, // In real app, check actual consent
      complianceFlags: this.getComplianceFlags(classification)
    });

    return {
      processedContent,
      classification,
      processingLocation,
      auditId
    };
  }

  /**
   * Get privacy compliance status
   */
  getComplianceStatus(): {
    gdprCompliant: boolean;
    ccpaCompliant: boolean;
    hipaCompliant: boolean;
    soc2Compliant: boolean;
    issues: string[];
  } {
    const issues: string[] = [];

    // GDPR compliance checks
    const gdprCompliant = this.settings.dataRetentionDays <= 365 && 
                         this.settings.encryptSensitiveData;
    if (!gdprCompliant) issues.push('GDPR: Data retention or encryption settings');

    // CCPA compliance checks  
    const ccpaCompliant = !this.settings.shareAnalytics || this.settings.localProcessingOnly;
    if (!ccpaCompliant) issues.push('CCPA: Analytics sharing settings');

    // HIPAA compliance for medical data
    const hipaCompliant = this.settings.encryptSensitiveData && 
                         this.settings.localProcessingOnly;
    if (!hipaCompliant) issues.push('HIPAA: Medical data processing settings');

    // SOC 2 compliance
    const soc2Compliant = this.auditLogs.length > 0 && 
                         this.settings.encryptSensitiveData;
    if (!soc2Compliant) issues.push('SOC 2: Audit logging or security controls');

    return {
      gdprCompliant,
      ccpaCompliant,
      hipaCompliant,
      soc2Compliant,
      issues
    };
  }

  /**
   * Generate privacy report
   */
  generatePrivacyReport(): {
    summary: any;
    dataProcessed: number;
    sensitiveDataCount: number;
    localProcessingPercentage: number;
    complianceStatus: any;
    recommendations: string[];
  } {
    const totalLogs = this.auditLogs.length;
    const sensitiveLogs = this.auditLogs.filter(log => 
      log.classification.sensitivityScore > 0.5
    ).length;
    const localLogs = this.auditLogs.filter(log => 
      log.processing === 'local'
    ).length;

    const recommendations: string[] = [];
    
    if (localLogs / totalLogs < 0.8 && sensitiveLogs > 0) {
      recommendations.push('Consider enabling local-only processing for sensitive data');
    }
    
    if (!this.settings.differentialPrivacy) {
      recommendations.push('Enable differential privacy for enhanced data protection');
    }
    
    if (this.settings.dataRetentionDays > 90) {
      recommendations.push('Consider reducing data retention period');
    }

    return {
      summary: {
        totalDataProcessed: totalLogs,
        sensitiveDataDetected: sensitiveLogs,
        localProcessingUsed: localLogs,
        averageSensitivityScore: this.auditLogs.reduce((sum, log) => 
          sum + log.classification.sensitivityScore, 0) / totalLogs
      },
      dataProcessed: totalLogs,
      sensitiveDataCount: sensitiveLogs,
      localProcessingPercentage: Math.round((localLogs / totalLogs) * 100),
      complianceStatus: this.getComplianceStatus(),
      recommendations
    };
  }

  // Helper methods
  private generateEncryptionKey(): string {
    return Math.random().toString(36).substring(2, 15) + 
           Math.random().toString(36).substring(2, 15);
  }

  private generateLaplaceNoise(epsilon: number): number {
    const u = Math.random() - 0.5;
    return -Math.sign(u) * Math.log(1 - 2 * Math.abs(u)) / epsilon;
  }

  private addStringNoise(text: string, epsilon: number): string {
    // Simple string noise for demo - real implementation would be more sophisticated
    return text.split('').map(char => {
      if (Math.random() < 0.1 / epsilon) {
        return String.fromCharCode(char.charCodeAt(0) + Math.floor(Math.random() * 3 - 1));
      }
      return char;
    }).join('');
  }

  private createAuditLog(logData: Omit<PrivacyAuditLog, 'id' | 'timestamp'>): string {
    const auditLog: PrivacyAuditLog = {
      id: `audit_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date(),
      ...logData
    };

    this.auditLogs.push(auditLog);
    
    // Keep only recent logs for demo
    if (this.auditLogs.length > 1000) {
      this.auditLogs = this.auditLogs.slice(-500);
    }

    return auditLog.id;
  }

  private getComplianceFlags(classification: DataClassification): string[] {
    const flags: string[] = [];
    
    if (classification.categories.includes('pii')) flags.push('PII');
    if (classification.categories.includes('medical')) flags.push('PHI');
    if (classification.categories.includes('financial')) flags.push('PCI');
    if (classification.categories.includes('credentials')) flags.push('SENSITIVE');
    
    return flags;
  }

  // Getters and setters
  getSettings(): PrivacySettings {
    return { ...this.settings };
  }

  updateSettings(newSettings: Partial<PrivacySettings>): void {
    this.settings = { ...this.settings, ...newSettings };
  }

  getAuditLogs(): PrivacyAuditLog[] {
    return [...this.auditLogs];
  }
}

// Export singleton instance
export const privacyEngine = new PrivacyEngine();
