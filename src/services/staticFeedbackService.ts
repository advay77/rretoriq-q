/**
 * Static Feedback Service
 * 
 * Provides static, pre-defined feedback based on audio characteristics
 * No AI/API calls - purely rule-based feedback generation
 */

import type { AnswerAnalysis } from './geminiAnalysisService'

interface AudioMetrics {
    duration: number // in seconds
    hasVoice: boolean // whether voice was detected
    transcript: string
    wordCount: number
    avgRms: number // average audio level
    maxRms: number // peak audio level
}

// Feedback templates for different scenarios
const SHORT_AUDIO_FEEDBACKS = [
    {
        overallScore: 25,
        feedback: {
            strengths: [
                'You attempted to answer the question',
                'Your voice was clear in the brief recording'
            ],
            weaknesses: [
                'Response was too short (under 5 seconds)',
                'Insufficient detail to evaluate your understanding',
                'Missing key examples and explanations',
                'No structured approach visible in such a brief answer'
            ],
            suggestions: [
                'Aim for at least 30-45 seconds to fully develop your answer',
                'Use the STAR method: Situation, Task, Action, Result',
                'Include at least one concrete example',
                'Practice expanding your thoughts before recording'
            ],
            detailedFeedback: 'Your response was too brief to properly evaluate. While your voice was clear, the answer lacked sufficient depth and detail. Take more time to structure your thoughts and provide comprehensive examples.'
        },
        scores: { clarity: 30, relevance: 25, structure: 20, completeness: 15, confidence: 30 }
    },
    {
        overallScore: 22,
        feedback: {
            strengths: [
                'You started to address the question',
                'Audio quality was acceptable'
            ],
            weaknesses: [
                'Extremely short response (less than 5 seconds)',
                'No time to demonstrate your knowledge',
                'Lacks any supporting details or examples',
                'Incomplete thought process'
            ],
            suggestions: [
                'Spend 45-60 seconds on your answer',
                'Break down your answer: Introduction → Main points → Conclusion',
                'Add specific examples from your experience',
                'Rehearse your answer mentally before recording'
            ],
            detailedFeedback: 'This response is far too short. Interviewers need substantial content to assess your capabilities. Expand your answer with real examples and detailed explanations.'
        },
        scores: { clarity: 25, relevance: 20, structure: 18, completeness: 12, confidence: 28 }
    },
    {
        overallScore: 28,
        feedback: {
            strengths: [
                'You began answering promptly',
                'Voice was audible and clear'
            ],
            weaknesses: [
                'Response duration was insufficient (under 5 seconds)',
                'No opportunity to showcase your skills',
                'Missing critical details and context',
                'Answer feels rushed and incomplete'
            ],
            suggestions: [
                'Target 1-2 minutes for behavioral questions',
                'Use frameworks like CAR (Context, Action, Result)',
                'Provide quantifiable results when possible',
                'Take a breath and organize your thoughts first'
            ],
            detailedFeedback: 'While you started well, the response ended too quickly. Interviewers expect thorough answers with context, actions taken, and measurable outcomes. Practice delivering complete responses.'
        },
        scores: { clarity: 32, relevance: 28, structure: 22, completeness: 18, confidence: 30 }
    },
    {
        overallScore: 20,
        feedback: {
            strengths: [
                'Recording was initiated successfully',
                'Some attempt at answering was made'
            ],
            weaknesses: [
                'Critically short answer (less than 5 seconds)',
                'Insufficient content for meaningful evaluation',
                'No examples or supporting evidence provided',
                'Lacks depth and substance'
            ],
            suggestions: [
                'Extend your responses to 60-90 seconds minimum',
                'Include 2-3 key points in every answer',
                'Back up claims with specific examples',
                'Practice the "Rule of Three" - three main points per answer'
            ],
            detailedFeedback: 'This response is inadequate for interview purposes. You need to provide substantially more content, including specific examples and detailed explanations of your thought process.'
        },
        scores: { clarity: 22, relevance: 18, structure: 15, completeness: 10, confidence: 25 }
    },
    {
        overallScore: 26,
        feedback: {
            strengths: [
                'You responded without hesitation',
                'Audio was clear and understandable'
            ],
            weaknesses: [
                'Response was far too brief (under 5 seconds)',
                'No time to demonstrate competency',
                'Missing all supporting details',
                'Incomplete answer structure'
            ],
            suggestions: [
                'Aim for comprehensive answers of 1-2 minutes',
                'Use the PAR method: Problem, Action, Result',
                'Include specific metrics and outcomes',
                'Prepare key talking points before recording'
            ],
            detailedFeedback: 'Your answer needs significant expansion. Brief responses don\'t allow interviewers to assess your abilities. Focus on providing detailed, structured answers with concrete examples.'
        },
        scores: { clarity: 28, relevance: 26, structure: 20, completeness: 16, confidence: 32 }
    }
]

const NO_VOICE_FEEDBACKS = [
    {
        overallScore: 8,
        feedback: {
            strengths: [],
            weaknesses: [
                'No voice detected - completely silent recording',
                'Microphone may be muted or not working',
                'Cannot evaluate any communication skills',
                'No content to analyze'
            ],
            suggestions: [
                'Check your microphone permissions in browser settings',
                'Ensure microphone is not muted',
                'Test your microphone before recording',
                'Speak clearly and directly into the microphone',
                'Re-record with audible speech'
            ],
            detailedFeedback: 'No voice was detected in your recording. This could be due to a muted microphone, permission issues, or technical problems. Please check your audio setup and try again.'
        },
        scores: { clarity: 0, relevance: 0, structure: 0, completeness: 0, confidence: 0 }
    },
    {
        overallScore: 5,
        feedback: {
            strengths: [],
            weaknesses: [
                'Silent recording - no speech detected',
                'Microphone input not functioning',
                'Unable to assess any response quality',
                'No audible content captured'
            ],
            suggestions: [
                'Verify microphone is connected and enabled',
                'Grant microphone access when prompted by browser',
                'Check system audio settings',
                'Ensure you\'re speaking loud enough',
                'Try recording again with proper audio'
            ],
            detailedFeedback: 'Your recording contains no detectable speech. This prevents any meaningful evaluation. Please verify your microphone is working and try recording again.'
        },
        scores: { clarity: 0, relevance: 0, structure: 0, completeness: 0, confidence: 0 }
    },
    {
        overallScore: 10,
        feedback: {
            strengths: [],
            weaknesses: [
                'No voice input detected during recording',
                'Microphone appears to be inactive or muted',
                'Cannot provide feedback without audio content',
                'Recording is completely silent'
            ],
            suggestions: [
                'Click the microphone icon in your browser\'s address bar to enable access',
                'Check if your microphone is selected as the default device',
                'Increase microphone volume in system settings',
                'Position yourself closer to the microphone',
                'Record a test clip to verify audio is working'
            ],
            detailedFeedback: 'We couldn\'t detect any voice in your recording. This is typically caused by microphone permission issues or hardware problems. Please troubleshoot your audio setup and record again.'
        },
        scores: { clarity: 0, relevance: 0, structure: 0, completeness: 0, confidence: 0 }
    },
    {
        overallScore: 6,
        feedback: {
            strengths: [],
            weaknesses: [
                'Completely muted recording - no audio detected',
                'Microphone not capturing any sound',
                'Impossible to evaluate without voice input',
                'No speech content available for analysis'
            ],
            suggestions: [
                'Restart your browser and try again',
                'Use a different microphone if available',
                'Check Windows/Mac sound settings for microphone access',
                'Ensure no other application is blocking microphone access',
                'Speak clearly at normal volume when recording'
            ],
            detailedFeedback: 'Your recording is completely silent with no detectable voice. This makes evaluation impossible. Please resolve the microphone issue and submit a new recording with clear audio.'
        },
        scores: { clarity: 0, relevance: 0, structure: 0, completeness: 0, confidence: 0 }
    },
    {
        overallScore: 7,
        feedback: {
            strengths: [],
            weaknesses: [
                'No speech detected - recording is silent',
                'Microphone may not have permission to record',
                'Cannot analyze content without audio',
                'Empty recording with no voice data'
            ],
            suggestions: [
                'Allow microphone access when your browser requests it',
                'Test your microphone using system settings',
                'Make sure you\'re not on mute',
                'Try using headphones with a built-in microphone',
                'Record again ensuring you speak clearly'
            ],
            detailedFeedback: 'No voice was captured in this recording. Without audio input, we cannot provide meaningful feedback. Please check your microphone setup and record your answer again.'
        },
        scores: { clarity: 0, relevance: 0, structure: 0, completeness: 0, confidence: 0 }
    }
]

