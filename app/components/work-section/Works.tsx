import React, { useEffect } from "react";
import FolioCard from "./FolioCard";
import Title from "../ui/Title";
import { useView } from "@/contexts/ViewContext";

// @ts-ignore
import "intersection-observer";
import { useInView } from "react-intersection-observer";
import Timeline from "./Timeline";

export default function Works() {
  const { setSectionInView } = useView();

  const works = [
  {
    title: "Serverless AI Image Editing Platform (AWS Bedrock)",
    gitLink: "https://github.com/Shourya-8416/Image-Editing-Tool",
    liveLink: "",
    about:
      "A fully serverless web application that enables users to generate and edit images using Generative AI prompts. Built with Amazon Bedrock (Titan Image Generator) and AWS-native services to deliver a scalable, secure, production-ready GenAI solution without managing servers or ML infrastructure.",
    stack: [
      "Amazon Bedrock",
      "AWS Lambda",
      "API Gateway",
      "DynamoDB",
      "AWS Amplify",
      "Amazon Cognito",
      "Serverless",
    ],
    img: "/project_1.png",
  },
  {
    title: "AI Credit Risk & Eligibility Decision Engine",
    gitLink: "https://github.com/your_username/ai-credit-risk-engine",
    liveLink: "",
    about:
      "An AI-powered backend system designed for fintech and financial platforms to assess credit risk and loan eligibility. Built using Java and Spring Boot, the system combines rule-based financial scoring with LLM-driven reasoning to classify applicants into High, Medium, and Low Risk categories while generating explainable approval or rejection decisions.",
    stack: [
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
  },
  // {
  //   title: "AI Agent Orchestration Platform (AWS Bedrock & Strands)",
  //   gitLink: "https://github.com/your_username/ai-agent-orchestration",
  //   liveLink: "",
  //   about:
  //     "A backend platform inspired by AWS Strands-style architecture where multiple AI agents collaborate to reason, plan, and execute tasks. Uses Amazon Bedrock for LLM-powered decision-making and tool orchestration across backend services and APIs.",
  //   stack: [
  //     "Amazon Bedrock",
  //     "AI Agents",
  //     "Java",
  //     "Spring Boot",
  //     "AWS",
  //     "REST APIs",
  //   ],
  //   img: "/project.png",
  // },
  {
    title: "Context-Aware Chatbot with Vector Search (RAG)",
    gitLink: "https://github.com/your_username/chatbot-rag",
    liveLink: "",
    about:
      "A Spring Boot–based chatbot that integrates an open-source LLM with vector search to deliver accurate, context-aware responses. Implements Retrieval-Augmented Generation (RAG) using embeddings and similarity search to reduce hallucinations and improve answer relevance.",
    stack: [
      "Java",
      "Spring Boot",
      "Open-source LLM",
      "Vector Search (FAISS)",
      "SQL",
      "REST APIs",
    ],
    img: "/project-3.png",
  },
  {
    title: "Cloud-Native Task & Workflow Management System",
    gitLink: "https://github.com/your_username/task-workflow-system",
    liveLink: "",
    about:
      "A full-stack web application built with Spring Boot and React for managing tasks and workflows with role-based access. Features secure REST APIs, SQL-backed persistence, and cloud deployment on AWS following scalable backend design principles.",
    stack: [
      "Java",
      "Spring Boot",
      "React",
      "SQL",
      "AWS EC2",
      "AWS RDS",
      "JWT",
    ],
    img: "/project-4.png",
  },
];


  const { ref, inView } = useInView({
    threshold: 0.1,
    rootMargin: "-100px 0px",
  });

  useEffect(() => {
    if (inView) setSectionInView("work");
  }, [inView, setSectionInView]);

  return (
    <section
      className="flex flex-col gap-6 md:gap-10 pt-[110px]"
      ref={ref}
      id="work"
    >
      <Title>Projects</Title>
      {works.map((work, index) => (
        <FolioCard
          key={index}
          img={work.img}
          title={work.title}
          gitLink={work.gitLink}
          liveLink={work.liveLink}
          about={work.about}
          stack={work.stack}
        />
      ))}

      <Timeline />
    </section>
  );
}
