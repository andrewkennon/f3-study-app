export interface StudyDayData {
  book: string;
  chapter: number;
  verseRef: string;
  title: string;
  summary: string;
  context: string;
  himConnection: string;
  wordStudy: {
    originalWord: string;
    transliteration: string;
    meaning: string;
    breakdown: string;
  };
}

export const STUDY_CONTENT: Record<string, Record<number, StudyDayData>> = {
  'being-him': {
    1: {
      book: 'Proverbs',
      chapter: 27,
      verseRef: 'PROVERBS 27:14-19',
      title: 'Sharpening in the Gloom',
      summary: 'Wisdom literature highlighting that just as iron sharpens iron, men sharpen one another through intentional accountability and mutual friction.',
      context: 'Solomon collected these proverbs to teach practical wisdom for daily life, using metallurgical tools to illustrate personal growth.',
      himConnection: 'True leadership requires putting yourself in proximity with other men who will hold you accountable, remove dullness, and challenge you to grow.',
      wordStudy: {
        originalWord: 'יַחַד',
        transliteration: 'Yachad',
        meaning: 'To unite, join together, or sharpen mutually.',
        breakdown: 'Refers to two edges striking together in intentional contact.'
      }
    },
    // Add Day 2, Day 3, Day 14 here cleanly...
  },
  'godly-man': {
    1: {
      book: '1 Corinthians',
      chapter: 16,
      verseRef: '1 CORINTHIANS 16:13-14',
      title: 'Be Watchful, Stand Firm',
      summary: 'Direct commands to remain alert, stand firm in the faith, act with courage and strength, and perform all actions in love.',
      context: 'Paul closes his letter to Corinth with military-style directives to keep believers grounded amidst cultural pressure.',
      himConnection: 'Strength without love leads to harshness, while love without strength leads to compromise. A leader balances conviction with care.',
      wordStudy: {
        originalWord: 'ἀνδρίζομαι',
        transliteration: 'Andrizomai',
        meaning: 'To act courageously and show mature character.',
        breakdown: 'A call to spiritual stability and steady resolve under pressure.'
      }
    }
  }
};