const GOOD_FEEDBACKS = [
    {
        overallScore: 82,
        feedback: {
            strengths: [
                'Excellent response structure with clear beginning, middle, and end',
                'Strong use of specific examples to support your points',
                'Confident delivery with good pacing',
                'Demonstrated deep understanding of the topic',
                'Effective use of the STAR framework'
            ],
            weaknesses: [
                'Could have included more quantifiable results',
                'Minor hesitation in the middle section'
            ],
            suggestions: [
                'Add specific metrics or numbers to strengthen impact',
                'Practice transitions between main points',
                'Consider adding a brief summary at the end'
            ],
            detailedFeedback: 'Strong performance overall. Your answer was well-structured and demonstrated clear thinking. The examples you provided were relevant and helped illustrate your points effectively. With minor refinements in quantifying results, this would be an excellent response.'
        },
        scores: { clarity: 85, relevance: 88, structure: 82, completeness: 78, confidence: 80 }
    },
    {
        overallScore: 88,
        feedback: {
            strengths: [
                'Outstanding clarity and articulation throughout',
                'Comprehensive coverage of all key aspects',
                'Excellent use of concrete examples with measurable outcomes',
                'Very confident and professional delivery',
                'Perfect pacing - not too fast or slow'
            ],
            weaknesses: [
                'Could be slightly more concise in places'
            ],
            suggestions: [
                'Consider trimming minor details to stay under 2 minutes',
                'Practice identifying the most impactful points to emphasize'
            ],
            detailedFeedback: 'Excellent response! You demonstrated strong communication skills and subject matter expertise. Your answer was comprehensive, well-organized, and delivered with confidence. This is the type of response that impresses interviewers.'
        },
        scores: { clarity: 90, relevance: 92, structure: 88, completeness: 85, confidence: 88 }
    },
    {
        overallScore: 75,
        feedback: {
            strengths: [
                'Good structure with logical flow',
                'Relevant examples that support your argument',
                'Clear voice and good articulation',
                'Addressed the question directly'
            ],
            weaknesses: [
                'Could provide more specific details in examples',
                'Some sections felt slightly rushed',
                'Missing a strong concluding statement'
            ],
            suggestions: [
                'Slow down slightly to ensure all points land',
                'Add more context to your examples',
                'End with a brief summary of key takeaways',
                'Practice emphasizing your most important achievements'
            ],
            detailedFeedback: 'Solid response with good fundamentals. You covered the main points and provided relevant examples. To elevate this answer, focus on adding more specific details and slowing down your delivery for maximum impact.'
        },
        scores: { clarity: 78, relevance: 80, structure: 75, completeness: 70, confidence: 72 }
    },
    {
        overallScore: 91,
        feedback: {
            strengths: [
                'Exceptional structure using the CAR framework perfectly',
                'Highly specific examples with impressive quantifiable results',
                'Outstanding confidence and professional presence',
                'Perfect length - comprehensive yet concise',
                'Excellent transitions between points'
            ],
            weaknesses: [
                'Virtually none - this is a model response'
            ],
            suggestions: [
                'Maintain this level of preparation for all questions',
                'Consider this your benchmark for future responses'
            ],
            detailedFeedback: 'Outstanding performance! This response demonstrates mastery of interview communication. Your structure was impeccable, examples were compelling with clear results, and delivery was confident and professional. This is exactly what interviewers want to hear.'
        },
        scores: { clarity: 94, relevance: 95, structure: 92, completeness: 88, confidence: 92 }
    },
    {
        overallScore: 79,
        feedback: {
            strengths: [
                'Well-organized answer with clear structure',
                'Good use of personal examples',
                'Confident tone throughout',
                'Addressed all parts of the question',
                'Natural and conversational delivery'
            ],
            weaknesses: [
                'Some examples could be more specific',
                'Slightly generic in places',
                'Could emphasize unique contributions more'
            ],
            suggestions: [
                'Add more unique details that set you apart',
                'Quantify your achievements where possible',
                'Practice highlighting your specific role in team situations',
                'Consider adding one more concrete example'
            ],
            detailedFeedback: 'Very good response overall. You demonstrated solid communication skills and relevant experience. To make this answer truly stand out, focus on adding more specific, unique details that highlight your individual contributions and impact.'
        },
        scores: { clarity: 82, relevance: 85, structure: 78, completeness: 75, confidence: 80 }
    },
    {
        overallScore: 85,
        feedback: {
            strengths: [
                'Excellent clarity and professional delivery',
                'Strong examples with clear outcomes',
                'Very good structure and logical flow',
                'Confident without being arrogant',
                'Good balance of detail and conciseness'
            ],
            weaknesses: [
                'Could add one more supporting example',
                'Minor room for improvement in pacing'
            ],
            suggestions: [
                'Consider adding a brief opening statement to frame your answer',
                'Practice varying your tone for emphasis on key points',
                'Add specific numbers or percentages to strengthen impact'
            ],
            detailedFeedback: 'Impressive response! You communicated your points clearly and backed them up with solid examples. Your delivery was confident and professional. With minor enhancements in quantifying results, this would be a top-tier answer.'
        },
        scores: { clarity: 88, relevance: 90, structure: 85, completeness: 82, confidence: 85 }
    },
    {
        overallScore: 72,
        feedback: {
            strengths: [
                'Clear and understandable delivery',
                'Relevant content addressing the question',
                'Good attempt at providing examples',
                'Maintained good eye contact (implied through confident tone)'
            ],
            weaknesses: [
                'Examples could be more detailed and specific',
                'Structure could be tighter',
                'Some filler words present',
                'Conclusion felt abrupt'
            ],
            suggestions: [
                'Practice the STAR method to improve structure',
                'Eliminate filler words like "um" and "like"',
                'Add more specific details to your examples',
                'Prepare a strong closing statement',
                'Record yourself practicing to identify areas for improvement'
            ],
            detailedFeedback: 'Good foundational response. You covered the main points and provided relevant information. To improve, focus on tightening your structure, adding more specific details, and eliminating filler words. Practice will help you deliver more polished answers.'
        },
        scores: { clarity: 75, relevance: 78, structure: 70, completeness: 68, confidence: 70 }
    },
    {
        overallScore: 94,
        feedback: {
            strengths: [
                'Absolutely exceptional structure and organization',
                'Highly compelling examples with impressive quantified results',
                'Outstanding professional presence and confidence',
                'Perfect pacing and tone throughout',
                'Comprehensive yet concise - ideal length',
                'Masterful use of storytelling techniques'
            ],
            weaknesses: [
                'None identified - this is an exemplary response'
            ],
            suggestions: [
                'Use this response as your template for excellence',
                'Share your preparation techniques with others'
            ],
            detailedFeedback: 'Exceptional performance! This is a masterclass in interview communication. Your answer was perfectly structured, filled with compelling examples and quantifiable achievements, and delivered with outstanding confidence and professionalism. This response would impress even the most demanding interviewers.'
        },
        scores: { clarity: 96, relevance: 98, structure: 95, completeness: 92, confidence: 95 }
    },
    {
        overallScore: 77,
        feedback: {
            strengths: [
                'Good overall structure and flow',
                'Relevant examples from your experience',
                'Clear articulation and good voice projection',
                'Addressed the core question effectively'
            ],
            weaknesses: [
                'Could provide more context for your examples',
                'Some points felt underdeveloped',
                'Missing specific metrics or outcomes',
                'Transition between points could be smoother'
            ],
            suggestions: [
                'Add more background context to set up your examples',
                'Include specific numbers, percentages, or timeframes',
                'Practice smoother transitions using phrases like "Additionally" or "Building on that"',
                'Develop each main point more fully before moving on'
            ],
            detailedFeedback: 'Solid performance with room for improvement. You demonstrated good communication fundamentals and relevant experience. To elevate your answer, focus on providing more context, adding quantifiable results, and ensuring smooth transitions between ideas.'
        },
        scores: { clarity: 80, relevance: 82, structure: 75, completeness: 72, confidence: 78 }
    },
    {
        overallScore: 83,
        feedback: {
            strengths: [
                'Excellent structure with clear introduction and conclusion',
                'Strong specific examples with good detail',
                'Confident and engaging delivery',
                'Good use of the PAR framework',
                'Appropriate length and pacing'
            ],
            weaknesses: [
                'One example could have been more impactful',
                'Minor repetition in the middle section'
            ],
            suggestions: [
                'Vary your examples to show breadth of experience',
                'Avoid repeating the same phrases',
                'Consider adding one more quantifiable metric'
            ],
            detailedFeedback: 'Very strong response! You demonstrated excellent communication skills and provided compelling examples. Your structure was clear and your delivery was confident. With minor refinements to avoid repetition and add more varied examples, this would be an outstanding answer.'
        },
        scores: { clarity: 86, relevance: 88, structure: 83, completeness: 80, confidence: 85 }
    }
]

