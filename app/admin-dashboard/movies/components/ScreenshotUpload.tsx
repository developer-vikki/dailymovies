"use client";

type Props = {
  files: File[];
  setFiles: (files: File[]) => void;
};

export default function ScreenshotUpload({
  files,
  setFiles,
}: Props) {
  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5">
      <h2 className="font-semibold mb-4">Screenshots</h2>

      <input
        type="file"
        multiple
        accept="image/*"
        onChange={(e) => setFiles(Array.from(e.target.files || []))}
      />

      <div className="grid grid-cols-2 gap-4 mt-4">
        {files.map((file, index) => (
          <img
            key={index}
            src={URL.createObjectURL(file)}
            alt=""
            className="rounded-xl h-32 object-cover"
          />
        ))}
      </div>
    </div>
  );
}