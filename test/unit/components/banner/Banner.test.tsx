import '@testing-library/jest-dom';
import { render } from '@testing-library/react';
import { Banner } from '@/components/detail/banner/Banner';
import { animeFixture } from 'test/fixture/info/anime.fixture';
import { movieFixture } from 'test/fixture/info/movie.fixture';
import { tvFixture } from 'test/fixture/info/tv.fixture'; // Make sure you have a TV fixture

// Updated mock for next/image
jest.mock('next/image', () => ({
  __esModule: true,
  default: (props: any) => {
    const { fill, ...rest } = props;
    const style = fill ? { objectFit: 'cover', position: 'absolute', height: '100%', width: '100%' } : {};
    return <img data-testid="mock-image" {...rest} style={style} />;
  },
}));

describe('Banner Component', () => {
  it('renders anime banner correctly', () => {
    const { getByTestId } = render(<Banner item={animeFixture} />);

    const image = getByTestId('mock-image');
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute('src', animeFixture.bannerImage);
    expect(image).toHaveAttribute('alt', animeFixture.title.userPreferred);
  });

  it('renders movie banner correctly', () => {
    const { getByTestId } = render(<Banner item={movieFixture} />);

    const image = getByTestId('mock-image');
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute('src', movieFixture.backdrop_path);
    expect(image).toHaveAttribute('alt', movieFixture.title);
  });

  it('renders TV show banner correctly', () => {
    const { getByTestId } = render(<Banner item={tvFixture} />);

    const image = getByTestId('mock-image');
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute('src', tvFixture.backdrop_path); // You can change this if your TV fixture has a different image property
    expect(image).toHaveAttribute('alt', tvFixture.name); // Update according to the alt text logic
  });

  it('uses fallback image when no image is provided', () => {
    const itemWithoutImage = { ...animeFixture, bannerImage: undefined, coverImage: undefined };

    const { getByTestId } = render(<Banner item={itemWithoutImage} />);

    const image = getByTestId('mock-image');
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute('src', '/fallback-banner.webp');
  });
});

