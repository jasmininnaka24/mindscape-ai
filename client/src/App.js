import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { createContext, useEffect } from 'react';

// page imports
import { Home } from './pages/home/home';
import { About } from './pages/home/about/about';
import { Benefits } from './pages/home/benefits/benefits';
import { HowToUse } from './pages/home/howtouse/howtouse';
import { Login } from './pages/login/login';
import { Register } from './pages/register/Register';
import { ClassificationQuestions } from './pages/register/QuestionsVAK';
import { DataSubmission } from './pages/register/DataSubmission';
import { VAKResult } from './pages/register/VAKResult';

// Main page imports
import { MainPage } from './pages/main/MainPage';

// Group Study Rooms import
import { GroupRoom } from './pages/rooms/group/GroupRoom';
import { GroupStudyArea } from './pages/rooms/group/study_area/GroupStudyArea';
import { GroupQAGenerator } from './pages/rooms/group/study_area/GroupQAGenerator';
import { GroupTasks } from './pages/rooms/group/task/GroupTasks';
import { GroupReviewerPage } from './pages/rooms/group/study_area/GroupReviewerPage'

import { PersonalRoom } from './pages/rooms/personal/PersonalRoom';
import { PersonalStudyArea } from './pages/rooms/personal/study_area/PersonalStudyArea';
import { PersonalQAGenerator } from './pages/rooms/personal/study_area/PersonalQAGenerator'
import { PersonalReviewerPage } from './pages/rooms/personal/study_area/PersonalReviewerPage';
import { PersonalReviewerStart } from './pages/rooms/personal/study_area/PersonalReviewerStart';
import { PersonalAssessment } from './pages/rooms/personal/study_area/PersonalAssessment';
import { PersonalDashboard } from './pages/rooms/personal/dashboard/PersonalDashboard';
import { PersonalCategoryList } from './pages/rooms/personal/dashboard/PersonalCategoryList';
import { PersonalTopicList } from './pages/rooms/personal/dashboard/PersonalTopicList';

// dependecies
import AOS from 'aos';
import 'aos/dist/aos.css';

export const PageReloadContext = createContext({ pageReload: 'value', setPageReload: () => {} });


function App() {
  useEffect(() => {
    AOS.init({duration:2000})
  }, [])
  return (
    <div>
      <div className='primary-color'>
        <Router>
          <Routes>
            <Route path='/' element={<Home />} />
            <Route path='#about' element={<About />} />
            <Route path='#benefits' element={<Benefits />} />
            <Route path='#howtouse' element={<HowToUse />} />
            <Route path='/login' element={<Login />} />
            <Route path='/register' element={<Register />} />
            <Route path='/classification-questions' element={<ClassificationQuestions />} />
            <Route path='/data-submission' element={<DataSubmission/>} />
            <Route path='/data-result' element={<VAKResult/>} />

            {/* Main Page Route */}
            <Route path='/main' element={<MainPage/>} />
      
            {/* Room Routes */}
            {/* Group Study Room Routes */}
            <Route path='/main/group/' element={<GroupRoom />} /> 
            <Route path='/main/group/study-area/:id' element={<GroupStudyArea />} /> 
            <Route path='/main/group/study-area/qa-gen/:id' element={<GroupQAGenerator />} /> 
            <Route path='/main/group/study-area/tasks' element={<GroupTasks />} /> 
            {/* <Route path='/main/group/study-area/group-review' element={<GroupReviewPage />} />  */}
            <Route path='/main/group/study-area/group-review/:groupId/:materialId' element={<GroupReviewerPage />} />

            {/* Personal Study Room Routes */}
            <Route path='/main/personal/' element={<PersonalRoom />} /> 
            <Route path='/main/personal/study-area' element={<PersonalStudyArea />} /> 
            <Route path='/main/personal/study-area/qa-gen' element={<PersonalQAGenerator />} /> 
            <Route path='/main/personal/study-area/personal-review/:materialId' element={<PersonalReviewerPage />} />
            <Route path='/main/personal/study-area/personal-review-start/:materialId' element={<PersonalReviewerStart />} />
            <Route path='/main/personal/study-area/personal-assessment/:materialId' element={<PersonalAssessment />} />

            {/* Personal Dashboard */}
            <Route path='/main/personal/dashboard' element={<PersonalDashboard />} />
            <Route path='/main/personal/dashboard/category-list' element={<PersonalCategoryList />} />
            <Route path='/main/personal/dashboard/category-list/topic-list/:categoryID' element={<PersonalTopicList />} />
              
            {/* If page does not exist */}
            <Route path='*' element={<h1 className='text-center text-4xl font-bold primary-text-color pt-40'>404: Page Not Found</h1>} /> 
          </Routes>
        </Router>
      </div>
    </div>
  );
}

export default App;
