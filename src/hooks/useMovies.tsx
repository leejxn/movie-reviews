import { useState, useEffect } from 'react';
import { MovieObject } from '../types';

interface MovieCompany {
  id: string;
  name: string;
}

const useMovies = () => {
  // Initiate loading state
  const [isLoading, setIsLoading] = useState(false);

  // Initiate error state
  const [error, setError] = useState<React.ErrorInfo | null | unknown>(null);

  // Initiate movies state
  const [movies, setMovies] = useState<MovieObject[]>([]);

  // Initiate movieCompanies state
  const [movieCompanies, setMovieCompanies] = useState<MovieCompany[]>();

  const requestRetries = 5;

  const fetchMovieCompanies = async () => {
    let retries = requestRetries;
    // Retry the fetch X amount of times if it fails
    while (retries > 0) {
      try {
        const response = await fetch(
          'https://comforting-starlight-f3456a.netlify.app/.netlify/functions/movieCompanies'
        );
        const result = await response.json();
        return result;
      } catch (err) {
        await sleepBetweenRetries(1000);
      } finally {
        retries -= 1;
      }
    }

    function sleepBetweenRetries(delay: number) {
      return new Promise((resolve) => setTimeout(resolve, delay));
    }
  };

  const fetchMovies = async () => {
    let retries = requestRetries;
    // Retry the fetch X amount of times if it fails
    while (retries > 0) {
      try {
        const response = await fetch(
          'https://comforting-starlight-f3456a.netlify.app/.netlify/functions/movies'
        );
        const result = await response.json();
        return result;
      } catch (err) {
        await sleepBetweenRetries(1000);
      } finally {
        retries -= 1;
      }
    }
  };

  // Creates a delay between retries using a Promise that resolves after the specified delay using setTimeout.
  function sleepBetweenRetries(delay: number) {
    return new Promise((resolve) => setTimeout(resolve, delay));
  }

  // This function loops through the movies object and gets the movie company name based on the filmCompanyId of each movie, it then adds that key/value pair to the movies object
  // This function also calculates the average review score and creates a key/value pair to store that too
  const movieDataHandler = async () => {
    try {
      setIsLoading(true);
      // Call the two fetch methods to get the data from the endpoints
      const movieCompaniesResponse = await fetchMovieCompanies();
      setMovieCompanies(movieCompaniesResponse);
      const moviesResponse = await fetchMovies();

      setMovies(moviesResponse);

      // Loop over the movies response and add the movie company name based on the filmCompanyId
      for (let i = 0; i < moviesResponse.length; i++) {
        // Get the film company name based off the filmcompanyid
        const filmCompanyId = moviesResponse[i].filmCompanyId;
        const filmCompanyInfo = movieCompaniesResponse.find(
          (item: any) => item.id === filmCompanyId
        );
        moviesResponse[i].movieCompanyName = filmCompanyInfo.name;

        // Call the calculate average score function with the review array
        // Calculate average score
        moviesResponse[i].averageReviewScore = calculateAverageScore(
          moviesResponse[i].reviews
        );
      }
    } catch (error) {
      setError(error);
    } finally {
      setIsLoading(false);
    }
  };

  function calculateAverageScore(reviewScores: []) {
    // Calculate the sum of all numbers
    const sum = reviewScores.reduce((acc: any, num: any) => acc + num, 0);

    // Calculate the average by dividing the sum by the number of elements
    const average = sum / reviewScores.length;

    // Round the average to 1 decimal place
    const roundedAverage = average.toFixed(1);

    return parseFloat(roundedAverage);
  }

  return {
    // Variables
    isLoading,
    error,
    movies,
    // Methods
    movieDataHandler,
  };
};

export default useMovies;
