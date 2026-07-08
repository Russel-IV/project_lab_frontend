export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer
      className="bg-[#121529] h-[180px] md:h-[200px] w-full shadow-[inset_0_6px_15px_rgba(0,0,0,0.08)] flex flex-col items-center justify-center gap-2"
      aria-label="Main Footer"
    >
      <span className="text-3xl font-bold tracking-tight select-none">
        <span className="bg-gradient-to-r from-frui-orange to-[#ff9900] bg-clip-text text-transparent">
          Frui
        </span>
      </span>
      <p className="text-sm text-frui-white/60">
        &copy; {year} Frui. All rights reserved.
      </p>
    </footer>
  );
}
