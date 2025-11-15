function toggleContent(url, target, image) {
    const container = document.getElementById(target);
    const isExpanded = image.src.includes('less');

    if (isExpanded) {        
        container.classList.remove('show');
        container.innerHTML = '';
        image.src = image.src.replace('less', 'more');
    } else {
        fetch(url)
            .then(response => response.text())
            .then(html => {              
                // Create a temporary container to parse the HTML
                const temp = document.createElement('div');
                temp.innerHTML = html;

                // Move all child nodes to the target
                Array.from(temp.childNodes).forEach(node => {
                    // If it's a script, recreate it
                    if (node.nodeType === 1 && node.tagName === 'SCRIPT') {
                        const newScript = document.createElement('script');
                        if (node.src) {
                            newScript.src = node.src;
                        } else {
                            newScript.textContent = node.textContent;
                        }
                        container.appendChild(newScript); // or target.appendChild(newScript);
                    } else {
                        container.appendChild(node);
                    }
                });
                container.classList.add('show');
                image.src = image.src.replace('more', 'less');
                setURL('MyURL');
            });
    }
}

function updateContent(html, target) {
    const container = document.getElementById(target);
    container.innerHTML = '';
    
    const temp = document.createElement('div');
    temp.innerHTML = html;    
                // Move all child nodes to the target
    Array.from(temp.childNodes).forEach(node => {
                    // If it's a script, recreate it
                    if (node.nodeType === 1 && node.tagName === 'SCRIPT') {
                        const newScript = document.createElement('script');
                        if (node.src) {
                            newScript.src = node.src;
                        } else {
                            newScript.textContent = node.textContent;
                        }
                        container.appendChild(newScript); // or target.appendChild(newScript);
                    } else {
                        container.appendChild(node);
                    }
    });

    container.classList.add('show');
}

function rejectLicense(url, target, imageID) {
    let image = document.getElementById(imageID);
    toggleContent(url, target, image);
}
function setURL(urlTagID) {
    const urlElement = document.getElementById(urlTagID);

    // Set its text content to the current URL
    urlElement.textContent = window.location.href;

    if (urlElement.href) {
        urlElement.href = window.location.href;
    }
}

function moveForward(image) {
    let token = localStorage.getItem("jwt");
    if (token)
    { 
        Registration(token, true).then(result => {
            if (result === null) {
                throw "Помилка реєстрації";
            }

            result.text().then(html => {
                updateContent(html, 'target');
                console.log("Activation loaded successfully!");
                return;
            });
        }).catch(error => {
                console.error("Error:", error);
        });
    }

    toggleContent('/uk/license.html', 'target', image); 
}
