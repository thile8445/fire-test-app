import React, { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useNavigate } from "react-router-dom";
import {
  addMessage,
  auth,
  logout,
  getMessage,
  onListentMessage,
  uploadFile,
} from "../../config/firebase";

export default function Home() {
  const [user] = useAuthState(auth);
  const navigate = useNavigate();
  if (!user) navigate("/");

  const [message, setMessage] = useState("");
  const [listMessage, setListMessage] = useState([]);
  const [file, setFile] = useState("");
  const [perCent, setPercent] = useState(0);

  async function getMessageDB() {
    setListMessage(await getMessage());
  }

  function handleChange(event) {
    setFile(event.target.files[0]);
  }

  function handleUpload() {
    uploadFile(file, setPercent);
  }

  useEffect(() => {
    if (user) {
      onListentMessage(getMessageDB);
      getMessageDB();
    }
  }, [user]);

  useEffect(() => {
    if (perCent) {
      console.log("perCent", perCent);
    }
  }, [perCent]);
  return (
    <>
      <div>home</div>
      <input
        type="text"
        className="login__textBox"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="E-mail Address"
      />
      <button
        className="dashboard__btn"
        onClick={async () => {
          const payload = {
            message,
            name: user.displayName,
            email: user.email,
            uid: user.uid,
          };
          await addMessage(payload);
          setMessage("");
          // getMessageDB();
        }}
      >
        Send
      </button>
      <button
        className="dashboard__btn"
        onClick={async () => {
          await logout();
          navigate("/");
        }}
      >
        Logout
      </button>
      <hr />
      <ul>
        {listMessage?.map((data, index) => {
          return (
            <li key={index}>
              {data?.email} - {data?.message}
            </li>
          );
        })}
      </ul>
      <hr />
      <div>
        <input type="file" accept="image/*" onChange={handleChange} />
        <button onClick={handleUpload}>Upload to Firebase</button>
      </div>
    </>
  );
}
