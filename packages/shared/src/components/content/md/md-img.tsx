import { Image } from "@wowlab/shared/components/ui/image";

type MdImgProps = {
  alt?: string;
  src?: string;
};

export function MdImg({ alt, src }: Readonly<MdImgProps>) {
  if (!src) {
    return null;
  }

  return <Image src={src} alt={alt ?? ""} expandable />;
}
