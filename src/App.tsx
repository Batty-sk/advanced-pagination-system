import React from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";

const App = () => {
  return (
    <main className="text-3xl font-bold min-h-svh bg-[#f5ebe0]  text-black flex flex-col justify-center items-center font-mono ">
      <h1>Advanced Pagination Example </h1>
      <div className=" mt-10 text-2xl shadow-md shadow-black">
      <DataTable
        value={[
          { name: "batman", code: "1001", category: "Indian" },
          { name: "batman", code: "1001", category: "Indian2" },
          { name: "batman", code: "1001", category: "Indian3" },
        ]}
         className="border min-w-96 min-h-40 p-4 bg-[#e3d5ca] "
         columnResizeMode={'expand'}
         loading={true}
         
      > 
    <Column field="code" header="Code" className="text-1xl font-normal"></Column>
    <Column field="name" header="Name" className="text-1xl font-normal"></Column>
    <Column field="category" header="Category" className="text-1xl font-normal"></Column>

    </DataTable>
    </div>
    </main>
  );
};

export default App;
