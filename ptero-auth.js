const fetch = require('node-fetch');

exports.handler = async function(event, context) {
    const headers = {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "Content-Type",
        "Access-Control-Allow-Methods": "POST, OPTIONS"
    };

    if (event.httpMethod === "OPTIONS") {
        return { statusCode: 200, headers, body: "" };
    }

    if (event.httpMethod !== "POST") {
        return { statusCode: 405, headers, body: "Method Not Allowed" };
    }

    try {
        const { email, password } = JSON.parse(event.body);

        if (!email || !password) {
            return { statusCode: 400, headers, body: JSON.stringify({ error: "Email aur Password dono zaroori hain!" }) };
        }

        const loginUrl = "https://node.gtnodesop.qzz.io/auth/login";
        
        const loginResponse = await fetch(loginUrl, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            },
            body: JSON.stringify({ username: email, password: password })
        });

        if (!loginResponse.ok) {
            return { statusCode: 401, headers, body: JSON.stringify({ error: "Galat Email ya Password! Panel check karein." }) };
        }

        const cookies = loginResponse.headers.get('set-cookie');

        const serverResponse = await fetch("https://node.gtnodesop.qzz.io/api/client", {
            method: "GET",
            headers: {
                "Accept": "application/json",
                "Cookie": cookies
            }
        });

        const serverData = await serverResponse.json();

        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({
                success: true,
                username: email,
                servers: serverData.data || []
            })
        };

    } catch (error) {
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({ error: "Panel se connection fail: " + error.message })
        };
    }
};
