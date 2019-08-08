export class Graph {
    options: Options = new Options();
    title: string = 'Graph'
    labels: Array<string> = ['Jan', 'feb', 'Mar'];
    type: string;
    legend: Boolean = true;
    data: Array<Data> = [{data: [65, 59, 80], label: ""}];

    constructor(type: string) {
        this.type = type;
    }
}

export class Options {
    scaleShowVerticalLines: Boolean = false;
    responsive: Boolean = true;
}

export class Data {
    data: Array<number> = [65, 59, 80];
    label: string = 'Series A';
}
