import { useState, useRef, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  FileText,
  Download,
  Save,
  ArrowLeft,
  Bold,
  Italic,
  Underline,
  Strikethrough,
  Palette,
  Image as ImageIcon,
  Smile,
  Undo2,
  Redo2,
  ChevronDown,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  Link,
  List,
  ListOrdered,
  Indent,
  Outdent,
  Type,
  Superscript,
  Subscript,
  Highlighter,
  Minus,
  Table,
  Trash
} from "lucide-react";
import { useLocation } from "wouter";

export default function IntelliWrite() {
  const { user } = useAuth();
  const [, navigate] = useLocation();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showDownloadOptions, setShowDownloadOptions] = useState(false);

  const editorRef = useRef(null);

  const emojis = ["😀","😂","😍","🔥","🎉","📚","✍️","💡","🚀","🌍","❤️","👍"];

  // Debounced state update to prevent cursor jump
  const handleInput = (e) => {
    const editor = editorRef.current;
    if (editor) {
      const selection = window.getSelection();
      const range = selection.rangeCount > 0 ? selection.getRangeAt(0) : null;
      setContent(editor.innerHTML);

      // Restore cursor position
      if (range) {
        selection.removeAllRanges();
        selection.addRange(range);
      } else {
        const newRange = document.createRange();
        newRange.selectNodeContents(editor);
        newRange.collapse(false);
        selection.removeAllRanges();
        selection.addRange(newRange);
      }
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const text = e.clipboardData.getData("text/plain");
    document.execCommand("insertText", false, text);
    const editor = editorRef.current;
    if (editor) {
      setContent(editor.innerHTML);
      const selection = window.getSelection();
      const range = document.createRange();
      range.selectNodeContents(editor);
      range.collapse(false);
      selection.removeAllRanges();
      selection.addRange(range);
    }
  };

  // Ensure cursor position on content change
  useEffect(() => {
    const editor = editorRef.current;
    if (editor) {
      editor.focus();
      const selection = window.getSelection();
      const range = document.createRange();
      range.selectNodeContents(editor);
      range.collapse(false);
      selection.removeAllRanges();
      selection.addRange(range);
    }
  }, [content]);

  const handleDownload = (format) => {
    let mimeType = "text/plain";
    let extension = "txt";
    if (format === "docx") {
      mimeType = "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
      extension = "docx";
    } else if (format === "pdf") {
      mimeType = "application/pdf";
      extension = "pdf";
    }
    const element = document.createElement("a");
    const file = new Blob([content], { type: mimeType });
    element.href = URL.createObjectURL(file);
    element.download = `${title || 'document'}.${extension}`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    setShowDownloadOptions(false);
  };

  const applyFormat = (command, value) => {
    document.execCommand(command, false, value);
    setContent(editorRef.current.innerHTML);
    editorRef.current.focus();
  };

  const insertEmoji = (emoji) => {
    if (editorRef.current) {
      const sel = window.getSelection();
      if (sel && sel.rangeCount > 0) {
        const range = sel.getRangeAt(0);
        range.insertNode(document.createTextNode(emoji));
        range.collapse(false);
        sel.removeAllRanges();
        sel.addRange(range);
        setContent(editorRef.current.innerHTML);
      }
    }
    setShowEmojiPicker(false);
    editorRef.current.focus();
  };

  const insertImage = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.onchange = (e) => {
      const file = e.target.files[0];
      if (file && editorRef.current) {
        const reader = new FileReader();
        reader.onload = () => {
          applyFormat("insertImage", reader.result);
          setContent(editorRef.current.innerHTML);
        };
        reader.readAsDataURL(file);
      }
    };
    input.click();
  };

  const insertLink = () => {
    const url = prompt("Enter the URL:");
    if (url) {
      applyFormat("createLink", url);
      setContent(editorRef.current.innerHTML);
    }
  };

  const insertHorizontalRule = () => {
    applyFormat("insertHorizontalRule");
    setContent(editorRef.current.innerHTML);
  };

  const insertTable = () => {
    const rows = prompt("Enter number of rows:");
    const cols = prompt("Enter number of columns:");
    if (rows && cols) {
      let tableHtml = '<table border="1" style="border-collapse: collapse; width: 100%;">';
      for (let i = 0; i < parseInt(rows); i++) {
        tableHtml += '<tr>';
        for (let j = 0; j < parseInt(cols); j++) {
          tableHtml += '<td>&nbsp;</td>';
        }
        tableHtml += '</tr>';
      }
      tableHtml += '</table>';
      applyFormat("insertHTML", tableHtml);
      setContent(editorRef.current.innerHTML);
    }
  };

  const removeFormat = () => {
    applyFormat("removeFormat");
    setContent(editorRef.current.innerHTML);
  };

  const handleHeadingChange = (e) => {
    const value = e.target.value;
    if (value === "p") {
      applyFormat("formatBlock", "p");
    } else {
      applyFormat("formatBlock", value);
    }
    setContent(editorRef.current.innerHTML);
  };

  const handleFontSizeChange = (e) => {
    applyFormat("fontSize", e.target.value);
    setContent(editorRef.current.innerHTML);
  };

  const handleForeColorChange = (e) => {
    applyFormat("foreColor", e.target.value);
    setContent(editorRef.current.innerHTML);
  };

  const handleBackColorChange = (e) => {
    applyFormat("hiliteColor", e.target.value);
    setContent(editorRef.current.innerHTML);
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: "var(--light-bg)", direction: "ltr" }}>
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-4">
              <Button variant="outline" onClick={() => navigate('/')}> 
                <ArrowLeft className="h-4 w-4 mr-2" /> Back to Chat
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 flex items-center space-x-2">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: "var(--gradient)" }}>
                    <FileText className="h-5 w-5 text-white" />
                  </div>
                  <span>IntelliWrite</span>
                </h1>
                <p className="text-sm text-gray-600">AI-powered document creation</p>
              </div>
            </div>
            <div className="relative flex items-center space-x-2">
              <Button variant="outline">
                <Save className="h-4 w-4 mr-2" /> Save
              </Button>
              <div>
                <Button variant="outline" onClick={() => setShowDownloadOptions(!showDownloadOptions)}>
                  <Download className="h-4 w-4 mr-2" /> Download <ChevronDown className="h-4 w-4 ml-1" />
                </Button>
                {showDownloadOptions && (
                  <div className="absolute right-0 mt-2 w-40 bg-white border rounded-lg shadow-lg z-20 animate-fade-in">
                    <button className="w-full px-4 py-2 text-left hover:bg-gray-100" onClick={() => handleDownload("txt")}>Text (.txt)</button>
                    <button className="w-full px-4 py-2 text-left hover:bg-gray-100" onClick={() => handleDownload("docx")}>Word (.docx)</button>
                    <button className="w-full px-4 py-2 text-left hover:bg-gray-100" onClick={() => handleDownload("pdf")}>PDF (.pdf)</button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8" style={{ direction: "ltr" }}>
        <Card className="h-full">
          <CardHeader>
            <CardTitle>Document Editor</CardTitle>
            <Input
              type="text"
              placeholder="Document Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="mt-2"
              style={{ direction: "ltr" }}
            />
          </CardHeader>
          <CardContent>
            {/* Toolbar */}
            <div className="flex flex-wrap gap-2 mb-4 animate-fade-in">
              {/* Text Formatting */}
              <Button variant="outline" size="sm" onClick={() => applyFormat("bold")}> <Bold className="h-4 w-4" /> </Button>
              <Button variant="outline" size="sm" onClick={() => applyFormat("italic")}> <Italic className="h-4 w-4" /> </Button>
              <Button variant="outline" size="sm" onClick={() => applyFormat("underline")}> <Underline className="h-4 w-4" /> </Button>
              <Button variant="outline" size="sm" onClick={() => applyFormat("strikeThrough")}> <Strikethrough className="h-4 w-4" /> </Button>
              <Button variant="outline" size="sm" onClick={() => applyFormat("superscript")}> <Superscript className="h-4 w-4" /> </Button>
              <Button variant="outline" size="sm" onClick={() => applyFormat("subscript")}> <Subscript className="h-4 w-4" /> </Button>

              {/* Color Pickers */}
              <div className="relative">
                <Button variant="outline" size="sm"> <Palette className="h-4 w-4" /> </Button>
                <input type="color" className="absolute opacity-0" onChange={handleForeColorChange} />
              </div>
              <div className="relative">
                <Button variant="outline" size="sm"> <Highlighter className="h-4 w-4" /> </Button>
                <input type="color" className="absolute opacity-0" onChange={handleBackColorChange} />
              </div>

              {/* Headings */}
              <select
                className="border rounded px-2 py-1 text-sm"
                onChange={handleHeadingChange}
                defaultValue="p"
              >
                <option value="p">Paragraph</option>
                <option value="h1">Heading 1</option>
                <option value="h2">Heading 2</option>
                <option value="h3">Heading 3</option>
                <option value="h4">Heading 4</option>
                <option value="h5">Heading 5</option>
                <option value="h6">Heading 6</option>
              </select>

              {/* Font Size */}
              <select
                className="border rounded px-2 py-1 text-sm"
                onChange={handleFontSizeChange}
                defaultValue="3"
              >
                <option value="1">8pt</option>
                <option value="2">10pt</option>
                <option value="3">12pt</option>
                <option value="4">14pt</option>
                <option value="5">18pt</option>
                <option value="6">24pt</option>
                <option value="7">36pt</option>
              </select>

              {/* Lists */}
              <Button variant="outline" size="sm" onClick={() => applyFormat("insertUnorderedList")}> <List className="h-4 w-4" /> </Button>
              <Button variant="outline" size="sm" onClick={() => applyFormat("insertOrderedList")}> <ListOrdered className="h-4 w-4" /> </Button>

              {/* Alignment */}
              <Button variant="outline" size="sm" onClick={() => applyFormat("justifyLeft")}> <AlignLeft className="h-4 w-4" /> </Button>
              <Button variant="outline" size="sm" onClick={() => applyFormat("justifyCenter")}> <AlignCenter className="h-4 w-4" /> </Button>
              <Button variant="outline" size="sm" onClick={() => applyFormat("justifyRight")}> <AlignRight className="h-4 w-4" /> </Button>
              <Button variant="outline" size="sm" onClick={() => applyFormat("justifyFull")}> <AlignJustify className="h-4 w-4" /> </Button>

              {/* Indent */}
              <Button variant="outline" size="sm" onClick={() => applyFormat("indent")}> <Indent className="h-4 w-4" /> </Button>
              <Button variant="outline" size="sm" onClick={() => applyFormat("outdent")}> <Outdent className="h-4 w-4" /> </Button>

              {/* Inserts */}
              <Button variant="outline" size="sm" onClick={insertImage}> <ImageIcon className="h-4 w-4" /> </Button>
              <Button variant="outline" size="sm" onClick={insertLink}> <Link className="h-4 w-4" /> </Button>
              <Button variant="outline" size="sm" onClick={insertHorizontalRule}> <Minus className="h-4 w-4" /> </Button>
              <Button variant="outline" size="sm" onClick={insertTable}> <Table className="h-4 w-4" /> </Button>

              {/* Emoji */}
              <div className="relative">
                <Button variant="outline" size="sm" onClick={() => setShowEmojiPicker(!showEmojiPicker)}> <Smile className="h-4 w-4" /> </Button>
                {showEmojiPicker && (
                  <div className="absolute bg-white border rounded-lg shadow-md mt-2 p-2 flex flex-wrap gap-2 z-10">
                    {emojis.map((emoji, i) => (
                      <button key={i} className="text-xl" onClick={() => insertEmoji(emoji)}>{emoji}</button>
                    ))}
                  </div>
                )}
              </div>

              {/* Undo/Redo */}
              <Button variant="outline" size="sm" onClick={() => applyFormat("undo")}> <Undo2 className="h-4 w-4" /> </Button>
              <Button variant="outline" size="sm" onClick={() => applyFormat("redo")}> <Redo2 className="h-4 w-4" /> </Button>

              {/* Remove Format */}
              <Button variant="outline" size="sm" onClick={removeFormat}> <Trash className="h-4 w-4" /> </Button>
            </div>

            {/* Editable Div */}
            <div
              ref={editorRef}
              contentEditable
              className="min-h-[500px] border rounded-lg p-4 focus:outline-none prose max-w-none bg-white"
              style={{ direction: "ltr", textAlign: "left", unicodeBidi: "normal" }}
              onInput={handleInput}
              onPaste={handlePaste}
              dangerouslySetInnerHTML={{ __html: content }}
            />

            <div className="mt-4 text-sm text-gray-500">
              Words: {content.replace(/<[^>]+>/g, "").split(' ').filter(word => word.length > 0).length} | Characters: {content.replace(/<[^>]+>/g, "").length}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}