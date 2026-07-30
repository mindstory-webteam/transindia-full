import React, { useRef, useEffect, useState } from "react";
import { List, ListOrdered, Maximize2, Minimize2 } from "lucide-react";

export default function RichTextEditor({ value, onChange }) {
  const editorRef = useRef(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [activeFormat, setActiveFormat] = useState("p");
  const [activeStyles, setActiveStyles] = useState({
    bold: false,
    italic: false,
    underline: false,
    ul: false,
    ol: false,
  });

  // Sync value from props to contentEditable HTML only if it differs
  useEffect(() => {
    if (editorRef.current) {
      if (editorRef.current.innerHTML !== (value || "")) {
        editorRef.current.innerHTML = value || "";
      }
    }
  }, [value]);

  const handleInput = () => {
    if (editorRef.current) {
      const html = editorRef.current.innerHTML;
      onChange(html);
      updateActiveStyles();
    }
  };

  const executeCommand = (command, val = null) => {
    document.execCommand(command, false, val);
    handleInput();
  };

  const handleFormatBlock = (tag) => {
    executeCommand("formatBlock", tag);
    setActiveFormat(tag);
  };

  const handleCode = () => {
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) return;
    const range = selection.getRangeAt(0);
    const selectedText = range.toString();
    if (!selectedText) {
      // Just toggle format block as pre
      executeCommand("formatBlock", "pre");
      return;
    }

    let parent = range.commonAncestorContainer;
    if (parent.nodeType === 3) parent = parent.parentNode;

    if (parent.nodeName === "CODE") {
      const textNode = document.createTextNode(parent.textContent);
      parent.parentNode.replaceChild(textNode, parent);
    } else {
      const codeElement = document.createElement("code");
      codeElement.style.background = "#f1f5f9";
      codeElement.style.padding = "2px 6px";
      codeElement.style.borderRadius = "4px";
      codeElement.style.fontSize = "0.9em";
      codeElement.textContent = selectedText;
      range.deleteContents();
      range.insertNode(codeElement);
    }
    handleInput();
  };

  const updateActiveStyles = () => {
    if (typeof document !== "undefined") {
      setActiveStyles({
        bold: document.queryCommandState("bold"),
        italic: document.queryCommandState("italic"),
        underline: document.queryCommandState("underline"),
        ul: document.queryCommandState("insertUnorderedList"),
        ol: document.queryCommandState("insertOrderedList"),
      });

      // Detect active format block tag
      const selection = window.getSelection();
      if (selection && selection.rangeCount > 0) {
        let parentNode = selection.getRangeAt(0).startContainer;
        while (parentNode && parentNode !== editorRef.current) {
          const tag = parentNode.nodeName?.toLowerCase();
          if (["h1", "h2", "h3", "pre", "p"].includes(tag)) {
            setActiveFormat(tag);
            return;
          }
          parentNode = parentNode.parentNode;
        }
      }
      setActiveFormat("p");
    }
  };

  const isEmpty = !value || value === "<p><br></p>" || value === "<br>" || value === "" || value === "<p></p>";

  const containerStyles = isFullscreen
    ? {
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        display: "flex",
        flexDirection: "column",
        background: "#fff",
        borderRadius: 0,
        border: "none",
        overflow: "hidden",
      }
    : {
        display: "flex",
        flexDirection: "column",
        border: "1px solid #d1d5db",
        borderRadius: 6,
        background: "#fff",
        position: "relative",
      };

  const editorStyles = isFullscreen
    ? {
        flex: 1,
        overflowY: "auto",
        padding: 24,
        outline: "none",
        fontSize: 18,
        lineHeight: 1.6,
        height: "100%",
      }
    : {
        minHeight: 180,
        maxHeight: 400,
        overflowY: "auto",
        padding: "12px 16px",
        outline: "none",
        fontSize: 18,
        lineHeight: 1.6,
      };

  return (
    <div style={containerStyles} className="rte-container">
      {/* Scope CSS for rendering contentEditable preview cleanly */}
      <style>{`
        .rte-editor { font-size: 18px; line-height: 1.6; }
        .rte-editor h1, .rte-editor h1 * { font-size: 2.2em !important; font-weight: 700; margin-top: 24px; margin-bottom: 8px; }
        .rte-editor h2, .rte-editor h2 * { font-size: 1.8em !important; font-weight: 600; margin-top: 20px; margin-bottom: 6px; }
        .rte-editor h3, .rte-editor h3 * { font-size: 1.5em !important; font-weight: 600; margin-top: 16px; margin-bottom: 4px; }
        .rte-editor p, .rte-editor p *, .rte-editor span, .rte-editor font { font-size: 18px !important; margin-top: 0; margin-bottom: 12px; }
        .rte-editor blockquote { border-left: 4px solid #cbd5e1; padding-left: 12px; color: #64748b; font-style: italic; margin: 16px 0; }
        .rte-editor ul { list-style-type: disc !important; padding-left: 24px; margin: 8px 0 16px 0; }
        .rte-editor ul li, .rte-editor ul li * { font-size: 18px !important; line-height: 1.6; }
        .rte-editor ol { list-style-type: decimal !important; padding-left: 24px; margin: 8px 0 16px 0; }
        .rte-editor ol li, .rte-editor ol li * { font-size: 18px !important; line-height: 1.6; }
        .rte-editor pre { background: #f1f5f9; padding: 10px; border-radius: 4px; overflow-x: auto; margin: 12px 0; }
        .rte-editor code { background: #f1f5f9; padding: 2px 6px; border-radius: 4px; fontSize: 0.9em; }
        
        .rte-btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 32px;
          height: 32px;
          background: transparent;
          border: none;
          border-radius: 4px;
          color: #475569;
          cursor: pointer;
          transition: all 0.15s ease;
        }
        .rte-btn:hover { background: #f1f5f9; color: #0f172a; }
        .rte-btn.active { background: #e2e8f0; color: #0f172a; font-weight: bold; }
        .rte-select {
          border: none;
          background: transparent;
          font-weight: 500;
          font-size: 14px;
          color: #334155;
          padding: 4px 8px;
          outline: none;
          cursor: pointer;
          border-radius: 4px;
        }
        .rte-select:hover { background: #f1f5f9; }
        .rte-separator {
          width: 1px;
          height: 20px;
          background: #cbd5e1;
          margin: 0 4px;
        }
      `}</style>

      {/* Toolbar */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 4,
          padding: "6px 12px",
          background: "#f8fafc",
          borderBottom: "1px solid #e2e8f0",
          flexWrap: "wrap",
        }}
      >
        {/* Style Dropdown */}
        <select
          value={activeFormat}
          onChange={(e) => handleFormatBlock(e.target.value)}
          className="rte-select"
        >
          <option value="p">Normal</option>
          <option value="h1">Heading 1</option>
          <option value="h2">Heading 2</option>
          <option value="h3">Heading 3</option>
        </select>

        <div className="rte-separator" />

        {/* Inline styles */}
        <button
          type="button"
          onClick={() => executeCommand("bold")}
          className={`rte-btn ${activeStyles.bold ? "active" : ""}`}
          title="Bold"
          style={{ fontWeight: "bold" }}
        >
          B
        </button>
        <button
          type="button"
          onClick={() => executeCommand("italic")}
          className={`rte-btn ${activeStyles.italic ? "active" : ""}`}
          title="Italic"
          style={{ fontStyle: "italic" }}
        >
          i
        </button>
        <button
          type="button"
          onClick={handleCode}
          className="rte-btn"
          title="Code Block"
        >
          &lt;&gt;
        </button>
        <button
          type="button"
          onClick={() => executeCommand("underline")}
          className={`rte-btn ${activeStyles.underline ? "active" : ""}`}
          title="Underline"
          style={{ textDecoration: "underline" }}
        >
          U
        </button>

        <div className="rte-separator" />

        {/* Lists */}
        <button
          type="button"
          onClick={() => executeCommand("insertUnorderedList")}
          className={`rte-btn ${activeStyles.ul ? "active" : ""}`}
          title="Bullet List"
        >
          <List size={18} />
        </button>
        <button
          type="button"
          onClick={() => executeCommand("insertOrderedList")}
          className={`rte-btn ${activeStyles.ol ? "active" : ""}`}
          title="Numbered List"
        >
          <ListOrdered size={18} />
        </button>

        {/* Fullscreen Mode */}
        <div style={{ marginLeft: "auto" }}>
          <button
            type="button"
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="rte-btn"
            title={isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
          >
            {isFullscreen ? <Minimize2 size={18} /> : <Maximize2 size={18} />}
          </button>
        </div>
      </div>

      {/* Editable Area */}
      <div style={{ position: "relative", flex: 1, display: "flex", flexDirection: "column", minHeight: 0, overflow: "hidden" }}>
        {isEmpty && (
          <div
            style={{
              position: "absolute",
              top: isFullscreen ? 24 : 12,
              left: isFullscreen ? 24 : 16,
              color: "#9ca3af",
              pointerEvents: "none",
              fontSize: isFullscreen ? 16 : 15,
            }}
          >
            Empty
          </div>
        )}
        <div
          ref={editorRef}
          contentEditable
          onInput={handleInput}
          onBlur={handleInput}
          onKeyUp={updateActiveStyles}
          onMouseUp={updateActiveStyles}
          style={editorStyles}
          className="rte-editor rte-editable"
        />
      </div>
    </div>
  );
}
