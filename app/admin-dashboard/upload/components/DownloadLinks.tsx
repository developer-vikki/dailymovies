"use client";

import { DownloadLink } from "./types";

import { Input } from "@/components/ui/input";

import { Label } from "@/components/ui/label";

import { Switch } from "@/components/ui/switch";

type Props = {
  links: DownloadLink[];

  setLinks: React.Dispatch<React.SetStateAction<DownloadLink[]>>;
};

export default function DownloadLinks({ links, setLinks }: Props) {
  function addRow() {
    setLinks((prev) => [
      ...prev,
      {
        quality: "",
        server_name: "",
        download_url: "",
        file_size: "",
        is_stream: false,
      },
    ]);
  }

  function removeRow(index: number) {
    setLinks((prev) => prev.filter((_, i) => i !== index));
  }

  function updateRow(
    index: number,
    key: keyof DownloadLink,
    value: string | boolean,
  ) {
    setLinks((prev) =>
      prev.map((item, i) =>
        i === index
          ? {
              ...item,
              [key]: value,
            }
          : item,
      ),
    );
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <Label>Download Links</Label>

        <button
          type="button"
          onClick={addRow}
          className="text-sm text-blue-500"
        >
          + Add Link
        </button>
      </div>

      {links.length === 0 && (
        <div className="text-sm text-zinc-500">No download links added</div>
      )}

      {links.map((link, index) => (
        <div
          key={index}
          className="bg-zinc-950 border border-zinc-800 rounded-2xl p-4 space-y-4"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Quality</Label>

              <Input
                value={link.quality}
                onChange={(e) => updateRow(index, "quality", e.target.value)}
                placeholder="1080p"
                className="bg-zinc-900 border-zinc-800"
              />
            </div>

            <div className="space-y-2">
              <Label>Server</Label>

              <Input
                value={link.server_name}
                onChange={(e) =>
                  updateRow(index, "server_name", e.target.value)
                }
                placeholder="Mega"
                className="bg-zinc-900 border-zinc-800"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Download URL</Label>

            <Input
              value={link.download_url}
              onChange={(e) => updateRow(index, "download_url", e.target.value)}
              placeholder="https://..."
              className="bg-zinc-900 border-zinc-800"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>File Size</Label>

              <Input
                value={link.file_size}
                onChange={(e) => updateRow(index, "file_size", e.target.value)}
                placeholder="1.5GB"
                className="bg-zinc-900 border-zinc-800"
              />
            </div>

            <div className="flex items-center gap-3 pt-8">
              <Switch
                checked={link.is_stream}
                onCheckedChange={(checked) =>
                  updateRow(index, "is_stream", checked)
                }
              />

              <Label>Streaming Supported</Label>
            </div>
          </div>

          <button
            type="button"
            onClick={() => removeRow(index)}
            className="text-red-500 text-sm"
          >
            Remove Link
          </button>
        </div>
      ))}
    </div>
  );
}
