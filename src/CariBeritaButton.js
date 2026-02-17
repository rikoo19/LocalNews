import React from 'react';

// Komponen reusable untuk Button Cari Berita
export default function CariBeritaButton({ onClick, loading, disabled, children }) {
  return (
    <button
      className="btn btn-primary"
      onClick={onClick}
      disabled={disabled || loading}
    >
      {loading ? 'Mencari...' : (children || 'Cari Berita')}
    </button>
  );
}
