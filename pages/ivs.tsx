import React, { ReactElement } from "react";
import Layout from "../components/DemoLayout";
import { NextPageWithLayout } from "../types/NextPageWithLayout";
import Head from "next/head";
import Video from "../components/Video";

const LessonVideo: NextPageWithLayout = () => {
  return (
    <div className="ivs page">
      <Head>
        <title>LSS IVS Video</title>
        <meta name="description" content="LSS frontend IVS video" />
      </Head>

      <Video />
    </div>
  );
};

LessonVideo.getLayout = (page: ReactElement) => {
  return <Layout>{page}</Layout>;
};

export default LessonVideo;
