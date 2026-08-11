import { Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';
import { AuthRequest } from '../middleware/auth';

const prisma = new PrismaClient();

export const getInvoices = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const invoices = await prisma.invoice.findMany({
      include: {
        customer: true,
        challan: true
      },
      orderBy: { createdAt: 'desc' }
    });
    res.json(invoices);
  } catch (error) {
    next(error);
  }
};

export const createInvoice = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { invoiceNumber, customerId, challanId, totalAmount } = req.body;
    
    // Check if challan is confirmed if provided
    if (challanId) {
      const challan = await prisma.challan.findUnique({ where: { id: challanId } });
      if (!challan) {
        res.status(404);
        throw new Error('Challan not found');
      }
      if (challan.status !== 'CONFIRMED') {
        res.status(400);
        throw new Error('Cannot generate invoice for unconfirmed challan');
      }
    }

    const invoice = await prisma.invoice.create({
      data: {
        invoiceNumber,
        customerId,
        challanId,
        totalAmount: parseFloat(totalAmount), // Assuming frontend sends string or float
        status: 'UNPAID',
        createdBy: req.user!.id
      },
      include: { customer: true, challan: true }
    });
    
    res.status(201).json(invoice);
  } catch (error) {
    next(error);
  }
};

export const payInvoice = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    
    const invoice = await prisma.invoice.findUnique({ where: { id } });
    if (!invoice) {
      res.status(404);
      throw new Error('Invoice not found');
    }
    if (invoice.status === 'PAID') {
      res.status(400);
      throw new Error('Invoice is already paid');
    }

    const updated = await prisma.invoice.update({
      where: { id },
      data: { status: 'PAID' }
    });

    res.json(updated);
  } catch (error) {
    next(error);
  }
};
