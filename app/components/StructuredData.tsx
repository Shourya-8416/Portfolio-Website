export default function StructuredData() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "Shourya Mishra",
    url: "https://shouryamishra.site",
    image: "https://shouryamishra.site/profile_picture.png",
    jobTitle: "Software Developer",
    worksFor: {
      "@type": "Organization",
      name: "Independent",
    },
    sameAs: [
      "https://github.com/Shourya-8416",
      "https://www.linkedin.com/in/shaurya-mishra-b380711a5/",
      "https://x.com/shauryamishra_",
    ],
    knowsAbout: [
      "Java",
      "Spring Boot",
      "Backend Development",
      "GenAI",
      "LLM Integration",
      "AWS",
      "Cloud Computing",
      "REST APIs",
      "Software Engineering",
    ],
    description:
      "Software Developer specializing in Java backend systems, GenAI integrations, and AWS cloud solutions.",
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
}
