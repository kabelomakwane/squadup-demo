export function BigWordBackdrop() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 flex select-none flex-col justify-between overflow-hidden py-16 opacity-20">
      <span className="-ml-2 font-display text-[10rem] font-black italic uppercase leading-none text-white sm:text-[13rem]">
        Home
      </span>
      <span className="-ml-2 font-display text-[10rem] font-black italic uppercase leading-none text-white sm:text-[13rem]">
        Away
      </span>
    </div>
  );
}
