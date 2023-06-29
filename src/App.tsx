import { useRef, useState, Children } from 'react';
import Introductuion from './components/Introduction';
import MovieTable from './components/MovieTable';
import ReviewForm from './components/ReviewForm';
import { MovieObject } from './types';

export const App = () => {
  const [selectedMovie, setSelectedMovie] = useState<MovieObject | any>({});
  return (
    <div>
      <Introductuion />
      <MovieTable
        setSelectedMovie={setSelectedMovie}
        selectedMovie={selectedMovie}
      />
      {Object.keys(selectedMovie).length === 0 ? (
        <span>Select a movie to write a review...</span>
      ) : (
        <ReviewForm
          setSelectedMovie={setSelectedMovie}
          selectedMovie={selectedMovie}
        />
      )}
    </div>
  );
};
