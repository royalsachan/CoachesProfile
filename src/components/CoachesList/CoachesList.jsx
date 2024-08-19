import React, { useState, useEffect } from 'react';
import {useParams, Link } from 'react-router-dom';
import Papa from 'papaparse';
import './CoachesList.css';

const CoachesList = () => {
  const [coaches, setCoaches] = useState([]);

  useEffect(() => {
    const fetchCoaches = async () => {
      try {
        
        const response = await fetch(`${import.meta.env.BASE_URL}coaches.csv`);

        // const response = await fetch('/coaches.csv');
        if (!response.ok) throw new Error('Network response was not ok');
        const reader = response.body.getReader();
        const result = await reader.read();
        const decoder = new TextDecoder('utf-8');
        const csv = decoder.decode(result.value);
        const results = Papa.parse(csv, { header: true });
        console.log(results);
        
        // Shuffle the coaches array
       
        // const sortedCoaches = results.data.sort((a, b) => b.rating - a.rating);
        // setCoaches(sortedCoaches);
        // } catch (error) {
        // console.error('Error fetching or parsing coaches:', error);

         const shuffledCoaches = shuffleArray(results.data);
         setCoaches(shuffledCoaches);
       } catch (error) {
         console.error('Error fetching or parsing coaches:', error);
      }
    };
  
    fetchCoaches();
  }, []);
  
  // Fisher-Yates shuffle algorithm
  const shuffleArray = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  };

  return (
    <div className="coaches-list">
      <h1>Fitness & Nutrition Coaches</h1>
      <div className="coaches-grid">
        {coaches.map((coach) => (
          <Link to={`/coach/${coach.id}`} key={coach.id} className="coach-card">
            <img src={coach.imageUrl} alt={coach.name} />
            {/* <p className='plan-type'>{coach.type}</p> */}
            <h2>{coach.name}</h2>
            <div className="people-coached">
              <p>{coach.rating}  ☆</p>
              <p className='divider'></p>
              <p>{coach.peopleCoached} People Coached</p>
            </div>
            <p className='slot'>{coach.slot} slots available</p>
            <div className="plan">
              <button className='Chat'>Chat</button>
              <button className='plans-btn'>See Plans</button>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default CoachesList;



















// import React, { useState, useEffect } from 'react';
// import { Link } from 'react-router-dom';
// import Papa from 'papaparse';
// import './CoachesList.css';

// const CoachesList = () => {
//   const [coaches, setCoaches] = useState([]);

//   useEffect(() => {
//     const fetchCoaches = async () => {
//       try {
//         const response = await fetch('/coaches.csv');
//         if (!response.ok) throw new Error('Network response was not ok');
//         const reader = response.body.getReader();
//         const result = await reader.read();
//         const decoder = new TextDecoder('utf-8');
//         const csv = decoder.decode(result.value);
//         const results = Papa.parse(csv, { header: true });
//         console.log(results);
//         setCoaches(results.data);
//       } catch (error) {
//         console.error('Error fetching or parsing coaches:', error);
//       }
//     };
  
//     fetchCoaches();
//   }, []);
  
//   return (
//     <div className="coaches-list">
//       <h1>Fitness & Nutrition Coaches</h1>
//       <div className="coaches-grid">
//         {coaches.map((coach) => (
//           <Link to={`/coach/${coach.id}`} key={coach.id} className="coach-card">
 
//             <img src={coach.imageUrl} alt={coach.name} />
//             <h2>{coach.name}</h2>
//             <div className="people-coached">
//             <p>{coach.rating}  ☆</p>
//             <p className='divider'>|</p>
//             <p>{coach.peopleCoached} People Coached</p>

//             </div>
//             <p className='slot'>{coach.slot} slots available</p>
//            <div className="plans">
//             <button className='Chat'>Chat</button>
//             <button className="see-plans-btn">See Plans</button>
//            </div>
//           </Link>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default CoachesList;