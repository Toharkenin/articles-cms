type Props = {
  title: string;
  category: string;
  image: string;
  author: string;
};

export default function ArticleCard({
  title,
  category,
  image,
  author,
}: Props) {
  return (
    <div className="border rounded-md overflow-hidden hover:shadow-md transition">
      <img src={image} className="w-full h-44 object-cover" />

      <div className="p-4">
        <p className="text-xs text-gray-500 uppercase">{category}</p>

        <h3 className="font-serif font-semibold text-lg mt-2">{title}</h3>

        <p className="text-sm text-gray-500 mt-3">{author}</p>
      </div>
    </div>
  );
}
