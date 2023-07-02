import React, { useEffect, useState } from 'react';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import styled from 'styled-components';
import Container from '../shared/Container';
import useReview from '../../hooks/useReview';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { MovieObject } from '../../types';

// Styles for the Movie Info section
const MovieInfo = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 25px;
  line-height: 1.8;

  h2 {
    margin-top: -15px;
    margin-bottom: -5px;
  }
`;

const SuccessMessage = styled.span`
  font-weight: 600;
`;

// Desktop view of the review form
const DesktopView = styled.div`
  display: block; /* hide the component by default */

  @media (max-width: 768px) {
    display: none; /* show the component on screens up to 768px */
  }
`;

// Mobile view of the review form, using a Dialog
const StyledDialog = styled(Dialog)`
  display: none; /* hide the component by default */

  @media (max-width: 768px) {
    display: block; /* show the component on screens up to 768px */
  }
`;

const CharacterCount = styled.span`
  font-size: 12px;
`;

const ReviewError = styled.span`
  font-weight: 600;
  color: red;
`;

// Create a type interface for the props
interface ReviewFormProps {
  // share movie interfact
  selectedMovie: MovieObject;
  setSelectedMovie: Function;
}

const index = (props: ReviewFormProps) => {
  // Destructure props so they are cleaner to use
  const { selectedMovie, setSelectedMovie } = props;

  // Get functions and variables from the useReview hook
  const { submitReview, isLoading, reviewState, setReviewState } = useReview();

  // Initiate state for the character counterse
  const [characterCount, setCharacterCount] = useState<number>(0);
  const [mobileCharacterCount, setMobileCharacterCount] = useState<number>(0);

  // Initiate state to hold the review text
  const [review, setReview] = useState<string>('');

  // Initiate state to keep track if the mobile Dialog is open or not
  const [mobileDialogOpen, setMobileDialogOpen] = useState<boolean>(true);

  // Run useEffect to make sure the review form is displayed when the user changes movie
  useEffect(() => {
    setReviewState(0);
  }, [selectedMovie]);

  // Keeps track of the character length of the review
  const inputChangeHandler = (event: { target: { value: string } }) => {
    const inputText = event.target.value;
    setCharacterCount(inputText.length);
    setReview(inputText);
  };

  const mobileInputChangeHandler = (event: { target: { value: string } }) => {
    const inputText = event.target.value;
    setMobileCharacterCount(inputText.length);
    setReview(inputText);
  };

  // Fire the POST request to submit the review
  const submitReviewHandler = () => {
    submitReview(review);
    setCharacterCount(0);
    setMobileCharacterCount(0);
    setMobileDialogOpen(false);
  };

  const closeDialogHandler = () => {
    setMobileDialogOpen(false);
    setSelectedMovie({});
  };

  return (
    <>
      <DesktopView>
        <Container>
          <MovieInfo>
            <h2>Write a review...</h2>
            {selectedMovie.title ? (
              <>
                <span>Movie: {selectedMovie.title}</span>
                <span>Movie Company: {selectedMovie.movieCompanyName}</span>
                <span>Average Review: {selectedMovie.averageReviewScore}</span>
              </>
            ) : (
              <span>No movie selected</span>
            )}
          </MovieInfo>
          {reviewState === 1 ? (
            <SuccessMessage>Thanks for submitting a review!</SuccessMessage>
          ) : (
            <>
              <div>
                {reviewState === 2 && (
                  <ReviewError>
                    An error occurred, please try submitting your review again.
                  </ReviewError>
                )}
                <TextField
                  id="outlined-multiline-static"
                  label="Movie Review"
                  multiline
                  fullWidth
                  rows={4}
                  onChange={inputChangeHandler}
                  error={characterCount > 100}
                  disabled={isLoading}
                />
              </div>
              <div>
                <CharacterCount
                  style={{ color: characterCount > 100 ? 'red' : 'inherit' }}
                >
                  Character Count: {characterCount}/100
                </CharacterCount>
              </div>
              <div>
                {isLoading ? (
                  <CircularProgress />
                ) : (
                  <div>
                    <Button
                      variant="contained"
                      onClick={() => {
                        submitReviewHandler();
                      }}
                      disabled={characterCount > 100 || characterCount === 0}
                    >
                      Submit
                    </Button>
                  </div>
                )}
              </div>
            </>
          )}
        </Container>
      </DesktopView>
      <StyledDialog open={!!selectedMovie.title} onClose={closeDialogHandler}>
        <DialogTitle>{selectedMovie.title}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {selectedMovie.movieCompanyName} -{' '}
            {selectedMovie.averageReviewScore} Stars
          </DialogContentText>
        </DialogContent>
        {reviewState === 1 ? (
          <SuccessMessage>Thanks for submitting a review!</SuccessMessage>
        ) : (
          <DialogContent>
            {reviewState === 2 && <ReviewError>Error - Try again.</ReviewError>}
            <TextField
              autoFocus
              margin="dense"
              id="review"
              label="Movie Review"
              type="text"
              fullWidth
              variant="standard"
              onChange={mobileInputChangeHandler}
              error={mobileCharacterCount > 100}
              disabled={isLoading}
            />
            <DialogContentText>
              <CharacterCount
                style={{
                  color: mobileCharacterCount > 100 ? 'red' : 'inherit',
                }}
              >
                Character Count: {mobileCharacterCount}/100
              </CharacterCount>
            </DialogContentText>
          </DialogContent>
        )}
        <DialogActions>
          {isLoading ? (
            <CircularProgress size={25} />
          ) : (
            <>
              <Button
                onClick={() => {
                  closeDialogHandler();
                }}
              >
                Close
              </Button>
              <Button
                disabled={
                  mobileCharacterCount > 100 ||
                  mobileCharacterCount === 0 ||
                  reviewState === 1
                }
                onClick={() => {
                  submitReviewHandler();
                }}
              >
                Submit
              </Button>
            </>
          )}
        </DialogActions>
      </StyledDialog>
    </>
  );
};

export default index;
