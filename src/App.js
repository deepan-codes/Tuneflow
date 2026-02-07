import { useState } from "react";
import { useEffect } from "react";
import logo from "./logo.png";
import { useRef } from "react";

import "./index.css";
export default function App() {
  const [search, setSearch] = useState("");
  const [data, setdata] = useState([]);
  const [id, setid] = useState(null);
  const [progress, setprogress] = useState(0);
  const [time, settime] = useState(0);
  const [play, setplay] = useState(true);
  useEffect(() => {
    async function serachdata() {
      const res = await fetch(
        `https://itunes.apple.com/search?term=${search}&media=music&limit=20`,
      );
      const datacon = await res.json();
      const dat = await datacon.results;
      setdata(dat);
    }
    serachdata();
  }, [search]);
  ///////////////////////////////////////////////
  const audioref = useRef(null);

  function handlePlaySong(item) {
    setid(item);
    if (audioref.current) {
      audioref.current.pause();
      audioref.current.currentTime = 0;
    }

    const audioNew = new Audio(item.previewUrl);
    audioref.current = audioNew;
    audioNew.ontimeupdate = () => {
      settime(audioNew.currentTime);
      const percentage = (audioNew.currentTime / audioNew.duration) * 100;

      setprogress(percentage || 0);
    };
    audioNew.play().catch(() => console.log("error"));
    setplay(true);
  }
  function handlesearchbtn() {}
  function handleSearch(e) {
    setSearch(e);
  }
  function handleplay() {
    setplay((e) => !e);
    play ? audioref.current.pause() : audioref.current.play();
  }
  function handleprevious(item) {
    // audioref.current.currentTime = 0;
    // audioref.current.play();
    data.map((i, j) =>
      i.collectionId === item.collectionId
        ? j > 0 && handlePlaySong(data[j - 1])
        : i,
    );
  }
  function handleforward(item) {
    data.map((i, j) =>
      i.collectionId === item.collectionId
        ? j < data.length - 1 && handlePlaySong(data[j + 1])
        : i,
    );
  }
  return (
    <>
      <div className="mobile-warning">
        🚧 Mobile version is under development.
        <br />
        Please open TuneFlow on a laptop or desktop 💻
      </div>
      <div className="container">
        <Search handleSearch={handleSearch} handlesearchbtn={handlesearchbtn} />
        <List data={data} handlePlaySong={handlePlaySong} />
        <div className="detail-con">
          {id ? (
            <Detail
              item={id}
              progress={progress}
              time={time}
              handleplay={handleplay}
              play={play}
              handleprevious={handleprevious}
              handleforward={handleforward}
            />
          ) : (
            <p className="par">Select a song to play</p>
          )}
        </div>
      </div>
    </>
  );
}
////////////////////////////////////////////////////
function Search({ handleSearch, handlesearchbtn }) {
  return (
    <div className="searchbox">
      <img className="logo" src={logo} alt="logo" />
      <span className="tunes">TuneFlow</span>
      <input
        type="text"
        placeholder="Serch by song name or artist"
        onChange={(e) => handleSearch(e.target.value)}
        className="search"
      ></input>
      {/* <button onClick={handlesearchbtn}>Search</button> */}
    </div>
  );
}
function List({ data, handlePlaySong }) {
  return (
    <ul className="list">
      <Listitem data={data} handlePlaySong={handlePlaySong} />
    </ul>
  );
}
function Listitem({ data, handlePlaySong }) {
  return (
    <li className="itemlist">
      {data.map((item) => {
        return (
          <div
            onClick={() => handlePlaySong(item)}
            className="singleitem"
            key={item.trackId}
          >
            <div>
              <img src={item.artworkUrl100} alt="songimg"></img>
            </div>
            <div>
              <p className="songname">{item.collectionName}</p>
              <p className="artistname">{item.artistName}</p>
            </div>
          </div>
        );
      })}
    </li>
  );
  // console.log(data);
}
function Detail({
  item,
  progress,
  time,
  handleplay,
  play,
  handleprevious,
  handleforward,
}) {
  function format(time) {
    return Math.floor(time) < 10 ? "0" + Math.floor(time) : Math.floor(time);
  }

  return (
    <div>
      <div>
        <img
          src={item.artworkUrl100.replace("100x100", "300x300")}
          alt="song-img"
        ></img>
      </div>
      <div>
        <p className="namedetail">{item.collectionName}</p>
        <p className="namedetail">{item.artistName}</p>
        <input
          type="range"
          min={0}
          max={100}
          value={progress}
          readOnly
          className="progress"
        />
        <span className="time">{`${format(time)}/30`}</span>
      </div>
      <div className="playctr">
        <button className=" handle" onClick={() => handleprevious(item)}>
          ⏮
        </button>
        <button onClick={handleplay} className="handle">
          {play && progress !== 100 ? "⏸" : "▶"}
        </button>
        <button className="handle" onClick={() => handleforward(item)}>
          ⏭
        </button>
      </div>
    </div>
  );
}
