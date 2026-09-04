/**
 * Applied by `react-native-svg-transformer` when it compiles an SVG.
 *
 * Font Awesome exports paths with no `fill`, which renders them permanently
 * black. Setting `currentColor` on the root makes the glyph inherit whatever
 * `color` the call site passes, so one file serves every tint.
 */
module.exports = {
  native: true,
  svgProps: {
    fill: 'currentColor',
  },
};
