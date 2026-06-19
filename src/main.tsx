import React from "react";
import ReactDOM from "react-dom/client";
import ReactMarkdown from "react-markdown";
import { useEffect, useState } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Link,
  useParams
} from "react-router-dom";

import "./brutal.css";

function HomePage() {
  const [hero, setHero] = useState({
    title: "Loading...",
    subtitle: "",
    image: ""
  });

  const [articles, setArticles] = useState<any[]>([]);

  useEffect(() => {
    loadHero();
    loadArticles();
  }, []);

  async function loadHero() {
    try {
      const res = await fetch("/api/site/hero");
      const data = await res.json();
      setHero(data);
    } catch (err) {
      console.error(err);
    }
  }

  async function loadArticles() {
    try {
      const res = await fetch("/api/articles?page=1&size=10");
      const data = await res.json();

      setArticles(
        data.data?.data ||
        data.data ||
        []
        );
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <div className="container">
      <header className="navbar">
       <div className="logo">BrutalStack</div>
      </header>

      <section className="hero">
        <div>
          <h1>{hero.title}</h1>
          <p>{hero.subtitle}</p>
        </div>

        {hero.image && (
          <img
            src={hero.image}
            className="hero-image"
          />
        )}
      </section>

      <h2 className="section-title">
        Latest Articles
      </h2>

      <div className="grid">
        {articles.map((article) => (
          <div
            key={article.id}
            className="card"
          >
            <h3>{article.title}</h3>

            <p>{article.excerpt}</p>

            <Link
                    className="button"
                    to={`/article/${article.alias}`}
                >
                    Read More
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}

function ArticlePage() {

  const { alias } = useParams();

  const [article,setArticle] = useState<any>(null);

  useEffect(() => {

    if(!alias) return;

    fetch(`/api/article/${alias}`)
      .then(r => r.json())
      .then(data => {

        if(data.code === 200){
          setArticle(data.data);
        }

      });

  }, [alias]);

  if(!article){

    return (
      <div className="container">
        Loading...
      </div>
    );

  }

  return (

    <div className="container">

      <div className="article">

        {
          article.article_cover &&
          (
            <img
              src={article.article_cover}
              className="article-cover"
            />
          )
        }

        <h1>
          {article.article_name}
        </h1>

        <div className="article-meta">

          <span>
            {article.author}
          </span>

          <span>
            {article.create_time}
          </span>

        </div>

        <p className="excerpt">
          {article.excerpt}
        </p>

        <div className="article-content">

            <ReactMarkdown>
                {article.article_content}
            </ReactMarkdown>

        </div>

      </div>

    </div>

  );

}


function CategoriesPage() {

  return (
    <div className="container">

      <h1>Categories</h1>

    </div>
  );

}

function TagsPage() {

  return (
    <div className="container">

      <h1>Tags</h1>

    </div>
  );

}

function SearchPage() {

  return (
    <div className="container">

      <h1>Search</h1>

    </div>
  );

}

function App() {

  return (

    <BrowserRouter>

      <Routes>

        <Route
          path="/"
          element={<HomePage />}
        />

        <Route
          path="/article/:alias"
          element={<ArticlePage />}
        />

        <Route
          path="/categories"
          element={<CategoriesPage />}
        />

        <Route
          path="/tags"
          element={<TagsPage />}
        />

        <Route
          path="/search"
          element={<SearchPage />}
        />

      </Routes>

    </BrowserRouter>

  );

}
ReactDOM.createRoot(
  document.getElementById("root")!
).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

