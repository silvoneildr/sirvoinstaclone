import React, {useState, useEffect, useCallback} from 'react';
import {View, FlatList} from 'react-native';
import LazyImage from '../../components/LazyImage';

import {
  Post,
  Avatar,
  Header,
  Name,
  Description,
  Loading
} from './styles';

export default function Feed() {
  const [feed, setFeed] = useState([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [viewable, setViewable] = useState([]);

  async function loadPage(pageNumber = page, shouldRefresh = false) {
    if (total && pageNumber > total) return;
    setLoading(true);
    const response = await fetch(
      `http://localhost:3000/feed?_expand=author&_limit=4&_page=${pageNumber}`,
    );
    const data = await response.json();
    const totalItems = response.headers.get('X-Total-Count');
    setTotal(Math.floor(totalItems/5));
    setFeed(shouldRefresh ? data : [...feed,...data]);
    setPage(pageNumber + 1);
    setLoading(false);
  }

  async function refreshList() {
    setRefreshing(true);
    await loadPage(1, true);
    setRefreshing(false);
  }

  useEffect(() => {
    loadPage();
  }, []);

  const handleViewableChanged = useCallback(({ changed }) => {
    setViewable(changed.map(({ item }) => item.id));
  }, []);

  return (
    <View>
      <FlatList
        data={feed}
        keyExtractor={post => String(post.id)}
          onEndReached={() => loadPage()}
        onEndReachedThreshold={0.1}
        onRefresh={refreshList}
        onViewableItemsChanged={handleViewableChanged}
        refreshing={refreshing}
        viewabilityConfig={{ viewAreaCoveragePercentThreshold: 22 }}
        ListFooterComponent={loading && <Loading />}
        renderItem={({item}) => (
          <Post>
            <Header>
              <Avatar source={{uri: item.author.avatar}} />
              <Name>{item.author.name}</Name>
            </Header>
            <LazyImage
              shouldLoad={viewable.includes(item.id)}
              ratio={item.aspectRatio}
              smallSource={{uri: item.small}}
              source={{uri: item.image}}
            />
            <Description>
              <Name>{item.author.name}</Name> {item.description}
            </Description>
          </Post>
        )}
      />
    </View>
  );
}
