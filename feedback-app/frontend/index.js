
async function loadComponent(componentPath, targetId) {
    // 1️⃣ Load HTML
    const htmlResponse = await fetch(`${componentPath}.html`);
    const html = await htmlResponse.text();
    document.getElementById(targetId).innerHTML = html;

    // 2️⃣ Load CSS
    const cssLink = document.createElement('link');
    cssLink.rel = 'stylesheet';
    cssLink.href = `${componentPath}.css`;
    document.head.appendChild(cssLink);

    // 3️⃣ Load JS
    const script = document.createElement('script');
    script.src = `${componentPath}.js`;
    script.defer = true;  // ensures it loads after HTML is set
    document.body.appendChild(script);
}


loadComponent('/components/feature-list/feature-list', 'feature-requests-container');   