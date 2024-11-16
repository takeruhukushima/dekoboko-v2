"use client";

import Link from "next/link";
import styles from "@/styles/Home.module.css";

export default function HomePage() {
  return (
    <div className="container mx-auto p-4">
      <h1 className={styles.heading}>Welcome to Dekoboko</h1>
      <p className="text-center mt-4">
        Join projects, form parties, and grow together!
      </p>
      <div className="flex justify-center mt-6 space-x-4">
        <Link href="/profile" className={`${styles.button} ${styles["blue-button"]}`}>
          View Profile
        </Link>
        <Link href="/quest" className={`${styles.button} ${styles["green-button"]}`}>
          Explore Quests
        </Link>
      </div>
    </div>
  );
}
