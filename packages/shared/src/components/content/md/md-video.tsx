import type { ComponentProps } from "react";

import { BunnyVideo } from "@wowlab/shared/components/common/bunny-video";

type MdVideoProps = ComponentProps<typeof BunnyVideo>;

export function MdVideo(props: Readonly<MdVideoProps>) {
  return (
    <div className="not-prose my-6">
      <BunnyVideo isResponsive {...props} />
    </div>
  );
}
