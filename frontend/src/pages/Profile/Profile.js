import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import swal from "sweetalert2";
import PostItem from "../../components/posts/PostItem";
import "./profile.css";
import UpdateProfileModal from "./UpdateProfileModal";
import { useDispatch, useSelector } from "react-redux";
import { Puff } from "react-loader-spinner";
import {
  deleteProfile,
  getUserProfile,
  uploadProfilePhoto,
} from "../../redux/ApiCalls/ProfileApiCalls";
import { logoutUser } from "../../redux/ApiCalls/AuthApiCalls";
const Profile = () => {
  const [file, setFile] = useState(null);
  const [updateProfile, setUpdateProfile] = useState(false);
  const { profile, loading, isProfileDeleted } = useSelector(
    (state) => state.profile
  );
  const { user } = useSelector((state) => state.auth);

  const { id } = useParams();
  const dispatch = useDispatch();

  const navigate = useNavigate();

  useEffect(() => {
    dispatch(getUserProfile(id));
    window.scrollTo(0, 0);
  }, [id, dispatch]);

  // this use effect if the user deleted his profile
  useEffect(() => {
    if (isProfileDeleted) {
      navigate("/");
    }
  }, [navigate, isProfileDeleted]);

  // Form Submit Handler
  const formSubmitHandler = (e) => {
    e.preventDefault();
    if (!file) return toast.warning("there is no file provided!");

    const formData = new FormData();
    //"image cause in the backend we specified the name of the image file is "image"
    formData.append("image", file);

    dispatch(uploadProfilePhoto(formData));
  };
  const deleteAccountHandler = () => {
    new swal({
      title: "Are you sure?",
      text: "Once deleted, you will not be able to recover profile!",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    }).then((isOk) => {
      if (isOk) {
        dispatch(deleteProfile(user?._id));
        dispatch(logoutUser());
      }
    });
  };

  if (loading) {
    return (
      <div className="profile-loader">
        <Puff
          height="100"
          width="100"
          radius={1}
          color="#4fa94d"
          ariaLabel="puff-loading"
          wrapperStyle={{}}
          wrapperClass=""
          visible={true}
        />
      </div>
    );
  }

  return (
    <section className="profile">
      <div className="profile-header">
        <div className="profile-image-wrapper">
          <img
            src={file ? URL.createObjectURL(file) : profile?.profilePhoto.url}
            alt=""
            className="profile-image"
          />
          {user?._id === profile?._id && (
            <form onSubmit={formSubmitHandler}>
              <abbr title="choose profile photo">
                <label
                  htmlFor="file"
                  className="bi bi-camera-fill upload-profile-photo-icon"
                ></label>
              </abbr>
              <input
                style={{ display: "none" }}
                type="file"
                name="file"
                id="file"
                onChange={(e) => setFile(e.target.files[0])}
              />
              <button className="upload-profile-photo-btn" type="submit">
                upload
              </button>
            </form>
          )}
        </div>
        <h1 className="profile-username">{profile?.username}</h1>
        <p className="profile-bio">{profile?.bio}</p>
        <div className="user-date-joined">
          <strong>Date Joined: </strong>
          <span>{new Date(profile?.createdAt).toLocaleDateString()}</span>
        </div>
        {user?._id === profile?._id && (
          <button
            onClick={() => setUpdateProfile(true)}
            className="profile-update-btn"
          >
            <i className="bi bi-file-person-fill"></i>
            Update Profile
          </button>
        )}
      </div>
      <div className="profile-posts-list">
        <h2 className="profile-posts-list-title">{profile?.username} Posts</h2>
        {profile?.posts?.map((post) => (
          <PostItem
            key={post._id}
            post={post}
            username={profile?.username}
            userId={profile?._id}
          />
        ))}
      </div>
      {user?._id === profile?._id && (
        <button onClick={deleteAccountHandler} className="delete-account-btn">
          Delete Your Account
        </button>
      )}
      {updateProfile && (
        <UpdateProfileModal
          profile={profile}
          setUpdateProfile={setUpdateProfile}
        />
      )}
    </section>
  );
};

export default Profile;
