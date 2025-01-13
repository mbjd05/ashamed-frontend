import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { RichTextEditor } from '@mantine/tiptap';
import { useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import Highlight from '@tiptap/extension-highlight';
import ReactDOM from 'react-dom';

const { Toolbar, Content, ControlsGroup, Bold, Italic, Underline: UnderlineControl, Strikethrough, ClearFormatting, Highlight: HighlightControl, Code } = RichTextEditor;

const SnapshotModal = ({ isOpen, onClose, onSave, clearTrigger }) => {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");

    const editor = useEditor({
        extensions: [StarterKit, Underline, Highlight],
        content: description,
        onUpdate: ({ editor }) => {
            setDescription(editor.getHTML());
        },
    });

    useEffect(() => {
        if (isOpen) {
            setTitle("");
            setDescription("");
            editor.commands.clearContent();
        }
    }, [isOpen, clearTrigger, editor]);

    if (!isOpen) return null;

    return ReactDOM.createPortal(
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-slate-950 rounded-lg shadow-lg p-6 w-11/12 max-w-lg">
                <h2 className="text-xl font-bold mb-4 text-white">Create Snapshot</h2>
                <div className="mb-4">
                    <label className="block text-sm font-medium text-white mb-1">Title</label>
                    <input
                        type="text"
                        className="text-black w-full p-2 border rounded"
                        placeholder="Enter snapshot title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-sm font-medium text-white mb-1">Description</label>
                    <RichTextEditor
                        editor={editor}
                        styles={{
                            root: {
                                border: '2px solid #4a4a4a',
                                borderRadius: '6px',
                                backgroundColor: 'white',
                                boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                            },
                            toolbar: {
                                backgroundColor: '#e0e0e0', // Darker background
                                borderBottom: '1px solid #a0a0a0',
                                padding: '4px',
                                display: 'flex',
                                alignItems: 'center',
                            },
                            content: {
                                backgroundColor: 'white',
                                color: 'black',
                                padding: '12px',
                                minHeight: '150px',
                            },
                            control: {
                                backgroundColor: 'transparent',
                                color: '#333',
                                border: '1px solid transparent',
                                padding: '8px',
                                '&:hover': {
                                    backgroundColor: '#d0d0d0',
                                    borderColor: '#888',
                                },
                                // Ensuring correct targeting for active state using proper selector
                                '&[dataActive="true"]': {
                                    backgroundColor: '#c0c0c0',
                                    borderColor: '#666',
                                },
                            },
                        }}
                    >
                        <Toolbar sticky stickyOffset={60}>
                            <ControlsGroup>
                                <Bold />
                                <Italic />
                                <UnderlineControl />
                                <Strikethrough />
                                <ClearFormatting />
                                <HighlightControl />
                                <Code />
                            </ControlsGroup>
                        </Toolbar>
                        <Content />
                    </RichTextEditor>
                </div>
                <div className="flex justify-end space-x-2">
                    <button
                        className="py-2 px-4 bg-gray-400 text-white rounded"
                        onClick={onClose}
                    >
                        Cancel
                    </button>
                    <button
                        className="py-2 px-4 bg-blue-600 text-white rounded"
                        onClick={() => onSave(title, description)}
                    >
                        Save Snapshot
                    </button>
                </div>
            </div>
        </div>,
        document.body
    );
};

SnapshotModal.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    onSave: PropTypes.func.isRequired,
    clearTrigger: PropTypes.number.isRequired,
};

export default SnapshotModal;
