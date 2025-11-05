import React, { useEffect, useState } from "react";
import { ImageIcon, X } from "lucide-react";
import Image from "next/image";

type ImagePickerProps = {
  name: string;
  defaultImage: string | null;
  required?: boolean;
  onChange?: (file: File | null) => void;
  classes?: string;
};

export default function ImagePicker({
  name,
  defaultImage,
  required = true,
  classes,
  onChange,
}: ImagePickerProps) {
  const [preview, setPreview] = useState<string | null>(defaultImage || null);
  const [file, setFile] = useState<File | null>(null);

  useEffect(() => {
    if (defaultImage) {
      setPreview(defaultImage);
    }
  }, [defaultImage]);

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    setFile(selectedFile);

    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result as string);
    };
    reader.readAsDataURL(selectedFile);
    onChange?.(selectedFile);
  };

  const handleRemoveImage = () => {
    setPreview(null);
    setFile(null);
  };

  return (
    <div className={`w-full ${classes ? "" : "max-w-md"}`}>
      <div className="relative">
        {preview ? (
          <div className="relative rounded-lg overflow-hidden">
            <Image
              src={preview}
              alt="Selected preview"
              width={400}
              height={160}
              className="w-full h-40 object-cover"
              unoptimized={preview?.startsWith("data:")}
              priority
            />
            <button
              type="button"
              onClick={handleRemoveImage}
              className="absolute top-2 right-2 p-1 bg-white rounded-full shadow-md hover:bg-gray-100 transition-colors"
              aria-label="Remove image"
            >
              <X className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        ) : (
          <label
            className={`${classes} flex flex-col items-center justify-center w-full h-40 border-2 hover:border-primary border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 dark:bg-gray-900 dark:hover:bg-gray-800 transition-colors`}
          >
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
              <ImageIcon className="w-12 h-12 text-gray-400 mb-3" />
              <p className="mb-2 text-sm text-gray-500">
                <span className="font-semibold">Click to upload</span> or drag
                and drop
              </p>
              <p className="text-xs text-gray-500">
                JPEG, PNG, or WebP up to 5MB
              </p>
            </div>
            <input
              type="file"
              className="absolute pointer-events-none select-none opacity-0"
              onChange={handleImageSelect}
              accept="image/*"
              required={required}
            />
          </label>
        )}
        {/* Hidden input for form submission */}
        <input
          type="file"
          name={name}
          className="hidden"
          onChange={handleImageSelect}
          accept="image/*"
          ref={(input) => {
            if (input) {
              const dataTransfer = new DataTransfer();
              if (file) {
                dataTransfer.items.add(file);
                input.files = dataTransfer.files;
              }
            }
          }}
        />
      </div>
    </div>
  );
}
