const express = require("express");
const router = express.Router();
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient(); // Initialize Prisma Client

// POST: Create Invoice
router.post("/invoice", async (req, res) => {
  const { doctorId, status } = req.body;

  if (!doctorId) {
    return res.status(400).json({ error: "Doctor ID is required" });
  }

  try {
    // Check if doctor exists
    const doctor = await prisma.doctors.findUnique({
      where: { id: parseInt(doctorId, 10) }, // Convert String to Integer
    });

    if (!doctor) {
      return res.status(404).json({ error: "Doctor not found" });
    }

    // Create new invoice
    const newInvoice = await prisma.invoice.create({
      data: {
        doctorId: parseInt(doctorId, 10),
        status: status || "Unpaid",
      },
    });

    return res.status(201).json(newInvoice);
  } catch (error) {
    console.error("Error:", error.message);
    return res.status(500).json({ error: "Failed to create invoice" });
  }
});

// GET: Fetch All Invoices
router.get("/invoices", async (req, res) => {
  try {
    const invoices = await prisma.invoice.findMany({
      include: {
        doctor: true,
        invoiceFees: true,
      },
    });

    return res.json(invoices);
  } catch (error) {
    console.error("Error:", error.message);
    return res.status(500).json({ error: "Failed to fetch invoices" });
  }
});

// GET: Fetch Single Doctor
router.get("/invoice/:id", async (req, res) => {
  try {
    const doctorId = parseInt(req.params.id, 10); // Convert String to Integer
    const doctor = await prisma.doctors.findUnique({
      where: { id: doctorId },
    });

    if (!doctor) {
      return res.status(404).json({ error: "Doctor not found" });
    }

    return res.status(200).json(doctor);
  } catch (error) {
    console.error("Error:", error.message);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});




//===================================================================InvoiceServices
// Create InvoiceService
router.post('/invoiceService', async (req, res) => {
  const { description, amount } = req.body;
  try {
    const newService = await prisma.invoiceServices.create({
      data: {
        description,
        amount,
      },
    });
    res.status(201).json(newService);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create InvoiceService' });
  }
});

// Get all InvoiceServices
router.get('/invoiceServices', async (req, res) => {
  try {
    const services = await prisma.invoiceServices.findMany();
    res.status(200).json(services);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch InvoiceServices' });
  }
});

// Get a single InvoiceService by ID
router.get('/invoiceservices/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const service = await prisma.invoiceServices.findUnique({
      where: { id: parseInt(id, 10) },
    });
    if (service) {
      res.status(200).json(service);
    } else {
      res.status(404).json({ error: 'InvoiceService not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch InvoiceService' });
  }
});

// Update an InvoiceService
router.put('/invoiceservices/:id', async (req, res) => {
  const { id } = req.params;
  const { description, amount } = req.body;
  try {
    const updatedService = await prisma.invoiceServices.update({
      where: { id: parseInt(id, 10) },
      data: { description, amount },
    });
    res.status(200).json(updatedService);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update InvoiceService' });
  }
});

// Delete an InvoiceService
router.delete('/invoiceservices/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.invoiceServices.delete({
      where: { id: parseInt(id, 10) },
    });
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete InvoiceService' });
  }
});


//==================================save invoiceFee

// Create InvoiceFee Route
router.post('/invoice-fee', async (req, res) => {
  const { invoiceId, invoiceServiceId, finalAmount } = req.body;

 const parsedFinalAmount = parseFloat(finalAmount);

 if (isNaN(parsedFinalAmount)) {
    return res.status(400).json({ error: 'Invalid finalAmount' });
  }

  try {
    const newInvoiceFee = await prisma.invoiceFee.create({
      data: {
        invoiceId: invoiceId,
        invoiceServiceId: invoiceServiceId,
        finalAmount: finalAmount,
      },
    });

    res.status(201).json(newInvoiceFee);
  } catch (error) {
    console.error('Error creating InvoiceFee:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});


module.exports = router;