// Additional good feedbacks to reach ~100 total
const MORE_GOOD_FEEDBACKS = [
    {
        overallScore: 81,
        feedback: {
            strengths: [
                'Very clear and articulate communication',
                'Well-chosen examples that illustrate your points',
                'Good confidence level throughout',
                'Logical progression of ideas'
            ],
            weaknesses: [
                'Could add more emotional engagement',
                'Some technical jargon might need explanation'
            ],
            suggestions: [
                'Show more enthusiasm when discussing achievements',
                'Explain technical terms for non-technical interviewers',
                'Add a personal touch to make examples more memorable'
            ],
            detailedFeedback: 'Strong answer with good technical content. Your examples were relevant and well-explained. To make an even stronger impression, consider adding more energy and passion when discussing your accomplishments.'
        },
        scores: { clarity: 84, relevance: 86, structure: 80, completeness: 78, confidence: 82 }
    },
    {
        overallScore: 76,
        feedback: {
            strengths: [
                'Good attempt at structured response',
                'Relevant content addressing the question',
                'Clear voice and good pronunciation',
                'Showed genuine interest in the topic'
            ],
            weaknesses: [
                'Structure could be more defined',
                'Examples need more depth',
                'Pacing was inconsistent',
                'Lacked a strong opening'
            ],
            suggestions: [
                'Start with a clear thesis statement',
                'Use frameworks like STAR consistently',
                'Practice maintaining steady pacing',
                'Develop examples with more specific details'
            ],
            detailedFeedback: 'Decent response with potential for improvement. You showed knowledge and interest, but the answer would benefit from better structure and more detailed examples. Practice using frameworks to organize your thoughts.'
        },
        scores: { clarity: 78, relevance: 80, structure: 72, completeness: 70, confidence: 76 }
    },
    {
        overallScore: 89,
        feedback: {
            strengths: [
                'Outstanding clarity and professional communication',
                'Excellent use of specific, relevant examples',
                'Very strong structure with clear signposting',
                'Confident delivery with perfect pacing',
                'Comprehensive coverage of the question'
            ],
            weaknesses: [
                'Could have included one more diverse example'
            ],
            suggestions: [
                'Consider showing breadth by including examples from different contexts',
                'Maintain this high standard across all responses'
            ],
            detailedFeedback: 'Excellent performance! Your answer was well-crafted, clearly delivered, and demonstrated strong expertise. The structure was impeccable and examples were compelling. This is the caliber of response that leads to job offers.'
        },
        scores: { clarity: 92, relevance: 93, structure: 90, completeness: 86, confidence: 90 }
    },
    {
        overallScore: 73,
        feedback: {
            strengths: [
                'Addressed the question directly',
                'Provided relevant examples',
                'Maintained good energy throughout',
                'Clear articulation'
            ],
            weaknesses: [
                'Examples lacked specific outcomes',
                'Structure was somewhat loose',
                'Could have been more concise',
                'Missing quantifiable results'
            ],
            suggestions: [
                'Always include measurable outcomes in examples',
                'Tighten your structure using proven frameworks',
                'Practice being more concise while maintaining completeness',
                'Prepare 2-3 strong examples in advance'
            ],
            detailedFeedback: 'Satisfactory response with room for growth. You demonstrated relevant knowledge but the answer would be stronger with better structure and more specific, quantifiable examples. Focus on preparation and practice.'
        },
        scores: { clarity: 76, relevance: 78, structure: 70, completeness: 68, confidence: 74 }
    },
    {
        overallScore: 86,
        feedback: {
            strengths: [
                'Excellent structure and organization',
                'Very strong examples with clear results',
                'Confident and engaging delivery',
                'Good balance of detail and brevity',
                'Professional tone throughout'
            ],
            weaknesses: [
                'Could emphasize unique contributions more',
                'Minor opportunity to add more passion'
            ],
            suggestions: [
                'Highlight what YOU specifically did vs. the team',
                'Show more enthusiasm for your achievements',
                'Consider adding a forward-looking statement'
            ],
            detailedFeedback: 'Very impressive response! You communicated clearly and provided strong examples with good outcomes. Your delivery was professional and confident. To make it even better, emphasize your unique contributions and show more passion for your work.'
        },
        scores: { clarity: 88, relevance: 90, structure: 86, completeness: 84, confidence: 87 }
    },
    {
        overallScore: 78,
        feedback: {
            strengths: [
                'Good structure with clear main points',
                'Relevant examples from experience',
                'Confident tone and clear voice',
                'Appropriate length'
            ],
            weaknesses: [
                'Examples could be more vivid and detailed',
                'Some points felt surface-level',
                'Transitions could be smoother',
                'Missing a memorable hook or opening'
            ],
            suggestions: [
                'Add more sensory details to make examples memorable',
                'Dig deeper into the "why" behind your actions',
                'Practice transition phrases',
                'Start with an engaging opening statement'
            ],
            detailedFeedback: 'Good solid answer. You covered the necessary points and demonstrated relevant experience. To elevate this response, focus on making your examples more vivid and memorable, and work on smoother transitions between ideas.'
        },
        scores: { clarity: 80, relevance: 82, structure: 76, completeness: 74, confidence: 79 }
    },
    {
        overallScore: 92,
        feedback: {
            strengths: [
                'Exceptional clarity and articulation',
                'Outstanding use of the STAR framework',
                'Highly specific examples with impressive quantified results',
                'Perfect pacing and professional delivery',
                'Comprehensive yet concise',
                'Strong opening and closing'
            ],
            weaknesses: [
                'Virtually flawless - minor opportunity to add one more perspective'
            ],
            suggestions: [
                'Consider this your gold standard',
                'Replicate this approach for all interview questions'
            ],
            detailedFeedback: 'Outstanding performance! This is an exemplary interview response. Your structure was perfect, examples were compelling with clear quantifiable results, and your delivery was confident and professional. This answer would impress any interviewer.'
        },
        scores: { clarity: 95, relevance: 96, structure: 93, completeness: 90, confidence: 93 }
    },
    {
        overallScore: 74,
        feedback: {
            strengths: [
                'Clear communication of main ideas',
                'Relevant content addressing the question',
                'Good voice quality and articulation',
                'Showed understanding of the topic'
            ],
            weaknesses: [
                'Structure needs improvement',
                'Examples were too general',
                'Lacked specific metrics or outcomes',
                'Pacing was uneven',
                'No clear conclusion'
            ],
            suggestions: [
                'Use the CAR or STAR framework consistently',
                'Make examples more specific with names, dates, numbers',
                'Practice maintaining steady pacing throughout',
                'Always end with a brief summary or takeaway',
                'Record practice sessions to identify weak points'
            ],
            detailedFeedback: 'Adequate response with significant room for improvement. While you demonstrated knowledge of the topic, the answer would benefit from better structure, more specific examples, and a clearer conclusion. Focused practice will help you improve.'
        },
        scores: { clarity: 76, relevance: 78, structure: 70, completeness: 68, confidence: 75 }
    },
    {
        overallScore: 84,
        feedback: {
            strengths: [
                'Excellent structure with clear framework usage',
                'Strong, specific examples with good detail',
                'Very confident and professional delivery',
                'Good pacing throughout',
                'Addressed all aspects of the question'
            ],
            weaknesses: [
                'Could add more emotional connection',
                'One example felt slightly rushed'
            ],
            suggestions: [
                'Show more passion when discussing your achievements',
                'Give each example equal time and development',
                'Consider adding a personal reflection or learning'
            ],
            detailedFeedback: 'Very strong response! You demonstrated excellent communication skills and provided compelling, well-structured examples. Your delivery was confident and professional. Adding more emotional engagement would make this answer even more memorable.'
        },
        scores: { clarity: 87, relevance: 89, structure: 84, completeness: 82, confidence: 86 }
    },
    {
        overallScore: 80,
        feedback: {
            strengths: [
                'Well-organized answer with good flow',
                'Relevant examples that support your points',
                'Clear and confident delivery',
                'Good use of specific details',
                'Professional tone'
            ],
            weaknesses: [
                'Could add more quantifiable results',
                'Some sections could be more concise',
                'Missing a strong hook at the beginning'
            ],
            suggestions: [
                'Include specific numbers, percentages, or metrics',
                'Practice being more concise without losing key details',
                'Start with an engaging opening to capture attention',
                'Consider adding one more diverse example'
            ],
            detailedFeedback: 'Strong performance overall. Your answer was well-structured and demonstrated good communication skills. To make it even better, focus on adding more quantifiable results and starting with a more engaging opening.'
        },
        scores: { clarity: 83, relevance: 85, structure: 80, completeness: 76, confidence: 82 }
    },
    // Additional 70+ feedbacks for variety
    {
        overallScore: 87,
        feedback: {
            strengths: [
                'Exceptional clarity in explaining complex concepts',
                'Strong narrative flow with engaging storytelling',
                'Excellent use of real-world examples',
                'Very professional and polished delivery'
            ],
            weaknesses: [
                'Could have elaborated more on challenges faced'
            ],
            suggestions: [
                'Discuss obstacles and how you overcame them',
                'Add more reflection on lessons learned'
            ],
            detailedFeedback: 'Excellent response with strong storytelling. Your examples were engaging and well-explained. Adding more discussion of challenges would make this even more compelling.'
        },
        scores: { clarity: 90, relevance: 91, structure: 87, completeness: 84, confidence: 88 }
    },
    {
        overallScore: 71,
        feedback: {
            strengths: [
                'Answered the question directly',
                'Provided some relevant examples',
                'Maintained steady voice throughout'
            ],
            weaknesses: [
                'Examples lacked depth and specificity',
                'Structure was somewhat disorganized',
                'Could have been more enthusiastic',
                'Missing clear conclusion'
            ],
            suggestions: [
                'Develop examples with more specific details',
                'Use a clear framework to organize your thoughts',
                'Show more energy and passion',
                'End with a strong summary statement'
            ],
            detailedFeedback: 'Acceptable response but needs improvement. Focus on adding more specific details to your examples and using a clearer structure. Practice will help you deliver more polished answers.'
        },
        scores: { clarity: 74, relevance: 76, structure: 68, completeness: 66, confidence: 72 }
    },
    {
        overallScore: 90,
        feedback: {
            strengths: [
                'Outstanding structure with perfect STAR implementation',
                'Highly compelling examples with measurable impact',
                'Exceptional confidence and executive presence',
                'Perfect balance of detail and conciseness',
                'Strong opening and memorable closing'
            ],
            weaknesses: [
                'Minimal - this is a near-perfect response'
            ],
            suggestions: [
                'Maintain this excellence across all questions',
                'Use this as your benchmark'
            ],
            detailedFeedback: 'Outstanding! This is exactly what top-tier candidates deliver. Your structure was flawless, examples were compelling with clear results, and your delivery exuded confidence. This response would impress any hiring manager.'
        },
        scores: { clarity: 93, relevance: 95, structure: 91, completeness: 88, confidence: 91 }
    },
    {
        overallScore: 68,
        feedback: {
            strengths: [
                'Attempted to answer the question',
                'Some relevant points mentioned',
                'Audible and clear voice'
            ],
            weaknesses: [
                'Lacked clear structure',
                'Examples were vague and generic',
                'No quantifiable results mentioned',
                'Pacing was inconsistent',
                'Weak conclusion'
            ],
            suggestions: [
                'Study and practice the STAR framework',
                'Prepare specific examples with numbers',
                'Work on maintaining consistent pacing',
                'Develop a strong closing statement',
                'Practice with mock interviews'
            ],
            detailedFeedback: 'This response needs significant improvement. While you addressed the question, the lack of structure and specific examples weakens your answer. Invest time in preparation and practice using proven frameworks.'
        },
        scores: { clarity: 70, relevance: 72, structure: 64, completeness: 62, confidence: 68 }
    },
    {
        overallScore: 95,
        feedback: {
            strengths: [
                'Absolutely masterful response - textbook perfect',
                'Exceptional structure with seamless transitions',
                'Highly specific examples with impressive quantified outcomes',
                'Outstanding executive presence and confidence',
                'Perfect pacing, tone, and energy',
                'Memorable opening and powerful closing'
            ],
            weaknesses: [
                'None - this is a gold standard response'
            ],
            suggestions: [
                'Document your preparation process to replicate this success',
                'Mentor others using this as an example'
            ],
            detailedFeedback: 'Exceptional! This is a masterclass in interview excellence. Every element was perfect - structure, content, delivery, and impact. This is the type of response that leads to immediate job offers. Outstanding work!'
        },
        scores: { clarity: 98, relevance: 99, structure: 96, completeness: 94, confidence: 97 }
    }
]

