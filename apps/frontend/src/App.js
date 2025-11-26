import "./App.css";
import "bulma/css/bulma.min.css";
import Navbar from "./components/Navbar";
import { Routes, Route } from "react-router-dom";
import { routes } from "./routes";
import Home from "./pages/Home";
import "./app.scss";
import ExploreCategory from "./pages/ExploreCategory";
import Footer from "./components/Footer";
import Explore from "./pages/Explore";
import Service from "./pages/Service";
import FreelancerProfile from "./pages/FreelancerProfile";
import "primeicons/primeicons.css";
import "primereact/resources/themes/lara-light-indigo/theme.css";
import "primereact/resources/primereact.css";
import Logout from "./pages/Logout";
import LoadingIndicator from "./LoadingIndicator";
import DashboardFreelancerProfile from "./pages/Freelancer/DashboardFreelancerProfile";
import { ScrollTop } from "primereact/scrolltop";
import Skills from "./components/Freelancer/Skills";
import FreelancerProfileArea from "./pages/Freelancer/FreelancerProfileArea";
import Education from "./components/Freelancer/Education";
import WhyMe from "./components/Freelancer/WhyMe";
import Certification from "./components/Freelancer/Certification";
import Language from "./components/Freelancer/Language";
import FreelancerServiceArea from "./pages/Freelancer/FreelancerServiceArea";
import ActiveServices from "./components/Services/ActiveServices";
import { NewService } from "./components/Services/NewService";
import NewServiceTitle from "./components/Services/NewServiceTitle";
import NewServicePrice from "./components/Services/NewServicePrice";
import NewServiceDescription from "./components/Services/NewServiceDescription";
import NewServiceFiles from "./components/Services/NewServiceFiles";
import NewServicePublish from "./components/Services/NewServicePublish";
import FreelancerAccountArea from "./pages/Freelancer/FreelancerAccountArea";
import BasicData from "./components/Freelancer/BasicData";
import PasswordAdmin from "./components/Freelancer/PasswordAdmin";
import DesactiveAccount from "./components/Freelancer/DesactiveAccount";
import FreelancerVerificationArea from "./pages/Freelancer/FreelancerVerificationArea";
import VerifyPhone from "./components/Freelancer/VerifyPhone";
import DescriptionFreelancer from "./components/Freelancer/DescriptionFreelancer";
import NewServiceRequirements from "./components/Services/NewServiceRequirements";
import VerifyMail from "./components/Freelancer/VerifyMail";
import ProjectPayment from "./pages/ProjectPayment";
import ChatComponent from "./components/Chat/ChatComponent";
import FreelancerProjectArea from "./pages/Freelancer/FreelancerProjectArea";
import CurrentProject from "./components/Freelancer/Projects/CurrentProject";
import ProjectDetail from "./components/Freelancer/Projects/ProjectDetail";
import FinishedProjects from "./components/Freelancer/Projects/FinishedProjects";
import CancelledProjects from "./components/Freelancer/Projects/CancelledProjects";
import ContractedProjects from "./components/Freelancer/Projects/ContractedProjects";
import DashboardFreelancer from "./components/Freelancer/Dashboard/DashboardFreelancer";
import MessageComponent from "./components/Messages/MessageComponent";
import AboutUs from "./pages/AboutUs";
import HelpCenter from "./pages/HelpCenter";
import Privacity from "./pages/Privacity";
import Terms from "./pages/Terms";
import Contact from "./pages/Contact";
import FreelancerFinanceArea from "./pages/Freelancer/FreelancerFinanceArea";
import AdminPage from "./pages/AdminPage";
import NewAdminPage from "./pages/Admin/NewAdminPage";
import UserAdmin from "./pages/Admin/UserAdmin";
import Messages from "./pages/Admin/Messages";
import AdminFreelancers from "./pages/Admin/AdminFreelancers";
import AdminClients from "./pages/Admin/AdminClients";
import AdminProfile from "./pages/Admin/AdminProfile";
import AdminCollaborator from "./pages/Admin/AdminCollaborator";
import AdminFinances from "./pages/Admin/AdminFinances";
import AdminHighlight from "./pages/Admin/AdminHighlight";
import "primeflex/primeflex.css";
// import '../../index.css';

