'use client'

import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'

const Tiptap = (content) => {
  const editor = useEditor({
    extensions: [StarterKit],
    content: '<p></p>',
  })

  return <EditorContent editor={editor} />
}

export default Tiptap
