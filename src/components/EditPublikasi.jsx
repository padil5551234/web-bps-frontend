// src/components/EditPublikasi.jsx - Dengan Notifikasi Alert yang Bagus
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from 'react-router-dom';
import { usePublications } from '../hooks/usePublications';
import { uploadImageToCloudinary } from '../services/publicationService';

export default function EditPublikasi() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { publications, editPublication } = usePublications();
  const publication = publications.find(pub => pub.id === Number(id));

  const [title, setTitle] = useState("");
  const [releaseDate, setReleaseDate] = useState("");
  const [coverFile, setCoverFile] = useState(null);
  const [coverUrl, setCoverUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [description, setDescription] = useState(""); 
  const [successNotification, setSuccessNotification] = useState(false);

  // Mengisi form dengan data publikasi yang sedang diedit
  useEffect(() => {
    if (publication) {
      setTitle(publication.title || '');
      setReleaseDate(publication.releaseDate || '');
      setDescription(publication.description || ''); 
      setCoverUrl(publication.coverUrl || '');
    }
  }, [publication]);

  // Redirect jika publikasi tidak ditemukan
  useEffect(() => {
    if (!publication && publications.length > 0) {
      navigate('/publications');
    }
  }, [publication, publications, navigate]);

  // Auto hide success notification after 3 seconds
  useEffect(() => {
    if (successNotification) {
      const timer = setTimeout(() => {
        setSuccessNotification(false);
        navigate('/publications');
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [successNotification, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // Validasi input form
      if (!title || !releaseDate) {
        setError("Judul dan Tanggal Rilis harus diisi!");
        setLoading(false);
        return;
      }

      let newCoverUrl = coverUrl;

      // Upload gambar baru jika ada
      if (coverFile) {
        console.log("Uploading new cover image...");
        newCoverUrl = await uploadImageToCloudinary(coverFile);
        console.log("New cover uploaded:", newCoverUrl);
      }

      // Membuat objek publikasi yang telah diedit
      const updatedPublication = {
        ...publication,
        title,
        releaseDate,
        description, 
        coverUrl: newCoverUrl,
      };

      console.log("Updating publication:", updatedPublication);

      // Memanggil fungsi untuk mengedit publikasi (sekarang async)
      await editPublication(updatedPublication);
      
      // Tampilkan notifikasi sukses
      setSuccessNotification(true);

    } catch (err) {
      console.error("Error updating publication:", err);
      setError("Gagal memperbarui publikasi: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate('/publications');
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setCoverFile(file);
    
    // Clear error jika ada
    if (error) setError("");
  };

  // Loading state saat publikasi belum ditemukan
  if (!publication && publications.length === 0) {
    return (
      <div className="max-w-2xl mx-auto bg-white p-8 rounded-xl shadow-lg">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-sky-700 mx-auto"></div>
          <p className="mt-2 text-gray-600">Memuat data publikasi...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto bg-white p-8 rounded-xl shadow-lg relative">
      {/* Success Notification */}
      {successNotification && (
        <div className="fixed top-4 right-4 z-50 bg-green-500 text-white px-6 py-4 rounded-lg shadow-2xl transform transition-all duration-300 ease-in-out">
          <div className="flex items-center space-x-3">
            <div className="flex-shrink-0">
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <p className="font-semibold">Berhasil!</p>
              <p className="text-sm">Publikasi berhasil diperbarui</p>
            </div>
          </div>
        </div>
      )}

      {/* Loading Overlay */}
      {loading && (
        <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center z-40 rounded-xl">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sky-700 mx-auto"></div>
            <p className="mt-4 text-gray-600 font-medium">Sedang memperbarui publikasi...</p>
          </div>
        </div>
      )}

      <h1 className="text-2xl font-bold text-gray-800 mb-6">Edit Publikasi</h1>
      
      {error && (
        <div className="mb-4 p-4 bg-red-100 border-l-4 border-red-500 text-red-700 rounded-r">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="font-medium">Error</p>
              <p className="text-sm">{error}</p>
            </div>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
            Judul *
          </label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={e => setTitle(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-sky-500 focus:border-sky-500"
            placeholder="Contoh: Indikator Ekonomi Bengkulu 2025"
            disabled={loading}
          />
        </div>

        <div>
          <label htmlFor="releaseDate" className="block text-sm font-medium text-gray-700 mb-1">
            Tanggal Rilis *
          </label>
          <input
            type="date"
            id="releaseDate"
            value={releaseDate}
            onChange={e => setReleaseDate(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-sky-500 focus:border-sky-500"
            disabled={loading}
          />
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
            Deskripsi
          </label>
          <textarea
            id="description"
            value={description}
            onChange={e => setDescription(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-sky-500 focus:border-sky-500"
            placeholder="Deskripsi singkat tentang publikasi ini..."
            rows="4"
            disabled={loading}
          />
        </div>

        {/* Preview gambar lama */}
        {coverUrl && !coverFile && (
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Sampul Saat Ini
            </label>
            <img
              src={coverUrl}
              alt="Cover Publikasi"
              className="h-32 w-auto object-cover rounded shadow-md"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = "https://placehold.co/100x140/cccccc/ffffff?text=Error";
              }}
            />
          </div>
        )}

        <div>
          <label htmlFor="cover" className="block text-sm font-medium text-gray-700 mb-1">
            Sampul Baru (Gambar)
          </label>
          <input
            type="file"
            id="cover"
            accept="image/*"
            onChange={handleFileChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
            disabled={loading}
          />
          <p className="text-xs text-gray-500 mt-1">
            Pilih gambar baru jika ingin mengubah sampul
          </p>
        </div>

        {/* Preview gambar baru */}
        {coverFile && (
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Preview Sampul Baru
            </label>
            <img
              src={URL.createObjectURL(coverFile)}
              alt="Preview Sampul Baru"
              className="h-32 w-auto object-cover rounded shadow-md"
            />
          </div>
        )}

        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={handleCancel}
            className="bg-gray-400 hover:bg-gray-500 text-white font-bold py-2 px-6 rounded-lg transition-colors duration-300 disabled:opacity-50"
            disabled={loading}
          >
            Batal
          </button>

          <button
            type="submit"
            className="bg-sky-700 hover:bg-sky-800 text-white font-bold py-2 px-6 rounded-lg transition-colors duration-300 disabled:opacity-50 flex items-center"
            disabled={loading}
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Menyimpan...
              </>
            ) : (
              'Simpan'
            )}
          </button>
        </div>
      </form>
    </div>
  );
}