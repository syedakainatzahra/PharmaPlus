const prisma = require('../config/db');

// 1. Create Prescription
const createPrescription = async (req, res) => {
  try {
   
    const { patientId, branchId, medicines, instructions, notes } = req.body;
    const doctorId = req.user.id;
    if (!patientId) {
      return res.status(400).json({ success: false, message: 'Patient ID ya Email zaroori hai!' });
    }

    if (!medicines || !Array.isArray(medicines) || medicines.length === 0) {
      return res.status(400).json({ success: false, message: 'Kam se kam ek medicine add karna zaroori hai!' });
    }

    const patient = await prisma.user.findFirst({
      where: {
        OR: [{ id: patientId }, { email: patientId }]
      }
    });

    if (!patient) {
      return res.status(404).json({ success: false, message: 'Patient nahi mila!' });
    }

    let targetBranchId = branchId || req.user?.branchId || req.user?.branch?.id;
    if (!targetBranchId) {
      const defaultBranch = await prisma.branch.findFirst();
      targetBranchId = defaultBranch?.id || null;
    }

    if (!targetBranchId) {
      return res.status(400).json({ success: false, message: 'Database me koi Branch maujood nahi hai!' });
    }

    const prescription = await prisma.prescription.create({
      data: {
        doctorId,
        patientId: patient.id,
        branchId: targetBranchId,
        notes: notes || instructions || '',
        status: 'PENDING',
        items: {
          create: medicines.map((med) => ({
            medicineName: med.medicineName || med.name,
            dosage: med.dosage || 'As directed',
            duration: med.duration || '5 days',
            quantity: Math.max(1, Number(med.quantity) || 1)
          }))
        }
      },
      include: {
        patient: { select: { fullName: true, email: true } },
        doctor: { select: { fullName: true, email: true } },
        items: true,
        branch: { select: { name: true } }
      }
    });

    return res.status(201).json({
      success: true,
      message: 'Prescription issued successfully! 📝',
      prescription,
    });
  } catch (error) {
    console.error("Prescription Creation Error:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// 2. Get My Prescriptions (Pagination)
const getMyPrescriptions = async (req, res) => {
  try {
    const userId = req.user?.id;
    const userRole = req.user?.role;

    if (!userId) {
      return res.status(200).json({ success: true, data: [], pagination: {} });
    }

    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.max(1, parseInt(req.query.limit) || 10);
    const skip = (page - 1) * limit;

    const isDoctor = userRole === 'DOCTOR';
    const whereClause = isDoctor ? { doctorId: userId } : { patientId: userId };
    const includeSelect = isDoctor 
      ? { patient: { select: { id: true, fullName: true, email: true } } }
      : { doctor: { select: { id: true, fullName: true, email: true } } };

    const [totalPrescriptions, prescriptions] = await prisma.$transaction([
      prisma.prescription.count({ where: whereClause }),
      prisma.prescription.findMany({
        where: whereClause,
        include: {
          ...includeSelect,
          items: true,
          branch: { select: { name: true } }
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      })
    ]);

    const totalPages = Math.ceil(totalPrescriptions / limit) || 1;

    return res.status(200).json({
      success: true,
      data: prescriptions || [],
      pagination: {
        totalItems: totalPrescriptions,
        currentPage: page,
        totalPages,
        limit,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1
      }
    });
  } catch (error) {
    console.error("getMyPrescriptions Error:", error);
    return res.status(200).json({ success: true, data: [], pagination: {} });
  }
};

// 3. Get Recent Prescriptions
const getRecentPrescriptions = async (req, res) => {
  try {
    const userId = req.user?.id;
    const userRole = req.user?.role;

    if (!userId) {
      return res.status(200).json({ success: true, count: 0, prescriptions: [] });
    }

    const whereClause = (userRole === 'DOCTOR') ? { doctorId: userId } : {};

    const prescriptions = await prisma.prescription.findMany({
      where: whereClause,
      take: 10,
      include: {
        patient: { select: { id: true, fullName: true, email: true } },
        items: true,
        branch: { select: { name: true } }
      },
      orderBy: { createdAt: 'desc' },
    });

    return res.status(200).json({ 
      success: true, 
      count: prescriptions.length, 
      prescriptions: prescriptions || [] 
    });
  } catch (error) {
    console.error("🔥 RECENT PRESCRIPTIONS ERROR:", error);
    return res.status(200).json({ success: true, count: 0, prescriptions: [] });
  }
};

// 4. Get All Prescriptions
const getAllPrescriptions = async (req, res) => {
  try {
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.max(1, parseInt(req.query.limit) || 10);
    const skip = (page - 1) * limit;

    const [totalPrescriptions, prescriptions] = await prisma.$transaction([
      prisma.prescription.count(),
      prisma.prescription.findMany({
        include: {
          patient: { select: { fullName: true, email: true } },
          doctor: { select: { fullName: true, email: true } },
          items: true,
          branch: { select: { name: true } }
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      })
    ]);

    const totalPages = Math.ceil(totalPrescriptions / limit) || 1;

    return res.status(200).json({
      success: true,
      data: prescriptions || [],
      pagination: {
        totalItems: totalPrescriptions,
        currentPage: page,
        totalPages,
        limit,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1
      }
    });
  } catch (error) {
    return res.status(200).json({ success: true, data: [] });
  }
};

// 5. Dispense Prescription
const dispensePrescription = async (req, res) => {
  try {
    const { prescriptionId, medicineUpdates } = req.body; 

    if (!prescriptionId) {
      return res.status(400).json({ success: false, message: 'Prescription ID zaroori hai!' });
    }

    const prescription = await prisma.prescription.findUnique({
      where: { id: prescriptionId },
      include: { items: true }
    });

    if (!prescription) {
      return res.status(404).json({ success: false, message: 'Prescription nahi mili!' });
    }

    if (prescription.status === 'DISPENSED') {
      return res.status(400).json({ success: false, message: 'Yeh prescription pehle hi dispense ho chuki hai!' });
    }

    await prisma.$transaction(async (tx) => {
      if (Array.isArray(medicineUpdates) && medicineUpdates.length > 0) {
        for (const item of medicineUpdates) {
          if (item.id) {
            const qty = Number(item.quantity) || 1;
            const existingMed = await tx.medicine.findUnique({ where: { id: item.id } });
            if (!existingMed || existingMed.stock < qty) {
              throw new Error(`Insufficient stock for medicine: ${existingMed?.name || item.id}`);
            }

            await tx.medicine.update({
              where: { id: item.id },
              data: { stock: { decrement: qty } },
            });
          }
        }
      }

      await tx.prescription.update({
        where: { id: prescriptionId },
        data: { status: 'DISPENSED' },
      });
    });

    return res.status(200).json({
      success: true,
      message: '✅ Prescription successfully dispense ho gayi!',
    });
  } catch (error) {
    console.error('Dispense Error:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// 6. Get All Patients List (Dropdown & Connected Patients Fix)
const getPatientsList = async (req, res) => {
  try {
    const userRole = req.user?.role;
    const userBranchId = req.user?.branchId || req.user?.branch?.id;

    // Database mein Role Case Insensitive Search ('PATIENT' ya 'patient')
    const whereClause = {
      role: {
        equals: 'PATIENT',
        mode: 'insensitive' // Single/Capital letters issue fix
      }
    };

    // Agar DOCTOR hai aur uski branch linked hai
    if (userRole === 'DOCTOR' && userBranchId) {
      whereClause.branchId = userBranchId;
    }

    const patients = await prisma.user.findMany({
      where: whereClause,
      select: {
        id: true,
        fullName: true,
        email: true,
        branchId: true
      },
      orderBy: { fullName: 'asc' }
    });

    return res.status(200).json({ 
      success: true, 
      count: patients.length, 
      patients 
    });
  } catch (error) {
    console.error("Get Patients Error:", error);
    return res.status(200).json({ success: true, count: 0, patients: [] });
  }
};

// 7. Get All Medicines Inventory
const getAllMedicines = async (req, res) => {
  try {
    const medicines = await prisma.medicine.findMany({
      orderBy: { name: 'asc' },
    });
    return res.status(200).json({ success: true, count: medicines.length, medicines: medicines || [] });
  } catch (error) {
    console.error("Get Medicines Error:", error);
    return res.status(200).json({ success: true, count: 0, medicines: [] });
  }
};
// 8. Customer/Patient Prescription File Upload
const uploadPrescriptionFile = async (req, res) => {
  try {
   
    const patientId = req.user?.id;

    if (!patientId) {
      return res.status(401).json({
        success: false,
        message: 'User authentication required!',
      });
    }

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Prescription file upload karna zaroori hai!',
      });
    }

    // Logged-in user's branch
    const branchId =
      req.user?.branchId ||
      req.user?.branch?.id ||
      null;

    const fileUrl = `/uploads/prescriptions/${req.file.filename}`;

    const prescription = await prisma.prescription.create({
      data: {
        patientId,
        doctorId: null,
        branchId,
        fileUrl,
        fileName: req.file.originalname,
        fileType: req.file.mimetype,
        notes: req.body?.notes || null,
        status: 'PENDING',
      },
      include: {
        patient: {
          select: {
            id: true,
            fullName: true,
            email: true,
          },
        },
        branch: {
          select: {
            name: true,
          },
        },
      },
    });

    return res.status(201).json({
      success: true,
      message: 'Prescription successfully upload ho gayi! 📝',
      prescription,
    });
  } catch (error) {
    console.error('Prescription Upload Error:', error);

    return res.status(500).json({
      success: false,
      message: error.message || 'Prescription upload failed!',
    });
  }
};

module.exports = {
  createPrescription,
  getMyPrescriptions,
  getRecentPrescriptions,
  getAllPrescriptions,
  uploadPrescriptionFile,
  dispensePrescription,
  getPatientsList,
  getAllMedicines,
};