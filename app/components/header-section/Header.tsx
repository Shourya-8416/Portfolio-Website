"use client";
import { useView } from "@/contexts/ViewContext";
import { Icon } from "@iconify/react/dist/iconify.js";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { usePathname } from "next/navigation";
import MobileMenu from "./MobileMenu";
import { AnimatePresence } from "framer-motion";

export default function Header() {
  const { sectionInView } = useView();
  const [menuOpen, setMenuOpen] = useState<boolean>(false);
  const pathname = usePathname();
  const isBlogPage = pathname?.startsWith("/blog");

  return (
    <>
      <div className="fixed max-w-[90%] xl:max-w-[1223px] w-full z-10 select-none">
        <div className="flex justify-between items-center px-6 py-4 rounded-2xl bg-gradient-to-r from-[#d9d9d91f] to-[#7373731f] mt-4 sm:mt-8 std-backdrop-blur">
          <Link href="/">
            <Image
              src="/logo.png"
              width={50}
              height={20}
              alt="logo"
              className="select-none"
            />
          </Link>
          <div className="flex items-center gap-4 sm:hidden">
            <Link href="/blog" className={`text-xl ${isBlogPage ? "text-[#E3D3BE]" : ""}`}>
              <Icon icon="mdi:post-outline" />
            </Link>
            <Icon
              onClick={() => setMenuOpen(!menuOpen)}
              className="cursor-pointer text-2xl"
              icon={`${menuOpen ? "gg:close" : "lucide:menu"}`}
            />
          </div>

          <ul className="hidden sm:flex gap-8 lg:gap-12 text-white/25">
            <Link
              href={isBlogPage ? "/#home" : "#home"}
              className={`${!isBlogPage && sectionInView === "home" && "text-white"} hover:text-white transition-colors`}
            >
              Home
            </Link>
            <Link
              href={isBlogPage ? "/#about" : "#about"}
              className={`${!isBlogPage && sectionInView === "about" && "text-white"} hover:text-white transition-colors`}
            >
              About
            </Link>            
            <Link
              href={isBlogPage ? "/#work" : "#work"}
              className={`${!isBlogPage && sectionInView === "work" && "text-white"} hover:text-white transition-colors`}
            >
              Work
            </Link>
            <Link
              href={isBlogPage ? "/#contact" : "#contact"}
              className={`${!isBlogPage && sectionInView === "contact" && "text-white"} hover:text-white transition-colors`}
            >
              Contact
            </Link>
          </ul>
          <div className="gap-5 text-xl hidden sm:flex">
            <Link
              target="_blank"
              href="https://www.linkedin.com/in/shaurya-mishra-b380711a5/"
            >
              <Icon icon="hugeicons:linkedin-01" />
            </Link>
            <Link target="_blank" href="https://github.com/Shourya-8416">
              <Icon icon="hugeicons:github" />
            </Link>
            <Link target="_blank" href="https://x.com/shauryamishra_">
              <Icon icon="akar-icons:x-fill" />
            </Link>
            <Link href="/blog" className={isBlogPage ? "text-[#E3D3BE]" : ""}>
              <Icon icon="mdi:post-outline" />
            </Link>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {menuOpen && <MobileMenu onMenuOpen={setMenuOpen} />}
      </AnimatePresence>
    </>
  );
}
