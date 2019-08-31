import React, { useState, useEffect } from 'react';
import { Animated } from 'react-native';

import { Small, Original } from './styles';

const OriginalAnimated = Animated.createAnimatedComponent(Original);

export default function LazyImage({
  smallSource,
  source,
  aspectRatio,
  shouldLoad
}) {
  const opacity = new Animated.Value(0);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (shouldLoad) {
      setTimeout(() => {
        setLoaded(true);
      }, 500);
    }
  }, [shouldLoad]);

  function handleAnimate() {
    Animated.timing(opacity, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true
    }).start();
  }

  return (
    <Small
      source={smallSource}
      ratio={0.834}
      resizeMode='contain'
      blurRadio={2}
    >
      {loaded && <OriginalAnimated
        style={{ opacity }}
        source={source}
        ratio={0.834}
        resizeMode='contain'
        onLoadEnd={handleAnimate}
      />}
    </Small>
  );
}

