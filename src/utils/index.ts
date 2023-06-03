import { Playlist, PlaylistTrack } from "spotify-types";

export const extractAllTrackImages = (playlist: any | null) => {
  if(playlist)  
    return [...new Set(playlist.tracks.items.map((t: { track: { album: { images: { url: any; }[]; }; }; }) => t.track.album.images[0].url))]
  else return null;
}
