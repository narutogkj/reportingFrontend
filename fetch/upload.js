let inputreportName = document.querySelector('#inputreportName');
let upload = document.querySelector('#upload');


let listOfClient = []

axios.get(`${apiuser}`)
    .then((res) => {
        listOfClient = res.data.data;
        listOfClient.map(e => {
            inputreportName.innerHTML += `<option>${e.userName}</option>`;
        })
    });






function Upload() {
    upload.value = 'Wait...'
    var fileUpload = document.getElementById("fileUpload");
    var regex = /^([a-zA-Z0-9\s_\\.\-:])+(.xls|.xlsx)$/;
    if (regex.test(fileUpload.value.toLowerCase())) {
        if (typeof (FileReader) != "undefined") {
            var reader = new FileReader();

            //For Browsers other than IE.
            if (reader.readAsBinaryString) {
                reader.onload = function (e) {
                    ProcessExcel(e.target.result);
                };
                reader.readAsBinaryString(fileUpload.files[0]);
            } else {
                //For IE Browser.
                reader.onload = function (e) {
                    var data = "";
                    var bytes = new Uint8Array(e.target.result);
                    for (var i = 0; i < bytes.byteLength; i++) {
                        data += String.fromCharCode(bytes[i]);
                    }
                    ProcessExcel(data);
                };
                reader.readAsArrayBuffer(fileUpload.files[0]);
            }
        } else {
            alert("This browser does not support HTML5.");
        }
    } else {
        alert("Please upload a valid Excel file.");
    }
};
function ProcessExcel(data) {
    var workbook = XLSX.read(data, {
        type: 'binary'
    });
    var firstSheet = workbook.SheetNames[1];
    var excelRows = XLSX.utils.sheet_to_row_object_array(workbook.Sheets[firstSheet]);
    console.log(excelRows)

    postData(excelRows);

};

function postData(data) {
    axios.post(`${apistl}/${inputreportName.value}`, data).then((response) => {
        window.location.replace(`client.html`)
    }, (error) => {
        console.log(error);
    });
}