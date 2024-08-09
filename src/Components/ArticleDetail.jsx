import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import Nav from './Nav';
import Footer from './Footer';
import { bouncy } from 'ldrs'
import anime from '../assets/anime.svg'

const LegislationDetail = () => {
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
        const altUrl = 'https://alt.back.qilinsa.com';

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

      const altUrl = 'https://alt.back.qilinsa.com';

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

  if (loading) {
    return (
      // <div className="flex justify-center items-center h-screen">
      //   <div className="spinner-border animate-spin inline-block w-8 h-8 border-4 rounded-full text-blue-500" role="status">
      //     <span className="visually-hidden">Loading...</span>
      //   </div>
      // </div>
      <div className="flex justify-center items-center h-screen">
      

      <l-bouncy
        size="45"
        speed="1.75" 
        color="black" 
      ></l-bouncy>
      
    </div>
    );
  }
  if (error) return <div>{error}</div>;
  if (!article) return <div>No article found</div>;
  

  return (
    <div className="min-h-screen flex flex-col bg-light-background dark:bg-dark-background text-light-text dark:text-dark-text ">
      <Nav />
      <div className="flex-1 container mx-auto px-4 py-10 grid grid-cols-1 lg:grid-cols-4 gap-8">
        <aside className="lg:col-span-1 bg-gray-50 p-4 rounded shadow lg:sticky lg:top-0 lg:max-h-screen lg:overflow-y-auto">
          <h2 className="text-xl font-bold mb-4">Sommaire</h2>
          <ul className="space-y-2">
            {titres.map(titre => (
              <li key={titre.id}>
                <a onClick={() => scrollToSection(`titre-${titre.id}`)} className="cursor-pointer text-blue-500 hover:underline">
                  {titre.title.rendered}
                </a>
                <ul className="ml-4 space-y-1">
                  {titre.chapitres.map(chapitre => (
                    <li key={chapitre.id}>
                      <a onClick={() => scrollToSection(`chapitre-${chapitre.id}`)} className="cursor-pointer text-blue-500 hover:underline">
                        {chapitre.title.rendered}
                      </a>
                      <ul className="ml-4 space-y-1">
                        {chapitre.sections.map(section => (
                          <li key={section.id}>
                            <a onClick={() => scrollToSection(`section-${section.id}`)} className="cursor-pointer text-blue-500 hover:underline">
                              {section.title.rendered}
                            </a>
                            <ul className="ml-4 space-y-1">
                              {section.articles.map(article => (
                                <li key={article.id}>
                                  <a onClick={() => scrollToSection(`article-${article.id}`)} className="cursor-pointer text-blue-500 hover:underline">
                                    {article.title.rendered}
                                  </a>
                                </li>
                              ))}
                            </ul>
                          </li>
                        ))}
                      </ul>
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
        </aside>
        <main className="lg:col-span-3 bg-white p-6 rounded shadow">
          <div className="text-gray-700 text-lg leading-relaxed">
            <h1 className="text-3xl font-bold mb-6">{legislation.title.rendered}</h1>
            <div dangerouslySetInnerHTML={{ __html: legislation.content.rendered }} className="mb-6" />
            <div>
              {titres.map(titre => (
                <div key={titre.id} className="mb-6" id={`titre-${titre.id}`}>
                  <h3 className="text-xl font-semibold mb-2">{titre.title.rendered}</h3>
                  {titre.chapitres.map(chapitre => (
                    <div key={chapitre.id} className="ml-4 mb-4" id={`chapitre-${chapitre.id}`}>
                      <h4 className="text-lg font-semibold mb-1">{chapitre.title.rendered}</h4>
                      {chapitre.sections.map(section => (
                        <div key={section.id} className="ml-4 mb-2" id={`section-${section.id}`}>
                          <h5 className="text-md font-semibold mb-1">{section.title.rendered}</h5>
                          {section.articles.map(article => (
                            <div key={article.id} className="ml-4 mb-2 p-4 bg-gray-100 rounded" id={`article-${article.id}`}>
                              <h6 className="text-sm font-semibold mb-1">{article.title.rendered}</h6>
                              <div dangerouslySetInnerHTML={{ __html: article.content.rendered }} />
                            </div>
                          ))}
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
      <Footer />
    </div>
  );
};

export default LegislationDetail;
