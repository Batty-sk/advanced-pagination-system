import React, { useEffect, useState } from "react";
import {
  DataTable,
  DataTableSelectionMultipleChangeEvent,
  DataTableValueArray,
} from "primereact/datatable";
import { Paginator, PaginatorPageChangeEvent } from "primereact/paginator";
import { Column } from "primereact/column";

interface apiDataInterface {
  id: number;
  title: string;
  place_of_origin: string;
  artist_display: string;
  inscriptions: string | null;
  date_start: number;
  date_end: number;
}

const App = () => {
  const [loading, updateLoading] = useState<boolean>(false);
  const [selectedRows, updateSelectedRows] = useState<{ id: number }[] | null>(
    null
  );
  const [apiData, updateApiData] = useState<apiDataInterface[]>();
  const [pgNo, updatepgNo] = useState<number>(0);
  const [filterCount, updateFilterCount] = useState<{
    start: number;
    count: number;
    visted:Map<number,boolean>
  }>();
  const [filterValue,updateFilterValue] = useState<number>(0)
  const [rows, setRows] = useState<number>(10);

  useEffect(() => {
    updateLoading(true);
    fetch(`https://api.artic.edu/api/v1/artworks?page=${pgNo + 1}`)
      .then((res) => {
        if (res.ok) {
          return res.json();
        }
      })
      .then((data) => {
        console.log("getting data", data);
        updateLoading(false);
        updateApiData(
          data.data.map((x: any) => ({
            id: x.id,
            title: x.title,
            place_of_origin: x.place_of_origin,
            artist_display: x.artist_display,
            inscriptions: x.inscriptions,
            date_start: x.date_start,
            date_end: x.date_end,
          }))
        );
      })
      .catch((error) => {
        console.log("something went wrong.", error);
        alert("Api is not responding! Please Try Again Later.")
        updateLoading(false);
      });
  }, [pgNo]);

  useEffect(() => {
    if (filterCount?.count && pgNo >= filterCount.start) {
      if(filterCount.visted.has(pgNo))
          return
      const diff = (pgNo - filterCount.start) * 12; // 2-1 = 1*12 =12
      console.log("diff", diff,filterCount,pgNo)
      const remainingCount = filterCount.count - diff; //20 - 12 = 8
        console.log("remaining count",remainingCount)
      if (remainingCount > 0 && apiData) {
        const sliceCount = Math.min(remainingCount, 12);
        updateSelectedRows(prev=>[...(prev||[]),...apiData.slice(0, sliceCount).map(x => ({ id: x.id }))]);
        filterCount.visted.set(pgNo,true);
      }
    }
    else{
      console.log('selected selectedRows',selectedRows)
    }
  }, [apiData,filterCount]);

  const onPageChange = (event: PaginatorPageChangeEvent) => {
    console.log("event page ", event.first);
    setRows(event.rows);
    updatepgNo(event.page);
  };
  const handleRowSelection = (
    event: DataTableSelectionMultipleChangeEvent<apiDataInterface[]>
  ) => {
    console.log(
      "map",
      event.value!.map((x) => ({ id: x.id }))
    );
    updateSelectedRows(event.value!.map((x) => ({ id: x.id })));
  };

  const handleApplyFilter = (filterCount: number) => {  //20
      updateFilterCount({ start: pgNo, count: filterCount,visted:new Map() });
  
  };
  return (
    <main className="text-3xl font-bold w-full min-h-svh bg-[#f5ebe0]  text-black flex flex-col justify-center items-center font-mono ">
      <h1>Advanced Pagination </h1>
      <div className=" mt-3 text-2xl min-w-96 w-11/12 shadow-md shadow-black">
        <DataTable
          value={apiData}  
          className="border min-w-96 w-full min-h-40 max-h-96 overflow-y-auto p-4 bg-[#e3d5ca] border-black"
          loading={loading}
          selectionMode={"multiple"}
          selection={selectedRows!}
          onSelectionChange={handleRowSelection}
          dataKey="id"
          rowHover={true}
        >
          <Column
            selectionMode="multiple"
            headerStyle={{ width: "3rem" }}
          ></Column>
          <Column
            field="title"
            header={
              <div className="flex justify-between items-center">
                <span className="me-4">?</span>
                <h3>Title</h3>
              </div>
            }
            className="text-[0.9rem] font-normal  cursor-pointer w-80 overflow-clip "
          ></Column>
          <Column
            field="place_of_origin"
            header="Place"
            className="text-[0.9rem] font-normal  cursor-pointer "
          ></Column>
          <Column
            field="artist_display"
            header="Artist"
            className="text-[0.9rem] font-normal  cursor-pointer "
          ></Column>
          <Column
            field="inscriptions"
            header="Inscriptions"
            className="text-[0.9rem] font-normal  cursor-pointer overflow-clip "
            body={(rowData) => rowData.inscriptions || "None"}
          ></Column>
          <Column
            field="date_start"
            header="Date start"
            className="text-[0.9rem] font-normal  cursor-pointer overflow-clip "
          ></Column>
          <Column
            field="date_end"
            header="Date end"
            className="text-[0.9rem] font-normal  cursor-pointer overflow-clip "
          ></Column>
        </DataTable>
        <Paginator
          first={pgNo}
          rows={rows}
          totalRecords={100}
          onPageChange={onPageChange}
          className="flex items-center justify-center space-x-3"
        />
      </div>

      <input type="number" value={filterValue} onChange={x=>updateFilterValue(+x.currentTarget.value)}/>
      <button onClick={()=>{
        handleApplyFilter(filterValue)
      }} >Apply Filter</button>
    </main>
  );
};

export default App;
