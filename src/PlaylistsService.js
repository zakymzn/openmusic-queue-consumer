const { Pool } = require("pg");

class PlaylistsService {
  constructor() {
    this._pool = new Pool();
  }

  async getPlaylistWithSongs(playlistId) {
    // const query = {
    //   text: `SELECT playlists.* FROM playlists
    //   LEFT JOIN collaborations ON collaborations.playlist_id = playlists.id
    //   WHERE playlists.id = $1 OR collaborations.playlist_id = $1
    //   GROUP BY playlists.id`,
    //   values: [playlistId],
    // };
    // const result = await this._pool.query(query);

    // return result.rows;
    const playlistQuery = {
      text: "SELECT id, name FROM playlists WHERE id = $1",
      values: [playlistId],
    };
    const playlistResult = await this._pool.query(playlistQuery);

    if (!playlistResult.rows.length) {
      return null;
    }

    const songsQuery = {
      text: `
      SELECT songs.id, songs.title, songs.performer
      FROM songs
      JOIN playlist_songs ON songs.id = playlist_songs.song_id
      WHERE playlist_songs.playlist_id = $1
      `,
      values: [playlistId],
    };
    const songsResult = await this._pool.query(songsQuery);

    return {
      id: playlistResult.rows[0].id,
      name: playlistResult.rows[0].name,
      songs: songsResult.rows,
    };
  }
}

module.exports = PlaylistsService;
