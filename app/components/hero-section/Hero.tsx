"use client";
import Image from "next/image";
import React, { useEffect, useRef } from "react";
import {
  delay,
  easeIn,
  easeInOut,
  motion,
  useScroll,
  useTransform,
} from "framer-motion";
// @ts-ignore
import "intersection-observer";
import { useInView } from "react-intersection-observer";
import { useView } from "@/contexts/ViewContext";

export default function Hero() {
  const handWaveAnimation = {
    rotate: [0, 15, -10, 15, -10, 15, -10, 15, -10, 15, 0],
    transition: {
      duration: 1.5,
      ease: easeInOut,
    },
  };

  const animateIn1 = {
    opacity: [0, 1],
    y: ["1rem", "0px"],
    transition: {
      delay: 1.5,
      duration: 0.7,
      ease: easeIn,
    },
  };

  const animateIn2 = {
    ...animateIn1,
    transition: {
      ...animateIn1.transition,
      delay: 2,
    },
  };

  const { setSectionInView } = useView();

  const imgRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: imgRef,
  });

  const { ref, inView } = useInView({
    threshold: 0.4,
    rootMargin: "-100px 0px",
  });

  useEffect(() => {
    if (inView) setSectionInView("home");
  }, [inView, setSectionInView]);

  const rotate = useTransform(scrollYProgress, [0, 1], ["0deg", "-15deg"]);

  return (
    <section
      ref={ref}
      className="pt-36 sm:pt-0 flex flex-col sm:flex-row h-dvh items-center gap-6 sm:justify-between"
      id="home"
    >
      <div className="text sm:w-[60%]">
        <motion.div
          className="grid grid-cols-9 w-fit smm:flex gap-2 mb-2 xl:mb-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.1, ease: "easeOut" }}
        >
          <p className="text-white/60 text-xl smm:text-2xl mb-3 smm:mb-0 lg:text-3xl col-span-6">
            Hey, there
          </p>
          <motion.div
            animate={handWaveAnimation}
            style={{ transformOrigin: "bottom right" }}
            className="col-span-3"
          >
            <Image
              src="/hand-wave.svg"
              width={30}
              height={30}
              alt="hand-waving"
            />
          </motion.div>
        </motion.div>
        <motion.h1
          className="text-[32px] smm:text-[40px] md:text-5xl lg:text-6xl xl:text-7xl leading-tight font-bold"
          initial={{ opacity: 0 }}
          animate={animateIn1}
        >
          <p className="text-white/60 inline">I&apos;m </p>
          <span className="bg-gradient-to-br bg-clip-text text-transparent from-[#7CC0C4] via-[#548FBA] to-[#3C84C7]">
          Shourya Mishra
          </span>
          <p>a Software Developer</p>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={animateIn2}
          className="text-white/30  text-xl smm:text-2xl lg:text-3xl xl:text-1xl mt-3 smm:mt-6 "
        >
          building scalable Java backend systems with GenAI, LLM integrations, and AWS-powered cloud infrastructure to deliver intelligent, production-ready applications.
        </motion.p>
      </div>

      {/* IMAGE */}
      <div className="w-full sm:w-auto flex justify-center">
        <motion.div
          ref={imgRef}
          style={{ rotate }}
          className="
            relative
            aspect-square
            w-[220px]
            sm:w-[260px]
            md:w-[320px]
            lg:w-[380px]
            xl:w-[420px]
            flex
            items-center
            justify-center
          "
          initial={{ opacity: 0 }}
          animate={animateIn1}
        >
          <Image
            src="/profile_picture.png"
            priority
            fill
            alt="Shourya-Profile-Picture"
            className="
              bg-image-radial
              rounded-2xl
              object-cover
              object-center
              scale-[0.92]
            "
          />
        </motion.div>

      </div>
    </section>
  );
}
