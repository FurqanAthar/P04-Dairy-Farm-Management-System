import "./assets/scss/main.scss";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import BusinessRegistration from "./pages/BusinessRegistration"
import Navigation from "./components/layouts/Navigation";

function App() {
  return (
    <BrowserRouter>
      <Navigation/>
      <Switch>
        <Route exact path="/register">
          <BusinessRegistration />
        </Route>
      </Switch>
    </BrowserRouter>
  );
}

export default App;
