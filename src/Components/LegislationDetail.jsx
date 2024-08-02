import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import Nav from '../Components/Nav';
import Footer from '../Components/Footer';
import anime from '../assets/anime.svg'

const LegislationDetail = () => {
  const { id } = useParams();
  const [legislation, setLegislation] = useState(null);
  const [titres, setTitres] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchLegislation = async () => {
      try {
        const res = await axios.get(`https://alt.back.qilinsa.com/wp-json/wp/v2/legislations/${id}`);
        setLegislation(res.data);

        const titrePromises = res.data.acf.titre.map(async (titreId) => {
          const titreRes = await axios.get(`https://alt.back.qilinsa.com/wp-json/wp/v2/titres/${titreId}`);
          const titreData = titreRes.data;

          const chapitrePromises = titreData.acf.chapitre.map(async (chapitreId) => {
            const chapitreRes = await axios.get(`https://alt.back.qilinsa.com/wp-json/wp/v2/chapitres/${chapitreId}`);
            const chapitreData = chapitreRes.data;

            const sectionPromises = chapitreData.acf.section.map(async (sectionId) => {
              const sectionRes = await axios.get(`https://alt.back.qilinsa.com/wp-json/wp/v2/sections/${sectionId}`);
              const sectionData = sectionRes.data;

              const articlePromises = sectionData.acf.article.map(articleId =>
                axios.get(`https://alt.back.qilinsa.com/wp-json/wp/v2/articles/${articleId}`)
              );

              const articleResults = await Promise.all(articlePromises);
              sectionData.articles = articleResults.map(result => result.data);

              return sectionData;
            });

            const sectionResults = await Promise.all(sectionPromises);
            chapitreData.sections = sectionResults;

            return chapitreData;
          });

          const chapitreResults = await Promise.all(chapitrePromises);
          titreData.chapitres = chapitreResults;

          return titreData;
        });

        const titreResults = await Promise.all(titrePromises);
        setTitres(titreResults);
      } catch (err) {
        setError('Failed to fetch legislation, titres, chapitres, sections, or articles');
      } finally {
        setLoading(false);
      }
    };

    fetchLegislation();
  }, [id]);

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };
  
  if (loading) {
    return (
      
      <div className="flex justify-center items-center h-screen">
      
        <img src={anime}></img>
      
    </div>
    );
  }
  if (error) return <p className="text-center text-red-500">{error}</p>;

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
