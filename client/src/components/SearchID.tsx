/* eslint-disable @next/next/no-img-element */
import React, { useEffect, useRef, useState } from "react";
import {
  Button,
  Checkbox,
  Divider,
  Form,
  Input,
  Pagination,
  Skeleton,
  Space,
  Switch,
  Typography,
} from "antd";
import { pages } from "next/dist/build/templates/app-page";

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  created_at: string;
}


const SearchID: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [keywordSearch, setKeywordSearch] = useState<boolean>(false);
  const [httpErrorCode, setHttpErrorCode] = useState<string>("");
  const [httpErrorMessage, setHttpErrorMessage] = useState<string>("");

  useEffect(() => {
    async function getProducts() {
      setLoading(true);
      let productsApiURL = `http://localhost:5001/products`;

      const encodedQuery = encodeURIComponent(searchQuery);
      if (!searchQuery || keywordSearch) {
        productsApiURL += `/search/${encodedQuery}`; // `?page=${currentPage}&limit=${pageSize}&q=${encodedQuery}`;
      } else {
        productsApiURL += `/${encodedQuery}`;
      }

      const respProducts = await fetch(productsApiURL);
      const productsData = await respProducts.json();
      if (!respProducts.ok) {
        setHttpErrorCode(`${respProducts.status}`);
        setHttpErrorMessage(productsData.detail[0].msg);
        setLoading(false);
        return [];
      }


      setProducts(productsData);
      setHttpErrorCode("");
      setHttpErrorMessage("");
      setLoading(false);
    }
    getProducts().catch(console.error);
  }, [currentPage, pageSize, searchQuery, keywordSearch]);

  const totalProducts = 5;

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

  const handleSearchSwitch = () => setKeywordSearch(!keywordSearch);

  const handleProductCreation = (product: ProductFormField) => {
    (async (product: ProductFormField) => {
      const res = await fetch("http://localhost:5001/products/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(product),
      });
      console.log(res);
    })(product).catch(console.error);
  };

  return (
    <div style={{ width: "100%" }}>
      <div style={{ marginBottom: "10px" }}>
        Add a new product:
        <Form
          name="basic"
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 16 }}
          style={{ maxWidth: 600 }}
          initialValues={{ remember: true }}
          onFinish={handleProductCreation}
          autoComplete="off"
        >
          <Form.Item<ProductFormField>
            label="Title"
            name="title"
            rules={[
              { required: true, message: "Please input a product name!" },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item<ProductFormField>
            label="Description"
            name="description"
            rules={[{ required: true, message: "Please input a description!" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
            <Button type="primary" htmlType="submit">
              Submit
            </Button>
          </Form.Item>
        </Form>
        View as:{" "}
        <Space direction="vertical">
          <Switch
            checkedChildren="Keyword"
            unCheckedChildren="ID"
            onChange={handleSearchSwitch}
          />
        </Space>
        {"\t"}
        (Switch between searching by ID or by keywords)
      </div>
      <Input.Search
        placeholder={`Search ${keywordSearch ? "keywords" : "ID"}`}
        size="large"
        onSearch={handleSearch}
        onChange={handleSearchInputChange}
        defaultValue={searchQuery}
        style={{ marginBottom: "1em" }}
      />
      <Typography.Title level={2}>Products</Typography.Title>
      {loading ? (
        <Skeleton active />
      ) : httpErrorCode !== "" ? (
        <Typography.Text>
          Error {httpErrorCode} - {httpErrorMessage}{" "}
        </Typography.Text>
      ) : products.length === 0 ? (
        <Typography.Text>No matching products found.</Typography.Text>
      ) : (
        products.map((product: Product, idx: number) => (
          <div key={idx}>
            <div>
              <h4>
                {product.id}: {product.name}
              </h4>
              <p>
                {product.description}
                <br />
                Price: {product.price}
                <br />
                Created At: {product.created_at}
              </p>
            </div>
            <br />
          </div>
        ))
      )}
      <Pagination
        style={{ padding: ".5em" }}
        current={currentPage}
        pageSize={pageSize}
        total={totalProducts}
        onChange={handlePageChange}
        onShowSizeChange={handlePageSizeChange}
        pageSizeOptions={[10, 20, 30, 40]}
      />
    </div>
  );
};

type ProductFormField = {
  title: string;
  description: string;
};

export default SearchID;
