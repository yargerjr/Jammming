import React, { Component } from 'react';
import './App.css';
import SearchBar from '../SearchBar/SearchBar'
import SearchResults from '../SearchResults/SearchResults'
import PlayList from '../PlayList/PlayList'
import Track from '../Track/Track'
import TrackList from '../TrackList/TrackList'
import Spotify from '../../util/Spotify';


class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      searchResults: [{name: '' ,artist: ' ',album: ' ',id: ' '}],
      playlistName: "Jon's playlist",
      playlistTracks: [{name: '', artist: '', album: '', id: ''}]
    };

    this.addTrack = this.addTrack.bind(this);
    this.removeTrack = this.removeTrack.bind(this);
    this.updatePlaylistName = this.updatePlaylistName.bind(this);
    this.savePlaylist = this.savePlaylist.bind(this);
    this.search = this.search.bind(this);
  }

  addTrack(track) {
    let tracks = this.state.playlistTracks;
    if (!tracks.find(trackIndex => trackIndex.id === track.id)) {
      tracks.push(track);
      this.setState({playlistTracks: tracks});
    }
  }

  removeTrack(track) {
   let tracks = this.state.playlistTracks
   let newTracks = tracks.filter(currentTrack => currentTrack.id !== track.id);
   this.setState({playlistTracks: newTracks});
  }

  updatePlaylistName (name) {
    this.setState({playlistName: name});
  }

  savePlaylist() {
    const trackURIs = this.state.playlistTracks.map(playlistTrack => playlistTrack.uri);
    Spotify.savePlaylist(this.state.playlistName,trackURIs).then(results => {
      this.setState({searchResults: [], playlistName: 'New Playlist', playlistTracks: []})
    });
  }


  search(searchTerm) {
    Spotify.search(searchTerm).then(tracks => {
      this.setState({searchResults: tracks})
  });
}

  render() {
    return (
      <div>
        <h1>Ja<span className="highlight">mmm</span>ing</h1>
        <div className="App">
           <SearchBar onSearch={this.search}/>
          <div className="App-playlist">
            <SearchResults onAdd={this.addTrack} searchResults={this.state.searchResults}/>
            <PlayList name={this.state.playlistName} playlistTracks={this.state.playlistTracks} onRemove={this.removeTrack} onNameChange={this.updatePlaylistName} onSave={this.savePlaylist}/>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
