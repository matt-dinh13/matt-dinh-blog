import React, { useCallback, useEffect, useRef, useState } from 'react';
import { EditorContent, useEditor, BubbleMenu, FloatingMenu } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';
import Youtube from '@tiptap/extension-youtube';
import Table from '@tiptap/extension-table';
import TableRow from '@tiptap/extension-table-row';
import TableCell from '@tiptap/extension-table-cell';
import TableHeader from '@tiptap/extension-table-header';
import { Markdown } from 'tiptap-markdown';
import { createClient } from '@/lib/supabase';
import styles from './RichTextEditor.module.css';

interface RichTextEditorProps {
  value: string;
  onChange: (markdown: string) => void;
  language: 'vi' | 'en';
  className?: string;
}

const menuButton = 'px-2 py-1 rounded hover:bg-blue-100 dark:hover:bg-gray-700 cursor-pointer';

export default function RichTextEditor({ value, onChange, language, className }: RichTextEditorProps) {
  const [uploading, setUploading] = useState(false);
  const editor = useEditor({
    extensions: [
      StarterKit,
      Link.configure({ openOnClick: false }),
      Image.extend({
        addAttributes() {
          return {
            ...this.parent?.(),
            width: { default: 'auto' },
            height: { default: 'auto' },
          };
        },
      }),
      Youtube,
      Table.configure({ resizable: true }),
      TableRow,
      TableCell,
      TableHeader,
      Markdown,
    ],
    content: '',
    onUpdate: ({ editor }) => {
      const md = editor.storage.markdown.getMarkdown();
      onChange(md);
    },
    editorProps: {
      attributes: {
        class: 'min-h-[300px] w-full focus:outline-none text-gray-900',
      },
    },
    immediatelyRender: false,
  });

  // Sync value from parent (for language switching)
  useEffect(() => {
    if (editor && value !== editor.storage.markdown.getMarkdown()) {
      editor.commands.setContent(value || '', false);
    }
  }, [value, editor, language]);

  // Image upload handler
  const handleImageUpload = useCallback(async (file: File) => {
    setUploading(true);
    try {
      const supabase = createClient();
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 8)}.${fileExt}`;
      const uploadResult = await supabase.storage.from('blog-images').upload(fileName, file);
      if (uploadResult.error) throw uploadResult.error;
      const { data: urlData } = supabase.storage.from('blog-images').getPublicUrl(fileName);
      if (!urlData?.publicUrl) throw new Error('Failed to get public URL');
      editor?.chain().focus().setImage({ src: urlData.publicUrl }).run();
    } catch {
      alert('Image upload failed');
    } finally {
      setUploading(false);
    }
  }, [editor]);

  // Drag-and-drop image
  const handleDrop = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    if (!event.dataTransfer.files?.length) return;
    const file = event.dataTransfer.files[0];
    if (file.type.startsWith('image/')) {
      handleImageUpload(file);
    }
  }, [handleImageUpload]);

  // Click-to-upload
  const fileInputRef = useRef<HTMLInputElement>(null);
  const handleImageButton = () => fileInputRef.current?.click();
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) handleImageUpload(e.target.files[0]);
  };

  // Insert image by URL
  const handleImageUrl = () => {
    const url = prompt('Enter image URL');
    if (url) editor?.chain().focus().setImage({ src: url }).run();
  };

  // Update image size
  const updateImageSize = (attrs: { width?: string; height?: string }) => {
    const { state } = editor!;
    const { selection } = state;
    const node = state.doc.nodeAt(selection.from);
    if (node?.type.name === 'image') {
      editor?.chain().focus().setNodeSelection(selection.from).updateAttributes('image', attrs).run();
    }
  };

  // Bubble menu for formatting
  return (
    <div onDrop={handleDrop} className={`relative border rounded-md p-1 bg-white text-gray-900 w-full ${className || ''}`}>
      {editor && (
        <>
          {/* Persistent toolbar at the top */}
          <div className="flex flex-wrap gap-1 bg-white border-b rounded-t shadow-sm p-1 text-gray-900 sticky top-0 z-10">
            <button className={menuButton} onClick={() => editor.chain().focus().toggleBold().run()}><b>B</b></button>
            <button className={menuButton} onClick={() => editor.chain().focus().toggleItalic().run()}><i>I</i></button>
            <button className={menuButton} onClick={() => editor.chain().focus().toggleStrike().run()}><s>S</s></button>
            <button className={menuButton} onClick={() => editor.chain().focus().toggleCode().run()}>Code</button>
            <button className={menuButton} onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}>H1</button>
            <button className={menuButton} onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}>H2</button>
            <button className={menuButton} onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}>H3</button>
            <button className={menuButton} onClick={() => editor.chain().focus().toggleBulletList().run()}>• List</button>
            <button className={menuButton} onClick={() => editor.chain().focus().toggleOrderedList().run()}>1. List</button>
            <button className={menuButton} onClick={() => editor.chain().focus().toggleBlockquote().run()}>❝</button>
            <button className={menuButton} onClick={() => editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()}>Table</button>
            <button className={menuButton} onClick={() => editor.chain().focus().setYoutubeVideo({ src: prompt('YouTube URL') || '' }).run()}>YT</button>
            <button className={menuButton} onClick={handleImageButton} disabled={uploading}>🖼️</button>
            <button className={menuButton} onClick={handleImageUrl}>🌐</button>
          </div>
          {/* Contextual menus remain for selection-based actions */}
          <BubbleMenu editor={editor} tippyOptions={{ duration: 100 }}>
            <div className="flex flex-wrap gap-1 bg-white border rounded shadow p-1 text-gray-900">
              <button className={menuButton} onClick={() => editor.chain().focus().toggleBold().run()}><b>B</b></button>
              <button className={menuButton} onClick={() => editor.chain().focus().toggleItalic().run()}><i>I</i></button>
              <button className={menuButton} onClick={() => editor.chain().focus().toggleStrike().run()}><s>S</s></button>
              <button className={menuButton} onClick={() => editor.chain().focus().toggleCode().run()}>Code</button>
              <button className={menuButton} onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}>H1</button>
              <button className={menuButton} onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}>H2</button>
              <button className={menuButton} onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}>H3</button>
              <button className={menuButton} onClick={() => editor.chain().focus().toggleBulletList().run()}>• List</button>
              <button className={menuButton} onClick={() => editor.chain().focus().toggleOrderedList().run()}>1. List</button>
              <button className={menuButton} onClick={() => editor.chain().focus().toggleBlockquote().run()}>❝</button>
              <button className={menuButton} onClick={() => editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()}>Table</button>
              <button className={menuButton} onClick={() => editor.chain().focus().setYoutubeVideo({ src: prompt('YouTube URL') || '' }).run()}>YT</button>
              <button className={menuButton} onClick={handleImageButton} disabled={uploading}>🖼️</button>
              <button className={menuButton} onClick={handleImageUrl}>🌐</button>
            </div>
          </BubbleMenu>
          <FloatingMenu editor={editor} tippyOptions={{ duration: 100 }}>
            <div className="flex flex-wrap gap-1 bg-white border rounded shadow p-1 text-gray-900">
              <button className={menuButton} onClick={() => editor.chain().focus().toggleBold().run()}><b>B</b></button>
              <button className={menuButton} onClick={() => editor.chain().focus().toggleItalic().run()}><i>I</i></button>
              <button className={menuButton} onClick={() => editor.chain().focus().toggleStrike().run()}><s>S</s></button>
              <button className={menuButton} onClick={() => editor.chain().focus().toggleCode().run()}>Code</button>
              <button className={menuButton} onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}>H1</button>
              <button className={menuButton} onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}>H2</button>
              <button className={menuButton} onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}>H3</button>
              <button className={menuButton} onClick={() => editor.chain().focus().toggleBulletList().run()}>• List</button>
              <button className={menuButton} onClick={() => editor.chain().focus().toggleOrderedList().run()}>1. List</button>
              <button className={menuButton} onClick={() => editor.chain().focus().toggleBlockquote().run()}>❝</button>
              <button className={menuButton} onClick={() => editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()}>Table</button>
              <button className={menuButton} onClick={() => editor.chain().focus().setYoutubeVideo({ src: prompt('YouTube URL') || '' }).run()}>YT</button>
              <button className={menuButton} onClick={handleImageButton} disabled={uploading}>🖼️</button>
              <button className={menuButton} onClick={handleImageUrl}>🌐</button>
            </div>
          </FloatingMenu>
        </>
      )}
      <input
        type="file"
        accept="image/*"
        ref={fileInputRef}
        style={{ display: 'none' }}
        onChange={handleFileChange}
      />
      <EditorContent editor={editor} className={`text-gray-900 bg-white w-full min-h-[300px] ${styles.forceDarkText}`} style={{ fontWeight: 400 }} />
      {/* Image size controls (if image selected) */}
      {editor && editor.isActive('image') && (
        <div className="flex gap-2 mt-2 items-center">
          <label className="text-xs">Width:</label>
          <input
            type="number"
            min={50}
            max={1200}
            defaultValue={editor.getAttributes('image').width || 400}
            onBlur={e => updateImageSize({ width: e.target.value + 'px' })}
            className="w-16 px-1 py-0.5 border rounded text-xs"
          />
          <label className="text-xs">Height:</label>
          <input
            type="number"
            min={50}
            max={1200}
            defaultValue={editor.getAttributes('image').height || 300}
            onBlur={e => updateImageSize({ height: e.target.value + 'px' })}
            className="w-16 px-1 py-0.5 border rounded text-xs"
          />
        </div>
      )}
    </div>
  );
} 