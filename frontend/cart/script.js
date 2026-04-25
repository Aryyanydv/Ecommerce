
const BASE_URL = "http://localhost:5000"; 

function getImageUrl(path) {
  return `${BASE_URL}/${path}`;
}

async function fetchCart() {
  try {
    const res = await fetch(`${BASE_URL}/cart`, {
      method: "GET",
      credentials: "include"
    });
    if (!res.ok) {
      const text = await res.text();
      console.log("Error:", text);
      throw new Error("Failed to fetch cart");
    }
    const data = await res.json();
    console.log("Cart:", data);
    const items = data.items || data;
    const mainDiv = document.getElementById("cart-items");
    mainDiv.innerHTML = "";
    let total = 0;
    items.forEach(item => {
      const name = item.name;
      const image = item.image;
      const variant = item.variant;
      if (!variant) return;
      const price = variant.price;
      const quantity = item.quantity;
      total += price * quantity;
      const div = document.createElement("div");
      div.className = "cartItemDiv";
      div.innerHTML = `
        <img src="${getImageUrl(image)}" class="cart-item-image">
        <div class="cart-item-details">
          <h3>${name}</h3>
          <p>${variant.color} / ${variant.size}</p>
          <p>₹${price}</p>
          <p>Qty: ${quantity}</p>
        </div>
      `;
      mainDiv.appendChild(div);
    });

    document.getElementById("total-price").textContent = `${total}`;

  } catch (err) {
    console.log("Cart error:", err.message);
  }
}

fetchCart();

const address = document.getElementById("address").value;
async function handlePayment(){
  try{
    const res = await fetch(`${BASE_URL}/create-razorpay-order`, {
      method: "POST",
      credentials: "include",
      headers: {
       "Content-Type": "application/json"
      },
      body: JSON.stringify({
      useWallet: true, // or true
      couponCode: "SAVE100" // optional
  })
    });
    const data = await res.json();
    if(!data.success){
      throw new Error(data.message || "Failed to create Razorpay order");
    }
    const { razorpayOrderId, amount, currency } = data.data;
    const options = {
      key : "rzp_test_SYtgn2sWZzGPAa",
      amount : amount,
      currency : currency,
      name : "E-Commerce",
      description : "Test Transaction",
      order_id : razorpayOrderId,
      handler: async function (response) {
          console.log("Payment success:", response);
          const verifyRes = await fetch("http://localhost:5000/verify-payment", {
             method: "POST",
             credentials: "include",
             headers: {
             "Content-Type": "application/json"
          },
      credentials: "include",
      body: JSON.stringify({...response,address: address })
     });
      const data = await verifyRes.json();
     if (data.success) {
        alert("Order placed successfully ");
     } else {
        alert("Something went wrong ");
        }
    },
      prefill : {
        name : "Dhruv",
        email : "nanurao67@gmail.com"
      },
      theme : {
        color : "#3399cc"
      }
    };
    const rzp = new Razorpay(options);
    rzp.open();
    }
  catch(err){
    console.log("Payment error:", err.message);
  }
}
