import { QuizData } from "../types/cTypes";

export const courses = [
  {
    id: "1",
    title: "Course 1",
    thumbnail: "/images/dummycardimage.svg",
    studentCount: 999,
    progress: 70,
  },
  {
    id: "2",
    title: "Course 1",
    thumbnail: "/images/dummycardimage.svg",
    studentCount: 999,
    progress: 70,
  },
  {
    id: "3",
    title: "Course 1",
    thumbnail: "/images/dummycardimage.svg",
    studentCount: 999,
    progress: 70,
  },
  {
    id: "4",
    title: "Course 1",
    thumbnail: "/images/dummycardimage.svg",
    studentCount: 999,
    progress: 70,
  },
  {
    id: "5",
    title: "Course 1",
    thumbnail: "/images/dummycardimage.svg",
    studentCount: 999,
    progress: 70,
  },
  {
    id: "6",
    title: "Course 1",
    thumbnail: "/images/dummycardimage.svg",
    studentCount: 999,
    progress: 70,
  },
];

export const courseData = {
  id: "1",
  title: "Course Details",
  image: "/images/courses/class-header.svg",
  description:
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum varius, dui nec auctor pellentesque, purus massa pulvinar odio, in lacinia mauris erat eu dolor. Etiam semper, lacus id vulputate blandit, nunc libero imperdiet sem, varius luctus lorem sapien nec ex. Curabitur sollicitudin nisi nec eleifend dignissim.",
  topics: [
    {
      id: "1",
      title: "Topic 1",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum varius, dui nec auctor pellentesque, purus massa pulvinar odio, in lacinia mauris erat eu dolor.",
      status: "completed" as const,
      materials: [
        { id: "1", title: "Kata Pengantar", isCompleted: true },
        { id: "2", title: "Materi 1", isCompleted: true },
        { id: "3", title: "Materi 2", isCompleted: true },
        { id: "4", title: "Uji Pemahaman", isCompleted: true },
      ],
    },
    {
      id: "2",
      title: "Topic 2",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum varius, dui nec auctor pellentesque, purus massa pulvinar odio, in lacinia mauris erat eu dolor.",
      status: "in-progress" as const,
      materials: [
        { id: "1", title: "Kata Pengantar", isCompleted: true },
        { id: "2", title: "Materi 1", isCompleted: false },
        { id: "3", title: "Materi 2", isCompleted: false },
        { id: "4", title: "Uji Pemahaman", isCompleted: false },
      ],
    },
    {
      id: "3",
      title: "Topic 3",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum varius, dui nec auctor pellentesque.",
      status: "locked" as const,
      materials: [
        { id: "1", title: "Kata Pengantar", isCompleted: false },
        { id: "2", title: "Uji Pemahaman", isCompleted: false },
      ],
    },
  ],
};

export const courseInfoData = {
  progress: {
    current: 200,
    total: 2500,
  },
  teachers: [{ name: "Dian Pratiwi" }, { name: "Dian Pratiwi" }],
  participants: [{ name: "Dian Pratiwi" }, { name: "Dian Pratiwi" }, { name: "Dian Pratiwi" }],
  totalParticipants: 103,
  lastAccessed: "Sunday, 28 Dec 2025",
};

export const topicData = {
  id: "1",
  title: "Topic 1",
  description:
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum varius, dui nec auctor pellentesque, purus massa pulvinar odio, in lacinia mauris erat eu dolor.",
  materials: [
    { id: "1", title: "Kata Pengantar", isCompleted: true, duration: "5 min" },
    { id: "2", title: "Materi 1", isCompleted: true, duration: "15 min" },
    { id: "3", title: "Materi 2", isCompleted: false, duration: "20 min" },
    { id: "4", title: "Uji Pemahaman", isCompleted: false, duration: "10 min" },
  ],
};

