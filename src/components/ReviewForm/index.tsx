import React, { useState } from 'react';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import styled from 'styled-components';
import Container from '../shared/Container';
import useReview from '../../hooks/useReview';
import Modal from '@mui/material/Modal';
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
  const { submitReview, isLoading } = useReview();

  // Initiate state for the character counterse
  const [characterCount, setCharacterCount] = useState<number>(0);
  const [mobileCharacterCount, setMobileCharacterCount] = useState<number>(0);

  // Initiate state to hold the review text
  const [review, setReview] = useState<string>('');

  // Initiate state to keep track if the mobile Dialog is open or not
  const [mobileDialogOpen, setMobileDialogOpen] = useState<boolean>(true);

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
          <div>
            <TextField
              id="outlined-multiline-static"
              label="Movie Review"
              multiline
              fullWidth
              rows={4}
              onChange={inputChangeHandler}
              error={characterCount > 100}
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
            <Button
              variant="contained"
              onClick={() => {
                submitReviewHandler();
              }}
              disabled={characterCount > 100}
            >
              Submit
            </Button>
          </div>
        </Container>
      </DesktopView>
      <StyledDialog open={!!selectedMovie.title} onClose={closeDialogHandler}>
        <DialogTitle>{selectedMovie.title}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {selectedMovie.movieCompanyName} -{' '}
            {selectedMovie.averageReviewScore} Stars
          </DialogContentText>
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
        <DialogActions>
          <Button
            onClick={() => {
              closeDialogHandler();
            }}
          >
            Cancel
          </Button>
          <Button
            disabled={mobileCharacterCount > 100}
            onClick={() => {
              submitReviewHandler();
            }}
          >
            Submit
          </Button>
        </DialogActions>
      </StyledDialog>
    </>
  );
};

export default index;
