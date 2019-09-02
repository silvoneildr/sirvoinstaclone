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
    const urlBase = "http://localhost:3000/";
    const params = `?_expand=author&_limit=4&_page=${pageNumber}`;
    if (total && pageNumber > total) return;
    setLoading(true);
    const response = await fetch(`${urlBase}feed${params}`);
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

  const renderItem = ({ item }) => (
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
  );

  return (
    <View>
      <FlatList
        data={feed}
        keyExtractor={post => String(post.id)}
        refreshing={refreshing}
        viewabilityConfig={{ viewAreaCoveragePercentThreshold: 15 }}
        ListFooterComponent={loading && <Loading />}
        onEndReached={() => loadPage()}
        onEndReachedThreshold={0.1}
        onRefresh={refreshList}
        onViewableItemsChanged={handleViewableChanged}
        renderItem={renderItem}
      />
    </View>
  );
}
