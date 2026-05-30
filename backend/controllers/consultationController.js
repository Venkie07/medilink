import { DoctorConsultationRequest, MediDoctorConversation, Appointment, User, Notification, Patient } from '../models/index.js';
import logger from '../utils/logger.js';

export const getAllDoctors = async (req, res) => {
  try {
    const doctors = await User.findAll({
      where: { role: 'Doctor' },
      attributes: ['id', 'name', 'hospitalName']
    });
    res.json(doctors);
  } catch (error) {
    logger.error(`Error fetching doctors: ${error.message}`);
    res.status(500).json({ message: 'Error fetching doctors' });
  }
};

export const createConsultationRequest = async (req, res) => {
  try {
    const { patientId, doctorId, conversationId } = req.body;
    
    const user = await User.findOne({ where: { userId: patientId }, include: ['patientProfile'] });
    if (!user || !user.patientProfile) return res.status(404).json({ message: 'Patient profile not found' });
    const actualPatientId = user.patientProfile.id;
    
    const conversation = await MediDoctorConversation.findByPk(conversationId);
    if (!conversation) return res.status(404).json({ message: 'Conversation not found' });
    
    const request = await DoctorConsultationRequest.create({
      patientId: actualPatientId,
      doctorId,
      conversationId,
      chatHistory: null, // Depending on requirements, we can snapshot it, but relationship is fine
      latestAssessment: conversation.latestAssessment,
      assessmentHistory: conversation.assessmentHistory
    });

    await conversation.update({ status: 'Requested' });

    // Notification for Doctor
    await Notification.create({
      userId: doctorId,
      type: 'CONSULTATION_REQUEST',
      title: 'New Consultation Request',
      message: 'You have a new AI consultation request.',
      relatedEntityId: request.id
    });

    res.status(201).json(request);
  } catch (error) {
    logger.error(`Error in createConsultationRequest: ${error.message}`);
    res.status(500).json({ message: 'Failed to create request' });
  }
};

export const getDoctorRequests = async (req, res) => {
  try {
    const { doctorId } = req.params;
    // For Doctor, doctorId from frontend is either User.id or User.userId.
    // In DoctorConsultations.jsx, it calls: getDoctorRequests(user.userId)
    // Wait, let's lookup the actual doctor User id if it's not a UUID
    let actualDoctorId = doctorId;
    if (!doctorId.includes('-')) {
       const user = await User.findOne({ where: { userId: doctorId } });
       if (user) actualDoctorId = user.id;
    }

    const requests = await DoctorConsultationRequest.findAll({
      where: { doctorId: actualDoctorId },
      include: [
        { model: Patient, as: 'patient', include: [{ model: User, as: 'user', attributes: ['name', 'email'] }] },
        { model: MediDoctorConversation, as: 'conversation' }
      ],
      order: [['requestedAt', 'DESC']]
    });
    res.json(requests);
  } catch (error) {
    logger.error(`Error fetching doctor requests: ${error.message}`);
    res.status(500).json({ message: 'Error fetching requests' });
  }
};

export const getPatientRequests = async (req, res) => {
  try {
    const { patientId } = req.params;
    
    const user = await User.findOne({ where: { userId: patientId }, include: ['patientProfile'] });
    if (!user || !user.patientProfile) return res.status(404).json({ message: 'Patient profile not found' });
    const actualPatientId = user.patientProfile.id;

    const requests = await DoctorConsultationRequest.findAll({
      where: { patientId: actualPatientId },
      include: [
        { model: User, as: 'doctor', attributes: ['id', 'name', 'hospitalName'] }
      ],
      order: [['requestedAt', 'DESC']]
    });
    res.json(requests);
  } catch (error) {
    logger.error(`Error fetching patient requests: ${error.message}`);
    res.status(500).json({ message: 'Error fetching requests' });
  }
};

export const acceptRequest = async (req, res) => {
  try {
    const { id } = req.params;
    const { appointmentDate, appointmentTime, doctorRemarks } = req.body;

    const request = await DoctorConsultationRequest.findByPk(id);
    if (!request) return res.status(404).json({ message: 'Request not found' });

    const appointment = await Appointment.create({
      patientId: request.patientId,
      doctorId: request.doctorId,
      date: appointmentDate,
      time: appointmentTime,
      status: 'Pending',
      source: 'AIRequest',
      consultationRequestId: request.id,
      aiSummary: request.latestAssessment?.summary,
      severity: request.latestAssessment?.severity,
      conversationId: request.conversationId
    });

    await request.update({
      status: 'Accepted',
      appointmentDate,
      appointmentTime,
      doctorRemarks,
      appointmentId: appointment.id,
      acceptedAt: new Date()
    });

    res.json(request);
  } catch (error) {
    logger.error(`Error accepting request: ${error.message}`);
    res.status(500).json({ message: 'Error accepting request' });
  }
};

export const rejectRequest = async (req, res) => {
  try {
    const { id } = req.params;
    const { doctorRemarks } = req.body;

    const request = await DoctorConsultationRequest.findByPk(id);
    if (!request) return res.status(404).json({ message: 'Request not found' });

    await request.update({
      status: 'Rejected',
      doctorRemarks,
      rejectedAt: new Date()
    });

    res.json(request);
  } catch (error) {
    logger.error(`Error rejecting request: ${error.message}`);
    res.status(500).json({ message: 'Error rejecting request' });
  }
};
