import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

// Expanded list of colorful gradient combinations
const gradients = [
  "from-red-500 via-yellow-500 to-green-500",
  "from-blue-500 via-purple-500 to-pink-500",
  "from-green-500 via-cyan-500 to-blue-500",
  "from-orange-500 via-red-500 to-purple-500",
  "from-yellow-500 via-orange-500 to-red-500",
  "from-pink-500 via-purple-500 to-indigo-500",
  "from-rose-500 via-pink-500 to-fuchsia-500",
  "from-violet-500 via-purple-500 to-indigo-500",
  "from-cyan-500 via-blue-500 to-indigo-500",
  "from-emerald-500 via-green-500 to-teal-500",
  "from-amber-500 via-orange-500 to-yellow-500",
  "from-lime-500 via-green-500 to-emerald-500",
  "from-fuchsia-500 via-violet-500 to-indigo-500",
  "from-sky-500 via-cyan-500 to-blue-500",
  "from-red-500 via-pink-500 to-purple-500",
  "from-blue-500 via-teal-500 to-emerald-500",
  "from-orange-500 via-amber-500 to-yellow-500",
  "from-indigo-500 via-blue-500 to-cyan-500",
  "from-rose-500 via-red-500 to-orange-500",
  "from-teal-500 via-cyan-500 to-sky-500"
];

const getRandomGradient = () => gradients[Math.floor(Math.random() * gradients.length)];

const TopLoadingBar = () => {
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const [gradient, setGradient] = useState(getRandomGradient());

  useEffect(() => {
    setLoading(true);
    setGradient(getRandomGradient()); // Change gradient on route change

    const timer = setTimeout(() => setLoading(false), 500); // Adjust duration as needed
    return () => clearTimeout(timer);
  }, [location]);

  return (
    <motion.div
      initial={{ width: "0%" }}
      animate={{ width: loading ? "100%" : "0%" }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className={`fixed top-0 left-0 h-1 bg-gradient-to-r ${gradient}`}
    />
  );
};

export default TopLoadingBar;