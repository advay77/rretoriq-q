export interface FrameworkQA {
    id: number;
    question: string;
    answer: {
        S?: string;
        T?: string;
        A?: string;
        R?: string;
        O?: string; // For SOAR
        P?: string; // For PREP
        E?: string; // For PREP
        Why?: string; // For WHW
        How?: string; // For WHW
        What?: string; // For WHW
        Context?: string; // For CAR
        Action?: string; // For CAR/A3
        Result?: string; // For CAR
        Analysis?: string; // For A3
        Adjustment?: string; // For A3
    };
}

export const starFrameworkQuestions: FrameworkQA[] = [
    {
        id: 1,
        question: "Tell me about a time you worked under pressure.",
        answer: {
            S: "During my second semester, we had overlapping project submissions and exams in the same week.",
            T: "I had to complete a major assignment while preparing for two internal tests.",
            A: "I listed tasks by urgency, blocked focused study hours, and completed the project in smaller daily milestones instead of last-minute work.",
            R: "I submitted everything on time and scored well, which taught me how planning reduces pressure."
        }
    },
    {
        id: 2,
        question: "Describe a situation where you faced a challenge.",
        answer: {
            S: "In a group project, one teammate stopped responding close to the deadline.",
            T: "Our task was to deliver a complete presentation without delays.",
            A: "I redistributed the pending work, informed the mentor early, and simplified the scope to ensure quality.",
            R: "The project was accepted, and I learned how adaptability matters more than ideal planning."
        }
    },
    {
        id: 3,
        question: "Tell me about a time you showed initiative.",
        answer: {
            S: "Our college club events had very low student participation.",
            T: "I wanted to improve engagement.",
            A: "I suggested short interactive segments instead of long talks and promoted them via WhatsApp groups.",
            R: "Attendance improved, and the club adopted this format for future events."
        }
    },
    {
        id: 4,
        question: "Describe a time you had to meet a tight deadline.",
        answer: {
            S: "During a hackathon, our demo was scheduled earlier than expected.",
            T: "We had to make the product stable quickly.",
            A: "I focused on core features, removed unstable ones, and coordinated testing with teammates.",
            R: "The demo worked smoothly, and judges appreciated the clarity."
        }
    },
    {
        id: 5,
        question: "Tell me about a time you worked in a team.",
        answer: {
            S: "In a semester project, our team had members from different skill levels.",
            T: "We needed to deliver a working solution together.",
            A: "I ensured everyone had clear responsibilities and regularly checked progress.",
            R: "The project was completed smoothly and strengthened our teamwork."
        }
    },
    {
        id: 6,
        question: "Describe a situation where you handled responsibility.",
        answer: {
            S: "I was responsible for submitting final documentation for a project.",
            T: "Accuracy and timely submission were critical.",
            A: "I reviewed the document twice and cross-checked requirements before submission.",
            R: "The project was approved without revisions."
        }
    },
    {
        id: 7,
        question: "Tell me about a time you solved a problem.",
        answer: {
            S: "Our application kept crashing during testing.",
            T: "My task was to identify the root cause.",
            A: "I isolated modules, reviewed logs, and fixed a memory handling issue.",
            R: "The app became stable, improving overall performance."
        }
    },
    {
        id: 8,
        question: "Describe a time you handled failure.",
        answer: {
            S: "In my first presentation, I forgot key points due to nervousness.",
            T: "I needed to recover without losing confidence.",
            A: "I paused, referred briefly to notes, and continued calmly.",
            R: "Though not perfect, I finished confidently and later improved through practice."
        }
    },
    {
        id: 9,
        question: "Tell me about a time you received feedback.",
        answer: {
            S: "A mentor pointed out my explanations were too technical.",
            T: "I needed to improve clarity.",
            A: "I practiced simplifying explanations and using examples.",
            R: "My communication improved, especially in group discussions."
        }
    },
    {
        id: 10,
        question: "Describe a situation where you adapted to change.",
        answer: {
            S: "Midway through a project, requirements were updated.",
            T: "We had to modify our approach quickly.",
            A: "I adjusted the plan and redistributed tasks accordingly.",
            R: "The updated version was delivered on time."
        }
    },
    {
        id: 11,
        question: "Tell me about a time you handled conflict.",
        answer: {
            S: "A teammate disagreed with my approach.",
            T: "We needed to decide quickly.",
            A: "I suggested listing pros and cons of both ideas.",
            R: "We reached a balanced decision without conflict."
        }
    },
    {
        id: 12,
        question: "Describe a time you helped someone.",
        answer: {
            S: "A junior struggled with a subject before exams.",
            T: "I wanted to help them understand concepts.",
            A: "I explained topics using simple examples and short sessions.",
            R: "They passed confidently, and it reinforced my own understanding."
        }
    },
    {
        id: 13,
        question: "Tell me about a time you managed multiple tasks.",
        answer: {
            S: "During exam week, I had both academic and club responsibilities.",
            T: "I needed to balance both.",
            A: "I created a time-based schedule and followed strict priorities.",
            R: "Everything was completed without burnout."
        }
    },
    {
        id: 14,
        question: "Describe a time you learned something quickly.",
        answer: {
            S: "I had to learn a new tool for a project.",
            T: "The deadline was close.",
            A: "I focused on essential features through tutorials and practice.",
            R: "I completed my part successfully and gained confidence."
        }
    },
    {
        id: 15,
        question: "Tell me about a time you took ownership.",
        answer: {
            S: "Our group lacked coordination near submission.",
            T: "Someone needed to take charge.",
            A: "I tracked tasks, followed up with members, and ensured completion.",
            R: "The project was submitted smoothly."
        }
    },
    {
        id: 16,
        question: "Describe a time you improved a process.",
        answer: {
            S: "Our team meetings were unstructured.",
            T: "Productivity was low.",
            A: "I suggested a fixed agenda and time limit.",
            R: "Meetings became shorter and more effective."
        }
    },
    {
        id: 17,
        question: "Tell me about a time you handled stress.",
        answer: {
            S: "Before my first interview, I felt anxious.",
            T: "I needed to perform well.",
            A: "I practiced mock interviews and focused on breathing techniques.",
            R: "I stayed calm and answered confidently."
        }
    },
    {
        id: 18,
        question: "Describe a time you worked with limited resources.",
        answer: {
            S: "We had minimal tools for a college project.",
            T: "We still had to deliver results.",
            A: "We used free tools and optimized available resources.",
            R: "The project met expectations without extra cost."
        }
    },
    {
        id: 19,
        question: "Tell me about a time you supported a team goal.",
        answer: {
            S: "Our team aimed to finish early for review.",
            T: "Everyone had to cooperate.",
            A: "I completed my tasks early and helped others.",
            R: "We submitted ahead of time."
        }
    },
    {
        id: 20,
        question: "Describe a time you showed leadership.",
        answer: {
            S: "Our team was confused about task allocation.",
            T: "Someone needed to guide.",
            A: "I clarified roles and ensured alignment.",
            R: "Execution improved significantly."
        }
    },
    {
        id: 21,
        question: "Tell me about a time you learned from a mistake.",
        answer: {
            S: "I once underestimated task complexity.",
            T: "It caused delays.",
            A: "I analyzed the gap and planned better next time.",
            R: "Future tasks were handled more accurately."
        }
    },
    {
        id: 22,
        question: "Describe a time you communicated effectively.",
        answer: {
            S: "Our mentor needed quick project updates.",
            T: "Clarity was important.",
            A: "I summarized progress concisely.",
            R: "Decisions were made faster."
        }
    },
    {
        id: 23,
        question: "Tell me about a time you exceeded expectations.",
        answer: {
            S: "A project required only basic implementation.",
            T: "I wanted to add value.",
            A: "I added documentation and minor improvements.",
            R: "The project received appreciation."
        }
    },
    {
        id: 24,
        question: "Describe a time you worked with someone difficult.",
        answer: {
            S: "A teammate often missed deadlines.",
            T: "We needed coordination.",
            A: "I communicated expectations clearly and followed up.",
            R: "Collaboration improved."
        }
    },
    {
        id: 25,
        question: "Tell me about a time you handled accountability.",
        answer: {
            S: "I made an error in a submission.",
            T: "I needed to address it.",
            A: "I informed the mentor and corrected it quickly.",
            R: "The issue was resolved, reinforcing trust."
        }
    }
];

// You can add similar structures for other frameworks:
// export const soarFrameworkQuestions: FrameworkQA[] = [...];
// export const prepFrameworkQuestions: FrameworkQA[] = [...];
// etc.