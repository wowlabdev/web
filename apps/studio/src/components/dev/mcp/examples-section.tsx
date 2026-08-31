"use client";

import { useIntlayer } from "next-intlayer";

import { type Example, ExampleCard } from "./example-card";

export function ExamplesSection() {
  const content = useIntlayer("mcpPage");

  const examples: Example[] = [
    {
      prompt: content.examplePromptLegendaries.value,
      response: (
        <p>
          {content.exampleResponseLegendariesIntro}{" "}
          <strong>Fyr&apos;alath the Dreamrender</strong>{" "}
          {content.exampleResponseLegendariesAxe}{" "}
          <strong>Nasz&apos;uro, the Unbound Legacy</strong>{" "}
          {content.exampleResponseLegendariesFist}{" "}
          <strong>Rae&apos;shalare, Death&apos;s Whisper</strong>{" "}
          {content.exampleResponseLegendariesBow}{" "}
          <strong>Thunderfury, Blessed Blade of the Windseeker</strong>.
        </p>
      ),
    },
    {
      prompt: content.examplePromptCastTimes.value,
      response: (
        <p>
          <strong>Pyroblast</strong> {content.exampleResponseCastTimesPyroblast}{" "}
          <strong>Fireball</strong> {content.exampleResponseCastTimesFireball}{" "}
          <strong>Chaos Bolt</strong>{" "}
          {content.exampleResponseCastTimesChaosBolt}
        </p>
      ),
    },
    {
      prompt: content.examplePromptRoles.value,
      response: (
        <p>
          {content.exampleResponseRolesIntro} <strong>Paladin</strong>,{" "}
          <strong>Monk</strong>,{content.exampleResponseRolesAnd}{" "}
          <strong>Druid</strong> {content.exampleResponseRolesAllThree}{" "}
          <strong>Warrior</strong> {content.exampleResponseRolesAnd2}{" "}
          <strong>Death Knight</strong> {content.exampleResponseRolesNoHeal}
        </p>
      ),
    },
    {
      prompt: content.examplePromptWarlock.value,
      response: (
        <p>
          {content.exampleResponseWarlockIntro} <strong>Affliction</strong>{" "}
          {content.exampleResponseWarlockAffliction} <strong>Demonology</strong>{" "}
          {content.exampleResponseWarlockDemonology}{" "}
          {content.exampleResponseWarlockAnd} <strong>Destruction</strong>{" "}
          {content.exampleResponseWarlockDestruction}
        </p>
      ),
    },
    {
      prompt: content.examplePromptStormstrike.value,
      response: (
        <p>
          {content.exampleResponseStormstrikeIntro1}{" "}
          <strong>resolve_effects</strong>{" "}
          {content.exampleResponseStormstrikeIntro2}{" "}
          <strong>Stormstrike</strong>{" "}
          {content.exampleResponseStormstrikeMainHand}{" "}
          <strong>Stormstrike Off-Hand</strong>{" "}
          {content.exampleResponseStormstrikeOffHand}{" "}
          {content.exampleResponseStormstrikeScaling}
        </p>
      ),
    },
    {
      prompt: content.examplePromptInterrupts.value,
      response: (
        <p>
          {content.exampleResponseInterruptsIntro} <strong>590</strong>{" "}
          {content.exampleResponseInterruptsCount} <strong>Wind Shear</strong>,{" "}
          <strong>Pummel</strong>,{content.exampleResponseInterruptsAnd}{" "}
          <strong>Counterspell</strong>,{" "}
          {content.exampleResponseInterruptsSuffix}
        </p>
      ),
    },
  ];

  return (
    <div className="space-y-2">
      <h2 className="text-sm font-semibold tracking-tight">
        {content.examples}
      </h2>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {examples.map((ex) => (
          <ExampleCard key={ex.prompt} {...ex} />
        ))}
      </div>
    </div>
  );
}
