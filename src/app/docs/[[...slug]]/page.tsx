type Props = {
  params: Promise<{
    slug: string[];
  }>;
};

export default async function DocsPage({ params }: Props) {
  const { slug } = await params;

  return <pre>{JSON.stringify(slug, null, 2)}</pre>;
}
