import type { GetStaticProps, NextPage } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import Carousel from "../../components/Carousel";
import cloudinary from "../../utils/cloudinary";
import getBase64ImageUrl from "../../utils/generateBlurPlaceholder";
import type { ImageProps } from "../../utils/types";

interface HomeProps {
  currentPhoto: ImageProps;
  images: ImageProps[];
}

const Home: NextPage<HomeProps> = ({ currentPhoto, images }) => {
  const router = useRouter();
  const { photoId } = router.query;
  let index = Number(photoId);

  const currentPhotoUrl = `https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload/c_scale,w_2560/${currentPhoto.public_id}.${currentPhoto.format}`;

  return (
    <>
      <Head>
        <title>Learning Philosophy through Pictures</title>
        <meta property="og:image" content={currentPhotoUrl} />
        <meta name="twitter:image" content={currentPhotoUrl} />
      </Head>
      <main className="mx-auto max-w-[1960px] p-4">
        <Carousel currentPhoto={currentPhoto} index={index} images={images} />
      </main>
    </>
  );
};

export const getStaticProps: GetStaticProps = async (context) => {
  try {
    const results = await cloudinary.v2.search
      .expression(`folder:${process.env.CLOUDINARY_FOLDER}/*`)
      .sort_by("public_id", "desc")
      .max_results(400)
      .execute();

    let reducedResults: ImageProps[] = [];
    let i = 0;
    for (let result of results.resources) {
      reducedResults.push({
        id: i,
        height: result.height,
        width: result.width,
        public_id: result.public_id,
        format: result.format,
      });
      i++;
    }

    const currentPhoto = reducedResults.find(
      (img) => img.id === Number(context.params.photoId)
    );
    if (!currentPhoto) {
      return {
        notFound: true,
      };
    }
    currentPhoto.blurDataUrl = await getBase64ImageUrl(currentPhoto);

    return {
      props: {
        currentPhoto,
        images: reducedResults,
      },
    };
  } catch (error) {
    console.error("Error fetching data:", error);
    return {
      notFound: true,
    };
  }
};

export const getStaticPaths = async () => {
  try {
    const results = await cloudinary.v2.search
      .expression(`folder:${process.env.CLOUDINARY_FOLDER}/*`)
      .sort_by("public_id", "desc")
      .max_results(400)
      .execute();

    let fullPaths = [];
    for (let i = 0; i < results.resources.length; i++) {
      fullPaths.push({ params: { photoId: i.toString() } });
    }

    return {
      paths: fullPaths,
      fallback: false,
    };
  } catch (error) {
    console.error("Error fetching paths:", error);
    return {
      paths: [],
      fallback: false,
    };
  }
};

export default Home;
