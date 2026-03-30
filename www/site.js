const NAV_LINKS = [
    { href: 'index.html', label: 'Accueil' },
    { href: 'cv.html', label: 'CV' },
    { href: 'projets.html', label: 'Projets' },
    { href: 'contact.html', label: 'Me contacter' }
];

const PRIVACY_SESSION_KEY = 'privacy_popup_accepted';

const PROJECT_DESCRIPTIONS = {
    'Football-Laravel': 'Application Laravel de gestion de championnats de football avec authentification et administration.',
    'Site-Laravel-JMI56': 'Site vitrine Laravel moderne et responsive pour un professionnel de la maintenance informatique.',
    'Tamagotchi-Java-POO': 'Mini-jeu Tamagotchi en Java pour pratiquer la programmation orientée objet.',
    'Football-PHP-Core': 'Projet MVC en PHP natif/MySQL pour gérer équipes, matchs et classements.'
};

const PROJECT_FALLBACK = [
    {
        name: 'Football-Laravel',
        html_url: 'https://github.com/obSSi/Football-Laravel',
        description: PROJECT_DESCRIPTIONS['Football-Laravel'],
        language: 'PHP',
        updated_at: '2026-03-24T14:00:18Z'
    },
    {
        name: 'Site-Laravel-JMI56',
        html_url: 'https://github.com/obSSi/Site-Laravel-JMI56',
        description: PROJECT_DESCRIPTIONS['Site-Laravel-JMI56'],
        language: 'PHP',
        updated_at: '2026-02-13T15:06:47Z'
    },
    {
        name: 'Tamagotchi-Java-POO',
        html_url: 'https://github.com/obSSi/Tamagotchi-Java-POO',
        description: PROJECT_DESCRIPTIONS['Tamagotchi-Java-POO'],
        language: 'Java',
        updated_at: '2026-02-13T10:34:20Z'
    },
    {
        name: 'Football-PHP-Core',
        html_url: 'https://github.com/obSSi/Football-PHP-Core',
        description: PROJECT_DESCRIPTIONS['Football-PHP-Core'],
        language: 'PHP',
        updated_at: '2026-02-13T09:40:07Z'
    }
];

function buildHeader() {
    const host = document.getElementById('site-header');
    if (!host) {
        return;
    }

    host.className = 'site-header';
    host.innerHTML = `
        <div class="container nav-shell">
            <a href="#" class="brand" aria-label="Remonter en haut de la page">Portfolio</a>
            <button class="menu-toggle" type="button" aria-label="Ouvrir le menu" aria-expanded="false" aria-controls="main-nav">
                <span></span>
                <span></span>
                <span></span>
            </button>
            <nav class="main-nav" id="main-nav" aria-label="Navigation principale">
                <ul>
                    ${NAV_LINKS.map((link) => `<li><a href="${link.href}">${link.label}</a></li>`).join('')}
                </ul>
            </nav>
        </div>
    `;

    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const links = host.querySelectorAll('.main-nav a');
    links.forEach((link) => {
        if (link.getAttribute('href') === currentPage) {
            link.classList.add('is-active');
            link.setAttribute('aria-current', 'page');
        }
    });

    const toggle = host.querySelector('.menu-toggle');
    const nav = host.querySelector('.main-nav');
    const brandLink = host.querySelector('.brand');

    brandLink.addEventListener('click', (event) => {
        event.preventDefault();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    toggle.addEventListener('click', () => {
        const expanded = toggle.getAttribute('aria-expanded') === 'true';
        toggle.setAttribute('aria-expanded', String(!expanded));
        nav.classList.toggle('is-open');
    });
}

function buildFooter() {
    const footer = document.createElement('footer');
    footer.className = 'site-footer';
    footer.innerHTML = `
        <div class="container footer-content">
            <p>&copy; ${new Date().getFullYear()} Maxime Goussu - Tous droits réservés</p>
            <div class="footer-links">
                <a href="mentions-legales.html">Mentions légales</a>
                <a href="https://github.com/obSSi" target="_blank" rel="noopener noreferrer">GitHub</a>
                <a href="mailto:maxime.goussu.pro@gmail.com">Email</a>
            </div>
        </div>
    `;
    document.body.appendChild(footer);
}

function buildPrivacyPopup() {
    try {
        if (sessionStorage.getItem(PRIVACY_SESSION_KEY) === '1') {
            return;
        }
    } catch (error) {
        // No-op: if storage is blocked, the popup still works on the current page.
    }

    const popup = document.createElement('div');
    popup.className = 'privacy-popup is-visible';
    popup.id = 'privacy-popup';
    popup.innerHTML = `
        <div class="privacy-card" role="dialog" aria-modal="true" aria-labelledby="privacy-title">
            <h2 id="privacy-title">Information confidentialité</h2>
            <p>
                Ce site portfolio ne collecte pas de données personnelles,
                n'utilise pas de cookies de suivi et ne stocke aucune information utilisateur.
            </p>
            <button type="button" id="privacy-close">J'ai compris</button>
        </div>
    `;

    document.body.appendChild(popup);

    const closeButton = popup.querySelector('#privacy-close');
    const closePopup = () => {
        popup.classList.remove('is-visible');
        try {
            sessionStorage.setItem(PRIVACY_SESSION_KEY, '1');
        } catch (error) {
            // No-op: popup remains dismissible even without storage.
        }
    };

    closeButton.addEventListener('click', closePopup);
    popup.addEventListener('click', (event) => {
        if (event.target === popup) {
            closePopup();
        }
    });

    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && popup.classList.contains('is-visible')) {
            closePopup();
        }
    });
}

