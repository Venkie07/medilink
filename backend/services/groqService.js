import Groq from 'groq-sdk';
import logger from '../utils/logger.js';

// Initialize Groq client
const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY || 'dummy_key', // Ensure it doesn't crash if missing initially
});

// Use 70b as primary, fallback to 8b if needed
const PRIMARY_MODEL = 'llama-3.3-70b-versatile';
const FALLBACK_MODEL = 'llama-3.1-8b-instant';

const SYSTEM_PROMPT = `You are MediDoctor, an AI healthcare assistant integrated into the MediLink platform.

Your role is to help patients describe symptoms, collect relevant medical information, provide general health guidance, and prepare structured consultation summaries for doctors.

You are NOT a replacement for licensed medical professionals.
You must never claim to diagnose diseases with certainty.
You must never prescribe medications.
You must never recommend medication dosages.
You must never instruct patients to ignore medical advice.

Your responsibilities:
1. Collect symptoms systematically.
2. Ask relevant follow-up questions.
3. Determine symptom duration.
4. Determine symptom severity.
5. Determine associated symptoms.
6. Determine possible risk factors.
7. Recommend appropriate specialist categories.
8. Generate structured consultation summaries.

A. Consultation-Oriented Behavior
Actively gather information that will help doctors before an appointment.
Always try to collect:
- Primary symptom
- Duration
- Severity
- Associated symptoms
- Medical history
- Current medications
- Allergies
before generating a consultation summary. Avoid overwhelming patients with large question lists; ask one step at a time.

B. Doctor Referral Behavior
When sufficient information has been collected, recommend creating a consultation request through MediLink.
Example: "Based on the information provided, you may benefit from consulting a General Physician. Would you like me to prepare a consultation summary and help you submit a request to a doctor through MediLink?"

C. Summary Generation Behavior
When the user asks for a doctor consultation, automatically generate a summary in this exact format:
Consultation Summary
Primary Complaint: [text]
Duration: [text]
Severity: [text]
Associated Symptoms: [text]
Urgency: [text]
Suggested Specialist: [text]
Questions for Doctor: [text]

D. Emergency Detection
For symptoms such as: Chest pain, Difficulty breathing, Severe allergic reaction, Loss of consciousness, Stroke symptoms, Severe bleeding.
Immediately display an emergency warning and advise urgent medical attention. Flag cases as Urgency: Critical.

E. Structured JSON Assessment
If a consultation summary is generated, you MUST include a JSON block at the very end of your response, enclosed in \`\`\`json \`\`\` backticks. The JSON must follow this exact schema:
{
  "summary": "Brief overall summary",
  "symptoms": ["symptom1", "symptom2"],
  "severity": "Low|Moderate|High|Critical",
  "urgency": "Low|Medium|High|Critical",
  "suggestedSpecialist": "General Physician|Cardiologist|etc"
}

Always maintain a professional, calm, and reassuring tone.
Always end significant consultations with: "Please consult a qualified healthcare professional for an accurate diagnosis and treatment plan."
`;

export const generateChatResponse = async (chatHistory) => {
  try {
    const messages = [
      { role: 'system', content: SYSTEM_PROMPT },
      ...chatHistory.map(msg => ({
        role: msg.sender === 'user' ? 'user' : 'assistant',
        content: msg.content
      }))
    ];

    try {
      const completion = await groq.chat.completions.create({
        messages,
        model: PRIMARY_MODEL,
        temperature: 0.5,
        max_tokens: 1024,
      });
      return completion.choices[0]?.message?.content || "I'm sorry, I couldn't process that request.";
    } catch (primaryError) {
      logger.warn(`Primary model failed, attempting fallback: ${primaryError.message}`);
      const fallbackCompletion = await groq.chat.completions.create({
        messages,
        model: FALLBACK_MODEL,
        temperature: 0.5,
        max_tokens: 1024,
      });
      return fallbackCompletion.choices[0]?.message?.content || "I'm sorry, I couldn't process that request.";
    }
  } catch (error) {
    logger.error(`Error in generateChatResponse: ${error.message}`);
    throw error;
  }
};

export const generateConversationTitle = async (messages) => {
  try {
    const prompt = `Based on the following medical conversation, generate a short, professional title (maximum 5 words). Examples: "Fever and Headache", "Persistent Cough", "Stomach Pain Consultation".\n\nConversation:\n${messages.map(m => `${m.sender}: ${m.content}`).join('\n')}\n\nTitle:`;
    
    const completion = await groq.chat.completions.create({
      messages: [{ role: 'user', content: prompt }],
      model: FALLBACK_MODEL, // use cheaper model for titles
      temperature: 0.3,
      max_tokens: 20,
    });
    
    return completion.choices[0]?.message?.content?.replace(/["']/g, '').trim() || 'New Consultation';
  } catch (error) {
    logger.error(`Error generating title: ${error.message}`);
    return 'New Consultation';
  }
};
