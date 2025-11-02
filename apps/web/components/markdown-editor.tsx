"use client";

import { useState, useRef, type KeyboardEvent } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface MarkdownEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export function MarkdownEditor({
  value,
  onChange,
  placeholder,
}: MarkdownEditorProps) {
  const [isEditing, setIsEditing] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    const textarea = e.currentTarget;
    const { selectionStart, selectionEnd } = textarea;
    const currentValue = textarea.value;

    // Handle Tab key for indentation
    if (e.key === "Tab") {
      e.preventDefault();
      const newValue =
        currentValue.substring(0, selectionStart) +
        "  " +
        currentValue.substring(selectionEnd);
      onChange(newValue);
      setTimeout(() => {
        textarea.selectionStart = textarea.selectionEnd = selectionStart + 2;
      }, 0);
      return;
    }

    // Handle Enter key for auto-formatting
    if (e.key === "Enter") {
      const lines = currentValue.substring(0, selectionStart).split("\n");
      const currentLine = lines[lines.length - 1];

      // Continue list items
      const listMatch = currentLine.match(/^(\s*)([-*+]|\d+\.)\s/);
      if (listMatch) {
        e.preventDefault();
        const [, indent, marker] = listMatch;
        const newMarker = marker.match(/\d+/)
          ? `${Number.parseInt(marker) + 1}.`
          : marker;
        const newValue =
          currentValue.substring(0, selectionStart) +
          "\n" +
          indent +
          newMarker +
          " " +
          currentValue.substring(selectionEnd);
        onChange(newValue);
        setTimeout(() => {
          const newPosition =
            selectionStart + indent.length + newMarker.length + 2;
          textarea.selectionStart = textarea.selectionEnd = newPosition;
        }, 0);
        return;
      }
    }

    // Handle Space after markdown syntax
    if (e.key === " ") {
      const lines = currentValue.substring(0, selectionStart).split("\n");
      const currentLine = lines[lines.length - 1];

      // Check for heading syntax
      const headingMatch = currentLine.match(/^(#{1,6})$/);
      if (headingMatch) {
        // Let the space be added naturally, markdown will render it
        return;
      }

      // Check for list syntax
      const listMatch = currentLine.match(/^(\s*)([-*+])$/);
      if (listMatch) {
        // Let the space be added naturally
        return;
      }

      // Check for numbered list
      const numberedMatch = currentLine.match(/^(\s*)(\d+)\.$/);
      if (numberedMatch) {
        // Let the space be added naturally
        return;
      }
    }
  };

  return (
    <div className="flex h-full flex-col">
      <div className="relative flex-1">
        {/* Textarea for editing */}
        <textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setIsEditing(true)}
          onBlur={() => setIsEditing(false)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className="absolute inset-0 w-full h-full resize-none border-0 bg-transparent text-base leading-relaxed focus-visible:ring-0 px-0 py-0 font-mono text-foreground/90 caret-foreground outline-none"
          style={{
            opacity: isEditing ? 1 : 0,
            pointerEvents: isEditing ? "auto" : "none",
          }}
        />

        {/* Markdown preview */}
        <div
          className="absolute inset-0 w-full h-full overflow-auto px-0 py-0 cursor-text"
          onClick={() => textareaRef.current?.focus()}
          style={{
            opacity: isEditing ? 0 : 1,
            pointerEvents: isEditing ? "none" : "auto",
          }}
        >
          {value ? (
            <div className="prose prose-invert prose-sm max-w-none">
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                  h1: ({ children }) => (
                    <h1 className="text-3xl font-bold mb-4 mt-6">{children}</h1>
                  ),
                  h2: ({ children }) => (
                    <h2 className="text-2xl font-bold mb-3 mt-5">{children}</h2>
                  ),
                  h3: ({ children }) => (
                    <h3 className="text-xl font-bold mb-2 mt-4">{children}</h3>
                  ),
                  h4: ({ children }) => (
                    <h4 className="text-lg font-bold mb-2 mt-3">{children}</h4>
                  ),
                  h5: ({ children }) => (
                    <h5 className="text-base font-bold mb-1 mt-2">
                      {children}
                    </h5>
                  ),
                  h6: ({ children }) => (
                    <h6 className="text-sm font-bold mb-1 mt-2">{children}</h6>
                  ),
                  p: ({ children }) => (
                    <p className="mb-4 leading-relaxed">{children}</p>
                  ),
                  ul: ({ children }) => (
                    <ul className="list-disc list-inside mb-4 space-y-1">
                      {children}
                    </ul>
                  ),
                  ol: ({ children }) => (
                    <ol className="list-decimal list-inside mb-4 space-y-1">
                      {children}
                    </ol>
                  ),
                  li: ({ children }) => (
                    <li className="leading-relaxed">{children}</li>
                  ),
                  blockquote: ({ children }) => (
                    <blockquote className="border-l-4 border-muted-foreground/30 pl-4 italic my-4">
                      {children}
                    </blockquote>
                  ),
                  code: ({ children, className }) => {
                    const isInline = !className;
                    return isInline ? (
                      <code className="bg-muted px-1.5 py-0.5 rounded text-sm font-mono">
                        {children}
                      </code>
                    ) : (
                      <code className="block bg-muted p-4 rounded-lg text-sm font-mono overflow-x-auto my-4">
                        {children}
                      </code>
                    );
                  },
                  strong: ({ children }) => (
                    <strong className="font-bold">{children}</strong>
                  ),
                  em: ({ children }) => <em className="italic">{children}</em>,
                  hr: () => <hr className="border-border my-6" />,
                  a: ({ children, href }) => (
                    <a
                      href={href}
                      className="text-primary underline hover:text-primary/80"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {children}
                    </a>
                  ),
                }}
              >
                {value}
              </ReactMarkdown>
            </div>
          ) : (
            <p className="text-muted-foreground">{placeholder}</p>
          )}
        </div>
      </div>
    </div>
  );
}
