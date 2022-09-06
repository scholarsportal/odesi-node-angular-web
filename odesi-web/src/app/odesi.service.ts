import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {concatMap, flatMap, mergeAll, mergeMap} from "rxjs";
import {merge} from "rxjs/internal/operators/merge";


@Injectable({
    providedIn: 'root'
})
export class OdesiService {

    constructor(private http: HttpClient) { }

    private statusUrl = '/api/status';

    // Get the status
    getStatus() {
        return this.http.get(this.statusUrl )
    }

    getTopicClassifications(url:string) {
        const httpOptions = {
            params: {requestURL: encodeURI(url)}}
        return this.http.get("/api/search", httpOptions )
            .pipe(concatMap(obj =>  this.getTopicArray(obj)))



        //for $i in cts:element-values(xs:QName("topcClas") , "*")
        //return $i
    }

    getTopicArray(obj: any) {
        return obj["values-response"]["distinct-value"];
        //console.log(clasTopArray.length)
        // var dataMap = new Map<string, string[]>;
        // for (var val of clasTopArray) {
        //     dataMap.set(val["_value"], [])
        // }
        //return  clasTopArray;
    }

    find(url:string) {
        console.log(url)
        const httpOptions = {
            params: {requestURL: encodeURI(url)}}
        return this.http.get("/api/findDatasets", httpOptions )


        //for $i in cts:element-values(xs:QName("topcClas") , "*")
        //return $i
    }

}