function App() {
  return (
    <div className="App" style={{ maxWidth: "100vw" }}>
      <LoadingIndicator />
      <Navbar />
      <ScrollTop />
      <div>
        <ChatComponent />
        <Routes>
          <Route path={routes.HOME} element={<Home />} />
          <Route path={routes.ABOUT_US} element={<AboutUs />} />
          <Route path={routes.DASHBOARD_ADMIN} element={<AdminPage />}>
            <Route
              path={routes.DASHBOARD_ADMIN_NEW}
              element={<UserAdmin />}
            ></Route>
            <Route
              path={routes.DASHBOARD_ADMIN_MESSAGES}
              element={<Messages />}
            ></Route>
            <Route
              path={routes.DASHBOARD_ADMIN_FREELANCERS}
              element={<AdminFreelancers />}
            ></Route>
            <Route
              path={routes.DASHBOARD_ADMIN_CLIENTS}
              element={<AdminClients />}
            ></Route>
            <Route
              path={routes.DASHBOARD_ADMIN_PROFILE}
              element={<AdminProfile />}
            ></Route>
            <Route
              path={routes.DASHBOARD_ADMIN_COLLABORATOR}
              element={<AdminCollaborator />}
            ></Route>
            <Route
              path={routes.DASHBOARD_ADMIN_FINANCES}
              element={<AdminFinances />}
            ></Route>
            <Route
              path={routes.DASHBOARD_ADMIN_HIGHLIGHT}
              element={<AdminHighlight />}
            ></Route>
          </Route>
          <Route path={routes.DASHBOARD_ADMIN_NEW} element={<NewAdminPage />} />

          <Route path={routes.HELP_CENTER} element={<HelpCenter />} />
          <Route path={routes.CONTACT} element={<Contact />} />
          <Route path={routes.PRIVACITY} element={<Privacity />} />
          <Route path={routes.TERMS} element={<Terms />} />
          <Route path={routes.EXPLORECATEGORY} element={<ExploreCategory />} />
          <Route path={routes.EXPLORE} element={<Explore />} />
          <Route path={routes.EXPLOREID} element={<Explore />} />
          <Route path={routes.SERVICE} element={<Service />} />
          <Route path={routes.NEWPROJECT} element={<ProjectPayment />} />
          <Route
            path={routes.FREELANCERPROFILE}
            element={<FreelancerProfile />}
          />
          <Route
            path={routes.DASHBOARD_FREELANCER_PROJECTS_DETAIL}
            element={<ProjectDetail />}
          ></Route>
          <Route
            path={routes.DASHBOARD_FREELANCER}
            element={<DashboardFreelancerProfile />}
          >
            <Route
              path={routes.DASHBOARD_FREELANCERPROFILE}
              element={<FreelancerProfileArea />}
            >
              <Route
                path={routes.DASHBOARD_FREELANCERSKILLS}
                element={<Skills />}
              ></Route>
              <Route
                path={routes.DASHBOARD_FREELANCEREDUCATION}
                element={<Education />}
              ></Route>
              <Route
                path={routes.DASHBOARD_FREELANCERCERTIFICATION}
                element={<Certification />}
              ></Route>
              <Route
                path={routes.DASHBOARD_FREELANCERWHYME}
                element={<WhyMe />}
              ></Route>
              <Route
                path={routes.DASHBOARD_FREELANCERDESCRIPTION}
                element={<DescriptionFreelancer />}
              ></Route>
              <Route
                path={routes.DASHBOARD_FREELANCERLANGUAGE}
                element={<Language />}
              ></Route>
            </Route>
            <Route
              path={routes.DASHBOARD_FREELANCER_ACCOUNT}
              element={<FreelancerAccountArea />}
            >
              <Route
                path={routes.DASHBOARD_FREELANCER_ACCOUNT_BASIC}
                element={<BasicData />}
              ></Route>
              <Route
                path={routes.DASHBOARD_FREELANCER_ACCOUNT_PASSWORD}
                element={<PasswordAdmin />}
              ></Route>
              <Route
                path={routes.DASHBOARD_FREELANCER_ACCOUNT_DESACTIVE}
                element={<DesactiveAccount />}
              ></Route>
              <Route
                path={routes.DASHBOARD_FREELANCER_ACCOUNT_NOTIFICATIONS}
                element={<DesactiveAccount />}
              ></Route>
            </Route>
            <Route
              path={routes.DASHBOARD_FREELANCER_FINANCE}
              element={<FreelancerFinanceArea />}
            ></Route>
            <Route
              path={routes.DASHBOARD_FREELANCER_VERIFICATION}
              element={<FreelancerVerificationArea />}
            >
              <Route
                path={routes.DASHBOARD_FREELANCER_VERIFICATION_PHONE}
                element={<VerifyPhone />}
              ></Route>
              <Route
                path={routes.DASHBOARD_FREELANCER_VERIFICATION_EMAIL}
                element={<VerifyMail />}
              ></Route>
              <Route
                path={routes.DASHBOARD_FREELANCER_ACCOUNT_DESACTIVE}
                element={<DesactiveAccount />}
              ></Route>
              <Route
                path={routes.DASHBOARD_FREELANCER_ACCOUNT_NOTIFICATIONS}
                element={<DesactiveAccount />}
              ></Route>
            </Route>
            <Route
              path={routes.DASHBOARD_FREELANCER_PROJECTS}
              element={<FreelancerProjectArea />}
            >
              <Route
                path={routes.DASHBOARD_FREELANCER_PROJECTS_INPROGRESS}
                element={<CurrentProject />}
              ></Route>
              <Route
                path={routes.DASHBOARD_FREELANCER_PROJECTS_FINISHED}
                element={<FinishedProjects />}
              ></Route>
              <Route
                path={routes.DASHBOARD_FREELANCER_PROJECTS_CANCELLED}
                element={<CancelledProjects />}
              ></Route>
              <Route
                path={routes.DASHBOARD_FREELANCER_PROJECTS_CONTRACTED}
                element={<ContractedProjects />}
              ></Route>
            </Route>
            <Route
              path={routes.DASHBOARD_Dashboard}
              element={<DashboardFreelancer />}
            ></Route>
            <Route
              path={routes.DASHBOARD_FREELANCER_MESSAGES}
              element={<MessageComponent />}
            ></Route>
            <Route
              path={routes.DASHBOARD_SERVICES}
              element={<FreelancerServiceArea />}
            >
              <Route
                path={routes.DASHBOARD_SERVICESACTIVE}
                element={<ActiveServices />}
              ></Route>
              <Route
                path={routes.DASHBOARD_FREELANCEREDUCATION}
                element={<Education />}
              ></Route>
            </Route>
            <Route path={routes.DASHBOARD_SERVICENEW} element={<NewService />}>
              <Route
                path={routes.DASHBOARD_SERVICENEW_TITLE}
                element={<NewServiceTitle />}
              ></Route>
              <Route
                path={routes.DASHBOARD_SERVICENEW_PRICE}
                element={<NewServicePrice />}
              ></Route>
              <Route
                path={routes.DASHBOARD_SERVICENEW_DESCRIPTION}
                element={<NewServiceDescription />}
              ></Route>
              <Route
                path={routes.DASHBOARD_SERVICENEW_REQUIREMENTS}
                element={<NewServiceRequirements />}
              ></Route>
              <Route
                path={routes.DASHBOARD_SERVICENEW_FILES}
                element={<NewServiceFiles />}
              ></Route>
              <Route
                path={routes.DASHBOARD_SERVICENEW_PUBLISH}
                element={<NewServicePublish />}
              ></Route>
            </Route>
          </Route>
          <Route path={routes.LOGOUT} element={<Logout />} />
          <Route path="/treff-site" element={<Home />} />
          {/* <RouterProvider router={router} /> */}
        </Routes>
      </div>
      <Footer />
    </div>
  );
}

export default App;
