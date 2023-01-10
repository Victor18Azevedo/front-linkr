import { useEffect, useRef, useState } from "react";

import axios from "axios";
import styled from "styled-components";

import { useAuth } from "../hooks/useAuth";

import EditIcon from "../assets/EditIcon.svg";
import BoxLikes from "./BoxLikes";
import RemoveIcon from "../assets/RemoveIcon.svg";
import UserPicture from "./UserPicture";
import { useUserData } from "../hooks/useUserData";
import { useNavigate } from "react-router-dom";

export default function LinkrCard({
  id,
  username,
  userPictureUrl,
  link,
  text,
  linkMetadata,
  likes,
  userId
}) {
  const { userData } = useUserData();
  const [modalConfirmation, setModalConfirmation] = useState(false);
  const [modalLoading, setModalLoading] = useState(false);

  const [isTextEditable, setIsTextEditable] = useState(false);
  const [editTextInput, setEditTextInput] = useState(text);
  const [loadingEdition, setLoadingEdition] = useState(false);
  const [editAPIAccepted, setEditAPIAccepted] = useState(false);
  const inputRef = useRef(null);

  const navigate = useNavigate();

  function handleCardRemoval(e) {
    e.preventDefault();
    setModalLoading(true);
    axios
      .delete(
        `${process.env.REACT_APP_BASE_URL}/linkrs/delete/${id}`,
        userData?.requestConfig
      )
      .then((res) => {
        setModalConfirmation(false);
        setModalLoading(false);
        window.location.reload();
        alert("Success");
      })
      .catch((error) => {
        console.log(error);
        setModalConfirmation(false);
        setModalLoading(false);
        alert("Error in removal");
      });
  }

  function handleKeyEvent(e) {
    if (e.keyCode === 27) {
      //ESC Key
      setIsTextEditable(false);
    }
    if (e.keyCode === 13) {
      //ENTER Key
      if (editTextInput === text) {
        setIsTextEditable(false);
        return;
      }
      setLoadingEdition(true);
      axios
        .put(
          `${process.env.REACT_APP_BASE_URL}/linkrs/edit/${id}`,
          { updatedText: editTextInput },
          userData.requestConfig
        )
        .then((res) => {
          text = editTextInput;
          setEditAPIAccepted(true);
          setLoadingEdition(false);
          setIsTextEditable(false);
        })
        .catch((err) => {
          alert("Couldn't complete request");
          setLoadingEdition(false);
        });
    }
  }

  useEffect(() => {
    const { current } = inputRef;
    if (isTextEditable) {
      current.focus();
    } else {
      setEditTextInput(editAPIAccepted ? editTextInput : text);
    }
  }, [isTextEditable]);

  return (
    <LinkCardStyle>
      <div>
        <UserPicture userPictureUrl={userPictureUrl} />
        <BoxLikes id={id} likes={likes} />
      </div>
      <div className="link-data">
        {userData?.username === username && (
          <EditionAndDeletion>
            <img
              src={EditIcon}
              alt="edit linkr icon"
              onClick={() => setIsTextEditable(!isTextEditable)}
            />
            <img
              src={RemoveIcon}
              alt="remove linkr icon"
              onClick={(e) => setModalConfirmation(true)}
            />
          </EditionAndDeletion>
        )}
        <Username onClick={() => navigate(`/user/${userId}`)}>{username}</Username>
        {isTextEditable ? (
          <TextEditor
            type="text"
            onKeyDown={handleKeyEvent}
            ref={inputRef}
            disabled={loadingEdition}
            value={editTextInput}
            onChange={(e) => {
              setEditTextInput(e.target.value);
            }}
          />
        ) : (
          <Text>{editTextInput}</Text>
        )}
        <Link href={link} target="blank">
          <LinkTexts>
            <LinkTitle>{linkMetadata?.title}</LinkTitle>
            <LinkDescription>{linkMetadata?.description}</LinkDescription>
            <LinkUrl>{link}</LinkUrl>
          </LinkTexts>
          <LinkImage>
            <img src={linkMetadata?.image} alt="" />
          </LinkImage>
        </Link>
      </div>
      {modalConfirmation && (
        <ModalConfirmationScreen>
          <div className="confirmation-box">
            <h2>Are you sure you want to delete this post?</h2>
            <div className="confirmation-buttons">
              <button
                onClick={(e) => setModalConfirmation(false)}
                className="return-button"
              >
                No, go back
              </button>
              <button onClick={handleCardRemoval} className="delete-button">
                Yes, delete it
              </button>
            </div>
          </div>
          {modalLoading && <p className="loading-p">Loading...</p>}
        </ModalConfirmationScreen>
      )}
    </LinkCardStyle>
  );
}

