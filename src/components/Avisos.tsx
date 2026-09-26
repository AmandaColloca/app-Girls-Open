export default function Avisos({ erros }: { erros: string[] }) {
  if (erros.length === 0) return null;
  return (
    <div className="aviso" role="status">
      <strong>Parte dos dados não carregou.</strong>
      <ul>
        {[...new Set(erros)].map((e) => (
          <li key={e}>{e}</li>
        ))}
      </ul>
    </div>
  );
}