// Additional short audio feedbacks for more variety
const MORE_SHORT_FEEDBACKS = [
    {
        overallScore: 24,
        feedback: {
            strengths: [
                'You initiated a response',
                'Audio was captured successfully'
            ],
            weaknesses: [
                'Extremely brief - less than 5 seconds',
                'No meaningful content to evaluate',
                'Missing all key components of a good answer',
                'Insufficient time to demonstrate knowledge'
            ],
            suggestions: [
                'Record for at least 45-60 seconds',
                'Plan your answer before recording',
                'Include introduction, main points, and conclusion',
                'Practice with a timer to build timing awareness'
            ],
            detailedFeedback: 'This response is too short to evaluate properly. Interviewers need substantial content to assess your capabilities. Take time to develop complete, well-structured answers.'
        },
        scores: { clarity: 26, relevance: 22, structure: 18, completeness: 14, confidence: 28 }
    },
    {
        overallScore: 21,
        feedback: {
            strengths: [
                'Recording started successfully',
                'Voice was clear in the brief moment'
            ],
            weaknesses: [
                'Far too short (under 5 seconds)',
                'No opportunity to showcase skills or knowledge',
                'Lacks any substantial content',
                'Appears rushed or unprepared'
            ],
            suggestions: [
                'Aim for 1-2 minute responses',
                'Prepare 2-3 key points before recording',
                'Use concrete examples from your experience',
                'Practice delivering complete thoughts'
            ],
            detailedFeedback: 'This response is inadequate. You need to provide much more content with specific examples and clear structure. Preparation and practice are essential for interview success.'
        },
        scores: { clarity: 24, relevance: 20, structure: 16, completeness: 12, confidence: 26 }
    }
]

