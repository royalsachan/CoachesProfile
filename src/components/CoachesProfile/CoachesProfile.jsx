import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Papa from 'papaparse';
import './CoachesProfile.css';

const CoachProfile = () => {
  const { id } = useParams();
  const [coach, setCoach] = useState(null);
  const [content, setContent] = useState([]);
  const [activeTab, setActiveTab] = useState('reviews');

  useEffect(() => {
    const fetchCoachData = async () => {
      try {
        const response = await fetch(`${import.meta.env.BASE_URL}coachesProfile.csv`);
        if (!response.ok) throw new Error('Network response was not ok');
        
        const reader = response.body.getReader();
        const result = await reader.read();
        const decoder = new TextDecoder('utf-8');
        const csv = decoder.decode(result.value);
        const results = Papa.parse(csv, { header: true });
        const coachData = results.data.find(c => c.id === id);
        setCoach(coachData);
      } catch (error) {
        console.error('Error fetching or parsing coach data:', error);
      }
    };
    
    fetchCoachData();
  }, [id]);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await fetch(`${import.meta.env.BASE_URL}reviews.csv`);
        if (!response.ok) throw new Error('Network response was not ok');
        
        const reader = response.body.getReader();
        const result = await reader.read();
        const decoder = new TextDecoder('utf-8');
        const csv = decoder.decode(result.value);
        const results = Papa.parse(csv, { header: true });
        setContent(results.data); 
        console.log(results);
      } catch (error) {
        console.error('Error fetching or parsing reviews:', error);
      }
    };

    const fetchAboutMe = async () => {
      try {
        const response = await fetch(`${import.meta.env.BASE_URL}about_me.csv`);
        if (!response.ok) throw new Error('Network response was not ok');
        
        const reader = response.body.getReader();
        const result = await reader.read();
        const decoder = new TextDecoder('utf-8');
        const csv = decoder.decode(result.value);
        const results = Papa.parse(csv, { header: true });
        setContent(results.data); 
        console.log(results);
      } catch (error) {
        console.error('Error fetching or parsing about me content:', error);
      }
    };

    if (activeTab === 'reviews') {
      fetchReviews();  
    } else if (activeTab === 'about') {
      fetchAboutMe();  
    }
  }, [activeTab]);

  if (!coach) return <div>Loading...</div>;

  return (
    <div className="container">
      
      <div className="top-box">
        <div className="header-container">
        <div className="header-left">
           <div className="profile-image-container">
          <img src={coach.imageUrl} alt={coach.name} className="profile-pic" />
          <span className="plan-type">{coach.plan}</span>
        </div>
          <h1 className="profile-name">{coach.name}</h1>
          </div>
        <div className="profile-actions">
          <Link to={`/coach/${id}/plans`} className="see-plans-btn">See Plans</Link>
          <button className="chat-btn">Chat With Coach</button>
        </div>
      </div>
    </div> 

      <div className="bottom-container">
        <div className="side-box">
          <div className='following'>
            <div>
              <h3>{coach.followers}</h3>
              <p>Followers</p>
            </div>
            <div className="divider"></div>
            <div>
              <h3>{coach.following}</h3>
              <p>Following</p>
            </div>
          </div>
          <div className="coach-info">
            <p><span className="icon">👤</span> {coach.peopleCoached} People Coached</p>
            <p className="rating">
              <span className="icon">⭐</span> {coach.rating} ({coach.reviews} Reviews)
            </p>
          </div>
          <div className="specialities">
            <h3>Speciality</h3>
            <div className="speciality-tags">
              {coach.specialities.split(',').map((spec, index) => (
                <span key={index} className="speciality-tag">{spec.trim()}</span>
              ))}
            </div>
          </div>
          <div className="certifications">
            <h3>Certifications</h3>
            <ul>
              {coach.certifications.split(',').map((cert, index) => (
                <li key={index}>{cert.trim()}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <div className="main-box">
        <button className='reviews' onClick={() => setActiveTab('reviews')}>Reviews</button>
        <button className='about' onClick={() => setActiveTab('about')}>About Me</button>
      </div>
      <div className="content">
        {activeTab === 'reviews' && content.map((review, index) => (
          <div key={index} className="review">
            <h4>{review.name}</h4>
            <p>{review.date}</p>
            <p>{review.review}</p>
          </div>
        ))}
        {activeTab === 'about' && <div>{content[0]?.content}</div>}
      </div>
    </div>
  );
};

export default CoachProfile;









































// import React, { useState, useEffect } from 'react';
// import { useParams,Link } from 'react-router-dom';
// import Papa from 'papaparse';
// import './CoachesProfile.css';

// const CoachProfile = () => {
//   const { id } = useParams();
//   const [coach, setCoach] = useState(null);

//   useEffect(() => {
//        const fetchCoachData = async () => {
//         const response = await fetch(`${import.meta.env.BASE_URL}coachesProfile.csv`);

//       //  const response = await fetch('/coachesProfile.csv');
//        const reader = response.body.getReader();
//        const result = await reader.read();
//        const decoder = new TextDecoder('utf-8');
//        const csv = decoder.decode(result.value);
//        const results = Papa.parse(csv, { header: true });
//        console.log(results);
//        const coachData = results.data.find(c => c.id === id);
//        setCoach(coachData);
//      };
    
//      fetchCoachData();
  //  }, [id]);
    
  //  if (!coach) return <div>Loading...</div>;

  // return (
  //   <div className="coach-profile">
  //     <div className="profile-header">
  //       <div className="profile-image-container">
  //         <img src={coach.imageUrl} alt={coach.name} className="profile-pic" />
  //         <h1 className="profile-name">{coach.name}</h1>
  //         <span className="plan-type">{coach.plan}</span>
  //       </div>
  //       <div className="profile-actions">
  //       <Link to={`/coach/${id}/plans`} className="see-plans-btn">See Plans</Link>
  //         <button className="chat-btn">Chat With Coach</button>
  //       </div>
  //     </div>

  //     <div className="profile-stats">
  //       <div className='following'>
  //           <div>
  //           <h3>{coach.followers}</h3>
  //           <p>Followers</p>
  //           </div>
        
  //       <div className="divider"></div>
    //     <div>
    //       <h3>{coach.following}</h3>
    //       <p>Following</p>
    //     </div>
    // </div>
    
    //   <div className="coach-info">
    //     <p><span className="icon">👤</span> {coach.peopleCoached} People Coached</p>
    //     <p className="rating">
    //       <span className="icon">⭐</span> {coach.rating} ({coach.reviews} Reviews)
    //     </p>
    //   </div>

      
    //   <div className="specialities">
    //     <h3>Speciality</h3>
    //     <div className="speciality-tags">
    //       {coach.specialities.split(',').map((spec, index) => (
    //         <span key={index} className="speciality-tag">{spec.trim()}</span>
    //       ))}
    //     </div>
    //   </div>

    //   <div className="certifications">
//         <h3>Certifications</h3>
//         <ul>
//           {coach.certifications.split(',').map((cert, index) => (
//             <li key={index}>{cert.trim()}Experts</li>
//           ))}
//         </ul>
//        </div>
//       </div>
//     </div>
//   );
// };

export default CoachProfile;
