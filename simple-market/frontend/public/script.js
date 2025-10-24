
let cart = JSON.parse(localStorage.getItem('cart')) || [];

function addToCart(item) {
  const existingItem = cart.find(i => i.id === item.id);
  cart.push({ ...item, quantity: 1 });
  localStorage.setItem('cart', JSON.stringify(cart));
  showCart();
  updateCartCount();
  alert(`${item.name} added to cart!`);
}

function removeFromCart(itemId) {
  const itemIndex = cart.findIndex(i => i.id === itemId);
  if (itemIndex === -1) return;

  if (cart[itemIndex].quantity > 1) {
    cart[itemIndex].quantity -= 1;
  } else {
    cart.splice(itemIndex, 1);
  }
  localStorage.setItem('cart', JSON.stringify(cart));
  showCart();
  updateCartCount();
}

function showCart() {
  const cartContainer = document.getElementById('cart-container');
  if (!cartContainer) return;
  cartContainer.innerHTML = '';

  let total = 0;

  cart.forEach(item => {
    const div = document.createElement('div');
    div.className = 'product-card';
    div.innerHTML = `
      <h3>${item.name}</h3>
      <p>$${item.price} x ${item.quantity}</p>
      <button onclick="removeFromCart(${item.id})">Remove</button>
    `;
    cartContainer.appendChild(div);

    total += item.price * item.quantity;
  });

  const totalDiv = document.createElement('div');
  totalDiv.style.textAlign = "right";
  totalDiv.style.fontWeight = "bold";
  totalDiv.style.fontSize = "18px";
  totalDiv.style.marginTop = "20px";
  totalDiv.textContent = `Total: $${total}`;
  cartContainer.appendChild(totalDiv);
}

function updateCartCount() {
  const count = cart.reduce((sum, item) => sum + item.quantity, 0);
  let countSpan = document.getElementById('cart-count');
  if (!countSpan) {
    const nav = document.querySelector('header nav');
    const a = document.createElement('a');
    a.href = "cart.html";
    a.innerHTML = `<i class="fa fa-shopping-cart"></i> Cart (<span id="cart-count">${count}</span>)`;
    nav.appendChild(a);
  } else {
    countSpan.textContent = count;
  }
}

document.addEventListener('DOMContentLoaded', () => {
  showCart();
  updateCartCount();
});
