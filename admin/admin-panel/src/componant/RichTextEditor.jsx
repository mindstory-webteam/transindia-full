import React from "react";
import ReactQuill, { Quill } from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";

// Register Style Attributors for inline styles
const Size = Quill.import('attributors/style/size');
Size.whitelist = ['12px', '14px', '16px', '18px', '24px', '32px', '48px'];
Quill.register(Size, true);

const Font = Quill.import('attributors/style/font');
Font.whitelist = ['sora', 'arial', 'courier-new', 'georgia', 'times-new-roman', 'verdana'];
Quill.register(Font, true);

export default function RichTextEditor({ value, onChange }) {
  const handleChange = (content) => {
    // Quill sends empty content as "<p><br></p>" or similar, normalize to empty string if empty
    if (content === "<p><br></p>" || content === "<br>") {
      onChange("");
    } else {
      onChange(content);
    }
  };

  const modules = {
    toolbar: [
      [{ 'font': ['sora', 'arial', 'courier-new', 'georgia', 'times-new-roman', 'verdana'] }],
      [{ 'size': ['12px', '14px', '16px', '18px', '24px', '32px', '48px'] }],
      ['bold', 'italic', 'underline', 'code-block'],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      ['clean']
    ]
  };

  const formats = [
    'font', 'size',
    'bold', 'italic', 'underline', 'code-block',
    'list', 'bullet'
  ];

  return (
    <div className="rte-quill-container" style={{ display: "flex", flexDirection: "column" }}>
      <style>{`
        /* Setup default styling for container */
        .rte-quill-container {
          border: 1px solid #d1d5db;
          border-radius: 6px;
          overflow: hidden;
          background: #fff;
        }
        
        /* Setup toolbar styling */
        .rte-quill-container .ql-toolbar.ql-snow {
          background: #f8fafc;
          border: none;
          border-bottom: 1px solid #e2e8f0;
          padding: 8px 12px;
        }
        
        /* Setup editor area styling */
        .rte-quill-container .ql-container.ql-snow {
          border: none;
          min-height: 220px;
          max-height: 450px;
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
          font-size: 18px;
          line-height: 1.6;
        }

        .rte-quill-container .ql-editor {
          min-height: 220px;
          max-height: 450px;
          overflow-y: auto;
          padding: 16px;
        }
        
        /* Font family dropdown display configuration */
        .ql-snow .ql-picker.ql-font .ql-picker-label::before,
        .ql-snow .ql-picker.ql-font .ql-picker-item::before {
          content: 'Default Font';
        }
        .ql-snow .ql-picker.ql-font .ql-picker-label[data-value="sora"]::before,
        .ql-snow .ql-picker.ql-font .ql-picker-item[data-value="sora"]::before {
          content: 'Sora';
          font-family: 'Sora', sans-serif;
        }
        .ql-snow .ql-picker.ql-font .ql-picker-label[data-value="arial"]::before,
        .ql-snow .ql-picker.ql-font .ql-picker-item[data-value="arial"]::before {
          content: 'Arial';
          font-family: Arial, sans-serif;
        }
        .ql-snow .ql-picker.ql-font .ql-picker-label[data-value="courier-new"]::before,
        .ql-snow .ql-picker.ql-font .ql-picker-item[data-value="courier-new"]::before {
          content: 'Courier';
          font-family: 'Courier New', monospace;
        }
        .ql-snow .ql-picker.ql-font .ql-picker-label[data-value="georgia"]::before,
        .ql-snow .ql-picker.ql-font .ql-picker-item[data-value="georgia"]::before {
          content: 'Georgia';
          font-family: Georgia, serif;
        }
        .ql-snow .ql-picker.ql-font .ql-picker-label[data-value="times-new-roman"]::before,
        .ql-snow .ql-picker.ql-font .ql-picker-item[data-value="times-new-roman"]::before {
          content: 'Times';
          font-family: 'Times New Roman', serif;
        }
        .ql-snow .ql-picker.ql-font .ql-picker-label[data-value="verdana"]::before,
        .ql-snow .ql-picker.ql-font .ql-picker-item[data-value="verdana"]::before {
          content: 'Verdana';
          font-family: Verdana, sans-serif;
        }

        /* Font size dropdown display configuration */
        .ql-snow .ql-picker.ql-size .ql-picker-label::before,
        .ql-snow .ql-picker.ql-size .ql-picker-item::before {
          content: '18px';
        }
        .ql-snow .ql-picker.ql-size .ql-picker-label[data-value="12px"]::before,
        .ql-snow .ql-picker.ql-size .ql-picker-item[data-value="12px"]::before {
          content: '12px';
        }
        .ql-snow .ql-picker.ql-size .ql-picker-label[data-value="14px"]::before,
        .ql-snow .ql-picker.ql-size .ql-picker-item[data-value="14px"]::before {
          content: '14px';
        }
        .ql-snow .ql-picker.ql-size .ql-picker-label[data-value="16px"]::before,
        .ql-snow .ql-picker.ql-size .ql-picker-item[data-value="16px"]::before {
          content: '16px';
        }
        .ql-snow .ql-picker.ql-size .ql-picker-label[data-value="18px"]::before,
        .ql-snow .ql-picker.ql-size .ql-picker-item[data-value="18px"]::before {
          content: '18px';
        }
        .ql-snow .ql-picker.ql-size .ql-picker-label[data-value="24px"]::before,
        .ql-snow .ql-picker.ql-size .ql-picker-item[data-value="24px"]::before {
          content: '24px';
        }
        .ql-snow .ql-picker.ql-size .ql-picker-label[data-value="32px"]::before,
        .ql-snow .ql-picker.ql-size .ql-picker-item[data-value="32px"]::before {
          content: '32px';
        }
        .ql-snow .ql-picker.ql-size .ql-picker-label[data-value="48px"]::before,
        .ql-snow .ql-picker.ql-size .ql-picker-item[data-value="48px"]::before {
          content: '48px';
        }

        /* Map inline fonts inside active editor frame */
        .ql-editor span[style*="font-family: sora"] { font-family: 'Sora', sans-serif !important; }
        .ql-editor span[style*="font-family: courier-new"] { font-family: 'Courier New', monospace !important; }
        .ql-editor span[style*="font-family: times-new-roman"] { font-family: 'Times New Roman', serif !important; }
        .ql-editor span[style*="font-family: georgia"] { font-family: Georgia, serif !important; }
        .ql-editor span[style*="font-family: verdana"] { font-family: Verdana, sans-serif !important; }
        .ql-editor span[style*="font-family: arial"] { font-family: Arial, sans-serif !important; }
        
        .ql-editor p { margin: 0 0 12px 0; }
        .ql-editor p:last-child { margin-bottom: 0; }
      `}</style>
      <ReactQuill
        theme="snow"
        value={value || ""}
        onChange={handleChange}
        modules={modules}
        formats={formats}
      />
    </div>
  );
}
