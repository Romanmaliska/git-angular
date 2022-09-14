import type { filterParamsInterface } from "./interface";

const pagesNumbersParEl = document.querySelector(
    ".js-pagination"
) as HTMLDivElement;


const displayPagination = (filterParams: filterParamsInterface, response: Response) => {
    const { pageNumber } = filterParams;
    const linkHeader: string | null = response.headers.get("link");

    const regex = /(?<=page=).[0-9]+/;
    const numberOfPages = Number(
        linkHeader
            ?.split(",")
            ?.find((page) => page?.includes(`rel="last"`))  
            ?.match(regex)
    ) || pageNumber

    let pageNumbersSetting = [
        1,
        2,
        pageNumber - 2,
        pageNumber - 1,
        pageNumber,
        pageNumber + 1,
        pageNumber + 2,
        numberOfPages - 1,
        numberOfPages,
    ];
    const pageNumbers = [...new Set(pageNumbersSetting)].filter(
        (number) => number > 0 && number <= numberOfPages
    );

    const pages = pageNumbers.map((number, index, array) => {
        return number - array[index - 1] > 1
            ? `<button type="button" class="js-pagination__btn">...</button><button type="button" class="js-pagination__btn">${number}</button>`
            : `<button type="button" class="js-pagination__btn" >${number}</button>`;
    });

    pagesNumbersParEl.innerHTML = pages.map((page) => page).join("");
};

export { displayPagination };
