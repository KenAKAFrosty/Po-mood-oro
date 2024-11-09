import { component$, useStyles$ } from "@builder.io/qwik";
import { QwikCityProvider, RouterOutlet, ServiceWorkerRegister } from "@builder.io/qwik-city";
import { RouterHead } from "./router-head";
import { isDev } from "@builder.io/qwik/build";
import "@fontsource-variable/rubik";

import "./global.css";

export default component$(() => {
  //Global styles, some basic resets & defaults
  useStyles$(`
body {
  font-family: 'Rubik Variable', sans-serif;
}
  
*, *::before, *::after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

html {
  font-size: 16px;
  line-height: 1.5;
  -webkit-text-size-adjust: 100%;
}

body {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
  color: #2d3748;
  background-color: #f7fafc;
  text-rendering: optimizeLegibility;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

h1, h2, h3, h4, h5, h6 {
  margin-top: 2.5rem;
  margin-bottom: 1.5rem;
  line-height: 1.2;
}

h1 {
  font-size: 2.5rem;
}

h2 {
  font-size: 2rem;
}

h3 {
  font-size: 1.75rem;
}

h4 {
  font-size: 1.5rem;
}

h5 {
  font-size: 1.25rem;
}

h6 {
  font-size: 1rem;
}

p {
  margin-bottom: 1.5rem;
}

p:last-child {
  margin-bottom: 0;
}

span {
  display: inline-block;
}

@media (max-width: 768px) {
  body {
    padding: 1rem;
  }

  h1 { font-size: 2rem; }
  h2 { font-size: 1.75rem; }
  h3 { font-size: 1.5rem; }
  h4 { font-size: 1.25rem; }
  h5, h6 { font-size: 1rem; }
}

button, input, select, textarea {
  font-family: inherit;
}

:focus-visible {
  outline: 2px solid #4299e1;
  outline-offset: 2px;
}

button {
  background: none;
  border: none;
  padding: 0;
  cursor: pointer;
}
  `);

  return (
    /**
     * The root of a QwikCity site always starts with the <QwikCityProvider> component,
     * immediately followed by the document's <head> and <body>.
     *
     * Don't remove the `<head>` and `<body>` elements.
     */
    <QwikCityProvider>
      <head>
        <meta charset="utf-8" />
        {!isDev && <link rel="manifest" href={`${import.meta.env.BASE_URL}manifest.json`} />}
        <RouterHead />
      </head>
      <body lang="en">
        <RouterOutlet />
        {!isDev && <ServiceWorkerRegister />}
      </body>
    </QwikCityProvider>
  );
});
