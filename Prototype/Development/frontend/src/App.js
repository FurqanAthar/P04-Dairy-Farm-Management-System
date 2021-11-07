import "./assets/scss/main.scss";
import "react-toastify/dist/ReactToastify.css";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import BusinessRegistration from "./pages/BusinessRegistration"
import Login from "./pages/login"
import AddAnimal from "./pages/AddAnimal"
import Navigation from "./components/layouts/Navigation";
import { ToastContainer } from "react-toastify";

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
        <Navigation/>
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
        </Switch>
      </BrowserRouter>
    </>
  );
}

export default App;
