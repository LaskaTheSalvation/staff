import React, { useState, useEffect } from "react";
import {
  PencilSquareIcon,
  TrashIcon,
  CheckIcon,
  XMarkIcon,
  PlusIcon,
} from "@heroicons/react/24/solid";
import MediaButton from "../MediaButton";
import { mediaAPI } from "../../../services/api";

const EnhancedGalleryPictureCard = ({ id, onRemove }) => {
  const [rows, setRows] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [editingRowId, setEditingRowId] = useState(null);
  const [editingRowData, setEditingRowData] = useState(null);

  // Load existing media for this gallery
  useEffect(() => {
    loadGalleryMedia();
  }, []);

  const loadGalleryMedia = async () => {
    setLoading(true);
    try {
      // For now, we'll load all images. In a real app, you'd filter by gallery/section
      const response = await mediaAPI.getImages();
      const images = response.results || response;
      
      // Convert to row format for compatibility
      const galleryRows = images.map(img => ({
        id: img.id,
        name: img.display_name,
        title: img.title || img.file_name,
        media: img,
        isFromAPI: true
      }));
      
      setRows(galleryRows);
    } catch (err) {
      setError('Failed to load gallery images');
      console.error('Error loading gallery media:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (row) => {
    if (editingRowId) {
      setError("Harap selesaikan proses edit yang sedang berjalan.");
      return;
    }
    setError("");
    setEditingRowId(row.id);
    setEditingRowData({ ...row });
  };

  const handleCancel = () => {
    setEditingRowId(null);
    setEditingRowData(null);
    setError("");
  };

  const handleSave = async () => {
    if (!editingRowData.name?.trim()) {
      setError("Nama tidak boleh kosong.");
      return;
    }

    try {
      const isNewRow = !rows.find(r => r.id === editingRowData.id);
      
      if (isNewRow) {
        // If this is a new row, the media should already be uploaded via MediaButton
        if (!editingRowData.media) {
          setError("Pilih gambar terlebih dahulu.");
          return;
        }
        
        // Update the media metadata
        if (editingRowData.media.id) {
          await mediaAPI.update(editingRowData.media.id, {
            title: editingRowData.title || editingRowData.name,
            alt_text: editingRowData.name
          });
        }
        
        setRows(prev => [...prev, { ...editingRowData }]);
      } else {
        // Update existing row
        if (editingRowData.media?.id) {
          await mediaAPI.update(editingRowData.media.id, {
            title: editingRowData.title || editingRowData.name,
            alt_text: editingRowData.name
          });
        }
        
        setRows(prev => prev.map(row => 
          row.id === editingRowData.id ? { ...editingRowData } : row
        ));
      }

      setEditingRowId(null);
      setEditingRowData(null);
      setError("");
    } catch (err) {
      setError("Gagal menyimpan data.");
      console.error('Save error:', err);
    }
  };

  const handleRemoveRow = async (rowId) => {
    try {
      const row = rows.find(r => r.id === rowId);
      if (row?.media?.id) {
        await mediaAPI.delete(row.media.id);
      }
      
      setRows(prev => prev.filter(r => r.id !== rowId));
    } catch (err) {
      setError("Gagal menghapus gambar.");
      console.error('Delete error:', err);
    }
  };

  const handleAddNew = () => {
    if (editingRowId) {
      setError("Harap selesaikan proses edit yang sedang berjalan.");
      return;
    }
    
    const newId = Date.now() + Math.random();
    setEditingRowId(newId);
    setEditingRowData({
      id: newId,
      name: "",
      title: "",
      media: null
    });
    setError("");
  };

  const handleMediaSelect = (selectedMedia) => {
    setEditingRowData(prev => ({
      ...prev,
      media: selectedMedia,
      title: selectedMedia.title || selectedMedia.display_name,
      name: selectedMedia.title || selectedMedia.display_name
    }));
  };

  const handleMediaRemove = () => {
    setEditingRowData(prev => ({
      ...prev,
      media: null
    }));
  };

  const rowsToRender = [...rows];
  if (editingRowData) {
    const existingIndex = rowsToRender.findIndex(r => r.id === editingRowData.id);
    if (existingIndex >= 0) {
      rowsToRender[existingIndex] = editingRowData;
    } else {
      rowsToRender.push(editingRowData);
    }
  }

  return (
    <div className="relative mb-4">
      <div className="absolute left-0 top-0 h-full w-2 rounded-l-lg bg-[var(--color-accent)] dark:bg-[var(--color-button-blue)]"></div>
      <button
        onClick={() => onRemove(id)}
        className="absolute top-3 right-3 p-1 text-gray-400 z-10"
        title="Hapus Kartu Picture"
        type="button"
      >
        <XMarkIcon className="w-5 h-5" />
      </button>

      <div className="ml-2 bg-white dark:bg-[var(--color-card-bg)] rounded-lg shadow-elevated px-6 pt-5 pb-6">
        <h3 className="text-lg font-bold mb-1 text-[var(--color-button-blue)]">Gallery Pictures</h3>
        <p className="text-[13px] mb-4 text-[var(--color-button-blue)]">
          Kelola daftar gambar untuk galeri Anda dengan media manager.
        </p>
        
        {error && (
          <p className="text-red-600 dark:text-red-400 mb-4 text-sm font-semibold">{error}</p>
        )}

        {loading && (
          <div className="text-center py-4 text-gray-500">Loading gallery images...</div>
        )}

        <div className="overflow-x-auto mb-4">
          <table className="w-full text-sm border-collapse table-fixed">
            <thead>
              <tr className="text-[var(--color-button-blue)] font-bold">
                <th className="text-left p-2 border-b border-gray-300 dark:border-gray-600 w-[25%]">Nama</th>
                <th className="text-left p-2 border-b border-gray-300 dark:border-gray-600 w-[30%]">Title</th>
                <th className="text-left p-2 border-b border-gray-300 dark:border-gray-600 w-[25%]">Gambar</th>
                <th className="text-center p-2 border-b border-gray-300 dark:border-gray-600 w-[20%]">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {rowsToRender.map((row) => {
                const isEditing = editingRowId === row.id;
                return (
                  <tr key={row.id} className="border-b border-gray-200 dark:border-gray-700">
                    {/* NAMA */}
                    <td className="p-2">
                      {isEditing ? (
                        <input
                          type="text"
                          value={editingRowData.name}
                          onChange={(e) => setEditingRowData(prev => ({ ...prev, name: e.target.value }))}
                          className="w-full p-1 border border-gray-300 dark:border-gray-600 rounded text-xs"
                          placeholder="Nama gambar"
                        />
                      ) : (
                        <span className="text-[var(--color-button-blue)]">{row.name}</span>
                      )}
                    </td>

                    {/* TITLE */}
                    <td className="p-2">
                      {isEditing ? (
                        <input
                          type="text"
                          value={editingRowData.title}
                          onChange={(e) => setEditingRowData(prev => ({ ...prev, title: e.target.value }))}
                          className="w-full p-1 border border-gray-300 dark:border-gray-600 rounded text-xs"
                          placeholder="Title gambar"
                        />
                      ) : (
                        <span className="text-[var(--color-button-blue)]">{row.title}</span>
                      )}
                    </td>

                    {/* GAMBAR */}
                    <td className="p-2">
                      {isEditing ? (
                        <MediaButton
                          selectedMedia={editingRowData.media}
                          onMediaSelect={handleMediaSelect}
                          onMediaRemove={handleMediaRemove}
                          fileTypes={['image']}
                          buttonText="Pilih Gambar"
                          showPreview={true}
                          className="w-full"
                        />
                      ) : (
                        row.media?.thumbnail_urls?.small ? (
                          <img 
                            src={row.media.thumbnail_urls.small} 
                            alt={row.media.alt_text || row.name} 
                            className="w-14 h-14 rounded object-cover border" 
                          />
                        ) : (
                          <div className="w-14 h-14 bg-gray-200 rounded flex items-center justify-center">
                            No Image
                          </div>
                        )
                      )}
                    </td>

                    {/* AKSI */}
                    <td className="p-2 text-center">
                      <div className="flex justify-center gap-2">
                        {isEditing ? (
                          <>
                            <button
                              onClick={handleSave}
                              className="text-green-600 hover:text-green-800 p-1"
                              title="Simpan"
                            >
                              <CheckIcon className="w-4 h-4" />
                            </button>
                            <button
                              onClick={handleCancel}
                              className="text-gray-500 hover:text-gray-700 p-1"
                              title="Batal"
                            >
                              <XMarkIcon className="w-4 h-4" />
                            </button>
                          </>
                        ) : (
                          <>
                            <button
                              onClick={() => handleEdit(row)}
                              className="text-blue-600 hover:text-blue-800 p-1"
                              title="Edit"
                            >
                              <PencilSquareIcon className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleRemoveRow(row.id)}
                              className="text-red-500 hover:text-red-700 p-1"
                              title="Hapus"
                            >
                              <TrashIcon className="w-4 h-4" />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <button
          onClick={handleAddNew}
          disabled={editingRowId !== null}
          className="flex items-center gap-2 px-3 py-1 bg-[var(--color-button-blue)] text-white rounded text-sm hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <PlusIcon className="w-4 h-4" />
          Tambah Gambar
        </button>
      </div>
    </div>
  );
};

export default EnhancedGalleryPictureCard;