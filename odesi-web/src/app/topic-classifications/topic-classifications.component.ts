import { Component, OnInit } from "@angular/core";
import { FlatTreeControl } from "@angular/cdk/tree";
import { MatTreeFlatDataSource, MatTreeFlattener }
    from "@angular/material/tree";
import {OdesiService} from "../odesi.service";

interface Topic {
    name: string;
    children?: Topic[];
    loaded: boolean;
    levelNode: number;
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
            //expandable: !!node.children && node.children.length > 0,
            expandable: node.levelNode === 1,
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
        this.odesiService.getTopicClassifications('&options=odesi-opts2&format=json&directory=/odesi') //collection=http://scholarsportal.info/cora')
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
                            //"children": [{"name": "test", "children":[], "loaded":true}],
                            "children":[],
                            "loaded": false,
                            "levelNode": 1
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

    findDatasets(topClas: string, loaded: string) {
        console.log(loaded)
        console.log(topClas, loaded)
        if (!loaded) {
            this.odesiService.find("topcClas:" + topClas + "&options=odesi-opts2&format=json").subscribe(
                data => {
                    console.log(data)
                    let topicFoundIndex = TOPIC_TREE.findIndex(x => x.name === topClas)
                    console.log(topicFoundIndex)
                    let resultJson = JSON.parse(JSON.stringify(data));
                    let datasetsArray = resultJson["results"]
                    if (typeof (topicFoundIndex) !== 'undefined') {
                        console.log("Show results");
                        console.log(datasetsArray);
                        var children = [];
                        for (var el of datasetsArray) {
                            var child: Topic = {
                                "name": el["uri"],
                                "children": [],
                                "loaded": true,
                                "levelNode": 0
                            }

                            children.push(child)
                        }
                        TOPIC_TREE[topicFoundIndex]["children"] = children
                        console.log(TOPIC_TREE[topicFoundIndex])

                    }


                },
                error => {
                    console.log(error);
                },
                () => {
                    console.log("complete")
                    this.dataSource.data = TOPIC_TREE;
                    this.dataSource.data = this.dataSource.data.slice();

                });
        }

    }
}
