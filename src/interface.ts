export interface IssueInterface {
    number: number;
    title: string;
    user: { login: string };
    created_at: string;
    labels: { name: string }[];
    comments: number;
    state: string;
}
