import { BrowserRouter, Route, Routes } from "react-router";
import SignUp from "./pages/SignUp";
import Home from "./pages/Home";
import SignIn from "./pages/SignIn";
import Layout from "./components/Layout";
import ContentTypePage from "./pages/ContentTypePage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/sign-up" element={<SignUp />} />
        <Route path="/sign-in" element={<SignIn />} />
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="/type/:type" element={<ContentTypePage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
