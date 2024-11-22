/* eslint-disable @next/next/no-img-element */
import React, { useEffect, useRef, useState } from "react";
import {
  Divider,
  Input,
  Pagination,
  Skeleton,
  Space,
  Switch,
  Typography,
} from "antd";
import ArticleList from "@/components/ArticleList";
import ArticleTable from "@/components/ArticleTable";
import ArticleStatistics from "@/components/ArticleStatistics";

const NewsPage: React.FC = () => {
  const [articles, setArticles] = useState<[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);
  const [totalArticles, setTotalArticles] = useState<number>(0);
  const [tableView, setTableView] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    async function getArticles() {
      setLoading(true);
      let apiURL = `https://api.spaceflightnewsapi.net/v4/articles/?has_launch=true&ordering=-published_at&limit=${pageSize}&offset=${
        (currentPage - 1) * pageSize
      }`;
      if (searchQuery) {
        apiURL += `&search=${encodeURIComponent(searchQuery)}`;
      }
      const resp = await fetch(apiURL);
      if (!resp.ok) return [];

      const data = await resp.json();

      setArticles(data.results);
      setTotalArticles(data.count);
      setLoading(false);
    }
    getArticles().catch(console.error);
  }, [currentPage, pageSize, searchQuery]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo(0, 0);
  };

  const handlePageSizeChange = (current: number, size: number) => {
    setCurrentPage(1);
    setPageSize(size);
    window.scrollTo(0, 0);
  };

  const handleSearch = (value: string) => {
    setSearchQuery(value);
    setCurrentPage(1);
  };

  const debounceTimer = useRef<NodeJS.Timeout | null>(null);

  const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }
    debounceTimer.current = setTimeout(() => {
      setSearchQuery(value);
      setCurrentPage(1);
    }, 500);
  };

  const handleViewModeSwitch = () => setTableView(!tableView);

  return (
    <div style={{ width: "100%" }}>
      {/* You can delete this div if you want */}
      <Input.Search
        placeholder="Search keywords"
        size="large"
        onSearch={handleSearch}
        onChange={handleSearchInputChange}
        defaultValue={searchQuery}
        style={{ marginBottom: "1em" }}
      />
      <div style={{ marginBottom: "10px" }}>
        View as:{" "}
        <Space direction="vertical">
          <Switch
            checkedChildren="Table"
            unCheckedChildren="Grid"
            onChange={handleViewModeSwitch}
          />
        </Space>
        {"\t"}
        (Switch between Table and Grid view)
      </div>
      <Typography.Title level={3}>Article Statistics</Typography.Title>
      {loading ? <Skeleton /> : <ArticleStatistics articles={articles} />}
      <Divider />
      <Typography.Title level={2}>Articles</Typography.Title>
      {/* Add conditional render logic for table vs grad/list */}
      {/* Add pagination control using Antd(lookup the component). The same one should be used for both the table and grid views */}
      {/* It should be centered on the page */}
      {/* When you change the page, or the items per page, it should reset the scroll to the top of the page */}
      {loading ? (
        <Skeleton active />
      ) : articles.length === 0 ? (
        <div style={{ textAlign: "center", padding: "5%" }}>
          <Typography.Text>No articles found.</Typography.Text>
        </div>
      ) : tableView ? (
        <ArticleTable articles={articles} />
      ) : (
        <ArticleList articles={articles} />
      )}
      <Pagination
        style={{ padding: ".5em" }}
        align="center"
        current={currentPage}
        pageSize={pageSize}
        total={totalArticles}
        onChange={handlePageChange}
        onShowSizeChange={handlePageSizeChange}
        pageSizeOptions={[10, 20, 30, 40]}
      />
    </div>
  );
};

export default NewsPage;
