import { useState } from "react";
import PropTypes from "prop-types";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

const SnapshotModal = ({ isOpen, onClose, onSave }) => {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-slate-950 rounded-lg shadow-lg p-6 w-11/12 max-w-lg">
                <h2 className="text-xl font-bold mb-4">Create Snapshot</h2>
                <div className="mb-4">
                    <label className="block text-sm font-medium mb-1">Title</label>
                    <input
                        type="text"
                        className="w-full p-2 border rounded"
                        placeholder="Enter snapshot title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-sm font-medium mb-1">Description</label>
                    <ReactQuill
                        theme="snow"
                        value={description}
                        onChange={setDescription}
                        placeholder=""
                        modules={{
                            toolbar: [
                                ["bold", "italic", "underline", "strike"], // Formatting
                                [{ header: [1, 2, 3, false] }], // Headings
                                [{ list: "ordered" }, { list: "bullet" }], // Lists
                                [{ align: [] }], // Text alignment
                                ["clean"], // Remove formatting
                            ],
                        }}
                        className="border rounded bg-white"
                    />
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
        </div>
    );
};

SnapshotModal.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    onSave: PropTypes.func.isRequired,
};

export default SnapshotModal;
