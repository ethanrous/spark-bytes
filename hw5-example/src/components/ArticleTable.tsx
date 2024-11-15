import React from "react";
import { Table, TableProps } from "antd";
import { Article } from "@/types/types";

interface ArticleTableProps {
  articles: Article[];
}

interface TableRow {
  key: React.Key;
  title: string;
  source: string;
  published_at: string;
}

const ArticleTable: React.FC<ArticleTableProps> = ({ articles }) => {
  /**
   * This component renders a table of articles. It takes as input an array of articles and a boolean indicating whether the table is loading.
   * You should use the Antd Table component to build this.
   * No data manipulation is needed here.
   * You will need to write a custom render function for the "published_at" column to format the date.
   *
   */

  const articleData: TableRow[] = articles.map((article, idx) => ({
    key: idx,
    title: article.title,
    source: article.news_site,
    published_at: article.published_at,
  }));

  const columns: TableProps<TableRow>["columns"] = [
    {
      title: "Title",
      dataIndex: "title",
      key: "title",
    },
    {
      title: "News Source",
      dataIndex: "source",
      key: "source",
    },
    {
      title: "Published At",
      dataIndex: "published_at",
      key: "published_at",
      render: (dt) =>
        new Date(dt).toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        }),
    },
  ];

  return (
    <Table<TableRow>
      columns={columns}
      dataSource={articleData}
      pagination={false}
    />
  );
};

export default ArticleTable;
