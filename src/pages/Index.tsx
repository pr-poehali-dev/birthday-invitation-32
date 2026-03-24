import { useState, useEffect, useRef } from "react";
import Icon from "@/components/ui/icon";

const HERO_IMAGE = "https://cdn.poehali.dev/projects/a77ca3b7-3c14-49f7-bda6-74bfac4a67ec/files/0609a2d8-e823-4e58-b294-266cf9acb0b9.jpg";

const PARTY_DATE = new Date("2026-04-15T19:00:00");

function useCountdown(target: Date) {
  const calc = () => {
    const diff = target.getTime() - Date.now();
    if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 };
    return {
      days: Math.floor(diff / 86400000),
      hours: Math.floor((diff % 86400000) / 3600000),
      minutes: Math.floor((diff % 3600000) / 60000),
      seconds: Math.floor((diff % 60000) / 1000),
    };
  };
  const [time, setTime] = useState(calc);
  useEffect(() => {
    const t = setInterval(() => setTime(calc()), 1000);
    return () => clearInterval(t);
  }, []);
  return time;
}

function useInView(threshold = 0.15) {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setInView(true); }, { threshold });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  return { ref, inView };
}



function CountdownBlock({ value, label }: { value: number; label: string }) {
  return (
    <div className="flex flex-col items-center">
      <span className="font-display text-5xl md:text-7xl font-light text-[#2c2417] leading-none">
        {String(value).padStart(2, "0")}
      </span>
      <span className="font-body text-[10px] uppercase tracking-[0.2em] text-[#9a8a72] mt-2">{label}</span>
    </div>
  );
}

