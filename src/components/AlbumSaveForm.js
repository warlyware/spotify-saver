import React from 'react';

const AlbumSaveForm = ({ saveAlbum, albumId, handleInputChange }) => (
  <div className="input-wrapper">
    <input type="text"
    value={albumId}
    onChange={handleInputChange} />
    <button onClick={saveAlbum}>Save</button>
  </div>
);

export default AlbumSaveForm;