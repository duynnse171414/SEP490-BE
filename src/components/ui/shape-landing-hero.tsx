"use client";

import { motion } from "framer-motion";
import { Circle } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTheme } from "next-themes"; // Import useTheme hook

function ElegantShape({
    className,
    delay = 0,
    width = 400,
    height = 100,
    rotate = 0,
    gradient = "from-white/[0.08]",
    mode, // Receive mode from parent
}: {
    className?: string;
    delay?: number;
    width?: number;
    height?: number;
    rotate?: number;
    gradient?: string;
    mode: string | undefined; // Mode can be undefined during initial load
}) {
    const isDarkMode = mode === "dark";

    const baseGradientDark = "from-white/[0.08]";
    const baseGradientLight = "from-gray-800/[0.05]";

    const calculatedGradient = gradient || (isDarkMode ? baseGradientDark : baseGradientLight);
    const borderColorClass = isDarkMode ? "border-white/[0.15]" : "border-gray-300/[0.2]";
    const shadowClassDark = "shadow-[0_8px_32px_0_rgba(255,255,255,0.1)]";
    const shadowClassLight = "shadow-[0_8px_32px_0_rgba(0,0,0,0.05)]";
    const shadowClass = isDarkMode ? shadowClassDark : shadowClassLight;
    const afterRadialGradientDark = "after:bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.2),transparent_70%)]";
    const afterRadialGradientLight = "after:bg-[radial-gradient(circle_at_50%_50%,rgba(0,0,0,0.1),transparent_70%)]";
    const afterRadialGradientClass = isDarkMode ? afterRadialGradientDark : afterRadialGradientLight;


    return (
        <motion.div
            initial={{
                opacity: 0,
                y: -150,
                rotate: rotate - 15,
            }}
            animate={{
                opacity: 1,
                y: 0,
                rotate: rotate,
            }}
            transition={{
                duration: 2.4,
                delay,
                ease: [0.23, 0.86, 0.39, 0.96],
                opacity: { duration: 1.2 },
            }}
            className={cn("absolute", className)}
        >
            <motion.div
                animate={{
                    y: [0, 15, 0],
                }}
                transition={{
                    duration: 12,
                    repeat: Number.POSITIVE_INFINITY,
                    ease: "easeInOut",
                }}
                style={{
                    width,
                    height,
                }}
                className="relative"
            >
                <div
                    className={cn(
                        "absolute inset-0 rounded-full",
                        "bg-gradient-to-r to-transparent",
                        calculatedGradient,
                        "backdrop-blur-[2px] border-2",
                        borderColorClass,
                        shadowClass,
                        "after:absolute after:inset-0 after:rounded-full",
                        afterRadialGradientClass
                    )}
                />
            </motion.div>
        </motion.div>
    );
}

