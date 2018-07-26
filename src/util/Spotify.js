let accessToken = '';
const url = 'https://accounts.spotify.com/authorize';
const clientId = '89499d93c3cb47a49ed1551b0f82f3a0'
const redirectUrl = 'http://localhost:3000/'

const Spotify = {

  getAccessToken() {
    if (accessToken) {
      return accessToken
    }
      const accessTokenMatch = window.location.href.match(/access_token=([^&]*)/);
      const expiresInMatch = window.location.href.match(/expires_in=([^&]*)/);

      if (accessTokenMatch && expiresInMatch) {
       accessToken = accessTokenMatch[1];
       const expirationTime = Number(expiresInMatch[1]);
       window.setTimeout(() => accessToken = '', expirationTime * 1000);
       window.history.pushState('Access Token', null, '/');
      }
      else {
        const accessUrl = `https://accounts.spotify.com/authorize?client_id=${clientId}&response_type=token&scope=playlist-modify-public&redirect_uri=${redirectUrl}`
        window.location = accessUrl;
      }
    },

    savePlaylist(name,trackURIs) {
      let accessToken = Spotify.getAccessToken();
      let headers = {
        Authorization: `Bearer ${accessToken}`
      };
      let userId;

      return fetch('https://api.spotify.com/v1/me', {headers: headers}).then(response => {
        if (response.ok) {
          return response.json();
        }
        throw new Error('Request Failed!');
      }, networkError => console.log(networkError.message)
    ).then(jsonResponse => {
      userId = jsonResponse.id;
      return fetch(`https://api.spotify.com/v1/users/${userId}/playlists`,{
        headers: headers,
        method: 'POST',
        body: JSON.stringify({name: name})
       }).then(response => response.json()).then(jsonResponse => {
         const playlistId = jsonResponse.id;
         return fetch(`https://api.spotify.com/v1/users/${userId}/playlists/${playlistId}/tracks`,{
           headers: headers,
           method: 'POST',
           body: JSON.stringify({uris: trackURIs})
         })
       })
     })
   },

  search(term) {
    const accessToken = Spotify.getAccessToken();
    return fetch(`https://api.spotify.com/v1/search?type=track&q=${term}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    }).then(response => {
      return response.json();
    }).then(jsonResponse => {
      if (!jsonResponse.tracks) {
        return [];
      }
      return jsonResponse.tracks.items.map(track => ({
          id: track.id,
          name: track.name,
          artist: track.artists[0].name,
          album: track.album.name,
          uri: track.uri
        }));
      });
    }
};

export default Spotify;
