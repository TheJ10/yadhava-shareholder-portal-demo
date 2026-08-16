import Image from "next/image";

export default function KrishnaWatermark() {
  return (
    <div
      className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-0 pointer-events-none w-[70vw] max-w-[380px] opacity-[0.10] saturate-[0.85] max-[480px]:w-[84vw] max-[480px]:max-w-[320px] max-[480px]:opacity-[0.09]"
      aria-hidden="true"
    >
      <Image
        src="/krishna-watermark.png"
        alt=""
        width={480}
        height={534}
        className="w-full h-auto"
        priority
      />
    </div>
  );
}
