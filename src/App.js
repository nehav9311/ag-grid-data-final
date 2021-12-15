import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState
} from "react";
import { render } from "react-dom";
import { AgGridColumn, AgGridReact } from "ag-grid-react";

import "ag-grid-community/dist/styles/ag-grid.css";
import "ag-grid-community/dist/styles/ag-theme-alpine.css";
import { AgAbstractField } from "ag-grid-community";

const GridFunction = () => {
  const [rowCount, setRowCount] = useState("");
  const [colCount, setColCount] = useState("");

  const [RowcountArr, setRowCountArr] = useState([]);
  //const [arr1, setColCountArr] = useState([])
  const [appCount, setAppCount] = useState("");
  const [appCountArray, setAppCountArray] = useState([]);
  const [arr1, setArr1] = useState([]);
  const [dataMapp, setDataMap] = useState([]);
  //const [columns, setColumns] = useState([])
  //const [arrMapp, setArrMapp] = useState([]);
  const [gridApi, setGridApi] = useState(null);
  const [gridColumnApi, setGridColumnApi] = useState(null);
  //const [result, setResult] = useState([])
  const getRowNodeId = (data) => data.id;

  const [showTable, setShowTable] = useState(false);

  const Grid = async () => {
    setShowTable(false);
    console.log("hello");
    let tab = rowCount * appCount;
    for (let i = 1; i <= tab; i++) {
      RowcountArr.push("trial" + i);
    }
    //setRowCountArr(RowcountArr)
    console.log("Row count array", RowcountArr);

    const arr1 = [];
    for (let i = 1; i <= colCount; i++) {
      let x = {};
      let tab = rowCount * appCount;
      console.log("Tab count", tab);
      for (let j = 1; j <= tab; j++) {
        x["trial" + j] = "";
        //console.log("x", x);
      }
      arr1.push(x);
    }
    setArr1(arr1);
    console.log("Array one:", arr1);

    for (let i = 1; i <= appCount; i++) {
      appCountArray.push(i);
    }
    console.log("App count array", appCountArray);

    const dataMapp = RowcountArr.map((v) => ({
      field: v
      // editable: function (params) {
      //   return params.node.data;
      // }
    }));
    console.log("dataMapp : ", dataMapp);
    setDataMap(dataMapp);
    setShowTable(true);
  };

  const newt = () => {
    let rowCount1 = parseInt(rowCount, 10);
    const xx = [];
    gridApi.forEachNode((node) => xx.push(node.data));
    const resultt = xx.map(Object.values);
    //console.log("MAP array", resultt);
    // console.log("Nr", nr)
    let nr1 = resultt[0].map((x, i) => resultt.map((x) => x[i]));
    console.log("Transpose Array", nr1);
    var res = nr1.reduce((resultArray, item, index) => {
      const chunkIndex = Math.floor(index / rowCount1);
      if (!resultArray[chunkIndex]) {
        resultArray[chunkIndex] = [];
      }
      resultArray[chunkIndex].push(item);

      return resultArray;
    }, []);
    console.log("Final Data Array:", res);
  };

  ///console.log("RES", res)

  const setHeaderNames = () => {
    const newColumns = gridApi.getColumnDefs();
    console.log("New columns", newColumns);
    //console.log("Field", newColumns[0].field)
    newColumns.forEach((newColumn, index) => {
      // console.log("Field", newColumn.field)
      //.log("Index", index)
      //if(index >= rowCount ) {
      newColumn.headerName = "Trial " + ((index % rowCount) + 1);
      //}
    });

    // newColumns.forEach((newColumn, index) => {
    //     newColumn.headerName = 'C' + index;
    // });
    setDataMap(newColumns);
  };

  const onGridReady = (params) => {
    setGridApi(params.api);
    setGridColumnApi(params.columnApi);
  };

  const CellEditor = forwardRef((props, ref) => {
    const [value, setValue] = useState(props.value);
    const refInput = useRef(null);

    useEffect(() => {
      setTimeout(() => refInput.current.focus());
    }, []);

    useImperativeHandle(ref, () => {
      return {
        getValue() {
          return value;
        },
        isCancelBeforeStart() {
          return false;
        }
      };
    });

    return (
      <input
        type="number"
        ref={refInput}
        value={value}
        onChange={(event) => setValue(event.target.value)}
        style={{ width: "100%" }}
      />
    );
  });

  return (
    <div>
      <input
        //readOnly
        type="text"
        id="txtrows"
        value={appCount}
        placeholder="Appraiser Count = 1"
        onChange={(e) => setAppCount(e.target.value)}
      />
      <input
        type="text"
        id="txtrows"
        value={colCount}
        placeholder="Set Sample"
        onChange={(e) => setColCount(e.target.value)}
      />
      <input
        type="text"
        id="txtrows"
        value={rowCount}
        placeholder="Set Trial"
        onChange={(e) => setRowCount(e.target.value)}
      />
      <button onClick={Grid}>Create Table</button>
      <button onClick={setHeaderNames}>New columns</button>
      <button onClick={newt}>GET DATA</button>
      {showTable ? (
        <div style={{ height: "200px", width: "1000px", flex: "50%" }}>
          <AgGridReact
            getRowNodeId={getRowNodeId}
            //key={index}
            className="ag-theme-alpine"
            rowData={arr1}
            key={dataMapp.field}
            onGridReady={onGridReady}
            columnDefs={dataMapp}
            frameworkComponents={{
              numericEditor: CellEditor
            }}
            defaultColDef={{
              editable: true,
              sortable: true,
              flex: 1,
              minWidth: 100,
              filter: true

              ///resizable: true
            }}
          />
        </div>
      ) : null}
    </div>
  );
};

export default GridFunction;
