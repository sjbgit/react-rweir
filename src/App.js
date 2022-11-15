import { useState, useEffect, useRef, useReducer  } from "react";

const API_ENDPOINT = 'https://hn.algolia.com/api/v1/search?query=';

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

const getAsyncStories = () =>
  new Promise((resolve, reject) => {
    //setTimeout(reject, 2000);
    setTimeout(
      () => resolve({ data: { stories: initialStories } }),
      2000
    )
    //resolve({ data: { stories: initialStories } })
  });

const storiesReducer = (state, action) => {
  switch (action.type) {
    case 'STORIES_FETCH_INIT':
      return {
        ...state,
        isLoading: true,
        isError: false,
      };
    case 'STORIES_FETCH_SUCCESS':
      return {
        ...state,
        isLoading: false,
        isError: false,
        data: action.payload,
      };
    case 'STORIES_FETCH_FAILURE':
      return {
        ...state,
        isLoading: false,
        isError: true,
      };
    case 'REMOVE_STORY':
      return {
        ...state,
        data: state.data.filter(
          (story) => action.payload.objectID !== story.objectID
        ),
      };
    default:
      throw new Error();
  }
  // if (action.type === 'SET_STORIES') {
  //   return action.payload
  // }
  // else if (action.type === 'REMOVE_STORY') {
  //   return state.filter((story) => action.payload.objectID !== story.objectID);
  // }
  // else {
  //   throw new Error(); 
  // }
}

const useStorageState = (key, initialState) => {
  const [value, setValue] = useState(
    localStorage.getItem(key) || initialState
  );

  useEffect(() => {
    localStorage.setItem(key, value);
  }, [value, key]);

  return [value, setValue];
};

const App = () => {

  useEffect(() => {
    //setIsLoading(true)
    dispatchStories({ type: 'STORIES_FETCH_INIT' });
    fetch(`${API_ENDPOINT}react`)
    .then((response) => response.json())
    .then((result) => 
    { 
      console.log(result);
        dispatchStories({
        type: 'STORIES_FETCH_SUCCESS',
        payload: result.hits,
      });
    })
    .catch(() =>{ dispatchStories({ type: 'STORIES_FETCH_FAILURE' })  })

    // getAsyncStories().then(result => {
    //   //setStories(result.data.stories)
    //   //dispatchStories({ type: 'SET_STORIES', payload: result.data.stories})
    //   dispatchStories({
    //     type: 'STORIES_FETCH_SUCCESS',
    //     payload: result.data.stories,
    //   });
    //   //setIsLoading(false)
    // }).catch(() =>{ dispatchStories({ type: 'STORIES_FETCH_FAILURE' })  }) //setIsError(true));
  }, []);

  const [searchTerm, setSearchTerm] = useStorageState(
    'search',
    'React'
  );

  //const [isLoading, setIsLoading] = useState(false);
  const [stories, dispatchStories] = useReducer(storiesReducer, { data: [], isLoading: false, isError: false } );
  //const [isError, setIsError] = useState(false);

  const handleRemoveStory = (item) => {
    dispatchStories({ type: 'REMOVE_STORY', payload: item})
    // const newStories = stories.filter(
    //   (story) => item.objectID !== story.objectID
    // );
    // dispatchStories({ type: 'SET_STORIES', newStories})
    // //setStories(newStories);
  };

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const searchedStories = stories.data.filter((story) =>
  {
    return story.title.toLowerCase().includes(searchTerm.toLowerCase());
  });

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
      {stories.isError && <p>Something went wrong ...</p>}
 
      {stories.isLoading ? (
        <p>Loading ...</p>
      ) : (
        <List
          list={searchedStories}
          onRemoveItem={handleRemoveStory}
        />
      )}
    </div>
  );
}

const InputWithLabel = ({
  id,
  value,
  type = 'text',
  onInputChange,
  isFocused,
  children,
}) => {
  const inputRef = useRef();

  useEffect(() => {
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

export default App


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
