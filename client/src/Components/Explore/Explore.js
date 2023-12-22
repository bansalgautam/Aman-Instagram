import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getExploreData } from "../../redux/slices/exploreSlice";
import "./Explore.scss";
import { GoUnmute } from "react-icons/go";
import { IoVolumeMuteSharp } from "react-icons/io5";
import Comments from "../Comment/Comment";

function Explore() {
  const dispatch = useDispatch();
  const [openComments, setOpenComments] = useState(false);
  const [postId, setPostId] = useState("");
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const videoRef = useRef(null);

  const exploreData = useSelector((state) => state.exploreReducer.exploreData);

  useEffect(() => {
    dispatch(getExploreData());
  }, [dispatch]);

  const handlePlayPause = () => {
    if (isPlaying) {
      videoRef.current.pause();
    } else {
      videoRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleMuteUnmute = () => {
    videoRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  return (
    <div className="Explore">
      <div className="explore-container">
        <div className="posts">
          {exploreData?.posts?.map((posts) => (
            <div
              key={posts._id}
              className="post"
              onClick={() => {
                setOpenComments(!openComments);
                setPostId(posts);
              }}
            >
              <div className="single-post">
                {!posts?.isVideo ? (
                  <img src={posts?.image?.url} alt="Post" />
                ) : (
                  <video
                    ref={videoRef}
                    onPlay={() => setIsPlaying(true)}
                    onPause={() => setIsPlaying(false)}
                    controls={false}
                    onClick={handlePlayPause}
                    style={{ objectFit: "cover" }}
                    height={"100%"}
                    width={"100%"}
                    src={posts?.image?.url}
                  ></video>
                )}
                {posts?.isVideo && (
                  <button onClick={handleMuteUnmute}>
                    {isMuted ? <IoVolumeMuteSharp /> : <GoUnmute />}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
      {openComments && (
        <Comments
          closeComments={() => setOpenComments(false)}
          post={postId}
          setOpenComments={setOpenComments}
        />
      )}
    </div>
  );
}

export default Explore;