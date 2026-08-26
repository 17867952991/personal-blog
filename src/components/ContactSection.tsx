import { Mail } from "lucide-react";
import { SectionReveal } from "./SectionReveal";

const channels = [
  { label: "邮箱", value: "3598938817@qq.com", icon: Mail, href: "mailto:yourname@portfolio.com" },
  { label: "QQ", value: "3598938817", icon: Mail, href: "mailto:yourname@portfolio.com" },
   { label: "B站", value: "UID:498521218", icon: Mail, href: "https://space.bilibili.com/498521218" },
];

export function ContactSection() {
  return (
    <SectionReveal
      id="contact"
      className="mx-auto max-w-6xl scroll-mt-24 px-5 py-16 sm:px-8 md:py-28"
    >
      <div className="rounded-xl border border-[#1B133C]/10 bg-white/62 p-6 text-center shadow-[0_24px_90px_rgba(27,19,60,0.1)] backdrop-blur-2xl sm:p-10 md:p-14">
        <img
          src="/avatar.jpg"
          alt="头像"
          className="mx-auto h-24 w-24 rounded-full border border-[#1B133C]/10 object-cover shadow-[0_12px_36px_rgba(27,19,60,0.18)] ring-4 ring-white/70 sm:h-28 sm:w-28"
        />
        <h2 className="mt-7 font-serif text-5xl leading-none text-[#1B133C] sm:text-6xl">
          联系我
        </h2>
        <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-[#1B133C]/70">
          一起完成一个有画面感的项目。欢迎大家进行投稿。
        </p>

        <div className="mt-9 grid gap-3 text-left sm:grid-cols-2 lg:grid-cols-3">
          {channels.map(({ label, value, icon: Icon, href }) => (
            <a
              key={label}
              href={href}
              className="flex items-center gap-3 rounded-xl border border-[#1B133C]/10 bg-white/70 p-4 text-[#1B133C] transition duration-300 hover:-translate-y-0.5 hover:bg-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-orange-500"
            >
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-orange-500/10 text-orange-600">
                <Icon className="h-4 w-4" aria-hidden="true" />
              </span>
              <span>
                <span className="block text-sm font-semibold">{label}</span>
                <span className="block text-xs font-medium text-[#1B133C]/60">
                  {value}
                </span>
              </span>
            </a>
          ))}
        </div>
      </div>
    </SectionReveal>
  );
}