export const materiData = {
  id: "1",
  title: "Kata Pengantar",
  description:
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum varius, dui nec auctor pellentesque, purus massa pulvinar odio, in lacinia mauris erat eu dolor. Etiam semper, lacus id vulputate blandit, nunc libero imperdiet sem, varius luctus lorem sapien nec ex. Curabitur sollicitudin nisi nec eleifend dignissim.",
  bannerImage: "/images/materi-banner.webp",
  sections: [
    {
      title: "Apa yang kamu ketahui?",
      content: `
        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce malesuada rutrum id at commodo. Praesent interdum nec ipsum ut vestibulum. Nunc at lectus malesuada erat egestas eleifend vulputat nec elit. Vivamus ipsum odio, bibendum in lorem porta, porta dictum tellus. Etiam blandit bibendum ligula, ac commodo nisi efficitur ac. Morbi vulputate auctor nisi. altrumque non tincipiat. Sed non blandit metus, ut ultricies verem. Curabitur dictum et libero et suscipit. Curabitur quis dolor lobortis leo. Vestibulum quum condimentum, malesauada erel id, suscipit eros. Maecenas facilisis quam at commodo volutpriol. Pellentesque a consectetur metus, ut verus ardi.</p>
        <br/>
        <p>Nullam fermentum, tellus vitae aliquet tempor, dolor et ornare nibh, vel hendrerit odio sapien et arcu. Class aptent taciti sociosqu ad litora turquent per conubia nostra, per inceptos himenaeos.</p>
        <br/>
        <div class="relative w-full aspect-video my-6 rounded-xl overflow-hidden shadow-lg">
            <img src="/images/courses/class-header.svg" alt="Class Header" class="w-full h-full object-cover" />
        </div>
        <br/>
        <p>Mauris pulvinar auctor egestsa. Vestibulum vulputate ullamcorper risus, ac feugiet augue dignissim eget. Duis ornare suscipit massam auctor. Donec vitae tempor urna. Suspendisse quis est veroputius ullamtrichies imprediet. Donec rhoncus, risus ut aliquet impediet, quam turpis feugiat massa malio vulp posue diam. Etirm suspidis in tellus ssciaus auctor. Maecenas ut porlibortis:</p>
        <br/>
        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce malesuada rutrum nid at commodo. Praesent interdum nec ipsum ut vestibulum. Nunc at lectus malesuada arat egestas eleifend vulupat nec elit. Vivamus ipsum odio, bibendum in lorem porta, porta dictum tellus. Etiam blandit bibendum ligula, ac commodo nisi efficitur ac. Morbi vulputate auctor nisi. altrumque non tincipiat. Sed non blandit metus, ut ultricies verem. Curabitur dictum et libero et suscipit. Curabitur quis dolor lobortis leo. Vestibulum quam condimentum, malesauada erel id, suscipit eros. Maecenas facilisis quam at commodo volutpriol. Pellentesque a consectetur metus, ut verus ardi.</p>
      `,
    },
  ],
  quiz: {
    id: 1,
    title: "Soal No. 1",
    text: "Bagaimana cara kamu mengetahui hal yang kamu ketahui itu dapat kamu ketahui?",
    image: "/images/quiz-image.webp",
    options: [
      { label: "A", text: "Dengan saya mengetahui yang saya ketahui." },
      { label: "B", text: "Dengan saya mengetahui yang saya ketahui." },
      { label: "C", text: "Dengan saya mengetahui yang saya ketahui." },
      { label: "D", text: "Dengan saya mengetahui yang saya ketahui." },
      { label: "E", text: "Dengan saya mengetahui yang saya ketahui." },
    ],
  },
};

export const quizData: QuizData = {
  id: "1",
  title: "Quiz 1",
  description:
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum varius, dui nec auctor pellentesque, purus massa pulvinar odio, in lacinia mauris erat eu dolor. Etiam semper, lacus id vulputate blandit, nunc libero imperdiet sem, varius luctus lorem sapien nec ex. Curabitur sollicitudin nisi nec eleifend dignissim.",
  questions: [
    {
      id: "1",
      question: "Bagaimana cara kamu mengetahui hal yang kamu ketahui itu dapat kamu ketahui?",
      image: "/images/quiz-image.webp",
      options: [
        "Dengan saya mengetahui yang saya ketahui.",
        "Dengan saya mengetahui yang saya ketahui.",
        "Dengan saya mengetahui yang saya ketahui.",
        "Dengan saya mengetahui yang saya ketahui.",
      ],
      correctAnswer: 0,
    },
    {
      id: "2",
      question: "Apa yang dimaksud dengan pembelajaran aktif?",
      options: [
        "Pembelajaran yang melibatkan siswa secara aktif",
        "Pembelajaran dengan mendengarkan saja",
        "Pembelajaran dengan membaca buku",
        "Pembelajaran dengan menonton video",
      ],
      correctAnswer: 0,
    },
    {
      id: "3",
      question: "Mengapa refleksi penting dalam proses belajar?",
      options: [
        "Untuk menghabiskan waktu",
        "Untuk memahami apa yang telah dipelajari",
        "Untuk mendapat nilai bagus",
        "Untuk mengikuti tren",
      ],
      correctAnswer: 1,
    },
  ],
  previousAttempt: {
    completionPoints: 350,
    correctAnswers: 10,
    totalQuestions: 20,
    averageTime: 5.22,
  },
};
