import { Request, Response } from 'express';
import prisma from '../db';
import { AuthRequest } from '../middleware/auth';

export const getChallans = async (req: Request, res: Response) => {
  try {
    const challans = await prisma.challan.findMany({
      include: { customer: true, items: true },
      orderBy: { createdAt: 'desc' }
    });
    res.json(challans);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch challans' });
  }
};

export const getChallanById = async (req: Request, res: Response) => {
  try {
    const challan = await prisma.challan.findUnique({
      where: { id: req.params.id },
      include: { customer: true, items: true }
    });
    if (!challan) return res.status(404).json({ error: 'Challan not found' });
    res.json(challan);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch challan' });
  }
};

export const createChallan = async (req: AuthRequest, res: Response) => {
  try {
    const { customerId, items } = req.body;
    
    if (!req.user) return res.status(401).json({ error: 'Unauthorized' });

    // Generate Challan Number
    const count = await prisma.challan.count();
    const challanNumber = `CH-${new Date().getFullYear()}-${String(count + 1).padStart(4, '0')}`;

    let totalQuantity = 0;
    const challanItemsData: any[] = [];

    for (const item of items) {
      const product = await prisma.product.findUnique({ where: { id: item.productId } });
      if (!product) return res.status(400).json({ error: `Product ${item.productId} not found` });

      totalQuantity += item.quantity;
      challanItemsData.push({
        productId: product.id,
        quantity: item.quantity,
        productSnapshot: {
          name: product.name,
          sku: product.sku,
          unitPrice: product.unitPrice
        }
      });
    }

    const challan = await prisma.challan.create({
      data: {
        challanNumber,
        customerId,
        totalQuantity,
        status: 'DRAFT',
        createdBy: req.user.id,
        items: {
          create: challanItemsData
        }
      },
      include: { items: true }
    });

    res.status(201).json(challan);
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: 'Failed to create challan' });
  }
};

export const confirmChallan = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    if (!req.user) return res.status(401).json({ error: 'Unauthorized' });

    const challan = await prisma.challan.findUnique({
      where: { id },
      include: { items: true }
    });

    if (!challan) return res.status(404).json({ error: 'Challan not found' });
    if (challan.status !== 'DRAFT') return res.status(400).json({ error: 'Only DRAFT challans can be confirmed' });

    await prisma.$transaction(async (tx) => {
      for (const item of challan.items) {
        const product = await tx.product.findUnique({ where: { id: item.productId } });
        
        if (!product || product.currentStock < item.quantity) {
          throw new Error(`Insufficient stock for product ${product?.name || item.productId}. Required: ${item.quantity}, Available: ${product?.currentStock || 0}`);
        }

        await tx.product.update({
          where: { id: item.productId },
          data: { currentStock: { decrement: item.quantity } }
        });

        await tx.stockMovement.create({
          data: {
            productId: item.productId,
            qtyChanged: item.quantity,
            movementType: 'OUT',
            reason: `Sales Challan ${challan.challanNumber}`,
            createdBy: req.user!.id
          }
        });
      }

      await tx.challan.update({
        where: { id },
        data: { status: 'CONFIRMED' }
      });
    });

    const updatedChallan = await prisma.challan.findUnique({ where: { id } });
    res.json(updatedChallan);
  } catch (error: any) {
    res.status(400).json({ error: error.message || 'Failed to confirm challan' });
  }
};
