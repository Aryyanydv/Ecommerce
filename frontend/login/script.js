async function fetchApi(data) {
    const response = await fetch("http://localhost:5000/user/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(data),
    });

    const result = await response.json();
    return result;
}

document.getElementById("loginForm").addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    try {
        const result = await fetchApi({ emailId: email, password });
        console.log("Login result:", result);

        if (result.message && result.message.includes("Otp sent")) {
            localStorage.setItem("userEmail", email);
            alert(result.message);
            window.location.href = "./otp.html";
        } else {
            alert(result.message || "Login failed");
        }

    } catch (error) {
        console.log("Error during login:", error.message || error);
        alert("An error occurred during login.");
    }
});