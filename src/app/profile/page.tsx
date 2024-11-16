"use client";

export default function ProfilePage() {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold text-center">Your Profile</h1>
      <div className="mt-6">
        <p className="text-lg">Name: John Doe</p>
        <p className="text-lg">Bio: I&apos;m working on something &quot;cool&quot;!</p>
        <p className="text-lg">Achievements:</p>
        <ul className="list-disc ml-8">
          <li>Completed &quot;Convex Quest #1&quot;</li>
          <li>Earned &quot;Intermediate Designer&quot; Badge</li>
        </ul>
      </div>
    </div>
  );
}
