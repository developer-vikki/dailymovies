"use client";

type Props = {
  file: File | null;
  setFile: (file: File | null) => void;
};

export default function PosterUpload({ file, setFile }: Props) {
  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5">
      <h2 className="font-semibold mb-4">Poster</h2>

      <input
        type="file"
        accept="image/*"
        onChange={(e) => setFile(e.target.files?.[0] || null)}
      />

      {file && (
        <img
          src={URL.createObjectURL(file)}
          alt="poster"
          className="mt-4 rounded-xl h-60 object-cover"
        />
      )}
    </div>
  );
}