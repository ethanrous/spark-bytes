{/* 
  client\src\pages\verify.tsx

  Purpose: 
    To handle the verification process for a user who has just signed up. 
	Specifically, it takes the userId from the query parameters, sends a 
	request to verify the user's account through the UserApi.verifyUser method, 
	and provides appropriate feedback to the user.
  */}
import { UserApi } from "@/api/userApi";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

function Verify() {
	const query = useSearchParams()
	const userId = query.get('userId')
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState<string>()
	const router = useRouter()

	useEffect(() => {
		if (!userId) { setError('Invalid user id'); setLoading(false); return }
		UserApi.verifyUser(userId).then((res) => { if (res.status !== 200) { setError(res.statusText) } else { setTimeout(() => router.push("/login"), 5000) } setLoading(false) }).catch((err) => {
			console.error('Error verifying user: ', err)
			setLoading(false)
			setError(err)
		})
	}, [userId, setError, setLoading, router])

	const style = {
		padding: '1rem',
	}

	if (loading) {
		return <div style={style}>Loading...</div>
	}

	if (error) {
		return <div style={style}>{error}</div>
	}

	return <div style={style}>Account verified, redirecting soon...</div>;
}

export default Verify
