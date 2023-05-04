"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TongueService = void 0;
class TongueService {
    constructor(knex) {
        this.knex = knex;
    }
    async postTongueImage(form, req) {
        //ToDO
        let json;
        form.parse(req, async (err, fields, files) => {
            if (err) {
                return;
            }
            console.log(files);
            let formData = new FormData();
            let res = await fetch("/detect", { method: "POST", body: formData });
            let json = await res.json();
        });
        return { json };
    }
}
exports.TongueService = TongueService;
