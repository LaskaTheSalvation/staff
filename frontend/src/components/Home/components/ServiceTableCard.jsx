import React, { useState } from "react";
import { PencilSquareIcon, TrashIcon, XMarkIcon, PlusIcon, CheckIcon } from "@heroicons/react/24/solid";

const ServiceTableCard = ({
  id,
  onRemove,
  title = "Content 1",
  description = "Masukkan data layanan pada tabel di bawah.",
  rows = [],
  onChangeRows,
}) => {
  const [editRowId, setEditRowId] = useState(null);
  const [editRow, setEditRow] = useState({ nama: "", title: "", text: "" });
  const [newRow, setNewRow] = useState({ nama: "", title: "", text: "" });

  // Mulai edit
  const handleEditRow = (row) => {
    setEditRowId(row.id);
    setEditRow(row);
  };

  // Simpan hasil edit
  const handleSaveEditRow = () => {
    const updated = rows.map((row) =>
      row.id === editRowId ? { ...editRow, id: editRowId } : row
    );
    onChangeRows(updated);
    setEditRowId(null);
    setEditRow({ nama: "", title: "", text: "" });
  };

  // Hapus baris
  const handleDeleteRow = (rowId) => {
    const updated = rows.filter((row) => row.id !== rowId);
    onChangeRows(updated);
  };

  // Tambah baris baru
  const handleAddRow = () => {
    if (!newRow.nama && !newRow.title && !newRow.text) return;
    onChangeRows([...rows, { ...newRow, id: Date.now() + Math.random() }]);
    setNewRow({ nama: "", title: "", text: "" });
  };

  return (
    <div className="relative mb-4">
      {/* Garis aksen kiri */}
      <div className="absolute left-0 top-0 h-full w-2 rounded-l-lg bg-[var(--color-accent)] dark:bg-[var(--color-button-blue)]"></div>

      {/* Tombol X kanan atas */}
      <button
        className="absolute top-3 right-3 p-1 text-gray-400 hover:text-red-500 dark:text-gray-500 dark:hover:text-red-400 transition-colors z-10"
        aria-label="Hapus Tabel"
        title="Hapus Tabel"
        onClick={() => onRemove(id)}
        type="button"
      >
        <XMarkIcon className="w-5 h-5" />
      </button>

      {/* Card */}
      <div className="ml-2 bg-white dark:bg-[var(--color-card-bg)] rounded-lg shadow-elevated px-6 pt-5 pb-6 border border-transparent">
        <h3 className="text-lg font-bold mb-0.5 text-[var(--color-button-blue)]">{title}</h3>
        <p className="text-[13px] mb-4 text-[var(--color-button-blue)]">{description}</p>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm mb-4">
            <thead>
              <tr className="border-b border-gray-300 dark:border-gray-600">
                <th className="text-left p-2 font-bold text-[var(--color-button-blue)]">nama</th>
                <th className="text-left p-2 font-bold text-[var(--color-button-blue)]">title</th>
                <th className="text-left p-2 font-bold text-[var(--color-button-blue)]">text</th>
                <th className="text-center p-2 font-bold text-[var(--color-button-blue)]">action</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) =>
                editRowId === row.id ? (
                  <tr key={row.id} className="bg-yellow-50 dark:bg-[var(--color-card-secondary)]">
                    <td className="p-2">
                      <input
                        type="text"
                        className="w-full px-2 py-1 rounded border focus:outline-none"
                        style={{ color: "var(--color-button-blue)" }}
                        value={editRow.nama}
                        onChange={(e) => setEditRow({ ...editRow, nama: e.target.value })}
                      />
                    </td>
                    <td className="p-2">
                      <input
                        type="text"
                        className="w-full px-2 py-1 rounded border focus:outline-none"
                        style={{ color: "var(--color-button-blue)" }}
                        value={editRow.title}
                        onChange={(e) => setEditRow({ ...editRow, title: e.target.value })}
                      />
                    </td>
                    <td className="p-2">
                      <input
                        type="text"
                        className="w-full px-2 py-1 rounded border focus:outline-none"
                        style={{ color: "var(--color-button-blue)" }}
                        value={editRow.text}
                        onChange={(e) => setEditRow({ ...editRow, text: e.target.value })}
                      />
                    </td>
                    <td className="p-2 flex gap-2 justify-center">
                      <button
                        className="p-1 rounded hover:bg-green-100"
                        title="Save"
                        onClick={handleSaveEditRow}
                      >
                        <CheckIcon className="w-5 h-5 text-green-500" />
                      </button>
                      <button
                        className="p-1 rounded hover:bg-red-100"
                        title="Cancel"
                        onClick={() => setEditRowId(null)}
                      >
                        <XMarkIcon className="w-5 h-5 text-red-500" />
                      </button>
                    </td>
                  </tr>
                ) : (
                  <tr key={row.id} className="border-b border-gray-200 dark:border-gray-500">
                    <td className="p-2 text-[var(--color-button-blue)]">{row.nama}</td>
                    <td className="p-2 text-[var(--color-button-blue)]">{row.title}</td>
                    <td className="p-2 text-[var(--color-button-blue)]">{row.text}</td>
                    <td className="p-2 flex gap-2 justify-center">
                      <button
                        className="p-1 rounded hover:bg-[var(--color-accent)]"
                        title="Edit"
                        onClick={() => handleEditRow(row)}
                      >
                        <PencilSquareIcon className="w-5 h-5 text-yellow-500" />
                      </button>
                      <button
                        className="p-1 rounded hover:bg-red-100"
                        title="Delete"
                        onClick={() => handleDeleteRow(row.id)}
                      >
                        <TrashIcon className="w-5 h-5 text-red-500" />
                      </button>
                    </td>
                  </tr>
                )
              )}

              {/* Baris tambah */}
              <tr>
                <td className="p-2">
                  <input
                    type="text"
                    className="w-full px-2 py-1 rounded border focus:outline-none"
                    style={{ color: "var(--color-button-blue)" }}
                    value={newRow.nama}
                    onChange={(e) => setNewRow({ ...newRow, nama: e.target.value })}
                  />
                </td>
                <td className="p-2">
                  <input
                    type="text"
                    className="w-full px-2 py-1 rounded border focus:outline-none"
                    style={{ color: "var(--color-button-blue)" }}
                    value={newRow.title}
                    onChange={(e) => setNewRow({ ...newRow, title: e.target.value })}
                  />
                </td>
                <td className="p-2">
                  <input
                    type="text"
                    className="w-full px-2 py-1 rounded border focus:outline-none"
                    style={{ color: "var(--color-button-blue)" }}
                    value={newRow.text}
                    onChange={(e) => setNewRow({ ...newRow, text: e.target.value })}
                  />
                </td>
                <td className="p-2 flex gap-2 justify-center">
                  <button
                    className="p-1 rounded hover:bg-green-100"
                    title="Tambah"
                    onClick={handleAddRow}
                  >
                    <PlusIcon className="w-5 h-5 text-green-500" />
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Tombol aksi */}
        <div className="flex gap-4">
          <button className="btn-primary rounded-full shadow min-w-[100px]">simpan</button>
          <button
            className="btn-primary rounded-full shadow min-w-[100px]"
            onClick={() => onRemove(id)}
          >
            hapus
          </button>
        </div>
      </div>
    </div>
  );
};

export default ServiceTableCard;
