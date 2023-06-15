'use client'
import { MouseEvent, useEffect, useRef, useState } from 'react'
import {
  extractAllTrackImages,
  getRandomCovers,
  extractPlaylistId,
} from '@/utils'
import NextImage from 'next/image'

export function Main() {
  const [allImages, setAllImages] = useState<string[] | null>(null)
  const [loading, setLoading] = useState<boolean>(false)
  const [images, setImages] = useState<string[] | null>(null)
  const [error, setError] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const canvasRef = useRef<HTMLCanvasElement | null>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const context = canvas?.getContext('2d')

    if (context) {
      if (images) {
        //TODO:find a way to implement this in a single loop.
        // images.map((image, i) => {
        //   if (i < 2) {
        //   } else {
        //     console.log(i, i % 2, i % (i + 1 - i));
        //   }
        // });
        // if (images) {
        //   for (let i = 0; i < 4; i++) {
        //     let img: HTMLImageElement | null = null;
        //     for (let j = 0; j < 4; j++) {
        //       if (i < 2) {
        //         img = new Image();
        //         img.onload = function () {
        //           context.drawImage(img, i * 350, j * 350, 350, 350);
        //         };
        //         console.log(`${j * 350}, ${i * 350}`);

        //         img.setAttribute("crossorigin", "anonymous");
        //       }
        //     }

        //     if (img) {
        //       img.src = images[i];
        //     }
        //   }
        // }
        const img1 = new Image()
        const img2 = new Image()
        const img3 = new Image()
        const img4 = new Image()

        img1.onload = function () {
          context.drawImage(img1, 0, 0, 350, 350)
        }
        img1.setAttribute('crossorigin', 'anonymous')
        img1.src = images[0]

        img2.onload = function () {
          context.drawImage(img2, 350, 0, 350, 350)
        }
        img2.setAttribute('crossorigin', 'anonymous')
        img2.src = images[1]

        img3.onload = function () {
          context.drawImage(img3, 0, 350, 350, 350)
        }
        img3.setAttribute('crossorigin', 'anonymous')
        img3.src = images[2]

        img4.onload = function () {
          context.drawImage(img4, 350, 350, 350, 350)
        }
        img4.setAttribute('crossorigin', 'anonymous')
        img4.src = images[3]
      }
    }
  }, [images])

  useEffect(() => {
    if (error) {
      alert(error)
    }
  }, [error])

  const handleClick = async () => {
    let playlistId = null
    try {
      if (!inputRef?.current?.value) {
        throw new Error('Enter something in the input')
      }
      setLoading(true)
      const res = await fetch('/api/token')
      const data: { msg: string; token: string } = await res.json()

      playlistId = extractPlaylistId(inputRef?.current?.value || '') || ''

      const playlist_res = await fetch(
        `https://api.spotify.com/v1/playlists/${playlistId}`,
        {
          headers: {
            Authorization: 'Bearer ' + data.token,
          },
        }
      )
      const playlists = await playlist_res.json()
      const imgs = extractAllTrackImages(playlists) as string[]
      setAllImages(imgs)
      setImages(getRandomCovers(imgs, 4))
    } catch (err) {
      if (err instanceof Error || err instanceof RangeError) {
        setError(err.message)
        return
      }
    }

    setLoading(false)
  }

  const handleDownload = (e: MouseEvent<HTMLAnchorElement>) => {
    const link = e.currentTarget
    link.setAttribute('download', 'album_cover.jpg')
    if (canvasRef.current) {
      let image = canvasRef.current.toDataURL('image/png')
      link.setAttribute('href', image)
    }
  }
  return (
    <main className='flex min-h-screen flex-col items-center justify-evenly p-4 md:p-24'>
      <h1 className='text-3xl font-bold mb-12'>Cover Image Gen</h1>

      <div className='flex items-center'>
        <input
          type='text'
          ref={inputRef}
          placeholder='Enter your playlist id or url'
          className='p-2 text-black mr-2 rounded-lg'
        />
        <button onClick={handleClick} className='btn'>
          Fetch Details
        </button>
      </div>

      <ul className='text-sm'>
        <li>
          Note: Private playlists and Spotify made playlists won&apos;t work
          (like Blend)
        </li>
        <li>Playlist must have more than 4 four unique songs</li>
      </ul>

      <canvas
        className='hidden mt-4 bg-transparent border-2 rounded-md'
        width={700}
        height={700}
        ref={canvasRef}
      ></canvas>

      <div className='mt-4 bg-transparent relative w-[280px] h-[280px] md:w-[700px] md:h-[700px] border-2 rounded-md grid grid-cols-2'>
        {loading && (
          <div className='absolute w-full h-full flex items-center justify-center'>
            {' '}
            Loading{' '}
          </div>
        )}
        {images &&
          images.map((img) => (
            <div className='relative' key={img}>
              <NextImage
                fill
                priority
                src={img}
                alt={img}
                sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
              />
            </div>
          ))}
      </div>

      <button
        onClick={() => {
          setImages(getRandomCovers(allImages, 4))
        }}
        className='btn'
      >
        Randomize Covers
      </button>
      <a href='#' onClick={handleDownload} className='btn'>
        Download Covers
      </a>
    </main>
  )
}
