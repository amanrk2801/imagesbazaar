import React, { useState, useEffect, useRef, useCallback } from 'react';
import axios from 'axios';
import ImageCard from '../components/ImageCard';
import './Home.css';

const Home = () => {
  const [images, setImages] = useState([]);
  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const observer = useRef();

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    setImages([]);
    setPage(1);
    setHasMore(true);
    fetchImages(1, true);
  }, [selectedCategory]);

  const fetchImages = async (pageNum = 1, reset = false) => {
    try {
      if (pageNum === 1) setLoading(true);
      else setLoadingMore(true);

      const params = { page: pageNum, limit: 12 };
      if (selectedCategory) params.category = selectedCategory;
      if (search) params.search = search;
      
      const res = await axios.get('/api/images', { params });
      
      if (reset) {
        setImages(res.data.images);
      } else {
        setImages(prev => [...prev, ...res.data.images]);
      }
      
      setHasMore(res.data.images.length === 12);
      setLoading(false);
      setLoadingMore(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
      setLoadingMore(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await axios.get('/api/categories');
      setCategories(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    setImages([]);
    setPage(1);
    setHasMore(true);
    fetchImages(1, true);
  };

  // Infinite scroll - last element ref
  const lastImageRef = useCallback(node => {
    if (loadingMore) return;
    if (observer.current) observer.current.disconnect();
    
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        setPage(prevPage => {
          const nextPage = prevPage + 1;
          fetchImages(nextPage, false);
          return nextPage;
        });
      }
    });
    
    if (node) observer.current.observe(node);
  }, [loadingMore, hasMore]);

  return (
    <div className="home">
      <div className="hero">
        <h1>Discover Amazing Stock Photos</h1>
        <p>Thousands of high-quality images from talented photographers worldwide</p>
        <form onSubmit={handleSearch} className="search-form">
          <input
            type="text"
            placeholder="Search for images, categories, or tags..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button type="submit">🔍 Search</button>
        </form>
      </div>

      <div className="content-section">
        <div className="container">
          <div className="filters">
            <label>Filter by Category:</label>
            <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)}>
              <option value="">All Categories</option>
              {categories.map(cat => (
                <option key={cat._id} value={cat._id}>{cat.name}</option>
              ))}
            </select>
          </div>

          {loading ? (
            <div className="loading-state">
              <div className="loading-spinner"></div>
              <p className="loading-text">Loading amazing images...</p>
            </div>
          ) : images.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon">📸</div>
              <h3>No images found</h3>
              <p>Try adjusting your search or browse all categories</p>
            </div>
          ) : (
            <>
              <div className="images-grid">
                {images.map((image, index) => {
                  if (images.length === index + 1) {
                    return (
                      <div ref={lastImageRef} key={image._id}>
                        <ImageCard image={image} />
                      </div>
                    );
                  } else {
                    return <ImageCard key={image._id} image={image} />;
                  }
                })}
              </div>
              
              {loadingMore && (
                <div className="loading-more">
                  <div className="loading-spinner-small"></div>
                  <p>Loading more images...</p>
                </div>
              )}
              
              {!hasMore && images.length > 0 && (
                <div className="end-message">
                  <p>🎉 You've seen all images!</p>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;
