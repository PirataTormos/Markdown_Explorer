"use client"

import { useTheme } from "next-themes"

interface SyntaxHighlighterProps {
  children: string
  language?: string
  className?: string
}

// Simple syntax highlighting for common languages
const highlightCode = (code: string, language: string, isDark: boolean) => {
  const keywords: { [key: string]: string[] } = {
    javascript: [
      "const",
      "let",
      "var",
      "function",
      "return",
      "if",
      "else",
      "for",
      "while",
      "class",
      "import",
      "export",
      "default",
      "async",
      "await",
      "try",
      "catch",
    ],
    typescript: [
      "const",
      "let",
      "var",
      "function",
      "return",
      "if",
      "else",
      "for",
      "while",
      "class",
      "import",
      "export",
      "default",
      "async",
      "await",
      "try",
      "catch",
      "interface",
      "type",
      "enum",
    ],
    python: [
      "def",
      "class",
      "import",
      "from",
      "return",
      "if",
      "else",
      "elif",
      "for",
      "while",
      "try",
      "except",
      "with",
      "as",
      "lambda",
    ],
    java: [
      "public",
      "private",
      "protected",
      "class",
      "interface",
      "extends",
      "implements",
      "return",
      "if",
      "else",
      "for",
      "while",
      "try",
      "catch",
    ],
    css: [
      "color",
      "background",
      "margin",
      "padding",
      "border",
      "width",
      "height",
      "display",
      "position",
      "flex",
      "grid",
    ],
    html: ["div", "span", "p", "h1", "h2", "h3", "h4", "h5", "h6", "a", "img", "ul", "ol", "li"],
  }

  const colors = isDark
    ? {
        keyword: "#ff79c6",
        string: "#f1fa8c",
        comment: "#6272a4",
        number: "#bd93f9",
        operator: "#ff79c6",
        function: "#50fa7b",
        tag: "#ff79c6",
        attribute: "#50fa7b",
      }
    : {
        keyword: "#d73a49",
        string: "#032f62",
        comment: "#6a737d",
        number: "#005cc5",
        operator: "#d73a49",
        function: "#6f42c1",
        tag: "#22863a",
        attribute: "#6f42c1",
      }

  let highlightedCode = code

  // Highlight strings
  highlightedCode = highlightedCode.replace(
    /(["'`])((?:\\.|(?!\1)[^\\])*?)\1/g,
    `<span style="color: ${colors.string}">$1$2$1</span>`,
  )

  // Highlight comments
  highlightedCode = highlightedCode.replace(
    /(\/\/.*$|\/\*[\s\S]*?\*\/|#.*$)/gm,
    `<span style="color: ${colors.comment}">$1</span>`,
  )

  // Highlight numbers
  highlightedCode = highlightedCode.replace(/\b(\d+\.?\d*)\b/g, `<span style="color: ${colors.number}">$1</span>`)

  // Highlight keywords for specific language
  const langKeywords = keywords[language.toLowerCase()] || []
  langKeywords.forEach((keyword) => {
    const regex = new RegExp(`\\b(${keyword})\\b`, "g")
    highlightedCode = highlightedCode.replace(
      regex,
      `<span style="color: ${colors.keyword}; font-weight: 600">$1</span>`,
    )
  })

  // Highlight HTML tags
  if (language.toLowerCase() === "html" || language.toLowerCase() === "xml") {
    highlightedCode = highlightedCode.replace(
      /(&lt;\/?)([a-zA-Z][a-zA-Z0-9]*)(.*?)(&gt;)/g,
      `$1<span style="color: ${colors.tag}">$2</span>$3$4`,
    )
  }

  return highlightedCode
}

export function CustomSyntaxHighlighter({ children, language = "text", className }: SyntaxHighlighterProps) {
  const { theme } = useTheme()
  const isDark = theme === "dark"

  const highlightedCode = language !== "text" ? highlightCode(children, language, isDark) : children

  const bgColor = isDark ? "rgb(40, 44, 52)" : "rgb(246, 248, 250)"
  const textColor = isDark ? "rgb(171, 178, 191)" : "rgb(36, 41, 46)"

  return (
    <pre
      className={`overflow-x-auto p-4 rounded-lg text-sm leading-relaxed ${className || ""}`}
      style={{
        backgroundColor: bgColor,
        color: textColor,
        fontFamily: 'ui-monospace, SFMono-Regular, "SF Mono", Consolas, "Liberation Mono", Menlo, monospace',
      }}
    >
      <code
        dangerouslySetInnerHTML={{
          __html: highlightedCode,
        }}
      />
    </pre>
  )
}