function formatDate(isoDate) {
    if (!isoDate) {
        return 'Date non disponible';
    }

    return new Date(isoDate).toLocaleDateString('fr-FR', {
        day: '2-digit',
        month: 'long',
        year: 'numeric'
    });
}

function createProjectCard(project) {
    const card = document.createElement('article');
    card.className = 'project-card';

    const title = document.createElement('h3');
    title.textContent = project.name;

    const description = document.createElement('p');
    description.textContent = project.description || PROJECT_DESCRIPTIONS[project.name] || 'Description à venir.';

    const meta = document.createElement('div');
    meta.className = 'project-meta';

    const language = document.createElement('span');
    language.className = 'tag';
    language.textContent = project.language || 'Non précisé';

    const updated = document.createElement('span');
    updated.className = 'updated-at';
    updated.textContent = `Mise à jour : ${formatDate(project.updated_at)}`;

    meta.appendChild(language);
    meta.appendChild(updated);

    const link = document.createElement('a');
    link.href = project.html_url;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    link.className = 'project-link';
    link.textContent = 'Voir le dépôt';

    card.appendChild(title);
    card.appendChild(description);
    card.appendChild(meta);
    card.appendChild(link);

    return card;
}

async function loadProjects() {
    const grid = document.getElementById('projects-grid');
    const status = document.getElementById('projects-status');

    if (!grid || !status) {
        return;
    }

    status.textContent = 'Chargement des projets depuis GitHub...';

    try {
        const response = await fetch('https://api.github.com/users/obSSi/repos?per_page=100&sort=updated', {
            headers: { Accept: 'application/vnd.github+json' }
        });

        if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
        }

        const repos = await response.json();
        const publicRepos = repos
            .filter((repo) => !repo.fork)
            .sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at));

        const selectedRepos = publicRepos.slice(0, 12);
        grid.innerHTML = '';

        selectedRepos.forEach((repo) => {
            grid.appendChild(createProjectCard(repo));
        });

        status.textContent = `${selectedRepos.length} projet(s) public(s) affiché(s), trié(s) par mise à jour.`;
    } catch (error) {
        grid.innerHTML = '';
        PROJECT_FALLBACK.forEach((project) => {
            grid.appendChild(createProjectCard(project));
        });
        status.textContent = "Impossible de charger l'API GitHub, affichage des projets principaux en mode local.";
    }
}

document.addEventListener('DOMContentLoaded', () => {
    buildHeader();
    buildFooter();
    const currentPage = window.location.pathname.split('/').pop();
    if (!currentPage || currentPage === 'index.html') {
        buildPrivacyPopup();
    }
    loadProjects();
});
