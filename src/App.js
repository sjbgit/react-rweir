// import './App.css';

import { useEffect } from "react";
import { useState } from "react";

//THIS KEEPS GETTING CALLED WHEN REACT RENDERS - ALWAYS PASSING THE 
//INITIAL KEY AND THE INITIAL STATE
const useStorageState = (key, initialState) => {
  const [value, setValue] = useState(localStorage.getItem(key) || initialState);
  useEffect(() => {
    localStorage.setItem(key, value) //THIS RECEIVES THE KEY AND UPDATES SEARCH CRITERIA
  }, [key,value])

  return [value, setValue];
}
const App = () => {

  const stories = [
    {
      title: 'React',
      url: 'https://reactjs.org/',
      author: 'Jordan Walke',
      num_comments: 3,
      points: 4,
      objectID: 0,
    },
    {
      title: 'Redux',
      url: 'https://redux.js.org/',
      author: 'Dan Abramov, Andrew Clark',
      num_comments: 2,
      points: 5,
      objectID: 1,
    },
  ];

  const [searchTerm, setSearchTerm] = useStorageState('search', 'React');

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  }

  const searchedStories = stories.filter(story => story.title.toLowerCase().includes(searchTerm.toLowerCase()));


  return (
    <div>
      <h1>My Hacker Stories</h1>
      <InputWithLabel isFocused id="search" value={searchTerm} onInputChange={handleSearch}><strong>Search:</strong></InputWithLabel>
      <br/>
      <List list={searchedStories}/>
    </div>
  );
}

const InputWithLabel = ({ id, value, type ='text', onInputChange, isFocused, children }) => (
  <>
    <label htmlFor={id}>{ children }</label>&nbsp;
    <input autoFocus={isFocused} id={id} type={type} value={value} onChange={onInputChange}/>
  </>
);

const List = ({ list }) => (
  <ul>
    {list.map((item) => (
      <Item key={item.objectID} item={item}/>
    ))}
  </ul>
);

const Item = ({ item }) => (
  <li>
    <span>
      <a href={item.url}>{item.title}</a>
    </span>
    <span>{item.author}</span>
    <span>{item.num_comments}</span>
    <span>{item.points}</span>
  </li>
)


export default App;
