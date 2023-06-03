"use client";

import { extractAllTrackImages } from '@/utils';
import { useEffect, useMemo, useRef, useState } from 'react'
import { Playlist } from 'spotify-types';

export type SpotifyTokenObject = {
  access_token: string,
  token_type: string,
  expires: number;

}


//1TfSVpFlloA7rWjaM4rA8G
//5czk7ME0ESx9w6VolKSMje
//1sdzZxhPqiwES67lJUZHRu
export function Main({ token }: { token: string }) {
  const PLAYLIST_ID_LEN = 22;
  // const [playlistId, setPlaylistId] = useState("");
  const [playlistDetails, setPlaylistDetails] = useState<Playlist | null>(null);
  const [allImages, setAllImages] = useState<string[] | null>(null);
  const [images, setImages] = useState<string[] | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);


  useEffect(() => {
    fetch('/api/token').then(res => res.json()).then(d => console.log(d))
  }, [])

  // useEffect(() => {
  //   const imgs = extractAllTrackImages(playlistDetails);
  //   setAllImages(imgs);
  //   setImages(getRandomCovers(allImages, 4));
  // }, [playlistDetails]);


  const extractPlaylistId = (link: string) => {
    if (link.length == PLAYLIST_ID_LEN && link.match(/^[0-9A-Za-z_-]{22}$/)) {
      return link
    }

    if (link.includes("https://open.spotify.com/")) {
      const s = link.split("/");
      const lastpart = (s[s.length - 1]);
      if (lastpart.match(/\?/)) {
        return lastpart.split("?")[0]
      }
      else { return lastpart }

    }
  }


  const handleClick = () => {
    // setPlaylistId(extractPlaylistId(inputRef?.current?.value || "") || "")
    let playlistId = (extractPlaylistId(inputRef?.current?.value || "") || "")

    fetch(`https://api.spotify.com/v1/playlists/${playlistId}`, {
      headers: {
        Authorization: 'Bearer ' + token,
      }
    }).then(res => res.json()).then(data => {

      const imgs = extractAllTrackImages(data);
      setAllImages(imgs);
      setImages(getRandomCovers(imgs, 4));

    });



  }

  const getRandomCovers = (images: any[] | null, n: number) => {
    //https://stackoverflow.com/questions/19269545/how-to-get-a-number-of-random-elements-from-an-array
    if (images) {
      let result = new Array(n),
        len = images.length,
        taken = new Array(len);
      if (n > len)
        throw new RangeError("getRandom: more elements taken than available");
      while (n--) {
        var x = Math.floor(Math.random() * len);
        result[n] = images[x in taken ? taken[x] : x];

        taken[x] = --len in taken ? taken[len] : len;
      }
      return result;
    } else return null;
  }



  const handleCaptureClick = () => { }
  return (
    <main className="flex  flex-col items-center justify-evenly p-24">
      <h1 className="text-3xl font-bold mb-12">Cover Image Gen
      </h1>

      <input type="text" ref={inputRef} placeholder='Enter your playlist id or url' className="p-2 text-black" />

      <button onClick={handleClick} className='p-2 rounded-full bg-purple-700 text-white text-sm font-bold my-4'>Fetch Details</button>
      <button onClick={() => { setImages(getRandomCovers(allImages, 4)) }} className='p-2 rounded-full bg-purple-700 text-white text-sm font-bold my-4'>Randomize Covers</button>
      <button onClick={handleCaptureClick} className='p-2 rounded-full bg-purple-700 text-white text-sm font-bold my-4'>Download Covers</button>


      {/* {playlistDetails && <div> */}
      {/*   <p>Playlist name: {playlistDetails.name}</p> */}
      {/*   <p>Description: {playlistDetails.description}</p> */}
      {/**/}
      {/*   <p>Created by: {playlistDetails.owner?.display_name}</p> */}
      {/**/}
      {/*   <p>Current Image: </p> */}
      {/*   <img src={playlistDetails.images[0].url} alt="current_image" /> */}
      {/* </div> */}
      {/* } */}

      <div id='cover' className="grid grid-cols-2">
        {images && (images.map((image, i) => {
          return (
            <img src={image} width="350px" key={i} />

          )

        }))

        }
      </div>

    </main>


  )
}
