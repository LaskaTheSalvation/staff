import React, { useState } from "react";
import { XMarkIcon, PencilSquareIcon, TrashIcon, PlusIcon, CheckIcon } from "@heroicons/react/24/solid";

const MAX_IMAGE_SIZE = 1 * 1024 * 1024; // 1MB

const AboutUsPictureCard = ({
  id,
  onRemove,
  rows = [],
  onChangeRows,
}) => {
  const [editRowId, setEditRowId] = useState(null);
  const [editRow, setEditRow] = useState({ content: "", title: "", file: null, preview: "", fileName: "" });
  const [newRow, setNewRow] = useState({ content: "", title: "", file: null, preview: "", fileName: "" });
  const [modalImg, setModalImg] = useState(null);
  const [error, setError] = useState("");

  // Untuk handle file upload + validasi
  const handleFileChange = (e, isEdit = false) => {
    setError("");
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > MAX_IMAGE_SIZE) {
      setError("Ukuran file maksimal 1MB");
      return;
    }
    const preview = URL.createObjectURL(file);
    if (isEdit) {
      setEditRow((prev) => ({ ...prev, file, preview, fileName: file.name }));
    } else {
      setNewRow((prev) => ({ ...prev, file, preview, fileName: file.name }));
    }
  };

  // Edit row handler
  const handleEditRow = (row) => {
    setEditRowId(row.id);
    setEditRow({
      ...row,
      file: null,
      preview: row.preview || "",
      fileName: row.fileName || "",
      oldPreview: row.preview || "",
      oldFileName: row.fileName || "",
    });
    setError("");
  };

  const handleSaveEditRow = () => {
    onChangeRows(rows.map(row =>
      row.id === editRowId
        ? {
            ...editRow,
            id: editRowId,
            fileName: editRow.file ? editRow.file.name : (editRow.oldFileName || row.fileName),
            preview: editRow.preview || editRow.oldPreview || row.preview,
          }
        : row
    ));
    setEditRowId(null);
    setEditRow({ content: "", title: "", file: null, preview: "", fileName: "" });
    setError("");
  };

  const handleDeleteRow = (rowId) => {
    setError("");
    onChangeRows(rows.filter(row => row.id !== rowId));
  };

  const handleAddRow = () => {
    setError("");
    if (!newRow.content && !newRow.title && !newRow.file && !newRow.preview) return;
    onChangeRows([
      ...rows,
      {
        ...newRow,
        id: Date.now() + Math.random(),
        fileName: newRow.file ? newRow.file.name : "",
      }
    ]);
    setNewRow({ content: "", title: "", file: null, preview: "", fileName: "" });
  };

  // Untuk hapus gambar saat edit/add
  const handleRemoveImage = (isEdit = false) => {
    setError("");
    if (isEdit) {
      setEditRow(prev => ({
        ...prev,
        file: null,
        preview: "",
        fileName: "",
        oldPreview: "",
        oldFileName: "",
      }));
    } else {
      setNewRow(prev => ({
        ...prev,
        file: null,
        preview: "",
        fileName: "",
      }));
    }
  };

  return (
    <div className="relative mb-4">
      <div className="absolute left-0 top-0 h-full w-2 rounded-l-lg bg-[var(--color-accent)] dark:bg-[var(--color-button-blue)]"></div>
      <button
        className="absolute top-3 right-3 p-1 text-gray-400 hover:text-red-500 dark:text-gray-500 dark:hover:text-red-400 z-10"
        aria-label="Hapus Picture"
        title="Hapus Picture"
        onClick={() => onRemove(id)}
        type="button"
      >
        <XMarkIcon className="w-5 h-5" />
      </button>
      <div className="ml-2 bg-white dark:bg-[var(--color-card-bg)] rounded-lg shadow-elevated px-6 pt-5 pb-6">
        <h3 className="text-lg font-bold mb-0.5 text-[var(--color-button-blue)]">Picture</h3>
        <p className="text-[13px] mb-4 text-[var(--color-button-blue)]">Tambah data gambar berikut:</p>
        {error && <div className="mb-2 text-sm text-red-600 font-medium">{error}</div>}
        <div className="overflow-x-auto">
          <table className="w-full text-sm mb-4">
            <thead>
              <tr className="border-b border-gray-300 dark:border-gray-600">
                <th className="text-left p-2 font-bold text-[var(--color-button-blue)]">content</th>
                <th className="text-left p-2 font-bold text-[var(--color-button-blue)]">title</th>
                <th className="text-left p-2 font-bold text-[var(--color-button-blue)]">file</th>
                <th className="text-center p-2 font-bold text-[var(--color-button-blue)]">action</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) =>
                editRowId === row.id ? (
                  <tr key={row.id} className="bg-yellow-50 dark:bg-[var(--color-card-secondary)]">
                    <td className="p-2">
                      <input type="text" className="w-full px-2 py-1 rounded border focus:outline-none text-[var(--color-button-blue)]" value={editRow.content} onChange={e => setEditRow({ ...editRow, content: e.target.value })} />
                    </td>
                    <td className="p-2">
                      <input type="text" className="w-full px-2 py-1 rounded border focus:outline-none text-[var(--color-button-blue)]" value={editRow.title} onChange={e => setEditRow({ ...editRow, title: e.target.value })} />
                    </td>
                    <td className="p-2">
                      <div className="flex items-center gap-2">
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={e => handleFileChange(e, true)}
                          />
                          <span className="px-3 py-1 bg-[var(--color-button-blue)] text-white rounded text-xs">Pilih Foto</span>
                        </label>
                        {((editRow.preview || editRow.oldPreview) || editRow.fileName || editRow.oldFileName) && (
                          <div className="flex items-center gap-1">
                            {((editRow.preview || editRow.oldPreview)) && (
                              <>
                                <img
                                  src={editRow.preview || editRow.oldPreview}
                                  alt="preview"
                                  className="w-10 h-10 rounded object-cover border cursor-pointer transition-transform duration-200 hover:scale-150"
                                  title="Klik untuk preview"
                                  onClick={() => setModalImg(editRow.preview || editRow.oldPreview)}
                                />
                              </>
                            )}
                            <span className="text-[var(--color-button-blue)] text-xs">
                              {editRow.fileName || editRow.oldFileName}
                            </span>
                            <button type="button" className="ml-1 p-0.5" title="Hapus gambar" onClick={() => handleRemoveImage(true)}>
                              <TrashIcon className="w-4 h-4 text-red-400" />
                            </button>
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="p-2 flex gap-2 justify-center">
                      <button className="p-1 rounded hover:bg-green-100" title="Save" onClick={handleSaveEditRow}><CheckIcon className="w-5 h-5 text-green-500" /></button>
                      <button className="p-1 rounded hover:bg-red-100" title="Cancel" onClick={() => setEditRowId(null)}><XMarkIcon className="w-5 h-5 text-red-500" /></button>
                    </td>
                  </tr>
                ) : (
                  <tr key={row.id} className="border-b border-gray-200 dark:border-gray-500">
                    <td className="p-2 text-[var(--color-button-blue)]">{row.content}</td>
                    <td className="p-2 text-[var(--color-button-blue)]">{row.title}</td>
                    <td className="p-2 text-[var(--color-button-blue)]">
                      {row.preview && (
                        <img
                          src={row.preview}
                          alt={row.fileName}
                          className="inline w-10 h-10 rounded object-cover border mr-2 cursor-pointer transition-transform duration-200 hover:scale-150"
                          title="Klik untuk preview"
                          onClick={() => setModalImg(row.preview)}
                        />
                      )}
                      <span>{row.fileName}</span>
                    </td>
                    <td className="p-2 flex gap-2 justify-center">
                      <button className="p-1 rounded hover:bg-[var(--color-accent)]" title="Edit" onClick={() => handleEditRow(row)}><PencilSquareIcon className="w-5 h-5 text-yellow-500" /></button>
                      <button className="p-1 rounded hover:bg-red-100" title="Delete" onClick={() => handleDeleteRow(row.id)}><TrashIcon className="w-5 h-5 text-red-500" /></button>
                    </td>
                  </tr>
                )
              )}
              {/* Baris tambah */}
              <tr>
                <td className="p-2">
                  <input type="text" className="w-full px-2 py-1 rounded border focus:outline-none text-[var(--color-button-blue)]" value={newRow.content} onChange={e => setNewRow({ ...newRow, content: e.target.value })} />
                </td>
                <td className="p-2">
                  <input type="text" className="w-full px-2 py-1 rounded border focus:outline-none text-[var(--color-button-blue)]" value={newRow.title} onChange={e => setNewRow({ ...newRow, title: e.target.value })} />
                </td>
                <td className="p-2">
                  <div className="flex items-center gap-2">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={e => handleFileChange(e)}
                      />
                      <span className="px-3 py-1 bg-[var(--color-button-blue)] text-white rounded text-xs">Pilih Foto</span>
                    </label>
                    {newRow.preview && (
                      <>
                        <img
                          src={newRow.preview}
                          alt="preview"
                          className="w-10 h-10 rounded object-cover border cursor-pointer transition-transform duration-200 hover:scale-150"
                          title="Klik untuk preview"
                          onClick={() => setModalImg(newRow.preview)}
                        />
                        <span className="text-[var(--color-button-blue)] text-xs">{newRow.fileName}</span>
                        <button type="button" className="ml-1 p-0.5" title="Hapus gambar" onClick={() => handleRemoveImage(false)}>
                          <TrashIcon className="w-4 h-4 text-red-400" />
                        </button>
                      </>
                    )}
                  </div>
                </td>
                <td className="p-2 flex gap-2 justify-center">
                  <button className="p-1 rounded hover:bg-green-100" title="Tambah" onClick={handleAddRow}><PlusIcon className="w-5 h-5 text-green-500" /></button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Modal Preview */}
        {modalImg && (
          <div className="fixed z-50 inset-0 bg-black/70 flex items-center justify-center" onClick={() => setModalImg(null)}>
            <img
              src={modalImg}
              alt="Preview"
              className="max-h-[60vh] max-w-[90vw] rounded-lg shadow-2xl border-4 border-white"
              onClick={e => e.stopPropagation()}
            />
          </div>
        )}

        <div className="flex gap-4">
          <button className="btn-primary rounded-full shadow min-w-[100px]">simpan</button>
          <button className="btn-primary rounded-full shadow min-w-[100px]" onClick={() => onRemove(id)}>hapus</button>
        </div>
      </div>
    </div>
  );
};

export default AboutUsPictureCard;
