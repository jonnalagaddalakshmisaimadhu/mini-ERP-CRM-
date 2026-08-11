import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { AuthRequest } from '../middleware/auth';

const prisma = new PrismaClient();

export const getPOs = async (req: Request, res: Response) => {
  try {
    const pos = await prisma.purchaseOrder.findMany({
      include: {
        items: {
          include: { product: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    });
    res.json(pos);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch purchase orders' });
  }
};

export const createPO = async (req: AuthRequest, res: Response) => {
  try {
    const { poNumber, supplierName, items } = req.body;
    
    const po = await prisma.purchaseOrder.create({
      data: {
        poNumber,
        supplierName,
        status: 'PENDING',
        createdBy: req.user!.id,
        items: {
          create: items.map((item: any) => ({
            productId: item.productId,
            quantity: item.quantity,
            unitCost: item.unitCost
          }))
        }
      },
      include: { items: true }
    });
    
    res.status(201).json(po);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to create purchase order' });
  }
};

export const receivePO = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    
    const po = await prisma.purchaseOrder.findUnique({
      where: { id },
      include: { items: true }
    });
    
    if (!po) return res.status(404).json({ error: 'PO not found' });
    if (po.status === 'RECEIVED') return res.status(400).json({ error: 'PO is already received' });

    // Mark as received and increment stock inside transaction
    await prisma.$transaction(async (tx) => {
      await tx.purchaseOrder.update({
        where: { id },
        data: { status: 'RECEIVED' }
      });
      
      for (const item of po.items) {
        await tx.product.update({
          where: { id: item.productId },
          data: { currentStock: { increment: item.quantity } }
        });
        
        await tx.stockMovement.create({
          data: {
            productId: item.productId,
            qtyChanged: item.quantity,
            movementType: 'IN',
            reason: `PO Received: ${po.poNumber}`,
            createdBy: req.user!.id
          }
        });
      }
    });

    res.json({ message: 'PO received and stock updated successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to receive PO' });
  }
};
