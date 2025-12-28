"use client";
import { useEffect } from "react";
import { useInView } from "react-intersection-observer";
import { useView } from "@/contexts/ViewContext";
import Title from "../ui/Title";
import TimelineItem from "./TimelineItem";

const TimelineData = [
  {
    companyImg: "/company1.png",
    jobTitle: "Freelancing & Professional Development",
    company: "Independent",
    jobType: "Self-Directed / Freelancee",
    duration: "May 2025 - Present",
    stuffIDid: [
      "Focused on continuous professional development through hands-on backend projects, freelancing assignments, and real-world problem solving.",
      "Worked on freelance and independent projects involving Java, Spring Boot, REST APIs, and MySQL, delivering backend features and automation solutions.",
      "Actively building and experimenting with Generative AI systems, including LLM integration, prompt engineering, and AI-assisted workflows.",
      "Exploring AI agent architectures using Amazon Bedrock, focusing on reasoning, tool orchestration, and backend service integration.",
      "Studying and applying Strands-style agent workflows to design autonomous, goal-driven AI systems on AWS-native infrastructure.",
      "Continuously strengthening system design, cloud fundamentals, and scalable backend practices aligned with modern software engineering standards.",
    ]  
  },
  {
    companyImg: "/company1.png",
    jobTitle: "Software Intern – Backend Development",
    company: "Career Catalyst Global Consulting",
    jobType: "Internship",
    duration: "Nov 2024 - May 2025",
    stuffIDid: [
      "Designed and developed a Java-based email automation system using JavaMail API and SMTP for large-scale campaign delivery.",
      "Integrated AI-assisted lead validation using LLM-based text analysis to clean and enrich lead data, improving targeting accuracy.",
      "Built tracking and reporting modules to monitor engagement metrics, improving delivery performance and reducing manual effort.",
      "Worked with REST APIs, MySQL, and backend workflows to support scalable and maintainable systems.",
    ],
  },
];

export default function Experience() {
  const { setSectionInView } = useView();

  const { ref, inView } = useInView({
    threshold: 0.15,
    rootMargin: "-100px 0px -40% 0px",
  });

  useEffect(() => {
    if (inView) setSectionInView("work");
  }, [inView, setSectionInView]);

  return (
    <section id="experience" className="pt-[110px]" ref={ref}>
      <Title>Work Experience</Title>

      <div className="flex mt-6 gap-4 pl-3">
        <div className="w-3 h-auto bg-gradient-to-b from-white to-transparent" />

        <div className="flex flex-col gap-10">
          {TimelineData.map((item, index) => (
            <TimelineItem
              key={index}
              companyImg={item.companyImg}
              jobTitle={item.jobTitle}
              company={item.company}
              jobType={item.jobType}
              duration={item.duration}
              stuffIDid={item.stuffIDid}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
