import { useData } from '../hooks/useAPI';

export default function CategoryList() {
  const { data, loading, error } = useData(6);

  if (loading) return <p>Cargando...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (

    <select name='categoria' required disabled={loading}>
      {(data ?? []).map((p, i) => (
        <option key={i}>{p.nombre}</option>
      ))}
    </select>
  );
}