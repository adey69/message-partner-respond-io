import { View } from 'react-native';

/**
 * Metro compiles `.svg` imports into components; Jest does not run Metro, so
 * every SVG import resolves here instead of failing to parse as JavaScript.
 */
export default View;
