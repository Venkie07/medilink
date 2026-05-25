import { z } from 'zod';

export const loginSchema = z.object({
  body: z.object({
    userId: z.string().min(1, 'User ID is required'),
    password: z.string().min(1, 'Password is required'),
  }),
});

export const createUserSchema = z.object({
  body: z.object({
    userId: z.string().min(3, 'User ID must be at least 3 characters'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    name: z.string().min(2, 'Name must be at least 2 characters'),
    role: z.enum(['Admin', 'Doctor', 'Patient', 'Lab Technician', 'Pharmacy'], {
      errorMap: () => ({ message: 'Invalid user role specified' }),
    }),
    email: z.string().email('Invalid email address').optional().or(z.literal('')),
    mobile: z.string().regex(/^\d{10}$/, 'Mobile must be a valid 10-digit number').optional().or(z.literal('')),
    address: z.string().optional().or(z.literal('')),
    hospitalName: z.string().optional().or(z.literal('')),
    certifiedId: z.string().optional().or(z.literal('')),
  }),
});

export const registerPatientSchema = z.object({
  body: z.object({
    userId: z.string().min(3, 'User ID must be at least 3 characters'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    name: z.string().min(2, 'Name must be at least 2 characters'),
    age: z.number().int().min(0, 'Age cannot be negative').max(120, 'Invalid age'),
    gender: z.enum(['Male', 'Female', 'Other']),
    bloodGroup: z.enum(['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']),
    allergies: z.string().optional().or(z.literal('')),
    mobile: z.string().regex(/^\d{10}$/, 'Mobile must be a valid 10-digit number'),
    email: z.string().email('Invalid email address'),
    address: z.string().min(5, 'Address must be at least 5 characters'),
  }),
});

export const createAppointmentSchema = z.object({
  body: z.object({
    patientId: z.string().uuid('Invalid Patient ID structure'),
    date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must follow YYYY-MM-DD format'),
    time: z.string().regex(/^\d{2}:\d{2}$/, 'Time must follow HH:MM format'),
    reason: z.string().min(3, 'Reason must be at least 3 characters'),
  }),
});

export const createPrescriptionSchema = z.object({
  body: z.object({
    patientId: z.string().uuid('Invalid Patient ID structure'),
    medications: z.array(
      z.object({
        name: z.string().min(1, 'Medication name is required'),
        dosage: z.string().min(1, 'Dosage is required'),
        frequency: z.string().min(1, 'Frequency is required'),
      })
    ).min(1, 'At least one medication is required'),
    instructions: z.string().optional().or(z.literal('')),
  }),
});

export const createLabRequestSchema = z.object({
  body: z.object({
    patientId: z.string().uuid('Invalid Patient ID structure'),
    testName: z.string().min(2, 'Test name is required'),
  }),
});

export const uploadReportSchema = z.object({
  body: z.object({
    labTestId: z.string().min(1, 'Lab test ID is required'),
    resultSummary: z.string().min(3, 'Result summary must be at least 3 characters'),
  }),
});