// Additional no-voice feedbacks
const MORE_NO_VOICE_FEEDBACKS = [
    {
        overallScore: 4,
        feedback: {
            strengths: [],
            weaknesses: [
                'No audio detected - completely silent',
                'Microphone not functioning or muted',
                'Cannot evaluate without voice input',
                'Recording contains no usable content'
            ],
            suggestions: [
                'Check browser microphone permissions',
                'Test microphone in system settings',
                'Ensure microphone is not muted',
                'Try a different browser if issues persist',
                'Speak clearly and at normal volume'
            ],
            detailedFeedback: 'No voice detected. This prevents any evaluation. Please check your microphone settings and ensure it\'s working properly before recording again.'
        },
        scores: { clarity: 0, relevance: 0, structure: 0, completeness: 0, confidence: 0 }
    },
    {
        overallScore: 9,
        feedback: {
            strengths: [],
            weaknesses: [
                'Silent recording - no speech captured',
                'Microphone may be disabled or blocked',
                'No content available for analysis',
                'Unable to provide meaningful feedback'
            ],
            suggestions: [
                'Enable microphone access in browser',
                'Check that microphone is plugged in',
                'Verify microphone is not muted in system tray',
                'Test with another application first',
                'Ensure you\'re speaking into the correct device'
            ],
            detailedFeedback: 'Your recording is completely silent. This could be due to permission issues, hardware problems, or microphone settings. Please troubleshoot and try again.'
        },
        scores: { clarity: 0, relevance: 0, structure: 0, completeness: 0, confidence: 0 }
    }
]

// MASSIVE EXPANSION OF FEEDBACKS TO REACH ~100 TOTAL

const EXTRA_GOOD_FEEDBACKS = [
    {
        overallScore: 84,
        feedback: {
            strengths: ['Clear delivery', 'Good pacing', 'Relevant examples'],
            weaknesses: ['Could be more structured', 'Minor hesitation'],
            suggestions: ['Use STAR method', 'Practice transitions'],
            detailedFeedback: 'A solid answer that covers the basics well. Your delivery was clear, but the structure could be tighter. Try using the STAR method to organize your thoughts particularly for behavioral questions.'
        },
        scores: { clarity: 85, relevance: 88, structure: 80, completeness: 82, confidence: 85 }
    },
    {
        overallScore: 78,
        feedback: {
            strengths: ['Honest answer', 'Good volume', 'Understood the question'],
            weaknesses: ['Lacked depth', 'Examples were generic', 'Abrupt ending'],
            suggestions: ['Elaborate on your role', 'Provide specific outcomes', 'Conclude with a summary'],
            detailedFeedback: 'You understood the core of the question, but the answer felt a bit surface-level. Dig deeper into your specific contributions and the results of your actions.'
        },
        scores: { clarity: 80, relevance: 82, structure: 75, completeness: 76, confidence: 78 }
    },
    {
        overallScore: 93,
        feedback: {
            strengths: ['Excellent executive presence', 'Concise yet comprehensive', 'Data-driven examples'],
            weaknesses: ['None significant'],
            suggestions: ['Keep doing this', 'Mentor others'],
            detailedFeedback: 'This was a top-tier response. You managed to be concise while still providing all the necessary details and data points. Your confidence really shines through.'
        },
        scores: { clarity: 95, relevance: 96, structure: 94, completeness: 92, confidence: 95 }
    },
    {
        overallScore: 69,
        feedback: {
            strengths: ['Tried to answer', 'Good voice tone'],
            weaknesses: ['Rambled a bit', 'Lost focus on the main point', 'Too many filler words'],
            suggestions: ['Stick to one main idea', 'Pause instead of saying "um"', 'Outline your answer first'],
            detailedFeedback: 'It felt like you were thinking out loud rather than delivering a prepared answer. Take a moment to structure your thoughts before speaking to avoid rambling.'
        },
        scores: { clarity: 70, relevance: 72, structure: 65, completeness: 68, confidence: 70 }
    },
    {
        overallScore: 88,
        feedback: {
            strengths: ['Engaging storytelling', 'Relatable examples', 'Natural flow'],
            weaknesses: ['Could emphasize the "Result" more'],
            suggestions: ['Quantify the impact', 'Make sure the outcome is clear'],
            detailedFeedback: 'Great storytelling! You really engaged the listener. Just make sure to land the plane by clearly stating the final result or impact of your story.'
        },
        scores: { clarity: 90, relevance: 90, structure: 86, completeness: 88, confidence: 88 }
    },
    {
        overallScore: 75,
        feedback: {
            strengths: ['Relevant experience mentioned', 'Professional demeanor'],
            weaknesses: ['Sounded a bit robotic/rehearsed', 'Lacked energy'],
            suggestions: ['Vary your pitch', 'Smile while speaking', 'Show enthusiasm'],
            detailedFeedback: 'The content was good, but the delivery felt a bit flat. Try to inject more energy and enthusiasm into your voice to show your passion for the work.'
        },
        scores: { clarity: 80, relevance: 85, structure: 78, completeness: 75, confidence: 70 }
    },
    {
        overallScore: 82,
        feedback: {
            strengths: ['Good technical detail', 'Demonstrated expertise', 'Correct terminology'],
            weaknesses: ['Might be too technical for HR'],
            suggestions: ['Simplify for non-tech audience', 'Explain impacts simply'],
            detailedFeedback: 'You clearly know your stuff. However, remember that your interviewer might not be a technical expert. Try to explain complex concepts in simpler terms.'
        },
        scores: { clarity: 80, relevance: 90, structure: 82, completeness: 85, confidence: 85 }
    },
    {
        overallScore: 86,
        feedback: {
            strengths: ['Strong opening', 'Clear roadmap of the answer', 'Good summary'],
            weaknesses: ['Middle section got a bit bogged down'],
            suggestions: ['Keep the middle concise', 'Focus on key actions only'],
            detailedFeedback: 'I loved how you started and ended this answer. The middle section got a little detailed, but overall the structure was excellent and easy to follow.'
        },
        scores: { clarity: 88, relevance: 86, structure: 90, completeness: 84, confidence: 86 }
    },
    {
        overallScore: 72,
        feedback: {
            strengths: ['Audible voice', 'addressed the prompt'],
            weaknesses: ['Restated the question too much', 'Slow pacing'],
            suggestions: ['Jump straight into the answer', 'Pick up the pace slightly'],
            detailedFeedback: 'You spent a lot of time restating the question or setting the stage. In a short interview, get to your main points faster to maximize your time.'
        },
        scores: { clarity: 75, relevance: 75, structure: 70, completeness: 70, confidence: 72 }
    },
    {
        overallScore: 91,
        feedback: {
            strengths: ['Perfect length', 'Crystal clear', 'High impact examples'],
            weaknesses: [],
            suggestions: ['Maintain this standard'],
            detailedFeedback: 'Short, punchy, and impactful. You didn\t waste a single word. This is exactly the kind of efficiency interviewers look for.'
        },
        scores: { clarity: 95, relevance: 95, structure: 92, completeness: 90, confidence: 92 }
    },
    // Adding 20 more distinct "Good" variations
    {
        overallScore: 79, feedback: { strengths: ['Good context', 'Logical flow'], weaknesses: ['Conclusion was weak'], suggestions: ['End strong', 'Summarize key takeaway'], detailedFeedback: 'Good flow until the end. Make sure your conclusion is as strong as your introduction.' }, scores: { clarity: 82, relevance: 80, structure: 78, completeness: 75, confidence: 80 }
    },
    {
        overallScore: 83, feedback: { strengths: ['Specific details', 'Good volume'], weaknesses: ['A bit monotone'], suggestions: ['Use vocal variety', 'Emphasize key words'], detailedFeedback: 'Content is solid. Work on your vocal dynamism to keep the listener engaged throughout.' }, scores: { clarity: 85, relevance: 85, structure: 82, completeness: 80, confidence: 80 }
    },
    {
        overallScore: 89, feedback: { strengths: ['Confident', 'Well-paced'], weaknesses: ['Could use more data'], suggestions: ['Add numbers', 'Quantify success'], detailedFeedback: 'Very confident delivery. Adding just one or two metrics (e.g., "improved by 20%") would make this perfect.' }, scores: { clarity: 90, relevance: 88, structure: 88, completeness: 85, confidence: 92 }
    },
    {
        overallScore: 74, feedback: { strengths: ['Sincere', 'Relatable'], weaknesses: ['Used slang', 'Too casual'], suggestions: ['Maintain professional tone', 'Avoid informal language'], detailedFeedback: 'You came across as very authentic, but the language was a bit too casual for a formal interview. Tighten up the professionalism.' }, scores: { clarity: 80, relevance: 78, structure: 70, completeness: 70, confidence: 75 }
    },
    {
        overallScore: 94, feedback: { strengths: ['Masterful delivery', 'Compelling content'], weaknesses: [], suggestions: ['None'], detailedFeedback: 'Wow. That was a textbook example of a great interview response. Clear, concise, and compelling.' }, scores: { clarity: 96, relevance: 96, structure: 95, completeness: 94, confidence: 95 }
    },
    {
        overallScore: 77, feedback: { strengths: ['Good ideas', 'Showed potential'], weaknesses: ['Unstructured', 'Jumped around'], suggestions: ['Use a framework', 'Stick to chronological order'], detailedFeedback: 'You have great experience, but the story jumped around a lot. Try telling it chronologically to help the listener follow along.' }, scores: { clarity: 78, relevance: 82, structure: 70, completeness: 75, confidence: 78 }
    },
    {
        overallScore: 81, feedback: { strengths: ['Address the "Why"', 'Clear motivation'], weaknesses: ['Example was a bit old'], suggestions: ['Use recent examples', 'Focus on last 2-3 years'], detailedFeedback: 'Good answer, though the example felt a bit dated. Try to use a more recent experience to show your current capabilities.' }, scores: { clarity: 84, relevance: 82, structure: 80, completeness: 78, confidence: 82 }
    },
    {
        overallScore: 85, feedback: { strengths: ['Great teamwork example', 'Humble'], weaknesses: ['Undersold yourself'], suggestions: ['Highlight YOUR role', 'Don\'t just say "we"'], detailedFeedback: 'Great team player vibe. Just be careful not to attribute everything to "the team" - make sure the interviewer knows what YOU did.' }, scores: { clarity: 86, relevance: 88, structure: 84, completeness: 82, confidence: 84 }
    },
    {
        overallScore: 70, feedback: { strengths: ['Relevant topic'], weaknesses: ['Failed to answer part 2 of question'], suggestions: ['Listen carefully', 'Note down multi-part questions'], detailedFeedback: 'You answered the first part well but missed the second part of the question entirely. Always make sure to address all parts of a prompt.' }, scores: { clarity: 75, relevance: 65, structure: 70, completeness: 60, confidence: 75 }
    },
    {
        overallScore: 92, feedback: { strengths: ['Passionate', 'Clear expertise'], weaknesses: ['None'], suggestions: ['Keep it up'], detailedFeedback: 'Your passion for this topic really comes through. It is infectious and makes for a very memorable answer.' }, scores: { clarity: 94, relevance: 94, structure: 90, completeness: 90, confidence: 94 }
    },
    // ... 10 more quick ones
    { overallScore: 76, feedback: { strengths: ['Good volume'], weaknesses: ['A bit fast'], suggestions: ['Slow down'], detailedFeedback: 'Good content, but you spoke very quickly. Slow down to let your points land.' }, scores: { clarity: 78, relevance: 80, structure: 75, completeness: 75, confidence: 78 } },
    { overallScore: 87, feedback: { strengths: ['Great structure'], weaknesses: ['Minor pause'], suggestions: ['Keep flowing'], detailedFeedback: 'Almost perfect. One small pause in the middle, but otherwise excellent flow.' }, scores: { clarity: 90, relevance: 88, structure: 92, completeness: 85, confidence: 85 } },
    { overallScore: 80, feedback: { strengths: ['Clear'], weaknesses: ['Generic'], suggestions: ['Be specific'], detailedFeedback: 'Clear but a bit generic. Spice it up with unique details.' }, scores: { clarity: 85, relevance: 80, structure: 80, completeness: 75, confidence: 80 } },
    { overallScore: 73, feedback: { strengths: ['Tried'], weaknesses: ['Off topic'], suggestions: ['Stay focused'], detailedFeedback: 'You veered off topic a bit. Bring it back to the core question sooner.' }, scores: { clarity: 75, relevance: 65, structure: 70, completeness: 75, confidence: 75 } },
    { overallScore: 90, feedback: { strengths: ['Amazing'], weaknesses: [], suggestions: [], detailedFeedback: 'Really strong answer. no notes.' }, scores: { clarity: 92, relevance: 92, structure: 90, completeness: 90, confidence: 90 } },
    { overallScore: 65, feedback: { strengths: ['Spoke up'], weaknesses: ['Unsure'], suggestions: ['Fake it til you make it'], detailedFeedback: 'You sounded very unsure of your answer. Even if you don\'t know, sound confident!' }, scores: { clarity: 70, relevance: 70, structure: 60, completeness: 60, confidence: 60 } },
    { overallScore: 82, feedback: { strengths: ['Detail'], weaknesses: ['Long'], suggestions: ['Cut down'], detailedFeedback: 'Good details, but maybe too many. Try to edit it down to the essentials.' }, scores: { clarity: 85, relevance: 85, structure: 75, completeness: 85, confidence: 80 } },
    { overallScore: 78, feedback: { strengths: ['Good tone'], weaknesses: ['Filler words'], suggestions: ['Pause'], detailedFeedback: 'Watch the "ums" and "ahs". Silence is better than a filler word.' }, scores: { clarity: 80, relevance: 80, structure: 75, completeness: 75, confidence: 75 } },
    { overallScore: 88, feedback: { strengths: ['Solid'], weaknesses: ['None'], suggestions: [], detailedFeedback: 'Solid, professional, and competent. A very safe and good answer.' }, scores: { clarity: 90, relevance: 90, structure: 85, completeness: 85, confidence: 90 } },
    { overallScore: 95, feedback: { strengths: ['Perfect'], weaknesses: [], suggestions: [], detailedFeedback: 'Outstanding. One of the best I\'ve heard.' }, scores: { clarity: 98, relevance: 98, structure: 98, completeness: 95, confidence: 95 } }
]

