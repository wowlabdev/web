import { Kbd, KbdGroup } from "@wowlab/shared/components/ui/kbd";

import { DemoBox, DemoSection, DemoSubsection } from "../demo";

export function TypographySection() {
  return (
    <DemoSection id="typography" title="Typography">
      <HeadingDemo />
      <TextDemo />
      <KbdDemo />
      <ProseDemo />
    </DemoSection>
  );
}

function HeadingDemo() {
  return (
    <DemoSubsection title="Headings">
      <div className="space-y-4">
        <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight text-balance">
          Heading 1
        </h1>
        <h2 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight">
          Heading 2
        </h2>
        <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">
          Heading 3
        </h3>
        <h4 className="scroll-m-20 text-xl font-semibold tracking-tight">
          Heading 4
        </h4>
        <h5 className="scroll-m-20 text-lg font-semibold tracking-tight">
          Heading 5
        </h5>
        <h6 className="scroll-m-20 text-base font-semibold tracking-tight">
          Heading 6
        </h6>
      </div>
    </DemoSubsection>
  );
}

function KbdDemo() {
  return (
    <DemoSubsection title="Kbd">
      <DemoBox>
        <Kbd>Esc</Kbd>
        <Kbd>Enter</Kbd>
        <KbdGroup>
          <Kbd>Ctrl</Kbd>
          <Kbd>C</Kbd>
        </KbdGroup>
        <KbdGroup>
          <Kbd>Cmd</Kbd>
          <Kbd>K</Kbd>
        </KbdGroup>
      </DemoBox>
    </DemoSubsection>
  );
}

function ProseDemo() {
  return (
    <DemoSubsection title="Prose (Content Typography)">
      <div className="prose dark:prose-invert max-w-none">
        <h2>Prose Heading 2</h2>
        <p>
          Content inside a <code>prose</code> wrapper gets automatic typography
          from <strong>@tailwindcss/typography</strong>. This is how MDX content
          renders. Headings, paragraphs, lists, blockquotes, and code all get
          consistent styling without manual classes.
        </p>
        <h3>Prose Heading 3</h3>
        <ul>
          <li>Unordered list items are styled automatically</li>
          <li>No need for manual list-disc or margin classes</li>
          <li>Nested lists and spacing just work</li>
        </ul>
        <h4>Prose Heading 4</h4>
        <ol>
          <li>Ordered lists get numbers</li>
          <li>Consistent spacing between items</li>
        </ol>
        <blockquote>
          <p>
            Blockquotes inside prose get border-left and italic styling
            automatically.
          </p>
        </blockquote>
        <p>
          Inline <code>code</code> and <strong>bold text</strong> and{" "}
          <em>italic text</em> and
          <a href="#">links</a> all work inside prose.
        </p>
        <hr />
        <p>
          Horizontal rules, tables, and other elements are also styled by the
          prose plugin.
        </p>
        <table>
          <thead>
            <tr>
              <th>Element</th>
              <th>Styled by</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Headings</td>
              <td>prose (font-size, weight, margin)</td>
            </tr>
            <tr>
              <td>Paragraphs</td>
              <td>prose (margin, line-height)</td>
            </tr>
            <tr>
              <td>Lists</td>
              <td>prose (bullets, numbers, spacing)</td>
            </tr>
            <tr>
              <td>Code blocks</td>
              <td>MdPre (custom, opted out of prose)</td>
            </tr>
          </tbody>
        </table>
      </div>
    </DemoSubsection>
  );
}

function TextDemo() {
  return (
    <DemoSubsection title="Text Styles">
      <div className="space-y-4">
        <p className="leading-7">
          This is a regular paragraph with default styling. It uses{" "}
          <code className="bg-muted relative rounded px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold">
            leading-7
          </code>{" "}
          for comfortable line height.
        </p>
        <p className="text-muted-foreground text-xl">
          This is a lead paragraph, used for introductory text below page
          titles.
        </p>
        <p className="text-lg font-semibold">Large text for emphasis.</p>
        <p className="text-sm text-muted-foreground">
          Small muted text for secondary information.
        </p>
        <blockquote className="mt-6 border-l-2 pl-6 italic">
          This is a blockquote. It uses a left border and italic styling.
        </blockquote>
      </div>
    </DemoSubsection>
  );
}
