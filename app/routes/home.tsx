import Navbar from "~/components/Navbar";
import type { Route } from "./+types/home";
import { resumes } from "../constants";
import ResumeCard from "~/components/ResumeCard";
import { usePuterStore } from "~/lib/puter";
import { useNavigate } from "react-router";
import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Resume-AI – Build Smarter. Get Hired Faster." },
    {
      name: "description",
      content:
        "Resume-AI uses advanced AI to generate professional, ATS-friendly resumes that help you stand out and get hired faster.",
    },
  ];
}

export default function Home() {
  const { auth } = usePuterStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (!auth.isAuthenticated) navigate('/auth?next=/')
  }, [auth.isAuthenticated]);

  return (
    <>
      <Navbar />
      <main className="bg-[url('/images/bg-main.svg')] bg-cover">
        <section className="main-section">
          <div className="page-heading py-16">
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            >
              Track Your Applications & Resume Ratings
            </motion.h1>
            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
            >
              Review your submissions and check AI-powered feedback.
            </motion.h2>
          </div>

          <AnimatePresence>
            {resumes.length > 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
                className="resumes-section"
              >
                {resumes.map((resume, index) => (
                  <motion.div
                    key={resume.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ 
                      duration: 0.5, 
                      delay: index * 0.1,
                      ease: "easeOut" 
                    }}
                  >
                    <ResumeCard resume={resume} />
                  </motion.div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </section>
      </main>
    </>
  );
}