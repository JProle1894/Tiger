/* Original, reflective summaries of the traditional 78-card tarot deck. No external service is required. */
const TAROT_DECK = [
  {
    "id": "major-the-fool",
    "name": "The Fool",
    "arcana": "major",
    "suit": "Major Arcana",
    "upright": "New beginnings, curiosity and the courage to try without knowing every answer.",
    "reversed": "Rushing ahead or letting fear stop a fresh start. Check your footing before you leap.",
    "prompt": "Where could I be a little more open to possibility?"
  },
  {
    "id": "major-the-magician",
    "name": "The Magician",
    "arcana": "major",
    "suit": "Major Arcana",
    "upright": "You already have skills, resources and agency to make a meaningful start.",
    "reversed": "Scattered energy or self-doubt may be hiding what you can do.",
    "prompt": "What strength do I have available right now?"
  },
  {
    "id": "major-the-high-priestess",
    "name": "The High Priestess",
    "arcana": "major",
    "suit": "Major Arcana",
    "upright": "Inner knowing, quiet observation and listening beneath the noise.",
    "reversed": "A nudge to reconnect with intuition rather than overthinking or avoiding the truth.",
    "prompt": "What have I been sensing but not acknowledging?"
  },
  {
    "id": "major-the-empress",
    "name": "The Empress",
    "arcana": "major",
    "suit": "Major Arcana",
    "upright": "Nurture, creativity, abundance and caring for body and surroundings.",
    "reversed": "You may be giving too much outwardly and forgetting your own needs.",
    "prompt": "How can I make space for rest and nourishment?"
  },
  {
    "id": "major-the-emperor",
    "name": "The Emperor",
    "arcana": "major",
    "suit": "Major Arcana",
    "upright": "Healthy structure, clear boundaries and steady leadership.",
    "reversed": "Rigid expectations or a need for control could be squeezing out flexibility.",
    "prompt": "Where would a kind boundary help me?"
  },
  {
    "id": "major-the-hierophant",
    "name": "The Hierophant",
    "arcana": "major",
    "suit": "Major Arcana",
    "upright": "Tradition, learning and finding support in shared wisdom or practice.",
    "reversed": "Questioning an inherited rule can make room for your own values.",
    "prompt": "Which rituals genuinely support me?"
  },
  {
    "id": "major-the-lovers",
    "name": "The Lovers",
    "arcana": "major",
    "suit": "Major Arcana",
    "upright": "Connection, alignment and making choices that reflect what matters to you.",
    "reversed": "A mismatch between actions and values may need honest attention.",
    "prompt": "What choice feels most aligned with my values?"
  },
  {
    "id": "major-the-chariot",
    "name": "The Chariot",
    "arcana": "major",
    "suit": "Major Arcana",
    "upright": "Determination, direction and moving ahead with focus.",
    "reversed": "Trying to force progress may be draining your energy; adjust your course.",
    "prompt": "What deserves my focus today?"
  },
  {
    "id": "major-strength",
    "name": "Strength",
    "arcana": "major",
    "suit": "Major Arcana",
    "upright": "Gentle courage, compassion and calm confidence under pressure.",
    "reversed": "Self-criticism or depleted energy asks for tenderness rather than force.",
    "prompt": "How can I be brave and kind to myself?"
  },
  {
    "id": "major-the-hermit",
    "name": "The Hermit",
    "arcana": "major",
    "suit": "Major Arcana",
    "upright": "Solitude, reflection and wisdom found in slowing down.",
    "reversed": "Too much withdrawal or too little quiet may be affecting your clarity.",
    "prompt": "What might I learn in a few quiet minutes?"
  },
  {
    "id": "major-wheel-of-fortune",
    "name": "Wheel of Fortune",
    "arcana": "major",
    "suit": "Major Arcana",
    "upright": "Cycles change; stay flexible and notice opportunities to adapt.",
    "reversed": "Resistance to uncertainty may make change feel heavier.",
    "prompt": "What can I influence, and what can I release?"
  },
  {
    "id": "major-justice",
    "name": "Justice",
    "arcana": "major",
    "suit": "Major Arcana",
    "upright": "Fairness, honesty, accountability and making balanced decisions.",
    "reversed": "An imbalance or avoided conversation may deserve a thoughtful look.",
    "prompt": "What would a fair choice look like?"
  },
  {
    "id": "major-the-hanged-man",
    "name": "The Hanged Man",
    "arcana": "major",
    "suit": "Major Arcana",
    "upright": "Pausing, surrendering and seeing a familiar issue differently.",
    "reversed": "Feeling stuck may call for a new perspective rather than more effort.",
    "prompt": "What changes when I look at this another way?"
  },
  {
    "id": "major-death",
    "name": "Death",
    "arcana": "major",
    "suit": "Major Arcana",
    "upright": "A chapter ends so something else can grow; transformation can be gentle.",
    "reversed": "Holding tightly to what has passed may be making transition harder.",
    "prompt": "What am I ready to leave behind?"
  },
  {
    "id": "major-temperance",
    "name": "Temperance",
    "arcana": "major",
    "suit": "Major Arcana",
    "upright": "Balance, moderation, patience and making different parts of life work together.",
    "reversed": "Too much of one thing may be pushing something important aside.",
    "prompt": "Where could I invite more balance?"
  },
  {
    "id": "major-the-devil",
    "name": "The Devil",
    "arcana": "major",
    "suit": "Major Arcana",
    "upright": "Notice habits, attachments or fears that keep you feeling boxed in.",
    "reversed": "Awareness can help loosen an old pattern and restore choice.",
    "prompt": "Which pattern am I ready to question?"
  },
  {
    "id": "major-the-tower",
    "name": "The Tower",
    "arcana": "major",
    "suit": "Major Arcana",
    "upright": "An unexpected shake-up can reveal what is no longer stable or useful.",
    "reversed": "Avoiding a necessary change might be keeping you on edge.",
    "prompt": "What can I rebuild with greater honesty?"
  },
  {
    "id": "major-the-star",
    "name": "The Star",
    "arcana": "major",
    "suit": "Major Arcana",
    "upright": "Hope, renewal and trust in small steps after a demanding time.",
    "reversed": "A tired spirit may need practical care before optimism feels possible.",
    "prompt": "What would replenishment look like today?"
  },
  {
    "id": "major-the-moon",
    "name": "The Moon",
    "arcana": "major",
    "suit": "Major Arcana",
    "upright": "Uncertainty, imagination and emotions not yet fully understood.",
    "reversed": "Fog may be lifting, or anxious assumptions may need checking.",
    "prompt": "What is fact, and what is simply a feeling?"
  },
  {
    "id": "major-the-sun",
    "name": "The Sun",
    "arcana": "major",
    "suit": "Major Arcana",
    "upright": "Warmth, joy, playfulness and clarity; notice what is going well.",
    "reversed": "Pressure to be happy all the time can dull real joy.",
    "prompt": "Where can I let myself enjoy the moment?"
  },
  {
    "id": "major-judgement",
    "name": "Judgement",
    "arcana": "major",
    "suit": "Major Arcana",
    "upright": "Reflection, forgiveness and choosing how to move forward.",
    "reversed": "Harsh self-judgement may be keeping you tied to old stories.",
    "prompt": "What am I learning about who I want to be?"
  },
  {
    "id": "major-the-world",
    "name": "The World",
    "arcana": "major",
    "suit": "Major Arcana",
    "upright": "Completion, integration and appreciation of the journey.",
    "reversed": "You might be overlooking a milestone or delaying a meaningful ending.",
    "prompt": "What progress deserves recognition?"
  },
  {
    "id": "wands-ace",
    "name": "Ace of Wands",
    "arcana": "minor",
    "suit": "Wands",
    "upright": "A creative spark or bold new idea wants a little room to grow.",
    "reversed": "Inspiration feels delayed; begin with one small, doable action.",
    "prompt": "Where might I channel my creative energy today?"
  },
  {
    "id": "wands-two",
    "name": "Two of Wands",
    "arcana": "minor",
    "suit": "Wands",
    "upright": "You're looking ahead and deciding which opportunity to pursue.",
    "reversed": "Planning without action can become another way of hesitating.",
    "prompt": "Where might I channel my creative energy today?"
  },
  {
    "id": "wands-three",
    "name": "Three of Wands",
    "arcana": "minor",
    "suit": "Wands",
    "upright": "Early effort is taking shape; make space for growth and wider horizons.",
    "reversed": "A delay invites patience and a rethink of your next move.",
    "prompt": "Where might I channel my creative energy today?"
  },
  {
    "id": "wands-four",
    "name": "Four of Wands",
    "arcana": "minor",
    "suit": "Wands",
    "upright": "Celebrate community, belonging and the comfort of shared milestones.",
    "reversed": "A sense of home or celebration may need some attention.",
    "prompt": "Where might I channel my creative energy today?"
  },
  {
    "id": "wands-five",
    "name": "Five of Wands",
    "arcana": "minor",
    "suit": "Wands",
    "upright": "Difference of opinion can be energising when handled with respect.",
    "reversed": "Conflict fatigue is real; not every battle needs your energy.",
    "prompt": "Where might I channel my creative energy today?"
  },
  {
    "id": "wands-six",
    "name": "Six of Wands",
    "arcana": "minor",
    "suit": "Wands",
    "upright": "Recognition, encouragement and a moment of well-earned pride.",
    "reversed": "Relying on outside applause may be masking your own progress.",
    "prompt": "Where might I channel my creative energy today?"
  },
  {
    "id": "wands-seven",
    "name": "Seven of Wands",
    "arcana": "minor",
    "suit": "Wands",
    "upright": "Stand by what matters to you without losing your flexibility.",
    "reversed": "Defensiveness may be making everything feel like a fight.",
    "prompt": "Where might I channel my creative energy today?"
  },
  {
    "id": "wands-eight",
    "name": "Eight of Wands",
    "arcana": "minor",
    "suit": "Wands",
    "upright": "Momentum is building; messages or opportunities may arrive quickly.",
    "reversed": "A slowdown might help you check details before rushing.",
    "prompt": "Where might I channel my creative energy today?"
  },
  {
    "id": "wands-nine",
    "name": "Nine of Wands",
    "arcana": "minor",
    "suit": "Wands",
    "upright": "Your resilience is showing, even when you're tired.",
    "reversed": "Constantly bracing for trouble can leave no room for rest.",
    "prompt": "Where might I channel my creative energy today?"
  },
  {
    "id": "wands-ten",
    "name": "Ten of Wands",
    "arcana": "minor",
    "suit": "Wands",
    "upright": "Too many responsibilities are weighing on your shoulders.",
    "reversed": "Share the load instead of proving you can carry everything.",
    "prompt": "Where might I channel my creative energy today?"
  },
  {
    "id": "wands-page",
    "name": "Page of Wands",
    "arcana": "minor",
    "suit": "Wands",
    "upright": "Curiosity, experimentation and an adventurous outlook are calling.",
    "reversed": "A fear of looking inexperienced may be blocking a first attempt.",
    "prompt": "Where might I channel my creative energy today?"
  },
  {
    "id": "wands-knight",
    "name": "Knight of Wands",
    "arcana": "minor",
    "suit": "Wands",
    "upright": "Passion and confidence can help you make a bold move.",
    "reversed": "Impulsiveness may need a pause before you commit.",
    "prompt": "Where might I channel my creative energy today?"
  },
  {
    "id": "wands-queen",
    "name": "Queen of Wands",
    "arcana": "minor",
    "suit": "Wands",
    "upright": "Expressive confidence, warmth and creative leadership shine here.",
    "reversed": "Comparison or self-doubt may be dimming your natural spark.",
    "prompt": "Where might I channel my creative energy today?"
  },
  {
    "id": "wands-king",
    "name": "King of Wands",
    "arcana": "minor",
    "suit": "Wands",
    "upright": "Big-picture vision and thoughtful initiative can inspire others.",
    "reversed": "Be careful that certainty doesn't turn into stubbornness.",
    "prompt": "Where might I channel my creative energy today?"
  },
  {
    "id": "cups-ace",
    "name": "Ace of Cups",
    "arcana": "minor",
    "suit": "Cups",
    "upright": "Emotional openness, affection and a fresh sense of connection.",
    "reversed": "Feelings may need care and expression rather than suppression.",
    "prompt": "What do my feelings need me to notice today?"
  },
  {
    "id": "cups-two",
    "name": "Two of Cups",
    "arcana": "minor",
    "suit": "Cups",
    "upright": "Mutual support, honest conversation and meaningful connection.",
    "reversed": "A relationship or agreement may need clearer communication.",
    "prompt": "What do my feelings need me to notice today?"
  },
  {
    "id": "cups-three",
    "name": "Three of Cups",
    "arcana": "minor",
    "suit": "Cups",
    "upright": "Friendship, support and shared joy deserve to be celebrated.",
    "reversed": "Social overload or feeling left out may call for a reset.",
    "prompt": "What do my feelings need me to notice today?"
  },
  {
    "id": "cups-four",
    "name": "Four of Cups",
    "arcana": "minor",
    "suit": "Cups",
    "upright": "Disinterest or emotional fatigue may be narrowing your view.",
    "reversed": "A fresh option may be worth noticing with an open mind.",
    "prompt": "What do my feelings need me to notice today?"
  },
  {
    "id": "cups-five",
    "name": "Five of Cups",
    "arcana": "minor",
    "suit": "Cups",
    "upright": "Disappointment is real, but something valuable may still remain.",
    "reversed": "Healing may involve gently releasing regret or old hurt.",
    "prompt": "What do my feelings need me to notice today?"
  },
  {
    "id": "cups-six",
    "name": "Six of Cups",
    "arcana": "minor",
    "suit": "Cups",
    "upright": "Sweet memories, kindness and familiar comforts can soothe.",
    "reversed": "Nostalgia may be making it difficult to enjoy the present.",
    "prompt": "What do my feelings need me to notice today?"
  },
  {
    "id": "cups-seven",
    "name": "Seven of Cups",
    "arcana": "minor",
    "suit": "Cups",
    "upright": "Many tempting possibilities can cloud what you truly want.",
    "reversed": "Move from daydreaming toward a grounded choice.",
    "prompt": "What do my feelings need me to notice today?"
  },
  {
    "id": "cups-eight",
    "name": "Eight of Cups",
    "arcana": "minor",
    "suit": "Cups",
    "upright": "Walking away from what no longer nourishes you takes courage.",
    "reversed": "You may be postponing a necessary emotional decision.",
    "prompt": "What do my feelings need me to notice today?"
  },
  {
    "id": "cups-nine",
    "name": "Nine of Cups",
    "arcana": "minor",
    "suit": "Cups",
    "upright": "Contentment, gratitude and simple pleasures are worth noticing.",
    "reversed": "An outward wish may not solve an inward need.",
    "prompt": "What do my feelings need me to notice today?"
  },
  {
    "id": "cups-ten",
    "name": "Ten of Cups",
    "arcana": "minor",
    "suit": "Cups",
    "upright": "Emotional fulfilment can grow through care, family and community.",
    "reversed": "Unspoken expectations might be disturbing a sense of harmony.",
    "prompt": "What do my feelings need me to notice today?"
  },
  {
    "id": "cups-page",
    "name": "Page of Cups",
    "arcana": "minor",
    "suit": "Cups",
    "upright": "A tender message, new feeling or creative daydream can surprise you.",
    "reversed": "Emotional sensitivity may need patience and reassurance.",
    "prompt": "What do my feelings need me to notice today?"
  },
  {
    "id": "cups-knight",
    "name": "Knight of Cups",
    "arcana": "minor",
    "suit": "Cups",
    "upright": "Lead with sincerity, imagination and a willingness to connect.",
    "reversed": "Idealising a situation can hide what it really needs.",
    "prompt": "What do my feelings need me to notice today?"
  },
  {
    "id": "cups-queen",
    "name": "Queen of Cups",
    "arcana": "minor",
    "suit": "Cups",
    "upright": "Compassion and emotional intelligence are strengths, not weaknesses.",
    "reversed": "Protect your own emotional space while caring for others.",
    "prompt": "What do my feelings need me to notice today?"
  },
  {
    "id": "cups-king",
    "name": "King of Cups",
    "arcana": "minor",
    "suit": "Cups",
    "upright": "Steady empathy and emotional maturity help you meet complexity.",
    "reversed": "Bottled-up feelings may be asking for an honest outlet.",
    "prompt": "What do my feelings need me to notice today?"
  },
  {
    "id": "swords-ace",
    "name": "Ace of Swords",
    "arcana": "minor",
    "suit": "Swords",
    "upright": "A clear insight or honest conversation can cut through confusion.",
    "reversed": "A muddled plan needs more information before decisive action.",
    "prompt": "Which thought deserves a kinder or clearer perspective?"
  },
  {
    "id": "swords-two",
    "name": "Two of Swords",
    "arcana": "minor",
    "suit": "Swords",
    "upright": "A difficult choice needs calm thought and honest priorities.",
    "reversed": "Avoiding the decision entirely may be adding to the tension.",
    "prompt": "Which thought deserves a kinder or clearer perspective?"
  },
  {
    "id": "swords-three",
    "name": "Three of Swords",
    "arcana": "minor",
    "suit": "Swords",
    "upright": "Painful feelings deserve acknowledgement and support.",
    "reversed": "Healing may be starting, even if it isn't tidy or quick.",
    "prompt": "Which thought deserves a kinder or clearer perspective?"
  },
  {
    "id": "swords-four",
    "name": "Four of Swords",
    "arcana": "minor",
    "suit": "Swords",
    "upright": "Rest, mental space and recovery are productive in their own way.",
    "reversed": "Burnout signals that your mind needs a gentler pace.",
    "prompt": "Which thought deserves a kinder or clearer perspective?"
  },
  {
    "id": "swords-five",
    "name": "Five of Swords",
    "arcana": "minor",
    "suit": "Swords",
    "upright": "Winning an argument may not be worth losing connection.",
    "reversed": "Step away from conflict that is taking more than it gives.",
    "prompt": "Which thought deserves a kinder or clearer perspective?"
  },
  {
    "id": "swords-six",
    "name": "Six of Swords",
    "arcana": "minor",
    "suit": "Swords",
    "upright": "A gradual transition can bring relief and a new perspective.",
    "reversed": "Moving on may be hard, but staying stuck has a cost.",
    "prompt": "Which thought deserves a kinder or clearer perspective?"
  },
  {
    "id": "swords-seven",
    "name": "Seven of Swords",
    "arcana": "minor",
    "suit": "Swords",
    "upright": "Strategy and discretion matter, but be honest with yourself.",
    "reversed": "Secrets or shortcuts could be creating more stress.",
    "prompt": "Which thought deserves a kinder or clearer perspective?"
  },
  {
    "id": "swords-eight",
    "name": "Eight of Swords",
    "arcana": "minor",
    "suit": "Swords",
    "upright": "A fearful story may be making options seem smaller than they are.",
    "reversed": "Question the limits you've assumed and ask for support.",
    "prompt": "Which thought deserves a kinder or clearer perspective?"
  },
  {
    "id": "swords-nine",
    "name": "Nine of Swords",
    "arcana": "minor",
    "suit": "Swords",
    "upright": "Worries can grow loud at night; meet them with care and reality checks.",
    "reversed": "Anxiety may ease when feelings are shared instead of hidden.",
    "prompt": "Which thought deserves a kinder or clearer perspective?"
  },
  {
    "id": "swords-ten",
    "name": "Ten of Swords",
    "arcana": "minor",
    "suit": "Swords",
    "upright": "An exhausting chapter may be reaching its ending.",
    "reversed": "Recovery takes time; you don't have to rush the next beginning.",
    "prompt": "Which thought deserves a kinder or clearer perspective?"
  },
  {
    "id": "swords-page",
    "name": "Page of Swords",
    "arcana": "minor",
    "suit": "Swords",
    "upright": "Curiosity and clear questions help you learn the whole story.",
    "reversed": "Watch for overthinking, gossip or a rush to conclusions.",
    "prompt": "Which thought deserves a kinder or clearer perspective?"
  },
  {
    "id": "swords-knight",
    "name": "Knight of Swords",
    "arcana": "minor",
    "suit": "Swords",
    "upright": "Quick thinking and decisive action bring movement.",
    "reversed": "Slow down enough to notice people and consequences.",
    "prompt": "Which thought deserves a kinder or clearer perspective?"
  },
  {
    "id": "swords-queen",
    "name": "Queen of Swords",
    "arcana": "minor",
    "suit": "Swords",
    "upright": "Clear boundaries, honesty and thoughtful independence serve you.",
    "reversed": "Being too hard on yourself can turn discernment into judgement.",
    "prompt": "Which thought deserves a kinder or clearer perspective?"
  },
  {
    "id": "swords-king",
    "name": "King of Swords",
    "arcana": "minor",
    "suit": "Swords",
    "upright": "Reason, fairness and calm analysis bring useful perspective.",
    "reversed": "Cold certainty can obscure important emotional context.",
    "prompt": "Which thought deserves a kinder or clearer perspective?"
  },
  {
    "id": "pentacles-ace",
    "name": "Ace of Pentacles",
    "arcana": "minor",
    "suit": "Pentacles",
    "upright": "A practical opportunity offers a foundation for growth and stability.",
    "reversed": "A promising idea may need more preparation before investment.",
    "prompt": "What small practical action will support me today?"
  },
  {
    "id": "pentacles-two",
    "name": "Two of Pentacles",
    "arcana": "minor",
    "suit": "Pentacles",
    "upright": "Flexible routines can help you juggle changing priorities.",
    "reversed": "Too many spinning plates may be asking for a simpler plan.",
    "prompt": "What small practical action will support me today?"
  },
  {
    "id": "pentacles-three",
    "name": "Three of Pentacles",
    "arcana": "minor",
    "suit": "Pentacles",
    "upright": "Skill grows through collaboration, practice and constructive feedback.",
    "reversed": "A lack of teamwork or clarity may be slowing things down.",
    "prompt": "What small practical action will support me today?"
  },
  {
    "id": "pentacles-four",
    "name": "Four of Pentacles",
    "arcana": "minor",
    "suit": "Pentacles",
    "upright": "Security and sensible boundaries can be comforting.",
    "reversed": "Holding on too tightly may stop you enjoying what you have.",
    "prompt": "What small practical action will support me today?"
  },
  {
    "id": "pentacles-five",
    "name": "Five of Pentacles",
    "arcana": "minor",
    "suit": "Pentacles",
    "upright": "A period of scarcity can feel lonely; support may be closer than it seems.",
    "reversed": "Let yourself accept help and notice resources around you.",
    "prompt": "What small practical action will support me today?"
  },
  {
    "id": "pentacles-six",
    "name": "Six of Pentacles",
    "arcana": "minor",
    "suit": "Pentacles",
    "upright": "Give and receive with generosity, fairness and good boundaries.",
    "reversed": "An unequal exchange may need a more honest balance.",
    "prompt": "What small practical action will support me today?"
  },
  {
    "id": "pentacles-seven",
    "name": "Seven of Pentacles",
    "arcana": "minor",
    "suit": "Pentacles",
    "upright": "Patient work takes time to bear fruit; check your progress.",
    "reversed": "Frustration can tempt you to abandon something too early.",
    "prompt": "What small practical action will support me today?"
  },
  {
    "id": "pentacles-eight",
    "name": "Eight of Pentacles",
    "arcana": "minor",
    "suit": "Pentacles",
    "upright": "Craft, repetition and quiet dedication are building real ability.",
    "reversed": "Perfectionism may be stealing the joy from learning.",
    "prompt": "What small practical action will support me today?"
  },
  {
    "id": "pentacles-nine",
    "name": "Nine of Pentacles",
    "arcana": "minor",
    "suit": "Pentacles",
    "upright": "Independence, comfort and the rewards of consistent effort shine.",
    "reversed": "Remember that achievement doesn't have to mean isolation.",
    "prompt": "What small practical action will support me today?"
  },
  {
    "id": "pentacles-ten",
    "name": "Ten of Pentacles",
    "arcana": "minor",
    "suit": "Pentacles",
    "upright": "Long-term security can grow through shared care and foundations.",
    "reversed": "Inherited expectations may need updating for your life now.",
    "prompt": "What small practical action will support me today?"
  },
  {
    "id": "pentacles-page",
    "name": "Page of Pentacles",
    "arcana": "minor",
    "suit": "Pentacles",
    "upright": "A learner's mindset can turn a practical goal into a plan.",
    "reversed": "Dreams need a manageable first step, not endless preparation.",
    "prompt": "What small practical action will support me today?"
  },
  {
    "id": "pentacles-knight",
    "name": "Knight of Pentacles",
    "arcana": "minor",
    "suit": "Pentacles",
    "upright": "Reliability, patience and steady routines can carry you far.",
    "reversed": "A rigid routine may need refreshing so it remains sustainable.",
    "prompt": "What small practical action will support me today?"
  },
  {
    "id": "pentacles-queen",
    "name": "Queen of Pentacles",
    "arcana": "minor",
    "suit": "Pentacles",
    "upright": "Practical care, resourcefulness and warmth create a nurturing space.",
    "reversed": "Being everyone's caretaker may be leaving too little for you.",
    "prompt": "What small practical action will support me today?"
  },
  {
    "id": "pentacles-king",
    "name": "King of Pentacles",
    "arcana": "minor",
    "suit": "Pentacles",
    "upright": "Wise stewardship and grounded confidence support long-term plans.",
    "reversed": "Status or control may be crowding out what really matters.",
    "prompt": "What small practical action will support me today?"
  }
];
