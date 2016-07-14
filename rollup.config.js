import babel from 'rollup-plugin-babel';
import globals from 'rollup-plugin-node-globals';
import babelrc from 'babelrc-rollup';
import replace from 'rollup-plugin-replace';
import commonjs from 'rollup-plugin-commonjs';
import nodeResolve from 'rollup-plugin-node-resolve';
//import browserifyPlugin from 'rollup-plugin-browserify-transform';
//import localenvify from 'localenvify';

let pkg = require('./package.json');
let external = Object.keys(pkg.dependencies);

export default {
  entry: 'client/index.js',
  plugins: [
    //babel(babelrc()),
    babel({
      babelrc: false,
      exclude: 'node_modules/**',
      presets: [ 'es2015-rollup', 'react' ]
    }),
    //jsx({ factory: 'React.createElement' }),
    commonjs({
      //include: 'node_modules/**',
      //exclude: ['node_modules/react/**', 'node_modules/react-dom/**'],
      exclude: 'node_modules/process-es6/**',
      //include: [
      //  'node_modules/fbjs/**',
      //  'node_modules/object-assign/**',
      //  'node_modules/react/**',
      //  'node_modules/react-dom/**'
      //]
    }),
    //globals(),
    replace({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
      'process.env.WSS_PORT': JSON.stringify(process.env.WSS_PORT || 9967),
    }),
    //browserifyPlugin(localenvify()),
	  nodeResolve({
      //jsnext: true,
      main: true,
      browser: true,
    }),
  ],
  //external: external,
  targets: [
    {
      dest: 'public/bundle.js',
      format: 'iife',
      sourceMap: process.env.NODE_ENV !== 'production'
        ? 'inline'
        : false,
    },
  ]
};
