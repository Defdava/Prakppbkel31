// src/pages/ProfilePage.jsx
import { useState, useEffect, useRef } from "react";
import {
  Edit,
  Save,
  X,
  Camera,
  RefreshCw,
  Trash2,
  Heart,
  Users,
  Hash,
} from "lucide-react";
import { useFavorites } from "../hooks/useFavorites";
import RecipeGrid from "../components/makanan/RecipeGrid";

const STORAGE_KEY = "groupProfileInfo";

const initialMembers = [
  { name: "Defdava Haryadi", nim: "21120123120024", avatar: null },
];

export default function ProfilePage({ onRecipeClick }) {
  const [members, setMembers] = useState(initialMembers);
  const [isEditing, setIsEditing] = useState(false);
  const fileInputRefs = useRef([]);
  const { favorites, loading, error } = useFavorites();

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) setMembers(JSON.parse(stored));
  }, []);

  const handleInputChange = (index, field, value) => {
    const updated = members.map((m, i) =>
      i === index ? { ...m, [field]: value } : m
    );
    setMembers(updated);
  };

  const handlePhotoChange = (index, e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (!file.type.startsWith("image/"))
      return alert("Pilih file gambar (jpg/png)");
    if (file.size > 2 * 1024 * 1024)
      return alert("Ukuran maksimal 2MB.");

    const reader = new FileReader();
    reader.onloadend = () => {
      handleInputChange(index, "avatar", reader.result);
    };
    reader.readAsDataURL(file);
  };

  const triggerInput = (i) => fileInputRefs.current[i]?.click();

  const handleSave = () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(members));
    setIsEditing(false);
    alert("Profil disimpan!");
  };

  const handleCancel = () => {
    const stored = localStorage.getItem(STORAGE_KEY);
    setMembers(stored ? JSON.parse(stored) : initialMembers);
    setIsEditing(false);
  };

  const handleReset = () => {
    if (window.confirm("Yakin reset semua data?")) {
      setMembers(initialMembers);
      localStorage.removeItem(STORAGE_KEY);
      setIsEditing(false);
    }
  };

  const handleRemovePhoto = (i) => {
    if (window.confirm("Hapus foto profil ini?")) {
      handleInputChange(i, "avatar", null);
    }
  };

  const groupInfo = { groupName: "KELOMPOK 31 PRAK PPB" };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-6 md:px-10 lg:px-20">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* SIDEBAR PROFIL */}
        <div className="bg-white rounded-2xl shadow-md border border-gray-200 p-8 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-purple-100 text-purple-700 rounded-full">
                <Users size={24} />
              </div>
              <h2 className="text-2xl font-semibold text-gray-800">
                {groupInfo.groupName}
              </h2>
            </div>

            {members.map((member, i) => (
              <div key={i} className="flex flex-col items-center text-center">
                <div className="relative mb-4">
                  <img
                    src={
                      member.avatar ||
                      `https://ui-avatars.com/api/?name=${encodeURIComponent(
                        member.name
                      )}&background=dcd6f7&color=4b0082`
                    }
                    alt={member.name}
                    className="w-28 h-28 rounded-full object-cover border-4 border-purple-200"
                  />
                  {isEditing && (
                    <div className="absolute -bottom-3 right-2 flex gap-2">
                      <button
                        onClick={() => triggerInput(i)}
                        className="bg-purple-600 text-white p-2 rounded-full hover:bg-purple-700"
                      >
                        <Camera size={14} />
                      </button>
                      {member.avatar && (
                        <button
                          onClick={() => handleRemovePhoto(i)}
                          className="bg-red-500 text-white p-2 rounded-full hover:bg-red-600"
                        >
                          <Trash2 size={14} />
                        </button>
                      )}
                      <input
                        type="file"
                        accept="image/*"
                        ref={(el) => (fileInputRefs.current[i] = el)}
                        className="hidden"
                        onChange={(e) => handlePhotoChange(i, e)}
                      />
                    </div>
                  )}
                </div>

                {isEditing ? (
                  <div className="w-full text-left">
                    <label className="block text-sm font-medium text-gray-600">
                      Nama
                    </label>
                    <input
                      type="text"
                      value={member.name}
                      onChange={(e) =>
                        handleInputChange(i, "name", e.target.value)
                      }
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 mb-2 focus:border-purple-500 focus:ring-1 focus:ring-purple-400"
                    />
                    <label className="block text-sm font-medium text-gray-600">
                      NIM
                    </label>
                    <input
                      type="text"
                      value={member.nim}
                      onChange={(e) =>
                        handleInputChange(i, "nim", e.target.value)
                      }
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:border-purple-500 focus:ring-1 focus:ring-purple-400"
                    />
                  </div>
                ) : (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800">
                      {member.name}
                    </h3>
                    <p className="text-sm text-gray-500 flex items-center justify-center mt-1">
                      <Hash size={13} className="mr-1 text-gray-400" />
                      {member.nim}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="mt-8 flex flex-wrap justify-center gap-3">
            {isEditing ? (
              <>
                <button
                  onClick={handleSave}
                  className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center gap-2"
                >
                  <Save size={16} /> Simpan
                </button>
                <button
                  onClick={handleCancel}
                  className="bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-600 flex items-center gap-2"
                >
                  <X size={16} /> Batal
                </button>
                <button
                  onClick={handleReset}
                  className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 flex items-center gap-2"
                >
                  <RefreshCw size={16} /> Reset
                </button>
              </>
            ) : (
              <button
                onClick={() => setIsEditing(true)}
                className="bg-purple-600 text-white px-5 py-2.5 rounded-lg hover:bg-purple-700 flex items-center gap-2"
              >
                <Edit size={16} /> Edit Profil
              </button>
            )}
          </div>
        </div>

        {/* KOLOM RESEP FAVORIT */}
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-md border border-gray-200 p-8">
          <div className="flex items-center gap-3 mb-8">
            <div className="p-3 bg-pink-100 text-pink-600 rounded-full">
              <Heart size={24} />
            </div>
            <h2 className="text-2xl font-semibold text-gray-800">
              Resep Favorit Saya
            </h2>
          </div>

          {loading ? (
            <div className="text-center py-20">
              <div className="animate-spin w-10 h-10 border-4 border-purple-400 border-t-transparent rounded-full mx-auto"></div>
              <p className="mt-4 text-gray-600">Memuat resep favorit...</p>
            </div>
          ) : error ? (
            <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
              <p className="text-red-600 font-semibold mb-2">Terjadi Kesalahan</p>
              <p className="text-red-500 text-sm">{error}</p>
            </div>
          ) : favorites.length === 0 ? (
            <div className="text-center py-16">
              <Heart
                size={50}
                className="text-gray-300 mb-4 mx-auto"
                strokeWidth={1.2}
              />
              <p className="text-gray-600 text-lg">
                Belum ada resep favorit yang disimpan.
              </p>
              <p className="text-gray-400 mt-1">
                Klik ikon hati di resep untuk menambahkannya.
              </p>
            </div>
          ) : (
            <RecipeGrid recipes={favorites} onRecipeClick={onRecipeClick} />
          )}
        </div>
      </div>
    </div>
  );
}
