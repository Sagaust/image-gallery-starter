// pages/_document.tsx
import Document, { Head, Html, Main, NextScript } from "next/document";

class MyDocument extends Document {
  render() {
    return (
      <Html lang="en">
        <Head>
          <link rel="icon" href="/favicon.ico" />
          <meta
            name="Philosophy AI LAB"
            content="Learning Philosophy through Visualization"
          />
          
          
          <meta property="og:title" content="Philos-DH" />
          <meta name="twitter:card" content="summary_large_image" />
          <meta name="twitter:title" content="Philos-DH" />
          <meta
            name="twitter:description"
            content="Learning Philosophy through visualization of ideas"
          />
        </Head>
        <body className="bg-gray-100 antialiased">
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
