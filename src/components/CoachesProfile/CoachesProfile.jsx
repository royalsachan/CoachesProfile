import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Papa from 'papaparse';

import './CoacheProfile.css';

export default function CoachProfile() {
  const { id } = useParams();
  const [coach, setCoach] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [aboutMe, setAboutMe] = useState('');
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
        setReviews(results.data);
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
        setAboutMe(results.data[0]?.content || '');
      } catch (error) {
        console.error('Error fetching or parsing about me content:', error);
      }
    };

    fetchReviews();
    fetchAboutMe();
  }, []);

  if (!coach) return <div className="loading">Loading...</div>;

  return (
    <div className="coach-profile">
      <div className="cover-image" style={{backgroundImage: `url(${coach.coverImage})`}}>
        <div className="cover-gradient"></div>
      </div>
      <div className="profile-header">
        <div className="profile-left">
          <div className="profile-pic-container">
            <img src={coach.imageUrl} alt={coach.name} className="profile-pic" />
            <span className="plan-type">{coach.plan}</span>
          </div>
          <div className="profile-info">
            <h1>{coach.name}</h1>
          </div>
          <div className="profile-actions">
            <Link to={`/coach/${id}/plans`} className="btn btn-primary">See Plans</Link>
            <button className="btn btn-secondary">Chat With Coach</button>
          </div>
        </div>
      </div>
      <div className="profile-content">
        <div className="sidebar">
          <div className="stats">
            <div className="stat">
              <p className="stat-value">{coach.followers}</p>
              <p className="stat-label">Followers</p>
            </div>
            <div className="stat">
              <p className="stat-value">{coach.following}</p>
              <p className="stat-label">Following</p>
            </div>
          </div>
          <div className="coach-info">
          <p>&#128100; {coach.peopleCoached} People Coached</p>
          <p>&#9733; {coach.rating} ({coach.reviews} Reviews)</p>
          </div>
          <div className="specialities">
            <h3>Speciality</h3>
            <div className="speciality-tags">
              {coach.specialities.split(',').map((spec, index) => (
                <span key={index} className="tag">{spec.trim()}</span>
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
        <div className="main-content">
          <div className="tab-container">
            <div className="tabs">
              <button
                className={`tab ${activeTab === 'reviews' ? 'active' : ''}`}
                onClick={() => setActiveTab('reviews')}
              >
                Reviews
              </button>
              <button
                className={`tab ${activeTab === 'about' ? 'active' : ''}`}
                onClick={() => setActiveTab('about')}
              >
                About Me
              </button>
            </div>
            <div className="tab-content">
              {activeTab === 'reviews' && (
                <div className="reviews-content">
                  {reviews.map((review, index) => (
                    <div key={index} className="review">
                      <div className="review-header">
                        <img src={review.avatar} alt={review.name} className="review-avatar" />
                        <div>
                          <h4>{review.name}</h4>
                          <p className="review-date">{review.date}</p>
                        </div>
                      </div>
                      <div className="review-rating">
                        {[...Array(5)].map((_, i) => (
                     <span key={i} className={i < review.rating ? 'star filled' : 'star'}>
                     &#9733;
                   </span>
                        ))}
                      </div>
                      <p className="review-text">{review.review}</p>
                    </div>
                  ))}
                </div>
              )}
              {activeTab === 'about' && (
                <div className="about-content">
                  <div className="about-me">
                    <p>{aboutMe}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}











































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

//export default CoachProfile;
