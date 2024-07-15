import React, { useState, useEffect, useCallback, Suspense } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

// Composant optimisé pour éviter les rendus inutiles
const PostCard = React.memo(({ post }) => (
  <div className="w-full max-w-xs flex-shrink-0 px-4 border-r border-gray-100">
    <Link className="block px-4 group" to={`/post/${post.id}`}>
      {post.featured_media_url && (
        <img className="block size-fit mb-4 rounded-3xl justify-stretch" src={post.featured_media_url} alt={post.title.rendered} />
      )}
      <span className="block text-gray-500 mb-2">{new Date(post.date).toLocaleDateString()}</span>
      <h4 className="text-xl font-semibold text-gray-900 group-hover:text-orange-900">{post.title.rendered}</h4>
    </Link>
  </div>
));

const BlogCom = () => {
  const [posts, setPosts] = useState([]);
  const [activeSlide, setActiveSlide] = useState(1);
  const slideCount = 3;

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axios.get('http://localhost/alt2/wp-json/wp/v2/posts');
        const posts = response.data;
        const mediaRequests = posts.map(async post => {
          try {
            const mediaResponse = await axios.get(`http://localhost/alt2/wp-json/wp/v2/media/${post.featured_media}`);
            return { ...post, featured_media_url: mediaResponse.data.source_url };
          } catch (error) {
            console.error(`Erreur lors de la récupération du média pour l'article ${post.id}:`, error);
            return { ...post, featured_media_url: null };
          }
        });
        const postsWithMedia = await Promise.all(mediaRequests);
        setPosts(postsWithMedia);
      } catch (error) {
        console.error('Erreur lors de la récupération des articles :', error);
      }
    };

    fetchPosts();
  }, []);

  const handlePrevSlide = useCallback(() => {
    setActiveSlide(activeSlide > 1 ? activeSlide - 1 : slideCount);
  }, [activeSlide, slideCount]);

  const handleNextSlide = useCallback(() => {
    setActiveSlide(activeSlide < slideCount ? activeSlide + 1 : 1);
  }, [activeSlide, slideCount]);

  const memoizedPosts = React.useMemo(() => posts, [posts]);

  return (
    <div>
      <section className="w-full h-full relative py-20 md:py-32 lg:py-40 overflow-hidden z-10">
        <div className="relative container px-4 mx-auto">
          <div className="md:flex">
            <div className="max-w-sm flex-shrink-0 mb-20 md:mb-0 xl:mr-40">
              <h1 className="font-heading pb-6 text-5xl xs:text-6xl md:text-7xl font-bold mb-18">
                <span>Actualités</span>
              </h1>
              <div className="flex items-center">
                <button onClick={handlePrevSlide} aria-label="Previous Slide" className="inline-flex mr-3 items-center justify-center w-12 h-12 rounded-full bg-gray-200 hover:bg-gray-400 transition duration-200">
                  {/* SVG Code */}
                  <svg width="8" height="12" viewBox="0 0 8 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M1.17006 5.28995L5.41006 1.04995C5.50302 0.95622 5.61362 0.881826 5.73548 0.831057C5.85734 0.780288 5.98805 0.75415 6.12006 0.75415C6.25207 0.75415 6.38277 0.780288 6.50463 0.831057C6.62649 0.881826 6.73709 0.95622 6.83006 1.04995C7.01631 1.23731 7.12085 1.49076 7.12085 1.75495C7.12085 2.01913 7.01631 2.27259 6.83006 2.45995L3.29006 5.99995L6.83006 9.53995C7.01631 9.72731 7.12085 9.98076 7.12085 10.2449C7.12085 10.5091 7.01631 10.7626 6.83006 10.9499C6.73662 11.0426 6.6258 11.116 6.50396 11.1657C6.38213 11.2155 6.25166 11.2407 6.12006 11.2399C5.98845 11.2407 5.85799 11.2155 5.73615 11.1657C5.61431 11.116 5.5035 11.0426 5.41006 10.9499L1.17006 6.70995C1.07633 6.61699 1.00194 6.50638 0.951166 6.38453C0.900397 6.26267 0.874259 6.13196 0.874259 5.99995C0.874259 5.86794 0.900397 5.73723 0.951166 5.61537C1.00194 5.49351 1.07633 5.38291 1.17006 5.28995Z" fill="#424453"></path>
                  </svg>
                </button>
                <button onClick={handleNextSlide} aria-label="Next Slide" className="inline-flex mr-3 items-center justify-center w-12 h-12 rounded-full bg-orange-200 hover:bg-orange-400 transition duration-200">
                  {/* SVG Code */}
                  <svg width="8" height="12" viewBox="0 0 8 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M6.82994 5.28995L2.58994 1.04995C2.49698 0.95622 2.38638 0.881826 2.26452 0.831057C2.14266 0.780288 2.01195 0.75415 1.87994 0.75415C1.74793 0.75415 1.61723 0.780288 1.49537 0.831057C1.37351 0.881826 1.26291 0.95622 1.16994 1.04995C0.983692 1.23731 0.87915 1.49076 0.87915 1.75495C0.87915 2.01913 0.983692 2.27259 1.16994 2.45995L4.70994 5.99995L1.16994 9.53995C0.983692 9.72731 0.87915 9.98076 0.87915 10.2449C0.87915 10.5091 0.983692 10.7626 1.16994 10.9499C1.26338 11.0426 1.3742 11.116 1.49604 11.1657C1.61787 11.2155 1.74834 11.2407 1.87994 11.2399C2.01155 11.2407 2.14201 11.2155 2.26385 11.1657C2.38569 11.116 2.4965 11.0426 2.58994 10.9499L6.82994 6.70995C6.92367 6.61699 6.99806 6.50638 7.04883 6.38453C7.0996 6.26267 7.12574 6.13196 7.12574 5.99995C7.12574 5.86794 7.0996 5.73723 7.04883 5.61537C6.99806 5.49351 6.92367 5.38291 6.82994 5.28995Z" fill="#FF460C"></path>
                  </svg>
                </button>
              </div>
            </div>
            <div className="overflow-hidden">
              <div style={{ transform: `translateX(-${(activeSlide - 1) * 100}%)` }} className="transition-transform duration-500 ease-in-out">
                <div className="flex -mx-4">
                  {memoizedPosts.map(post => (
                    <PostCard key={post.id} post={post} />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default BlogCom;
