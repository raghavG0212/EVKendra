import axios from "axios";
import {
  Button,
  Label,
  Modal,
  Pagination,
  Select,
  Spinner,
  Table,
  TextInput,
} from "flowbite-react";
import { useEffect, useState } from "react";
import { IoMdAddCircle } from "react-icons/io";
import { FaArrowRightLong } from "react-icons/fa6";
import { MdEdit } from "react-icons/md";
import { GoSearch } from "react-icons/go";
import { GrPowerReset } from "react-icons/gr";
import { toast } from "react-toastify";
import Loader from "../Loader";

export default function AdminVotersManage() {
  const [showFilters, setShowFilters] = useState(false);
  const [loading, setLoading] = useState(false);
  const [voters, setVoters] = useState([]);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [voterToEdit, setVoterToEdit] = useState(null);
  const [name, setName] = useState("");
  const [dob, setDob] = useState("");
  const [phoneNo, setPhoneNo] = useState("");
  const [aadharNo, setAadharNo] = useState("");
  const [nationality, setNationality] = useState("");
  const [nationalityFilter, setNationalityFilter] = useState("Any");
  const [ageFilter, setAgeFilter] = useState("Any");
  const [createdAtFilter, setCreatedAtFilter] = useState("Any");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const votersPerPage = 10;

  useEffect(() => {
    const fetchVoters = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`api/v1/voter/getAll`);
        setVoters(response.data);
      } catch (err) {
        toast.error("Failed to load voter data.");
      } finally {
        setLoading(false);
      }
    };
    fetchVoters();
  }, []);

  const filteredVoters = voters.filter((voter) => {
    const dob = new Date(voter.dob);
    const createdAt = new Date(voter.createdAt);

    if (nationalityFilter !== "Any" && voter.nationality !== nationalityFilter)
      return false;

    if (ageFilter !== "Any") {
      const age = Math.floor(
        (new Date() - dob) / (365.25 * 24 * 60 * 60 * 1000)
      );
      if (ageFilter === "18-30" && (age < 18 || age > 30)) return false;
      if (ageFilter === "31-60" && (age < 31 || age > 60)) return false;
      if (ageFilter === "60+" && age < 61) return false;
    }
    if (fromDate && new Date(createdAt) < new Date(fromDate)) return false;
    if (toDate && new Date(createdAt) > new Date(toDate)) return false;

    const searchTerm = search.toLowerCase();
    const matchesSearch =
      voter.name.toLowerCase().includes(searchTerm) ||
      voter.voterID.toLowerCase().includes(searchTerm);
    if (searchTerm && !matchesSearch) return false;
    return true;
  });

  const totalPages = Math.ceil(filteredVoters.length / votersPerPage);
  const currentVoters = filteredVoters.slice(
    (currentPage - 1) * votersPerPage,
    currentPage * votersPerPage
  );

  const handleVoterUpdate = async (e) => {
    e.preventDefault();
    if (!voterToEdit) return;
    setLoading(true);
    try {
      const response = await axios.put(
        `/api/v1/voter/update-voter/${voterToEdit}`,
        {
          name,
          phoneNo,
          aadharNo,
          nationality,
        }
      );
      const updated = response.data?.filteredVoter;
      setVoters((prev) =>
        prev.map((v) => (v._id === voterToEdit ? updated : v))
      );
      setOpenEditModal(false);
      toast.success("Details Updated successfully.");
    } catch (err) {
      toast.error("Failed to edit details.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="flex-grow cursor-default min-h-screen">
      {/* heading */}
      <div className="flex flex-col">
        <div className="flex flex-col mt-1 mb-2 p-4 bg-slate-300 dark:bg-slate-700 rounded-md ">
          <div className="flex items-center space-x-2">
            <h1 className="text-[24px] font-semibold "> Voter Management</h1>
            <span className="text-[13px] mt-0.5 font-bold py-1 px-2 rounded-lg bg-cyan-500 dark:bg-cyan-600 border-2 border-black">
              {voters.length}
            </span>
          </div>
          <span className="text-blue-600 ml-[1px] text-[15px]">
            Manage voters and their data here. They can't be deleted.{" "}
          </span>
        </div>
        {/* small screen search */}
        <div className={`sm:hidden mt-6 w-[50%] mb-2`}>
          <TextInput
            id="search"
            type="text"
            placeholder="Search Name or Voter ID"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
            icon={GoSearch}
          />
        </div>
        <div className="flex justify-between items-end">
          {/* filter */}
          <div className="flex sm:space-x-10 mt-1 mb-4">
            <div className="flex items-center gap-1">
              <Button
                gradientMonochrome="cyan"
                className={`capitalize sm:px-3 mt-6`}
                onClick={() => {
                  setShowFilters((prev) => !prev);
                }}
              >
                <div className="flex space-x-1 items-center text-nowrap">
                  <h1>Add Filters</h1>
                  <span className="mt-0.5">
                    {showFilters ? <FaArrowRightLong /> : <IoMdAddCircle />}
                  </span>
                </div>
              </Button>
              <Button color="failure" className="mt-6" onClick={()=>{
                setAgeFilter("Any");
                setNationalityFilter("Any");
                setCreatedAtFilter("Any");
                setFromDate("");
                setToDate("");
                setShowFilters(false);
              }}><GrPowerReset /></Button>
            </div>
            <div className="flex flex-col">
              <div
                className={`grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 ml-4 sm:ml-0 gap-2 ${
                  !showFilters && "hidden"
                }`}
              >
                <div>
                  <h1 className="font-semibold">Age</h1>
                  <Select
                    id="age"
                    value={ageFilter}
                    onChange={(e) => {
                      setAgeFilter(e.target.value);
                      setCurrentPage(1);
                    }}
                  >
                    <option value="Any">Any</option>
                    <option value="18-30">18-30</option>
                    <option value="31-60">31-60</option>
                    <option value="60+">60+</option>
                  </Select>
                </div>
                <div>
                  <h1 className="font-semibold">Nationality</h1>
                  <Select
                    id="nationality"
                    value={nationalityFilter}
                    onChange={(e) => {
                      setNationalityFilter(e.target.value);
                      setCurrentPage(1);
                    }}
                  >
                    <option value="Any">Any</option>
                    <option value="Indian">Indian</option>
                    <option value="American">American</option>
                    <option value="British">British</option>
                    <option value="Others">Others</option>
                  </Select>
                </div>
                <div>
                  <h1 className="font-semibold text-nowrap">Joined Period</h1>
                  <Select
                    id="createdAt"
                    value={createdAtFilter}
                    onChange={(e) => {
                      setCreatedAtFilter(e.target.value);
                      if (e.target.value === "Any") {
                        setFromDate("");
                        setToDate("");
                      }
                      setCurrentPage(1);
                    }}
                  >
                    <option>Any</option>
                    <option>Custom</option>
                  </Select>
                </div>
              </div>
              {createdAtFilter === "Custom" && showFilters && (
                <div className="flex gap-4 mt-2">
                  <div>
                    <Label htmlFor="fromDate" value="From" />
                    <TextInput
                      id="fromDate"
                      type="date"
                      value={fromDate}
                      onChange={(e) => setFromDate(e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="toDate" value="To" />
                    <TextInput
                      id="toDate"
                      type="date"
                      value={toDate}
                      onChange={(e) => setToDate(e.target.value)}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
          {/* large-screen search */}
          <div className="hidden sm:block sm:mr-8 xl:mr-0 mb-4 mt-1 w-[30%]">
            <TextInput
              id="search"
              type="text"
              placeholder="Search Name or Voter ID"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setCurrentPage(1);
              }}
              icon={GoSearch}
            />
          </div>
          <div className="hidden xl:flex xl:mr-2 overflow-x-auto sm:justify-center mt-1 mb-4">
            <Pagination
              layout="navigation"
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={(page) => {
                setCurrentPage(page);
                window.scrollTo(0, 0);
              }}
            />
          </div>
        </div>
        {/* content */}
        <Table>
          <Table.Head>
            <Table.HeadCell className="text-nowrap">Full Name</Table.HeadCell>
            <Table.HeadCell className="text-nowrap">Voter ID</Table.HeadCell>
            <Table.HeadCell className="hidden sm:table-cell">
              DOB
            </Table.HeadCell>
            <Table.HeadCell>nationality</Table.HeadCell>
            <Table.HeadCell className="text-nowrap hidden md:table-cell">
              JOINED ON
            </Table.HeadCell>
            <Table.HeadCell className="text-center">Edit</Table.HeadCell>
          </Table.Head>
          <Table.Body className="divide-y">
            {currentVoters.length === 0 ? (
              <tr>
                <td
                  colSpan="6"
                  className="text-center py-6 text-lg font-semibold text-gray-500"
                >
                  No voters available.
                </td>
              </tr>
            ) : (
              currentVoters.map((voter) => (
                <Table.Row key={voter._id}>
                  <Table.Cell className="border-r">
                    <span className="uppercase font-semibold ">
                      {voter.name}
                    </span>
                  </Table.Cell>
                  <Table.Cell className="border-r">{voter.voterID}</Table.Cell>
                  <Table.Cell className="border-r hidden sm:table-cell">
                    {" "}
                    {new Date(voter.dob).toLocaleDateString("en-GB")}
                  </Table.Cell>
                  <Table.Cell className="border-r">
                    {voter.nationality}
                  </Table.Cell>
                  <Table.Cell className="border-r hidden md:table-cell">
                    {new Date(voter.createdAt).toLocaleDateString("en-GB")}{" "}
                  </Table.Cell>
                  <Table.Cell className="text-center">
                    <button
                      onClick={() => {
                        setOpenEditModal(true);
                        setVoterToEdit(voter._id);
                        setName(voter.name);
                        setDob(voter.dob);
                        setPhoneNo(voter.phoneNo);
                        setAadharNo(voter.aadharNo);
                        setNationality(voter.nationality);
                      }}
                    >
                      <MdEdit className="text-lg md:text-xl text-red-500 hover:text-red-600 hover:scale-110" />
                    </button>
                  </Table.Cell>
                </Table.Row>
              ))
            )}
          </Table.Body>
        </Table>
        {/* pagination */}
        <div className="flex overflow-x-auto sm:justify-center my-10">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={(page) => {
              setCurrentPage(page);
              window.scrollTo(0, 0);
            }}
            showIcons
          />
        </div>
      </div>
      <Modal show={openEditModal} onClose={() => setOpenEditModal(false)}>
        <Modal.Header>Edit Voter Details</Modal.Header>
        <Modal.Body>
          <form>
            <div className="my-4">
              <div className="mb-2 block">
                <Label htmlFor="name" value="Full Name" />
              </div>
              <TextInput
                id="name"
                type="text"
                placeholder="Voter Full Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div className="my-4">
              <div className="mb-2 mx-auto flex">
                <Label htmlFor="dob" value="Date of Birth" />
                <span className="mt-0.5 ml-2 text-xs text-red-600">
                  cannot edit
                </span>
              </div>
              <TextInput
                id="dob"
                type="text"
                value={new Date(dob).toLocaleDateString("en-GB")}
                disabled
              />
            </div>
            <div className="my-4">
              <div className="mb-2 block">
                <Label htmlFor="phoneNo" value="Phone No" />
              </div>
              <TextInput
                id="phoneNo"
                type="text"
                placeholder="Phone Number"
                value={phoneNo}
                onChange={(e) => setPhoneNo(e.target.value)}
              />
            </div>
            <div className="my-4">
              <div className="mb-2 block">
                <Label htmlFor="aadharNo" value="Aadhar No" />
              </div>
              <TextInput
                id="aadharNo"
                type="text"
                placeholder="Aadhar Number"
                value={aadharNo}
                onChange={(e) => setAadharNo(e.target.value)}
              />
            </div>
            <div className="my-4">
              <div className="mb-2 block">
                <Label htmlFor="nationality" value="nationality" />
              </div>
              <Select
                id="nationality"
                value={nationality}
                onChange={(e) => setNationality(e.target.value)}
              >
                <option disabled>Select your nationality</option>
                <option value="Indian">Indian</option>
                <option value="American">American</option>
                <option value="British">British</option>
                <option value="Others">Others</option>
              </Select>
            </div>
            <div className="flex mt-10 space-x-3">
              <Button
                type="submit"
                color="success"
                outline
                onClick={handleVoterUpdate}
              >
                {loading ? (
                  <>
                    <Spinner size="sm" />
                    <span className="pl-3">Loading...</span>
                  </>
                ) : (
                  "Update"
                )}
              </Button>
              <Button
                color="failure"
                outline
                onClick={() => setOpenEditModal(false)}
              >
                Cancel
              </Button>
            </div>
          </form>
        </Modal.Body>
      </Modal>
    </div>
  );
}
