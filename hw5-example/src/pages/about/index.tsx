/* eslint-disable @next/next/no-img-element */
import React from "react";
import { Divider, Typography } from "antd";

const NewsPage: React.FC = () => {
  return (
    <div style={{ width: "100%" }}>
      {/* You can delete this div if you want */}
      <div style={{ marginBottom: "10px" }}>{/* Add Switch inside here */}</div>
      <Divider />
      <Typography.Title level={2}>About</Typography.Title>
      Your one-stop shop for news about space.
    </div>
  );
};

export default NewsPage;
