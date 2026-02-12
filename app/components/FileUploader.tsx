import { useCallback, useState } from 'react'
import { useDropzone } from 'react-dropzone'

interface FileUploaderProps {
  onFileSelect?: (file: File | null) => void;
}

const formatSize = (bytes: number): string => {
  if (bytes === 0) return "0 Bytes";

  const kb = 1024;
  const mb = kb * 1024;
  const gb = mb * 1024;

  if (bytes >= gb) {
    return (bytes / gb).toFixed(2) + " GB";
  } else if (bytes >= mb) {
    return (bytes / mb).toFixed(2) + " MB";
  } else if (bytes >= kb) {
    return (bytes / kb).toFixed(2) + " KB";
  } else {
    return bytes + " Bytes";
  }
};

const FileUploader = ({ onFileSelect }: FileUploaderProps) => {

  // ✅ Added local state to control file
  const [file, setFile] = useState<File | null>(null);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const selectedFile = acceptedFiles[0] || null;

    setFile(selectedFile);
    onFileSelect?.(selectedFile);

    // ✅ Console log file data
    if (selectedFile) {
      console.log("Uploaded File Data:", {
        name: selectedFile.name,
        size: formatSize(selectedFile.size),
        type: selectedFile.type
      });
    }

  }, [onFileSelect])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: false,
    accept: { 'application/pdf': ['.pdf'] },
    maxSize: 20 * 1024 * 1024,
  })

  const handleRemove = () => {
    setFile(null);
    onFileSelect?.(null);
    console.log("File Removed");
  }

  return (
    <div
      className={`w-full gradient-border border-2 rounded-lg sm:rounded-xl transition-all duration-300 transform hover:scale-[1.01]
      ${isDragActive ? 'border-purple-500 bg-purple-500/10 shadow-lg shadow-purple-500/30 scale-[1.02]' : 'border-gray-300 hover:border-purple-400/50'}`}
    >
      <div {...getRootProps()}>
        <input {...getInputProps()} />
        <div className='space-y-3 sm:space-y-4 cursor-pointer p-4 sm:p-6 lg:p-8 text-center flex justify-center items-center'>
          
          <div className={`mx-auto w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 flex items-center justify-center transition-transform duration-300 ${isDragActive ? 'scale-110 animate-bounce' : 'hover:scale-110'}`}>
            <img src="/icons/info.svg" alt="upload" className='w-full h-full object-contain' />
          </div>

          {file ? (
            <div className='uploader-selected-file bg-white/5 backdrop-blur-sm rounded-lg p-3 sm:p-4 border border-white/10 transition-all duration-300 hover:bg-white/10'
              onClick={(e) => e.stopPropagation()}>

              <div className='flex items-center gap-2 sm:gap-3'>

                <div className='flex-shrink-0'>
                  <img src="/images/pdf.png" alt="pdf" className='w-8 h-8 sm:w-10 sm:h-10 object-contain' />
                </div>

                <div className='flex-1 min-w-0 text-left'>
                  <p className='text-xs sm:text-sm font-medium text-gray-200 truncate max-w-[150px] sm:max-w-xs'>
                    {file.name}
                  </p>
                  <p className='text-xs sm:text-sm text-gray-400 mt-0.5'>
                    {formatSize(file.size)}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleRemove}
                  className='flex-shrink-0 text-sm text-red-400 hover:text-red-300 cursor-pointer p-1.5 sm:p-2 rounded-lg hover:bg-red-500/10 transition-all duration-200'
                  aria-label="Remove file"
                >
                  <img src="/icons/cross.svg" alt="remove" className='w-3 h-3 sm:w-4 sm:h-4' />
                </button>

              </div>
            </div>
          ) : (
            <div className='space-y-1 sm:space-y-2'>
              <p className='text-sm sm:text-base lg:text-lg text-gray-300 px-2'>
                <span className='font-semibold text-purple-400'>
                  Click to upload
                </span>
                <span className='hidden xs:inline'> or drag and drop</span>
                <span className='inline xs:hidden'> or drag & drop</span>
              </p>
              <p className='text-xs sm:text-sm lg:text-base text-gray-400'>
                PDF (max 20MB)
              </p>
            </div>
          )}

          {isDragActive && (
            <div className='absolute inset-0 bg-purple-500/5 backdrop-blur-sm rounded-lg sm:rounded-xl border-2 border-dashed border-purple-400 flex items-center justify-center pointer-events-none animate-pulse'>
              <p className='text-purple-400 font-semibold text-sm sm:text-base lg:text-lg'>
                Drop your file here
              </p>
            </div>
          )}

        </div>
      </div>
    </div>
  )
}

export default FileUploader
