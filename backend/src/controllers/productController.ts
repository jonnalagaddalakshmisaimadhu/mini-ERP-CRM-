import { Request, Response } from 'express';
import prisma from '../db';
import { AuthRequest } from '../middleware/auth';

export const getProducts = async (req: Request, res: Response) => {
  try {
    const products = await prisma.product.findMany({
      orderBy: { createdAt: 'desc' }
    });
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch products' });
  }
};

export const getProductById = async (req: Request, res: Response) => {
  try {
    const product = await prisma.product.findUnique({
      where: { id: req.params.id },
      include: { movements: { orderBy: { createdAt: 'desc' } } }
    });
    if (!product) return res.status(404).json({ error: 'Product not found' });
    res.json(product);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch product' });
  }
};

export const createProduct = async (req: AuthRequest, res: Response) => {
  try {
    const data = req.body;
    
    if (!req.user) return res.status(401).json({ error: 'Unauthorized' });

    const product = await prisma.product.create({
      data: {
        name: data.name,
        sku: data.sku,
        category: data.category,
        unitPrice: parseFloat(data.unitPrice),
        currentStock: parseInt(data.currentStock) || 0,
        minStockAlert: parseInt(data.minStockAlert) || 10,
        location: data.location,
        imageUrl: data.imageUrl,
        movements: {
          create: {
            qtyChanged: parseInt(data.currentStock) || 0,
            movementType: 'IN',
            reason: 'Initial Stock',
            createdBy: req.user.id
          }
        }
      }
    });
    res.status(201).json(product);
  } catch (error: any) {
    if (error.code === 'P2002') {
      return res.status(400).json({ error: 'SKU already exists' });
    }
    res.status(400).json({ error: 'Failed to create product' });
  }
};

export const updateProduct = async (req: Request, res: Response) => {
  try {
    const data = req.body;
    const product = await prisma.product.update({
      where: { id: req.params.id },
      data: {
        name: data.name,
        category: data.category,
        unitPrice: parseFloat(data.unitPrice),
        minStockAlert: parseInt(data.minStockAlert),
        location: data.location,
        imageUrl: data.imageUrl
      }
    });
    res.json(product);
  } catch (error) {
    res.status(400).json({ error: 'Failed to update product' });
  }
};

export const addStock = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { qty, reason } = req.body;
    
    if (!req.user) return res.status(401).json({ error: 'Unauthorized' });

    const parsedQty = parseInt(qty);
    if (parsedQty <= 0) return res.status(400).json({ error: 'Quantity must be positive' });

    const updatedProduct = await prisma.$transaction(async (tx) => {
      const product = await tx.product.update({
        where: { id },
        data: { currentStock: { increment: parsedQty } }
      });

      await tx.stockMovement.create({
        data: {
          productId: id,
          qtyChanged: parsedQty,
          movementType: 'IN',
          reason: reason || 'Manual Stock Addition',
          createdBy: req.user!.id
        }
      });

      return product;
    });

    res.json(updatedProduct);
  } catch (error) {
    res.status(400).json({ error: 'Failed to add stock' });
  }
};
