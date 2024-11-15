import React from "react";
import { Row, Col, List, Typography } from "antd";
import { Article } from "@/types/types";

interface ArticleStatisticsProps {
  articles: Article[];
}

const ArticleStatistics: React.FC<ArticleStatisticsProps> = ({ articles }) => {
  /**
   * This component generates the following statistics:
   * 1. Unique news sources
   * 2. Date range of articles
   * 3. Number of featured articles
   *
   * It takes as input an array of articles
   *
   * You should use a combination of Antd components to buidld this.
   * You might need to do some data manipulation to get the data in the right format.
   *
   * I used a combination of the following components:
   * 1. List
   * 2. Row
   * 3. Col
   * 4. Typography.Text
   * 5. Typography.Title
   */
  //This is given to you
  const uniqueSources = [
    ...new Set(articles.map((article) => article.news_site)),
  ];
  // This might be helpful for you
  const dateRange = [
    new Date(
      Math.min(
        ...articles.map((article) => new Date(article.published_at).getTime())
      )
    ).toLocaleDateString(),
    new Date(
      Math.max(
        ...articles.map((article) => new Date(article.published_at).getTime())
      )
    ).toLocaleDateString(),
  ];

  const numFeatured = [
    articles.reduce((acc, article) => (article.featured ? acc + 1 : acc), 0),
  ];

  return (
    <>
      <Row gutter={[8, 8]}>
        <Col key={"unique"} xs={24} sm={12} md={8}>
          <List
            header={
              <Typography.Text strong>Unique News Sources</Typography.Text>
            }
            bordered
            dataSource={uniqueSources}
            renderItem={(item) => <List.Item>{item}</List.Item>}
          />
        </Col>
        <Col key={"dateRange"} xs={24} sm={12} md={8}>
          <List
            header={
              <Typography.Text strong>Date Range of Articles</Typography.Text>
            }
            bordered
            dataSource={dateRange}
            renderItem={(item, idx) => (
              <List.Item>
                {idx === 0 ? "Earliest: " : "Latest: "}
                {item}
              </List.Item>
            )}
          />
        </Col>
        <Col key={"features"} xs={24} sm={12} md={8}>
          <List
            header={
              <Typography.Text strong>
                Number of Featured Articles
              </Typography.Text>
            }
            bordered
            dataSource={numFeatured}
            renderItem={(item) => <List.Item>Count: {item}</List.Item>}
          />
        </Col>
      </Row>
    </>
  );
};

export default ArticleStatistics;
