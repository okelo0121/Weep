import React from 'react';
import {
  FileJson2,
  Target,
  Filter,
  Zap,
  FileSearch,
  ArrowDownUp,
  Library,
  ArrowRight,
} from 'lucide-react';

const featureCardsData = [
  {
    icon: <FileJson2 className="h-6 w-6 text-foreground" />,
    title: 'Embeddings',
    description: 'Choose from our leading hosted models or bring your own vectors.',
    href: 'https://docs.pinecone.io/models/overview',
  },
  {
    icon: <Target className="h-6 w-6 text-foreground" />,
    title: 'Optimized recall',
    description: 'Benchmark leading algorithms maximize recall with low latency.',
    href: 'https://docs.pinecone.io/reference/architecture/serverless-architecture',
  },
  {
    icon: <Filter className="h-6 w-6 text-foreground" />,
    title: 'Filters',
    description: 'Retrieve only the vectors that match your metadata filters.',
    href: 'https://docs.pinecone.io/guides/data/query-data#filter-by-metadata',
  },
  {
    icon: <Zap className="h-6 w-6 text-foreground" />,
    title: 'Real-time indexing',
    description: 'Upserted and updated vectors are dynamically indexed in real-time to ensure fresh reads.',
    href: 'https://docs.pinecone.io/reference/architecture/serverless-architecture',
  },
  {
    icon: <FileSearch className="h-6 w-6 text-foreground" />,
    title: 'Full-text search',
    description: "Get an exact keyword match with sparse indexes when semantic search isn't enough.",
    href: 'https://docs.pinecone.io/guides/indexes/understanding-indexes#sparse-indexes',
  },
];


interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  href: string;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ icon, title, description, href }) => (
  <a
    href={href}
    className="group relative block rounded-lg border border-border bg-card p-8 shadow-[0_2px_8px_rgba(0,0,0,0.08)] transition-shadow duration-200 hover:shadow-[0_4px_16px_rgba(0,0,0,0.12)]"
  >
    <div className="flex h-10 w-10 items-center justify-center rounded-md border border-border bg-secondary">
      {icon}
    </div>
    <h3 className="mt-6 text-xl font-semibold text-foreground">{title}</h3>
    <p className="mt-2 text-base text-muted-foreground">{description}</p>
    <div className="mt-6 flex items-center text-sm font-semibold text-primary opacity-0 transition-opacity group-hover:opacity-100">
      Learn more
      <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
    </div>
  </a>
);

const SearchFeaturesSection = () => {
  return (
    <section className="border-b border-border bg-background py-16 md:py-24">
      <div className="container">
        <div className="relative px-4 sm:px-8">
          <div className="text-center">
            <span className="text-overline-eyebrow text-primary">Search</span>
            <h2 className="mt-4 text-[3rem] font-bold leading-[58px] tracking-tight text-foreground">
              Relevance, delivered
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-body-large text-text-secondary">
              Advanced retrieval capabilities for precise search across dynamic datasets.
            </p>
          </div>

          <div className="mt-12 grid grid-cols-1 gap-4 lg:grid-cols-3">
            <div className="grid grid-cols-1 gap-4 lg:col-span-2 sm:grid-cols-2 lg:grid-cols-3">
              {featureCardsData.map((card, index) => (
                <FeatureCard
                  key={index}
                  icon={card.icon}
                  title={card.title}
                  description={card.description}
                  href={card.href}
                />
              ))}
            </div>

            <div className="flex flex-col gap-4">
              <a href="https://docs.pinecone.io/guides/inference/rerank" className="group relative block rounded-lg border border-border bg-card p-8 shadow-[0_2px_8px_rgba(0,0,0,0.08)] transition-shadow duration-200 hover:shadow-[0_4px_16px_rgba(0,0,0,0.12)]">
                <div className="flex h-10 w-10 items-center justify-center rounded-md border border-border bg-secondary">
                  <ArrowDownUp className="h-6 w-6 text-foreground" />
                </div>
                <h3 className="mt-6 text-xl font-semibold text-foreground">Rerankers</h3>
                <p className="mt-2 text-base text-muted-foreground">Add an extra layer of precision with rerankers to boost the most relevant matches.</p>
                 <div className="mt-6 flex items-center text-sm font-semibold text-primary opacity-0 transition-opacity group-hover:opacity-100">
                  Learn more
                  <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </div>
              </a>
              <a href="https://docs.pinecone.io/guides/indexes/implement-multitenancy" className="group relative block rounded-lg border border-border bg-card p-8 shadow-[0_2px_8px_rgba(0,0,0,0.08)] transition-shadow duration-200 hover:shadow-[0_4px_16px_rgba(0,0,0,0.12)]">
                <div className="flex h-10 w-10 items-center justify-center rounded-md border border-border bg-secondary">
                  <Library className="h-6 w-6 text-foreground" />
                </div>
                <h3 className="mt-6 text-xl font-semibold text-foreground">Namespaces</h3>
                <p className="mt-2 text-base text-muted-foreground">Create partitions of your data with namespaces to ensure tenant isolation.</p>
                 <div className="mt-6 flex items-center text-sm font-semibold text-primary opacity-0 transition-opacity group-hover:opacity-100">
                  Learn more
                  <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </div>
              </a>
              <div className="rounded-lg border border-border bg-card p-8 shadow-[0_2px_8px_rgba(0,0,0,0.08)]">
                <a
                  href="https://www.pinecone.io/blog/cascading-retrieval/"
                  className="font-semibold text-foreground transition-colors hover:text-primary hover:underline"
                >
                  Learn how to achieve best-in-class relevance with cascading retrieval
                </a>
                <a
                  href="https://www.pinecone.io/blog/cascading-retrieval/"
                  className="group mt-4 flex items-center font-semibold text-primary"
                >
                  View sample code
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SearchFeaturesSection;
