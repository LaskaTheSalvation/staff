import React, { useState } from "react";
import {
  XMarkIcon,
  PencilSquareIcon,
  CheckIcon,
  TrashIcon,
  PlusIcon,
} from "@heroicons/react/24/solid";

const BannerTitleCard = ({ id, onRemove }) => {
  const [rows, setRows] = useState([
    { id: Date.now(), nama: "", title: "", isEditing: true },
  ]);

  // ✨ FUNGSI BARU: Menambah baris
  const addRow = () => {
    // ✨ LOGIKA TAMBAHAN: Mencegah tambah baris jika ada yang belum disimpan
    const hasUnsavedChanges = rows.some((row) => row.isEditing);
    if (hasUnsavedChanges) {
      alert("Harap simpan perubahan yang ada sebelum menambah baris baru.");
      return;
    }
    setRows((prev) => [
      ...prev,
      {
        id: Date.now() + Math.random(),
        nama: "",
        title: "",
        isEditing: true,
      },
    ]);
  };

  const handleChange = (rowId, field, value) => {
    setRows((prev) =>
      prev.map((row) => (row.id === rowId ? { ...row, [field]: value } : row))
    );
  };

  const saveRow = (rowId) => {
    // ✨ LOGIKA TAMBAHAN: Validasi input tidak boleh kosong
    const currentRow = rows.find((row) => row.id === rowId);
    if (!currentRow.nama.trim() || !currentRow.title.trim()) {
      alert("Nama dan Title tidak boleh kosong.");
      return;
    }
    setRows((prev) =>
      prev.map((row) =>
        row.id === rowId ? { ...row, isEditing: false } : row
      )
    );
  };

  const editRow = (rowId) => {
    setRows((prev) =>
      prev.map((row) => (row.id === rowId ? { ...row, isEditing: true } : row))
    );
  };

  const deleteRow = (rowId) => {
    // ✨ LOGIKA TAMBAHAN: Mencegah penghapusan baris terakhir
    if (rows.length <= 1) {
      alert("Tidak dapat menghapus baris terakhir.");
      return;
    }
    setRows((prev) => prev.filter((row) => row.id !== rowId));
  };

  return (
    <div className="relative mb-4">
      <div className="absolute left-0 top-0 h-full w-2 rounded-l-lg bg-[var(--color-accent)] dark:bg-[var(--color-button-blue)]"></div>
      <button
        onClick={() => onRemove(id)}
        className="absolute top-3 right-3 p-1 text-gray-400 z-10"
        title="Hapus Title"
        type="button"
      >
        <XMarkIcon className="w-5 h-5" />
      </button>
      <div className="ml-2 bg-white dark:bg-[var(--color-card-bg)] rounded-lg shadow-elevated px-6 pt-5 pb-6">
        <h3 className="text-lg font-bold mb-1 text-[var(--color-button-blue)]">
          Title
        </h3>
        <p className="text-[13px] mb-4 text-[var(--color-button-blue)]">
          Tambahkan nama dan judul untuk setiap galeri.
        </p>
        <table className="w-full text-sm border-collapse mb-3">
          <thead>
            <tr className="border-b border-gray-300 dark:border-gray-600">
              <th className="p-2 text-left text-[var(--color-button-blue)] font-semibold">
                Nama
              </th>
              <th className="p-2 text-left text-[var(--color-button-blue)] font-semibold">
                Title
              </th>
              <th className="p-2 text-center text-[var(--color-button-blue)] font-semibold">
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr
                key={row.id}
                className="border-b border-gray-200 dark:border-gray-500"
              >
                <td className="p-2">
                  {row.isEditing ? (
                    <input
                      type="text"
                      className="w-full px-2 py-1 rounded border focus:outline-none text-[var(--color-button-blue)]"
                      value={row.nama}
                      onChange={(e) =>
                        handleChange(row.id, "nama", e.target.value)
                      }
                      placeholder="nama"
                    />
                  ) : (
                    <span className="text-[var(--color-button-blue)]">
                      {row.nama}
                    </span>
                  )}
                </td>
                <td className="p-2">
                  {row.isEditing ? (
                    <input
                      type="text"
                      className="w-full px-2 py-1 rounded border focus:outline-none text-[var(--color-button-blue)]"
                      value={row.title}
                      onChange={(e) =>
                        handleChange(row.id, "title", e.target.value)
                      }
                      placeholder="title"
                    />
                  ) : (
                    <span className="text-[var(--color-button-blue)]">
                      {row.title}
                    </span>
                  )}
                </td>
                <td className="p-2">
                  {/* ✨ DIUBAH: Logika dan ikon tombol aksi */}
                  <div className="flex gap-2 justify-center items-center">
                    {row.isEditing ? (
                      <button
                        onClick={() => saveRow(row.id)}
                        className="p-1 rounded"
                        title="Simpan"
                      >
                        <CheckIcon className="w-5 h-5 text-green-500" />
                      </button>
                    ) : (
                      <>
                        <button
                          onClick={() => editRow(row.id)}
                          className="p-1 rounded"
                          title="Edit"
                        >
                          <PencilSquareIcon className="w-5 h-5 text-yellow-500" />
                        </button>
                        <button
                          onClick={() => deleteRow(row.id)}
                          className="p-1 rounded"
                          title="Hapus"
                        >
                          <TrashIcon className="w-5 h-5 text-red-500" />
                        </button>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        {/* ✨ BARU: Tombol untuk menambah baris */}
        <button
          onClick={addRow}
          type="button"
          className="flex items-center gap-2 text-[var(--color-button-blue)] font-semibold text-sm"
        >
          <PlusIcon className="w-5 h-5" />
          Tambah Baris
        </button>
      </div>
    </div>
  );
};

export default BannerTitleCard;