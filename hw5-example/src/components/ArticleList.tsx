import React from "react";
import { Col, Row } from "antd";
import { Article } from "@/types/types";
import ArticleCard from "./ArticleCard";

interface ArticleListProps {
  articles: Article[];
}

// You'll need to replace undefined with the correct type
const ArticleList: React.FC<ArticleListProps> = ({ articles }) => (
  /**
   * This component renders a list of articles. It takes as input an array of articles and a boolean indicating whether the list is loading.
   * You will need to write a props interface for this component.
   *
   * You should use your custom ArticleCard component to build this.
   * No data manipulation is needed here.
   * Don't forget to add a unique key prop to each ArticleCard.
   * Don't forget to add a Skeleton component for when the list is loading. You might need conditional render logic for this
   *
   */
  <>
    <Row gutter={[8, 8]}>
      {articles.map((article: Article, idx: number) => {
        return (
          <Col key={idx} xs={24} sm={12} md={8}>
            <ArticleCard key={idx} article={article} />
          </Col>
        );
      })}
    </Row>
  </>
);

export default ArticleList;
