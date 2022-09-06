import {CollectionViewer, SelectionChange, DataSource} from '@angular/cdk/collections';
import {FlatTreeControl} from '@angular/cdk/tree';
import {Component, Injectable} from '@angular/core';
import {BehaviorSubject, merge, Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import { OdesiService } from '../odesi.service';



/** Flat node with expandable and level information */
export class DynamicFlatNode {
    constructor(
        public item: string,
        public level = 1,
        public expandable = false,
        public isLoading = false,
    ) {}
}

/**
 * Database for dynamic data. When expanding a node in the tree, the data source will need to fetch
 * the descendants data from the database.
 */
@Injectable({providedIn: 'root'})
export class DynamicDatabase {
    //dataMap: Observable<Map<string, string[]>> | undefined;

    dataMap = new Map<string, string[]>(  [//
    //     ['Fruits', ['Apple', 'Orange', 'Banana']],
    //     ['Vegetables', ['Tomato', 'Potato', 'Onion']],
    //     ['Apple', ['Fuji', 'Macintosh']],
    //     ['Onion', ['Yellow', 'White', 'Purple']],
    ]);
    rootLevelNodes: string[] = [];//'Fruits', 'Vegetables'];

     constructor(private odesiService: OdesiService) {
         this.odesiService.getTopicClassifications('options=odesi-opts2&format=json&directory=/odesi') //collection=http://scholarsportal.info/cora')
             //"(AB=test)AND(coll:cora)&options=odesi-opts2&format=json")
             .subscribe(
                 data => {
                     // let topicClass = new Map<string, string[]>([])
                     // console.log('Data here ');
                     // console.log(JSON.stringify(data));
                     // let resultJson = JSON.parse(JSON.stringify(data));
                     //
                     // //keys now sorted alphabetically
                     // //const keys = Object.keys(resultJson).sort((a, b) => a.localeCompare(b));
                     //
                     // // do things with the keys using loop
                     // //console.log("Start")
                     // //for (const key of keys) {
                     // //    console.log(key)
                     // //    console.log(resultJson[key]);
                     // //}
                     // let clasTopArray = resultJson["values-response"]["distinct-value"]
                     //
                     // for (var val of clasTopArray) {
                     //     topicClass.set(val["_value"], [])
                     //
                     // }
                     // this.dataMap = topicClass;
                     console.log("Hi")
                     console.log(data)
                     console.log("bye")
                 },
                 error => {
                     console.log(error);
                     //return this.rootLevelNodes.map(name => new DynamicFlatNode(name, 0, true));
                 },
                 () => {
                     console.log("complete")

                 });
     }



    /** Initial data from database */
    initialData(): DynamicFlatNode[] {

        return this.rootLevelNodes.map(name => new DynamicFlatNode(name, 0, true));

    }

    getChildren(node: string): string[] | undefined {
        return this.dataMap.get(node);
    }

    isExpandable(node: string): boolean {
        return this.dataMap.has(node);
    }
}
/**
 * File database, it can build a tree structured Json object from string.
 * Each node in Json object represents a file or a directory. For a file, it has filename and type.
 * For a directory, it has filename and children (a list of files or directories).
 * The input will be a json object string, and the output is a list of `FileNode` with nested
 * structure.
 */
export class DynamicDataSource implements DataSource<DynamicFlatNode> {
    dataChange = new BehaviorSubject<DynamicFlatNode[]>([]);

    get data(): DynamicFlatNode[] {
        return this.dataChange.value;
    }
    set data(value: DynamicFlatNode[]) {
        this._treeControl.dataNodes = value;
        this.dataChange.next(value);
    }

    constructor(
        private _treeControl: FlatTreeControl<DynamicFlatNode>,
        private _database: DynamicDatabase,
    ) {}

    connect(collectionViewer: CollectionViewer): Observable<DynamicFlatNode[]> {
        this._treeControl.expansionModel.changed.subscribe(change => {
            if (
                (change as SelectionChange<DynamicFlatNode>).added ||
                (change as SelectionChange<DynamicFlatNode>).removed
            ) {
                this.handleTreeControl(change as SelectionChange<DynamicFlatNode>);
            }
        });

        return merge(collectionViewer.viewChange, this.dataChange).pipe(map(() => this.data));
    }

    disconnect(collectionViewer: CollectionViewer): void {}

    /** Handle expand/collapse behaviors */
    handleTreeControl(change: SelectionChange<DynamicFlatNode>) {
        if (change.added) {
            change.added.forEach(node => this.toggleNode(node, true));
        }
        if (change.removed) {
            change.removed
                .slice()
                .reverse()
                .forEach(node => this.toggleNode(node, false));
        }
    }

    /**
     * Toggle the node, remove from display list
     */
    toggleNode(node: DynamicFlatNode, expand: boolean) {
        const children = this._database.getChildren(node.item);
        const index = this.data.indexOf(node);
        if (!children || index < 0) {
            // If no children, or cannot find the node, no op
            return;
        }

        node.isLoading = true;

        setTimeout(() => {
            if (expand) {
                const nodes = children.map(
                    name => new DynamicFlatNode(name, node.level + 1, this._database.isExpandable(name)),
                );
                this.data.splice(index + 1, 0, ...nodes);
            } else {
                let count = 0;
                for (
                    let i = index + 1;
                    i < this.data.length && this.data[i].level > node.level;
                    i++, count++
                ) {}
                this.data.splice(index + 1, count);
            }

            // notify the change
            this.dataChange.next(this.data);
            node.isLoading = false;
        }, 1000);
    }
}

@Component({
    selector: "app-topic-classifications",
    templateUrl: "./topic-classifications.component.html",
    styleUrls: ["./topic-classifications.component.css"],
})
export class TopicClassificationsComponent  {
    constructor(database: DynamicDatabase, private odesiService: OdesiService,) {
        this.treeControl = new FlatTreeControl<DynamicFlatNode>(this.getLevel, this.isExpandable);
        this.dataSource = new DynamicDataSource(this.treeControl, database);



        this.dataSource.data = database.initialData();
    }

    treeControl: FlatTreeControl<DynamicFlatNode>;

    dataSource: DynamicDataSource;

    getLevel = (node: DynamicFlatNode) => node.level;

    isExpandable = (node: DynamicFlatNode) => node.expandable;

    hasChild = (_: number, _nodeData: DynamicFlatNode) => _nodeData.expandable;
}


// import { Component, OnInit } from "@angular/core";
// import { FlatTreeControl } from "@angular/cdk/tree";
// import { MatTreeFlatDataSource, MatTreeFlattener }
//     from "@angular/material/tree";
// import {OdesiService} from "../odesi.service";
//
// interface Topic {
//     name: string;
//     children?: Topic[];
//     loaded: boolean;
//     levelNode: number;
// }
//
// let TOPIC_TREE: Topic[] = [
//     // {
//     //     name: "Joice",
//     //     children: [
//     //         { name: "Mike" },
//     //         { name: "Will" },
//     //         { name: "Eleven", children: [{ name: "Hopper" }] },
//     //         { name: "Lucas" },
//     //         { name: "Dustin", children: [{ name: "Winona" }] },
//     //     ],
//     // },
//     // {
//     //     name: "Jean",
//     //     children: [{ name: "Otis" }, { name: "Maeve" }],
//     // },
// ];
//
// /** Flat node with expandable and level information */
// interface ExampleFlatNode {
//     expandable: boolean;
//     name: string;
//     level: number;
// }
//
// @Component({
//     selector: "app-topic-classifications",
//     templateUrl: "./topic-classifications.component.html",
//     styleUrls: ["./topic-classifications.component.css"],
// })
// export class TopicClassificationsComponent implements OnInit {
//     private _transformer = (node: Topic, level: number) => {
//         return {
//             //expandable: !!node.children && node.children.length > 0,
//             expandable: node.levelNode === 1,
//             name: node.name,
//             level: level,
//         };
//     };
//
//     treeControl = new FlatTreeControl<ExampleFlatNode>(
//         (node) => node.level,
//         (node) => node.expandable
//     );
//
//     treeFlattener = new MatTreeFlattener(
//         this._transformer,
//         (node) => node.level,
//         (node) => node.expandable,
//         (node) => node.children
//     );
//
//     dataSource = new MatTreeFlatDataSource(
//         this.treeControl, this.treeFlattener);
//
//     constructor(private odesiService: OdesiService) {
//         this.dataSource.data = TOPIC_TREE;
//     }
//
//     hasChild = (_: number,
//                 node: ExampleFlatNode) => node.expandable;
//
//
//     ngOnInit(): void {
//         this.odesiService.getTopicClassifications('options=odesi-opts2&format=json&directory=/odesi') //collection=http://scholarsportal.info/cora')
//             //"(AB=test)AND(coll:cora)&options=odesi-opts2&format=json")
//             .subscribe(
//                 data => {
//                   console.log('Data here ');
//                   console.log(JSON.stringify(data));
//                   let resultJson = JSON.parse(JSON.stringify(data));
//
//                     //keys now sorted alphabetically
//                     //const keys = Object.keys(resultJson).sort((a, b) => a.localeCompare(b));
//
//                     // do things with the keys using loop
//                     //console.log("Start")
//                     //for (const key of keys) {
//                     //    console.log(key)
//                     //    console.log(resultJson[key]);
//                     //}
//                     let clasTopArray = resultJson["values-response"]["distinct-value"]
//
//                     for (var val of clasTopArray) {
//
//                         let obj = {
//                             "name": val["_value"],
//                             //"children": [{"name": "test", "children":[], "loaded":true}],
//                             "children":[],
//                             "loaded": false,
//                             "levelNode": 1
//                         }
//                         TOPIC_TREE.push(obj)
//                     }
//                     console.log(TOPIC_TREE)
//                     this.dataSource.data = TOPIC_TREE;
//                 },
//                 error => {
//                   console.log(error);
//                 },
//                 () => {
//                   console.log("complete")
//
//                 });
//     }
//
//     findDatasets(topClas: string, loaded: string) {
//         console.log(loaded)
//         console.log(topClas, loaded)
//         if (!loaded) {
//             this.odesiService.find("topcClas:" + topClas + "&options=odesi-opts2&format=json").subscribe(
//                 data => {
//                     console.log(data)
//                     let topicFoundIndex = TOPIC_TREE.findIndex(x => x.name === topClas)
//                     console.log(topicFoundIndex)
//                     let resultJson = JSON.parse(JSON.stringify(data));
//                     let datasetsArray = resultJson["results"]
//                     if (typeof (topicFoundIndex) !== 'undefined') {
//                         console.log("Show results");
//                         console.log(datasetsArray);
//                         var children = [];
//                         for (var el of datasetsArray) {
//                             var child: Topic = {
//                                 "name": el["uri"],
//                                 "children": [],
//                                 "loaded": true,
//                                 "levelNode": 0
//                             }
//
//                             children.push(child)
//                         }
//                         TOPIC_TREE[topicFoundIndex]["children"] = children
//                         console.log(TOPIC_TREE[topicFoundIndex])
//
//                     }
//
//
//                 },
//                 error => {
//                     console.log(error);
//                 },
//                 () => {
//                     console.log("complete")
//                     this.dataSource.data = TOPIC_TREE;
//                     this.dataSource.data = this.dataSource.data.slice();
//
//                 });
//         }
//
//     }
// }
