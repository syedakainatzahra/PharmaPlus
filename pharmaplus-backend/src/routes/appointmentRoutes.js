const express = require("express");
const router = express.Router();

const prisma = require("../config/db");
const {
  protect,
  authorize,
} = require("../middlewares/authMiddleware");

// =====================================================
// 1. PATIENT / CUSTOMER → CREATE APPOINTMENT REQUEST
// =====================================================

router.post(
  "/request",
  protect,
  authorize("PATIENT", "CUSTOMER"),
  async (req, res) => {
    try {
      const {
        problem,
        type,
        doctorId,
        branchId,
      } = req.body;

      // -----------------------------------------------
      // Validation
      // -----------------------------------------------

      if (!problem || !problem.trim()) {
        return res.status(400).json({
          success: false,
          message: "Please describe your problem",
        });
      }

      if (!type) {
        return res.status(400).json({
          success: false,
          message: "Appointment type is required",
        });
      }

      if (!doctorId) {
        return res.status(400).json({
          success: false,
          message: "Doctor is required",
        });
      }

      // -----------------------------------------------
      // Check Doctor
      // -----------------------------------------------

      const doctor = await prisma.user.findUnique({
        where: {
          id: doctorId,
        },
        select: {
          id: true,
          fullName: true,
          role: true,
          status: true,
          branchId: true,
        },
      });

      if (!doctor) {
        return res.status(404).json({
          success: false,
          message: "Doctor not found",
        });
      }

      if (doctor.role !== "DOCTOR") {
        return res.status(400).json({
          success: false,
          message: "Selected user is not a doctor",
        });
      }

      if (doctor.status !== "ACTIVE") {
        return res.status(400).json({
          success: false,
          message: "This doctor is currently unavailable",
        });
      }

      // -----------------------------------------------
      // Branch
      // -----------------------------------------------

      const finalBranchId = branchId || doctor.branchId;

      if (!finalBranchId) {
        return res.status(400).json({
          success: false,
          message: "Doctor is not assigned to a branch",
        });
      }

      // -----------------------------------------------
      // Check Branch
      // -----------------------------------------------

      const branch = await prisma.branch.findUnique({
        where: {
          id: finalBranchId,
        },
        select: {
          id: true,
          name: true,
          status: true,
          isActive: true,
        },
      });

      if (!branch) {
        return res.status(404).json({
          success: false,
          message: "Branch not found",
        });
      }

      if (
        branch.status !== "ACTIVE" ||
        !branch.isActive
      ) {
        return res.status(400).json({
          success: false,
          message: "Selected branch is currently unavailable",
        });
      }

      // -----------------------------------------------
      // Create Appointment
      // -----------------------------------------------

      const newAppointment =
        await prisma.appointment.create({
          data: {
            problem: problem.trim(),

            type,

            status: "PENDING",

            patientId: req.user.id,

            doctorId: doctor.id,

            branchId: finalBranchId,
          },

          include: {
            patient: {
              select: {
                id: true,
                fullName: true,
                email: true,
                phone: true,
              },
            },

            doctor: {
              select: {
                id: true,
                fullName: true,
                email: true,
              },
            },

            branch: {
              select: {
                id: true,
                name: true,
                location: true,
              },
            },
          },
        });

      return res.status(201).json({
        success: true,
        message:
          "Appointment request submitted successfully!",
        request: newAppointment,
      });

    } catch (error) {

      console.error(
        "Error creating appointment:",
        error
      );

      return res.status(500).json({
        success: false,
        message:
          "Failed to create appointment request",
        error: error.message,
      });
    }
  }
);


// =====================================================
// 2. PATIENT → GET MY APPOINTMENTS
// =====================================================

