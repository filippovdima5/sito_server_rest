"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function projectFields(resDataFields) {
    const project = {
        _id: 0,
        id: "$_id"
    };
    if (resDataFields.find(key => (key === 'id')))
        project.id = '$id';
    resDataFields.forEach(key => {
        project[key] = '$' + key;
    });
    return project;
}
exports.projectFields = projectFields;
