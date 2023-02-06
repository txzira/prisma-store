"use client";
import { Product } from "@prisma/client";
import React, { useState } from "react";
import Image from "next/image";
import useSWR from "swr";

export default function AdminProductsPage() {
  return (
    <div>
      Admin Products Page
      <ProductForm />
      <ProductTable />
    </div>
  );
}

function ProductForm() {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [image, setImage] = useState("");

  async function submitForm(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const response = await fetch("/api/product/create-product", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, price, image }),
    });
  }

  return (
    <form onSubmit={}>
      <label htmlFor="name">Name</label>
      <input type="text" id="name" value={name} onChange={(e) => setName(e.target.value)} />
      <label htmlFor="price">Price</label>
      <input type="number" id="price" value={price} onChange={(e) => setPrice(e.target.value)} />
      <label htmlFor="productImage">Select an Image:</label>
      <input type="file" id="productImage" />
    </form>
  );
}

function ProductTable() {
  const fetcher = (url) => fetch(url).then((res) => res.json());
  const { data, error, isLoading } = useSWR("/api/product/get-product?limit=10&page=0&sortId=asc", fetcher);
  console.log(data);
  return (
    <table>
      <tr>
        <th>Id</th>
        <th>Image</th>
        <th>Name</th>
        <th>Price</th>
      </tr>
      {/* {products.map((product) => {
        return (
          <tr>
            <td>{product.id}</td>
            <td>
              <Image src={product.image} alt="product image" />
            </td>
            <td>{product.name}</td>
            <td>{product.price.toString()}</td>
          </tr>
        );
      })} */}
      <tr></tr>
    </table>
  );
}