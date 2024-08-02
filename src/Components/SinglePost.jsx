import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import parse from 'html-react-parser';
import Nav from '../Components/Nav';

const SinglePost = () => {
  const { id } = useParams();
  const [state, setState] = useState({
    post: null,
    featuredMedia: null,
    loading: true,
    error: ''
  });

  useEffect(() => {
    const altUrl = 'https://alt.back.qilinsa.com';
    
    const fetchPost = async () => {
      try {
        const postRes = await axios.get(`${altUrl}/wp-json/wp/v2/posts/${id}`);
        const post = postRes.data;

        let featuredMedia = null;
        if (post.featured_media) {
          const mediaRes = await axios.get(`${altUrl}/wp-json/wp/v2/media/${post.featured_media}`);
          featuredMedia = mediaRes.data;
        }

        setState({ loading: false, post, featuredMedia, error: '' });
      } catch (error) {
        setState({ loading: false, post: null, featuredMedia: null, error: error.response ? error.response.data.message : 'An error occurred' });
      }
    };

    fetchPost();
  }, [id]);

  const { post, featuredMedia, loading, error } = state;

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;
  if (!post) return <div>No post found</div>;

  return (
    <div>
      <Nav />
      <div className="max-w-screen-xl mx-auto">
        <main className="mt-10">
          <div className="px-4 lg:px-0 mt-12 text-gray-700 max-w-screen-md mx-auto text-lg leading-relaxed">
            <h1 className="text-2xl text-gray-800 font-semibold mb-4 mt-4">{post.title.rendered}</h1>
            {featuredMedia && (
              <img src={featuredMedia.source_url} alt={featuredMedia.alt_text || post.title.rendered} className="w-full h-auto mb-4"/>
            )}
            <div className="pb-6">{parse(post.content.rendered)}</div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default SinglePost;
