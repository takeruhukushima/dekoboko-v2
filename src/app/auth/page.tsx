'use client';
import { useState } from 'react';

export default function AuthPage() {
	const [handle, setHandle] = useState('');

	const handleSubmit = async (event) => {
		event.preventDefault();
		const response = await fetch('/api/auth', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({ handle }),
		});
		// Handle the response as needed
	};

	return (
		<div className="container mx-auto p-4">
			<div id="root">
				<div id="header">
					<h1>Statusphere</h1>
					<p>Set your status on the Atmosphere.</p>
				</div>
				<div className="container">
					<form onSubmit={handleSubmit} className="login-form">
						<input
							type="text"
							name="handle"
							placeholder="Enter your handle (eg alice.bsky.social)"
							value={handle}
							onChange={(e) => setHandle(e.target.value)}
							required
						/>
						<button type="submit">Log in</button>
					</form>
					<div className="signup-cta">
						Dont have an account on the Atmosphere?
						<a href="https://bsky.app">Sign up for Bluesky</a> to create one now!
					</div>
				</div>
			</div>
		</div>
	)
}