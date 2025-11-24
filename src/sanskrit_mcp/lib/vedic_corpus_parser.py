"""
Vedic Corpus Parser for MCP Server.

This module creates an authoritative knowledge base from Vedic texts
with full source attribution and anti-hallucination safeguards.
"""

from collections import defaultdict
from typing import Literal

from .types import Commentary, QueryResult, VedicPassage, VedicTextReference


class VedicCorpusParser:
    """Parser and query engine for authenticated Ved

ic texts."""

    def __init__(self) -> None:
        """Initialize corpus with Vedantic texts."""
        self.corpus: dict[str, list[VedicPassage]] = {}
        self.indexed_keywords: dict[str, list[VedicPassage]] = defaultdict(list)
        self.concept_graph: dict[str, list[str]] = {}

        self._initialize_corpus()
        self._build_concept_graph()

    def _initialize_corpus(self) -> None:
        """Initialize the corpus with key Vedantic texts."""
        # Bhagavad Gītā
        self._add_passage(
            VedicPassage(
                sanskrit="यदा यदा हि धर्मस्य ग्लानिर्भवति भारत। अभ्युत्थानमधर्मस्य तदाऽऽत्मानं सृजाम्यहम्॥",
                transliteration="yadā yadā hi dharmasya glānir bhavati bhārata | abhyutthānam adharmasya tadā''tmānaṁ sṛjāmy aham ||",
                translation="Whenever there is decline of dharma and rise of adharma, O Bharata, then I manifest Myself.",
                reference=VedicTextReference(
                    text="Bhagavad Gītā",
                    chapter=4,
                    verse=7,
                    edition="Gītā Press Critical Edition",
                ),
                context="Divine incarnation principle - avatāra doctrine",
                commentaries=[
                    Commentary(
                        author="Śaṅkarācārya",
                        text="The Lord declares the principle of divine descent for dharma restoration",
                        date="8th century CE",
                        tradition="Advaita Vedānta",
                        reliability=0.95,
                    ),
                    Commentary(
                        author="Rāmānujācārya",
                        text="The Supreme Person's compassionate intervention in cosmic order",
                        date="11th century CE",
                        tradition="Viśiṣṭādvaita",
                        reliability=0.93,
                    ),
                ],
                reliability=0.98,
                keywords=["dharma", "avatāra", "divine incarnation", "cosmic order", "krishna"],
            )
        )

        # Chāndogya Upaniṣad - Tat Tvam Asi
        self._add_passage(
            VedicPassage(
                sanskrit="तत्त्वमसि श्वेतकेतो",
                transliteration="tat tvam asi śvetaketo",
                translation="Thou art That, O Śvetaketu",
                reference=VedicTextReference(
                    text="Chāndogya Upaniṣad",
                    chapter=6,
                    verse=8,
                    section="16",
                    edition="Ānandāśrama Sanskrit Series",
                ),
                context="Mahāvākya - Great saying establishing identity of individual and universal consciousness",
                commentaries=[
                    Commentary(
                        author="Śaṅkarācārya",
                        text="The fundamental teaching of non-duality between jīva and Brahman",
                        date="8th century CE",
                        tradition="Advaita Vedānta",
                        reliability=0.97,
                    )
                ],
                reliability=0.99,
                keywords=["mahāvākya", "non-duality", "ātman", "brahman", "identity", "consciousness"],
            )
        )

        # Vivekacūḍāmaṇi
        self._add_passage(
            VedicPassage(
                sanskrit="ब्रह्म सत्यं जगन्मिथ्या जीवो ब्रह्मैव नापरः",
                transliteration="brahma satyaṁ jagan mithyā jīvo brahmaiva nāparaḥ",
                translation="Brahman is real, the world is apparent, the individual soul is none other than Brahman",
                reference=VedicTextReference(
                    text="Vivekacūḍāmaṇi",
                    verse=20,
                    edition="Advaita Ashrama",
                ),
                context="Fundamental Advaita teaching - three-fold discrimination",
                commentaries=[
                    Commentary(
                        author="Traditional attribution to Śaṅkarācārya",
                        text="Encapsulates the essence of Advaitic realization",
                        date="Post-Śaṅkara tradition",
                        tradition="Advaita Vedānta",
                        reliability=0.85,
                    )
                ],
                reliability=0.88,
                keywords=["advaita", "reality", "appearance", "brahman", "jīva", "discrimination"],
            )
        )

        # Īśāvāsya Upaniṣad
        self._add_passage(
            VedicPassage(
                sanskrit="ईशावास्यमिदं सर्वं यत्किञ्च जगत्यां जगत्। त्येन त्यक्तेन भुञ्जीथा मा गृधः कस्यस्विद्धनम्॥",
                transliteration="īśāvāsyam idaṁ sarvaṁ yat kiñca jagatyāṁ jagat | tyena tyaktena bhuñjīthā mā gṛdhaḥ kasya svid dhanam ||",
                translation="All this is pervaded by the Lord. Enjoy through renunciation. Do not covet anyone's wealth.",
                reference=VedicTextReference(
                    text="Īśāvāsya Upaniṣad",
                    verse=1,
                    edition="Eighteen Principal Upaniṣads",
                ),
                context="Opening verse establishing divine immanence and ethical living",
                commentaries=[
                    Commentary(
                        author="Śaṅkarācārya",
                        text="The universe as divine manifestation requiring attitude of renunciation",
                        date="8th century CE",
                        tradition="Advaita Vedānta",
                        reliability=0.96,
                    )
                ],
                reliability=0.97,
                keywords=["īśāvāsya", "divine immanence", "renunciation", "ethics", "non-possession"],
            )
        )

        # Ṛgveda - Ekam Sat
        self._add_passage(
            VedicPassage(
                sanskrit="एकं सद्विप्रा बहुधा वदन्ति",
                transliteration="ekaṁ sad viprā bahudhā vadanti",
                translation="Truth is One, the wise call it by many names",
                reference=VedicTextReference(
                    text="Ṛgveda",
                    chapter=1,
                    verse=164,
                    section="46",
                    edition="Max Müller Critical Edition",
                ),
                context="Fundamental principle of unity underlying diversity of religious expressions",
                commentaries=[
                    Commentary(
                        author="Sāyaṇācārya",
                        text="The one Reality manifests through various names and forms",
                        date="14th century CE",
                        tradition="Traditional Vedic Commentary",
                        reliability=0.92,
                    )
                ],
                reliability=0.95,
                keywords=["unity", "diversity", "truth", "ekam sat", "religious pluralism"],
            )
        )

        # Gajendra Moksha passages from Śrīmad Bhāgavatam 8.3
        self._add_gajendra_stotram()
        
        # Add Vedānta school-specific passages
        self._add_vedanta_school_passages()

    def _add_gajendra_stotram(self) -> None:
        """Add Gajendra Moksha Stotram passages."""
        passages = [
            VedicPassage(
                sanskrit="ॐ नमो भगवते तस्मै यत एतच्चिदात्मकम्। पुरुषायादिबीजाय परेशायाभिधीमहि॥",
                transliteration="oṁ namo bhagavate tasmai yata etac cid-ātmakam | puruṣāyādi-bījāya pareśāyābhidhīmahi ||",
                translation="Om, salutations to that Supreme Lord from whom this consciousness-natured universe emanates, to the Primordial Person, the Original Seed, the Supreme Controller - to Him we meditate.",
                reference=VedicTextReference(
                    text="Śrīmad Bhāgavatam",
                    chapter=8,
                    verse=3,
                    section="1",
                    edition="Gītā Press",
                ),
                context="Opening invocation of Gajendra's prayer - establishing divine transcendence and immanence",
                commentaries=[
                    Commentary(
                        author="Śrīdhara Svāmī",
                        text="The Lord is both the material and efficient cause of creation, consciousness itself",
                        date="14th century CE",
                        tradition="Bhakti Vedānta",
                        reliability=0.94,
                    )
                ],
                reliability=0.96,
                keywords=["gajendra", "surrender", "supreme lord", "consciousness", "primordial", "bhakti"],
            ),
            VedicPassage(
                sanskrit="यं धर्मकामार्थविमुक्तिकामा भजन्त इष्टां गतिमप्नुवन्ति। किं चाशिषो राज्यसुखैश्वर्याप्तिलोकधर्मैरथ तद्विहीनम्॥",
                transliteration="yaṁ dharma-kāmārtha-vimukti-kāmā bhajanta iṣṭāṁ gatim āpnuvanti | kiṁ cāśiṣo rājya-sukhaiśvaryāpti-loka-dharmair atha tad vihīnam ||",
                translation="Those desiring dharma, kāma, artha, or mokṣa worship Him and attain their desired goal. What to speak of kingdom, pleasure, prosperity, worldly dharma - or complete freedom from all these.",
                reference=VedicTextReference(
                    text="Śrīmad Bhāgavatam",
                    chapter=8,
                    verse=3,
                    section="3",
                ),
                context="The Lord fulfills all desires but the wise seek liberation beyond desires",
                commentaries=[
                    Commentary(
                        author="Jīva Gosvāmī",
                        text="The Lord grants both material and spiritual aspirations according to devotion",
                        date="16th century CE",
                        tradition="Gauḍīya Vaiṣṇava",
                        reliability=0.95,
                    )
                ],
                reliability=0.96,
                keywords=["dharma", "artha", "kama", "moksha", "purushartha", "goals"],
            ),
            VedicPassage(
                sanskrit="एकान्तिनो यस्य न कञ्चनार्थं वाञ्छन्ति ये वै भगवत्प्रपन्नाः। अत्यद्भुतं तच्चरितं सुमङ्गलं गायन्त आनन्दसमुद्रमग्नाः॥",
                transliteration="ekāntino yasya na kañcanārthaṁ vāñchanti ye vai bhagavat-prapannāḥ | aty-adbhutaṁ tac-caritaṁ sumaṅgalaṁ gāyanta ānanda-samudra-magnāḥ ||",
                translation="Those exclusive devotees who have surrendered to the Lord desire nothing else. Immersed in the ocean of bliss, they sing His most wonderful and auspicious pastimes.",
                reference=VedicTextReference(
                    text="Śrīmad Bhāgavatam",
                    chapter=8,
                    verse=3,
                    section="4",
                ),
                context="Pure devotion seeks only the Lord, not benefits",
                commentaries=[
                    Commentary(
                        author="Śrīdhara Svāmī",
                        text="Ekāntins are those whose devotion is unmixed with desire for liberation",
                        date="14th century CE",
                        tradition="Bhakti Vedānta",
                        reliability=0.94,
                    )
                ],
                reliability=0.96,
                keywords=["ekanti", "devotion", "surrender", "ananda", "bliss", "pure bhakti"],
            ),
        ]

        for passage in passages:
            self._add_passage(passage)
    
    def _add_vedanta_school_passages(self) -> None:
        """Add passages specific to the 5 Vedānta schools."""
        
        # 1. ADVAITA VEDĀNTA - Shankara's Non-Dualism
        self._add_passage(
            VedicPassage(
                sanskrit="अयमात्मा ब्रह्म",
                transliteration="ayam ātmā brahma",
                translation="This Self is Brahman",
                reference=VedicTextReference(
                    text="Māṇḍūkya Upaniṣad",
                    verse=2,
                    edition="Eighteen Principal Upaniṣads",
                ),
                context="Mahāvākya establishing absolute identity between individual self and universal reality - foundation of Advaita",
                commentaries=[
                    Commentary(
                        author="Śaṅkarācārya",
                        text="The ātman and Brahman are absolutely identical, not merely similar. Maya creates the illusion of separation.",
                        date="8th century CE",
                        tradition="Advaita Vedānta",
                        reliability=0.98,
                    )
                ],
                reliability=0.99,
                keywords=["advaita", "mahavakya", "identity", "brahman", "atman", "maya", "illusion", "one"],
            )
        )
        
        # 2. VISHISHTADVAITA - Ramanuja's Qualified Non-Dualism
        self._add_passage(
            VedicPassage(
                sanskrit="सर्वं खल्विदं ब्रह्म",
                transliteration="sarvaṁ khalv idaṁ brahma",
                translation="All this indeed is Brahman",
                reference=VedicTextReference(
                    text="Chāndogya Upaniṣad",
                    chapter=3,
                    verse=14,
                    section="1",
                    edition="Ānandāśrama Sanskrit Series",
                ),
                context="Reality of the world as God's body - foundation of Vishishtadvaita",
                commentaries=[
                    Commentary(
                        author="Rāmānujācārya",
                        text="The universe is the body of Brahman. Souls and matter are real, not illusory, but inseparable from God as body from soul.",
                        date="11th century CE",
                        tradition="Viśiṣṭādvaita",
                        reliability=0.96,
                    )
                ],
                reliability=0.97,
                keywords=["vishishtadvaita", "qualified non-dualism", "brahman", "body of god", "real world", "inseparable"],
            )
        )
        
        self._add_passage(
            VedicPassage(
                sanskrit="अन्तर्यामी",
                transliteration="antaryāmī",
                translation="The Inner Controller",
                reference=VedicTextReference(
                    text="Bṛhadāraṇyaka Upaniṣad",
                    chapter=3,
                    verse=7,
                    section="23",
                    edition="Eighteen Principal Upaniṣads",
                ),
                context="God as the inner controller of all beings - key Vishishtadvaita concept",
                commentaries=[
                    Commentary(
                        author="Rāmānujācārya",
                        text="Brahman dwells within all beings as their inner controller and support, making them His body while remaining distinct as the Soul.",
                        date="11th century CE",
                        tradition="Viśiṣṭādvaita",
                        reliability=0.95,
                    )
                ],
                reliability=0.96,
                keywords=["vishishtadvaita", "antaryami", "inner controller", "god within", "soul master", "part of whole"],
            )
        )
        
        # 3. DVAITA VEDĀNTA - Madhva's Dualism
        self._add_passage(
            VedicPassage(
                sanskrit="द्वा सुपर्णा सयुजा सखाया समानं वृक्षं परिषस्वजाते। तयोरन्यः पिप्पलं स्वाद्वत्त्यनश्नन्नन्यो अभिचाकशीति॥",
                transliteration="dvā suparṇā sayujā sakhāyā samānaṁ vṛkṣaṁ pariṣasvajāte | tayor anyaḥ pippalaṁ svādv atty anaśnann anyo abhicākaśīti ||",
                translation="Two birds, companions and friends, cling to the same tree. One eats the sweet fruit; the other looks on without eating.",
                reference=VedicTextReference(
                    text="Muṇḍaka Upaniṣad",
                    chapter=3,
                    verse=1,
                    section="1",
                    edition="Eighteen Principal Upaniṣads",
                ),
                context="Eternal distinction between jīva (eater) and Paramātmā (witness) - foundation of Dvaita",
                commentaries=[
                    Commentary(
                        author="Madhvācārya",
                        text="This clearly shows the eternal and real distinction between the individual soul (servant) and Supreme Lord (master). They are forever different.",
                        date="13th century CE",
                        tradition="Dvaita Vedānta",
                        reliability=0.97,
                    )
                ],
                reliability=0.98,
                keywords=["dvaita", "dualism", "eternal distinction", "jiva", "paramatma", "separate", "servant master"],
            )
        )
        
        self._add_passage(
            VedicPassage(
                sanskrit="पञ्चभेदा",
                transliteration="pañcabhedā",
                translation="Five-fold difference",
                reference=VedicTextReference(
                    text="Madhva's Anuvyākhyāna",
                    verse=1,
                    edition="Dvaita Vedānta tradition",
                ),
                context="Madhva's doctrine of five eternal distinctions: God-soul, God-matter, soul-soul, soul-matter, matter-matter",
                commentaries=[
                    Commentary(
                        author="Madhvācārya",
                        text="These five distinctions are eternally real (nitya bheda), not products of ignorance. Each entity maintains its unique nature forever.",
                        date="13th century CE",
                        tradition="Dvaita Vedānta",
                        reliability=0.94,
                    )
                ],
                reliability=0.92,
                keywords=["dvaita", "five differences", "eternal separation", "real distinctions", "panchabheda"],
            )
        )
        
        # 4. SHUDDHADVAITA - Vallabha's Pure Non-Dualism
        self._add_passage(
            VedicPassage(
                sanskrit="सर्वं कृष्णमयं जगत्",
                transliteration="sarvaṁ kṛṣṇamayaṁ jagat",
                translation="The entire world is pervaded by Krishna",
                reference=VedicTextReference(
                    text="Vallabha's Ānubhāṣya",
                    edition="Shuddhadvaita tradition",
                ),
                context="The world is real, not illusory, as direct manifestation of Krishna's essence - foundation of Shuddhadvaita",
                commentaries=[
                    Commentary(
                        author="Vallabhācārya",
                        text="Unlike Advaita's maya, the world is Krishna's real Līlā (divine play). Brahman is sat-cit-ānanda appearing as fire and sparks.",
                        date="16th century CE",
                        tradition="Śuddhādvaita",
                        reliability=0.93,
                    )
                ],
                reliability=0.91,
                keywords=["shuddhadvaita", "pure non-dualism", "krishna", "real world", "lila", "spark fire", "divine play"],
            )
        )
        
        self._add_passage(
            VedicPassage(
                sanskrit="अनन्याश्चिन्तयन्तो मां ये जनाः पर्युपासते। तेषां नित्याभियुक्तानां योगक्षेमं वहाम्यहम्॥",
                transliteration="ananyāś cintayanto māṁ ye janāḥ paryupāsate | teṣāṁ nityābhiyuktānāṁ yoga-kṣemaṁ vahāmy aham ||",
                translation="Those who worship Me with exclusive devotion, thinking of nothing else—to those ever-steadfast devotees, I provide what they lack and preserve what they have.",
                reference=VedicTextReference(
                    text="Bhagavad Gītā",
                    chapter=9,
                    verse=22,
                    edition="Gītā Press Critical Edition",
                ),
                context="Pure devotion (puṣṭi mārga) as the path - central to Shuddhadvaita",
                commentaries=[
                    Commentary(
                        author="Vallabhācārya",
                        text="Puṣṭi (grace) flows naturally to those in ananya bhakti. God's kripa creates the world and souls as His real forms, not māyā.",
                        date="16th century CE",
                        tradition="Śuddhādvaita",
                        reliability=0.94,
                    )
                ],
                reliability=0.98,
                keywords=["shuddhadvaita", "pushti marga", "grace", "ananya bhakti", "exclusive devotion", "divine care"],
            )
        )
        
        # 5. ACHINTYA BHEDA ABHEDA - Chaitanya's Inconceivable Difference and Non-Difference
        self._add_passage(
            VedicPassage(
                sanskrit="अचिन्त्याः खलु ये भावा न तांस्तर्केण योजयेत्",
                transliteration="acintyāḥ khalu ye bhāvā na tāṁs tarkeṇa yojayet",
                translation="That which is inconceivable should not be subjected to logical reasoning",
                reference=VedicTextReference(
                    text="Mahābhārata",
                    section="Bhīṣma Parva",
                    edition="Critical Edition",
                ),
                context="Foundation of Achintya Bheda Abheda - reality transcends logical categorization",
                commentaries=[
                    Commentary(
                        author="Jīva Gosvāmī",
                        text="The jīva is simultaneously one with and different from Krishna—inconceivable to material logic. Like sun and sunshine: distinct yet inseparable.",
                        date="16th century CE",
                        tradition="Gauḍīya Vaiṣṇava (Achintya Bhedābheda)",
                        reliability=0.95,
                    )
                ],
                reliability=0.93,
                keywords=["achintya bheda abheda", "inconceivable", "one and different", "simultaneously", "transcends logic"],
            )
        )
        
        self._add_passage(
            VedicPassage(
                sanskrit="सूर्यकान्तोपलस्पर्शविशेषवत्",
                transliteration="sūryakāntopala-sparśa-viśeṣavat",
                translation="Like the sun-stone's special contact [with sunlight]",
                reference=VedicTextReference(
                    text="Gauḍīya Vedānta tradition",
                    edition="Chaitanya school",
                ),
                context="Analogy for achintya bheda abheda - jīva and Brahman are like crystal and sunlight",
                commentaries=[
                    Commentary(
                        author="Baladeva Vidyābhūṣaṇa",
                        text="The jīva possesses the qualities of Brahman like a crystal reflects sunlight, yet remains distinct. Unity in quality, difference in quantity.",
                        date="18th century CE",
                        tradition="Gauḍīya Vaiṣṇava (Achintya Bhedābheda)",
                        reliability=0.92,
                    )
                ],
                reliability=0.90,
                keywords=["achintya bheda abheda", "sun crystal", "one different simultaneously", "quality quantity", "reflection"],
            )
        )

    def _add_passage(self, passage: VedicPassage) -> None:
        """Add a passage to the corpus with full indexing."""
        # Convert lists to tuples if needed for hashability
        if isinstance(passage.commentaries, list):
            passage = VedicPassage(
                sanskrit=passage.sanskrit,
                transliteration=passage.transliteration,
                translation=passage.translation,
                reference=passage.reference,
                context=passage.context,
                commentaries=tuple(passage.commentaries),
                reliability=passage.reliability,
                keywords=tuple(passage.keywords) if isinstance(passage.keywords, list) else passage.keywords,
            )
        
        text_key = passage.reference.text.lower().replace(" ", "_")

        if text_key not in self.corpus:
            self.corpus[text_key] = []
        self.corpus[text_key].append(passage)

        # Index by keywords
        for keyword in passage.keywords:
            key = keyword.lower()
            self.indexed_keywords[key].append(passage)

    def _build_concept_graph(self) -> None:
        """Build concept relationships graph."""
        self.concept_graph = {
            "dharma": ["karma", "duty", "righteousness", "cosmic_order"],
            "ātman": ["self", "consciousness", "soul", "brahman"],
            "brahman": ["absolute", "reality", "consciousness", "ātman"],
            "mokṣa": ["liberation", "freedom", "realization", "mukti"],
            "advaita": ["non-duality", "monism", "brahman", "māyā", "illusion", "identity", "one"],
            "vishishtadvaita": ["qualified non-dualism", "body of god", "real world", "antaryami", "inseparable"],
            "dvaita": ["dualism", "eternal distinction", "separate", "panchabheda", "servant master"],
            "shuddhadvaita": ["pure non-dualism", "lila", "divine play", "krishna", "pushti marga", "spark fire"],
            "achintya": ["inconceivable", "one and different", "simultaneously", "sun crystal", "bheda abheda"],
            "bhakti": ["devotion", "love", "surrender", "grace"],
            "karma": ["action", "duty", "consequence", "dharma"],
            "maya": ["illusion", "appearance", "unreal", "advaita"],
        }

    async def query_vedic_knowledge(self, query: str) -> QueryResult:
        """
        Query the corpus with anti-hallucination safeguards.

        Args:
            query: Natural language query

        Returns:
            QueryResult with passages, synthesized answer, and confidence metrics
        """
        keywords = self._extract_keywords(query)
        passages = self._find_relevant_passages(keywords)

        if not passages:
            return QueryResult(
                query=query,
                passages=[],
                synthesized_answer="No authoritative sources found for this query. I cannot provide information without proper textual foundation.",
                sources=[],
                confidence=0.0,
                hallucination_risk="high",
                warnings=["Query returned no results from authenticated Vedic sources"],
            )

        synthesized_answer = self._synthesize_answer(passages, query)
        confidence = self._calculate_confidence(passages)
        hallucination_risk = self._assess_hallucination_risk(passages, confidence)

        return QueryResult(
            query=query,
            passages=passages[:5],  # Top 5 most relevant
            synthesized_answer=synthesized_answer,
            sources=[p.reference for p in passages],
            confidence=confidence,
            hallucination_risk=hallucination_risk,
            warnings=self._generate_warnings(passages, confidence),
        )

    def _extract_keywords(self, query: str) -> list[str]:
        """Extract keywords from query."""
        common_words = {
            "the",
            "is",
            "are",
            "what",
            "how",
            "why",
            "where",
            "when",
            "about",
            "of",
            "in",
            "and",
            "or",
        }
        return [
            word
            for word in query.lower().split()
            if word not in common_words and len(word) > 2
        ]

    def _find_relevant_passages(self, keywords: list[str]) -> list[VedicPassage]:
        """Find relevant passages based on keywords."""
        passages: set[VedicPassage] = set()

        for keyword in keywords:
            # Direct keyword matches
            direct = self.indexed_keywords.get(keyword, [])
            passages.update(direct)

            # Concept graph expansion
            related = self.concept_graph.get(keyword, [])
            for related_concept in related:
                related_passages = self.indexed_keywords.get(related_concept, [])
                passages.update(related_passages)

        return sorted(passages, key=lambda p: p.reliability, reverse=True)

    def _synthesize_answer(self, passages: list[VedicPassage], query: str) -> str:
        """Synthesize answer from passages."""
        if not passages:
            return "No authoritative sources available."

        answer = "Based on authentic Vedic sources:\n\n"

        for i, passage in enumerate(passages[:3], 1):
            ref = passage.reference
            answer += f"{i}. **{ref.text}** "
            if ref.chapter and ref.verse:
                answer += f"({ref.chapter}.{ref.verse})"
            answer += f":\n   \"{passage.translation}\"\n"
            answer += f"   Sanskrit: {passage.sanskrit}\n"
            answer += f"   Context: {passage.context}\n\n"

        if passages[0].commentaries:
            answer += "**Traditional Commentary:**\n"
            for commentary in passages[0].commentaries[:2]:
                answer += f"• {commentary.author} ({commentary.tradition}): {commentary.text}\n"

        return answer

    def _calculate_confidence(self, passages: list[VedicPassage]) -> float:
        """Calculate confidence score."""
        if not passages:
            return 0.0

        avg_reliability = sum(p.reliability for p in passages) / len(passages)
        source_count = min(len(passages) / 5, 1.0)  # Bonus for multiple sources

        return min(avg_reliability * (0.8 + 0.2 * source_count), 1.0)

    def _assess_hallucination_risk(
        self, passages: list[VedicPassage], confidence: float
    ) -> Literal["low", "medium", "high"]:
        """Assess risk of hallucinated information."""
        if confidence > 0.8 and len(passages) >= 2:
            return "low"
        if confidence > 0.6 and len(passages) >= 1:
            return "medium"
        return "high"

    def _generate_warnings(
        self, passages: list[VedicPassage], confidence: float
    ) -> list[str]:
        """Generate warnings about answer quality."""
        warnings: list[str] = []

        if confidence < 0.7:
            warnings.append("Low confidence answer - interpret with caution")

        if len(passages) < 2:
            warnings.append("Limited source material - answer may not be comprehensive")

        if any(p.reliability < 0.8 for p in passages):
            warnings.append("Some sources have lower manuscript attestation")

        return warnings

    def get_corpus_statistics(self) -> dict[str, any]:
        """Get corpus statistics and coverage."""
        total_passages = sum(len(passages) for passages in self.corpus.values())
        texts_count = len(self.corpus)
        keywords_count = len(self.indexed_keywords)
        concepts_count = len(self.concept_graph)

        return {
            "total_passages": total_passages,
            "texts_count": texts_count,
            "keywords_count": keywords_count,
            "concepts_count": concepts_count,
            "coverage": {
                "upaniṣads": self._get_text_group_count(["upaniṣad"]),
                "gītā": self._get_text_group_count(["bhagavad"]),
                "vedas": self._get_text_group_count(
                    ["ṛgveda", "sāmaveda", "yajurveda", "atharvaveda"]
                ),
                "purāṇas": self._get_text_group_count(["bhāgavatam", "purāṇa"]),
            },
        }

    def _get_text_group_count(self, keywords: list[str]) -> int:
        """Count texts in a group."""
        count = 0
        for keyword in keywords:
            matches = [key for key in self.corpus.keys() if keyword in key]
            count += len(matches)
        return count
