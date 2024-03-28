import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import About from "./pages/About";
import SignIn from "./pages/SignIn";
import Dashboard from "./pages/Dashboard";
import SignUp from "./pages/SignUp";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
//import Test from "./pages/Test";
import Header from "./components/Header";
import Footer from "./components/Footer";
import PrivateRoute from "./components/PrivateRoute";
import OnlyAdminPrivateRoute from "./components/OnlyAdminPrivateRoute";
import CreatePost from "./pages/CreatePost";
import UpdatePost from "./pages/UpdatePost";
import PostPage from "./pages/PostPage";
import ScrollToTop from "./components/ScrollToTop";
import Search from "./pages/Search";
import Test from "./pages/Test";

import ThemeProvider from "./components/ThemeProvider.jsx";

const NotFound = () => {
  return (
    <div className="p-3">
      <h1 className="text-xl">404 - Page Not Found</h1>
      <p>Sorry, the page you are looking for could not be found.</p>
    </div>
  );
};
//bg-orange-500
export default function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <ThemeProvider>
        <Header />
        <div className="h-full grow ">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/test" element={<Test />} />
            <Route path="/sign-in" element={<SignIn />} />
            <Route path="/sign-up" element={<SignUp />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            {/*  <Route path="/test/:id" element={<Test />} /> */}
            <Route
              path="/reset-password/:id/:token"
              element={<ResetPassword />}
            />
            <Route path="/search" element={<Search />} />
            <Route element={<PrivateRoute />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/create-post" element={<CreatePost />} />
              <Route path="/update-post/:postId" element={<UpdatePost />} />
            </Route>
            {/*<Route element={<OnlyAdminPrivateRoute />}>
          
        </Route> */}
            <Route path="/post/:postSlug" element={<PostPage />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
        <Footer />
      </ThemeProvider>
    </BrowserRouter>
  );
}
