import "./assets/scss/main.scss";
import "react-toastify/dist/ReactToastify.css";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import BusinessRegistration from "./pages/BusinessRegistration"
import Login from "./pages/login"
import AddAnimal from "./pages/AddAnimal"
import Navigation from "./components/layouts/Navigation";
import { ToastContainer } from "react-toastify";
import Dashboard from "./pages/Dashboard";
import PrivateRoute from "./privateRouting/PrivateRoute";
import FarmSettings from "./pages/settings/FarmSettings";
import UserProfile from "./pages/settings/UserProfile";

function App() {
  return (
    <>
      <BrowserRouter>
        <ToastContainer
          position="top-right"
          autoClose={10000}
          hideProgressBar={true}
          newestOnTop={true}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss={false}
          draggable={false}
          pauseOnHover={false}
        />
        <Navigation />
        <Switch>
          <Route exact path="/register">
            <BusinessRegistration />
          </Route>
          <Route exact path="/login">
            <Login />
          </Route>
          <Route exact path="/AddAnimal">
            <AddAnimal />
          </Route>
          <PrivateRoute exact path="/dashboard">
            <Dashboard />
          </PrivateRoute>
          <PrivateRoute exact path="/farm/settings">
            <FarmSettings />
          </PrivateRoute>
          <PrivateRoute exact path="/farm/settings/user-profile">
            <UserProfile />
          </PrivateRoute>
        </Switch>
      </BrowserRouter>
    </>
  );
}

export default App;
