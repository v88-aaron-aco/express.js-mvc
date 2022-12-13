const Helper = {};

Helper.checkFields = (required_fields, req_body) => {
    let response_data = { status: true, result: {}, error: null };

    try{
        let sanitized_data = {};
        let missing_fields = [];

        for(let index in required_fields){
            let selected_key = required_fields[index];

            if(req_body[selected_key] != undefined && req_body[selected_key] !== ""){
                sanitized_data[selected_key] = req_body[selected_key];
            }
            else{
                missing_fields.push(selected_key);
            }
        }

        if(missing_fields.length){
            response_data.status = false;
            response_data.result = { missing_fields };
            response_data.error  = "There are missing/blank fields."
        }
        else{
            response_data.status = true;
            response_data.result = sanitized_data;
        }
    }
    catch(error){

    }

    return response_data;
}

module.exports = Helper;