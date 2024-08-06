import { RouterProvider, createBrowserRouter, createRoutesFromElements, Route } from "react-router-dom"
import AuthForm from "./Pages/AuthForm";
import Dashboard from "./Pages/Dashboard";
import {
    AvisClients, CabinetsAvocats, DirEntre, Blog,
     DirSin, DirJur, Fonctionnalites, MiniSeries, Webinaires,
      Faqs, Home, PourquoiNous, Tarifs,
    } from './Pages'
import ForgotPassword from './Components/ForgotPassword'
import ProtectedRoute from './Components/ProtectedRoute'
import Test2 from './Pages/Test2'
import SinglePost from './Components/SinglePost';
// import SingleArticle from './Components/SingleArticle';
import LegislationDetail from './Pages/Legislations';
import SingleDecision from './Components/SingleDecision'
import SearchExperts from './Pages/SearchExperts'
import ExpertsProfile from './Components/RenderProfilExpert'
import SingleCommentaire from './Components/SingleCommentaire'
import TermsConditions from './Pages/TermsConditions'
import LegislationDetail1 from './Pages/LegislationDetail'
import ArticleDetail from './Pages/ArticleDetail'
import ResetPassword from './Components/Resetpassword'
import Dossier from './Pages/Dossier'
import RenderAcceuil from './Components/RenderAcceuil'
import HomeLayout from './layout/HomeLayout';
import DashboardLayout from './layout/DashboardLayout';
import AuthLayout from './layout/AuthLayout'; 
import RenderAlertes from './Components/RenderAlertes'
import Avis from './Components/Avis';
import RenderCommentaire from "./Pages/Commentaires";
import RenderDecision from "./Components/RenderDecision";
import RenderLegislation from "./Components/RenderLegislation";
import AidePage from './Pages/AidePage'
import ProfileSettings from './Components/ProfileSettings'
import ExpertsProfileSettings from './Components/ExpertsProfileSettings'
import SettingsPage from './Components/SettingsPage'
import ExpertsLayout from "./layout/ExpertsLayout";
import Decisions from "./Pages/Decisions";


const router = createBrowserRouter(
    createRoutesFromElements(
        <Route>
            <Route path='/' element={<HomeLayout />}>
                <Route index element={<Home />} />

                <Route path="fonctionnalites" element={<Fonctionnalites/>}/>
                <Route path="pourquoi-nous" element={<PourquoiNous/>}/>

                <Route path="cabinets-avocats" element={<CabinetsAvocats/>}/>
                <Route path="directions-entreprises" element={<DirEntre/>}/>
                <Route path="directions-juridiques-du-secteur-public" element={<DirJur/>}/>
                <Route path="directions-sinistres" element={<DirSin/>}/>

                <Route path="mini-series" element={<MiniSeries/>}/>
                <Route path="webinaires" element={<Webinaires/>}/>
                <Route path="blog" element={<Blog/>}/>
                <Route path="faqs" element={<Faqs/>}/>

                <Route path="avis-clients" element={<AvisClients/>}/>
                <Route path="tarifs" element={<Tarifs/>}/>
                <Route path="conditions-generales" element={<TermsConditions/>}/>
                <Route path="test" element={<Test2/>}/>
            </Route>



            <Route path="authform" element={<AuthLayout/>}>
                <Route path="forgot-password" element={<ForgotPassword/>}/>
                <Route path="authform?tab=register" element={<AuthForm/>}/>
                <Route path="authform?tab=login" element={<AuthForm/>}/>
            </Route>


            <Route path="dashboard" element={<ProtectedRoute><DashboardLayout/></ProtectedRoute>}>
                <Route index element={<RenderAcceuil/>}/>
                <Route path="avis" element={<Avis/>}/>
                <Route path="dossier" element={<Dossier />}/>
                <Route path="alertes" element={<RenderAlertes />}/>
                <Route path="commentaires" element={<RenderCommentaire />}/>
                {/* <Route path="decisions" element={<RenderDecision />} /> */}
                <Route path="article/:id" element={<ArticleDetail />} />
                <Route path="commentaire/:id" element={<SingleCommentaire />} />
                {/* <Route path="legislations" element={<RenderLegislation />} /> */}
                <Route path="legislation/:id" element={<LegislationDetail1 />} />
                {/* <Route path="decision/${decision.id" element={<SingleDecision />} /> */}

                <Route path="search" element={<SearchExperts />}>
                    {/* <Route index element={<ExpertsProfile />} /> */}
                    <Route path="user/:userId" element={<ExpertsProfile />} />
                </Route>


                <Route path="legislations" element={<LegislationDetail />} />
                <Route path="forgotpassword" element={<ForgotPassword />} />
                <Route path="resetpassword" element={<ResetPassword />} />
                <Route path="profil" element={<ProfileSettings />} />
                <Route path="parametres" element={<SettingsPage />} />
                <Route path="parametres-expert" element={<ExpertsProfileSettings />} />
                <Route path="aide" element={<AidePage />} />
                <Route path="decisions" element={<Decisions />} />
            </Route>

        </Route>
    )
)
const AppNew = () => {
  return (
    <RouterProvider router={router} />
  );
};

export default AppNew