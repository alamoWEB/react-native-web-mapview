# react-native-web-mapview

> React Native for Web implementation of react-native-maps (using Leaflet)

# About

Based on `react-native-web-maps` but using Leaflet (default).

## Installation

```sh
yarn add @alamoweb/react-native-web-mapview
```

Add the Leaflet CSS:

- In case you're using Expo, add it to your web/index.html
[How to expose expo's index.html?](https://github.com/expo/expo/issues/11401#issuecomment-747745228)

```html
<html>
  <head>
    ...
    <link rel="stylesheet" href="https://unpkg.com/leaflet@1.8.0/dist/leaflet.css" integrity="sha512-hoalWLoI8r4UszCkZ5kL8vayOGVae1oxXe/2A4AO6J9+580uKHDO3JdHb7NzwwzK5xr/Fs0W40kiNHxM9vyTtQ==" crossorigin="" />
  </head>
  ...
</html>
```


### Additional
If you're using `react-google-maps` lib for iOS/Android and wanting to support Web without needing to add a condition to switch between the libs, add this alias to your `webpack.config.js`:

```js
const createExpoWebpackConfigAsync = require('@expo/webpack-config');

module.exports = async function (env, argv) {
  const config = await createExpoWebpackConfigAsync(env, argv);
  // Customize the config before returning it.

  config.resolve.alias['react-native-maps'] = '@alamoweb/react-native-web-mapview';

  return config;
};
```


## Usage

```ts
import MapView, { Marker } from '@alamoweb/react-native-web-mapview'; // or 'react-native-maps'
```

See the original [documentation](https://github.com/react-native-maps/react-native-maps).

The supported components are:

- `MapView`
- `Marker`

`MapView`:

The officially supported props are:
- `region`
- `initialRegion`
- `maxZoomLevel`
- `minZoomLevel`


The officially supported events are:
- `onMapReady`
- `onPanDrag`
- `onRegionChange`
- `onRegionChangeComplete`


The officially supported methods are:
- `getMapBoundaries`
- `getCamera`
- `setCamera`
- `animateCamera`


Additional methods:
- `getMap`: returns the Leaflet map instance


`Marker`:

The officially supported props are:
- `icon`
- `image`
- `title`
- `description`
- `coordinate`
- `identifier`
- `opacity`


The officially supported events are:
- `onPress`


## Contributing

See the [contributing guide](CONTRIBUTING.md) to learn how to contribute to the repository and the development workflow.

## License

MIT
