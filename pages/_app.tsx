const login = async (username, password, save, url) => {
    setLoading(true);
    try {
        // Ensure NO trailing slash in process.env.NEXT_PUBLIC_BACKEND_URL
        const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
        
        const response = await fetch(`${backendUrl}/login`, {
            method: 'POST',
            mode: 'cors', // Explicitly set cors mode
            headers: { 
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({ 
                url: url || districtURL, 
                username, 
                password 
            })
        });
        
        if (response.status === 405) {
            throw new Error("Server rejected the request method (405). Check backend routing.");
        }

        const data = await response.json();
        if (!data.success) throw new Error(data.message || "Login failed");

        setClient(data.client);
        // ... rest of your save logic
        setLoading(false);
        return true;
    } catch (err: any) {
        setToasts((prev) => [...prev, { title: err.message, type: "error" }]);
        setLoading(false);
        return false;
    }
};
