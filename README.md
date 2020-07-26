# screen-recorder
A free and private screen recording web app.

To run this project locally, you'll need a recent version of [Node.js](https://nodejs.org) (which comes bundled with [npm](https://www.npmjs.com), a JavaScript package manager). [Here](https://linuxize.com/post/how-to-install-node-js-on-ubuntu-18.04) is a short little guide on how to install it if you are unfamiliar (works on Chrome OS).

Install the [Material Design](https://material.io) components by running the following command in the project directory:

    npm i @material/fab @material/ripple
    
You'll also need all of the following Node dependencies:
* [webpack](https://www.npmjs.com/package/webpack): Bundles Sass and JavaScript
* [webpack-dev-server](https://www.npmjs.com/package/webpack-dev-server): Development server
* [sass-loader](https://www.npmjs.com/package/sass-loader): Webpack loader to preprocess Sass files
* [sass](https://www.npmjs.com/package/sass): Sass compiler
* [css-loader](https://www.npmjs.com/package/css-loader): Resolves CSS @import and url() paths
* [extract-loader](https://github.com/peerigon/extract-loader): Extracts the CSS into a .css file
* [file-loader](https://github.com/webpack-contrib/file-loader): Serves the .css file as a public URL
* [autoprefixer](https://www.npmjs.com/package/autoprefixer): Parses CSS and adds vendor prefixes to CSS rules
* [postcss-loader](https://github.com/postcss/postcss-loader): Loader for Webpack used in conjunction with autoprefixer
* [@babel/core](https://www.npmjs.com/package/@babel/core)
* [babel-loader](https://www.npmjs.com/package/babel-loader): Compiles JavaScript files using babel
* [@babel/preset-env](https://www.npmjs.com/package/@babel/preset-env): Preset for compiling es2015

You can install all of them at once by running this command:

    npm install --save-dev webpack webpack-cli webpack-dev-server css-loader sass-loader sass extract-loader file-loader autoprefixer postcss-loader @babel/core babel-loader @babel/preset-env
    
Finally, run `npm start` in the project directory and open http://localhost:8080 to view the web app.

To generate production-ready assets, run `npm run build`. This will produce bundle.js and bundle.css.
