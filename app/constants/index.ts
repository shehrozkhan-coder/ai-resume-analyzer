export interface Resume {
  id: string;
  companyName: string;
  jobTitle: string;
  imagePath: string;
  resumePath: string;
  feedback: {
    overallScore: number;
    ATS: {
      score: number;
      tips: { type: "good" | "improve"; tip: string }[];
    };
    toneAndStyle: {
      score: number;
      tips: { type: "good" | "improve"; tip: string }[];
    };
    content: {
      score: number;
      tips: { type: "good" | "improve"; tip: string }[];
    };
    structure: {
      score: number;
      tips: { type: "good" | "improve"; tip: string }[];
    };
    skills: {
      score: number;
      tips: { type: "good" | "improve"; tip: string }[];
    };
  };
}

export const resumes: Resume[] = [
  {
    id: "1",
    companyName: "Google",
    jobTitle: "Frontend Developer",
    imagePath: "/images/resume_01.png",
    resumePath: "/resumes/resume-1.pdf",
    feedback: {
      overallScore: 85,
      ATS: { score: 90, tips: [] },
      toneAndStyle: { score: 90, tips: [] },
      content: { score: 90, tips: [] },
      structure: { score: 90, tips: [] },
      skills: { score: 90, tips: [] },
    },
  },
  {
    id: "2",
    companyName: "Microsoft",
    jobTitle: "Cloud Engineer",
    imagePath: "/images/resume_02.png",
    resumePath: "/resumes/resume-2.pdf",
    feedback: {
      overallScore: 55,
      ATS: { score: 90, tips: [] },
      toneAndStyle: { score: 90, tips: [] },
      content: { score: 90, tips: [] },
      structure: { score: 90, tips: [] },
      skills: { score: 90, tips: [] },
    },
  },
  {
    id: "3",
    companyName: "Apple",
    jobTitle: "iOS Developer",
    imagePath: "/images/resume_03.png",
    resumePath: "/resumes/resume-3.pdf",
    feedback: {
      overallScore: 75,
      ATS: { score: 90, tips: [] },
      toneAndStyle: { score: 90, tips: [] },
      content: { score: 90, tips: [] },
      structure: { score: 90, tips: [] },
      skills: { score: 90, tips: [] },
    },
  },
  {
    id: "4",
    companyName: "Amazon",
    jobTitle: "Backend Developer",
    imagePath: "/images/resume_04.png",
    resumePath: "/resumes/resume-4.pdf",
    feedback: {
      overallScore: 68,
      ATS: { score: 85, tips: [] },
      toneAndStyle: { score: 80, tips: [] },
      content: { score: 75, tips: [] },
      structure: { score: 70, tips: [] },
      skills: { score: 72, tips: [] },
    },
  },
  {
    id: "5",
    companyName: "Meta",
    jobTitle: "React Developer",
    imagePath: "/images/resume_05.png",
    resumePath: "/resumes/resume-5.pdf",
    feedback: {
      overallScore: 90,
      ATS: { score: 95, tips: [] },
      toneAndStyle: { score: 92, tips: [] },
      content: { score: 88, tips: [] },
      structure: { score: 91, tips: [] },
      skills: { score: 89, tips: [] },
    },
  },
  {
    id: "6",
    companyName: "Netflix",
    jobTitle: "Full Stack Developer",
    imagePath: "/images/resume_06.png",
    resumePath: "/resumes/resume-6.pdf",
    feedback: {
      overallScore: 73,
      ATS: { score: 78, tips: [] },
      toneAndStyle: { score: 74, tips: [] },
      content: { score: 70, tips: [] },
      structure: { score: 72, tips: [] },
      skills: { score: 76, tips: [] },
    },
  },
];


export const AIResponseFormat = `
interface Feedback {
  overallScore: number;
  ATS: {
    score: number;
    tips: {
      type: "good" | "improve";
      tip: string;
    }[];
  };
  toneAndStyle: {
    score: number;
    tips: {
      type: "good" | "improve";
      tip: string;
      explanation: string;
    }[];
  };
  content: {
    score: number;
    tips: {
      type: "good" | "improve";
      tip: string;
      explanation: string;
    }[];
  };
  structure: {
    score: number;
    tips: {
      type: "good" | "improve";
      tip: string;
      explanation: string;
    }[];
  };
  skills: {
    score: number;
    tips: {
      type: "good" | "improve";
      tip: string;
      explanation: string;
    }[];
  };
}`;

export const prepareInstructions = ({
  jobTitle,
  jobDescription,
  AIResponseFormat,
}: {
  jobTitle: string;
  jobDescription: string;
  AIResponseFormat: string;
}) =>
  `You are an expert in ATS (Applicant Tracking System) and resume analysis.
Please analyze and rate this resume and suggest how to improve it.
The rating can be low if the resume is bad.
Be thorough and detailed. Don't be afraid to point out any mistakes or areas for improvement.
If there is a lot to improve, don't hesitate to give low scores. This is to help the user to improve their resume.
If available, use the job description for the job user is applying to to give more detailed feedback.
If provided, take the job description into consideration.
The job title is: ${jobTitle}
The job description is: ${jobDescription}
Provide the feedback using the following format: ${AIResponseFormat}
Return the analysis as a JSON object, without any other text and without the backticks.
Do not include any other text or comments.`;
