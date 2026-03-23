'use client'

import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Placeholder from '@tiptap/extension-placeholder'
import Image from '@tiptap/extension-image'
import Link from '@tiptap/extension-link'
import Underline from '@tiptap/extension-underline'
import CharacterCount from '@tiptap/extension-character-count'
import {
  Bold, Italic, Underline as UnderlineIcon, Strikethrough,
  Heading1, Heading2, Heading3, List, ListOrdered,
  Quote, Undo, Redo, ImageIcon, LinkIcon, Minus, Type
} from 'lucide-react'
import { useCallback, useRef } from 'react'

interface TiptapEditorProps {
  content: string
  onChange: (content: string) => void
  placeholder?: string
}

function ToolbarButton({ 
  onClick, 
  active = false, 
  disabled = false,
  children 
}: { 
  onClick: () => void
  active?: boolean
  disabled?: boolean
  children: React.ReactNode
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`p-2 rounded-lg transition-colors ${
        active 
          ? 'bg-primary-100 text-primary-700' 
          : 'text-warm-500 hover:bg-warm-100 hover:text-warm-700'
      } ${disabled ? 'opacity-40 cursor-not-allowed' : ''}`}
    >
      {children}
    </button>
  )
}

function ToolbarDivider() {
  return <div className="w-px h-6 bg-warm-200 mx-1" />
}

export default function TiptapEditor({ content, onChange, placeholder }: TiptapEditorProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [1, 2, 3] },
      }),
      Placeholder.configure({
        placeholder: placeholder || 'Start writing your article...',
      }),
      Image.configure({
        HTMLAttributes: {
          class: 'rounded-xl max-w-full h-auto my-6',
        },
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-primary-600 underline hover:text-primary-800',
        },
      }),
      Underline,
      CharacterCount,
    ],
    content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML())
    },
    editorProps: {
      attributes: {
        class: 'prose prose-warm max-w-none focus:outline-none min-h-[400px] p-6 text-warm-700 leading-relaxed',
      },
    },
  })

  const handleImageUpload = useCallback(async (file: File) => {
    if (!editor) return

    // Insert a placeholder while uploading
    const placeholderSrc = URL.createObjectURL(file)
    editor.chain().focus().setImage({ src: placeholderSrc }).run()

    try {
      const formData = new FormData()
      formData.append('file', file)

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })

      const data = await res.json()

      if (res.ok && data.url) {
        // Replace the placeholder with the real URL
        const { state } = editor
        const pos = state.doc.descendants((node, pos) => {
          if (node.type.name === 'image' && node.attrs.src === placeholderSrc) {
            editor.chain()
              .focus()
              .deleteRange({ from: pos, to: pos + node.nodeSize })
              .setImage({ src: data.url, alt: file.name })
              .run()
            return false
          }
        })
      } else {
        // Remove placeholder on error
        alert('Image upload failed: ' + (data.error || 'Unknown error'))
      }
    } catch (err: any) {
      alert('Image upload failed: ' + err.message)
    } finally {
      URL.revokeObjectURL(placeholderSrc)
    }
  }, [editor])

  const onFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      handleImageUpload(file)
    }
    // Reset input
    if (fileInputRef.current) fileInputRef.current.value = ''
  }, [handleImageUpload])

  const setLink = useCallback(() => {
    if (!editor) return
    const previousUrl = editor.getAttributes('link').href
    const url = window.prompt('URL', previousUrl)

    if (url === null) return
    if (url === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run()
      return
    }
    editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run()
  }, [editor])

  if (!editor) return null

  const charCount = editor.storage.characterCount.characters()
  const wordCount = editor.storage.characterCount.words()

  return (
    <div className="bg-white rounded-2xl border border-warm-200 overflow-hidden">
      {/* Toolbar */}
      <div className="border-b border-warm-200 p-2 flex items-center gap-0.5 flex-wrap sticky top-0 bg-white z-10">
        {/* Text formatting */}
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBold().run()}
          active={editor.isActive('bold')}
        >
          <Bold size={18} />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleItalic().run()}
          active={editor.isActive('italic')}
        >
          <Italic size={18} />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          active={editor.isActive('underline')}
        >
          <UnderlineIcon size={18} />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleStrike().run()}
          active={editor.isActive('strike')}
        >
          <Strikethrough size={18} />
        </ToolbarButton>

        <ToolbarDivider />

        {/* Headings */}
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          active={editor.isActive('heading', { level: 1 })}
        >
          <Heading1 size={18} />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          active={editor.isActive('heading', { level: 2 })}
        >
          <Heading2 size={18} />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          active={editor.isActive('heading', { level: 3 })}
        >
          <Heading3 size={18} />
        </ToolbarButton>

        <ToolbarDivider />

        {/* Lists */}
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          active={editor.isActive('bulletList')}
        >
          <List size={18} />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          active={editor.isActive('orderedList')}
        >
          <ListOrdered size={18} />
        </ToolbarButton>

        <ToolbarDivider />

        {/* Block elements */}
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          active={editor.isActive('blockquote')}
        >
          <Quote size={18} />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().setHorizontalRule().run()}
        >
          <Minus size={18} />
        </ToolbarButton>

        <ToolbarDivider />

        {/* Link */}
        <ToolbarButton
          onClick={setLink}
          active={editor.isActive('link')}
        >
          <LinkIcon size={18} />
        </ToolbarButton>

        {/* Image */}
        <ToolbarButton
          onClick={() => fileInputRef.current?.click()}
        >
          <ImageIcon size={18} />
        </ToolbarButton>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={onFileSelect}
          className="hidden"
        />

        <div className="flex-1" />

        {/* Undo/Redo */}
        <ToolbarButton
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().undo()}
        >
          <Undo size={18} />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().redo()}
        >
          <Redo size={18} />
        </ToolbarButton>
      </div>

      {/* Editor */}
      <EditorContent editor={editor} />

      {/* Footer with character/word count */}
      <div className="border-t border-warm-200 px-4 py-2 flex items-center justify-between text-xs text-warm-400">
        <span>{wordCount} words · {charCount} characters</span>
        <span>Supports **bold**, *italic*, # headings, - lists, &gt; quotes</span>
      </div>
    </div>
  )
}
