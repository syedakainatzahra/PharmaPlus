const prisma = require('../config/db');

// =====================================================
// CREATE ORDER / CHECKOUT
// =====================================================

const createOrder = async (req, res) => {
  try {
    const userId = req.user.id;

    const {
      items,
      deliveryAddress,
      paymentMethod = 'COD',
    } = req.body;

    // -------------------------------------------------
    // Validate Items
    // -------------------------------------------------

    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Cart is empty',
      });
    }

    // -------------------------------------------------
    // Only Customer / Patient Can Place Orders
    // -------------------------------------------------

    if (
      req.user.role !== 'CUSTOMER' &&
      req.user.role !== 'PATIENT'
    ) {
      return res.status(403).json({
        success: false,
        message: 'Only customers and patients can place orders',
      });
    }

    // -------------------------------------------------
    // Validate Delivery Address
    // -------------------------------------------------

    if (!deliveryAddress || deliveryAddress.trim() === '') {
      return res.status(400).json({
        success: false,
        message: 'Delivery address is required',
      });
    }

    // -------------------------------------------------
    // Get Medicine IDs
    // -------------------------------------------------

    const medicineIds = items.map((item) => item.medicineId);

    const medicines = await prisma.medicine.findMany({
      where: {
        id: {
          in: medicineIds,
        },
      },
    });

    // -------------------------------------------------
    // Check All Medicines Exist
    // -------------------------------------------------

    if (medicines.length !== medicineIds.length) {
      return res.status(400).json({
        success: false,
        message: 'One or more medicines were not found',
      });
    }

    // -------------------------------------------------
    // Validate Quantity + Stock
    // -------------------------------------------------

    for (const item of items) {
      const medicine = medicines.find(
        (med) => med.id === item.medicineId
      );

      const quantity = Number(item.quantity);

      if (!Number.isInteger(quantity) || quantity <= 0) {
        return res.status(400).json({
          success: false,
          message: `Invalid quantity for ${medicine.name}`,
        });
      }

      if (medicine.stock < quantity) {
        return res.status(400).json({
          success: false,
          message: `Insufficient stock for ${medicine.name}. Available stock: ${medicine.stock}`,
        });
      }
    }

    // -------------------------------------------------
    // Calculate Subtotal
    // -------------------------------------------------

    let subtotal = 0;

    const orderItemsData = items.map((item) => {
      const medicine = medicines.find(
        (med) => med.id === item.medicineId
      );

      const quantity = Number(item.quantity);
      const price = Number(medicine.price);

      subtotal += price * quantity;

      return {
        medicineId: medicine.id,
        quantity,
        price,
      };
    });

    // -------------------------------------------------
    // Delivery Fee
    // -------------------------------------------------

    const deliveryFee =
      subtotal > 2000 ? 0 : 150;

    const totalAmount =
      subtotal + deliveryFee;

    // -------------------------------------------------
    // Create Order + Order Items
    // -------------------------------------------------

    const order = await prisma.$transaction(async (tx) => {

      // ---------------------------------------------
      // Create Order
      // ---------------------------------------------

      const newOrder = await tx.order.create({
        data: {
          customerId: userId,
          totalAmount,
          deliveryFee,
          deliveryAddress: deliveryAddress.trim(),
          paymentMethod,

          items: {
            create: orderItemsData,
          },
        },

        include: {
          items: {
            include: {
              medicine: true,
            },
          },
        },
      });

      // ---------------------------------------------
      // Reduce Medicine Stock
      // ---------------------------------------------

      for (const item of orderItemsData) {
        await tx.medicine.update({
          where: {
            id: item.medicineId,
          },

          data: {
            stock: {
              decrement: item.quantity,
            },
          },
        });
      }

      return newOrder;
    });

    // -------------------------------------------------
    // Success Response
    // -------------------------------------------------

    return res.status(201).json({
      success: true,
      message: 'Order placed successfully',
      order,
    });

  } catch (error) {

    console.error(
      'Create Order Error:',
      error
    );

    return res.status(500).json({
      success: false,
      message: 'Failed to place order',
      error: error.message,
    });
  }
};


// =====================================================
// GET MY ORDERS
// =====================================================

const getMyOrders = async (req, res) => {
  try {

    const userId = req.user.id;

    const orders = await prisma.order.findMany({
      where: {
        customerId: userId,
      },

      include: {
        items: {
          include: {
            medicine: true,
          },
        },
      },

      orderBy: {
        createdAt: 'desc',
      },
    });

    return res.status(200).json({
      success: true,
      count: orders.length,
      orders,
    });

  } catch (error) {

    console.error(
      'Get My Orders Error:',
      error
    );

    return res.status(500).json({
      success: false,
      message: 'Failed to fetch orders',
      error: error.message,
    });
  }
};


// =====================================================
// GET SINGLE ORDER
// =====================================================

const getOrderById = async (req, res) => {
  try {

    const userId = req.user.id;
    const { id } = req.params;

    const order = await prisma.order.findFirst({
      where: {
        id,
        customerId: userId,
      },

      include: {
        items: {
          include: {
            medicine: true,
          },
        },
      },
    });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found',
      });
    }

    return res.status(200).json({
      success: true,
      order,
    });

  } catch (error) {

    console.error(
      'Get Order Error:',
      error
    );

    return res.status(500).json({
      success: false,
      message: 'Failed to fetch order',
      error: error.message,
    });
  }
};


// =====================================================
// CANCEL ORDER
// =====================================================

const cancelOrder = async (req, res) => {
  try {

    const userId = req.user.id;
    const { id } = req.params;

    const order = await prisma.order.findFirst({
      where: {
        id,
        customerId: userId,
      },
    });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found',
      });
    }

    if (
      order.status === 'DELIVERED' ||
      order.status === 'CANCELLED'
    ) {
      return res.status(400).json({
        success: false,
        message: `Order cannot be cancelled because it is already ${order.status.toLowerCase()}`,
      });
    }

    const cancelledOrder = await prisma.$transaction(
      async (tx) => {

        // -------------------------------------------
        // Restore Medicine Stock
        // -------------------------------------------

        const orderItems =
          await tx.orderItem.findMany({
            where: {
              orderId: order.id,
            },
          });

        for (const item of orderItems) {

          await tx.medicine.update({
            where: {
              id: item.medicineId,
            },

            data: {
              stock: {
                increment: item.quantity,
              },
            },
          });

        }

        // -------------------------------------------
        // Cancel Order
        // -------------------------------------------

        return await tx.order.update({
          where: {
            id: order.id,
          },

          data: {
            status: 'CANCELLED',
          },

          include: {
            items: {
              include: {
                medicine: true,
              },
            },
          },
        });
      }
    );

    return res.status(200).json({
      success: true,
      message: 'Order cancelled successfully',
      order: cancelledOrder,
    });

  } catch (error) {

    console.error(
      'Cancel Order Error:',
      error
    );

    return res.status(500).json({
      success: false,
      message: 'Failed to cancel order',
      error: error.message,
    });
  }
};


// =====================================================
// EXPORTS
// =====================================================

module.exports = {
  createOrder,
  getMyOrders,
  getOrderById,
  cancelOrder,
};