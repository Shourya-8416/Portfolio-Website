import { Project } from '@/types/project';

/**
 * Centralized project data store.
 * Migrated from Works.tsx with added slug and shortDescription fields.
 */
export const projects: Project[] = [
  {
    slug: "serverless-ai-image-editing",
    title: "Serverless AI Image Editing Platform (AWS Bedrock)",
    shortDescription: "GenAI-powered image generation and editing using AWS Bedrock",
    fullDescription:
      "A fully serverless web application that enables users to generate and edit images using Generative AI prompts. Built with Amazon Bedrock (Titan Image Generator) and AWS-native services to deliver a scalable, secure, production-ready GenAI solution without managing servers or ML infrastructure.",
    techStack: [
      "Amazon Bedrock",
      "AWS Lambda",
      "API Gateway",
      "DynamoDB",
      "AWS Amplify",
      "Amazon Cognito",
      "Serverless",
    ],
    img: "/project_1.png",
    gitLink: "https://github.com/Shourya-8416/Image-Editing-Tool",
    liveLink: "",
  },
  {
    slug: "ai-credit-risk-engine",
    title: "AI Credit Risk & Eligibility Decision Engine",
    shortDescription: "AI-powered credit risk assessment and loan eligibility system",
    fullDescription:
      "An AI-powered backend system designed for fintech and financial platforms to assess credit risk and loan eligibility. Built using Java and Spring Boot, the system combines rule-based financial scoring with LLM-driven reasoning to classify applicants into High, Medium, and Low Risk categories while generating explainable approval or rejection decisions.",
    techStack: [
      "Java",
      "Spring Boot",
      "REST APIs",
      "MySQL",
      "LangChain4j",
      "LLM Integration",
      "FAISS",
      "FinTech Risk Scoring",
    ],
    img: "/project-2.png",
    gitLink: "https://github.com/your_username/ai-credit-risk-engine",
    liveLink: "",
  },
  {
    slug: "chatbot-rag",
    title: "Context-Aware Chatbot with Vector Search (RAG)",
    shortDescription: "Spring Boot chatbot with RAG for context-aware responses",
    fullDescription:
      "A Spring Boot–based chatbot that integrates an open-source LLM with vector search to deliver accurate, context-aware responses. Implements Retrieval-Augmented Generation (RAG) using embeddings and similarity search to reduce hallucinations and improve answer relevance.",
    techStack: [
      "Java",
      "Spring Boot",
      "Open-source LLM",
      "Vector Search (FAISS)",
      "SQL",
      "REST APIs",
    ],
    img: "/project-3.png",
    gitLink: "https://github.com/your_username/chatbot-rag",
    liveLink: "",
  },
  {
    slug: "task-workflow-system",
    title: "Cloud-Native Task & Workflow Management System",
    shortDescription: "Full-stack task management with role-based access on AWS",
    fullDescription:
      "A full-stack web application built with Spring Boot and React for managing tasks and workflows with role-based access. Features secure REST APIs, SQL-backed persistence, and cloud deployment on AWS following scalable backend design principles.",
    techStack: [
      "Java",
      "Spring Boot",
      "React",
      "SQL",
      "AWS EC2",
      "AWS RDS",
      "JWT",
    ],
    img: "/project-4.png",
    gitLink: "https://github.com/your_username/task-workflow-system",
    liveLink: "",
  },
];

/**
 * Retrieves a project by its unique slug.
 * @param slug - The unique identifier for the project
 * @returns The Project object if found, undefined otherwise
 */
export function getProjectBySlug(slug: string): Project | undefined {
  return projects.find((p) => p.slug === slug);
}

/**
 * Retrieves all projects from the data store.
 * @returns Array of all Project objects
 */
export function getAllProjects(): Project[] {
  return projects;
}