const EXTRA_SHORT_FEEDBACKS = [
    { overallScore: 23, feedback: { strengths: ['Started ok'], weaknesses: ['Stopped too soon'], suggestions: ['Keep going'], detailedFeedback: 'You stopped just as you were getting started! Don\'t be afraid to take your time.' }, scores: { clarity: 30, relevance: 20, structure: 15, completeness: 10, confidence: 25 } },
    { overallScore: 26, feedback: { strengths: ['Clear word'], weaknesses: ['One word answer'], suggestions: ['Elaborate'], detailedFeedback: 'One word answers are rarely enough. Always elaborate.' }, scores: { clarity: 40, relevance: 20, structure: 10, completeness: 5, confidence: 30 } },
    { overallScore: 29, feedback: { strengths: ['High energy'], weaknesses: ['Too brief'], suggestions: ['Expand'], detailedFeedback: 'Great energy in that brief second, but we need more content!' }, scores: { clarity: 35, relevance: 25, structure: 20, completeness: 15, confidence: 35 } },
    { overallScore: 22, feedback: { strengths: ['Audible'], weaknesses: ['Cut off'], suggestions: ['Check timer'], detailedFeedback: 'It sounds like you might have accidentally stopped recording. Give it another shot.' }, scores: { clarity: 25, relevance: 20, structure: 15, completeness: 10, confidence: 20 } },
    { overallScore: 27, feedback: { strengths: ['Direct'], weaknesses: ['No context'], suggestions: ['Add context'], detailedFeedback: 'Directness is good, but this was too abrupt. Add some context.' }, scores: { clarity: 35, relevance: 25, structure: 20, completeness: 18, confidence: 32 } },
    // 10 more random short ones
    { overallScore: 20, feedback: { strengths: [], weaknesses: ['Too short'], suggestions: ['More'], detailedFeedback: 'Too short to evaluate.' }, scores: { clarity: 20, relevance: 20, structure: 20, completeness: 10, confidence: 20 } },
    { overallScore: 21, feedback: { strengths: [], weaknesses: ['Brief'], suggestions: ['Length'], detailedFeedback: 'Please record a longer response.' }, scores: { clarity: 20, relevance: 20, structure: 20, completeness: 10, confidence: 20 } },
    { overallScore: 22, feedback: { strengths: [], weaknesses: ['Quick'], suggestions: ['Time'], detailedFeedback: 'Take your time. This was too quick.' }, scores: { clarity: 20, relevance: 20, structure: 20, completeness: 10, confidence: 20 } },
    { overallScore: 23, feedback: { strengths: [], weaknesses: ['Short'], suggestions: ['Expand'], detailedFeedback: 'Expand on your thoughts.' }, scores: { clarity: 20, relevance: 20, structure: 20, completeness: 10, confidence: 20 } },
    { overallScore: 24, feedback: { strengths: [], weaknesses: ['Abrupt'], suggestions: ['Flow'], detailedFeedback: 'Very abrupt ending.' }, scores: { clarity: 20, relevance: 20, structure: 20, completeness: 10, confidence: 20 } },
    { overallScore: 25, feedback: { strengths: [], weaknesses: ['Brief'], suggestions: ['More'], detailedFeedback: 'Need more detail.' }, scores: { clarity: 20, relevance: 20, structure: 20, completeness: 10, confidence: 20 } },
    { overallScore: 26, feedback: { strengths: [], weaknesses: ['Tiny'], suggestions: ['Big'], detailedFeedback: 'A tiny answer for a big question.' }, scores: { clarity: 20, relevance: 20, structure: 20, completeness: 10, confidence: 20 } },
    { overallScore: 27, feedback: { strengths: [], weaknesses: ['Fast'], suggestions: ['Slow'], detailedFeedback: 'Too fast and too short.' }, scores: { clarity: 20, relevance: 20, structure: 20, completeness: 10, confidence: 20 } },
    { overallScore: 28, feedback: { strengths: [], weaknesses: ['Little'], suggestions: ['Lot'], detailedFeedback: 'Give us a lot more.' }, scores: { clarity: 20, relevance: 20, structure: 20, completeness: 10, confidence: 20 } },
    { overallScore: 29, feedback: { strengths: [], weaknesses: ['Mini'], suggestions: ['Maxi'], detailedFeedback: 'Maximize your answer time.' }, scores: { clarity: 20, relevance: 20, structure: 20, completeness: 10, confidence: 20 } }
]

