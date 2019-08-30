import React, {useState, useEffect} from 'react';
import {View, FlatList} from 'react-native';

import {Post, Avatar, Header, Name, PostImage, Description} from './styles';

export default function Feed() {
  const [feed, setFeed] = useState([]);

  useEffect(() => {
    async function loadFeed() {
      const response = await fetch(
        'http://localhost:3000/feed?_expand=author&_limit=4&_page1',
      );
      const data = await response.json();

      setFeed(data);
    }
    loadFeed();
  }, []);
  return (
    <View>
      <FlatList
        data={feed}
        keyExtractor={post => String(post.id)}
        renderItem={({item}) => (
          <Post>
            <Header>
              <Avatar source={{uri: item.author.avatar}} />
              <Name>{item.author.name}</Name>
            </Header>
            <PostImage source={{uri: item.image}} />
            <Description>
              <Name>{item.author.name}</Name> {item.description}
            </Description>
          </Post>
        )}
      />
    </View>
  );
}
