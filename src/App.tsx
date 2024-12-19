import  { useEffect, useRef, useState } from "react";
import {
  DataTable,
  DataTableSelectionMultipleChangeEvent,
} from "primereact/datatable";
import { Paginator, PaginatorPageChangeEvent } from "primereact/paginator";
import { OverlayPanel } from 'primereact/overlaypanel';

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
  const [filterCount, updateFilterCount] = useState<{
    start: number;
    count: number;
    visted:Map<number,boolean>
  }>();

const op = useRef<OverlayPanel>(null);

const inputRowsRef = useRef<HTMLInputElement | null>(null);

  //paginations component props...
  const [pgNo, updatepgNo] = useState<number>(0);
  const [rows, setRows] = useState<number>(10); // its for the pagination...

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

  }, [apiData,filterCount?.count]);

  const handlePageChange = (event: PaginatorPageChangeEvent) => {
    console.log("event page ", event.page);
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
    updateSelectedRows( event.value!.map((x) => ({ id: x.id })));
  };

  const handleApplyFilter = (rCount: number) => {  //20
      updateFilterCount({ start: pgNo, count: rCount,visted:
        filterCount?.start == pgNo?filterCount.visted:
        new Map()});
  
  };
  return (
    <main className="text-3xl font-bold w-full min-h-svh bg-[#f5ebe0]  text-black flex flex-col justify-center items-center font-mono ">
      <h1>Advanced Pagination </h1>
      <div className=" mt-3 text-2xl min-w-96 w-11/12 shadow-md shadow-black relative">
      {loading && 
      <div className="absolute z-10 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
      <i className="pi pi-spin pi-spinner" style={{ fontSize: '2.4rem' }}></i>
      </div>}
        <DataTable
          value={loading?[]:apiData}  
          className="border min-w-96 w-full min-h-40 h-[36rem] overflow-y-auto p-4 bg-[#e3d5ca] border-black"
          selectionMode={"multiple"}
          selection={selectedRows!}
          onSelectionChange={handleRowSelection}
          dataKey="id"
          rowHover={true}
        >

          <Column
            selectionMode="multiple"
            headerStyle={{ width: "3rem" }}

          />


          <Column
            field="title"
            header={
              <div className="flex justify-between items-center">
<i className="pi pi-chevron-down me-4 cursor-pointer" style={{ fontSize: '2rem' }}  onClick={(e) => {
  if(op){
    op.current?.toggle(e)
  }
}}>
</i>
<OverlayPanel ref={op}>
      <div className=" w-48 h-28 flex flex-col items-center justify-around bg-[#edede9] p-5">
          <input type="number" placeholder="Enter Number of rows.." className="outline" ref={inputRowsRef} />
          <button className="border bg-white px-4 text-black py-1 " onClick={()=>{
            if(inputRowsRef)
            {
              handleApplyFilter(inputRowsRef.current?.value?+inputRowsRef.current.value:0)
            }
          }}>
            Submit
          </button>

      </div>
            </OverlayPanel>
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
            className="text-[0.9rem] font-normal  cursor-pointer max-w-2xl overflow-hidden"
            body={(rowData) => rowData.inscriptions || "None"}
          ></Column>
          <Column
            field="date_start"
            header="Date start"
            className="text-[0.9rem] font-normal  cursor-pointer"
          ></Column>
          <Column
            field="date_end"
            header="Date end"
            className="text-[0.9rem] font-normal  cursor-pointer "
          ></Column>
        </DataTable>
        <Paginator
          first={pgNo*10}
          rows={rows}
          totalRecords={100}
          onPageChange={handlePageChange}
          className="flex items-center justify-center space-x-3"
        
        />
      </div>

    </main>
  );
};

export default App;
