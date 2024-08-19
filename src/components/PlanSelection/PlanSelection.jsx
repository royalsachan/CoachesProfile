import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Papa from 'papaparse';
import './PlanSelection.css';

const PlanSelection = () => {
  const { id } = useParams();
  const [plans, setPlans] = useState([]);
  const [coach, setCoach] = useState(null);
  const [selectedDurations, setSelectedDurations] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      const [coachesResponse, plansResponse] = await Promise.all([
        fetch(`${import.meta.env.BASE_URL}coaches.csv`),
        fetch(`${import.meta.env.BASE_URL}plans.csv`)
      ]);

      const coachesReader = coachesResponse.body.getReader();
      const plansReader = plansResponse.body.getReader();

      const [coachesResult, plansResult] = await Promise.all([
        coachesReader.read(),
        plansReader.read()
      ]);

      const decoder = new TextDecoder('utf-8');
      const coachesCsv = decoder.decode(coachesResult.value);
      const plansCsv = decoder.decode(plansResult.value);

      const coachesData = Papa.parse(coachesCsv, { header: true }).data;
      const plansData = Papa.parse(plansCsv, { header: true }).data;

      setCoach(coachesData.find(c => c.id === id));
      setPlans(plansData);

      // Initialize selected durations
      const initialDurations = {};
      plansData.forEach(plan => {
        initialDurations[plan.name] = '12';
      });
      setSelectedDurations(initialDurations);
    };

    fetchData();
  }, [id]);

  const handleDurationChange = (planName, duration) => {
    setSelectedDurations(prev => ({
      ...prev,
      [planName]: duration
    }));
  };

  const calculatePrice = (basePrice, duration) => {
    const weeks = parseInt(duration);
    let discount = 0;
    if (weeks === 24) discount = 0.1;
    if (weeks === 52) discount = 0.2; // 20% discount for 52 weeks
    const discountedPrice = basePrice * (1 - discount);
    return Math.round(discountedPrice);
  };

  if (!coach || plans.length === 0) return <div>Loading...</div>;

  return (
    <div className="plan-selection">
      <h1>Choose your Transformation Package</h1>
      <p>Take a step towards a longer, healthier and happier life!</p>
      
      <div className="plans-container">
        {plans.map((plan, index) => {
          const selectedDuration = selectedDurations[plan.name] || '12';
          const weeklyPrice = calculatePrice(parseInt(plan.price), selectedDuration);
          const totalPrice = weeklyPrice * parseInt(selectedDuration);

          return (
            <div key={index} className="plan-card">
              <h3>{plan.name}</h3>
              <div className="plan-options">
                {['12', '24', '52'].map(duration => (
                  <button 
                    key={duration}
                    className={`plan-option ${selectedDuration === duration ? 'active' : ''}`}
                    onClick={() => handleDurationChange(plan.name, duration)}
                  >
                    {duration} week
                  </button>
                ))}
              </div>
              <p className="plan-price">₹{weeklyPrice}/week</p>
              <p className="plan-total">₹{totalPrice} total</p>
              <p className="plan-savings">
                {selectedDuration !== '12' && `Save ${selectedDuration === '24' ? '10%' : '20%'}`}
              </p>
              <button className="select-plan-btn">Proceed</button>
            </div>
          );
        })}
      </div>

      <div className="plan-benefits">
        <h2>What you will get in {selectedDurations[plans[0]?.name] || '12'} weeks plan?</h2>
        <ul>
          <li>Plans designed only for you</li>
          <li>Accountability and Progress Tracking</li>
          <li>Continuous Support</li>
          <li>FITTR CVD Compensation Policy</li>
        </ul>
      </div>

      <div className="how-it-works">
        <h2>How it works</h2>
        <ol>
          <li>You enroll in a package of your choice</li>
          <li>You fill up additional key details like food preferences, preferred time to contact, any medical issues etc</li>
          <li>Coach calls you within 24 hours at your preferred time</li>
          <li>Coach understands your goals, sets expectations about how this will work</li>
          <li>Coach evaluates and prepares the best plan for you</li>
          <li>Coach assesses your weekly progress and makes course adjustments</li>
          <li>You get results, yay!</li>
        </ol>
      </div>
    </div>
  );
};

export default PlanSelection;