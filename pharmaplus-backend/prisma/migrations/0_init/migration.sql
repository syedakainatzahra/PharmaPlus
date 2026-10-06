-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateEnum
CREATE TYPE "OrderStatus" AS ENUM ('PENDING', 'CONFIRMED', 'PROCESSING', 'OUT_FOR_DELIVERY', 'DELIVERED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "Role" AS ENUM ('CUSTOMER', 'PATIENT', 'DOCTOR', 'PHARMACIST', 'RECEPTIONIST', 'BRANCH_MANAGER', 'WAREHOUSE_MANAGER', 'WAREHOUSE_EMPLOYEE', 'DELIVERY_RIDER', 'SUPER_ADMIN');

-- CreateEnum
CREATE TYPE "UserStatus" AS ENUM ('ACTIVE', 'INACTIVE', 'SUSPENDED', 'ON_LEAVE', 'PENDING', 'REJECTED');

-- CreateEnum
CREATE TYPE "BranchStatus" AS ENUM ('ACTIVE', 'MAINTENANCE', 'DISABLED');

-- CreateEnum
CREATE TYPE "PrescriptionStatus" AS ENUM ('PENDING', 'DISPENSED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "AppointmentType" AS ENUM ('PHYSICAL_CHECKUP', 'XRAY_SCAN', 'LAB_TEST', 'ONLINE_CONSULT');

-- CreateEnum
CREATE TYPE "AppointmentStatus" AS ENUM ('PENDING', 'CONFIRMED', 'COMPLETED', 'CANCELLED', 'REJECTED');

-- CreateEnum
CREATE TYPE "AttendanceStatus" AS ENUM ('PRESENT', 'ABSENT', 'LATE', 'HALF_DAY', 'ON_LEAVE');

-- CreateEnum
CREATE TYPE "DeliveryStatus" AS ENUM ('PENDING', 'ASSIGNED', 'PICKED_UP', 'OUT_FOR_DELIVERY', 'DELIVERED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "DeliveryPriority" AS ENUM ('NORMAL', 'HIGH', 'URGENT');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "fullName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'PATIENT',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "branchId" TEXT,
    "employeeId" TEXT,
    "phone" TEXT,
    "status" "UserStatus" NOT NULL DEFAULT 'ACTIVE',

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Branch" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "code" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "phone" TEXT,
    "status" "BranchStatus" NOT NULL DEFAULT 'ACTIVE',

    CONSTRAINT "Branch_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AuditLog" (
    "id" TEXT NOT NULL,
    "userId" TEXT,
    "action" TEXT NOT NULL,
    "details" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AuditLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Attendance" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "checkIn" TIMESTAMP(3),
    "checkOut" TIMESTAMP(3),
    "status" "AttendanceStatus" NOT NULL DEFAULT 'PRESENT',
    "remarks" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Attendance_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Appointment" (
    "id" TEXT NOT NULL,
    "problem" TEXT NOT NULL,
    "type" "AppointmentType" NOT NULL DEFAULT 'PHYSICAL_CHECKUP',
    "scheduledAt" TIMESTAMP(3),
    "patientId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "branchId" TEXT,
    "doctorId" TEXT,
    "status" "AppointmentStatus" NOT NULL DEFAULT 'PENDING',

    CONSTRAINT "Appointment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Prescription" (
    "id" TEXT NOT NULL,
    "doctorId" TEXT NOT NULL,
    "patientId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "branchId" TEXT,
    "notes" TEXT,
    "status" "PrescriptionStatus" NOT NULL DEFAULT 'PENDING',

    CONSTRAINT "Prescription_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PrescriptionItem" (
    "id" TEXT NOT NULL,
    "prescriptionId" TEXT NOT NULL,
    "medicineName" TEXT NOT NULL,
    "dosage" TEXT NOT NULL,
    "duration" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,

    CONSTRAINT "PrescriptionItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Category" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Category_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Product" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "categoryId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "description" TEXT,
    "stock" INTEGER NOT NULL DEFAULT 0,
    "branchId" TEXT,

    CONSTRAINT "Product_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Medicine" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "brand" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "stock" INTEGER NOT NULL DEFAULT 0,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "branchId" TEXT,

    CONSTRAINT "Medicine_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Delivery" (
    "id" TEXT NOT NULL,
    "orderNumber" TEXT NOT NULL,
    "customerName" TEXT NOT NULL,
    "customerPhone" TEXT NOT NULL,
    "deliveryAddress" TEXT NOT NULL,
    "priority" "DeliveryPriority" NOT NULL DEFAULT 'NORMAL',
    "status" "DeliveryStatus" NOT NULL DEFAULT 'PENDING',
    "branchId" TEXT,
    "riderId" TEXT,
    "createdById" TEXT,
    "assignedAt" TIMESTAMP(3),
    "pickedUpAt" TIMESTAMP(3),
    "deliveredAt" TIMESTAMP(3),
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Delivery_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Warehouse" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "phone" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Warehouse_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WarehouseEmployee" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "warehouseId" TEXT NOT NULL,
    "position" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "WarehouseEmployee_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "inventories" (
    "id" TEXT NOT NULL,
    "sku" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "stock" INTEGER NOT NULL DEFAULT 0,
    "unit_price" DOUBLE PRECISION NOT NULL,
    "branch_id" TEXT,
    "warehouse_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "inventories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Order" (
    "id" TEXT NOT NULL,
    "customerId" TEXT NOT NULL,
    "totalAmount" DOUBLE PRECISION NOT NULL,
    "deliveryFee" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "status" "OrderStatus" NOT NULL DEFAULT 'PENDING',
    "deliveryAddress" TEXT,
    "paymentMethod" TEXT NOT NULL DEFAULT 'COD',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Order_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OrderItem" (
    "id" TEXT NOT NULL,
    "orderId" TEXT NOT NULL,
    "medicineId" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "OrderItem_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_employeeId_key" ON "User"("employeeId");

-- CreateIndex
CREATE INDEX "User_role_idx" ON "User"("role");

-- CreateIndex
CREATE INDEX "User_branchId_idx" ON "User"("branchId");

-- CreateIndex
CREATE INDEX "User_status_idx" ON "User"("status");

-- CreateIndex
CREATE UNIQUE INDEX "Branch_name_key" ON "Branch"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Branch_code_key" ON "Branch"("code");

-- CreateIndex
CREATE INDEX "Branch_status_idx" ON "Branch"("status");

-- CreateIndex
CREATE INDEX "Attendance_userId_idx" ON "Attendance"("userId");

-- CreateIndex
CREATE INDEX "Attendance_date_idx" ON "Attendance"("date");

-- CreateIndex
CREATE INDEX "Attendance_status_idx" ON "Attendance"("status");

-- CreateIndex
CREATE UNIQUE INDEX "Attendance_userId_date_key" ON "Attendance"("userId", "date");

-- CreateIndex
CREATE INDEX "Appointment_patientId_idx" ON "Appointment"("patientId");

-- CreateIndex
CREATE INDEX "Appointment_doctorId_idx" ON "Appointment"("doctorId");

-- CreateIndex
CREATE INDEX "Appointment_branchId_idx" ON "Appointment"("branchId");

-- CreateIndex
CREATE INDEX "Appointment_status_idx" ON "Appointment"("status");

-- CreateIndex
CREATE INDEX "Appointment_scheduledAt_idx" ON "Appointment"("scheduledAt");

-- CreateIndex
CREATE INDEX "Prescription_doctorId_idx" ON "Prescription"("doctorId");

-- CreateIndex
CREATE INDEX "Prescription_patientId_idx" ON "Prescription"("patientId");

-- CreateIndex
CREATE INDEX "Prescription_branchId_idx" ON "Prescription"("branchId");

-- CreateIndex
CREATE INDEX "Prescription_status_idx" ON "Prescription"("status");

-- CreateIndex
CREATE INDEX "PrescriptionItem_prescriptionId_idx" ON "PrescriptionItem"("prescriptionId");

-- CreateIndex
CREATE UNIQUE INDEX "Category_name_key" ON "Category"("name");

-- CreateIndex
CREATE INDEX "Product_branchId_idx" ON "Product"("branchId");

-- CreateIndex
CREATE INDEX "Product_categoryId_idx" ON "Product"("categoryId");

-- CreateIndex
CREATE INDEX "Medicine_branchId_idx" ON "Medicine"("branchId");

-- CreateIndex
CREATE UNIQUE INDEX "Delivery_orderNumber_key" ON "Delivery"("orderNumber");

-- CreateIndex
CREATE INDEX "Delivery_branchId_idx" ON "Delivery"("branchId");

-- CreateIndex
CREATE INDEX "Delivery_riderId_idx" ON "Delivery"("riderId");

-- CreateIndex
CREATE INDEX "Delivery_createdById_idx" ON "Delivery"("createdById");

-- CreateIndex
CREATE INDEX "Delivery_status_idx" ON "Delivery"("status");

-- CreateIndex
CREATE INDEX "Delivery_priority_idx" ON "Delivery"("priority");

-- CreateIndex
CREATE UNIQUE INDEX "Warehouse_code_key" ON "Warehouse"("code");

-- CreateIndex
CREATE INDEX "Warehouse_isActive_idx" ON "Warehouse"("isActive");

-- CreateIndex
CREATE UNIQUE INDEX "WarehouseEmployee_userId_key" ON "WarehouseEmployee"("userId");

-- CreateIndex
CREATE INDEX "WarehouseEmployee_warehouseId_idx" ON "WarehouseEmployee"("warehouseId");

-- CreateIndex
CREATE UNIQUE INDEX "inventories_sku_key" ON "inventories"("sku");

-- CreateIndex
CREATE INDEX "inventories_branch_id_idx" ON "inventories"("branch_id");

-- CreateIndex
CREATE INDEX "inventories_warehouse_id_idx" ON "inventories"("warehouse_id");

-- CreateIndex
CREATE INDEX "Order_customerId_idx" ON "Order"("customerId");

-- CreateIndex
CREATE INDEX "Order_status_idx" ON "Order"("status");

-- CreateIndex
CREATE INDEX "Order_createdAt_idx" ON "Order"("createdAt");

-- CreateIndex
CREATE INDEX "OrderItem_orderId_idx" ON "OrderItem"("orderId");

-- CreateIndex
CREATE INDEX "OrderItem_medicineId_idx" ON "OrderItem"("medicineId");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_branchId_fkey" FOREIGN KEY ("branchId") REFERENCES "Branch"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AuditLog" ADD CONSTRAINT "AuditLog_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Attendance" ADD CONSTRAINT "Attendance_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Appointment" ADD CONSTRAINT "Appointment_branchId_fkey" FOREIGN KEY ("branchId") REFERENCES "Branch"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Appointment" ADD CONSTRAINT "Appointment_doctorId_fkey" FOREIGN KEY ("doctorId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Appointment" ADD CONSTRAINT "Appointment_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Prescription" ADD CONSTRAINT "Prescription_branchId_fkey" FOREIGN KEY ("branchId") REFERENCES "Branch"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Prescription" ADD CONSTRAINT "Prescription_doctorId_fkey" FOREIGN KEY ("doctorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Prescription" ADD CONSTRAINT "Prescription_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PrescriptionItem" ADD CONSTRAINT "PrescriptionItem_prescriptionId_fkey" FOREIGN KEY ("prescriptionId") REFERENCES "Prescription"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_branchId_fkey" FOREIGN KEY ("branchId") REFERENCES "Branch"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Medicine" ADD CONSTRAINT "Medicine_branchId_fkey" FOREIGN KEY ("branchId") REFERENCES "Branch"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Delivery" ADD CONSTRAINT "Delivery_branchId_fkey" FOREIGN KEY ("branchId") REFERENCES "Branch"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Delivery" ADD CONSTRAINT "Delivery_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Delivery" ADD CONSTRAINT "Delivery_riderId_fkey" FOREIGN KEY ("riderId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WarehouseEmployee" ADD CONSTRAINT "WarehouseEmployee_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WarehouseEmployee" ADD CONSTRAINT "WarehouseEmployee_warehouseId_fkey" FOREIGN KEY ("warehouseId") REFERENCES "Warehouse"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "inventories" ADD CONSTRAINT "inventories_branch_id_fkey" FOREIGN KEY ("branch_id") REFERENCES "Branch"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "inventories" ADD CONSTRAINT "inventories_warehouse_id_fkey" FOREIGN KEY ("warehouse_id") REFERENCES "Warehouse"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrderItem" ADD CONSTRAINT "OrderItem_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrderItem" ADD CONSTRAINT "OrderItem_medicineId_fkey" FOREIGN KEY ("medicineId") REFERENCES "Medicine"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
