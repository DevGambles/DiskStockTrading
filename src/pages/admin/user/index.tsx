import { NextPageContext } from "next";
import { getSession } from "next-auth/react";
import { useRouter } from 'next/router';
import React, { useEffect, useRef, useState } from "react";
import DataTable from "react-data-table-component";
// Import the FontAwesomeIcon component
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import the icons you need
import {
  faPen,
  faTrashAlt
} from "@fortawesome/free-solid-svg-icons";

const FilterComponent = ({
  filterText,
  onFilter,
  onClear
}: {
  filterText: string;
  onFilter: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onClear: () => void;
}) => (
  <div style={{ display: "flex" }}>
    <input
      className="textfield"
      id="search"
      type="text"
      placeholder="Filter By User Name"
      aria-label="Search Input"
      value={filterText}
      onChange={onFilter}
    />
    <button className="clearbutton" type="button" onClick={onClear}>
      X
    </button>
  </div>
);

const User = () => {

  const router = useRouter();
  const [userData, setUserData] = useState([]);
  const [filterText, setFilterText] = useState("");
  const [resetPaginationToggle, setResetPaginationToggle] = useState(
    false
  );
  
  // filer by name
  const filteredItems = userData.filter(
    (item: any) =>
      (item.name.toLowerCase().includes(filterText.toLowerCase()))
  );

  const customStyles = {
    rows: {
        style: {
        },
    },
    headCells: {
        style: {
            fontWeight: 'bold',
            fontSize: 'medium',
            background: 'rgb(243 244 246 / var(--tw-bg-opacity))'
        },
    },
    cells: {
        style: {
          fontSize: 'medium'
        },
    },
  };

  // datatable columns
  const columns: any = [
    {
      name: "Image",
      selector: (d: any) => d.image,
      sortable: true
    },
    {
      name: "Name",
      selector: (d: any) => d.name,
      sortable: true
    },
    {
      name: "Email",
      selector: (d: any) => d.email,
      sortable: true
    },
    {
      name: "Role",
      selector: (d: any) => d.role,
      sortable: true
    },
    {
      name: "Verified",
      selector: (d: any) => d.verified,
      sortable: true
    },
    {
      name: "Phone",
      selector: (d: any) => d.phone,
      sortable: true
    },
    {
      name: "Action",
      sortable: false,
      selector: "null",
      cell: (d: any) => [
        <FontAwesomeIcon
          className="edit"
          key={d.title}
          icon={faPen}
          onClick={editUser.bind(this, d)}
        ></FontAwesomeIcon>,
        <FontAwesomeIcon
          key="delete"
          className="p-4"
          icon={faTrashAlt}
          onClick={deleteUser.bind(this, d)}
        ></FontAwesomeIcon>
      ]
    },
  ];

  const deleteUser = (d: any) => {
    router.push("/admin/user/delete?id=" + d._id);
  }

  const editUser = (d: any) => {
    router.push("/admin/user/edit?id=" + d._id);
  }

  // get users list
  const getUserData = async () => {
    if (userData?.length == 0) {
      console.log("GetUser" + userData.length);
      const res = await fetch("/api/admin/users", {
        method: "GET",
      });

      const response = await res.json();
      if (response.data.length > 0)
        setUserData(response.data);
    }
  };

  useEffect(() => {
    getUserData();
  }, [])

  // filter components
  const subHeaderComponentMemo = React.useMemo(() => {
    const handleClear = () => {
      if (filterText) {
        setResetPaginationToggle(!resetPaginationToggle);
        setFilterText("");
      }
    };

    return (
      <div style={{
          display: "flex",
          flexWrap: "wrap",
          rowGap: 10,
          columnGap: 10,
          padding: '16px 0px'
        }}>
        <div className="headerdiv">
          <FilterComponent
            onFilter={(e) => {
              setFilterText(e.target.value);
            }}
            onClear={handleClear}
            filterText={filterText}
          />
        </div>
      </div>
    );
  }, [
    filterText,
    resetPaginationToggle,
  ]);

  return (
    <div className="home min-h-screen text-black flex items-center flex-col">
      <section className="w-full">
        <div className="w-full rounded-lg shadow-lg p-4 mb-16">
          <DataTable
            key="dashboard"
            columns={columns}
            data={filteredItems}
            expandableRows={false}
            customStyles={customStyles}
            // sortIcon={<SortIcon />}
            subHeader
            subHeaderComponent={subHeaderComponentMemo}
            // defaultSortAsc={true}
            pagination
            highlightOnHover
          />
        </div>
      </section>
    </div>
  );
}

export default React.memo(User)

export async function getServerSideProps(ctx: NextPageContext) {
  const session = await getSession(ctx);
  return {
    props: {
      session,
    },
  };
}
