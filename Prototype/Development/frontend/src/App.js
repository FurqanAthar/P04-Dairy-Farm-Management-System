import "./assets/scss/main.scss";
import "react-toastify/dist/ReactToastify.css";
import "react-datepicker/dist/react-datepicker.css";
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
import Animal from "./pages/Animals/Animal";
import Inventory from "./pages/Inventory/Inventory";
import AddMilkProduction from "./pages/DailyRecord/AddMilkProduction";
import AddWorkers from "./pages/settings/AddWorkers";
import AddCustomer from "./pages/Customer/AddCustomer";
import Customer from "./pages/Customer/Customers";
import MilkProduction from "./pages/DailyRecord/MilkProduction";
import MilkSupply from "./pages/DailyRecord/MilkSupply";
import MilkSupplyList from "./pages/DailyRecord/MilkSupplyList";
import Category from "./pages/Inventory/Category";
import Expense from "./pages/Expenses/Expense";
import AddInvoice from "./pages/Expenses/AddInvoice";

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
          <PrivateRoute exact path="/milk-records">
            <MilkProduction />
          </PrivateRoute>
          <PrivateRoute exact path="/milk-records/add">
            <AddMilkProduction />
          </PrivateRoute>

          {/* Milk Supply Dairy */}
          <PrivateRoute exact path="/milk-supply/add">
            <MilkSupply />
          </PrivateRoute>
          <PrivateRoute exact path="/milk-supply">
            <MilkSupplyList />
          </PrivateRoute>
          <PrivateRoute exact path="/milk-supply/:id">
            <MilkSupply />
          </PrivateRoute>

          <PrivateRoute exact path="/milk-records/:id">
            <AddMilkProduction />
          </PrivateRoute>

          {/* Customer*/}
          <PrivateRoute exact path="/customer">
            <Customer />
          </PrivateRoute>
          <PrivateRoute exact path="/customer/add">
            <AddCustomer />
          </PrivateRoute>
          <PrivateRoute exact path="/customer/:id">
            <AddCustomer />
          </PrivateRoute>

          {/* Team Members and Workers */}
          <PrivateRoute exact path="/">
            <Dashboard />
          </PrivateRoute>

          {/* Inventory Pages */}
          <PrivateRoute exact path="/inventory">
            <Inventory />
          </PrivateRoute>
          <PrivateRoute exact path="/inventory/category/:id">
            <Category />
          </PrivateRoute>

          {/* Expense Pages */}
          <PrivateRoute exact path="/expense">
            <Expense />
          </PrivateRoute>
          <PrivateRoute exact path="/expense/addInvoice">
            <AddInvoice />
          </PrivateRoute>

          {/* Team Members and Workers */}
          <PrivateRoute exact path="/dashboard">
            <Dashboard />
          </PrivateRoute>
          <PrivateRoute exact path="/farm/settings">
            <FarmSettings />
          </PrivateRoute>
          <PrivateRoute exact path="/farm/settings/addMembers">
            <AddMembers />
          </PrivateRoute>
          <PrivateRoute exact path="/farm/settings/addWorkers">
            <AddWorkers />
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