const LinkCardStyle = styled.div`
  width: 100%;
  background: #171717;
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
  border-radius: 16px;
  padding: 22px;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 18px;
  .link-data {
    position: relative;
    flex-basis: 501px;
  }
`;

const Username = styled.p`
  color: #fff;
  font-size: 19px;
  line-height: 23px;
  font-weight: 400;
`;

const Text = styled.p`
  color: #b7b7b7;
  font-size: 17px;
  line-height: 20px;
  font-weight: 400;
  margin-top: 10px;
  word-break: break-all;
  padding: 5px;
  border-radius: 7px;
`;

const Link = styled.a`
  color: #cecece;
  display: flex;
  align-items: stretch;
  border: 1px solid #4d4d4d;
  border-radius: 11px;
  margin-top: 10px;
  text-decoration: none;
`;

const LinkTexts = styled.div`
  padding: 24px;
`;

const LinkTitle = styled.p`
  font-size: 16px;
  line-height: 19px;
  font-weight: 400;
`;
const LinkDescription = styled.p`
  color: #9b9595;
  font-size: 11px;
  line-height: 13px;
  font-weight: 400;
  margin-top: 10px;
`;
const LinkUrl = styled.p`
  font-size: 11px;
  line-height: 13.2px;
  font-weight: 400;
  margin-top: 10px;
`;
const LinkImage = styled.div`
  flex-basis: 155px;
  height: 100%;
  img {
    height: 100%;
    width: 100%;
    object-fit: cover;
    border-radius: 0 11px 11px 0;
  }
`;
const EditionAndDeletion = styled.div`
  position: absolute;
  display: flex;
  justify-content: space-between;
  align-items: center;
  top: 0;
  right: 0;
  width: 40px;
  height: 20px;
`;

const TextEditor = styled.input`
  width: 100%;
  font-size: 17px;
  line-height: 20px;
  font-weight: 400;
  margin-top: 10px;
  word-break: break-all;
  padding: 5px;
  border-radius: 7px;
  color: #4c4c4c;
  font-family: "Lato", sans-serif;
  border: 0;
  &:focus {
    outline: 0;
  }
`;

const ModalConfirmationScreen = styled.div`
  position: fixed;
  z-index: 3;
  top: 0;
  right: 0;
  width: 100%;
  height: 100vh;
  background-color: rgba(255, 255, 255, 0.9);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  .confirmation-box {
    width: 597px;
    height: 262px;
    background-color: #333333;
    border-radius: 50px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-around;
    h2 {
      width: 340px;
      font-size: 34px;
      font-weight: 700;
      text-align: center;
      font-family: "Lato", sans-serif;
      color: white;
    }
    .confirmation-buttons {
      display: flex;
      width: 60%;
      justify-content: space-around;
      button {
        border-radius: 5px;
        width: 134px;
        height: 37px;
        border: 0;
        font-size: 18px;
        font-weight: 700;
      }
      .return-button {
        background-color: #ffffff;
        color: #1877f2;
      }
      .delete-button {
        background-color: #1877f2;
        color: white;
      }
    }
  }
  .loading-p {
    margin-top: 20px;
    color: black;
    font-family: "Oswald", sans-serif;
    font-size: 28px;
  }
`;
