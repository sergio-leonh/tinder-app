import React, { useState, useMemo, useEffect } from "react";
import TinderCard from 'react-tinder-card';
import axios from "axios";

import NavBar from './NabBar';
import AppConstants from "../constants/app.constants";
import api from '../services/api';

const images = [62, 83, 466, 965, 982, 1043, 738].map((n) => {return {id: n, name: n, url: `https://picsum.photos/id/${n}/900/500`}});

const alreadyRemoved = []
let charactersState = images;

const Home = () => {

  const onSwipe = (direction) => {
    console.log('You swiped: ' + direction)
  }
  
  const onCardLeftScreen = (myIdentifier) => {
    console.log(myIdentifier + ' left the screen')
  }

  const cards = [
		{
			image: 'https://img.icons8.com/color/452/GeeksforGeeks.png',
			color: '#55ccff'
		},
		{
			image: 'https://img.icons8.com/color/452/GeeksforGeeks.png',
			color: '#e8e8e8'
		},
		{
			image: 'https://img.icons8.com/color/452/GeeksforGeeks.png',
			color: '#0a043c'
		},
		{
			image: 'https://img.icons8.com/color/452/GeeksforGeeks.png',
			color: 'black'
		}
	];

  const [characters, setCharacters] = useState(images)
  const [lastDirection, setLastDirection] = useState()

  const childRefs = useMemo(() => Array(images.length).fill(0).map(i => React.createRef()), [])

  const swiped = (direction, nameToDelete) => {
    console.log('removing: ' + direction + ' -------- ' + nameToDelete)
    
    let formData = {identifier: nameToDelete, url: direction};
    return api.post(`${AppConstants().apiHost}/tinderAction`, formData);

    setLastDirection(direction)
    alreadyRemoved.push(nameToDelete)
  }

  const outOfFrame = (name) => {
    console.log(name + ' left the screen! 11111111111111111111')
    charactersState = charactersState.filter(character => character.name !== name)
    setCharacters(charactersState)
  }

  const swipe = (dir) => {
    const cardsLeft = characters.filter(person => !alreadyRemoved.includes(person.name))
    if (cardsLeft.length) {
      const toBeRemoved = cardsLeft[cardsLeft.length - 1].name // Find the card object to be removed
      const index = images.map(person => person.name).indexOf(toBeRemoved) // Find the index of which to make the reference to
      alreadyRemoved.push(toBeRemoved) // Make sure the next card gets removed next time if this card do not have time to exit the screen
      childRefs[index].current.swipe(dir) // Swipe the card!
    }
  }

  return (
    <div className="container">
      <NavBar />
      <header className="jumbotron">
        <h3>HOME</h3>
      </header>
      <div className='cardContainer'>
        {characters.map((character, index) =>
          <TinderCard ref={childRefs[index]} 
                      className='swipe' 
                      key={character.name} 
                      onSwipe={(dir) => swiped(dir, character.name)} 
                      onCardLeftScreen={() => outOfFrame(character.name)}
          >
            <div style={{ backgroundImage: 'url(' + character.url + ')' }} className='card'>
              <h3>{character.name}</h3>
            </div>
          </TinderCard>
        )}
      </div>
      <div className='buttons'>
        <button onClick={() => swipe('left')}>Swipe left!</button>
        <button onClick={() => swipe('right')}>Swipe right!</button>
      </div>
    </div>
  );
};

export default Home;