import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import parse from 'html-react-parser';
import Nav from '../Components/Nav';
import Footer from '../Components/Footer';

const SingleDecision = () => {
  const { id } = useParams();
  const [decision, setDecision] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchDecision = async () => {
      try {
        const res = await axios.get(`http://52.207.130.7/wp-json/wp/v2/decisions/${id}`);
        setDecision(res.data);
      } catch (err) {
        setError('Failed to fetch decision');
      } finally {
        setLoading(false);
      }
    };

    fetchDecision();
  }, [id]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      <Nav />
      <div className="max-w-screen-xl pb-10 mx-auto">
        <main className="mt-10">
          <div className="px-4 lg:px-0 mt-12 text-gray-700 max-w-screen-md mx-auto text-lg leading-relaxed">
            <h1 className="text-2xl font-bold">{decision.title.rendered}</h1>
            <div dangerouslySetInnerHTML={{ __html: decision.content.rendered }} className="mt-4" />
            
          </div>
        </main>
      </div>
      <Footer />
    </div>
  );
};

export default SingleDecision;
