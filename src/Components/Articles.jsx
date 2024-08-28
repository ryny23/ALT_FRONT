import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import parse from 'html-react-parser';
import Nav from '../Components/Nav';
import Footer from '../Components/Footer';
import anime from '../assets/anime.svg';

const RelatedItem = ({ items, title, itemType }) => (
  <div>
    <h4 className="text-x font-bold mb-4 mt-2">{title}</h4>
    <ul>
      {items.map(item => (
        <li key={item.id}>
          <a
            onClick={() =>
              document.getElementById(`${itemType}-${item.id}`).scrollIntoView({
                behavior: 'smooth',
              })
            }
            className="cursor-pointer text-blue-500 hover:underline"
          >
            {item.title.rendered}
          </a>
        </li>
      ))}
    </ul>
  </div>
);

const Articles = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [article, setArticle] = useState(null);
  const [legislationTitle, setLegislationTitle] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [decisions, setDecisions] = useState([]);
  const [commentaires, setCommentaires] = useState([]);

  useEffect(() => {
    const fetchArticleAndLegislation = async () => {
      try {
        const altUrl = 'https://alt.back.qilinsa.com';

        const [articleResponse, legislationResponse, decisionResults, commentaireResults] =
          await Promise.all([
            axios.get(`${altUrl}/wp-json/wp/v2/articles/${id}`),
            axios.get(`${altUrl}/wp-json/wp/v2/legislations/${articleResponse.data.acf.Legislation_ou_titre_ou_chapitre_ou_section}`),
            Promise.all(articleResponse.data.acf.decision.map(decisionId =>
              axios.get(`${altUrl}/wp-json/wp/v2/decisions/${decisionId}`)
            )),
            Promise.all(articleResponse.data.acf.commentaire.map(commentaireId =>
              axios.get(`${altUrl}/wp-json/wp/v2/commentaires/${commentaireId}`)
            ))
          ]);

        setArticle(articleResponse.data);
        setLegislationTitle(legislationResponse.data.title.rendered);
        setDecisions(decisionResults.map(result => result.data));
        setCommentaires(commentaireResults.map(result => result.data));
      } catch (error) {
        setError(error.response ? error.response.data.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchArticleAndLegislation();
  }, [id]);

  const navigateToLegislation = () => {
    if (legislationTitle) {
      navigate(`/legislation/${article.acf.Legislation_ou_titre_ou_chapitre_ou_section}`);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <img src={anime} alt="Loading animation" />
      </div>
    );
  }

  if (error) return <div>{error}</div>;
  if (!article) return <div>No article found</div>;

  return (
    <div className="min-h-screen flex flex-col bg-light-background dark:bg-dark-background text-light-text dark:text-dark-text">
      <Nav />
      <div className="flex-1 container mx-auto px-4 py-10 grid grid-cols-1 lg:grid-cols-4 gap-8">
        <aside className="lg:col-span-1 bg-gray-50 p-4 rounded shadow lg:sticky lg:top-0 lg:max-h-screen lg:overflow-y-auto">
          <h2 className="text-xl font-bold mb-4">Sommaire</h2>
          <RelatedItem items={decisions} title="Décisions associé" itemType="decision" />
          <RelatedItem items={commentaires} title="Commentaires associé" itemType="commentaire" />
        </aside>
        <main className="lg:col-span-3 bg-white p-6 rounded shadow">
          <div className="text-gray-700 text-lg leading-relaxed">
            <h1 className="text-2xl text-gray-800 font-semibold mb-4 mt-4">{article.title.rendered}</h1>
            <p
              className="mb-2 cursor-pointer text-blue-500 hover:underline"
              onClick={navigateToLegislation}
            >
              Legislation: {legislationTitle}
            </p>
            <div className="pb-6">{parse(article.content.rendered)}</div>
            <div>
              <h2 className="text-xl font-bold my-4">Decisions associé</h2>
              {decisions.map(decision => (
                <div key={decision.id} className="mb-6" id={`decision-${decision.id}`}>
                  <h3 className="text-xl font-semibold mb-2">{decision.title.rendered}</h3>
                  <div dangerouslySetInnerHTML={{ __html: decision.content.rendered }} />
                </div>
              ))}
              <h2 className="text-xl font-bold my-4">Commentaires associé</h2>
              {commentaires.map(commentaire => (
                <div key={commentaire.id} className="mb-6" id={`commentaire-${commentaire.id}`}>
                  <h3 className="text-xl font-semibold mb-2">{commentaire.title.rendered}</h3>
                  <div dangerouslySetInnerHTML={{ __html: commentaire.content.rendered }} />
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

export default Articles;
