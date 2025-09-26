import { useAuth } from './useAuth';

export const usePDFExport = () => {
  const { user } = useAuth();

  const exportToPDF = async (consultationData: any) => {
    if (!consultationData) {
      throw new Error('No consultation data to export');
    }

    // Create a clean text format for export
    const exportContent = generateExportContent(consultationData);
    
    // Create a downloadable file
    const blob = new Blob([exportContent], { type: 'text/plain;charset=utf-8' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    
    const timestamp = new Date().toISOString().split('T')[0];
    link.href = url;
    link.download = `AyurAgent-Report-${timestamp}.txt`;
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    window.URL.revokeObjectURL(url);
  };

  const generateExportContent = (data: any): string => {
    const timestamp = new Date().toLocaleString();
    
    let content = `
═══════════════════════════════════════════════════════════════
                          AYURAGENT
                    Personalized Wellness Report
═══════════════════════════════════════════════════════════════

Report Generated: ${timestamp}
User: ${user?.email || 'Anonymous'}

═══════════════════════════════════════════════════════════════
                      DOSHA ANALYSIS
═══════════════════════════════════════════════════════════════

Primary Dosha: ${data.dosha || 'Not determined'}

${data.dosha === 'Vata' ? `
VATA CONSTITUTION (Air & Space)
• Characteristics: Quick thinking, creative, energetic
• Tendencies: Dry skin, cold hands/feet, irregular digestion
• When Balanced: Alert, creative, flexible
• When Imbalanced: Anxious, restless, constipation
` : data.dosha === 'Pitta' ? `
PITTA CONSTITUTION (Fire & Water)  
• Characteristics: Focused, ambitious, strong digestion
• Tendencies: Warm body, oily skin, strong appetite
• When Balanced: Intelligent, confident, good leader
• When Imbalanced: Irritable, inflammatory conditions
` : data.dosha === 'Kapha' ? `
KAPHA CONSTITUTION (Earth & Water)
• Characteristics: Calm, steady, strong immunity
• Tendencies: Cool, moist skin, slow metabolism
• When Balanced: Peaceful, stable, loving
• When Imbalanced: Sluggish, weight gain, depression
` : ''}

═══════════════════════════════════════════════════════════════
                    DAILY ROUTINE PLAN
═══════════════════════════════════════════════════════════════
`;

    if (data.recommendations?.dailyRoutine) {
      content += `
MORNING ROUTINE (6:00 AM - 10:00 AM)
${data.recommendations.dailyRoutine.morning?.map((item: string, index: number) => 
  `${index + 1}. ${item}`).join('\n') || '• Wake up early\n• Practice meditation\n• Light exercise'}

AFTERNOON ROUTINE (10:00 AM - 6:00 PM)  
${data.recommendations.dailyRoutine.afternoon?.map((item: string, index: number) => 
  `${index + 1}. ${item}`).join('\n') || '• Main meal at midday\n• Work/daily activities\n• Short walk'}

EVENING ROUTINE (6:00 PM - 10:00 PM)
${data.recommendations.dailyRoutine.evening?.map((item: string, index: number) => 
  `${index + 1}. ${item}`).join('\n') || '• Light dinner\n• Relaxation time\n• Prepare for sleep'}
`;
    }

    content += `
═══════════════════════════════════════════════════════════════
                      DIET RECOMMENDATIONS
═══════════════════════════════════════════════════════════════
`;

    if (data.recommendations?.diet) {
      content += `
FOODS TO FAVOR:
${data.recommendations.diet.include?.map((item: string) => `• ${item}`).join('\n') || '• Warm, cooked foods\n• Fresh, seasonal produce\n• Adequate hydration'}

FOODS TO AVOID:
${data.recommendations.diet.avoid?.map((item: string) => `• ${item}`).join('\n') || '• Processed foods\n• Excessive cold drinks\n• Irregular meal times'}

GENERAL GUIDELINES:
• Eat mindfully and in a calm environment
• Maintain regular meal times
• Chew food thoroughly
• Avoid overeating
`;
    }

    content += `
═══════════════════════════════════════════════════════════════
                    HERBAL RECOMMENDATIONS  
═══════════════════════════════════════════════════════════════
`;

    if (data.recommendations?.herbs) {
      content += `${data.recommendations.herbs.map((herb: any) => `
${herb.name?.toUpperCase() || 'HERBAL REMEDY'}
• Benefits: ${herb.benefits || 'Supports overall wellness'}
• Usage: ${herb.usage || 'As directed by practitioner'}
• Precautions: ${herb.precautions || 'Consult healthcare provider'}
`).join('\n')}`;
    }

    content += `
═══════════════════════════════════════════════════════════════
                    LIFESTYLE RECOMMENDATIONS
═══════════════════════════════════════════════════════════════

EXERCISE & MOVEMENT:
• Practice yoga or gentle stretching daily
• Take regular walks in nature  
• Engage in activities that bring joy
• Avoid excessive or aggressive exercise

STRESS MANAGEMENT:
• Practice daily meditation (5-20 minutes)
• Deep breathing exercises (Pranayama)
• Maintain work-life balance
• Spend time in nature regularly

SLEEP HYGIENE:
• Go to bed before 10 PM
• Wake up before 6 AM
• Create a calm sleep environment
• Avoid screens 1 hour before bed

═══════════════════════════════════════════════════════════════
                        IMPORTANT NOTES
═══════════════════════════════════════════════════════════════

⚠️  DISCLAIMER: This report provides general Ayurvedic guidance based 
    on traditional principles. It is not a substitute for professional 
    medical advice, diagnosis, or treatment.

✓  Always consult with qualified healthcare practitioners before 
   making significant changes to your diet or lifestyle.

✓  Individual results may vary. Listen to your body and adjust 
   recommendations as needed.

✓  For serious health concerns, please consult with a licensed 
   Ayurvedic practitioner or medical doctor.

═══════════════════════════════════════════════════════════════

Generated by AyurAgent - Your AI-Powered Ayurvedic Companion
For more personalized recommendations, visit: https://ayuragent.app

═══════════════════════════════════════════════════════════════
`;

    return content;
  };

  const exportConsultationHistory = async (messages: any[], dosha?: string) => {
    if (!messages || messages.length === 0) {
      throw new Error('No conversation history to export');
    }

    let content = `
═══════════════════════════════════════════════════════════════
                          AYURAGENT
                   Consultation Chat History
═══════════════════════════════════════════════════════════════

Export Date: ${new Date().toLocaleString()}
User: ${user?.email || 'Anonymous'}
${dosha ? `Primary Dosha: ${dosha}` : ''}
Total Messages: ${messages.length}

═══════════════════════════════════════════════════════════════
                      CONVERSATION LOG
═══════════════════════════════════════════════════════════════

`;

    messages.forEach((message, index) => {
      const timestamp = new Date(message.timestamp).toLocaleString();
      const sender = message.sender === 'user' ? 'YOU' : 'AYURAGENT';
      
      content += `
[${timestamp}] ${sender}:
${message.text}

${index < messages.length - 1 ? '───────────────────────────────────────────────────────────────' : ''}
`;
    });

    content += `
═══════════════════════════════════════════════════════════════

This consultation history contains your personal health information.
Please keep it confidential and secure.

Generated by AyurAgent - Your AI-Powered Ayurvedic Companion

═══════════════════════════════════════════════════════════════
`;

    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    
    const timestamp = new Date().toISOString().split('T')[0];
    link.href = url;
    link.download = `AyurAgent-Chat-History-${timestamp}.txt`;
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    window.URL.revokeObjectURL(url);
  };

  return {
    exportToPDF,
    exportConsultationHistory
  };
};