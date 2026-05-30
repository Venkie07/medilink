import { MediDoctorConversation, MediDoctorMessage, Patient, User, DoctorConsultationRequest } from '../models/index.js';
import { generateChatResponse, generateConversationTitle } from '../services/groqService.js';
import logger from '../utils/logger.js';

export const getConversations = async (req, res) => {
  try {
    const { patientId } = req.params;
    
    const user = await User.findOne({ where: { userId: patientId }, include: ['patientProfile'] });
    if (!user || !user.patientProfile) return res.status(404).json({ message: 'Patient profile not found' });
    const actualPatientId = user.patientProfile.id;

    const conversations = await MediDoctorConversation.findAll({
      where: { patientId: actualPatientId },
      order: [['updatedAt', 'DESC']],
      attributes: ['id', 'title', 'summary', 'status', 'updatedAt']
    });
    res.json(conversations);
  } catch (error) {
    logger.error(`Error in getConversations: ${error.message}`);
    res.status(500).json({ message: 'Failed to fetch conversations' });
  }
};

export const getConversation = async (req, res) => {
  try {
    const { id } = req.params;
    const conversation = await MediDoctorConversation.findByPk(id, {
      include: [
        {
          model: MediDoctorMessage,
          as: 'messages',
          attributes: ['id', 'sender', 'content', 'timestamp']
        },
        {
          model: DoctorConsultationRequest,
          as: 'consultationRequest',
          include: [{ model: User, as: 'doctor', attributes: ['name', 'hospitalName'] }]
        }
      ],
      order: [[{ model: MediDoctorMessage, as: 'messages' }, 'timestamp', 'ASC']]
    });
    
    if (!conversation) {
      return res.status(404).json({ message: 'Conversation not found' });
    }
    res.json(conversation);
  } catch (error) {
    logger.error(`Error in getConversation: ${error.message}`);
    res.status(500).json({ message: 'Failed to fetch conversation' });
  }
};

export const sendMessage = async (req, res) => {
  try {
    const { id } = req.params;
    const { patientId, content } = req.body;
    
    const user = await User.findOne({ where: { userId: patientId }, include: ['patientProfile'] });
    if (!user || !user.patientProfile) return res.status(404).json({ message: 'Patient profile not found' });
    const actualPatientId = user.patientProfile.id;
    
    let conversation;
    if (id === 'new') {
      conversation = await MediDoctorConversation.create({
        patientId: actualPatientId,
        title: 'New Consultation'
      });
    } else {
      conversation = await MediDoctorConversation.findByPk(id);
      if (!conversation) return res.status(404).json({ message: 'Conversation not found' });
    }

    // Save user message
    await MediDoctorMessage.create({
      conversationId: conversation.id,
      sender: 'user',
      content
    });

    // Fetch history for AI context
    const allMessages = await MediDoctorMessage.findAll({
      where: { conversationId: conversation.id },
      order: [['timestamp', 'ASC']]
    });

    // Call Groq AI
    const aiResponseContent = await generateChatResponse(allMessages);
    
    // Check for JSON assessment
    let finalContent = aiResponseContent;
    let newAssessment = null;
    
    const jsonMatch = aiResponseContent.match(/```json\s*(\{[\s\S]*?\})\s*```/);
    if (jsonMatch) {
      try {
        newAssessment = JSON.parse(jsonMatch[1]);
        // Remove JSON from user-facing message
        finalContent = aiResponseContent.replace(/```json\s*\{[\s\S]*?\}\s*```/, '').trim();
      } catch (e) {
        logger.error(`Failed to parse AI JSON assessment: ${e.message}`);
      }
    }

    // Save AI message
    const aiMessage = await MediDoctorMessage.create({
      conversationId: conversation.id,
      sender: 'assistant',
      content: finalContent
    });

    // Update conversation
    const updateData = {};
    if (newAssessment) {
      updateData.latestAssessment = newAssessment;
      updateData.summary = newAssessment.summary;
      const history = conversation.assessmentHistory || [];
      updateData.assessmentHistory = [...history, newAssessment];
    }
    
    // Generate title if it's still new and has enough messages
    if (conversation.title === 'New Consultation' && allMessages.length >= 2) {
      updateData.title = await generateConversationTitle([...allMessages, aiMessage]);
    }
    
    if (Object.keys(updateData).length > 0) {
      await conversation.update(updateData);
    } else {
      // Just touch updatedAt
      await conversation.changed('updatedAt', true);
      await conversation.save();
    }

    res.json({
      conversationId: conversation.id,
      message: aiMessage,
      title: updateData.title || conversation.title,
      assessment: newAssessment
    });

  } catch (error) {
    logger.error(`Error in sendMessage: ${error.message}`);
    res.status(500).json({ message: 'Failed to process message' });
  }
};
