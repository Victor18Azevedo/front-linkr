import styled from "styled-components";
import axios from "axios";

import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function Trending(props) {
  //requisição backend
  const [trending, setTrending] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    axios
      .get(`${process.env.REACT_APP_BASE_URL}/hashtag`)
      .then((res) => {
        setTrending(res.data);
        setIsLoading(false);
      })
      .catch((err) => {
        // alert("An error occurred while trying to fetch the posts, please refresh the page");
        setIsLoading(false);
      });
  }, []);

  return (
    <>
      <TrendingContainer>
        <TrendingTitle>trending</TrendingTitle>
        <TrendingLine></TrendingLine>
        {trending.map((hashtag) => (
          <Link to={`/hashtag/${hashtag.hashtag}`} key={hashtag.id}>
            <TrendingHashtags>#{hashtag.hashtag}</TrendingHashtags>
          </Link>
        ))}
      </TrendingContainer>
    </>
  );
}

const TrendingContainer = styled.div`
  height: 406px;
  width: 301px;
  left: 877px;
  top: 232px;
  border-radius: 16px;
  background: #171717;
`;
const TrendingTitle = styled.h1`
  font-family: Oswald;
  font-size: 27px;
  font-weight: 700;
  line-height: 40px;
  letter-spacing: 0em;
  text-align: left;
  color: #ffffff;
  margin-left: 16px;
`;
const TrendingLine = styled.div`
  width: 301px;
  height: 1px;
  left: 877px;
  top: 232px;
  border: 1px solid #484848;
  margin-top: 10px;
  margin-bottom: 22px;
`;
const TrendingHashtags = styled.div`
  text-decoration: none;
  font-family: Lato;
  font-size: 19px;
  font-weight: 700;
  line-height: 23px;
  letter-spacing: 0.05em;
  text-align: left;
  color: #ffffff;
  margin-left: 16px;
`;
