const PLAYLIST_ID_LEN = 22;

export const extractAllTrackImages = (playlist: any | null) => {
  if (playlist)
    return [
      ...new Set( // Using Set to remove duplicate tracks
        playlist.tracks.items.map(
          (t: { track: { album: { images: { url: any }[] } } }) =>
            t.track.album.images[0].url
        )
      ),
    ];
  else return null;
};

// IDK how this works, but it works ig
export const getRandomCovers = (images: string[] | null, n: number) => {
  //https://stackoverflow.com/questions/19269545/how-to-get-a-number-of-random-elements-from-an-array
  if (images) {
    let result = new Array(n),
      len = images.length,
      taken = new Array(len);
    if (n > len) {
      throw new RangeError("Playlist has less than 4 unique songs");
    }
    while (n--) {
      var x = Math.floor(Math.random() * len);
      result[n] = images[x in taken ? taken[x] : x];

      taken[x] = --len in taken ? taken[len] : len;
    }
    return result;
  } else return null;
};

// getting the playlist id checking for a base62 encoded string
export const extractPlaylistId = (link: string) => {
  if (link.length == PLAYLIST_ID_LEN && link.match(/^[0-9A-Za-z_-]{22}$/)) {
    return link;
  }

  if (link.includes("https://open.spotify.com/playlist")) {
    const s = link.split("/");
    const lastpart = s[s.length - 1];
    if (lastpart.match(/\?/)) {
      return lastpart.split("?")[0];
    } else {
      return lastpart;
    }
  } else {
    throw new Error("Not a valid URL");
  }
};
