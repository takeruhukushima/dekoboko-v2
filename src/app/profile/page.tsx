"use client";

export default function ProfilePage() {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold text-center">Your Profile</h1>
      <div className="mt-6">
        <p className="text-lg">Name: John Doe</p>
        <p className="text-lg">Bio: Aspiring Developer</p>
        <p className="text-lg">Achievements:</p>
        <ul className="list-disc ml-8">
          <li>Completed "Convex Quest #1"</li>
          <li>Earned "Intermediate Designer" Badge</li>
        </ul>
      </div>
    </div>
  );
}
