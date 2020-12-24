let startDateinput = document.querySelector('#startDate');
let endDateinput = document.querySelector('#endDate');
let productlist = document.querySelector('#productlist')
let storelist = document.querySelector('#storelist');
let storeLi = document.querySelector('#storeLi');
let clientNameForTitle = document.querySelector('#clientNameForTitle');
let dashboardLink = document.querySelector('#dashboardLink');
let storeListArray = [];
let listOfProductAndCount = {};
let listOfStore = []
let labelArray = [];
let dataArray = [];
let colorSet = [];
var ctx;
let startDate = 1543602590000;
let endDate = 1543602590000;
let checkBoxStoreCounter = true;
let checkBoxProductCounter = true;
let amountArray = []
let clientName;
//Query Checker
let queryParamsString = (window.location.search).replace('?', '').split("&");
let queryParamsObject = {}
for (i = 0; i < queryParamsString.length; i++) {
    queryParamsObject[queryParamsString[i].split('=')[0]] = queryParamsString[i].split('=')[1]
}

if (queryParamsObject.success == 'true') {
    alert('File Uploaded Successfully')
}

if (queryParamsObject.name) {
    clientName = queryParamsObject.name;
    clientNameForTitle.innerHTML = clientName
    dashboardLink.href = `dashboard.html?name=${clientName}`;
} else {
    window.location.replace(`client.html`)
}

function changeChart(type) {
    let labelArray = JSON.parse(localStorage.getItem('labelArray'))
    let dataArray = JSON.parse(localStorage.getItem('dataArray'))
    let colorSet = JSON.parse(localStorage.getItem('colorSet'))
    myChart.destroy()
    barChart(labelArray, dataArray, colorSet, type)
}

function changeTop5ProductChart(type) {
    let labelArrayForTop5Product = JSON.parse(localStorage.getItem('labelArrayForTop5Product'));
    let dataArrayForTop5Product = JSON.parse(localStorage.getItem('dataArrayForTop5Product'))
    let dataObject = {}; //creating key value pair (object) of labelArray and dataArray
    for (i = 0; i < labelArrayForTop5Product.length; i++) {
        dataObject[labelArrayForTop5Product[i]] = dataArrayForTop5Product[i]
    }
    myChart2.destroy()
    top5ProductChart(dataObject, colorSet, type)
}

function changeAmountProductChart(type) {
    let labelArrayAmountProductChart = JSON.parse(localStorage.getItem('labelArray'));
    let amountArrayAmountProductChart = JSON.parse(localStorage.getItem('amountArray'))
    myChart3.destroy()
    amountProductChart(labelArrayAmountProductChart, amountArrayAmountProductChart, colorSet, type)
}

function changeCountProductChart(type) {
    let labelArray4 = JSON.parse(localStorage.getItem('labelArray'))
    let dataArray4 = JSON.parse(localStorage.getItem('dataArray'))
    myChart4.destroy()
    countProductChart(labelArray4, dataArray4, colorSet, type)
}