const EXTRA_NO_VOICE_FEEDBACKS = [
    { overallScore: 3, feedback: { strengths: [], weaknesses: ['Silence'], suggestions: ['Check mic'], detailedFeedback: 'We heard nothing. Please check your mic.' }, scores: { clarity: 0, relevance: 0, structure: 0, completeness: 0, confidence: 0 } },
    { overallScore: 2, feedback: { strengths: [], weaknesses: ['Dead air'], suggestions: ['Unmute'], detailedFeedback: 'Dead air. Are you muted?' }, scores: { clarity: 0, relevance: 0, structure: 0, completeness: 0, confidence: 0 } },
    { overallScore: 1, feedback: { strengths: [], weaknesses: ['Quiet'], suggestions: ['Volume up'], detailedFeedback: 'Too quiet to detect.' }, scores: { clarity: 0, relevance: 0, structure: 0, completeness: 0, confidence: 0 } },
    { overallScore: 0, feedback: { strengths: [], weaknesses: ['Nothing'], suggestions: ['Settings'], detailedFeedback: 'Absolutely nothing recorded.' }, scores: { clarity: 0, relevance: 0, structure: 0, completeness: 0, confidence: 0 } },
    { overallScore: 4, feedback: { strengths: [], weaknesses: ['No input'], suggestions: ['Hardware'], detailedFeedback: 'No input signal received.' }, scores: { clarity: 0, relevance: 0, structure: 0, completeness: 0, confidence: 0 } },
    // 5 more variations
    { overallScore: 5, feedback: { strengths: [], weaknesses: ['Muted'], suggestions: ['Check'], detailedFeedback: 'Microphone seems muted.' }, scores: { clarity: 0, relevance: 0, structure: 0, completeness: 0, confidence: 0 } },
    { overallScore: 6, feedback: { strengths: [], weaknesses: ['Silent'], suggestions: ['Test'], detailedFeedback: 'Silent recording.' }, scores: { clarity: 0, relevance: 0, structure: 0, completeness: 0, confidence: 0 } },
    { overallScore: 7, feedback: { strengths: [], weaknesses: ['Empty'], suggestions: ['Try again'], detailedFeedback: 'Empty audio file.' }, scores: { clarity: 0, relevance: 0, structure: 0, completeness: 0, confidence: 0 } },
    { overallScore: 8, feedback: { strengths: [], weaknesses: ['Void'], suggestions: ['Fix mic'], detailedFeedback: 'Void of sound.' }, scores: { clarity: 0, relevance: 0, structure: 0, completeness: 0, confidence: 0 } },
    { overallScore: 9, feedback: { strengths: [], weaknesses: ['Null'], suggestions: ['Reload'], detailedFeedback: 'Null audio data.' }, scores: { clarity: 0, relevance: 0, structure: 0, completeness: 0, confidence: 0 } }
]

// NEW CATEGORY: AVERAGE/MID FEEDBACKS (Score 40-65) - For short or unstructured answers
const AVERAGE_FEEDBACKS = [
    { overallScore: 45, feedback: { strengths: ['Attempted to answer'], weaknesses: ['Very brief', 'Lacks depth'], suggestions: ['Use STAR method', 'Give an example'], detailedFeedback: 'The answer was technically there, but extremely brief. You need to elaborate to show your competence.' }, scores: { clarity: 50, relevance: 50, structure: 40, completeness: 40, confidence: 45 } },
    { overallScore: 52, feedback: { strengths: ['Clear voice'], weaknesses: ['Surface level only', 'No reasoning'], suggestions: ['Explain "Why"', 'Add details'], detailedFeedback: 'You stated your point but didn\'t back it up. In an interview, the "why" and "how" are just as important as the "what".' }, scores: { clarity: 60, relevance: 50, structure: 50, completeness: 50, confidence: 50 } },
    { overallScore: 58, feedback: { strengths: ['Understood prompt'], weaknesses: ['Rushed delivery', 'Jumbled thoughts'], suggestions: ['Pause and think', 'Slow down'], detailedFeedback: 'You seemed to rush through the answer. It\'s okay to take a breath and structure your thoughts before speaking.' }, scores: { clarity: 55, relevance: 60, structure: 50, completeness: 60, confidence: 65 } },
    { overallScore: 48, feedback: { strengths: ['Valid point made'], weaknesses: ['Monotone', 'Low energy'], suggestions: ['Show enthusiasm', 'Vary tone'], detailedFeedback: 'Content was passable, but the delivery was very flat. It\'s hard to get excited about a candidate who doesn\'t sound excited themselves.' }, scores: { clarity: 50, relevance: 50, structure: 50, completeness: 45, confidence: 45 } },
    { overallScore: 62, feedback: { strengths: ['Good start'], weaknesses: ['Lost steam', 'Repetitive'], suggestions: ['Keep it concise', 'Don\'t loop'], detailedFeedback: 'You started strong but then kept repeating the same point. Make your point once, support it, and move on.' }, scores: { clarity: 65, relevance: 65, structure: 55, completeness: 60, confidence: 60 } },
    { overallScore: 55, feedback: { strengths: ['Polite tone'], weaknesses: ['Vague', 'Generic'], suggestions: ['Be specific', 'Personalize it'], detailedFeedback: 'This answer could apply to anyone. You need to inject your personal experience and specific details to make it memorable.' }, scores: { clarity: 60, relevance: 50, structure: 55, completeness: 55, confidence: 55 } },
    { overallScore: 42, feedback: { strengths: ['Spoke clearly'], weaknesses: ['Did not answer question', 'Went off tangent'], suggestions: ['Listen carefully', 'Pivot back'], detailedFeedback: 'You spoke clearly, but unfortunately, you didn\'t actually answer the question asked. Always double-check the prompt.' }, scores: { clarity: 60, relevance: 30, structure: 40, completeness: 40, confidence: 50 } },
    { overallScore: 60, feedback: { strengths: ['Decent structure'], weaknesses: ['Filler words (um, ah)', 'Hesitant'], suggestions: ['Practice pauses', 'Record yourself'], detailedFeedback: 'The structure was okay, but the amount of filler words ("um," "like") was distracting. Practice becoming comfortable with silence.' }, scores: { clarity: 55, relevance: 65, structure: 60, completeness: 60, confidence: 55 } },
    { overallScore: 50, feedback: { strengths: ['Relevance'], weaknesses: ['Too informal', 'Slang'], suggestions: ['Professional vocabulary', 'Formal tone'], detailedFeedback: 'The content is relevant, but your language is too casual for a professional setting. Avoid slang and casual phrases.' }, scores: { clarity: 55, relevance: 60, structure: 45, completeness: 45, confidence: 50 } },
    { overallScore: 64, feedback: { strengths: ['Confident tone'], weaknesses: ['Lacked substance', 'Fluff'], suggestions: ['Focus on facts', 'Results driven'], detailedFeedback: 'You sounded confident, which is great, but the actual content was a bit "fluffy". Focus more on concrete actions and results.' }, scores: { clarity: 70, relevance: 60, structure: 60, completeness: 60, confidence: 70 } }
]

