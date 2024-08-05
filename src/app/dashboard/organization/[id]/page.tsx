export default function ViewOrganization({
  params,
}: {
  params: { id: string };
}) {
  return (
    <div>
      <h1>Organization {params.id}</h1>
    </div>
  );
}
