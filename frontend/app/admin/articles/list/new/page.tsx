import CreateArticleForm from './create-article-form';

export default function NewArticlePage() {
  return (
    <div className="w-full px-8 py-8">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-slate-900">New Article</h1>
      </div>

      <CreateArticleForm />
    </div>
  );
}
