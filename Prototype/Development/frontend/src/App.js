import "./assets/scss/main.scss";
import "react-toastify/dist/ReactToastify.css";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import BusinessRegistration from "./pages/BusinessRegistration";
import Login from "./pages/login";
import AddAnimal from "./pages/Animals/AddAnimal";
import Animals from "./pages/Animals/Animals";
import Navigation from "./components/layouts/Navigation";
import { ToastContainer } from "react-toastify";
import Dashboard from "./pages/Dashboard";
import PrivateRoute from "./privateRouting/PrivateRoute";
import FarmSettings from "./pages/settings/FarmSettings";
import UserProfile from "./pages/settings/UserProfile";
import AddMembers from "./pages/settings/AddMembers";
import "react-datepicker/dist/react-datepicker.css";
import Animal from "./pages/Animals/Animal";
import AddMilkProduction from "./pages/DailyRecord/AddMilkProduction";
import AddCustomer from "./pages/Customer/AddCustomer";

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

          {/* Animals */}
          <PrivateRoute exact path="/animals">
            <Animals />
          </PrivateRoute>
          <PrivateRoute exact path="/animals/add">
            <AddAnimal />
          </PrivateRoute>
          <PrivateRoute exact path="/animal/:id">
            <AddAnimal />
          </PrivateRoute>

          {/* Daily Record */}
          <PrivateRoute exact path="/milk-records/add">
            <AddMilkProduction />
          </PrivateRoute>

           {/* Customer */}
           <PrivateRoute exact path="/customer/add">
            <AddCustomer />
          </PrivateRoute>

          <PrivateRoute exact path="/dashboard">
            <Dashboard />
          </PrivateRoute>
          <PrivateRoute exact path="/farm/settings">
            <FarmSettings />
          </PrivateRoute>
          <PrivateRoute exact path="/farm/settings/addMembers">
            <AddMembers />
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
