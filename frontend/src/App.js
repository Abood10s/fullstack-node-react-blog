import Header from "./components/header";
import { Route, Routes, Navigate } from "react-router-dom";
import HomePage from "./pages/Home/index";
import Login from "./pages/forms/Login";
import Profile from "./pages/Profile/Profile";
import ForgotPassword from "./pages/forms/ForgotPassword";
import ResetPassword from "./pages/forms/ResetPassword";

import Register from "./pages/forms/Register";
import PostsPage from "./pages/Post/index";
import CreatePostPage from "./pages/CreatePost/index";
import AdminDashboard from "./pages/Admin/index";
import Footer from "./components/footer";
import PostDetailsPage from "./pages/PostDetails";
import { ToastContainer } from "react-toastify";
import Category from "./pages/Category";
import { useSelector } from "react-redux";
import CategoriesTable from "./pages/Admin/CategoriesTable";
import PostsTable from "./pages/Admin/PostsTable";
import UsersTable from "./pages/Admin/UsersTable";
import CommentsTable from "./pages/Admin/CommentsTable";
import NotFound from "./pages/NotFound";

function App() {
  const { user } = useSelector((state) => state.auth);
  return (
    <div className="App">
      <ToastContainer
        position="top-center"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
      <Header />
      <Routes>
        <Route path="/" element={<HomePage />} />

        <Route
          path="/login"
          element={!user ? <Login /> : <Navigate to="/" />}
        />
        <Route
          path="/register"
          element={!user ? <Register /> : <Navigate to="/" />}
        />

        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route
          path="/reset-password/:userId/:token"
          element={<ResetPassword />}
        />
        <Route
          path="/profile/:id"
          element={user ? <Profile /> : <Navigate to="/" />}
        />

        <Route path="posts">
          <Route index element={<PostsPage />} />
          <Route
            path="create-post"
            element={user ? <CreatePostPage /> : <Navigate to="/login" />}
          />
          <Route path="details/:id" element={<PostDetailsPage />} />
          <Route path="categories/:category" element={<Category />} />
        </Route>

        <Route path="admin-dashboard">
          <Route
            index
            element={user?.isAdmin ? <AdminDashboard /> : <Navigate to="/" />}
          />
          <Route
            path="users-table"
            element={user?.isAdmin ? <UsersTable /> : <Navigate to="/" />}
          />
          <Route
            path="posts-table"
            element={user?.isAdmin ? <PostsTable /> : <Navigate to="/" />}
          />
          <Route
            path="categories-table"
            element={user?.isAdmin ? <CategoriesTable /> : <Navigate to="/" />}
          />
          <Route
            path="comments-table"
            element={user?.isAdmin ? <CommentsTable /> : <Navigate to="/" />}
          />
        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Footer />
    </div>
  );
}

export default App;
