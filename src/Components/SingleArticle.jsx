import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import parse from 'html-react-parser';
import Nav from '../Components/Nav';
import Footer from '../Components/Footer';

const SingleArticle = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [article, setArticle] = useState(null);
  const [sectionTitle, setSectionTitle] = useState('');
  const [chapterTitle, setChapterTitle] = useState('');
  const [titreTitle, setTitreTitle] = useState('');
  const [legislationTitle, setLegislationTitle] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const titreDataRef = useRef(null); // Ref to store titreData

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        const altUrl = 'http://52.207.130.7';

        // Fetch article details
        const articleResponse = await axios.get(`${altUrl}/wp-json/wp/v2/articles/${id}`);
        const articleData = articleResponse.data;

        // Extract section ID from article data
        const sectionId = articleData.acf.section; // Assuming 'section' is a custom field storing section ID

        // Fetch section details using section ID
        const sectionResponse = await axios.get(articleData._links['acf:post'][0].href);
        const sectionData = sectionResponse.data;

        // Extract chapter ID from section data
        const chapterId = sectionData.acf.chapitre; // Assuming 'chapitre' is a custom field storing chapter ID

        // Fetch chapter details using chapter ID
        const chapterResponse = await axios.get(sectionData._links['acf:post'][0].href); // Assuming the first link is for chapitre
        const chapterData = chapterResponse.data;

        // Extract section ID from article data
        const titreId = chapterData.acf.titre; // Assuming 'section' is a custom field storing section ID

        // Fetch chapter details using chapter ID
        const titreResponse = await axios.get(chapterData._links['acf:post'][0].href); // Assuming the first link is for chapitre
        const titreData = titreResponse.data;

        // Extract section ID from article data
        const legislationId = titreData.acf.legislation; // Assuming 'section' is a custom field storing section ID

        // Fetch legislation details using legislation ID (assuming you want to fetch the first legislation)
        const firstLegislationLink = titreData._links['acf:post'][0].href; // Assuming the first link is for legislation
        const legislationResponse = await axios.get(firstLegislationLink);
        const legislationData = legislationResponse.data;

        setArticle(articleData);
        setSectionTitle(sectionData.title.rendered); // Assuming 'title' is the field containing section title
        setChapterTitle(chapterData.title.rendered); // Assuming 'title' is the field containing chapter title
        setTitreTitle(titreData.title.rendered); // Assuming 'title' is the field containing chapter title
        setLegislationTitle(legislationData.title.rendered); // Assuming 'title' is the field containing legislation title
        setLoading(false);

        // Store titreData in useRef
        titreDataRef.current = titreData;
      } catch (error) {
        setError(error.response ? error.response.data.message : 'An error occurred');
        setLoading(false);
      }
    };

    fetchArticle();
  }, [id]);

  const navigateToLegislation = async () => {
    try {
      if (!titreDataRef.current) {
        console.error('titreData is not yet available');
        return;
      }

      const altUrl = 'http://52.207.130.7';

      // Fetch the current legislation data again to get the correct link
      const firstLegislationLink = titreDataRef.current._links['acf:post'][0].href; // Assuming the first link is for legislation
      const legislationResponse = await axios.get(firstLegislationLink);
      const legislationData = legislationResponse.data;

      // Use navigate function to navigate programmatically
      navigate(`/legislation/${legislationData.id}`);
    } catch (error) {
      console.error('Failed to navigate to legislation:', error);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;
  if (!article) return <div>No article found</div>;

  return (
    <div>
      <Nav />
      <div className="max-w-screen-xl mx-auto">
        <main className="mt-10 flex">
          <div className="w-2/3 pr-4 text-gray-700 leading-relaxed">
            <h1 className="text-2xl text-gray-800 font-semibold mb-4 mt-4">{article.title.rendered}</h1>
            {/* <p className="text-gray-600 mb-2">Section: {sectionTitle}</p>
            <p className="text-gray-600 mb-2">Chapitre: {chapterTitle}</p>
            <p className="text-gray-600 mb-2">Titre: {titreTitle}</p> */}
            <p className="mb-2 cursor-pointer text-blue-500 hover:underline" onClick={navigateToLegislation}>
              Legislation: {legislationTitle}
            </p>
            <div className="pb-6">{parse(article.content.rendered)}</div>
          </div>
        </main>
      </div>
      <Footer />
    </div>
  );
};

export default SingleArticle;
