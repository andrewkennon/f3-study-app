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
      summary: 'Wisdom literature illustrating that just as iron sharpens iron, men sharpen one another through intentional accountability, honest feedback, and mutual fellowship.',
      context: 'Solomon collected these proverbs to offer practical guidance for daily life in ancient Israel, using common workshop tools to explain human relationships.',
      himConnection: 'True leadership requires putting yourself in proximity with other men who will hold you accountable, remove dullness, and challenge you to grow.',
      wordStudy: {
        originalWord: 'יַחַד',
        transliteration: 'Yachad',
        meaning: 'To unite, join together, or sharpen mutually.',
        breakdown: 'Refers to two edges striking together. Growth requires intentional contact and healthy friction.'
      }
    },
    2: {
      book: '1 Corinthians',
      chapter: 16,
      verseRef: '1 CORINTHIANS 16:13-14',
      title: 'Standing Firm in Conviction',
      summary: 'A set of military-style directives calling believers to remain vigilant, stand firm in faith, act courageously, and operate entirely in love.',
      context: 'Paul concludes his first letter to the church in Corinth—a city plagued by cultural pressure—by urging them to maintain strong, loving resolve.',
      himConnection: 'Strength without love creates harshness, while love without strength leads to compromise. A High-Impact Man balances both seamlessly.',
      wordStudy: {
        originalWord: 'ἀνδρίζομαι',
        transliteration: 'Andrizomai',
        meaning: 'To act with mature courage and steady bravery.',
        breakdown: 'A command to step up into responsible, courageous leadership.'
      }
    },
    3: {
      book: 'Nehemiah',
      chapter: 4,
      verseRef: 'NEHEMIAH 4:13-18',
      title: 'Guard and Build',
      summary: 'Nehemiah organizes the rebuilders of Jerusalem’s wall, stationing men with weapons in hand so they can work while remaining prepared to defend their families.',
      context: 'Surrounding local factions opposed the restoration of Jerusalem, requiring constant guard duties during physical construction.',
      himConnection: 'Leaders must simultaneously build their families/communities and guard them against external distractions and threats.',
      wordStudy: {
        originalWord: 'שָׁמַר',
        transliteration: 'Shamar',
        meaning: 'To watch, guard, keep, or protect.',
        breakdown: 'Refers to active, watchful defense rather than passive waiting.'
      }
    },
    4: {
      book: 'Ephesians',
      chapter: 6,
      verseRef: 'EPHESIANS 6:10-18',
      title: 'The Full Armor',
      summary: 'Paul outlines the spiritual armor provided by God, emphasizing truth, righteousness, readiness, faith, and the Word as essential defenses.',
      context: 'Written from prison, Paul draws on Roman military gear as a metaphor for spiritual readiness.',
      himConnection: 'Daily preparation requires intentional posture before stepping onto the field of daily responsibilities.',
      wordStudy: {
        originalWord: 'πανοπλία',
        transliteration: 'Panoplia',
        meaning: 'Complete equipment or full armor of a soldier.',
        breakdown: 'Indicates no missing pieces; complete coverage is required for effective guard duties.'
      }
    },
    5: {
      book: '2 Timothy',
      chapter: 2,
      verseRef: '2 TIMOTHY 2:1-7',
      title: 'Endurance and Discipline',
      summary: 'Paul uses metaphors of a dedicated soldier, an athlete following rules, and a hard-working farmer to teach focus and endurance in service.',
      context: 'Paul writes his final letter to young Timothy, preparing him for the difficulties of church leadership.',
      himConnection: 'Impact is built through long-term discipline and daily repetition rather than short bursts of excitement.',
      wordStudy: {
        originalWord: 'κακοπαθέω',
        transliteration: 'Kakopatheo',
        meaning: 'To endure hardship or suffer trouble patiently.',
        breakdown: 'Refers to choosing voluntary discomfort for a higher purpose.'
      }
    },
    6: {
      book: 'Philippians',
      chapter: 2,
      verseRef: 'PHILIPPIANS 2:1-8',
      title: 'The Servant Posture',
      summary: 'An exhortation to humility, considering others as more significant than oneself and adopting the self-emptying mind of Christ.',
      context: 'Paul encourages the Philippian church to preserve unity by putting personal ambition aside.',
      himConnection: 'Real authority comes from voluntary service and putting the needs of your team and family first.',
      wordStudy: {
        originalWord: 'ταπεινοφροσύνη',
        transliteration: 'Tapeinophrosyne',
        meaning: 'Humility of mind, modesty, or lowliness.',
        breakdown: 'A deliberate recognition of one’s place relative to God and others.'
      }
    },
    7: {
      book: 'Joshua',
      chapter: 1,
      verseRef: 'JOSHUA 1:6-9',
      title: 'Courage under Command',
      summary: 'God charges Joshua to be strong and courageous as he takes leadership, promising His presence as long as he obeys the Law.',
      context: 'Following Moses’ death, Joshua faces the massive task of leading Israel into a new territory.',
      himConnection: 'Courage is rooted in trust in God’s promises rather than reliance on personal talent alone.',
      wordStudy: {
        originalWord: 'חָזַק',
        transliteration: 'Chazaq',
        meaning: 'To prove strong, courageous, or firmly established.',
        breakdown: 'Implies binding tight or holding fast under heavy load.'
      }
    },
    8: {
      book: 'Galatians',
      chapter: 6,
      verseRef: 'GALATIANS 6:1-5',
      title: 'Bearing the Burden',
      summary: 'Instructions to restore fallen brothers gently, share one another’s heavy burdens, and examine one’s own work before God.',
      context: 'Paul addresses legalism and division in the Galatian churches by stressing gentle, mutual support.',
      himConnection: 'Men don’t leave fallen brothers behind; we help carry the heavy loads when life gets overwhelming.',
      wordStudy: {
        originalWord: 'βάρος',
        transliteration: 'Baros',
        meaning: 'A heavy weight, burden, or pressuring load.',
        breakdown: 'Refers to a crushing weight too large for one person to lift alone.'
      }
    },
    9: {
      book: 'Romans',
      chapter: 12,
      verseRef: 'ROMANS 12:1-2',
      title: 'Transformed Mindset',
      summary: 'A call to offer your body as a living sacrifice and resist conforming to worldly patterns through continual mind renewal.',
      context: 'Paul shifts from theological foundations to practical daily application for believers in Rome.',
      himConnection: 'Leadership starts with how you discipline your thoughts, habits, and daily actions.',
      wordStudy: {
        originalWord: 'μεταμορφώω',
        transliteration: 'Metamorphoo',
        meaning: 'To transform, change form, or undergo complete renewal.',
        breakdown: 'Root for "metamorphosis"—an internal change that completely alters external form.'
      }
    },
    10: {
      book: 'Micah',
      chapter: 6,
      verseRef: 'MICAH 6:6-8',
      title: 'The Core Requirement',
      summary: 'Micah clarifies what God desires over ceremonial rituals: to act justly, love mercy, and walk humbly with God.',
      context: 'The prophet Micah addresses formal religious ritual that lacked heart alignment and ethical social justice.',
      himConnection: 'Performance without integrity is empty; true leadership demands justice, mercy, and personal humility.',
      wordStudy: {
        originalWord: 'חֶסֶד',
        transliteration: 'Chesed',
        meaning: 'Steadfast love, mercy, or loyal covenant kindness.',
        breakdown: 'Refers to relentless, unearned loyalty and goodwill toward others.'
      }
    },
    11: {
      book: 'Colossians',
      chapter: 3,
      verseRef: 'COLOSSIANS 3:12-17',
      title: 'Putting on the New Self',
      summary: 'Exhortation to put on compassion, kindness, meekness, patience, and love, letting the peace of Christ rule in your heart.',
      context: 'Paul instructs the believers in Colossae to replace old destructive habits with kingdom-focused virtues.',
      himConnection: 'You must intentionally put on character attributes every morning just as you put on gear for a workout.',
      wordStudy: {
        originalWord: 'ἐνδύω',
        transliteration: 'Endyo',
        meaning: 'To clothe oneself, put on garments, or array.',
        breakdown: 'An active, daily choice to wear character virtues.'
      }
    },
    12: {
      book: 'James',
      chapter: 1,
      verseRef: 'JAMES 1:22-25',
      title: 'Doers of the Word',
      summary: 'James warns against merely listening to truth without acting on it, comparing passive listeners to people who forget their reflection in a mirror.',
      context: 'Written to Jewish believers scattered across the Mediterranean, emphasizing active, living faith.',
      himConnection: 'Knowledge without execution is useless. High-Impact Men take action on what they learn.',
      wordStudy: {
        originalWord: 'ποιητής',
        transliteration: 'Poietes',
        meaning: 'A doer, performer, or producer.',
        breakdown: 'Where we get "poet"—one who actively constructs or produces tangible output.'
      }
    },
    13: {
      book: 'Hebrews',
      chapter: 12,
      verseRef: 'HEBREWS 12:1-3',
      title: 'Running the Race',
      summary: 'Encouragement to throw off weight and sin, running the designated endurance race with eyes fixed firmly on Jesus.',
      context: 'Written to believers facing persecution, using the venue of ancient Greek athletic games as an illustration.',
      himConnection: 'Strip away unnecessary baggage and distractions so you can finish your personal mission with strength.',
      wordStudy: {
        originalWord: 'ὑπομονή',
        transliteration: 'Hypomone',
        meaning: 'Patient endurance, steadfastness, or fortitude.',
        breakdown: 'The ability to stay under pressure without breaking.'
      }
    },
    14: {
      book: '1 Peter',
      chapter: 5,
      verseRef: '1 PETER 5:6-11',
      title: 'Firm in the Faith',
      summary: 'Peter calls leaders to humble themselves under God’s hand, cast their anxieties on Him, and stay vigilant against spiritual threats.',
      context: 'Peter writes to scattered believers living as minority communities across Asia Minor.',
      himConnection: 'Finish the study track by committing to ongoing watchfulness, humility, and daily brotherhood accountability.',
      wordStudy: {
        originalWord: 'νήφω',
        transliteration: 'Nepho',
        meaning: 'To be sober, clear-headed, and self-controlled.',
        breakdown: 'Refers to clear, unclouded judgment required for effective defense.'
      }
    }
  },
  'godly-man': {
    1: {
      book: '1 Corinthians',
      chapter: 16,
      verseRef: '1 CORINTHIANS 16:13-14',
      title: 'Be Watchful, Stand Firm',
      summary: 'Direct commands to remain alert, stand firm in faith, act with courage and strength, and perform all actions in love.',
      context: 'Paul closes his letter to Corinth with military-style directives to keep believers grounded amidst cultural pressure.',
      himConnection: 'Strength without love leads to harshness, while love without strength leads to compromise. A leader balances conviction with care.',
      wordStudy: {
        originalWord: 'ἀνδρίζομαι',
        transliteration: 'Andrizomai',
        meaning: 'To act courageously and show mature character.',
        breakdown: 'A call to spiritual stability and steady resolve under pressure.'
      }
    },
    2: {
      book: '1 Timothy',
      chapter: 6,
      verseRef: '1 TIMOTHY 6:11-16',
      title: 'Fight the Good Fight',
      summary: 'Paul urges Timothy to flee worldly traps, pursue righteousness, godliness, faith, love, steadfastness, and gentleness, and fight the good fight of faith.',
      context: 'Paul gives pastoral charge to Timothy as he confronts false teachings and material distractions in Ephesus.',
      himConnection: 'A Godly man knows what to run away from and what to pursue aggressively in his daily walk.',
      wordStudy: {
        originalWord: 'ἀγωνίζομαι',
        transliteration: 'Agonizomai',
        meaning: 'To strive, struggle, compete, or contend in a contest.',
        breakdown: 'Where we get "agonize"—describes intense athletic or combat engagement.'
      }
    },
    3: {
      book: '1 Kings',
      chapter: 2,
      verseRef: '1 KINGS 2:1-4',
      title: 'Show Yourself a Man',
      summary: 'David’s deathbed charge to Solomon: keep the charge of the Lord, walk in His ways, and keep His statutes so that you may prosper in all you do.',
      context: 'King David passes leadership of Israel to his young son Solomon, establishing covenant obedience as the foundation for royal success.',
      himConnection: 'Legacy is passed down when fathers and leaders challenge the next generation to obey God with undivided conviction.',
      wordStudy: {
        originalWord: 'חָזַק',
        transliteration: 'Chazaq',
        meaning: 'To be courageous, prevail, or take courage.',
        breakdown: 'A call to summon inner resolve when stepping into major responsibility.'
      }
    },
    4: {
      book: 'Psalms',
      chapter: 1,
      verseRef: 'PSALM 1:1-6',
      title: 'Planted by the Streams',
      summary: 'Contrast between the blessed man who delights in the Law of the Lord—flourishing like a deeply rooted tree—and the ungodly who are driven like chaff.',
      context: 'The introductory psalm for the entire Psalter, setting up the two distinct paths of human life.',
      himConnection: 'Fruitfulness comes from what feeds your mind daily; root yourself in Scripture rather than worldly council.',
      wordStudy: {
        originalWord: 'הָגָה',
        transliteration: 'Hagah',
        meaning: 'To meditate, ponder, mutter, or speak softly to oneself.',
        breakdown: 'Refers to continuous, reflective thought and habitual dwelling on truth.'
      }
    },
    5: {
      book: 'Titus',
      chapter: 2,
      verseRef: 'TITUS 2:1-8',
      title: 'Model of Good Works',
      summary: 'Paul outlines sound doctrine for older and younger men, urging self-control, dignity, sound speech that cannot be condemned, and integrity in all things.',
      context: 'Titus was stationed on Crete, an island known for lawlessness, to establish orderly leadership in the local churches.',
      himConnection: 'Your lifestyle speaks louder than your words. Model self-control and sound speech in front of your family and peers.',
      wordStudy: {
        originalWord: 'σωφρονισμός',
        transliteration: 'Sophronismos',
        meaning: 'Self-control, sound mind, or disciplined judgment.',
        breakdown: 'The ability to govern one’s passions and make rational, righteous choices.'
      }
    },
    6: {
      book: 'Proverbs',
      chapter: 3,
      verseRef: 'PROVERBS 3:1-8',
      title: 'Trust with All Your Heart',
      summary: 'Admonition to trust in the Lord completely rather than leaning on personal understanding, acknowledging Him in all ways so He directs your paths.',
      context: 'Fatherly wisdom instructing a son on how to navigate decisions, pride, and health under God’s authority.',
      himConnection: 'Pride tells you to rely on your own intellect; godliness surrenders personal agendas to divine guidance.',
      wordStudy: {
        originalWord: 'בָּטַח',
        transliteration: 'Batach',
        meaning: 'To trust, feel secure, or lie helpless face-down.',
        breakdown: 'Expresses absolute dependence and total security in a higher power.'
      }
    },
    7: {
      book: 'Ephesians',
      chapter: 5,
      verseRef: 'EPHESIANS 5:25-33',
      title: 'Sacrificial Headship',
      summary: 'Command for husbands to love their wives as Christ loved the church, giving Himself up for her to nourish and cherish her selflessly.',
      context: 'Paul outlines household relationships in Roman culture, transforming domestic leadership into sacrificial service.',
      himConnection: 'Leading a home is not about status or control; it is about willingly laying down your life and desires for your family every day.',
      wordStudy: {
        originalWord: 'ἀγαπάω',
        transliteration: 'Agapao',
        meaning: 'To love unconditionally, sacrificially, and persistently.',
        breakdown: 'Refers to deliberate, action-oriented commitment rather than mere emotional feeling.'
      }
    }
  }
};