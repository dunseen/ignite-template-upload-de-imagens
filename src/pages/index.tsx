import { Button, Box } from '@chakra-ui/react';
import { useMemo } from 'react';
import { useInfiniteQuery } from 'react-query';

import { Header } from '../components/Header';
import { CardList } from '../components/CardList';
import { api } from '../services/api';
import { Loading } from '../components/Loading';
import { Error } from '../components/Error';

type PageParams = {
  title: string;
  description: string;
  url: string;
  ts: number;
  id: string;
};

type PageResponse = {
  data: PageParams[];
  after: string;
};

export default function Home(): JSX.Element {
  const fetchImages = async ({ pageParam = null }): Promise<PageResponse> => {
    const response = await api.get('/api/images', {
      params: {
        after: pageParam,
      },
    });

    return response.data;
  };

  const {
    data,
    isLoading,
    isError,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
  } = useInfiniteQuery('images', fetchImages, {
    getNextPageParam: lastPage => (lastPage.after ? lastPage.after : null),
  });

  const formattedData = useMemo(() => {
    return data?.pages.flatMap(imageData => {
      return imageData.data.flat();
    });
  }, [data]);

  if (isLoading) return <Loading />;

  if (isError) return <Error />;

  return (
    <>
      <Header />

      <Box maxW={1120} px={20} mx="auto" my={20}>
        <CardList cards={formattedData} />
        {hasNextPage ? (
          <Button onClick={() => fetchNextPage()}>
            {isFetchingNextPage ? 'Carregando...' : 'Carregar mais'}
          </Button>
        ) : null}
      </Box>
    </>
  );
}
