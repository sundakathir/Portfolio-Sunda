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