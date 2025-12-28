"use client";
import Hero from "./components/hero-section/Hero";
import Works from "./components/work-section/Works";
import About from "./components/about-section/About";
import Experience from "./components/work-section/Experience";
import Contact from "./components/contact+footer/Contact";
import Footer from "./components/contact+footer/Footer";

export default function Home() {
  return (
    <main>
      <Hero />
      <About />
      <Experience />
      <Works />
      <Contact />
      <Footer />
    </main>
  );
}
