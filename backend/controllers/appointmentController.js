import AppointmentService from '../services/AppointmentService.js';
import { asyncHandler } from '../middleware/asyncHandler.js';

export const createAppointment = asyncHandler(async (req, res) => {
  const appointment = await AppointmentService.createAppointment(req.body, req.user.id);
  res.status(201).json(appointment);
});

export const getAppointments = asyncHandler(async (req, res) => {
  const appointments = await AppointmentService.getAppointmentsForRole(req.user.id, req.user.role);
  res.status(200).json(appointments);
});

export const updateAppointmentStatus = asyncHandler(async (req, res) => {
  const appointment = await AppointmentService.updateAppointmentStatus(
    req.params.id,
    req.body.status,
    req.user.id,
    req.user.role
  );
  res.status(200).json(appointment);
});

export const deleteAppointment = asyncHandler(async (req, res) => {
  await AppointmentService.deleteAppointment(req.params.id, req.user.id, req.user.role);
  res.status(200).json({ message: 'Appointment deleted successfully' });
});
