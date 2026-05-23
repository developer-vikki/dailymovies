"use client";

import { useState } from "react";

import { createClient } from "@/lib/supabase/client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";

import { Input } from "@/components/ui/input";

type Props = {
  onCreated: (categoryId: string) => void;
};

export default function CreateCategoryDialog({ onCreated }: Props) {
  const supabase = createClient();

  const [open, setOpen] = useState(false);

  const [loading, setLoading] = useState(false);

  const [name, setName] = useState("");

  function generateSlug(value: string) {
    return value.toLowerCase().replace(/\s+/g, "-");
  }

  async function handleCreate() {
    try {
      setLoading(true);

      if (!name.trim()) {
        alert("Category name required");

        return;
      }

      const { data, error } = await supabase
        .from("categories")
        .insert({
          name,
          slug: generateSlug(name),
        })
        .select()
        .single();

      if (error) {
        console.error(error);

        alert(error.message);

        return;
      }

      onCreated(data.id);

      setName("");

      setOpen(false);
    } catch (error) {
      console.error(error);

      alert("Failed to create category");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button type="button" variant="outline" size="sm">
          + Add Category
        </Button>
      </DialogTrigger>

      <DialogContent className="bg-zinc-950 border-zinc-800">
        <DialogHeader>
          <DialogTitle>Create Category</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <Input
            placeholder="Action"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="bg-zinc-900 border-zinc-800"
          />

          <Button onClick={handleCreate} disabled={loading} className="w-full">
            {loading ? "Creating..." : "Create Category"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
