import React from "react";
import { ConfigProvider } from "antd";
import type { AppProps } from "next/app";

import theme from "../theme/themeConfig";
import LayoutComponent from "@/layout/layout";

// Don't edit this file

const App = ({ Component, pageProps }: AppProps) => (
  <ConfigProvider theme={theme}>
    <LayoutComponent>
      <Component {...pageProps} />
    </LayoutComponent>
  </ConfigProvider>
);

export default App;
