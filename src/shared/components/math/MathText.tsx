"use client";

import katex from "katex";
import { Fragment } from "react";

interface MathTextProps {
  content: string;
  className?: string;
}

interface MathSegment {
  type: "text" | "math";
  value: string;
  displayMode?: boolean;
}

const mathPattern =
  /(\$\$[\s\S]+?\$\$|\\\[[\s\S]+?\\\]|\\\([\s\S]+?\\\)|(?<!\\)\$[^$\n]+?(?<!\\)\$)/g;

export function hasMathSyntax(content: string): boolean {
  return new RegExp(mathPattern.source).test(content);
}

function parseMathSegments(content: string): MathSegment[] {
  const segments: MathSegment[] = [];
  let lastIndex = 0;

  for (const match of content.matchAll(mathPattern)) {
    const [fullMatch] = match;
    const start = match.index ?? 0;

    if (start > lastIndex) {
      segments.push({
        type: "text",
        value: content.slice(lastIndex, start),
      });
    }

    const isDisplayMode = fullMatch.startsWith("$$") || fullMatch.startsWith("\\[");

    let value = fullMatch;
    if (fullMatch.startsWith("$$") && fullMatch.endsWith("$$")) {
      value = fullMatch.slice(2, -2);
    } else if (fullMatch.startsWith("\\[") && fullMatch.endsWith("\\]")) {
      value = fullMatch.slice(2, -2);
    } else if (fullMatch.startsWith("\\(") && fullMatch.endsWith("\\)")) {
      value = fullMatch.slice(2, -2);
    } else if (fullMatch.startsWith("$") && fullMatch.endsWith("$")) {
      value = fullMatch.slice(1, -1);
    }

    segments.push({
      type: "math",
      value: value.trim(),
      displayMode: isDisplayMode,
    });

    lastIndex = start + fullMatch.length;
  }

  if (lastIndex < content.length) {
    segments.push({
      type: "text",
      value: content.slice(lastIndex),
    });
  }

  return segments;
}

function renderTextWithLineBreaks(text: string) {
  return text.split("\n").map((line, index, lines) => (
    <Fragment key={`${line}-${index}`}>
      {line}
      {index < lines.length - 1 ? <br /> : null}
    </Fragment>
  ));
}

export function MathText({ content, className = "" }: MathTextProps) {
  const segments = parseMathSegments(content);

  return (
    <span className={className}>
      {segments.map((segment, index) => {
        if (segment.type === "text") {
          return (
            <Fragment key={`text-${index}`}>{renderTextWithLineBreaks(segment.value)}</Fragment>
          );
        }

        const html = katex.renderToString(segment.value, {
          displayMode: segment.displayMode,
          throwOnError: false,
          strict: "ignore",
          output: "html",
        });

        return (
          <span
            key={`math-${index}`}
            className={segment.displayMode ? "my-2 block overflow-x-auto overflow-y-hidden" : ""}
            dangerouslySetInnerHTML={{ __html: html }}
          />
        );
      })}
    </span>
  );
}
