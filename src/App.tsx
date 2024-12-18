import React, { useEffect, useState } from "react";
import { DataTable } from "primereact/datatable";
import { Paginator, PaginatorPageChangeEvent } from 'primereact/paginator';
import { Column } from "primereact/column";
import { Checkbox } from 'primereact/checkbox';


interface apiDataInterface {
  title:string,
  place_of_origin:string, 
  artist_display: string,
  inscriptions:string | null,
  date_start:number,
  date_end:number
}

const App = () => { 
  const [loading,updateLoading] = useState<boolean>(false)
  const [checkedData,updateCheckedData] = useState<Map<number,number>>(new Map())
  const [apiData,updateApiData] = useState<apiDataInterface[]>();
  const [pgNo,updatepgNo]  = useState<number>(0)
  const [rows, setRows] = useState<number>(10);


  useEffect(()=>{
   updateLoading(true)
   fetch(`https://api.artic.edu/api/v1/artworks?page=${pgNo+1}`).then(res=>{
    if(res.ok){
      return res.json()
    }
   })
   .then(data => {console.log('getting data',data);updateLoading(false);updateApiData(data.data)})
   .catch(error=>{console.log("something went wrong.",error); updateLoading(false)})
    

  },[pgNo])


  const onPageChange = (event:PaginatorPageChangeEvent)=>{
    console.log('event page ',event.first)
    setRows(event.rows);
    updatepgNo(event.first)
  }
  return (
    <main className="text-3xl font-bold w-full min-h-svh bg-[#f5ebe0]  text-black flex flex-col justify-center items-center font-mono ">
      <h1>Advanced Pagination </h1>
      <div className=" mt-3 text-2xl min-w-96 w-11/12 shadow-md shadow-black">
      <DataTable
        value={apiData}
         className="border min-w-96 w-full min-h-40 max-h-96 overflow-y-auto p-4 bg-[#e3d5ca]"
         loading={loading}
         rowHover={true}
         
      > 
 //title, place_of_origin, artist_display, inscriptions, date_start, date_end


    <Column field="title" header="Title" className="text-[0.9rem] font-normal hover:bg-[#d5bdaf] cursor-pointer w-80 overflow-clip "></Column>
    <Column field="place_of_origin" header="Place" className="text-[0.9rem] font-normal hover:bg-[#d5bdaf] cursor-pointer "></Column>
    <Column field="artist_display" header="Artist" className="text-[0.9rem] font-normal hover:bg-[#d5bdaf] cursor-pointer overflow-clip "></Column>
    <Column field="inscriptions" header="Inscriptions" className="text-[0.9rem] font-normal hover:bg-[#d5bdaf] cursor-pointer overflow-clip "></Column>
    <Column field="date_start" header="Date start" className="text-[0.9rem] font-normal hover:bg-[#d5bdaf] cursor-pointer overflow-clip "></Column>
    <Column field="date_end" header="Date end" className="text-[0.9rem] font-normal hover:bg-[#d5bdaf] cursor-pointer overflow-clip "></Column>

    </DataTable>
    <Paginator first={pgNo} rows={rows} totalRecords={100} onPageChange={onPageChange} />

    </div>
    </main>
  );
};

export default App;
