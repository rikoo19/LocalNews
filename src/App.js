import React, { useState, useEffect } from 'react';
import './App.css';

import { Routes, Route, Link } from 'react-router-dom';
import About from './About';

const NEWS_API_URL = 'https://gnews.io/api/v4/top-headlines';
const SEARCH_API_URL = 'https://gnews.io/api/v4/search';
const API_KEY = 'b60bbf17dbfbed23f66ab704776272dc';

// Komponen TextBox
class TextBox extends React.Component {
  render() {
    const { value, onChange, placeholder, label } = this.props;
    return (
      <div className="textbox-container">
        {label && <label className="input-label">{label}</label>}
        <input
          type="text"
          className="textbox"
          value={value}
          onChange={onChange}
          placeholder={placeholder}
        />
      </div>
    );
  }
}



// Komponen Dropdown
class Dropdown extends React.Component {
  render() {
    const { value, onChange, options, label } = this.props;
    return (
      <div className="dropdown-container">
        {label && <label className="input-label">{label}</label>}
        <select className="dropdown" value={value} onChange={onChange}>
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
    );
  }
}

// Komponen CheckBox
class CheckBox extends React.Component {
  render() {
    const { checked, onChange, label } = this.props;
    return (
      <div className="checkbox-container">
        <label className="checkbox-label">
          <input
            type="checkbox"
            checked={checked}
            onChange={onChange}
            className="checkbox"
          />
          <span>{label}</span>
        </label>
      </div>
    );
  }
}

// Komponen Card Berita
class NewsCard extends React.Component {
  render() {
    const { article } = this.props;
    return (
      <div className="news-card">
        {article.image && (
          <img
            src={article.image}
            alt={article.title}
            className="news-image"
            onError={(e) => {
              e.target.style.display = 'none';
            }}
          />
        )}
        <div className="news-content">
          <h3 className="news-title">{article.title}</h3>
          <p className="news-source">
            {article.source?.name || 'Unknown'} • {new Date(article.publishedAt).toLocaleDateString('id-ID')}
          </p>
          <p className="news-description">{article.description || article.content}</p>
          <a
            href={article.url}
            target="_blank"
            rel="noopener noreferrer"
            className="news-link"
          >
            Baca Selengkapnya →
          </a>
        </div>
      </div>
    );
  }
}

