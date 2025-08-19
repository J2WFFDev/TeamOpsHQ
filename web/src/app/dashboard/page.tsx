export default function Dashboard() {
  // Auth removed for initial build; show placeholder dashboard info
  const userEmail = 'unknown'
  const role = 'PARENT'
  return (
    <div className="space-y-2">
      <h1 className="text-2xl font-semibold">Dashboard</h1>
      <p>Signed in as {userEmail} with role <b>{role}</b>.</p>
      <ul className="list-disc pl-6">
        <li>Admins: manage programs/teams/users.</li>
        <li>Coaches: manage team events and quick notes.</li>
        <li>Parents/Athletes: view assigned teams & events.</li>
      </ul>
    </div>
  )
}
