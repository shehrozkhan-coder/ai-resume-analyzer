import { Link, useLocation } from "react-router";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { useState } from "react";

const Navbar = () => {
  const [isHovered, setIsHovered] = useState(false);
  const location = useLocation();

  const isHome = location.pathname === "/";
  const targetRoute = isHome ? "/upload" : "/";
  const buttonText = isHome ? "Upload Resume" : "Go Home";

  return (
    <motion.nav
      initial={{ opacity: 0, y: -50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="fixed top-0 left-0 w-full z-50 backdrop-blur-md bg-white/70"
      style={{
        boxShadow:
          "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "1rem 1.5rem",
      }}
    >
      <Link to="/">
        <p className="text-2xl font-bold text-gradient">ResuLens-AI</p>
      </Link>

      <Link
        to={targetRoute}
        className="primary-button w-fit"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <span className="flex items-center gap-2">
          {buttonText}
          <motion.span
            initial={{ x: -10, opacity: 0 }}
            animate={{
              x: isHovered ? 0 : -10,
              opacity: isHovered ? 1 : 0,
            }}
            transition={{ duration: 0.3 }}
            className="inline-block"
          >
            <ArrowRight size={18} />
          </motion.span>
        </span>
      </Link>
    </motion.nav>
  );
};

export default Navbar;
