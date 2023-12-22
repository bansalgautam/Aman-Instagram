import React, { useEffect, useState } from "react";
import userImage from "../../Assets/avatar.png";
import "./UpdateProfile.scss";
import { useDispatch, useSelector } from "react-redux";
import { updateMyProfile } from "../../redux/slices/appConfigslice";
import { KEY_ACCESS_TOKEN, removeItem } from "../../utils/localStorageManager";
import { Navigate } from "react-router-dom";
import { axiosClient } from "../../utils/axiosClient";

function UpdateProfile({darkMode}) {
  const myProfile = useSelector((state) => state.appConfigReducer.myProfile);
  const [name, setName] = useState("");
  const dispatch = useDispatch();
  
  const [bio, setBio] = useState("");
  const [userImg, setuserImg] = useState("");

  useEffect(() => {
    setName(myProfile?.name || "");
    setBio(myProfile?.bio || "");
    setuserImg(myProfile?.avatar?.url);
  }, [myProfile]);

  function handleImageChange(e) {
    const file = e.target.files[0];
    const fileReader = new FileReader();
    fileReader.readAsDataURL(file);
    fileReader.onload = () => {
      if (fileReader.readyState === fileReader.DONE) {
        setuserImg(fileReader.result);
      }
    };
  }

  const handleDelete = async () => {
    try {
      await axiosClient.delete("/user/deleteMyProfile");
      removeItem(KEY_ACCESS_TOKEN);
      Navigate("/login");
    } catch (err) {
      console.log(err);
    }
  };

  function handleSubmit(e) {
    e.preventDefault();
    dispatch(
      updateMyProfile({
        name,
        bio,
        userImg,
      })
    );
  }

  return (
    <div className={darkMode ? "UpdateProfile dark-mode" : "UpdateProfile"}>
      <div className="profile-container">
        <div className="left-part">
          <h3>Edit profile</h3>
        </div>
        <div className="right-part">
          <div className="right-container">
            <div className="avatar-name">
              <div className="avatar">
                <img src={userImg ? userImg : userImage} alt="user avatar" />
              </div>
              <div className="name-change-img">
                <p>{myProfile?.name}</p>
                <div className="input-user-img">
                  <label htmlFor="inputImg" className="labelImg">
                    <h3 className="click-text">Change profile photo</h3>
                  </label>
                  <input
                    className="inputImg"
                    id="inputImg"
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                  />
                </div>
              </div>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="name-input">
                <h3>Name</h3>
                <input
                  value={name}
                  type="text"
                  placeholder="Your Name"
                  onChange={(e) => setName(e.target.value)}
                />
              </div>

              <div className="bio-input">
                <h3>Bio</h3>
                <textarea
                  value={bio}
                  type="text"
                  placeholder="Your Bio"
                  onChange={(e) => setBio(e.target.value)}
                />
              </div>
              <div className="submit-delete">
                <input
                  type="submit"
                  className="submit-button"
                  onClick={handleSubmit}
                />
                <h3 className="danger" onClick={handleDelete}>
                  Delete my account permanently
                </h3>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UpdateProfile;
