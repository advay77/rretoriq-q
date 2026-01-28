export interface EmailQuestion {
  id: string;
  text: string;
  type: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  skillsEvaluated: string[];
  metadata: {
    expectedAnswerLength: number;
    keyPoints: string[];
  };
}

export const emailQuestions: EmailQuestion[] = [
  // Easy Level Questions
  {
    id: "email-easy-001",
    text: "Write an email to your manager, Mr. Smith, requesting a day off next Friday for a personal appointment.",
    type: "Writing (Emails)",
    difficulty: "Easy",
    skillsEvaluated: ["Clarity", "Professionalism", "Following Instructions"],
    metadata: {
      expectedAnswerLength: 50,
      keyPoints: [
        "Clear subject line (e.g., 'Leave Request')",
        "State the specific date clearly",
        "Maintain a polite and formal tone",
        "Offer to complete work in advance if possible"
      ]
    }
  },
  {
    id: "email-easy-002",
    text: "You missed a call from your colleague, Sarah. Write an email to her acknowledging the missed call and asking when would be a good time to call her back.",
    type: "Writing (Emails)",
    difficulty: "Easy",
    skillsEvaluated: ["Clarity", "Courtesy", "Proactiveness"],
    metadata: {
      expectedAnswerLength: 40,
      keyPoints: [
        "Acknowledge the missed call",
        "Apologize for being unavailable",
        "Propose to reconnect",
        "Ask for her availability"
      ]
    }
  },
  {
    id: "email-easy-003",
    text: "Write an email to your team confirming the time and location for the weekly team meeting tomorrow. The meeting is at 10 AM in Conference Room 3.",
    type: "Writing (Emails)",
    difficulty: "Easy",
    skillsEvaluated: ["Informational Writing", "Clarity", "Attention to Detail"],
    metadata: {
      expectedAnswerLength: 35,
      keyPoints: [
        "Clear subject line (e.g., 'Meeting Confirmation')",
        "State the purpose, date, time, and location",
        "Keep it brief and to the point"
      ]
    }
  },
  {
    id: "email-easy-004",
    text: "Write a thank-you email to a colleague, David, who helped you solve a technical issue today.",
    type: "Writing (Emails)",
    difficulty: "Easy",
    skillsEvaluated: ["Professional Courtesy", "Gratitude", "Interpersonal Skills"],
    metadata: {
      expectedAnswerLength: 45,
      keyPoints: [
        "Express sincere thanks",
        "Specifically mention what he helped with",
        "Acknowledge the positive impact of his help",
        "Maintain a warm but professional tone"
      ]
    }
  },
  {
    id: "email-easy-005",
    text: "Write an email informing your team that the office internet will be down for maintenance from 2 PM to 3 PM today.",
    type: "Writing (Emails)",
    difficulty: "Easy",
    skillsEvaluated: ["Clarity", "Informational Writing", "Proactiveness"],
    metadata: {
      expectedAnswerLength: 50,
      keyPoints: [
        "Informative subject line (e.g., 'Internet Maintenance Today')",
        "Clearly state the issue and the timeframe",
        "Suggest planning work accordingly",
        "Apologize for any inconvenience"
      ]
    }
  },
  
  // Medium Level Questions
  {
    id: "email-medium-001",
    text: "You are running 15-20 minutes late for a meeting with a client, Ms. Davis, due to unexpected traffic. Write a professional email to inform her.",
    type: "Writing (Emails)",
    difficulty: "Medium",
    skillsEvaluated: ["Professionalism", "Time Management", "Client Communication", "Tone"],
    metadata: {
      expectedAnswerLength: 60,
      keyPoints: [
        "Apologize sincerely for the delay",
        "Briefly and professionally state the reason (e.g., 'unexpected traffic')",
        "Provide a realistic estimated time of arrival (ETA)",
        "Reiterate your eagerness for the meeting"
      ]
    }
  },
  {
    id: "email-medium-002",
    text: "Write an email to a colleague in another department, Alex, to request data you need for your quarterly report. You need the data by the end of the week. This is your first time contacting Alex.",
    type: "Writing (Emails)",
    difficulty: "Medium",
    skillsEvaluated: ["Persuasion", "Clarity", "Interdepartmental Communication"],
    metadata: {
      expectedAnswerLength: 75,
      keyPoints: [
        "Introduce yourself and the purpose of your email clearly",
        "Specify exactly what data you need",
        "Provide context on why it's important (for the report)",
        "Give a clear, polite deadline"
      ]
    }
  },
  {
    id: "email-medium-003",
    text: "A client has emailed with a complaint about a delayed delivery. Write an initial response to acknowledge their email and assure them you are looking into the issue.",
    type: "Writing (Emails)",
    difficulty: "Medium",
    skillsEvaluated: ["Customer Service", "Empathy", "Problem Solving", "Tone"],
    metadata: {
      expectedAnswerLength: 80,
      keyPoints: [
        "Acknowledge the client's frustration and apologize for the inconvenience",
        "Confirm you have received their complaint",
        "Assure them you are investigating the issue promptly",
        "Provide a timeframe for your next follow-up"
      ]
    }
  },
  {
    id: "email-medium-004",
    text: "Write a follow-up email to a potential employer one week after a job interview. Reiterate your interest in the position and inquire about the status of your application.",
    type: "Writing (Emails)",
    difficulty: "Medium",
    skillsEvaluated: ["Professionalism", "Follow-up", "Persuasion"],
    metadata: {
      expectedAnswerLength: 90,
      keyPoints: [
        "Reference the specific job title and interview date",
        "Briefly reiterate your enthusiasm for the role",
        "Mention a specific point from the discussion to jog their memory",
        "Politely inquire about the timeline for the hiring decision"
      ]
    }
  },
  {
    id: "email-medium-005",
    text: "Your manager has asked for an update on the 'Project Alpha' you are leading. Write a concise progress update email highlighting what has been completed, what is next, and mentioning one minor obstacle.",
    type: "Writing (Emails)",
    difficulty: "Medium",
    skillsEvaluated: ["Reporting", "Clarity", "Problem Identification"],
    metadata: {
      expectedAnswerLength: 100,
      keyPoints: [
        "Use clear headings (Completed, Next Steps, Challenges)",
        "Summarize progress with key bullet points",
        "Clearly state the next immediate actions",
        "Briefly and professionally mention the obstacle without being negative"
      ]
    }
  },
  
  // Hard Level Questions
  {
    id: "email-hard-001",
    text: "A key project stakeholder, Mr. Chen, has requested a significant change to the project scope that will delay the deadline by two weeks. Write an email to your manager explaining the request, its impact, and recommending a course of action.",
    type: "Writing (Emails)",
    difficulty: "Hard",
    skillsEvaluated: ["Strategic Communication", "Analytical Skills", "Persuasion", "Risk Management"],
    metadata: {
      expectedAnswerLength: 150,
      keyPoints: [
        "Clearly state the requested change",
        "Analyze and explain its impact on the timeline, budget, and resources",
        "Present a clear recommendation (e.g., approve with a new timeline, propose a phased approach)",
        "Maintain a neutral, data-driven tone"
      ]
    }
  },
  {
    id: "email-hard-002",
    text: "You need to decline a request from a senior colleague, Ms. Roberts, to join her project because your current workload is at maximum capacity. Write a polite but firm email explaining your situation without damaging your professional relationship.",
    type: "Writing (Emails)",
    difficulty: "Hard",
    skillsEvaluated: ["Tact and Diplomacy", "Assertiveness", "Relationship Management"],
    metadata: {
      expectedAnswerLength: 120,
      keyPoints: [
        "Express appreciation for the offer",
        "Clearly and politely state that you cannot take on more work",
        "Briefly explain the reason (e.g., 'fully committed to Project X deadline') without making excuses",
        "Suggest an alternative if possible (e.g., 'I can be available after X date') or offer to recommend someone else"
      ]
    }
  },
  {
    id: "email-hard-003",
    text: "Write an email to your entire team addressing a recent drop in performance and missed deadlines. The tone should be motivating and constructive, not accusatory. Propose a team meeting to discuss solutions.",
    type: "Writing (Emails)",
    difficulty: "Hard",
    skillsEvaluated: ["Leadership", "Constructive Feedback", "Motivation", "Tone Management"],
    metadata: {
      expectedAnswerLength: 130,
      keyPoints: [
        "Acknowledge the team's hard work first",
        "Address the performance issue using objective, team-focused language ('we' instead of 'you')",
        "Frame it as a collective challenge to overcome",
        "Propose a collaborative meeting to brainstorm solutions and reset expectations"
      ]
    }
  },
  {
    id: "email-hard-004",
    text: "A client has disputed an invoice, claiming the work delivered did not meet the agreed-upon requirements. Write an email to the client to address their concern, referencing the original scope document and suggesting a call to resolve the issue.",
    type: "Writing (Emails)",
    difficulty: "Hard",
    skillsEvaluated: ["Conflict Resolution", "Negotiation", "Client Management", "Attention to Detail"],
    metadata: {
      expectedAnswerLength: 160,
      keyPoints: [
        "Acknowledge their concern with an empathetic tone",
        "Politely refer to the specific sections of the signed agreement or scope of work",
        "Avoid being defensive; focus on alignment and facts",
        "Propose a meeting or call as the next step to discuss and find a resolution"
      ]
    }
  },
  {
    id: "email-hard-005",
    text: "You are resigning from your position. Write a formal resignation email to your manager, providing a two-week notice. Express gratitude for the opportunity and offer to help with the transition process.",
    type: "Writing (Emails)",
    difficulty: "Hard",
    skillsEvaluated: ["Professionalism", "Graceful Exit", "Formal Communication"],
    metadata: {
      expectedAnswerLength: 100,
      keyPoints: [
        "State your intention to resign and your last effective day of employment",
        "Express gratitude for the experience and opportunities",
        "Offer to assist in a smooth transition (e.g., training a replacement, documenting processes)",
        "Maintain a positive and respectful tone to preserve the professional relationship"
      ]
    }
  }
];

// Helper function to get questions by difficulty
export const getEmailQuestionsByDifficulty = (difficulty: 'Easy' | 'Medium' | 'Hard'): EmailQuestion[] => {
  return emailQuestions.filter(q => q.difficulty === difficulty);
};

// Helper function to get a random question by difficulty
export const getRandomEmailQuestion = (difficulty: 'Easy' | 'Medium' | 'Hard'): EmailQuestion => {
  const questions = getEmailQuestionsByDifficulty(difficulty);
  const randomIndex = Math.floor(Math.random() * questions.length);
  return questions[randomIndex];
};
