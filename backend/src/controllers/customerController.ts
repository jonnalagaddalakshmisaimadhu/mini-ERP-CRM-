import { Request, Response, NextFunction } from 'express';
import prisma from '../db';
import { AuthRequest } from '../middleware/auth';

export const getCustomers = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const customers = await prisma.customer.findMany({
      orderBy: { createdAt: 'desc' }
    });
    res.json(customers);
  } catch (error) {
    next(error);
  }
};

export const getCustomerById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const customer = await prisma.customer.findUnique({
      where: { id: req.params.id as string },
      include: { notes: { orderBy: { createdAt: 'desc' } } }
    });
    if (!customer) {
      res.status(404);
      throw new Error('Customer not found');
    }
    res.json(customer);
  } catch (error) {
    next(error);
  }
};

export const createCustomer = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = req.body;
    const customer = await prisma.customer.create({
      data: {
        name: data.name,
        mobile: data.mobile,
        email: data.email,
        businessName: data.businessName,
        gstNumber: data.gstNumber,
        type: data.type,
        address: data.address,
        status: data.status,
        followUpDate: data.followUpDate ? new Date(data.followUpDate) : null
      }
    });
    res.status(201).json(customer);
  } catch (error) {
    next(error);
  }
};

export const updateCustomer = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = req.body;
    const customer = await prisma.customer.update({
      where: { id: req.params.id as string },
      data: {
        name: data.name,
        mobile: data.mobile,
        email: data.email,
        businessName: data.businessName,
        gstNumber: data.gstNumber,
        type: data.type,
        address: data.address,
        status: data.status,
        followUpDate: data.followUpDate ? new Date(data.followUpDate) : null
      }
    });
    res.json(customer);
  } catch (error) {
    next(error);
  }
};

export const addNote = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const id = req.params.id as string;
    const { note } = req.body;
    
    if (!req.user) {
      res.status(401);
      throw new Error('Unauthorized');
    }

    const customerNote = await prisma.customerNote.create({
      data: {
        customerId: id,
        note,
        createdBy: req.user.id
      }
    });
    res.status(201).json(customerNote);
  } catch (error) {
    next(error);
  }
};
