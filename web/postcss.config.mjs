// Next.js expects PostCSS plugins to be specified by name (string) in the
// configuration so the build system can resolve them. Use the object form
// mapping plugin names to their options.
export default {
  plugins: {
  '@tailwindcss/postcss': {},
    autoprefixer: {},
  },
}
