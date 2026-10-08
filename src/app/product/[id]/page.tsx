export default function ProductDetailPage({ params }: { params: { id: string } }) {
  return (
    <div style={{ padding: '20px' }}>
      <h1>Detail Produk: {params.id}</h1>
    </div>
  );
}