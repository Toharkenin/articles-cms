import Articles from "./articals/page";
import ArticleCard from "../../components/layout/article-card";
import Footer from "../../components/layout/footer";
import Hero from "../../components/layout/hero";

export default function Home() {
  return (
    <div>
      <Hero />
      <Articles />
    </div>
  );
}