router.get(
  "/my-requests",
  protect,
  authorize("PATIENT", "CUSTOMER"),
  async (req, res) => {
    try {

      const requests =
        await prisma.appointment.findMany({
          where: {
            patientId: req.user.id,
          },

          orderBy: {
            createdAt: "desc",
          },

          include: {
            doctor: {
              select: {
                id: true,
                fullName: true,
                email: true,
              },
            },

            branch: {
              select: {
                id: true,
                name: true,
                location: true,
              },
            },
          },
        });

      return res.status(200).json({
        success: true,
        requests,
      });

    } catch (error) {

      console.error(
        "Error fetching patient appointments:",
        error
      );

      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }
);


// =====================================================
// 3. DOCTOR → GET THEIR APPOINTMENT REQUESTS
// =====================================================

router.get(
  "/requests",
  protect,
  authorize("DOCTOR"),
  async (req, res) => {
    try {

      const requests =
        await prisma.appointment.findMany({
          where: {
            doctorId: req.user.id,
          },

          orderBy: {
            createdAt: "desc",
          },

          include: {
            patient: {
              select: {
                id: true,
                fullName: true,
                email: true,
                phone: true,
              },
            },

            branch: {
              select: {
                id: true,
                name: true,
                location: true,
              },
            },
          },
        });

      return res.status(200).json({
        success: true,
        requests,
      });

    } catch (error) {

      console.error(
        "Error fetching doctor appointments:",
        error
      );

      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }
);


// =====================================================
// 4. DOCTOR → CONFIRM APPOINTMENT
// =====================================================

router.put(
  "/confirm/:id",
  protect,
  authorize("DOCTOR"),
  async (req, res) => {
    try {

      const { id } = req.params;
      const { scheduledAt } = req.body;

      // -----------------------------------------------
      // Validate Date
      // -----------------------------------------------

      if (!scheduledAt) {
        return res.status(400).json({
          success: false,
          message: "Appointment date and time are required",
        });
      }

      const appointment =
        await prisma.appointment.findUnique({
          where: {
            id,
          },
        });

      if (!appointment) {
        return res.status(404).json({
          success: false,
          message: "Appointment not found",
        });
      }

      // -----------------------------------------------
      // Doctor can only confirm own appointment
      // -----------------------------------------------

      if (appointment.doctorId !== req.user.id) {
        return res.status(403).json({
          success: false,
          message:
            "You are not authorized to confirm this appointment",
        });
      }

      // -----------------------------------------------
      // Only pending appointment can be confirmed
      // -----------------------------------------------

      if (appointment.status !== "PENDING") {
        return res.status(400).json({
          success: false,
          message:
            "Only pending appointments can be confirmed",
        });
      }

      // -----------------------------------------------
      // Confirm Appointment
      // -----------------------------------------------

      const updatedAppointment =
        await prisma.appointment.update({
          where: {
            id,
          },

          data: {
            scheduledAt: new Date(scheduledAt),
            status: "CONFIRMED",
          },

          include: {
            patient: {
              select: {
                id: true,
                fullName: true,
                email: true,
                phone: true,
              },
            },

            doctor: {
              select: {
                id: true,
                fullName: true,
                email: true,
              },
            },

            branch: {
              select: {
                id: true,
                name: true,
                location: true,
              },
            },
          },
        });

      return res.status(200).json({
        success: true,
        message:
          "Appointment confirmed successfully!",
        request: updatedAppointment,
      });

    } catch (error) {

      console.error(
        "Error confirming appointment:",
        error
      );

      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }
);

// =====================================================
// GET ACTIVE DOCTORS
// =====================================================

router.get(
  "/doctors",
  async (req, res) => {
    try {
      const doctors = await prisma.user.findMany({
        where: {
          role: "DOCTOR",
          status: "ACTIVE",
        },

        select: {
          id: true,
          fullName: true,
          email: true,
          phone: true,
          branchId: true,

          branch: {
            select: {
              id: true,
              name: true,
              code: true,
              location: true,
            },
          },
        },

        orderBy: {
          fullName: "asc",
        },
      });

      return res.status(200).json({
        success: true,
        count: doctors.length,
        doctors,
      });

    } catch (error) {
      console.error("Error fetching doctors:", error);

      return res.status(500).json({
        success: false,
        message: "Failed to fetch doctors",
        error: error.message,
      });
    }
  }
);

module.exports = router;