import React, { useEffect } from "react";
import Link from "next/link";
import { Syne } from "next/font/google";
import { useView } from "@/contexts/ViewContext";
import { useInView } from "react-intersection-observer";
import AnimatedBody from "../ui/AnimatedBody";
import AnimatedTitle from "../ui/AnimatedTitle";

const syne = Syne({ subsets: ["latin"] });

export default function About() {
  const { setSectionInView } = useView();

  const { ref, inView } = useInView({
    threshold: 0.2,
    rootMargin: "-100px 0px",
  });

  useEffect(() => {
    if (inView) setSectionInView("about");
  }, [inView, setSectionInView]);

  return (
    <section ref={ref} className="pt-24 md:pt-[150px]" id="about">
      <AnimatedTitle
        wordSpace={"mr-[14px]"}
        charSpace={"mr-[0.001em]"}
        className={`uppercase ${syne.className} antialiased text-4xl md:text-5xl xl:text-6xl font-bold opacity-80`}
      >
        I build intelligent backend systems
      </AnimatedTitle>

      <div className="grid grid-cols-1 lg:grid-cols-[8.5fr_3.5fr] gap-8 mt-6">
        <div className="grid grid-cols-1 antialiased gap-6 text-white/80 text-xl md:text-2xl">
          <AnimatedBody className="leading-[34px] md:leading-[39px]">
            I specialize in building scalable Java-based backend systems and
            integrating Generative AI to solve real-world problems. My work
            focuses on designing clean REST APIs, reliable data pipelines, and
            AI-enhanced services that improve automation, accuracy, and system
            efficiency.
          </AnimatedBody>

          <AnimatedBody className="leading-[34px] md:leading-[39px]">
            I have hands-on experience with Spring Boot, MySQL, and cloud-native
            development on AWS. I actively work with LLM integrations, semantic
            search, and AI-assisted validation workflows, combining traditional
            backend engineering with modern GenAI capabilities.
          </AnimatedBody>

          <AnimatedBody className="inline leading-[34px] md:leading-[39px]">
            I enjoy solving backend challenges around scalability, performance,
            and system design, while continuously exploring how AI can enhance
            backend workflows. I focus on building production-ready systems that
            are maintainable, efficient, and intelligent. Want to know more?
            Here&apos;s <br className="hidden md:block" />
          <Link
            className="underline"
            href="https://drive.google.com/file/d/1AyCANGQuX-q1gid1JAGpEmnIuHolIq2d/view?usp=sharing"
            target="_blank"
            rel="noopener noreferrer"
            >
            my resume
          </Link>

            .
          </AnimatedBody>
        </div>

        <div className="grid grid-cols-1 gap-4">
          <div>
            <AnimatedTitle
              wordSpace={"mr-[0.5ch]"}
              charSpace={"mr-[0.001em]"}
              className="font-bold antialiased text-xl md:text-2xl mb-2"
            >
              Backend & Cloud
            </AnimatedTitle>
            <AnimatedBody className="text-white/60 text-base md:text-xl leading-8">
              Java, Spring Boot, REST APIs, MySQL, JPA, Hibernate, AWS EC2, S3,
              Cloud Fundamentals, Linux.
            </AnimatedBody>
          </div>

          <div>
            <AnimatedTitle
              wordSpace={"mr-[0.5ch]"}
              charSpace={"mr-[0.001em]"}
              className="font-bold antialiased text-xl md:text-2xl mb-2"
            >
              GenAI & AI Agents
              </AnimatedTitle>
              <AnimatedBody className="text-white/60 text-base md:text-xl leading-8">
                LLM Integration, Amazon Bedrock, AI Agents, Agent Orchestration, LangChain4j,
                Prompt Engineering, NLP Classification, Vector Search (FAISS),
                AI-assisted Workflows.
              </AnimatedBody>
          </div>

          <div>
            <AnimatedTitle
              wordSpace={"mr-[0.5ch]"}
              charSpace={"mr-[0.001em]"}
              className="font-bold antialiased text-xl md:text-2xl mb-2"
            >
              DevOps & Tooling
            </AnimatedTitle>
            <AnimatedBody className="text-white/60 text-base md:text-xl leading-8">
              Git, GitHub, Maven, Docker, Kubernetes, CI/CD Fundamentals, Postman,
              Linux Shell.
            </AnimatedBody>
          </div>
        </div>
      </div>
    </section>
  );
}
