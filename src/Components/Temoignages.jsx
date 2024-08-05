import React, { useEffect, useState } from 'react';
import axios from 'axios';
import parse from 'html-react-parser';

const Temoignages = () => {
  const [testimonials, setTestimonials] = useState([]);

  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        const response = await axios.get('https://alt.back.qilinsa.com/wp-json/wp/v2/avis');
        setTestimonials(response.data);
      } catch (error) {
        console.error('Error fetching testimonials:', error);
      }
    };

    fetchTestimonials();
  }, []);

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
        <div className="grid mb-8 lg:mb-12 lg:grid-cols-2">
          {testimonials.map((testimonial) => (
            <figure key={testimonial.id} className="flex flex-col justify-center items-center p-8 text-center bg-gray-50 border-b border-gray-200 md:p-12 lg:border-r dark:bg-gray-800 dark:border-gray-700">
              <blockquote className="mx-auto mb-8 max-w-2xl text-gray-500 dark:text-gray-400">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{testimonial.title.rendered}</h3>
                <p className="my-4">{parse(testimonial.content.rendered)}</p>
              </blockquote>
              <figcaption className="flex justify-center items-center space-x-3">
                {/* <img className="w-9 h-9 rounded-full" src="https://flowbite.s3.amazonaws.com/blocks/marketing-ui/avatars/karen-nelson.png" alt="profile picture" /> */}
                <div className="space-y-0.5 font-medium dark:text-white text-left">
                  <div>Auteur : {testimonial.acf.nom}</div>
                  <div className="text-sm font-light text-gray-500 dark:text-gray-400">{testimonial.acf.profession}</div>
                </div>
              </figcaption>
            </figure>
          ))}
        </div>
        <div className="text-center">
          <a href="#" className="py-2.5 px-5 mr-2 mb-2 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700">
            Show more...
          </a>
        </div>
      </div>
    </section>
  );
};

export default Temoignages;