export default function Index() {
  const countdown = useCountdown(PARTY_DATE);
  const [rsvp, setRsvp] = useState({ name: "", attending: "yes", guests: "1", wish: "" });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const section2 = useInView();
  const section4 = useInView();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await fetch("https://functions.poehali.dev/9e8f9df1-5adb-4855-a6ed-d9e0b484650a", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(rsvp),
      });
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
    setSubmitted(true);
  };

  return (
    <div className="font-body bg-[#faf8f4] text-[#2c2417] min-h-screen">

      {/* NAV */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex justify-center gap-8 py-5 bg-[#faf8f4]/80 backdrop-blur-sm border-b border-[#e8e0d0]">
        {["Главная", "Место", "Галерея", "RSVP"].map((item) => (
          <a
            key={item}
            href={`#${item}`}
            className="text-[10px] uppercase tracking-[0.2em] text-[#9a8a72] hover:text-[#2c2417] transition-colors duration-300"
          >
            {item}
          </a>
        ))}
      </nav>

      {/* HERO */}
      <section id="Главная" className="relative min-h-screen flex flex-col items-center justify-center text-center overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${HERO_IMAGE})` }}
        />
        <div className="absolute inset-0 bg-[#faf8f4]/70" />

        <div className="relative z-10 px-6 animate-[fade-up_1s_ease-out_forwards]">
          <p className="font-body text-[11px] uppercase tracking-[0.3em] text-[#9a8a72] mb-6">
            Приглашаю тебя
          </p>
          <h1 className="font-display text-6xl md:text-9xl font-light italic text-[#2c2417] leading-[0.9] mb-4">
            на праздничный вечер
          </h1>
          <p className="font-display text-2xl md:text-4xl font-light text-[#7a6a52] mt-4 mb-12">
            в честь самой лучшей меня
          </p>

          <div className="w-12 h-px bg-[#c4a882] mx-auto mb-12" />

          {/* Countdown */}
          <div className="flex gap-8 md:gap-16 justify-center">
            <CountdownBlock value={countdown.days} label="дней" />
            <div className="font-display text-5xl md:text-7xl font-light text-[#c4a882] self-start mt-1">:</div>
            <CountdownBlock value={countdown.hours} label="часов" />
            <div className="font-display text-5xl md:text-7xl font-light text-[#c4a882] self-start mt-1">:</div>
            <CountdownBlock value={countdown.minutes} label="минут" />
            <div className="font-display text-5xl md:text-7xl font-light text-[#c4a882] self-start mt-1">:</div>
            <CountdownBlock value={countdown.seconds} label="секунд" />
          </div>
        </div>

        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce">
          <Icon name="ChevronDown" size={20} className="text-[#9a8a72]" />
        </div>
      </section>

      {/* ГАЛЕРЕЯ */}
      <section id="Галерея" className="py-28 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <p className="font-body text-[10px] uppercase tracking-[0.3em] text-[#9a8a72] mb-4">Тогда и сейчас</p>
          <h2 className="font-display text-5xl md:text-7xl font-light italic text-[#2c2417] mb-16">Как я менялась</h2>

          <div className="grid grid-cols-2 gap-6 md:gap-10">
            <div className="flex flex-col items-center gap-4">
              <div className="w-full aspect-[3/4] overflow-hidden">
                <img
                  src="https://cdn.poehali.dev/projects/a77ca3b7-3c14-49f7-bda6-74bfac4a67ec/bucket/6f592f54-ec10-4ca4-8f6d-9a7b53ceba96.jpg"
                  alt="2004"
                  className="w-full h-full object-cover transition-all duration-700"
                />
              </div>
              <p className="font-display text-3xl md:text-5xl font-light italic text-[#c4a882]">2004</p>
            </div>

            <div className="flex flex-col items-center gap-4">
              <div className="w-full aspect-[3/4] overflow-hidden">
                <img
                  src="https://cdn.poehali.dev/projects/a77ca3b7-3c14-49f7-bda6-74bfac4a67ec/bucket/1ce4febf-76c0-4ece-ac97-b9999a86628c.jpg"
                  alt="2026"
                  className="w-full h-full object-cover transition-all duration-700"
                />
              </div>
              <p className="font-display text-3xl md:text-5xl font-light italic text-[#c4a882]">2026</p>
            </div>
          </div>
        </div>
      </section>

      <div className="w-24 h-px bg-[#e8e0d0] mx-auto" />

      {/* МЕСТО И ВРЕМЯ */}
      <section id="Место" ref={section2.ref} className={`py-28 px-6 transition-all duration-1000 ${section2.inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}>
        <div className="max-w-3xl mx-auto text-center">
          <p className="font-body text-[10px] uppercase tracking-[0.3em] text-[#9a8a72] mb-4">Детали вечера</p>
          <h2 className="font-display text-5xl md:text-7xl font-light italic mb-16 text-[#2c2417]">Место и время</h2>

          <div className="grid md:grid-cols-3 gap-12">
            {[
              { icon: "Calendar", label: "Дата", value: "15 апреля 2026" },
              { icon: "Clock", label: "Начало", value: "19:00" },
              { icon: "MapPin", label: "Место", value: "Кафе «Цветок Солнца»" },
            ].map(({ icon, label, value }) => (
              <div key={label} className="flex flex-col items-center gap-4">
                <div className="w-14 h-14 rounded-full border border-[#e8e0d0] flex items-center justify-center">
                  <Icon name={icon} size={20} className="text-[#c4a882]" />
                </div>
                <p className="font-body text-[10px] uppercase tracking-[0.2em] text-[#9a8a72]">{label}</p>
                <p className="font-display text-2xl font-light text-[#2c2417]">{value}</p>
              </div>
            ))}
          </div>

          <div className="mt-10 flex justify-center">
            <div className="inline-flex items-center gap-3 px-6 py-4 bg-[#fdf6ee] border border-[#e8e0d0] rounded-sm">
              <span className="text-2xl">🎤</span>
              <p className="font-display text-xl italic text-[#2c2417]">На вечере будет караоке!</p>
            </div>
          </div>

          <div className="mt-6 p-6 border border-[#e8e0d0] rounded-sm bg-white/50 flex flex-col items-center gap-4">
            <p className="font-body text-sm text-[#7a6a52] leading-relaxed">
              г. Благовещенск, ул. Шевченко, 11/1
            </p>
            <a
              href="https://yandex.ru/maps/?text=Благовещенск%2C+кафе+Цветок+Солнца%2C+ул.+Шевченко%2C+11/1"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 border border-[#c4a882] text-[#c4a882] font-body text-[10px] uppercase tracking-[0.2em] hover:bg-[#c4a882] hover:text-white transition-all duration-300"
            >
              <Icon name="MapPin" size={14} />
              Открыть в Яндекс Картах
            </a>
          </div>
        </div>
      </section>

      <div className="w-24 h-px bg-[#e8e0d0] mx-auto" />

      {/* ВАЖНО */}
      <section className="py-16 px-6">
        <div className="max-w-xl mx-auto">
          <div className="border border-[#c4a882] p-8 md:p-12 text-center relative">
            <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#faf8f4] px-4 font-body text-[10px] uppercase tracking-[0.3em] text-[#c4a882]">Важно</span>
            <p className="font-display text-2xl md:text-3xl font-light italic text-[#2c2417] leading-relaxed">
              <span className="text-[#c4a882]">Каждый гость готовит тост в мою честь.</span>
            </p>
            <div className="mt-6 pt-6 border-t border-[#e8e0d0]">
              <p className="font-display text-lg md:text-xl font-light italic text-[#9a8a72] leading-relaxed">
                Если ты не придёшь — дай мне знать, чтобы я могла добавить тебя в чёрный список.
              </p>
            </div>
          </div>
        </div>
      </section>

      <div className="w-24 h-px bg-[#e8e0d0] mx-auto" />

      {/* RSVP */}
      <section id="RSVP" ref={section4.ref} className={`py-28 px-6 transition-all duration-1000 delay-100 ${section4.inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}>
        <div className="max-w-xl mx-auto text-center">
          <p className="font-body text-[10px] uppercase tracking-[0.3em] text-[#9a8a72] mb-4">Подтверждение</p>
          <h2 className="font-display text-5xl md:text-7xl font-light italic text-[#2c2417] mb-4">RSVP</h2>
          <p className="font-body text-sm text-[#9a8a72] mb-12">Пожалуйста, подтвердите своё присутствие до 10 апреля</p>

          {submitted ? (
            <div className="py-16 animate-[fade-up_0.6s_ease-out_forwards]">
              <div className="w-16 h-16 rounded-full border border-[#c4a882] flex items-center justify-center mx-auto mb-6">
                <Icon name="Check" size={24} className="text-[#c4a882]" />
              </div>
              <p className="font-display text-3xl font-light italic text-[#2c2417] mb-2">Спасибо!</p>
              <p className="font-body text-sm text-[#9a8a72]">Мы ждём тебя на празднике</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="text-left space-y-6">
              <div>
                <label className="font-body text-[10px] uppercase tracking-[0.2em] text-[#9a8a72] block mb-2">Ваше имя</label>
                <input
                  type="text"
                  required
                  value={rsvp.name}
                  onChange={(e) => setRsvp({ ...rsvp, name: e.target.value })}
                  placeholder="Как вас зовут?"
                  className="w-full border-b border-[#e8e0d0] bg-transparent py-3 font-body text-sm text-[#2c2417] placeholder:text-[#c4b89a] focus:outline-none focus:border-[#c4a882] transition-colors"
                />
              </div>

              <div>
                <label className="font-body text-[10px] uppercase tracking-[0.2em] text-[#9a8a72] block mb-3">Вы придёте?</label>
                <div className="flex gap-4">
                  {[{ v: "yes", l: "Да, буду!" }, { v: "no", l: "К сожалению, нет" }].map(({ v, l }) => (
                    <button
                      key={v}
                      type="button"
                      onClick={() => setRsvp({ ...rsvp, attending: v })}
                      className={`flex-1 py-3 border text-xs tracking-widest uppercase transition-all duration-300 font-body ${
                        rsvp.attending === v
                          ? "border-[#c4a882] bg-[#c4a882] text-white"
                          : "border-[#e8e0d0] text-[#9a8a72] hover:border-[#c4a882]"
                      }`}
                    >
                      {l}
                    </button>
                  ))}
                </div>
              </div>

              {rsvp.attending === "yes" && (
                <div>
                  <label className="font-body text-[10px] uppercase tracking-[0.2em] text-[#9a8a72] block mb-2">Количество гостей</label>
                  <select
                    value={rsvp.guests}
                    onChange={(e) => setRsvp({ ...rsvp, guests: e.target.value })}
                    className="w-full border-b border-[#e8e0d0] bg-transparent py-3 font-body text-sm text-[#2c2417] focus:outline-none focus:border-[#c4a882] transition-colors"
                  >
                    {["1", "2", "3", "4+"].map((n) => (
                      <option key={n} value={n}>{n}</option>
                    ))}
                  </select>
                </div>
              )}

              <div>
                <label className="font-body text-[10px] uppercase tracking-[0.2em] text-[#9a8a72] block mb-2">Пожелания по алкоголю</label>
                <textarea
                  value={rsvp.wish}
                  onChange={(e) => setRsvp({ ...rsvp, wish: e.target.value })}
                  placeholder="Что будешь пить?"
                  rows={3}
                  className="w-full border-b border-[#e8e0d0] bg-transparent py-3 font-body text-sm text-[#2c2417] placeholder:text-[#c4b89a] focus:outline-none focus:border-[#c4a882] transition-colors resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 bg-[#2c2417] text-white font-body text-[10px] uppercase tracking-[0.3em] hover:bg-[#c4a882] transition-colors duration-500 mt-4 disabled:opacity-60"
              >
                {loading ? "Отправляем..." : "Подтвердить присутствие"}
              </button>
            </form>
          )}
        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-10 text-center border-t border-[#e8e0d0]">
        <p className="font-display text-lg italic text-[#9a8a72]">С любовью, Кристина ✦</p>
      </footer>
    </div>
  );
}