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
  
  // State untuk popup deskripsi
  const [showDescriptionModal, setShowDescriptionModal] = useState(false);
  const [selectedDescription, setSelectedDescription] = useState(null);

  // Fungsi untuk membuka popup deskripsi
  const handleShowDescription = (pub) => {
    setSelectedDescription(pub);
    setShowDescriptionModal(true);
  };

  // Fungsi untuk menutup popup deskripsi
  const handleCloseDescription = () => {
    setShowDescriptionModal(false);
    setSelectedDescription(null);
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <header className="mb-8 text-center md:text-left">
          <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-slate-800 to-blue-600 bg-clip-text text-transparent">
            Daftar Publikasi BPS Provinsi Papua
          </h1>
          <p className="text-slate-600 mt-2 text-lg">Sumber data publikasi terkini</p>
        </header>

        {/* Search dan Filter Section */}
        <div className="mb-6 bg-white/70 backdrop-blur-sm p-6 rounded-xl shadow-lg border border-white/20">
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
            {/* Search Bar */}
            <div className="relative flex-1 max-w-md">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                type="text"
                placeholder="Cari judul atau deskripsi..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="block w-full pl-10 pr-10 py-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white/80 backdrop-blur-sm transition-all duration-200 sm:text-sm"
              />
              {searchTerm && (
                <button
                  onClick={clearSearch}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center hover:scale-110 transition-transform duration-200"
                >
                  <svg className="h-5 w-5 text-slate-400 hover:text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>

            {/* Sort Filter */}
            <div className="flex items-center gap-3">
              <label htmlFor="sort" className="text-sm font-medium text-slate-700">
                Urutkan:
              </label>
              <select
                id="sort"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="border border-slate-200 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white/80 backdrop-blur-sm transition-all duration-200"
              >
                <option value="newest">Terbaru</option>
                <option value="oldest">Terlama</option>
                <option value="title">Judul (A-Z)</option>
              </select>
            </div>
          </div>

          {/* Results Info */}
          <div className="mt-4 text-sm text-slate-600 flex items-center gap-2">
            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
            {searchTerm ? (
              <span>
                Ditemukan <span className="font-semibold text-blue-600">{filteredAndSortedPublications.length}</span> hasil untuk "{searchTerm}"
              </span>
            ) : (
              <span>
                Menampilkan <span className="font-semibold text-blue-600">{filteredAndSortedPublications.length}</span> publikasi
              </span>
            )}
          </div>
        </div>

        {/* Table */}
        <div className="relative overflow-x-auto shadow-2xl rounded-xl border border-white/20">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-white uppercase bg-gradient-to-r from-slate-800 to-slate-700">
              <tr>
                <th scope="col" className="px-6 py-4 text-center w-16 font-semibold">
                  No
                </th>
                <th scope="col" className="px-6 py-4 font-semibold">
                  Judul
                </th>
                <th scope="col" className="px-6 py-4 font-semibold">
                  Tanggal Rilis
                </th>
                <th scope="col" className="px-6 py-4 font-semibold">
                  Deskripsi
                </th>
                <th scope="col" className="px-6 py-4 text-center font-semibold">
                  Sampul
                </th>
                <th scope="col" className="px-6 py-4 text-center font-semibold">
                  AKSI
                </th>
              </tr>
            </thead>

            <tbody className="bg-white/80 backdrop-blur-sm">
              {filteredAndSortedPublications.map((pub, idx) => (
                <tr
                  key={pub.id}
                  className={`border-b border-slate-200/50 transition-all duration-300 ${
                    idx % 2 === 0 
                      ? 'bg-gradient-to-r from-white/90 to-blue-50/30 hover:from-blue-50/50 hover:to-blue-100/50' 
                      : 'bg-gradient-to-r from-slate-50/50 to-white/90 hover:from-blue-50/50 hover:to-blue-100/50'
                  } hover:shadow-lg hover:scale-[1.01] group`}
                >
                  <td className="px-6 py-5 font-medium text-slate-800 text-center">
                    <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-bold text-sm group-hover:scale-110 transition-transform duration-200">
                      {idx + 1}
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <div className="font-semibold text-slate-800 group-hover:text-blue-700 transition-colors duration-200">
                      {pub.title}
                    </div>
                  </td>
                  <td className="px-6 py-5 text-slate-600">
                    <div className="flex items-center gap-2">
                      <svg className="w-4 h-4 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      {new Date(pub.releaseDate).toLocaleDateString('id-ID', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </div>
                  </td>
                  <td className="px-6 py-5 text-slate-600">
                    {pub.description ? (
                      <div className="max-w-xs">
                        <p className="text-sm line-clamp-2">
                          {truncateText(pub.description, 60)}
                        </p>
                        <button
                          onClick={() => handleShowDescription(pub)}
                          className="text-blue-600 hover:text-blue-800 text-xs mt-2 font-medium bg-blue-50 px-2 py-1 rounded-full hover:bg-blue-100 transition-all duration-200 flex items-center gap-1"
                        >
                          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                          Lihat Detail
                        </button>
                      </div>
                    ) : (
                      <span className="text-slate-400 italic">Tidak ada deskripsi</span>
                    )}
                  </td>
                  <td className="px-6 py-5 flex justify-center items-center">
                    <div className="relative group">
                      <img
                        src={pub.coverUrl}
                        alt={`Sampul ${pub.title}`}
                        className="h-28 w-auto object-cover rounded-lg shadow-lg group-hover:shadow-xl transition-all duration-300 border-2 border-white/50"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = "https://placehold.co/100x140/e2e8f0/64748b?text=Error";
                        }}
                      />
                      <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg"></div>
                    </div>
                  </td>
                  <td className="px-6 py-5 text-center">
                    <div className="flex justify-center space-x-2">
                      <button
                        onClick={() => handleEdit(pub)}
                        className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-amber-500 to-orange-500 rounded-lg hover:from-amber-600 hover:to-orange-600 transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                        disabled={deleteLoading === pub.id}
                      >
                        <svg className="w-4 h-4 inline mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteClick(pub)}
                        className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-red-500 to-red-600 rounded-lg hover:from-red-600 hover:to-red-700 transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                        disabled={deleteLoading === pub.id}
                      >
                        {deleteLoading === pub.id ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
                            Loading...
                          </>
                        ) : (
                          <>
                            <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                            Hapus
                          </>
                        )}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Modal Popup Deskripsi */}
        {showDescriptionModal && selectedDescription && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[80vh] overflow-hidden shadow-2xl border border-white/20">
              {/* Header */}
              <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6 flex justify-between items-start">
                <div className="flex-1">
                  <h3 className="text-xl font-bold mb-2">
                    {selectedDescription.title}
                  </h3>
                  <p className="text-blue-100 text-sm flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    {new Date(selectedDescription.releaseDate).toLocaleDateString('id-ID', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                </div>
                <button
                  onClick={handleCloseDescription}
                  className="text-white hover:text-blue-200 transition-colors duration-200 p-1 hover:bg-white/10 rounded-full"
                >
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Body */}
              <div className="p-6 max-h-96 overflow-y-auto">
                <div className="flex gap-6">
                  {/* Cover Image */}
                  <div className="flex-shrink-0">
                    <img
                      src={selectedDescription.coverUrl}
                      alt={`Sampul ${selectedDescription.title}`}
                      className="h-48 w-auto object-cover rounded-lg shadow-lg border-2 border-slate-200"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "https://placehold.co/150x200/e2e8f0/64748b?text=Error";
                      }}
                    />
                  </div>

                  {/* Description */}
                  <div className="flex-1">
                    <h4 className="text-lg font-semibold text-slate-800 mb-3 flex items-center gap-2">
                      <svg className="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      Deskripsi Publikasi
                    </h4>
                    {selectedDescription.description ? (
                      <div className="prose prose-slate max-w-none">
                        <p className="text-slate-700 leading-relaxed whitespace-pre-wrap">
                          {selectedDescription.description}
                        </p>
                      </div>
                    ) : (
                      <p className="text-slate-500 italic">Tidak ada deskripsi tersedia.</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="bg-slate-50 px-6 py-4 flex justify-end">
                <button
                  onClick={handleCloseDescription}
                  className="px-6 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-all duration-200 shadow-sm hover:shadow-md"
                >
                  Tutup
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Modal Konfirmasi Delete */}
        {showConfirmModal && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-white/20">
              <div className="p-6">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mr-4">
                    <svg className="w-6 h-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-slate-800">
                      Konfirmasi Hapus Publikasi
                    </h3>
                  </div>
                </div>
                <p className="text-slate-600 mb-6">
                  Apakah Anda yakin ingin menghapus publikasi <span className="font-semibold text-slate-800">"{publicationToDelete?.title}"</span>? 
                  Tindakan ini tidak dapat dibatalkan.
                </p>
                <div className="flex justify-end space-x-3">
                  <button
                    onClick={handleDeleteCancel}
                    className="px-6 py-2 text-sm font-medium text-slate-700 bg-slate-100 rounded-lg hover:bg-slate-200 transition-all duration-200 border border-slate-200"
                    disabled={deleteLoading === publicationToDelete?.id}
                  >
                    Batal
                  </button>
                  <button
                    onClick={handleDeleteConfirm}
                    className="px-6 py-2 text-sm font-medium text-white bg-gradient-to-r from-red-500 to-red-600 rounded-lg hover:from-red-600 hover:to-red-700 transition-all duration-200 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                    disabled={deleteLoading === publicationToDelete?.id}
                  >
                    {deleteLoading === publicationToDelete?.id ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
                        Menghapus...
                      </>
                    ) : (
                      <>
                        <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                        Hapus
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Empty State - No Publications */}
        {publications.length === 0 && (
          <div className="text-center py-16 bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20">
            <div className="text-8xl mb-6">📚</div>
            <h3 className="text-xl font-semibold text-slate-800 mb-3">
              Belum ada publikasi
            </h3>
            <p className="text-slate-600 mb-6">
              Publikasi yang ditambahkan akan tampil di sini.
            </p>
            <button
              onClick={() => navigate('/publications/add')}
              className="px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg font-medium hover:from-blue-600 hover:to-blue-700 transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105"
            >
              Tambah Publikasi Pertama
            </button>
          </div>
        )}

        {/* Empty State - No Search Results */}
        {publications.length > 0 && filteredAndSortedPublications.length === 0 && (
          <div className="text-center py-16 bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20">
            <div className="text-8xl mb-6">🔍</div>
            <h3 className="text-xl font-semibold text-slate-800 mb-3">
              Tidak ada hasil yang ditemukan
            </h3>
            <p className="text-slate-600 mb-6">
              Coba ubah kata kunci pencarian atau hapus filter.
            </p>
            <button
              onClick={clearSearch}
              className="px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg font-medium hover:from-blue-600 hover:to-blue-700 transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105"
            >
              Hapus Pencarian
            </button>
          </div>
        )}
      </div>
    </div>
  );
}