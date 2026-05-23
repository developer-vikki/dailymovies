"use client";

import { DownloadLink } from "./types";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type Props = {
  links: DownloadLink[];
  setLinks: (links: DownloadLink[]) => void;
};

export default function DownloadLinks({ links, setLinks }: Props) {
  function addRow() {
    setLinks([
      ...links,
      {
        quality: "",
        server_name: "",
        download_url: "",
        file_size: "",
        is_stream: false,
      },
    ]);
  }

  function update<K extends keyof DownloadLink>(
    index: number,
    key: K,
    value: DownloadLink[K],
  ) {
    const updated = [...links];

    const item = { ...updated[index], [key]: value };
    updated[index] = item;

    setLinks(updated);
  }

  function remove(index: number) {
    setLinks(links.filter((_, i) => i !== index));
  }

  return (
    <div className="space-y-4">
      {links.map((link, index) => (
        <div
          key={index}
          className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4 grid gap-3"
        >
          <Input
            placeholder="1080p"
            value={link.quality}
            onChange={(e) => update(index, "quality", e.target.value)}
          />

          <Input
            placeholder="Mega"
            value={link.server_name}
            onChange={(e) => update(index, "server_name", e.target.value)}
          />

          <Input
            placeholder="Download URL"
            value={link.download_url}
            onChange={(e) => update(index, "download_url", e.target.value)}
          />

          <Input
            placeholder="1.2GB"
            value={link.file_size}
            onChange={(e) => update(index, "file_size", e.target.value)}
          />

          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={link.is_stream}
              onChange={(e) => update(index, "is_stream", e.target.checked)}
            />
            Stream Supported
          </label>

          <Button
            type="button"
            variant="destructive"
            onClick={() => remove(index)}
          >
            Remove
          </Button>
        </div>
      ))}

      <Button type="button" onClick={addRow}>
        + Add Download Link
      </Button>
    </div>
  );
}
