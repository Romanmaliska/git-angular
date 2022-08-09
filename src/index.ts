import type { IssueInterface } from "./interface";

/* SELECTORS  */

const issuesEl = document.querySelector(".js-issues") as HTMLElement;
const openIssuesEl = document.querySelector(
    "#openIssuesBtn"
) as HTMLButtonElement;
const closedIssuesEl = document.querySelector(
    "#closedIssuesBtn"
) as HTMLButtonElement;

const removeFilterEl = document.querySelector(
    "#removeFiltersBtn"
) as HTMLButtonElement;

const sortEl = document.querySelector("#js-filter__sort") as HTMLSelectElement;

/* FILTER  OBJECT*/

let filterParams: {
    issueState: "open" | "closed";
    direction: "asc" | "desc" | undefined;
    sort: "comments" | "date" | undefined;
    pageNumber: number;
} = {
    issueState: "open",
    direction: undefined,
    sort: undefined,
    pageNumber: 1,
};

/* PAGINATION */

const pagesNumbersParEl = document.querySelector(
    ".js-pagination"
) as HTMLDivElement;

let numberOfPages: number = 1;

const displayPagination = () => {
    const { pageNumber } = filterParams;
    let pages = [];

    // pri nacitani stranky a do 7 tlacitiek
    
    if (pageNumber < 7) {
        let clickedMorethan4 = 5;
        
        if (pageNumber === 4) {
            clickedMorethan4++;
        }
        if (pageNumber === 5) {
            clickedMorethan4 += 2;
        }
        if (pageNumber === 6) {
            clickedMorethan4 += 3;
        }
        for (let i = 3; i <= clickedMorethan4; i++) {
            pages.push(
                `<button type="button" class="js-pagination__btn">${i}</button>`
                );
            }
            pages.push(
                `<button type="button" class="js-pagination__btn">...</button>`
                );
            }
            
            // od 7 do number of pages

    if (pageNumber >= 7 && pageNumber < numberOfPages - 8) {
        pages.push(
            `<button type="button" class="js-pagination__btn">...</button>`
        );
        for (let i = pageNumber - 2; i <= pageNumber + 2; i++) {
            pages.push(
                `<button type="button" class="js-pagination__btn">${i}</button>`
            );
        }
        pages.push(
            `<button type="button" class="js-pagination__btn">...</button>`
        );
    }

    if (pageNumber > numberOfPages - 8) {
              pages.push(
            `<button type="button" class="js-pagination__btn">...</button>`
        );
        for (let i = numberOfPages - 5; i <= numberOfPages - 2; i++) {
            pages.push(
                `<button type="button" class="js-pagination__btn">${i}</button>`
            );
        }
    }

    pages.unshift(`
        <button type="button" class="js-pagination__btn" id="js-prevBtn">&laquo Previous</button>
        <button type="button" class="js-pagination__btn">1</button>
        <button type="button" class="js-pagination__btn">2</button>`);
    pages.push(`
        <button type="button" class="js-pagination__btn">${
            numberOfPages - 1
        }</button>
        <button type="button" class="js-pagination__btn">${numberOfPages}</button>
        <button  class="js-pagination__btn" id="js-nextBtn">&raquo Next</button>
    `);
    pagesNumbersParEl.innerHTML = pages.map((page) => page).join("");

};

displayPagination();

console.log(filterParams.pageNumber);

const prevBtnEl = document.querySelector("#js-prevBtn") as HTMLButtonElement;
const nextBtnEl = document.querySelector("#js-nextBtn") as HTMLButtonElement;

pagesNumbersParEl.addEventListener("click", (e: MouseEvent): void => {
    let btn = e.target as HTMLButtonElement;
    if (btn.textContent === "...") return;
    filterParams.pageNumber = Number(btn.textContent);
    fetchIssuesData();
});

prevBtnEl.addEventListener("click", () => {
    if (filterParams.pageNumber === 1) return;
    filterParams.pageNumber--;
    fetchIssuesData();
});

nextBtnEl.addEventListener("click", () => {
    filterParams.pageNumber++;
    fetchIssuesData();
});

/* EVENT LISTENERS */

openIssuesEl.addEventListener("click", (): void => {
    filterParams.issueState = "open";
    fetchIssuesData();
});

closedIssuesEl.addEventListener("click", (): void => {
    filterParams.issueState = "closed";
    fetchIssuesData();
});

removeFilterEl.addEventListener("click", (): void => {
    filterParams.issueState = "open";
    fetchIssuesData();
});

sortEl.addEventListener("change", (e: Event): void => {
    const select = e.target as HTMLSelectElement;
    if (select.value === "ascendingComments") {
        filterParams.direction = "asc";
        filterParams.sort = "comments";
        fetchIssuesData();
    } else if (select.value === "descendingComments") {
        filterParams.direction = "desc";
        filterParams.sort = "comments";
        fetchIssuesData();
    } else if (select.value === "newest") {
        filterParams.direction = "desc";
        filterParams.sort = "date";
        fetchIssuesData();
    } else if (select.value === "oldest") {
        filterParams.direction = "asc";
        filterParams.sort = "date";
        fetchIssuesData();
    }
});

/* FETCH DATA FUNCTION */

const fetchIssuesData = async () => {
    const URLsearchParams = new URLSearchParams();

    const { issueState, pageNumber, direction, sort } = filterParams;

    // URLsearchParams.set("page", page.toString());

    URLsearchParams.set("state", issueState);
    URLsearchParams.set("sort", sort);
    URLsearchParams.set("direction", direction);
    URLsearchParams.set("page", pageNumber.toString());

    const response = await fetch(
        `https://api.github.com/repos/angular/angular/issues?${URLsearchParams}`
    );

    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    const issuesData = await response.json();

    const linkHeader: string | null = response.headers.get("link");
    const regex = /(?<=page=).[0-9]+/;
    numberOfPages = Number(
        linkHeader
            ?.split(",")
            ?.find((page) => page?.includes(`rel="last"`))
            ?.match(regex)
    );

    displayPagination();

    issuesEl.innerHTML = issuesData
        .map((issue: IssueInterface) => {
            const {
                number,
                title,
                user: { login },
                labels,
                created_at,
                comments,
                state,
            } = issue;
            return `<article class="js-issues__item">
                        <div class="js-issues__header">
                            <h4>${state}</h4>
                            <h4 class="js-issues__title">${title}</h4>
                            <p class="js-issues__comments">Comments: ${comments}</p>
                        </div>
                        <div class="js-issues__labels">
                         ${labels
                             .map((label) => {
                                 return `<button class="js-issues__label">${label.name}</button>`;
                             })
                             .join("")}
                        </div>
                        <div>
                            <span class="js-issues__number">#${number}</span>
                            <span class="js-issues__date">opened ${created_at.slice(
                                0,
                                10
                            )}</span>
                            <span class="js-issues__login">by ${login}</span>
                        </div>
                    </article>`;
        })
        .join("");
};

fetchIssuesData();

export {};