//genrate rendom colors for chart
function getRandomColor() {
    var letters = '0123456789ABCDEF'.split('');
    var color = '#';
    for (var i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return (color);
}


//formate date 
function formatDate(date) {
    var d = new Date(date),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

    if (month.length < 2)
        month = '0' + month;
    if (day.length < 2)
        day = '0' + day;

    return [year, month, day].join('-');
}



function displayData(storeListArray, productlistArray) {
    axios.get(`${apistl}/${clientName}`).then((res) => {
        let data = res.data.data
        if (storeListArray) {
            listOfProductAndCount = [];
            labelArray = [];
            colorSet = [];
            dataArray = [];
            ctx = '';
            let count = 0;
            data.map(e => {
                let productDesc = e.Product_Desc
                let Store = e.Store

                if (storeListArray.includes(Store) && parseInt(e.Trans_Date_Time) >= Date.parse(startDateinput.value) && parseInt(e.Trans_Date_Time) <= Date.parse(endDateinput.value)) {
                    if (!listOfProductAndCount.hasOwnProperty(productDesc)) {
                        listOfProductAndCount[productDesc] = 1
                        labelArray.push(productDesc)
                        amountArray.push(e.Unit_Price)
                    } else {
                        listOfProductAndCount[productDesc]++
                    }
                } else {
                    count++;
                }
            })
            console.log(count)
            labelArray.map(e => {
                dataArray.push(listOfProductAndCount[e])
            })
            let newdataArray = [];
            let newProductArray = [];
            for (i = 0; i < labelArray.length; i++) {
                if (productlistArray.includes(labelArray[i])) {
                    newdataArray.push(dataArray[i])
                    newProductArray.push(labelArray[i])
                    colorSet.push(getRandomColor())
                }
            }
            localStorage.setItem('startDate', JSON.stringify(Date.parse(startDateinput.value)))
            localStorage.setItem('endDate', JSON.stringify(Date.parse(endDateinput.value)))
            localStorage.setItem('storelist', JSON.stringify(storeListArray))
            localStorage.setItem('labelArray', JSON.stringify(newProductArray))
            localStorage.setItem('dataArray', JSON.stringify(newdataArray))
            localStorage.setItem('colorSet', JSON.stringify(colorSet))






            dataObject = {}; //creating key value pair (object) of labelArray and dataArray
            for (i = 0; i < newProductArray.length; i++) {
                dataObject[newProductArray[i]] = newdataArray[i]
            }
            updateChart(newProductArray, newdataArray, colorSet);
            updateTop5ProductChart(dataObject, colorSet)
            updateAmountProductChart(newProductArray, amountArray, colorSet);
            updateCountProductChart(newProductArray, newdataArray, colorSet)
        } else {
            data.map(e => {
                let productDesc = e.Product_Desc
                let Store = e.Store
                if (startDate > e.Trans_Date_Time) startDate = e.Trans_Date_Time;
                if (endDate < e.Trans_Date_Time) endDate = e.Trans_Date_Time;
                if (!listOfStore.includes(Store)) {
                    listOfStore.push(Store)
                    storelist.innerHTML += `<li class="list-group-item">
                                            <input type="checkbox" class="form-check-input" name="storeList" id='${Store.replace(" ", "-")}'>
                                                <span class="listElement" onclick="storeEvent('${Store.replace(" ", "-")}')">${Store}</span>
                                            </input>
                                        </li>`;
                }

                if (!listOfProductAndCount.hasOwnProperty(productDesc)) {
                    listOfProductAndCount[productDesc] = 1
                    labelArray.push(productDesc)
                    amountArray.push(e.Unit_Price)
                    colorSet.push(getRandomColor())
                } else {
                    listOfProductAndCount[productDesc]++
                }
            })
            labelArray.map(e => {
                dataArray.push(listOfProductAndCount[e])
                productlist.innerHTML += `<li class="list-group-item">
            <input type="checkbox" name="productListcheckBox" class="form-check-input" id='${e.replace(" ", "-")}'>
                <span class="listElement" onclick="productEvent('${e.replace(" ", "-")}')" >${e}</span>
            </li>`;
            })
            startDateinput.value = formatDate(parseInt(startDate));
            endDateinput.value = formatDate(parseInt(endDate) + 86400000);

            localStorage.setItem('startDate', startDate)
            localStorage.setItem('endDate', JSON.stringify(parseInt(endDate) + 86400000))
            localStorage.setItem('storelist', JSON.stringify(listOfStore))
            localStorage.setItem('labelArray', JSON.stringify(labelArray))
            localStorage.setItem('dataArray', JSON.stringify(dataArray))
            localStorage.setItem('colorSet', JSON.stringify(colorSet))
            barChart(labelArray, dataArray, colorSet, 'bar')

            dataObject = {}; //creating key value pair (object) of labelArray and dataArray
            for (i = 0; i < labelArray.length; i++) {
                dataObject[labelArray[i]] = dataArray[i]
            }

            top5ProductChart(dataObject, colorSet, 'doughnut');
            amountProductChart(labelArray, amountArray, colorSet, 'horizontalBar')
            countProductChart(labelArray, dataArray, colorSet, 'line')
        }
    })
}







function updateChart(newProductArray, newdataArray, colorSet) {
    myChart.data.labels = newProductArray;
    myChart.data.datasets[0].data = newdataArray;
    myChart.data.datasets[0].backgroundColor = colorSet
    myChart.update();
}

function updateTop5ProductChart(dataObject, colorSet) {
    let sortable = Object.fromEntries(
        Object.entries(dataObject).sort(([, a], [, b]) => b - a)
    );

    localStorage.setItem('labelArrayForTop5Product', JSON.stringify(Object.keys(sortable).slice(0, 5)))
    localStorage.setItem('dataArrayForTop5Product', JSON.stringify(Object.values(sortable).slice(0, 5)))



    myChart2.data.labels = Object.keys(sortable).slice(0, 5);
    myChart2.data.datasets[0].data = Object.values(sortable).slice(0, 5);
    myChart2.data.datasets[0].backgroundColor = colorSet.slice(0, 5);
    myChart2.update();
}

function updateAmountProductChart(newProductArray, amountArray, colorSet) {

    localStorage.setItem('amountArray', JSON.stringify(amountArray))
    myChart3.data.labels = newProductArray;
    myChart3.data.datasets[0].data = amountArray;
    myChart3.data.datasets[0].backgroundColor = colorSet;
    myChart3.update();

}

function updateCountProductChart(newProductArray4, newdataArray4, colorSet4) {
    myChart4.data.labels = newProductArray4;
    myChart4.data.datasets[0].data = newdataArray4;
    myChart4.data.datasets[0].backgroundColor = colorSet4
    myChart4.update();
}







function barChart(labelArray, dataArray, colorSet, charType) {
    ctx = document.getElementById('myChart1').getContext('2d');
    myChart = new Chart(ctx, {
        type: charType,
        data: {
            labels: labelArray,
            datasets: [{
                label: 'Sales Trend',
                data: dataArray,
                backgroundColor: colorSet
            }]
        },
        options: {
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero: true
                    }
                }]
            }
        }
    });
}

