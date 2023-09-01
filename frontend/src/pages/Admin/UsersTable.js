import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import AdminSidebar from "./AdminSidebar";
import "./admin-tables.css";
import swal from "sweetalert2";
import {
  deleteProfile,
  getAllUsersProfiles,
} from "../../redux/ApiCalls/ProfileApiCalls";
import { useDispatch, useSelector } from "react-redux";

const UsersTable = () => {
  const { profiles, isProfileDeleted } = useSelector((state) => state.profile);

  const dispatch = useDispatch();

  // isProfileDeleted dependency to make the use effect get new users after delete
  useEffect(() => {
    dispatch(getAllUsersProfiles());
  }, [isProfileDeleted]);

  // Delete User Handler
  const deleteUserHandler = (userId) => {
    new swal({
      title: "Are you sure?",
      text: "Once deleted, you will not be able to recover this user!",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    }).then((willDelete) => {
      if (willDelete) {
        dispatch(deleteProfile(userId));
      }
    });
  };

  return (
    <section className="table-container">
      <AdminSidebar />
      <div className="table-wrapper">
        <h1 className="table-title">Users</h1>
        <table className="table">
          <thead>
            <tr>
              <th>Count</th>
              <th>User</th>
              <th>Email</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {profiles.map((item, index) => (
              <tr>
                <td>{index + 1}</td>
                <td>
                  <div className="table-image">
                    <img
                      src={item.profilePhoto?.url}
                      alt=""
                      className="table-user-image"
                    />
                    <span className="table-username">{item.username}</span>
                  </div>
                </td>
                <td>{item.email}</td>
                <td>
                  <div className="table-button-group">
                    <button>
                      <Link to={`/profile/${item._id}`}>View Profile</Link>
                    </button>
                    <button onClick={() => deleteUserHandler(item._id)}>
                      Delete User
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
};

export default UsersTable;
