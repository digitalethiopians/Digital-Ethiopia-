import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  GraduationCap, 
  Clock, 
  HelpCircle, 
  CheckCircle, 
  AlertTriangle, 
  BookOpen, 
  Sparkles, 
  ArrowLeft, 
  Award, 
  ChevronLeft, 
  ChevronRight, 
  Flag, 
  RefreshCw, 
  X,
  BookMarked
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../lib/AuthContext';
import confetti from 'canvas-confetti';

interface Question {
  id: number;
  question: string;
  options: string[];
  correctAnswer: string;
  category: string;
}

interface ExamModule {
  id: string;
  title: string;
  description: string;
  subject: string;
  timeLimitMinutes: number;
  totalQuestions: number;
  difficulty: 'Easy' | 'Intermediate' | 'Advanced';
  level: 'Grade 12' | 'Exit Exam';
  questions: Question[];
}

const MOCK_EXAMS: ExamModule[] = [
  {
    id: 'eth_g12_math',
    title: 'Grade 12 Mathematics National Exam Simulator (2018 E.C.)',
    description: 'Comprehensive mathematical diagnostic based on sequences, series, vectors, and calculus limits tailored for the Ethiopian University Entrance Examination preps.',
    subject: 'Mathematics',
    timeLimitMinutes: 10,
    totalQuestions: 5,
    difficulty: 'Advanced',
    level: 'Grade 12',
    questions: [
      {
        id: 1,
        question: "Let {a_n} be an arithmetic sequence such that a_3 = 11 and a_8 = 26. What is the value of the 15th term (a_15)?",
        options: [
          "a_15 = 47",
          "a_15 = 51",
          "a_15 = 44",
          "a_15 = 53"
        ],
        correctAnswer: "a_15 = 47",
        category: "Sequences & Series"
      },
      {
        id: 2,
        question: "Calculate the exact derivative of the function f(x) = x^3 - 3x^2 + 5 at the coordinate x = 2.",
        options: [
          "f'(2) = 0",
          "f'(2) = 12",
          "f'(2) = 6",
          "f'(2) = -2"
        ],
        correctAnswer: "f'(2) = 0",
        category: "Calculus"
      },
      {
        id: 3,
        question: "Under standard algebraic integration, what is the value of the limit as x approaches 3 of (x^2 - 9) / (x - 3)?",
        options: [
          "6",
          "3",
          "0",
          "Undefined"
        ],
        correctAnswer: "6",
        category: "Limits"
      },
      {
        id: 4,
        question: "What is the dot product of two vectors A = 2i + 3j - k and B = i + j + 2k in three-dimensional space?",
        options: [
          "3",
          "5",
          "7",
          "1"
        ],
        correctAnswer: "3",
        category: "Vector Algebra"
      },
      {
        id: 5,
        question: "Find the sum of the infinite geometric series: 8 + 4 + 2 + 1 + ...",
        options: [
          "16",
          "15",
          "12",
          "20"
        ],
        correctAnswer: "16",
        category: "Sequences & Series"
      }
    ]
  },
  {
    id: 'eth_g12_aptitude',
    title: 'Scholastic Aptitude Test Exam Coach (2018 E.C.)',
    description: 'Interactive analytics mock test consisting of diagrams, visual analogies, quantitative reasoning, and data sufficiency methods matching standard MoE logical diagnostics.',
    subject: 'Aptitude',
    timeLimitMinutes: 12,
    totalQuestions: 5,
    difficulty: 'Intermediate',
    level: 'Grade 12',
    questions: [
      {
        id: 1,
        question: "Complete the following verbal analogy - ETHIOPIA : ADDIS ABABA :: KENYA : ______",
        options: [
          "Nairobi",
          "Mombasa",
          "Kampala",
          "Dar es Salaam"
        ],
        correctAnswer: "Nairobi",
        category: "Verbal Analogy"
      },
      {
        id: 2,
        question: "Seven years ago, Abdi was three times as old as Chala. Today, Abdi is twice as old as Chala. How old is Abdi now?",
        options: [
          "28 years old",
          "24 years old",
          "14 years old",
          "21 years old"
        ],
        correctAnswer: "28 years old",
        category: "Quantitative Logic"
      },
      {
        id: 3,
        question: "If all programmers are analytical thinkers, and some analytical thinkers are creative. Which of the following statement MUST be true?",
        options: [
          "Some programmers are creative.",
          "All analytical thinkers are programmers.",
          "None of the creative people can be analytical thinkers.",
          "None of the above statements is guaranteed to be true."
        ],
        correctAnswer: "None of the above statements is guaranteed to be true.",
        category: "Analytical Deductions"
      },
      {
        id: 4,
        question: "In a certain coded language, COGNITIVE is written as EVIITINGOC. How is SOLUTION coded under the exact identical framework?",
        options: [
          "NOITULOS",
          "NUITOLOS",
          "SNOTUILO",
          "NOTIULOS"
        ],
        correctAnswer: "NOITULOS",
        category: "Coding & Decoding"
      },
      {
        id: 5,
        question: "What number logically completes the following pattern? Challenge sequence: 3, 7, 15, 31, 63, ____",
        options: [
          "127",
          "119",
          "129",
          "125"
        ],
        correctAnswer: "127",
        category: "Number Sequences"
      }
    ]
  },
  {
    id: 'eth_g12_physics',
    title: 'Grade 12 Physics National Exam (2018 E.C.)',
    description: 'Master advanced mechanics, rotational kinetics, electromagnetism, optics, and thermodynamics matching MoE standard examination blueprints.',
    subject: 'Physics',
    timeLimitMinutes: 10,
    totalQuestions: 5,
    difficulty: 'Advanced',
    level: 'Grade 12',
    questions: [
      {
        id: 1,
        question: "An object is thrown horizontally from a cliff 80m high with a horizontal velocity of 30 m/s. Taking g = 10 m/s², how long does it take to strike the bottom ground?",
        options: [
          "4 seconds",
          "8 seconds",
          "16 seconds",
          "2 seconds"
        ],
        correctAnswer: "4 seconds",
        category: "Projectiles & Kinematics"
      },
      {
        id: 2,
        question: "What is the net work done on an ideal gas when it undergoes an isobaric expansion at a constant pressure of 2 x 10⁵ Pa, forcing the volume to increase from 1 Liter to 3 Liters?",
        options: [
          "400 Joules",
          "40,000 Joules",
          "4 Joules",
          "400,000 Joules"
        ],
        correctAnswer: "400 Joules",
        category: "Thermodynamics"
      },
      {
        id: 3,
        question: "Under Kepler's laws of planetary orbits, the square of the orbital period of any planet is directly proportional to:",
        options: [
          "The cube of the semi-major axis of its orbit",
          "The square of the semi-major axis of its orbit",
          "The mass of the orbiting planetary node",
          "The gravitational attraction constant"
        ],
        correctAnswer: "The cube of the semi-major axis of its orbit",
        category: "Gravitation"
      },
      {
        id: 4,
        question: "Which conceptual definition specifies the minimum quantum of kinetic energy required to liberate electrons from a metallic surface under the photoelectric effect?",
        options: [
          "Work Function (Φ)",
          "Threshold Wavelength",
          "Fermi Energy Level",
          "Planck Emission Constant"
        ],
        correctAnswer: "Work Function (Φ)",
        category: "Quantum Physics"
      },
      {
        id: 5,
        question: "Two point charges, Q1 = +2 µC and Q2 = -8 µC, are placed 3 meters apart in a vacuum. What is the magnitude of the attractive electrostatic force between them? (k = 9 x 10⁹ N·m²/C²)",
        options: [
          "0.016 N",
          "0.160 N",
          "0.048 N",
          "1.600 N"
        ],
        correctAnswer: "0.016 N",
        category: "Electrostatics"
      }
    ]
  },
  {
    id: 'eth_g12_english',
    title: 'Grade 12 English National Examination Trainer (2018 E.C.)',
    description: 'Prepare with intensive evaluation of secondary syntax rules, conditional clauses, vocabulary semantics, reading checks, and social formula markers.',
    subject: 'English',
    timeLimitMinutes: 8,
    totalQuestions: 5,
    difficulty: 'Intermediate',
    level: 'Grade 12',
    questions: [
      {
        id: 1,
        question: "Fill in the correct conditional verb: If they ______ earlier, they would have caught the regional digital training shuttle to Jimma.",
        options: [
          "had arrived",
          "arrived",
          "have arrived",
          "would arrive"
        ],
        correctAnswer: "had arrived",
        category: "Grammar & Verbs"
      },
      {
        id: 2,
        question: "Select the word that represents the closest synonym of the underlined term: 'The innovative platform has a CONSPICUOUS influence on the student’s success.'",
        options: [
          "Highly noticeable",
          "Hidden",
          "Negligible",
          "Experimental"
        ],
        correctAnswer: "Highly noticeable",
        category: "Vocabulary Semantics"
      },
      {
        id: 3,
        question: "Identify the appropriate social formula: Visitor: 'I really admire the work you do here on Digital Ethiopia.' Coordinator: '_________'",
        options: [
          "That is very kind of you to say.",
          "Yes, I do too.",
          "No problem, let us go.",
          "Please don’t worry about it."
        ],
        correctAnswer: "That is very kind of you to say.",
        category: "Social Communications"
      },
      {
        id: 4,
        question: "Find the grammatical matching pattern: 'Neither the school board directors nor the chief administrative officer ______ the digital integration plan yet.'",
        options: [
          "has approved",
          "have approved",
          "are approving",
          "were approving"
        ],
        correctAnswer: "has approved",
        category: "Subject-Verb Agreement"
      },
      {
        id: 5,
        question: "Read the context and choose the appropriate term: 'The student was extremely ______ in her academic courses, ensuring every assignment was completed flawlessly.'",
        options: [
          "diligent",
          "negligent",
          "docile",
          "apathetic"
        ],
        correctAnswer: "diligent",
        category: "Context Comprehension"
      }
    ]
  },
  {
    id: 'eth_exit_cs',
    title: 'Higher Education Exit Exam: Computer Science (2018 E.C.)',
    description: 'Mock diagnostic for computer science and software engineering bachelor exits. Built in accordance with ethernet.edu.et official testing standards.',
    subject: 'Computer Science',
    timeLimitMinutes: 15,
    totalQuestions: 5,
    difficulty: 'Advanced',
    level: 'Exit Exam',
    questions: [
      {
        id: 1,
        question: "Which software testing/validation phase is primarily conducted by the client/end-users in a real-world sandbox environment to verify if the software system meets business goals?",
        options: [
          "User Acceptance Testing (UAT)",
          "Integration Testing",
          "Smoke and Sanity Testing",
          "Regression Testing"
        ],
        correctAnswer: "User Acceptance Testing (UAT)",
        category: "Software Engineering"
      },
      {
        id: 2,
        question: "In relational database design theory, a relation schema is in Boyce-Codd Normal Form (BCNF) if and only if:",
        options: [
          "For every non-trivial functional dependency X -> Y, X is a superkey",
          "It contains no composite attributes with repeating groups",
          "It restricts transitive functional dependencies among prime attributes",
          "All multi-valued attributes are decoupled into secondary tables"
        ],
        correctAnswer: "For every non-trivial functional dependency X -> Y, X is a superkey",
        category: "Database Systems"
      },
      {
        id: 3,
        question: "Which operating system CPU scheduling algorithm is non-preemptive and can lead to the 'Convoy Effect' where short processes wait a long time?",
        options: [
          "First-Come, First-Served (FCFS)",
          "Shortest Remaining Time First (SRTF)",
          "Round Robin (RR) Scheduling",
          "Priority-driven Preemptive"
        ],
        correctAnswer: "First-Come, First-Served (FCFS)",
        category: "Operating Systems"
      },
      {
        id: 4,
        question: "What is the primary functionality of the Physical and Network layers when packets are routed across the internet in the OSI reference model?",
        options: [
          "Determining the most optimal logical routing path for packets",
          "Guaranteeing encryption and presentation conversion styles",
          "Binding port address numbers to the active transmission controls",
          "Regulating session synchronization check tokens"
        ],
        correctAnswer: "Determining the most optimal logical routing path for packets",
        category: "Computer Networks"
      },
      {
        id: 5,
        question: "Which classical memory structure is classified as a LIFO (Last-In, First-Out) data structure where insertions/deletions happen at a single boundary node?",
        options: [
          "Stack",
          "Queue",
          "Doubly-linked list",
          "Binary Search Tree"
        ],
        correctAnswer: "Stack",
        category: "Data Structures & Algorithms"
      }
    ]
  },
  {
    id: 'eth_exit_accounting',
    title: 'Higher Education Exit Exam: Accounting & Finance (2018 E.C.)',
    description: 'Complete practice mock covering IFRS criteria, cost behaviors, financial statement disclosures, and financial asset management standards.',
    subject: 'Accounting',
    timeLimitMinutes: 12,
    totalQuestions: 5,
    difficulty: 'Advanced',
    level: 'Exit Exam',
    questions: [
      {
        id: 1,
        question: "According to IFRS structural rules, which official statement demonstrates a company's total assets, liability metrics, and shareholder equity balances at a precise calendar snapshot?",
        options: [
          "Statement of Financial Position (Balance Sheet)",
          "Statement of Comprehensive Income",
          "Statement of Cash Flow Operations",
          "Statement of Retained Surplus"
        ],
        correctAnswer: "Statement of Financial Position (Balance Sheet)",
        category: "Financial Accounting"
      },
      {
        id: 2,
        question: "Which accounting theory mandates that businesses match their direct and indirect operating expenses with current earnings in the exact period they help to generate?",
        options: [
          "Matching Principle / Accrual Concept",
          "Going Concern Principle",
          "Historical Cost Convention",
          "Dual Aspect Principle"
        ],
        correctAnswer: "Matching Principle / Accrual Concept",
        category: "Accounting Rules"
      },
      {
        id: 3,
        question: "How is the Net Present Value (NPV) calculation of a capital budget investment project defined under modern financial theory?",
        options: [
          "The difference between the present value of cash inflows and outflows",
          "The internal rate of return discounted against inflation indices",
          "The total summation of raw operating cash flows minus initial loans",
          "The absolute ratio of annual profits to starting capital costs"
        ],
        correctAnswer: "The difference between the present value of cash inflows and outflows",
        category: "Corporate Finance"
      },
      {
        id: 4,
        question: "Which cost behavior is characterized by remaining constant in total quantity across a relevant range, but decreasing on a per-unit basis as volume increases?",
        options: [
          "Fixed Cost",
          "Variable Cost",
          "Semi-variable Cost",
          "Indirect Material Cost"
        ],
        correctAnswer: "Fixed Cost",
        category: "Cost & Management Accounting"
      },
      {
        id: 5,
        question: "Which auditing and internal control feature ensures that no single personnel can execute a transaction, post the ledger entry, and hold custodial responsibility over the physical asset?",
        options: [
          "Segregation of Duties",
          "Independent Physical Audits",
          "Dual-Authorisation Passwords",
          "External Oversight Verification"
        ],
        correctAnswer: "Segregation of Duties",
        category: "Auditing & Control"
      }
    ]
  },
  {
    id: 'eth_exit_nursing',
    title: 'Higher Education Exit Exam: General Nursing (2018 E.C.)',
    description: 'Comprehensive medical mock test focusing on triage coding, drug actions, nursing interventions, and diagnostic procedures.',
    subject: 'Nursing',
    timeLimitMinutes: 10,
    totalQuestions: 5,
    difficulty: 'Advanced',
    level: 'Exit Exam',
    questions: [
      {
        id: 1,
        question: "A young adult patient is admitted with suspect acute appendicitis. Which abdominal quadrant is typically assessed for McBurney's point rebound tenderness?",
        options: [
          "Right Lower Quadrant (RLQ)",
          "Left Lower Quadrant (LLQ)",
          "Right Upper Quadrant (RUQ)",
          "Left Upper Quadrant (LUQ)"
        ],
        correctAnswer: "Right Lower Quadrant (RLQ)",
        category: "Clinical Assessment"
      },
      {
        id: 2,
        question: "What is the critical pharmacological action of sublingual nitroglycerin administered to a patient facing chronic angina discomfort during a clinical emergency?",
        options: [
          "Promoting systemic and coronary arterial vasodilation",
          "Increasing myocardial oxygen consumption patterns",
          "Blocking beta-adrenergic vascular receptors directly",
          "Inhibiting platelets aggregation cascades in blood"
        ],
        correctAnswer: "Promoting systemic and coronary arterial vasodilation",
        category: "Pharmacology & Interventions"
      },
      {
        id: 3,
        question: "Under standard Clinical Triage guidelines, what color designation represents patients with highly life-threatening emergencies requiring immediate priority care?",
        options: [
          "Red (Immediate)",
          "Yellow (Delayed Option)",
          "Green (Minor Trauma)",
          "Black (Deceased/Incurable)"
        ],
        correctAnswer: "Red (Immediate)",
        category: "Emergency & Disaster Nursing"
      },
      {
        id: 4,
        question: "Which therapeutic indicator serves as a premier clinical signal of severe dehydration in pediatric patients suffering from severe diarrhea?",
        options: [
          "Sunken fontanelle and dry mucous membranes with skin tenting",
          "Increased tear production on direct examination",
          "Slowing of heart rate with high blood pressure profiles",
          "Flushed face with hyperactive bowel movements"
        ],
        correctAnswer: "Sunken fontanelle and dry mucous membranes with skin tenting",
        category: "Pediatric Care"
      },
      {
        id: 5,
        question: "What is the primary nursing instruction to prevent pressure ulcer development in heavily bedridden, immobile senior hospital patients?",
        options: [
          "Reposition the patient every 2 hours using a rotation plan",
          "Massage bony prominences once with alcohol rub solutions",
          "Administer high-dose parenteral fluid infusions regularly",
          "Restrict physical motion during sleep cycles completely"
        ],
        correctAnswer: "Reposition the patient every 2 hours using a rotation plan",
        category: "Nursing Fundamentals"
      }
    ]
  },
  {
    id: 'eth_exit_management',
    title: 'Higher Education Exit Exam: Business Management (2018 E.C.)',
    description: 'Test operations, management theory, strategic planning tools, and HR structures matching Ministry of Education templates.',
    subject: 'Management',
    timeLimitMinutes: 10,
    totalQuestions: 5,
    difficulty: 'Intermediate',
    level: 'Exit Exam',
    questions: [
      {
        id: 1,
        question: "In the context of strategic organizational analysis, what is the meaning of the SWOT assessment framework?",
        options: [
          "Strengths, Weaknesses, Opportunities, Threats",
          "Standards, Welfare, Operations, Timing",
          "Synergy, Workforce, Output, Tactics",
          "Systematic, Wise, Organized, Thorough"
        ],
        correctAnswer: "Strengths, Weaknesses, Opportunities, Threats",
        category: "Strategic Management"
      },
      {
        id: 2,
        question: "Which classical management theory proponent formulated the 'Fourteen Principles of Management' reflecting delegation, division of work, and organizational unity?",
        options: [
          "Henri Fayol",
          "Frederick Taylor",
          "Max Weber",
          "Elton Mayo"
        ],
        correctAnswer: "Henri Fayol",
        category: "Management theories"
      },
      {
        id: 3,
        question: "What does the 'Span of Control' signify under organizational design principles?",
        options: [
          "The number of immediate subordinates a single manager directly oversees",
          "The geographic extent of regional business offices across Ethiopia",
          "The precise lifespan of a corporate strategy plan",
          "The duration allowed for executing standard manufacturing runs"
        ],
        correctAnswer: "The number of immediate subordinates a single manager directly oversees",
        category: "Organising & Structure"
      },
      {
        id: 4,
        question: "Which of the following is an example of an extrinsic motivator under Herzberg's Motivation-Hygiene Dual-Factor theory?",
        options: [
          "Company work policies and monthly salary level",
          "The joy of personal growth and accomplishment",
          "Direct administrative responsibilities over tasks",
          "Public verbal recognition of a creative work"
        ],
        correctAnswer: "Company work policies and monthly salary level",
        category: "HR & Motivation"
      },
      {
        id: 5,
        question: "According to Michael Porter's landmark framework, what are the three coordinate generic competitive strategies available to firm nodes?",
        options: [
          "Cost Leadership, Differentiation, and Focus Strategy",
          "Marketing, R&D, and Quality Control",
          "Vertical, Horizontal, and Conglomerate Integration",
          "Penetration, Expansion, and Market Creation"
        ],
        correctAnswer: "Cost Leadership, Differentiation, and Focus Strategy",
        category: "Strategic Management"
      }
    ]
  }
];

