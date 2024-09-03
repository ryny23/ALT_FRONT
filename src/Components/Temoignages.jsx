import React, { useEffect, useState } from 'react';
import axios from 'axios';
import parse from 'html-react-parser';

const getRandomColor = () => {
  const hue = Math.floor(Math.random() * 360);
  return `hsl(${hue}, 70%, 60%)`;
};

const TestimonialCard = ({ testimonial, color }) => (
  <div className="min-w-[300px] max-w-[300px] h-[400px] bg-white shadow-lg rounded-lg p-6 border border-gray-200 hover:border-blue-300 transition-all duration-300 ease-in-out transform hover:scale-105 flex flex-col justify-between">
    <h3 className="text-lg font-semibold text-gray-900">{testimonial.title.rendered}</h3>
    <div className="my-4 text-gray-600 overflow-auto flex-grow">
      {parse(testimonial.content.rendered)}
    </div>
    <div className="flex items-center mt-4">
      <div className="flex items-center justify-center w-10 h-10 rounded-full text-white font-bold" style={{ backgroundColor: color }}>
        {testimonial.acf.nom.split(' ').map(n => n[0]).join('')}
      </div>
      <div className="ml-3">
        <p className="font-semibold text-gray-900">{testimonial.acf.nom}</p>
        <p className="text-sm text-gray-600">{testimonial.acf.profession}</p>
      </div>
    </div>
  </div>
);

const Temoignages = () => {
  const [testimonials, setTestimonials] = useState([]);
  const [colorMap, setColorMap] = useState({});

  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        const response = await axios.get('https://alt.back.qilinsa.com/wp-json/wp/v2/avis');
        setTestimonials(response.data);
        const newColorMap = {};
        response.data.forEach(t => {
          newColorMap[t.id] = getRandomColor();
        });
        setColorMap(newColorMap);
      } catch (error) {
        console.error('Error fetching testimonials:', error);
      }
    };
    fetchTestimonials();
  }, []);

  const shuffleArray = (array) => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  const createTestimonialRows = () => {
    const shuffled = shuffleArray(testimonials);
    const row1 = shuffled.slice(0, 3);
    const row2 = shuffled.slice(3, 6);
    return [row1, row2];
  };

  const [row1, row2] = createTestimonialRows();

  return (
    <section className="bg-white dark:bg-gray-900">
      <div className="py-8 px-4 mx-auto max-w-screen-xl text-center lg:py-16 lg:px-6">
        <div className="mx-auto max-w-screen-sm">
          <h2 className="mb-4 text-4xl tracking-tight font-extrabold text-gray-900 dark:text-white">
            Ils ont adopté ALT et en sont ravis !
          </h2>
          <p className="mb-8 font-light text-gray-500 lg:mb-16 sm:text-xl dark:text-gray-400">
            Rien ne vaut les retours d'expérience concrets pour se faire une idée des bénéfices d'un outil. Découvrez ce que des professionnels du droit de tous horizons pensent d'ALT et comment notre plateforme les a aidés à gagner en productivité et en compétitivité.
          </p>
        </div>
        <div className="mt-8 overflow-hidden">
          <div className="flex gap-4 animate-scroll-right mb-4">
            {row1.concat(row1).concat(row1).map((testimonial, index) => (
              <TestimonialCard key={`${testimonial.id}-${index}`} testimonial={testimonial} color={colorMap[testimonial.id]} />
            ))}
          </div>
          <div className="flex gap-4 animate-scroll-left">
            {row2.concat(row2).concat(row2).map((testimonial, index) => (
              <TestimonialCard key={`${testimonial.id}-${index}`} testimonial={testimonial} color={colorMap[testimonial.id]} />
            ))}
          </div>
        </div>
      </div>
      <style jsx>{`
        @keyframes scrollRight {
          0% { transform: translateX(0); }
          100% { transform: translateX(-66.666%); }
        }
        @keyframes scrollLeft {
          0% { transform: translateX(-66.666%); }
          100% { transform: translateX(0); }
        }
        .animate-scroll-right {
          animation: scrollRight 20s linear infinite;
        }
        .animate-scroll-left {
          animation: scrollLeft 20s linear infinite;
        }
      `}</style>
    </section>
  );
};

export default Temoignages;