class StaticFeedbackService {
    /**
     * Generate static feedback based on audio metrics
     */
    generateFeedback(metrics: AudioMetrics): AnswerAnalysis {
        const { duration, hasVoice, transcript } = metrics

        // Scenario 1: No voice detected (muted/silent) - Score 0-10
        if (!hasVoice) {
            const allNoVoiceFeedbacks = [...NO_VOICE_FEEDBACKS, ...MORE_NO_VOICE_FEEDBACKS, ...EXTRA_NO_VOICE_FEEDBACKS]
            return this.getRandomFeedback(allNoVoiceFeedbacks, transcript, duration)
        }

        // Scenario 2: Very Short / Bad Audio (< 5 seconds) - Score 20-30
        if (duration < 5) {
            const allShortFeedbacks = [...SHORT_AUDIO_FEEDBACKS, ...MORE_SHORT_FEEDBACKS, ...EXTRA_SHORT_FEEDBACKS]
            return this.getRandomFeedback(allShortFeedbacks, transcript, duration)
        }

        // Scenario 3: REALISTIC TIERED FEEDBACK
        // This ensures short/average answers get "Mid" scores, and only detailed answers get "High" scores.

        // Tier A: Brief/Weak Answer (5-15 seconds) -> Mostly AVERAGE feedbacks (Score 40-65)
        if (duration >= 5 && duration < 15) {
            console.log('📊 Tier A: Short/Brief Answer detected')
            // 80% chance of Average feedback, 20% chance of lower-end Good feedback
            if (Math.random() > 0.2) {
                return this.getRandomFeedback(AVERAGE_FEEDBACKS, transcript, duration)
            } else {
                // Pick from a filtered list of "Good" feedbacks that have scores < 75
                const lowerGoodFeedbacks = [...GOOD_FEEDBACKS, ...MORE_GOOD_FEEDBACKS, ...EXTRA_GOOD_FEEDBACKS].filter(f => f.overallScore < 75)
                return this.getRandomFeedback(lowerGoodFeedbacks.length > 0 ? lowerGoodFeedbacks : AVERAGE_FEEDBACKS, transcript, duration)
            }
        }

        // Tier B: Standard Answer (15-40 seconds) -> Mix of AVERAGE and GOOD (Score 60-85)
        if (duration >= 15 && duration < 40) {
            console.log('📊 Tier B: Standard Answer detected')
            // Mix: Average feedbacks and Standard good feedbacks
            // Filter out the "Super Excellent" ones > 90 to encourage longer answers for top scores
            const standardFeedbacks = [...GOOD_FEEDBACKS, ...MORE_GOOD_FEEDBACKS, ...EXTRA_GOOD_FEEDBACKS].filter(f => f.overallScore < 90)
            const mixedPool = [...standardFeedbacks, ...AVERAGE_FEEDBACKS]
            return this.getRandomFeedback(mixedPool, transcript, duration)
        }

        // Tier C: Detailed/Strong Answer (40+ seconds) -> Mostly GOOD/EXCELLENT (Score 75-99)
        console.log('📊 Tier C: Detailed Answer detected')
        const allGoodFeedbacks = [...GOOD_FEEDBACKS, ...MORE_GOOD_FEEDBACKS, ...EXTRA_GOOD_FEEDBACKS]
        // Remove the really low average ones to reward strict effort
        const highQualityPool = allGoodFeedbacks.filter(f => f.overallScore > 70)
        return this.getRandomFeedback(highQualityPool, transcript, duration)
    }

    /**
     * Get random feedback from a category
     */
    private getRandomFeedback(
        feedbackArray: any[],
        transcript: string,
        duration: number
    ): AnswerAnalysis {
        const randomIndex = Math.floor(Math.random() * feedbackArray.length)
        const selectedFeedback = feedbackArray[randomIndex]

        // Calculate efficiency based on duration
        let efficiency: 'excellent' | 'good' | 'average' | 'poor'
        if (duration >= 30 && duration <= 120) {
            efficiency = 'excellent'
        } else if (duration >= 15 && duration < 30) {
            efficiency = 'good'
        } else if (duration >= 5 && duration < 15) {
            efficiency = 'average'
        } else {
            efficiency = 'poor'
        }

        // Generate pacing description
        const wordsPerMinute = duration > 0 ? Math.round((transcript.split(/\s+/).length / duration) * 60) : 0
        let pacing: string
        if (wordsPerMinute >= 120 && wordsPerMinute <= 160) {
            pacing = 'Excellent pacing - clear and easy to follow'
        } else if (wordsPerMinute > 160) {
            pacing = 'Slightly fast - consider slowing down for clarity'
        } else if (wordsPerMinute < 120 && wordsPerMinute > 0) {
            pacing = 'Moderate pace - could be slightly faster'
        } else {
            pacing = 'Unable to determine pacing'
        }

        return {
            overallScore: selectedFeedback.overallScore,
            transcript,
            feedback: selectedFeedback.feedback,
            scores: selectedFeedback.scores,
            keyPoints: {
                covered: selectedFeedback.feedback.strengths.slice(0, 3),
                missed: selectedFeedback.feedback.weaknesses.slice(0, 3)
            },
            timeManagement: {
                duration,
                efficiency,
                pacing
            },
            processingTime: Math.floor(Math.random() * 500) + 200 // Simulate 200-700ms processing
        }
    }

    /**
     * Analyze audio metrics from recording
     */
    analyzeAudioMetrics(
        audioBlob: Blob,
        duration: number,
        transcript: string,
        audioLevelData: { maxRms: number; sumRms: number; frames: number }
    ): AudioMetrics {
        const wordCount = transcript.split(/\s+/).filter(w => w.length > 0).length
        const avgRms = audioLevelData.frames > 0 ? audioLevelData.sumRms / audioLevelData.frames : 0
        const maxRms = audioLevelData.maxRms

        // Determine if voice was detected - prioritize audio levels over transcript
        const bytesPerSecond = duration > 0 ? audioBlob.size / duration : 0

        // Voice detection based primarily on audio levels
        const hasAudioSignal =
            duration > 0 &&
            audioBlob.size >= 2000 &&
            bytesPerSecond >= 300 &&
            (audioLevelData.frames === 0 || maxRms >= 0.015 || avgRms >= 0.008)

        // Consider it has voice if either:
        // 1. Strong audio signal detected, OR
        // 2. Transcript has words (even if audio levels are low)
        const hasVoice = hasAudioSignal || wordCount > 0

        console.log('🎤 Voice Detection:', {
            hasVoice,
            hasAudioSignal,
            wordCount,
            maxRms: maxRms.toFixed(4),
            avgRms: avgRms.toFixed(4),
            bytesPerSecond: Math.round(bytesPerSecond),
            duration
        })

        return {
            duration,
            hasVoice,
            transcript,
            wordCount,
            avgRms,
            maxRms
        }
    }
}

// Export singleton instance
export const staticFeedbackService = new StaticFeedbackService()
export default staticFeedbackService
