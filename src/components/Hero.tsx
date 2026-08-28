import { motion, useReducedMotion } from "framer-motion";
import { BackgroundVideo } from "./BackgroundVideo";
import { MaskedHeading } from "./MaskedHeading";
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
        <motion.div
          initial={initial}
          animate={animate}
          transition={{ duration: 0.8, delay: 0.22, ease: [0.16, 1, 0.3, 1] }}
          className="w-full max-w-[19rem] text-center sm:max-w-4xl"
        >
          <MaskedHeading
            align="center"
            className="hero-title-zh text-[2.8rem] leading-[0.95] sm:text-[4.35rem] sm:leading-[0.9] md:text-[5.2rem] lg:text-[5.6rem]"
            drift={7}
            fillScale={1.36}
            mediaType="video"
            parallax={14}
            reveal="rise"
            src={videoUrl}
            text="不免-个人网站"
          />
        </motion.div>

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

      </div>
    </section>
  );
}
