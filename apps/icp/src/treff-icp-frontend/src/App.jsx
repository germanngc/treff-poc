import { useState } from "react";
import { treff_icp_backend } from "declarations/treff-icp-backend";
import Home from "./pages/Home";
import { Route, Routes } from "react-router-dom";
import { routes } from "./routes";
// import "bulma/css/bulma.min.css";
// import "https://cdn.jsdelivr.net/npm/bulma@0.9.4/css/bulma.min.css";
import "./App.css";
import "./index.scss";
import LoadingIndicator from "./LoadingIndicator";
import Navbar from "./components/Navbar";

import { ScrollTop } from "primereact/scrolltop";
import AboutUs from "./pages/AboutUs";
import HelpCenter from "./pages/HelpCenter";
import Contact from "./pages/Contact";
import Privacity from "./pages/Privacity";
import Terms from "./pages/Terms";
import ExploreCategory from "./pages/ExploreCategory";
import Explore from "./pages/Explore";
import Service from "./pages/Service";
import ProjectPayment from "./pages/ProjectPayment";
import Footer from "./components/Footer";
import FreelancerProfile from "./pages/FreelancerProfile";
import DashboardFreelancerProfile from "./pages/Freelancer/DashboardFreelancerProfile";
import FreelancerProfileArea from "./pages/Freelancer/FreelancerProfileArea";
import ProjectDetail from "./components/Freelancer/Projects/ProjectDetail";
import Skills from "./components/Freelancer/Skills";
import Education from "./components/Freelancer/Education";
import Certification from "./components/Freelancer/Certification";
import WhyMe from "./components/Freelancer/WhyMe";
import DescriptionFreelancer from "./components/Freelancer/DescriptionFreelancer";
import Language from "./components/Freelancer/Language";
import FreelancerAccountArea from "./pages/Freelancer/FreelancerAccountArea";
import BasicData from "./components/Freelancer/BasicData";
import PasswordAdmin from "./components/Freelancer/PasswordAdmin";
import DesactiveAccount from "./components/Freelancer/DesactiveAccount";
import FreelancerFinanceArea from "./pages/Freelancer/FreelancerFinanceArea";
import FreelancerVerificationArea from "./pages/Freelancer/FreelancerVerificationArea";
import VerifyPhone from "./components/Freelancer/VerifyPhone";
import VerifyMail from "./components/Freelancer/VerifyMail";
import FreelancerProjectArea from "./pages/Freelancer/FreelancerProjectArea";
import CurrentProject from "./components/Freelancer/Projects/CurrentProject";
import FinishedProjects from "./components/Freelancer/Projects/FinishedProjects";
import CancelledProjects from "./components/Freelancer/Projects/CancelledProjects";
import ContractedProjects from "./components/Freelancer/Projects/ContractedProjects";
import DashboardFreelancer from "./components/Freelancer/Dashboard/DashboardFreelancer";
import MessageComponent from "./components/Messages/MessageComponent";
import FreelancerServiceArea from "./pages/Freelancer/FreelancerServiceArea";
import ActiveServices from "./components/Services/ActiveServices";
import { NewService } from "./components/Services/NewService";
import NewServiceTitle from "./components/Services/NewServiceTitle";
import NewServicePrice from "./components/Services/NewServicePrice";
import NewServiceDescription from "./components/Services/NewServiceDescription";
import NewServiceRequirements from "./components/Services/NewServiceRequirements";
import NewServiceFiles from "./components/Services/NewServiceFiles";
import NewServicePublish from "./components/Services/NewServicePublish";

function App() {
  const [greeting, setGreeting] = useState("");

  function handleSubmit(event) {
    event.preventDefault();
    const name = event.target.elements.name.value;
    treff_icp_backend.greet(name).then((greeting) => {
      setGreeting(greeting);
    });
    return false;
  }

  return (
    <main>
      <LoadingIndicator />
      <Navbar />
      <ScrollTop />
      <div className="mt-6">
        <Routes>
          {/* <img src="/logo2.svg" alt="DFINITY logo" />
      <br />
      <br />
      <form action="#" onSubmit={handleSubmit}>
        <label htmlFor="name">Enter your name: &nbsp;</label>
        <input id="name" alt="Name" type="text" />
        <button type="submit">Click Me!</button>
      </form>
      <section id="greeting">{greeting}</section> */}
          <Route path={routes.HOME} element={<Home />} />
          <Route path={routes.ABOUT_US} element={<AboutUs />} />
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
          {/* <Route
          path={routes.DASHBOARD_FREELANCER_PROJECTS_DETAIL}
          element={<ProjectDetail />}
        ></Route> */}
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
        </Routes>
      </div>
      <Footer />
    </main>
  );
}

export default App;
