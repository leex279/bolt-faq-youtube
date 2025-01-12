const isDevMode = import.meta.env.VITE_DEV_MODE === 'true';
const basePath = isDevMode ? '/' : '/bolt-faq-youtube/';

function updateNavigationLinks() {
    const navLinks = document.querySelectorAll('.nav-links a');
    navLinks.forEach(link => {
        const href = link.getAttribute('href');
        link.setAttribute('href', basePath + href.substring(1));
    });
}

function updateContent(lang) {
    const accordionHeaders = document.querySelectorAll('.accordion-header');
    const commandHeaders = document.querySelectorAll('.command-header');
    const copyButtons = document.querySelectorAll('.copy-button');
    const commandSnippets = document.querySelectorAll('.command-snippet pre code');

    if (accordionHeaders) {
        accordionHeaders.forEach(header => {
            const questionText = header.querySelector('.question-text');
            const content = header.nextElementSibling;
            questionText.textContent = header.getAttribute(`data-${lang}`);
            content.querySelector('p').textContent = content.getAttribute(`data-${lang}`);
        });
    }
    if (commandHeaders) {
        commandHeaders.forEach(header => {
            header.querySelector('.command-title').textContent = header.getAttribute(`data-${lang}`);
        });
    }
    if (copyButtons) {
        copyButtons.forEach(button => {
            button.textContent = button.getAttribute(`data-${lang}`);
        });
    }
    if (commandSnippets) {
        commandSnippets.forEach(snippet => {
            snippet.textContent = snippet.getAttribute(`data-${lang}`);
        });
    }
}

function setupLanguageToggle() {
    const languageSelect = document.getElementById('language-select');
    let currentLanguage = 'en';
    updateContent(currentLanguage);

    languageSelect.addEventListener('change', (event) => {
        currentLanguage = event.target.value;
        updateContent(currentLanguage);
    });
}

function setupThemeToggle() {
    const themeToggle = document.querySelector('.theme-toggle');
    const body = document.body;
    themeToggle.addEventListener('click', () => {
        body.classList.toggle('light');
    });
}

function setupAccordion() {
    const accordionHeaders = document.querySelectorAll('.accordion-header');
    if (accordionHeaders) {
        accordionHeaders.forEach(header => {
            header.addEventListener('click', () => {
                const item = header.parentElement;
                const content = header.nextElementSibling;
                const isOpen = item.classList.contains('active');

                if (isOpen) {
                    item.classList.remove('active');
                    content.style.maxHeight = null;
                    header.classList.remove('active');
                } else {
                    item.classList.add('active');
                    content.style.maxHeight = content.scrollHeight + 'px';
                    header.classList.add('active');
                }
            });
        });
    }
}

function setupCopyButtons() {
    const copyButtons = document.querySelectorAll('.copy-button');
    if (copyButtons) {
        copyButtons.forEach(button => {
            button.addEventListener('click', () => {
                const code = button.previousElementSibling.querySelector('code');
                const text = code.textContent;

                // Attempt to use the Clipboard API
                if (navigator.clipboard && navigator.clipboard.writeText) {
                    navigator.clipboard.writeText(text)
                        .then(() => {
                            button.textContent = button.getAttribute(`data-en`) === 'Copy' ? 'Copied!' : 'Kopiert!';
                            setTimeout(() => {
                                button.textContent = button.getAttribute(`data-en`);
                            }, 2000);
                        })
                        .catch(err => {
                            console.error('Failed to copy text using Clipboard API: ', err);
                            copyTextFallback(text, button);
                        });
                } else {
                    // Fallback to textarea method
                    copyTextFallback(text, button);
                }
            });
        });
    }
}

function copyTextFallback(text, button) {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';  // Avoid scrolling to bottom in old IE.
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();

    try {
        const successful = document.execCommand('copy');
        if (successful) {
            button.textContent = button.getAttribute(`data-en`) === 'Copy' ? 'Copied!' : 'Kopiert!';
            setTimeout(() => {
                button.textContent = button.getAttribute(`data-en`);
            }, 2000);
        } else {
            button.textContent = 'Copy Failed';
        }
    } catch (err) {
        console.error('Fallback copy failed: ', err);
        button.textContent = 'Copy Failed';
    } finally {
        document.body.removeChild(textArea);
    }
}


document.addEventListener('DOMContentLoaded', () => {
    updateNavigationLinks();
    setupLanguageToggle();
    setupThemeToggle();
    setupAccordion();
    setupCopyButtons();
});
