import { prisma } from '../utils/prisma';

export interface ROISummary {
  cropName: string;
  totalRevenue: number;
  totalExpenses: number;
  netProfit: number;
  roiPercentage: number;
}

export class FinanceService {
  /**
   * Get all financial records (income & expenses)
   */
  static async getRecords() {
    const records = await prisma.financeRecord.findMany({
      orderBy: { date: 'desc' },
    });

    // Fallback seed data if DB is empty
    if (records.length === 0) {
      return [
        {
          id: 'seed-f1',
          cropName: 'Tomato',
          amount: 1200,
          type: 'EXPENSE',
          category: 'ENGRAIS',
          description: 'Achat d\'engrais organiques certifiés SOC2',
          date: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
        },
        {
          id: 'seed-f2',
          cropName: 'Tomato',
          amount: 3500,
          type: 'INCOME',
          category: 'SALES',
          description: 'Vente en gros lot A-12',
          date: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
        },
        {
          id: 'seed-f3',
          cropName: 'Lavender',
          amount: 800,
          type: 'EXPENSE',
          category: 'SEEDS',
          description: 'Semences de lavande fine de Provence',
          date: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000),
        },
        {
          id: 'seed-f4',
          cropName: 'Lavender',
          amount: 2400,
          type: 'INCOME',
          category: 'SALES',
          description: 'Vente d\'huile essentielle distillerie du Sud',
          date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
        },
        {
          id: 'seed-f5',
          cropName: 'Ginseng',
          amount: 3000,
          type: 'EXPENSE',
          category: 'LABOR',
          description: 'Main d\'œuvre préparation des lits de culture',
          date: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000),
        },
        {
          id: 'seed-f6',
          cropName: 'Ginseng',
          amount: 9500,
          type: 'INCOME',
          category: 'SALES',
          description: 'Export de racines séchées vers le marché asiatique',
          date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        },
      ];
    }

    return records;
  }

  /**
   * Create a new finance record
   */
  static async createRecord(data: {
    cropName: string;
    amount: number;
    type: 'INCOME' | 'EXPENSE';
    category: string;
    description?: string;
  }) {
    return prisma.financeRecord.create({
      data: {
        cropName: data.cropName,
        amount: data.amount,
        type: data.type,
        category: data.category,
        description: data.description,
      },
    });
  }

  /**
   * Record a sale and automatically create corresponding INCOME finance record
   */
  static async recordSale(data: {
    cropName: string;
    quantity: number;
    unitPrice: number;
    buyer?: string;
  }) {
    const totalSale = data.quantity * data.unitPrice;

    // 1. Save sale record
    const sale = await prisma.saleRecord.create({
      data: {
        cropName: data.cropName,
        quantity: data.quantity,
        unitPrice: data.unitPrice,
        totalSale,
        buyer: data.buyer,
      },
    });

    // 2. Create financial income record
    await prisma.financeRecord.create({
      data: {
        cropName: data.cropName,
        amount: totalSale,
        type: 'INCOME',
        category: 'SALES',
        description: `Vente de ${data.quantity} unités à ${data.unitPrice}€/u (${data.buyer || 'Acheteur Anonyme'})`,
      },
    });

    return sale;
  }

  /**
   * Calculate ROI per crop
   */
  static async calculateROI(): Promise<ROISummary[]> {
    const records = await prisma.financeRecord.findMany();

    // Fallback seed calculation if empty
    if (records.length === 0) {
      return [
        { cropName: 'Tomato', totalExpenses: 1200, totalRevenue: 3500, netProfit: 2300, roiPercentage: 191.67 },
        { cropName: 'Lavender', totalExpenses: 800, totalRevenue: 2400, netProfit: 1600, roiPercentage: 200.00 },
        { cropName: 'Ginseng', totalExpenses: 3000, totalRevenue: 9500, netProfit: 6500, roiPercentage: 216.67 },
      ];
    }

    const map = new Map<string, { revenue: number; expenses: number }>();

    // Aggregate values
    for (const r of records) {
      const crop = r.cropName;
      if (!map.has(crop)) {
        map.set(crop, { revenue: 0, expenses: 0 });
      }
      const data = map.get(crop)!;
      if (r.type === 'INCOME') {
        data.revenue += r.amount;
      } else {
        data.expenses += r.amount;
      }
    }

    const summaries: ROISummary[] = [];
    map.forEach((value, key) => {
      const netProfit = value.revenue - value.expenses;
      const roiPercentage = value.expenses > 0 ? (netProfit / value.expenses) * 100 : 100;
      summaries.push({
        cropName: key,
        totalRevenue: Number(value.revenue.toFixed(2)),
        totalExpenses: Number(value.expenses.toFixed(2)),
        netProfit: Number(netProfit.toFixed(2)),
        roiPercentage: Number(roiPercentage.toFixed(2)),
      });
    });

    return summaries;
  }
}
