import { useEffect, useState } from "react";
import { HiArrowUp } from "react-icons/hi2";

function ScrollToTopButton() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = document.getElementById("app-scroll");
    if (!el) return;

    function onScroll() {
      setVisible(el.scrollTop > 400);
    }

    onScroll();
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => el.removeEventListener("scroll", onScroll);
  }, []);

  if (!visible) return null;

  return (
    <button
      type="button"
      onClick={() =>
        document
          .getElementById("app-scroll")
          ?.scrollTo({ top: 0, behavior: "smooth" })
      }
      className="fixed bottom-6 right-6 z-50 inline-flex items-center gap-2 rounded-full border border-[var(--border-1)] bg-[var(--surface-1)] px-4 py-3 text-[1.3rem] font-semibold text-[color:var(--color-grey-700)] shadow-[var(--shadow-md)] backdrop-blur-[12px] transition hover:-translate-y-0.5 hover:shadow-[var(--shadow-lg)]"
      aria-label="Scroll to top"
    >
      <HiArrowUp className="h-5 w-5 text-[color:var(--color-brand-600)]" />
      Top
    </button>
  );
}

export default ScrollToTopButton;
