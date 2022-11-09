import * as React from 'react';

const initialStories = [
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

const useStorageState = (key, initialState) => {
  const [value, setValue] = React.useState(
    localStorage.getItem(key) || initialState
  );

  React.useEffect(() => {
    localStorage.setItem(key, value);
  }, [value, key]);

  return [value, setValue];
};

const App = () => {
  const [searchTerm, setSearchTerm] = useStorageState(
    'search',
    'React'
  );

  const [stories, setStories] = React.useState(initialStories);

  const handleRemoveStory = (item) => {
    const newStories = stories.filter(
      (story) => item.objectID !== story.objectID
    );

    setStories(newStories);
  };

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const searchedStories = stories.filter((story) =>
    story.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <h1>My Hacker Stories</h1>

      <InputWithLabel
        id="search"
        value={searchTerm}
        isFocused
        onInputChange={handleSearch}
      >
        <strong>Search:</strong>
      </InputWithLabel>

      <hr />

      <List list={searchedStories} onRemoveItem={handleRemoveStory} />
    </div>
  );
};

const InputWithLabel = ({
  id,
  value,
  type = 'text',
  onInputChange,
  isFocused,
  children,
}) => {
  const inputRef = React.useRef();

  React.useEffect(() => {
    if (isFocused && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isFocused]);

  return (
    <>
      <label htmlFor={id}>{children}</label>
      &nbsp;
      <input
        ref={inputRef}
        id={id}
        type={type}
        value={value}
        onChange={onInputChange}
      />
    </>
  );
};

const List = ({ list, onRemoveItem }) => (
  <ul>
    {list.map((item) => (
      <Item
        key={item.objectID}
        item={item}
        onRemoveItem={onRemoveItem}
      />
    ))}
  </ul>
);

const Item = ({ item, onRemoveItem }) => (
  <li>
    <span>
      <a href={item.url}>{item.title}</a>
    </span>
    <span>{item.author}</span>
    <span>{item.num_comments}</span>
    <span>{item.points}</span>
    <span>
      <button type="button" onClick={() => onRemoveItem(item)}>
        Dismiss
      </button>
    </span>
  </li>
);

export default App;


// // import './App.css';

// import { useEffect } from "react";
// import { useState } from "react";

// //THIS KEEPS GETTING CALLED WHEN REACT RENDERS - ALWAYS PASSING THE 
// //INITIAL KEY AND THE INITIAL STATE
// const useStorageState = (key, initialState) => {
//   const [value, setValue] = useState(localStorage.getItem(key) || initialState);
//   useEffect(() => {
//     localStorage.setItem(key, value) //THIS RECEIVES THE KEY AND UPDATES SEARCH CRITERIA
//   }, [key,value])

//   return [value, setValue];
// }

// const initialStories = [
//   {
//     title: 'React',
//     url: 'https://reactjs.org/',
//     author: 'Jordan Walke',
//     num_comments: 3,
//     points: 4,
//     objectID: 0,
//   },
//   {
//     title: 'Redux',
//     url: 'https://redux.js.org/',
//     author: 'Dan Abramov, Andrew Clark',
//     num_comments: 2,
//     points: 5,
//     objectID: 1,
//   },
// ];  

// const App = () => {



//   const [searchTerm, setSearchTerm] = useStorageState('search', 'React');
//   const [stories, setStories] = useStorageState(initialStories);


//   const handleSearch = (event) => {
//     setSearchTerm(event.target.value);
//   }

//   const searchedStories = stories.filter(story => story.title.toLowerCase().includes(searchTerm.toLowerCase()));


//   return (
//     <div>
//       <h1>My Hacker Stories</h1>
//       <InputWithLabel isFocused id="search" value={searchTerm} onInputChange={handleSearch}><strong>Search:</strong></InputWithLabel>
//       <br/>
//       <List list={searchedStories}/>
//     </div>
//   );
// }

// const InputWithLabel = ({ id, value, type ='text', onInputChange, isFocused, children }) => (
//   <>
//     <label htmlFor={id}>{ children }</label>&nbsp;
//     <input autoFocus={isFocused} id={id} type={type} value={value} onChange={onInputChange}/>
//   </>
// );

// const List = ({ list }) => (
//   <ul>
//     {list.map((item) => (
//       <Item key={item.objectID} item={item}/>
//     ))}
//   </ul>
// );

// const Item = ({ item }) => (
//   <li>
//     <span>
//       <a href={item.url}>{item.title}</a>
//     </span>
//     <span>{item.author}</span>
//     <span>{item.num_comments}</span>
//     <span>{item.points}</span>
//   </li>
// )


// export default App;
