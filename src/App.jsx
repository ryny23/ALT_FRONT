import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'

import {
AvisClients, CabinetsAvocats, DirEntre, Blog,
 DirSin, DirJur, Fonctionnalites, MiniSeries, Webinaires,
  Faqs, Home, PourquoiNous, Tarifs,
} from './Pages'
import AuthForm from './Pages/AuthForm'
import ForgotPassword from './Components/ForgotPassword'
import Dashboard from './Pages/Dashboard'
import ProtectedRoute from './Components/ProtectedRoute'
import Test from './Pages/Test'
import SinglePost from './Components/SinglePost';
import SingleArticle from './Components/SingleArticle';
import LegislationDetail from './Components/LegislationDetail';
import SingleDecision from './Components/SingleDecision'
import SearchExperts from './Pages/SearchExperts'
import ExpertsProfile from './Components/RenderProfilExpert'
import SingleCommentaire from './Components/SingleCommentaire'
import TermsConditions from './Pages/TermsConditions'
import LegislationDetail1 from './Pages/LegislationDetail'
import ArticleDetail from './Pages/ArticleDetail'
import ResetPassword from './Components/Resetpassword'
import Dossier from './Pages/Dossier'



// import Test from './Pages/Test'
import Test2 from './Pages/Test2'

const App = () => {
  // const [isLoggedIn, setIsLoggedIn] = useState(false);
  return (
    <div className='bg-light-background dark:bg-dark-background scroll-smooth'>
      <Router>
        <Routes>
          <Route exact path='/' element={<Home/>}/>
          <Route path="/avis-clients" element={<AvisClients/>}/>
          <Route path="/blog" element={<Blog/>}/>
          <Route path="/mini-series" element={<MiniSeries/>}/>
          <Route path="/webinaires" element={<Webinaires/>}/>
          <Route path="/faqs" element={<Faqs/>}/>
          <Route path="/tarifs" element={<Tarifs/>}/>
          <Route path="/fonctionnalites" element={<Fonctionnalites/>}/>
          <Route path="/pourquoi-nous" element={<PourquoiNous/>}/>
          <Route path="/cabinets-avocats" element={<CabinetsAvocats/>}/>
          <Route path="/directions-entreprises" element={<DirEntre/>}/>
          <Route path="/directions-juridiques-du-secteur-public" element={<DirJur/>}/>
          <Route path="/directions-sinistres" element={<DirSin/>}/>
          <Route path="/conditions-generales" element={<TermsConditions/>}/>



          <Route path="/authform" element={<AuthForm/>}/>
          <Route path="/forgot-password" element={<ForgotPassword/>}/>

          <Route path="/dashboard" element={<ProtectedRoute><Dashboard/></ProtectedRoute>}/>
          <Route path="/post/:id" element={<SinglePost />} />
          <Route path="/article/:id" element={<ArticleDetail />} />
          <Route path="/commentaire/:id" element={<SingleCommentaire />} />
          <Route path="/legislation/:id" element={<LegislationDetail1 />} />
          <Route path="/decision/:id" element={<SingleDecision />} />
          <Route path="/expert/:userId" element={<ExpertsProfile />} />
          <Route path="/search" element={<SearchExperts />} />
          <Route path="/legislationdetail" element={<LegislationDetail1 />} />
          <Route path="/forgotpassword" element={<ForgotPassword />} />
          <Route path="/resetpassword" element={<ResetPassword />} />
          <Route path="/dossier" element={<Dossier />} />
          
          
          <Route path="/test" element={<Test/>}/>
          <Route path="/test2" element={<Test2/>}/>
        </Routes>
      </Router>
    </div>
  );
};

export default App





