import React from "react";
import Hero from "../../components/hero/Hero";
import "./home.css";

import Banner from "../../components/banner/Banner";
import HomeBookRow from "../../components/HomeBooksRow/HomeBookRow";
import { getBooksByTopic, getPopularBooksFlat } from "../../constants/booksData";

export default function Home() {
  return (
    <main className="home-page">
      <Hero />
      <HomeBookRow
        title="الأكثر رواجاً"
        linkTo="/popular"
        fetchFn={() => getPopularBooksFlat(5)}
        dark
      />

      <HomeBookRow
        title="الفلسفة"
        description="استكشف أعمق الكتب والأفكار الفلسفية"
        linkTo="/categories/philosophy"
        fetchFn={() => getBooksByTopic("philosophy", 5)}
        divider
        shadow
      />

      <HomeBookRow
        title="التاريخ"
        description="أسرار التاريخ وحكايات الأمم بين يديك"
        linkTo="/categories/history"
        fetchFn={() => getBooksByTopic("history", 5)}
        dark
      />
      <Banner />
    </main>
  );
}
