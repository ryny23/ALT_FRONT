import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Nav from '../Components/Nav';
import Newsletter from '../Components/Newsletter';
import axios from 'axios';
import parse from 'html-react-parser';
import anime from '../assets/anime.svg'
import CtaInscription from '../Components/CtaInscription';
import Footer from '../Components/Footer';

const Blog = () => {
  const [state, setState] = useState({
    posts: [],
    loading: true,
    error: ''
  });

  const [visiblePosts, setVisiblePosts] = useState(3);

  useEffect(() => {
    const altUrl = 'https://alt.back.qilinsa.com';
    axios.get(`${altUrl}/wp-json/wp/v2/posts`)
      .then(async res => {
        const posts = res.data;
        
        // Fetch featured media
        const mediaDetails = await Promise.all(
          posts.map(async post => {
            const media = await axios.get(`${altUrl}/wp-json/wp/v2/media/${post.featured_media}`)
              .then(res => res.data)
              .catch(error => ({ error: error.response.data.message }));

            return {
              ...post,
              mediaDetails: media
            };
          })
        );

        setState({ loading: false, posts: mediaDetails, error: '' });
      })
      .catch(error => {
        setState({ loading: false, posts: [], error: error.response.data.message });
      });
  }, []);

  const { posts, loading, error } = state;

  const handleShowMore = () => {
    setVisiblePosts(prevVisiblePosts => prevVisiblePosts + 3);
  };

  if (loading) {
    return (
      // <div className="flex justify-center items-center h-screen">
      //   <div className="spinner-border animate-spin inline-block w-8 h-8 border-4 rounded-full text-blue-500" role="status">
      //     <span className="visually-hidden">Loading...</span>
      //   </div>
      // </div>
      <div className="flex justify-center items-center h-screen">
      
        <img src={anime}></img>
      
    </div>
    );
  }

  return (
    <div>
      <div>
      </div>
      <div className="bg-white py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl lg:mx-0">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">From the blog</h2>
            <p className="mt-2 text-lg leading-8 text-gray-600">
              Learn how to grow your business with our expert advice.
            </p>
          </div>
          <div className="mx-auto mt-10 grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 border-t border-gray-200 pt-10 sm:mt-16 sm:pt-16 lg:mx-0 lg:max-w-none lg:grid-cols-3">
            {posts.slice(0, visiblePosts).map((post) => (
              <div key={post.id} className="flex max-w-xl flex-col items-start justify-between">
                <div className="group relative">
                  <Link to={`post/${post.id}`}>
                    <div className="mt-3 text-lg font-semibold leading-6 text-gray-900 group-hover:text-gray-600">
                      <h1 className='text-4xl font-bold'>
                        <span className="absolute inset-0 cursor-pointer" />
                        {post.title.rendered}
                      </h1>
                    </div>
                  </Link>
                  {post.mediaDetails && !post.mediaDetails.error ? (
                    <img src={post.mediaDetails.source_url} alt={post.mediaDetails.alt_text} className="mt-4 w-full h-auto" />
                  ) : (
                    <div>Erreur lors de la récupération de l'image.</div>
                  )}
                  <div className="mt-5 line-clamp-3 text-sm leading-6 text-gray-600">{parse(post.content.rendered)}</div>
                </div>
              </div>
            ))}
          </div>
          {visiblePosts < posts.length && (
            <div className="text-center mt-10">
              <button
                onClick={handleShowMore}
                className="px-4 py-2 bg-green-500 text-white rounded-md"
              >
                Voir plus
              </button>
            </div>
          )}
        </div>
      </div>
      <Newsletter />
      <div className='mb-20 '>
      <CtaInscription/>
      </div>
    </div>
  );
};

export default Blog;