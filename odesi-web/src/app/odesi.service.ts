import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';


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


        //for $i in cts:element-values(xs:QName("topcClas") , "*")
        //return $i
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
