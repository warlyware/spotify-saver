import React from 'react';

const AlbumList = ({ albums }) => (
  <ul>
    {albums ? albums.map((album) => {
      const albumUrl = `https://open.spotify.com/album/${album.albumId}`;
      const artist = album.albumInfo ? album.albumInfo.artists[0].name : null;
      const name = album.albumInfo ? album.albumInfo.name : album.albumId;
      return (
        <li key={album._id}>
          <a target="_blank" href={albumUrl}>{artist} - {name}</a>
        </li>
      );
    }): null}
  </ul>
);

export default AlbumList;