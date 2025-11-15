async function login() {
    const response = await fetch('/api/accept-license', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ acceptedLicense: true })
    });

    if (response.ok) {
        const data = await response.json();
        var responseNext;
        if ((responseNext = await Registration(data.token, false)) === null) {
            throw new Error('Access denied!');
        }
        localStorage.setItem("jwt", data.token);

        return responseNext;
    } else {
        throw new Error('Login failed!');
    }
}

async function Registration(token, silent) {
    if (!token) {
        if (!silent) {
            alert('No token available. Please accept license first!');
        }
        return null;
    }
    try {
        const response = await fetch('/api/register/uk', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        if (response.status === 401) {
            console.error('Authentication failed: 401 Unauthorized');
            return null;
        }

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        return response;       
    }
    catch (error) {
        // This catch block handles network errors or errors thrown in the .then() block
        console.error('Fetch error:', error);

        return null;
    }

}