export const NationalExamPortal = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  // Active examination state
  const [activeModule, setActiveModule] = useState<ExamModule | null>(null);
  const [activeQuestions, setActiveQuestions] = useState<Question[]>([]);
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState<number>(0);
  
  // Exam levels (Grade 12 vs Higher Ed Exit Exams from ethernet.edu.et)
  const [selectedLevel, setSelectedLevel] = useState<'Grade 12' | 'Exit Exam'>('Grade 12');
  
  // Student answers and tracking
  const [studentAnswers, setStudentAnswers] = useState<Record<number, string>>({});
  const [flaggedQuestions, setFlaggedQuestions] = useState<Record<number, boolean>>({});
  const [timeLeft, setTimeLeft] = useState<number>(0); // static/runtime state in seconds
  const [sessionActive, setSessionActive] = useState<boolean>(false);
  const [showConfirmSubmit, setShowConfirmSubmit] = useState<boolean>(false);

  // Score dashboard state
  const [examResult, setExamResult] = useState<{
    module: ExamModule;
    score: number;
    total: number;
    accuracy: number;
    timeSpentSeconds: number;
    answersSnapshot: Record<number, string>;
  } | null>(null);

  // AI Step-by-Step interactive tutors
  const [explainingId, setExplainingId] = useState<number | null>(null);
  const [aiExplanations, setAiExplanations] = useState<Record<number, string>>({});
  const [explanationLoadError, setExplanationLoadError] = useState<string | null>(null);

  // Time tracking
  const [timerInterval, setTimerInterval] = useState<NodeJS.Timeout | null>(null);
  const [startTime, setStartTime] = useState<number>(0);

  // Timer run loop
  useEffect(() => {
    if (sessionActive && timeLeft > 0) {
      const interval = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            // Auto submit when time hits zero
            handleFormSubmit(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      setTimerInterval(interval);
      return () => clearInterval(interval);
    }
  }, [sessionActive, timeLeft]);

  const startExam = (exam: ExamModule) => {
    setActiveModule(exam);
    setActiveQuestions(exam.questions);
    setCurrentQuestionIdx(0);
    setStudentAnswers({});
    setFlaggedQuestions({});
    setTimeLeft(exam.timeLimitMinutes * 60);
    setStartTime(Date.now());
    setSessionActive(true);
    setExamResult(null);
    setAiExplanations({});
    setShowConfirmSubmit(false);
  };

  const handleSelectOption = (questionId: number, option: string) => {
    setStudentAnswers((prev) => ({
      ...prev,
      [questionId]: option
    }));
  };

  const handleToggleFlag = (questionId: number) => {
    setFlaggedQuestions((prev) => ({
      ...prev,
      [questionId]: !prev[questionId]
    }));
  };

  const handleFormSubmit = (force: boolean = false) => {
    if (!activeModule) return;
    if (!force && Object.keys(studentAnswers).length < activeQuestions.length) {
      setShowConfirmSubmit(true);
      return;
    }

    if (timerInterval) clearInterval(timerInterval);

    const matchSnapshot = { ...studentAnswers };
    let scoreCount = 0;
    activeQuestions.forEach((q) => {
      if (matchSnapshot[q.id] === q.correctAnswer) {
        scoreCount++;
      }
    });

    const elapsedSeconds = Math.round((Date.now() - startTime) / 1000);
    const accuracyValue = Math.round((scoreCount / activeQuestions.length) * 100);

    setExamResult({
      module: activeModule,
      score: scoreCount,
      total: activeQuestions.length,
      accuracy: accuracyValue,
      timeSpentSeconds: Math.min(elapsedSeconds, activeModule.timeLimitMinutes * 60),
      answersSnapshot: matchSnapshot
    });

    setSessionActive(false);
    setShowConfirmSubmit(false);

    // Confetti effect on high-score passes!
    if (accuracyValue >= 70) {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#047857', '#10b981', '#34d399', '#f3f4f6']
      });
    }
  };

  const loadAIExplanation = async (question: Question, selectedAns: string) => {
    setExplainingId(question.id);
    setExplanationLoadError(null);
    try {
      const response = await fetch('/api/exam/explain', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          question: question.question,
          options: question.options,
          correctAnswer: question.correctAnswer,
          selectedAnswer: selectedAns,
          subject: activeModule?.subject || "National Entrance"
        })
      });

      if (!response.ok) throw new Error("Could not contact the Digital Ethiopia AI expert.");
      const data = await response.json();
      
      setAiExplanations((prev) => ({
        ...prev,
        [question.id]: data.explanation
      }));
    } catch (e: any) {
      console.error(e);
      setExplanationLoadError("Encountered connection issues. Displaying offline logic overview.");
      setAiExplanations((prev) => ({
        ...prev,
        [question.id]: `Explanation Guide: The correct answer is "${question.correctAnswer}". This corresponds strictly to the verified 2026 academic curricula of Ethiopia and standard analytical entrance models.`
      }));
    } finally {
      setExplainingId(null);
    }
  };

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const formatElapsedTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return mins > 0 ? `${mins}m ${secs}s` : `${secs}s`;
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      {/* 1. Header / Intro Banner */}
      {!sessionActive && !examResult && (
        <motion.div 
          initial={{ opacity: 0, y: 15 }} 
          animate={{ opacity: 1, y: 0 }}
          className="relative mb-14 overflow-hidden rounded-3xl bg-slate-900 px-8 py-12 text-white shadow-2xl"
        >
          {/* Accent decoration */}
          <div className="absolute right-0 top-0 h-96 w-96 -translate-y-20 translate-x-20 rounded-full bg-emerald-500/10 blur-3xl" />
          <div className="absolute left-1/3 bottom-0 h-64 w-64 translate-y-24 rounded-full bg-indigo-500/5 blur-3xl" />

          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
            <div className="max-w-xl">
              <div className="inline-flex items-center gap-2 rounded-full bg-emerald-500/15 border border-emerald-500/20 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-emerald-400">
                <BookMarked size={12} /> Live National Mock Hub
              </div>
              <h1 className="mt-4 text-3xl font-extrabold tracking-tight sm:text-4xl">
                Online National Examination Portal
              </h1>
              <p className="mt-4 h-auto text-sm leading-relaxed text-slate-300">
                Welcome to the Ethernet-integrated 2026 grade 12 national examination training center. 
                Experience time-restricted evaluations with instant interactive AI tutor insights for sequences, indices, calculus, grammar, and complex vocabulary puzzles.
              </p>
            </div>
            
            <div className="flex shrink-0 flex-col gap-3 rounded-2xl bg-white/5 border border-white/5 p-6 backdrop-blur-sm sm:w-80">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-400">
                <Sparkles size={14} /> Student Workspace
              </div>
              <div className="text-sm font-semibold text-slate-100">
                Active Student: <span className="text-white font-bold">{user?.displayName || "Ethiopian Scholar"}</span>
              </div>
              <p className="text-[10px] text-slate-400 leading-normal">
                All mocks conform directly to Ministry of Education examination patterns for 2026. Keep strict watch on the active timers!
              </p>
            </div>
          </div>
        </motion.div>
      )}

      {/* 2. List of Available Exams */}
      {!sessionActive && !examResult && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-200 pb-4 gap-4">
            <div>
              <h2 className="text-xl font-bold tracking-tight text-slate-900">National Exam Center (2018 E.C. / 2026)</h2>
              <p className="text-xs text-slate-500 mt-0.5">Select a diagnostic prep series below to undergo test simulation with real-time feedback.</p>
            </div>
            <span className="text-[10px] self-start sm:self-auto bg-emerald-100 border border-emerald-200 px-3 py-1 rounded-full font-bold uppercase text-emerald-800">
              {MOCK_EXAMS.filter(exam => exam.level === selectedLevel).length} Modules Active
            </span>
          </div>

          {/* Level Academic Track Selection Tabs */}
          <div className="flex bg-slate-100 p-1.5 rounded-2xl max-w-md border border-slate-200">
            <button
              onClick={() => setSelectedLevel('Grade 12')}
              className={`flex-1 py-2.5 text-center text-xs font-bold rounded-xl transition-all cursor-pointer ${
                selectedLevel === 'Grade 12'
                  ? 'bg-white text-slate-900 shadow-md ring-1 ring-slate-900/5'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              👩‍🎓 Grade 12 National Prep
            </button>
            <button
              onClick={() => setSelectedLevel('Exit Exam')}
              className={`flex-1 py-2.5 text-center text-xs font-bold rounded-xl transition-all cursor-pointer ${
                selectedLevel === 'Exit Exam'
                  ? 'bg-white text-slate-900 shadow-md ring-1 ring-slate-900/5'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              🎓 HE Exit Exams (ethernet)
            </button>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {MOCK_EXAMS.filter(exam => exam.level === selectedLevel).map((exam) => (
              <motion.div
                key={exam.id}
                whileHover={{ y: -5 }}
                className="flex flex-col justify-between bg-white rounded-2xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition-all duration-200"
                id={`exam-${exam.id}`}
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="inline-flex rounded-xl bg-slate-50 border border-slate-200 px-3 py-1 text-[10px] font-bold uppercase text-slate-600">
                      {exam.subject}
                    </span>
                    <span className={`text-[10px] font-bold uppercase ${
                      exam.difficulty === 'Easy' ? 'text-emerald-500' :
                      exam.difficulty === 'Intermediate' ? 'text-blue-500' : 'text-red-500'
                    }`}>
                      {exam.difficulty}
                    </span>
                  </div>
                  
                  <h3 className="mt-4 text-base font-bold text-slate-900 tracking-tight leading-snug">
                    {exam.title}
                  </h3>
                  <p className="mt-2 text-xs text-slate-500 leading-relaxed font-normal">
                    {exam.description}
                  </p>
                </div>

                <div className="mt-8 pt-4 border-t border-slate-100 flex items-center justify-between">
                  <div className="flex items-center gap-4 text-[10px] font-semibold text-slate-400 uppercase">
                    <span className="flex items-center gap-1">
                      <Clock size={12} className="text-slate-400" />
                      {exam.timeLimitMinutes} Mins
                    </span>
                    <span className="flex items-center gap-1">
                      <HelpCircle size={12} className="text-slate-400" />
                      {exam.totalQuestions} Questions
                    </span>
                  </div>

                  <button
                    onClick={() => startExam(exam)}
                    className="flex h-9 items-center justify-center rounded-xl bg-emerald-800 hover:bg-emerald-900 px-4 font-bold text-xs text-white hover:text-white transition-all active:scale-95 cursor-pointer shadow-sm"
                  >
                    Start Test
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* 3. Dynamic Interactive Exam Session */}
      {sessionActive && activeModule && (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* Main Question Interface */}
          <div className="lg:col-span-3 flex flex-col justify-between bg-white rounded-3xl border border-slate-200 min-h-[500px] overflow-hidden shadow-md">
            
            {/* Session Topbar */}
            <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50 px-6 py-4">
              <div className="flex items-center gap-3">
                <GraduationCap className="h-5 w-5 text-emerald-700" />
                <div>
                  <h3 className="text-xs font-bold text-slate-900 tracking-tight">{activeModule.title}</h3>
                  <p className="text-[10px] text-slate-400 font-medium">Topic: {activeQuestions[currentQuestionIdx]?.category || "General Check"}</p>
                </div>
              </div>

              {/* Countdown counter */}
              <div className={`flex items-center gap-2 rounded-xl px-3.5 py-1.5 border font-mono text-sm font-bold ${
                timeLeft < 60 ? 'bg-red-50 border-red-200 text-red-600 animate-pulse' : 'bg-slate-100 border-slate-200 text-slate-700'
              }`}>
                <Clock size={16} />
                {formatTimer(timeLeft)}
              </div>
            </div>

            {/* Question body */}
            <div className="p-8 my-auto">
              <div className="flex items-start gap-4 mb-6">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-emerald-50 border border-emerald-100 text-xs font-bold text-emerald-800 text-slate-600">
                  {currentQuestionIdx + 1}
                </span>
                <h4 className="text-sm sm:text-base font-bold text-slate-900 leading-relaxed pt-0.5">
                  {activeQuestions[currentQuestionIdx]?.question}
                </h4>
              </div>

              {/* Diagnostic answers group */}
              <div className="grid grid-cols-1 gap-3.5 pl-0 sm:pl-11 mt-6">
                {activeQuestions[currentQuestionIdx]?.options.map((option, idx) => {
                  const isSelected = studentAnswers[activeQuestions[currentQuestionIdx].id] === option;
                  
                  return (
                    <button
                      key={idx}
                      onClick={() => handleSelectOption(activeQuestions[currentQuestionIdx].id, option)}
                      className={`w-full rounded-xl border p-4 text-left font-medium text-xs sm:text-sm cursor-pointer transition-all duration-200 ${
                        isSelected 
                          ? 'border-emerald-700 bg-emerald-50/50 text-emerald-900 font-semibold' 
                          : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50/50'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full font-bold text-[10px] transition-all ${
                          isSelected 
                            ? 'bg-emerald-800 text-white' 
                            : 'bg-slate-100 text-slate-500 border border-slate-200'
                        }`}>
                          {String.fromCharCode(65 + idx)}
                        </span>
                        <span>{option}</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Pagination Controls */}
            <div className="border-t border-slate-100 px-8 py-5 flex items-center justify-between bg-slate-50">
              <div className="flex gap-2">
                <button
                  disabled={currentQuestionIdx === 0}
                  onClick={() => setCurrentQuestionIdx(prev => prev - 1)}
                  className="flex h-10 w-10 items-center justify-center rounded-xl bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 enabled:active:scale-95 disabled:opacity-40 cursor-pointer"
                  title="Previous Question"
                >
                  <ChevronLeft size={18} />
                </button>
                
                <button
                  onClick={() => handleToggleFlag(activeQuestions[currentQuestionIdx].id)}
                  className={`flex h-10 px-4 items-center gap-2 rounded-xl border text-xs font-semibold cursor-pointer transition-colors ${
                    flaggedQuestions[activeQuestions[currentQuestionIdx].id]
                      ? 'bg-orange-50 border-orange-200 text-orange-600'
                      : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                  title="Flag question for later compilation review"
                >
                  <Flag size={14} className={flaggedQuestions[activeQuestions[currentQuestionIdx].id] ? 'fill-orange-500' : ''} />
                  <span className="hidden sm:inline">Flag for Review</span>
                </button>
              </div>

              <div className="flex items-center gap-3">
                {currentQuestionIdx < activeQuestions.length - 1 ? (
                  <button
                    onClick={() => setCurrentQuestionIdx(prev => prev + 1)}
                    className="flex h-10 items-center gap-2 rounded-xl bg-slate-900 border border-slate-900 px-5 font-bold text-xs uppercase tracking-widest text-white hover:bg-slate-800 transition active:scale-95 cursor-pointer"
                  >
                    Next Question
                    <ChevronRight size={14} />
                  </button>
                ) : (
                  <button
                    onClick={() => handleFormSubmit()}
                    className="flex h-10 items-center gap-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 px-6 font-bold text-xs uppercase tracking-widest text-white shadow-lg shadow-emerald-700/10 transition active:scale-95 cursor-pointer"
                  >
                    Finish & Submit
                  </button>
                )}
              </div>
            </div>

          </div>

          {/* Sidebar Navigation Panel & Matrix */}
          <div className="lg:col-span-1 space-y-6">
            
            {/* Instructions box */}
            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">Status Matrix</h4>
              
              {/* Question bubble grids */}
              <div className="grid grid-cols-5 gap-2.5">
                {activeQuestions.map((q, idx) => {
                  const isCurrent = currentQuestionIdx === idx;
                  const isAnswered = studentAnswers[q.id] !== undefined;
                  const isFlagged = flaggedQuestions[q.id] === true;

                  let bubbleClass = "border-slate-200 bg-white text-slate-600 hover:border-slate-400";
                  if (isCurrent) {
                    bubbleClass = "border-slate-900 bg-slate-900 text-white font-bold ring-2 ring-slate-900/10";
                  } else if (isFlagged) {
                    bubbleClass = "border-orange-300 bg-orange-100 text-orange-800 font-bold";
                  } else if (isAnswered) {
                    bubbleClass = "border-emerald-600 bg-emerald-50 text-emerald-800 font-bold";
                  }

                  return (
                    <button
                      key={q.id}
                      onClick={() => setCurrentQuestionIdx(idx)}
                      className={`flex aspect-square items-center justify-center rounded-xl border text-xs font-semibold cursor-pointer transition-all ${bubbleClass}`}
                    >
                      {idx + 1}
                    </button>
                  );
                })}
              </div>

              {/* Status explanation lists */}
              <div className="mt-6 border-t border-slate-100 pt-4 space-y-2.5 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded bg-white border border-slate-200" />
                  <span>Unvisited / Empty</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded bg-emerald-50 border border-emerald-600" />
                  <span>Answered Selected</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded bg-orange-100 border border-orange-300" />
                  <span>Flagged for Review</span>
                </div>
              </div>
            </div>

            {/* Abandon panel */}
            <button
              onClick={() => {
                if(confirm("Are you sure you want to abandon the current test? All active session responses will be lost permanently.")) {
                  setSessionActive(false);
                  setActiveModule(null);
                }
              }}
              className="w-full flex h-11 items-center justify-center gap-2 rounded-xl bg-red-55 px-4 font-bold text-xs uppercase tracking-widest text-red-650 border border-red-100 hover:bg-red-50 hover:text-red-700 transition cursor-pointer"
            >
              Cancel Examination
            </button>

          </div>

        </div>
      )}

      {/* 4. Examination Confirmation Dialog */}
      <AnimatePresence>
        {showConfirmSubmit && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl relative"
            >
              <h3 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3">Submit Examination Papers</h3>
              <p className="text-xs text-slate-500 leading-relaxed mt-3">
                You have solved <span className="text-slate-900 font-extrabold">{Object.keys(studentAnswers).length}</span> of <span className="text-slate-900 font-extrabold">{activeQuestions.length}</span> question options. 
                Are you absolutely sure you want to complete the evaluation now and lock your diagnostic grade?
              </p>

              <div className="mt-6 flex justify-end gap-3">
                <button
                  onClick={() => setShowConfirmSubmit(false)}
                  className="flex h-10 items-center justify-center rounded-xl border border-slate-200 bg-white px-5 text-xs font-semibold text-slate-600 hover:bg-slate-50 transition cursor-pointer"
                >
                  Go Back
                </button>
                <button
                  onClick={() => handleFormSubmit(true)}
                  className="flex h-10 items-center justify-center rounded-xl bg-emerald-700 px-5 text-xs font-bold text-white hover:bg-emerald-800 transition cursor-pointer"
                >
                  Yes, Submit Now
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 5. Post-Exam Analysis Dashboard / Score Report */}
      {examResult && !sessionActive && (
        <motion.div 
          initial={{ opacity: 0, y: 15 }} 
          animate={{ opacity: 1, y: 0 }}
          className="space-y-8"
        >
          {/* Back btn block */}
          <button
            onClick={() => {
              setExamResult(null);
              setActiveModule(null);
            }}
            className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-500 hover:text-emerald-700 transition-colors cursor-pointer"
          >
            <ArrowLeft size={16} /> Returns to Exam Center
          </button>

          {/* Result Card Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Summary score ring */}
            <div className="md:col-span-1 bg-white rounded-3xl border border-slate-200 p-6 flex flex-col items-center justify-center text-center shadow-sm">
              <Award className="h-10 w-10 text-emerald-600 mb-3" />
              <h3 className="text-sm font-bold uppercase tracking-widest text-slate-400">Performance Status</h3>
              
              <div className="relative mt-6 flex items-center justify-center">
                {/* SVG Circle visual */}
                <svg className="h-32 w-32">
                  <circle
                    className="text-slate-150"
                    strokeWidth="8"
                    stroke="currentColor"
                    fill="transparent"
                    r="52"
                    cx="64"
                    cy="64"
                  />
                  <circle
                    className="text-emerald-600 transition-all duration-1000"
                    strokeWidth="8"
                    strokeDasharray={2 * Math.PI * 52}
                    strokeDashoffset={2 * Math.PI * 52 * (1 - examResult.accuracy / 100)}
                    strokeLinecap="round"
                    stroke="currentColor"
                    fill="transparent"
                    r="52"
                    cx="64"
                    cy="64"
                  />
                </svg>
                <div className="absolute flex flex-col items-center justify-center">
                  <span className="text-2xl font-extrabold text-slate-800">{examResult.accuracy}%</span>
                  <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wide">Accuracy</span>
                </div>
              </div>

              <div className="mt-6">
                <span className={`inline-flex rounded-xl px-4 py-1.5 font-bold text-xs uppercase tracking-widest ${
                  examResult.accuracy >= 70 ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' : 'bg-red-50 text-red-600 border border-red-150'
                }`}>
                  {examResult.accuracy >= 70 ? '✓ Examination Passed' : '✗ Needs revision'}
                </span>
              </div>
            </div>

            {/* Diagnostic numerical items */}
            <div className="md:col-span-2 bg-white rounded-3xl border border-slate-200 p-8 flex flex-col justify-between shadow-sm">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Mock Examination Metrics</span>
                <h3 className="text-xl font-bold text-slate-800 mt-1">{examResult.module.title}</h3>
                <p className="text-xs text-slate-500 leading-relaxed mt-2">
                  This report logs your speed metrics, diagnostic correct selections, and serves review paths. 
                  Below lies detailed feedback checking where mistakes occurred and connecting instantly to our AI tutoring mechanism to request step proofs.
                </p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 mt-8 border-t border-slate-100 pt-6">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Total Correct</span>
                  <span className="text-base font-extrabold text-slate-900 mt-1 block">{examResult.score} / {examResult.total}</span>
                </div>
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Time Spent</span>
                  <span className="text-base font-extrabold text-slate-900 mt-1 block">{formatElapsedTime(examResult.timeSpentSeconds)}</span>
                </div>
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Avg Time/Quest</span>
                  <span className="text-base font-extrabold text-slate-900 mt-1 block">{Math.round(examResult.timeSpentSeconds / examResult.total)}s</span>
                </div>
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Result Target</span>
                  <span className="text-base font-extrabold text-emerald-600 mt-1 block">Min 70%</span>
                </div>
              </div>
            </div>

          </div>

          {/* Interactive AI Review Node lists */}
          <div className="space-y-4">
            <h3 className="text-base font-bold text-slate-900 border-b border-slate-200 pb-3">Complete Answer Review & AI Deep-Dive</h3>
            
            <div className="space-y-4">
              {examResult.module.questions.map((question, idx) => {
                const userSelected = examResult.answersSnapshot[question.id];
                const isCorrect = userSelected === question.correctAnswer;
                const aiExpl = aiExplanations[question.id];
                
                return (
                  <div 
                    key={question.id}
                    className="bg-white rounded-2xl border border-slate-200 p-6 flex flex-col md:flex-row gap-6 justify-between shadow-sm hover:border-slate-300 transition-colors duration-200"
                  >
                    
                    {/* Left side problem spec */}
                    <div className="flex-1 space-y-4">
                      <div className="flex items-center gap-2">
                        <span className="flex h-6 w-6 items-center justify-center rounded bg-slate-100 text-xs font-bold text-slate-600">
                          {idx + 1}
                        </span>
                        <span className={`inline-flex items-center gap-1 rounded px-2 py-0.5 text-[10px] font-bold uppercase ${
                          isCorrect ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-600'
                        }`}>
                          {isCorrect ? <CheckCircle size={10} /> : <AlertTriangle size={10} />}
                          {isCorrect ? 'Correct Answer' : 'Incorrect Choice'}
                        </span>
                        <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                          Category: {question.category}
                        </span>
                      </div>

                      <h4 className="text-sm font-bold text-slate-900 leading-snug">
                        {question.question}
                      </h4>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2">
                        {question.options.map((opt, optIdx) => {
                          const isUsers = opt === userSelected;
                          const isCorrectOpt = opt === question.correctAnswer;
                          
                          let cardClass = "border-slate-100 bg-white text-slate-600";
                          if (isCorrectOpt) {
                            cardClass = "border-emerald-200 bg-emerald-50/20 text-emerald-800 font-semibold";
                          } else if (isUsers) {
                            cardClass = "border-red-150 bg-red-50/10 text-red-700 font-medium";
                          }

                          return (
                            <div key={optIdx} className={`rounded-xl border p-2.5 text-xs flex items-center gap-2 ${cardClass}`}>
                              <span className={`text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded ${
                                isCorrectOpt ? 'bg-emerald-600 text-white' :
                                isUsers ? 'bg-red-500 text-white' : 'bg-slate-100 text-slate-500'
                              }`}>
                                {String.fromCharCode(65 + optIdx)}
                              </span>
                              <span>{opt}</span>
                            </div>
                          );
                        })}
                      </div>

                      {/* Display server-generated tutor breakdown with sparkling effect */}
                      <AnimatePresence>
                        {aiExpl && (
                          <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-emerald-50/20 border border-emerald-500/10 p-4 rounded-xl mt-4"
                          >
                            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-700 mb-1.5">
                              <Sparkles size={14} className="text-emerald-500" />
                              AI Scholar Proof & Explanation
                            </div>
                            <p className="text-xs text-slate-600 font-medium leading-relaxed whitespace-pre-line">
                              {aiExpl}
                            </p>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>

                    {/* Right side interactive button to fetch proof */}
                    <div className="md:w-56 shrink-0 flex flex-col justify-center border-t md:border-t-0 md:border-l border-slate-100 pt-4 md:pt-0 md:pl-6">
                      {!aiExpl ? (
                        <button
                          disabled={explainingId === question.id}
                          onClick={() => loadAIExplanation(question, userSelected)}
                          className="w-full flex h-10 items-center justify-center gap-2 rounded-xl border border-emerald-100 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 hover:text-emerald-800 text-xs font-bold uppercase tracking-wider transition cursor-pointer disabled:opacity-50"
                        >
                          {explainingId === question.id ? (
                            <>
                              <RefreshCw size={14} className="animate-spin text-emerald-600" />
                              Constructing...
                            </>
                          ) : (
                            <>
                              <Sparkles size={14} />
                              Analyze Steps
                            </>
                          )}
                        </button>
                      ) : (
                        <div className="text-center">
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest text-emerald-600">
                            <CheckCircle size={12} /> Steps Solved
                          </span>
                        </div>
                      )}
                    </div>

                  </div>
                );
              })}
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};
