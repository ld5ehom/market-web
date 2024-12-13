import '@toast-ui/editor/dist/toastui-editor.css'
import '@toast-ui/editor/dist/i18n/en-us'
import { Editor } from '@toast-ui/react-editor'
import { useRef } from 'react'

type Props = {
    disabled?: boolean // Indicates if the editor is disabled
    initialValue?: string // Initial markdown content
    handleOnChage: (value: string) => void // Callback function to handle content changes
}

export default function MarkdownEditor({
    disabled,
    initialValue,
    handleOnChage,
}: Props) {
    const ref = useRef<Editor>(null) // Reference to the editor instance

    return (
        <div className="relative">
            {/* Overlay to disable interaction when the editor is disabled */}
            {disabled && (
                <div className="w-full h-full absolute top-0 left-0 bg-black opacity-50 z-30" />
            )}
            <Editor
                autofocus={false} // Prevents the editor from automatically gaining focus
                initialValue={initialValue} // Sets the initial markdown content
                previewStyle="vertical" // Displays the preview vertically
                height="300px" // Sets the editor height
                initialEditType="wysiwyg" // Default mode is WYSIWYG
                // Configures toolbar items for editing
                toolbarItems={[
                    ['heading', 'bold', 'italic', 'strike'],
                    ['hr', 'quote'],
                    ['ul', 'ol', 'task'],
                    ['table', 'link'],
                ]}
                language="en-US"
                useCommandShortcut={true} // Enables keyboard shortcuts
                hideModeSwitch // Hides the mode switch button
                ref={ref}
                onChange={() => {
                    // Prevents handling changes if the editor is disabled
                    if (disabled) {
                        return
                    }
                    // Sends the updated markdown content to the parent component
                    handleOnChage(
                        ref.current?.getInstance().getMarkdown() || '',
                    )
                }}
            />
        </div>
    )
}
