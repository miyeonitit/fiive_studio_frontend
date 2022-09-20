import type { NextPageWithLayout } from "./NextPageWithLayout";
import type { AppProps } from "next/app";

export type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};
