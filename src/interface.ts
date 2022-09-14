export interface IssueInterface {
    number: number;
    title: string;
    user: { login: string };
    created_at: string;
    labels: { name: string }[];
    comments: number;
    state: string;
}

export interface filterParamsInterface {
    issueState: "open" | "closed";
    direction: "asc" | "desc" | undefined;
    sort: "comments" | "date" | undefined;
    pageNumber: number;
}

export interface responseInterface {
    
}