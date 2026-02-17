import React from 'react';

function About() {
  return (
    <div className="about-page" style={{maxWidth: 600, margin: '40px auto', background: 'white', borderRadius: 12, padding: 32, boxShadow: '0 2px 8px rgba(0,0,0,0.08)'}}>
      <h2 style={{marginBottom: 16}}>Tentang News Finder</h2>
      <p>Aplikasi ini dibuat untuk mencari dan menampilkan berita lokal terkini menggunakan GNews API.</p>
      <ul style={{margin: '16px 0 24px 20px'}}>
        <li>Pencarian berita berdasarkan kata kunci</li>
        <li>Pilihan kategori berita</li>
        <li>Filter berita dengan gambar</li>
      </ul>
      {/* API Key dihapus dari tampilan */}
      <p>© 2025 News Finder</p>
    </div>
  );
}

export default About;
