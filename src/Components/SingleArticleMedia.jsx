import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import parse from 'html-react-parser';
import Nav from '../Components/Nav';

const SingleArticle = () => {
  const { id } = useParams();
  const [state, setState] = useState({
    article: null,
    legislations: [],
    featuredMedia: null,
    loading: true,
    error: ''
  });

  useEffect(() => {
    const altUrl = 'http://localhost';
    
    const fetchArticleAndLegislations = async () => {
      try {
        const articleRes = await axios.get(`${altUrl}/wp-json/wp/v2/articles/${id}`);
        const article = articleRes.data;

        let legislations = [];
        if (article.acf && article.acf.legislation) {
          const legislationsRes = await axios.get(`${altUrl}/wp-json/wp/v2/legislations/${article.acf.legislation}`);
          legislations = legislationsRes.data;
        }

        let featuredMedia = null;
        if (article.featured_media) {
          const mediaRes = await axios.get(`${altUrl}/wp-json/wp/v2/media/${article.featured_media}`);
          featuredMedia = mediaRes.data;
        }

        setState({ loading: false, article, legislations, featuredMedia, error: '' });
      } catch (error) {
        setState({ loading: false, article: null, legislations: [], featuredMedia: null, error: error.response ? error.response.data.message : 'An error occurred' });
      }
    };

    fetchArticleAndLegislations();
  }, [id]);

  const { article, legislations, featuredMedia, loading, error } = state;

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;
  if (!article) return <div>No article found</div>;

  return (
    <div>
      <Nav />
      
      <div className="max-w-screen-xl mx-auto">
        <main className="mt-10">
          <div className="px-4 lg:px-0 mt-12 text-gray-700 max-w-screen-md mx-auto text-lg leading-relaxed">
            <h1 className='text-2xl text-gray-800 font-semibold mb-4 mt-4'>{article.title.rendered}</h1>
            {featuredMedia && (
              <img src={featuredMedia.source_url} alt={featuredMedia.alt_text || article.title.rendered} className="w-full h-auto mb-4"/>
            )}
            <div className="pb-6">{parse(article.content.rendered)}</div>

            <div>
              {legislations && !legislations.error ? (
                <div>
                  <h2 className="text-2xl font-semibold mt-8">Legislations associées</h2>
                  {Array.isArray(legislations) ? legislations.map((legislation) => (
                    <div key={legislation.id}>
                      <h3 className="text-xl font-bold">{legislation.title.rendered}</h3>
                      <div>{parse(legislation.content.rendered)}</div>
                    </div>
                  )) : (
                    <div>
                      <h3 className="text-xl font-bold">{legislations.title.rendered}</h3>
                      <div>{parse(legislations.content.rendered)}</div>
                    </div>
                  )}
                </div>
              ) : (
                <div>Erreur lors de la récupération des législations.</div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default SingleArticle;
