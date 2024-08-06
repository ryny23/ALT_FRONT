// import React, { useEffect, useState } from 'react'







// useEffect(() => {
//   const userName = localStorage.getItem('conUserName');
//       const [selectedMenu, setSelectedMenu] = useState('acceuil');
//       const [posts, setPosts] = useState([]);
//       const [commentaires, setcommentaires] = useState([]);
//       const [legislations, setLegislations] = useState([]);
//       const [decisions, setDecisions] = useState([]);
//       const [loading, setLoading] = useState(false);
//       const [error, setError] = useState('');

//     if (['posts', 'commentaires', 'legislations', 'decisions'].includes(selectedMenu)) {
//       fetchData(selectedMenu);
//     }
//   }, [selectedMenu]);

//   const fetchData = async (menu) => {
//     setLoading(true);
//     setError('');
//     try {
//       let res;
//       switch (menu) {
//         case 'acceuil':
//           res = await axios.get('https://alt.back.qilinsa.com/wp-json/wp/v2/posts');
//           setPosts(res.data);
//           break;
//         case 'commentaires':
//           res = await axios.get('https://alt.back.qilinsa.com/wp-json/wp/v2/commentaires');
//           setcommentaires(res.data);
//           break;
//         case 'legislations':
//           res = await axios.get('https://alt.back.qilinsa.com/wp-json/wp/v2/legislations');
//           setLegislations(res.data);
//           break;
//         case 'decisions':
//           res = await axios.get('https://alt.back.qilinsa.com/wp-json/wp/v2/decisions');
//           setDecisions(res.data);
//           break;
//         default:
//           throw new Error('Invalid menu selection');
//       }
//     } catch (err) {
//       setError(`Failed to fetch ${menu}`);
//     } finally {
//       setLoading(false);
//     }
//   };

const Decisions = () => {
  return (
    <div>
    </div>
  );
}

export default Decisions