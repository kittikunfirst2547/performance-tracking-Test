// TypeScript declarations for importing CSS files in Next.js (App Router)
// See: https://nextjs.org/docs/messages/import-css-file

declare module "*.css" {
  const content: { [className: string]: string };
  export default content;
}

declare module "*.module.css" {
  const classes: { readonly [key: string]: string };
  export default classes;
}
