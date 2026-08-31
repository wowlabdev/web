import { stringify } from "yaml";

export class DockerConfig {
  static node(token: string): DockerConfig {
    return new DockerConfig({
      env: { NODE_CLAIM_TOKEN: token, PGID: 1000, PUID: 1000 },
      image: "ghcr.io/legacy3/wowlab-node",
      name: "WoW Lab Node",
      pull: "always",
      tag: "latest",
      volumes: [{ source: "./wowlab-node", target: "/data" }],
    });
  }

  private config: {
    detached?: boolean;
    env?: Record<string, string | number>;
    image: string;
    name?: string;
    ports?: { container: number; host: number; protocol?: string }[];
    pull?: string;
    restart?: string;
    tag?: string;
    volumes?: { readonly?: boolean; source: string; target: string }[];
  };

  private constructor(config: DockerConfig["config"]) {
    this.config = config;
  }

  toComposeYaml(serviceName: string): string {
    const { env, name, ports, pull, restart, volumes } = this.config;

    const service = Object.fromEntries(
      Object.entries({
        container_name: name,
        environment: env,
        image: this.fullImage,
        ports: ports?.map((p) => `${p.host}:${p.container}`),
        pull_policy: pull,
        restart,
        volumes: volumes?.map(
          (v) => `${v.source}:${v.target}${v.readonly ? ":ro" : ""}`,
        ),
      }).filter(([, v]) => v != null && !(Array.isArray(v) && v.length === 0)),
    );

    return stringify({ services: { [serviceName]: service } });
  }

  toRunCommand(): string {
    const { detached, env, name, ports, pull, restart, volumes } = this.config;
    const flags: string[] = [];

    if (detached) {
      flags.push("-d");
    }

    if (name) {
      flags.push("--name", `"${name}"`);
    }

    if (restart) {
      flags.push("--restart", restart);
    }

    if (pull) {
      flags.push("--pull", pull);
    }

    for (const v of volumes ?? []) {
      flags.push("-v", `${v.source}:${v.target}${v.readonly ? ":ro" : ""}`);
    }

    for (const p of ports ?? []) {
      flags.push("-p", `${p.host}:${p.container}`);
    }

    for (const [k, v] of Object.entries(env ?? {})) {
      flags.push("-e", `${k}=${v}`);
    }

    return ["docker", "run", ...flags, this.fullImage].join(" ");
  }

  private get fullImage(): string {
    const { image, tag } = this.config;

    return tag ? `${image}:${tag}` : image;
  }
}
