import type { ContentFile } from './types';
import pageContent from './assets/content.json' assert { type: 'json' };

//#region Element References
const footerText = document.querySelector('footer span') as HTMLDivElement;
const navTitle = document.querySelector('#navbar-title') as HTMLSpanElement;
const mainContent = document.querySelector('main') as HTMLDivElement;
const prevButton = document.querySelector(
	'#previous-page-button'
) as HTMLButtonElement;
const nextButton = document.querySelector(
	'#next-page-button'
) as HTMLButtonElement;
const navLinksUl = document.querySelector('#navbar-links') as HTMLUListElement;
const pageLinkTemplate = document.querySelector(
	'#page-link-template'
) as HTMLTemplateElement;
//#endregion

const content: ContentFile = {
	title: pageContent.title,
	pages: pageContent.pages,
};
let currentPageIndex = 0;

function updateMainTitle() {
	footerText.textContent += ` ${content.title}`;
	navTitle.textContent = content.title;
}

function updateTitle(currentPageIndex: number) {
	document.title = `${content.pages[currentPageIndex].title} | ${content.title}`;
}

function updatePageContent(currentPageIndex: number) {
	mainContent.innerHTML = content.pages[currentPageIndex].content;
	updateTitle(currentPageIndex);
	updatePageButtons();
	updateNavLinks();
}

function updatePageButtons() {
	prevButton.disabled = currentPageIndex === 0;
	nextButton.disabled = currentPageIndex === content.pages.length - 1;
	prevButton.classList.toggle('btn-primary', !prevButton.disabled);
	prevButton.classList.toggle('btn-secondary', prevButton.disabled);
	nextButton.classList.toggle('btn-primary', !nextButton.disabled);
	nextButton.classList.toggle('btn-secondary', nextButton.disabled);
}

prevButton.addEventListener('click', () => {
	if (currentPageIndex > 0) {
		currentPageIndex--;
		updatePageContent(currentPageIndex);
	}
});
nextButton.addEventListener('click', () => {
	if (currentPageIndex < content.pages.length - 1) {
		currentPageIndex++;
		updatePageContent(currentPageIndex);
	}
});

function renderNavLinks() {
	content.pages.forEach((page, index) => {
		const linkClone = pageLinkTemplate.content.cloneNode(
			true
		) as DocumentFragment;
		const button = linkClone.querySelector('button') as HTMLButtonElement;
		button.textContent = page.title;
		if (index === currentPageIndex) {
			button.classList.add('active');
		}
		button.addEventListener('click', () => {
			currentPageIndex = index;
			updatePageContent(currentPageIndex);
		});
		navLinksUl.appendChild(linkClone);
	});
}

function updateNavLinks() {
	navLinksUl.querySelectorAll('button').forEach((btn) => {
		btn.classList.remove('active');
	});

	const activeLink = navLinksUl.querySelector(
		`button:nth-child(${currentPageIndex + 1})`
	);
	if (activeLink) {
		activeLink.classList.add('active');
	}
}

updateMainTitle();
renderNavLinks();
updatePageContent(currentPageIndex);
