import { motion } from "framer-motion";
import { Skeleton } from "@/components/ui/skeleton";

const SplashScreen = () => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.8, ease: "easeInOut" }}
      className="flex h-screen w-full flex-col items-center justify-center"
    >
      {/* Logo Animation */}
      <motion.div
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1, ease: "easeInOut" }}
      >
        <Skeleton className="h-16 w-16 rounded-ful" />
      </motion.div>

      {/* Title & Subtitle */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.2, delay: 0.5, ease: "easeInOut" }}
        className="mt-6 text-center"
      >
        <Skeleton className="h-6 w-48 mx-auto" />
        <Skeleton className="mt-2 h-4 w-36 mx-auto" />
      </motion.div>

      {/* Loading Bar */}
      <motion.div
        initial={{ width: "0%" }}
        animate={{ width: "80%" }}
        transition={{ duration: 2.5, ease: "easeInOut" }}
        className="mt-8 h-2 w-80 rounded-full overflow-hidden"
      >
        <motion.div
          animate={{
            width: ["0%", "30%", "60%", "100%"],
            backgroundColor: ["#4b5563", "#9ca3af", "#4b5563"],
          }}
          transition={{ duration: 2.5, ease: "easeInOut", repeat: Infinity }}
          className="h-full rounded-full"
        />
      </motion.div>
    </motion.div>
  );
};

export default SplashScreen;