function top5ProductChart(dataObject, colorSet, charType) {
    let sortable = Object.fromEntries(
        Object.entries(dataObject).sort(([, a], [, b]) => b - a)
    );
    labelArray2 = Object.keys(sortable)
    dataArray2 = Object.values(sortable)

    ctx = document.getElementById('myChart2').getContext('2d');
    myChart2 = new Chart(ctx, {
        type: charType,
        data: {
            labels: labelArray2.slice(0, 5),
            datasets: [{
                label: 'Top 5 Product List',
                data: dataArray2.slice(0, 5),
                backgroundColor: colorSet
            }]
        },
        options: {
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero: true
                    }
                }]
            }
        }
    });
}

function amountProductChart(labelArray3, amountArray3, colorSet, charType) {

    localStorage.setItem('amountArray', JSON.stringify(amountArray3))
    ctx = document.getElementById('myChart3').getContext('2d');
    myChart3 = new Chart(ctx, {
        type: charType,
        data: {
            labels: labelArray3,
            datasets: [{
                label: 'Product Amount List',
                data: amountArray3,
                backgroundColor: colorSet
            }]
        },
        options: {
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero: true
                    }
                }]
            }
        }
    });
}

function countProductChart(labelArray, dataArray, colorSet, charType) {
    ctx = document.getElementById('myChart4').getContext('2d');
    myChart4 = new Chart(ctx, {
        type: charType,
        data: {
            labels: labelArray,
            datasets: [{
                label: 'Product Count',
                data: dataArray,
                backgroundColor: colorSet
            }]
        },
        options: {
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero: true
                    }
                }]
            }
        }
    });
}