// Halaman Utama - Main App Component
class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      // State untuk input pencarian
      searchQuery: props.initialQuery || '',
      // ...existing code...
      category: 'general',
      showImagesOnly: false,
      articles: [],
      loading: false,
      error: '',
      hasSearched: false,
      // Derived state example
      derivedQuery: props.initialQuery || ''
    };
  }
  // Derived state from props
  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.initialQuery !== prevState.derivedQuery) {
      return {
        searchQuery: nextProps.initialQuery,
        derivedQuery: nextProps.initialQuery
      };
    }
    return null;
  }

  // Method untuk mengambil berita dari API
  fetchNews = async () => {
    const { searchQuery, category, showImagesOnly } = this.state;
    this.setState({ loading: true, error: '', hasSearched: true });
    try {
      // GNews API format
      let url;
      const safeQuery = typeof searchQuery === 'string' ? searchQuery : '';
      if (safeQuery.trim()) {
        // Gunakan search endpoint jika ada query
        url = `${SEARCH_API_URL}?q=${encodeURIComponent(safeQuery)}&lang=id&country=id&max=10&apikey=${API_KEY}`;
      } else {
        // Gunakan top-headlines dengan kategori
        url = `${NEWS_API_URL}?lang=id&country=id&topic=${category}&max=10&apikey=${API_KEY}`;
      }
      const response = await fetch(url);
      const data = await response.json();

      if (response.status === 429) {
        throw new Error('Batas permintaan API terlampaui (429). Batas gratis GNews adalah 100 request/hari. Silakan tunggu hingga reset (24 jam) atau dapatkan API key baru di gnews.io');
      }

      if (data.articles) {
        let articles = data.articles || [];
        // Filter hanya artikel dengan gambar jika checkbox dicentang
        if (showImagesOnly) {
          articles = articles.filter(article => article.image);
        }
        this.setState({
          articles: articles,
          loading: false
        });
      } else {
        throw new Error(data.message || 'Gagal mengambil berita');
      }
    } catch (error) {
      this.setState({
        error: error.message || 'Terjadi kesalahan saat mengambil berita. Coba lagi nanti.',
        loading: false,
        articles: []
      });
    }
  };

  // Handler untuk perubahan input pencarian
  handleSearchChange = (e) => {
    this.setState({ searchQuery: e.target.value });
  };

  // Handler untuk perubahan kategori
  handleCategoryChange = (e) => {
    this.setState({ category: e.target.value });
  };

  // Handler untuk checkbox
  handleCheckboxChange = (e) => {
    this.setState({ showImagesOnly: e.target.checked });
  };

  // Handler untuk tombol cari
  handleSearch = () => {
    this.fetchNews();
  };

  // Handler untuk enter key di textbox
  handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      this.handleSearch();
    }
  };

  // Lifecycle method - load berita default saat komponen dimount
  componentDidMount() {
    console.log('App did mount');
    this.fetchNews();
  }

  // Lifecycle method - update
  componentDidUpdate(prevProps, prevState) {
    if (prevState.searchQuery !== this.state.searchQuery) {
      console.log('searchQuery berubah:', this.state.searchQuery);
     
    }
    if (prevProps.initialQuery !== this.props.initialQuery) {
      console.log('initialQuery prop berubah:', this.props.initialQuery);
    }
  }

  // Lifecycle method - will unmount
  componentWillUnmount() {
    console.log('App will unmount');
  }

  render() {
    const {
      searchQuery,
      category,
      showImagesOnly,
      articles,
      loading,
      error,
      hasSearched
    } = this.state;

    const categoryOptions = [
      { value: 'general', label: 'Umum' },
      { value: 'world', label: 'Dunia' },
      { value: 'nation', label: 'Nasional' },
      { value: 'business', label: 'Bisnis' },
      { value: 'technology', label: 'Teknologi' },
      { value: 'entertainment', label: 'Hiburan' },
      { value: 'sports', label: 'Olahraga' },
      { value: 'science', label: 'Sains' },
      { value: 'health', label: 'Kesehatan' }
    ];

    return (
      <div className="app">
        {/* Header */}
        <header className="header">
          <div className="container">
            <h1 className="app-title">📰 News Finder</h1>
            <p className="app-subtitle">Temukan Berita Lokal Terkini</p>
            <nav style={{ marginTop: 10 }}>
              <Link to="/" style={{ marginRight: 16 }}>Home</Link>
              <Link to="/about">About</Link>
            </nav>
          </div>
        </header>

        {/* Main Content */}
        <main className="main-content">
          <div className="container">
            <Routes>
              <Route path="/" element={
                <>
                  {/* Search Section */}
                  <div className="search-section">
                    <div className="search-controls">
                      <TextBox
                        label="Cari Berita"
                        value={searchQuery}
                        onChange={this.handleSearchChange}
                        placeholder="Masukkan kata kunci berita..."
                        onKeyPress={this.handleKeyPress}
                      />
                      <Dropdown
                        label="Kategori"
                        value={category}
                        onChange={this.handleCategoryChange}
                        options={categoryOptions}
                      />
                      <CheckBox
                        checked={showImagesOnly}
                        onChange={this.handleCheckboxChange}
                        label="Hanya tampilkan berita dengan gambar"
                      />
                      <CariBeritaButton
                        onClick={this.handleSearch}
                        loading={loading}
                        disabled={loading}
                      />
                    </div>
                  </div>
                  {/* Results Section */}
                  <div className="results-section">
                    {loading && (
                      <div className="loading">
                        <div className="spinner"></div>
                        <p>Memuat berita...</p>
                      </div>
                    )}
                    {error && (
                      <div className="error-message">
                        <p>⚠️ {error}</p>
                        <p className="error-note">
                          Catatan: Untuk API key sendiri, daftar gratis di{' '}
                          <a href="https://gnews.io" target="_blank" rel="noopener noreferrer">
                            gnews.io
                          </a>{' '}
                          (100 requests/hari gratis)
                        </p>
                      </div>
                    )}
                    {!loading && !error && articles.length === 0 && hasSearched && (
                      <div className="no-results">
                        <p>Tidak ada berita ditemukan</p>
                        <p>Coba kata kunci atau kategori lain</p>
                      </div>
                    )}
                    {!loading && articles.length > 0 && (
                      <div className="news-grid">
                        {articles.map((article, index) => (
                          <NewsCard key={index} article={article} />
                        ))}
                      </div>
                    )}
                  </div>
                </>
              } />
              <Route path="/about" element={<About />} />
            </Routes>
          </div>
        </main>

        {/* Footer */}
        <footer className="footer">
          <div className="container">
            <p>© 2025 News Finder - Local News Application</p>
            <p className="footer-note">Powered by GNews API</p>
          </div>
        </footer>
      </div>
    );
  }
}

import CariBeritaButton from './CariBeritaButton';

