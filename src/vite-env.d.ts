/// <reference types="vite/client" />

// Dichiarazioni per l'import dei CSS Modules (*.module.css).
declare module '*.module.css' {
  const classes: { readonly [key: string]: string };
  export default classes;
}