function filterButton() {
    storeListArray = [];
    productlistArray = [];
    var checkboxes1 = document.getElementsByName('productListcheckBox');
    for (var checkbox1 of checkboxes1) {
        if (checkbox1.checked) {
            productlistArray.push(checkbox1.id.replace('-', ' '));
        }
    }
    var checkboxes = document.getElementsByName('storeList');
    for (var checkbox of checkboxes) {
        let checkBoxId = checkbox.id
        if (checkbox.checked) storeListArray.push(checkBoxId.replace('-', ' '))
    }
    displayData(storeListArray, productlistArray)
}

function selectAllProduct() {
    var checkboxes1 = document.getElementsByName('productListcheckBox');
    for (var checkbox1 of checkboxes1) {
        checkbox1.checked = checkBoxProductCounter
    }
    checkBoxProductCounter = !checkBoxProductCounter
}

function selectAllStore() {
    var checkboxes1 = document.getElementsByName('storeList');
    for (var checkbox1 of checkboxes1) {
        checkbox1.checked = checkBoxStoreCounter
    }
    checkBoxStoreCounter = !checkBoxStoreCounter
}


let storeChecked = false
function storeEvent(store) {
    document.getElementById(store).checked = !storeChecked
    storeChecked = !storeChecked

}

let productChecked = false
function productEvent(product) {
    document.getElementById(product).checked = !productChecked
    productChecked = !productChecked
}

function dateRange(value) {
    if (value == 'alldate') {
        startDateinput.value = formatDate(parseInt(startDate));
        endDateinput.value = formatDate(parseInt(endDate) + 86400000);
    } else if (value == 'today') {
        startDateinput.value = formatDate(parseInt(Date.now() - 86400000));
        endDateinput.value = formatDate(parseInt(Date.now()))
    } else if (value == 'thisweek') {
        startDateinput.value = formatDate(parseInt(Date.now() - 7 * 86400000));
        endDateinput.value = formatDate(parseInt(Date.now()))
    } else if (value == 'thismonth') {
        startDateinput.value = formatDate(parseInt(Date.now() - 30 * 86400000));
        endDateinput.value = formatDate(parseInt(Date.now()))
    } else if (value == 'thisquarter') {
        startDateinput.value = formatDate(parseInt(Date.now() - 4 * 30 * 86400000));
        endDateinput.value = formatDate(parseInt(Date.now()))
    } else if (value == 'thisyear') {
        startDateinput.value = formatDate(parseInt(Date.now() - 12 * 30 * 86400000));
        endDateinput.value = formatDate(parseInt(Date.now()))
    } else if (value == 'previousday') {
        startDateinput.value = formatDate(parseInt(Date.now() - 2 * 86400000));
        endDateinput.value = formatDate(parseInt(Date.now() - 86400000))
    } else if (value == 'previousweek') {
        startDateinput.value = formatDate(parseInt(Date.now() - 2 * 7 * 86400000));
        endDateinput.value = formatDate(parseInt(Date.now() - 7 * 86400000))
    } else if (value == 'previousmonth') {
        startDateinput.value = formatDate(parseInt(Date.now() - 2 * 30 * 86400000));
        endDateinput.value = formatDate(parseInt(Date.now() - 30 * 86400000))
    } else if (value == 'previousquarter') {
        startDateinput.value = formatDate(parseInt(Date.now() - 2 * 4 * 30 * 86400000));
        endDateinput.value = formatDate(parseInt(Date.now() - 4 * 30 * 86400000))
    } else if (value == 'previousyear') {
        startDateinput.value = formatDate(parseInt(Date.now() - 2 * 12 * 30 * 86400000));
        endDateinput.value = formatDate(parseInt(Date.now() - 12 * 30 * 86400000))
    } else {
        startDateinput.value = formatDate(Date.parse(value) - 86400000)
        endDateinput.value = formatDate(Date.parse(value) + 86400000)
    }

}




displayData(undefined, undefined);