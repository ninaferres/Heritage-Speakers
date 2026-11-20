import { CefrLevel, SkillId, ExerciseQuestion } from './types';

interface AssessmentQuestion {
  question: string;
  type: 'mc' | 'matching' | 'speaking-assessment' | 'listening-assessment';
  options?: string[];
  answer?: string;
  pairs?: { left: string; right: string }[];
  prompt?: string;
  maxDuration?: number;
  audioText?: string;
}

const assessmentData: Record<SkillId, Record<CefrLevel, AssessmentQuestion[]>> = {
  Reading: {
    A1: [
      {
        type: 'mc',
        question: 'A sign in a shop says: "OPEN nine a.m. to six p.m." What time does the shop close?',
        options: ['At nine in the morning', 'At noon', 'At six in the evening', 'At six in the morning'],
        answer: 'At six in the evening',
      },
      {
        type: 'mc',
        question: '"Tom buys bread at the bakery." Where is Tom?',
        options: ['At the supermarket', 'At the bakery', 'At home', 'At the restaurant'],
        answer: 'At the bakery',
      },
    ],
    A2: [
      {
        type: 'mc',
        question: 'A message from a friend: "Hey, want to meet at the corner café at five?" What are they proposing?',
        options: ['To call you on the phone', 'To meet at a café at five', 'To go to your house', 'To cancel a plan'],
        answer: 'To meet at a café at five',
      },
      {
        type: 'mc',
        question: 'Recipe instructions: "First chop the onion, then add it to the pan with oil." What is done first?',
        options: ['Add the oil', 'Chop the onion', 'Turn on the stove', 'Serve the dish'],
        answer: 'Chop the onion',
      },
    ],
    B1: [
      {
        type: 'mc',
        question: 'Job ad: "Waiter wanted with experience, afternoon shift, immediate start." What does the ad NOT say?',
        options: ['The shift is in the afternoon', 'They want previous experience', 'The pay is very high', 'You can start soon'],
        answer: 'The pay is very high',
      },
      {
        type: 'matching',
        question: 'Match each connector with what it expresses in an everyday sentence:',
        pairs: [
          { left: 'Although', right: 'Introduces a contrast or difficulty' },
          { left: 'Therefore', right: 'Introduces a conclusion' },
          { left: 'However', right: 'Signals something unexpected or contrary' },
        ],
      },
    ],
    B2: [
      {
        type: 'mc',
        question: 'Email from your landlord: "I am writing to let you know that the boiler inspection will take place next Tuesday." What tone does this message have?',
        options: ['Very informal, like to a friend', 'Formal and polite', 'Angry', 'Confusing'],
        answer: 'Formal and polite',
      },
      {
        type: 'mc',
        question: 'In a lease agreement you read: "The tenant agrees to report any damage within forty-eight hours." What must the tenant do if something breaks?',
        options: ['Fix it themselves', 'Report it in less than two days', 'Wait until the end of the lease', 'Do nothing'],
        answer: 'Report it in less than two days',
      },
    ],
    C1: [
      {
        type: 'mc',
        question: 'In a work chat, someone writes: "Great, another last-minute Friday meeting..." What do they really mean?',
        options: ['They are very happy about the meeting', "They're being sarcastic, it annoys them", 'They have no opinion at all', "They're asking the time"],
        answer: "They're being sarcastic, it annoys them",
      },
      {
        type: 'mc',
        question: 'Comparing these two messages: "I need the report now" and "Whenever you get a chance, could you send me the report? Thanks" — what is the main difference?',
        options: ['They are asking for different things', 'One is much more formal and polite than the other', 'One is in the past tense', 'There is no difference'],
        answer: 'One is much more formal and polite than the other',
      },
    ],
    C2: [
      {
        type: 'mc',
        question: 'A friend tells you: "He finally threw in the towel on the project." What does this expression mean?',
        options: ['He finished the project successfully', 'He gave up, stopped trying', 'He started a new project', 'He won an award'],
        answer: 'He gave up, stopped trying',
      },
      {
        type: 'mc',
        question: 'Opinion headline: "Same old promise again, we\'ll see if it\'s true this time." What attitude does the author convey?',
        options: ['Total confidence', "Skepticism, doubts it'll happen", 'Complete indifference', 'Enthusiasm'],
        answer: "Skepticism, doubts it'll happen",
      },
    ],
  },
  Writing: {
    A1: [
      {
        type: 'mc',
        question: 'How do you say it correctly? "She ____ my sister."',
        options: ['is', 'are', 'am', 'be'],
        answer: 'is',
      },
      {
        type: 'mc',
        question: 'Complete: "I ____ a book at the library every week."',
        options: ['buy', 'look for', 'found', 'read'],
        answer: 'read',
      },
    ],
    A2: [
      {
        type: 'mc',
        question: 'What is the correct order? (1) have (2) I (3) two (4) brothers',
        options: ['2-1-4-3', '2-4-1-3', '1-2-3-4', '3-4-2-1'],
        answer: '2-1-4-3',
      },
      {
        type: 'mc',
        question: "You're writing about something you already finished: \"I have already ____ the homework.\" What do you use?",
        options: ['was writing', 'will write', 'have written', 'write'],
        answer: 'have written',
      },
    ],
    B1: [
      {
        type: 'mc',
        question: 'You want to write: "If I ____ more time, I would travel more." What form do you use?',
        options: ['have', 'had', 'having', 'has'],
        answer: 'had',
      },
      {
        type: 'matching',
        question: 'Match each connector with its use when writing:',
        pairs: [
          { left: 'Although', right: 'To introduce a difficulty' },
          { left: 'Therefore', right: 'To introduce a conclusion' },
          { left: 'However', right: 'To point out a contradiction' },
        ],
      },
    ],
    B2: [
      {
        type: 'mc',
        question: "You're writing a formal email to request information from a company. Which greeting is most appropriate?",
        options: ["Hey, what's up!", 'Dear Sir or Madam,', 'yo wassup', 'Hey, quick thing'],
        answer: 'Dear Sir or Madam,',
      },
      {
        type: 'mc',
        question: "You're writing a formal complaint about a faulty service. Which closing line is most appropriate?",
        options: ['See ya, bye', 'I look forward to your response. Sincerely,', "I'll tell you something later", "Well, that's it"],
        answer: 'I look forward to your response. Sincerely,',
      },
    ],
    C1: [
      {
        type: 'mc',
        question: 'You are writing to a coworker about a misunderstanding. Which of these sentences sounds the most professional while still being warm?',
        options: [
          '"I think there has been a misunderstanding — could we clear it up when you have a moment?"',
          "\"That's not what you said.\"",
          "\"Never mind, I'll fix it myself.\"",
          '"???"',
        ],
        answer: '"I think there has been a misunderstanding — could we clear it up when you have a moment?"',
      },
      {
        type: 'mc',
        question: 'You are rewriting a very informal message ("hey man send me the file already") to send to your boss. What is the best version?',
        options: [
          '"Could you send me the file when you get a chance? Thanks."',
          '"Send me the file."',
          '"Hey man send me the file already, boss."',
          '"File now plz."',
        ],
        answer: '"Could you send me the file when you get a chance? Thanks."',
      },
    ],
    C2: [
      {
        type: 'mc',
        question: 'You want to ask a close friend a big favor without sounding demanding. Which of these sounds most natural in English?',
        options: [
          '"I demand that you help me with this."',
          '"Would you mind giving me a hand with this? I\'d really appreciate it."',
          '"Help me."',
          '"It\'s your duty to help me."',
        ],
        answer: '"Would you mind giving me a hand with this? I\'d really appreciate it."',
      },
      {
        type: 'mc',
        question: "You're writing a negative but polite restaurant review. Which sentence sounds most natural for a native speaker?",
        options: [
          '"The food was bad and the service was terrible, I\'m not going back."',
          '"Although the atmosphere was pleasant, the food didn\'t quite live up to expectations and the service could improve."',
          '"Everything was bad."',
          '"I don\'t recommend this place at all, it\'s horrible."',
        ],
        answer: '"Although the atmosphere was pleasant, the food didn\'t quite live up to expectations and the service could improve."',
      },
    ],
  },
  Listening: {
    A1: [
      {
        type: 'listening-assessment',
        question: 'Listen to the greeting. Which response is appropriate?',
        audioText: 'Hi, how are you?',
        options: ['Goodbye', "I'm fine, thanks, and you?", "My name is John", 'Where is it?'],
        answer: "I'm fine, thanks, and you?",
      },
      {
        type: 'listening-assessment',
        question: 'Listen to the day mentioned. Which one is it?',
        audioText: 'Today is Monday',
        options: ['Tuesday', 'Monday', 'Sunday', 'Wednesday'],
        answer: 'Monday',
      },
    ],
    A2: [
      {
        type: 'listening-assessment',
        question: "Listen to the question. What is being asked?",
        audioText: 'How was your weekend?',
        options: ['How your weekend went', 'Where you live', 'Your name', 'Your age'],
        answer: 'How your weekend went',
      },
      {
        type: 'listening-assessment',
        question: 'Listen and choose the object described.',
        audioText: 'It is a clear liquid we drink',
        options: ['Coffee', 'Water', 'Milk', 'Wine'],
        answer: 'Water',
      },
    ],
    B1: [
      {
        type: 'listening-assessment',
        question: 'Listen to how it is said. How does the person really feel?',
        audioText: "It's fine...",
        options: ['Very sad', 'Okay with it, though not entirely convinced', 'Very happy', 'Confused'],
        answer: 'Okay with it, though not entirely convinced',
      },
      {
        type: 'listening-assessment',
        question: 'Listen to the phrase. What does the person convey?',
        audioText: "I don't care",
        options: ['They care a lot', 'They are very happy', "They're indifferent", "They don't understand"],
        answer: "They're indifferent",
      },
    ],
    B2: [
      {
        type: 'listening-assessment',
        question: 'Listen to the pause. What is the person doing?',
        audioText: "Um... I don't think I agree",
        options: ["They're in a hurry", 'Looking for the right words', 'They have finished speaking', "They're not interested in the topic"],
        answer: 'Looking for the right words',
      },
      {
        type: 'listening-assessment',
        question: 'Listen to the message. In what situation would this be said?',
        audioText: "Good morning, I'd like to request some information about your services",
        options: ['Talking to a friend', 'Calling a company', 'At a party', 'With a young child'],
        answer: 'Calling a company',
      },
    ],
    C1: [
      {
        type: 'listening-assessment',
        question: 'A boss says this to an employee. What are they really telling them?',
        audioText: 'Your performance needs to improve',
        options: ['Congratulating them', 'Criticizing them, but gently', 'Asking them a question', 'Giving them the day off'],
        answer: 'Criticizing them, but gently',
      },
      {
        type: 'listening-assessment',
        question: 'A customer calls the bank. How many days do they have to dispute the charge?',
        audioText: 'To dispute that charge, you have fourteen days from the date it was made.',
        options: ['Seven days', 'Fourteen days', 'Thirty days', 'One day'],
        answer: 'Fourteen days',
      },
    ],
    C2: [
      {
        type: 'listening-assessment',
        question: 'Listen to this complaint to customer service. What tone does the person use, despite being upset?',
        audioText: "I understand you're very busy, but this is already the third time I've called about this same issue, and I'd really like it resolved once and for all.",
        options: ['Very rude', 'Polite but firm', 'Totally indifferent', 'Cheerful'],
        answer: 'Polite but firm',
      },
      {
        type: 'listening-assessment',
        question: 'Listen to the accent. Where is this person probably from?',
        audioText: "Thanks so much for the help, y'all are real kind",
        options: ['England', 'Southern United States', 'Australia', 'Scotland'],
        answer: 'Southern United States',
      },
    ],
  },
  Speaking: {
    A1: [
      {
        type: 'speaking-assessment',
        question: 'Introduce yourself briefly',
        prompt: 'Introduce yourself with your name and one thing about you (e.g., "My name is... I am...")',
        maxDuration: 10,
      },
      {
        type: 'speaking-assessment',
        question: 'Answer: What is your name?',
        prompt: 'Answer the question with your name in English',
        maxDuration: 5,
      },
    ],
    A2: [
      {
        type: 'speaking-assessment',
        question: 'Describe your weekend',
        prompt: 'Describe what you did this weekend (3-4 sentences)',
        maxDuration: 15,
      },
      {
        type: 'speaking-assessment',
        question: 'Talk about your favorite food',
        prompt: 'Talk about your favorite food and why you like it',
        maxDuration: 10,
      },
    ],
    B1: [
      {
        type: 'speaking-assessment',
        question: 'Give your opinion on an everyday topic',
        prompt: 'Give your opinion on an everyday topic (your job, a hobby, your city) with reasons',
        maxDuration: 20,
      },
      {
        type: 'speaking-assessment',
        question: 'Tell me a personal anecdote',
        prompt: 'Tell a brief personal story or anecdote in the past tense',
        maxDuration: 20,
      },
    ],
    B2: [
      {
        type: 'speaking-assessment',
        question: 'Convince someone of something with arguments',
        prompt: 'Try to convince someone of a practical proposal (a plan, a purchase, a change at work) with clear reasons',
        maxDuration: 25,
      },
      {
        type: 'speaking-assessment',
        question: 'Explain an everyday problem and propose solutions',
        prompt: 'Explain an everyday problem (at work, at home, with a service) and propose practical solutions',
        maxDuration: 25,
      },
    ],
    C1: [
      {
        type: 'speaking-assessment',
        question: 'Give a short presentation about your job or field of study',
        prompt: 'Give a short professional presentation about your job or field, as if speaking to new colleagues',
        maxDuration: 30,
      },
      {
        type: 'speaking-assessment',
        question: 'Explain and resolve a misunderstanding',
        prompt: 'Explain a misunderstanding with a coworker or friend and how you would resolve it, being diplomatic',
        maxDuration: 30,
      },
    ],
    C2: [
      {
        type: 'speaking-assessment',
        question: 'Take part in a debate on a current topic',
        prompt: 'Defend your position on a current everyday topic (work-life balance, a local issue, a piece of news) with fluent, natural English',
        maxDuration: 35,
      },
      {
        type: 'speaking-assessment',
        question: 'Respond naturally to an unexpected job interview question',
        prompt: 'Respond naturally, as a native speaker would, to an unexpected job interview question',
        maxDuration: 35,
      },
    ],
  },
};

export function getAssessmentQuestionsEn(skill: SkillId, level: CefrLevel): ExerciseQuestion[] {
  const questions = assessmentData[skill]?.[level] || [];
  return questions.map((q) => ({
    ...q,
    type: q.type as 'mc' | 'matching' | 'speaking-assessment' | 'listening-assessment',
  } as ExerciseQuestion));
}
