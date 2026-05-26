export interface Lesson {
  id: string;
  title: string;
  duration: string;
  videoUrl?: string;
}

export interface Course {
  id: string;
  title: string;
  description: string;
  longDescription: string;
  thumbnail: string;
  instructor: string;
  instructorBio: string;
  instructorPhoto?: string;
  category: string;
  level: string;
  prerequisites: string[];
  duration: string;
  lessons: Lesson[];
}

export const SAMPLE_COURSES: Course[] = [
  {
    id: 'course_1',
    title: 'Modern Digital Literacy',
    description: 'Essential digital skills for the modern world.',
    longDescription: 'This course provides a comprehensive introduction to the digital landscape, covering everything from online safety to productivity tools.',
    thumbnail: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&auto=format&fit=crop&q=60',
    instructor: 'Abebe B.',
    instructorBio: 'Expert in digital inclusion and technology education with over a decade of experience helping underserved communities navigate the digital divide. Abebe has led numerous national initiatives focused on basic computer proficiency and safe internet practices.',
    instructorPhoto: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=60',
    category: 'Digital Literacy',
    level: 'Beginner',
    prerequisites: ['Basic internet access'],
    duration: '4 Weeks',
    lessons: [
      { id: 'l1', title: 'Introduction to Digital Tools', duration: '15m' },
      { id: 'l2', title: 'Navigating the Web Safely', duration: '20m' },
      { id: 'l3', title: 'Cloud Collaboration Basics', duration: '25m' },
    ]
  },
  {
    id: 'course_2',
    title: 'Web Development Hub',
    description: 'Build modern websites from scratch.',
    longDescription: 'Master HTML, CSS, and JavaScript to build responsive and interactive websites.',
    thumbnail: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&auto=format&fit=crop&q=60',
    instructor: 'Sara K.',
    instructorBio: 'Senior Full Stack Developer and coding instructor passionate about building scalable web applications. Sara specializes in modern frontend frameworks and has mentored hundreds of aspiring developers into successful tech careers.',
    instructorPhoto: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&auto=format&fit=crop&q=60',
    category: 'Technology',
    level: 'Intermediate',
    prerequisites: ['Basic computer skills'],
    duration: '6 Weeks',
    lessons: [
      { id: 'l4', title: 'HTML5 Semantic Structure', duration: '30m' },
      { id: 'l5', title: 'Modern CSS with Flexbox', duration: '45m' },
      { id: 'l6', title: 'JavaScript Fundamentals', duration: '60m' },
    ]
  },
  {
    id: 'course_3',
    title: 'Entrepreneurship Skills',
    description: 'Launch your digital business venture.',
    longDescription: 'Learn how to validate ideas, build MVPs, and scale your tech startup.',
    thumbnail: 'https://images.unsplash.com/photo-1556761175-b413da4baf72?w=800&auto=format&fit=crop&q=60',
    instructor: 'Amanuel T.',
    instructorBio: 'Venture builder and business strategist who has helped launch over 20 successful startups in the East African region. Amanuel brings real-world experience in identifying market gaps and building sustainable business models.',
    instructorPhoto: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&auto=format&fit=crop&q=60',
    category: 'Business',
    level: 'Beginner',
    prerequisites: ['None'],
    duration: '5 Weeks',
    lessons: [
      { id: 'l7', title: 'Idea Validation Techniques', duration: '40m' },
      { id: 'l8', title: 'Building a Lean MVP', duration: '50m' },
      { id: 'l9', title: 'Digital Marketing Basics', duration: '35m' },
    ]
  },
  {
    id: 'course_4',
    title: 'Advanced AI & Data Science',
    description: 'Master complex machine learning models.',
    longDescription: 'Deep dive into neural networks, natural language processing, and advanced data visualization techniques.',
    thumbnail: 'https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?w=800&auto=format&fit=crop&q=60',
    instructor: 'Dr. Tadesse',
    instructorBio: 'PhD in Computer Science and AI Research Lead. Dr. Tadesse has published extensively on neural network optimization and is a frequent speaker at international machine learning conferences.',
    instructorPhoto: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&auto=format&fit=crop&q=60',
    category: 'Technology',
    level: 'Advanced',
    prerequisites: ['Linear Algebra', 'Python proficiency'],
    duration: '10 Weeks',
    lessons: [
      { id: 'l10', title: 'Neural Network Architecture', duration: '90m' },
      { id: 'l11', title: 'NLP and Transformer Models', duration: '120m' },
    ]
  },
  {
    id: 'course_5',
    title: 'Precision Welding & VR Safety',
    description: 'Practical training for industrial excellence.',
    longDescription: 'A specialized TVET course focusing on precision welding techniques and safety procedures, enhanced by VR simulations for risk-free practice.',
    thumbnail: 'https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=800&auto=format&fit=crop&q=60',
    instructor: 'Engineer Daniel',
    instructorBio: 'Certified Industrial Specialist with 15 years in heavy manufacturing. Daniel combines traditional technical mastery with modern pedagogical approaches, including virtual reality integration for vocational training.',
    instructorPhoto: 'https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?w=400&auto=format&fit=crop&q=60',
    category: 'Vocation',
    level: 'Intermediate',
    prerequisites: ['Basic mechanical knowledge'],
    duration: '8 Weeks',
    lessons: [
      { id: 'l12', title: 'Industrial Safety Fundamentals', duration: '40m' },
      { id: 'l13', title: 'VR Module: Arc Welding Basics', duration: '60m' },
      { id: 'l14', title: 'Advanced Fusion Techniques', duration: '55m' },
    ]
  },
  {
    id: 'course_6',
    title: 'Research Methodology & Data Ethics',
    description: 'Core foundation for university-level research.',
    longDescription: 'A comprehensive guide to qualitative and quantitative research methods, focusing on ethical data collection and academic publishing standards in the digital age.',
    thumbnail: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=800&auto=format&fit=crop&q=60',
    instructor: 'Prof. Amara',
    instructorBio: 'Senior Academic Advisor with 20+ years in Higher Education leadership. Prof. Amara is dedicated to elevating research standards and ethical considerations in the African academic landscape.',
    instructorPhoto: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&auto=format&fit=crop&q=60',
    category: 'Academic',
    level: 'Intermediate',
    prerequisites: ['Undergraduate status'],
    duration: '12 Weeks',
    lessons: [
      { id: 'l15', title: 'Defining Research Questions', duration: '50m' },
      { id: 'l16', title: 'Digital Tools for Bibliometrics', duration: '65m' },
      { id: 'l17', title: 'Ethical Peer Review Processes', duration: '45m' },
    ]
  },
  {
    id: 'course_7',
    title: 'University E-Infrastructure Management',
    description: 'Transforming legacy campuses into smart hubs.',
    longDescription: 'Specialized training for university IT departments on implementing campus-wide high-speed networks, secure data centers, and digital student services.',
    thumbnail: 'https://images.unsplash.com/photo-1558403194-611308249627?w=800&auto=format&fit=crop&q=60',
    instructor: 'Abebe K.',
    instructorBio: 'Chief Technology Officer at a leading National Research & Education Network. Abebe has architected large-scale e-infrastructures that connect hundreds of institutions, ensuring robust and secure digital ecosystems.',
    instructorPhoto: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400&auto=format&fit=crop&q=60',
    category: 'Technology',
    level: 'Advanced',
    prerequisites: ['Network administration basics'],
    duration: '10 Weeks',
    lessons: [
      { id: 'l18', title: 'Campus Network Security', duration: '70m' },
      { id: 'l19', title: 'Implementing Student Information Systems', duration: '85m' },
    ]
  },
  {
    id: 'course_8',
    title: 'Digital Design for Everyone',
    description: 'Learn the fundamentals of graphic design using free digital tools.',
    longDescription: 'Explore the world of visual communication. This course covers color theory, typography, and layout design using accessible web-based tools shortcutting the need for expensive software.',
    thumbnail: 'https://images.unsplash.com/photo-1558655146-d09347e92766?w=800&auto=format&fit=crop&q=60',
    instructor: 'Lensa M.',
    instructorBio: 'Creative Director with experience in brand identity and UX design. Lensa is dedicated to making design education accessible to all, focusing on how visual storytelling can empower communities and businesses.',
    instructorPhoto: 'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=400&auto=format&fit=crop&q=60',
    category: 'Creative',
    level: 'Beginner',
    prerequisites: ['Basic computer skills'],
    duration: '5 Weeks',
    lessons: [
      { id: 'l20', title: 'The Power of Visual Communication', duration: '20m' },
      { id: 'l21', title: 'Color Theory & Emotional Impact', duration: '35m' },
      { id: 'l22', title: 'Layout Principles for Web & Print', duration: '40m' },
    ]
  }
];
