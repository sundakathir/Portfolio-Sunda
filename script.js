const menuData = [
    {
        name: "Dashboard Reports",
        children: [
            {
                name: "Sales",
                children: [
                    { name: "Customer Sales" },
                    { name: "Product Sales" }
                ]
            },
            {
                name: "Finance",
                children: [
                    { name: "Profit & Loss" }
                ]
            }
        ]
    },
    {
        name: "Tabulated Report",
        children: [
            {
                name: "Sales",
                children: [
                    { name: "Customer Sales" }
                ]
            }
        ]
    }
];

const menuContainer = document.getElementById("menu");

function createMenu(items) {
    return items.map(item => {
        let li = document.createElement("li");
        li.classList.add("menu-item");
        li.textContent = item.name;

        if (item.children) {
            let subUl = document.createElement("ul");
            subUl.classList.add("submenu");

            subUl.append(...createMenu(item.children));

            li.appendChild(subUl);

            li.addEventListener("click", (e) => {
                e.stopPropagation();
                li.classList.toggle("active");
            });
        }

        return li;
    });
}

menuContainer.append(...createMenu(menuData));

// ======== FORM SUBMISSION TO GOOGLE SHEETS ========
const form = document.querySelector('.con form');

if (form) {
  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Get form data
    const formData = {
      name: document.getElementById('name').value.trim(),
      email: document.getElementById('email').value.trim(),
      contactNo: document.getElementById('contactNo').value.trim(),
      message: document.getElementById('message').value.trim(),
      timestamp: new Date().toLocaleString()
    };

    // Validate form
    const msgEl = form.querySelector('.form-message');
    function showMessage(text, type = 'info') {
      if (!msgEl) {
        alert(text);
        return;
      }
      msgEl.textContent = text;
      msgEl.classList.remove('success', 'error', 'info');
      msgEl.classList.add(type);
      msgEl.style.display = 'block';
      if (type === 'success') {
        setTimeout(() => { msgEl.style.display = 'none'; }, 6000);
      }
    }

    if (!formData.name || !formData.email || !formData.contactNo || !formData.message) {
      showMessage('Please fill in all fields', 'error');
      return;
    }

    // Show loading state
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Sending...';
    submitBtn.disabled = true;

    try {
      // Send data to Google Apps Script
      // REPLACE 'YOUR_GOOGLE_SCRIPT_URL' with your actual Google Apps Script URL
      const response = await fetch('https://script.google.com/macros/s/AKfycbwtYyDNOJtxBzBHIoGzG2A6YMJ65dxRDFrbiTsNq7wgL75ucW9jhHLW_9QBwsemVwSf/exec', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      const result = await response.json();

      if (result.status === 'success') {
        showMessage('✓ Your message has been sent successfully! We\'ll get back to you soon.', 'success');
        form.reset();
      } else {
        showMessage('Error sending message. Please try again.', 'error');
      }
    } catch (error) {
      console.error('Error:', error);
      const msgElCatch = form.querySelector('.form-message');
      if (msgElCatch) {
        msgElCatch.textContent = 'Error sending message. Please try again.';
        msgElCatch.classList.remove('success');
        msgElCatch.classList.add('error');
        msgElCatch.style.display = 'block';
      } else {
        alert('Error sending message. Please try again.');
      }
    } finally {
      submitBtn.textContent = originalText;
      submitBtn.disabled = false;
    }
  });
}