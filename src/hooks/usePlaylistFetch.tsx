import useSWR from "swr";

export function usePlaylistFetch(playlistId: string, token: string) {
  const fetcher = (url: string, token: string) => fetch(url, { headers: { 'Authorization': 'Bearer ' + token } }).then(res => res.json());
  const { data, error } = useSWR([`https://api.spotify.com/v1/playlists/${playlistId}`, token], fetcher);

  return { data, error };
}
