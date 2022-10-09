
const xhr = new XMLHttpRequest();
const divDataArea = document.getElementById('data-area')


// Create the data function
function createEtoroSummary(data) {
    // count of instruments
    let divCountInstruments = document.createElement('div');
    divCountInstruments.innerText = "eToro offers " + data.length + " instruments to invest"
    divCountInstruments.id = "divCountInstruments";
    divDataArea.appendChild(divCountInstruments);

    // unique array of instrument types
    let instTypes = data.map(instTypes => instTypes.InstrumentTypeID)
    let instTypesArray = [];
    instTypesArray.push(instTypes);
    let uniqueInstTypesArray = [...new Set(instTypesArray[0])];
    //console.log(uniqueInstTypesArray)
    
    // count of instrument types
    let divCountInstrumentTypes = document.createElement('div');
    divCountInstrumentTypes.innerText = "in " + uniqueInstTypesArray.length + " instrument types"
    divCountInstrumentTypes.id = "divCountInstrumentTypes";
    divDataArea.appendChild(divCountInstrumentTypes);

    // create an object of Instrument Types
    const instTypeObj = [
        {
            instType: 1,
            instTypeName: "Currencies"
        },
        {
            instType: 2,
            instTypeName: "Commodities"
        },
        {
            instType: 4,
            instTypeName: "Indices"
        },
        {
            instType: 5,
            instTypeName: "Stocks"
        },
        {
            instType: 6,
            instTypeName: "ETFs"
        },
        {
            instType: 10,
            instTypeName: "Crypto currencies"
        },
    ];

    //console.log(instTypeObj[1].instTypeName)
    
    // select the instrument type and show all instruments
    const selectAreaDiv = document.createElement('div');
    selectAreaDiv.id = "selectAreaDiv"
    const selectDiv = document.createElement('div');
    selectDiv.innerText = "Select the instrument type to display all instruments available to invest:"
    selectDiv.id = "selectDiv"
    const selectInstType = document.createElement('select');
    
    for (let i=0; i<instTypeObj.length; i++) {
        const optionInstType = document.createElement('option');
        optionInstType.innerText = instTypeObj[i].instTypeName
        selectInstType.appendChild(optionInstType);
    }

    document.body.appendChild(selectAreaDiv);
    selectAreaDiv.appendChild(selectDiv);
    selectAreaDiv.appendChild(selectInstType);

    
    // display all instruments under specifit instrument type selected
    const showInstrumentListBtn = document.createElement('button');
    showInstrumentListBtn.innerHTML = "Show Instruments"
    showInstrumentListBtn.id = "showInstrumentListBtn"
    selectAreaDiv.appendChild(showInstrumentListBtn);
   
    
        
    selectInstType.addEventListener ('change', function() {
        //alert before choose Stocks
        let checkStocks = selectInstType.options[selectInstType.selectedIndex].value;
            if(checkStocks === "Stocks") {
            alert("this is going to crash!")
            }
    })
    

    showInstrumentListBtn.addEventListener ('click', getInstrumentsBasedOnType);
    

    function getInstrumentsBasedOnType() {
        let selectedInstTypeValue = selectInstType.options[selectInstType.selectedIndex].value;
        // get the instrument display name
        // replace Instrument Type name the user selected to Intrument Type value
        for (let i=0; i<instTypeObj.length; i++) {
            if(instTypeObj[i].instTypeName === selectedInstTypeValue) {
                var instTypeValue = instTypeObj[i].instType                 // the instrument type value the user selcted
            }
        }

        // create listOfInst -- which is an array includes the instrument display name based on the instrument type the user selected
        for (let i=0; i<data.length; i++) {
            if(data[i].InstrumentTypeID === instTypeValue) {
                var listOfInst = data
                .filter(listOfInst => listOfInst.InstrumentTypeID === instTypeValue)
                .map(listOfInst => listOfInst.InstrumentDisplayName)
            }
        }
        const divResults = document.createElement('div');
        divResults.id = "divResults";

        const divCount = document.createElement('div');
        divCount.id = "divCount"
        divCount.innerText = listOfInst.length + " " + selectedInstTypeValue + " available to invest:"

        document.body.appendChild(divResults);
        divResults.appendChild(divCount);

        const tableOfInst = document.createElement('table');

        const trHeader = document.createElement('tr');
        const th1 = document.createElement('th');
        const th2 = document.createElement('th');
        // th1.innerText = "1";
        th2.innerText = "Sort";
        trHeader.appendChild(th1);
        trHeader.appendChild(th2);
        tableOfInst.appendChild(trHeader)

        //get the SymbolFull
        for (let i=0; i<data.length; i++) {
            if(data[i].InstrumentTypeID === instTypeValue) {
                var symbolFull = data
                .filter(symbolFull => symbolFull.InstrumentTypeID === instTypeValue)
                .map(symbolFull => symbolFull.SymbolFull);
            };
        };
    
        //get the images
        let instrumentImageArray = []
        for (let i=0; i<data.length; i++) {
            if(data[i].InstrumentTypeID === instTypeValue) {
                var instrumentImage = Object.values(data[i].Images[0])[3]
                instrumentImageArray.push(instrumentImage)
            }
        }
        
        //create rows in the table based on the user's selection
        for (let i=0; i<listOfInst.length; i++) {
            var tr = document.createElement('tr');
             
            for (let j=0 ; j<data.length ; j++) {
                // create the instrument display name and link
                var aToInst = document.createElement('a');
                aToInst.title = listOfInst[i];
                aToInst.href = "https://www.etoro.com/markets/" + symbolFull[i];
                aToInst.target = "_blank";

                var link = document.createTextNode(listOfInst[i])
                aToInst.appendChild(link)
            
                var tdInstName = document.createElement('td');

                // image of the instument in another cell of the table
                const img = document.createElement('img');
                img.src = instrumentImageArray[i];
                var tdImage = document.createElement('td'); // add image to another td -- breaks the browser!
                tdImage.appendChild(img);
            }

            tr.appendChild(tdImage);
            tdInstName.appendChild(aToInst)
            tr.appendChild(tdInstName);
            tableOfInst.appendChild(tr)
            divResults.appendChild(tableOfInst);

            // console.log(tableOfInst.length)
            // for (let i=0 ; i<tableOfInst.length ; i++) {
            //     table = tableOfInst[i];
            // }
        }
    }    
}



// Get the data from eToro API
xhr.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
        let pardedResponse = JSON.parse(this.responseText);                  // object of the data
        let data = Object.values(pardedResponse)[0]                         // Array of the data
        .filter(countInst => countInst.IsInternalInstrument === false)       //filter to only external instruments
        
        createEtoroSummary(data);
        console.log(data) 
        // console.log(data[1]) // specific instrument
        // console.log(data[1].SymbolFull)
        // console.log(data[1].InstrumentTypeID) // 1 = currency | 2 Commodities |  3 | 4 Indices | 5 Stocks | 10 Crypto
        // console.log(data[1].InstrumentDisplayName)
        // console.log(data[1].IsInternalInstrument) // should be false
        // console.log(Object.values(data[1].Images[0])[3]) // image of specific instrument [1] place
    }
}

// API details
xhr.open('get', 'https://meta.etoro.com/v1.1/instruments.json');
xhr.send();