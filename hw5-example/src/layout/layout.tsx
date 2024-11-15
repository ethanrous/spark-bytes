"use client";
import React from "react";
import { Layout } from "antd";
import CustomHeader from "./header";
const { Content, Footer } = Layout;
//You'll need to edit this component
const LayoutComponent = ({ children }: { children: React.ReactNode }) => {
  return (
    <Layout className="layout" style={{ minHeight: "100vh" }}>
      <CustomHeader />
      <Content style={{ padding: "0 50px", marginTop: 64 }}>
        <div
          className="site-layout-content"
          style={{ padding: 24, minHeight: 380, height: "100%" }}
        >
          {children}
        </div>
      </Content>
      <Footer style={{ textAlign: "center" }}>
        Spark! ©{new Date().getFullYear()} Created by Spark!
      </Footer>
    </Layout>
  );
};

export default LayoutComponent;
