import { useState } from 'react';

interface RequestOptions {
  method: string;
  headers: Headers;
  body?: any;
  redirect?: RequestRedirect | undefined;
}

const useReview = () => {
  const [isLoading, setIsLoading] = useState(false);

  const [reviewState, setReviewState] = useState(0);

  const submitReview = async (review: string) => {
    setIsLoading(true);

    const requestHeaders = new Headers();
    requestHeaders.append('Content-Type', 'application/json');

    const requestBody = JSON.stringify({ review: review });

    const requestOptions: RequestOptions = {
      method: 'POST',
      headers: requestHeaders,
      body: requestBody,
    };

    try {
      const response = await fetch(
        'https://comforting-starlight-f3456a.netlify.app/.netlify/functions/submitReview',
        requestOptions
      );
      const result = await response.text();
      setReviewState(1);
    } catch (err) {
      setReviewState(2);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    // Variables
    isLoading,
    reviewState,
    // Methods
    setReviewState,
    submitReview,
  };
};

export default useReview;
