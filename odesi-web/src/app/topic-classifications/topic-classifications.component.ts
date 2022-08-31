import { Component, OnInit } from "@angular/core";
import { FlatTreeControl } from "@angular/cdk/tree";
import { MatTreeFlatDataSource, MatTreeFlattener }
    from "@angular/material/tree";
import {OdesiService} from "../odesi.service";

interface Topic {
    name: string;
    children?: Topic[];
}

let TOPIC_TREE: Topic[] = [
    // {
    //     name: "Joice",
    //     children: [
    //         { name: "Mike" },
    //         { name: "Will" },
    //         { name: "Eleven", children: [{ name: "Hopper" }] },
    //         { name: "Lucas" },
    //         { name: "Dustin", children: [{ name: "Winona" }] },
    //     ],
    // },
    // {
    //     name: "Jean",
    //     children: [{ name: "Otis" }, { name: "Maeve" }],
    // },
];

/** Flat node with expandable and level information */
interface ExampleFlatNode {
    expandable: boolean;
    name: string;
    level: number;
}

@Component({
    selector: "app-topic-classifications",
    templateUrl: "./topic-classifications.component.html",
    styleUrls: ["./topic-classifications.component.css"],
})
export class TopicClassificationsComponent implements OnInit {
    private _transformer = (node: Topic, level: number) => {
        return {
            expandable: !!node.children && node.children.length > 0,
            name: node.name,
            level: level,
        };
    };

    treeControl = new FlatTreeControl<ExampleFlatNode>(
        (node) => node.level,
        (node) => node.expandable
    );

    treeFlattener = new MatTreeFlattener(
        this._transformer,
        (node) => node.level,
        (node) => node.expandable,
        (node) => node.children
    );

    dataSource = new MatTreeFlatDataSource(
        this.treeControl, this.treeFlattener);

    constructor(private odesiService: OdesiService) {
        this.dataSource.data = TOPIC_TREE;
    }

    hasChild = (_: number,
                node: ExampleFlatNode) => node.expandable;

    ngOnInit(): void {
        this.odesiService.getTopicClassifications('')
            //"(AB=test)AND(coll:cora)&options=odesi-opts2&format=json")
            .subscribe(
                data => {
                  console.log('Data here ');
                  console.log(JSON.stringify(data));
                  let resultJson = JSON.parse(JSON.stringify(data));

                    //keys now sorted alphabetically
                    //const keys = Object.keys(resultJson).sort((a, b) => a.localeCompare(b));

                    // do things with the keys using loop
                    //console.log("Start")
                    //for (const key of keys) {
                    //    console.log(key)
                    //    console.log(resultJson[key]);
                    //}
                    let clasTopArray = resultJson["values-response"]["distinct-value"]

                    for (var val of clasTopArray) {

                        let obj = {
                            "name": val["_value"],
                            "children": [{"name" : "test", "children" :[]}]
                        }
                        TOPIC_TREE.push(obj)
                    }
                    console.log(TOPIC_TREE)
                    this.dataSource.data = TOPIC_TREE;
                },
                error => {
                  console.log(error);
                },
                () => {
                  console.log("complete")

                });
    }
}
