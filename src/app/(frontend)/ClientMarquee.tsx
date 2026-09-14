import Image from "next/image";

export interface MarqueeClient {
  id: number;
  name: string;
  url: string | null;
  logo: { url: string; alt: string; width: number; height: number };
}

/**
 * Whatever colour a logo arrives in, it rides the marquee as a white
 * silhouette: grayscale, crushed to black, inverted — then dimmed. Unoptimized
 * because the filter discards the optimizer's work anyway, and client logos
 * are often SVGs the image optimizer refuses.
 */
const LogoImage = ({ client }: { client: MarqueeClient }) => (
  <Image
    alt={client.logo.alt}
    className="h-8 w-auto max-w-[160px] object-contain opacity-60 transition-opacity duration-300 hover:opacity-100 [filter:grayscale(1)_brightness(0)_invert(1)] md:h-10"
    height={client.logo.height}
    src={client.logo.url}
    unoptimized
    width={client.logo.width}
  />
);

const LogoList = ({ clients, hidden }: { clients: MarqueeClient[]; hidden?: boolean }) => (
  <ul
    aria-hidden={hidden || undefined}
    className="flex shrink-0 items-center gap-x-20 pr-20"
  >
    {clients.map((client) => (
      <li key={client.id}>
        {client.url ? (
          <a
            aria-label={client.name}
            className="block"
            href={client.url}
            rel="noopener noreferrer"
            target="_blank"
          >
            <LogoImage client={client} />
          </a>
        ) : (
          <LogoImage client={client} />
        )}
      </li>
    ))}
  </ul>
);

/**
 * The Client Marquee: an endless horizontal scroll built from two identical
 * lists — the track translates left by exactly one list's width (its own
 * -50%), so the seam is invisible. Hovering pauses the scroll; reduced-motion
 * visitors get a static, single-list row.
 */
export const ClientMarquee = ({ clients }: { clients: MarqueeClient[] }) => (
  <section
    aria-label="Clients"
    className="group relative overflow-hidden border-y border-neutral-900 py-10 md:py-12"
  >
    <div className="flex w-max animate-marquee group-hover:[animation-play-state:paused] motion-reduce:animate-none [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]">
      <LogoList clients={clients} />
      <LogoList clients={clients} hidden />
    </div>
  </section>
);
