import React from "react";
import Hero from "../../components/hero/Hero";
import "./home.css";
import Popular from "../../components/popular/Popular";
import PhilosophyCategory from "../../components/Philosophy/PhilosophyCategory";
import History from "../../components/history/History";
import Banner from "../../components/banner/Banner";


export default function Home() {
  return (
    <main className="home-page">
      <Hero />
      <Popular />
      <PhilosophyCategory />
      <History />
      <Banner />
    </main>
  );
}
