import { Main } from './components/Main';
import { cookies } from 'next/headers';


async function getSpotifyToken() {
  // const clientID = process.env.SPOTIFY_CLIENT_ID || "";
  // const clientSecret = process.env.SPOTIFY_CLIENT_SECRET || "";
  // const res = await fetch('https://accounts.spotify.com/api/token', {
  //   method: "POST",
  //   headers: {
  //     "Content-Type": "application/x-www-form-urlencoded"
  //   },
  //   body: new URLSearchParams({
  //     grant_type: "client_credentials",
  //     client_id: clientID,
  //     client_secret: clientSecret,
  //   })
  // })
  //
  // return res.json();



}


export default async function Home() {
  const cookieStore = cookies();
  const token = cookieStore.get('access_token');
  return <Main token={token?.value || ""} />
}