function AppWithHooks(props) {
  const [searchQuery, setSearchQuery] = useState(props.initialQuery || '');
  const [category, setCategory] = useState('general');
  const [showImagesOnly, setShowImagesOnly] = useState(false);
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [hasSearched, setHasSearched] = useState(false);

  // Sync state with props.initialQuery
  useEffect(() => {
    setSearchQuery(props.initialQuery || '');
  }, [props.initialQuery]);

  // Fetch news function
  const fetchNews = async () => {
    setLoading(true);
    setError('');
    setHasSearched(true);
    try {
      let url;
      const safeQuery = typeof searchQuery === 'string' ? searchQuery : '';
      if (safeQuery.trim()) {
        url = `${SEARCH_API_URL}?q=${encodeURIComponent(safeQuery)}&lang=id&country=id&max=10&apikey=${API_KEY}`;
      } else {
        url = `${NEWS_API_URL}?lang=id&country=id&topic=${category}&max=10&apikey=${API_KEY}`;
      }
      const response = await fetch(url);
      const data = await response.json();

      if (response.status === 429) {
        throw new Error('Batas permintaan API terlampaui (429). Batas gratis GNews adalah 100 request/hari. Silakan tunggu hingga reset (24 jam) atau dapatkan API key baru di gnews.io');
      }

      if (data.articles) {
        let filteredArticles = data.articles || [];
        if (showImagesOnly) {
          filteredArticles = filteredArticles.filter(article => article.image);
        }
        setArticles(filteredArticles);
        setLoading(false);
      } else {
        throw new Error(data.message || 'Gagal mengambil berita');
      }
    } catch (err) {
      setError(err.message || 'Terjadi kesalahan saat mengambil berita. Coba lagi nanti.');
      setLoading(false);
      setArticles([]);
    }
  };

  // Load berita default saat mount
  useEffect(() => {
    fetchNews();
    // eslint-disable-next-line
  }, []);

  // Handler
  const handleSearchChange = (e) => setSearchQuery(e.target.value);
  const handleCategoryChange = (e) => setCategory(e.target.value);
  const handleCheckboxChange = (e) => setShowImagesOnly(e.target.checked);
  const handleSearch = () => fetchNews();
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') handleSearch();
  };

  const categoryOptions = [
    { value: 'general', label: 'Umum' },
    { value: 'world', label: 'Dunia' },
    { value: 'nation', label: 'Nasional' },
    { value: 'business', label: 'Bisnis' },
    { value: 'technology', label: 'Teknologi' },
    { value: 'entertainment', label: 'Hiburan' },
    { value: 'sports', label: 'Olahraga' },
    { value: 'science', label: 'Sains' },
    { value: 'health', label: 'Kesehatan' }
  ];

  return (
    <div className="app">
      {/* Header */}
      <header className="header">
        <div className="container">
          <h1 className="app-title">📰 News Finder</h1>
          <p className="app-subtitle">Temukan Berita Lokal Terkini</p>
          <nav style={{ marginTop: 10 }}>
            <Link to="/" style={{ marginRight: 16 }}>Home</Link>
            <Link to="/about">About</Link>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="main-content">
        <div className="container">
          <Routes>
            <Route path="/" element={
              <>
                {/* Search Section */}
                <div className="search-section">
                  <div className="search-controls">
                    <TextBox
                      label="Cari Berita"
                      value={searchQuery}
                      onChange={handleSearchChange}
                      placeholder="Masukkan kata kunci berita..."
                      onKeyPress={handleKeyPress}
                    />
                    <Dropdown
                      label="Kategori"
                      value={category}
                      onChange={handleCategoryChange}
                      options={categoryOptions}
                    />
                    <CheckBox
                      checked={showImagesOnly}
                      onChange={handleCheckboxChange}
                      label="Hanya tampilkan berita dengan gambar"
                    />
                    <CariBeritaButton
                      onClick={handleSearch}
                      loading={loading}
                      disabled={loading}
                    />
                  </div>
                </div>
                {/* Results Section */}
                <div className="results-section">
                  {loading && (
                    <div className="loading">
                      <div className="spinner"></div>
                      <p>Memuat berita...</p>
                    </div>
                  )}
                  {error && (
                    <div className="error-message">
                      <p>⚠️ {error}</p>
                      <p className="error-note">
                        Catatan: Untuk API key sendiri, daftar gratis di{' '}
                        <a href="https://gnews.io" target="_blank" rel="noopener noreferrer">
                          gnews.io
                        </a>{' '}
                        (100 requests/hari gratis)
                      </p>
                    </div>
                  )}
                  {!loading && !error && articles.length === 0 && hasSearched && (
                    <div className="no-results">
                      <p>Tidak ada berita ditemukan</p>
                      <p>Coba kata kunci atau kategori lain</p>
                    </div>
                  )}
                  {!loading && articles.length > 0 && (
                    <div className="news-grid">
                      {articles.map((article, index) => (
                        <NewsCard key={index} article={article} />
                      ))}
                    </div>
                  )}
                </div>
              </>
            } />
            <Route path="/about" element={<About />} />
          </Routes>
        </div>
      </main>

      {/* Footer */}
      <footer className="footer">
        <div className="container">
          <p>© 2025 News Finder - Local News Application</p>
          <p className="footer-note">Powered by GNews API</p>
        </div>
      </footer>
    </div>
  );
}

export default AppWithHooks;
