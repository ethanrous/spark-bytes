import { Inter } from "next/font/google";
import { Skeleton, Typography } from "antd";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Article } from "@/types/types";
import ArticleCard from "@/components/ArticleCard";

const inter = Inter({ subsets: ["latin"] });

// You don't need to edit this file

export default function Home() {
  const [latestArticle, setLatestArticle] = useState<Article[]>([]);
  useEffect(() => {
    async function getLatestArticle() {
      const resp = await fetch(
        "https://api.spaceflightnewsapi.net/v4/articles/?has_launch=true&ordering=-published_at&limit=1"
      );
      if (!resp.ok) return [];

      const data = await resp.json();

      setLatestArticle(data.results);
    }
    getLatestArticle().catch(console.error);
  }, []);
  return (
    <>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          justifyContent: "flex-start",
        }}
      >
        <Typography.Title>Space! News</Typography.Title>
        <Typography.Paragraph>
          Welcome to Space! News, your go-to source for the latest news and
          updates on space exploration, astronomy, and everything in between.
          Our team of experienced journalists and space enthusiasts are
          dedicated to bringing you the most accurate and up-to-date information
          on the latest discoveries, missions, and events happening in the
          cosmos.
        </Typography.Paragraph>
        <Typography.Paragraph>
          From the latest Mars rover missions to the search for extraterrestrial
          life, we cover it all. Our articles are written in an
          easy-to-understand format, so you you do not need to be a rocket
          scientist to enjoy them. We also feature stunning images and videos
          from space, so you can experience the beauty and wonder of the
          universe from the comfort of your own home.
        </Typography.Paragraph>
        <Typography.Paragraph>
          So whether you are a space enthusiast, a science buff, or just someone
          who loves to learn new things, Space! News has something for you. Be
          sure to check back often for the latest updates and stories from the
          final frontier.
        </Typography.Paragraph>
        {/* You can add the "latest article" feature on the website for a bonus */}
        <div style={{ width: "33.5%" }}>
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              width: "100%",
            }}
          >
            <Typography.Title level={2}>Latest Article</Typography.Title>
            <Link href="/news">See all articles</Link>
          </div>
          {latestArticle.length === 0 ? (
            <Skeleton />
          ) : (
            <ArticleCard article={latestArticle[0]} />
          )}
        </div>
      </div>
    </>
  );
}
