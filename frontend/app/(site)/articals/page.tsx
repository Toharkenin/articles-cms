import ArticleCard from "../components/article-card";

const articles = [
  {
    id: 1,
    title: "The Shifting Balance of Power",
    category: "Analysis",
    image: "/hero.jpg",
    author: "John Doe",
  },
  {
    id: 2,
    title: "Climate Change: A Global Challenge",
    category: "Environment",
    image: "/hero.jpg",
    author: "Jane Smith",
  },
  {
    id: 3,
    title: "The Future of Artificial Intelligence",
    category: "Technology",
    image: "/hero.jpg",
    author: "Mike Johnson",
  },
  {
    id: 4,
    title: "Economic Trends in 2026",
    category: "Economy",
    image: "/hero.jpg",
    author: "Sarah Williams",
  },
  {
    id: 5,
    title: "Healthcare Innovations",
    category: "Health",
    image: "/hero.jpg",
    author: "Dr. Emily Brown",
  },
  {
    id: 6,
    title: "Education Reform Debate",
    category: "Education",
    image: "/hero.jpg",
    author: "Robert Davis",
  },
];

export default function Articles() {
  return (
    <div className="py-8">
      <h1 className="text-4xl font-bold font-serif mb-8">All Articles</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {articles.map((article) => (
          <ArticleCard
            key={article.id}
            title={article.title}
            category={article.category}
            image={article.image}
            author={article.author}
          />
        ))}
      </div>
    </div>
  );
}
