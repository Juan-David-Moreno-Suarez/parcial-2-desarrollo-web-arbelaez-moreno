import { useData } from '../hooks/useAPI';

export default function CategoryList() {
  const { data, loading, error } = useData(1);

  if (loading) return <p>Cargando...</p>;
  if (error)   return <p>Error: {error.message}</p>;

  return (
    <select disabled={loading}>
      <option></option>
      {(data ?? []).map((p, i) => (
        <option key={i}>{p.nombre} — ${p.precio}</option>
      ))}     
    </select>
  );
}