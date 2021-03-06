import React, { useEffect, useState, useCallback } from 'react';
import { useHistory } from 'react-router-dom';
import MapsWithDirections from './MapsWithDirections';
import EmptyMap from './EmptyMap';
import Axios from 'axios';

export default function Home() {
  const [name, setName] = useState('');
  const history = useHistory();
  const [loading, setLoading] = useState(true);
  const [flag, setFlag] = useState(false);
  const [dest, setDest] = useState({
    start: '',
    end: '',
  });
  const [latLong, setLatLong] = useState([]);
  const [latLongI, setLatLongI] = useState([]);
  const [optionStart, setOptionStart] = useState('');
  const [optionEnd, setOptionEnd] = useState('');

  useEffect(() => {
    document.title = 'Directions | Map.io';
    const token = JSON.parse(localStorage.getItem('token'));
    const users = JSON.parse(localStorage.getItem('Users'));

    // console.log(token)
    if (token && users) {
      const currentUser = users.filter((items) => {
        if (items) {
          return items.userName === token.token;
        }
      });
      if (currentUser.length > 0) {
        setName(token.name);
      } else if (currentUser.length < 0) {
        history.push('/');
      }
    } else {
      history.push('/');
    }
    setTimeout(() => {
      setLoading((prev) => (prev = false));
    }, 2000);
  }, [history]);

  //flag change
  const renderMaps = useCallback(
    () => {
      if (flag) {
        let points = [];
        if (latLong.length < 1) {
          // console.log("no lat long")
          if (latLongI.length > 1) {
            // console.log("latlongI avail")
            points = [
              {
                location: flag ? latLongI : '',
              },
              {
                address: flag ? dest.end : '',
              },
            ];
          } else
            points = [
              {
                address: flag ? dest.start : '',
              },
              {
                address: flag ? dest.end : '',
              },
            ];
        } else if (latLong.length > 1) {
          // console.log("latlong avail",flag,latLong)
          if (latLongI.length > 1) {
            // console.log("latlongI avail")
            points = [
              {
                location: flag ? latLongI : '',
              },
              {
                location: flag ? latLong : '',
              },
            ];
          } else
            points = [
              {
                address: flag ? dest.start : '',
              },
              {
                location: flag ? latLong : '',
              },
            ];
          // console.log(points)
        }

        return (
          <MapsWithDirections
            setflag={setFlag}
            dest={points}
            setDestination={setDest}
            setDest={setLatLong}
            source={latLongI}
            setDest2={setLatLongI}
          />
        );
      }

      return <EmptyMap setDest={setLatLong} />;
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [flag, dest]
  );

  const renderRoute = useCallback(() => {
    if (flag) {
      return <div className="show-details" id="itineraryContainer"></div>;
    }

    return <p></p>;
  }, [flag]);

  function handleChange(event) {
    event.persist();

    setFlag(false);
    setOptionStart('');
    setOptionEnd('');
    setDest((prev) => {
      prev[event.target.name] = event.target.value;
      return prev;
    });

    setTimeout(async () => {
      if (
        dest &&
        dest.start &&
        dest.start.length > 0 &&
        event.target.name === 'start'
      ) {
        await Axios.get(
          `${process.env.REACT_APP_BINGMAPS_AUTOSUGGEST_API_1}${dest.start}${process.env.REACT_APP_BINGMAPS_AUTOSUGGEST_API_2}${process.env.REACT_APP_BINGMAPS_KEY}`
        ).then((res) => {
          // console.log(res.data.resourceSets[0].resources[0].value)
          setOptionStart([]);
          if (res && res.data && res.data.resourceSets) {
            setOptionStart(res.data.resourceSets[0].resources[0].value);
          }
        });
      }

      if (dest.end.length > 0 && event.target.name === 'end') {
        await Axios.get(
          `${process.env.REACT_APP_BINGMAPS_AUTOSUGGEST_API_1}${dest.end}${process.env.REACT_APP_BINGMAPS_AUTOSUGGEST_API_2}${process.env.REACT_APP_BINGMAPS_KEY}`
        ).then((res) => {
          // console.log(res.data.resourceSets[0].resources[0].value)
          setOptionEnd([]);
          if (res && res.data && res.data.resourceSets) {
            setOptionEnd(res.data.resourceSets[0].resources[0].value);
          }
        });
      }
    }, 10);
  }

  function setStartDest(event) {
    event.persist();
    // console.log(event.target.innerHTML)
    setDest((prev) => {
      prev.start = event.target.innerHTML;

      return prev;
    });
    setOptionStart('');
  }

  function setEndDest(event) {
    event.persist();
    setDest((prev) => {
      prev.end = event.target.innerHTML;

      return prev;
    });
    setOptionEnd('');
  }

  let optionStartList;
  try {
    let i = 0;
    optionStartList = optionStart.map((items) => {
      i++;

      return (
        <li onClick={setStartDest} key={i}>
          {items.address.formattedAddress}
        </li>
      );
    });
  } catch (err) {
    console.log(err.message);
  }

  let optionEndList;
  try {
    let i = 0;
    optionEndList = optionEnd.map((items) => {
      i++;

      return (
        <li onClick={setEndDest} key={i}>
          {items.address.formattedAddress}
        </li>
      );
    });
  } catch (err) {
    console.log(err.message);
  }

  function searchDirection() {
    setFlag(true);
  }

  function loadData() {
    if (loading) {
      return (
        <div className="loader">
          <div className="cssload-thecube">
            <div className="cssload-cube cssload-c1"></div>
            <div className="cssload-cube cssload-c2"></div>
            <div className="cssload-cube cssload-c4"></div>
            <div className="cssload-cube cssload-c3"></div>
          </div>
        </div>
      );
    }

    return (
      <div className="main-content">
        <div className="left-section">
          <div className="name-section">
            <p>{name}</p>
          </div>
          <div className="search">
            <input
              name="start"
              type="text"
              onChange={handleChange}
              autoComplete="off"
              placeholder="Enter start destination"
              value={dest.start}
            />
            <ul className="search-out-1">{optionStartList}</ul>
            <input
              name="end"
              className="margin"
              onChange={handleChange}
              autoComplete="off"
              type="text"
              placeholder="Enter end destination"
              value={dest.end}
            />
            <button onClick={searchDirection} className="button">
              <i className="fa fa-search" aria-hidden="true"></i>
            </button>
            <ul className="search-out-2">{optionEndList}</ul>
          </div>
          {renderRoute()}
          <div className="logout-section">
            <p
              onClick={() => {
                localStorage.removeItem('token');
                history.push('/');
              }}
            >
              Log out
            </p>
          </div>
        </div>
        {renderMaps()}
      </div>
    );
  }

  return <>{loadData()}</>;
}
