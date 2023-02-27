// src/Tiptap.jsx
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'

const Tiptap = () => {
    const editor = useEditor({
        extensions: [
            StarterKit,
        ],
        content: '<p>Hello. This is a WYSWYG editor, meaning what you see is what you (and your guests) will see.</p>',
        autofocus: true,
        editable: true,
        injectCSS: false,
    })

    return (
        <EditorContent editor={editor}  />
    )
}

export default Tiptap