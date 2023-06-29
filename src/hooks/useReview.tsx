import { useState } from 'react';

const useReview = () => {
  const [isLoading, setIsLoading] = useState(false);

  const submitReview = async (review: string) => {
    try {
      setIsLoading(true);

      const requestHeaders = new Headers();
      requestHeaders.append('Content-Type', 'application/json');

      const requestBody = JSON.stringify(review);

      const requestOptions = {
        method: 'POST',
        headers: requestHeaders,
        body: requestBody,
        redirect: 'follow',
      };

      fetch(
        'https://comforting-starlight-f3456a.netlify.app/.netlify/functions/submitReview',
        requestOptions
      );
    } catch (err) {
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    // Variables
    isLoading,
    // Methods
    submitReview,
  };
};

export default useReview;
