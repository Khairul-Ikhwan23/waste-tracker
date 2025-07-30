import { users, payments, type User, type InsertUser, type Payment, type InsertPayment } from "@shared/schema";

// modify the interface with any CRUD methods
// you might need

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  getPayments(): Promise<Payment[]>;
  insertPayment(payment: InsertPayment): Promise<Payment>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private payments: Map<number, Payment>;
  private currentUserId: number;
  private currentPaymentId: number;

  constructor() {
    this.users = new Map();
    this.payments = new Map();
    this.currentUserId = 1;
    this.currentPaymentId = 1;
    
    // Add some dummy payment data
    this.seedPayments();
  }

  private seedPayments() {
    const dummyPayments = [
      {
        amount: "125.50",
        date: "2025-01-15",
        description: "Monthly waste collection service",
        status: "completed",
        type: "subscription",
        method: "card",
        reference: "TXN001234",
        dueDate: "2025-01-15"
      },
      {
        amount: "75.00",
        date: "2025-01-12",
        description: "Recycling bonus payment",
        status: "pending",
        type: "refund",
        method: "bank_transfer",
        reference: "REF567890",
        dueDate: "2025-01-20"
      },
      {
        amount: "200.00",
        date: "2025-01-10",
        description: "Bulk waste disposal fee",
        status: "completed",
        type: "pickup",
        method: "digital_wallet",
        reference: "TXN002468",
        dueDate: "2025-01-10"
      },
      {
        amount: "45.25",
        date: "2025-01-08",
        description: "Electronic waste processing",
        status: "failed",
        type: "pickup",
        method: "card",
        reference: "TXN003691",
        dueDate: "2025-01-08"
      },
      {
        amount: "90.00",
        date: "2025-01-05",
        description: "Commercial waste pickup",
        status: "completed",
        type: "pickup",
        method: "cash",
        reference: "TXN004820",
        dueDate: "2025-01-05"
      },
      {
        amount: "50.00",
        date: "2025-01-03",
        description: "Late payment penalty",
        status: "pending",
        type: "penalty",
        method: "card",
        reference: "PEN001234",
        dueDate: "2025-01-25"
      },
      {
        amount: "180.00",
        date: "2025-01-01",
        description: "Quarterly subscription fee",
        status: "completed",
        type: "subscription",
        method: "bank_transfer",
        reference: "SUB987654",
        dueDate: "2025-01-01"
      },
      {
        amount: "25.00",
        date: "2024-12-28",
        description: "Express pickup service",
        status: "cancelled",
        type: "pickup",
        method: "digital_wallet",
        reference: "EXP147258",
        dueDate: "2024-12-28"
      }
    ];

    dummyPayments.forEach(payment => {
      const id = this.currentPaymentId++;
      const paymentRecord = {
        ...payment,
        id,
        createdAt: new Date(),
      };
      this.payments.set(id, paymentRecord);
    });
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async getPayments(): Promise<Payment[]> {
    return Array.from(this.payments.values()).sort((a, b) => {
      const dateA = new Date(a.date).getTime();
      const dateB = new Date(b.date).getTime();
      return dateB - dateA; // Sort by date descending
    });
  }

  async insertPayment(insertPayment: InsertPayment): Promise<Payment> {
    const id = this.currentPaymentId++;
    const payment: Payment = {
      ...insertPayment,
      id,
      createdAt: new Date(),
    };
    this.payments.set(id, payment);
    return payment;
  }
}

export const storage = new MemStorage();
