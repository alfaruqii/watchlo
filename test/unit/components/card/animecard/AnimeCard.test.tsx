import { render, screen } from '@testing-library/react';
import { AnimeCard } from '@/components/card/animecard/AnimeCard';
import { popularAnime, trendingAnime } from 'test/fixture/info/anime.fixture';

jest.mock('next/image', () => ({
  __esModule: true,
  default: (props: any) => {
    const { fill, ...rest } = props;
    const style = fill ? { objectFit: 'cover', position: 'absolute', height: '100%', width: '100%' } : {};
    return <img data-testid="mock-image" {...rest} style={style} />;
  },
}));

describe('AnimeCard', () => {
  test('renders popular anime correctly', () => {
    render(<AnimeCard anime={popularAnime} />);

    expect(screen.getByText('My Popular Anime')).toBeInTheDocument();
    expect(screen.getByText('Status: RELEASING')).toBeInTheDocument();

    // Use stringContaining to match part of the transformed URL
    const popularImage = screen.getByAltText('My Popular Anime');
    expect(popularImage).toHaveAttribute('src', expect.stringContaining('http://example.com/popular.jpg'));
  });

  test('renders trending anime correctly', () => {
    render(<AnimeCard anime={trendingAnime} />);

    expect(screen.getByText('My Trending Anime')).toBeInTheDocument();
    expect(screen.getByText('Episode 5')).toBeInTheDocument();

    const trendingImage = screen.getByAltText('My Trending Anime');
    expect(trendingImage).toHaveAttribute('src', expect.stringContaining('http://example.com/trending.jpg'));
  });

  test('generates correct link for popular anime', () => {
    const { container } = render(<AnimeCard anime={popularAnime} />);

    const link = container.querySelector('a');
    expect(link).toHaveAttribute('href', '/anime/detail/1');
  });

  test('generates correct link for trending anime', () => {
    const { container } = render(<AnimeCard anime={trendingAnime} />);

    const link = container.querySelector('a');
    expect(link).toHaveAttribute('href', '/anime/watch/episode-5?title=2&ep=5');
  });
});

