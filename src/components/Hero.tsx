import { Play } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import { BackgroundVideo } from "./BackgroundVideo";
import { Navigation } from "./Navigation";

type HeroProps = {
  videoUrl: string;
};

export function Hero({ videoUrl }: HeroProps) {
  const reduceMotion = useReducedMotion();
  const initial = reduceMotion ? false : { opacity: 0, y: 24 };
  const animate = { opacity: 1, y: 0 };

  return (
    <section
      id="top"
      className="relative flex min-h-[100dvh] w-full flex-col overflow-hidden"
    >
      <BackgroundVideo src={videoUrl} />
      <div className="absolute inset-0 z-[1] bg-white/20" />
      <div className="absolute inset-0 z-[2] bg-gradient-to-b from-white/35 via-white/10 to-white/25" />
      <div className="absolute inset-x-0 bottom-0 z-[3] h-40 bg-gradient-to-t from-[#f7f7fb] to-transparent" />

      <Navigation />

      <div className="relative z-10 mx-auto flex w-full max-w-6xl flex-1 flex-col items-center justify-center px-5 pb-16 text-center sm:px-8">
        <motion.h1
          initial={initial}
          animate={animate}
          transition={{ duration: 0.8, delay: 0.22, ease: [0.16, 1, 0.3, 1] }}
          aria-label="不免-个人网站"
          className="hero-title-zh max-w-[22rem] text-balance text-[3.45rem] leading-[0.95] text-[#1B133C] sm:max-w-5xl sm:text-[5.6rem] sm:leading-[0.9] md:text-[6.6rem] lg:text-[7.2rem]"
        >
          <span className="block translate-x-[0.055em]">不免-个人网站</span>
        </motion.h1>

        <motion.span
          initial={initial}
          animate={animate}
          transition={{ duration: 0.75, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="mt-5 h-px w-20 bg-gradient-to-r from-transparent via-[#1B133C]/28 to-transparent sm:mt-6 sm:w-28"
          aria-hidden="true"
        />

        <motion.p
          initial={initial}
          animate={animate}
          transition={{ duration: 0.75, delay: 0.34, ease: [0.16, 1, 0.3, 1] }}
          className="hero-subtitle-zh mt-5 max-w-2xl text-[13px] leading-7 text-[#1B133C]/68 sm:mt-6 sm:text-[15px] md:text-base"
        >
          一个关于编导专业大学生的作品档案
        </motion.p>

        <motion.div
          initial={initial}
          animate={animate}
          transition={{ duration: 0.75, delay: 0.44, ease: [0.16, 1, 0.3, 1] }}
          className="mt-7 flex flex-col items-center gap-3 sm:mt-8 sm:flex-row"
        >
          <a
            href="#works"
            className="inline-flex items-center gap-2 whitespace-nowrap rounded-xl bg-[#FEFEFE] px-6 py-3 text-sm font-semibold text-[#1B133C] shadow-[0px_4px_12px_rgba(27,19,60,0.15)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0px_6px_16px_rgba(27,19,60,0.2)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-orange-500 active:translate-y-px sm:px-8 sm:py-3.5"
          >
            <Play className="h-4 w-4" aria-hidden="true" />
            查看全部作品
          </a>
        </motion.div>
      </div>
    </section>
  );
}
