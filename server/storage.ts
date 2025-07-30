import { users, payments, facilities, type User, type InsertUser, type Payment, type InsertPayment, type Facility, type InsertFacility } from "@shared/schema";

// modify the interface with any CRUD methods
// you might need

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  getPayments(): Promise<Payment[]>;
  insertPayment(payment: InsertPayment): Promise<Payment>;
  
  // Facility operations
  getFacilities(): Promise<Facility[]>;
  getFacility(id: number): Promise<Facility | undefined>;
  createFacility(insertFacility: InsertFacility): Promise<Facility>;
  updateFacility(id: number, facilityData: Partial<InsertFacility>): Promise<Facility | undefined>;
  deleteFacility(id: number): Promise<boolean>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private payments: Map<number, Payment>;
  private facilities: Map<number, Facility>;
  private currentUserId: number;
  private currentPaymentId: number;
  private currentFacilityId: number;

  constructor() {
    this.users = new Map();
    this.payments = new Map();
    this.facilities = new Map();
    this.currentUserId = 1;
    this.currentPaymentId = 1;
    this.currentFacilityId = 1;
    
    // Add some dummy payment data
    this.seedPayments();
    // Add some dummy facility data
    this.seedFacilities();
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

  private seedFacilities() {
    const dummyFacilities = [
      {
        name: "Brunei Recycling Centre",
        category: "recycling_center",
        latitude: "4.8895",
        longitude: "114.9420",
        address: "Jalan Sungai Kedayan, Bandar Seri Begawan",
        district: "Brunei-Muara",
        phone: "+673 2332211",
        email: "info@bruneirecycling.bn",
        website: "www.bruneirecycling.bn",
        description: "Main recycling facility for paper, plastic, and metal materials",
        operatingHours: "Monday-Friday: 8:00 AM - 5:00 PM, Saturday: 8:00 AM - 12:00 PM",
        acceptedMaterials: ["Paper", "Plastic", "Metal", "Glass"],
        isActive: true,
      },
      {
        name: "Seria Waste Collection Point",
        category: "collection_facility",
        latitude: "4.6065",
        longitude: "114.3247",
        address: "Jalan Tengah, Seria",
        district: "Belait",
        phone: "+673 3223344",
        email: "seria@wastemanagement.bn",
        description: "Primary waste collection facility for Belait district",
        operatingHours: "Daily: 7:00 AM - 6:00 PM",
        acceptedMaterials: ["General Waste", "Organic", "Recyclables"],
        isActive: true,
      },
      {
        name: "Tutong Drop-off Point",
        category: "drop_off_point",
        latitude: "4.8032",
        longitude: "114.6491",
        address: "Pekan Tutong, Tutong",
        district: "Tutong",
        phone: "+673 4112233",
        description: "Community drop-off point for recyclable materials",
        operatingHours: "24/7 Access",
        acceptedMaterials: ["Paper", "Plastic", "Cans"],
        isActive: true,
      },
    ];

    dummyFacilities.forEach(facility => {
      const id = this.currentFacilityId++;
      const facilityRecord = {
        ...facility,
        id,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      this.facilities.set(id, facilityRecord);
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

  // Facility methods
  async getFacilities(): Promise<Facility[]> {
    return Array.from(this.facilities.values()).filter(f => f.isActive);
  }

  async getFacility(id: number): Promise<Facility | undefined> {
    return this.facilities.get(id);
  }

  async createFacility(insertFacility: InsertFacility): Promise<Facility> {
    const id = this.currentFacilityId++;
    const facility: Facility = {
      ...insertFacility,
      id,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.facilities.set(id, facility);
    return facility;
  }

  async updateFacility(id: number, facilityData: Partial<InsertFacility>): Promise<Facility | undefined> {
    const existing = this.facilities.get(id);
    if (!existing) return undefined;

    const updated: Facility = {
      ...existing,
      ...facilityData,
      updatedAt: new Date(),
    };
    this.facilities.set(id, updated);
    return updated;
  }

  async deleteFacility(id: number): Promise<boolean> {
    const existing = this.facilities.get(id);
    if (!existing) return false;

    // Soft delete by setting isActive to false
    const updated: Facility = {
      ...existing,
      isActive: false,
      updatedAt: new Date(),
    };
    this.facilities.set(id, updated);
    return true;
  }
}

export const storage = new MemStorage();
