import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { usePuterStore } from "~/lib/puter";

const WipeApp = () => {
  const { auth, isLoading, error, fs, kv } = usePuterStore();
  const navigate = useNavigate();
  const [files, setFiles] = useState<FSItem[]>([]);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const loadFiles = async () => {
    const files = (await fs.readDir("./")) as FSItem[];
    setFiles(files);
  };

  useEffect(() => {
    loadFiles();
  }, []);

  useEffect(() => {
    if (!isLoading && !auth?.isAuthenticated) {
      navigate("/auth");
    }
  }, [isLoading, auth]);

  const handleDelete = async () => {
    setIsDeleting(true);

    for (const file of files) {
      await fs.delete(file.path);
    }

    await kv.flush();
    await auth.signOut();

    navigate("/auth");
  };

  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center text-xl font-semibold">
        Loading...
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-screen flex items-center justify-center text-red-500">
        Error: {error}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[url('/images/bg-main.svg')] bg-cover flex items-center justify-center p-6 relative">
      
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl p-8 space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-800">
            App Data Manager
          </h1>
          <p className="text-gray-500 mt-2">
            Logged in as <span className="font-semibold">{auth.user?.username}</span>
          </p>
        </div>

        <div className="bg-gray-50 rounded-xl p-4 max-h-60 overflow-y-auto">
          <h2 className="font-semibold mb-3 text-gray-700">Stored Files</h2>
          {files.length > 0 ? (
            files.map((file) => (
              <div
                key={file.id}
                className="bg-white shadow-sm rounded-lg px-4 py-2 mb-2 text-sm text-gray-700"
              >
                {file.name}
              </div>
            ))
          ) : (
            <p className="text-sm text-gray-400">No files found.</p>
          )}
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="w-full bg-red-500 hover:bg-red-600 transition-all duration-300 text-white py-3 rounded-xl font-semibold shadow-md cursor-pointer"
        >
          Wipe App Data & Logout
        </button>
      </div>

      {/* Confirmation Modal */}
      {showModal && (
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-md space-y-4 animate-in fade-in duration-200">
            
            <h2 className="text-xl font-bold text-gray-800">
              Are you sure?
            </h2>
            <p className="text-sm text-gray-500">
              This action will permanently delete all files and log you out.
              This cannot be undone.
            </p>

            <div className="flex gap-4 pt-2">
              <button
                onClick={() => setShowModal(false)}
                className="w-full bg-gray-200 hover:bg-gray-300 py-2 rounded-lg font-medium cursor-pointer"
              >
                Cancel
              </button>

              <button
                onClick={handleDelete}
                disabled={isDeleting}
                className="w-full bg-red-500 hover:bg-red-600 text-white py-2 rounded-lg font-medium disabled:opacity-50 cursor-pointer"
              >
                {isDeleting ? "Deleting..." : "Yes, Delete"}
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
};

export default WipeApp;
