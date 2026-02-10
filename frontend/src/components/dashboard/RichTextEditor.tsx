import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { TextStyle } from '@tiptap/extension-text-style';
import { Color } from '@tiptap/extension-color';
import { TextAlign } from '@tiptap/extension-text-align';
import { Underline } from '@tiptap/extension-underline';
import { Highlight } from '@tiptap/extension-highlight';
import { Image } from '@tiptap/extension-image';
import { FontFamily } from '@tiptap/extension-font-family';
import FontSize from 'tiptap-extension-font-size';
import { useEffect, useCallback } from 'react';

interface RichTextEditorProps {
  content: string;
  onChange: (content: string) => void;
}

export function RichTextEditor({ content, onChange }: RichTextEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      TextStyle,
      FontSize,
      Color,
      Underline,
      Highlight,
      Image.configure({
        inline: true,
        allowBase64: true,
      }),
      FontFamily.configure({
        types: ['textStyle'],
      }),
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
    ],
    content: content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  useEffect(() => {
    if (editor && content !== editor.getHTML()) {
      editor.commands.setContent(content);
    }
  }, [content, editor]);

  const addImage = useCallback(() => {
    const url = window.prompt('Enter image URL:');
    if (url && editor) {
      editor.chain().focus().setImage({ src: url }).run();
    }
  }, [editor]);

  if (!editor) {
    return null;
  }

  return (
    <div className="border border-gray-300 rounded-lg overflow-hidden bg-white">
      {/* Toolbar */}
      <div className="bg-gray-50 border-b border-gray-300 p-2 flex flex-wrap gap-1 items-center">
        {/* Text Formatting */}
        <button
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={`px-3 py-1.5 rounded text-sm font-bold transition-colors ${
            editor.isActive('bold') ? 'bg-blue-500 text-white' : 'bg-white hover:bg-gray-100 border border-gray-300'
          }`}
          title="Bold (Ctrl+B)"
        >
          B
        </button>
        <button
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={`px-3 py-1.5 rounded text-sm italic transition-colors ${
            editor.isActive('italic') ? 'bg-blue-500 text-white' : 'bg-white hover:bg-gray-100 border border-gray-300'
          }`}
          title="Italic (Ctrl+I)"
        >
          I
        </button>
        <button
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          className={`px-3 py-1.5 rounded text-sm underline transition-colors ${
            editor.isActive('underline') ? 'bg-blue-500 text-white' : 'bg-white hover:bg-gray-100 border border-gray-300'
          }`}
          title="Underline (Ctrl+U)"
        >
          U
        </button>
        <button
          onClick={() => editor.chain().focus().toggleStrike().run()}
          className={`px-3 py-1.5 rounded text-sm line-through transition-colors ${
            editor.isActive('strike') ? 'bg-blue-500 text-white' : 'bg-white hover:bg-gray-100 border border-gray-300'
          }`}
          title="Strikethrough"
        >
          S
        </button>

        <div className="w-px h-6 bg-gray-300 mx-1"></div>

        {/* Font Size Dropdown */}
        <select
          onChange={(e) => {
            const size = e.target.value;
            if (size) {
              editor.chain().focus().setFontSize(size).run();
            }
          }}
          className="px-2 py-1.5 text-sm border border-gray-300 rounded bg-white hover:bg-gray-50 cursor-pointer"
          title="Font Size"
          defaultValue=""
        >
          <option value="">Size</option>
          <option value="10px">10px</option>
          <option value="12px">12px</option>
          <option value="14px">14px</option>
          <option value="16px">16px</option>
          <option value="18px">18px</option>
          <option value="20px">20px</option>
          <option value="24px">24px</option>
          <option value="28px">28px</option>
          <option value="32px">32px</option>
          <option value="36px">36px</option>
          <option value="48px">48px</option>
          <option value="64px">64px</option>
          <option value="72px">72px</option>
          <option value="96px">96px</option>
        </select>

        <div className="w-px h-6 bg-gray-300 mx-1"></div>

        {/* Headings */}
        <button
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          className={`px-3 py-1.5 rounded text-sm font-bold transition-colors ${
            editor.isActive('heading', { level: 1 }) ? 'bg-blue-500 text-white' : 'bg-white hover:bg-gray-100 border border-gray-300'
          }`}
          title="Heading 1"
        >
          H1
        </button>
        <button
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          className={`px-3 py-1.5 rounded text-sm font-bold transition-colors ${
            editor.isActive('heading', { level: 2 }) ? 'bg-blue-500 text-white' : 'bg-white hover:bg-gray-100 border border-gray-300'
          }`}
          title="Heading 2"
        >
          H2
        </button>
        <button
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          className={`px-3 py-1.5 rounded text-sm font-bold transition-colors ${
            editor.isActive('heading', { level: 3 }) ? 'bg-blue-500 text-white' : 'bg-white hover:bg-gray-100 border border-gray-300'
          }`}
          title="Heading 3"
        >
          H3
        </button>

        <div className="w-px h-6 bg-gray-300 mx-1"></div>

        {/* Alignment */}
        <button
          onClick={() => editor.chain().focus().setTextAlign('left').run()}
          className={`px-3 py-1.5 rounded text-sm transition-colors ${
            editor.isActive({ textAlign: 'left' }) ? 'bg-blue-500 text-white' : 'bg-white hover:bg-gray-100 border border-gray-300'
          }`}
          title="Align Left"
        >
          ⬅️
        </button>
        <button
          onClick={() => editor.chain().focus().setTextAlign('center').run()}
          className={`px-3 py-1.5 rounded text-sm transition-colors ${
            editor.isActive({ textAlign: 'center' }) ? 'bg-blue-500 text-white' : 'bg-white hover:bg-gray-100 border border-gray-300'
          }`}
          title="Align Center"
        >
          ↔️
        </button>
        <button
          onClick={() => editor.chain().focus().setTextAlign('right').run()}
          className={`px-3 py-1.5 rounded text-sm transition-colors ${
            editor.isActive({ textAlign: 'right' }) ? 'bg-blue-500 text-white' : 'bg-white hover:bg-gray-100 border border-gray-300'
          }`}
          title="Align Right"
        >
          ➡️
        </button>

        <div className="w-px h-6 bg-gray-300 mx-1"></div>

        {/* Text Color */}
        <div className="flex items-center gap-1">
          <label className="text-xs text-gray-600">Color:</label>
          <input
            type="color"
            onInput={(e) => editor.chain().focus().setColor((e.target as HTMLInputElement).value).run()}
            value={editor.getAttributes('textStyle').color || '#000000'}
            className="w-10 h-8 rounded cursor-pointer border border-gray-300"
            title="Text Color"
          />
        </div>

        {/* Highlight Color */}
        <div className="flex items-center gap-1">
          <label className="text-xs text-gray-600">Highlight:</label>
          <input
            type="color"
            onInput={(e) => editor.chain().focus().toggleHighlight({ color: (e.target as HTMLInputElement).value }).run()}
            className="w-10 h-8 rounded cursor-pointer border border-gray-300"
            title="Highlight Color"
          />
        </div>

        <div className="w-px h-6 bg-gray-300 mx-1"></div>

        {/* Lists */}
        <button
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={`px-3 py-1.5 rounded text-sm transition-colors ${
            editor.isActive('bulletList') ? 'bg-blue-500 text-white' : 'bg-white hover:bg-gray-100 border border-gray-300'
          }`}
          title="Bullet List"
        >
          • List
        </button>
        <button
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={`px-3 py-1.5 rounded text-sm transition-colors ${
            editor.isActive('orderedList') ? 'bg-blue-500 text-white' : 'bg-white hover:bg-gray-100 border border-gray-300'
          }`}
          title="Numbered List"
        >
          1. List
        </button>

        <div className="w-px h-6 bg-gray-300 mx-1"></div>

        {/* Image */}
        <button
          onClick={addImage}
          className="px-3 py-1.5 rounded text-sm bg-white hover:bg-gray-100 border border-gray-300 transition-colors"
          title="Insert Image (URL)"
        >
          🖼️ Image
        </button>

        {/* Clear Formatting */}
        <button
          onClick={() => editor.chain().focus().clearNodes().unsetAllMarks().run()}
          className="px-3 py-1.5 rounded text-sm bg-white hover:bg-gray-100 border border-gray-300 transition-colors"
          title="Clear Formatting"
        >
          ✖️ Clear
        </button>
      </div>

      {/* Editor Content */}
      <EditorContent 
        editor={editor} 
        className="p-4 min-h-[250px] max-h-[500px] overflow-auto focus:outline-none"
      />
    </div>
  );
}
