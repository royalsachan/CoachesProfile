import { BrowserRouter, Routes, Route } from 'react-router-dom';
import CoachesList from './components/CoachesList/CoachesList.jsx';
import CoachProfile from './components/CoachesProfile/CoachesProfile.jsx';
import PlanSelection from './components/PlanSelection/PlanSelection.jsx';

function App() {
  return (
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <Routes>
        <Route path="/" element={<CoachesList />} />
        <Route path="/coach/:id" element={<CoachProfile />} />
        <Route path="/coach/:id/plans" element={<PlanSelection />} />
      </Routes>
    </BrowserRouter>
    
    
  );
}

export default App;

