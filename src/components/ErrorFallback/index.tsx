import Container from '../shared/Container';

interface ErrorFallbackProps {
  errorText: string;
}

export default function ErrorFallback({
  errorText,
}: ErrorFallbackProps): JSX.Element {
  return (
    <Container>
      <p>{errorText}</p>
    </Container>
  );
}
