export interface StudyDayData {
  book: string;
  chapter: number;
  verseRef: string;
  title: string;
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
      verseRef: 'PROVERBS 27:17-21',
      title: 'Sharpening in the Gloom',
      context: 'The book of Proverbs was compiled to pass down ancient Near Eastern wisdom to the next generation of leaders. In chapter 27, Solomon focuses heavily on the nature of true friendship and the dangers of isolation. In the ancient world, iron tools were sharpened by striking them against another iron file. It was a violent, friction-heavy process that sent sparks flying but resulted in a lethal, effective edge. Verse 21 adds the context of a crucible—just as silver is tested by intense heat, a man is tested by the praise and feedback he receives from his peers.',
      himConnection: 'You cannot get sharp alone in your fartsack. The Sad Clown culture of modern suburbia tells men they don\'t need anybody, leading to isolated, dull men who fold under the pressures of life. True leadership requires stepping into the Gloom and locking shields with other PAX. Iron sharpening iron means there will be friction. A real Shield Lock will call you out when you are slacking as a father, a husband, or a leader. They don\'t just stroke your ego; they strike against your dull edges to make you lethal for the kingdom. A High Impact Man (HIM) actively seeks out this kind of accountability.',
      wordStudy: {
        originalWord: 'חָדַד',
        transliteration: 'Chadad',
        meaning: 'To be sharp, fierce, or to sharpen mutually.',
        breakdown: 'This Hebrew word implies both the physical act of grinding a blade and the emotional/mental act of becoming fierce and alert. It is a dual-action word: you cannot sharpen a blade without both pieces of metal undergoing friction. Jesus lived this out with His disciples. He didn\'t recruit them to sit in comfortable classrooms; He dragged them through storms, challenged their prejudices, and rebuked their pride. He was the ultimate Iron that sharpened Peter from a reckless fisherman into a foundational pillar of the early church.'
      }
    },
    2: {
      book: '1 Corinthians',
      chapter: 16,
      verseRef: '1 CORINTHIANS 16:13-18',
      title: 'Standing Firm in Conviction',
      context: 'Corinth was the Las Vegas of the ancient world—a wealthy, sexually permissive, hyper-competitive port city. The church there was fracturing under the pressure of the surrounding culture, dealing with massive internal divisions, lawsuits, and moral compromises. Paul writes this letter to snap them out of their spiritual apathy. In the final chapter, he shifts from deep theological arguments to a staccato, military-style cadence. He is treating them like soldiers on a battlefield who have fallen asleep on watch.',
      himConnection: 'Being a HIM means keeping your head on a swivel. The enemy wants you asleep at the wheel, distracted by your career, sports, or the endless scroll of your phone. Paul says to "act like men"—which means stepping into the gap for your M and your 2.0s when it gets difficult. But don\'t miss verse 14. If you are a hard-charging leader who gets the job done but leaves a trail of bruised relationships behind you, you are doing it wrong. The ultimate mark of a High Impact Man is that his fierce strength is perfectly harnessed by sacrificial love.',
      wordStudy: {
        originalWord: 'ἀνδρίζομαι',
        transliteration: 'Andrizomai',
        meaning: 'To act like a man, be courageous, show oneself brave.',
        breakdown: 'This rare New Testament word is deeply rooted in the Greek translation of the Old Testament (Septuagint). It is the exact word used in Joshua 1:6 when God tells Joshua to "be strong and courageous." Paul is invoking the ancient warrior spirit of Israel. Christ is our perfect model of this. He didn’t run from the cross; He marched toward it with absolute resolve. He acted with supreme courage to defeat death, and He did it all out of a limitless love for His bride, the Church.'
      }
    },
    3: {
      book: 'Nehemiah',
      chapter: 4,
      verseRef: 'NEHEMIAH 4:13-20',
      title: 'Guard and Build',
      context: 'Nehemiah was the cupbearer to the Persian King Artaxerxes. He left his comfortable palace life to rebuild the ruined walls of Jerusalem. Local governors, like Sanballat and Tobiah, realized a fortified Jerusalem threatened their power, so they conspired to attack the city. The Jews were exhausted, clearing heavy rubble day and night. Instead of quitting or retreating, Nehemiah brilliantly reorganizes them by families, forcing them to physically defend their own wives and children while simultaneously doing the grueling work of construction.',
      himConnection: 'Every HIM lives with a trowel in one hand and a sword in the other. You are called to build—to invest in your career, raise your 2.0s, and develop your community. But you must simultaneously be armed to guard against the cultural decay, pornography, pride, and complacency trying to breach the walls of your home. You cannot outsource the defense of your family. Notice how Nehemiah rallied the men by their families (v. 13). When the beatdown of life gets heavy, you fight fiercely because of who is standing behind you in the Shield Lock.',
      wordStudy: {
        originalWord: 'שָׁמַר',
        transliteration: 'Shamar',
        meaning: 'To watch, guard, keep, or protect.',
        breakdown: 'This is the same word God used in Genesis 2 when He told Adam to "work and keep (shamar)" the Garden of Eden. Adam failed to guard the garden from the serpent. Nehemiah is redeeming that mandate, calling men to actively guard their city. Jesus is our ultimate Nehemiah. He came to a ruined world, fought off the ultimate enemy (Satan), and is currently building His Church (the New Jerusalem). He stood in the gap so that the walls of our salvation could never be breached.'
      }
    },
    4: {
      book: 'Ephesians',
      chapter: 6,
      verseRef: 'EPHESIANS 6:10-18',
      title: 'The Full Armor',
      context: 'Paul is writing this from a Roman prison, literally chained to a Roman soldier. He takes the standard-issue infantry gear of a legionnaire—the belt, breastplate, shoes, shield, helmet, and sword—and maps it to the spiritual realities of the Christian life. The church in Ephesus was surrounded by dark occult practices and the massive Temple of Artemis. Paul is making it clear that their real enemy isn\'t the Roman government or their annoying neighbors; their real enemy is the unseen demonic forces actively trying to destroy their faith.',
      himConnection: 'You wouldn’t EH a guy to post at a beatdown in flip-flops and jeans. You need the right gear. Paul is giving us our spiritual DRP (Daily Red Pill) gear check. The devil’s strategy isn’t usually a frontal assault; it’s "schemes"—subtle lies, quiet temptations, and slow moral compromises. A HIM puts on his armor every single morning before his feet hit the floor. You tighten the belt of truth, pick up the shield of faith to block the flaming arrows of anxiety, and grip the sword of the Spirit. Spiritual warfare isn’t a metaphor; it is the daily reality of leading your home.',
      wordStudy: {
        originalWord: 'πανοπλία',
        transliteration: 'Panoplia',
        meaning: 'The complete equipment or full armor of a heavy infantry soldier.',
        breakdown: 'Panoplia combines "pan" (all) and "hopla" (weapons/armor). It implies that missing even one piece leaves a fatal vulnerability. In the Old Testament (Isaiah 59:17), God Himself is depicted putting on the breastplate of righteousness and the helmet of salvation to wage war against injustice. When Paul tells us to put on the armor, he is literally telling us to put on Christ. Jesus wore this armor into the ultimate battle on the cross, absorbing the flaming darts of the enemy and defeating death with the sword of His truth.'
      }
    },
    5: {
      book: '2 Timothy',
      chapter: 2,
      verseRef: '2 TIMOTHY 2:1-7',
      title: 'Endurance and Discipline',
      context: 'This is Paul’s dying declaration. He is locked in the cold, damp Mamertine dungeon in Rome, awaiting execution under Emperor Nero. He is passing the leadership baton to his young protégé, Timothy, who is leading the church in Ephesus. Paul knows Timothy is going to face intense persecution and the temptation to quit. So, he gives him three gritty, blue-collar metaphors of professions that require massive amounts of front-loaded suffering and discipline before seeing any reward.',
      himConnection: 'F3 thrives on CSAUP (Completely Stupid And Utterly Pointless) events—things that test your limits and force you to endure. Paul is giving Timothy a spiritual CSAUP. The soldier doesn’t get entangled in civilian complaints; he focuses on pleasing the Q (the commander). The athlete doesn’t cheat the reps; he competes according to the standard. The farmer works his tail off in the dirt long before he ever sees a harvest. Being a HIM means embracing the suck. You don’t lead your family for instant gratification. You put in the quiet, grueling discipline today so you can reap a multi-generational harvest tomorrow.',
      wordStudy: {
        originalWord: 'κακοπαθέω',
        transliteration: 'Kakopatheo',
        meaning: 'To suffer hardship, endure afflictions, or bear trouble patiently.',
        breakdown: 'This word means willingly stepping into suffering for a higher purpose. The world views suffering as something to be avoided at all costs. The Gospel views suffering as the exact crucible God uses to forge our character. Christ is the ultimate example of the soldier, the athlete, and the farmer. He endured the cross, despising its shame, and planted Himself in the ground like a seed (John 12:24) so that we could become His harvest.'
      }
    },
    6: {
      book: 'Philippians',
      chapter: 2,
      verseRef: 'PHILIPPIANS 2:1-11',
      title: 'The Servant Posture',
      context: 'Philippi was a proud Roman colony filled with retired military veterans. The culture was obsessed with status, titles, and climbing the social ladder. The church was beginning to mirror that culture, with members bickering over who was the most important. Paul writes to them and inserts what scholars believe is an early Christian hymn (v. 6-11). He uses the staggering theology of the incarnation—God becoming a human—to solve a practical problem of church unity.',
      himConnection: 'In the corporate world, leadership is about climbing to the top, getting the corner office, and having people serve you. In the kingdom of God, leadership is a race to the bottom. When you Q a workout, you aren’t there to show off how fast you can run; you are there to serve the PAX, especially the Six (the guy struggling in the back). A true HIM considers others more significant than himself. Whether you are dealing with a difficult coworker or a stressed-out M, your posture must be the towel and the washbasin. Real authority is built on voluntary sacrifice.',
      wordStudy: {
        originalWord: 'κενόω',
        transliteration: 'Kenoo',
        meaning: 'To empty, make void, or divest of privileges.',
        breakdown: 'This is where theologians get the term "Kenosis" (the self-emptying of Christ). Jesus did not stop being God when He became a man; rather, He emptied Himself of the *privileges* of deity. He traded a throne for a feeding trough and a crown of glory for a crown of thorns. He didn’t view His equality with God as something to be used for His own advantage. By emptying Himself completely, God highly exalted Him. This is the profound paradox of the Gospel: the way up is down.'
      }
    },
    7: {
      book: 'Joshua',
      chapter: 1,
      verseRef: 'JOSHUA 1:1-9',
      title: 'Courage under Command',
      context: 'Moses, the legendary leader who brought Israel out of Egypt, is dead. Joshua, his understudy, is now staring at the swollen Jordan River and the fortified cities of Canaan. The nation of Israel is looking at him, expecting him to fill unfillable shoes. God steps in and speaks directly to Joshua. Interestingly, God doesn’t give him a detailed military strategy or a topographical map of Jericho. Instead, He gives him a theological command: saturate your mind in the Book of the Law, and do not be terrified, because I am with you.',
      himConnection: 'Every man eventually faces a "Jordan River" moment—a career change, a health crisis, or stepping into a leadership void. The natural reaction is imposter syndrome and fear. God’s prescription for Joshua’s fear wasn’t a pep talk about Joshua’s talents; it was a reminder of God’s presence. Being a HIM doesn’t mean you are never afraid. It means you anchor your courage in the absolute truth of God’s Word rather than your own abilities. When you take the Q for your family during a crisis, you can be strong and courageous because the Ultimate Q is standing right beside you in the Gloom.',
      wordStudy: {
        originalWord: 'חָזַק',
        transliteration: 'Chazaq',
        meaning: 'To strengthen, prevail, be resolute, or bind tight.',
        breakdown: 'This Hebrew word implies taking firm hold of something so it doesn’t slip. It’s the grip strength of the soul. Joshua is told to grip the Law of God so tightly that it dictates his every move (v. 8). Hundreds of years later, the ultimate "Joshua" (Jesus—Yeshua in Hebrew, meaning "The Lord Saves") would step onto the scene. He was perfectly strong and completely courageous, keeping the Law flawlessly so that He could lead us, His people, into the ultimate Promised Land of eternal rest.'
      }
    },
    8: {
      book: 'Galatians',
      chapter: 6,
      verseRef: 'GALATIANS 6:1-5',
      title: 'Bearing the Burden',
      context: 'The churches in Galatia were struggling with legalists (Judaizers) who taught that you had to follow strict Jewish laws (like circumcision) to truly be saved. This created a culture of spiritual pride, judgment, and competition. Paul destroys this toxic culture by reminding them of grace. If someone messes up, you don\'t flex your religious superiority; you get down in the mud and help them up. The community is designed to be a hospital for the broken, not a museum for the perfect.',
      himConnection: 'In F3, we never leave a man behind. When a PAX is struggling on a run, you circle back and pick up the Six. Paul is applying that exact principle to our spiritual lives. When a brother in your Shield Lock falls into a sin pattern, a failing marriage, or depression, you don’t shoot the wounded. You restore him with a spirit of gentleness, watching your own six so you don’t fall into the same trap. Bearing burdens means you take the heavy weight off his shoulders and put it on your own. That is how you fulfill the law of Christ.',
      wordStudy: {
        originalWord: 'βάρος',
        transliteration: 'Baros',
        meaning: 'A heavy weight, a burden, or an oppressive load.',
        breakdown: 'In Greek, there are different words for burden. In verse 5, Paul says each man must carry his own "load" (phortion), which refers to a soldier’s standard backpack—daily responsibility. But in verse 2, "baros" refers to a crushing, boulder-sized weight that will snap a man’s spine if he tries to carry it alone. Jesus is the ultimate burden-bearer. When the crushing "baros" of our sin and God’s wrath was too heavy for us to lift, Christ took it upon His own shoulders on the cross, fulfilling the ultimate law of love.'
      }
    },
    9: {
      book: 'Romans',
      chapter: 12,
      verseRef: 'ROMANS 12:1-3',
      title: 'Transformed Mindset',
      context: 'For 11 chapters, Paul has laid out the most breathtaking, comprehensive theological masterpiece on the grace and mercy of God in the entire Bible. In chapter 12, he pivots using the word "Therefore." Because of everything God has done for you, here is how you must respond. In the Roman Empire, sacrifices were dead animals offered on pagan altars. Paul introduces a radical new concept: the Christian sacrifice is a living, breathing human being whose everyday life is an act of spiritual worship.',
      himConnection: 'The world wants to put a massive Emotional Headlock (EH) on you. The culture demands that you conform to its standards of success, masculinity, and morality. Paul says, "Stop letting the world squeeze you into its mold." A HIM breaks the Sad Clown cycle by transforming his mindset. You cannot change your behavior until you change your mind. That happens through the daily discipline of renewing your mind in the Word. Your career, your workouts, and your marriage aren’t secular activities; when done for God’s glory, they are a living sacrifice.',
      wordStudy: {
        originalWord: 'μεταμόρφωσις (μεταμορφόω)',
        transliteration: 'Metamorphoo',
        meaning: 'To transform, change form, or undergo complete renewal.',
        breakdown: 'This is the root of the English word "metamorphosis"—like a caterpillar becoming a butterfly. It isn’t a superficial cosmetic change; it’s an internal DNA alteration that completely changes the external reality. Interestingly, this exact Greek word is only used in two other places in the New Testament: the Transfiguration of Jesus (Matthew 17:2, Mark 9:2). Just as the blinding glory of Christ’s divine nature pushed through His human flesh on the mountain, the Holy Spirit pushes through our renewed minds to manifest the character of Christ in our daily lives.'
      }
    },
    10: {
      book: 'Micah',
      chapter: 6,
      verseRef: 'MICAH 6:6-8',
      title: 'The Core Requirement',
      context: 'Micah prophesied during a time when the nation of Judah was experiencing economic prosperity but rampant social injustice. The wealthy elites were crushing the poor, yet they kept bringing thousands of expensive animal sacrifices to the temple, thinking they could buy God’s favor. God takes them to a cosmic courtroom, cross-examining their hypocrisy. He tells them He doesn’t want their rivers of oil or their fatted calves. He wants their hearts, evidenced by how they treat the marginalized.',
      himConnection: 'It is easy to fall into a performance trap. You can post to 5 beatdowns a week, lead the Q, and sit in a church pew every Sunday, but if your private life lacks integrity, it is just empty religious sweat. The 3rd F (Faith) isn’t about checking boxes; it’s about character. A HIM is required to act justly—doing the right thing when it costs him. He is required to love mercy—giving grace to his kids when they blow it. And he is required to walk humbly—recognizing that every breath in his lungs is a gift from a sovereign God.',
      wordStudy: {
        originalWord: 'חֶסֶד',
        transliteration: 'Chesed',
        meaning: 'Steadfast love, mercy, loyal covenant kindness.',
        breakdown: 'Chesed is one of the most profound words in the Hebrew Bible. It is notoriously difficult to translate into English because it wraps love, loyalty, mercy, and covenant obligation into one massive concept. It is the unmerited, relentless love of God that pursues His people even when they rebel. When Micah tells us to "love chesed," he is telling us to emulate the very heartbeat of God. Jesus perfectly embodied Chesed when He left heaven to rescue a rebellious people, binding Himself to us in a new covenant of His blood.'
      }
    },
    11: {
      book: 'Colossians',
      chapter: 3,
      verseRef: 'COLOSSIANS 3:12-17',
      title: 'Putting on the New Self',
      context: 'The church in Colossae was dealing with syncretism—mixing Christianity with Greek philosophy, strict rules, and mysticism. Paul writes to remind them that Christ is supreme over everything. Because they have died with Christ and been raised with Him, their old, toxic habits belong in the grave. The Christian life is described like a change of clothes. You have to take off the filthy, sweat-soaked rags of anger and malice, and deliberately dress yourself in the character of Jesus.',
      himConnection: 'When you wake up at 0500 for a beatdown, you don’t accidentally end up in your workout gear. You have to intentionally put on your shoes, your shorts, and grab your ruck. Paul is telling you to apply that same intentionality to your character. You have to wake up and consciously "put on" patience before you interact with a stubborn 2.0. You have to "put on" meekness (power under control) before you walk into a tense meeting at work. A HIM doesn’t let his emotions dictate his wardrobe; he clothes himself in the identity Christ has already purchased for him.',
      wordStudy: {
        originalWord: 'ἐνδύω',
        transliteration: 'Endyo',
        meaning: 'To clothe oneself, to put on, to array or dress.',
        breakdown: 'This verb is in the imperative mood—it is a direct command. But the beautiful theological truth underneath it is found in Galatians 3:27: "For as many of you as were baptized into Christ have put on (endyo) Christ." Our justification (being made right with God) is an instant wardrobe change where God covers us in the righteous robes of Jesus. Colossians 3 is our sanctification (growing in holiness)—the daily, ongoing process of matching our practical behavior to the glorious clothes we are already wearing in God’s eyes.'
      }
    },
    12: {
      book: 'James',
      chapter: 1,
      verseRef: 'JAMES 1:22-27',
      title: 'Doers of the Word',
      context: 'James, the half-brother of Jesus and the leader of the church in Jerusalem, writes this letter to Jewish Christians scattered by persecution. The letter of James is the "Proverbs of the New Testament"—highly practical, punchy, and utterly intolerant of fake faith. He uses a vivid illustration of a man who looks in a mirror, sees he has dirt on his face, but walks away and does absolutely nothing about it. To James, hearing a sermon without changing your life is the definition of insanity.',
      himConnection: 'F3 is a leadership organization, not a reading club. You can read all the leadership books, listen to the best podcasts, and do a daily Bible reading plan, but if you don’t execute, you are a Sad Clown with a lot of trivia in your head. Knowledge without action breeds arrogance. A HIM is a doer of the Word. If the Word convicts you about your temper, you apologize to your M. If it convicts you about your generosity, you write a check. You don’t just read the Slack channel; you post in the Gloom. Action validates belief.',
      wordStudy: {
        originalWord: 'ποιητής',
        transliteration: 'Poietes',
        meaning: 'A doer, a maker, a performer, or a producer.',
        breakdown: 'This is the Greek word from which we derive the English word "poet." In the ancient world, a poietes wasn’t just someone who wrote rhymes; it was someone who actively constructed or brought something tangible into existence. God is the ultimate Poietes—He spoke the universe into existence. When we are "doers" of the Word, we are partnering with the Holy Spirit to construct a tangible, living reality of the Kingdom of God right in the middle of our secular workplaces and living rooms.'
      }
    },
    13: {
      book: 'Hebrews',
      chapter: 12,
      verseRef: 'HEBREWS 12:1-3',
      title: 'Running the Race',
      context: 'The book of Hebrews was written to Jewish Christians who were facing intense persecution and were severely tempted to quit Christianity and revert to the safety of Judaism. Chapter 11 (the "Hall of Faith") just finished listing the heroic, gritty faith of Old Testament saints. Now in Chapter 12, the author shifts to a massive Roman amphitheater. The saints of the past are in the grandstands, and the current believers are down on the track. To survive the marathon, they must violently shed anything that slows them down.',
      himConnection: 'Life is not a 5K; it is an ultra-marathon through the mud. When you are carrying a 60lb sandbag, you don’t add rocks to your pockets. Yet, men constantly carry the dead weight of unconfessed sin, toxic habits, and bitter resentments. A HIM aggressively strips away the fat so he can run his mission with lethal focus. When your lungs are burning and you want to quit, you don’t look at your feet; you fix your eyes on the Q. Jesus is the founder and perfecter of our faith. He ran the ultimate race to the cross, absorbed the pain, and sat down in victory.',
      wordStudy: {
        originalWord: 'ὑπομονή',
        transliteration: 'Hypomone',
        meaning: 'Patient endurance, steadfastness, perseverance, fortitude.',
        breakdown: 'Hypomone comes from two words: "hypo" (under) and "meno" (to remain or abide). It literally means "to remain under the load." It is the spirit that can bear things, not simply with resignation, but with blazing hope. It is not the patience that sits in a rocking chair; it is the endurance that marches through a blizzard. Jesus demonstrated the ultimate hypomone when He endured the cross, despising its shame. Because He stayed under the wrath of God on our behalf, we have the power to stay under the loads He calls us to carry.'
      }
    },
    14: {
      book: '1 Peter',
      chapter: 5,
      verseRef: '1 PETER 5:6-11',
      title: 'Firm in the Faith',
      context: 'The Apostle Peter is writing to Christians scattered across Asia Minor who are suffering under the psychotic reign of Emperor Nero. They are being marginalized, slandered, and physically attacked. Peter knows a thing or two about spiritual attacks—he famously denied Jesus three times after falling asleep on watch in the Garden of Gethsemane. Now, as a seasoned, scarred leader, he warns the church that their physical suffering is actually a spiritual attack from a demonic predator looking for easy prey.',
      himConnection: 'Lions do not attack the strong, unified herd; they hunt for the weak, the sick, and the isolated. The enemy wants to separate you from your Shield Lock. He uses anxiety, pride, and busyness to get you out of the herd. Peter’s defense strategy is brilliant: humble yourself, throw your massive anxieties onto the shoulders of God (because He cares for you), and stay fiercely alert. A HIM finishes his 14-day study not by resting on his laurels, but by waking up the next day, locking arms with the PAX, and staying vigilant for the Kingdom.',
      wordStudy: {
        originalWord: 'νήφω',
        transliteration: 'Nepho',
        meaning: 'To be sober, calm, collected, and clear-headed.',
        breakdown: 'While it can mean abstaining from alcohol, the primary use here is mental and spiritual sobriety. It is the opposite of being intoxicated by the world’s panic, lust, or rage. A soldier who is drunk on duty is a dead man. Peter is calling for a disciplined, unclouded mind that can accurately assess spiritual threats. We can only maintain this calm vigilance because of verse 10: after we have suffered a little while, the God of all grace—the One who called us to eternal glory in Christ—will Himself restore, confirm, strengthen, and establish us forever.'
      }
    }
  },

  'godly-man': {
    1: {
      book: '1 Corinthians',
      chapter: 16,
      verseRef: '1 CORINTHIANS 16:1-14',
      title: 'Be Watchful, Stand Firm',
      context: 'Paul is writing to a deeply divided and culturally compromised church in Corinth. It was a wealthy, pagan port city full of sexual immorality and idol worship. Throughout the letter, he has been correcting their theology and behavior. In this closing chapter, he shifts from the profound theology of the resurrection (Chapter 15) to the gritty logistics of daily church life. Amidst these logistics, he drops a heavy, five-part command (v. 13-14) that serves as a final rallying cry for the church to stop acting like spiritual infants and step up to the plate.',
      himConnection: 'In F3, we talk about the Shield Lock—that small group of PAX you lock shields with when the battles of life get heavy. Paul is basically calling the men of Corinth into a spiritual Shield Lock. When he says "act like men," he’s telling them to drop the Sad Clown routine, stop fartsacking on their faith, and step into the Gloom with their eyes wide open. A High Impact Man (HIM) doesn\'t just drift through life; he is watchful. He anticipates the attacks on his M (wife), his 2.0s (kids), and his community. But notice the kicker in verse 14: "Let all that you do be done in love." You can be the hardest worker in the gloom, carrying the heaviest cinder block, but if you go home and you\'re a tyrant to your family, you\'ve missed the mark. True strength is harnessed by love.',
      wordStudy: {
        originalWord: 'ἀνδρίζομαι',
        transliteration: 'Andrizomai',
        meaning: 'To act like a man, be brave, show oneself a man.',
        breakdown: 'This word is rare in the New Testament but carries heavy weight. It’s a direct call to courage and maturity. In the Greek translation of the Old Testament (the Septuagint), this exact word is used when Moses tells Joshua to "be strong and courageous" (Deut 31:6) before entering the Promised Land. By using this word, Paul is echoing the ancient warrior call of Israel. Jesus perfectly embodied this when He set His face like flint toward Jerusalem, knowing the cross awaited Him. He didn\'t flinch. He stood firm, acted with supreme courage, and did it all out of perfect love for us.'
      }
    },
    2: {
      book: '1 Timothy',
      chapter: 6,
      verseRef: '1 TIMOTHY 6:6-19',
      title: 'Fight the Good Fight',
      context: 'Timothy is a young pastor stationed in Ephesus, a massive commercial and religious hub dominated by the Temple of Artemis. The city was obsessed with wealth, status, and mythologies. False teachers had infiltrated the church, equating godliness with a way to get rich. Paul writes this letter as a mentor to a younger leader, giving him the blueprint for church leadership and personal integrity. He’s telling Timothy that true wealth isn’t found in Ephesian gold, but in contentment and a steadfast walk with Christ.',
      himConnection: 'Every PAX knows the feeling of the "Daily Red Pill" (DRP). It\'s the daily choice to swallow the hard truth, get out of bed, and do the work rather than taking the easy, comfortable route. Paul is giving Timothy his spiritual DRP. He literally tells him to "flee" from the pursuit of money and status. As men, our culture constantly tries to EH (headlock) us into the rat race—chasing the bigger house, the better car, the corner office—at the expense of our soul. Being a HIM means you know when to run away from toxic pursuits and when to stand and fight. You aren\'t just fighting for yourself; you\'re fighting for the legacy you leave your 2.0s.',
      wordStudy: {
        originalWord: 'ἀγωνίζομαι',
        transliteration: 'Agonizomai',
        meaning: 'To contend, struggle, fight, or engage in an athletic contest.',
        breakdown: 'If you look at the transliteration, you can see where we get the English word "agonize." Paul is using imagery straight from the Greco-Roman athletic games and gladiatorial arenas. This isn\'t a casual stroll; it’s an agonizing, sweat-inducing, muscle-tearing fight. But notice what we are fighting: "the good fight of faith." Our battle isn\'t against flesh and blood, but against the spiritual forces of darkness and our own selfish flesh. Christ already won the ultimate victory on the cross, so we fight from a place of victory, not for it. He took the agony of the wrath of God so we could take hold of eternal life.'
      }
    },
    3: {
      book: '1 Kings',
      chapter: 2,
      verseRef: '1 KINGS 2:1-12',
      title: 'Show Yourself a Man',
      context: 'David, the giant-slayer and man after God\'s own heart, is on his deathbed. His reign was marked by incredible triumphs but also devastating moral failures. The kingdom is transitioning to Solomon in a fragile political climate, with rival factions vying for the throne. Before David gives Solomon the tactical political hits he needs to carry out, he establishes the absolute baseline for the Davidic covenant: success isn\'t about military might; it\'s about uncompromising obedience to the Word of God.',
      himConnection: 'Think about the legacy you are leaving. If you were taking your final breaths, what would you tell your 2.0s? David didn\'t tell Solomon to diversify his portfolio or build a bigger palace. He told him to step up, be a man, and follow the Lord. In F3, the Third F (Faith) is what gives the First F (Fitness) and Second F (Fellowship) ultimate meaning. A true leader in his household doesn\'t just provide food and shelter; he provides a spiritual true north. If you want your region, your AO, and your home to thrive, it starts with your personal obedience in the dark when no one else is watching.',
      wordStudy: {
        originalWord: 'חָזַק',
        transliteration: 'Chazaq',
        meaning: 'To strengthen, prevail, harden, be courageous.',
        breakdown: 'This Hebrew word implies grabbing hold of something tightly or binding something securely. It is the same word used when God told Joshua to "be strong." The implication is an immovable resolve. For the Christian, our resolve is rooted in the Ultimate Son of David—Jesus Christ. Solomon eventually failed to keep this charge; his heart was led astray by foreign wives and idols. But Jesus, the true and better King, kept the Law perfectly. He was strong, He prevailed, and He showed Himself a man by submitting completely to the Father’s will, even to the point of death.'
      }
    },
    4: {
      book: 'Psalms',
      chapter: 1,
      verseRef: 'PSALM 1:1-6',
      title: 'Planted by the Streams',
      context: 'Psalm 1 serves as the gatekeeper and introduction to the entire Book of Psalms. It was likely placed here deliberately by the compiler of the Psalms (possibly Ezra) after the exile. It functions as a wisdom text, laying down a foundational truth before the reader encounters the emotional highs and lows of the remaining 149 psalms. The agricultural imagery of trees, rivers, and threshing floors would have been instantly resonant with the ancient Israelites.',
      himConnection: 'Psalm 1 is the ultimate DRP for your mind. You are constantly being discipled by something—whether it\'s the news, social media, your coworkers, or the culture. If you walk, stand, and sit in the counsel of the world, your roots are going to rot, and you\'ll become a Sad Clown. But if you delight in God\'s instruction, you become like an oak tree planted by an endless water source. When the storms of life hit—when the job is lost, when the marriage gets tough, when the health fails—a deeply rooted HIM doesn\'t get blown over. His leaves don\'t wither because his source of life isn\'t dependent on his circumstances.',
      wordStudy: {
        originalWord: 'הָגָה',
        transliteration: 'Hagah',
        meaning: 'To moan, growl, utter, speak, or meditate.',
        breakdown: 'Meditation in Eastern religions often means emptying the mind. But Biblical meditation (Hagah) means filling the mind. The word literally implies a low murmuring sound, like a lion growling over its prey (Isaiah 31:4) or a dove cooing. It means you are chewing on the text, muttering it under your breath, and digesting it all day long. Jesus is the ultimate fulfillment of Psalm 1. He is the Tree of Life. He never walked in the counsel of the wicked, and His delight was perfectly in the will of His Father. By abiding in Him, His roots become our roots.'
      }
    },
    5: {
      book: 'Titus',
      chapter: 2,
      verseRef: 'TITUS 2:1-15',
      title: 'Model of Good Works',
      context: 'The island of Crete was notorious in the ancient world for its terrible morals. One of their own poets said, "Cretans are always liars, evil beasts, lazy gluttons" (Titus 1:12). Paul left Titus there to organize the messy, immature house churches. The overarching theme of chapter 2 is that right belief (sound doctrine) must result in right behavior. The church in Crete needed to stand out in stark contrast to their corrupt culture by living lives of such radical integrity that the gospel became attractive to their neighbors.',
      himConnection: 'As a leader in F3, your credibility is everything. You can be the fastest runner at the AO, but if you are a lazy glutton at home, or if you lack self-control with your words and your wallet, your leadership is hollow. Paul calls the men to be sober-minded, dignified, and self-controlled. This is the essence of being a High Impact Man. You are called to be a model of good works. When the FNGs of life and faith look at you, they should see a man whose private life matches his public persona. The grace of God isn\'t a license to slack off; it is the fuel that trains us to renounce ungodliness.',
      wordStudy: {
        originalWord: 'σωφρονέω',
        transliteration: 'Sophroneo',
        meaning: 'To be of sound mind, self-controlled, temperate.',
        breakdown: 'This word family appears multiple times in Titus. It describes a mind that is reined in, disciplined, and free from the intoxicating influences of the world. It’s the opposite of being impulsive or reactionary. In a culture that celebrates doing whatever feels good in the moment, self-control is a revolutionary act. We can only achieve this because of verses 11-14: the grace of God has appeared in Jesus Christ, who gave Himself to redeem us and purify for Himself a people who are "zealous for good works." Our self-control is a response to His ultimate sacrifice.'
      }
    },
    6: {
      book: 'Proverbs',
      chapter: 3,
      verseRef: 'PROVERBS 3:1-12',
      title: 'Trust with All Your Heart',
      context: 'The book of Proverbs was primarily written by King Solomon as a manual for young men (likely his sons or young nobles) on how to live skillfully in God\'s world. Chapters 1-9 take the form of fatherly talks. This specific passage contains some of the most famous verses in the Bible (v. 5-6), but reading them in their fuller context shows that trusting God impacts every area of a man\'s life: his physical health (v. 8), his financial wallet (v. 9), and how he handles adversity and correction (v. 11-12).',
      himConnection: 'Men are hardwired to want to fix things. When a problem arises at work, in our marriage, or with our kids, our default setting is to lean on our own understanding. We strategize, we plan, and we try to muscle our way through. True godliness flips that script. A HIM recognizes that his own intellect is flawed and limited. Acknowledging God in all your ways means taking your hands off the steering wheel and submitting your plans to His authority. Furthermore, when the Lord disciplines you (v. 11-12), a HIM doesn\'t throw a pity party or get defensive. He takes the feedback, adjusts his course, and recognizes it as the loving correction of a Father.',
      wordStudy: {
        originalWord: 'בָּטַח',
        transliteration: 'Batach',
        meaning: 'To trust, feel secure, be confident, or fall face down.',
        breakdown: 'The root idea behind this Hebrew word for "trust" is to throw oneself down upon a support, like a wrestler falling backwards, knowing someone is there to catch him. It’s a picture of total helplessness without the object of trust. We are to trust the Lord with "all our heart"—the center of our will and decision-making. Jesus demonstrated this ultimate trust in the Garden of Gethsemane. Faced with the unimaginable horror of the cross, His human understanding would scream to run. Yet, He prayed, "Not my will, but yours, be done." He leaned entirely on the Father, securing our salvation.'
      }
    },
    7: {
      book: 'Ephesians',
      chapter: 5,
      verseRef: 'EPHESIANS 5:15-33',
      title: 'Sacrificial Headship',
      context: 'Ephesians is a letter written by Paul from a Roman prison. The first three chapters explain the glorious theology of what God has done through Christ. The last three chapters explain how Christians should walk as a result. In the Greco-Roman world, the "paterfamilias" (the male head of the household) held absolute legal power over his wife, children, and slaves. He could do whatever he wanted. Paul steps into that patriarchal culture and drops a bomb: he tells husbands to crucify their selfishness and lay down their lives for their brides.',
      himConnection: 'In F3, we believe that a leader is a servant first. If you are married, your M (wife) is your primary ministry and your most important Shield Lock. The world tells men that leadership is about being the boss, making the demands, and getting your way. The Gospel says that leadership is grabbing a towel and washing feet. It means you take the emotional hit, you initiate reconciliation, and you prioritize her flourishing over your own hobbies and comfort. You give yourself up for her. It’s the hardest, most grueling, and most glorious calling a man can have.',
      wordStudy: {
        originalWord: 'ἀγαπάω',
        transliteration: 'Agapao',
        meaning: 'To love unconditionally, sacrificially, and intentionally.',
        breakdown: 'In Greek, there are several words for love, but Paul uses Agape. This isn\'t a feeling; it’s an action of the will. It is a choice to seek the highest good of another person, regardless of their response and regardless of the cost to yourself. Paul directly connects this to Jesus. How did Christ love the church? He didn\'t just write us a poem; He was nailed to a piece of wood. He took our sin, our shame, and our punishment so we could be made holy and blameless. A godly man\'s love for his family is meant to be a living, breathing billboard of the Gospel.'
      }
    }
  }
};