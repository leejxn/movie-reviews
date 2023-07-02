import { useState, useEffect } from 'react';
import useMovies from '../../hooks/useMovies';
import { DataGrid, GridColDef, GridRowId } from '@mui/x-data-grid';
import LinearProgress from '@mui/material/LinearProgress';
import CircularProgress from '@mui/material/CircularProgress';
import Button from '@mui/material/Button';
import Rating from '@mui/material/Rating';
import Container from '../shared/Container';
import styled from 'styled-components';
import ErrorFallback from '../ErrorFallback';

import { MovieObject } from '../../types';

// Styles for Table Controls
const TableControlsContainer = styled.div`
  margin-top: 25px;
  display: flex;
  justify-content: space-around;
`;

// Create type interface for props
interface MovieTableProps {
  selectedMovie: MovieObject;
  setSelectedMovie: Function;
}

const index = (props: MovieTableProps) => {
  // Destructure props so they are cleaner to use
  const { selectedMovie, setSelectedMovie } = props;

  // Initiate state for which row on the table is selected
  const [selectionModel, setSelectionModel] = useState<GridRowId[]>([]);

  // Initiate state for a refresh identifier to use to trigger the useEffect and refresh the table
  const [refreshIndentifier, setRefreshIdentifier] = useState<number>(0);

  // Get functions and variables from the useMovies hook
  const { movieDataHandler, movies, error, isLoading } = useMovies();

  // Run useEffect on the first render and when refrshIdentifier is changed
  useEffect(() => {
    movieDataHandler();
  }, [refreshIndentifier]);

  // Define the table columns
  const tableColumns: GridColDef[] = [
    { field: 'title', headerName: 'Movie Name', width: 200 },
    { field: 'movieCompanyName', headerName: 'Movie Company', width: 200 },
    {
      field: 'averageReviewScore',
      headerName: 'Average Review',
      width: 290,
      renderCell: (params) => {
        const averageReviewScore: number = params.row.averageReviewScore;
        return (
          <>
            {averageReviewScore} /
            <Rating
              name="read-only"
              value={averageReviewScore}
              max={10}
              readOnly
            />
          </>
        );
      },
    },
    {
      field: 'reviewButton',
      headerName: 'Reviews',
      sortable: false,
      width: 160,
      renderCell: (params) => {
        return (
          <Button
            onClick={() => {
              onRowsSelectionHandler(params.row.id);
            }}
            variant="contained"
          >
            Write Review
          </Button>
        );
      },
    },
  ];

  // Get movie data based on which row the user has selected
  const onRowsSelectionHandler = (id: GridRowId[]) => {
    setSelectionModel(id);

    // The ID we get from the endpoint is a string, it's also in an array from the table data
    const selectedMovie = movies.find(
      (movie: MovieObject) => 'id' in movie && movie.id === id[0]
    );

    setSelectedMovie(selectedMovie);
  };

  // Deselect row and clear selected movie data
  const deselectRowHandler = () => {
    setSelectionModel([]);
    setSelectedMovie({});
  };

  // Update the table refresh identifier to trigger the table refresh
  const tableRefreshHandler = () => {
    setRefreshIdentifier((prevIdentifier) => prevIdentifier + 1);
  };

  // If there is an error of somesort use the error fallback component
  if (error) {
    return (
      <>
        <ErrorFallback errorText={(error as Error).message} />
      </>
    );
  }

  return (
    <Container>
      {isLoading ? (
        <CircularProgress />
      ) : (
        <div>
          <span>Total movies: {movies.length}</span>
        </div>
      )}
      <DataGrid
        rows={movies}
        columns={tableColumns}
        initialState={{
          pagination: {
            paginationModel: { page: 0, pageSize: 5 },
          },
        }}
        pageSizeOptions={[5, 10]}
        loading={isLoading}
        slots={{
          loadingOverlay: LinearProgress,
        }}
        rowSelectionModel={selectionModel}
        onRowSelectionModelChange={(id) => onRowsSelectionHandler(id)}
      />
      <TableControlsContainer>
        <Button
          variant="contained"
          disabled={Object.keys(selectedMovie).length === 0}
          onClick={() => {
            deselectRowHandler();
          }}
        >
          Deselect Row
        </Button>
        <Button
          variant="contained"
          onClick={() => {
            tableRefreshHandler();
          }}
        >
          Refresh Table
        </Button>
      </TableControlsContainer>
    </Container>
  );
};

export default index;
