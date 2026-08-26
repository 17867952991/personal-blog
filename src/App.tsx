import { useEffect } from "react";
import { ContactSection } from "./components/ContactSection";
import { Hero } from "./components/Hero";
import { LoadingScreen } from "./components/LoadingScreen";
import { WorksSection } from "./components/WorksSection";
import { showreelVideoUrl } from "./data/works";

function useHashScroll() {
  useEffect(() => {
    const scrollToHash = () => {
      const id = decodeURIComponent(window.location.hash.replace("#", ""));

      if (!id) {
        return;
      }

      window.setTimeout(() => {
        document.getElementById(id)?.scrollIntoView({
          behavior: "smooth",
          block: "start"
        });
      }, 0);
    };

    scrollToHash();
    window.addEventListener("hashchange", scrollToHash);

    return () => {
      window.removeEventListener("hashchange", scrollToHash);
    };
  }, []);
}

export default function App() {
  useHashScroll();

  return (
    <>
      <LoadingScreen />
      <div className="min-h-screen bg-[#f7f7fb] text-[#1B133C]">
        <Hero videoUrl={showreelVideoUrl} />
        <main>
          <WorksSection />
        </main>
        <ContactSection />
        <footer className="mx-auto max-w-[1400px] px-5 pb-8 text-center text-xs font-medium text-[#1B133C]/55 sm:px-8">
          导演作品集 / 电影、叙事与视觉作品 / 你的名字
        </footer>
      </div>
    </>
  );
}
