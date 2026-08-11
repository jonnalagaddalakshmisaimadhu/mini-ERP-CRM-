import { Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getDashboardStats = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result: any = await prisma.$queryRaw`
      SELECT COUNT(*) as count 
      FROM "Product" 
      WHERE "currentStock" <= "minStockAlert"
    `;
    const lowStockProductsCount = Number(result[0].count);

    const [totalCustomers, draftChallans, confirmedChallans] = await Promise.all([
      prisma.customer.count(),
      prisma.challan.count({
        where: { status: 'DRAFT' }
      }),
      prisma.challan.count({
        where: { status: 'CONFIRMED' }
      })
    ]);

    res.json({
      totalCustomers,
      lowStockProducts: lowStockProductsCount,
      draftChallans,
      confirmedChallans
    });
  } catch (error) {
    next(error);
  }
};
