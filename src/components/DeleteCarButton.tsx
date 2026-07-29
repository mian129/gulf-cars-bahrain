"use client";

import { useState } from "react";

interface DeleteCarButtonProps {
  carId: string;
  carTitle: string;
}

export default function DeleteCarButton({ carId, carTitle }: DeleteCarButtonProps) {
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async () => {
    if (!confirm(`Delete "${carTitle}"? This cannot be undone.`)) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/cars/${carId}`, { method: "DELETE" });
      if (res.ok) {
        window.location.reload();
      } else {
        alert("Failed to delete car");
        setDeleting(false);
      }
    } catch {
      alert("Failed to delete car");
      setDeleting(false);
    }
  };

  return (
    <button
      onClick={handleDelete}
      disabled={deleting}
      className="text-red-500 hover:text-red-700 text-sm font-medium disabled:opacity-50"
    >
      {deleting ? "..." : "Delete"}
    </button>
  );
}
