import Image from "next/image";

export function LogoBackdrop() {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 -z-10 flex items-center justify-center select-none"
    >
      <Image
        src="/logo.png"
        alt=""
        width={1024}
        height={1024}
        priority
        className="size-[min(80vmin,720px)] opacity-[0.07] dark:opacity-10"
      />
    </div>
  );
}
