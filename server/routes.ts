import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertPaymentSchema, insertFacilitySchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Payments routes
  app.get('/api/payments', async (req, res) => {
    try {
      const payments = await storage.getPayments();
      res.json(payments);
    } catch (error) {
      console.error('Error fetching payments:', error);
      res.status(500).json({ error: 'Failed to fetch payments' });
    }
  });

  app.post('/api/payments', async (req, res) => {
    try {
      const validationResult = insertPaymentSchema.safeParse(req.body);
      if (!validationResult.success) {
        return res.status(400).json({ error: validationResult.error.errors });
      }
      
      const payment = await storage.insertPayment(validationResult.data);
      res.json(payment);
    } catch (error) {
      console.error('Error creating payment:', error);
      res.status(500).json({ error: 'Failed to create payment' });
    }
  });

  // Facilities routes
  app.get('/api/facilities', async (req, res) => {
    try {
      const facilities = await storage.getFacilities();
      res.json(facilities);
    } catch (error) {
      console.error('Error fetching facilities:', error);
      res.status(500).json({ error: 'Failed to fetch facilities' });
    }
  });

  app.get('/api/facilities/:id', async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const facility = await storage.getFacility(id);
      if (!facility) {
        return res.status(404).json({ error: 'Facility not found' });
      }
      res.json(facility);
    } catch (error) {
      console.error('Error fetching facility:', error);
      res.status(500).json({ error: 'Failed to fetch facility' });
    }
  });

  app.post('/api/facilities', async (req, res) => {
    try {
      const validationResult = insertFacilitySchema.safeParse(req.body);
      if (!validationResult.success) {
        return res.status(400).json({ error: validationResult.error.errors });
      }
      
      const facility = await storage.createFacility(validationResult.data);
      res.json(facility);
    } catch (error) {
      console.error('Error creating facility:', error);
      res.status(500).json({ error: 'Failed to create facility' });
    }
  });

  app.put('/api/facilities/:id', async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const validationResult = insertFacilitySchema.partial().safeParse(req.body);
      if (!validationResult.success) {
        return res.status(400).json({ error: validationResult.error.errors });
      }
      
      const facility = await storage.updateFacility(id, validationResult.data);
      if (!facility) {
        return res.status(404).json({ error: 'Facility not found' });
      }
      res.json(facility);
    } catch (error) {
      console.error('Error updating facility:', error);
      res.status(500).json({ error: 'Failed to update facility' });
    }
  });

  app.delete('/api/facilities/:id', async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const success = await storage.deleteFacility(id);
      if (!success) {
        return res.status(404).json({ error: 'Facility not found' });
      }
      res.json({ success: true });
    } catch (error) {
      console.error('Error deleting facility:', error);
      res.status(500).json({ error: 'Failed to delete facility' });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
