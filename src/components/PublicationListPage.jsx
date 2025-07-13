// src/components/PublicationListPage.jsx
import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { usePublications } from "../hooks/usePublications";

export default function PublicationListPage() {
  const { publications, deletePublication } = usePublications();
  const navigate = useNavigate();
  const [deleteLoading, setDeleteLoading] = useState(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [publicationToDelete, setPublicationToDelete] = useState(null);
  
  // States untuk fitur pencarian dan filter
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("newest"); // newest, oldest, title
  const [expandedDescriptions, setExpandedDescriptions] = useState(new Set());

  // Fungsi untuk toggle expand/collapse deskripsi
  const toggleDescription = (pubId) => {
    const newExpanded = new Set(expandedDescriptions);
    if (newExpanded.has(pubId)) {
      newExpanded.delete(pubId);
    } else {
      newExpanded.add(pubId);
    }
    setExpandedDescriptions(newExpanded);
  };

  // Fungsi untuk memotong teks deskripsi
  const truncateText = (text, maxLength = 100) => {
    if (!text || text.length <= maxLength) return text;
    return text.substring(0, maxLength) + "...";
  };

  // Filter dan sort publikasi
  const filteredAndSortedPublications = useMemo(() => {
    let filtered = publications.filter(pub => {
      const searchLower = searchTerm.toLowerCase();
      return (
        pub.title.toLowerCase().includes(searchLower) ||
        (pub.description && pub.description.toLowerCase().includes(searchLower))
      );
    });

    // Sort berdasarkan pilihan
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "newest":
          return new Date(b.releaseDate) - new Date(a.releaseDate);
        case "oldest":
          return new Date(a.releaseDate) - new Date(b.releaseDate);
        case "title":
          return a.title.localeCompare(b.title);
        default:
          return 0;
      }
    });

    return filtered;
  }, [publications, searchTerm, sortBy]);

  const handleEdit = (pub) => {
    navigate(`/publications/edit/${pub.id}`);
  };

  const handleDeleteClick = (pub) => {
    setPublicationToDelete(pub);
    setShowConfirmModal(true);
  };

  const handleDeleteConfirm = async () => {
    if (!publicationToDelete) return;
    
    setDeleteLoading(publicationToDelete.id);
    try {
      await deletePublication(publicationToDelete.id);      
      setShowConfirmModal(false);
      setPublicationToDelete(null);
    } catch (error) {
      console.error("Error deleting publication:", error);    
    } finally {
      setDeleteLoading(null);
    }
  };

  const handleDeleteCancel = () => {
    setShowConfirmModal(false);
    setPublicationToDelete(null);
  };

  const clearSearch = () => {
    setSearchTerm("");
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <header className="mb-8 text-center md:text-left">
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-800">
          Daftar Publikasi BPS Provinsi Papua
        </h1>
        <p className="text-gray-500 mt-1">Sumber data publikasi terkini</p>
      </header>

      {/* Search dan Filter Section */}
      <div className="mb-6 bg-white p-4 rounded-lg shadow-md">
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
          {/* Search Bar */}
          <div className="relative flex-1 max-w-md">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              type="text"
              placeholder="Cari judul atau deskripsi..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="block w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-sky-500 focus:border-sky-500 sm:text-sm"
            />
            {searchTerm && (
              <button
                onClick={clearSearch}
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
              >
                <svg className="h-5 w-5 text-gray-400 hover:text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>

          {/* Sort Filter */}
          <div className="flex items-center gap-2">
            <label htmlFor="sort" className="text-sm font-medium text-gray-700">
              Urutkan:
            </label>
            <select
              id="sort"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-sky-500 focus:border-sky-500"
            >
              <option value="newest">Terbaru</option>
              <option value="oldest">Terlama</option>
              <option value="title">Judul (A-Z)</option>
            </select>
          </div>
        </div>

        {/* Results Info */}
        <div className="mt-3 text-sm text-gray-600">
          {searchTerm ? (
            <span>
              Ditemukan {filteredAndSortedPublications.length} hasil untuk "{searchTerm}"
            </span>
          ) : (
            <span>
              Menampilkan {filteredAndSortedPublications.length} publikasi
            </span>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="relative overflow-x-auto shadow-xl rounded-lg">
        <table className="w-full text-sm text-left text-gray-500">
          <thead className="text-xs text-white uppercase bg-slate-700">
            <tr>
              <th scope="col" className="px-6 py-3 text-center w-16">
                No
              </th>
              <th scope="col" className="px-6 py-3">
                Judul
              </th>
              <th scope="col" className="px-6 py-3">
                Tanggal Rilis
              </th>
              <th scope="col" className="px-6 py-3">
                Deskripsi
              </th>
              <th scope="col" className="px-6 py-3 text-center">
                Sampul
              </th>
              <th scope="col" className="px-6 py-3 text-center">
                AKSI
              </th>
            </tr>
          </thead>

          <tbody>
            {filteredAndSortedPublications.map((pub, idx) => (
              <tr
                key={pub.id}
                className={`border-b transition-colors duration-200 ${
                  idx % 2 === 0 
                    ? 'bg-white hover:bg-blue-50' 
                    : 'bg-gray-50 hover:bg-blue-100'
                }`}
              >
                <td className="px-6 py-4 font-medium text-gray-900 text-center">
                  {idx + 1}
                </td>
                <td className="px-6 py-4 font-semibold text-gray-800">
                  {pub.title}
                </td>
                <td className="px-6 py-4 text-gray-600">
                  {new Date(pub.releaseDate).toLocaleDateString('id-ID', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </td>
                <td className="px-6 py-4 text-gray-600">
                  {pub.description ? (
                    <div className="max-w-xs">
                      <p className="text-sm">
                        {expandedDescriptions.has(pub.id) 
                          ? pub.description 
                          : truncateText(pub.description, 100)
                        }
                      </p>
                      {pub.description.length > 100 && (
                        <button
                          onClick={() => toggleDescription(pub.id)}
                          className="text-sky-600 hover:text-sky-800 text-xs mt-1 font-medium"
                        >
                          {expandedDescriptions.has(pub.id) ? 'Sembunyikan' : 'Lihat'}
                        </button>
                      )}
                    </div>
                  ) : (
                    <span className="text-gray-400 italic">Tidak ada deskripsi</span>
                  )}
                </td>
                <td className="px-6 py-4 flex justify-center items-center">
                  <img
                    src={pub.coverUrl}
                    alt={`Sampul ${pub.title}`}
                    className="h-24 w-auto object-cover rounded shadow-md"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src =
                        "https://placehold.co/100x140/cccccc/ffffff?text=Error";
                    }}
                  />
                </td>
                <td className="px-6 py-4 text-center">
                  <div className="flex justify-center space-x-2">
                    <button
                      onClick={() => handleEdit(pub)}
                      className="px-3 py-1 text-sm font-medium text-white bg-yellow-400 rounded hover:bg-yellow-500 transition duration-200"
                      disabled={deleteLoading === pub.id}
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteClick(pub)}
                      className="px-3 py-1 text-sm font-medium text-white bg-red-500 rounded hover:bg-red-600 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                      disabled={deleteLoading === pub.id}
                    >
                      {deleteLoading === pub.id ? (
                        <>
                          <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white mr-1"></div>
                          Loading...
                        </>
                      ) : (
                        'Hapus'
                      )}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal Konfirmasi Delete */}
      {showConfirmModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Konfirmasi Hapus Publikasi
            </h3>
            <p className="text-gray-600 mb-4">
              Apakah Anda yakin ingin menghapus publikasi "{publicationToDelete?.title}"? 
              Tindakan ini tidak dapat dibatalkan.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={handleDeleteCancel}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded hover:bg-gray-200 transition duration-200"
                disabled={deleteLoading === publicationToDelete?.id}
              >
                Batal
              </button>
              <button
                onClick={handleDeleteConfirm}
                className="px-4 py-2 text-sm font-medium text-white bg-red-500 rounded hover:bg-red-600 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                disabled={deleteLoading === publicationToDelete?.id}
              >
                {deleteLoading === publicationToDelete?.id ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Menghapus...
                  </>
                ) : (
                  'Hapus'
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Empty State - No Publications */}
      {publications.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400 text-6xl mb-4">📚</div>
          <h3 className="text-lg font-medium text-gray-800 mb-2">
            Belum ada publikasi
          </h3>
          <p className="text-gray-500">
            Publikasi yang ditambahkan akan tampil di sini.
          </p>
        </div>
      )}

      {/* Empty State - No Search Results */}
      {publications.length > 0 && filteredAndSortedPublications.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400 text-6xl mb-4">🔍</div>
          <h3 className="text-lg font-medium text-gray-800 mb-2">
            Tidak ada hasil yang ditemukan
          </h3>
          <p className="text-gray-500 mb-4">
            Coba ubah kata kunci pencarian atau hapus filter.
          </p>
          <button
            onClick={clearSearch}
            className="px-4 py-2 text-sm font-medium text-white bg-sky-600 rounded hover:bg-sky-700 transition duration-200"
          >
            Hapus Pencarian
          </button>
        </div>
      )}
    </div>
  );
}