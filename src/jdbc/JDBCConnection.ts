import { JdbcLogEntry } from '../types';
import { mysqlEngine } from '../database/mysqlEngine';

type JdbcListener = (log: JdbcLogEntry) => void;

class JDBCConnectionPool {
  private url = 'jdbc:mysql://localhost:3306/student_management_db?useSSL=false&serverTimezone=UTC&allowPublicKeyRetrieval=true';
  private user = 'root';
  private activeConnections = 4;
  private maxPoolSize = 10;
  private listeners: JdbcListener[] = [];
  private logs: JdbcLogEntry[] = [];

  constructor() {
    this.addLog({
      id: 'init-1',
      timestamp: new Date().toLocaleTimeString(),
      daoMethod: 'DriverManager.getConnection()',
      sql: '/* MySQL Handshake & Auth */ CONNECT TO `student_management_db`@`localhost:3306`',
      params: ['root', '********'],
      executionTimeMs: 4,
      rowsAffected: 0,
      status: 'SUCCESS',
      javaCode: `Connection conn = DriverManager.getConnection("${this.url}", "${this.user}", "********");`
    });
  }

  public subscribe(listener: JdbcListener): () => void {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  public getLogs(): JdbcLogEntry[] {
    return [...this.logs];
  }

  public clearLogs() {
    this.logs = [];
  }

  public addLog(entry: JdbcLogEntry) {
    this.logs.unshift(entry);
    if (this.logs.length > 100) {
      this.logs.pop();
    }
    this.listeners.forEach(fn => fn(entry));
  }

  public getPoolInfo() {
    return {
      url: this.url,
      user: this.user,
      activeConnections: this.activeConnections,
      maxPoolSize: this.maxPoolSize,
      database: 'student_management_db',
      serverVersion: 'MySQL 8.0.35 Community Server',
      driverVersion: 'com.mysql.cj.jdbc.Driver 8.2.0'
    };
  }

  /**
   * Simulates a prepared statement execution and records the JDBC wire protocol log
   */
  public executePreparedStatement<T>(
    daoMethod: string,
    sql: string,
    params: (string | number | boolean | null)[],
    operation: () => T,
    javaCodeSample: string
  ): T {
    const start = performance.now();
    try {
      const result = operation();
      const elapsed = Math.round(performance.now() - start) || 1;

      this.addLog({
        id: Math.random().toString(36).substring(2, 9),
        timestamp: new Date().toLocaleTimeString(),
        daoMethod,
        sql,
        params,
        executionTimeMs: elapsed,
        rowsAffected: typeof result === 'number' ? result : Array.isArray(result) ? result.length : 1,
        status: 'SUCCESS',
        javaCode: javaCodeSample
      });

      return result;
    } catch (err: any) {
      const elapsed = Math.round(performance.now() - start) || 1;
      this.addLog({
        id: Math.random().toString(36).substring(2, 9),
        timestamp: new Date().toLocaleTimeString(),
        daoMethod,
        sql,
        params,
        executionTimeMs: elapsed,
        status: 'ERROR',
        errorMessage: err.message,
        javaCode: javaCodeSample
      });
      throw err;
    }
  }
}

export const jdbcPool = new JDBCConnectionPool();
