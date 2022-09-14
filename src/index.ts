import type { IssueInterface } from "./interface";
import type { filterParamsInterface } from "./interface";
import { displayPagination } from "./pagination";

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

const pagesNumbersParEl = document.querySelector(
    ".js-pagination"
) as HTMLDivElement;

const sortEl = document.querySelector("#js-filter__sort") as HTMLSelectElement;

/* FILTER  OBJECT*/

let filterParams: filterParamsInterface = {
    issueState: "open",
    direction: undefined,
    sort: undefined,
    pageNumber: 1,
};

pagesNumbersParEl.addEventListener("click", (e) => {
    let btn = e.target as HTMLButtonElement;
    filterParams.pageNumber = Number(btn.textContent);
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

    URLsearchParams.set("state", issueState);
    sort && URLsearchParams.set("sort", sort);
    direction && URLsearchParams.set("direction", direction);
    URLsearchParams.set("page", pageNumber.toString());

    const response = await fetch(
        `https://api.github.com/repos/angular/angular/issues?${URLsearchParams}`
    );

    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    const issuesData = await response.json();

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

    displayPagination(filterParams, response);
};

fetchIssuesData();

export {};
