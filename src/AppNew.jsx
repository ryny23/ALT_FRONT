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
import RenderProfilExpert from "./Components/RenderProfilExpert";
import Detailslayout from "./layout/Detailslayout";
import Commentaires from "./Pages/Commentaires";
import ImportCommentaires from "./Pages/ImportCommentaires";
import ImportDecisions from "./Pages/ImportDecisions";
import CommentImport from "./Pages/CommentImport";
import ArticleImport from "./Pages/ArticleImport";
import DecisionImport from "./Pages/DecisionImport";
import LegislationImport from "./Pages/LegislationImport";
import ImportPage from "./Pages/ImportPage";



const router = createBrowserRouter(
    createRoutesFromElements(
        <Route>

            <Route path='/' element={<HomeLayout />}>
                <Route index element={<Home />} />
                <Route path="avis-clients" element={<AvisClients/>}/>
                <Route path="tarifs" element={<Tarifs/>}/>
                <Route path="conditions-generales" element={<TermsConditions/>}/>
                <Route path="test" element={<Test2/>}/>
                <Route path="importcommentaires" element={<ImportCommentaires />} />
                <Route path="importdecisions" element={<ImportDecisions />} />
                <Route path="commentimport" element={<CommentImport />} />
                <Route path="articleimport" element={<ArticleImport />} />
                <Route path="decisionimport" element={<DecisionImport />} />
                <Route path="importpage" element={<ImportPage />} />
                <Route path="legislationimport" element={<LegislationImport />} />

                {/* PLATEFORME */}
                <Route path="fonctionnalites" element={<Fonctionnalites/>}/>
                <Route path="pourquoi-nous" element={<PourquoiNous/>}/>

                {/* SOLUTIONS */}
                <Route path="cabinets-avocats" element={<CabinetsAvocats/>}/>
                <Route path="directions-entreprises" element={<DirEntre/>}/>
                <Route path="directions-juridiques-du-secteur-public" element={<DirJur/>}/>
                <Route path="directions-sinistres" element={<DirSin/>}/>

                {/* VIE DE LA COMMUNAUTE */}
                <Route path="mini-series" element={<MiniSeries/>}/>
                <Route path="webinaires" element={<Webinaires/>}/>
                <Route path="blog" element={<Blog/>}/>
                <Route path="faqs" element={<Faqs/>}/>   
            </Route>



            <Route path="authform" element={<AuthLayout/>}>
                <Route path="authform?tab=register" element={<AuthForm/>}/>
                <Route path="authform?tab=login" element={<AuthForm/>}/>
                <Route path="forgot-password" element={<ImportCommentaires/>}/>

            </Route>



            <Route path="dashboard" element={<ProtectedRoute><DashboardLayout/></ProtectedRoute>}>
                <Route index element={<RenderAcceuil/>}/>
                <Route path="avis" element={<Avis/>}/>
                <Route path="dossier" element={<Dossier />}/>
                <Route path="alertes" element={<RenderAlertes />}/>
                <Route path="aide" element={<AidePage />} />
                <Route path="profil" element={<ProfileSettings />} />
                <Route path="parametres" element={<SettingsPage />} />
                <Route path="resetpassword" element={<ResetPassword />} />
                <Route path="parametres-expert" element={<ExpertsProfileSettings />} />
                
                
                
                {/* TEXTES JURIDIQUES */}
                <Route path="decisions" element={<Detailslayout/>}>
                    <Route index element={<Decisions />} />
                        <Route path=":id" element={<SingleDecision />} />
                </Route>

                <Route path="commentaires" element={<Detailslayout/>}>
                    <Route index element={<Commentaires />} />
                        <Route path=":id" element={<SingleCommentaire />} />
                    </Route>

                <Route path="legislations" element={<Detailslayout/>}>
                    <Route index element={<LegislationDetail />} />
                        <Route path=":id" element={<LegislationDetail1 />} />
                </Route>
                
            
                {/* EXPERTS */}
                <Route path="expert" element={<Detailslayout/>}>
                    <Route index element={<SearchExperts />} />
                    <Route path=":id" element={<RenderProfilExpert />} />
                </Route>
            

                
                <Route path="article/:{result.id}" element={<ArticleDetail />} />
                
                

            </Route>
        </Route>
    )
)
const AppNew = () => {
  return (
    <RouterProvider router={router} />
  );
};

export default AppNew;