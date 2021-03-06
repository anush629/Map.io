import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import MapsWithDriving from './MapsWithDriving';

export default function MapsDrive() {
  const [name, setName] = useState('');
  const history = useHistory();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    document.title = 'Drive | Map.io';
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
        <div className="left-section small-width">
          <div className="name-section">
            <p>{name}</p>
          </div>
          <div style={{ padding: '15px 3px 3px 3px' }}>
            <p>Now start driving the car like a mad man!!!</p>
          </div>
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
        <MapsWithDriving />
      </div>
    );
  }

  return <>{loadData()}</>;
}
