/**
 * Daily Word and Phrase Data - 70 Days
 * Cycles through each day based on date
 */

export interface DailyContent {
  day: number
  word: {
    word: string
    meaning: string
    examples: string[]
    whyItMatters: string
    etymology: string
  }
  phrase: {
    phrase: string
    meaning: string
    examples: string[]
    whyItSounds: string
    origin: string
  }
}

export const dailyContentData: DailyContent[] = [
  {
    day: 1,
    word: {
      word: "Concise",
      meaning: "Expressing much in few words; clear and brief.",
      examples: [
        "Her report was concise and impactful.",
        "Let's keep the presentation concise and to the point."
      ],
      whyItMatters: "Helps us sound efficient and professional, especially in technical or corporate communication.",
      etymology: "From Latin concisus ('cut short') → from con- (together) + caedere (to cut)."
    },
    phrase: {
      phrase: "Cut to the chase",
      meaning: "Get to the main point quickly.",
      examples: [
        "Let's cut to the chase and discuss the results.",
        "He always cuts to the chase during meetings."
      ],
      whyItSounds: "Keeps conversations focused and time-efficient.",
      origin: "Early film term — skipping to the 'chase scene,' the most exciting part."
    }
  },
  {
    day: 2,
    word: {
      word: "Collaborate",
      meaning: "To work jointly on a project or task.",
      examples: [
        "We collaborated on the research project.",
        "Developers and designers must collaborate effectively."
      ],
      whyItMatters: "A core skill in professional and academic teamwork.",
      etymology: "From Latin collaborare → com- (together) + laborare (to work)."
    },
    phrase: {
      phrase: "On the same page",
      meaning: "Having a shared understanding or agreement.",
      examples: [
        "Before we begin, let's make sure we're on the same page.",
        "The team wasn't on the same page about deadlines."
      ],
      whyItSounds: "Promotes alignment and coordination in teamwork.",
      origin: "Comes from reading music or text from the same page."
    }
  },
  {
    day: 3,
    word: {
      word: "Meticulous",
      meaning: "Showing great attention to detail; very careful and precise.",
      examples: [
        "She's meticulous in her coding and documentation.",
        "A meticulous review ensures fewer bugs."
      ],
      whyItMatters: "Reflects discipline and professionalism.",
      etymology: "From Latin meticulosus ('fearful, careful')."
    },
    phrase: {
      phrase: "By the book",
      meaning: "To follow rules or procedures exactly.",
      examples: [
        "He does everything by the book.",
        "Safety checks must be done by the book."
      ],
      whyItSounds: "Signals reliability and integrity in corporate conduct.",
      origin: "Refers to following official rulebooks or manuals."
    }
  },
  {
    day: 4,
    word: {
      word: "Articulate",
      meaning: "Able to express ideas clearly and effectively.",
      examples: [
        "She's an articulate communicator.",
        "He articulated his point confidently during the presentation."
      ],
      whyItMatters: "Clarity builds credibility and confidence.",
      etymology: "From Latin articulatus ('joined, clearly expressed')."
    },
    phrase: {
      phrase: "Hit the ground running",
      meaning: "To start a task with full energy and immediate effectiveness.",
      examples: [
        "New interns are expected to hit the ground running.",
        "She hit the ground running on her first day at work."
      ],
      whyItSounds: "Conveys readiness and proactive attitude.",
      origin: "Military slang for troops landing and moving swiftly."
    }
  },
  {
    day: 5,
    word: {
      word: "Pragmatic",
      meaning: "Dealing with things practically rather than theoretically.",
      examples: [
        "We need a pragmatic approach to solve this issue.",
        "He's known for his pragmatic leadership style."
      ],
      whyItMatters: "Reflects mature, result-oriented thinking.",
      etymology: "From Greek pragmatikos ('practical, concerned with action')."
    },
    phrase: {
      phrase: "Think outside the box",
      meaning: "To think creatively and unconventionally.",
      examples: [
        "Let's think outside the box for our next campaign.",
        "Innovators always think outside the box."
      ],
      whyItSounds: "Encourages innovation and problem-solving mindset.",
      origin: "Refers to puzzle-solving exercises involving dots 'outside a box.'"
    }
  },
  {
    day: 6,
    word: {
      word: "Resilient",
      meaning: "Able to recover quickly from difficulties or challenges.",
      examples: [
        "Resilient teams bounce back from setbacks.",
        "He's resilient even under project pressure."
      ],
      whyItMatters: "Highly valued in both personal and professional growth.",
      etymology: "From Latin resilire ('to leap back')."
    },
    phrase: {
      phrase: "Bounce back",
      meaning: "To recover from a setback or failure.",
      examples: [
        "She bounced back after the project delay.",
        "Startups often bounce back stronger after failure."
      ],
      whyItSounds: "Conveys optimism and perseverance.",
      origin: "Sports metaphor — a ball bouncing back after impact."
    }
  },
  {
    day: 7,
    word: {
      word: "Eloquent",
      meaning: "Fluent and persuasive in speaking or writing.",
      examples: [
        "He gave an eloquent presentation.",
        "Her words were eloquent and heartfelt."
      ],
      whyItMatters: "Strong communication influences and inspires.",
      etymology: "From Latin eloqui ('to speak out')."
    },
    phrase: {
      phrase: "Speak volumes",
      meaning: "To express a lot without using many words.",
      examples: [
        "Her confidence spoke volumes during the pitch.",
        "A single gesture can speak volumes about intent."
      ],
      whyItSounds: "Adds sophistication to expression.",
      origin: "Metaphoric — as if actions or looks 'speak' large volumes of meaning."
    }
  },
  {
    day: 8,
    word: {
      word: "Innovative",
      meaning: "Introducing new ideas or methods; creative in thinking.",
      examples: [
        "Our team proposed an innovative solution.",
        "Innovation drives sustainable growth."
      ],
      whyItMatters: "Innovation is at the heart of tech and leadership.",
      etymology: "From Latin innovatus → in- (into) + novare (to make new)."
    },
    phrase: {
      phrase: "Game changer",
      meaning: "Something that significantly alters the way things are done.",
      examples: [
        "AI is a game changer for industries.",
        "Her strategy was a game changer for the project."
      ],
      whyItSounds: "Denotes impact and forward-thinking.",
      origin: "From sports — a move that changes the outcome of the game."
    }
  },
  {
    day: 9,
    word: {
      word: "Proactive",
      meaning: "Acting in advance to deal with expected difficulties.",
      examples: [
        "A proactive engineer prevents issues before they occur.",
        "Be proactive, not reactive, during deadlines."
      ],
      whyItMatters: "Shows responsibility and foresight in professional life.",
      etymology: "From Latin pro- (before) + activus (doing)."
    },
    phrase: {
      phrase: "Ahead of the curve",
      meaning: "More advanced or innovative than others.",
      examples: [
        "Our startup stays ahead of the curve with AI adoption.",
        "Continuous learning keeps us ahead of the curve."
      ],
      whyItSounds: "Implies leadership and forward thinking.",
      origin: "Refers to being in front of the curve on a performance chart."
    }
  },
  {
    day: 10,
    word: {
      word: "Empathy",
      meaning: "The ability to understand and share others' feelings.",
      examples: [
        "Empathy helps leaders connect with teams.",
        "Good communication starts with empathy."
      ],
      whyItMatters: "Builds trust and emotional intelligence in workplaces.",
      etymology: "From Greek em- (in) + pathos (feeling)."
    },
    phrase: {
      phrase: "Put yourself in their shoes",
      meaning: "Imagine things from another's perspective.",
      examples: [
        "Before giving feedback, put yourself in their shoes.",
        "Empathy grows when we step into others' shoes."
      ],
      whyItSounds: "Encourages perspective-based decision making.",
      origin: "19th-century idiom about figuratively wearing someone's shoes."
    }
  },
  {
    day: 11,
    word: {
      word: "Adaptable",
      meaning: "Able to adjust easily to new conditions.",
      examples: [
        "Tech industries need adaptable professionals.",
        "She's adaptable to fast-changing environments."
      ],
      whyItMatters: "Flexibility keeps teams relevant in evolving fields.",
      etymology: "From Latin adaptare → ad- (to) + aptare (fit)."
    },
    phrase: {
      phrase: "Go with the flow",
      meaning: "Accept situations rather than resisting them.",
      examples: [
        "He goes with the flow during hectic sprints.",
        "Sometimes it's better to go with the flow and learn."
      ],
      whyItSounds: "Reflects calmness and composure under pressure.",
      origin: "Refers to following the natural current of a river."
    }
  },
  {
    day: 12,
    word: {
      word: "Diligent",
      meaning: "Showing careful and persistent effort.",
      examples: [
        "A diligent coder reviews every line twice.",
        "She's known for her diligent research habits."
      ],
      whyItMatters: "Employers value consistency over bursts of effort.",
      etymology: "From Latin diligere ('to value, esteem')."
    },
    phrase: {
      phrase: "Leave no stone unturned",
      meaning: "To search or work thoroughly.",
      examples: [
        "We left no stone unturned in debugging.",
        "He leaves no stone unturned before a presentation."
      ],
      whyItSounds: "Reflects thoroughness and accountability.",
      origin: "From an ancient Greek legend about searching under every stone."
    }
  },
  {
    day: 13,
    word: {
      word: "Versatile",
      meaning: "Able to adapt to many different functions or activities.",
      examples: [
        "She's a versatile team member — coder and designer.",
        "Python is a versatile programming language."
      ],
      whyItMatters: "Versatility increases opportunities and problem-solving scope.",
      etymology: "From Latin versatilis ('turning easily')."
    },
    phrase: {
      phrase: "Wear many hats",
      meaning: "To take on multiple roles or responsibilities.",
      examples: [
        "Startup founders often wear many hats.",
        "He wears many hats — mentor, developer, and tester."
      ],
      whyItSounds: "Highlights multitasking and adaptability.",
      origin: "Refers to wearing different hats for different jobs."
    }
  },
  {
    day: 14,
    word: {
      word: "Analytical",
      meaning: "Using logical reasoning and analysis.",
      examples: [
        "An analytical mindset is key in data science.",
        "She gave an analytical breakdown of the issue."
      ],
      whyItMatters: "Enables structured decision-making and clarity.",
      etymology: "From Greek analyein ('to loosen up, break down')."
    },
    phrase: {
      phrase: "Break it down",
      meaning: "To simplify a complex idea.",
      examples: [
        "Let's break it down step by step.",
        "He broke down the problem for beginners."
      ],
      whyItSounds: "Encourages clarity and teaching skill.",
      origin: "Common English idiom from 'analyze into parts.'"
    }
  },
  {
    day: 15,
    word: {
      word: "Cohesive",
      meaning: "Forming a united, consistent whole.",
      examples: [
        "A cohesive team communicates openly.",
        "The report must look cohesive and structured."
      ],
      whyItMatters: "Cohesion turns collaboration into success.",
      etymology: "From Latin cohaerere ('to stick together')."
    },
    phrase: {
      phrase: "Pull together",
      meaning: "Work jointly toward a shared goal.",
      examples: [
        "We pulled together to meet the deadline.",
        "Teams that pull together achieve more."
      ],
      whyItSounds: "Highlights teamwork and unity.",
      origin: "Nautical — sailors pulling ropes together."
    }
  },
  {
    day: 16,
    word: {
      word: "Transparent",
      meaning: "Open and honest; easy to perceive.",
      examples: [
        "We must be transparent about project timelines.",
        "Transparent communication builds trust."
      ],
      whyItMatters: "Fosters credibility and openness.",
      etymology: "From Latin trans- (through) + parere (to appear)."
    },
    phrase: {
      phrase: "Lay cards on the table",
      meaning: "To be open about one's thoughts or plans.",
      examples: [
        "Let's lay our cards on the table before deciding.",
        "She laid her cards on the table during the meeting."
      ],
      whyItSounds: "Encourages honesty and clarity.",
      origin: "Derived from card-playing transparency."
    }
  },
  {
    day: 17,
    word: {
      word: "Assertive",
      meaning: "Confidently self-assured without being aggressive.",
      examples: [
        "Assertive communication prevents misunderstandings.",
        "He was assertive in presenting his viewpoint."
      ],
      whyItMatters: "Balances confidence with respect.",
      etymology: "From Latin asserere ('to claim, affirm')."
    },
    phrase: {
      phrase: "Speak up",
      meaning: "Express one's opinion openly.",
      examples: [
        "Don't hesitate to speak up in meetings.",
        "She spoke up about process improvements."
      ],
      whyItSounds: "Demonstrates confidence and initiative.",
      origin: "Early 20th-century English idiom."
    }
  },
  {
    day: 18,
    word: {
      word: "Integrity",
      meaning: "The quality of being honest and having strong principles.",
      examples: [
        "Integrity is vital in handling client data.",
        "True leaders act with integrity even under pressure."
      ],
      whyItMatters: "Builds reputation and trust in any profession.",
      etymology: "From Latin integer ('whole, complete')."
    },
    phrase: {
      phrase: "Walk the talk",
      meaning: "To act according to what one says.",
      examples: [
        "Leaders must walk the talk on ethics.",
        "He walks the talk about time management."
      ],
      whyItSounds: "Shows authenticity and reliability.",
      origin: "20th-century American idiom."
    }
  },
  {
    day: 19,
    word: {
      word: "Credible",
      meaning: "Believable and trustworthy.",
      examples: [
        "Always cite credible sources.",
        "Her explanation sounded credible."
      ],
      whyItMatters: "Establishes trust in communication.",
      etymology: "From Latin credere ('to believe')."
    },
    phrase: {
      phrase: "Hold water",
      meaning: "To remain logical or sound under scrutiny.",
      examples: [
        "That argument doesn't hold water.",
        "His theory holds water after testing."
      ],
      whyItSounds: "Implies analytical evaluation.",
      origin: "Nautical — a container that 'holds water' has no leaks."
    }
  },
  {
    day: 20,
    word: {
      word: "Efficient",
      meaning: "Achieving results with minimal waste of time or resources.",
      examples: [
        "She's efficient in managing her codebase.",
        "Automation made our system more efficient."
      ],
      whyItMatters: "Reflects productivity and competence.",
      etymology: "From Latin efficere ('to accomplish')."
    },
    phrase: {
      phrase: "Time is of the essence",
      meaning: "Time is critical for success.",
      examples: [
        "Deploy quickly — time is of the essence.",
        "In startups, time is of the essence."
      ],
      whyItSounds: "Emphasizes urgency and efficiency.",
      origin: "Legal phrase used in contracts."
    }
  },
  {
    day: 21,
    word: {
      word: "Intuitive",
      meaning: "Easy to understand; based on instinct.",
      examples: [
        "We built an intuitive user interface.",
        "She has an intuitive grasp of design flow."
      ],
      whyItMatters: "Simplifies user experience and teamwork.",
      etymology: "From Latin intueri ('to look at, contemplate')."
    },
    phrase: {
      phrase: "At a glance",
      meaning: "Immediately noticeable; easily understood.",
      examples: [
        "The dashboard shows data at a glance.",
        "At a glance, the code looks clean."
      ],
      whyItSounds: "Reflects clarity and efficiency.",
      origin: "From the literal act of a quick look."
    }
  },
  {
    day: 22,
    word: {
      word: "Candid",
      meaning: "Honest and straightforward.",
      examples: [
        "Her candid feedback helped us improve.",
        "Be candid during performance discussions."
      ],
      whyItMatters: "Encourages authenticity and openness.",
      etymology: "From Latin candidus ('white, pure')."
    },
    phrase: {
      phrase: "Call a spade a spade",
      meaning: "To speak plainly without softening the truth.",
      examples: [
        "He calls a spade a spade when giving reviews.",
        "Let's call a spade a spade about this issue."
      ],
      whyItSounds: "Shows directness and clarity.",
      origin: "Greek proverb translated by Erasmus."
    }
  },
  {
    day: 23,
    word: {
      word: "Strategic",
      meaning: "Planned with long-term goals in mind.",
      examples: [
        "Strategic thinking drives sustainable growth.",
        "We need a strategic roadmap for expansion."
      ],
      whyItMatters: "Links daily actions with bigger objectives.",
      etymology: "From Greek strategos ('general, leader')."
    },
    phrase: {
      phrase: "Big picture",
      meaning: "The overall view or main idea.",
      examples: [
        "Let's focus on the big picture before details.",
        "Big-picture thinking helps set direction."
      ],
      whyItSounds: "Encourages visionary perspective.",
      origin: "Popularized in management language."
    }
  },
  {
    day: 24,
    word: {
      word: "Vigilant",
      meaning: "Keeping careful watch for possible danger or issues.",
      examples: [
        "Stay vigilant for phishing attempts.",
        "Security teams remain vigilant 24/7."
      ],
      whyItMatters: "Promotes awareness and responsibility.",
      etymology: "From Latin vigilare ('to keep awake')."
    },
    phrase: {
      phrase: "Keep an eye on",
      meaning: "To monitor or watch closely.",
      examples: [
        "Keep an eye on system logs.",
        "She keeps an eye on team progress."
      ],
      whyItSounds: "Reflects accountability and alertness.",
      origin: "Figurative from the literal act of watching."
    }
  },
  {
    day: 25,
    word: {
      word: "Diplomatic",
      meaning: "Handling situations sensitively and tactfully.",
      examples: [
        "He gave a diplomatic response to criticism.",
        "Diplomatic tone helps in conflict resolution."
      ],
      whyItMatters: "Builds harmony and professionalism.",
      etymology: "From Greek diploma ('folded paper, official document')."
    },
    phrase: {
      phrase: "Smooth things over",
      meaning: "To make a tense situation calmer.",
      examples: [
        "She smoothed things over after the misunderstanding.",
        "Managers often smooth things over between teams."
      ],
      whyItSounds: "Shows emotional intelligence and tact.",
      origin: "From the act of smoothing a rough surface."
    }
  },
  {
    day: 26,
    word: {
      word: "Curious",
      meaning: "Eager to learn or know more.",
      examples: [
        "A curious mind drives innovation.",
        "Stay curious about new technologies."
      ],
      whyItMatters: "Fuels creativity and lifelong learning.",
      etymology: "From Latin curiosus ('careful, inquisitive')."
    },
    phrase: {
      phrase: "Pick someone's brain",
      meaning: "To ask someone for expert ideas or knowledge.",
      examples: [
        "I'd love to pick your brain about UI design.",
        "He picked the mentor's brain before starting the project."
      ],
      whyItSounds: "Encourages collaborative learning.",
      origin: "20th-century American idiom."
    }
  },
  {
    day: 27,
    word: {
      word: "Perceptive",
      meaning: "Having sharp insight or understanding.",
      examples: [
        "She made a perceptive observation during testing.",
        "Perceptive people notice details others miss."
      ],
      whyItMatters: "Enhances decision-making and analysis.",
      etymology: "From Latin percipere ('to seize, understand')."
    },
    phrase: {
      phrase: "Read between the lines",
      meaning: "Understand an implied meaning.",
      examples: [
        "You need to read between the lines of the email.",
        "Managers read between the lines during interviews."
      ],
      whyItSounds: "Reflects emotional and contextual intelligence.",
      origin: "19th-century phrase about hidden meanings in text."
    }
  },
  {
    day: 28,
    word: {
      word: "Punctual",
      meaning: "On time; not late.",
      examples: [
        "He's always punctual for meetings.",
        "Punctual delivery improves client trust."
      ],
      whyItMatters: "Demonstrates respect and reliability.",
      etymology: "From Latin punctum ('point, precise moment')."
    },
    phrase: {
      phrase: "Right on time",
      meaning: "Exactly at the scheduled moment.",
      examples: [
        "The release went live right on time.",
        "She joined the call right on time."
      ],
      whyItSounds: "Reflects discipline and reliability.",
      origin: "Common English phrase emphasizing timeliness."
    }
  },
  {
    day: 29,
    word: {
      word: "Artisan",
      meaning: "A skilled craftsperson.",
      examples: [
        "Our college festival featured local artisans showcasing handmade crafts.",
        "Software developers are often digital artisans."
      ],
      whyItMatters: "Highlights skill and creativity, not just labor.",
      etymology: "From French artisan, from Latin artitus — 'instructed in the arts.'"
    },
    phrase: {
      phrase: "Back to the drawing board",
      meaning: "To start again after a failed attempt.",
      examples: [
        "The app didn't perform as expected, so it's back to the drawing board.",
        "Our pitch was rejected; time to rethink from scratch."
      ],
      whyItSounds: "Expresses resilience without sounding negative.",
      origin: "From design and engineering fields where drafts are redrawn after testing fails."
    }
  },
  {
    day: 30,
    word: {
      word: "Altruistic",
      meaning: "Showing selfless concern for others.",
      examples: [
        "Volunteering shows an altruistic mindset.",
        "Great leaders are often altruistic in their motives."
      ],
      whyItMatters: "Adds emotional intelligence to professional communication.",
      etymology: "From Latin alter ('other') → 'concerned for others.'"
    },
    phrase: {
      phrase: "Raise the bar",
      meaning: "To set higher standards.",
      examples: [
        "The new design team has raised the bar.",
        "Each project should raise the bar for quality."
      ],
      whyItSounds: "Signals progress and improvement culture.",
      origin: "From high jump sports — raising the bar for the next attempt."
    }
  },
  {
    day: 31,
    word: {
      word: "Consensus",
      meaning: "General agreement among a group.",
      examples: [
        "The team reached a consensus on the UI design.",
        "Consensus is vital for collaborative success."
      ],
      whyItMatters: "Encourages inclusivity and teamwork in decisions.",
      etymology: "Latin consentire → 'to feel together.'"
    },
    phrase: {
      phrase: "Touch base",
      meaning: "To briefly reconnect or discuss updates.",
      examples: [
        "Let's touch base tomorrow about the presentation.",
        "Managers often touch base weekly with their teams."
      ],
      whyItSounds: "A friendly yet formal phrase for follow-ups.",
      origin: "Baseball term — players 'touch base' to stay safe."
    }
  },
  {
    day: 32,
    word: {
      word: "Persevere",
      meaning: "To keep trying despite difficulties.",
      examples: [
        "Engineers must persevere through repeated testing.",
        "She persevered until the prototype worked."
      ],
      whyItMatters: "Reflects grit — a core growth skill.",
      etymology: "From Latin per- (through) + severus (strict) → 'to continue firmly.'"
    },
    phrase: {
      phrase: "Keep the ball rolling",
      meaning: "Maintain progress or momentum.",
      examples: [
        "Let's keep the ball rolling on this project.",
        "Regular updates help keep the ball rolling."
      ],
      whyItSounds: "Conveys continuous, steady work.",
      origin: "Sports metaphor — keeping the play in motion."
    }
  },
  {
    day: 33,
    word: {
      word: "Scrutinize",
      meaning: "To examine closely and critically.",
      examples: [
        "Always scrutinize your code before deployment.",
        "The committee scrutinized each proposal carefully."
      ],
      whyItMatters: "Reflects thoroughness — key for quality control.",
      etymology: "Latin scrutari → 'to search thoroughly.'"
    },
    phrase: {
      phrase: "In a nutshell",
      meaning: "Summarized in a few words.",
      examples: [
        "In a nutshell, we need better communication.",
        "The project aim, in a nutshell, is automation."
      ],
      whyItSounds: "Ideal for quick summaries.",
      origin: "Ancient reference to compressing long texts 'inside a nutshell.'"
    }
  },
  {
    day: 34,
    word: {
      word: "Astute",
      meaning: "Clever and quick in understanding situations.",
      examples: [
        "Her astute observations improved the design.",
        "Astute negotiators read people well."
      ],
      whyItMatters: "Implies sharp professional judgment.",
      etymology: "From Latin astutus → 'crafty, wise.'"
    },
    phrase: {
      phrase: "Bite the bullet",
      meaning: "To face a difficult situation bravely.",
      examples: [
        "We had to bite the bullet and redo the design.",
        "Sometimes leaders must bite the bullet and decide quickly."
      ],
      whyItSounds: "Suggests courage under pressure.",
      origin: "Soldiers once bit bullets during surgery to endure pain."
    }
  },
  {
    day: 35,
    word: {
      word: "Reiterate",
      meaning: "To say or do something again for emphasis.",
      examples: [
        "Let me reiterate our core goal: quality.",
        "The mentor reiterated the importance of deadlines."
      ],
      whyItMatters: "Adds clarity and emphasis.",
      etymology: "Latin re- (again) + iterare (repeat)."
    },
    phrase: {
      phrase: "Touch wood",
      meaning: "Express hope that something continues well.",
      examples: [
        "We've had no issues so far, touch wood.",
        "The project's running smoothly, touch wood."
      ],
      whyItSounds: "Light, culturally familiar optimism.",
      origin: "Ancient belief in knocking on wood for good luck."
    }
  },
  {
    day: 36,
    word: {
      word: "Humble",
      meaning: "Modest and respectful in attitude.",
      examples: [
        "Stay humble even after success.",
        "Her humble tone earned respect."
      ],
      whyItMatters: "Reflects emotional maturity and teamwork.",
      etymology: "Latin humilis → 'lowly, grounded.'"
    },
    phrase: {
      phrase: "Set in stone",
      meaning: "Fixed and unchangeable.",
      examples: [
        "The deadline isn't set in stone yet.",
        "Policies shouldn't be set in stone."
      ],
      whyItSounds: "Conveys firmness or flexibility contextually.",
      origin: "From ancient inscriptions carved permanently in stone."
    }
  },
  {
    day: 37,
    word: {
      word: "Accountable",
      meaning: "Responsible for one's actions and results.",
      examples: [
        "Every team member is accountable for the final outcome.",
        "Be accountable for deadlines and deliverables."
      ],
      whyItMatters: "Signals ownership and professionalism.",
      etymology: "From Latin computare → 'to reckon or calculate.'"
    },
    phrase: {
      phrase: "Raise the stakes",
      meaning: "Increase the level of risk or reward.",
      examples: [
        "The new deadline raises the stakes for everyone.",
        "Competitions raise the stakes and push creativity."
      ],
      whyItSounds: "Common in corporate strategy and entrepreneurship.",
      origin: "From gambling — increasing the money 'staked' on a bet."
    }
  },
  {
    day: 38,
    word: {
      word: "Coherent",
      meaning: "Logical and consistent.",
      examples: [
        "A coherent argument wins debates.",
        "Keep your slides coherent and connected."
      ],
      whyItMatters: "Reflects clarity in both thought and structure.",
      etymology: "Latin cohaerere → 'to stick together.'"
    },
    phrase: {
      phrase: "Go hand in hand",
      meaning: "To be closely related or connected.",
      examples: [
        "Innovation and risk go hand in hand.",
        "Communication and leadership go hand in hand."
      ],
      whyItSounds: "Expresses natural correlation between two ideas.",
      origin: "From physical imagery of walking hand in hand."
    }
  },
  {
    day: 39,
    word: {
      word: "Tangible",
      meaning: "Real and measurable; able to be touched or proven.",
      examples: [
        "Show tangible results to back your idea.",
        "Internships provide tangible learning experiences."
      ],
      whyItMatters: "Encourages result-oriented thinking.",
      etymology: "Latin tangere → 'to touch.'"
    },
    phrase: {
      phrase: "Level playing field",
      meaning: "A fair situation where everyone has equal chances.",
      examples: [
        "Technology has created a level playing field for startups.",
        "Exams aim to ensure a level playing field."
      ],
      whyItSounds: "Represents fairness and equality.",
      origin: "Sports metaphor — ensuring the field is literally level for fair play."
    }
  },
  {
    day: 40,
    word: {
      word: "Artistry",
      meaning: "Creative skill or craftsmanship.",
      examples: [
        "There's artistry even in good code design.",
        "Her presentation had a balance of logic and artistry."
      ],
      whyItMatters: "Encourages creative expression in professional work.",
      etymology: "From Latin ars → 'art, skill.'"
    },
    phrase: {
      phrase: "Call the shots",
      meaning: "To be in control or make decisions.",
      examples: [
        "The project manager calls the shots in client meetings.",
        "Leadership means knowing when to call the shots."
      ],
      whyItSounds: "Reflects authority and responsibility.",
      origin: "Military term — commanding when to fire shots."
    }
  },
  {
    day: 41,
    word: {
      word: "Astounding",
      meaning: "Surprisingly impressive or remarkable.",
      examples: [
        "The prototype achieved astounding accuracy.",
        "His growth in one year was astounding."
      ],
      whyItMatters: "Adds enthusiasm to professional appreciation.",
      etymology: "Latin tonare → 'to thunder,' implying shock or awe."
    },
    phrase: {
      phrase: "Under the radar",
      meaning: "Not attracting much attention.",
      examples: [
        "The team worked under the radar to finish the product.",
        "Small ideas often grow under the radar before they boom."
      ],
      whyItSounds: "Suggests quiet efficiency or strategic secrecy.",
      origin: "From military aircraft that avoid radar detection."
    }
  },
  {
    day: 42,
    word: {
      word: "Empirical",
      meaning: "Based on observation or experience rather than theory.",
      examples: [
        "The decision was made after empirical testing.",
        "Empirical data validates research claims."
      ],
      whyItMatters: "Adds scientific credibility to discussions.",
      etymology: "Greek empeiria → 'experience.'"
    },
    phrase: {
      phrase: "Push the envelope",
      meaning: "To go beyond normal limits.",
      examples: [
        "Innovators push the envelope of technology.",
        "Let's push the envelope with this new feature."
      ],
      whyItSounds: "Conveys ambition and risk-taking.",
      origin: "Aviation term — testing aircraft performance limits."
    }
  },
  {
    day: 43,
    word: {
      word: "Composed",
      meaning: "Calm and in control of emotions.",
      examples: [
        "Stay composed during interviews.",
        "A composed tone reflects confidence."
      ],
      whyItMatters: "Reflects emotional maturity — vital in leadership.",
      etymology: "Latin componere → 'to put together.'"
    },
    phrase: {
      phrase: "Think on your feet",
      meaning: "To respond quickly and effectively in unexpected situations.",
      examples: [
        "Engineers often need to think on their feet during demos.",
        "Good speakers think on their feet when asked tough questions."
      ],
      whyItSounds: "Suggests agility and confidence under pressure.",
      origin: "From debates where speakers stood while responding instantly."
    }
  },
  {
    day: 44,
    word: {
      word: "Scrupulous",
      meaning: "Extremely careful and honest in doing what is right.",
      examples: [
        "He's scrupulous about following ethical guidelines.",
        "Scrupulous detail leads to flawless execution."
      ],
      whyItMatters: "Reflects integrity and perfectionism.",
      etymology: "Latin scrupulus → 'a small sharp stone,' symbolizing moral sensitivity."
    },
    phrase: {
      phrase: "Take the plunge",
      meaning: "To decide to do something difficult or risky.",
      examples: [
        "She finally took the plunge and started her own venture.",
        "Sometimes, success starts when we take the plunge."
      ],
      whyItSounds: "Motivates bold yet thoughtful decision-making.",
      origin: "From diving — literally plunging into water."
    }
  },
  {
    day: 45,
    word: {
      word: "Go the extra mile",
      meaning: "To make additional effort beyond what's required.",
      examples: [
        "The support team went the extra mile to fix issues.",
        "Success often requires going the extra mile."
      ],
      whyItMatters: "Suggests dedication and initiative.",
      etymology: "From the Bible — 'If anyone forces you to go one mile, go with him two.'"
    },
    phrase: {
      phrase: "Ballpark figure",
      meaning: "An approximate number or estimate.",
      examples: [
        "Can you give me a ballpark figure for the cost?",
        "The developer shared a ballpark timeline for the release."
      ],
      whyItSounds: "Shows you're realistic but flexible.",
      origin: "From baseball stadiums, meaning 'within the general range.'"
    }
  },
  {
    day: 46,
    word: {
      word: "In the same boat",
      meaning: "In the same situation as others.",
      examples: [
        "All startups are in the same boat when raising funds.",
        "We're in the same boat; let's figure it out together."
      ],
      whyItMatters: "Conveys unity in challenges.",
      etymology: "Maritime — crew members share the same risks in one boat."
    },
    phrase: {
      phrase: "On the same wavelength",
      meaning: "Thinking in a similar way.",
      examples: [
        "Designers and developers must be on the same wavelength.",
        "The team clicked instantly — they were on the same wavelength."
      ],
      whyItSounds: "Describes synergy in thought.",
      origin: "From radio — tuning to the same frequency for clear reception."
    }
  },
  {
    day: 47,
    word: {
      word: "On the fly",
      meaning: "Doing something quickly without preparation.",
      examples: [
        "The presenter handled questions on the fly.",
        "Engineers often fix bugs on the fly."
      ],
      whyItMatters: "Describes agility in action.",
      etymology: "Aviation slang — adjusting while flying."
    },
    phrase: {
      phrase: "Move the needle",
      meaning: "Create a noticeable impact or progress.",
      examples: [
        "The campaign really moved the needle in user engagement.",
        "We need initiatives that move the needle."
      ],
      whyItSounds: "Common in performance-driven workplaces.",
      origin: "From gauges where a needle shows measurable change."
    }
  },
  {
    day: 48,
    word: {
      word: "Circle back",
      meaning: "Return to a topic later.",
      examples: [
        "Let's circle back after reviewing the feedback.",
        "We'll circle back next week to finalize it."
      ],
      whyItMatters: "Keeps communication organized.",
      etymology: "Corporate metaphor for revisiting earlier discussions."
    },
    phrase: {
      phrase: "The ball is in your court",
      meaning: "It's your turn to act or decide.",
      examples: [
        "I've shared the plan; now the ball's in your court.",
        "The client has the proposal — the ball is in their court."
      ],
      whyItSounds: "Defines responsibility clearly.",
      origin: "Tennis reference — when it's the other player's move."
    }
  },
  {
    day: 49,
    word: {
      word: "In sync",
      meaning: "Working together smoothly.",
      examples: [
        "The marketing and tech teams are in sync.",
        "Staying in sync avoids rework."
      ],
      whyItMatters: "Signifies coordination.",
      etymology: "From 'synchronization' — matching timing or rhythm."
    },
    phrase: {
      phrase: "The bigger picture",
      meaning: "The overall perspective, not small details.",
      examples: [
        "Focus on the bigger picture during strategy meetings.",
        "The CEO emphasized the bigger picture over minor delays."
      ],
      whyItSounds: "Encourages macro-level thinking.",
      origin: "Artistic metaphor — seeing the whole painting."
    }
  },
  {
    day: 50,
    word: {
      word: "Play it by ear",
      meaning: "Handle things as they happen.",
      examples: [
        "We'll play it by ear depending on client response.",
        "Let's play it by ear at the event."
      ],
      whyItMatters: "Reflects flexibility.",
      etymology: "Musical — playing without written notes."
    },
    phrase: {
      phrase: "At the end of the day",
      meaning: "When everything is considered.",
      examples: [
        "At the end of the day, teamwork wins.",
        "It's results that matter at the end of the day."
      ],
      whyItSounds: "Provides reflective closure in discussions.",
      origin: "From idiomatic English — final evaluation."
    }
  },
  {
    day: 51,
    word: {
      word: "Cutting corners",
      meaning: "Doing something poorly to save time or effort.",
      examples: [
        "Never cut corners in safety testing.",
        "Cheap shortcuts often lead to costly errors."
      ],
      whyItMatters: "Warns against carelessness in workplace contexts.",
      etymology: "From construction — literally taking shorter paths to reduce effort."
    },
    phrase: {
      phrase: "Raise red flags",
      meaning: "To indicate possible problems.",
      examples: [
        "Irregular data patterns raised red flags.",
        "HR policies aim to detect red flags early."
      ],
      whyItSounds: "Clear shorthand for warnings.",
      origin: "From literal flags signaling caution."
    }
  },
  {
    day: 52,
    word: {
      word: "Take it offline",
      meaning: "Continue a discussion privately or later.",
      examples: [
        "Let's take this topic offline after the meeting.",
        "They agreed to take it offline to finalize details."
      ],
      whyItMatters: "Manages time while keeping focus.",
      etymology: "Corporate slang from early internet chatrooms."
    },
    phrase: {
      phrase: "In the pipeline",
      meaning: "Something planned or in process.",
      examples: [
        "Several collaborations are in the pipeline.",
        "We have exciting updates in the pipeline for next month."
      ],
      whyItSounds: "Keeps audiences informed without overpromising.",
      origin: "From industrial pipelines carrying materials before delivery."
    }
  },
  {
    day: 53,
    word: {
      word: "Innovate",
      meaning: "To introduce new ideas or methods.",
      examples: [
        "Our startup aims to innovate in sustainable energy.",
        "Teams must innovate continuously to stay relevant."
      ],
      whyItMatters: "Core value for modern professionals.",
      etymology: "Latin innovare → 'to make new.'"
    },
    phrase: {
      phrase: "Hit the ground running",
      meaning: "To start something immediately and effectively.",
      examples: [
        "The new intern hit the ground running.",
        "We need to hit the ground running after launch."
      ],
      whyItSounds: "Describes efficiency from day one.",
      origin: "U.S. military term — soldiers landing ready for action."
    }
  },
  {
    day: 54,
    word: {
      word: "Astute",
      meaning: "Clever and quick in understanding situations.",
      examples: [
        "Her astute observations improved the design.",
        "Astute negotiators read people well."
      ],
      whyItMatters: "Implies sharp professional judgment.",
      etymology: "From Latin astutus → 'crafty, wise.'"
    },
    phrase: {
      phrase: "Ahead of the curve",
      meaning: "More advanced or innovative than others.",
      examples: [
        "Our startup aims to stay ahead of the curve.",
        "Continuous learning keeps professionals ahead of the curve."
      ],
      whyItSounds: "Shows strategic foresight.",
      origin: "From performance graphs — being in the upper range."
    }
  },
  {
    day: 55,
    word: {
      word: "Transparent",
      meaning: "Open and honest; easy to understand.",
      examples: [
        "Transparent policies build trust.",
        "She explained the process in a transparent way."
      ],
      whyItMatters: "Encourages ethical leadership.",
      etymology: "Latin trans (through) + parere (to appear)."
    },
    phrase: {
      phrase: "Circle back",
      meaning: "Return to a topic later.",
      examples: [
        "Let's circle back after reviewing the feedback.",
        "We'll circle back next week to finalize it."
      ],
      whyItSounds: "Keeps communication organized.",
      origin: "Corporate metaphor for revisiting earlier discussions."
    }
  },
  {
    day: 56,
    word: {
      word: "Articulate",
      meaning: "Able to express ideas clearly and effectively.",
      examples: [
        "He's articulate in technical presentations.",
        "Being articulate builds confidence."
      ],
      whyItMatters: "Enhances professional communication and clarity.",
      etymology: "Latin articulare → 'to divide into joints, express clearly.'"
    },
    phrase: {
      phrase: "Move the needle",
      meaning: "Create a noticeable impact or progress.",
      examples: [
        "The campaign really moved the needle in user engagement.",
        "We need initiatives that move the needle."
      ],
      whyItSounds: "Common in performance-driven workplaces.",
      origin: "From gauges where a needle shows measurable change."
    }
  },
  {
    day: 57,
    word: {
      word: "Intuitive",
      meaning: "Easy to understand or operate without much explanation.",
      examples: [
        "The new app interface is intuitive and clean.",
        "Great leaders make intuitive decisions backed by data."
      ],
      whyItMatters: "Combines logic with natural understanding — vital for design thinking.",
      etymology: "From Latin intueri → 'to look upon, contemplate.'"
    },
    phrase: {
      phrase: "Touch base with",
      meaning: "To connect briefly for updates.",
      examples: [
        "I'll touch base with the mentor after class.",
        "Let's touch base tomorrow about the pitch deck."
      ],
      whyItSounds: "Courteous and collaborative alternative to 'talk.'",
      origin: "From baseball — players 'touch base' to stay safe during play."
    }
  },
  {
    day: 58,
    word: {
      word: "Accountable",
      meaning: "Responsible for one's actions and results.",
      examples: [
        "Every team member is accountable for the final outcome.",
        "Be accountable for deadlines and deliverables."
      ],
      whyItMatters: "Signals ownership and professionalism.",
      etymology: "From Latin computare → 'to reckon or calculate.'"
    },
    phrase: {
      phrase: "Raise the stakes",
      meaning: "Increase the level of risk or reward.",
      examples: [
        "The new deadline raises the stakes for everyone.",
        "Competitions raise the stakes and push creativity."
      ],
      whyItSounds: "Common in corporate strategy and entrepreneurship.",
      origin: "From gambling — increasing the money 'staked' on a bet."
    }
  },
  {
    day: 59,
    word: {
      word: "Coherent",
      meaning: "Logical and consistent.",
      examples: [
        "A coherent argument wins debates.",
        "Keep your slides coherent and connected."
      ],
      whyItMatters: "Reflects clarity in both thought and structure.",
      etymology: "Latin cohaerere → 'to stick together.'"
    },
    phrase: {
      phrase: "Go hand in hand",
      meaning: "To be closely related or connected.",
      examples: [
        "Innovation and risk go hand in hand.",
        "Communication and leadership go hand in hand."
      ],
      whyItSounds: "Expresses natural correlation between two ideas.",
      origin: "From physical imagery of walking hand in hand."
    }
  },
  {
    day: 60,
    word: {
      word: "Tangible",
      meaning: "Real and measurable; able to be touched or proven.",
      examples: [
        "Show tangible results to back your idea.",
        "Internships provide tangible learning experiences."
      ],
      whyItMatters: "Encourages result-oriented thinking.",
      etymology: "Latin tangere → 'to touch.'"
    },
    phrase: {
      phrase: "Level playing field",
      meaning: "A fair situation where everyone has equal chances.",
      examples: [
        "Technology has created a level playing field for startups.",
        "Exams aim to ensure a level playing field."
      ],
      whyItSounds: "Represents fairness and equality.",
      origin: "Sports metaphor — ensuring the field is literally level for fair play."
    }
  },
  {
    day: 61,
    word: {
      word: "Artistry",
      meaning: "Creative skill or craftsmanship.",
      examples: [
        "There's artistry even in good code design.",
        "Her presentation had a balance of logic and artistry."
      ],
      whyItMatters: "Encourages creative expression in professional work.",
      etymology: "From Latin ars → 'art, skill.'"
    },
    phrase: {
      phrase: "Call the shots",
      meaning: "To be in control or make decisions.",
      examples: [
        "The project manager calls the shots in client meetings.",
        "Leadership means knowing when to call the shots."
      ],
      whyItSounds: "Reflects authority and responsibility.",
      origin: "Military term — commanding when to fire shots."
    }
  },
  {
    day: 62,
    word: {
      word: "Astounding",
      meaning: "Surprisingly impressive or remarkable.",
      examples: [
        "The prototype achieved astounding accuracy.",
        "His growth in one year was astounding."
      ],
      whyItMatters: "Adds enthusiasm to professional appreciation.",
      etymology: "Latin tonare → 'to thunder,' implying shock or awe."
    },
    phrase: {
      phrase: "Under the radar",
      meaning: "Not attracting much attention.",
      examples: [
        "The team worked under the radar to finish the product.",
        "Small ideas often grow under the radar before they boom."
      ],
      whyItSounds: "Suggests quiet efficiency or strategic secrecy.",
      origin: "From military aircraft that avoid radar detection."
    }
  },
  {
    day: 63,
    word: {
      word: "Empirical",
      meaning: "Based on observation or experience rather than theory.",
      examples: [
        "The decision was made after empirical testing.",
        "Empirical data validates research claims."
      ],
      whyItMatters: "Adds scientific credibility to discussions.",
      etymology: "Greek empeiria → 'experience.'"
    },
    phrase: {
      phrase: "Push the envelope",
      meaning: "To go beyond normal limits.",
      examples: [
        "Innovators push the envelope of technology.",
        "Let's push the envelope with this new feature."
      ],
      whyItSounds: "Conveys ambition and risk-taking.",
      origin: "Aviation term — testing aircraft performance limits."
    }
  },
  {
    day: 64,
    word: {
      word: "Composed",
      meaning: "Calm and in control of emotions.",
      examples: [
        "Stay composed during interviews.",
        "A composed tone reflects confidence."
      ],
      whyItMatters: "Reflects emotional maturity — vital in leadership.",
      etymology: "Latin componere → 'to put together.'"
    },
    phrase: {
      phrase: "Think on your feet",
      meaning: "To respond quickly and effectively in unexpected situations.",
      examples: [
        "Engineers often need to think on their feet during demos.",
        "Good speakers think on their feet when asked tough questions."
      ],
      whyItSounds: "Suggests agility and confidence under pressure.",
      origin: "From debates where speakers stood while responding instantly."
    }
  },
  {
    day: 65,
    word: {
      word: "Scrupulous",
      meaning: "Extremely careful and honest in doing what is right.",
      examples: [
        "He's scrupulous about following ethical guidelines.",
        "Scrupulous detail leads to flawless execution."
      ],
      whyItMatters: "Reflects integrity and perfectionism.",
      etymology: "Latin scrupulus → 'a small sharp stone,' symbolizing moral sensitivity."
    },
    phrase: {
      phrase: "Take the plunge",
      meaning: "To decide to do something difficult or risky.",
      examples: [
        "She finally took the plunge and started her own venture.",
        "Sometimes, success starts when we take the plunge."
      ],
      whyItSounds: "Motivates bold yet thoughtful decision-making.",
      origin: "From diving — literally plunging into water."
    }
  },
  {
    day: 66,
    word: {
      word: "Perceptive",
      meaning: "Having sharp insight and understanding.",
      examples: [
        "Her perceptive comments improved the proposal.",
        "Perceptive learners identify patterns quickly."
      ],
      whyItMatters: "Shows awareness and critical observation.",
      etymology: "Latin percipere → 'to seize or understand thoroughly.'"
    },
    phrase: {
      phrase: "In the pipeline",
      meaning: "Something planned or in process.",
      examples: [
        "Several collaborations are in the pipeline.",
        "We have exciting updates in the pipeline for next month."
      ],
      whyItSounds: "Keeps audiences informed without overpromising.",
      origin: "From industrial pipelines carrying materials before delivery."
    }
  },
  {
    day: 67,
    word: {
      word: "Strategic",
      meaning: "Planned with long-term goals in mind.",
      examples: [
        "Strategic thinking drives sustainable growth.",
        "We need a strategic roadmap for expansion."
      ],
      whyItMatters: "Links daily actions with bigger objectives.",
      etymology: "From Greek strategos ('general, leader')."
    },
    phrase: {
      phrase: "Big picture",
      meaning: "The overall view or main idea.",
      examples: [
        "Let's focus on the big picture before details.",
        "Big-picture thinking helps set direction."
      ],
      whyItSounds: "Encourages visionary perspective.",
      origin: "Popularized in management language."
    }
  },
  {
    day: 68,
    word: {
      word: "Vigilant",
      meaning: "Keeping careful watch for possible danger or issues.",
      examples: [
        "Stay vigilant for phishing attempts.",
        "Security teams remain vigilant 24/7."
      ],
      whyItMatters: "Promotes awareness and responsibility.",
      etymology: "From Latin vigilare ('to keep awake')."
    },
    phrase: {
      phrase: "Keep an eye on",
      meaning: "To monitor or watch closely.",
      examples: [
        "Keep an eye on system logs.",
        "She keeps an eye on team progress."
      ],
      whyItSounds: "Reflects accountability and alertness.",
      origin: "Figurative from the literal act of watching."
    }
  },
  {
    day: 69,
    word: {
      word: "Diplomatic",
      meaning: "Handling situations sensitively and tactfully.",
      examples: [
        "He gave a diplomatic response to criticism.",
        "Diplomatic tone helps in conflict resolution."
      ],
      whyItMatters: "Builds harmony and professionalism.",
      etymology: "From Greek diploma ('folded paper, official document')."
    },
    phrase: {
      phrase: "Smooth things over",
      meaning: "To make a tense situation calmer.",
      examples: [
        "She smoothed things over after the misunderstanding.",
        "Managers often smooth things over between teams."
      ],
      whyItSounds: "Shows emotional intelligence and tact.",
      origin: "From the act of smoothing a rough surface."
    }
  },
  {
    day: 70,
    word: {
      word: "Curious",
      meaning: "Eager to learn or know more.",
      examples: [
        "A curious mind drives innovation.",
        "Stay curious about new technologies."
      ],
      whyItMatters: "Fuels creativity and lifelong learning.",
      etymology: "From Latin curiosus ('careful, inquisitive')."
    },
    phrase: {
      phrase: "Pick someone's brain",
      meaning: "To ask someone for expert ideas or knowledge.",
      examples: [
        "I'd love to pick your brain about UI design.",
        "He picked the mentor's brain before starting the project."
      ],
      whyItSounds: "Encourages collaborative learning.",
      origin: "20th-century American idiom."
    }
  }
]

/**
 * Get daily content based on current date
 * Cycles through 70 days of content
 */
export const getTodayContent = (): DailyContent => {
  const startDate = new Date('2025-01-01')
  startDate.setHours(0, 0, 0, 0) // Reset to midnight
  
  const today = new Date()
  today.setHours(0, 0, 0, 0) // Reset to midnight
  
  const diffTime = today.getTime() - startDate.getTime()
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))
  
  // Cycle through the 70 days (ensure positive index)
  const dayIndex = ((diffDays % 70) + 70) % 70
  
  return dailyContentData[dayIndex]
}
