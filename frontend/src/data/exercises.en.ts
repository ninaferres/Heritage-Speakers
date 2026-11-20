import { Exercise, CefrLevel, SkillId } from './types';

/**
 * English exercise bank - same structure as Spanish/Russian
 * Level A1-C2, Skills: Speaking, Reading, Listening, Writing
 */
export const EXERCISES_EN: Record<string, Exercise> = {
  'A1-Speaking': {
    skill: 'Speaking',
    title: 'Personal Introduction',
    prompt: 'Introduce yourself: your name, age, city and two things you like to do.',
    suggestedDuration: '1-2 minutes',
  },
  'A2-Speaking': {
    skill: 'Speaking',
    title: 'My Daily Routine',
    prompt: 'Describe your typical day from the moment you wake up until you go to bed.',
    suggestedDuration: '2-3 minutes',
  },
  'B1-Speaking': {
    skill: 'Speaking',
    title: 'Technology in My Life',
    prompt: 'Talk about how technology has affected your life: advantages, problems, and your personal opinion.',
    suggestedDuration: '3-4 minutes',
  },
  'B2-Speaking': {
    skill: 'Speaking',
    title: 'An Important Social Issue',
    prompt: 'Explain an important social issue: what it is, why it matters, how it affects society, and possible solutions.',
    suggestedDuration: '4-5 minutes',
  },
  'C1-Speaking': {
    skill: 'Speaking',
    title: 'Analyzing Cultural Trends',
    prompt: 'Analyze how globalization is transforming local cultures. Consider both the positive and negative perspectives.',
    suggestedDuration: '5-7 minutes',
  },
  'C2-Speaking': {
    skill: 'Speaking',
    title: 'A Difficult Negotiation',
    prompt: 'Imagine you need to negotiate a change in terms (deadlines, price, or scope of work) with a client or your boss. Defend your position naturally, firmly, but politely.',
    suggestedDuration: '7-10 minutes',
  },

  'A1-Reading': {
    skill: 'Reading',
    title: 'My Daily Routine',
    passage:
      'My name is John and I live in Chicago. Every morning I wake up at seven o\'clock without fail. I have coffee with toast for breakfast and I read the news. After that I take a twenty-minute shower and get ready for work. I work as a secretary in a large office from nine in the morning until five in the evening. At noon I eat lunch in the company cafeteria with my coworkers. After work I go to the gym three times a week. In the evening I have dinner with my family at half past eight. I go to sleep at eleven o\'clock at night.',
    questions: [
      { type: 'open', question: 'What time does John wake up every morning?' },
      { type: 'open', question: "What is John's job? Describe his responsibilities." },
      { type: 'open', question: 'What activities does John do after work?' },
    ],
  },
  'A2-Reading': {
    skill: 'Reading',
    title: 'A Memorable Trip to Boston',
    passage:
      'Last month I had the chance to travel to Boston with my best friends. We arrived by train early in the morning. We stayed at a central hotel near the Freedom Trail. On the first day we visited one of the most famous universities in the country. In the afternoon we walked along the waterfront. On the second day we went to the beach along the Atlantic coast. At night we tried traditional New England food: clam chowder, lobster rolls, and baked beans. On the third day we visited the Museum of Fine Arts. It was a wonderful trip that I will never forget.',
    questions: [
      { type: 'open', question: 'Who did the author travel with to Boston?' },
      { type: 'open', question: 'What three main places did they visit?' },
      { type: 'open', question: 'What traditional New England foods did they try?' },
    ],
  },
  'B1-Reading': {
    skill: 'Reading',
    title: 'Climate Change',
    passage:
      'Climate change is one of the most important problems facing humanity in the twenty-first century. Scientists warn that global temperatures will continue to rise if we do not reduce greenhouse gas emissions. We are already witnessing extreme droughts, catastrophic floods, and the rapid disappearance of species. However, viable solutions exist: switching to renewable energy sources, such as solar and wind power, could significantly reduce our impact on the environment.',
    questions: [
      { type: 'open', question: 'What is the main topic of the text?' },
      { type: 'open', question: 'What consequences of climate change are mentioned?' },
      { type: 'open', question: 'What solutions are proposed in the text?' },
    ],
  },
  'B2-Reading': {
    skill: 'Reading',
    title: 'Artificial Intelligence',
    passage:
      'Artificial intelligence has become a transformative force affecting nearly every aspect of our modern society. From algorithms that personalize our digital experience to medical diagnosis systems, AI is changing what we thought was possible. However, this revolution raises serious ethical questions. How do we ensure AI develops fairly? What will happen to jobs that get automated? Experts believe the answer lies in a solid regulatory framework that balances innovation with the protection of rights.',
    questions: [
      { type: 'open', question: "What is the author's main point?" },
      { type: 'open', question: 'What ethical questions does the text raise?' },
    ],
  },
  'C1-Reading': {
    skill: 'Reading',
    title: 'The Shift to Remote Work',
    passage:
      'Few changes in the world of work have happened as fast as the shift to remote work after the pandemic. What started as a temporary fix became, for many companies, a lasting competitive advantage: access to talent without geographic limits, lower office costs and, according to numerous surveys, happier employees. However, it is not that simple. Managers point to a real difficulty in maintaining team culture and catching the early signs of burnout when communication is reduced to scheduled video calls.',
    questions: [
      { type: 'open', question: 'What advantages of remote work are mentioned in the text?' },
      { type: 'open', question: 'What main difficulty do managers point out?' },
    ],
  },
  'C2-Reading': {
    skill: 'Reading',
    title: 'The Housing Crisis',
    passage:
      'More and more families in this country are facing a reality that is hard to ignore: housing affordability. Rental prices have kept climbing in recent years, especially in major cities, and many young people are forced to live with their parents far longer than they would like. Some local governments have begun capping prices, although the results so far are mixed. The question is which measures can actually change the situation, and which ones only create the appearance of a solution.',
    questions: [
      { type: 'open', question: 'What is the main topic of the text?' },
      { type: 'open', question: 'What have some local governments done, and with what result?' },
    ],
  },

  'A1-Writing': {
    skill: 'Writing',
    title: 'A Letter to a Friend',
    prompt: 'Write a short letter to a friend. Tell them about yourself, your family, and what you like to do. Use simple sentences.',
    minWords: 50,
    maxWords: 100,
  },
  'A2-Writing': {
    skill: 'Writing',
    title: 'Describing My Weekend',
    prompt: 'Describe your weekend: what you did, where you went, who with, and why you liked it.',
    minWords: 100,
    maxWords: 150,
  },
  'B1-Writing': {
    skill: 'Writing',
    title: 'Essay: My Hobby',
    prompt: 'Write an essay (250-300 words) about your hobby: why you like it, how long you have been doing it, and what benefits it gives you.',
    minWords: 250,
    maxWords: 300,
  },
  'B2-Writing': {
    skill: 'Writing',
    title: "A Critical Letter to the Newspaper",
    prompt: 'Write a letter to the editor (300-400 words) expressing your opinion on a social issue, and propose possible solutions.',
    minWords: 300,
    maxWords: 400,
  },
  'C1-Writing': {
    skill: 'Writing',
    title: 'A Formal Complaint',
    prompt: 'Write a formal letter to a company complaining about a problem with an order or service. Clearly explain the problem, state what resolution you expect, and keep a firm but polite tone.',
    minWords: 250,
    maxWords: 350,
  },
  'C2-Writing': {
    skill: 'Writing',
    title: 'Opinion Piece',
    prompt: 'Write an opinion piece on a current topic you care about (work, housing, technology, the environment). Argue your position with nuance and address the opposing viewpoint.',
    minWords: 300,
    maxWords: 400,
  },

  'A1-Listening': {
    skill: 'Listening',
    title: 'Getting to Know Someone',
    transcript: "Hello! I'm Max. I'm 25 years old. I'm a university student. I study computer science. I live in Seattle. I like programming and playing soccer. On weekends I go to the movies.",
    questions: [
      { type: 'open', question: "What is the speaker's name?" },
      { type: 'open', question: 'How old is he?' },
      { type: 'open', question: 'What does he study?' },
    ],
  },
  'A2-Listening': {
    skill: 'Listening',
    title: 'A Day in the Life',
    transcript: 'My usual day starts at seven o\'clock in the morning. I wake up, wash up, and have breakfast. Breakfast is usually cereal and tea. Then I go to school. Classes at the university start at nine o\'clock. During the lunch break I eat at a café. After classes I go home or meet up with friends. In the evening I do my homework and have dinner with my family.',
    questions: [
      { type: 'open', question: "What time does the speaker's day start?" },
      { type: 'open', question: 'What does he usually have for breakfast?' },
      { type: 'open', question: 'What time do classes start at the university?' },
    ],
  },
  'B1-Listening': {
    skill: 'Listening',
    title: 'Professional Experience',
    transcript: "I've been working as a web developer at a small tech company for three years now. My main responsibility is building and maintaining web applications. Every day I collaborate with designers and other developers. The job requires constant learning, since technology evolves so fast. I like my profession because it lets me build useful products.",
    questions: [
      { type: 'open', question: "What is the speaker's profession?" },
      { type: 'open', question: 'How many years has he been working in this role?' },
      { type: 'open', question: 'Why does he like his profession?' },
    ],
  },
  'B2-Listening': {
    skill: 'Listening',
    title: 'Environmental Challenges',
    transcript: 'Global warming is becoming an increasingly serious problem for our planet. Greenhouse gas emissions from industry and transportation are driving climate change. This affects sea levels, weather patterns, and ecosystems. Scientists warn that if we do not take action, the consequences will be catastrophic. We need to shift toward renewable energy sources and rethink our economy.',
    questions: [
      { type: 'open', question: 'What is the main cause of global warming mentioned?' },
      { type: 'open', question: 'What consequences of climate change are mentioned?' },
      { type: 'open', question: 'What solution is proposed?' },
    ],
  },
  'C1-Listening': {
    skill: 'Listening',
    title: 'The Philosophy of Language',
    transcript: "Language is not only a means of communication, but also shapes our ability to think. The hypothesis of linguistic relativity, put forward by Whorf, suggests that the structure of a language influences the structure of thought. The debate over whether language determines thought or simply expresses it continues in linguistics and philosophy. Modern research points to a complex interaction between language and cognitive processes.",
    questions: [
      { type: 'open', question: 'What functions of language are discussed?' },
      { type: 'open', question: 'What does the hypothesis of linguistic relativity suggest?' },
    ],
  },
  'C2-Listening': {
    skill: 'Listening',
    title: 'A Geopolitical Transformation',
    transcript: "The current international order is undergoing a fundamental transformation. The traditional unipolar system that dominated after the Cold War is giving way to a multipolar architecture. The rise of new centers of power, especially in Asia, is reshaping the balance of global influence. However, this transition is marked by uncertainty and the potential for conflict. The challenge for the international community is to manage this transformation through dialogue and multilateral cooperation.",
    questions: [
      { type: 'open', question: 'What structure of the international order is giving way to a new one?' },
      { type: 'open', question: 'What regions are emerging as new centers of power?' },
    ],
  },
};

export function getExerciseEn(level: string, skill: string): Exercise | undefined {
  return EXERCISES_EN[`${level}-${skill}`];
}