function HeroGeometric({
    badge = "Design Collective",
    title1 = "Elevate Your Digital Vision",
    title2 = "Crafting Exceptional Websites",
    title3 = "Through Innovative Design",
}: {
    badge?: string;
    title1?: string;
    title2?: string;
    title3?: string;
}) {
    const fadeUpVariants = {
        hidden: { opacity: 0, y: 30 },
        visible: (i: number) => ({
            opacity: 1,
            y: 0,
            transition: {
                duration: 1,
                delay: 0.5 + i * 0.2,
                ease: [0.25, 0.4, 0.25, 1],
            },
        }),
    };

    const { theme } = useTheme(); // Use next-themes hook
    const isDarkMode = theme === "dark";

    const bgColorClass = isDarkMode ? "bg-[#030303]" : "bg-white";
    const bgGradientClass = isDarkMode
        ? "bg-gradient-to-br from-indigo-500/[0.05] via-transparent to-rose-500/[0.05]"
        : "bg-gradient-to-br from-blue-200/[0.1] via-transparent to-purple-200/[0.1]";
    const bottomGradientClass = isDarkMode
        ? "bg-gradient-to-t from-[#030303] via-transparent to-[#030303]/80"
        : "bg-gradient-to-t from-white via-transparent to-white/80";
    const badgeBgClass = isDarkMode ? "bg-white/[0.03] border border-white/[0.08]" : "bg-gray-100/[0.8] border border-gray-200";
    const textColorClass = isDarkMode ? "text-white" : "text-gray-800";
    const textMutedColorClass = isDarkMode ? "text-white/40" : "text-gray-500";
    const badgeTextColorClass = isDarkMode ? "text-white/60" : "text-gray-600";
    const titleGradientClass = isDarkMode
        ? "bg-gradient-to-b from-white to-white/80"
        : "bg-gradient-to-b from-gray-800 to-gray-700/80";
    const titleGradientSecondaryClass = isDarkMode
        ? "bg-gradient-to-r from-indigo-300 via-white/90 to-rose-300"
        : "bg-gradient-to-r from-blue-400 via-gray-700/90 to-purple-400";


    return (
        <div className={cn("relative min-h-screen w-full flex items-center justify-center overflow-hidden", bgColorClass)}>
            <div className={cn("absolute inset-0 blur-3xl", bgGradientClass)} />

            <div className="absolute inset-0 overflow-hidden">
                <ElegantShape
                    delay={0.3}
                    width={600}
                    height={140}
                    rotate={12}
                    gradient={isDarkMode ? "from-indigo-500/[0.15]" : "from-blue-300/[0.1]"}
                    className="left-[-10%] md:left-[-5%] top-[15%] md:top-[20%]"
                    mode={theme}
                />

                <ElegantShape
                    delay={0.5}
                    width={500}
                    height={120}
                    rotate={-15}
                    gradient={isDarkMode ? "from-rose-500/[0.15]" : "from-red-300/[0.1]"}
                    className="right-[-5%] md:right-[0%] top-[70%] md:top-[75%]"
                    mode={theme}
                />

                <ElegantShape
                    delay={0.4}
                    width={300}
                    height={80}
                    rotate={-8}
                    gradient={isDarkMode ? "from-violet-500/[0.15]" : "from-purple-300/[0.1]"}
                    className="left-[5%] md:left-[10%] bottom-[5%] md:bottom-[10%]"
                    mode={theme}
                />

                <ElegantShape
                    delay={0.6}
                    width={200}
                    height={60}
                    rotate={20}
                    gradient={isDarkMode ? "from-amber-500/[0.15]" : "from-yellow-300/[0.1]"}
                    className="right-[15%] md:right-[20%] top-[10%] md:top-[15%]"
                    mode={theme}
                />

                <ElegantShape
                    delay={0.7}
                    width={150}
                    height={40}
                    rotate={-25}
                    gradient={isDarkMode ? "from-cyan-500/[0.15]" : "from-teal-300/[0.1]"}
                    className="left-[20%] md:left-[25%] top-[5%] md:top-[10%]"
                    mode={theme}
                />
            </div>

            <div className="relative z-10 container mx-auto px-4 md:px-6">
                <div className="max-w-3xl mx-auto text-center">
                    <motion.div
                        custom={0}
                        variants={fadeUpVariants}
                        initial="hidden"
                        animate="visible"
                        className={cn("inline-flex items-center gap-2 px-3 py-1 rounded-full", badgeBgClass, "mb-8 md:mb-12")}
                    >
                        <Circle className={cn("h-2 w-2", isDarkMode ? "fill-rose-500/80" : "fill-red-500/80")} />
                        <span className={cn("text-sm tracking-wide", badgeTextColorClass)}>
                            {badge}
                        </span>
                    </motion.div>

                    <motion.div
                        custom={1}
                        variants={fadeUpVariants}
                        initial="hidden"
                        animate="visible"
                    >
                        <h1 className="text-4xl sm:text-6xl md:text-8xl font-bold mb-6 md:mb-8 tracking-tight">
                            <span className={cn("bg-clip-text text-transparent", titleGradientClass, textColorClass)}>
                                {title1}
                            </span>
                            <br />
                            <span
                                className={cn(
                                    "bg-clip-text text-transparent", titleGradientSecondaryClass
                                )}
                            >
                                {title2}
                            </span>
                        </h1>
                    </motion.div>

                    <motion.div
                        custom={2}
                        variants={fadeUpVariants}
                        initial="hidden"
                        animate="visible"
                    >
                        <p className={cn("text-base sm:text-lg md:text-xl mb-8 leading-relaxed font-light tracking-wide max-w-xl mx-auto px-4", textMutedColorClass)}>
                            {title3}
                        </p>
                    </motion.div>
                </div>
            </div>

            <div className={cn("absolute inset-0 pointer-events-none", bottomGradientClass)} />
        </div>
    );
}

export { HeroGeometric }
