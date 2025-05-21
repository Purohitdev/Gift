
interface ProductDescriptionProps {
  description?: string;
}

export default function ProductDescription({ description }: ProductDescriptionProps) {
  if (!description) {
    return null;
  }

  return (
    <section className="py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <h2 className="text-2xl sm:text-3xl font-serif font-bold mb-6 text-center">Product Description</h2>
        <div className="prose prose-lg max-w-none text-muted-foreground">
          <p>{description}</p>
        </div>
      </div>
    </section>
  );
}
