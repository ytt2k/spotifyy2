import React, { useState } from "react";
import { SpotifyAuth, Scopes } from "react-spotify-auth";
import Cookies from "js-cookie";
import {
  SpotifyApiContext,
  SpotifyApiAxiosContext,
  UserTop,
  User,
  UserPlaylists
} from "react-spotify-api";
import axios from "../axios";
import { MdLibraryMusic } from "react-icons/md";

const Title = () => {
  return (
    <h1>
      <a id="title" href="https://spotifyy2.netlify.app/">
        My Spotify info app
      </a>
    </h1>
  );
};

const Button = ({ onClick, text }) => <button onClick={onClick}>{text}</button>;

const LogOutButton = () => {
  return <button>Logout</button>;
};

const Description = () => {
  return (
    <div>
      <h3>
        <MdLibraryMusic style={{ fontSize: 30 }} /> Get a list of your:
      </h3>
      <ul>
        <li>Top 10 tracks</li>
        <li>Top 10 artists</li>
        <li>Playlists</li>
      </ul>
    </div>
  );
};

const handleLogOut = (e) => {
  e.preventDefault();
  Cookies.remove("spotifyAuthToken");
};

const App = () => {
  const token = Cookies.get("spotifyAuthToken");
  const [showTopTracks, setShowTopTracks] = useState(false);
  const [showTopArtists, setShowTopArtists] = useState(false);
  const [showPlaylists, setShowPlaylists] = useState(false);

  const showTopTracksHandler = () => {
    setShowTopTracks((prev) => !prev);
  };

  const showTopArtistsHandler = () => {
    setShowTopArtists((prev) => !prev);
  };

  const showPlaylistsHandler = () => {
    setShowPlaylists((prev) => !prev);
  };

  return (
    <div className="container">
      <Title />
      <LogOutButton onClick={handleLogOut} />
      {token ? (
        <SpotifyApiAxiosContext.Provider value={axios}>
          <SpotifyApiContext.Provider value={token}>
            <User>
              {({ data, loading, error }) =>
                data ? (
                  <div>
                    <div className="userInfo">
                      <img
                        className="profileImg"
                        src={data.images[0].url}
                        alt="profileImage"
                      />
                      <h3>
                        Name: <p>{data.display_name}</p>
                      </h3>
                      <h3>
                        Country: <p>{data.country}</p>
                      </h3>
                      <h3>
                        Subscription level: <p>{data.product}</p>
                      </h3>
                      <LogOutButton onClick={handleLogOut} />
                    </div>
                  </div>
                ) : null
              }
            </User>
            <Button
              onClick={showTopTracksHandler}
              text="Show my top 10 tracks"
            />
            {showTopTracks ? (
              <UserTop type="tracks" options={{ limit: 10 }}>
                {({ data, loading, error }) =>
                  data ? (
                    <div>
                      <ul>
                        {data.items.map((item) => {
                          return (
                            <div className="tracks" key={item.id}>
                              <div className="track">
                                <img
                                  className="trackImg"
                                  src={item.album.images[0].url}
                                  alt="trackImage"
                                />
                                <li>
                                  <h3>{item.name}</h3>
                                </li>
                                <p>{item.artists[0].name}</p>
                                <a
                                  href={item.external_urls.spotify}
                                  target="_blank"
                                  rel="noreferrer"
                                >
                                  Open is spotify
                                </a>
                              </div>
                            </div>
                          );
                        })}
                      </ul>
                    </div>
                  ) : null
                }
              </UserTop>
            ) : null}
            <Button
              onClick={showTopArtistsHandler}
              text="Show my top 10 artists"
            />
            {showTopArtists ? (
              <UserTop
                type="artists"
                options={{ limit: 10, time_range: "short_term" }}
              >
                {({ data, loading, error }) =>
                  data ? (
                    <div>
                      <ul>
                        {data.items.map((item) => {
                          return (
                            <div className="artists" key={item.id}>
                              <div className="artist">
                                <img
                                  className="artistImg"
                                  src={item.images[0].url}
                                  alt="artistImage"
                                />
                                <li>
                                  <h3>{item.name}</h3>
                                  <a
                                    href={item.external_urls.spotify}
                                    target="_blank"
                                    rel="noreferrer"
                                  >
                                    Open in spotify
                                  </a>
                                </li>
                              </div>
                            </div>
                          );
                        })}
                      </ul>
                    </div>
                  ) : null
                }
              </UserTop>
            ) : null}
            <Button onClick={showPlaylistsHandler} text="Show my playlists" />
            {showPlaylists ? (
              <UserPlaylists>
                {({ data, loading, error }) =>
                  data ? (
                    <div>
                      <ul>
                        {data.items.map((item) => {
                          return (
                            <div className="playlists" key={item.id}>
                              <div className="playlist">
                                <li>
                                  {item.name}
                                  <p>{item.tracks.total} tracks</p>
                                  <a
                                    href={item.external_urls.spotify}
                                    target="_blank"
                                    rel="noreferrer"
                                  >
                                    open in spotify
                                  </a>
                                </li>
                              </div>
                            </div>
                          );
                        })}
                      </ul>
                    </div>
                  ) : null
                }
              </UserPlaylists>
            ) : null}
          </SpotifyApiContext.Provider>
        </SpotifyApiAxiosContext.Provider>
      ) : (
        <div>
          <Description />
          <SpotifyAuth
            redirectUri="http://spotifyy2.netlify.app/"
            noLogo={true}
            clientID={process.env.REACT_APP_CLIENT_ID}
            scopes={[
              Scopes.userReadPrivate,
              "user-read-email",
              "user-read-recently-played",
              "user-top-read",
              "playlist-read-private"
            ]}
          />
        </div>
      )}
    </div>
  );
};

export default App;
